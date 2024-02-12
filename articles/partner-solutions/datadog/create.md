---
title: Create Datadog
description: This article describes how to use the Azure portal to create an instance of Datadog.
author: flang-msft

ms.topic: quickstart
ms.date: 01/06/2023
ms.author: franlanglois
ms.custom: references_regions

---

# QuickStart: Get started with Datadog - An Azure Native ISV Service by creating new instance

In this quickstart, you'll create a new instance of Datadog - An Azure Native ISV Service. You can either create a new Datadog organization or [link to an existing Datadog organization](link-to-existing-organization.md).

## Prerequisites

Before creating your first instance of Datadog in Azure, [configure your environment](prerequisites.md). These steps must be completed before continuing with the next steps in this quickstart.

## Find offer

Use the Azure portal to find Datadog.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

    :::image type="content" source="media/create/marketplace.png" alt-text="Screenshot of the Azure Marketplace icon.":::

1. In the Marketplace, search for **Datadog**.

1. In the plan overview screen, select **Subscribe**.

   :::image type="content" source="media/create/datadog-app-2.png" alt-text="Screenshot of the Datadog application in Azure Marketplace.":::

## Create a Datadog resource in Azure

The portal displays a selection asking whether you would like to create a Datadog organization or link Azure subscription to an existing Datadog organization.

If you're creating a new Datadog organization, select **Create** under the **Create a new Datadog organization**

:::image type="content" source="media/create/datadog-create-link-selection.png" alt-text="Screenshot of the create or link a Datadog organization.":::

The portal displays a form for creating the Datadog resource.

:::image type="content" source="media/create/datadog-create-resource.png" alt-text="Screenshot of the create Datadog resource.":::

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

- By default, metrics are collected for all resources, except virtual machines, Virtual Machine Scale Sets, and App Service plans.
- Virtual machines, Virtual Machine Scale Sets, and App Service plan with _Include_ tags send metrics to Datadog.
- Virtual machines, Virtual Machine Scale Sets, and App Service plan with _Exclude_ tags don't send metrics to Datadog.
- If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

Tag rules for sending **logs** are:

- By default, logs are collected for all resources.
- Azure resources with _Include_ tags send logs to Datadog.
- Azure resources with _Exclude_ tags don't send logs to Datadog.
- If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

For example, the following screenshot shows a tag rule where only those virtual machines, Virtual Machine Scale Sets, and App Service plan tagged as _Datadog = True_ send metrics to Datadog.

:::image type="content" source="media/create/config-metrics-logs.png" alt-text="Screenshot of how to configure metrics and logs in Azure for Datadog.":::

There are three types of logs that can be sent from Azure to Datadog.

1. **Subscription level logs** - Provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). Updates on service health events are also included. Use the activity log to determine the what, who, and when for any write operations (PUT, POST, DELETE). There's a single activity log for each Azure subscription.

1. **Azure resource logs** - Provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a Key Vault is a data plane operation. Or, making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

1. **Microsoft Entra logs** - As an IT administrator, you want to monitor your IT environment. The information about your system's health enables you to assess potential issues and decide how to respond.

The Microsoft Entra admin center gives you access to three activity logs:

- [Sign-in](../../active-directory/reports-monitoring/concept-sign-ins.md) – Information about sign-ins and how your resources are used by your users.
- [Audit](../../active-directory/reports-monitoring/concept-audit-logs.md) – Information about changes applied to your tenant such as users and group management or updates applied to your tenant's resources.
- [Provisioning](../../active-directory/reports-monitoring/concept-provisioning-logs.md) – Activities performed by the provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday.

To send subscription level logs to Datadog, select **Send subscription activity logs**. If this option is left unchecked, none of the subscription level logs are sent to Datadog.

To send Azure resource logs to Datadog, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](../../azure-monitor/essentials/resource-logs-categories.md). To filter the set of Azure resources sending logs to Datadog, use Azure resource tags.

You can request your IT Administrator to route Microsoft Entra logs to Datadog. For more information, see [Microsoft Entra activity logs in Azure Monitor](../../active-directory/reports-monitoring/concept-activity-logs-azure-monitor.md).

The logs sent to Datadog will be charged by Azure. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

Once you have completed configuring metrics and logs, select **Next: Single sign-on**.

## Configure single sign-on

If your organization uses Microsoft Entra ID as its identity provider, you can establish single sign-on from the Azure portal to Datadog. If your organization uses a different identity provider or you don't want to establish single sign-on at this time, you can skip this section.

To establish single sign-on through Microsoft Entra ID, select the checkbox for **Enable single sign-on through Microsoft Entra ID**.

The Azure portal retrieves the appropriate Datadog application from Microsoft Entra ID. The app matches the Enterprise app you provided in an earlier step.

Select the Datadog app name.

:::image type="content" source="media/create/sso.png" alt-text="Screenshot of the enable Single sign-on to Datadog.":::

Select **Next: Tags**.

## Add custom tags

You can specify custom tags for the new Datadog resource. Provide name and value pairs for the tags to apply to the Datadog resource.

:::image type="content" source="media/create/tags.png" alt-text="Screenshot of the add custom tags for the Datadog resource.":::

When you've finished adding tags, select **Next: Review+Create**.

## Review + Create Datadog resource

Review your selections and the terms of use. After validation completes, select **Create**.

:::image type="content" source="media/create/review-create.png" alt-text="Screenshot of Review and Create a Datadog resource.":::

Azure deploys the Datadog resource.

When the process completes, select **Go to Resource** to see the Datadog resource.

:::image type="content" source="media/create/go-to-resource.png" alt-text="Screenshot of the Datadog resource deployment.":::

## Next steps

- [Manage the Datadog resource](manage.md)
- Get started with Datadog – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview)
