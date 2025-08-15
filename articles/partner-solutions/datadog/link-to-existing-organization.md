---
title: Link to existing Datadog
description: This article describes how to use the Azure portal to link to an existing instance of Datadog.
ms.topic: quickstart
ms.date: 12/11/2024


ms.custom: references_regions
---

# QuickStart: Link to existing Datadog organization

In this quickstart, you link to an existing organization of Datadog.

> [!NOTE] 
> You can either [create a new Datadog organization](create.md) or link to an existing Datadog organization.

## Prerequisites

[!INCLUDE [create-prerequisites-owner](../includes/create-prerequisites-owner.md)]
- You must [configure your environment](prerequisites.md).
- You must [subscribe to Datadog](overview.md#subscribe-to-datadog).

## Create a Datadog resource

Begin by signing in to the [Azure portal](https://portal.azure.com/).

1. Type the name of the service in the header search bar.

1. Choose the service from the *Services* search results.

1. Select the **+ Create** option under **Link Azure subscription to an existing Datadog org**.

The **Create** resource pane shows in the working pane with the *Basics* tab open by default.

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- Datadog organization details

:::image type="content" source="media/create/link-existing-basics-tab.png" alt-text="A screenshot of the Link Azure subscription to an existing Datadog organization options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in the first two sections that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group or create a new one.       |

1. Enter the values for each required setting under *Azure Resource details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    | Resource name      | Specify a unique name for the resource.   |
    | Location           | Select a region to deploy your resource.  |

1. Select **Link to Datadog organization** under *Datadog organization details*.

    A new window appears for **Log in to Datadog**.

    > [!IMPORTANT]
    > 
    > - By default, Azure links your current Datadog organization to your Datadog resource. If you would like to link to a different organization, select the appropriate organization in the authentication window.
    > - You can't link the subscription to the same organization through a different Datadog resource if the subscription is already linked to an organization to avoid duplicate logs and metrics being shipped to the same organization for the same subscription. 

    Once you finish authenticating, return to the Azure portal.

1. Select the **Next** button at the bottom of the page.

### Metrics and logs tab (optional)

If you wish, you can configure resources to send metrics/logs to Datadog.

Enter the names and values for each *Action* listed under Metrics and Logs.

- Select **Silence monitoring for expected Azure VM Shutdowns**.
- Select **Collect custom metrics from App Insights**.
- Select **Send subscription activity logs**.
- Select **Send Azure resource logs for all defined sources**.

#### Inclusion and exclusion rules for metrics and logs

To filter the set of Azure resources that send logs to Datadog, use inclusion and exclusion rules and set Azure resource tags.

- All Azure resources with tags defined in include rules send logs to Datadog.
- All Azure resources with tags defined in exclude rules don't send logs to Datadog.

> [!NOTE]
> If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

Select the **Next** button at the bottom of the page.

### Security tab (optional)

If you wish to enable Datadog Cloud Security Posture management, select the checkbox.

Select the **Next** button at the bottom of the page.

### Single sign-on tab (optional)

If your organization uses Microsoft Entra ID as its identity provider, you can establish single sign-on from the Azure portal to Datadog. 

To establish single sign-on through Microsoft Entra ID:

1. Select the checkbox.

    The Azure portal retrieves the appropriate Datadog application from Microsoft Entra ID, which matches the Enterprise app you provided previously. 

1. Select the Datadog app name.

Select the **Next** button at the bottom of the page.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Manage settings for your Datadog resource via Azure portal](manage.md)

