---
title: Scale a Defender for Servers deployment 
description: Scale protection of Azure, AWS, GCP, and on-premises servers by using Microsoft Defender for Servers.
ms.topic: conceptual
ms.author: dacurwin
author: dcurwin
ms.date: 08/14/2023
---
# Scale a Defender for Servers deployment

This article helps you scale your Microsoft Defender for Servers deployment.

Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## Before you begin

This article is the *sixth* and final article in the Defender for Servers planning guide series. Before you begin, review the earlier articles:

1. [Start planning your deployment](plan-defender-for-servers.md)
1. [Understand where your data is stored and Log Analytics workspace requirements](plan-defender-for-servers-data-workspace.md)
1. [Review access and role requirements](plan-defender-for-servers-roles.md)
1. [Select a Defender for Servers plan](plan-defender-for-servers-select-plan.md)
1. [Review requirements for agents, extensions, and Azure Arc resources](plan-defender-for-servers-agents.md)

## Scaling overview

When you enable a Defender for Cloud subscription, this process occurs:

1. The *microsoft.security* resource provider is automatically registered on the subscription.
1. At the same time, the Cloud Security Benchmark initiative that's responsible for creating security recommendations and calculating the secure score is assigned to the subscription.
1. After you enable Defender for Cloud on the subscription, you turn on Defender for Servers Plan 1 or Defender for Servers Plan 2, and then you enable auto provisioning.

In the next sections, review considerations for specific steps as you scale your deployment:

- Scale a Cloud Security Benchmark deployment
- Scale a Defender for Servers plan
- Scale auto provisioning

## Scale a Cloud Security Benchmark deployment

In a scaled deployment, you might want the Cloud Security Benchmark (formerly the Azure Security Benchmark) to be automatically assigned.

The assignment is inherited for every existing and future subscription in the management group. To set up your deployment to automatically apply the benchmark, assign the policy initiative to your management group (root) instead of to each subscription.

You can get the *Azure Security Benchmark* policy definition on [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Security%20Center/AzureSecurityCenter.json).

[Learn more](onboard-management-group.md) about using a built-in policy definition to register a resource provider.

## Scale a Defender for Servers plan

You can use a policy definition to enable Defender for Servers at scale:

- To get the built-in *Configure Azure Defender for Servers to be enabled* policy definition, in the Azure portal for your deployment, go to **Azure Policy** > **Policy Definitions**.

    :::image type="content" source="media/plan-defender-for-servers-scale/select-policy-definition.png" alt-text="Screenshot that shows the Configure Azure Defender for Servers to be enabled policy definition." lightbox="media/plan-defender-for-servers-scale/select-policy-definition.png":::

- Alternatively, you can use a [custom policy](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Policy/Enable%20Defender%20for%20Servers%20plans) to enable Defender for Servers and select the plan at the same time.
- You can enable only one Defender for Servers plan on each subscription. You can't enable both Defender for Servers Plan 1 and Plan 2 at the same subscription.
- If you want to use both plans in your environment, divide your subscriptions into two management groups. On each management group, assign a policy to enable the respective plan on each underlying subscription.

## Scale auto provisioning

You can set up auto provisioning by assigning the built-in policy definitions to an Azure management group to cover underlying subscriptions. The following table summarizes the definitions:

Agent | Policy
---  | ---
Log Analytics agent (default workspace) | *Enable Security Center's autoprovisioning of the Log Analytics agent on your subscriptions with default workspaces*
Log Analytics agent (custom workspace) | *Enable Security Center's autoprovisioning of the Log Analytics agent on your subscriptions with custom workspaces*
Azure Monitor agent (default data collection rule) | *[Preview]: Configure Arc machines to create the default Microsoft Defender for Cloud pipeline using Azure Monitor Agent*<br/><br/> *[Preview]: Configure virtual machines to create the default Microsoft Defender for Cloud pipeline using Azure Monitor Agent*
Azure Monitor agent (custom data collection rule) | *[Preview]: Configure Arc machines to create the Microsoft Defender for Cloud user-defined pipeline using Azure Monitor Agent*<br/><br/> *[Preview]: Configure machines to create the Microsoft Defender for Cloud user-defined pipeline using Azure Monitor Agent*
Qualys vulnerability assessment | *Configure machines to receive a vulnerability assessment provider*
Guest configuration extension | [Overview and prerequisites](../virtual-machines/extensions/guest-configuration.md)

To review policy definitions, in the Azure portal, go to **Policy** > **Definitions**.

## Next steps

Begin a deployment for your scenario:

- [Enable a Defender for Servers plan](enable-enhanced-security.md)
- [Connect an on-premises machine to Azure](quickstart-onboard-aws.md)
- [Connect an AWS account to Defender for Cloud](quickstart-onboard-aws.md)
- [Connect a GCP project to Defender for Cloud](quickstart-onboard-gcp.md)
