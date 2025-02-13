---
title: Find tenant ID and primary domain
titleSuffix: Microsoft Cost Management
description: Describes how to find ID and primary domain for your Microsoft Entra tenant.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/22/2025
ms.author: banders
---

# Locate tenant ID and primary domain

This article describes how to use the Azure portal to locate the following information for a user:

- The Microsoft Entra tenant ID of the user's organization
- The primary domain name of the organization associated with the Microsoft Entra tenant

## Find the tenant ID and primary domain name

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Microsoft Entra ID*.  
    :::image type="content" source="./media/find-tenant-id-domain/search-azure-active-directory.png" alt-text="Screenshot showing Search in the Azure portal for Microsoft Entra ID." lightbox="./media/find-tenant-id-domain/search-azure-active-directory.png" :::
1. In the Microsoft Entra Overview page, you can find the Microsoft Entra tenant ID and primary domain name in the **Basic information** section.  
    :::image type="content" source="./media/find-tenant-id-domain/azure-active-directory-overview.png" alt-text="Screenshot showing the Overview page of Microsoft Entra ID." lightbox="./media/find-tenant-id-domain/azure-active-directory-overview.png" :::
1. You can also find the tenant ID in the properties page.
    1. Search for **Microsoft Entra ID**.
    1. In the left menu, select **Properties**.
    1. The tenant ID is displayed on the Properties page.
    :::image type="content" source="./media/find-tenant-id-domain/azure-active-directory-properties.png" alt-text="Screenshot showing the Properties page of Microsoft Entra ID." lightbox="./media/find-tenant-id-domain/azure-active-directory-properties.png" :::

## Need help? contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Managing billing across tenants](manage-billing-across-tenants.md)
- [Billing administrative roles](understand-mca-roles.md)
