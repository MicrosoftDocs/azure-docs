---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: mikben
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).

## Create Azure Communication Resource

To create an Azure Communication Services resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the page, select **+ Create a resource**. 

:::image type="content" source="../media/create-a-communication-resource/create-resource-plus-sign.png" alt-text="Screenshot highlighting the create a resource button in the Azure portal.":::

Enter **Communication** into either the **Search the Marketplace** input or the search bar at the top of the portal.

:::image type="content" source="../media/create-a-communication-resource/searchbar-communication-portal.png" alt-text="Screenshot showing a search for communication services in the search bar.":::

Select **Communication Services** in the results, and then select **Add**.

:::image type="content" source="../media/create-a-communication-resource/add-communication-portal.png" alt-text="Screenshot showing the Azure panel, highlighting the add button.":::

You can now configure your Communication Services resource. On the first page in the create process, you'll be asked to specify:

* The subscription
* The resource group (you can create a new one or choose an existing resource group)
* The name of the Communication Services resource
* The geography the resource will be associated with

In the next step, you can assign tags to the resource. Tags can be used to organize your Azure resources. See the [resource tagging documentation](../../../azure-resource-manager/management/tag-resources.md) for more information about tags.

Finally, you can review your configuration and **Create** the resource. Note that the deployment will take a few minutes to complete.

## Manage your Communication Services resource

To manage your Communication Services resource, go to the [Azure portal](https://portal.azure.com), and search for and select **Azure Communication Services**.

On the **Communication Services** page, select the name of your resource.

The **Overview** page for your resource contains options for basic management like browse, stop, start, restart, and delete. You can find more configuration options in the left menu of your resource page.