---
title: Create an Azure app identity (PowerShell)
description: Describes how to use Azure PowerShell to create a Microsoft Entra application and service principal, and grant it access to resources through role-based access control. It shows how to authenticate application with a certificate.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev, devx-track-azurepowershell
ms.topic: how-to
ms.tgt_pltfrm: multiple
ms.date: 03/07/2023
ms.author: ryanwi
ms.reviewer: tomfitz
---

# Use Azure PowerShell to create a service principal with a certificate

When you have an app or script that needs to access resources, you can set up an identity for the app and authenticate the app with its own credentials. This identity is known as a service principal. This approach enables you to:

* Assign permissions to the app identity that are different than your own permissions. Typically, these permissions are restricted to exactly what the app needs to do.
* Use a certificate for authentication when executing an unattended script.

> [!IMPORTANT]
> Instead of creating a service principal, consider using managed identities for Azure resources for your application identity. If your code runs on a service that supports managed identities and accesses resources that support Microsoft Entra authentication, managed identities are a better option for you. To learn more about managed identities for Azure resources, including which services currently support it, see [What is managed identities for Azure resources?](../managed-identities-azure-resources/overview.md).

This article shows you how to create a service principal that authenticates with a certificate. To set up a service principal with password, see [Create an Azure service principal with Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps).

You must have the [latest version](/powershell/azure/install-azure-powershell) of PowerShell for this article.

[!INCLUDE [az-powershell-update](../../../includes/updated-for-az.md)]

## Required permissions

To complete this article, you must have sufficient permissions in both your Microsoft Entra ID and Azure subscription. Specifically, you must be able to create an app in Microsoft Entra ID, and assign the service principal to a role.

The easiest way to check whether your account has adequate permissions is through the portal. See [Check required permission](howto-create-service-principal-portal.md#permissions-required-for-registering-an-app).

## Assign the application to a role
To access resources in your subscription, you must assign the application to a role. Decide which role offers the right permissions for the application. To learn about the available roles, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

You can set the scope at the level of the subscription, resource group, or resource. Permissions are inherited to lower levels of scope. For example, adding an application to the *Reader* role for a resource group means it can read the resource group and any resources it contains. To allow the application to execute actions like reboot, start and stop instances, select the *Contributor* role.

## Create service principal with self-signed certificate

The following example covers a simple scenario. It uses [New-​AzAD​Service​Principal](/powershell/module/az.resources/new-azadserviceprincipal) to create a service principal with a self-signed certificate, and uses [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) to assign the [Reader](/azure/role-based-access-control/built-in-roles#reader) role to the service principal. The role assignment is scoped to your currently selected Azure subscription. To select a different subscription, use [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

> [!NOTE]
> The New-SelfSignedCertificate cmdlet and the PKI module are currently not supported in PowerShell Core. 

```powershell
$cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" `
  -Subject "CN=exampleappScriptCert" `
  -KeySpec KeyExchange
$keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

$sp = New-AzADServicePrincipal -DisplayName exampleapp `
  -CertValue $keyValue `
  -EndDate $cert.NotAfter `
  -StartDate $cert.NotBefore
Sleep 20
New-AzRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $sp.AppId
```

The example sleeps for 20 seconds to allow some time for the new service principal to propagate throughout Microsoft Entra ID. If your script doesn't wait long enough, you'll see an error stating: "Principal {ID} doesn't exist in the directory {DIR-ID}." To resolve this error, wait a moment then run the **New-AzRoleAssignment** command again.

You can scope the role assignment to a specific resource group by using the **ResourceGroupName** parameter. You can scope to a specific resource by also using the **ResourceType** and **ResourceName** parameters. 

If you **do not have Windows 10 or Windows Server 2016**, download the [New-SelfSignedCertificateEx cmdlet](https://www.pkisolutions.com/tools/pspki/New-SelfSignedCertificateEx/) from PKI Solutions. Extract its contents and import the cmdlet you need.

```powershell
# Only run if you could not use New-SelfSignedCertificate
Import-Module -Name c:\ExtractedModule\New-SelfSignedCertificateEx.ps1
```

In the script, substitute the following two lines to generate the certificate.

```powershell
New-SelfSignedCertificateEx -StoreLocation CurrentUser `
  -Subject "CN=exampleapp" `
  -KeySpec "Exchange" `
  -FriendlyName "exampleapp"
$cert = Get-ChildItem -path Cert:\CurrentUser\my | where {$PSitem.Subject -eq 'CN=exampleapp' }
```

### Provide certificate through automated PowerShell script

Whenever you sign in as a service principal, provide the tenant ID of the directory for your AD app. A tenant is an instance of Microsoft Entra ID.

```powershell
$TenantId = (Get-AzSubscription -SubscriptionName "Contoso Default").TenantId
$ApplicationId = (Get-AzADApplication -DisplayNameStartWith exampleapp).AppId

$Thumbprint = (Get-ChildItem cert:\CurrentUser\My\ | Where-Object {$_.Subject -eq "CN=exampleappScriptCert" }).Thumbprint
Connect-AzAccount -ServicePrincipal `
  -CertificateThumbprint $Thumbprint `
  -ApplicationId $ApplicationId `
  -TenantId $TenantId
```

## Create service principal with certificate from Certificate Authority

The following example uses a certificate issued from a Certificate Authority to create service principal. The assignment is scoped to the specified Azure subscription. It adds the service principal to the [Reader](/azure/role-based-access-control/built-in-roles#reader) role. If an error occurs during the role assignment, it retries the assignment.

```powershell
Param (
 [Parameter(Mandatory=$true)]
 [String] $ApplicationDisplayName,

 [Parameter(Mandatory=$true)]
 [String] $SubscriptionId,

 [Parameter(Mandatory=$true)]
 [String] $CertPath,

 [Parameter(Mandatory=$true)]
 [String] $CertPlainPassword
 )

 Connect-AzAccount
 Import-Module Az.Resources
 Set-AzContext -Subscription $SubscriptionId

 $CertPassword = ConvertTo-SecureString $CertPlainPassword -AsPlainText -Force

 $PFXCert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @($CertPath, $CertPassword)
 $KeyValue = [System.Convert]::ToBase64String($PFXCert.GetRawCertData())

 $ServicePrincipal = New-AzADServicePrincipal -DisplayName $ApplicationDisplayName
 New-AzADSpCredential -ObjectId $ServicePrincipal.Id -CertValue $KeyValue -StartDate $PFXCert.NotBefore -EndDate $PFXCert.NotAfter
 Get-AzADServicePrincipal -ObjectId $ServicePrincipal.Id 

 $NewRole = $null
 $Retries = 0;
 While ($NewRole -eq $null -and $Retries -le 6)
 {
    # Sleep here for a few seconds to allow the service principal application to become active (should only take a couple of seconds normally)
    Sleep 15
    New-AzRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $ServicePrincipal.AppId | Write-Verbose -ErrorAction SilentlyContinue
    $NewRole = Get-AzRoleAssignment -ObjectId $ServicePrincipal.Id -ErrorAction SilentlyContinue
    $Retries++;
 }

 $NewRole
```

### Provide certificate through automated PowerShell script
Whenever you sign in as a service principal, provide the tenant ID of the directory for your AD app. A tenant is an instance of Microsoft Entra ID.

```powershell
Param (

 [Parameter(Mandatory=$true)]
 [String] $CertPath,

 [Parameter(Mandatory=$true)]
 [String] $CertPlainPassword,

 [Parameter(Mandatory=$true)]
 [String] $ApplicationId,

 [Parameter(Mandatory=$true)]
 [String] $TenantId
 )

 $CertPassword = ConvertTo-SecureString $CertPlainPassword -AsPlainText -Force
 $PFXCert = New-Object `
  -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2 `
  -ArgumentList @($CertPath, $CertPassword)
 $Thumbprint = $PFXCert.Thumbprint

 Connect-AzAccount -ServicePrincipal `
  -CertificateThumbprint $Thumbprint `
  -ApplicationId $ApplicationId `
  -TenantId $TenantId
```

The application ID and tenant ID aren't sensitive, so you can embed them directly in your script. If you need to retrieve the tenant ID, use:

```powershell
(Get-AzSubscription -SubscriptionName "Contoso Default").TenantId
```

If you need to retrieve the application ID, use:

```powershell
(Get-AzADApplication -DisplayNameStartWith {display-name}).AppId
```

## Change credentials

To change the credentials for an AD app, either because of a security compromise or a credential expiration, use the [Remove-AzADAppCredential](/powershell/module/az.resources/remove-azadappcredential) and [New-AzADAppCredential](/powershell/module/az.resources/new-azadappcredential) cmdlets.

To remove all the credentials for an application, use:

```powershell
Get-AzADApplication -DisplayName exampleapp | Remove-AzADAppCredential
```

To add a certificate value, create a self-signed certificate as shown in this article. Then, use:

```powershell
Get-AzADApplication -DisplayName exampleapp | New-AzADAppCredential `
  -CertValue $keyValue `
  -EndDate $cert.NotAfter `
  -StartDate $cert.NotBefore
```

## Debug

You may get the following errors when creating a service principal:

* **"Authentication_Unauthorized"** or **"No subscription found in the context."** - You see this error when your account doesn't have the [required permissions](#required-permissions) on the Microsoft Entra ID to register an app. Typically, you see this error when only admin users in your Microsoft Entra ID can register apps, and your account isn't an admin. Ask your administrator to either assign you to an administrator role, or to enable users to register apps.

* Your account **"does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/{guid}'."** - You see this error when your account doesn't have sufficient permissions to assign a role to an identity. Ask your subscription administrator to add you to User Access Administrator role.

## Next steps

* To set up a service principal with password, see [Create an Azure service principal with Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps) or [Create an Azure service principal with Azure CLI](/cli/azure/azure-cli-sp-tutorial-2).
* For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](app-objects-and-service-principals.md).
* For more information about Microsoft Entra authentication, see [Authentication Scenarios for Microsoft Entra ID](./authentication-vs-authorization.md).
* For information about working with app registrations by using **Microsoft Graph**, see the [Applications](/graph/api/resources/application) API reference.
