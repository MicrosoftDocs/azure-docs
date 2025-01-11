---
title: Create an instance of Azure Native New Relic Service
description: Learn how to create a resource by using Azure Native New Relic Service.
ms.topic: quickstart
ms.date: 01/10/2025
---

# Quickstart: Get started with Azure Native New Relic Service

In this quickstart, you create an instance of Azure Native New Relic Service. You can either [create a New Relic account](create.md) or [link to an existing New Relic account](link-to-existing.md).

## Prerequisites

- [!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to New Relic](overview.md#subscribe-to-new-relic).

## Create a New Relic resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

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

Your next step is to configure metrics and logs on the **Metrics and Logs** tab. When you're creating the New Relic resource, you can set up metrics monitoring and automatic log forwarding:

1. To set up monitoring of platform metrics for Azure resources by New Relic, select **Enable metrics collection**. If you leave this option cleared, New Relic doesn't pull metrics.

1. To send subscription-level logs to New Relic, select **Subscription activity logs**. If you leave this option cleared, no subscription-level logs are sent to New Relic.

   These logs provide insight into the operations on your resources at the [control plane](/azure/azure-resource-manager/management/control-plane-and-data-plane). These logs also include updates on service-health events.

   Use the activity log to determine what, who, and when for any write operations (`PUT`, `POST`, `DELETE`). There's a single activity log for each Azure subscription.

1. To send Azure resource logs to New Relic, select **Azure resource logs** for all supported resource types. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](/azure/azure-monitor/essentials/resource-logs-categories).

   These logs provide insight into operations that were taken on an Azure resource at the [data plane](/azure/azure-resource-manager/management/control-plane-and-data-plane). For example, getting a secret from a key vault is a data plane operation. Making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

   :::image type="content" source="media/create/metrics.png" alt-text="Screenshot of the tab for logs in a New Relic resource, with resource logs selected.":::

1. When the checkbox for Azure resource logs is selected, logs are forwarded for all resources by default. To filter the set of Azure resources that send logs to New Relic, use inclusion and exclusion rules and set Azure resource tags:

   - All Azure resources with tags defined in include rules send logs to New Relic.
   - All Azure resources with tags defined in exclude rules don't send logs to New Relic.
   - If there's a conflict between inclusion and exclusion rules, the exclusion rule applies.

   Azure charges for logs sent to New Relic. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

   > [!NOTE]
   > You can collect metrics for virtual machines and app services by installing the New Relic agent after you create the New Relic resource.

1. After you finish configuring metrics and logs, select **Next**.

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
