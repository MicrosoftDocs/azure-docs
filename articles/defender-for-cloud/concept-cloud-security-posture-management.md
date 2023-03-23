---
title: Overview of Cloud Security Posture Management (CSPM)
description: Learn more about the new Defender CSPM plan and the other enhanced security features that can be enabled for your multicloud environment through the Defender Cloud Security Posture Management (CSPM) plan.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 02/20/2023
---

# Cloud Security Posture Management (CSPM)

One of Microsoft Defender for Cloud's main pillars for cloud security is Cloud Security Posture Management (CSPM). CSPM provides you with hardening guidance that helps you efficiently and effectively improve your security. CSPM also gives you visibility into your current security situation.

Defender for Cloud continually assesses your resources, subscriptions and organization for security issues. Defender for Cloud shows your security posture in secure score. The secure score is an aggregated score of the security findings that tells you your current security situation. The higher the score, the lower the identified risk level.

## Availability

|Aspect|Details|
|----|:----|
|Release state:| Foundational CSPM capabilities: GA <br> Defender Cloud Security Posture Management (CSPM): Preview |
| Prerequisites | - **Foundational CSPM capabilities** - None <br> <br> - **Defender Cloud Security Posture Management (CSPM)** - Agentless scanning requires the **Subscription Owner** to enable the plan. Anyone with a lower level of authorization can enable the Defender CSPM plan but the agentless scanner won't be enabled by default due to lack of permissions. Attack path analysis and security explorer won't populate with vulnerabilities because the agentless scanner is disabled. |
|Clouds:| 	**Foundational CSPM capabilities** <br> :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Azure China 21Vianet)<br> <br> For Connected AWS accounts and GCP projects availability, see the [feature availability](#defender-cspm-plan-options) table. <br> <br> **Defender Cloud Security Posture Management (CSPM)** <br> :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet)<br> <br> For Connected AWS accounts and GCP projects availability, see the [feature availability](#defender-cspm-plan-options) table. |

## Defender CSPM plan options

Defender for cloud offers foundational multicloud CSPM capabilities for free. These capabilities are automatically enabled by default on any subscription or account that has onboarded to Defender for Cloud. The foundational CSPM includes asset discovery, continuous assessment and security recommendations for posture hardening, compliance with Microsoft Cloud Security Benchmark (MCSB), and a [Secure score](secure-score-access-and-track.md) which measure the current status of your organization’s posture.

The optional Defender CSPM plan, provides advanced posture management capabilities such as [Attack path analysis](#attack-path-analysis), [Cloud security explorer](#cloud-security-explorer), advanced threat hunting, [security governance capabilities](#security-governance-and-regulatory-compliance), and also tools to assess your [security compliance](#security-governance-and-regulatory-compliance) with a wide range of benchmarks, regulatory standards, and any custom security policies required in your organization, industry, or region. 

The following table summarizes each plan and their cloud availability.

| Feature | Foundational CSPM capabilities | Defender CSPM | Cloud availability |
|--|--|--|--|
| Continuous assessment of the security configuration of your cloud resources | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Security recommendations to fix misconfigurations and weaknesses](review-security-recommendations.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png":::| Azure, AWS, GCP, on-premises |
| [Secure score](secure-score-access-and-track.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Governance](#security-governance-and-regulatory-compliance) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Regulatory compliance](#security-governance-and-regulatory-compliance) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Cloud security explorer](#cloud-security-explorer) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Attack path analysis](#attack-path-analysis) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Agentless scanning for machines](#agentless-scanning-for-machines) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |


> [!NOTE]
> If you have enabled Defender for DevOps, you will only gain cloud security graph and attack path analysis to the artifacts that arrive through those connectors. 
>
> To enable Governance for for DevOps related recommendations, the Defender CSPM plan needs to be enabled on the Azure subscription that hosts the DevOps connector.

## Security governance and regulatory compliance

Security governance and regulatory compliance refer to the policies and processes which organizations have in place. These policies ensure that they comply with laws, rules and regulations put in place by external bodies (government) which control activity in a given jurisdiction. Defender for Cloud allows you to view your regulatory compliance through the regulatory compliance dashboard.

Defender for Cloud continuously assesses your hybrid cloud environment to analyze the risk factors according to the controls and best practices in the standards that you've applied to your subscriptions. The dashboard reflects the status of your compliance with these standards.

Learn more about [security and regulatory compliance in Defender for Cloud](concept-regulatory-compliance.md).

## Cloud security explorer

The cloud security graph is a graph-based context engine that exists within Defender for Cloud. The cloud security graph collects data from your multicloud environment and other data sources. For example, the cloud assets inventory, connections and lateral movement possibilities between resources, exposure to internet, permissions, network connections, vulnerabilities and more. The data collected builds a graph representing your multicloud environment.

Defender for Cloud then uses the generated graph to perform an attack path analysis and find the issues with the highest risk that exist within your environment. You can also query the graph using the cloud security explorer.

Learn more about [cloud security explorer](concept-attack-path.md#what-is-cloud-security-explorer)

## Attack path analysis

Attack path analysis is a graph-based algorithm that scans the cloud security graph. The scans:

- expose exploitable paths that attackers may use to breach your environment and reach your high-impact assets
- provide recommendations for ways to prevent successful breaches

When you take your environment's contextual information into account, attack path analysis identifies issues that may lead to a breach on your environment, and helps you to remediate the highest risk ones first.  For example its exposure to the internet, permissions, lateral movement, and more.

Learn more about [attack path analysis](concept-attack-path.md#what-is-attack-path-analysis).

## Agentless scanning for machines 

With agentless scanning for VMs, you can get visibility on actionable OS posture issues without installed agents, network connectivity, or machine performance.

Learn more about [agentless scanning](concept-agentless-data-collection.md).

## Next steps

Learn about Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
