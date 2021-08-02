---
title: Prerequisites to use PowerShell or Graph Explorer for Azure AD roles - Azure Active Directory
description: Prerequisites to use PowerShell or Graph Explorer for Azure Active Directory roles.
services: active-directory
documentationcenter: ''
author: rolyon
manager: daveba
ms.service: active-directory
ms.topic: how-to
ms.subservice: roles
ms.workload: identity
ms.date: 07/30/2021
ms.author: rolyon
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Prerequisites to use PowerShell or Graph Explorer for Azure AD roles

If you want to manage Azure Active Directory (Azure AD) roles using PowerShell or Graph Explorer, you must have the required prerequisites. This article describes the PowerShell and Graph Explorer prerequisites for different Azure AD role features.

## AzureAD module

To use PowerShell commands to do the following:

- List role assignments
- Create a role-assignable group
- Manage administrative units

You must have the following module installed:

- [AzureAD](https://www.powershellgallery.com/packages/AzureAD) version 2.0.2.137 or later


#### Check AzureAD version

To check which version of AzureAD you have installed, use [Get-InstalledModule](/powershell/module/powershellget/get-installedmodule).

```powershell
Get-InstalledModule -Name AzureAD
```

You should see output similar to the following:

```powershell
Version    Name                                Repository           Description
-------    ----                                ----------           -----------
2.0.2.137  AzureAD                             PSGallery            Azure Active Directory V2 General Availability M...
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
    Binary     2.0.2.137  AzureAD                             {Add-AzureADApplicationOwner, Add-AzureADDeviceRegisteredO...
    ```

## AzureADPreview module

To use PowerShell commands to do the following:

- Assign roles to users or groups
- Remove a role assignment
- Make a group eligible for a role using Privileged Identity Management
- Create custom roles

You must have the following module installed:

- [AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview) version 2.0.2.129 or later


#### Check AzureADPreview version

To check which version of AzureADPreview you have installed, use [Get-InstalledModule](/powershell/module/powershellget/get-installedmodule).

```powershell
Get-InstalledModule -Name AzureADPreview
```

You should see output similar to the following:

```powershell
Version    Name                                Repository           Description
-------    ----                                ----------           -----------
2.0.2.129  AzureADPreview                      PSGallery            Azure Active Directory V2 Preview Module. ...
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
    Binary     2.0.2.129  AzureADPreview                      {Add-AzureADAdministrativeUnitMember, Add-AzureADApplicati...
    ```

## Graph Explorer

To manage Azure AD roles using the [Microsoft Graph API](/graph/overview) and [Graph Explorer](/graph/graph-explorer/graph-explorer-overview), you must do the following:

1. In the Azure portal, open **Azure Active Directory**.

1. Click **Enterprise applications**.

1. In the applications list, find and click **Graph explorer**.

1. Click **Permissions**.

1. Click **Grant admin consent for Graph explorer**.

    ![Screenshot showing the "Grant admin consent for Graph explorer" link.](./media/prerequisites/select-graph-explorer.png)

1. Use [Graph Explorer tool](https://aka.ms/ge).

## Next steps

- [Install Azure Active Directory PowerShell for Graph](/powershell/azure/active-directory/install-adv2)
- [AzureAD module docs](/powershell/module/azuread/)
- [Graph Explorer](/graph/graph-explorer/graph-explorer-overview)
