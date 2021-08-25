---
title: "Tutorial: Allow read access to blobs based on tags and custom security attributes (Preview) - Azure ABAC"
description: Allow read access to blobs based on tags and custom security attributes by using Azure role assignment conditions and Azure attribute-based access control (Azure ABAC).
services: active-directory
author: rolyon
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: tutorial
ms.workload: identity
ms.date: 09/15/2021
ms.author: rolyon

#Customer intent: As a dev, devops, or it admin, I want to 
---

# Tutorial: Allow read access to blobs based on tags and custom security attributes (Preview)

> [!IMPORTANT]
> Custom security attributes are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you learn how to allow read access to blobs based on blob index tags and custom security attributes by using attribute-based access control (ABAC) conditions. This can make it easier to manage access to blobs.

In this tutorial, you learn how to:
- Allow read access to blobs based on blob index tags and custom security attributes
- Add a condition to a role assignment

## Prerequisites

To assign custom security attributes and add role assignments conditions in your Azure AD tenant, you need:

- Azure AD Premium P1 or P2 license.
- An Azure AD role with the following permissions, such as Attribute Assignment Administrator:
    - `microsoft.directory/attributeSets/allProperties/read`
    - `microsoft.directory/customSecurityAttributeDefinitions/allProperties/read`
    - `microsoft.directory/users/customSecurityAttributes/read`
    - `microsoft.directory/users/customSecurityAttributes/update`
- The following write permission, such as User Access Administrator or Owner:
    - `Microsoft.Authorization/roleAssignments/write`

> [!IMPORTANT]
> [Global Administrator](../roles/permissions-reference.md#global-administrator), [Global Reader](../roles/permissions-reference.md#global-reader), and [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator) do not have permissions to read, filter, define, manage, or assign custom security attributes. If you do not meet these prerequisites, you won't see the principal/user attributes in the condition builder.

## Condition

In this tutorial, you allow read access to blobs if the user has a custom security attribute that matches the blob index tag. This is accomplished by adding a condition to the role assignment.
 
For example, if Brenda has the attribute Project=Baker, she can only read blobs with the Project=Baker blob index tag. Similarly, Chandra can only read blobs with Project=Cascade.
 
For more information about conditions, see [What is Azure attribute-based access control (Azure ABAC)? (preview)](conditions-overview.md).

## Step 1: Add a new custom security attribute

1. Sign in to the Azure portal.

1. Click Azure Active Directory.

1. Add an attribute named Project with values of Baker and Cascade. For more information, see Add or deactivate custom security attributes in Azure AD in the previous section.
 
## Step 2: Assign the custom security attribute to a user

1. In Azure AD, create a security group.

1. Add a user as a member of the group.

1. Assign the Project attribute with a value of Cascade to the user. For more information, see Assign or remove custom security attributes for a user in the previous section. 
 
1. Be sure to click Save to save your assignment.

## Step 3: Set up storage and blob index tags

1. Create a storage account that is compatible with the blob index tags feature. For more information, see Manage and find Azure Blob data with blob index tags (preview).

1. Create a new container within the storage account and set the Public access level to Private (no anonymous access).

1. Set the authentication type to Azure AD User Account.

1. Upload text files to the container and set the following blob index tags.

    | File | Key | Value |
    | --- | --- | --- |
    | Baker text file | Project | Baker |
    | Cascade text file | Project | Cascade |
 
## Step 4: Assign Storage Blob Data Reader role with a condition

1. Open a new tab and sign in to the Azure portal.

1. Open the resource group that has the storage account.

1. Click Access control (IAM).

1. Click the Role assignments tab to view the role assignments at this scope.

1. Click Add > Add role assignment (Preview).
 
1. On the Role tab, select the Storage Blob Data Reader role.
 
1. On the Members tab, select the security group you created earlier.

1. (Optional) In the Description box, enter Read access to blobs if the user has a custom security attribute that matches the blob index tag.

1. On the Condition tab, click Add condition.
The Add role assignment condition page appears.
 
1. In the Add action section, click Add action.

    The Select an action pane appears. This pane is a filtered list of data actions based on the role assignment that will be the target of your condition.
 
1. Click Read content from a blob with tag conditions and then click Select.

1. In the Build expression section, click Add.

1. Enter the following settings:

    | Setting | Value |
    | --- | --- |
    | Attribute source | Principal |
    | Attribute | &lt;attributeset&gt;_Project |
    | Operator | StringEquals |
    | Option | Attribute |
    | Attribute source | Resource |
    | Attribute | Blob index tags [Values in key] |
    | Key | Project |

    > [!NOTE]
    > If Principal is not listed as an option in Attribute source, make sure you have defined custom security attribute as described earlier in Step 1: Add a new custom security attribute.

1. Scroll up to Editor type and click Code.

    Your condition should look similar to the following:

    ```
    (
     (
      !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND @Request[subOperation] ForAnyOfAnyValues:StringEqualsIgnoreCase {'Blob.Read.WithTagConditions'})
     )
     OR 
     (
      @Principal[Microsoft.Directory/CustomSecurityAttributes/Id:Test_Project] StringEquals @Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>]
     )
    )
    ```

1. Click Save to save the condition.

1. On the Review + assign tab, click Review + assign to assign the Storage Blob Data Reader role with a condition.

## Step 5: Assign Reader role

- Repeat the previous steps to assign the Reader role without a condition for the security group at resource group scope.

    > [!NOTE]
    > You typically do not need to assign the Reader role. However, this is done so that you can test the condition using the Azure portal.

## Step 6: Test the condition

1. In a new window, open the Azure portal.

1. Sign in as the user you created with the Project=Cascade custom security attribute.

1. Open the storage account and container you created.

1. Ensure that the authentication method is set to Azure AD User Account and not Access key.

1. Click the Baker text file.

    You should NOT be able to view or download the blob and an authorization failed message should be displayed.
 
1. Click Cascade text file.

    You should be able to view and download the blob.

## Azure PowerShell

You can also use Azure PowerShell to add role assignment conditions. The following commands show how to add conditions. For information, see Tutorial: Add a role assignment condition to restrict access to blobs using Azure PowerShell (preview).

### Add a condition

1. Use the Connect-AzAccount command and follow the instructions that appear to sign in to your directory as User Access Administrator or Owner.

    ```powershell
    Connect-AzAccount
    ```

1. Use Get-AzRoleAssignment to get the role assignment you assigned to the security group.

    ```powershell
    $groupRoleAssignment = Get-AzRoleAssignment -ObjectId <groupObjectId> -Scope <scope>
    ```
    
1. Set the Condition property of the role assignment object.

    ```powershell
    $groupRoleAssignment.Condition="((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND @Request[subOperation] ForAnyOfAnyValues:StringEqualsIgnoreCase {'Blob.Read.WithTagConditions' })) OR (@Principal[Microsoft.Directory/CustomSecurityAttributes/Id:BashABAC_Project] StringEquals @Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<`$key_case_sensitive`$>]))"
    ```

1. Set the ConditionVersion property of the role assignment object.

    ```powershell
    $groupRoleAssignment.ConditionVersion = "2.0"
    ```

1. Use Set-AzRoleAssignment to update the role assignment.

    ```powershell
    Set-AzRoleAssignment -InputObject $groupRoleAssignment
    ```

### Test the condition

1. In a new PowerShell window, use the Connect-AzAccount command to sign in as a member of the security group.

    ```powershell
    Connect-AzAccount
    ```

1. Set the context for the storage account.

    ```powershell
    $bearerCtx = New-AzStorageContext -StorageAccountName <accountName>
    ```

1. Use Get-AzStorageBlob to try to read the Baker file.

    ```powershell
    Get-AzStorageBlob -Container <containerName> -Blob <blobNameBaker> -Context $bearerCtx
    You should NOT be able to read the blob and an authorization failed message should be displayed.
    Get-AzStorageBlob : This request is not authorized to perform this operation using this permission. HTTP Status Code:
    403 - HTTP Error Message: This request is not authorized to perform this operation using this permission.
    ...
    ```

1. Use Get-AzStorageBlob to try to read the Cascade file.

    ```powershell
    Get-AzStorageBlob -Container <containerName> -Blob <blobNameCascade> -Context $bearerCtx
    You should be able to read the blob.
    AccountName: <storageAccountName>, ContainerName: <containerName>
    
    Name                 BlobType  Length          ContentType                    LastModified         AccessTier SnapshotT
                                                                                                                  ime
    ----                 --------  ------          -----------                    ------------         ---------- ---------
    CascadeFile.txt      BlockBlob 7               text/plain                     2021-04-24 05:35:24Z Hot
    ```

## Azure CLI

You can also use Azure CLI to add role assignments conditions. The following commands show how to add conditions. For information, see Tutorial: Add a role assignment condition to restrict access to blobs using Azure CLI (preview).

### Add a condition

1. Use the az login command and follow the instructions that appear to sign in to your directory as User Access Administrator or Owner.

    ```azurecli
    az login
    ```

1. Use az role assignment list to get the role assignment you assigned to the security group.

    ```azurecli
    az role assignment list --assignee <groupObjectId> --scope <scope>
    ```

1. Create a JSON file with the following format.

    ```azurecli
    {
        "canDelegate": null,
        "condition": "",
        "conditionVersion": "",
        "description": "",
        "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}",
        "name": "{roleAssignmentId}",
        "principalId": "{groupObjectId}",
        "principalName": "{principalName}",
        "principalType": "Group",
        "resourceGroup": "{resourceGroup}",
        "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
        "roleDefinitionName": "Storage Blob Data Reader",
        "scope": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}",
        "type": "Microsoft.Authorization/roleAssignments"
    }
    ```

1. Update the condition property.

    ```azurecli
    "conditionVersion": "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND @Request[subOperation] ForAnyOfAnyValues:StringEqualsIgnoreCase {'Blob.Read.WithTagConditions' })) OR (@Principal[Microsoft.Directory/CustomSecurityAttributes/Id:BashABAC_Project] StringEquals @Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>]))",
    ```

1. Update the conditionVersion property.

    ```azurecli
    "conditionVersion": "2.0",
    ```

1. Use az role assignment update to add the condition to the role assignment.

    ```azurecli
    az role assignment update --role-assignment "./path/roleassignment.json"
    ```

### Test the condition

1. In a new command window, use the az login command to sign in as a member of the security group.

    ```azurecli
    az login
    ```

1. Set the context for the storage account.

    ```azurecli
    $bearerCtx = New-AzStorageContext -StorageAccountName <accountName>
    ```

1. Use az storage blob show to try to read the properties for the Baker file.

    ```azurecli
    az storage blob show --account-name <storageAccountName> --container-name <containerName> --name <blobNameBaker> --auth-mode login
    You should NOT be able to read the blob and an authorization failed message should be displayed.
    You do not have the required permissions needed to perform this operation.
    ...
    ```

1. Use az storage blob show to try to read the properties for the Cascade file.

    ```azurecli
    az storage blob show --account-name <storageAccountName> --container-name <containerName> --name <blobNameCascade> --auth-mode login
    You should be able to read the blob.
    {
      "container": "<containerName>",
      "content": "",
      "deleted": false,
      "encryptedMetadata": null,
      "encryptionKeySha256": null,
      "encryptionScope": null,
    ...
    }
    ```

## Clean up resources

1. Remove the role assignment you added.

1. Delete the test storage account you created.

1. Remove the custom security attributes from the user.

1. Deactivate the custom security attributes you added.

## Next steps

- [What are custom security attributes in Azure AD? (Preview)](../active-directory/fundamentals/custom-security-attributes-overview.md)
- [Azure role assignment condition format and syntax (preview)](conditions-format.md)
- [Example Azure role assignment conditions (preview)](../storage/common/storage-auth-abac-examples.md?toc=/azure/role-based-access-control/toc.json)
