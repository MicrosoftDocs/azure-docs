---
title: include file
description: include file
services: purview
author: whhender
ms.author: whhender
ms.service: purview
ms.topic: include
ms.custom: include file
ms.date: 09/10/2021
---

## Prerequisites

* If you don't have an Azure subscription, create a [free subscription](https://azure.microsoft.com/free/) before you begin.

* An [Azure Active Directory tenant](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) associated with your subscription.

* The user account that you use to sign in to Azure must be a member  of the *contributor* or *owner* role, or an *administrator* of the Azure subscription. To view the permissions that you have in the subscription, go to the [Azure portal](https://portal.azure.com), select your username in the upper-right corner, select the "**...**" icon for more options, and then select **My permissions**. If you have access to multiple subscriptions, select the appropriate subscription.

* No [Azure Policies](../../governance/policy/overview.md) preventing creation of **Storage accounts** or **Event Hub namespaces**. Purview will deploy a managed Storage account and Event Hub when it is created. If a blocking policy exists and needs to remain in place, please follow our [Purview exception tag guide](../create-purview-portal-faq.md) and follow the steps to create an exception for Purview accounts.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Configure your subscription

If necessary, follow these steps to configure your subscription to enable Azure Purview to run in your subscription:

   1. In the Azure portal, search for and select **Subscriptions**.

   1. From the list of subscriptions, select the subscription you want to use. Administrative access permission for the subscription is required.

      :::image type="content" source="./media\manage-scans/purview-quickstart-prerequisites/select-subscription.png" alt-text="Screenshot showing how to select a subscription in the Azure portal.":::

   1. For your subscription, select **Resource providers**. On the **Resource providers** pane, search and register all three resource providers:
       1. **Microsoft.Purview**
       1. **Microsoft.Storage**
       1. **Microsoft.EventHub**
      
      If they are not registered, register it by selecting **Register**.

      :::image type="content" source="./media\manage-scans/purview-quickstart-prerequisites/register-purview-resource-provider.png" alt-text="Screenshot showing how to register the  Microsoft dot Azure Purview resource provider in the Azure portal.":::
