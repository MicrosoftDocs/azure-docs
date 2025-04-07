---
title: Create integration environments for Azure resources
description: Create an integration environment to centrally organize and manage Azure resources related to your integration solutions.
ms.service: azure
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 06/07/2024
# CustomerIntent: As an integration developer, I want a way to centrally and logically organize Azure resources related to my organization's integration solutions.
ms.subservice: azure-integration-environments
---

# Create an integration environment (Preview)

> [!NOTE]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To centrally and logically organize and manage Azure resources associated with your integration solutions, create an integration environment. For more information, see [What is Azure Integration Environments](overview.md)?

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

  > [!NOTE]
  >
  > Your integration environment and *all* Azure resources that you want to organize 
  > into application groups must use the same Azure subscription, including any 
  > [**Business Process** resources](../business-process-tracking/overview.md) 
  > that you want to link your application group. See 
  > [Supported Azure resources](overview.md#supported-resources).

- Register the **Microsoft.IntegrationSpaces** resource provider for the Azure Integration Environments resource.

  1. In the [Azure portal](https://portal.azure.com) search box, enter and select **Subscriptions**.

  1. On the **Subscriptions** page, find and select your Azure subscription.

  1. On your subscription menu, under **Settings**, select **Resource providers**.

  1. In the **Resource providers** filter box, enter **integration**, and select **Microsoft.IntegrationSpaces**.

  1. On the **Resource providers** toolbar, select **Register**.

     After the Azure portal completes the registration, the **Microsoft.IntegrationSpaces** resource provider status changes to **Registered**.

<a name="create-integration-environment"></a>

## Create an integration environment

1. In the [Azure portal](https://portal.azure.com) search box, enter **integration environments**, and then select **Integration Environments**.

1. From the **Integration Environments** toolbar, select **Create**.

   :::image type="content" source="media/create-integration-environment/create-integration-environment.png" alt-text="Screenshot shows Azure portal and Integration Environments list with Create selected." lightbox="media/create-integration-environment/create-integration-environment.png":::

1. On the **Create an integration environment** page, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes |  <*Azure-subscription*> | Same Azure subscription as the Azure resources to organize |
   | **Resource group** | Yes | <*Azure-resource-group*> | New or existing Azure resource group to use |
   | **Name** | Yes | <*integration-environment-name*> | Name for your integration environment that uses only alphanumeric characters, hyphens, underscores, or periods. |
   | **Description** | No | <*integration-environment-description*> | Purpose for your integration environment |
   | **Region** | Yes | <*Azure-region*> | Azure deployment region |

1. When you're done, select **Create**.

   After deployment completes, Azure opens your integration environment.

   If the environment doesn't open, select **Go to resource**.

   :::image type="content" source="media/create-integration-environment/integration-environment.png" alt-text="Screenshot shows Azure portal with new integration environment resource." lightbox="media/create-integration-environment/integration-environment.png":::

1. Now [create an application group](create-application-group.md) in your integration environment.

## Next step

> [!div class="nextstepaction"]
> [Create an application group](create-application-group.md)
