---
title: Link to existing Datadog
description: This article describes how to use the Azure portal to link to an existing instance of Datadog.
ms.topic: quickstart
ms.date: 06/01/2023
author: flang-msft
ms.author: franlanglois
ms.custom: references_regions
---

# QuickStart: Link to existing Datadog organization

In this quickstart, you link to an existing organization of Datadog. You can either [create a new Datadog organization](create.md) or link to an existing Datadog organization.

## Prerequisites

Before creating your first instance of Datadog - An Azure Native ISV Service, [configure your environment](prerequisites.md). These steps must be completed before continuing with the next steps in this quickstart.

## Find offer

Use the Azure portal to find Datadog - An Azure Native ISV Service.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

    :::image type="content" source="media/link-to-existing-organization/marketplace.png" alt-text="Marketplace icon.":::

1. In the Marketplace, search for **Datadog - An Azure Native ISV Service**.

1. In the plan overview screen, select **Set up + subscribe**.

   :::image type="content" source="media/link-to-existing-organization/datadog-app-2.png" alt-text="Datadog application in Azure Marketplace.":::

## Link to existing Datadog organization

The portal displays a selection asking whether you would like to create a Datadog organization or link Azure subscription to an existing Datadog organization.

If you're linking to an existing Datadog organization, select **Create** under the **Link Azure subscription to an existing Datadog organization**

:::image type="content" source="media/link-to-existing-organization/datadog-create-link-selection.png" alt-text="Create or link a Datadog organization" border="true":::

You can link your new Datadog resource in Azure to an existing Datadog organization in **US3**.

The portal displays a form for creating the Datadog resource.

:::image type="content" source="media/link-to-existing-organization/link-to-existing.png" alt-text="Link to existing Datadog organization." border="true":::

Provide the following values.

|Property | Description
|:-----------|:-------- |
| Subscription | Select the Azure subscription you want to use for creating the Datadog resource. You must have owner access. |
| Resource group | Specify whether you want to create a new resource group or use an existing one. A [resource group](../../azure-resource-manager/management/overview.md#resource-groups) is a container that holds related resources for an Azure solution. |
| Resource name | Specify a name for the Datadog resource. This name is the name of the new Datadog organization, when creating a new Datadog organization. |
| Location | Select West US 2. Currently, West US 2 is the only supported region. |

Select **Link to Datadog organization**. The link opens a Datadog authentication window. Sign in to Datadog.

By default, Azure links your current Datadog organization to your Datadog resource. If you would like to link to a different organization, select the appropriate organization in the authentication window.

:::image type="content" source="media/link-to-existing-organization/select-datadog-organization.png" alt-text="Select appropriate Datadog organization to link" border="true":::

Select **Next: Metrics and logs** to configure metrics and logs.

If the subscription is already linked to an organization through a Datadog resource, an attempt to link the subscription to the same organization through a different Datadog resource would be blocked. It's blocked to avoid scenarios where duplicate logs and metrics get shipped to the same organization for the same subscription.

:::image type="content" source="media/manage/datadog-subscription-blocked.png" alt-text="Screenshot stating that a subscription is already linked to the selected organization through a different Datadog resource.":::

## Configure metrics and logs

Use Azure resource tags to configure which metrics and logs are sent to Datadog. You can include or exclude metrics and logs for specific resources.

Tag rules for sending **metrics** are:

- By default, metrics are collected for all resources, except **Virtual Machines, Virtual Machine Scale Sets, and App Service Plans**.
- **Virtual Machines, Virtual Machine Scale Sets, and App Service Plans** with *Include* tags send metrics to Datadog.
- **Virtual Machines, Virtual Machine Scale Sets, and App Service Plans** with *Exclude* tags don't send metrics to Datadog.
- If there's a conflict between inclusion and exclusion rules, exclusion takes priority

Tag rules for sending **logs** are:

- By default, logs are collected for all resources.
- Azure resources with *Include* tags send logs to Datadog.
- Azure resources with  *Exclude* tags don't send logs to Datadog.
- If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

For example, the screenshot shows a tag rule where only those **Virtual Machines, Virtual Machine Scale Sets, and App Service Plans** tagged as *Datadog = True* send metrics to Datadog.

:::image type="content" source="media/link-to-existing-organization/config-metrics-logs.png" alt-text="Configure Logs and Metrics." border="true":::

There are two types of logs that can be emitted from Azure to Datadog.

- **Subscription level logs** - Provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). Updates on service health events are also included. Use the activity log to determine the what, who, and when for any write operations (PUT, POST, DELETE). There's a single activity log for each Azure subscription.

- **Azure resource logs** - Provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a Key Vault is a data plane operation. Or, making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

To send subscription level logs to Datadog, select **Send subscription activity logs**. If this option is left unchecked, none of the subscription level logs are sent to Datadog.

To send Azure resource logs to Datadog, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](../../azure-monitor/essentials/resource-logs-categories.md).  To filter the set of Azure resources sending logs to Datadog, use Azure resource tags.

The logs sent to Datadog are charged by Azure. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

Once you have completed configuring metrics and logs, select **Next: Single sign-on**.


## Configure single sign-on

If you're linking the Datadog resource to an existing Datadog organization, you can't set up single sign-on at this step. Instead, you set up single sign-on after creating the Datadog resource. For more information, see [Reconfigure single sign-on](manage.md#reconfigure-single-sign-on).

:::image type="content" source="media/link-to-existing-organization/linking-sso.png" alt-text="Single sign-on for linking to existing Datadog organization." border="true":::

Select **Next: Tags**.

## Add custom tags

You can specify custom tags for the new Datadog resource. Provide name and value pairs for the tags to apply to the Datadog resource.

:::image type="content" source="media/link-to-existing-organization/tags.png" alt-text="Add custom tags for the Datadog resource." border="true":::

When you've finished adding tags, select **Next: Review+Create**.

## Review + Create Datadog resource

Review your selections and the terms of use. After validation completes, select **Create**.

:::image type="content" source="media/link-to-existing-organization/review-create.png" alt-text="Review and Create Datadog resource." border="true":::

Azure deploys the Datadog resource.

When the process completes, select **Go to Resource** to see the Datadog resource.

:::image type="content" source="media/link-to-existing-organization/go-to-resource.png" alt-text="Datadog resource deployment." border="true":::

## Next steps

- [Manage the Datadog resource](manage.md)
- Get started with Datadog – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview)
