---
title: Manage access to managed feature store
description: Learn how to access to an Azure Machine Learning managed feature store using Azure role-based access control (Azure RBAC).
author: rsethur
ms.author: seramasu
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata 
ms.custom: build-2023
ms.topic: how-to
ms.date: 05/23/2023 
---

# Manage access control for managed feature store

In this article, you learn how to manage access (authorization) to an Azure Machine Learning managed feature store. [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) is used to manage access to Azure resources, such as the ability to create new resources or use existing ones. Users in your Microsoft Entra ID are assigned specific roles, which grant access to resources. Azure provides both built-in roles and the ability to create custom roles.

[!INCLUDE [preview disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Identities and user types

Azure Machine Learning supports role-based access control for the following managed feature store resources:

- feature store
- feature store entity
- feature set

To control access to these resources, consider the user types below. For each user type, the identity can be either a Microsoft Entra identity, a service principal, or an Azure managed identity (both system managed and user assigned).

- __Feature set developers__ (for example, data scientist, data engineers, and machine learning engineers): They work primarily with the feature store workspace and responsible for:
    - Managing lifecycle of features: From creation ton archival
    - Setting up materialization and backfill of features
    - Monitoring feature freshness and quality
- __Feature set consumers__ (for example, data scientist and machine learning engineers): They work primarily in a project workspace and use features: 
    - Discovering features for reuse in model
    - Experimenting with features during training to see if it improves model performance
    - Setting up training/inference pipelines to use the features
- __Feature store Admins__: They're typically responsible for:
    - Managing lifecycle of feature store (creation to retirement)
    - Managing lifecycle of user access to feature store
    - Configuring feature store: quota and storage (offline/online stores)
    - Managing costs

The permissions required for each user type are described in the following tables:

|Role  |Description  |Required permissions  |
|---------|---------|---------|
|`feature store admin`     |who can create/update/delete feature store         | [Permissions required for the `feature store admin` role](#permissions-required-for-the-feature-store-admin-role)        |
|`feature set consumer`     |who can use defined feature sets in their machine learning lifecycle.     |[Permissions required for the `feature set consumer` role](#permissions-required-for-the-feature-set-consumer-role)        |
|`feature set developer`    |who can create/update feature sets, or set up materializations such as backfill and recurrent jobs.    | [Permissions required for the `feature set developer` role](#permissions-required-for-the-feature-set-developer-role)        |

If materialization is enabled on your feature store, the following permissions are also required:

|Role  |Description  |Required permissions  |
|---------|---------|---------|
|`feature store materialization managed identity`    | The Azure user assigned managed identity used by feature store materialization jobs for data access. This is required if the feature store enables materialization        | [Permissions required for the `feature store materialization managed identity` role](#permissions-required-for-the-feature-store-materialization-managed-identity-role)        |

For information on creating roles, refer to the article [Create custom role](how-to-assign-roles.md#create-custom-role)

### Resources 

The following resources are involved for granting access:
- the Azure Machine Learning managed Feature store
- the Azure storage account (Gen2) used by feature store as offline store
- the Azure user assigned managed identity used by feature store for its materialization jobs
- Users' Azure storage accounts that have the source data of feature sets


## Permissions required for the `feature store admin` role

To create and/or delete a managed feature store, we recommend using the built-in `Contributor` and `User Access Administrator` roles on the resource group. Alternatively, you can create a custom  `Feature store admin` role with at least the following permissions.

|Scope| Action/Role|
|----|------|
| resourceGroup (where feature store is to be created) | Microsoft.MachineLearningServices/workspaces/featurestores/read  |
| resourceGroup (where feature store is to be created) | Microsoft.MachineLearningServices/workspaces/featurestores/write |
| resourceGroup (where feature store is to be created) | Microsoft.MachineLearningServices/workspaces/featurestores/delete |
| the feature store | Microsoft.Authorization/roleAssignments/write |
| the user assigned managed identity | Managed Identity Operator role |

When provisioning a feature store, a few other resources will also be provisioned by default (or you have option to use existing ones). If new resources need to be created, it requires the identity creating the feature store to have the following permissions on the resource group:
- Microsoft.Storage/storageAccounts/write
- Microsoft.Storage/storageAccounts/blobServices/containers/write
- Microsoft.Insights/components/write
- Microsoft.KeyVault/vaults/write
- Microsoft.ContainerRegistry/registries/write
- Microsoft.OperationalInsights/workspaces/write
- Microsoft.ManagedIdentity/userAssignedIdentities/write


## Permissions required for the `feature set consumer` role

To consume feature sets defined in the feature store, use the following built-in roles:

|Scope| Role|
|----|------|
| the feature store | AzureML Data Scientist|
| storage accounts of source data, that is, data sources of feature sets | Blob storage data reader role |
| storage account of feature store offline store | Blob storage data reader role |

> [!NOTE]
> The `AzureML Data Scientist` will also allow the users create and update feature sets in the feature store.

If you want to avoid using the `AzureML Data Scientist` role, you can use these individual actions.

|Scope| Action/Role|
|----|------|
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestores/read  |
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/read |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/read |
| the feature store | Microsoft.MachineLearningServices/workspaces/datastores/listSecrets/action |
| the feature store | Microsoft.MachineLearningServices/workspaces/jobs/read |


## Permissions required for the `feature set developer` role

To develop feature sets in the feature store, use the following built-in roles.

|Scope| Role|
|----|------|
| the feature store | AzureML Data Scientist|
| storage accounts of source data | Blob storage data reader role |
| storage account of feature store offline store | Blob storage data reader role |

If you want to avoid using the `AzureML Data Scientist` role, you can use these individual actions (besides the ones listed for `Featureset consumer`)

|Scope| Role|
|----|------|
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/write |
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/delete |
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/action |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/write |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/delete |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/action |


## Permissions required for the `feature store materialization managed identity` role

In addition to all of the permissions required by the `feature set consumer` role, grant the following built-in roles:

|Scope| Action/Role |
|----|------|
| feature store | AzureML Data Scientist role |
| storage account of feature store offline store | Blob storage data contributor role |
| storage accounts of source data | Blob storage data reader role |

## New actions created for managed feature store

The following new actions are created for managed feature store usage.

|Action| Description|
|----|------|
| Microsoft.MachineLearningServices/workspaces/featurestores/read | List, get feature store |
| Microsoft.MachineLearningServices/workspaces/featurestores/write | Create and update feature store (configure materialization stores, materialization compute, etc.)|
| Microsoft.MachineLearningServices/workspaces/featurestores/delete | Delete feature store|
| Microsoft.MachineLearningServices/workspaces/featuresets/read | List and show feature sets. |
| Microsoft.MachineLearningServices/workspaces/featuresets/write | Create and update feature sets. Can configure materialization settings along with create or update |
| Microsoft.MachineLearningServices/workspaces/featuresets/delete | Delete feature sets|
| Microsoft.MachineLearningServices/workspaces/featuresets/action | Trigger actions on feature sets (for example, a backfill job) |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/read | List and show feature store entities. |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/write | Create and update feature store entities. |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/delete | Delete entities |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/action | Trigger actions on feature store entities |

There's no ACL for instances of a feature store entity and a feature set.

## Next steps

- [Understanding top-level entities in managed feature store](concept-top-level-entities-in-managed-feature-store.md)
- [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md)
- [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md)
