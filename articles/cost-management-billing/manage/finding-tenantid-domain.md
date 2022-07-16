---
title: Find tenant ID and primary domain
description: Describes how to find ID and primary domain for your Azure AD tenant
author: bandersmsft
ms.reviewer: amberb
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 7/22/2022
ms.author: banders
---

# Locate tenant ID and primary domain

This article describes how to use the Azure portal to locate the following information for a user:

- The Microsoft Azure Active Directory (Azure AD) tenant ID of the user's organization
- The primary domain name of the organization associated with the Azure AD tenant

## Find the Microsoft Azure AD tenant ID and primary domain name

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Azure Active Directory**.  

    ![Screenshot that shows Search in the Azure portal for Azure Active Directory](./media/finding-tenantid-domain/search-azure-active-directory.png)
1. In the Azure Active Directory Overview page, you can find the Azure AD tenant ID and primary domain name in the Basic information section.

    ![Screenshot that shows overview page of Azure Active Directory](./media/finding-tenantid-domain/azure-active-directory-overview.png)

1. You can also find the tenant ID in the properties page. 

    a. Search for **Azure Active Directory**.  

    a. Select **Properties** from the left hand side.

    a. The tenant ID is displayed in the properties page.

    ![Screenshot that shows properties page of Azure Active Directory](./media/finding-tenantid-domain/azure-active-directory-properties.png)

## Need help? contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Managing billing across tenants](manage-billing-across-tenants.md)
- [Billing administrative roles](understand-mca-roles.md)