---
title: Find tenant ID and primary domain
titleSuffix: Microsoft Cost Management
description: Describes how to find ID and primary domain for your Azure AD tenant.
author: bandersmsft
ms.reviewer: amberb
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 08/04/2022
ms.author: banders
---

# Locate tenant ID and primary domain

This article describes how to use the Azure portal to locate the following information for a user:

- The Microsoft Azure Active Directory (Azure AD) tenant ID of the user's organization
- The primary domain name of the organization associated with the Azure AD tenant

## Find the tenant ID and primary domain name

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Azure Active Directory*.  
    :::image type="content" source="./media/find-tenant-id-domain/search-azure-active-directory.png" alt-text="Screenshot showing Search in the Azure portal for Azure Active Directory." lightbox="./media/find-tenant-id-domain/search-azure-active-directory.png" :::
1. In the Azure Active Directory Overview page, you can find the Azure AD tenant ID and primary domain name in the **Basic information** section.  
    :::image type="content" source="./media/find-tenant-id-domain/azure-active-directory-overview.png" alt-text="Screenshot showing the Overview page of Azure Active Directory." lightbox="./media/find-tenant-id-domain/azure-active-directory-overview.png" :::
1. You can also find the tenant ID in the properties page.
    1. Search for **Azure Active Directory**.
    1. In the left menu, select **Properties**.
    1. The tenant ID is displayed on the Properties page.
    :::image type="content" source="./media/find-tenant-id-domain/azure-active-directory-properties.png" alt-text="Screenshot showing the Properties page of Azure Active Directory." lightbox="./media/find-tenant-id-domain/azure-active-directory-properties.png" :::

## Need help? contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Managing billing across tenants](manage-billing-across-tenants.md)
- [Billing administrative roles](understand-mca-roles.md)