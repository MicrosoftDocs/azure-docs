---
title: What are the Cloud Security Graph, Attack Path Analysis, and the Cloud Security Explorer?
titleSuffix: Defender for Cloud
description: Learn how to prioritize remediation of cloud misconfigurations and vulnerabilities based on risk. 
titleSuffix: Defender for Cloud attack path.
ms.topic: conceptual
ms.date: 09/21/2022
---

# What are the Cloud Security Graph, Attack Path Analysis, and the Cloud Security Explorer? 

One of the biggest challenges that security teams face today is the number of security issues they face on a daily basis. There are numerous security issues that need to be resolve and never enough resources to address them all. 

Defender for Cloud's contextual security capabilities assists security teams to assess the risk behind each security issue, and identify the highest risk issues that need to be resolved soonest. Defender for Cloud assists security teams to reduce the risk of an impactful breach to their environment in the most effective way. 

## What is Cloud Security Graph

The Cloud Security Graph is a graph-based context engine that exists within Defender for Cloud. The Cloud Security Graph collects data from your multicloud environment and other data sources. For example, the cloud assets inventory, connections and lateral movement possibilities between resources, exposure to internet, permissions, network connections, vulnerabilities and more. The data collected is then used to build a graph representing your multicloud environment. 

Defender for Cloud then uses the generated graph to perform an Attack Path Analysis and find the issues with the highest risk that exist within your environment. You can also query the graph using the Cloud Security Explorer.  

:::image type="content" source="media/concept-cloud-map/security-map.png" alt-text="Screenshot of a conceptualized graph that shows the complexity of security graphing." lightbox="media/concept-cloud-map/security-map.png":::

## What is Attack Path Analysis

Attack Path Analysis is a graph-based algorithm that scans the Cloud Security Graph. The scans expose exploitable paths that attackers may use to breach your environment to reach your high-impact assets. Attack Path Analysis exposes those attack paths and suggests recommendations as to how best remediate the issues that will break the attack path and prevent successful breach. 

By taking your environment's contextual information into account such as, internet exposure, permissions, lateral movement, and more. Attack Path Analysis identifies issues that may lead to a breach on your environment, and helps you to remediate the highest risk ones first. 

:::image type="content" source="media/concept-cloud-map/attack-path.png" alt-text="Image that shows a sample attack path from attacker to your sensitive data.":::

Learn how to use [Attack Path Analysis](how-to-manage-attack-path.md).

## What is Cloud Security Explorer

The Cloud Security Explorer allows you to proactively identify security risks in your multicloud environment by running graph-based queries on the Cloud Security Graph. Your security team can use the query builder to search for and locate risks, while taking your organization's specific contextual and conventional information into account. 

Cloud Security Explorer provides you with the ability to perform proactive exploration features. You can search for security risks within your organization by running graph-based path-finding queries on top the contextual security data that is already provided by Defender for Cloud. Such as, cloud misconfigurations, vulnerabilities, resource context, lateral movement possibilities between resources and more.

Learn how to use the [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md), or check out the list of [insights and connections](attack-path-reference.md#insights-and-connections).

## Next steps

[Identify and remediate attack paths](how-to-manage-attack-path.md)
