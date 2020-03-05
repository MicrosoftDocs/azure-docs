---
title: Transfer an Azure subscription to a different Azure AD directory
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
ms.date: 03/04/2020
ms.author: rolyon
---

# Transfer an Azure subscription to a different Azure AD directory

When you transfer an Azure subscription to a different Azure Active Directory (Azure AD) directory, some artifacts are not transferred to the destination directory. For example, all role assignments in Azure role-based access control (Azure RBAC) are by default **permanently** deleted from the source directory and are not be transferred to the destination directory. Also, managed identities do not get updated. To retain your role definitions and role assignments and to ensure you managed identities still work, you must take additional steps.

This article describes the procedure and scripts you can use to transfer your subscription to different Azure AD directory and still maintain your role definitions, role assignments, and managed identities.

## Understand the impact of transferring a subscription

Depending on your situation, the following table lists the impact of transferring a subscription.

| You are using  | Impact of a transfer  | What you can do  |
| --------- | --------- | --------- |
| Role assignments for any of the following: **Service Principal**, **SQL Azure**, **Managed Identity** | All role assignments are permanently deleted from the source directory and will not be transferred to the destination directory. | Currently, there is not a procedure for this scenario. You must investigate the impact of these role assignment deletions. |
| Custom roles | All custom role definitions and role assignments are permanently deleted from the source directory and will not be transferred to the destination directory. | You must manually re-create the custom role definitions and role assignments in the destination directory. |
| Role assignments for the following: **Key Vault** | All role assignments are permanently deleted from the source directory and will not be transferred to the destination directory. |You must manually re-create the custom role definitions and role assignments in the destination directory. |
| Role assignments for any of the following: **User**, **Group** | All role assignments are permanently deleted from the source directory and will not be transferred to the destination directory. | Before initiating the transfer, follow the instructions in this article to transfer your role assignments to the destination directory. |

## What gets transferred?

The following table lists the artifacts that will get transferred when you follow the steps in this article.

| Artifact | Transfer |
| --------- | :---------: |
| Role assignments for built-in roles | Yes |
| Role assignments for users | Yes |
| Role assignments for groups | Yes |
| Role assignments for service principals | No |
| Role assignments for SQL Azure | No |
| Role assignments for managed identities | No |
| Role assignments for applications | No |
| Custom role definitions | No |
| Role assignments for custom roles | No |

## Prerequisites


## Step 1: Clean up source directory


## Step 2: Download the transfer scripts


## Step 3: Generate report


## Step 4: Export data from source directory


## Step 5: Transfer subscription


## Step 6: Restore data in destination directory



## Next steps

- [Transfer billing ownership of an Azure subscription to another account](../cost-management-billing/manage/billing-subscription-transfer.md)
- [Transfer Azure subscriptions between subscribers and CSPs](../cost-management-billing/manage/transfer-subscriptions-subscribers-csp.md)
- [Associate or add an Azure subscription to your Azure Active Directory tenant](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)
