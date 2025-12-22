---
title: Create and manage a storage task assignment
titleSuffix: Azure Storage Actions
description: Learn how to create an assignment, and then enable that assignment to run.
author: normesta
ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: how-to
ms.author: normesta
ms.date: 05/05/2025
---

# Create and manage a storage task assignment

An _assignment_ identifies a storage account and a subset of objects in that account that the task will target. An assignment also defines when the task runs and where execution reports are stored. 

This article helps you create an assignment, and then enable that assignment to run. To learn more about storage task assignments, see [Storage task assignments](storage-task-assignment.md).

> [!IMPORTANT]
> Before you enable storage task assignment, make sure that you grant access to trusted Azure services in the network settings of each target storage account. To learn more, see [Grant access to trusted Azure services](../../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services).

## Create and manage an assignment

Create an assignment for each storage account you want to target. A storage task can contain up to 50 assignments.

> [!NOTE] 
> In the current release, you can target only storage accounts that are in the same region as the storage tasks.

## [Portal](#tab/azure-portal)

### Create an assignment from the storage task menu

You can create an assignment in the context of a storage task. This option can be convenient if you're the task author and you want to target multiple storage accounts. For each assignment, you'll identify the storage account that you want to target.

Navigate to the storage task in the Azure portal and then under **Storage task management**, select **Assignments**. 

In the **Assignments** page, select **+ Add assignment** and the **Add assignment** pane will appear.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Assignments page that appears in the context of the storage task.](../media/storage-tasks/storage-task-assignment-create/assignment-create.png)

### Create an assignment from the storage account menu

You can also create an assignment in the context of a storage account. This option can be convenient if you want to use an existing task to process objects in your storage account. For each assignment, you'll identify the storage task that you want to assign to your account.

Navigate to the storage account in the Azure portal and then under **Data management**, select **Storage tasks**.

In the **Storage tasks** page, select the **Task assignment** tab, select **+ Create assignment**, and then select **+ Add assignment**.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Assignments page that appears in the context of a storage account.](../media/storage-tasks/storage-task-assignment-create/assignment-create-2.png)

The **Add assignment** pane appears.

### Select a scope

In the **Select scope** section, select a subscription and name the assignment. Then, select the storage account that you want to target.

If you opened the **Add assignment** pane in the context of the storage account, you'll select a storage task instead of the storage account.

For a description of each property, see [Assignment settings](storage-task-assignment.md#assignment-settings).

### Add a role assignment

In the **Role assignment** section, in the **Role** drop-down list, select the role that you want to assign to the managed identity of the storage task. To ensure a successful task assignment, use roles that have the Blob Data Owner permissions. To learn more, see [Azure roles required to assign tasks](storage-task-authorization-roles-assign.md).

> [!NOTE]
> You choose the managed identity type (system-assigned or user-assigned) as part of creating the storage task.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Role assignment section of the assignment pane.](../media/storage-tasks/storage-task-assignment-create/assignment-role.png)

For a description of each property, see [Assignment settings](storage-task-assignment.md#assignment-settings).

### Add a filter

In the **Filter objects** section, choose whether you want to target a subset of blobs based on a filter. Filters help you narrow the scope of execution. If you want the task to evaluate all of the containers and blobs in an account, then you can select the **Do not filter** option. The following example uses a filter to target only blobs that exist in a container that is named `mycontainer`.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Filter objects section of the Add assignment pane.](../media/storage-tasks/storage-task-assignment-create/assignment-pane-filter-prefix.png)

For a description of each property, see [Assignment settings](storage-task-assignment.md#assignment-settings).

### Define the trigger

In the **Trigger details** section, select how often you'd like this task to run. You can choose to run this task only once, or run the task recurring. If you decide to run this task on a recurring basis, choose a start and end time and specify the number of days in between each run. You can also specify where you'd like to store the execution reports.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Triggers section of the Add assignment pane.](../media/storage-tasks/storage-task-assignment-create/assignment-trigger.png)

For a description of each property, see [Assignment settings](storage-task-assignment.md#assignment-settings).

### Save the assignment

Select the **Add** button to create the assignment.

The **Add assignment pane** closes. When deployment is complete, the assignment appears in the **Assignments** page.  If you don't see the assignment in that page, then select the **Refresh** button.

> [!div class="mx-imgBorder"]
> ![Screenshot of the assignment appearing in the Assignments page.](../media/storage-tasks/storage-task-assignment-create/assignment-refresh.png)

### Enable an assignment

The assignment is disabled by default. To enable the assignment so that it will be scheduled to run, select the checkbox that appears beside the assignment, and then select **Enable**.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Enable button in the Assignments page.](../media/storage-tasks/storage-task-assignment-create/assignment-enable.png)

After the task runs, an execution report is generated and then stored in the container that you specified when you created the assignment. For more information about that report as well as how to view metrics that capture the number of objects targeted, the number of operations attempted, and the number of operations that succeeded, see [Analyze storage task runs](storage-task-runs.md).

### Edit an assignment

An assignment becomes a sub resource of the targeted storage account. Therefore, after you create the assignment, you can edit only it's run frequency. The other fields of an assignment become read only. The **Single run (only once)** option becomes read only as well.

- To edit the run frequency of an assignment in the context of a storage task, navigate to the storage task in the Azure portal and then under **Storage task management**, select **Assignments**.

- To edit the run frequency of an assignment in the context of a storage account, navigate to the storage account in the Azure portal and then under **Data management**, select **Storage tasks**.

## [PowerShell](#tab/azure-powershell)

1. First, install the necessary PowerShell modules. See [Install the PowerShell module](storage-task-quickstart-powershell.md#install-the-powershell-module)

2. Specify how often you'd like the task to run. You can choose to run a task only once, or run the task recurring. If you decide to run this task on a recurring basis, specify a start and end time and specify the number of days in between each run. You can also specify where you'd like to store the execution reports. The following example creates variable for trigger values. 

   ```powershell
   $startTime = $startTime = (Get-Date).AddMinutes(10) 
   $reportPrefix = "my-storage-task-report"
   $triggerType = RunOnce
   $targetPrefix = "mycontainer/"
   ```

3. Get the storage task that you want to include in your assignment by using the [Get-AzStorageActionTask](/powershell/module/az.storageaction/get-azstorageactiontask) command.
   
   ```powershell
   $task = Get-AzStorageActionTask -Name <"storage-task-name"> -ResourceGroupName "<resource-group>"
   ```

4. Create a storage task assignment by using the `New-AzStorageTaskAssignment` command. The following assignment targets the `mycontainer` container of an account named `mystorageaccount`. This assignment specifies that the task will run only one time, and will save execution reports to a folder named `storage-tasks-report`. The task is scheduled to run `10` minutes from the present time. 

   ```powershell
   New-AzStorageTaskAssignment `
   -ResourceGroupName "<resource-group>" `
   -AccountName "<storage-account-name>" `
   -name "<storage-task-assignment-name>" `
   -TaskId $task.ID `
   -ReportPrefix $reportPrefix `
   -TriggerType $triggerType `
   -StartOn $startTime.ToUniversalTime() `
   -Description "<description>" `
   -Enabled:$true `
   -TargetPrefix $targetPrefix `
   -TargetExcludePrefix ""
   ```

2. Give the storage task permission to perform operations on the target storage account by assigning a role to the managed identity. You can choose the managed identity type (system-assigned or user-assigned) when you create the storage task.  

   The following commands assign the role of `Storage Blob Data Owner` to the system-assigned managed identity of the storage task. 

   ```powershell
   New-AzRoleAssignment `
   -ResourceGroupName "<resource-group>" `
   -ResourceName "<storage-account-name>" `
   -ResourceType "Microsoft.Storage/storageAccounts" `
   -ObjectId $task.IdentityPrincipalId  `
   -RoleDefinitionName "Storage Blob Data Owner"
   ```

   The following commands assign the role `Storage Blob Data Owner` to a user-assigned managed identity.

    ```powershell
    $managedIdentity = Get-AzUserAssignedIdentity -ResourceGroupName <resource-group> -Name <user-assigned-managed-identity-name>

    New-AzRoleAssignment `
    -ResourceGroupName "<resource-group>" `
    -ResourceName "<storage-account-name>" `
    -ResourceType "Microsoft.Storage/storageAccounts" `
    -ObjectId $managedIdentity.Id  `
    -RoleDefinitionName "Storage Blob Data Owner"
   ```

## [Azure CLI](#tab/azure-cli)

### Create an assignment by using Azure CLI

1. Specify how often you'd like the task to run. You can choose to run a task only once, or run the task recurring. If you decide to run this task on a recurring basis, specify a start and end time and specify the number of days in between each run. You can also specify where you'd like to store the execution reports. The following creates a JSON-formatted string variable which specifies the container name, the task run frequency (`RunOnce`), and the time to run the report.  

   ```azurecli
      current_datetime=$(date +"%Y-%m-%dT%H:%M:%S")
      executioncontextvariable="{target:{prefix:[mycontainer/],excludePrefix:[]},trigger:{type:'RunOnce',parameters:{startOn:'"${current_datetime}"'}}}"
   ```
   The string used in the `executioncontextvariable` is expressed by using shorthand syntax. Shorthand syntax is a simplified representation of a JSON string. To learn more, see [How to use shorthand syntax with Azure CLI](/cli/azure/use-azure-cli-successfully-shorthand).

2.  Get the ID of the storage task that you want to include in your assignment by using the [az storage-actions task show](/cli/azure/storage-actions/task#az-storage-actions-task-show) command, and then querying for the `id` property.

   ```azurecli
    id=$(az storage-actions task show -g "<resource-group>" -n "<storage-task-name>" --query "id")
   ```

3. Create a storage task assignment by using the `az storage account task-assignment create` command. 

   ```azurecli
   az storage account task-assignment create \
      -g '<resource-group>' \
      -n '<storage-task-assignment-name>' \
      --account-name '<storage-account-name>' \
      --description '<description>' \
      --enabled true \
      --task-id $id \
      --execution-context $executioncontextvariable \
      --report "{prefix:storage-tasks-report}"
   ```

2. Give the storage task permission to perform operations on the target storage account by assigning a role to the managed identity. You can choose the managed identity type (system-assigned or user-assigned) when you create the storage task. 

   The following commands assign the role of `Storage Blob Data Owner` to the system-assigned managed identity of the storage task.

   ```azurecli
   $storageAccountID=az storage account show --name <storage-account-name> --resource-group <resource-group> --query "id"
   $roleDefinitionId="b7e6dc6d-f1e8-4753-8033-0f276bb0955b" \


   az role assignment create \
      --assignee-object-id $principalID \
      --scope $storageAccountID \
      --role $roleDefinitionId \
      --description "My role assignment" 
   ```

   The following commands assign the role `Storage Blob Data Owner` to a user-assigned managed identity.

   ```azurecli
   $storageAccountID=az storage account show --name <storage-account-name> --resource-group <resource-group> --query "id"
   $roleDefinitionId="b7e6dc6d-f1e8-4753-8033-0f276bb0955b"
   $identityId=az identity show --name <user-assigned-managed-identity-name> \
   --resource-group <resource-group> --query "id"

    az role assignment create \
    --assignee-object-id $identityId 
      --role $roleDefinitionId \
      --description "My role assignment" 
   ```


## [Bicep](#tab/bicep)

Include a snippet similar to the following in your Bicep template.

```Bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'mystorageaccount'
  location: 'westus'
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource storageAccountName_storageTaskAssignment 'Microsoft.Storage/storageAccounts/storageTaskAssignments@2023-05-01' = {
  parent: storageAccount
  name: 'mystoragetaskassignment'
  properties: {
    taskId: '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myresourcegroup/providers/Microsoft.StorageActions/storageTasks/mystoragetask'
    enabled: true
    executionContext: {
      target: {
        prefix: [
          'mycontainer/'
        ]
        excludePrefix: []
      }
      trigger: {
        type: 'RunOnce'
        parameters: {
          startOn: '2025-04-20T21:34:00'
        }
      }
    }
    report: {
      prefix: 'storage-tasks-report'
    }
    description: 'mystoragetaskassignment'
  }
}
```

## [Template](#tab/template)

Include a JSON snippet similar to the following in your Azure Resource Manager template.

```JSON
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-02-01",
      "name": "mystorageaccount",
      "location": "westus",
      "kind": "StorageV2",
      "sku": {
        "name": "Standard_LRS"
      }
    },
    {
      "type": "Microsoft.Storage/storageAccounts/storageTaskAssignments",
      "apiVersion": "2023-05-01",
      "name": "storagetaskassignmentname",
      "properties": {
        "taskId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myresourcegroup/providers/Microsoft.StorageActions/storageTasks/mystoragetask",
        "enabled": true,
        "executionContext": {
          "target": {
            "prefix": [
              "mycontainer/"
            ],
            "excludePrefix": []
          },
          "trigger": {
            "type": "RunOnce",
            "parameters": {
              "startOn": "2025-04-20T21:34:00"
            }
          }
        },
        "report": {
          "prefix": "storage-tasks-report"
        },
        "description": "[parameters('storageTaskAssignmentDescription')]"
      },
      "dependsOn": [
        "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
      ]
    }
  ]
```

---

## See also

- [Storage task assignments](storage-task-assignment.md)
- [Azure Storage Actions overview](../overview.md)
- [Analyze storage task runs](storage-task-runs.md)
