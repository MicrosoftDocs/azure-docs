---
title: Prepare for deprecation of the Log Analytics MMA agent 
description: Learn how to prepare for the deprecation of the Log Analytics MMA agent in Microsoft Defender for Cloud
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: how-to
ms.date: 02/01/2024
---

# Prepare for retirement of the Log Analytics agent

The Log Analytics agent, also known as the Microsoft Monitoring Agent (MMA) [will retire in August 2024](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341). The Log Analytics agent as well as the Azure Monitoring Agent (AMA) are used by the Defender for Servers and Defender for SQL Servers on Machines plans in Microsoft Defender for Cloud.

This article summarizes plans for agent retirement.

## Preparing Defender for Servers

The Defender for Servers plan uses the Log Analytics agent in general availability (GA) and AMA (in preview) for [several capabilities](plan-defender-for-servers-agents.md). Here's what's happening going forward:

- All Defender for Servers capabilities will be provided by integration with Microsoft Defender for Endpoint (MDE), and with [agentless machine scanning](concept-agentless-data-collection.md).
- Using AMA for Defender for Servers features is currently in preview and won’t be released in GA.
- You can continue to use AMA in preview until all features supported by AMA are provided by Defender for Endpoint integration or agentless machine scanning.
- By enabling Defender for Endpoint integration and agentless machine scanning early, your Defender for Servers deployment stays up to date and supported.

### Feature functionality

The following table summarizes how Defender for Servers features will be provided as part of the deprecation plan.

| Feature | Current support | New support | New experience status |
|----|----|----|----|
| Endpoint protection for machines running Windows Server 2016, 2012 R2 | Legacy Defender for Endpoint sensor, Log Analytics agent (GA) | Defender for Endpoint agent |Functionality with the Defender for Endpoint agent is GA<br/>Functionality with the legacy Defender for Endpoint sensor and the Log Analytics agent will deprecate in August 2024. |
| OS-level threat detection | Log Analytics agent (GA) | Defender for Endpoint agent integration | Functionality with the Defender for Endpoint agent is GA |
| Adaptive application controls | Log Analytics agent (GA), AMA (Preview) | Not applicable | The adaptive application control feature will be deprecated in August 2024. |
| Endpoint discovery and protection recommendations | Recommendations provided by foundational CSPM in Defender for Cloud using the Log Analytics agent (GA), AMA (Preview) | Agentless machine scanning | Functionality with agentless machine scanning will release to preview in February 2024 as part of Defender for Servers plan 2 and the Defender CSPM plan. Azure VMs, GCP instances, and AWS instances will be supported. On-premises machines aren't supported. |
| Missing OS system update recommendation | Log Analytics agent (GA), Guest Configuration agent (Preview) | Integration with Update Manager, Microsoft Defender Vulnerability Management. | New recommendations based on Update Manager integration are GA, with no agent dependencies.<br/>- The Guest Configuration agent functionality will deprecate when an alternative is provided with Microsoft Defender Vulnerability Management premium.<br/>- Support for this feature in Docker Hub and VMMS will deprecated in August 2024. |
| OS misconfigurations (Microsoft Cloud Security Benchmark) | Log Analytics agent (GA), AMA (Preview) | Microsoft Defender Vulnerability Management premium. | Functionality based on integration with Microsoft Defender Vulnerability Management premium will be available in early 2024.<br/>- Functionality with the Log Analytics agent will deprecate in August 2024.<br/>- Functionality with AMA will deprecate when the Microsoft Defender Vulnerability Management is available. |
| File integrity monitoring | Log Analytics agent (GA), AMA (Preview) | Defender for Endpoint agent integration | Functionality with the Defender for Endpoint agent will be available around April 2024.<br/>- Functionality with the Log Analytics agent will deprecate in August 2024.<br/>- Functionality with AMA will deprecate when the Defender for Endpoint integration is released. |

### Endpoint recommendations experience

Endpoint discovery and recommendations are currently provided by Defender for Cloud foundational CSPM using the Log Analytics agent in GA, or the AMA in preview. This experience will be replaced by security recommendations that are gathered using agentless machine scanning.

Endpoint recommendations fall into two stages. The first stage is [discovery](#discovery-stage) of an EDR solution. The second is [assessment](#assessment-stage) of the solution configuration. The following tables provide details of the current and new experiences for each stage.

#### Discovery stage

| Aspect | Current experience | New experience |
|----|----|----|
|**What do we recommend to have on the resource to be fully secured (healthy vs. not healthy)?** | Anti-virus | - Endpoint Detection and Response (EDR)<br/>- Microsoft + non-Microsoft |
| **Prerequisites to get the recommendation** | Log Analytics agent (MMA) | Agentless machine scanning |
| **Supported Defender plans** | - CSPM (free)<br/>- Defender CSPM<br/>- Servers Plan 1 and Plan 2 |- Defender CSPM<br/>- Servers Plan 2 |
|**Available fix** | Install Microsoft anti-malware. | Install MDE on selected machines/subscriptions. |

#### Assessment stage

| Aspect | Current experience | New experience |
|----|----|----|
|**Unhealthy resources - one of the findings is not healthy.** | 2 security checks:<br/>-real time protection is off<br/>- signatures are out of date. | 3 security checks:<br/>- Anti-malware/anti-virus is off or partially configured<br/>- Signatures are out of date<br/>- Both quick scan and full scan are out of 7 days. |
| **Prerequisites to get the recommendation [not applicable]** | Have anti-malware | Have EDR |
| **Available fix** | No fix available | North Star, potential fixes:<br/>- Turn on AV Active mode / turn on AV.<br/>- Initiate agentless malware scanning. |

#### What’s the difference between the recommendations experiences?

The following table compares the recommendations experience across agents.

| Area | Current experience | Upcoming experience |
|----|----|----|
| What keeps a resource healthy? | You have antivirus/antimalware | You have an endpoint detection and response solution (Microsoft/Third-Party) |
| What health checks are done? | Real time protection is off<br/>Signatures are out-of-date | - Antimalware/antivirus is off or partially configured<br/>- Signatures are out-of-date<br/>- Quick and full scan haven’t run for seven days |
| What agent is needed? | Log Analytics agent/AMA | Agentless machine scanning |
| What plan is needed? | No plan is required. Recommendations are provided as part of the Defender for Cloud foundational CSPM recommendations | Defender for Servers plan 2 or the Defender CSPM plan |
| What machines are supported? | Azure VMs, AWS and GCP instances onboarded as Azure Arc VMs, on-premises machines onboarded as Azure Arc VMs, on-premises machines running the agent (not onboarded as Azure Arc machines) | Azure VMs, AWS and GCP instances onboarded as Azure Arc VMs, on-premises machines onboarded as Azure Arc VMs.|
| How do I fix a recommendation to install endpoint protection? | Install Microsoft antimalware | Enable Microsoft Defender for Endpoint integration with Defender for Cloud in your subscription, or connect to a third-party endpoint detection and response solution. |

#### Which recommendations are being deprecated?

The following table summarizes the timetable for recommendations being deprecated and replaced.

| Recommendation | Agent | Deprecation date | Replacement recommendation |
|--|--|--|--|
| [Endpoint protection should be installed on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) (public) | MMA/AMA | February 2024 | [New agentless recommendations](#upcoming-new-endpoint-protection-recommendations). |
| [Endpoint protection health issues should be resolved on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000) (public)| MMA/AMA | February 2024 | [New agentless recommendations](#upcoming-new-endpoint-protection-recommendations). |
| Endpoint protection health failures should be remediated on virtual machine scale sets | MMA | August 2024 | No replacement. |
| Endpoint protection solution should be installed on virtual machine scale sets | MMA | August 2024 | No replacement. |
| Install endpoint protection solution on your machines (for non-Azure resources)  | MMA | August 2024 | No replacement. |
| Install endpoint protection solution on your machines | MMA | August 2024 | [New agentless recommendations](#upcoming-new-endpoint-protection-recommendations). |
| Install endpoint protection solution on virtual machines | MMA | August 2024 | [New agentless recommendations](#upcoming-new-endpoint-protection-recommendations). |

#### How will the replacement work?

- Current recommendations provided by the Log Analytics Agent or the AMA will deprecate over time. Some of these existing recommendations will be replaced by new recommendations based on machine assessment with agentless machine scanning.
- Recommendations currently GA will remain until the Log Analytics agent retires.
- Recommendations that are currently in preview will be replaced when the new recommendation is available in preview.

#### What's happening with secure score?

- Recommendations that are currently in GA will continue to impact secure score.
- Current and upcoming new recommendations are located under the same Microsoft Cloud Security Benchmark control. This ensures that there’s no duplicate impact on secure score.

#### How do I prepare for the new recommendations?

- Ensure that [agentless machine scanning is enabled](enable-agentless-scanning-vms.md).
- If suitable for your environment, for the best experience, we recommend that you remove deprecated recommendations once the replacement GA recommendation is available. You can do that by disabling the recommendation in the [built-in Defender for Cloud initiative in Azure Policy](policy-reference.md).

## Preparing Defender for SQL on machines

The use of the Log Analytics agent in Defender for SQL on Machines will be replaced by new SQL-targeted autoprovisioning process for the AMA. Migration to AMA autoprovisioning is seamless and ensures continuous machine protection.

## Support dates

Dates are summarized in the following table.

| Agent in use | Plan in use | Details |
| --- | --- | --- |
| Log Analytics agent | Defender for Servers, Defender for SQL on Machines | The Log Analytics agent is supported in GA until August 2024.|
| AMA | Defender for SQL on Machines | The AMA is available with a new autoprovisioning process. |
| AMA | Defender for Servers | The AMA is available in public preview until August 2024. |

## Scheduling migration

Many of the Defender for Servers features supported by the Log Analytics agent/AMA are already generally available with Microsoft Defender for Endpoint integration or agentless machine scanning.  

All of the Defender for SQL servers on machines features are already generally available with the autoprovisioned AMA.  

Depending on your scenario, the table summarizes our scheduling recommendations.

| Using AMA in Defender for SQL on machines?  | Using Defender for Servers with free security recommendations, file integrity monitoring, integrated Defender for Endpoint, adaptive application control?  | Schedule |
| --- | --- | --- |
| No | Yes | Wait for GA of all features with Defender for Endpoint integration and agentless machine scanning. You can use public preview earlier.<br/>Remove Log Analytics agent after August 2024. |
| No | No | Remove the Log Analytics agent now.|
| Yes | No | Migrate from the Log Analytics agent to AMA autoprovisioning now. |
| Yes | Yes | Use the Log Analytics agent and AMA side-by-side to ensure all capabilities are GA. [Learn more](auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents) about running side-by-side.<br/>Alternatively, start migration from Log Analytics agent to AMA now. |

## Migration steps

The following table summarizes the migration steps for each scenario.

| Which scenario are you using? | Recommended action |
| --- | --- |
| Defender for SQL on Machines only | Migrate to [SQL autoprovisioning for AMA](defender-for-sql-autoprovisioning.md). |
| Defender for Servers only.<br/>Using one or more of these features: free security recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md).<br/>2. Enable [agentless machine scanning](enable-agentless-scanning-vms.md).<br/>3. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>4. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| Defender for Servers only.<br/>Not using any of the features mentioned in the previous row. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md).<br/>2. Enable [agentless machine scanning](enable-agentless-scanning-vms.md).<br/>3. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/> 4. Uninstall the Log Analytics agent and the AMA on all machines protected by Defender for Cloud. |
| Defender for SQL on Machines and Defender for Servers.<br/>Using one or more of these Defender for Servers features: free security recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md).<br/>2. Enable [agentless machine scanning](enable-agentless-scanning-vms.md).<br/>3. Migrate to [SQL autoprovisioning for AMA](defender-for-sql-autoprovisioning.md) in Defender for SQL on machines.<br/>4. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>5. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| Defender for SQL on machines and Defender for Servers.<br/>You don't need any Defender for Servers features described in the previous row. | 1. Enable [Defender for Endpoint integration in Defender for Servers](enable-defender-for-endpoint.md).<br/>2. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>3. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |

## Next steps

See the [upcoming changes for the Defender for Cloud plan and strategy for the Log Analytics agent deprecation](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).
