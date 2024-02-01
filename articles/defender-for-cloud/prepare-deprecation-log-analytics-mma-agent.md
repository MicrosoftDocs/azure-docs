---
title: Prepare for deprecation of the Log Analytics MMA agent 
description: Learn how to prepare for the deprecation of the Log Analytics MMA agent in Microsoft Defender for Cloud
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: how-to
ms.date: 01/29/2024
---

# Prepare for retirement of the Log Analytics agent

The Log Analytics agent, also known as the Microsoft Monitoring Agent (MMA) [will retire in August 2024](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation). The Log Analytics agent as well as the Azure Monitoring Agent (AMA) are used by the Defender for Servers and Defender for SQL Servers on Machines plans in Microsoft Defender for Cloud.

This article summarizes plans for agent retirement.

## Preparing Defender for Servers

The Defender for Servers plan uses the Log Analytics Agent in general availability (GA) and AMA (in public preview) for [several capabilities](plan-defender-for-servers-agents.md). Here's what's happening:

- All Defender for Servers capabilities will be provided by integration with Microsoft Defender for Endpoint (MDE), and with agentless machine scanning.
- Using AMA for Defender for Servers features is currently in preview and won’t be released in GA.
- You can continue to use AMA in public preview until all features supported by AMA are provided by Defender for Endpoint integration or agentless machine scanning.
- After August 2024, use of the Log Analytics agent for Defender for Servers features will be deprecated.
- By enabling Defender for Endpoint integration and agentless scanning early, your Defender for Servers deployment stays up to date and supported.

### Feature Functionality

The following table summarizes how Defender for Servers features will be provided as part of the deprecation plan.

| Feature | Current functionality | New functionality | New functionality status |
|----|----|----|----|
| Endpoint protection for machines running Windows Server 2016, 2012 R2 | Legacy Defender for Endpoint sensor, Log Analytics agent (GA) | Defender for Endpoint agent |Functionality with the Defender for Endpoint agent is GA<br/>Functionality with the legacy Defender for Endpoint sensor and the Log Analytics agent will deprecate in August 2024. |
| OS-level threat detection | Log Analytics agent (GA) | Defender for Endpoint agent integration | Functionality with the Defender for Endpoint agent is GA |
| Adaptive application controls | Log Analytics agent (GA), AMA (Preview) | Not applicable | The adaptive application control feature will be deprecated in August 2024. |
| Endpoint discovery and protection recommendations | Recommendations provided by foundational CSPM in Defender for Cloud using the Log Analytics agent (GA), AMA (Preview) | Agentless scanning | Functionality with agentless scanning will release to review around April 2024 as part of Defender for Servers plan 2 and the Defender CSPM plan. Azure Arc-connected machines and on-premises machines (with or without Arc) won’t be supported. |
| Missing OS system update recommendation | Log Analytics agent (GA), Guest Configuration agent (Preview} | Integration with Update Manager, Microsoft Defender Vulnerability Management. | New recommendations based on Update Manager integration are GA, with no agent dependencies.<br/>The Guest Configuration agent functionality will deprecate when an alternative is provided with Microsoft Defender Vulnerability Management premium.<br/>Support for this feature in Docker Hub and VMMS will deprecated in August 2024. |
| OS misconfigurations (Microsoft Cloud Security Benchmark) | Log Analytics agent (GA), AMA (Preview) | Microsoft Defender Vulnerability Management premium. | Functionality based on integration with Microsoft Defender Vulnerability Management premium will be available in early 2024.<br/>Functionality with the Log Analytics agent will deprecate in August 2024.<br/>Functionality with AMA will deprecate when the Microsoft Defender Vulnerability Management is available. |
| File integrity monitoring | Log Analytics agent (GA), AMA (Preview) | Defender for Endpoint agent integration | Functionality with the Defender for Endpoint agent will be available around April 2024.<br/>Functionality with the Log Analytics agent will deprecate in August 2024.<br/>Functionality with AMA will deprecate when the Defender for Endpoint integration is released. |

### Endpoint recommendations experience

Endpoint discovery and recommendations are currently provided by Defender for Cloud foundational CSPM using the Log Analytics agent in GA, or the AMA in preview. This experience will be replaced by security recommendations that are gathered using agentless scanning. The following table compares the recommendations experience across agents.

| Area | Current experience | Upcoming experience |
|---|---|---|
| What keeps a resource healthy? | You have antivirus/antimalware |	You have an endpoint detection and response solution (Microsoft/Third-Party) |
| What health checks are done? | Real time protection is off<br/>Signatures are out-of-date | Antimalware/antivirus is off or partially configured<br/>Signatures are out-of-date<br/>Quick and full scan haven’t run for seven days |
| What agent is needed? | Log Analytics agent/AMA | Agentless machine scanning |
| What plan is needed? | No plan is required. Recommendations are provided as part of the Defender for Cloud foundational CSPM recommendations. | Defender for Servers plan 2 or the Defender CSPM plan. |
| What machines are supported? | Azure VMs, AWS/GCP instances onboarded as Azure Arc VMs, on-premises machines onboarded as Azure Arc VMs, on-premises machines running the agent (not onboarded as Azure Arc machines). | Assessment with agentless scanning is supported for Azure VMs and AWS/GCP instances. It's not supported for on-premises machines, even if they're onboarded to Azure with Azure Arc. |
| How do I fix a recommendation to install endpoint protection? | Install Microsoft antimalware. | Enable Microsoft Defender for Endpoint integration with Defender for Cloud in your subscription, or connect to a third-party endpoint detection and response solution. |

#### What’s the difference between the recommendations experiences?

The following table compares the recommendations experience across agents.

| Area | Current experience | Upcoming experience |
|----|----|----|
| What keeps a resource healthy? | You have antivirus/antimalware | You have an endpoint detection and response solution (Microsoft/Third-Party) |
| What health checks are done? | Real time protection is off<br/>Signatures are out-of-date | Antimalware/antivirus is off or partially configured<br/>Signatures are out-of-date<br/>Quick and full scan haven’t run for seven days |
| What agent is needed? | Log Analytics agent/AMA | Agentless machine scanning |
| What plan is needed? | No plan is required. Recommendations are provided as part of the Defender for Cloud foundational CSPM recommendations | Defender for Servers plan 2 or the Defender CSPM plan |
| What machines are supported? | Azure VMs, AWS/GCP instances onboarded as Azure Arc VMs, on-premises machines onboarded as Azure Arc VMs, on-premises machines running the agent (not onboarded as Azure Arc machines) | Azure VMs, AWS/GCP instances onboarded as Azure Arc VMs, on-premises machines onboarded as Azure Arc VMs.|
| How do I fix a recommendation to install endpoint protection? | Install Microsoft antimalware | Enable Microsoft Defender for Endpoint integration with Defender for Cloud in your subscription, or connect to a third-party endpoint detection and response solution. |

#### Which recommendations are retiring?

The following table summarizes the timetable for recommendations being retired and replaced.

| Recommendation | Agent | Deprecation date | Replacement recommendation |
|--|--|--|--|
| [Endpoint protection should be installed on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) | AMA | February 2024 | Exact deprecation date will occur when a replacement recommendation releases to preview. |
| [Endpoint protection health issues should be resolved on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000) | AMA | February 2024 | Exact deprecation date will occur when a replacement recommendation releases to preview. |
| Endpoint protection health failures should be remediated on virtual machine scale sets | MMA | August 2024 | No replacement. |
| Endpoint protection solution should be installed on virtual machine scale sets | MMA | August 2024 | No replacement. |
| Install endpoint protection solution on your machines | MMA | August 2024 | Exact deprecation date will occur when a replacement recommendation releases to preview. |
| Install endpoint protection solution on virtual machines | MMA | August 2024 | Exact deprecation date will occur when a replacement recommendation releases to preview. |

| Preliminary recommendation name | Plan required | Estimated release date |
|--|--|--|
| Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines | Defender CSPM <br> Defender for Servers Plan 1 <br> Defender for Servers Plan 2 | February 2024 |
| Endpoint Detection and Response (EDR) solution should be installed on EC2s | Defender CSPM <br> Defender for Servers Plan 1 <br> Defender for Servers Plan 2 | February 2024 |
| Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines (GCP) | Defender CSPM <br> Defender for Servers Plan 1 <br> Defender for Servers Plan 2 | February 2024 |
| Endpoint Detection and Response (EDR) configuration issues should be resolved on virtual machines | Defender CSPM <br> Defender for Servers Plan 2 | February 2024 |
| Endpoint Detection and Response (EDR) configuration issues should be resolved on EC2s | Defender CSPM <br> Defender for Servers Plan 2 | February 2024 |
| Endpoint Detection and Response (EDR) configuration issues should be resolved on GCP virtual machines | Defender CSPM <br> Defender for Servers Plan 2 | February 2024 |

#### How will the replacement work?

- Current recommendations provided by the Log Analytics Agent or the AMA will deprecate over time. Some of these existing recommendations will be replaced by new recommendations based on machine assessment with agentless machine scanning.
- Recommendations that will be replaced will deprecate when the new recommendation is available in preview.
- Recommendation that will deprecated without being replaced with deprecate in August 2024. Recommendations that affect secure score will continue to do so until then.
- Old and new recommendations are located under the same Microsoft Cloud Security Benchmark control, without overlap in assessed resources. This ensures that there’s no duplicate impact on secure score.

#### How do I prepare for the new recommendations?

- Ensure that agentless scanning is enabled.
- If you want to preempt the deprecation of recommendations in August 2024, you can remove them at an earlier date. You can do that by disabling the recommendation in the built-in Defender for Cloud initiative in Azure Policy.

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

Many of the Defender for Servers features supported by the Log Analytics agent/AMA are already generally available with Microsoft Defender for Endpoint integration or agentless scanning.  

All of the Defender for SQL servers on machines features are already generally available with the autoprovisioned AMA.  

Depending on your scenario, the table summarizes our scheduling recommendations.

| Using AMA in Defender for SQL on machines?  | Using Defender for Servers with free security recommendations, file integrity monitoring, integrated Defender for Endpoint, adaptive application control?  | Schedule |
| --- | --- | --- |
| No | Yes | Wait for GA of all features with Defender for Endpoint integration and agentless scanning. You can use public preview earlier.<br/>Remove Log Analytics agent after August 2024. |
| No | No | Remove the Log Analytics agent now.|
| Yes | No | Migrate from the Log Analytics agent to AMA autoprovisioning now. |
| Yes | Yes | Use the Log Analytics agent and AMA side-by-side to ensure all capabilities are GA. [Learn more](auto-deploy-azure-monitoring-agent.md#impact-of-running-with-both-the-log-analytics-and-azure-monitor-agents) about running side-by-side.<br/>Alternatively, start migration from Log Analytics agent to AMA now. |

## Migration steps

The following table summarizes the migration steps for each scenario.

| Which scenario are you using? | Recommended action |
| --- | --- |
| Defender for SQL on Machines only | Migrate to [SQL autoprovisioning for AMA](defender-for-sql-autoprovisioning.md). |
| Defender for Servers only.<br/>Using one or more of these features: free security recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md).<br/>2. Enable [agentless scanning](enable-agentless-scanning-vms.md).<br/>3. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>4. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| Defender for Servers only.<br/>Not using any of the features mentioned in the previous row. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md).<br/>2. Enable [agentless scanning](enable-agentless-scanning-vms.md).<br/>3. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/> 4. Uninstall the Log Analytics agent and the AMA on all machines protected by Defender for Cloud. |
| Defender for SQL on Machines and Defender for Servers.<br/>Using one or more of these Defender for Servers features: free security recommendations, file integrity monitoring, endpoint protection with integrated Defender for Endpoint, adaptive application control. | 1. Enable [Defender for Endpoint integration](enable-defender-for-endpoint.md).<br/>2. Enable [agentless scanning](enable-agentless-scanning-vms.md).<br/>3. Migrate to [SQL autoprovisioning for AMA](defender-for-sql-autoprovisioning.md) in Defender for SQL on machines.<br/>4. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>5. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |
| Defender for SQL on machines and Defender for Servers.<br/>You don't need any Defender for Servers features described in the previous row. | 1. Enable [Defender for Endpoint integration in Defender for Servers](enable-defender-for-endpoint.md).<br/>2. Disable the [Log Analytics agent and the AMA](defender-for-sql-autoprovisioning.md#disable-the-log-analytics-agentazure-monitor-agent).<br/>3. Uninstall the Log Analytics agent on all machines protected by Defender for Cloud. |

## Next steps

See the [upcoming changes for the Defender for Cloud plan and strategy for the Log Analytics agent deprecation](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).
