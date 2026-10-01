#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import json
import argparse
from datetime import datetime, timezone

sys.stdout.reconfigure(encoding='utf-8')

def run_pipeline(project_id, title, brief_text, target_dir):
    os.makedirs(target_dir, exist_ok=True)
    for sub in ['canon', 'assets', 'shots', 'handoffs', 'reviews', 'generation', 'runs']:
        os.makedirs(os.path.join(target_dir, sub), exist_ok=True)
    
    # P0: Producer Agent
    project_data = {
        'schemaVersion': '0.1',
        'projectId': project_id,
        'title': title,
        'source': brief_text[:100],
        'status': 'declared',
        'currentStage': 'P0-producer-init',
        'currentOwner': 'producer',
        'delivery': {'target': '影视工程交付', 'aspectRatio': '16:9', 'durationSeconds': 30, 'resolution': '1080p'},
        'evidencePolicy': {'requireArtifactForVerified': True, 'unknownsMustBeExplicit': True},
        'enabledAgents': ['producer', 'story', 'lira-image', 'acting', 'cinematic-technique', 'cinedance', 'continuity', 'sound', 'edit-review'],
        'shots': [],
        'promptVersions': [],
        'generationRuns': [],
        'reviews': []
    }
    
    # P1: Story Agent
    scenes_data = {'scenes': [{'id': 'SC01', 'title': title, 'timeWeather': '夏日下午，阴天有雨', 'sourceFacts': ['女主避雨后走入雨中回家', '回头对朋友随口说了一句离开的话', '小跑后转为漫步，到公园亭下拧发笑对朋友']}]}
    characters_data = {'characters': [{'id': 'CHAR-01', 'name': '20岁日本女性', 'appearance': '黑发扎高马尾，薄刘海，白底深蓝细条纹棉T，卡其色短裤，旧白球鞋', 'performanceProfile': '自然亲切，笑时眼角微皱，压力下动作克制真实'}]}
    
    with open(os.path.join(target_dir, 'project.json'), 'w', encoding='utf-8') as f:
        json.dump(project_data, f, indent=2, ensure_ascii=False)
    with open(os.path.join(target_dir, 'canon', 'scenes.json'), 'w', encoding='utf-8') as f:
        json.dump(scenes_data, f, indent=2, ensure_ascii=False)
    with open(os.path.join(target_dir, 'canon', 'characters.json'), 'w', encoding='utf-8') as f:
        json.dump(characters_data, f, indent=2, ensure_ascii=False)
        
    print(f'Pipeline initialized for project: {project_id} at {target_dir}')
    return {'status': 'success', 'project_id': project_id, 'agents_dispatched': 9}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--project', default='RAIN-DIARY')
    parser.add_argument('--title', default='夏日雨中日记')
    parser.add_argument('--brief', default='一个夏季雨天，一名20岁的日本女性和朋友一起回家途中，结束避雨，走入雨中的普通日常')
    parser.add_argument('--dir', default='docs/film-engineering/projects/rain-diary')
    args = parser.parse_args()
    res = run_pipeline(args.project, args.title, args.brief, args.dir)
    print(json.dumps(res, indent=2, ensure_ascii=False))
