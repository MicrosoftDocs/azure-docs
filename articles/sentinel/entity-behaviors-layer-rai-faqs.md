---
title: Responsible AI FAQ for the Microsoft Sentinel UEBA behaviors layer
description: This FAQ provides information about the AI technology used in the Microsoft Sentinel UEBA behaviors layer, along with key considerations and details about how AI is used, how it was tested and evaluated, and any specific limitations.  
ms.date: 01/11/2026  
ms.custom:  
  - responsible-ai-faqs  
ms.topic: contributor-guide  
author: guywi-ms  
ms.author: guywild  
ms.reviewer: mschechter  
---

# Responsible AI FAQ for the Microsoft Sentinel UEBA behaviors layer

These frequently asked questions (FAQ) describe the AI impact of the [UEBA behaviors layer](../sentinel/entity-behaviors-layer.md) feature in Microsoft Sentinel.


## What is the UEBA behaviors layer?

The UEBA behaviors layer is an AI-powered capability in Microsoft Sentinel that transforms fragmented raw logs into contextualized behavioral insights that explain "who did what to whom".

- **Inputs:** Raw security logs from sources, such as the AWS CloudTrail and CommonSecurityLog tables.  
- **Outputs:** Structured behavior objects enriched with MITRE ATT&CK mappings, entity roles, and natural language explanations.

## What are the capabilities of the UEBA behaviors layer?

The UEBA behaviors layer provides these key capabilities:
- **Behavior aggregation:** Automatically groups and sequences related security events across multiple data sources. Instead of analysts manually correlating raw logs, the behaviors layer creates unified behavior objects that present "what happened" in a structured way.

- **Contextualization:** Each behavior is enriched with security context, including mapping to MITRE ATT&CK tactics and techniques. This helps analysts understand the intent behind an activity - for example, lateral movement, privilege escalation - without needing deep familiarity with every log format.

- **Explainability:**  Generates natural language summaries of behaviors, making investigations faster and more accessible. Analysts can quickly see what happened and why it matters.

## What is the intended use of the UEBA behaviors layer?

The intended use is to accelerate threat detection and investigation by providing SOC analysts with a unified, AI-driven view of behaviors. It supports:  

- Threat hunting  
- Detection rule authoring at using large language models (LLMs)  
- Incident investigation and triage  


## How was the UEBA behaviors layer evaluated? What metrics are used to measure performance?

Our AI mechanisms generate behavior rules based on samples logs. The behavior rules use aggregation and sequencing of raw logs to reflect the intent and action behind those logs. The rules also provide the security context by mapping the behaviors to MITRE ATT&CK tactics and techniques, so that if the behavior was ill intended, you can understand the security context of that potential attack.

The AI-generated rules are then validated in various ways to ensure that: 
- The intent, action, and entities are accurately captured and explained. 
- The volume of the behaviors this rule generates is above a defined threshold to provide the most value.
- Sensitive data is protected. 

## What are the limitations of the UEBA behaviors layer? How can users minimize the impact?

- **Limited data source coverage:** Currently supports CommonSecurityLogs and AWSCloudTrail.  
- **Dependence on log quality:** Incomplete or noisy logs can reduce accuracy.  
- **Preview feature:** Behavior schema and AI models might evolve.  
**Mitigation:** Ensure high-quality log ingestion, validate AI-generated queries, and use human review for critical detections.


## What operational factors and settings allow for effective and responsible use of the feature?

- **Enable supported connectors** for AWS and CommonSecurityLog sources.  
- **Review AI-generated outputs** before deploying detection rules.  
- **Monitor updates** as the feature expands to new sources and schemas.

## See also

- [Translate raw security logs to behavioral insights using UEBA behaviors in Microsoft Sentinel (Preview)](../sentinel/entity-behaviors-layer.md)  
