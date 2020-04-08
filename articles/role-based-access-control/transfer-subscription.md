---
title: Transfer an Azure subscription to a different Azure AD directory (Preview)
description: Learn how to transfer an Azure subscription and related artifacts to a different Azure Active Directory (Azure AD) directory.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.service: role-based-access-control
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/08/2020
ms.author: rolyon
---

# Transfer an Azure subscription to a different Azure AD directory (Preview)

> [!IMPORTANT]
> Following these steps to transfer a subscription to a different Azure AD directory is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes the basic steps you can follow to transfer an Azure subscription to a different Azure Active Directory (Azure AD) directory and re-create artifacts such as role assignments, custom roles, and managed identities.

## Overview

When you transfer an Azure subscription to a different Azure AD directory, some artifacts are not transferred to the target directory. For example, all role assignments in Azure role-based access control (Azure RBAC) are by default **permanently** deleted from the source directory and are not be transferred to the target directory. Also, managed identities do not get updated. To retain your custom role definitions and role assignments and to ensure your managed identities still work, you must take additional steps.

The following diagram shows the basic steps you must follow when you transfer a subscription to a different directory.

1. Prepare for the transfer

1. Transfer billing ownership of an Azure subscription to another account

1. Re-create artifacts in the target directory such as role assignments, custom roles, and managed identities

    ![Transfer subscription diagram](./media/transfer-subscription/transfer-subscription.png)

### Why would you transfer a subscription to a different directory?

- You want to manage a subscription in your primary Azure AD directory.
- You have acquired a company and you want to manage a subscription in your primary Azure AD directory.
- You have applications that depend on a particular subscription ID that is not easy to change.

### Understand the impact of transferring a subscription

Depending on your situation, the following table lists the impact of transferring a subscription.

> [!IMPORTANT]
> Transferring a subscription does require downtime to complete the process.

| You are using  | Impact of a transfer  | What you can do  |
| --------- | --------- | --------- |
| Role assignments for any of the following: **User**, **Group** | All role assignments are permanently deleted from the source directory and will not be transferred to the target directory. | Before initiating the transfer, follow the instructions in this article to transfer your role assignments to the target directory. |
| Role assignments for any of the following: **Service Principal**, **SQL Azure**, **Managed Identity** | All role assignments are permanently deleted from the source directory and will not be transferred to the target directory. | Currently, there is not a procedure for this scenario. You must investigate the impact of these role assignment deletions. |
| Role assignments for the following: **Key Vault** | All role assignments are permanently deleted from the source directory and will not be transferred to the target directory. | You must manually re-create the custom role definitions and role assignments in the target directory. |
| Custom roles | All custom role definitions and role assignments are permanently deleted from the source directory and will not be transferred to the target directory. | You must manually re-create the custom role definitions and role assignments in the target directory. |

### What gets re-created?

The following table lists the artifacts that will get re-created when you follow the steps in this article.

| Artifact | Re-created |
| --------- | :---------: |
| Role assignments for users | :heavy_check_mark: |
| Role assignments for groups | :heavy_check_mark: |
| Role assignments for service principals | :heavy_check_mark: |
| Custom role definitions | :heavy_check_mark: |
| Role assignments that use custom roles | :heavy_check_mark: |
| Managed identities | :x: |
| Azure SQL Databases with Azure AD authentication | :x: |
| Key Vault access policies | :x: |

## Prerequisites

To complete these steps, you will need:

- [Bash in Azure Cloud Shell](/azure/cloud-shell/overview) or [Azure CLI](/cli/azure)
- Account Administrator of the subscription you want to transfer in the source directory
- [Owner](built-in-roles.md#owner) role in the target directory

## Step 1: Prepare for the transfer

### Inventory role assignments in the source directory

1. Sign in to Azure as an administrator.

1. Get a list of your subscriptions with the [az account list](/cli/azure/account#az-account-list) command:

    ```azurecli
    az account list --output table
    ```

1. Use [az account set](/cli/azure/account#az-account-set) with the subscription ID or name you want to transfer.

    ```azurecli
    az account set --subscription "Marketing"
    ```

1. Use [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list) to list all the role assignments (including inherited role assignments).

    To make it easier to review the list, you can export the output as JSON, TSV, or a table. For more information, see [List role assignments using Azure RBAC and Azure CLI](role-assignments-list-cli.md).

    ```azurecli
    az role assignment list --all --include-inherited --output json > roleassignments.json
    az role assignment list --all --include-inherited --output tsv > roleassignments.tsv
    az role assignment list --all --include-inherited --output table > roleassignments.txt
    ```

1. Save the list of role assignments.

    When you transfer a subscription, all of the role assignments are **permanently** deleted so it is important to save a copy.

1. Review the list of role assignments. There might be role assignments you won't need in the target directory.

### Inventory custom roles in the source directory

1. Use the [az role definition list](/cli/azure/role/definition#az-role-definition-list) to list your custom roles. For more information, see [Create or update custom roles for Azure resources using Azure CLI](custom-roles-cli.md).

    ```azurecli
    az role definition list --custom-role-only true --output json | jq '.[] | {"roleName":.roleName, "roleType":.roleType}'
    ```

1. Save each custom role that you will need in the target directory as a separate JSON file.

    ```azurecli
    az role definition list --name <custom_role_name> > customrolename.json
    ```

1. Make copies of the custom role files.

1. Adjust each copy to use the following format.

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

### List managed identities in the source directory

Managed identities do not get updated when a subscription is transferred to another directory. As a result, any existing system-assigned or user-assigned managed identities will be broken. After the transfer, you can re-enable any system-assigned managed identities. For user-assigned managed identities, you will have to re-create and attach them in the target directory.

1. List the virtual machines that have system-assigned managed identities enabled. For more information, see [Configure managed identities for Azure resources on a VM using the Azure portal](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md).

1. Use [az identity list](/cli/azure/identity#az-identity-list) to list any user-assigned managed identities. For more information, see [Create, list or delete a user-assigned managed identity using the Azure CLI](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md).

    ```azurecli
    az identity list -g <resource_group>
    ```

### Inventory other artifacts in the source directory

> [!IMPORTANT]
> There are other artifacts that have a dependency on a subscription or a particular directory. This section lists the other known Azure resources that depend on your subscription. Because resource types in Azure are constantly evolving, there might be additional dependencies not listed here. 

1. Use [az extension list](/cli/azure/extension#az-extension-list) to see if you have the *resource-graph* extension installed.

    ```azurecli
    az extension list
    ```

1. If not, install the *resource-graph* extension.

    ```azurecli
    az extension add --name resource-graph
    ```

1. Use [az sql server ad-admin list](/cli/azure/sql/server/ad-admin#az-sql-server-ad-admin-list) and the [az graph](/cli/azure/ext/resource-graph/graph) extension to see if you are using Azure SQL Databases with Azure AD authentication. For more information, see [Configure and manage Azure Active Directory authentication with SQL](../sql-database/sql-database-aad-authentication-configure.md).

    ```azurecli
    az sql server ad-admin list --ids $(az graph query -q 'resources | where type == "microsoft.sql/servers" | project id' -o tsv | cut -f1)
    ```

1. If you have a key vault, use [az keyvault show](/cli/azure/keyvault#az-keyvault-show) to list the access policies. For more information, see [Provide Key Vault authentication with an access control policy](../key-vault/key-vault-group-permissions-for-apps.md).

    ```azurecli
    az keyvault show --name MyKeyVault
    ```

1. Use the [az graph](/cli/azure/ext/resource-graph/graph) extension to other Azure resources with known Azure AD directory dependencies.

    ```azurecli
    az graph query -q 'resources | where type != "microsoft.azureactivedirectory/b2cdirectories" | where  identity <> "" or properties.tenantId <> "" or properties.encryptionSettingsCollection.enabled == true | project name, type, kind, identity, tenantId, properties.tenantId' --subscriptions 11111111-1111-1111-1111-111111111111 --output table
    ```

## Step 2: Transfer billing ownership

In this step, you transfer the billing ownership of the subscription from the source directory to the target directory.

> [!WARNING]
> When you transfer the billing ownership of the subscription, all role assignments in the source directory are **permanently** deleted and cannot be restored. You cannot go back once you transfer billing ownership of the subscriptions. Be sure you complete the previous steps before performing this step.

1. Follow the steps in [Transfer billing ownership of an Azure subscription to another account](../cost-management-billing/manage/billing-subscription-transfer.md).

1. Once you finish transferring ownership, return back to this article to re-create the artifacts in the target directory.

## Step 3: Re-create artifacts

### Create custom roles in target directory

1. In the target directory, sign in as the user that accepted the transfer request.

    Only the user in the new account who accepted the transfer request will have access to manage the resources.
        
1. Use [az role definition create](/cli/azure/role/definition#az-role-definition-create) to create each custom role from the files you created earlier. For more information, see [Create or update custom roles for Azure resources using Azure CLI](custom-roles-cli.md).

    ```azurecli
    az role definition create --role-definition <role_definition>
    ```

### Create role assignments in target directory

1. Use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) create the role assignments. For more information, see [Add or remove role assignments using Azure RBAC and Azure CLI](role-assignments-cli.md).

    ```azurecli
    az role assignment create --role <role_name_or_id> --assignee <assignee> --resource-group <resource_group>
    ```

### Update managed identities in target directory

1. If you have system-assigned managed identities, disable and re-enable the managed identities. For more information, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md).

1. If you have user-assigned managed identities, delete, re-create, and attach them to the appropriate resource such as virtual machines. For more information, see [Create, list or delete a user-assigned managed identity using the Azure CLI](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md).

### Create other artifacts in target directory


## Next steps

- [Transfer billing ownership of an Azure subscription to another account](../cost-management-billing/manage/billing-subscription-transfer.md)
- [Transfer Azure subscriptions between subscribers and CSPs](../cost-management-billing/manage/transfer-subscriptions-subscribers-csp.md)
- [Associate or add an Azure subscription to your Azure Active Directory tenant](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)
