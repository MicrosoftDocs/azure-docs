---
title: Create Dynatrace application - Azure partner solutions
description: This article describes how to use the Azure portal to link to an instance of Dynatrace.
ms.topic: quickstart
ms.service: partner-services
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022


---

# Link to an existing Dynatrace environment

In this quickstart, you link an Azure subscription to an existing Dynatrace environment. This allows you to monitor the linked Azure subscription and the resources in that subscription using the Dynatrace environment.

When using the integrated experience in Azure portal, the following entities are used and linkages are established for monitoring and billing purposes.

- **Dynatrace resource in Azure** - Using the Dynatrace resource, you can manage the Dynatrace environment in Azure. The resource is created in the Azure subscription and resource group that you select during the linking process.
- **Dynatrace environment** - this is the Dynatrace environment on Dynatrace SaaS. When you choose to link an existing environment, a new Dynatrace resource is created in Azure. The Dynatrace environment and the Dynatrace resource must reside in the same region.
- **Marketplace SaaS resource** - the SaaS resource is used for billing purposes. This typically resides in a different Azure subscription in which the Dynatrace environment was first created.

\$TODO: Screenshot showing entities in linking

## Prerequisites

Before you link the subscription to a Dynatrace environment, [complete pre-deployment configuration](#configure-pre-deployment).

## Find Offer

Use the Azure portal to find Dynatrace.

1. Go to the [Azure portal](https://portal.azure.com) and sign in.

2. If you've visited the Marketplace in a recent session, select the icon from the available options. Otherwise, search for Marketplace.

    \$TODO: Marketplace in recent Azure services screenshot

3. In the Marketplace, search for Dynatrace.

4. In the plan overview screen, select **Setup + subscribe**.

    \$TODO: Dynatrace offer screenshot.

## Link to existing Dynatrace environment

The portal displays two options: one to create a new Dynatrace environment, and another to link Azure subscription to an existing Dynatrace environment.

1. If you are linking the Azure subscription to an existing Dynatrace environment, select **Create** under the **Link Azure subscription to an existing Dynatrace environment** option**.**
    \$TODO: Create versus link options, created under link highlighted.

1. The process creates a new Dynatrace resource in Azure and links it to an existing Dynatrace environment hosted on Azure. The portal displays a form to create the Dynatrace resource.
    \$TODO: Link -- Basics tab.

1. Provide the following values.


|**Property**   | **Description**  |
|---------|---------|
| Subscription |       Select the Azure subscription you want to use for creating the Dynatrace resource. This subscription will be linked the to environment for monitoring purposes. |
| Resource Group |     Specify whether you want to create a new resource group or use an existing one. A [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview#resource-groups) is a container that holds related resources for an Azure solution. |
| Resource name   |    Specify a name for the Dynatrace resource.|
| Region | Select the Azure region where the Dynatrace resource should be created.|
| Dynatrace | The Azure portal displays a list of existing environments that can be linked. Select the desired environment environment from the available options. |

> [!NOTE]
> Linking requires that the environment and the Dynatrace resource reside in the same Azure region. The user that is performing the linking action should have administrator permissions on the Dynatrace environment being linked. If the environment that you want to link to does not appear in the dropdown list, check if any of these conditions are not satisfied.

1. Select **Next: Metrics and logs** to configure metrics and logs.

## Configure metrics and logs

When linking an existing Dynatrace environment, you can setup automatic log forwarding for two types of logs:

- **Subscription activity logs** -- These logs provide insight into the operations on your resources at the [control plane](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane). Updates on service-health events are also included. Use the activity log to determine the what, who, and when for any write operations (PUT, POST, DELETE). There\'s a single activity log for each Azure subscription.
- **Azure resource logs** -- These logs provide insight into operations that were taken on an Azure resource at the [data plane](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/control-plane-and-data-plane). For example, getting a secret from a Key Vault is a data plane operation. Or, making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

To send subscription level logs to Dynatrace, select **Send subscription activity logs**. If this option is left unchecked, none of the subscription level logs are sent to Dynatrace.

To send Azure resource logs to Dynatrace, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/resource-logs-categories). To filter the set of Azure resources sending logs to Dynatrace, use inclusion and exclusion rules and set the Azure resource tags.

Rules for sending resource logs are:

- When the checkbox for Azure resource logs is selected, by default, logs are forwarded for all resources.
- Azure resources with Include tags send logs to Dynatrace.
- Azure resources with Exclude tags don't send logs to Dynatrace.
- If there's a conflict between inclusion and exclusion rules, exclusion rule applies.

The logs sent to Dynatrace will be charged by Azure. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

Metrics for virtual machines and App Services can be collected by installing the Dynatrace OneAgent after the Dynatrace resource has been created and an existing Dynatrace environment has been linked to it.

Once you have completed configuring metrics and logs, select **Next: Single sign-on**.

If you are linking the Dynatrace resource to an existing Dynatrace environment, you cannot setup single sign-on at this step. Instead, you can setup single sign-on after creating the Dynatrace resource. For more information, see Reconfigure single sign-on \[\$TODO: Hylerink required\].

1. Select **Next: Tags**.

## Add custom tags

You can specify tags for the new Dynatrace resource. Provide name and value pairs for the tags to apply to the Dynatrace resource.

\$TODO: Screenshot tags

When you've finished adding tags, select **Next: Review+Create.**

**Review + Create Dynatrace resource**

Review your selections and the terms of use. After validation completes, select **Create.**

\$TODO: Screenshot review+create

Azure deploys the Dynatrace resource. When the process completes, select "Go to resource" to see the Dynatrace resource.

## Next steps

- [Manage the Dynatrace resource](dynatrace-manage.md)
