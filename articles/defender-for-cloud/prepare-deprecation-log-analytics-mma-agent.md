---
title: Prepare for retirement of the Log Analytics agent 
description: Learn how to prepare for the deprecation of the Log Analytics MMA agent in Microsoft Defender for Cloud
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: how-to
ms.date: 02/04/2024
---

# Prepare for retirement of the Log Analytics agent

The Log Analytics agent, also known as the Microsoft Monitoring Agent (MMA), [will retire in August 2024](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341). As a result, the Defender for Servers and Defender for SQL on Machines plans in Microsoft Defender for Cloud will change, and features that rely on the Log Analytics agent will be redesigned.

This article summarizes plans for agent retirement.

## Preparing Defender for Servers

The Defender for Servers plan uses the Log Analytics agent in general availability (GA) and AMA (in preview) for [some features](plan-defender-for-servers-agents.md). Here's what's happening with these features going forward:

To simplify onboarding, all Defender for Servers security features and capabilities will be provided with a single agent ([Microsoft Defender for Endpoint (MDE))](integration-defender-for-endpoint.md), complemented by [agentless machine scanning](concept-agentless-data-collection.md), without any dependency on Log Analytics Agent or AMA. Note that:  

- Defender for Servers features which are based on AMA is currently in preview and won’t be released in GA.  
- Features in preview which rely on AMA will remain supported until an alternative version of the feature is provided, based on Defender for Endpoint integration or agentless machine scanning.
- By enabling Defender for Endpoint integration and agentless machine scanning early, your Defender for Servers deployment stays up to date and supported.

### Feature functionality

The following table summarizes how Defender for Servers features will be provided. Most features are already generally available using Defender for Endpoint integration or agentless machine scanning. The rest of the features will either be available in GA by the time that the MMA is retired, or will be deprecated.

| Feature | Current support | New support | New experience status |
|----|----|----|----|
| Microsoft Defender for Endpoint (MDE) integration for down-level Windows machines (Windows Server 2016/2012 R2)  | egacy Defender for Endpoint sensor, based on the Log Analytics agent | [Unified agent integration](https://learn.microsoft.com/microsoft-365/security/defender-endpoint/configure-server-endpoints) | - Functionality with the  unified agent is GA.<br/>- Functionality with the legacy Defender for Endpoint sensor using the Log Analytics agent will be deprecated in August 2024. |
| OS-level threat detection | Log Analytics agent | Defender for Endpoint agent integration | Functionality with the Defender for Endpoint agent is GA.  |
| Adaptive application controls | Log Analytics agent (GA), AMA (Preview) | --- | The adaptive application control feature will be deprecated in August 2024. |
| Endpoint protection discovery recommendations | Recommendations available in foundational CSPM and Defender for Servers, using the Log Analytics agent (GA), AMA (Preview) | Agentless machine scanning | - Functionality with agentless machine scanning will be released to preview in February 2024 as part of Defender for Servers plan 2 and the Defender CSPM plan.<Br/>- Azure VMs, GCP instances, and AWS instances will be supported. On-premises machines won’t be supported. |
| Missing OS system update recommendation | Recommendations available in foundational CSPM and Defender for Servers using the Log Analytics agent.  | Integration with Update Manager, Microsoft | New recommendations based on Azure Update Manager integration [are GA](/release-notes-archive.md#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga), with no agent dependencies. |
| OS misconfigurations (Microsoft Cloud Security Benchmark) | Recommendations available in foundational CSPM and Defender for Servers using the Log Analytics agent, Guest Configuration agent (Preview). | Microsoft Defender Vulnerability Management premium, as part of Defender for Servers plan 2. | - Functionality based on integration with Microsoft Defender Vulnerability Management premium will be available in preview around April 2024.<br/>- Functionality with the Log Analytics agent will deprecate in August 2024<br/>- Functionality with Guest Configuration agent (Preview) will deprecate when the Microsoft Defender Vulnerability Management is available.<br/>- Support of this feature for Docker-hub and VMMS will be deprecated in Aug 2024. |
| File integrity monitoring | Log Analytics agent, AMA (Preview) | Defender for Endpoint agent integration | Functionality with the Defender for Endpoint agent will be available around April 2024.<br/>- Functionality with the Log Analytics agent will deprecate in August 2024.<br/>- Functionality with AMA will deprecate when the Defender for Endpoint integration is released. |

## Migration Planning

We recommend you plan agent migration plan in accordance with your business requirements. The table summarizes our guidance.

| **AMA required for Defender for SQL on Machines or any other scenario?** | **Defender for Servers required with these features in GA: File integrity monitoring, endpoint protection recommendations, security baseline recommendations?** | **Migration plan** |  
|----|----|----|
| No | Yes | - Wait for GA of all features with Defender for Endpoint integration or agentless machine scanning (you can use preview version earlier).<br/>- Remove the Log Analytics agent after feature is GA. |
| No | No | You can remove the Log Analytics agent now. |
| Yes | No | Migrate from the Log Analytics agent to AMA autoprovisioning.|
| Yes | Yes | You can use the Log Analytics agent and AMA side-by-side to to get all features in GA. [Learn more](auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents) about running side-by-side.<br/>- Alternatively, start migration from Log Analytics agent to AMA in April 2024. |

You can run both the Log Analytics agent and the AMA on the same machine. Each machine is billed once in Defender for Cloud. If both agents are running on a machine, to avoid collecting duplicate data we recommend: 

Either send the data to different workspaces. 

Alternatvily, turn off security event data collection in the Log Analytics agent. Learn more about the [impact of running both agents](auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents), in Azure Monitor documentation.

### Endpoint protection recommendations experience

Endpoint discovery and recommendations are currently provided by Defender for Cloud foundational CSPM and the Defender for Servers plan using the Log Analytics agent in GA, or the AMA in preview. This experience will be replaced by security recommendations that are gathered using agentless machine scanning.  

Endpoint protection recommendations are constructed in two stages. The first stage is [discovery](#discovery) of an endpoint detection and response solution. The second is [assessment](#edr-configuration-assessment) of the solution’s configuration. The following tables provide details of the current and new experiences for each stage.

#### Discovery

| Area | Current experience | New experience |
|----|----|----|
|**What's needed to classify a resource as healthy?** | An anti-virus is in place. | An endpoint Detection and Response solution is in place. |
| **What's needed to get the recommendation?** | Log Analytics agent | Agentless machine scanning |
| **What plans are supported?** | - Foundational CSPM (free)<br/>- Defender for Servers Plan 1 and Plan 2 |- Defender CSPM<br/>- Defender for Servers Plan 2 |
|**What fix is available?** | Install Microsoft anti-malware. | Install Defender for Endpoint unified agent on selected machines/subscriptions. |

#### EDR configuration Assessment

| Aread | Current experience | New experience |
|----|----|----|
| Resources are classified as unhealthy if one or more of the security checks aren’t healthy. | Two security checks:<br/>- Real time protection is off<br/>- Signatures are out of date. | Three security checks:<br/>- Anti-malware/anti-virus is off or partially configured<br/>- Signatures are out of date<br/>- Both quick scan and full scan haven't run for seven days. |
| Prerequisites to get the recommendation | An anti-malware solution in place | An endpoint detection and response solution in place. |
| Supported machines | Azure VMs, AWS and GCP instances, and on-premises machines. | Azure VMs, AWS and GCP instances. On-premises machines are not supported. |
| How do I fix a recommendation to install endpoint protection? | Install Microsoft antimalware | Enable Microsoft Defender for Endpoint integration with Defender for Cloud in your subscription, or connect to a third-party endpoint detection and response solution. |

#### Which recommendations are being deprecated?

The following table summarizes the timetable for recommendations being deprecated and replaced.

| Recommendation | Agent | Deprecation date | Replacement recommendation |
|----|----|----|----|----|
| [Endpoint protection should be installed on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) (public) | MMA/AMA | --- | February 2024 | New agentless recommendations. |
| [Endpoint protection health issues should be resolved on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000) (public)| MMA/AMA | ---|  February 2024 | New agentless recommendations. |
| [Endpoint protection health failures on virtual machine scale sets should be resolved](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/e71020c2-860c-3235-cd39-04f3f8c936d2) | MMA | VMSS |  August 2024 | No replacement. |
| [Endpoint protection solution should be installed on virtual machine scale sets](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/21300918-b2e3-0346-785f-c77ff57d243b) | MMA | VMSS |  August 2024 | No replacement. |
| [Endpoint protection solution should be on machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/383cf3bc-fdf9-4a02-120a-3e7e36c6bfee) (for non-Azure resources)  | MMA | Non-Azure resoucres | August 2024 | No replacement. |
| [Install endpoint protection solution on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/83f577bd-a1b6-b7e1-0891-12ca19d1e6df) | MMA | Azure resoucres | August 2024 | New agentless recommendations |
| [Endpoint protection health issues on machines should be resolved](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/3bcd234d-c9c7-c2a2-89e0-c01f419c1a8a)  | MMA | Azure resources | August 2024 | New agentless recommendations. |

#### How will the replacement work?

- Current recommendations provided by the Log Analytics Agent or the AMA will deprecate over time.  
- Some of these existing recommendations will be replaced by new recommendations based on machine assessment with agentless machine scanning.  
- Recommendations currently in GA will remain in place until the Log Analytics agent retires.  .
- Recommendations that are currently in preview will be replaced when the new recommendation is available in preview.

#### What's happening with secure score?

- Recommendations that are currently in GA will continue to impact secure score.  
- Current and upcoming new recommendations are located under the same Microsoft Cloud Security Benchmark control. This ensures that there’s no duplicate impact on secure score.  .

#### How do I prepare for the new recommendations?

- Ensure that [agentless machine scanning is enabled](enable-agentless-scanning-vms.md).
- If suitable for your environment, for best experience we recommend that you remove deprecated recommendations when the replacement GA recommendation becomes available. To do that, disable the recommendation in the [built-in Defender for Cloud initiative in Azure Policy](policy-reference.md).

## Preparing Defender for SQL on Machines

The use of the Log Analytics agent in Defender for SQL on Machines will be replaced by new SQL-targeted autoprovisioning process for the AMA. Migration to AMA autoprovisioning is seamless and ensures continuous machine protection.

## Support dates

Dates are summarized in the following table.

| Agent in use | Plan in use | Details |
| --- | --- | --- |
| Log Analytics agent | Defender for Servers, Defender for SQL on Machines | The Log Analytics agent is supported in GA until August 2024.|
| AMA | Defender for SQL on Machines | The AMA is available with a new autoprovisioning process. |
| AMA | Defender for Servers | The AMA is available in preview until August 2024. |

## Scheduling migration

Many of the Defender for Servers features supported by the Log Analytics agent/AMA are already generally available with Microsoft Defender for Endpoint integration or agentless machine scanning.  

All of the Defender for SQL servers on machines features are already generally available with the autoprovisioned AMA.  

 ## Migration steps

The following table summarizes the migration steps for each scenario.

| Which scenario are you using? | Recommended action |
| --- | --- |
| Defender for SQL on Machines only | Migrate to [SQL autoprovisioning for AMA](defender-for-sql-autoprovisioning.md). |
| Defender for Servers only.<br/>- Using one or more of these features: file integrity monitoring (FIM),  End point protection recommendations, security baseline recommendations. | 1. Enable [Defender for Endpoint (MDE) integration](enable-defender-for-endpoint.md) and [agentless machine scanning](enable-agentless-scanning-vms.md).<br/>2. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>3. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| Defender for Servers only.<br/>Not using any of the features mentioned in the previous row. | 1. Enable [Defender for Endpoint (MDE) integration](enable-defender-for-endpoint.md) and [agentless machine scanning](enable-agentless-scanning-vms.md).<br/>2. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/> 3. Uninstall the Log Analytics agent and the AMA on all machines protected by Defender for Cloud. |
| Defender for SQL on Machines and Defender for Servers.<br/>Using one or more of these Defender for Servers features: free security recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md) and [agentless machine scanning](enable-agentless-scanning-vms.md).<br/>2. Migrate to [SQL autoprovisioning for AMA](defender-for-sql-autoprovisioning.md) in Defender for SQL on machines.<br/>3. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>4. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| Defender for SQL on machines and Defender for Servers.<br/>You don't need any Defender for Servers features described in the previous row. | 1. Enable [Defender for Endpoint (MDE)integration](enable-defender-for-endpoint.md) and [agentless scanning](enable-agentless-scanning-vms.md).<br/>2. [Migrate](defender-for-sql-autoprovisioning.md) to the new SQL autoprovisioning process.<br/>3. [Disable](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent) the Log Analytics/Azure Monitor Agent.<br/>4. Uninstall MMA across all servers. |

## Next steps

See the [upcoming changes for the Defender for Cloud plan and strategy for the Log Analytics agent deprecation](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).
