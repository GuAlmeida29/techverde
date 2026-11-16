import json, re, subprocess, time, sys, os
from playwright.sync_api import sync_playwright
ROOT="/home/claude/w/TechVerde"
srv=subprocess.Popen(["python3","-m","http.server","8765","--directory",ROOT],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
B="http://localhost:8765/"; PAGES=["index","sobre","projetos","impacto","acessibilidade","galeria","midia","noticias","contato","orcamento_hospedagem"]
res=[]; ok=lambda n,c,extra="": (res.append((n,c,extra)), print(("PASS " if c else "FAIL ")+n+(" -> "+str(extra) if extra and not c else "")))
axe=open("node_modules/axe-core/axe.min.js").read()
with sync_playwright() as p:
    br=p.chromium.launch(); ctx=br.new_context(viewport={"width":1440,"height":900},locale="pt-BR"); pg=ctx.new_page()
    errs=[]; bad=[]
    pg.on("console",lambda m: errs.append((pg.url,m.text)) if m.type=="error" else None)
    pg.on("pageerror",lambda e: errs.append((pg.url,str(e))))
    pg.on("response",lambda r: bad.append((r.url,r.status)) if r.status>=400 else None)
    # 1) carrega todas, links internos
    links=set()
    for n in PAGES:
        pg.goto(B+n+".html"); pg.wait_for_load_state("networkidle")
        for h in pg.eval_on_selector_all("a[href]","els=>els.map(e=>e.getAttribute('href'))"): 
            if not h.startswith(("http","mailto","#")): links.add(h)
    errs=[e for e in errs if "ERR_NAME_NOT_RESOLVED" not in e[1]]; ok("sem erros de console/404 nas 10 páginas (exceto rede externa offline)", not errs and not bad, (errs[:3],bad[:3]))
    broken=[]
    for h in sorted(links):
        path=h.split("#")[0].split("?")[0]
        if path and not os.path.exists(f"{ROOT}/{path}"): broken.append(h)
        if "#" in h:
            frag=h.split("#")[1]; tgt=path or "index.html"
            if tgt.endswith(".html") and f'id="{frag}"' not in open(f"{ROOT}/{tgt}",encoding="utf-8").read(): broken.append(h)
    ok(f"links internos válidos ({len(links)} distintos)", not broken, broken)
    # 2) formulário
    pg.goto(B+"contato.html"); pg.wait_for_load_state("networkidle")
    pg.click("button[type=submit]")
    ok("envio vazio mostra erros e borda vermelha", pg.locator(".form .invalid").count()==6 and "obrigat" not in "" and pg.locator("#erro-nome").inner_text()!="", pg.locator(".form .invalid").count())
    ok("foco vai ao primeiro campo inválido", pg.evaluate("document.activeElement.id")=="nome")
    ok("mensagem-resumo de erro", "Corrija" in pg.locator("#form-status").inner_text())
    pg.fill("#nome","Maria Souza"); pg.fill("#email","maria@x.com")
    pg.reload(); pg.wait_for_load_state("networkidle")
    ok("rascunho restaurado do localStorage após recarregar", pg.input_value("#nome")=="Maria Souza" and pg.input_value("#email")=="maria@x.com")
    pg.fill("#telefone","11999999999"); pg.fill("#data","2026-11-20"); pg.select_option("#assunto","Voluntariado"); pg.fill("#mensagem","Quero ajudar nas oficinas de reparo.")
    pg.click("button[type=submit]")
    ok("envio válido mostra sucesso", pg.locator(".form .invalid").count()==0 and "validada" in pg.locator("#form-status").inner_text(), pg.locator("#form-status").inner_text())
    ok("rascunho limpo após sucesso", pg.evaluate("localStorage.getItem('techverde:rascunho-contato')") is None)
    pg.fill("#nome","a"); pg.click("#limpar-rascunho"); ok("apagar rascunho limpa campos", pg.input_value("#nome")=="")
    pg.goto(B+"contato.html?assunto=Doa%C3%A7%C3%A3o%20de%20equipamentos"); ok("assunto pré-selecionado pela URL", pg.input_value("#assunto")=="Doação de equipamentos")
    # 3) contraste persistente
    pg.goto(B+"index.html"); pg.click(".contrast-toggle"); pg.goto(B+"sobre.html")
    ok("alto contraste persiste entre páginas", pg.evaluate("document.documentElement.getAttribute('data-contrast')")=="alto")
    pg.click(".contrast-toggle"); ok("alto contraste desliga", pg.evaluate("document.documentElement.getAttribute('data-contrast')") is None)
    # 4) filtro de notícias
    pg.goto(B+"noticias.html"); pg.click("[data-filtro=consumo]")
    vis=pg.locator("[data-categoria]:visible").count(); ok("filtro de notícias (consumo=2)", vis==2, vis)
    ok("contagem anunciada", "2 notícia" in pg.locator("#contagem-noticias").inner_text())
    pg.click("[data-filtro=todas]"); ok("filtro 'todas' mostra 6", pg.locator("[data-categoria]:visible").count()==6)
    # 5) guia equipamento
    pg.goto(B+"projetos.html"); pg.select_option("#guia-tipo","celular"); pg.check("input[value=defeito]")
    ok("guia mostra resultado", pg.locator("#guia-resultado").is_visible() and "bateria" in pg.locator("#guia-resultado").inner_text().lower())
    pg.reload(); pg.wait_for_load_state("networkidle"); ok("guia recupera última escolha (localStorage)", pg.input_value("#guia-tipo")=="celular" and pg.locator("#guia-resultado").is_visible())
    # 6) EcoBot
    pg.click(".ecobot-toggle"); pg.fill("#ecobot-pergunta","Onde descartar meu celular?"); pg.press("#ecobot-pergunta","Enter")
    ok("EcoBot responde", "ponto de coleta" in pg.locator(".ecobot-msg.bot").last.inner_text().lower())
    pg.keyboard.press("Escape"); ok("Esc fecha EcoBot e devolve foco", pg.locator("#ecobot-painel").is_hidden() and "ecobot-toggle" in pg.evaluate("document.activeElement.className"))
    # 7) teclado
    pg.goto(B+"index.html"); pg.keyboard.press("Tab"); ok("1º Tab = pular para conteúdo", pg.evaluate("document.activeElement.className")=="skip-link")
    # 8) mídia
    pg.goto(B+"midia.html"); d=pg.evaluate("[document.querySelector('video').readyState, document.querySelector('video').duration||0, document.querySelector('audio').readyState]")
    pg.wait_for_timeout(800); d=pg.evaluate("[document.querySelector('video').readyState, document.querySelector('video').duration||0, document.querySelector('audio').readyState]")
    ok("vídeo e áudio carregam metadados", d[0]>=1 and d[1]>10, d)
    ok("iframe presente com título", pg.evaluate("document.querySelector('iframe').title.length>10"))
    # 9) axe (normal e alto contraste, desktop e mobile)
    def audit(page,label):
        page.add_script_tag(content=axe)
        r=page.evaluate("axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']})")
        return [(label,v['id'],v['impact'],len(v['nodes']),v['nodes'][0]['target']) for v in r['violations']]
    allv=[]
    for n in PAGES:
        pg.goto(B+n+".html"); pg.wait_for_load_state("networkidle"); pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'))"); pg.wait_for_timeout(700)
        allv+=audit(pg,n)
    ok("axe-core desktop: 0 violações WCAG A/AA", not [v for v in allv if v[2] in("serious","critical","moderate","minor")] , allv)
    mob=ctx.new_page(); mob.set_viewport_size({"width":390,"height":844}); mv=[]
    for n in PAGES:
        mob.goto(B+n+".html"); mob.wait_for_load_state("networkidle"); mob.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'))"); mob.wait_for_timeout(600)
        sw=mob.evaluate("document.documentElement.scrollWidth>window.innerWidth+1")
        if sw: mv.append((n,"scroll horizontal"))
        mv+=audit(mob,n+"-mobile")
    ok("mobile 390px: sem rolagem lateral e 0 violações axe", not mv, mv)
    # 10) prints
    os.makedirs("/home/claude/gen/prints",exist_ok=True)
    pg.set_viewport_size({"width":1440,"height":900}); pg.goto(B+"index.html"); pg.wait_for_timeout(900); pg.screenshot(path="/home/claude/gen/prints/home-desktop.png")
    mob.goto(B+"index.html"); mob.wait_for_timeout(900); mob.screenshot(path="/home/claude/gen/prints/home-celular.png")
    for n in ["contato","midia","galeria","impacto","projetos"]:
        pg.goto(B+n+".html"); pg.wait_for_load_state("networkidle"); pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'))"); pg.wait_for_timeout(500); pg.screenshot(path=f"/home/claude/gen/prints/{n}.png",full_page=(n!="x"))
    # form com erro
    pg.goto(B+"contato.html"); pg.click("button[type=submit]"); pg.wait_for_timeout(300); pg.screenshot(path="/home/claude/gen/prints/contato-erros.png",full_page=True)
    br.close()
srv.terminate()
print(f"\n{sum(1 for r in res if r[1])}/{len(res)} testes passaram")
