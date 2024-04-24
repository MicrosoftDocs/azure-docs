---
title: Migrate MSIX packages from MSIX app attach to app attach - Azure Virtual Desktop
description: Learn how to migrate MSIX packages from MSIX app attach to app attach in Azure Virtual Desktop using a PowerShell script.
ms.topic: how-to
ms.custom: devx-track-azurepowershell
author: dknappettmsft
ms.author: daknappe
ms.date: 02/28/2024
---

# Migrate MSIX packages from MSIX app attach to app attach

> [!IMPORTANT]
> App attach is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

App attach (preview) improves the administrative and user experiences over MSIX app attach. If you use MSIX app attach, you can migrate your MSIX packages to app attach using a PowerShell script.

The migration script can perform the following actions:

- Creates a new app attach package object and can delete the original MSIX package object, if necessary.

- Copy permissions from application groups associated with the host pool and MSIX package.

- Copy the location and resource group of the host pool and MSIX package.

- Log migration activity.

## Prerequisites

To use the migration script, you need:

- A host pool configured as a validation environment, with at least one MSIX package added with MSIX app attach.

- An Azure account with the [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) Azure role-based access control (RBAC) role assigned on the host pool.

- A local device with PowerShell. Make sure you have the latest versions of [Az PowerShell](/powershell/azure/install-azps-windows) and [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation) installed. Specifically, the following modules are required:

  - Az.DesktopVirtualization
  - Az.Accounts
  - Az.Resources
  - Microsoft.Graph.Authentication

## Parameters

Here are the parameters you can use with the migration script:

| Parameter | Description |
|--|--|
| `MsixPackage` | The MSIX package object to migrate to an app attach object. This value can be passed in via pipeline. |
| `PermissionSource` | Where to get permissions from for the new app attach object. Defaults to no permissions granted. The options are:<ul><li>`DAG`: the desktop application group associated with the host pool and MSIX package</li><li>`RAG`: one or more RemoteApp application groups associated with the host pool and MSIX package</li></ul>Both options grant permission to all users and groups with any permission that is scoped specifically to the application group. |
| `HostPoolsForNewPackage` | Resource IDs of host pools to associate new app attach object with. Defaults to no host pools. Host pools must be in the same location as the app attach packages they're associated with. |
| `TargetResourceGroupName` | Resource group to store the new app attach object. Defaults to resource group of host pool that the MSIX package is associated with. |
| `Location` | Azure region to create new app attach object in. Defaults to location of host pool that the MSIX package is associated with. App attach packages have to be in the same location as the host pool they're associated with. |
| `DeleteOrigin` | Delete source MSIX package after migration. |
| `IsActive` | Enables the new app attach object. |
| `DeactivateOrigin` | Disables source MSIX package object after migration. |
| `PassThru` | Passes new app attach object through. `Passthru` returns the object for the created package. Use this value if you want to inspect it or pass it to another PowerShell command. |
| `LogInJSON` | Write to the log file in JSON Format. |
| `LogFilePath` | Path of the log file, defaults to `MsixMigration[Timestamp].log` in a temp folder, such as `C:\Users\%USERNAME%\AppData\Local\Temp\MsixMigration<DATETIME>.log`. The path for logging is written to the console when the script is run. |

## Download and run the migration script

Here's how to migrate MSIX packages from MSIX app attach to app attach.

> [!IMPORTANT]
> In the following examples, you'll need to change the `<placeholder>` values for your own.

1. Open a PowerShell prompt on your local device.

1. Download the PowerShell script `Migrate-MsixPackagesToAppAttach.ps1` and unblock it by running the following commands:

   ```powershell
   $url = "https://raw.githubusercontent.com/Azure/RDS-Templates/master/msix-app-attach/MigrationScript/Migrate-MsixPackagesToAppAttach.ps1"
   $filename = $url.Split('/')[-1]

   Invoke-WebRequest -Uri $url -OutFile $filename | Unblock-File
   ```

1. Import the required modules by running the following commands:

   ```powershell
   Import-Module Az.DesktopVirtualization
   Import-Module Az.Accounts
   Import-Module Az.Resources
   Import-Module Microsoft.Graph.Authentication
   ```

1. Connect to Azure by running the following command and following the prompts to sign in to your Azure account:

   ```powershell
   Connect-AzAccount
   ```

1. Connect to Microsoft Graph by running the following command:

    ```powershell
    Connect-MgGraph -Scopes "Group.Read.All"
    ```

The following subsections contain some examples of how to use the migration script. Refer to the [parameters](#parameters) section for all the available parameters and a description of each parameter.

> [!TIP]
> If you don't pass any parameters to the migration script, it has the following default behavior:
> - No permissions are granted to the new app attach package.
> - The new app attach package isn't associated with any host pools and is inactive.
> - The new app attach package is created in the same resource group and location as the host pool.
> - The original MSIX package is still active isn't disable or deleted.
> - Log information is written to the default file path.

### Migrate a specific MSIX package added to a host pool and application group

Here's an example to migrate a specific MSIX package added to a host pool from MSIX app attach to app attach. This example:

   - Migrates the MSIX package to the same resource group and location as the host pool.
   - Assigns the MSIX package in app attach to the same host pool and the same users as the RemoteApp application group source.
   - Leaves the existing MSIX package configuration in MSIX app attach **active** on the host pool. If you want to disable the MSIX package immediately, use the `-DeactivateOrigin` parameter.
   - Sets the new MSIX package configuration in app attach **inactive**. If you want to enable the MSIX package immediately, use the `-IsActive` parameter.
   - Writes log information to the default file path and format.

1. From the same PowerShell prompt, get a list of MSIX packages added to a host pool by running the following commands:

   ```powershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }
   
   Get-AzWvdMsixPackage @parameters | Select-Object DisplayName, Name
   ```

   The output is similar to the following output:

   ```output
   DisplayName Name
   ----------- ----
   MyApp       hp01/MyApp_1.0.0.0_neutral__abcdef123ghij
   ```

1. Find the MSIX package you want to migrate and use the value from the `Name` parameter in the previous output:

   ```powershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }
   
   $msixPackage = Get-AzWvdMsixPackage @parameters | ? Name -Match '<MSIXPackageName>'
   $hostPoolId = (Get-AzWvdHostPool @parameters).Id
   ```

1. Migrate the MSIX package by running the following commands:

   ```powershell
   $parameters = @{
       PermissionSource = 'RAG'
       HostPoolsForNewPackage = $hostPoolId
       PassThru = $true
   }

   $msixPackage | .\Migrate-MsixPackagesToAppAttach.ps1 @parameters
   ```

### Migrate all MSIX packages added to a host pool

Here's an example to migrate all MSIX packages added to a host pool from MSIX app attach to app attach. This example:

   - Migrates MSIX packages to the same resource group and location.
   - Adds the new app attach packages to the same host pool.
   - Sets all app attach packages to active.
   - Sets all MSIX packages to inactive.
   - Copies permissions from the associated desktop application group.
   - Writes log information to a custom file path at `C:\MsixToAppAttach.log` in JSON format.

1. From the same PowerShell prompt, get all MSIX packages added to a host pool and store them in a variable by running the following commands:

   ```powershell
   $parameters = @{
       HostPoolName = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }
   
   $msixPackages = Get-AzWvdMsixPackage @parameters
   $hostPoolId = (Get-AzWvdHostPool @parameters).Id   
   ```

1. Migrate the MSIX package by running the following commands:

   ```powershell
   $logFilePath = "C:\Temp\MsixToAppAttach.log"
   
   $parameters = @{
       IsActive = $true
       DeactivateOrigin = $true
       PermissionSource = 'DAG'
       HostPoolsForNewPackage = $hostPoolId
       PassThru = $true
       LogInJSON = $true
       LogFilePath = $LogFilePath
   }

   $msixPackages | .\Migrate-MsixPackagesToAppAttach.ps1 @parameters
   ```
