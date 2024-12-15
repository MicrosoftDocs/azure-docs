---
title: Link to existing Datadog
description: This article describes how to use the Azure portal to link to an existing instance of Datadog.
ms.topic: quickstart
ms.date: 12/11/2024


ms.custom: references_regions
---

# QuickStart: Link to existing Datadog organization

In this quickstart, you link to an existing organization of Datadog. You can either [create a new Datadog organization](create.md) or link to an existing Datadog organization.

## Prerequisites

Before creating your first instance of Datadog, [configure your environment](prerequisites.md). These steps must be completed before continuing with the next steps in this quickstart.

## Find offer

Use the Azure portal to find Datadog.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

1. In the Marketplace, search for **Datadog - An Azure Native ISV Service**.

1. In the plan overview screen, select **Set up + subscribe**.

## Link to existing Datadog organization

The portal displays a selection asking whether you would like to create a Datadog organization or link Azure subscription to an existing Datadog organization.

If you're linking to an existing Datadog organization, select **Create** under the **Link Azure subscription to an existing Datadog organization**

You can link your new Datadog resource in Azure to an existing Datadog organization in **US3**.

The portal displays the Create a Datadog resource pane.

## Create a Datadog resource

The Create a Datadog resource pane opens to the *Basics* tab by default.

:::image type="content" source="media/create-new-datadog-resource.png" alt-text="A screenshot of the Azure portal with the Create a new Datadog resource options displayed.":::

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

Select **Link to Datadog organization**. The link opens a Datadog authentication window. Sign in to Datadog.

By default, Azure links your current Datadog organization to your Datadog resource. If you would like to link to a different organization, select the appropriate organization in the authentication window.

Select **Next: Metrics and logs** to configure metrics and logs.

> [!NOTE]
> If the subscription is already linked to an organization through a Datadog resource, an attempt to link the subscription to the same organization through a different Datadog resource would be blocked. It's blocked to avoid scenarios where duplicate logs and metrics get shipped to the same organization for the same subscription.

### Metrics and logs tab

Use Azure resource tags to configure which metrics and logs are sent to Datadog. You can include or exclude metrics and logs for specific resources.

Enter the names and values for each *Action* listed under Metrics and Logs.

<!--Metrics-->
<!--Silence monitoring for expected Azure VM Shutdowns-->
<!--Collect custom metrics from App Insights-->

<!--Logs-->
<!--Send subscription activity logs-->
<!--Send Azure resource logs for all defined sources.-->

Once you complete the configuration for metrics and logs, select **Next: Security**.

## Security tab

To enable Datadog Cloud Security Posture management, select the checkbox.

Select **Single sign-on**.

## Single sign-on tab (optional)

If your organization uses Microsoft Entra ID as its identity provider, you can establish single sign-on from the Azure portal to Datadog. 

To establish single sign-on through Microsoft Entra ID, select the checkbox.

The Azure portal retrieves the appropriate Datadog application from Microsoft Entra ID, which matches the Enterprise app you provided previously. 

Select the Datadog app name.

Select **Next: Tags**.

## Tags tab (optional)

If you wish, you can optionally create tags resource, then select the **Next: Review + create** button at the bottom of the page. 

Select Next: Review + create.

## Review + create tab

If the review identifies errors, a red dot appears next each section where errors exist. Fields with errors are highlighted in red. 

1. Open each section with errors and fix the errors.

1. Select the **Review + create** button again.

1. Select the **Create** button.

Once the resource is created, select **Go to Resource** to navigate to the Datadog resource. 

:::image type="content" source="media/go-to-resource.png" alt-text="A screenshot of the Overview for a newly created Datadog resource with the Go to Resource button emphasized.":::

## Next steps

- [Manage the Datadog resource](manage.md)
- Get started with Datadog – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview)
