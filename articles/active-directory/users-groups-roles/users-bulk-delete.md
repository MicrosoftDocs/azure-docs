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

Using Azure Active Directory (Azure AD) portal, you can remove a large number of members to a group by using a comma-separated values (CSV) file to bulk delete users.

## To bulk delete users

1. [Sign in to your Azure AD organization](https://aad.portal.azure.com) with an account that is a User administrator in the organization.
1. In Azure AD, select **Users** > **Bulk delete**.
1. On the **Bulk delete user** page, select **Download** to receive a valid CSV file of user properties.

   ![Select a local CSV file in which you list the users you want to delete](./media/users-bulk-delete/bulk-delete.png)

1. Open the CSV file and add a line for each user you want to delete. The only required value is **User principal name**. Then save the file.

   ![The CSV file contains names and IDs of the users to delete](./media/users-bulk-delete/delete-csv-file.png)

1. On the **Bulk delete user (Preview)** page, under **Upload your csv file**, browse to the file. When you select the file and click submit, validation of the CSV file starts.
1. When the file contents are validated, you’ll see **File uploaded successfully**. If there are errors, you must fix them before you can submit the job.
1. When your file passes validation, select **Submit** to start the Azure bulk operation that deletes the users.
1. When the deletion operation completes, you'll see a notification that the bulk operation succeeded.

If there are errors, you can download and view the results file on the **Bulk operation results** page. The file contains the reason for each error.

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
