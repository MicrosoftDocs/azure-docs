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

> [!NOTE]
> 
> When you're linking an existing New Relic account, you can set up automatic log forwarding for two types of logs:
> - **Send subscription activity logs**: These logs provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). The logs also include updates on service-health events.
> Use the activity log to determine what, who, and when for any write operations (`PUT`, `POST`, `DELETE`). There's a single activity log for each Azure subscription.
> - **Azure resource logs**: These logs provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a key vault is a data plane operation. Making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.
> :::image type="content" source="media/new-relic-link-to-existing/new-relic-metrics.png" alt-text="Screenshot that shows the tab for metrics and logs, with actions to complete.":::

1. To send Azure resource logs to New Relic, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor resource log categories](/azure/azure-monitor/essentials/resource-logs-categories).

1. When the checkbox for Azure resource logs is selected, logs are forwarded for all resources by default. To filter the set of Azure resources that are sending logs to New Relic, use inclusion and exclusion rules and set the Azure resource tags:

   - All Azure resources with tags defined in include rules send logs to New Relic.
   - All Azure resources with tags defined in exclude rules don't send logs to New Relic.
   - If there's a conflict between inclusion and exclusion rules, the exclusion rule applies.

   Azure charges for logs sent to New Relic. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

   > [!NOTE]
   > You can collect metrics for virtual machines and app services by installing the New Relic agent after you create the New Relic resource and link an existing New Relic account to it.
``
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
