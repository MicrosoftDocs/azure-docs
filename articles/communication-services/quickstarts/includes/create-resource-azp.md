---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/30/2021
ms.author: rifox
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).

If you're planning to use phone numbers, you can't use the free trial account. Check that your subscription meets all the [requirements](../../concepts/telephony/plan-solution.md) if you plan to purchase phone numbers before creating your resource. 

## Create Azure Communication Services resource

To create an Azure Communication Services resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the page, select **+ Create a resource**. 

:::image type="content" source="../media/create-a-communication-resource/create-resource-plus-sign.png" alt-text="Screenshot highlighting the Create a resource button in the Azure portal.":::

Enter **Communication** into either the **Search the Marketplace** input or the search bar at the top of the portal.

:::image type="content" source="../media/create-a-communication-resource/searchbar-communication-portal.png" alt-text="Screenshot showing a search for communication services in the search bar.":::

Select **Communication Services** in the results, and then select **Create**.

:::image type="content" source="../media/create-a-communication-resource/create-communication-portal.png" alt-text="Screenshot showing the Communication Services panel, highlighting the Create button.":::

You can now configure your Communication Services resource. On the first page of the create process, you need to specify:

* The subscription
* The [resource group](../../../azure-resource-manager/management/manage-resource-groups-portal.md) (you can create a new one or choose an existing resource group)
* The name of the Communication Services resource
* The geography associated with the resource

In the next step, you can assign tags to the resource. You can use tags to organize your Azure resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../../azure-resource-manager/management/tag-resources.md).

Finally, you can review your configuration and **Create** the resource. Deployment takes a few minutes to complete.

## Manage your Communication Services resource

To manage your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com), and search for and select **Azure Communication Services**.

On the **Communication Services** page, select the name of your resource.

The **Overview** page for your resource contains options for basic management like browse, stop, start, restart, and delete. For more configuration options, see the left menu of your resource page.
