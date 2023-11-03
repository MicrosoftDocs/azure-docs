---
title: Create integration environments for Azure resources
description: Create an integration environment so you can centrally organize, manage, and track existing Azure resources for your integration solutions.
ms.service: azure
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 11/15/2023
---

# Create an integration environment (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't yet ready production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To centrally and logically organize and manage Azure resources associated with your integration solutions, create an integration environment. For more information, see [What is Azure Integration Environments](overview.md)?

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

  > [!NOTE]
  >
  > Your integration environment and the Azure resources that you want to organize must exist in the same Azure subscription. 

## Create an integration environment

1. In the [Azure portal](https://portal.azure.com) search box, enter **integration environments**, and then select **Integration Environments**.

1. From the **Integration Environments** toolbar, select **Create**.

1. On the **Create an integration environment** page, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes |  <*Azure-subscription*> | Same Azure subscription as the Azure resources to organize |
   | **Resource group** | Yes | <*Azure-resource-group*> | New or existing Azure resource group to use |
   | **Name** | Yes | <*integration-environment-name*> | Name for your integration environment |
   | **Description** | No | <*integration-environment-description*> | Purpose for your integration environment |
   | **Region** | Yes | <*Azure-region*> | Azure deployment region |

1. When you're done, select **Create**.

   After deployment completes, Azure opens your integration environment.

## Next steps

[Create an application group](create-application-group.md)
