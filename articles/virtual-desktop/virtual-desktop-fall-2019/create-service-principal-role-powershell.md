---
title: Azure Virtual Desktop (classic) service principal role assignment - Azure
description: How to create service principals and assign roles by using PowerShell in Azure Virtual Desktop (classic).
author: Heidilohr
ms.topic: tutorial
ms.date: 05/27/2020
ms.author: helohr 
ms.custom: devx-track-azurepowershell
manager: femila
---
# Tutorial: Create service principals and role assignments with PowerShell in Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects.

Service principals are identities that you can create in Microsoft Entra ID to assign roles and permissions for a specific purpose. In Azure Virtual Desktop, you can create a service principal to:

- Automate specific Azure Virtual Desktop management tasks.
- Use as credentials in place of MFA-required users when running any Azure Resource Manager template for Azure Virtual Desktop.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Create a service principal in Microsoft Entra ID.
> * Create a role assignment in Azure Virtual Desktop.
> * Sign in to Azure Virtual Desktop by using the service principal.

## Prerequisites

Before you can create service principals and role assignments, you need to do the following:

1. Follow the steps to [Install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell).

2. [Download and import the Azure Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/).

> [!IMPORTANT]
> Follow all instructions in this article in the same PowerShell session. The process might not work if you interrupt your PowerShell session by closing the window and reopening it later.

<a name='create-a-service-principal-in-azure-active-directory'></a>

## Create a service principal in Microsoft Entra ID

After you've fulfilled the prerequisites in your PowerShell session, run the following PowerShell cmdlets to create a multitenant service principal in Azure.

```powershell
Import-Module Az.Resources
Connect-AzConnect
$aadContext = Get-AzContext
$svcPrincipal = New-AzADApplication -AvailableToOtherTenants $true -DisplayName "Azure Virtual Desktop Svc Principal"
$svcPrincipalCreds = New-AzADAppCredential -ObjectId $svcPrincipal.Id
```
## View your credentials in PowerShell

Before you create the role assignment for your service principal, view your credentials and write them down for future reference. The password is especially important because you won't be able to retrieve it after you close this PowerShell session.

Here are the three values you should write down and the cmdlets you need to run to get them:

- Password:

    ```powershell
    $svcPrincipalCreds.SecretText
    ```

- Tenant ID:

    ```powershell
    $aadContext.Tenant.Id
    ```

- Application ID:

    ```powershell
    $svcPrincipal.AppId
    ```

## Create a role assignment in Azure Virtual Desktop

Next, you need to create a role assignment so the service principal can sign in to Azure Virtual Desktop. Make sure to sign in with an account that has permissions to create role assignments.

First, [download and import the Azure Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/) to use in your PowerShell session if you haven't already.

Run the following PowerShell cmdlets to connect to Azure Virtual Desktop and display your tenants.

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
Get-RdsTenant
```

When you find the tenant name for the tenant you want to create a role assignment for, use that name in the following cmdlet:

```powershell
$myTenantName = "<Azure Virtual Desktop Tenant Name>"
New-RdsRoleAssignment -RoleDefinitionName "RDS Owner" -ApplicationId $svcPrincipal.AppId -TenantName $myTenantName
```

## Sign in with the service principal

After you create a role assignment for the service principal, make sure the service principal can sign in to Azure Virtual Desktop by running the following cmdlet:

```powershell
$creds = New-Object System.Management.Automation.PSCredential($svcPrincipal.AppId, (ConvertTo-SecureString $svcPrincipalCreds.Value -AsPlainText -Force))
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com" -Credential $creds -ServicePrincipal -AadTenantId $aadContext.Tenant.Id
```

If you can sign in successfully, your service principal is configured correctly.

## Next steps

After you've created the service principal and assigned it a role in your Azure Virtual Desktop tenant, you can use it to create a host pool. To learn more about host pools, continue to the tutorial for creating a host pool in Azure Virtual Desktop.

 > [!div class="nextstepaction"]
 > [Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace-2019.md)
