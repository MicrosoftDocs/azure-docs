---
title: "Quickstart: Get started with Azure Native New Relic Service"
description: Learn how to create an Azure Native New Relic Service in the Azure portal.
ms.topic: quickstart
ms.date: 12/01/2025
---

# Quickstart: Get started with Azure Native New Relic Service

In this quickstart, you create an instance of Azure Native New Relic Service.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to New Relic](overview.md#subscribe-to-new-relic).

## Create a New Relic resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

> [!NOTE]
> If you already created New Relic resources, you can link to those resources for monitoring purposes by selecting the **Create** button under *Link an existing New Relic resource*. 

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- New Relic account details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create a New Relic resource in Azure options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group or create a new one.       |

1. Enter the values for each required setting under *Azure Resource details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    | Resource name      | Specify a unique name for the resource.   |
    | Region             | Select a region to deploy your resource.  |

1. Enter the values for each required setting under *New Relic account details*.

    | Field             | Action                                                                                           |
    |-------------------|--------------------------------------------------------------------------------------------------|
    | Organization      | Choose to create a new organization, or associate your resource with an existing organization.   |

    > [!NOTE]
    > If you choose to associate your resource with an existing organization, the resource is billed to that organization's plan. 

    Select the **Change plan** link to [change your billing plan](manage.md#change-billing-plan). 

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.

### Metrics and logs tab (optional)

If you wish, you can configure resources to send metrics/logs to New Relic. For more information, see [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md). 

> [!TIP]
> You can collect metrics for virtual machines and app services by installing the New Relic agent after you create the New Relic resource.

- Select **Enable metrics collection** to set up monitoring of platform metrics.
- Select **Subscription activity logs** to send subscription-level logs to New Relic.
- Select **Azure resource logs** to send Azure resource lots to New Relic. 

After you finish configuring metrics and logs, select **Next**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Set up your New Relic account configuration](https://docs.newrelic.com/docs/infrastructure/microsoft-azure-integrations/get-started/azure-native/#view-your-data-in-new-relic)
- [Manage the New Relic resource in the Azure portal](manage.md)
