---
title: 'Quickstart: Create an Azure Synapse Analytics workspace using PowerShell'
description: Create an Azure Synapse Analytics workspace using Azure PowerShell by following the steps in this article.
author: WilliamDAssafMSFT
ms.service: azure-synapse-analytics
ms.topic: quickstart
ms.subservice: workspace
ms.date: 02/04/2022
ms.author: wiassaf
ms.reviewer: whhender
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create an Azure Synapse Analytics workspace with Azure PowerShell

Azure PowerShell is a set of cmdlets for managing Azure resources directly from PowerShell. You can use it in your browser with Azure Cloud Shell. You can also install it on macOS, Linux, or Windows.

In this quickstart, you learn to create an Azure Synapse Analytics workspace by using Azure PowerShell.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

- [Azure Data Lake Storage Gen2 storage account](../storage/common/storage-account-create.md)

    > [!IMPORTANT]
    > An Azure Synapse Analytics workspace needs to be able to read and write to the selected Azure Data Lake Storage Gen2 account. For any storage account that you link as the primary storage account, you must enable **hierarchical namespace** at the creation of the storage account as described in [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-powershell#create-a-storage-account).

If you choose to use Cloud Shell, see [Overview of Azure Cloud Shell](../cloud-shell/overview.md) for more information.

### Install the Azure PowerShell module locally

If you choose to use PowerShell locally, this article requires that you install the Az PowerShell module and connect to your Azure account by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet. For more information about installing the Az PowerShell module, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

For more information about authentication with Azure PowerShell, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

### Install the Azure Synapse PowerShell module

> [!IMPORTANT]
> While the `Az.Synapse` PowerShell module is in preview, you must install it separately by using the `Install-Module` cmdlet. After this PowerShell module becomes generally available, it will be part of future Az PowerShell module releases and available by default from within Cloud Shell.

```azurepowershell-interactive
Install-Module -Name Az.Synapse
```

## Create an Azure Synapse Analytics workspace by using Azure PowerShell

1. Define necessary environment variables to create resources for an Azure Synapse Analytics workspace.

   |        Variable name        |                                                 Description                                                 |
   | --------------------------- | ----------------------------------------------------------------------------------------------------------- |
   | StorageAccountName          | Name for your existing Azure Data Lake Storage Gen2 storage account.                                                           |
   | StorageAccountResourceGroup | Name of your existing Azure Data Lake Storage Gen2 storage account resource group.                                             |
   | FileShareName               | Name of your existing storage file system.                                                                  |
   | SynapseResourceGroup        | Choose a new name for your Azure Synapse Analytics resource group.                                                    |
   | Region                      | Choose one of the [Azure regions](https://azure.microsoft.com/global-infrastructure/geographies/#overview). |
   | SynapseWorkspaceName        | Choose a unique name for your new Azure Synapse Analytics workspace.                                                  |
   | SqlUser                     | Choose a value for a new username.                                                                          |
   | SqlPassword                 | Choose a secure password.                                                                                   |
   | ClientIP                    | Public IP address of the system you're running PowerShell from.                                             |
   |                             |                                                                                                             |

1. Create a resource group as a container for your Azure Synapse Analytics workspace:

   ```azurepowershell-interactive
   New-AzResourceGroup -Name $SynapseResourceGroup -Location $Region
   ```

1. Create an Azure Synapse Analytics workspace:

   ```azurepowershell-interactive
   $Cred = New-Object -TypeName System.Management.Automation.PSCredential ($SqlUser, (ConvertTo-SecureString $SqlPassword -AsPlainText -Force))

   $WorkspaceParams = @{
     Name = $SynapseWorkspaceName
     ResourceGroupName = $SynapseResourceGroup
     DefaultDataLakeStorageAccountName = $StorageAccountName
     DefaultDataLakeStorageFilesystem = $FileShareName
     SqlAdministratorLoginCredential = $Cred
     Location = $Region
   }
   New-AzSynapseWorkspace @WorkspaceParams
   ```

1. Get the web and dev URLs for Azure Synapse Analytics workspace:

   ```azurepowershell-interactive
   $WorkspaceWeb = (Get-AzSynapseWorkspace -Name $SynapseWorkspaceName -ResourceGroupName $StorageAccountResourceGroup).ConnectivityEndpoints.web
   $WorkspaceDev = (Get-AzSynapseWorkspace -Name $SynapseWorkspaceName -ResourceGroupName $StorageAccountResourceGroup).ConnectivityEndpoints.dev
   ```

1. Create a firewall rule to allow access to your Azure Synapse Analytics workspace from your machine:

   ```azurepowershell-interactive
   $FirewallParams = @{
     WorkspaceName = $SynapseWorkspaceName
     Name = 'Allow Client IP'
     ResourceGroupName = $StorageAccountResourceGroup
     StartIpAddress = $ClientIP
     EndIpAddress = $ClientIP
   }
   New-AzSynapseFirewallRule @FirewallParams
   ```

1. Open the Azure Synapse Analytics workspace web URL address stored in the environment variable `WorkspaceWeb` to
   access your workspace:

   ```azurepowershell-interactive
   Start-Process $WorkspaceWeb
   ```

   ![Screenshot that shows the Azure Synapse Analytics workspace web.](media/quickstart-create-synapse-workspace-powershell/create-workspace-powershell-1.png)

1. After it's deployed, more permissions are required.

   - In the Azure portal, assign other users of the workspace to the Contributor role in the workspace. For instructions, see [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.yml).
   - Assign other users the appropriate [Azure Synapse Analytics role-based access control roles](security/synapse-workspace-synapse-rbac-roles.md) by using Synapse Studio.
   - A member of the Owner role of the Azure Storage account must assign the Storage Blob Data Contributor role to the Azure Synapse Analytics workspace managed service identity and other users.

## Clean up resources

Follow these steps to delete the Azure Synapse Analytics workspace.

> [!WARNING]
> Deleting an Azure Synapse Analytics workspace removes the analytics engines and the data stored in the database of the contained SQL pools and workspace metadata. It will no longer be possible to connect to the SQL or Apache Spark endpoints. All code artifacts will be deleted (queries, notebooks, job definitions, and pipelines).
>
> Deleting the workspace won't affect the data in the Azure Data Lake Storage Gen2 account linked to the workspace.

If the Azure Synapse Analytics workspace created in this article isn't needed, you can delete it by running
the following example:

```azurepowershell-interactive
Remove-AzSynapseWorkspace -Name $SynapseWorkspaceNam -ResourceGroupName $SynapseResourceGroup
```

## Related content

Next, you can [create SQL pools](quickstart-create-sql-pool-studio.md) or [create Apache Spark pools](quickstart-create-apache-spark-pool-studio.md) to start analyzing and exploring your data.
