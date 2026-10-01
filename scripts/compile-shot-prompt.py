#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import json
import argparse

sys.stdout.reconfigure(encoding='utf-8')

EMOTION_MAP = {
    '紧张': {
        'camera': '克制的近距离观察；短推近或轻微手持跟随，镜头运动由主体动作触发，不做随机晃动',
        'lighting': '低调侧光或局部方向光，保留暗部阴影层次；强光照脸时有生理性避光微反应',
        'performance': '先视线与呼吸变化，再发生肢体动作；手部出现受阻微颤或关节紧握，下眼睑收紧',
        'sound': '急促压抑的呼吸声、脚步踩入湿泥声、衣物剧烈摩擦紧绷声，流水环境底噪持续'
    },
    '压抑': {
        'camera': '构图留出大量负空间，人物在环境中偏小或被前景建筑/枝叶部分遮挡；平视或微俯拍',
        'lighting': '低反差环境冷色光，阴天或黄昏漫反射，避免无来源的戏剧轮廓光',
        'performance': '动作幅度极小，停顿长于动作本身，肩颈微耸，吞咽口水与视线低垂',
        'sound': '空旷空间残响、低沉风声、远处水流声，无突兀尖锐音效'
    },
    '孤独': {
        'camera': '大空间大全景，长焦空间压缩或广角辽阔延伸，缓慢平移或缓慢拉远',
        'lighting': '柔和低对比度黄昏金光或蓝调时刻，单向微弱光源',
        'performance': '视线聚焦于远处虚无，步伐均匀沉重，肢体姿势保持防御性内收',
        'sound': '单调风声、脚步摩擦地面沙土声、衣角随风翻动声'
    },
    '冲突/动作': {
        'camera': '中景或中全景跟拍，低机位仰拍增强冲击力；快门速度高，运动模糊真实克制',
        'lighting': '高对比硬光，明暗交界清晰，强调肌肉线条与物体边缘高光',
        'performance': '重心迅速转移，冲刺与跳跃遵循重力与惯性，落地屈膝缓冲并扬起灰尘/泥水',
        'sound': '重力撞击声、剧烈鞋底滑移摩擦、关节受力声、急促剧烈换气声'
    }
}

def compile_shot(character, scene, genre, emotion, camera_technique, duration=6, model='kling'):
    emo = EMOTION_MAP.get(emotion, EMOTION_MAP['紧张'])
    
    # Kling 3.0 adapter with native audio
    kling_prompt = (
        f'A restrained {camera_technique}. {character} is situated at {scene}. '
        f'{emo["performance"]}. {emo["camera"]}. '
        f'{emo["lighting"]}. Preserve physical momentum, surface contact and weight balance. '
        f'No cuts, no zooms, no morphing, no artificial distortion. '
        f'Synced natural audio: {emo["sound"]}. No music, no background score.'
    )
    
    # Seedance 2.5 adapter (English structure with spatial locks)
    seedance_prompt = (
        f'[{character} at {scene}] | [Camera: {camera_technique}, steady physical support] | '
        f'[Lighting: natural motivated illumination, atmospheric depth] | '
        f'[Action: {emo["performance"]}, realistic contact friction and momentum decay] | '
        f'[Sound: {emo["sound"]}]'
    )
    
    # MiniMax H3 adapter (Visual verbs & segmented beats)
    h3_prompt = (
        f'[Shot 1] {character} at {scene}. {camera_technique}. '
        f'Physical motion: {emo["performance"]}. '
        f'Environmental lighting and shadow: {emo["lighting"]}.'
    )
    
    return {
        'character': character,
        'scene': scene,
        'genre': genre,
        'emotion': emotion,
        'camera_technique': camera_technique,
        'duration': duration,
        'prompts': {
            'kling-video-v3_0': kling_prompt,
            'seedance-2.5': seedance_prompt,
            'minimax-h3': h3_prompt
        }
    }

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Compile director brief into multi-model prompts')
    parser.add_argument('--character', default='Lin Zhi holding the trembling boy')
    parser.add_argument('--scene', default='wet dirt slope beside stone bridge at dusk')
    parser.add_argument('--genre', default='drama')
    parser.add_argument('--emotion', default='紧张')
    parser.add_argument('--technique', default='medium two-shot with subtle physical push-in')
    parser.add_argument('--duration', type=int, default=6)
    args = parser.parse_args()
    
    res = compile_shot(args.character, args.scene, args.genre, args.emotion, args.technique, args.duration)
    print(json.dumps(res, indent=2, ensure_ascii=False))
