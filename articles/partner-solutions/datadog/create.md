---
title: Create Datadog - Azure partner solutions
description: This article describes how to use the Azure portal to create an instance of Datadog.
ms.service: partner-services
ms.topic: quickstart
ms.date: 05/28/2021
author: tfitzmac
ms.author: tomfitz
ms.custom: references_regions
---

# QuickStart: Get started with Datadog by creating new instance

In this quickstart, you'll create a new instance of Datadog. You can either create a new Datadog organization or [link to an existing Datadog organization](link-to-existing-organization.md).

## Prerequisites

Before creating your first instance of Datadog in Azure, [configure your environment](prerequisites.md). These steps must be completed before continuing with the next steps in this quickstart.

## Find offer

Use the Azure portal to find Datadog.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

    :::image type="content" source="media/create/marketplace.png" alt-text="Marketplace icon.":::

1. In the Marketplace, search for **Datadog**.

1. In the plan overview screen, select **Set up + subscribe**.

   :::image type="content" source="media/create/datadog-app-2.png" alt-text="Datadog application in Azure Marketplace.":::

## Create a Datadog resource in Azure

The portal displays a selection asking whether you would like to create a Datadog organization or link Azure subscription to an existing Datadog organization.

If you are creating a new Datadog organization, select **Create** under the **Create a new Datadog organization**

:::image type="content" source="media/create/datadog-create-link-selection.png" alt-text="Create or link a Datadog organization" border="true":::

The portal displays a form for creating the Datadog resource.

:::image type="content" source="media/create/datadog-create-resource.png" alt-text="Create Datadog resource" border="true":::

Provide the following values.

|Property | Description
|:-----------|:-------- |
| Subscription | Select the Azure subscription you want to use for creating the Datadog resource. You must have owner access. |
| Resource group | Specify whether you want to create a new resource group or use an existing one. A [resource group](../../azure-resource-manager/management/overview.md#resource-groups) is a container that holds related resources for an Azure solution. |
| Resource name | Specify a name for the Datadog resource. This name will be the name of the new Datadog organization, when creating a new Datadog organization. |
| Location | Select West US 2. Currently, West US 2 is the only supported region. |
| Pricing plan | When creating a new organization, select from the list of available Datadog plans. |
| Billing Term | Monthly. |

## Configure metrics and logs

Use Azure resource tags to configure which metrics and logs are sent to Datadog. You can include or exclude metrics and logs for specific resources.

Tag rules for sending **metrics** are:

- By default, metrics are collected for all resources, except virtual machines, virtual machine scale sets, and app service plans.
- Virtual machines, virtual machine scale sets, and app service plans with *Include* tags send metrics to Datadog.
- Virtual machines, virtual machine scale sets, and app service plans with *Exclude* tags don't send metrics to Datadog.
- If there's a conflict between inclusion and exclusion rules, exclusion takes priority

Tag rules for sending **logs** are:

- By default, logs are collected for all resources.
- Azure resources with *Include* tags send logs to Datadog.
- Azure resources with  *Exclude* tags don't send logs to Datadog.
- If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

For example, the screenshot below shows a tag rule where only those virtual machines, virtual machine scale sets, and app service plans tagged as *Datadog = True* send metrics to Datadog.

:::image type="content" source="media/create/config-metrics-logs.png" alt-text="Configure Logs and Metrics." border="true":::

There are two types of logs that can be emitted from Azure to Datadog.

1. **Subscription level logs** - Provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). Updates on service health events are also included. Use the activity log to determine the what, who, and when for any write operations (PUT, POST, DELETE). There's a single activity log for each Azure subscription.

1. **Azure resource logs** - Provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a Key Vault is a data plane operation. Or, making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

To send subscription level logs to Datadog, select **Send subscription activity logs**. If this option is left unchecked, none of the subscription level logs are sent to Datadog.

To send Azure resource logs to Datadog, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](../../azure-monitor/essentials/resource-logs-categories.md).  To filter the set of Azure resources sending logs to Datadog, use Azure resource tags.

The logs sent to Datadog will be charged by Azure. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

Once you have completed configuring metrics and logs, select **Next: Single sign-on**.

## Configure single sign-on

If your organization uses Azure Active Directory as its identity provider, you can establish single sign-on from the Azure portal to Datadog. If your organization uses a different identity provider or you don't want to establish single sign-on at this time, you can skip this section.

To establish single sign-on through Azure Active directory, select the checkbox for **Enable single sign-on through Azure Active Directory**.

The Azure portal retrieves the appropriate Datadog application from Azure Active Directory. The app matches the Enterprise app you provided in an earlier step.

Select the Datadog app name.

:::image type="content" source="media/create/sso.png" alt-text="Enable Single sign-on to Datadog." border="true":::

Select **Next: Tags**.

## Add custom tags

You can specify custom tags for the new Datadog resource. Provide name and value pairs for the tags to apply to the Datadog resource.

:::image type="content" source="media/create/tags.png" alt-text="Add custom tags for the Datadog resource." border="true":::

When you've finished adding tags, select **Next: Review+Create**.

## Review + Create Datadog resource

Review your selections and the terms of use. After validation completes, select **Create**.

:::image type="content" source="media/create/review-create.png" alt-text="Review and Create Datadog resource." border="true":::

Azure deploys the Datadog resource.

When the process completes, select **Go to Resource** to see the Datadog resource.

:::image type="content" source="media/create/go-to-resource.png" alt-text="Datadog resource deployment." border="true":::

## Next steps

> [!div class="nextstepaction"]
> [Manage the Datadog resource](manage.md)
