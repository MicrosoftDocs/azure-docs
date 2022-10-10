---
title: Overview of Cloud Security Posture Management (CSPM)
description: Learn more about the new Defender CSPM plan and the other enhanced security features that can be enabled for your multicloud environment through the Defender Cloud Security Posture Management (CSPM) plan.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/20/2022
---

# Cloud Security Posture Management (CSPM)

One of Microsoft Defender for Cloud's main pillars for cloud security is Cloud Security Posture Management (CSPM). CSPM provides you with hardening guidance that helps you efficiently and effectively improve your security. CSPM also gives you visibility into your current security situation.

Defender for Cloud continually assesses your resources, subscriptions, and organization for security issues and shows your security posture in secure score, an aggregated score of the security findings that tells you, at a glance, your current security situation: the higher the score, the lower the identified risk level.

## Availability

|Aspect|Details|
|----|:----|
|Release state:| Foundational CSPM capabilities: GA <br> Defender Cloud Security Posture Management (CSPM): Preview |
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet)<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected AWS accounts <br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected GCP projects|

## Defender CSPM plan options

The Defender CSPM plan comes with two options, foundational CSPM capabilities and Defender Cloud Security Posture Management (CSPM). When you deploy Defender for Cloud to your subscription and resources, you'll automatically gain the basic coverages offered by the CSPM plan. To gain access to the other capabilities provided by Defender CSPM, you'll need to [enable the Defender Cloud Security Posture Management (CSPM) plan](enable-enhanced-security.md) to your subscription and resources.

The following table summarizes what's included in each plan and their cloud availability.

| Feature | Foundational CSPM capabilities | Defender Cloud Security Posture Management (CSPM) | Cloud availability |
|--|--|--|--|
| Continuous assessment of the security configuration of your cloud resources | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Security recommendations to fix misconfigurations and weaknesses](review-security-recommendations.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png":::| Azure, AWS, GCP, on-premises |
| [Secure score](secure-score-access-and-track.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Governance](#security-governance-and-regulatory-compliance) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Regulatory compliance](#security-governance-and-regulatory-compliance) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Cloud Security Explorer](#cloud-security-explorer) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Attack Path Analysis](#attack-path-analysis) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Agentless scanning for machines](#agentless-scanning-for-machines) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |


> [!NOTE]
> If you have enabled Defender for DevOps, you will only gain Cloud Security Graph and Attack Path Analysis to the artifacts that arrive through those connectors. 
>
> To enable Governance for for DevOps related recommendations, the Defender Cloud Security Posture Management (CSPM) plan needs to be enabled on the Azure subscription that hosts the DevOps connector.

## Security governance and regulatory compliance

Security governance and regulatory compliance refer to the policies and processes which organizations have in place to ensure that they comply with laws, rules and regulations put in place by external bodies (government) which control activity in a given jurisdiction. Defender for Cloud allows you to view your regulatory compliance through the regulatory compliance dashboard.

Defender for Cloud continuously assesses your hybrid cloud environment to analyze the risk factors according to the controls and best practices in the standards that you've applied to your subscriptions. The dashboard reflects the status of your compliance with these standards.

Learn more about [security and regulatory compliance in Defender for Cloud](concept-regulatory-compliance.md).

## Cloud Security Explorer

The Cloud Security Graph is a graph-based context engine that exists within Defender for Cloud. The Cloud Security Graph collects data from your multicloud environment and other data sources. For example, the cloud assets inventory, connections and lateral movement possibilities between resources, exposure to internet, permissions, network connections, vulnerabilities and more. The data collected is then used to build a graph representing your multicloud environment.

Defender for Cloud then uses the generated graph to perform an Attack Path Analysis and find the issues with the highest risk that exist within your environment. You can also query the graph using the Cloud Security Explorer.

Learn more about [Cloud Security Explorer](concept-attack-path.md#what-is-cloud-security-explorer)

## Attack Path Analysis

Attack Path Analysis is a graph-based algorithm that scans the Cloud Security Graph. The scans expose exploitable paths that attackers may use to breach your environment to reach your high-impact assets. Attack Path Analysis exposes those attack paths and suggests recommendations as to how best remediate the issues that will break the attack path and prevent successful breach.

By taking your environment's contextual information into account such as, internet exposure, permissions, lateral movement, and more. Attack Path Analysis identifies issues that may lead to a breach on your environment, and helps you to remediate the highest risk ones first.

Learn more about [Attack Path Analysis](concept-attack-path.md#what-is-attack-path-analysis)

## Agentless scanning for machines 

With agentless scanning for VMs, you can get visibility on actionable OS posture issues without installed agents, network connectivity, or machine performance impact.

Learn more about [agentless scanning](concept-agentless-data-collection.md).

## Next steps

Learn about [Microsoft Defender for Cloud's basic and enhanced security features](enhanced-security-features-overview.md)
