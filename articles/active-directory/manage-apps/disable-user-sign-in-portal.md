---
title: Disable how a how a user signs in
description: How to disable an enterprise application so that no users may sign in to it in Azure Active Directory
services: active-directory
author: eringreenlee
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 09/06/2022
ms.author: ergreenl
ms.custom: it-pro
ms.collection: M365-identity-device-management
#customer intent: As an admin, I want to disable the way a user signs in for an application so that no user can sign in to it in Azure Active Directory.
---
# Disable user sign-in for an application

There may be situations while configuring or managing an application where you don't want tokens to be issued for an application. Or, you may want to preemptively block an application that you do not want your employees to try to access. To accomplish this, you can disable user sign-in for the application, which will prevent all tokens from being issued for that application.

In this article, you will learn how to disable how a user signs in to an application in Azure Active Directory through both the Azure portal and PowerShell. If you are looking for how to block specific users from accessing an application, use [user or group assignment](./assign-user-or-group-access-portal.md).



## Prerequisites

To disable how a user signs in, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.

## Disable how a user signs in

1. Sign in to the [Azure portal](https://portal.azure.com) as the global administrator for your directory.
1. Search for and select **Azure Active Directory**.
1. Select **Enterprise applications**.
1. Search for the application you want to disable a user from signing in, and select the application.
1. Select **Properties**.
1. Select **No** for **Enabled for users to sign-in?**.
1. Select **Save**.

## Use Azure AD PowerShell to disable an unlisted app

Ensure you have installed the AzureAD module (use the command Install-Module -Name AzureAD). In case you are prompted to install a NuGet module or the new Azure Active Directory V2 PowerShell module, type Y and press ENTER.

If you know the AppId of an app that doesn't appear on the Enterprise apps list (for example, because you deleted the app or the service principal hasn't yet been created due to the app being pre-authorized by Microsoft), you can manually create the service principal for the app and then disable it by using the cmdlet below.

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

- [Remove a user or group assignment from an enterprise app](./assign-user-or-group-access-portal.md)
