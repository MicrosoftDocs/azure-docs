---
title: Enable RBAC usage billing for Azure Stack | Microsoft Docs
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

# Enable RBAC usage billing for Azure Stack

*Applies to: Azure Stack integrated systems*

## Create Azure CSP as guest with user role to tenant

You can optionally grant RBAC rights to CSP to manage your Azure Stack subscription:

1. Add CSP as guest user with user role to their tenant directory.
2. Add CSP as owner to Azure Stack user subscription.

> [!Note]  
> If these this step is skipped, CSP cannot manage customer’s Azure Stack subscription on their behalf.

## Create resource in Azure Stack user subscription

## Next steps

  - To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](../azure-stack-billing-and-chargeback.md).
