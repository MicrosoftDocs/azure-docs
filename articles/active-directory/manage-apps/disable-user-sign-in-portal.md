---
title: Disable user sign-ins for an enterprise app in Azure AD
description: How to disable an enterprise application so that no users may sign in to it in Azure Active Directory
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 04/12/2019
ms.author: kenwith
ms.reviewer: asteen
ms.custom: it-pro
ms.collection: M365-identity-device-management
---
# Disable user sign-ins for an enterprise app in Azure Active Directory

It's easy to disable an enterprise application so no users can sign in to it in Azure Active Directory (Azure AD). You need the appropriate permissions to manage the enterprise app. And, you must be global admin for the directory.

## How do I disable user sign-ins?

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.
1. Select **All services**, enter **Azure Active Directory** in the text box, and then select **Enter**.
1. On the **Azure Active Directory** -  ***directoryname*** pane (that is, the Azure AD pane for the directory you're managing), select **Enterprise applications**.
1. On the **Enterprise applications - All applications** pane, you see a list of the apps you can manage. Select an app.
1. On the ***appname*** pane (that is, the pane with the name of the selected app in the title), select **Properties**.
1. On the ***appname*** - **Properties** pane, select **No** for **Enabled for users to sign-in?**.
1. Select the **Save** command.

## Use Azure AD PowerShell to disable an unlisted app

If you know the AppId of an app that doesn't appear on the Enterprise apps list (for example, because you deleted the app or the service principal hasn't yet been created due to the app being pre-authorized by Microsoft), you can manually create the service principal for the app and then disable it by using [AzureAD PowerShell cmdlet](https://docs.microsoft.com/powershell/module/azuread/New-AzureADServicePrincipal?view=azureadps-2.0).

```PowerShell
# The AppId of the app to be disabled
$appId = "{AppId}"

# Check if a service principal already exists for the app
$servicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$appId'"
if ($servicePrincipal) {
    # Service principal exists already, disable it
    Set-AzureADServicePrincipal -ObjectId $servicePrincipal.ObjectId -AccountEnabled $false
} else {
    # Service principal does not yet exist, create it and disable it at the same time
    $servicePrincipal = New-AzureADServicePrincipal -AppId $appId -AccountEnabled $false
}
```

## Next steps

* [See all my groups](../fundamentals/active-directory-groups-view-azure-portal.md)
* [Assign a user or group to an enterprise app](assign-user-or-group-access-portal.md)
* [Remove a user or group assignment from an enterprise app](remove-user-or-group-access-portal.md)
* [Change the name or logo of an enterprise app](change-name-or-logo-portal.md)
