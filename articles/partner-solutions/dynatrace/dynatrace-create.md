---
title: Create Dynatrace application - Azure partner solutions
description: This article describes how to use the Azure portal to create an instance of Dynatrace.
ms.topic: quickstart
ms.collection: na
ms.service: partner-services
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022
ms.custom: mode-other
---

# QuickStart: Get started with Dynatrace

In this quickstart, you will create a new instance of Dynatrace. You caneither create a new Dynatrace environment or [link to an existing Dynatrace environment](#link-to-an-existing-dynatrace-environment).

When using the integrated experience in Azure portal, the following entities are created and mapped for monitoring and billing purposes.

**Dynatrace resource in Azure** -- Using the Dynatrace resource, you can manage the Dynatrace environment in Azure. The resource is created in the Azure subscription and resource group that you select during the create or linking process.

**Dynatrace environment** -- this is the Dynatrace environment on Dynatrace SaaS. When you choose to create a new environment, the environment on Dynatrace SaaS is automatically created, in addition to the Dynatrace resource in Azure. The Dynatrace environment is created in the same Azure region in which you create the Dynatrace resource.

**Marketplace SaaS resource** -- the SaaS resource is created automatically, based on the plan you select from the Dynatrace Marketplace offer. This resource is used for billing purposes.

\$TODO: Screenshot showing entities

**Prerequisites**

Before creating your first instance of Dynatrace in Azure, [configure your environment.](#configure-pre-deployment) These steps must be completed before continuing with the next steps in this quickstart.

**Find Offer**

Use the Azure portal to find Dynatrace for Azure application.

1. Go to the [Azure portal](https://microsoftapc-my.sharepoint.com/personal/pbora_microsoft_com/Documents/DevDiv%20-%20Shared/Dynatrace/portal.azure.com) and sign in.

2. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for *Marketplace*.
    $TODO- Screenshot -- highlight searchbar and Marketplace in recent.

3. In the Marketplace, search for **Dynatrace for Azure** from the available offerings.

4. Select setup + subscribe.
    $TODO -- Screenshot -- Marketplace offer, highlight setup + subscribe.

**Create a Dynatrace resource in Azure**

The portal displays two options -- one to create a new Dynatrace environment and another to link Azure subscription to an existing Dynatrace environment.

1. If you want to create a new Dynatrace environment, select **Create** action under the **Create a new Dynatrace environment** option
    \$TODO -- Screenshot -- create / Link, highlight create

1. The portal displays the screen to create a Dynatrace resource.
    \$TODO -- Screenshot -- create -- basics tab

1. Provide the following values:

| **Property** |        **Description** |
| -------------|----- -------------------------------------------------------------------------------------------------------------- |
|Subscription |        Select the Azure subscription you want to use for creating the Dynatrace resource. You must have owner or contributor access.|
|Resource group |      Specify whether you want to create a new resource group or use an existing one. A [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview#resource-groups) is a container that holds related resources for an Azure solution. |
|Resource name   |    Specify a name for the Dynatrace resource. This name will be the friendly name of the new Dynatrace environment.|
|Location         |   Select the region. Both the Dynatrace resource in Azure and Dynatrace environment will be created in the selected region.|
|Pricing plan   |     Select from the list of available plans. |
|Billing Term    |    \$TODO? |

## Configure metrics and logs

When creating the Dynatrace resource, you can setup automatic log forwarding for two types of logs:

1.**Subscription activity logs** -- These logs provide insight into > the operations on your resources at the [control > plane](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane). Updates on service-health events are also included. Use the > activity log to determine the what, who, and when for any write > operations (PUT, POST, DELETE). There\'s a single activity log for > each Azure subscription.

2.**Azure resource logs** -- These logs provide insight into > operations that were taken on an Azure resource at the [data > plane](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane). For example, getting a secret from a Key Vault is a data plane > operation. Or, making a request to a database is also a data plane > operation. The content of resource logs varies by the Azure > service and resource type.

To send subscription level logs to Dynatrace, select **Send subscription activity logs**. If this option is left unchecked, none of the subscription level logs are sent to Dynatrace.

To send Azure resource logs to Dynatrace, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/resource-logs-categories). To filter the set of Azure resources sending logs to Dynatrace, use inclusion and exclusion rules and set the Azure resource tags.

Rules for sending resource logs are:

- When the checkbox for Azure resource logs is selected, by default, logs are forwarded for all resources.
- Azure resources with Include tags send logs to Dynatrace.
- Azure resources with Exclude tags don't send logs to Dynatrace.
- If there's a conflict between inclusion and exclusion rules, exclusion rule applies.

The logs sent to Dynatrace will be charged by Azure. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

> [!NOTE]
> Metrics for virtual machines and App Services can be collected by installing the Dynatrace OneAgent after the Dynatrace resource has been created.

Once you have completed configuring metrics and logs, select **Next: Single sign-on**.

## Configure single sign-on

If your organization uses Azure Active Directory as its identity provider, you can establish single sign-on from the Azure portal to Dynatrace. If your organization uses a different identity provider or you don\'t want to establish single sign-on at this time, you can skip this section.

To establish single sign-on through Azure Active directory, select the checkbox for **Enable single sign-on through Azure Active Directory**.

The Azure portal retrieves the appropriate Dynatrace application from Azure Active Directory. The app matches the Enterprise app you provided in an earlier step.

## Next steps

- [Manage the Dynatrace resource](dynatrace-manage.md)
