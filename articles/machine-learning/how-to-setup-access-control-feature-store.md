---
title: Manage access to managed feature store
description: Learn how to access to an Azure Machine Learning managed feature store using Azure role-based access control (Azure RBAC).
author: rsethur
ms.author: seramasu
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata 
ms.custom: build-2023, ignite-2023
ms.topic: how-to
ms.date: 10/31/2023 
---

# Manage access control for managed feature store

This article describes how to manage access (authorization) to an Azure Machine Learning managed feature store. [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) manages access to Azure resources, including the ability to create new resources or use existing ones. Users in your Microsoft Entra ID are assigned specific roles, which grant access to resources. Azure provides both built-in roles and the ability to create custom roles.

## Identities and user types

Azure Machine Learning supports role-based access control for these managed feature store resources:

- feature store
- feature store entity
- feature set

To control access to these resources, consider the user types shown here. For each user type, the identity can be either a Microsoft Entra identity, a service principal, or an Azure managed identity (both system managed and user assigned).

- __Feature set developers__ (for example, data scientist, data engineers, and machine learning engineers): They primarily work with the feature store workspace and they handle:
    - Feature management lifecycle, from creation to archive
    - Materialization and feature backfill set-up
    - Feature freshness and quality monitoring
- __Feature set consumers__ (for example, data scientist and machine learning engineers): They primarily work in a project workspace, and they use features in these ways:
    - Feature discovery for model reuse
    - Experimentation with features during training, to see if those features improve model performance
    - Set up of the training/inference pipelines that use the features
- __Feature store Admins__: They typically handle:
    - Feature store lifecycle management (from creation to retirement)
    - Feature store user access lifecycle management
    - Feature store configuration: quota and storage (offline/online stores)
    - Cost management

This table describes the permissions required for each user type:

|Role  |Description  |Required permissions  |
|---------|---------|---------|
|`feature store admin`     |who can create/update/delete feature store         | [Permissions required for the `feature store admin` role](#permissions-required-for-the-feature-store-admin-role)        |
|`feature set consumer`     |who can use defined feature sets in their machine learning lifecycle.     |[Permissions required for the `feature set consumer` role](#permissions-required-for-the-feature-set-consumer-role)        |
|`feature set developer`    |who can create/update feature sets, or set up materializations - for example, backfill and recurrent jobs.    | [Permissions required for the `feature set developer` role](#permissions-required-for-the-feature-set-developer-role)        |

If your feature store requires materialization, these permissions are also required:

|Role  |Description  |Required permissions  |
|---------|---------|---------|
|`feature store materialization managed identity`    | The Azure user-assigned managed identity that the feature store materialization jobs use for data access. This is required if the feature store enables materialization        | [Permissions required for the `feature store materialization managed identity` role](#permissions-required-for-the-feature-store-materialization-managed-identity-role)        |

For more information about role creation, see [Create custom role](how-to-assign-roles.md#create-custom-role).

### Resources

Granting of access involves these resources:
- the Azure Machine Learning managed Feature store
- the Azure storage account (Gen2) that the feature store uses as an offline store
- the Azure user-assigned managed identity that the feature store uses for its materialization jobs
- The Azure user storage accounts that host the feature set source data

## Permissions required for the `feature store admin` role

To create and/or delete a managed feature store, we recommend the built-in `Contributor` and `User Access Administrator` roles on the resource group. You can also create a custom `Feature store admin` role with these minimum permissions:

|Scope| Action/Role|
|----|------|
| resourceGroup (the location of the feature store creation) | Microsoft.MachineLearningServices/workspaces/featurestores/read  |
| resourceGroup (the location of the feature store creation) | Microsoft.MachineLearningServices/workspaces/featurestores/write |
| resourceGroup (the location of the feature store creation) | Microsoft.MachineLearningServices/workspaces/featurestores/delete |
| the feature store | Microsoft.Authorization/roleAssignments/write |
| the user assigned managed identity | Managed Identity Operator role |

When a feature store is provisioned, other resources are provisioned by default. However, you can use existing resources. If new resources are needed, the identity that creates the feature store must have these permissions on the resource group:
- Microsoft.Storage/storageAccounts/write
- Microsoft.Storage/storageAccounts/blobServices/containers/write
- Microsoft.Insights/components/write
- Microsoft.KeyVault/vaults/write
- Microsoft.ContainerRegistry/registries/write
- Microsoft.OperationalInsights/workspaces/write
- Microsoft.ManagedIdentity/userAssignedIdentities/write

## Permissions required for the `feature set consumer` role

Use these built-in roles to consume the feature sets defined in the feature store:

|Scope| Role|
|----|------|
| the feature store | AzureML Data Scientist|
| the source data storage accounts; in other words, the feature set data sources | Storage Blob Data Reader role |
| the storage feature store offline store storage account | Storage Blob Data Reader role |

> [!NOTE]
> The `AzureML Data Scientist` allows the users to create and update feature sets in the feature store.

To avoid use of the `AzureML Data Scientist` role, you can use these individual actions:

|Scope| Action/Role|
|----|------|
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestores/read  |
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/read |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/read |
| the feature store | Microsoft.MachineLearningServices/workspaces/datastores/listSecrets/action |
| the feature store | Microsoft.MachineLearningServices/workspaces/jobs/read |

## Permissions required for the `feature set developer` role

To develop feature sets in the feature store, use these built-in roles:

|Scope| Role|
|----|------|
| the feature store | AzureML Data Scientist|
| the source data storage accounts | Storage Blob Data Reader role |
| the feature store offline store storage account | Storage Blob Data Reader role |

To avoid use of the `AzureML Data Scientist` role, you can use these individual actions (in addition to the actions listed for `Featureset consumer`)

|Scope| Role|
|----|------|
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/write |
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/delete |
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/action |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/write |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/delete |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/action |

## Permissions required for the `feature store materialization managed identity` role

In addition to all of the permissions that the `feature set consumer` role requires, grant these built-in roles:

|Scope| Action/Role |
|----|------|
| feature store | AzureML Data Scientist role |
| storage account of feature store offline store | Storage Blob Data Contributor role |
| storage accounts of source data | Storage Blob Data Reader role |

## New actions created for managed feature store

These new actions are created for managed feature store usage:

|Action| Description|
|----|------|
| Microsoft.MachineLearningServices/workspaces/featurestores/read | List, get feature store |
| Microsoft.MachineLearningServices/workspaces/featurestores/write | Create and update the feature store (configure materialization stores, materialization compute, etc.)|
| Microsoft.MachineLearningServices/workspaces/featurestores/delete | Delete feature store|
| Microsoft.MachineLearningServices/workspaces/featuresets/read | List and show feature sets |
| Microsoft.MachineLearningServices/workspaces/featuresets/write | Create and update feature sets. Can configure materialization settings along with create or update |
| Microsoft.MachineLearningServices/workspaces/featuresets/delete | Delete feature sets|
| Microsoft.MachineLearningServices/workspaces/featuresets/action | Trigger actions on feature sets (for example, a backfill job) |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/read | List and show feature store entities |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/write | Create and update feature store entities |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/delete | Delete entities |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/action | Trigger actions on feature store entities |

There's no ACL for instances of a feature store entity and a feature set.

## Next steps

- [Understanding top-level entities in managed feature store](concept-top-level-entities-in-managed-feature-store.md)
- [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md)
- [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md)