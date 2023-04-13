---
title: 'Quickstart: Create a Microsoft Purview (formerly Azure Purview) account'
description: This Quickstart describes how to create a Microsoft Purview (formerly Azure Purview) account and configure permissions to begin using it.
author: nayenama
ms.author: nayenama
ms.date: 01/13/2023
ms.topic: quickstart
ms.service: purview
ms.custom: mode-ui
---
# Quickstart: Create an account in the Microsoft Purview governance portal

This quickstart describes the steps to Create a Microsoft Purview (formerly Azure Purview) account through the Azure portal. Then we'll get started on the process of classifying, securing, and discovering your data in the Microsoft Purview Data Map!

The Microsoft Purview governance portal surfaces tools like the Microsoft Purview Data Map and Microsoft Purview Data Catalog that help you manage and govern your data landscape. By connecting to data across your on-premises, multicloud, and software-as-a-service (SaaS) sources, the Microsoft Purview Data Map creates an up-to-date map of your data estate. It identifies and classifies sensitive data, and provides end-to-end linage. Data consumers are able to discover data across your organization, and data administrators are able to audit, secure, and ensure right use of your data.

For more information about the governance capabilities of Microsoft Purview, formerly Azure Purview, [see our overview page](overview.md). For more information about deploying Microsoft Purview governance services across your organization, [see our deployment best practices](deployment-best-practices.md).

[!INCLUDE [purview-quickstart-prerequisites](includes/purview-quickstart-prerequisites.md)]

## Create an account

> [!IMPORTANT]
> If you have any [Azure Policies](../governance/policy/overview.md) preventing creation of **Storage accounts** or **Event Hub namespaces**, or preventing **updates to Storage accounts** first follow the [Microsoft Purview exception tag guide](create-azure-purview-portal-faq.md) to create an exception for Microsoft Purview accounts. Otherwise you will not be able to deploy Microsoft Purview.

1. Search for **Microsoft Purview** in the [Azure portal](https://portal.azure.com).

    :::image type="content" source="media/create-catalog-portal/purview-accounts-page.png" alt-text="Screenshot showing the purview accounts page in the Azure portal":::

1. Select **Create** to create a new Microsoft Purview account.

   :::image type="content" source="media/create-catalog-portal/select-create.png" alt-text="Screenshot of the Microsoft Purview accounts page with the create button highlighted in the Azure portal.":::
  
      Or instead, you can go to the marketplace, search for **Microsoft Purview**, and select **Create**.

     :::image type="content" source="media/create-catalog-portal/search-marketplace.png" alt-text="Screenshot showing Microsoft Purview in the Azure Marketplace, with the create button highlighted.":::

1. On the new Create Microsoft Purview account page under the **Basics** tab, select the Azure subscription where you want to create your account.

1. Select an existing **resource group** or create a new one to hold your account.

    To learn more about resource groups, see our article on [using resource groups to manage your Azure resources](../azure-resource-manager/management/manage-resource-groups-portal.md#what-is-a-resource-group).

1. Enter a **Microsoft Purview account name**. Spaces and symbols aren't allowed.
    The name of the Microsoft Purview account must be globally unique. If you see the following error, change the name of Microsoft Purview account and try creating again.

    :::image type="content" source="media/create-catalog-portal/name-error.png" alt-text="Screenshot showing the Create Microsoft Purview account screen with an account name that is already in use, and the error message highlighted.":::

1. Choose a **location**.
    The list shows only locations that support the Microsoft Purview governance portal. The location you choose will be the region where your Microsoft Purview account and meta data will be stored. Sources can be housed in other regions.

      > [!Note]
      > The Microsoft Purview, formerly Azure Purview, does not support moving accounts across regions, so be sure to deploy to the correction region. You can find out more information about this in [move operation support for resources](../azure-resource-manager/management/move-support-resources.md).

1. You can choose a name for your managed resource group. Microsoft Purview will create a managed storage account in this group that it will use during its processes.

1. On the **Networking** tab you can choose to connect to all networks, or to use private endpoints. For more information and configuration options, see [Configure firewall settings for your Microsoft Purview account](catalog-firewall.md) and [private endpoints for Microsoft Purview articles.](catalog-private-link.md)

1. On **Configuration** tab you can choose to configure Event Hubs namespaces to programmatically monitor your Microsoft Purview account using Event Hubs and Atlas Kafka.
    - [Steps to configure Event Hubs namespaces](configure-event-hubs-for-kafka.md)
    - [Send and receive Atlas Kafka topics messages](manage-kafka-dotnet.md)

    :::image type="content" source="media/create-catalog-portal/configure-kafka-event-hubs.png" alt-text="Screenshot showing the Event Hubs configuration page in the Create Microsoft Purview account window.":::

    >[!NOTE]
    > [These options can be configured after you have created your account](configure-event-hubs-for-kafka.md) in **Kafka configuration** under settings on your Microsoft Purview account page in the Azure Portal.
    >
    > :::image type="content" source="media/create-catalog-portal/select-kafka-configuration.png" alt-text="Screenshot showing Kafka configuration option on the Microsoft Purview account page in the Azure Portal.":::

1. Select **Review & Create**, and then select **Create**. It takes a few minutes to complete the creation. The newly created account will appear in the list on your **Microsoft Purview accounts** page.

    :::image type="content" source="media/create-catalog-portal/create-resource.png" alt-text="Screenshot showing the Create Microsoft Purview account screen with the Review + Create button highlighted":::

## Open the Microsoft Purview governance portal

After your account is created, you'll use the Microsoft Purview governance portal to access and manage it. There are two ways to open the Microsoft Purview governance portal:

- You can browse directly to [https://web.purview.azure.com](https://web.purview.azure.com), select your Microsoft Purview account name, and sign in to your workspace.
- Alternatively, open your Microsoft Purview account in the [Azure portal](https://portal.azure.com). Select the **Open Microsoft Purview governance portal** tile on the overview page.
    :::image type="content" source="media/create-catalog-portal/open-purview-studio.png" alt-text="Screenshot showing the Microsoft Purview account overview page, with the Microsoft Purview governance portal tile highlighted.":::

## Next steps

In this quickstart, you learned how to create a Microsoft Purview (formerly Azure Purview) account, and how to access it.

Next, you can create a user-assigned managed identity (UAMI) that will enable your new Microsoft Purview account to authenticate directly with resources using Azure Active Directory (Azure AD) authentication.

To create a UAMI, follow our [guide to create a user-assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity).

Follow these next articles to learn how to navigate the Microsoft Purview governance portal, create a collection, and grant access to the Microsoft Purview Data Map:

* [Using the Microsoft Purview governance portal](use-azure-purview-studio.md)
* [Create a collection](quickstart-create-collection.md)
* [Add users to your Microsoft Purview account](catalog-permissions.md)
