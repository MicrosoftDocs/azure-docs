---

title: Bulk add users in the Azure Active Directory portal | Microsoft Docs
description: Add users in bulk in the Azure admin center in Azure Active Directory 
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

# Bulk delete users in the Azure Active Directory portal

Azure Active Directory (Azure AD) supports bulk user create and delete operations, bulk invite for guests, and supports downloading lists of users, groups, and group members.

## To bulk delete users

1. Sign in to your Azure AD organization with an account that is a User administrator in the organization.
1. In Azure AD, select **Users** > **Bulk delete**.
1. On the **Bulk create user** page, select **Download** to receive a valid CSV file of user properties, and then add the users you want to delete.
1. When you finish editing the CSV file or if you have one of your own ready to upload, select the file under **Upload your CSV file** to be validated.

   ![Select a local CSV file in which you list the users you want to delete](./media/users-bulk-add/upload-button.png)

1. When the file contents are validated, you must fix any errors before the job is submitted.
1. When your file passes validation, select **Submit** to start the Azure batch job that deletes the users. Job notifications are generated to communicate progress to completion.

## Verify deleted users in the directory

You can check to see that the users you deleted are no longer in the directory either in the Azure portal or by using PowerShell.

### View users in the Azure portal

1. Sign in to the Azure portal with an account that is a User administrator in the organization.
1. In the navigation pane, select **Azure Active Directory**.
1. Under **Manage**, select **Users**.
1. Under **Show**, select **All users** only and verify that the users you deleted are no longer listed.

### View users with PowerShell

Run the following command:

``` PowerShell
Get-AzureADUser -Filter "UserType eq 'Member'"
```

Verify that the users that you deleted are no longer listed.

## Troubleshoot bulk user deletion

The causes of your troubles are many. Let us make them few. Specific actions can address the causes of many  potential error states during the bulk add process.

Validation error Message 1
guidance 1

Batch job failure Message 2
Guidance 2

## Next steps

- [Bulk add users](users-bulk-add.md)
- [Download list of users](users-bulk-download.md)
- [Download list of groups](groups-bulk-download.md)
