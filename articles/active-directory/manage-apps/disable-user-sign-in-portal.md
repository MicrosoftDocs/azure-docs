---
title: Disable user sign-in for application
description: How to disable an enterprise application so that no users may sign in to it in Azure Active Directory
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 2/23/2023
ms.author: jomondi
ms.reviewer: ergreenl
ms.custom: it-pro, enterprise-apps
ms.collection: M365-identity-device-management
zone_pivot_groups: enterprise-apps-all

#customer intent: As an admin, I want to disable user sign-in for an application so that no user can sign in to it in Azure Active Directory.
---
# Disable user sign-in for an application

There may be situations while configuring or managing an application where you don't want tokens to be issued for an application. Or, you may want to block an application that you don't want your employees to try to access. To block user access to an application, you can disable user sign-in for the application, which prevents all tokens from being issued for that application.

In this article, you learn how to prevent users from signing in to an application in Azure Active Directory through both the Azure portal and PowerShell. If you're looking for how to block specific users from accessing an application, use [user or group assignment](./assign-user-or-group-access-portal.md).

## Prerequisites

To disable user sign-in, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: An administrator, or owner of the service principal.

## Disable user sign-in

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

:::zone pivot="portal"

1. Sign in to the [Azure portal](https://portal.azure.com) as the global administrator for your directory.
1. Search for and select **Azure Active Directory**.
1. Select **Enterprise applications**.
1. Search for the application you want to disable a user from signing in, and select the application.
1. Select **Properties**.
1. Select **No** for **Enabled for users to sign-in?**.
1. Select **Save**.

:::zone-end

:::zone pivot="aad-powershell"

You may know the AppId of an app that doesn't appear on the Enterprise apps list. For example, you may have deleted the app or the service principal hasn't yet been created due to the app being preauthorized by Microsoft. You can manually create the service principal for the app and then disable it by using the following Microsoft Graph PowerShell cmdlet.

Ensure you've installed the AzureAD module (use the command `Install-Module -Name AzureAD`). In case you're prompted to install a NuGet module or the new Azure AD V2 PowerShell module, type Y and press ENTER.

```PowerShell
# Connect to Azure AD PowerShell
Connect-AzureAD -Scopes "Application.ReadWrite.All"

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
:::zone-end

:::zone pivot="ms-powershell"

You may know the AppId of an app that doesn't appear on the Enterprise apps list. For example, you may have deleted the app or the service principal hasn't yet been created due to the app being preauthorized by Microsoft. You can manually create the service principal for the app and then disable it by using the following Microsoft Graph PowerShell cmdlet.

Ensure you've installed the Microsoft Graph module (use the command `Install-Module Microsoft.Graph`).

```powershell
# Connect to Microsoft Graph PowerShell
Connect-MgGraph -Scopes "Application.ReadWrite.All"

# The AppId of the app to be disabled  
$appId = "{AppId}"  

# Check if a service principal already exists for the app 
$servicePrincipal = Get-MgServicePrincipal -Filter "appId eq '$appId'"  

# If Service principal exists already, disable it , else, create it and disable it at the same time 
if ($servicePrincipal) { Update-MgServicePrincipal -ServicePrincipalId $servicePrincipal.Id -AccountEnabled:$false }  

else {  $servicePrincipal = New-MgServicePrincipal -AppId $appId –AccountEnabled:$false } 
```

:::zone-end

:::zone pivot="ms-graph"

You may know the AppId of an app that doesn't appear on the Enterprise apps list. For example, you may have deleted the app or the service principal hasn't yet been created due to the app being preauthorized by Microsoft. You can manually create the service principal for the app and then disable it by using the following Microsoft Graph PowerShell cmdlet.

To disable sign-in to an application, sign in to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) with one of the roles listed in the prerequisite section.

You need to consent to the `Application.ReadWrite.All` permission.

Run the following query to disable user sign-in to an application.

```http
PATCH https://graph.microsoft.com/v1.0/servicePrincipals/2a8f9e7a-af01-413a-9592-c32ec0e5c1a7

Content-type: application/json

{
    "accountEnabled": false
}
```

:::zone-end



## Next steps

- [Remove a user or group assignment from an enterprise app](./assign-user-or-group-access-portal.md)
