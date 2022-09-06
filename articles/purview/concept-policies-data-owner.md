---
title: Microsoft Purview data owner policies concepts
description: Understand Microsoft Purview data owner policies
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: conceptual
ms.date: 03/20/2022
---

# Concepts for Microsoft Purview data owner policies

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article discusses concepts related to managing access to data sources in your data estate from within the Microsoft Purview governance portal.

> [!Note]
> This capability is different from access control for Microsoft Purview itself, which is described in [Access control in Microsoft Purview](catalog-permissions.md).

## Overview

Access policies in Microsoft Purview enable you to manage access to different data systems across your entire data estate. For example:

A user needs read access to an Azure Storage account that has been registered in Microsoft Purview. You can grant this access directly in Microsoft Purview by creating a data access policy through the **Policy management** app in the Microsoft Purview governance portal.

Data access policies can be enforced through Purview on data systems that have been registered for policy.

## Microsoft Purview policy concepts

### Microsoft Purview policy

A **policy** is a named collection of policy statements. When a policy is published to one or more data systems under Purview’s governance, it's then enforced by them. A policy definition includes a policy name, description, and a list of one or more policy statements.

### Policy statement

A **policy statement** is a human readable instruction that dictates how the data source should handle a specific data operation. The policy statement comprises **Effect**, **Action, Data Resource** and **Subject**.

#### Action

An **action** is the operation being permitted or denied as part of this policy. For example: Read or Modify. These high-level logical actions map to one (or more) data actions in the data system where they are enforced.

#### Effect

The **effect** indicates what should be resultant effect of this policy. Currently, the only supported value is **Allow**.

#### Data resource

The **data resource** is the fully qualified data asset path to which a policy statement is applicable. It conforms to the following format:

*/subscription/\<subscription-id>/resourcegroups/\<resource-group-name>/providers/\<provider-name>/\<data-asset-path>*

Azure Storage data-asset-path format:

*Microsoft.Storage/storageAccounts/\<account-name>/blobservice/default/containers/\<container-name>*

Azure SQL DB data-asset-path format:

*Microsoft.Sql/servers/\<server-name>*

#### Subject

The end-user identity from Azure Active Directory for whom this policy statement is applicable. This identity can be a service principal, an individual user, a group, or a managed service identity (MSI).

### Example

Deny Read on Data Asset:
*/subscription/finance/resourcegroups/prod/providers/Microsoft.Storage/storageAccounts/finDataLake/blobservice/default/containers/FinData to group Finance-analyst*

In the above policy statement, the effect is *Deny*, the action is *Read*, the data resource is Azure Storage container *FinData*, and the subject is Azure Active Directory group *Finance-analyst*. If any user that belongs to this group attempts to read data from the storage container *FinData*, the request will be denied.

### Hierarchical enforcement of policies

The data resource specified in a policy statement is hierarchical by default. This means that the policy statement applies to the data object itself and to **all** the child objects contained by the data object. For example, a policy statement on Azure storage container applies to all the blobs contained within it.

### Policy combining algorithm 

Microsoft Purview can have different policy statements that refer to the same data asset. When evaluating a decision for data access, Microsoft Purview combines all the applicable policies and provides a consolidated decision. The combining strategy picks the most restrictive policy.
For example, let’s assume two different policies on an Azure Storage container *FinData* as follows,

Policy 1 - *Allow Read on Data Asset /subscription/…./containers/FinData
To group Finance-analyst*

Policy 2 - *Deny Read on Data Asset /subscription/…./containers/FinData
To group Finance-contractors*

Then let’s assume that user ‘user1’, who is part of two groups:
*Finance-analyst* and *Finance-contractors*, executes a call to blob read API. Since both policies will be applicable, Microsoft Purview will choose the most restrictive one, which is *Deny* of *Read*. Thus, the access request will be denied.

> [!Note]
> Currently, the only supported effect is **Allow**.

## Policy publishing

A newly created policy exists in the draft mode state, only visible in Microsoft Purview. The act of publishing initiates enforcement of a policy in the specified data systems. It's an asynchronous action that can take between 5 minutes and 2 hours to be effective, depending on the enforcement code in the underlying data sources. For more information, consult the tutorials related to each data source

A policy published to a data source could contain references to an asset belonging to a different data source. Such references will be ignored since the asset in question does not exist in the data source where the policy is applied.

## Next steps
Check the tutorials on how to create policies in Microsoft Purview that work on specific data systems such as Azure Storage:

* [Access provisioning by data owner to Azure Storage datasets](how-to-policies-data-owner-storage.md)
* [Enable Microsoft Purview data owner policies on all data sources in a subscription or a resource group](./how-to-policies-data-owner-resource-group.md)
