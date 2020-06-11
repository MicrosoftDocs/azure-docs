---
title: Windows Virtual Desktop service principal role assignment - Azure
description: How to create service principals and assign roles by using PowerShell in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 05/27/2020
ms.author: helohr
manager: lizross
---
# Tutorial: Create service principals and role assignments by using PowerShell

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects.

Service principals are identities that you can create in Azure Active Directory to assign roles and permissions for a specific purpose. In Windows Virtual Desktop, you can create a service principal to:

- Automate specific Windows Virtual Desktop management tasks.
- Use as credentials in place of MFA-required users when running any Azure Resource Manager template for Windows Virtual Desktop.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Create a service principal in Azure Active Directory.
> * Create a role assignment in Windows Virtual Desktop.
> * Sign in to Windows Virtual Desktop by using the service principal.

## Prerequisites

Before you can create service principals and role assignments, you need to do three things:

1. Install the AzureAD module. To install the module, run PowerShell as an administrator and run the following cmdlet:

    ```powershell
    Install-Module AzureAD
    ```

2. [Download and import the Windows Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/).

3. Follow all instructions in this article in the same PowerShell session. The process might not work if you interrupt your PowerShell session by closing the window and reopening it later.

## Create a service principal in Azure Active Directory

After you've fulfilled the prerequisites in your PowerShell session, run the following PowerShell cmdlets to create a multitenant service principal in Azure.

```powershell
Import-Module AzureAD
$aadContext = Connect-AzureAD
$svcPrincipal = New-AzureADApplication -AvailableToOtherTenants $true -DisplayName "Windows Virtual Desktop Svc Principal"
$svcPrincipalCreds = New-AzureADApplicationPasswordCredential -ObjectId $svcPrincipal.ObjectId
```
## View your credentials in PowerShell

Before you create the role assignment for your service principal, view your credentials and write them down for future reference. The password is especially important because you won't be able to retrieve it after you close this PowerShell session.

Here are the three credentials you should write down and the cmdlets you need to run to get them:

- Password:

    ```powershell
    $svcPrincipalCreds.Value
    ```

- Tenant ID:

    ```powershell
    $aadContext.TenantId.Guid
    ```

- Application ID:

    ```powershell
    $svcPrincipal.AppId
    ```

## Create a role assignment in Windows Virtual Desktop

Next, you need to create a role assignment so the service principal can sign in to Windows Virtual Desktop. Make sure to sign in with an account that has permissions to create role assignments.

First, [download and import the Windows Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/) to use in your PowerShell session if you haven't already.

Run the following PowerShell cmdlets to connect to Windows Virtual Desktop and display your tenants.

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
Get-RdsTenant
```

When you find the tenant name for the tenant you want to create a role assignment for, use that name in the following cmdlet:

```powershell
$myTenantName = "<Windows Virtual Desktop Tenant Name>"
New-RdsRoleAssignment -RoleDefinitionName "RDS Owner" -ApplicationId $svcPrincipal.AppId -TenantName $myTenantName
```

## Sign in with the service principal

After you create a role assignment for the service principal, make sure the service principal can sign in to Windows Virtual Desktop by running the following cmdlet:

```powershell
$creds = New-Object System.Management.Automation.PSCredential($svcPrincipal.AppId, (ConvertTo-SecureString $svcPrincipalCreds.Value -AsPlainText -Force))
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com" -Credential $creds -ServicePrincipal -AadTenantId $aadContext.TenantId.Guid
```

After you've signed in, make sure everything works by testing a few Windows Virtual Desktop PowerShell cmdlets with the service principal.

## Next steps

After you've created the service principal and assigned it a role in your Windows Virtual Desktop tenant, you can use it to create a host pool. To learn more about host pools, continue to the tutorial for creating a host pool in Windows Virtual Desktop.

 > [!div class="nextstepaction"]
 > [Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace-2019.md)
