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
ms.date: 04/07/2020
ms.author: rolyon
---

# Transfer an Azure subscription to a different Azure AD directory (Preview)

> [!IMPORTANT]
> Following these steps to transfer a subscription is currently in public preview.
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

### What gets transferred?

The following table lists the artifacts that will get transferred when you follow the steps in this article.

| Artifact | Transfer |
| --------- | :---------: |
| Role assignments for built-in roles | Yes |
| Role assignments for users | Yes |
| Role assignments for groups | Yes |
| Role assignments for service principals | No |
| Role assignments for Azure SQL Databases with Azure AD authentication | No |
| Role assignments for Key Vault | No |
| Role assignments for managed identities | Yes |
| Role assignments for applications | Yes |
| Custom role definitions | Yes |
| Role assignments for custom roles | Yes |

## Prerequisites

To complete these steps, you will need:

- Account Administrator of the subscription you want to transfer in the source directory
- [Owner](built-in-roles.md#owner) role in the target directory

## Step 1: Prepare for the transfer

### Inventory role assignments in the source directory

1. Sign in to the Azure portal as an administrator.

1. Open the subscription you want to transfer.

1. If you have multiple subscriptions, select the subscription you want to transfer by using [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription) and [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

    ```azurepowershell
    # Select subscription
    Get-AzSubscription -SubscriptionName "Marketing" | Set-AzContext
    ```

1. List all the role assignments.

    To list of all the role assignments (including inherited role assignments from root and management groups), use [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment). To make it easier to review the list, you can export the output as a CSV file that you can open in a spreadsheet.

    ```azurepowershell
    Get-AzRoleAssignment | Export-Csv "RoleAssignments.csv"
    ```

1. Review the list of role assignments. There might be role assignments that won't be needed in the target directory.

### Inventory custom roles in the source directory

1. List the custom roles. 

    ```azurepowershell
    Get-AzRoleDefinition | ? {$_.IsCustom -eq $true} | FT Name, IsCustom
    ```

1. Save each custom role that will be needed in the target directory as a separate JSON file.

    ```azurepowershell
    Get-AzRoleDefinition <role_name> | ConvertTo-Json
    ```

### Determine user and group mappings

1. Based on the list of role assignments, determine the users and groups you will need in the target directory.

1. Determine which users and groups you wan to map to in the target directory.

1. If necessary, in the target directory, create the users and groups you will need.

### List managed identities in the source directory

Managed identities do not get updated when a subscription is transferred to another directory. As a result, any existing system-assigned or user-assigned managed identities will be broken. After the transfer, you will be able to re-enable any system-assigned managed identities. For user-assigned managed identities, you will have to re-create and attach them in the target directory.

1. List your virtual machines and see which ones have system-assigned managed identities enabled. For more information, see [Configure managed identities for Azure resources on a VM using the Azure portal](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md).

1. List any user-assigned managed identities. For more information, see [Create, list or delete a user-assigned managed identity using Azure PowerShell](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-powershell.md).

    ```azurepowershell
    Get-AzUserAssignedIdentity -ResourceGroupName <resource_group>
    ```

### Inventory other artifacts in the source directory

> [!IMPORTANT]
> There are other artifacts that have a dependency on a subscription or a particular directory. This article lists the known Azure resources that depend on your subscription. Because resource types in Azure are constantly evolving, this article cannot list all dependencies. 

1. Determine if you are using Azure SQL Databases with Azure AD authentication.

1. Determine if you are using Key Vault access policies.

## Step 2: Transfer billing ownership

In this step, you transfer the billing ownership of the subscription from the source directory to the target directory.

> [!WARNING]
> When you transfer the billing ownership of the subscription, all role assignments in the source directory are **permanently** deleted and cannot be restored. You cannot go back once you transfer billing ownership of the subscriptions. Be sure you complete the previous steps before performing this step.

1. Follow the steps in [Transfer billing ownership of an Azure subscription to another account](../cost-management-billing/manage/billing-subscription-transfer.md).

1. Once you finish transferring ownership, return back to this article to restore the role assignments in the target directory.

## Step 3: Re-create artifacts

### Create custom roles in target directory

1. In the target directory, sign-in as the user that accepted the transfer request.

    Only the user in the new account who accepted the transfer request will have access to manage the resources.

1. In the target directory, create the custom roles that you will need. You can use the Azure portal, Azure PowerShell, Azure CLI, or REST API.

### Create role assignments in target directory

1. In the target directory, create the role assignments that you will need. You can use the Azure portal, Azure PowerShell, Azure CLI, or REST API.

### Create other artifacts in the source directory


## Next steps

- [Transfer billing ownership of an Azure subscription to another account](../cost-management-billing/manage/billing-subscription-transfer.md)
- [Transfer Azure subscriptions between subscribers and CSPs](../cost-management-billing/manage/transfer-subscriptions-subscribers-csp.md)
- [Associate or add an Azure subscription to your Azure Active Directory tenant](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)
