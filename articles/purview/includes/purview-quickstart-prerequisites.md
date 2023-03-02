---
title: include file
description: include file
services: purview
author: whhender
ms.author: whhender
ms.service: purview
ms.topic: include
ms.custom: include file
ms.date: 12/09/2022
---

## Prerequisites

* If you don't have an Azure subscription, create a [free subscription](https://azure.microsoft.com/free/) before you begin.

* An [Azure Active Directory tenant](../../active-directory/fundamentals/active-directory-access-create-new-tenant.md) associated with your subscription.

* The user account that you use to sign in to Azure must be a member  of the *contributor* or *owner* role, or an *administrator* of the Azure subscription. To view the permissions that you have in the subscription, follow these steps:
  1. Go to the [Azure portal](https://portal.azure.com)
  1. Select your username in the upper-right corner.
  1. Select the ellipsis button ("**...**") for more options.
  1. Then select **My permissions**. 
  1. If you have access to multiple subscriptions, select the appropriate subscription.

* No [Azure Policies](../../governance/policy/overview.md) preventing the creation or update of **Storage accounts**. Microsoft Purview will deploy a managed Storage account when it is created. If a blocking policy exists and needs to remain in place, please follow our [Microsoft Purview exception tag guide](../create-azure-purview-portal-faq.md) and follow the steps to create an exception for Microsoft Purview accounts.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.
