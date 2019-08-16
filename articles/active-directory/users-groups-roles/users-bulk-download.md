---

title: Download a list of users in the Azure Active Directory portal | Microsoft Docs
description: Download user records in bulk in the Azure admin center in Azure Active Directory. 
services: active-directory 
author: curtand
ms.author: curtand
manager: mtillman
ms.date: 07/15/2019
ms.topic: conceptual
ms.service: active-directory
ms.subservice: users-groups-roles
ms.workload: identity
ms.custom: it-pro
ms.reviewer: jeffsta
ms.collection: M365-identity-device-management
---

# Download a list of users in the Azure Active Directory portal

Azure Active Directory (Azure AD) supports bulk user create and delete operations, bulk invite for guests, and supports downloading lists of users, groups, and group members.

## To download a list of users

1. [Sign in to your Azure AD organization](https://aad.portal.azure.com) with a User administrator account in the organization.
1. In Azure AD, select **Users** > **Download users**.
1. On the **Download users** page, select **Start** to receive a CSV file listing user profile properties.

   ![Select where you want the list the users you want to download](./media/users-bulk-download/bulk-download.png)

## Check status

You can see the status of all of your pending bulk requests in the **Bulk operation results (preview)** page.

   ![Check upload status in the Bulk Operations Results page](./media/users-bulk-download/bulk-center.png)

## Next steps

- [Bulk add users](users-bulk-add.md)
- [Bulk delete users](users-bulk-delete.md)
- [Bulk restore users](users-bulk-restore.md)
