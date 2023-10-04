---
title: "Tutorial: Add a role assignment condition to restrict access to blobs using Azure CLI - Azure ABAC"
titleSuffix: Azure Storage
description: Add a role assignment condition to restrict access to blobs using Azure CLI and Azure attribute-based access control (Azure ABAC).
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: tutorial
ms.author: akashdubey
ms.reviewer: nachakra
ms.custom: devx-track-azurecli
ms.date: 06/26/2023
---

# Tutorial: Add a role assignment condition to restrict access to blobs using Azure CLI

In most cases, a role assignment will grant the permissions you need to Azure resources. However, in some cases you might want to provide more granular access control by adding a role assignment condition.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Add a condition to a role assignment
> - Restrict access to blobs based on a blob index tag

[!INCLUDE [storage-abac-preview](../../../includes/storage-abac-preview.md)]

## Prerequisites

For information about the prerequisites to add or edit role assignment conditions, see [Conditions prerequisites](../../role-based-access-control/conditions-prerequisites.md).

## Condition

In this tutorial, you restrict access to blobs with a specific tag. For example, you add a condition to a role assignment so that Chandra can only read files with the tag Project=Cascade.

![Diagram of role assignment with a condition.](./media/shared/condition-role-assignment-rg.png)

If Chandra tries to read a blob without the tag Project=Cascade, access is not allowed.

![Diagram showing read access to blobs with Project=Cascade tag.](./media/shared/condition-access.png)

Here is what the condition looks like in code:

```
(
    (
        !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'}
        AND NOT
        SubOperationMatches{'Blob.List'})
    )
    OR
    (
        @Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>] StringEquals 'Cascade'
    )
)
```

## Step 1: Sign in to Azure

1. Use the [az login](/cli/azure/reference-index#az-login) command and follow the instructions that appear to sign in to your directory as [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../../role-based-access-control/built-in-roles.md#owner).

    ```azurecli
    az login
    ```

1. Use [az account show](/cli/azure/account#az-account-show) to get the ID of your subscriptions.

    ```azurecli
    az account show
    ```

1. Determine the subscription ID and initialize the variable.

    ```azurecli
    subscriptionId="<subscriptionId>"
    ```

## Step 2: Create a user

1. Use [az ad user create](/cli/azure/ad/user#az-ad-user-create) to create a user or find an existing user. This tutorial uses Chandra as the example.

1. Initialize the variable for the object ID of the user.

    ```azurecli
    userObjectId="<userObjectId>"
    ```

## Step 3: Set up storage

You can authorize access to Blob storage from the Azure CLI either with Azure AD credentials or by using the storage account access key. This article shows how to authorize Blob storage operations using Azure AD. For more information, see [Quickstart: Create, download, and list blobs with Azure CLI](storage-quickstart-blobs-cli.md)

1. Use [az storage account](/cli/azure/storage/account) to create a storage account that is compatible with the blob index feature. For more information, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md#regional-availability-and-storage-account-support).

1. Use [az storage container](/cli/azure/storage/container) to create a new blob container within the storage account and set the anonymous access level to **Private (no anonymous access)**.

1. Use [az storage blob upload](/cli/azure/storage/blob#az-storage-blob-upload) to upload a text file to the container.

1. Add the following blob index tag to the text file. For more information, see [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md).

    > [!NOTE]
    > Blobs also support the ability to store arbitrary user-defined key-value metadata. Although metadata is similar to blob index tags, you must use blob index tags with conditions.

    | Key | Value |
    | --- | --- |
    | Project  | Cascade |

1. Upload a second text file to the container.

1. Add the following blob index tag to the second text file.

    | Key | Value |
    | --- | --- |
    | Project  | Baker |

1. Initialize the following variables with the names you used.

    ```azurecli
    resourceGroup="<resourceGroup>"
    storageAccountName="<storageAccountName>"
    containerName="<containerName>"
    blobNameCascade="<blobNameCascade>"
    blobNameBaker="<blobNameBaker>"
    ```

## Step 4: Assign a role with a condition

1. Initialize the [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader) role variables.

    ```azurecli
    roleDefinitionName="Storage Blob Data Reader"
    roleDefinitionId="2a2b9908-6ea1-4ae2-8e65-a410df84e7d1"
    ```

1. Initialize the scope for the resource group.

    ```azurecli
    scope="/subscriptions/$subscriptionId/resourceGroups/$resourceGroup"
    ```

1. Initialize the condition.

    ```azurecli
    condition="((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND NOT SubOperationMatches{'Blob.List'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<\$key_case_sensitive\$>] StringEquals 'Cascade'))"
    ```

    In Bash, if history expansion is enabled, you might see the message `bash: !: event not found` because of the exclamation point (!). In this case, you can disable history expansion with the command `set +H`. To re-enable history expansion, use `set -H`.

    In Bash, a dollar sign ($) has special meaning for expansion. If your condition includes a dollar sign ($), you might need to prefix it with a backslash (\\). For example, this condition uses dollar signs to delineate the tag key name. For more information about rules for quotation marks in Bash, see [Double Quotes](https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html).

1. Initialize the condition version and description.

    ```azurecli
    conditionVersion="2.0"
    description="Read access to blobs with the tag Project=Cascade"
    ```

1. Use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to assign the [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader) role with a condition to the user at a resource group scope.

    ```azurecli
    az role assignment create --assignee-object-id $userObjectId --scope $scope --role $roleDefinitionId --description "$description" --condition "$condition" --condition-version $conditionVersion
    ```

    Here's an example of the output:

    ```azurecli
    {
      "canDelegate": null,
      "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND NOT SubOperationMatches{'Blob.List'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>] StringEquals 'Cascade'))",
      "conditionVersion": "2.0",
      "description": "Read access to blobs with the tag Project=Cascade",
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}",
      "name": "{roleAssignmentId}",
      "principalId": "{userObjectId}",
      "principalType": "User",
      "resourceGroup": "{resourceGroup}",
      "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
      "scope": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}",
      "type": "Microsoft.Authorization/roleAssignments"
    }
    ```

## Step 5: (Optional) View the condition in the Azure portal

1. In the Azure portal, open the resource group.

1. Click **Access control (IAM)**.

1. On the Role assignments tab, find the role assignment.

1. In the **Condition** column, click **View/Edit** to view the condition.

:::image type="content" source="./media/shared/condition-view.png" alt-text="Screenshot of Add role assignment condition in the Azure portal." lightbox="./media/shared/condition-view.png":::

## Step 6: Test the condition

1. Open a new command window.

1. Use [az login](/cli/azure/reference-index#az-login) to sign in as Chandra.

    ```azurecli
    az login
    ```

1. Initialize the following variables with the names you used.

    ```azurecli
    storageAccountName="<storageAccountName>"
    containerName="<containerName>"
    blobNameBaker="<blobNameBaker>"
    blobNameCascade="<blobNameCascade>"
    ```

1. Use [az storage blob show](/cli/azure/storage/blob#az-storage-blob-show) to try to read the properties of the file for the Baker project.

    ```azurecli
    az storage blob show --account-name $storageAccountName --container-name $containerName --name $blobNameBaker --auth-mode login
    ```

    Here's an example of the output. Notice that you **can't** read the file because of the condition you added.

    ```azurecli
    You do not have the required permissions needed to perform this operation.
    Depending on your operation, you may need to be assigned one of the following roles:
        "Storage Blob Data Contributor"
        "Storage Blob Data Reader"
        "Storage Queue Data Contributor"
        "Storage Queue Data Reader"

    If you want to use the old authentication method and allow querying for the right account key, please use the "--auth-mode" parameter and "key" value.
    ```

1. Read the properties of the file for the Cascade project.

    ```azurecli
    az storage blob show --account-name $storageAccountName --container-name $containerName --name $blobNameCascade --auth-mode login 
    ```

    Here's an example of the output. Notice that you can read the properties of the file because it has the tag Project=Cascade.

    ```azurecli
    {
      "container": "<containerName>",
      "content": "",
      "deleted": false,
      "encryptedMetadata": null,
      "encryptionKeySha256": null,
      "encryptionScope": null,
      "isAppendBlobSealed": null,
      "isCurrentVersion": null,
      "lastAccessedOn": null,
      "metadata": {},
      "name": "<blobNameCascade>",
      "objectReplicationDestinationPolicy": null,
      "objectReplicationSourceProperties": [],
      "properties": {
        "appendBlobCommittedBlockCount": null,
        "blobTier": "Hot",
        "blobTierChangeTime": null,
        "blobTierInferred": true,
        "blobType": "BlockBlob",
        "contentLength": 7,
        "contentRange": null,

      ...

    }
    ```

## Step 7: (Optional) Edit the condition

1. In the other command window, use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list) to get the role assignment you added.

    ```azurecli
    az role assignment list --assignee $userObjectId --resource-group $resourceGroup
    ```

    The output will be similar to the following:

    ```azurecli
    [
      {
        "canDelegate": null,
        "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND NOT SubOperationMatches{'Blob.List'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>] StringEquals 'Cascade'))",
        "conditionVersion": "2.0",
        "description": "Read access to blobs with the tag Project=Cascade",
        "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}",
        "name": "{roleAssignmentId}",
        "principalId": "{userObjectId}",
        "principalName": "chandra@contoso.com",
        "principalType": "User",
        "resourceGroup": "{resourceGroup}",
        "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
        "roleDefinitionName": "Storage Blob Data Reader",
        "scope": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}",
        "type": "Microsoft.Authorization/roleAssignments"
      }
    ]
    ```

1. Create a JSON file with the following format and update the `condition` and `description` properties.

    ```json
    {
        "canDelegate": null,
        "condition": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND NOT SubOperationMatches{'Blob.List'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>] StringEquals 'Cascade' OR @Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>] StringEquals 'Baker'))",
        "conditionVersion": "2.0",
        "description": "Read access to blobs with the tag Project=Cascade or Project=Baker",
        "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}",
        "name": "{roleAssignmentId}",
        "principalId": "{userObjectId}",
        "principalName": "chandra@contoso.com",
        "principalType": "User",
        "resourceGroup": "{resourceGroup}",
        "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
        "roleDefinitionName": "Storage Blob Data Reader",
        "scope": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}",
        "type": "Microsoft.Authorization/roleAssignments"
    }
    ```

1. Use [az role assignment update](/cli/azure/role/assignment#az-role-assignment-update) to update the condition for the role assignment.

    ```azurecli
    az role assignment update --role-assignment "./path/roleassignment.json"
    ```

## Step 8: Clean up resources

1. Use [az role assignment delete](/cli/azure/role/assignment#az-role-assignment-delete) to remove the role assignment and condition you added.

    ```azurecli
    az role assignment delete --assignee $userObjectId --role "$roleDefinitionName" --resource-group $resourceGroup
    ```

1. Delete the storage account you created.

1. Delete the user you created.

## Next steps

- [Example Azure role assignment conditions](storage-auth-abac-examples.md)
- [Actions and attributes for Azure role assignment conditions in Azure Storage](storage-auth-abac-attributes.md)
- [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md)
