---
title: Transfer an Azure subscription to a different Azure AD directory (Preview)
description: Learn how to transfer an Azure subscription and known related resources to a different Azure Active Directory (Azure AD) directory.
services: active-directory
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.devlang: na
ms.topic: how-to
ms.workload: identity
ms.date: 07/01/2020
ms.author: rolyon
---

# Transfer an Azure subscription to a different Azure AD directory (Preview)

> [!IMPORTANT]
> Following these steps to transfer a subscription to a different Azure AD directory is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Organizations might have several Azure subscriptions. Each subscription is associated with a particular Azure Active Directory (Azure AD) directory. To make management easier, you might want to transfer a subscription to a different Azure AD directory. When you transfer a subscription to a different Azure AD directory, some resources are not transferred to the target directory. For example, all role assignments and custom roles in Azure role-based access control (Azure RBAC) are **permanently** deleted from the source directory and are not be transferred to the target directory.

This article describes the basic steps you can follow to transfer a subscription to a different Azure AD directory and re-create some of the resources after the transfer.

## Overview

Transferring an Azure subscription to a different Azure AD directory is a complex process that must be carefully planned and executed. Many Azure services require security principals (identities) to operate normally or even manage other Azure resources. This article tries to cover most of the Azure services that depend heavily on security principals, but is not comprehensive.

> [!IMPORTANT]
> Transferring a subscription does require downtime to complete the process.

The following diagram shows the basic steps you must follow when you transfer a subscription to a different directory.

1. Prepare for the transfer

1. Transfer billing ownership of an Azure subscription to another account

1. Re-create resources in the target directory such as role assignments, custom roles, and managed identities

    ![Transfer subscription diagram](./media/transfer-subscription/transfer-subscription.png)

### Deciding whether to transfer a subscription to a different directory

The following are some reasons why you might want to transfer a subscription:

- Because of a company merger or acquisition, you want to manage an acquired subscription in your primary Azure AD directory.
- Someone in your organization created a subscription and you want to consolidate management to a particular Azure AD directory.
- You have applications that depend on a particular subscription ID or URL and it isn't easy to modify the application configuration or code.
- A portion of your business has been split into a separate company and you need to move some of your resources into a different Azure AD directory.
- You want to manage some of your resources in a different Azure AD directory for security isolation purposes.

Transferring a subscription does require downtime to complete the process. Depending on your scenario, it might be better to just re-create the resources and copy data to the target directory and subscription.

### Understand the impact of transferring a subscription

Several Azure resources have a dependency on a subscription or a directory. Depending on your situation, the following table lists the known impact of transferring a subscription. By performing the steps in this article, you can re-create some of the resources that existed prior to the subscription transfer.

> [!IMPORTANT]
> This section lists the known Azure services or resources that depend on your subscription. Because resource types in Azure are constantly evolving, there might be additional dependencies not listed here that can cause a breaking change to your environment. 

| Service or resource | Impacted | Recoverable | Are you impacted? | What you can do |
| --------- | --------- | --------- | --------- | --------- |
| Role assignments | Yes | Yes | [List role assignments](#save-all-role-assignments) | All role assignments are permanently deleted. You must map users, groups, and service principals to corresponding objects in the target directory. You must re-create the role assignments. |
| Custom roles | Yes | Yes | [List custom roles](#save-custom-roles) | All custom roles are permanently deleted. You must re-create the custom roles and any role assignments. |
| System-assigned managed identities | Yes | Yes | [List managed identities](#list-role-assignments-for-managed-identities) | You must disable and re-enable the managed identities. You must re-create the role assignments. |
| User-assigned managed identities | Yes | Yes | [List managed identities](#list-role-assignments-for-managed-identities) | You must delete, re-create, and attach the managed identities to the appropriate resource. You must re-create the role assignments. |
| Azure Key Vault | Yes | Yes | [List Key Vault access policies](#list-other-known-resources) | You must update the tenant ID associated with the key vaults. You must remove and add new access policies. |
| Azure SQL Databases with Azure AD authentication | Yes | No | [Check Azure SQL Databases with Azure AD authentication](#list-other-known-resources) |  |  |
| Azure Storage and Azure Data Lake Storage Gen2 | Yes | Yes |  | You must re-create any ACLs. |
| Azure Data Lake Storage Gen1 | Yes |  |  | You must re-create any ACLs. |
| Azure Files | Yes | Yes |  | You must re-create any ACLs. |
| Azure File Sync | Yes | Yes |  |  |
| Azure Managed Disks | Yes | N/A |  |  |
| Azure Container Services for Kubernetes | Yes | Yes |  |  |
| Azure Active Directory Domain Services | Yes | No |  |  |

If you are using encryption at rest for a resource, such as a storage account or a SQL database, that has a dependency on a key vault that is NOT in the same subscription that is being transferred, it can lead to an unrecoverable scenario. If you have this situation, you should take steps to use a different key vault or temporarily disable customer-managed keys to avoid this unrecoverable scenario.

## Prerequisites

To complete these steps, you will need:

- [Bash in Azure Cloud Shell](/azure/cloud-shell/overview) or [Azure CLI](https://docs.microsoft.com/cli/azure)
- Account Administrator of the subscription you want to transfer in the source directory
- [Owner](built-in-roles.md#owner) role in the target directory

## Step 1: Prepare for the transfer

### Sign in to source directory

1. Sign in to Azure as an administrator.

1. Get a list of your subscriptions with the [az account list](/cli/azure/account#az-account-list) command.

    ```azurecli
    az account list --output table
    ```

1. Use [az account set](https://docs.microsoft.com/cli/azure/account#az-account-set) to set the active subscription you want to transfer.

    ```azurecli
    az account set --subscription "Marketing"
    ```

### Install the resource-graph extension

 The resource-graph extension enables you to use the [az graph](https://docs.microsoft.com/cli/azure/ext/resource-graph/graph) command to query resources managed by Azure Resource Manager. You'll use this command in later steps.

1. Use [az extension list](https://docs.microsoft.com/cli/azure/extension#az-extension-list) to see if you have the *resource-graph* extension installed.

    ```azurecli
    az extension list
    ```

1. If not, install the *resource-graph* extension.

    ```azurecli
    az extension add --name resource-graph
    ```

### Save all role assignments

1. Use [az role assignment list](https://docs.microsoft.com/cli/azure/role/assignment#az-role-assignment-list) to list all the role assignments (including inherited role assignments).

    To make it easier to review the list, you can export the output as JSON, TSV, or a table. For more information, see [List role assignments using Azure RBAC and Azure CLI](role-assignments-list-cli.md).

    ```azurecli
    az role assignment list --all --include-inherited --output json > roleassignments.json
    az role assignment list --all --include-inherited --output tsv > roleassignments.tsv
    az role assignment list --all --include-inherited --output table > roleassignments.txt
    ```

1. Save the list of role assignments.

    When you transfer a subscription, all of the role assignments are **permanently** deleted so it is important to save a copy.

1. Review the list of role assignments. There might be role assignments you won't need in the target directory.

### Save custom roles

1. Use the [az role definition list](https://docs.microsoft.com/cli/azure/role/definition#az-role-definition-list) to list your custom roles. For more information, see [Create or update custom roles for Azure resources using Azure CLI](custom-roles-cli.md).

    ```azurecli
    az role definition list --custom-role-only true --output json --query '[].{roleName:roleName, roleType:roleType}'
    ```

1. Save each custom role that you will need in the target directory as a separate JSON file.

    ```azurecli
    az role definition list --name <custom_role_name> > customrolename.json
    ```

1. Make copies of the custom role files.

1. Modify each copy to use the following format.

    You'll use these files later to re-create the custom roles in the target directory.

    ```json
    {
      "Name": "",
      "Description": "",
      "Actions": [],
      "NotActions": [],
      "DataActions": [],
      "NotDataActions": [],
      "AssignableScopes": []
    }
    ```

### Determine user, group, and service principal mappings

1. Based on your list of role assignments, determine the users, groups, and service principals you will map to in the target directory.

    You can identify the type of principal by looking at the `principalType` property in each role assignment.

1. If necessary, in the target directory, create any users, groups, or service principals you will need.

### List role assignments for managed identities

Managed identities do not get updated when a subscription is transferred to another directory. As a result, any existing system-assigned or user-assigned managed identities will be broken. After the transfer, you can re-enable any system-assigned managed identities. For user-assigned managed identities, you will have to re-create and attach them in the target directory.

1. Review the [list of Azure services that support managed identities](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md) to note where you might be using managed identities.

1. Use [az ad sp list](/azure/ad/sp#az-ad-sp-list) to list your system-assigned and user-assigned managed identities.

    ```azurecli
    az ad sp list --all --filter "servicePrincipalType eq 'ManagedIdentity'"
    ```

1. In the list of managed identities, determine which are system-assigned and which are user-assigned. You can use the following criteria to determine the type.

    | Criteria | Managed identity type |
    | --- | --- |
    | `alternativeNames` property includes `isExplicit=False` | System-assigned |
    | `alternativeNames` property does not include `isExplicit` | System-assigned |
    | `alternativeNames` property includes `isExplicit=True` | User-assigned |

    You can also use [az identity list](https://docs.microsoft.com/cli/azure/identity#az-identity-list) to just list user-assigned managed identities. For more information, see [Create, list or delete a user-assigned managed identity using the Azure CLI](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md).

    ```azurecli
    az identity list
    ```

1. Get a list of the `objectId` values for your managed identities.

1. Search your list of role assignments to see if there are any role assignments for your managed identities.

### List key vaults

When you create a key vault, it is automatically tied to the default Azure Active Directory tenant ID for the subscription in which it is created. All access policy entries are also tied to this tenant ID. For more information, see [Moving an Azure Key Vault to another subscription](../key-vault/general/keyvault-move-subscription.md).

> [!WARNING]
> If you are using encryption at rest for a resource, such as a storage account or a SQL database, that has a dependency on a key vault that is NOT in the same subscription that is being transferred, it can lead to an unrecoverable scenario. If you have this situation, you should take steps to use a different key vault or temporarily disable customer-managed keys to avoid this unrecoverable scenario.

- If you have a key vault, use [az keyvault show](https://docs.microsoft.com/cli/azure/keyvault#az-keyvault-show) to list the access policies. For more information, see [Provide Key Vault authentication with an access control policy](../key-vault/key-vault-group-permissions-for-apps.md).

    ```azurecli
    az keyvault show --name MyKeyVault
    ```

### List Azure SQL Databases with Azure AD authentication

- Use [az sql server ad-admin list](https://docs.microsoft.com/cli/azure/sql/server/ad-admin#az-sql-server-ad-admin-list) and the [az graph](https://docs.microsoft.com/cli/azure/ext/resource-graph/graph) extension to see if you are using Azure SQL Databases with Azure AD authentication. For more information, see [Configure and manage Azure Active Directory authentication with SQL](../sql-database/sql-database-aad-authentication-configure.md).

    ```azurecli
    az sql server ad-admin list --ids $(az graph query -q 'resources | where type == "microsoft.sql/servers" | project id' -o tsv | cut -f1)
    ```

### List ACLs

1. If you are using Azure Data Lake Storage Gen1, list the ACLs that are applied to any file by using the Azure portal or PowerShell.

1. If you are using Azure Data Lake Storage Gen2, list the ACLs that are applied to any file by using the Azure portal or PowerShell.

1. If you are using Azure Files, list the ACLs that are applied to any file.

### List other known resources

1. Use [az account show](https://docs.microsoft.com/cli/azure/account#az-account-show) to get your subscription ID.

    ```azurecli
    subscriptionId=$(az account show --query id | sed -e 's/^"//' -e 's/"$//')
    ```

1. Use the [az graph](https://docs.microsoft.com/cli/azure/ext/resource-graph/graph) extension to list other Azure resources with known Azure AD directory dependencies.

    ```azurecli
    az graph query -q \
    'resources | where type != "microsoft.azureactivedirectory/b2cdirectories" | where  identity <> "" or properties.tenantId <> "" or properties.encryptionSettingsCollection.enabled == true | project name, type, kind, identity, tenantId, properties.tenantId' \
    --subscriptions $subscriptionId --output table
    ```

## Step 2: Transfer billing ownership

In this step, you transfer the billing ownership of the subscription from the source directory to the target directory.

> [!WARNING]
> When you transfer the billing ownership of the subscription, all role assignments in the source directory are **permanently** deleted and cannot be restored. You cannot go back once you transfer billing ownership of the subscription. Be sure you complete the previous steps before performing this step.

1. Follow the steps in [Transfer billing ownership of an Azure subscription to another account](../cost-management-billing/manage/billing-subscription-transfer.md). To transfer the subscription to a different Azure AD directory, you must check the **Subscription Azure AD tenant** check box.

1. Once you finish transferring ownership, return back to this article to re-create the resources in the target directory.

## Step 3: Re-create resources

### Sign in to target directory

1. In the target directory, sign in as the user that accepted the transfer request.

    Only the user in the new account who accepted the transfer request will have access to manage the resources.

1. Get a list of your subscriptions with the [az account list](https://docs.microsoft.com/cli/azure/account#az-account-list) command.

    ```azurecli
    az account list --output table
    ```

1. Use [az account set](https://docs.microsoft.com/cli/azure/account#az-account-set) to set the active subscription you want to use.

    ```azurecli
    az account set --subscription "Contoso"
    ```

### Create custom roles
        
- Use [az role definition create](https://docs.microsoft.com/cli/azure/role/definition#az-role-definition-create) to create each custom role from the files you created earlier. For more information, see [Create or update custom roles for Azure resources using Azure CLI](custom-roles-cli.md).

    ```azurecli
    az role definition create --role-definition <role_definition>
    ```

### Create role assignments

- Use [az role assignment create](https://docs.microsoft.com/cli/azure/role/assignment#az-role-assignment-create) to create the role assignments for users, groups, and service principals. For more information, see [Add or remove role assignments using Azure RBAC and Azure CLI](role-assignments-cli.md).

    ```azurecli
    az role assignment create --role <role_name_or_id> --assignee <assignee> --resource-group <resource_group>
    ```

### Update system-assigned managed identities

1. Disable and re-enable system-assigned managed identities.

    | Azure service | More information | 
    | --- | --- |
    | Virtual machines | [Configure managed identities for Azure resources on an Azure VM using Azure CLI](../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#system-assigned-managed-identity) |
    | Virtual machine scale sets | [Configure managed identities for Azure resources on a virtual machine scale set using Azure CLI](../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vmss.md#system-assigned-managed-identity) |
    | Other services | [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md) |

1. Use [az role assignment create](https://docs.microsoft.com/cli/azure/role/assignment#az-role-assignment-create) to create the role assignments for system-assigned managed identities. For more information, see [Assign a managed identity access to a resource using Azure CLI](../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md).

    ```azurecli
    az role assignment create --assignee <objectid> --role '<role_name_or_id>' --scope <scope>
    ```

### Update user-assigned managed identities

1. Delete, re-create, and attach user-assigned managed identities.

    | Azure service | More information | 
    | --- | --- |
    | Virtual machines | [Configure managed identities for Azure resources on an Azure VM using Azure CLI](../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#user-assigned-managed-identity) |
    | Virtual machine scale sets | [Configure managed identities for Azure resources on a virtual machine scale set using Azure CLI](../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vmss.md#user-assigned-managed-identity) |
    | Other services | [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)<br/>[Create, list or delete a user-assigned managed identity using the Azure CLI](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md) |

1. Use [az role assignment create](https://docs.microsoft.com/cli/azure/role/assignment#az-role-assignment-create) to create the role assignments for user-assigned managed identities. For more information, see [Assign a managed identity access to a resource using Azure CLI](../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md).

    ```azurecli
    az role assignment create --assignee <objectid> --role '<role_name_or_id>' --scope <scope>
    ```

### Update key vaults

This section describes the basic steps to update your key vaults. For more information, see [Moving an Azure Key Vault to another subscription](../key-vault/general/keyvault-move-subscription.md).

1. Update the tenant ID associated with all existing key vaults in the subscription to the target directory.

1. Remove all existing access policy entries.

1. Add new access policy entries associated with the target directory.

### Update ACLs

1. If you are using Azure Data Lake Storage Gen1, assign the appropriate ACLs. For more information, see [Securing data stored in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-secure-data.md).

1. If you are using Azure Data Lake Storage Gen2, assign the appropriate ACLs. For more information, see [Access control in Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-access-control.md).

1. If you are using Azure Files, assign the appropriate ACLs.

### Rotate access keys

If your intent is to remove access from users in the source directory so that they don't have access in the target directory, you should consider rotating any access keys. Until the access keys are regenerated, users would continue to have access after the transfer.

1. Rotate storage account access keys. For more information, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md).

1. If you are using access keys for other services such as Azure SQL Databases or Azure Service Bus Messaging, rotate access keys.


## Next steps

- [Transfer billing ownership of an Azure subscription to another account](../cost-management-billing/manage/billing-subscription-transfer.md)
- [Transfer Azure subscriptions between subscribers and CSPs](../cost-management-billing/manage/transfer-subscriptions-subscribers-csp.md)
- [Associate or add an Azure subscription to your Azure Active Directory tenant](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)
