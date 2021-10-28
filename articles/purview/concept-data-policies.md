---
title: Azure Purview access policies concepts
description: Understand Azure Purview access policies
author: vlrodrig
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---

# Concepts for Azure Purview data access policies

This article helps you understand Azure Purview data access policies that allow you to manage access across your data estate from within the Azure Purview.

> [!Note]
> This capability is different from access control for Azure Purview itself, which is described in [Access control in Azure Purview](catalog-permissions.md).

> [!IMPORTANT]
> Azure Purview access policies are currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Overview

Access policies in Azure Purview enable you to manage access to different data systems across your entire data estate. For example:

A user needs read access to an Azure Storage account that has been registered in Azure Purview. You can grant this access directly in Azure Purview by creating a data access policy though the **Policy management** app in the Purview Studio.

Data access policies can be enforced through Purview on data systems that have been registered for policy.

## Azure Purview policy concepts

### Azure Purview policy

A **policy** is a named collection of policy statements. When a policy is published to one or more data systems under Purview’s governance, it's then enforced by them. A policy definition includes a policy name, description, and a list of one or more policy statements.

### Policy statement

A **policy statement** is a human readable instruction that dictates how the data source should handle a specific data operation. The policy statement comprises **Effect**, **Action, Data Resource** and **Subject**.

#### Action

An **action** is the operation being permitted or denied as part of this policy. For example: Read or Write. These high-level logical actions map to one (or more) data actions in the data system where they are enforced.

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

The end-user identity from Azure Active Directory (AAD) for whom this policy statement is applicable. This identity can be a service principal, an individual user, a group, or a managed service identity (MSI).

### Example

Deny Read on Data Asset:
*/subscription/finance/resourcegroups/prod/providers/Microsoft.Storage/storageAccounts/finDataLake/blobservice/default/containers/FinData to group Finance-analyst*

In the above policy statement, the effect is *Deny*, the action is *Read*, the data resource is Azure Storage container *FinData*, and the subject is AAD group *Finance-analyst*. If any user that belongs to this group attempts to read data from the storage container *FinData*, the request will be denied.

### Hierarchical enforcement of policies

The data resource specified in a policy statement is hierarchical by default. This means that the policy statement applies to the data object itself and to **all** the child objects contained by the data object. For example, a policy statement on Azure storage container applies to
all the blobs contained within it.

### Policy combining algorithm 

Azure Purview can have different policy statements that refer to the same data asset. When evaluating a decision for data access, Azure Purview combines all the applicable policies and provides a consolidated decision. The combining strategy is to pick the most restrictive policy.
For example, let’s assume two different policies on an Azure Storage container *FinData* as follows,

Policy 1 - *Allow Read on Data Asset /subscription/…./containers/FinData
To group Finance-analyst*

Policy 2 - *Deny Read on Data Asset /subscription/…./containers/FinData
To group Finance-contractors*

Then let’s assume that user ‘user1’, who is part of two groups:
*Finance-analyst* and *Finance-contractors*, executes a call to blob read API. Since both policies will be applicable, Azure Purview will choose the most restrictive one, which is *Deny* of *Read*. Thus, the access request will be denied.

## Policy publishing

A newly created policy exists in the draft mode state, only visible in Azure Purview. The act of publishing initiates enforcement of a policy in the specified data systems. It's an asynchronous action that can take up to 2 minutes to be effective on the underlying data sources.

A policy published to a data source could contain references to an asset belonging to a different data source. Such references will be ignored since the asset in question does not exist in the data source where the policy is applied.

## Azure Purview to data source action mapping

The following table illustrates how actions in Azure Purview data policies map to specific actions in data systems.

| **Purview policy action** | **Data source specific actions**                                                                |
|---------------------------|-------------------------------------------------------------------------------------------------|
|||
| *Read*                      |<sub>Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read                        |
|                           |<sub>Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery                      |
|                           |<sub>Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed                    |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read                            |
|||
| *Modify*                    |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read                            |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write                           |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action                      |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action                     |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete                          |
|||
| *SQL Performance Monitor*   |<sub>Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerMetadata/rows/select                     |
|                           |<sub>Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseMetadata/rows/select         |
|                           |<sub>Microsoft.Sql/sqlservers/Connect                                                                |
|                           |<sub>Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerState/rows/select                        |
|                           |<sub>Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseState/rows/select            |
|                           |<sub>Microsoft.Sql/sqlservers/databases/Connect                                                      |
|||
| *SQL Auditor*               |<sub>Microsoft.Sql/sqlservers/databases/Connect                                                      |
|                           |<sub>Microsoft.Sql/sqlservers/Connect                                                                |
|                           |<sub>Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityState/rows/select                |
|                           |<sub>Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseSecurityState/rows/select    |
|                           |<sub>Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityMetadata/rows/select             |
|                           |<sub>Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseSecurityMetadata/rows/select |

## Next steps
Check the tutorials on how to create policies in Azure Purview that work on specific data systems such as Azure Storage:

* [Dataset provisioning by data owner for Azure Storage](how-to-access-policies-storage.md)

<!--
[Dataset provisioning by data owner for Azure SQL DB](how-to-access-policies-sql.md)
-->
