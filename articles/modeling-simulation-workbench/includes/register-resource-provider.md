---
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: include
ms.date: 08/20/2024
---

1. On the Azure portal menu, search for **Subscriptions**. Select it from the available options.

   :::image type="content" source="/azure/azure-resource-manager/management/media/resource-providers-and-types/search-subscriptions.png" alt-text="Screenshot of the Azure portal in a web browser, showing search subscriptions.":::

1. On the **Subscriptions** page, select the subscription you want to view. In the following screenshot, 'Documentation Testing 1' is the name of our subscription.

   :::image type="content" source="/azure/azure-resource-manager/management/media/resource-providers-and-types/select-subscription.png" alt-text="Screenshot of the Azure portal in a web browser, showing select subscriptions.":::

1. On the left menu, under **Settings**, select **Resource providers**.

   :::image type="content" source="/azure/azure-resource-manager/management/media/resource-providers-and-types/select-resource-providers.png" alt-text="Screenshot of the Azure portal in a web browser, showing select resource providers.":::

1. Select the *Microsoft.ModSimWorkbench* resource provider. Then select **Register**.

   :::image type="content" source="../media/quickstart-create-portal/register-resource-provider.png" alt-text="Screenshot of the Azure portal in a web browser, showing register resource providers.":::

> [!IMPORTANT]
>
> To maintain the least privileges in your subscription, only register the resource providers you're ready to use.
>
> To allow your application to continue sooner than waiting for all regions to complete, don't block the creation of resources for a resource provider in the registering state.
