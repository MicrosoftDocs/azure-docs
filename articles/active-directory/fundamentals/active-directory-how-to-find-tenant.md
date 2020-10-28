---
title: Add an existing Azure subscription to your tenant - Azure AD
description: Instructions about how to add an existing Azure subscription to your Azure Active Directory tenant.
services: active-directory
author: ajburnle
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 10/30/2020
ms.author: ajburnle
ms.reviewer: jeffsta
ms.custom: "it-pro, seodec18, contperfq4"
ms.collection: M365-identity-device-management
---

# How to find your Azure Active Directory tenant ID

Azure subscriptions have a trust relationship with Azure Active Directory (Azure AD). Azure AD is trusted to to authenticate users, services, and devices for the subscription. Each subscription has a tenant id associated with it, and there are a few ways you can find the tenant id for your subscription.

## Find tenant ID through the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com.
 
1. Select **Azure Active Directory**.

1. Select **Properties**.

1. Then, scroll down to the **Tenant ID** field. Your tenant ID will be in the box.

![Properties - Tenant ID - Tenant ID field](media/active-directory-how-to-find-tenant/portal-tenant-id.png)

## Find tenant ID with PowerShell

You can also find the tenant programmatically. To find the tenant ID with PowerShell, use the cmdlet `Get-AzTentant`.


## Find tenant ID with CLI
If you want to use CLI to find the tenant, you can do so with Azure or Microsoft 365. If you want to use Azure CLI, enter the cmdlet `az login`. If you want to use Microsoft 365, enter the cmdlet `tenant id get --domainName mydomain.onmicrosoft.com`.

## Next steps

- To create a new Azure AD tenant, see [Quickstart: Create a new tenant in Azure Active Directory](active-directory-access-create-new-tenant.md).

- To learn how to associate or add a subscription to a tenant, see [Associate or add an Azure subscription to your Azure Active Directory tenant](active-directory-how-subscriptions-associated-directory.md).


