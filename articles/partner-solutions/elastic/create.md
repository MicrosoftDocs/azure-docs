---
title: Create Elastic application
description: This article describes how to use the Azure portal to create an instance of Elastic, including Elastic Search, Elastic Observability, and Elastic Security.
ms.topic: quickstart
zone_pivot_groups: elastic-resource-type
ms.date: 12/01/2025
ms.custom: sfi-image-nochange
#customer intent: As an Azure developer, I want to create Elastic resources to use search, log analytics, and security monitoring functions for Azure environments.

---

# QuickStart: Get started with Elastic

In this quickstart, you use the Azure portal to integrate an instance of Elastic with your Azure solutions.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Elastic](overview.md#subscribe-to-elastic).

> [!NOTE]
> The ability to automatically navigate between the Azure portal and Elastic Cloud is enabled by using single sign-on (SSO). This option is automatically enabled and turned on for all Azure users.

## Create an Elastic resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

:::image type="content" source="media/create/create-elastic.png" alt-text="Screenshot shows the create page for Elastic Cloud with options to create Elastic Search, Elastic Observability, and Elastic Security." lightbox="media/create/create-elastic.png":::

::: zone pivot="elastic-search"

Select **Elastic Search**.

### Basics tab

1. In the **Basics** tab, enter values for the settings:

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from the options. You must be an *Owner* or *Contributor*.   |
    | Resource group      | Use an existing resource group or create a new one.       |
    | Resource name       | Specify a unique name for the resource.                   |
    | Hosting Type        | Select **Serverless** or **Cloud Hosted**.                |
    | Configuration (**Serverless** only) | Select **General purpose** or **Optimized for Vectors**.  |
    | Region              | Select a region to deploy your resource.                  |
    | Version (**Cloud Hosted** only) | Select a version.                             |
    | Size (**Cloud Hosted** only) | Review this information.                         |
    | Plan                | To choose a different plan, select **Change plan**.       |
    | Billing term        | Select a value.                                           | 
    | Price + Payment options | Review this information.                              |


1. At the bottom of the page, select **Next: Logs & metrics**.

### Logs & metrics tab (optional)

You can configure resources to send metrics and logs to Elastic.

- Select **Send subscription activity logs**.
- Select **Send Azure resource logs for all defined sources**.

Enter the names and values for each **Action** listed under **Logs**.

At the bottom of the page, select **Next: Azure OpenAI configuration**.

### Azure OpenAI configuration tab

1. Select an existing **Azure OpenAI Resource**.

1. Select an existing **Azure OpenAI Deployment**.

1. At the bottom of the page, select **Next: Tags**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

::: zone-end

::: zone pivot="elastic-observability"

Select **Elastic Observability**.

### Basics tab

1. In the **Basics** tab, enter values for the settings:

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from the options. You must be an *Owner* or *Contributor*.   |
    | Resource group      | Use an existing resource group or create a new one.       |
    | Resource name       | Specify a unique name for the resource.                   |
    | Hosting Type        | Select **Serverless** or **Cloud Hosted**.                |
    | Region              | Select a region to deploy your resource.                  |
    | Version (Cloud Hosted only) | Select a version.                                 |
    | Size (Cloud Hosted only) | Review this information.                             |
    | Plan                | To choose a different plan, select **Change plan**.       |
    | Billing term        | Select a value.                                           | 
    | Price + Payment options | Review this information.                              |

1. At the bottom of the page, select **Next: Logs & metrics**.

### Logs & metrics tab (optional)

You can configure resources to send metrics and logs to Elastic. For more information, see [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md).

- Select **Send subscription activity logs**.
- Select **Send Azure resource logs for all defined sources** (default).

Enter the names and values for each **Action** listed under **Logs**.

At the bottom of the page, select **Next: Azure OpenAI configuration**.

### Azure OpenAI configuration tab

1. Select an existing **Azure OpenAI Resource**.

1. Select an existing **Azure OpenAI Deployment**.

1. At the bottom of the page, select **Next: Tags**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

::: zone-end

::: zone pivot="elastic-security"

Select **Elastic Security**.

### Basics tab

1. In the **Basics** tab, enter values for the settings:

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from the options. You must be an *Owner* or *Contributor*.   |
    | Resource group      | Use an existing resource group or create a new one.       |
    | Resource name       | Specify a unique name for the resource.                   |
    | Hosting Type        | Select **Serverless** or **Cloud Hosted**.                |
    | Region              | Select a region to deploy your resource.                  |
    | Version (Cloud Hosted only) | Select a version.                                 |
    | Size (Cloud Hosted only) | Review this information.                             |
    | Plan                | To choose a different plan, select **Change plan**.       |
    | Billing term        | Select a value.                                           | 
    | Price + Payment options | Review this information.                              |

1. At the bottom of the page, select **Next: Logs & metrics**.

### Logs & metrics tab (optional)

You can configure resources to send metrics and logs to Elastic.

- Select **Send subscription activity logs**.
- Select **Send Azure resource logs for all defined sources** (default).

Enter the names and values for each **Action** listed under **Logs**.

At the bottom of the page, select **Next: Azure OpenAI configuration**.

### Azure OpenAI configuration tab

1. Select an existing **Azure OpenAI Resource**.

1. Select an existing **Azure OpenAI Deployment**.

1. At the bottom of the page, select **Next: Tags**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

::: zone-end

## Next step

> [!div class="nextstepaction"]
> [Manage Elastic resources](manage.md)
