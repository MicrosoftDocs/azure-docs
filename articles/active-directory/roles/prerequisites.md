---
title: Prerequisites to use PowerShell or Graph Explorer for Azure AD roles
description: Prerequisites to use PowerShell or Graph Explorer for Azure Active Directory roles.
services: active-directory
documentationcenter: ''
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.subservice: roles
ms.workload: identity
ms.date: 03/17/2022
ms.author: rolyon
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Prerequisites to use PowerShell or Graph Explorer for Azure AD roles

If you want to manage Azure Active Directory (Azure AD) roles using PowerShell or Graph Explorer, you must have the required prerequisites. This article describes the PowerShell and Graph Explorer prerequisites for different Azure AD role features.

## Microsoft Graph PowerShell

To use PowerShell commands to do the following:

- Add users, groups, or devices to an administrative unit
- Create a new group in an administrative unit

You must have the Microsoft Graph PowerShell SDK installed:

- [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation)

## AzureAD module

To use PowerShell commands to do the following:

- List role assignments
- Create a role-assignable group
- Manage administrative units

You must have the following module installed:

- [AzureAD](https://www.powershellgallery.com/packages/AzureAD) (current version)


#### Check AzureAD version

To check which version of AzureAD you have installed, use [Get-InstalledModule](/powershell/module/powershellget/get-installedmodule).

```powershell
Get-InstalledModule -Name AzureAD
```

You should see output similar to the following:

```powershell
Version    Name                                Repository           Description
-------    ----                                ----------           -----------
2.0.2.140  AzureAD                             PSGallery            Azure Active Directory V2 General Availability M...
```

#### Install AzureAD

If you don't have AzureAD installed, use [Install-Module](/powershell/module/powershellget/install-module) to install AzureAD.

```powershell
Install-Module -Name AzureAD
```

#### Update AzureAD

To update AzureAD to the latest version, re-run [Install-Module](/powershell/module/powershellget/install-module).

```powershell
Install-Module -Name AzureAD
```

#### Use AzureAD

To use AzureAD, follow these steps to make sure it is imported into the current session.

1. Use [Get-Module](/powershell/module/microsoft.powershell.core/get-module) to check if AzureAD is loaded into memory.

    ```powershell
    Get-Module -Name AzureAD
    ```

1. If you don't see any output in the previous step, use [Import-Module](/powershell/module/microsoft.powershell.core/import-module) to import AzureAD. The `-Force` parameter removes the loaded module and then imports it again.

    ```powershell
    Import-Module -Name AzureAD -Force
    ```

1. Run [Get-Module](/powershell/module/microsoft.powershell.core/get-module) again.

    ```powershell
    Get-Module -Name AzureAD
    ```

    You should see output similar to the following:
    
    ```powershell
    ModuleType Version    Name                                ExportedCommands
    ---------- -------    ----                                ----------------
    Binary     2.0.2.140  AzureAD                             {Add-AzureADApplicationOwner, Add-AzureADDeviceRegisteredO...
    ```

## AzureADPreview module

To use PowerShell commands to do the following:

- Assign roles to users or groups
- Remove a role assignment
- Make a group eligible for a role using Privileged Identity Management
- Create custom roles

You must have the following module installed:

- [AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview) (current version)


#### Check AzureADPreview version

To check which version of AzureADPreview you have installed, use [Get-InstalledModule](/powershell/module/powershellget/get-installedmodule).

```powershell
Get-InstalledModule -Name AzureADPreview
```

You should see output similar to the following:

```powershell
Version    Name                                Repository           Description
-------    ----                                ----------           -----------
2.0.2.149  AzureADPreview                      PSGallery            Azure Active Directory V2 Preview Module. ...
```

#### Install AzureADPreview

If you don't have AzureADPreview installed, use [Install-Module](/powershell/module/powershellget/install-module) to install AzureADPreview.

```powershell
Install-Module -Name AzureADPreview
```

#### Update AzureADPreview

To update AzureADPreview to the latest version, re-run [Install-Module](/powershell/module/powershellget/install-module).

```powershell
Install-Module -Name AzureADPreview
```

#### Use AzureADPreview

To use AzureADPreview, follow these steps to make sure it is imported into the current session.

1. Use [Get-Module](/powershell/module/microsoft.powershell.core/get-module) to check if AzureADPreview is loaded into memory.

    ```powershell
    Get-Module -Name AzureADPreview
    ```

1. If you don't see any output in the previous step, use [Import-Module](/powershell/module/microsoft.powershell.core/import-module) to import AzureADPreview. The `-Force` parameter removes the loaded module and then imports it again.

    ```powershell
    Import-Module -Name AzureADPreview -Force
    ```

1. Run [Get-Module](/powershell/module/microsoft.powershell.core/get-module) again.

    ```powershell
    Get-Module -Name AzureADPreview
    ```

    You should see output similar to the following:
    
    ```powershell
    ModuleType Version    Name                                ExportedCommands
    ---------- -------    ----                                ----------------
    Binary     2.0.2.149  AzureADPreview                      {Add-AzureADAdministrativeUnitMember, Add-AzureADApplicati...
    ```

## Graph Explorer

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To manage Azure AD roles using the [Microsoft Graph API](/graph/overview) and [Graph Explorer](/graph/graph-explorer/graph-explorer-overview), you must do the following:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** > **Enterprise applications**.

1. In the applications list, find and select **Graph explorer**.

1. Select **Permissions**.

1. Select **Grant admin consent for Graph explorer**.

    ![Screenshot showing the "Grant admin consent for Graph explorer" link.](./media/prerequisites/select-graph-explorer.png)

1. Use [Graph Explorer tool](https://aka.ms/ge).

## Next steps

- [Install Azure Active Directory PowerShell for Graph](/powershell/azure/active-directory/install-adv2)
- [AzureAD module docs](/powershell/module/azuread/)
- [Graph Explorer](/graph/graph-explorer/graph-explorer-overview)
