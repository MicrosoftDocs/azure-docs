---
title: Scale a Defender for Servers deployment 
description: Scale protection of Azure, AWS, GCP, and on-premises servers with Defender for Servers 
ms.topic: conceptual
ms.author: benmansheim
author: bmansheim
ms.date: 11/06/2022
---
# Scale a Defender for Servers deployment

This article helps you to scale your Microsoft Defender for Servers deployment. Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## Before you start

This article is the fifth in the Defender for Servers planning guide series. Before you begin, review the earlier articles:

1. [Start planning your deployment](plan-defender-for-servers.md)
1. [Understand where your data is stored, and Log Analytics workspace requirements](plan-defender-for-servers-data-workspace.md)
1. [Review access and role requirements](plan-defender-for-servers-roles.md)
1. [Review Azure Arc and agent/extension requirements](plan-defender-for-servers-agents.md)


 
## Scaling overview

When you enable Defender for Cloud subscription, the following occurs:

- The *microsoft.security* resource provider is automatically registered on the subscription.
- At the same time, the Cloud Security Benchmark initiative that's responsible for creating security recommendations and calculating secure score is assigned to the subscription.
- After enabling Defender for Cloud on the subscription, you turn on  Defender for Servers Plan 1 or 2, and enable auto-provisioning.


There are some considerations around these steps as you scale your deployment.

## Scaling Cloud Security Benchmark deployment

- In a scaled deployment you might want the Cloud Security Benchmark (formerly the Azure Security Benchmark) to be automatically assigned.
    - You can do this manually assigning the policy initiative to your (root) management group, instead of each subscription individually.
    - You can find the **Azure Security Benchmark** policy definition in [git hub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/AzureSecurityCenter.json).
    - The assignment is inherited for every existing and future subscription underneath the management group.
    - [Learn more](onboard-management-group.md) about using a built-in policy definition to register a resource provider.


## Scaling Defender for Server plans

You can use a policy definition to enable Defender for Servers at scale. Note that:

- You can find the built-in **Configure Defender for Servers to be enabled** policy definition in the Azure Policy > Policy Definitions, in the Azure portal.
- Alternatively, there's a [custom policy in GitHub](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Policy/Enable%20Defender%20for%20Servers%20plans) that allows you to enable Defender for Servers and select the plan at the same time.
- You can only enable one Defender for Servers plan on each subscription, and not both at the same time.
- If you want to use both plans in your environment, divide your subscriptions into two management groups. On each management group you assign a policy to enable the respective plan on each underlying subscription.


## Scaling auto-provisioning 

Auto-provisioning can be configured by assigning the built-in policy definitions to an Azure management group, so that underlying subscriptions are covered. The following table summarizes the definitions. 


Agent | Policy
---  | ---
Log Analytics agent (default workspace) | **Enable Security Center's autoprovisioning of the Log Analytics agent on your subscriptions with default workspaces**
Log Analytics agent (custom workspace) | **Enable Security Center's autoprovisioning of the Log Analytics agent on your subscriptions with custom workspaces**
Azure Monitor agent (default data collection rule) | **[Preview]: Configure Arc machines to create the default Microsoft Defender for Cloud pipeline using Azure Monitor Agent**<br/><br/> **[Preview]: Configure virtual machines to create the default Microsoft Defender for Cloud pipeline using Azure Monitor Agent**
Azure Monitor agent (custom data collection rule) | **[Preview]: Configure Arc machines to create the Microsoft Defender for Cloud user-defined pipeline using Azure Monitor Agent**<br/><br/> **[Preview]: Configure machines to create the Microsoft Defender for Cloud user-defined pipeline using Azure Monitor Agent**
Qualys vulnerability assessment | **Configure machines to receive a vulnerability assessment provider** 
Guest configuration extension | [Overview and prerequisites](../virtual-machines/extensions/guest-configuration.md)

Policy definitions can be found in the Azure portal > **Policy** > **Definitions**.



## Next steps

After working through planning steps, you can start deployment:

- [Enable Defender for Servers](enable-enhanced-security.md) plans
- [Connect on-premises machines](quickstart-onboard-aws.md) to Azure.
- [Connect AWS accounts](quickstart-onboard-aws.md) to Defender for Cloud.
- [Connect GCP projects](quickstart-onboard-gcp.md) to Defender for Cloud.
