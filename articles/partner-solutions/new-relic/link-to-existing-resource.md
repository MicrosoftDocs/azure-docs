---
title: Link to an existing New Relic organization
description: Learn how to link to an existing New Relic account.

ms.topic: quickstart
ms.date: 02/16/2023
---


# Quickstart: Link to an existing New Relic organization

In this quickstart, you link an Azure subscription to an existing New Relic account. You can then monitor the linked Azure subscription and the resources in that subscription by using the New Relic account.

## Prerequisites

- [!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to New Relic](overview.md#subscribe-to-new-relic).

## Link to an existing New Relic account

1. When you're creating a New Relic resource, you have two options. One creates a New Relic account, and the other links an Azure subscription to an existing New Relic account. When you complete this process, you create a New Relic resource on Azure that links to an existing New Relic account.

    For this example, use the **Link an existing New Relic resource** option and select **Create**.

   :::image type="content" source="media/new-relic-link-to-existing/new-relic-create.png" alt-text="Screenshot that shows two options for creating a New Relic resource on Azure.":::

The **Create** resource pane displays in the working pane with the *Basics* tab open by default.

### Basics tab

<!--new-relic-basics-tab-->

The *Basics* tab has 3 sections:

- Project details
- Azure resource details
- New Relic account details

There are required fields in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    |Field  |Action  |
    |---------|---------|
    |Subscription    |Select a subscription from your existing subscriptions.         |
    |Resource group     |Use an existing resource group or create a new one.          |

1. Enter the values for each required setting under *Azure Resource details*.

    |Field |Action  |
    |---------|---------|
    |Resource name     |Specify a unique name for the resource.    |
    |Region     |Select a region to deploy your resource.         |

1. Enter the values for each required setting under *New Relic account details*.

    |Field  |Action  |
    |---------|---------|
    |Organization     |Choose to create a new organization, or associate your resource with an existing organization.   |

    :::image type="content" source="media/create/organization.png" alt-text="A screenshot of the Create a New Relic resource options in Azure portal . The New Relic account details **Organization** options are emphasized. ":::

    > [!NOTE]
    > 
    > If you choose to create a new organization, select **Change plan**.
    > - Available plans are displayed in the working pane. 
    > - Choose the plan you prefer, then select **Change plan**.
    > If you choose to associate your resource with an existing organization, the resource is billed to that organization's plan. 

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.

### Configure metrics and logs tab

<!--new-relic-metrics-and-logs-tab-->

To set up monitoring of platform metrics for Azure resources by New Relic, select **Enable metrics collection**.

To send subscription-level logs to New Relic, select **Subscription activity logs**.

To send Azure resource logs to New Relic, select **Azure resource logs** for all supported resource types.

:::image type="content" source="media/create/metrics.png" alt-text="Screenshot of the tab for logs in a New Relic resource, with resource logs selected.":::

When the checkbox for Azure resource logs is selected, logs are forwarded for all resources by default.

To filter the set of Azure resources that send logs to New Relic, use inclusion and exclusion rules and set Azure resource tags:

- All Azure resources with tags defined in include rules send logs to New Relic.
- All Azure resources with tags defined in exclude rules don't send logs to New Relic.
- If there's a conflict between inclusion and exclusion rules, the exclusion rule applies.

> [!TIP]
> You can collect metrics for virtual machines and app services by installing the New Relic agent after you create the New Relic resource.

1. After you finish configuring metrics and logs, select **Next**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

## Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Manage the New Relic resource](new-relic-how-to-manage.md)
- [Quickstart: Get started with New Relic](new-relic-create.md)
- Get started with Azure Native New Relic Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/NewRelic.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/newrelicinc1635200720692.newrelic_liftr_payg?tab=Overview)
