---
title: Manage access to managed feature store
description: Learn how to access to an Azure Machine Learning managed feature store using Azure role-based access control (Azure RBAC).
author: rsethur
ms.author: seramasu
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata 
ms.topic: how-to
ms.date: 05/23/2023 
---

# Manage access control for managed feature store

In this article, you learn how to manage access (authorization) to an Azure Machine Learning managed feature store. [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) is used to manage access to Azure resources, such as the ability to create new resources or use existing ones. Users in your Azure Active Directory (Azure AD) are assigned specific roles, which grant access to resources. Azure provides both built-in roles and the ability to create custom roles.

> [!WARNING]
> Applying some roles may limit UI functionality in Azure Machine Learning for other users. For example, if a user's role does not have the ability to create a compute instance, the option to create a compute instance will not be available in studio. This behavior is expected, and prevents the user from attempting operations that would return an access denied error.

## Identities and roles

Azure Machine Learning supports role-based access control for the following managed feature store resources:

- feature store
- feature store entity
- feature set

To control access to these resources, create the following roles. For each role, the identity can be either an Azure Active Directory identity, a service principal, or an Azure managed identity (both system managed and user assigned).

|Role  |Description  |Required permissions  |
|---------|---------|---------|
|`Feature store admin`     |who can create/update/delete feature store         | [RBAC permission required for Featurestore Admin](#rbac-permission-required-for-featurestore-admin)        |
|`Featureset consumer`     |who can use defined feature sets in their ML lifecycle.     |[RBAC permission required for Featureset consumer](#rbac-permission-required-for-featureset-consumer)         |
|`Featureset developer`    |who can create/update feature sets, or set up materializations such as backfill and recurrent jobs.    | [RBAC permission required for Featureset developer](#rbac-permission-required-for-featureset-developer)        |

If materialization is enabled on your feature store, you must also create the following role:

|Role  |Description  |Required permissions  |
|---------|---------|---------|
|`Featurestore Materialization managed identity`    | The Azure user assigned managed identity used by feature store materialization jobs for data access. This is required if the feature store enables materialization        | [RBAC permission required for `Featurestore Materialization managed identity`](#rbac-permission-required-for-featurestore-materialization-managed-identity)        |

For information on creating roles, refer to the article [Create custom role](how-to-assign-roles.md#create-custom-role)

### Resources 

The following resources are involved for granting access:
- the Azure Machine Learning managed Feature store
- the Azure storage account (Gen2) used by feature store as offline store
- the Azure user assigned managed identity used by feature store for its materialization jobs
- Users' Azure storage accounts that have the source data of feature sets


## Permissions required for the Feature store Admin role

To create and/or delete a managed feature store, we recommend using the built-in `Contributor` and `User Access Administrator` roles on the resource group. In addition, the Feature store Admin role requires at least the following permissions.

|Scope| Action/Role|
|----|------|
| resourceGroup (where feature store is to be created) | Microsoft.MachineLearningServices/workspaces/featurestore/read  |
| resourceGroup (where feature store is to be created) | Microsoft.MachineLearningServices/workspaces/featurestore/write |
| resourceGroup (where feature store is to be created) | Microsoft.MachineLearningServices/workspaces/featurestore/delete |
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


## Permissions required for the Featureset consumer role

To consume feature sets defined in the feature store, use the following build-in roles:

|Scope| Action/Role|
|----|------|
| the feature store | Azure Machine Learning Data Scientist|
| storage accounts of source data, that is, data sources of feature sets | Blob storage data reader role |
| storage account of feature store offline store | Blob storage data reader role |

> [!NOTE]
> The `AzureML Data Scientist` will also allow the users create and update feature sets in the feature store.

If you want to avoid using the `AzureML Data Scientist` role, you can use these individual actions.

|Scope| Action/Role|
|----|------|
| the feature store | Microsoft.MachineLearningServices/featurestores/read  |
| the feature store | Microsoft.MachineLearningServices/featurestores/checkNameAvailability/read |
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/read |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/read |
| the feature store | Microsoft.MachineLearningServices/workspaces/datastores/listSecrets/action |
| the feature store | Microsoft.MachineLearningServices/workspaces/jobs/read |


## Permissions required for the Featureset developer role

To develop feature sets in the feature store, use the following built-in roles.

|Scope| Action/Role|
|----|------|
| the feature store | Azure Machine Learning Data Scientist|
| storage accounts of source data | Blob storage data reader role |
| storage account of feature store offline store | Blob storage data reader role |

If you want to avoid using the `AzureML Data Scientist` role, you can use these individual actions (besides the ones listed for `Featureset consumer`)

|Scope| Action/Role|
|----|------|
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/write |
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/delete |
| the feature store | Microsoft.MachineLearningServices/workspaces/featuresets/action |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/write |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/delete |
| the feature store | Microsoft.MachineLearningServices/workspaces/featurestoreentities/action |


## Permissions required for the `Featurestore Materialization managed identity`

In addition to all of the permissions required by the `Featureset consumer` role, grant the following built-in roles:

|Scope| Action/Role |
|----|------|
| feature store | Azure Machine Learning Data Scientist role |
| storage account of feature store offline store | Blob storage data contributor role |
| storage accounts of source data | Blob storage data reader role |

## New actions created for managed feature store

The following new actions are created for managed feature store usage.

|Action| Description|
|----|------|
| Microsoft.MachineLearningServices/workspaces/featurestore/read | List, get feature store |
| Microsoft.MachineLearningServices/workspaces/featurestore/write | Create and update feature store (configure materialization stores, materialization compute, etc.|)
| Microsoft.MachineLearningServices/workspaces/featurestore/delete | Delete feature store|
Microsoft.MachineLearningServices/workspaces/featuresets/read | List and show feature sets. | |
| Microsoft.MachineLearningServices/workspaces/featuresets/write | Create and update feature sets. Can configure materialization settings along with create or update |
| Microsoft.MachineLearningServices/workspaces/featuresets/delete | Delete feature sets|
| Microsoft.MachineLearningServices/workspaces/featuresets/action | Trigger actions on feature sets (for example, a backfill job) |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/read | List and show feature store entities. |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/write | Create and update feature store entities. |
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/delete | Delete entities. | 
| Microsoft.MachineLearningServices/workspaces/featurestoreentities/action | Trigger actions on feature store entities |

There's no ACL for instances of a feature store entity and a feature set. 

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

