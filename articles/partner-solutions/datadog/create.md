---
title: Create a Datadog resource
description: Get started with Datadog on Azure by creating a new resource, configuring metrics and logs, and setting up single sign-on through Microsoft Entra ID.

ms.topic: quickstart
ms.date: 12/11/2024
ms.custom:
  - references_regions
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/03/2024
---

# QuickStart: Get started with Datadog

In this quickstart, you create a new instance of Datadog. You can either create a new Datadog organization or [link to an existing Datadog organization](link-to-existing-organization.md).

## Prerequisites

Before creating your first instance of Datadog in Azure, [configure your environment](prerequisites.md). 

## Setup

Begin by signing into the [Azure portal](https://portal.azure.com).

## Create a Datadog resource

To create your resource, start at the Azure portal home page.

1. Search for the resource provider by typing it into the header search bar.

1. Choose the service you want from the *Services* search results.

1. Select the **+ Create** option.

The portal displays a selection asking whether you would like to create a Datadog organization or link Azure subscription to an existing Datadog organization.

:::image type="content" source="media/create-datadog-resource.png" alt-text="A screenshot of Azure portal with the Create a Datadog resource in Azure options displayed.  Two tiles are available: Link Azure subscription to an existing Datadog org and Create a new Datadog org. Each of these options has a create button and a link to learn more.":::

If you're creating a new Datadog organization, select **Create** under the **Create a new Datadog organization**

The Create a Datadog resource pane opens to the *Basics* tab by default.

:::image type="content" source="media/create-new-datadog-resource.png" alt-text="A screenshot of the Azure portal with the Create a a new Datadog resource options displayed. The menu has multiple tabs: Basics, Metrics and logs, Security, Single sign-on, Tags, and Review + Create.":::

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- Datadog organization details

There are required fields in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    |Setting            |Action                                                       |
    |-------------------|-------------------------------------------------------------|
    |Subscription       |Select a subscription from your existing subscriptions.      |
    |Resource group     |Use an existing resource group or create a new one.          |

1. Enter the values for each required setting under *Resource details*.

    |Setting            |Action                                                       |
    |-------------------|-------------------------------------------------------------|
    |Resource name      |Specify a unique name for the resource.                      |
    |Location           |Select the [region](https://azure.microsoft.com/explore/global-infrastructure/geographies/) where you want to enable this service and its child resources to be located.                                                |

1. Enter the values for each required setting under *Datadog organization details*.

### Metrics and logs tab

Use Azure resource tags to configure which metrics and logs are sent to Datadog. You can include or exclude metrics and logs for specific resources.

Enter the names and values for each *Action* listed under Metrics and Logs.

<!--Metrics-->
<!--Silence monitoring for expected Azure VM Shutdowns-->
<!--Collect custom metrics from App Insights-->

<!--Logs-->
<!--Send subscription activity logs-->
<!--Send Azure resource logs for all defined sources.-->


<!--This information should not be in this quickstart. Move to conceptual article.  Also, review the information UI: To send Microsoft Entra ID logs to Datadog – enable Datadog as a destination in Microsoft Entra ID diagnostic settings.
Learn more-->

> [!NOTE]
> If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

Metrics are collected for all resources, except virtual machines, Virtual Machine Scale Sets, and App Service plans which can be filtered by tags.

- Virtual machines, Virtual Machine Scale Sets, and App Service plan with _Include_ tags send metrics to Datadog.
- Virtual machines, Virtual Machine Scale Sets, and App Service plan with _Exclude_ tags don't send metrics to Datadog.

Logs for all defined sources will be sent to Datadog based on the tags inclusion/exclusion criteria. By default, logs are collected for all resources.

- Azure resources with _Include_ tags send logs to Datadog. 
- Azure resources with _Exclude_ tags don't send logs to Datadog.

There are three types of logs that can be sent from Azure to Datadog.

1. **Subscription level logs** - Provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). Updates on service health events are also included. Use the activity log to determine the what, who, and when for any write operations (PUT, POST, DELETE). There's a single activity log for each Azure subscription.

1. **Azure resource logs** - Provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a Key Vault is a data plane operation. Or, making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

1. **Microsoft Entra logs** - As an IT administrator, you want to monitor your IT environment. The information about your system's health enables you to assess potential issues and decide how to respond.

The Microsoft Entra admin center gives you access to three activity logs:

- [Sign-in](../../active-directory/reports-monitoring/concept-sign-ins.md) – Information about sign-ins and how your resources are used by your users.
- [Audit](../../active-directory/reports-monitoring/concept-audit-logs.md) – Information about changes applied to your tenant such as users and group management or updates applied to your tenant's resources.
- [Provisioning](../../active-directory/reports-monitoring/concept-provisioning-logs.md) – Activities performed by the provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday.

To send subscription level logs to Datadog, select **Send subscription activity logs**. If this option is left unchecked, none of the subscription level logs are sent to Datadog.

To send Azure resource logs to Datadog, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](/azure/azure-monitor/essentials/resource-logs-categories). To filter the set of Azure resources sending logs to Datadog, use Azure resource tags.

You can request your IT Administrator to route Microsoft Entra logs to Datadog. For more information, see [Microsoft Entra activity logs in Azure Monitor](../../active-directory/reports-monitoring/concept-activity-logs-azure-monitor.md).

Azure charges for the logs sent to Datadog. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

<!--end-->

Once you complete the configuration for metrics and logs, select **Next: Security**.

## Security tab

To enable Datadog Cloud Security Posture management, select the checkbox.

## Configure single sign-on tab (optional)

If your organization uses Microsoft Entra ID as its identity provider, you can establish single sign-on from the Azure portal to Datadog. 

To establish single sign-on through Microsoft Entra ID, select the checkbox.

The Azure portal retrieves the appropriate Datadog application from Microsoft Entra ID, which matches the Enterprise app you provided previously. 

Select the Datadog app name.

Select **Next: Tags**.

## Tags tab (optional)

If you wish, you can optionally create tags resource, then select the **Next: Review + create** button at the bottom of the page. 

## Review + create tab

If the review identifies errors, a red dot appears next each section where errors exist. Fields with errors are highlighted in red. 

1. Open each section with errors and fix the errors.

1. Select the **Review + create** button again.

1. Select the **Create** button.

Once the resource is created, select **Go to Resource** to navigate to the Datadog resource. 

## Next steps

- [Manage the Datadog resource](manage.md)
- Get started with Datadog on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview)
