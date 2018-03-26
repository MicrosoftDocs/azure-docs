---
title: Remove a user or group assignment from an enterprise app in Azure Active Directory | Microsoft Docs
description: How to remove the access assignment of a user or group from an enterprise app in Azure Active Directory
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 7b2d365b-ae92-477f-9702-353cc6acc5ea
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/14/2018
ms.author: markvi
ms.reviewer: asteen
ms.custom: it-pro

---
# Remove a user or group assignment from an enterprise app in Azure Active Directory
It's easy to remove a user or a group from being assigned access to one of your enterprise applications in Azure Active Directory (Azure AD). You must have the appropriate permissions to manage the enterprise app, and you must be global admin for the directory.

> [!NOTE]
> For Microsoft Applications (such as Office 365 apps), use PowerShell to remove users to an enterprise app.

## How do I remove a user or group assignment to an enterprise app in the Azure portal?
1. Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.
2. Select **More services**, enter **Azure Active Directory** in the text box, and then select **Enter**.
3. On the **Azure Active Directory - *directoryname*** page (that is, the Azure AD page for the directory you are managing), select **Enterprise applications**.

    ![Opening Enterprise apps](./media/active-directory-coreapps-remove-assignment-user-azure-portal/open-enterprise-apps.png)
4. On the **Enterprise applications** page, select **All applications**. You'll see a list of the apps you can manage.
5. On the **Enterprise applications - All applications** page, select an app.
6. On the ***appname*** page (that is, the page with the name of the selected app in the title), select **Users & Groups**.

    ![Selecting users or groups](./media/active-directory-coreapps-remove-assignment-user-azure-portal/remove-app-users.png)
7. On the ***appname*** **- User & Group Assignment** page, select one of more users or groups and then select the **Remove** command. Confirm your decision at the prompt.

    ![Selecting the Remove command](./media/active-directory-coreapps-remove-assignment-user-azure-portal/remove-users.png)

## How do I remove a user or group assignment to an enterprise app using PowerShell?
1. Open an elevated Windows PowerShell command prompt.

	>[!NOTE] 
	> You need to install the AzureAD module (use the command `Install-Module -Name AzureAD`). If prompted to install a NuGet module or the new Azure Active Directory V2 PowerShell module, type Y and press ENTER.

2. Run `Connect-AzureAD` and sign in with a Global Admin user account.
3. Use the following script to assign a user and role to an application:

    ```powershell
    # Store the proper parameters
    $user = get-azureaduser -ObjectId <objectId>
    $spo = Get-AzureADServicePrincipal -ObjectId <objectId>

    #Get the ID of role assignment 
    $assignments = Get-AzureADServiceAppRoleAssignment -ObjectId $spo.ObjectId | Where {$_.PrincipalDisplayName -eq $user.DisplayName}

    #if you run the following, it will show you what is assigned what
    $assignments | Select *

    #To remove the App role assignment run the following command.
    Remove-AzureADServiceAppRoleAssignment -ObjectId $spo.ObjectId -AppRoleAssignmentId $assignments[assignment #].ObjectId
    ``` 
## Next steps

- [See all of my groups](active-directory-groups-view-azure-portal.md)
- [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)
- [Disable user sign-ins for an enterprise app](active-directory-coreapps-disable-app-azure-portal.md)
- [Change the name or logo of an enterprise app](active-directory-coreapps-change-app-logo-user-azure-portal.md)
