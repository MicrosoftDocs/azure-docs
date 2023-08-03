---
title: Use customizable anomalies to detect threats in Microsoft Sentinel | Microsoft Docs
description: This article explains how to use the new customizable anomaly detection capabilities in Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 11/02/2022
ms.author: yelevin
---

# Use customizable anomalies to detect threats in Microsoft Sentinel

## What are customizable anomalies?

With attackers and defenders constantly fighting for advantage in the cybersecurity arms race, attackers are always finding ways to evade detection. Inevitably, though, attacks will still result in unusual behavior in the systems being attacked. Microsoft Sentinel's customizable, machine learning-based anomalies can identify this behavior with analytics rule templates that can be put to work right out of the box. While anomalies don't necessarily indicate malicious or even suspicious behavior by themselves, they can be used to improve detections, investigations, and threat hunting:

- **Additional signals to improve detection**: Security analysts can use anomalies to detect new threats and make existing detections more effective. A single anomaly is not a strong signal of malicious behavior, but when combined with several anomalies that occur at different points on the kill chain, their cumulative effect is much stronger. Security analysts can enhance existing detections as well by making the unusual behavior identified by anomalies a condition for alerts to be fired.

- **Evidence during investigations**: Security analysts also can use anomalies during investigations to help confirm a breach, find new paths for investigating it, and assess its potential impact. These efficiencies reduce the time security analysts spend on investigations.

- **The start of proactive threat hunts**: Threat hunters can use anomalies as context to help determine whether their queries have uncovered suspicious behavior. When the behavior is suspicious, the anomalies also point toward potential paths for further hunting. These clues provided by anomalies reduce both the time to detect a threat and its chance to cause harm.

Anomalies can be powerful tools, but they are notoriously very noisy. They typically require a lot of tedious tuning for specific environments or complex post-processing. Microsoft Sentinel customizable anomaly templates are tuned by our data science team to provide out-of-the box value, but should you need to tune them further, the process is simple and requires no knowledge of machine learning. The thresholds and parameters for many of the anomalies can be configured and fine-tuned through the already familiar analytics rule user interface. The performance of the original threshold and parameters can be compared to the new ones within the interface and further tuned as necessary during a testing, or flighting, phase. Once the anomaly meets the performance objectives, the anomaly with the new threshold or parameters can be promoted to production with the click of a button. Microsoft Sentinel customizable anomalies enable you to get the benefit of anomalies without the hard work.

## UEBA anomalies

Some of the anomalies detected by Microsoft Sentinel come from its [User and Entity Behavior Analytics (UEBA) engine](identify-threats-with-entity-behavior-analytics.md), which detects anomalies based on dynamic baselines created for each entity across various data inputs. Each entity's baseline behavior is set according to its own historical activities, those of its peers, and those of the organization as a whole. Anomalies can be triggered by the correlation of different attributes such as action type, geo-location, device, resource, ISP, and more.

## Next steps

In this document, you learned how to take advantage of customizable anomalies in Microsoft Sentinel.

- Learn how to [view, create, manage, and fine-tune anomaly rules](work-with-anomaly-rules.md).
- Learn about [User and Entity Behavior Analytics (UEBA)](identify-threats-with-entity-behavior-analytics.md).
- See the list of [currently supported anomalies](anomalies-reference.md).
- Learn about [other types of analytics rules](detect-threats-built-in.md).
