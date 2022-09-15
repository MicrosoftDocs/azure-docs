---
title: Overview of CSPM
description: 
ms.topic: conceptual
ms.date: 09/14/2022
---

# Cloud Security Posture Management (CSPM)

One of Microsoft Defender for Cloud's main pillars for cloud security is Cloud Security Posture Management (CSPM). CSPM provides you with hardening guidance that helps you efficiently and effectively improve your security. CSPM also gives you visibility into your current security situation.

Defender for Cloud continually assesses your resources, subscriptions, and organization for security issues and shows your security posture in secure score, an aggregated score of the security findings that tells you, at a glance, your current security situation: the higher the score, the lower the identified risk level.

## Defender for CSPM plan options

The Defender for CSPM plan comes with two options, CSPM (free) and CSPM Premium. When you deploy Defender for Cloud to your subscription and resources you will automatically gain the basic coverages offered by the CSPM plan. To gain access to the additional capabilities provided by Defender for CSPM, you will need to [enable the CSPM premium plan](enable-enhanced-security.md) to your subscription and resources.

The following table summarizes what's included in each plan and their cloud availability.

| Feature | Details | Defender for CSPM | Defender for CSPM Premium | Cloud availability |
|--|--|--|--|--|
| [Security Governance](#security-governance) | | | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, On-Premises |
| [Cloud Security Graph](#cloud-security-graph) | | | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Attack Path Analysis](#attack-path-analysis) | | | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Regulatory compliance](#regulatory-compliance) | | | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, On-Premises |
| [Agentless scanning for machines](#agentless-scanning-for-machines) | | | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |

> [!NOTE]
> If you have enabled Defender for DevOps, you will only gain Cloud Security Graph and Attack Path Analysis to the artifacts that arrive through those connectors. 
>
> To enable Governance for for DevOps related recommendations, the CSPM premium plan needs to be enabled on the Azure subscription that hosts the DevOps connector.

## Security Governance

## Cloud Security Graph

The Cloud Security Graph is a graph-based context engine that exists within Defender for Cloud. The Cloud Security Graph collects data from your multicloud environment and other data sources. For example, the cloud assets inventory, connections and lateral movement possibilities between resources, exposure to internet, permissions, network connections, vulnerabilities and more. The data collected is then used to build a graph representing your multicloud environment.

Defender for Cloud then uses the generated graph to perform an Attack Path Analysis and find the issues with the highest risk that exist within your environment. You can also query the graph using the Cloud Security Explorer.

## Attack Path Analysis

Attack Path Analysis is a graph-based algorithm that scans the Cloud Security Graph. The scans expose exploitable paths that attackers may use to breach your environment to reach your high-impact assets. Attack Path Analysis exposes those attack paths and suggests recommendations as to how best remediate the issues that will break the attack path and prevent successful breach.

By taking your environment's contextual information into account such as, internet exposure, permissions, lateral movement, and more. Attack Path Analysis identifies issues that may lead to a breach on your environment, and helps you to remediate the highest risk ones first.

## Regulatory compliance

## Agentless scanning for machines 

## Next steps



