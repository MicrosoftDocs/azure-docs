---
title: Enable billing and usage tracking for your tenant with a Cloud Service Provider | Microsoft Docs
description: Type the description in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/05/2018
ms.author: mabrigg
ms.reviewer: alfredop

---

# Enable billing and usage tracking for your tenant with a Cloud Service Provider

*Applies to: Azure Stack integrated systems*

`summary`

<More context on this topic: In Azure CSP program, the CSP has control over the Azure subscriptions and all resources that run in it. The end customer doesn’t have access to the Azure subscription and resources and have to request the CSP to grant them access if they wish to manage their own subscription. It is to enable white glove service. For Azure Stack, we don’t really grant CSPs access to end customer’s Azure Stack subscription or resources. However, some customers might want their CSP/operator to manage Azure stack resources and subscription on their behalf. So, this section tells them how CSP/operator can get access to the end user’s Azure stack subscription and resources.>

## Enable tenant usage billing for Azure Stack

`summary`

## Add CSP as guest user with user role to their tenant directory

You can create local Azure Stack subscriptions for an end user, who is then ready to start using Azure Stack.

> [!Note]  
> If these this step is skipped, CSP cannot manage customer’s Azure Stack subscription on their behalf.

## Set CSP# as owner to Azure Stack user subscription

`text`

## Enable RBAC usage billing for Azure Stack

<Title should be changed to reflect Enable CSP to manage Azure stack subscription on your behalf. This is not related to billing.>

`summary`

< We should explain why a user would want to provide RBAC rights to their Azure subscription. See #1 for more context.>

## Create Azure CSP as guest with user role to tenant

You can optionally grant RBAC rights to CSP to manage your Azure Stack subscription:

1. Add CSP as guest user with user role to their tenant directory.
2. Add CSP as owner to Azure Stack user subscription.

> [!Note]  
> If these this step is skipped, CSP cannot manage customer’s Azure Stack subscription on their behalf.

<- 1. CSP should create a user within their directory tenant which will be used to manage the end customer’s Azure Stack subscription. 2. User should add new user from CSP’s tenant as guest user with user role to the customer’s tenant directory. 3. User should add new user from CSP’s directory tenant as owner to Azure Stack user subscription. >

## Create resource in Azure Stack user subscription

## Next steps

  - To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](../azure-stack-billing-and-chargeback.md).
