---
title: Admin consent for LinkedIn account connections
description: Explains how to enable or disable LinkedIn integration account connections in Microsoft apps in Microsoft Entra ID
services: active-directory
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 09/08/2023
ms.author: barclayn
ms.reviewer: beengen
ms.custom: it-pro, has-azure-ad-ps-ref
ms.collection: M365-identity-device-management
---

# Integrate LinkedIn account connections in Microsoft Entra ID

You can allow users in your organization to access their LinkedIn connections within some Microsoft apps. No data is shared until users consent to connect their accounts. You can integrate your organization with Microsoft Entra ID, part of Microsoft Entra.

> [!IMPORTANT]
> The LinkedIn account connections setting is currently being rolled out to Microsoft Entra organizations. When it is rolled out to your organization, it is enabled by default.
>
> Exceptions:
>
> * The setting is not available for customers using Microsoft Cloud for US Government, Microsoft Cloud Germany, or Azure and Microsoft 365 operated by 21Vianet in China.
> * The setting is off by default for Microsoft Entra organizations provisioned in Germany. Note that the setting is not available for customers using Microsoft Cloud Germany.
> * The setting is off by default for organizations provisioned in France.
>
> Once LinkedIn account connections are enabled for your organization, the account connections work after users consent to apps accessing company data on their behalf. For information about the user consent setting, see [How to remove a user's access to an application](../manage-apps/methods-for-removing-user-access.md).

## Enable LinkedIn account connections in the Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You can enable LinkedIn account connections for only the users you want to have access, from your entire organization to only selected users in your organization.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Administrator](../roles/permissions-reference.md#global-administrator).
1. Select Microsoft Entra ID.
1. Select **Users** > **All users**.
1. Select **User settings**.
1. Under **LinkedIn account connections**, allow users to connect their accounts to access their LinkedIn connections within some Microsoft apps. No data is shared until users consent to connect their accounts.

    * Select **Yes** to enable the service for all users in your organization
    * Select **Selected group** to enable the service for only a group of selected users in your organization
    * Select **No** to withdraw consent from all users in your organization

    ![Integrate LinkedIn account connections in the organization](./media/linkedin-integration/linkedin-integration.png)

1. When you're done, select **Save** to save your settings.

> [!Important]
> LinkedIn integration is not fully enabled for your users until they consent to connect their accounts. No data is shared when you enable account connections for your users.

### Assign selected users with a group

We have replaced the 'Selected' option that specifies a list of users with the option to select a group of users so that you can enable the ability to connect LinkedIn and Microsoft accounts for a single group instead of many individual users. If you don't have LinkedIn account connections enabled for selected individual users, you don't need to do anything. If you have previously enabled LinkedIn account connections for selected individual users, you should:

1. Get the current list of individual users
1. Move the currently enabled individual users to a group
1. Use the group from the previous as the selected group in the LinkedIn account connections setting in the Azure portal.

> [!NOTE]
> Even if you don't move your currently selected individual users to a group, they can still see LinkedIn information in Microsoft apps.

### Move currently selected users to a group

1. Create a CSV file of the users who are selected for LinkedIn account connections.
1. Sign into Microsoft 365 with your administrator account.
1. Launch PowerShell.
1. Install the Azure AD PowerShell module by running `Install-Module AzureAD`
1. Run the following script:

  ``` PowerShell
  $groupId = "GUID of the target group"
  
  $users = Get-Content 
  Path to the CSV file
  
  $i = 1
  foreach($user in $users} { Add-AzureADGroupMember -ObjectId $groupId -RefObjectId $user ; Write-Host $i Added $user ; $i++ ; Start-Sleep -Milliseconds 10 }
  ```

To use the group from step two as the selected group in the LinkedIn account connections setting in the Azure portal, see [Enable LinkedIn account connections in the Azure portal](#enable-linkedin-account-connections-in-the-azure-portal).

## Use Group Policy to enable LinkedIn account connections

1. Download the [Office 2016 Administrative Template files (ADMX/ADML)](https://www.microsoft.com/download/details.aspx?id=49030)
1. Extract the **ADMX** files and copy them to your central store.
1. Open Group Policy Management.
1. Create a Group Policy Object with the following setting: **User Configuration** > **Administrative Templates** > **Microsoft Office 2016** > **Miscellaneous** > **Show LinkedIn features in Office applications**.
1. Select **Enabled** or **Disabled**.
  
   State | Effect
   ------ | ------
   **Enabled** | The **Show LinkedIn features in Office applications** setting in Office 2016 Options is enabled. Users in your organization can use LinkedIn features in their Office 2016 applications.
   **Disabled** | The **Show LinkedIn features in Office applications** setting in Office 2016 Options is disabled and end users can't change this setting. Users in your organization can't use LinkedIn features in their Office 2016 applications.

This group policy affects only Office 2016 apps for a local computer. If users disable LinkedIn in their Office 2016 apps, they can still see LinkedIn features in Microsoft 365.

## Next steps

* [User consent and data sharing for LinkedIn](linkedin-user-consent.md)

* [LinkedIn information and features in your Microsoft apps](https://go.microsoft.com/fwlink/?linkid=850740)

* [LinkedIn help center](https://www.linkedin.com/help/linkedin)

* [View your current LinkedIn integration setting in the Azure portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/UserSettings)
