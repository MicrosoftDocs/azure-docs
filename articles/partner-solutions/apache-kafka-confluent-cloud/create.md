---
title: Create Apache Kafka for Confluent Cloud through Azure portal
description: This article describes how to use the Azure portal to create an instance of Apache Kafka for Confluent Cloud.
ms.topic: quickstart
ms.date: 12/14/2021
author: flang-msft
ms.author: franlanglois

---

# QuickStart: Get started with Apache Kafka on Confluent Cloud - Azure portal

In this quickstart, you'll use the Azure portal to create an instance of Apache Kafka on Confluent Cloud.

## Prerequisites

- An Azure account. If you don't have an active Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- You must have the _Owner_ or _Contributor_ role for your Azure subscription. The integration between Azure and Confluent can only be set up by users with _Owner_ or _Contributor_ access. Before getting started, [confirm that you have the appropriate access](../../role-based-access-control/check-access.md).

## Find offer

Use the Azure portal to find the Apache Kafka on Confluent Cloud application.

1. In a web browser, go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

    :::image type="content" source="media/marketplace.png" alt-text="Marketplace icon.":::

1. From the **Marketplace** page, you have two options based on the type of plan you want. You can sign up for a pay-as-you-go plan or commitment plan. Pay-as-you-go is publicly available. The commitment plan is available to customers who have been approved for a private offer.

   - For **pay-as-you-go** customers, search for _Apache Kafka on Confluent Cloud_. Select the offer for Apache Kafka on Confluent Cloud.

     :::image type="content" source="media/search-pay-as-you-go.png" alt-text="search Azure Marketplace offer.":::

   - For **commitment** customers, select the link to **View Private offers**. The commitment requires you to sign up for a minimum spend amount. Use this option only when you know you need the service for an extended time.

     :::image type="content" source="media/view-private-offers.png" alt-text="view private offers.":::

     Look for _Apache Kafka on Confluent Cloud_.

     :::image type="content" source="media/select-from-private-offers.png" alt-text="select private offer.":::

## Create resource

After you've selected the offer for Apache Kafka on Confluent Cloud, you're ready to set up the application.

1. If you selected private offers in the previous section, you'll have two options for plan types:

    - Confluent Cloud - Pay-as-you-go
    - Commitment - for commit plan

   If you didn't select private offers, you'll only have the pay-as-you-go option.

   Pick the plan to use, and select **Set up + subscribe**.

    :::image type="content" source="media/setup-subscribe.png" alt-text="Set up and subscribe.":::

1. On the **Create Confluent Cloud Resource** basics page, provide the following values. When you've finished, select **Next: Tags**.

    :::image type="content" source="media/setup-basics.png" alt-text="Form to set up Confluent Cloud resource.":::

    | Property | Description |
    | ---- | ---- |
    | **Subscription** | From the drop-down menu, select the Azure subscription to deploy to. You must have _Owner_ or _Contributor_ access. |
    | **Resource group** | Specify whether you want to create a new resource group or use an existing resource group. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../../azure-resource-manager/management/overview.md). |
    | **Confluent organization name** | To create a new Confluent organization, select **Create a new organization** and provide a name for the Confluent organization. To link to an existing Confluent organization, select **Link Subscription to an existing organization** option. Select the option **Link to an existing organization**. Sign in to your Confluent account, and select the existing organization. |
    | **Region** | From the drop-down menu, select one of these regions: Australia East, Canada Central, Central US, East US, East US 2, France Central, North Europe, Southeast Asia, UK South, West Central US, West Europe, West US 2 |
    | **Plan** | Select **Pay as you go** or **Commitment**. |
    | **Billing term** | Prefilled based on the selected billing plan. |
    | **Price** | Prefilled based on the selected Confluent plan. |

1. On **Tags**, provide the **name** and **value** pairs for tags you want to apply to resource. After you enter the tags, select **Review + Create**.

    :::image type="content" source="media/setup-tags.png" alt-text="Add project tags.":::

1. Review the settings you provided. When ready, select **Create**.

1. It takes a few minutes to create the resource. You can view the deployment status in **Notifications**. After the deployment is finished, select the resource to view the **Overview** page.

    :::image type="content" source="media/deployment-status.png" alt-text="Deployment status.":::

   If you get an error, see [Troubleshooting Apache Kafka for Confluent Cloud solutions](troubleshoot.md).

## Next steps

   > [!div class="nextstepaction"]
   > [Manage the Confluent Cloud resource](manage.md)

- Get started with Apache Kafka on Confluent Cloud - Azure Native ISV Service on

   > [!div class="nextstepaction"]
   > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

   > [!div class="nextstepaction"]
   > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
