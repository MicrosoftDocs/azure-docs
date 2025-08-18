---
title: 'Create and run a storage task (PowerShell)'
titleSuffix: Azure Storage Actions
description: Learn how to create your first storage task by using PowerShell. You'll also assign that task to a storage account, queue the task to run, and then view the results of the run.
services: storage
author: normesta
ms.service: azure-storage-actions
ms.topic: quickstart
ms.date: 05/05/2025
ms.author: normesta
---

# Quickstart: Create, assign, and run a storage task by using PowerShell

In this quickstart, you learn how to use Azure PowerShell to create a storage task and assign it to an Azure Storage account. Then, you'll review the results of the run. The storage task applies a time-based immutability policy on any Microsoft Word documents that exist in the storage account.

## Prerequisites

- An Azure subscription. See [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure storage account. See [create a storage account](../../storage/common/storage-account-create.md). As you create the account, make sure to enable version-level immutability support and that you don't enable the hierarchical namespace feature.
  
  During the public, you can target only storage accounts that are in the same region as the storage tasks.

- The [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role is assigned to your user identity in the context of the storage account or resource group.

- A custom role assigned to your user identity in the context of the resource group which contains the RBAC actions necessary to assign a task to a storage account. See [Permissions required to assign a task](storage-task-authorization-roles-assign.md#permission-for-a-task-to-perform-operations).

- .NET Framework is 4.7.2 or greater installed. For more information, see [Download .NET Framework](https://dotnet.microsoft.com/download/dotnet-framework).

- PowerShell version `5.1` or higher.

## Install the PowerShell module

1. Make sure you have the latest version of PowerShellGet installed.

    ```powershell
    Install-Module PowerShellGet -Repository PSGallery -Force
    ```

2. Close and then reopen the PowerShell console.

3. Install version [7.1.1-preview](https://www.powershellgallery.com/packages/Az.Storage/7.1.1-preview) or later of the **Az.Storage** PowerShell module. You might need to uninstall other versions of the PowerShell module. For more information about installing Azure PowerShell, see [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-azure-powershell).

    ```powershell
    Install-Module Az.Storage -Repository PsGallery -RequiredVersion 7.1.1-preview -AllowClobber -AllowPrerelease -Force
    ```
4. Install **Az.StorageAction** module.

   ```powershell
   Install-Module -Name Az.StorageAction -Repository PSGallery -Force 
   ```
   For more information about how to install PowerShell modules, see [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell)

## Sign in to your Azure account

1. Open a Windows PowerShell command window, and then sign in to your Azure account with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

2. If your identity is associated with more than one subscription, and you aren't prompted to select the subscription, then set your active subscription to subscription of the storage account that you want operate upon. In this example, replace the `<subscription-id>` placeholder value with the ID of your subscription.

   ```powershell
   Select-AzSubscription -SubscriptionId <subscription-id>
   ```

## Create a storage task

1. Define a _condition_ by using JSON. A condition is a collection of one or more clauses. Each clause contains a property, a value, and an operator. In the following JSON, the property is `Name`, the value is `.docx`, and the operator is `endsWith`. This clause allows operations only on Microsoft Word documents. 

   ```powershell
   $conditions = "[[endsWith(Name, '.docx')]]"
   ```
   For a complete list of properties and operators, see [Storage task conditions](storage-task-conditions.md). 

   > [!TIP] 
   > You can add multiple conditions to the same string and separate them with a comma. 

2. Define each operation by using the `New-AzStorageActionTaskOperationObject` command. 

   The following operation creates an operation that sets an immutability policy.

   ```powershell
   $policyoperation = New-AzStorageActionTaskOperationObject `
   -Name SetBlobImmutabilityPolicy `
   -Parameter @{"untilDate" = (Get-Date).AddDays(1); "mode" = "locked"} `
   -OnFailure break `
   -OnSuccess continue

   ```
   
   The following operation sets a blob index tag in the metadata of a Word document.

    ```powershell
   $tagoperation = New-AzStorageActionTaskOperationObject -Name SetBlobTags `
   -Parameter @{"tagsetImmutabilityUpdatedBy"="StorageTaskQuickstart"} `
   -OnFailure break `
   -OnSuccess continue
   ```

3. Create a storage task by using the `New-AzStorageActionTask` command, and pass in the conditions and operations that you defined earlier. This example creates a storage task named `mystoragetask` in resource group `mystoragetaskresourcegroup` in the West US region.

   ```powershell
   $task = New-AzStorageActionTask `
   -Name mystoragetask `
   -ResourceGroupName mystoragetaskresourcegroup `
   -Location westus `
   -Enabled `
   -Description 'my powershell storage task' `
   -IfCondition $conditions `
   -IfOperation $policyoperation,$tagoperation `
   -EnableSystemAssignedIdentity:$true
   ```

## Create an assignment

A storage task _assignment_ specifies a storage account. After you enable the storage task, the conditions and operations of your task will be applied to that storage account. The assignment also contains configuration properties which help you target specific blobs, or specify when and how often the task runs. You can add an assignment for each account you want to target.

1. Create a storage task assignment by using the `New-AzStorageTaskAssignment` command. The following assignment targets the `mycontainer` container of an account named `mystorageaccount`. This assignment specifies that the task will run only one time, and will save execution reports to a folder named `storage-tasks-report`. The task is scheduled to run `10` minutes from the present time. 

   ```powershell
   $startTime = (Get-Date).AddMinutes(10)   
 
   New-AzStorageTaskAssignment `
   -ResourceGroupName mystoragetaskresourcegroup `
   -AccountName mystorageaccount `
   -name mystoragetaskAssignment `
   -TaskId $task.Id `
   -ReportPrefix "storage-tasks-report" `
   -TriggerType RunOnce `
   -StartOn $startTime.ToUniversalTime() `
   -Description "task assignment" `
   -Enabled:$true `
   -TargetPrefix "mycontainer/" `
   -TargetExcludePrefix ""
   ```

2. Give the storage task permission to perform operations on the target storage account. Assign the role of `Storage Blob Data Owner` to the system-assigned managed identity of the storage task by using the `New-AzRoleAssignment` command.

   ```powershell
   New-AzRoleAssignment `
   -ResourceGroupName mystoragetaskresourcegroup `
   -ResourceName mystorageaccount `
   -ResourceType "Microsoft.Storage/storageAccounts" `
   -ObjectId $task.IdentityPrincipalId  `
   -RoleDefinitionName "Storage Blob Data Owner"
   ```
## View the results of a task run

After the task completes running, get a run report summary for each assignment by using the `Get-AzStorageActionTasksReport` command.

```powershell
Get-AzStorageActionTasksReport `
-ResourceGroupName mystoragetaskresourcegroup `
-StorageTaskName mystoragetask | Format-List
```

The `SummaryReportPath` field of each report summary contains a path to a detailed report. That report contains comma-separated list of the container, the blob, and the operation performed along with a status.

## Clean up resources

Remove all of the assets you've created. The easiest way to remove the assets is to delete the resource group. Removing the resource group also deletes all resources included within the group. In the following example, removing the resource group removes the storage account and the resource group itself.

```powershell
Remove-AzResourceGroup -Name $ResourceGroup 
```
## Next steps

[Create a storage task](storage-task-create.md)

### Microsoft Azure PowerShell storage actions cmdlets reference

- [Storage PowerShell cmdlets](/powershell/module/az.storageaction)

