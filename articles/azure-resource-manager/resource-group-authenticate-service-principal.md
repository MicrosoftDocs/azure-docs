---
title: Create identity for Azure app with PowerShell | Microsoft Docs
description: Describes how to use Azure PowerShell to create an Azure Active Directory application and service principal, and grant it access to resources through role-based access control. It shows how to authenticate application with a password or certificate.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: d2caf121-9fbe-4f00-bf9d-8f3d1f00a6ff
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/15/2017
ms.author: tomfitz

---
# Use Azure PowerShell to create a service principal to access resources

When you have an app or script that needs to access resources, you can set up an identity for the app and authenticate the app with its own credentials. This identity is known as a service principal. This approach enables you to:

* Assign permissions to the app identity that are different than your own permissions. Typically, these permissions are restricted to exactly what the app needs to do.
* Use a certificate for authentication when executing an unattended script.

This topic shows you how to use [Azure PowerShell](/powershell/azure/overview) to set up everything you need for an application to run under its own credentials and identity.

## Required permissions
To complete this topic, you must have sufficient permissions in both your Azure Active Directory and your Azure subscription. Specifically, you must be able to create an app in the Azure Active Directory, and assign the service principal to a role. 

The easiest way to check whether your account has adequate permissions is through the portal. See [Check required permission](resource-group-create-service-principal-portal.md#required-permissions).

Now, proceed to a section for either [password](#create-service-principal-with-password) or [certificate](#create-service-principal-with-certificate) authentication.

## PowerShell commands

To set up a service principal, you use:

| Command | Description |
| ------- | ----------- | 
| [New-​Azure​Rm​AD​Service​Principal](/powershell/module/azurerm.resources/new-azurermadserviceprincipal) | Creates an Azure Active Directory service principal |
| [New-​Azure​Rm​Role​Assignment](/powershell/module/azurerm.resources/new-azurermroleassignment) | Assigns the specified RBAC role to the specified principal, at the specified scope. |


## Create service principal with password

To create a service principal with the Contributor role for your subscription, use: 

```powershell
Login-AzureRmAccount
$sp = New-AzureRmADServicePrincipal -DisplayName exampleapp -Password "{provide-password}"
Sleep 20
New-AzureRmRoleAssignment -RoleDefinitionName Contributor -ServicePrincipalName $sp.ApplicationId
```

The example sleeps for 20 seconds to allow some time for the new service principal to propagate throughout Azure Active Directory. If your script does not wait long enough, you see an error stating: "PrincipalNotFound: Principal {id} does not exist in the directory."

The following script enables you to specify a scope other than the default subscription, and retries the role assignment if an error occurs:

```powershell
Param (

 # Use to set scope to resource group. If no value is provided, scope is set to subscription.
 [Parameter(Mandatory=$false)]
 [String] $ResourceGroup,

 # Use to set subscription. If no value is provided, default subscription is used. 
 [Parameter(Mandatory=$false)]
 [String] $SubscriptionId,

 [Parameter(Mandatory=$true)]
 [String] $ApplicationDisplayName,

 [Parameter(Mandatory=$true)]
 [String] $Password
)

 Login-AzureRmAccount
 Import-Module AzureRM.Resources

 if ($SubscriptionId -eq "") 
 {
    $SubscriptionId = (Get-AzureRmContext).Subscription.Id
 }
 else
 {
    Set-AzureRmContext -SubscriptionId $SubscriptionId
 }

 if ($ResourceGroup -eq "")
 {
    $Scope = "/subscriptions/" + $SubscriptionId
 }
 else
 {
    $Scope = (Get-AzureRmResourceGroup -Name $ResourceGroup -ErrorAction Stop).ResourceId
 }

 
 # Create Service Principal for the AD app
 $ServicePrincipal = New-AzureRMADServicePrincipal -DisplayName $ApplicationDisplayName -Password $Password
 Get-AzureRmADServicePrincipal -ObjectId $ServicePrincipal.Id 

 $NewRole = $null
 $Retries = 0;
 While ($NewRole -eq $null -and $Retries -le 6)
 {
    # Sleep here for a few seconds to allow the service principal application to become active (should only take a couple of seconds normally)
    Sleep 15
    New-AzureRMRoleAssignment -RoleDefinitionName Contributor -ServicePrincipalName $ServicePrincipal.ApplicationId -Scope $Scope | Write-Verbose -ErrorAction SilentlyContinue
    $NewRole = Get-AzureRMRoleAssignment -ServicePrincipalName $ServicePrincipal.ApplicationId -ErrorAction SilentlyContinue
    $Retries++;
 }
```

A few items to note about the script:

* To grant the identity access to the default subscription, you do not need to provide either ResourceGroup or SubscriptionId parameters.
* Specify the ResourceGroup parameter only when you want to limit the scope of the role assignment to a resource group.
*  In this example, you add the service principal to the Contributor role. For other roles, see [RBAC: Built-in roles](../active-directory/role-based-access-built-in-roles.md).
* The script sleeps for 15 seconds to allow some time for the new service principal to propagate throughout Azure Active Directory. If your script does not wait long enough, you see an error stating: "PrincipalNotFound: Principal {id} does not exist in the directory."
* If you need to grant the service principal access to more subscriptions or resource groups, run the `New-AzureRMRoleAssignment` cmdlet again with different scopes.


### Provide credentials through PowerShell
Now, you need to log in as the application to perform operations. For the user name, use the `ApplicationId` that you created for the application. For the password, use the one you specified when creating the account. 

```powershell   
$creds = Get-Credential
Login-AzureRmAccount -Credential $creds -ServicePrincipal -TenantId {tenant-id}
```

The tenant ID is not sensitive, so you can embed it directly in your script. If you need to retrieve the tenant ID, use:

```powershell
(Get-AzureRmSubscription -SubscriptionName "Contoso Default").TenantId
```

## Create service principal with self-signed certificate

To create a service principal with a self-signed certificate and the Contributor role for your subscription, use: 

```powershell
Login-AzureRmAccount
$cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=exampleappScriptCert" -KeySpec KeyExchange
$keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

$sp = New-AzureRMADServicePrincipal -DisplayName exampleapp -CertValue $keyValue -EndDate $cert.NotAfter -StartDate $cert.NotBefore
Sleep 20
New-AzureRmRoleAssignment -RoleDefinitionName Contributor -ServicePrincipalName $sp.ApplicationId
```

The example sleeps for 20 seconds to allow some time for the new service principal to propagate throughout Azure Active Directory. If your script does not wait long enough, you see an error stating: "PrincipalNotFound: Principal {id} does not exist in the directory."

The following script enables you to specify a scope other than the default subscription, and retries the role assignment if an error occurs. You must have Azure PowerShell 2.0 on Windows 10 or Windows Server 2016.

```powershell
Param (

 # Use to set scope to resource group. If no value is provided, scope is set to subscription.
 [Parameter(Mandatory=$false)]
 [String] $ResourceGroup,

 # Use to set subscription. If no value is provided, default subscription is used. 
 [Parameter(Mandatory=$false)]
 [String] $SubscriptionId,

 [Parameter(Mandatory=$true)]
 [String] $ApplicationDisplayName
 )

 Login-AzureRmAccount
 Import-Module AzureRM.Resources

 if ($SubscriptionId -eq "") 
 {
    $SubscriptionId = (Get-AzureRmContext).Subscription.Id
 }
 else
 {
    Set-AzureRmContext -SubscriptionId $SubscriptionId
 }

 if ($ResourceGroup -eq "")
 {
    $Scope = "/subscriptions/" + $SubscriptionId
 }
 else
 {
    $Scope = (Get-AzureRmResourceGroup -Name $ResourceGroup -ErrorAction Stop).ResourceId
 }

 $cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=exampleappScriptCert" -KeySpec KeyExchange
 $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

 $ServicePrincipal = New-AzureRMADServicePrincipal -DisplayName $ApplicationDisplayName -CertValue $keyValue -EndDate $cert.NotAfter -StartDate $cert.NotBefore
 Get-AzureRmADServicePrincipal -ObjectId $ServicePrincipal.Id 

 $NewRole = $null
 $Retries = 0;
 While ($NewRole -eq $null -and $Retries -le 6)
 {
    # Sleep here for a few seconds to allow the service principal application to become active (should only take a couple of seconds normally)
    Sleep 15
    New-AzureRMRoleAssignment -RoleDefinitionName Contributor -ServicePrincipalName $ServicePrincipal.ApplicationId -Scope $Scope | Write-Verbose -ErrorAction SilentlyContinue
    $NewRole = Get-AzureRMRoleAssignment -ServicePrincipalName $ServicePrincipal.ApplicationId -ErrorAction SilentlyContinue
    $Retries++;
 }
```

A few items to note about the script:

* To grant the identity access to the default subscription, you do not need to provide either ResourceGroup or SubscriptionId parameters.
* Specify the ResourceGroup parameter only when you want to limit the scope of the role assignment to a resource group.
* In this example, you add the service principal to the Contributor role. For other roles, see [RBAC: Built-in roles](../active-directory/role-based-access-built-in-roles.md).
* The script sleeps for 15 seconds to allow some time for the new service principal to propagate throughout Azure Active Directory. If your script does not wait long enough, you see an error stating: "PrincipalNotFound: Principal {id} does not exist in the directory."
* If you need to grant the service principal access to more subscriptions or resource groups, run the `New-AzureRMRoleAssignment` cmdlet again with different scopes.

If you **do not have Windows 10 or Windows Server 2016 Technical Preview**, you need to download the [Self-signed certificate generator](https://gallery.technet.microsoft.com/scriptcenter/Self-signed-certificate-5920a7c6/) from Microsoft Script Center. Extract its contents and import the cmdlet you need.

```powershell  
# Only run if you could not use New-SelfSignedCertificate
Import-Module -Name c:\ExtractedModule\New-SelfSignedCertificateEx.ps1
```
  
In the script, substitute the following two lines to generate the certificate.
  
```powershell
New-SelfSignedCertificateEx  -StoreLocation CurrentUser -StoreName My -Subject "CN=exampleapp" -KeySpec "Exchange" -FriendlyName "exampleapp"
$cert = Get-ChildItem -path Cert:\CurrentUser\my | where {$PSitem.Subject -eq 'CN=exampleapp' }
```

### Provide certificate through automated PowerShell script
Whenever you sign in as a service principal, you need to provide the tenant id of the directory for your AD app. A tenant is an instance of Azure Active Directory. If you only have one subscription, you can use:

```powershell
Param (
 
 [Parameter(Mandatory=$true)]
 [String] $CertSubject,
 
 [Parameter(Mandatory=$true)]
 [String] $ApplicationId,

 [Parameter(Mandatory=$true)]
 [String] $TenantId
 )

 $Thumbprint = (Get-ChildItem cert:\CurrentUser\My\ | Where-Object {$_.Subject -match $CertSubject }).Thumbprint
 Login-AzureRmAccount -ServicePrincipal -CertificateThumbprint $Thumbprint -ApplicationId $ApplicationId -TenantId $TenantId
```

The application ID and tenant ID are not sensitive, so you can embed them directly in your script. If you need to retrieve the tenant ID, use:

```powershell
(Get-AzureRmSubscription -SubscriptionName "Contoso Default").TenantId
```

If you need to retrieve the application ID, use:

```powershell
(Get-AzureRmADApplication -DisplayNameStartWith {display-name}).ApplicationId
```

## Create service principal with certificate from Certificate Authority
To use a certificate issued from a Certificate Authority to create service principal, use the following script:

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

 Login-AzureRmAccount
 Import-Module AzureRM.Resources
 Set-AzureRmContext -SubscriptionId $SubscriptionId

 $KeyId = (New-Guid).Guid
 $CertPassword = ConvertTo-SecureString $CertPlainPassword -AsPlainText -Force

 $PFXCert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @($CertPath, $CertPassword)
 $KeyValue = [System.Convert]::ToBase64String($PFXCert.GetRawCertData())

 $KeyCredential = New-Object  Microsoft.Azure.Commands.Resources.Models.ActiveDirectory.PSADKeyCredential
 $KeyCredential.StartDate = $PFXCert.NotBefore
 $KeyCredential.EndDate= $PFXCert.NotAfter
 $KeyCredential.KeyId = $KeyId
 $KeyCredential.CertValue = $KeyValue

 $ServicePrincipal = New-AzureRMADServicePrincipal -DisplayName $ApplicationDisplayName -KeyCredentials $keyCredential
 Get-AzureRmADServicePrincipal -ObjectId $ServicePrincipal.Id 

 $NewRole = $null
 $Retries = 0;
 While ($NewRole -eq $null -and $Retries -le 6)
 {
    # Sleep here for a few seconds to allow the service principal application to become active (should only take a couple of seconds normally)
    Sleep 15
    New-AzureRMRoleAssignment -RoleDefinitionName Contributor -ServicePrincipalName $Application.ApplicationId | Write-Verbose -ErrorAction SilentlyContinue
    $NewRole = Get-AzureRMRoleAssignment -ServicePrincipalName $Application.ApplicationId -ErrorAction SilentlyContinue
    $Retries++;
 }
 
 $NewRole
```

A few items to note about the script:

* Access is scoped to the subscription.
* In this example, you add the service principal to the Contributor role. For other roles, see [RBAC: Built-in roles](../active-directory/role-based-access-built-in-roles.md).
* The script sleeps for 15 seconds to allow some time for the new service principal to propagate throughout Azure Active Directory. If your script does not wait long enough, you see an error stating: "PrincipalNotFound: Principal {id} does not exist in the directory."
* If you need to grant the service principal access to more subscriptions or resource groups, run the `New-AzureRMRoleAssignment` cmdlet again with different scopes.

### Provide certificate through automated PowerShell script
Whenever you sign in as a service principal, you need to provide the tenant id of the directory for your AD app. A tenant is an instance of Azure Active Directory.

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
 $PFXCert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @($CertPath, $CertPassword)
 $Thumbprint = $PFXCert.Thumbprint

 Login-AzureRmAccount -ServicePrincipal -CertificateThumbprint $Thumbprint -ApplicationId $ApplicationId -TenantId $TenantId
```

The application ID and tenant ID are not sensitive, so you can embed them directly in your script. If you need to retrieve the tenant ID, use:

```powershell
(Get-AzureRmSubscription -SubscriptionName "Contoso Default").TenantId
```

If you need to retrieve the application ID, use:

```powershell
(Get-AzureRmADApplication -DisplayNameStartWith {display-name}).ApplicationId
```

## Change credentials

To change the credentials for an AD app, either because of a security compromise or a credential expiration, use the [Remove-AzureRmADAppCredential](/powershell/resourcemanager/azurerm.resources/v3.3.0/remove-azurermadappcredential) and [New-AzureRmADAppCredential](/powershell/module/azurerm.resources/new-azurermadappcredential) cmdlets.

To remove all the credentials for an application, use:

```powershell
Remove-AzureRmADAppCredential -ApplicationId 8bc80782-a916-47c8-a47e-4d76ed755275 -All
```

To add a password, use:

```powershell
New-AzureRmADAppCredential -ApplicationId 8bc80782-a916-47c8-a47e-4d76ed755275 -Password p@ssword!
```

To add a certificate value, create a self-signed certificate as shown in this topic. Then, use:

```powershell
New-AzureRmADAppCredential -ApplicationId 8bc80782-a916-47c8-a47e-4d76ed755275 -CertValue $keyValue -EndDate $cert.NotAfter -StartDate $cert.NotBefore
```

## Save access token to simplify log in
To avoid providing the service principal credentials every time it needs to log in, you can save the access token.

To use the current access token in a later session, save the profile.
   
```powershell
Save-AzureRmProfile -Path c:\Users\exampleuser\profile\exampleSP.json
```
   
Open the profile and examine its contents. Notice that it contains an access token. Instead of manually logging in again, simply load the profile.
   
```powershell
Select-AzureRmProfile -Path c:\Users\exampleuser\profile\exampleSP.json
```

> [!NOTE]
> The access token expires, so using a saved profile only works for as long as the token is valid.
>  

Alternatively, you can invoke REST operations from PowerShell to log in. From the authentication response, you can retrieve the access token for use with other operations. For an example of retrieving the access token by invoking REST operations, see [Generating an Access Token](resource-manager-rest-api.md#generating-an-access-token).

## Debug

You may encounter the following errors when creating a service principal:

* **"Authentication_Unauthorized"** or **"No subscription found in the context."** - You see this error when your account does not have the [required permissions](#required-permissions) on the Azure Active Directory to register an app. Typically, you see this error when only admin users in your Azure Active Directory can register apps, and your account is not an admin. Ask your administrator to either assign you to an administrator role, or to enable users to register apps.

* Your account **"does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/{guid}'."** - You see this error when your account does not have sufficient permissions to assign a role to an identity. Ask your subscription administrator to add you to User Access Administrator role.

## Sample applications
The following sample applications show how to log in as the service principal.

**.NET**

* [Deploy an SSH Enabled VM with a Template with .NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-template-deployment/)
* [Manage Azure resources and resource groups with .NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-resources-and-groups/)

**Java**

* [Getting Started with Resources - Deploy Using Azure Resource Manager Template - in Java](https://azure.microsoft.com/documentation/samples/resources-java-deploy-using-arm-template/)
* [Getting Started with Resources - Manage Resource Group - in Java](https://azure.microsoft.com/documentation/samples/resources-java-manage-resource-group//)

**Python**

* [Deploy an SSH Enabled VM with a Template in Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-template-deployment/)
* [Managing Azure Resource and Resource Groups with Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-resources-and-groups/)

**Node.js**

* [Deploy an SSH Enabled VM with a Template in Node.js](https://azure.microsoft.com/documentation/samples/resource-manager-node-template-deployment/)
* [Manage Azure resources and resource groups with Node.js](https://azure.microsoft.com/documentation/samples/resource-manager-node-resources-and-groups/)

**Ruby**

* [Deploy an SSH Enabled VM with a Template in Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-template-deployment/)
* [Managing Azure Resource and Resource Groups with Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-resources-and-groups/)

## Next Steps
* For detailed steps on integrating an application into Azure for managing resources, see [Developer's guide to authorization with the Azure Resource Manager API](resource-manager-api-authentication.md).
* For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](../active-directory/active-directory-application-objects.md). 
* For more information about Azure Active Directory authentication, see [Authentication Scenarios for Azure AD](../active-directory/active-directory-authentication-scenarios.md).
* For a list of available actions that can be granted or denied to users, see [Azure Resource Manager Resource Provider operations](../active-directory/role-based-access-control-resource-provider-operations.md).

