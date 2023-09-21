---
title: Manage packages outside Synapse Analytics Studio UIs
description: Learn how to manage packages using Azure PowerShell cmdlets or REST APIs
author: shuaijunye
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 02/23/2023
ms.author: shuaijunye
ms.subservice: spark
ms.custom: devx-track-azurepowershell
---

# Automate the library management process through Azure PowerShell cmdlets and REST APIs

You may want to manage your libraries for your serverless Apache Spark pools without going into the Synapse Analytics UI pages. For example, you may find that:

- you develop a custom package and want to upload it to your workspace and use it in your Spark pool. And you want to finish the steps on your local tools without visiting the package management UIs.
- you are updating your packages through the CI/CD process

In this article, we'll provide a general guide to help you managing libraries through Azure PowerShell cmdlets or REST APIs.

## Manage packages through Azure PowerShell cmdlets

### Add new libraries

1. [New-AzSynapseWorkspacePackage](/powershell/module/az.synapse/new-azsynapseworkspacepackage) command can be used to **upload new libraries to workspace**.

    ```powershell
    New-AzSynapseWorkspacePackage -WorkspaceName ContosoWorkspace -Package ".\ContosoPackage.whl"
    ```

2. The combination of [New-AzSynapseWorkspacePackage](/powershell/module/az.synapse/new-azsynapseworkspacepackage) and [Update-AzSynapseSparkPool](/powershell/module/az.synapse/update-azsynapsesparkpool) commands can be used to **upload new libraries to workspace** and **attach the library to a Spark pool**.

    ```powershell
    $package = New-AzSynapseWorkspacePackage -WorkspaceName ContosoWorkspace -Package ".\ContosoPackage.whl"
    Update-AzSynapseSparkPool -WorkspaceName ContosoWorkspace -Name ContosoSparkPool -PackageAction Add -Package $package
    ```

3. If you want to attach an **existing workspace library** to your Spark pool, please refer to the command combination of [Get-AzSynapseWorkspacePackage](/powershell/module/az.synapse/get-azsynapseworkspacepackage) and [Update-AzSynapseSparkPool](/powershell/module/az.synapse/update-azsynapsesparkpool).

    ```powershell
    $packages = Get-AzSynapseWorkspacePackage -WorkspaceName ContosoWorkspace
    Update-AzSynapseSparkPool -WorkspaceName ContosoWorkspace -Name ContosoSparkPool -PackageAction Add -Package $packages
    ```

### Remove libraries

1. In order to **remove a installed package** from your Spark pool, please refer to the command combination of [Get-AzSynapseWorkspacePackage](/powershell/module/az.synapse/get-azsynapseworkspacepackage) and [Update-AzSynapseSparkPool](/powershell/module/az.synapse/update-azsynapsesparkpool).

    ```powershell
    $package = Get-AzSynapseWorkspacePackage -WorkspaceName ContosoWorkspace -Name ContosoPackage
    Update-AzSynapseSparkPool -WorkspaceName ContosoWorkspace -Name ContosoSparkPool -PackageAction Remove -Package $package
    ```

2. You can also retrieve a Spark pool and **remove all attached workspace libraries** from the pool by calling [Get-AzSynapseSparkPool](/powershell/module/az.synapse/get-azsynapsesparkpool) and [Update-AzSynapseSparkPool](/powershell/module/az.synapse/update-azsynapsesparkpool) commands.

    ```powershell
    $pool = Get-AzSynapseSparkPool -ResourceGroupName ContosoResourceGroup -WorkspaceName ContosoWorkspace -Name ContosoSparkPool
    $pool | Update-AzSynapseSparkPool -PackageAction Remove -Package $pool.WorkspacePackages
    ```

For more Azure PowerShell cmdlets capabilities, please refer to [Azure PowerShell cmdlets for Azure Synapse Analytics](/powershell/module/az.synapse).

## Manage packages through REST APIs

### Manage the workspace packages

With the ability of REST APIs, you can add/delete packages or list all uploaded files of your workspace. See the full supported APIs, please refer to [Overview of workspace library APIs](/rest/api/synapse/data-plane/library).

### Manage the Spark pool packages

You can leverage the [Spark pool REST API](/rest/api/synapse/big-data-pools/create-or-update) to attach or remove your custom or open source libraries to your Spark pools. 

1. For custom libraries, please specify the list of custom files as the **customLibraries** property in request body. 

    ```json
    "customLibraries": [
        {
            "name": "samplejartestfile.jar",
            "path": "<workspace-name>/libraries/<jar-name>.jar",
            "containerName": "prep",
            "uploadedTimestamp": "1970-01-01T00:00:00Z",
            "type": "jar"
        }
    ]
    ```

2. You can also update your Spark pool libraries by specifying the **libraryRequirements** property in request body. 

    ```json
    "libraryRequirements": {
          "content": "",
          "filename": "requirements.txt"
    }
    ```

## Next steps

- View the default libraries: [Apache Spark version support](apache-spark-version-support.md)
- Manage Spark pool level packages through Synapse Studio portal: [Python package management on Notebook Session](./apache-spark-manage-session-packages.md#session-scoped-python-packages)
