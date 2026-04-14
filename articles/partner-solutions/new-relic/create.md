---
title: "Quickstart: Get started with Azure Native New Relic Service"
description: Learn how to create an Azure Native New Relic Service in the Azure portal.
ms.topic: quickstart
ms.date: 12/15/2025
---

# Quickstart: Get started with Azure Native New Relic Service

In this quickstart, you create an instance of Azure Native New Relic Service.

## Prerequisites

- An Azure account with an active subscription is required. If you don't have one, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The Owner or Contributor role for your Azure subscription. Only users who are assigned one of these roles can set up integration between Azure and New Relic. Before you begin, [verify that you have the appropriate access](../../role-based-access-control/check-access.md).
 
## Create a New Relic SaaS subscription

Begin by signing in to the [Azure portal](https://portal.azure.com/).

1. In the Azure portal, in the search box, enter **Marketplace**. Select **Marketplace**. 
1. In the Marketplace search box, enter **New Relic**.
1. Select the **Azure Native New Relic Service: New Relic Azure** card.
1. On the **Azure Native New Relic Service: New Relic Cloud Monitoring** page, select **Subscribe**.

### Basics tab

The *Basics* tab has two sections:

- Project details
- SaaS details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Subscribe To Azure Native New Relic Service options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group or create a new one.       |

1. Enter the values for each required setting under *SaaS details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    |     Name   |   Enter a name for the SaaS subscription.  | 

### Tags tab (optional)

Optionally, you can create tags for your resource. Then select **Review + subscribe**.

### Review + subscribe tab 

If the review finds no errors, the **Subscribe** button becomes active. Select **Create**.

If the review identifies errors, a red dot appears next to each section where errors exist. To fix errors:

1. Open each section that has errors and fix the errors.

1. Fields with errors are highlighted in red.

1. Select **Review + subscribe** again.

1. Select **Subscribe**.

The message "Your SaaS subscription is in progress" appears. When the deployment is complete, the message "Almost done! Next, configure your account on the publisher's website" appears in the upper-right corner of the Azure portal.
 
1. Select **Configure account now**.

1. On the **SaaS Overview** page, you'll see your new resource. Select the checkbox next to the resource, and then select **Activate Resource**. 

1. After the resource is activated, you'll see the message "Your SaaS subscription is activated successfully." Select **Configure Organization**.  

1. You'll see the **Create a New Relic Resource in Azure** page.  

## Create a New Relic resource in Azure 

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- New Relic account details 

:::image type="content" source="media/create/basics-azure-resource.png" alt-text="A screenshot of the Create a New Relic resource in Azure options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    |     Subscription   |  Select the subscription that contains the resources that you want to monitor.   |
    |Resource group|Use an existing resource group or create a new one.| 

1. Enter the values for each required setting under *Azure resource details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    |    Resource name   |  Enter a name for the Azure resource.    |
    |Region|Select the region in which to create the resource.| 

1. Enter the value for the required setting under *New Relic account details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    |   Organization    |Select **Create new** or **Associate with existing**.       |

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
