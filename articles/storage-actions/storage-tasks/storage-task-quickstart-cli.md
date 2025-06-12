---
title: 'Quickstart: Create and run a storage task (Azure CLI)'
titleSuffix: Azure Storage Actions
description: Learn how to create your first storage task by using Azure CLI. You'll also assign that task to a storage account, queue the task to run, and then view the results of the run.
services: storage
author: normesta
ms.service: azure-storage-actions
ms.topic: quickstart
ms.date: 05/05/2025
ms.author: normesta
---

# Quickstart: Create, assign, and run a storage task by using Azure CLI

In this quickstart, you learn how to use Azure CLI to create a storage task and assign it to an Azure Storage account. Then, you'll review the results of the run. The storage task applies a time-based immutability policy any Microsoft Word documents that exist in the storage account.

## Prerequisites

- An Azure subscription. See [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure storage account. See [create a storage account](../../storage/common/storage-account-create.md). As you create the account, make sure to enable version-level immutability support and that you don't enable the hierarchical namespace feature.
  
   During the public, you can target only storage accounts that are in the same region as the storage tasks.

- The [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role is assigned to your user identity in the context of the storage account or resource group.

- A custom role assigned to your user identity in the context of the resource group which contains the RBAC actions necessary to assign a task to a storage account. See [Permissions required to assign a task](storage-task-authorization-roles-assign.md#permission-for-a-task-to-perform-operations).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

- This article requires version 2.57.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sign in to your Azure account

1. Sign in to your Azure account with the `az login` command.

   ```azurecli
   az login
   ```

   If the CLI can open your default browser, it will do so and load an Azure sign-in page.

   Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the authorization code displayed in your terminal. Then, sign in with your account credentials in the browser.

2. If your identity is associated with more than one subscription, and you aren't prompted to select the subscription, then set your active subscription to subscription of the storage account that you want operate upon. In this example, replace the `<subscription-id>` placeholder value with the ID of your subscription.

   ```azurecli
   az account set --subscription <subscription-id>
   ```

## Create a storage task

1. Define a _condition_ by using JSON. A condition a collection of one or more clauses. Each clause contains a property, a value, and an operator. In the following JSON, the property is `Name`, the value is `.docx`, and the operator is endsWith. This clause allows operations only on Microsoft Word documents. To learn more about the structure of conditions and a complete list of properties and operators, see [Storage task conditions](storage-task-conditions.md).

   ```azurecli
   conditionclause="[[endsWith(Name,'/.docx'/)]]"
   ```
  
  > [!NOTE]
  > Azure CLI uses shorthand syntax. Shorthand syntax is a simplified representation of a JSON string. To learn more, see [How to use shorthand syntax with Azure CLI](/cli/azure/use-azure-cli-successfully-shorthand).
   
2. Define each operation. The following example defines an operation that sets an immutability policy, and an operation that sets a blob index tag in the metadata of a Word document.

   ```azurecli
   policyoperation="{name:'SetBlobImmutabilityPolicy',parameters:{untilDate:'2024-10-20T22:30:40',mode:'locked'},onSuccess:'continue',onFailure:'break'}"
   tagoperation="{name:'SetBlobTags',parameters:{'tagsetImmutabilityUpdatedBy':'StorageTaskQuickstart'},onSuccess:'continue',onFailure:'break'}"
   action="{if:{condition:'"${conditionclause}"',operations:/["${policyoperation}","${tagoperation}"]}}"
   ```
   
3. Create a storage task by using the `az storage-actions task create` command, and pass in the conditions and operations that you defined earlier. This example creates a storage task named `mystoragetask` in resource group `mystoragetaskresourcegroup` in the West US region.

   ```azurecli
   az storage-actions task create \
      -g mystoragetaskresourcegroup \
      -n mystoragetask \
      --identity "{type:SystemAssigned}" \ 
      --action "{if:{condition:'"${conditionclause}"',operations:["${policyoperation}","${tagoperation}"]}}" \
      --description "My storage task" --enabled true
   ```

## Add an assignment

A storage task _assignment_ specifies a storage account. After you enable the storage task, the conditions and operations of your task will be applied to that storage account. The assignment also contains configuration properties which help you target specific blobs, or specify when and how often the task runs. You can add an assignment for each account you want to target.

1. Create a storage task assignment by using the `az storage account task-assignment create` command. The following assignment targets the `mycontainer` container of an account named `mystorageaccount`. This assignment specifies that the task will run only one time, and will save execution reports to a folder named `storage-tasks-report`. The task is scheduled to run `10` minutes from the present time.

   ```azurecli
   id=$(az storage-actions task show -g mystoragetaskresourcegroup -n mystoragetask --query "id") 
   current_datetime=$(date +"%Y-%m-%dT%H:%M:%S")
   executioncontextvariable="{target:{prefix:[mycontainer/],excludePrefix:[]},trigger:{type:'RunOnce',parameters:{startOn:'"${current_datetime}"'}}}"

   az storage account task-assignment create \
      -g mystoragetaskresourcegroup \
      -n mystoragetaskassignment \
      --account-name mystorageaccount \
      --description 'My Storage task assignment' \
      --enabled false \
      --task-id $id \
      --execution-context $executioncontextvariable \
      --report "{prefix:storage-tasks-report}"
   ```

2. Give the storage task permission to perform operations on the target storage account. Assign the role of `Storage Blob Data Owner` to the system-assigned managed identity of the storage task.

   ```azurecli
   $roleDefinitionId="b7e6dc6d-f1e8-4753-8033-0f276bb0955b" \
   $principalID=az storage-actions task show -g mystoragetaskresourcegroup -n mystoragetask --query "identity.principalId"
   $storageAccountID=az storage account show --name mystorageaccount --resource-group mystoragetaskresourcegroup --query "id"

   az role assignment create \
      --assignee-object-id $principalID \
      --scope $storageAccountID \
      --role $roleDefinitionId \
      --description "My role assignment" 
   ```

## View the results of a task run

After the task completes running, get a run report summary for each assignment by using the blah command.

```azurecli
az storage account task-assignment list-report \
   --account-name mystorageaccount \
   --resource-group mystoragetaskresourcegroup \
   --name mystoragetaskassignment
```

The `SummaryReportPath` field of each report summary contains a path to a detailed report. That report contains comma-separated list of the container, the blob, and the operation performed along with a status.

## Clean up resources

Remove all of the assets you've created. The easiest way to remove the assets is to delete the resource group. Removing the resource group also deletes all resources included within the group. In the following example, removing the resource group removes the storage account and the resource group itself.

```azurecli
az group delete \
   --name <resource-group> \
   --no-wait
```

## Next steps

[Create a storage task](storage-task-create.md)