#!/usr/bin/env python3
"""Build: concatenates src/ into a single self-contained page.
   dist/arvand.html  -> body-only page for the Claude artifact
   index.html        -> full HTML document for GitHub Pages"""
import os
R=os.path.dirname(os.path.abspath(__file__))
S=lambda p:open(os.path.join(R,'src',p),encoding='utf-8').read()
ORDER=['engine/util.js','engine/sprites.js','engine/sprites3.js','data/characters.js','engine/core.js',
 'data/events.js','data/events_ch3.js','data/events_people.js','data/letters.js','data/items.js','data/missions.js','data/endings.js',
 'engine/audio.js','engine/hall3.js','engine/scene.js','engine/map.js','engine/ui.js','engine/court.js','engine/council.js','engine/report.js',
 'engine/systems.js','engine/advice.js','engine/siege.js','engine/music.js','engine/meta.js','engine/ending.js']
js='\n'.join(f'/* ---- {p} ---- */\n'+S(p) for p in ORDER if os.path.exists(os.path.join(R,'src',p)))
head='''<title>عرش أرْوَند</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Handjet:wght@400;600;800&family=Noto+Kufi+Arabic:wght@400;600;700&display=swap">
<style>'''+S('style.css')+'</style>\n'
body=S('shell.html')+'\n<script>\n'+js+'\n</script>\n'
os.makedirs(os.path.join(R,'dist'),exist_ok=True)
open(os.path.join(R,'dist','arvand.html'),'w',encoding='utf-8').write(head+body)
open(os.path.join(R,'index.html'),'w',encoding='utf-8').write('<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="description" content="عرش أرْوَند: لعبة إدارة مملكة وقرارات بأسلوب بكسل آرت، من إنتاج استوديو قرطاس.">\n'+head+'</head>\n<body>\n'+body+'</body>\n</html>\n')
print('built',len(head+body)//1024,'KB')
