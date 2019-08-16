---

title: Bulk delete users (preview) in the Azure Active Directory portal | Microsoft Docs
description: Delete users in bulk in the Azure admin center in Azure Active Directory 
services: active-directory 
author: curtand
ms.author: curtand
manager: mtillman
ms.date: 08/15/2019
ms.topic: conceptual
ms.service: active-directory
ms.subservice: users-groups-roles
ms.workload: identity
ms.custom: it-pro
ms.reviewer: jeffsta
ms.collection: M365-identity-device-management
---

# Bulk delete users (preview) in Azure Active Directory

Azure Active Directory (Azure AD) supports bulk user create and delete operations, bulk invite for guests, and supports downloading lists of users, groups, and group members.

## To bulk delete users

1. Sign in to your Azure AD organization with an account that is a User administrator in the organization.
1. In Azure AD, select **Users** > **Bulk delete**.
1. On the **Bulk delete user** page, select **Download** to receive a valid CSV file of user properties, and then add the users you want to delete.
1. When you finish editing the CSV file or if you have one of your own ready to upload, select the file under **Upload your CSV file** to be validated.

   ![Select a local CSV file in which you list the users you want to delete](./media/users-bulk-delete/bulk-delete.png)

1. When the file contents are validated, you must fix any errors before the job is submitted.
1. When your file passes validation, select **Submit** to start the Azure batch job that deletes the users.

## Check status

You can see the status of all of your pending bulk requests in the **Bulk operation results (preview)** page.

   ![Check upload status in the Bulk Operations Results page](./media/users-bulk-delete/bulk-center.png)

Next, you can check to see that the users you deleted exist in the Azure AD organization either in the Azure portal or by using PowerShell.

## Verify deleted users in the Azure portal

1. Sign in to the Azure portal with an account that is a User administrator in the organization.
1. In the navigation pane, select **Azure Active Directory**.
1. Under **Manage**, select **Users**.
1. Under **Show**, select **All users** only and verify that the users you deleted are no longer listed.

### Verify deleted users with PowerShell

Run the following command:

``` PowerShell
Get-AzureADUser -Filter "UserType eq 'Member'"
```

Verify that the users that you deleted are no longer listed.

## Next steps

- [Bulk add users](users-bulk-add.md)
- [Download list of users](users-bulk-download.md)
- [Bulk restore users](users-bulk-restore.md)
