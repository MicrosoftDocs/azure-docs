---
title: Create an instance of Azure Native New Relic Service
description: Learn how to create a resource by using Azure Native New Relic Service.
ms.topic: quickstart
ms.date: 01/10/2025
---

# Quickstart: Get started with Azure Native New Relic Service

In this quickstart, you create an instance of Azure Native New Relic Service. You can either [create a New Relic account](create.md) or [link to an existing New Relic account](link-to-existing-resource.md).

## Prerequisites

- [!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to New Relic](overview.md#subscribe-to-new-relic).

## Create a New Relic resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

> [!NOTE]
> If you have created New Relic resources previously, you can link to those resources for monitoring purposes by selecting the **Create** button under *Link an existing New Relic resource*. 

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

    :::image type="content" source="media/create/organization.png" alt-text="A screenshot of the Create a New Relic resource options in Azure portal. The New Relic account details **Organization** options are emphasized. ":::

    If you choose to create a new organization, select **Change plan**.

    - Available plans are displayed in the working pane. 
    - Choose the plan you prefer, then select **Change plan**.
    
    If you choose to associate your resource with an existing organization, the resource is billed to that organization's plan. 

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.
1. 
1. <!--end--new-relic-basics-tab-->

### Configure metrics and logs tab (optional)

<!--new-relic-configure-metrics-and-logs-tab-->

- Select **Enable metrics collection** to set up monitoring of platform metrics.
- Select **Subscription activity logs** to send subscription-level logs to New Relic.
- Select **Azure resource logs** to send Azure resource lots to New Relic. 

> [!NOTE]
> When the checkbox for Azure resource logs is selected, logs are forwarded for all resources by default.

#### Inclusion and exclusion rules for metrics and logs

To filter the set of Azure resources that send logs to New Relic, use inclusion and exclusion rules and set Azure resource tags:

- All Azure resources with tags defined in include rules send logs to New Relic.
- All Azure resources with tags defined in exclude rules don't send logs to New Relic.
- If there's a conflict between inclusion and exclusion rules, the exclusion rule applies.

> [!TIP]
> You can collect metrics for virtual machines and app services by installing the New Relic agent after you create the New Relic resource.

1. After you finish configuring metrics and logs, select **Next**.

<!--end-new-relic-configure-metrics-and-logs-tab-->

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Manage the New Relic resource](manage.md)
- [Setting up your New Relic account config](https://docs.newrelic.com/docs/infrastructure/microsoft-azure-integrations/get-started/azure-native/#view-your-data-in-new-relic)
- Get started with Azure Native New Relic Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/NewRelic.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/newrelicinc1635200720692.newrelic_liftr_payg?tab=Overview)
