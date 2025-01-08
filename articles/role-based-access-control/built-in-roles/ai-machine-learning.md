---
title: Azure built-in roles for AI + machine learning - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the AI + machine learning category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 12/12/2024
ms.custom: generated
---

# Azure built-in roles for AI + machine learning

This article lists the Azure built-in roles in the AI + machine learning category.


## AgFood Platform Sensor Partner Contributor

Provides contribute access to manage sensor related entities in AgFood Platform Service

[Learn more](/azure/data-manager-for-agri/how-to-set-up-sensors-customer)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/farmBeats/sensorPartnerScope/* |  |
> | **NotDataActions** |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/farmBeats/sensorPartnerScope/sensors/delete | Deletes an existing AgFoodPlatform sensors resource restricted to caller's sensor partner scope. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides contribute access to manage sensor related entities in AgFood Platform Service",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/6b77f0a0-0d89-41cc-acd1-579c22c17a67",
  "name": "6b77f0a0-0d89-41cc-acd1-579c22c17a67",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/*"
      ],
      "notDataActions": [
        "Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensors/delete"
      ]
    }
  ],
  "roleName": "AgFood Platform Sensor Partner Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AgFood Platform Service Admin

Provides admin access to AgFood Platform Service

[Learn more](/azure/data-manager-for-agri/quickstart-install-data-manager-for-agriculture)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/* | Create, update, read and delete any AgFood Platform resources. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides admin access to AgFood Platform Service",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f8da80de-1ff9-4747-ad80-a19b7f6079e3",
  "name": "f8da80de-1ff9-4747-ad80-a19b7f6079e3",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AgFoodPlatform/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "AgFood Platform Service Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AgFood Platform Service Contributor

Provides contribute access to AgFood Platform Service

[Learn more](/azure/data-manager-for-agri/quickstart-install-data-manager-for-agriculture)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/*/action |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/*/read | Read any AgFood Platform resources. |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/*/write | Create and update any AgFood Platform resources. |
> | **NotDataActions** |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/farmBeats/farmers/write | Creates or Updates AgFoodPlatform farmers. |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/farmBeats/deletionJobs/*/write |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/farmBeats/parties/write | Creates or Updates AgFoodPlatform parties. |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/farmBeats/datasets/write | Creates or Updates AgFoodPlatform datasets. |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/farmBeats/datasetRecords/write | Creates or Updates AgFoodPlatform Dataset Records. |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/farmBeats/datasets/access/*/action |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides contribute access to AgFood Platform Service",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8508508a-4469-4e45-963b-2518ee0bb728",
  "name": "8508508a-4469-4e45-963b-2518ee0bb728",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AgFoodPlatform/*/action",
        "Microsoft.AgFoodPlatform/*/read",
        "Microsoft.AgFoodPlatform/*/write"
      ],
      "notDataActions": [
        "Microsoft.AgFoodPlatform/farmBeats/farmers/write",
        "Microsoft.AgFoodPlatform/farmBeats/deletionJobs/*/write",
        "Microsoft.AgFoodPlatform/farmBeats/parties/write",
        "Microsoft.AgFoodPlatform/farmBeats/datasets/write",
        "Microsoft.AgFoodPlatform/farmBeats/datasetRecords/write",
        "Microsoft.AgFoodPlatform/farmBeats/datasets/access/*/action"
      ]
    }
  ],
  "roleName": "AgFood Platform Service Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AgFood Platform Service Reader

Provides read access to AgFood Platform Service

[Learn more](/azure/data-manager-for-agri/quickstart-install-data-manager-for-agriculture)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/*/list/action |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/*/read | Read any AgFood Platform resources. |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/*/search/action |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/*/download/action |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/*/overlap/action |  |
> | [Microsoft.AgFoodPlatform](../permissions/ai-machine-learning.md#microsoftagfoodplatform)/*/checkConsent/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides read access to AgFood Platform Service",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7ec7ccdc-f61e-41fe-9aaf-980df0a44eba",
  "name": "7ec7ccdc-f61e-41fe-9aaf-980df0a44eba",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AgFoodPlatform/*/list/action",
        "Microsoft.AgFoodPlatform/*/read",
        "Microsoft.AgFoodPlatform/*/search/action",
        "Microsoft.AgFoodPlatform/*/download/action",
        "Microsoft.AgFoodPlatform/*/overlap/action",
        "Microsoft.AgFoodPlatform/*/checkConsent/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "AgFood Platform Service Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure AI Developer

Can perform all actions within an Azure AI resource besides managing the resource itself.

[Learn more](/azure/ai-studio/concepts/rbac-ai-studio)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/read |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/action |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/delete |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/write |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/locations/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | **NotActions** |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/delete | Deletes the Machine Learning Services Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/write | Creates or updates a Machine Learning Services Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/listKeys/action | List secrets for a Machine Learning Services Workspace |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/hubs/write | Creates or updates a Machine Learning Services Hub Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/hubs/delete | Deletes the Machine Learning Services Hub Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/featurestores/write | Creates or Updates the Machine Learning Services FeatureStore(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/featurestores/delete | Deletes the Machine Learning Services FeatureStore(s) |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/ContentSafety/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can perform all actions within an Azure AI resource besides managing the resource itself.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/64702f94-c441-49e6-a78b-ef80e0188fee",
  "name": "64702f94-c441-49e6-a78b-ef80e0188fee",
  "permissions": [
    {
      "actions": [
        "Microsoft.MachineLearningServices/workspaces/*/read",
        "Microsoft.MachineLearningServices/workspaces/*/action",
        "Microsoft.MachineLearningServices/workspaces/*/delete",
        "Microsoft.MachineLearningServices/workspaces/*/write",
        "Microsoft.MachineLearningServices/locations/*/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*"
      ],
      "notActions": [
        "Microsoft.MachineLearningServices/workspaces/delete",
        "Microsoft.MachineLearningServices/workspaces/write",
        "Microsoft.MachineLearningServices/workspaces/listKeys/action",
        "Microsoft.MachineLearningServices/workspaces/hubs/write",
        "Microsoft.MachineLearningServices/workspaces/hubs/delete",
        "Microsoft.MachineLearningServices/workspaces/featurestores/write",
        "Microsoft.MachineLearningServices/workspaces/featurestores/delete"
      ],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/OpenAI/*",
        "Microsoft.CognitiveServices/accounts/SpeechServices/*",
        "Microsoft.CognitiveServices/accounts/ContentSafety/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure AI Developer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure AI Enterprise Network Connection Approver

Can approve private endpoint connections to Azure AI common dependency resources

[Learn more](/azure/machine-learning/how-to-managed-network)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/privateEndpointConnectionsApproval/action | Auto Approves a Private Endpoint Connection |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/privateEndpointConnections/read | Gets the properties of private endpoint connection or list all the private endpoint connections for the specified container registry |
> | [Microsoft.ContainerRegistry](../permissions/containers.md#microsoftcontainerregistry)/registries/privateEndpointConnections/write | Approves/Rejects the private endpoint connection |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redis/read | View the Redis Cache's settings and configuration in the management portal |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redis/privateEndpointConnections/read | Read a private endpoint connection |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redis/privateEndpointConnections/write | Write a private endpoint connection |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redis/privateLinkResources/read | Read 'groupId' of redis subresource that a private link can be connected to |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redis/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redisEnterprise/read | View the Redis Enterprise cache's settings and configuration in the management portal |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redisEnterprise/privateEndpointConnections/read | Read a private endpoint connection |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redisEnterprise/privateEndpointConnections/write | Write a private endpoint connection |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redisEnterprise/privateLinkResources/read | Read 'groupId' of redis subresource that a private link can be connected to |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redisEnterprise/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/read | Reads API accounts. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/privateEndpointConnections/read | Reads private endpoint connections. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/privateEndpointConnections/write | Writes a private endpoint connections. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/privateLinkResources/read | Reads private link resources for an account. |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/privateEndpointConnectionsApproval/action | Manage a private endpoint connection of Database Account |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/privateEndpointConnections/read | Read a private endpoint connection or list all the private endpoint connections of a Database Account |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/privateEndpointConnections/write | Create or update a private endpoint connection of a Database Account |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/privateLinkResources/read | Read a private link resource or list all the private link resources of a Database Account |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/read | Reads a database account. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/privateEndpointConnectionsApproval/action | Approve or reject a connection to a Private Endpoint resource of Microsoft.Network provider |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/privateEndpointConnections/read | View the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/privateEndpointConnections/write | Change the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/privateLinkResources/read | Get the available private link resources for the specified instance of Key Vault |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/read | View the properties of a key vault |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/privateEndpointConnectionsApproval/action | Approve or reject a connection to a Private Endpoint resource of Microsoft.Network provider |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/privateEndpointConnections/read | View the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/privateEndpointConnections/write | Change the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/privateLinkResources/read | Gets the available private link resources for the specified instance of the Machine Learning Services Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/read | Gets the Machine Learning Services Workspace(s) |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/privateEndpointConnections/read | Get Private Endpoint Connection |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/privateEndpointConnections/write | Put Private Endpoint Connection |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/privateLinkResources/read | Get StorageAccount groupids |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/privateLinkResources/read | Get the private link resources for the corresponding sql server |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/read | Return the list of servers or gets the properties for the specified server. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can approve private endpoint connections to Azure AI common dependency resources",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b556d68e-0be0-4f35-a333-ad7ee1ce17ea",
  "name": "b556d68e-0be0-4f35-a333-ad7ee1ce17ea",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/privateEndpointConnectionsApproval/action",
        "Microsoft.ContainerRegistry/registries/privateEndpointConnections/read",
        "Microsoft.ContainerRegistry/registries/privateEndpointConnections/write",
        "Microsoft.Cache/redis/read",
        "Microsoft.Cache/redis/privateEndpointConnections/read",
        "Microsoft.Cache/redis/privateEndpointConnections/write",
        "Microsoft.Cache/redis/privateLinkResources/read",
        "Microsoft.Cache/redis/privateEndpointConnectionsApproval/action",
        "Microsoft.Cache/redisEnterprise/read",
        "Microsoft.Cache/redisEnterprise/privateEndpointConnections/read",
        "Microsoft.Cache/redisEnterprise/privateEndpointConnections/write",
        "Microsoft.Cache/redisEnterprise/privateLinkResources/read",
        "Microsoft.Cache/redisEnterprise/privateEndpointConnectionsApproval/action",
        "Microsoft.CognitiveServices/accounts/read",
        "Microsoft.CognitiveServices/accounts/privateEndpointConnections/read",
        "Microsoft.CognitiveServices/accounts/privateEndpointConnections/write",
        "Microsoft.CognitiveServices/accounts/privateLinkResources/read",
        "Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionsApproval/action",
        "Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/read",
        "Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/write",
        "Microsoft.DocumentDB/databaseAccounts/privateLinkResources/read",
        "Microsoft.DocumentDB/databaseAccounts/read",
        "Microsoft.KeyVault/vaults/privateEndpointConnectionsApproval/action",
        "Microsoft.KeyVault/vaults/privateEndpointConnections/read",
        "Microsoft.KeyVault/vaults/privateEndpointConnections/write",
        "Microsoft.KeyVault/vaults/privateLinkResources/read",
        "Microsoft.KeyVault/vaults/read",
        "Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionsApproval/action",
        "Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read",
        "Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write",
        "Microsoft.MachineLearningServices/workspaces/privateLinkResources/read",
        "Microsoft.MachineLearningServices/workspaces/read",
        "Microsoft.Storage/storageAccounts/privateEndpointConnections/read",
        "Microsoft.Storage/storageAccounts/privateEndpointConnections/write",
        "Microsoft.Storage/storageAccounts/privateLinkResources/read",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Sql/servers/privateEndpointConnectionsApproval/action",
        "Microsoft.Sql/servers/privateEndpointConnections/read",
        "Microsoft.Sql/servers/privateEndpointConnections/write",
        "Microsoft.Sql/servers/privateLinkResources/read",
        "Microsoft.Sql/servers/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure AI Enterprise Network Connection Approver",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure AI Inference Deployment Operator

Can perform all actions required to create a resource deployment within a resource group.

[Learn more](/azure/ai-studio/concepts/rbac-ai-studio)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/AutoscaleSettings/write | Create or update an autoscale setting |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can perform all actions required to create a resource deployment within a resource group.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3afb7f49-54cb-416e-8c09-6dc049efa503",
  "name": "3afb7f49-54cb-416e-8c09-6dc049efa503",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Insights/AutoscaleSettings/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure AI Inference Deployment Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AzureML Compute Operator

Can access and perform CRUD operations on Machine Learning Services managed compute resources (including Notebook VMs).

[Learn more](/azure/machine-learning/how-to-assign-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/computes/* |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/notebooks/vm/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can access and perform CRUD operations on Machine Learning Services managed compute resources (including Notebook VMs).",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e503ece1-11d0-4e8e-8e2c-7a6c3bf38815",
  "name": "e503ece1-11d0-4e8e-8e2c-7a6c3bf38815",
  "permissions": [
    {
      "actions": [
        "Microsoft.MachineLearningServices/workspaces/computes/*",
        "Microsoft.MachineLearningServices/workspaces/notebooks/vm/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AzureML Compute Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AzureML Data Scientist

Can perform all actions within an Azure Machine Learning workspace, except for creating or deleting compute resources and modifying the workspace itself.

[Learn more](/azure/machine-learning/how-to-assign-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/read |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/action |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/delete |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/*/write |  |
> | **NotActions** |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/delete | Deletes the Machine Learning Services Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/write | Creates or updates a Machine Learning Services Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/computes/*/write |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/computes/*/delete |  |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/computes/listKeys/action | List secrets for compute resources in Machine Learning Services Workspace |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/listKeys/action | List secrets for a Machine Learning Services Workspace |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/hubs/write | Creates or updates a Machine Learning Services Hub Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/hubs/delete | Deletes the Machine Learning Services Hub Workspace(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/featurestores/write | Creates or Updates the Machine Learning Services FeatureStore(s) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/featurestores/delete | Deletes the Machine Learning Services FeatureStore(s) |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can perform all actions within an Azure Machine Learning workspace, except for creating or deleting compute resources and modifying the workspace itself.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f6c7c914-8db3-469d-8ca1-694a8f32e121",
  "name": "f6c7c914-8db3-469d-8ca1-694a8f32e121",
  "permissions": [
    {
      "actions": [
        "Microsoft.MachineLearningServices/workspaces/*/read",
        "Microsoft.MachineLearningServices/workspaces/*/action",
        "Microsoft.MachineLearningServices/workspaces/*/delete",
        "Microsoft.MachineLearningServices/workspaces/*/write"
      ],
      "notActions": [
        "Microsoft.MachineLearningServices/workspaces/delete",
        "Microsoft.MachineLearningServices/workspaces/write",
        "Microsoft.MachineLearningServices/workspaces/computes/*/write",
        "Microsoft.MachineLearningServices/workspaces/computes/*/delete",
        "Microsoft.MachineLearningServices/workspaces/computes/listKeys/action",
        "Microsoft.MachineLearningServices/workspaces/listKeys/action",
        "Microsoft.MachineLearningServices/workspaces/hubs/write",
        "Microsoft.MachineLearningServices/workspaces/hubs/delete",
        "Microsoft.MachineLearningServices/workspaces/featurestores/write",
        "Microsoft.MachineLearningServices/workspaces/featurestores/delete"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AzureML Data Scientist",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AzureML Metrics Writer (preview)

Lets you write metrics to AzureML workspace

[Learn more](/azure/machine-learning/concept-endpoints-online-auth)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/workspaces/metrics/*/write |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you write metrics to AzureML workspace",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/635dd51f-9968-44d3-b7fb-6d9a6bd613ae",
  "name": "635dd51f-9968-44d3-b7fb-6d9a6bd613ae",
  "permissions": [
    {
      "actions": [
        "Microsoft.MachineLearningServices/workspaces/metrics/*/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AzureML Metrics Writer (preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AzureML Registry User

Can perform all actions on Machine Learning Services Registry assets as well as get Registry resources.

[Learn more](/azure/machine-learning/how-to-assign-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/registries/read | Gets the Machine Learning Services registry(ies) |
> | [Microsoft.MachineLearningServices](../permissions/ai-machine-learning.md#microsoftmachinelearningservices)/registries/assets/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can perform all actions on Machine Learning Services Registry assets as well as get Registry resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1823dd4f-9b8c-4ab6-ab4e-7397a3684615",
  "name": "1823dd4f-9b8c-4ab6-ab4e-7397a3684615",
  "permissions": [
    {
      "actions": [
        "Microsoft.MachineLearningServices/registries/read",
        "Microsoft.MachineLearningServices/registries/assets/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AzureML Registry User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Contributor

Lets you create, read, update, delete and manage keys of Cognitive Services.

[Learn more](/azure/ai-services/openai/how-to/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/* |  |
> | [Microsoft.Features](../permissions/management-and-governance.md#microsoftfeatures)/features/read | Gets the features of a subscription. |
> | [Microsoft.Features](../permissions/management-and-governance.md#microsoftfeatures)/providers/features/read | Gets the feature of a subscription in a given resource provider. |
> | [Microsoft.Features](../permissions/management-and-governance.md#microsoftfeatures)/providers/features/register/action | Registers the feature for a subscription in a given resource provider. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/logDefinitions/read | Read log definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricdefinitions/read | Read metric definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourcegroups/deployments/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you create, read, update, delete and manage keys of Cognitive Services.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68",
  "name": "25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.CognitiveServices/*",
        "Microsoft.Features/features/read",
        "Microsoft.Features/providers/features/read",
        "Microsoft.Features/providers/features/register/action",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/diagnosticSettings/*",
        "Microsoft.Insights/logDefinitions/read",
        "Microsoft.Insights/metricdefinitions/read",
        "Microsoft.Insights/metrics/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Contributor

Full access to the project, including the ability to view, create, edit, or delete projects.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access to the project, including the ability to view, create, edit, or delete projects.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c1ff6cc2-c111-46fe-8896-e0ef812ad9f3",
  "name": "c1ff6cc2-c111-46fe-8896-e0ef812ad9f3",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Custom Vision Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Deployment

Publish, unpublish or export models. Deployment can view the project but can't update.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/predictions/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/iterations/publish/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/iterations/export/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/quicktest/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/classify/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/detect/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/export/read | Exports a project. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Publish, unpublish or export models. Deployment can view the project but can't update.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5c4089e1-6d96-4d2f-b296-c1bc7137275f",
  "name": "5c4089e1-6d96-4d2f-b296-c1bc7137275f",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*/read",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/predictions/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/publish/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/export/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/quicktest/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/classify/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/detect/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/export/read"
      ]
    }
  ],
  "roleName": "Cognitive Services Custom Vision Deployment",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Labeler

View, edit training images and create, add, remove, or delete the image tags. Labelers can view the project but can't update anything other than training images and tags.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/predictions/query/action | Get images that were sent to your prediction endpoint. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/images/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/tags/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/images/suggested/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/tagsandregions/suggestions/action | This API will get suggested tags and regions for an array/batch of untagged images along with confidences for the tags. It returns an empty array if no tags are found. |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/export/read | Exports a project. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View, edit training images and create, add, remove, or delete the image tags. Labelers can view the project but can't update anything other than training images and tags.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/88424f51-ebe7-446f-bc41-7fa16989e96c",
  "name": "88424f51-ebe7-446f-bc41-7fa16989e96c",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*/read",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/predictions/query/action",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/images/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/tags/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/images/suggested/*",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/tagsandregions/suggestions/action"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/export/read"
      ]
    }
  ],
  "roleName": "Cognitive Services Custom Vision Labeler",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Reader

Read-only actions in the project. Readers can't create or update the project.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/predictions/query/action | Get images that were sent to your prediction endpoint. |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/export/read | Exports a project. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read-only actions in the project. Readers can't create or update the project.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/93586559-c37d-4a6b-ba08-b9f0940c2d73",
  "name": "93586559-c37d-4a6b-ba08-b9f0940c2d73",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*/read",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/predictions/query/action"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/export/read"
      ]
    }
  ],
  "roleName": "Cognitive Services Custom Vision Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Custom Vision Trainer

View, edit projects and train the models, including the ability to publish, unpublish, export the models. Trainers can't create or delete the project.

[Learn more](/azure/ai-services/custom-vision-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/action | Create a project. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/delete | Delete a specific project. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/import/action | Imports a project. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVision/projects/export/read | Exports a project. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View, edit projects and train the models, including the ability to publish, unpublish, export the models. Trainers can't create or delete the project.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0a5ae4ab-0d65-4eeb-be61-29fc9b54394b",
  "name": "0a5ae4ab-0d65-4eeb-be61-29fc9b54394b",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/action",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/delete",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/import/action",
        "Microsoft.CognitiveServices/accounts/CustomVision/projects/export/read"
      ]
    }
  ],
  "roleName": "Cognitive Services Custom Vision Trainer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Data Reader

Lets you read Cognitive Services data.

[Learn more](/azure/ai-services/speech-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read Cognitive Services data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b59867f0-fa02-499b-be73-45a86b5b3e1c",
  "name": "b59867f0-fa02-499b-be73-45a86b5b3e1c",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Face Recognizer

Lets you perform detect, verify, identify, group, and find similar operations on Face API. This role does not allow create or delete operations, which makes it well suited for endpoints that only need inferencing capabilities, following 'least privilege' best practices.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/detect/action | Detect human faces in an image, return face rectangles, and optionally with faceIds, landmarks, and attributes. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/verify/action | Verify whether two faces belong to a same person or whether one face belongs to a person. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/identify/action | 1-to-many identification to find the closest matches of the specific query person face from a person group or large person group. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/group/action | Divide candidate faces into groups based on face similarity. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/findsimilars/action | Given query face's faceId, to search the similar-looking faces from a faceId array, a face list or a large face list. faceId |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/detectliveness/multimodal/action | <p>Performs liveness detection on a target face in a sequence of infrared, color and/or depth images, and returns the liveness classification of the target face as either &lsquo;real face&rsquo;, &lsquo;spoof face&rsquo;, or &lsquo;uncertain&rsquo; if a classification cannot be made with the given inputs.</p> |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/detectliveness/singlemodal/action | <p>Performs liveness detection on a target face in a sequence of images of the same modality (e.g. color or infrared), and returns the liveness classification of the target face as either &lsquo;real face&rsquo;, &lsquo;spoof face&rsquo;, or &lsquo;uncertain&rsquo; if a classification cannot be made with the given inputs.</p> |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/detectlivenesswithverify/singlemodal/action | Detects liveness of a target face in a sequence of images of the same stream type (e.g. color) and then compares with VerifyImage to return confidence score for identity scenarios. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/*/sessions/action |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/*/sessions/delete |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/*/sessions/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Face/*/sessions/audit/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you perform detect, verify, identify, group, and find similar operations on Face API. This role does not allow create or delete operations, which makes it well suited for endpoints that only need inferencing capabilities, following 'least privilege' best practices.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/9894cab4-e18a-44aa-828b-cb588cd6f2d7",
  "name": "9894cab4-e18a-44aa-828b-cb588cd6f2d7",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/Face/detect/action",
        "Microsoft.CognitiveServices/accounts/Face/verify/action",
        "Microsoft.CognitiveServices/accounts/Face/identify/action",
        "Microsoft.CognitiveServices/accounts/Face/group/action",
        "Microsoft.CognitiveServices/accounts/Face/findsimilars/action",
        "Microsoft.CognitiveServices/accounts/Face/detectliveness/multimodal/action",
        "Microsoft.CognitiveServices/accounts/Face/detectliveness/singlemodal/action",
        "Microsoft.CognitiveServices/accounts/Face/detectlivenesswithverify/singlemodal/action",
        "Microsoft.CognitiveServices/accounts/Face/*/sessions/action",
        "Microsoft.CognitiveServices/accounts/Face/*/sessions/delete",
        "Microsoft.CognitiveServices/accounts/Face/*/sessions/read",
        "Microsoft.CognitiveServices/accounts/Face/*/sessions/audit/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Face Recognizer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Immersive Reader User

Provides access to create Immersive Reader sessions and call APIs

[Learn more](/azure/ai-services/immersive-reader/security-how-to-update-role-assignment)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/ImmersiveReader/getcontentmodelforreader/action | Creates an Immersive Reader session |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides access to create Immersive Reader sessions and call APIs",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b2de6794-95db-4659-8781-7e080d3f2b9d",
  "name": "b2de6794-95db-4659-8781-7e080d3f2b9d",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/ImmersiveReader/getcontentmodelforreader/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Immersive Reader User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Language Owner

Has access to all Read, Test, Write, Deploy and Delete functions under Language portal

[Learn more](/azure/ai-services/language-service/concepts/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/listkeys/action | List keys |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LanguageAuthoring/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/ConversationalLanguageUnderstanding/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnaMaker/* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Has access to all Read, Test, Write, Deploy and Delete functions under Language portal",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f07febfe-79bc-46b1-8b37-790e26e6e498",
  "name": "f07febfe-79bc-46b1-8b37-790e26e6e498",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.CognitiveServices/accounts/listkeys/action",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/LanguageAuthoring/*",
        "Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/*",
        "Microsoft.CognitiveServices/accounts/Language/*",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/*"
      ]
    }
  ],
  "roleName": "Cognitive Services Language Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Language Reader

Has access to Read and Test functions under Language portal

[Learn more](/azure/ai-services/language-service/concepts/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LanguageAuthoring/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/ConversationalLanguageUnderstanding/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/ConversationalLanguageUnderstanding/projects/export/action | Triggers a job to export project data in JSON format. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/*/projects/export/action |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/query-text/action | Answer Text. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/query-dataverse/action | Query Dataverse. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/analyze-text/jobs/action | Submit a collection of text documents for analysis. Specify one or more unique tasks to be executed. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/analyze-text/action | Submit a collection of text documents for analysis.  Specify a single unique task to be executed immediately. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/analyze-text/jobscancel/action | Cancel a long-running Text Analysis job. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/analyze-conversations/action | Analyzes the input conversation. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/analyze-conversations/jobscancel/action | Cancel a long-running analysis job on conversation. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/analyze-conversations/jobs/action | Submit a long conversation for analysis. Specify one or more unique tasks to be executed as a long-running operation. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/query-knowledgebases/action | Answer Knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/generate/action | Language generation. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnaMaker/* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Has access to Read and Test functions under Language portal",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7628b7b8-a8b2-4cdc-b46f-e9b35248918e",
  "name": "7628b7b8-a8b2-4cdc-b46f-e9b35248918e",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/LanguageAuthoring/*/read",
        "Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/*/read",
        "Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/export/action",
        "Microsoft.CognitiveServices/accounts/Language/*/read",
        "Microsoft.CognitiveServices/accounts/Language/*/projects/export/action",
        "Microsoft.CognitiveServices/accounts/Language/query-text/action",
        "Microsoft.CognitiveServices/accounts/Language/query-dataverse/action",
        "Microsoft.CognitiveServices/accounts/Language/analyze-text/jobs/action",
        "Microsoft.CognitiveServices/accounts/Language/analyze-text/action",
        "Microsoft.CognitiveServices/accounts/Language/analyze-text/jobscancel/action",
        "Microsoft.CognitiveServices/accounts/Language/analyze-conversations/action",
        "Microsoft.CognitiveServices/accounts/Language/analyze-conversations/jobscancel/action",
        "Microsoft.CognitiveServices/accounts/Language/analyze-conversations/jobs/action",
        "Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/action",
        "Microsoft.CognitiveServices/accounts/Language/generate/action",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/*"
      ]
    }
  ],
  "roleName": "Cognitive Services Language Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Language Writer

 Has access to all Read, Test, and Write functions under Language Portal

[Learn more](/azure/ai-services/language-service/concepts/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LanguageAuthoring/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/ConversationalLanguageUnderstanding/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LanguageAuthoring/projects/publish/action | Trigger publishing job. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/ConversationalLanguageUnderstanding/projects/deployments/write | Trigger job to create new deployment or replace an existing deployment. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnaMaker/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/*/projects/delete |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/*/projects/deployments/write |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/*/projects/deployments/delete |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/Language/*/projects/deployments/swap/action |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": " Has access to all Read, Test, and Write functions under Language Portal",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f2310ca1-dc64-4889-bb49-c8e0fa3d47a8",
  "name": "f2310ca1-dc64-4889-bb49-c8e0fa3d47a8",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/LanguageAuthoring/*",
        "Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/*",
        "Microsoft.CognitiveServices/accounts/Language/*",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/publish/action",
        "Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/deployments/write",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/*",
        "Microsoft.CognitiveServices/accounts/Language/*/projects/delete",
        "Microsoft.CognitiveServices/accounts/Language/*/projects/deployments/write",
        "Microsoft.CognitiveServices/accounts/Language/*/projects/deployments/delete",
        "Microsoft.CognitiveServices/accounts/Language/*/projects/deployments/swap/action"
      ]
    }
  ],
  "roleName": "Cognitive Services Language Writer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services LUIS Owner

 Has access to all Read, Test, Write, Deploy and Delete functions under LUIS

[Learn more](/azure/ai-services/luis/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/listkeys/action | List keys |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": " Has access to all Read, Test, Write, Deploy and Delete functions under LUIS",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f72c8140-2111-481c-87ff-72b910f6e3f8",
  "name": "f72c8140-2111-481c-87ff-72b910f6e3f8",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.CognitiveServices/accounts/listkeys/action",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/LUIS/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services LUIS Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services LUIS Reader

Has access to Read and Test functions under LUIS.

[Learn more](/azure/ai-services/luis/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/apps/testdatasets/write | Updates last test results of an existing batch test data set for a given application. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Has access to Read and Test functions under LUIS.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/18e81cdc-4e98-4e29-a639-e7d10c5a6226",
  "name": "18e81cdc-4e98-4e29-a639-e7d10c5a6226",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/LUIS/*/read",
        "Microsoft.CognitiveServices/accounts/LUIS/apps/testdatasets/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services LUIS Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services LUIS Writer

Has access to all Read, Test, and Write functions under LUIS

[Learn more](/azure/ai-services/luis/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/apps/delete | Deletes an application. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/apps/move/action | Moves the app to a different LUIS authoring Azure resource. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/apps/publish/action | Publishes a specific version of the application. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/apps/settings/write | Updates the application settings |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/apps/azureaccounts/action | Assigns an Azure account to the application. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/LUIS/apps/azureaccounts/delete | Gets the LUIS Azure accounts for the user using his Azure Resource Manager token. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Has access to all Read, Test, and Write functions under LUIS",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/6322a993-d5c9-4bed-b113-e49bbea25b27",
  "name": "6322a993-d5c9-4bed-b113-e49bbea25b27",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/LUIS/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/LUIS/apps/delete",
        "Microsoft.CognitiveServices/accounts/LUIS/apps/move/action",
        "Microsoft.CognitiveServices/accounts/LUIS/apps/publish/action",
        "Microsoft.CognitiveServices/accounts/LUIS/apps/settings/write",
        "Microsoft.CognitiveServices/accounts/LUIS/apps/azureaccounts/action",
        "Microsoft.CognitiveServices/accounts/LUIS/apps/azureaccounts/delete"
      ]
    }
  ],
  "roleName": "Cognitive Services LUIS Writer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Metrics Advisor Administrator

Full access to the project, including the system level configuration.

[Learn more](/azure/ai-services/metrics-advisor/how-tos/alerts)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/MetricsAdvisor/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access to the project, including the system level configuration.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/cb43c632-a144-4ec5-977c-e80c4affc34a",
  "name": "cb43c632-a144-4ec5-977c-e80c4affc34a",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/MetricsAdvisor/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Metrics Advisor Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Metrics Advisor User

Access to the project.

[Learn more](/dotnet/api/overview/azure/ai.metricsadvisor-readme)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/MetricsAdvisor/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/MetricsAdvisor/stats/* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Access to the project.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3b20f47b-3825-43cb-8114-4bd2201156a8",
  "name": "3b20f47b-3825-43cb-8114-4bd2201156a8",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/MetricsAdvisor/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/MetricsAdvisor/stats/*"
      ]
    }
  ],
  "roleName": "Cognitive Services Metrics Advisor User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services OpenAI Contributor

Full access including the ability to fine-tune, deploy and generate text

[Learn more](/azure/ai-services/openai/how-to/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/deployments/write | Writes deployments. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/deployments/delete | Deletes deployments. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/raiPolicies/read | Gets all applicable policies under the account including default policies. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/raiPolicies/write | Create or update a custom Responsible AI policy. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/raiPolicies/delete | Deletes a custom Responsible AI policy that's not referenced by an existing deployment. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/commitmentplans/read | Reads commitment plans. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/commitmentplans/write | Writes commitment plans. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/commitmentplans/delete | Deletes commitment plans. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access including the ability to fine-tune, deploy and generate text",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a001fd3d-188f-4b5d-821b-7da978bf7442",
  "name": "a001fd3d-188f-4b5d-821b-7da978bf7442",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.CognitiveServices/accounts/deployments/write",
        "Microsoft.CognitiveServices/accounts/deployments/delete",
        "Microsoft.CognitiveServices/accounts/raiPolicies/read",
        "Microsoft.CognitiveServices/accounts/raiPolicies/write",
        "Microsoft.CognitiveServices/accounts/raiPolicies/delete",
        "Microsoft.CognitiveServices/accounts/commitmentplans/read",
        "Microsoft.CognitiveServices/accounts/commitmentplans/write",
        "Microsoft.CognitiveServices/accounts/commitmentplans/delete",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/OpenAI/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services OpenAI Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services OpenAI User

Read access to view files, models, deployments. The ability to create completion and embedding calls.

[Learn more](/azure/ai-services/openai/how-to/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/engines/completions/action | Create a completion from a chosen model |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/engines/search/action | Search for the most relevant documents using the current engine. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/engines/generate/action | (Intended for browsers only.) Stream generated text from the model via GET request. This method is provided because the browser-native EventSource method can only send GET requests. It supports a more limited set of configuration options than the POST variant. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/audio/action | Return the transcript or translation for a given audio file. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/search/action | Search for the most relevant documents using the current engine. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/completions/action | Create a completion from a chosen model. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/chat/completions/action | Creates a completion for the chat message |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/realtime/action | Creates a realtime connection to the deployment. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/extensions/chat/completions/action | Creates a completion for the chat message with extensions |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/deployments/embeddings/action | Return the embeddings for a given prompt. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/images/generations/action | Create image generations. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/assistants/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/OpenAI/stored-completions/read | Query completions data using filters or Get single completion data using completion Id or Get traffic metadata for the given account |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Ability to view files, models, deployments. Readers can't make any changes They can inference and create images",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5e0bd9bd-7b93-4f28-af87-19fc36ad61bd",
  "name": "5e0bd9bd-7b93-4f28-af87-19fc36ad61bd",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/OpenAI/*/read",
        "Microsoft.CognitiveServices/accounts/OpenAI/engines/completions/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/engines/search/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/engines/generate/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/audio/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/search/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/completions/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/chat/completions/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/realtime/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/extensions/chat/completions/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/deployments/embeddings/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/images/generations/action",
        "Microsoft.CognitiveServices/accounts/OpenAI/assistants/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/OpenAI/stored-completions/read"
      ]
    }
  ],
  "roleName": "Cognitive Services OpenAI User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services QnA Maker Editor

Let's you create, edit, import and export a KB. You cannot publish or delete a KB.

[Learn more](/azure/ai-services/qnamaker/)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/alterations/write | Replace alterations data. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointsettings/write | Update endpoint settings for an endpoint. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/operations/read | Gets details of a specific long running operation. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/alterations/write | Replace alterations data. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointsettings/write | Update endpoint settings for an endpoint. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/operations/read | Gets details of a specific long running operation. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/alterations/write | Replace alterations data. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointsettings/write | Update endpoint settings for an endpoint. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/operations/read | Gets details of a specific long running operation. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Let's you create, edit, import and export a KB. You cannot publish or delete a KB.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f4cc2bf9-21be-47a1-bdf1-5c5804381025",
  "name": "f4cc2bf9-21be-47a1-bdf1-5c5804381025",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/create/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/train/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker/alterations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/alterations/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/refreshkeys/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker/operations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/create/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/train/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/alterations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/alterations/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointkeys/refreshkeys/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointsettings/write",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/operations/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/create/write",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/write",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/train/action",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/alterations/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/alterations/write",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointkeys/refreshkeys/action",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointsettings/write",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/operations/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services QnA Maker Editor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services QnA Maker Reader

Let's you read and test a KB only.

[Learn more](/azure/ai-services/qnamaker/)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/QnAMaker.v2/endpointsettings/read | Gets endpoint settings for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/alterations/read | Download alterations from runtime. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/TextAnalytics/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Let's you read and test a KB only.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/466ccd10-b268-4a11-b098-b4849f024126",
  "name": "466ccd10-b268-4a11-b098-b4849f024126",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker/alterations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/alterations/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointsettings/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/download/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/knowledgebases/generateanswer/action",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/alterations/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointkeys/read",
        "Microsoft.CognitiveServices/accounts/TextAnalytics/QnAMaker/endpointsettings/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services QnA Maker Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Speech Contributor

Full access to Speech projects, including read, write and delete all entities, for real-time speech recognition and batch transcription tasks, real-time speech synthesis and long audio tasks, custom speech and custom voice.

[Learn more](/azure/ai-services/speech-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVoice/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/AudioContentCreation/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/VideoTranslation/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomAvatar/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/BatchAvatar/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/BatchTextToSpeech/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access to Speech projects, including read, write and delete all entities, for real-time speech recognition and batch transcription tasks, real-time speech synthesis and long audio tasks, custom speech and custom voice.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0e75ca1e-0464-4b4d-8b93-68208a576181",
  "name": "0e75ca1e-0464-4b4d-8b93-68208a576181",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/SpeechServices/*",
        "Microsoft.CognitiveServices/accounts/CustomVoice/*",
        "Microsoft.CognitiveServices/accounts/AudioContentCreation/*",
        "Microsoft.CognitiveServices/accounts/VideoTranslation/*",
        "Microsoft.CognitiveServices/accounts/CustomAvatar/*",
        "Microsoft.CognitiveServices/accounts/BatchAvatar/*",
        "Microsoft.CognitiveServices/accounts/BatchTextToSpeech/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Speech Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Speech User

Access to the real-time speech recognition and batch transcription APIs, real-time speech synthesis and long audio APIs, as well as to read the data/test/model/endpoint for custom models, but can't create, delete or modify the data/test/model/endpoint for custom models.

[Learn more](/azure/ai-services/speech-service/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/read | Get information about a role assignment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleDefinitions/read | Get information about a role definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/*/transcriptions/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/*/transcriptions/write |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/*/transcriptions/delete |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/*/transcriptions/action |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/*/frontend/action |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/text-dependent/*/action |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/SpeechServices/text-independent/*/action |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVoice/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVoice/evaluations/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVoice/longaudiosynthesis/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/AudioContentCreation/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/VideoTranslation/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomAvatar/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/BatchAvatar/* |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/BatchTextToSpeech/* |  |
> | **NotDataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVoice/datasets/files/read | Gets the files of the dataset identified by the given ID. |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/CustomVoice/datasets/utterances/read | Gets utterances of the specified training set. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Access to the real-time speech recognition and batch transcription APIs, real-time speech synthesis and long audio APIs, as well as to read the data/test/model/endpoint for custom models, but can't create, delete or modify the data/test/model/endpoint for custom models.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f2dc8367-1007-4938-bd23-fe263f013447",
  "name": "f2dc8367-1007-4938-bd23-fe263f013447",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/accounts/SpeechServices/*/read",
        "Microsoft.CognitiveServices/accounts/SpeechServices/*/transcriptions/read",
        "Microsoft.CognitiveServices/accounts/SpeechServices/*/transcriptions/write",
        "Microsoft.CognitiveServices/accounts/SpeechServices/*/transcriptions/delete",
        "Microsoft.CognitiveServices/accounts/SpeechServices/*/transcriptions/action",
        "Microsoft.CognitiveServices/accounts/SpeechServices/*/frontend/action",
        "Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/*/action",
        "Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/*/action",
        "Microsoft.CognitiveServices/accounts/CustomVoice/*/read",
        "Microsoft.CognitiveServices/accounts/CustomVoice/evaluations/*",
        "Microsoft.CognitiveServices/accounts/CustomVoice/longaudiosynthesis/*",
        "Microsoft.CognitiveServices/accounts/AudioContentCreation/*",
        "Microsoft.CognitiveServices/accounts/VideoTranslation/*",
        "Microsoft.CognitiveServices/accounts/CustomAvatar/*/read",
        "Microsoft.CognitiveServices/accounts/BatchAvatar/*",
        "Microsoft.CognitiveServices/accounts/BatchTextToSpeech/*"
      ],
      "notDataActions": [
        "Microsoft.CognitiveServices/accounts/CustomVoice/datasets/files/read",
        "Microsoft.CognitiveServices/accounts/CustomVoice/datasets/utterances/read"
      ]
    }
  ],
  "roleName": "Cognitive Services Speech User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services Usages Reader

Minimal permission to view Cognitive Services usages.

[Learn more](/azure/ai-services/openai/how-to/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/locations/usages/read | Read all usages data |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Minimal permission to view Cognitive Services usages.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/bba48692-92b0-4667-a9ad-c31c7b334ac2",
  "name": "bba48692-92b0-4667-a9ad-c31c7b334ac2",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/locations/usages/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Usages Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cognitive Services User

Lets you read and list keys of Cognitive Services.

[Learn more](/azure/ai-services/authentication)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/*/read |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/accounts/listkeys/action | List keys |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/read | Read a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/diagnosticSettings/read | Read a resource diagnostic setting |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/logDefinitions/read | Read log definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricdefinitions/read | Read metric definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.CognitiveServices](../permissions/ai-machine-learning.md#microsoftcognitiveservices)/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read and list keys of Cognitive Services.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a97b65f3-24c7-4388-baec-2e87135dc908",
  "name": "a97b65f3-24c7-4388-baec-2e87135dc908",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.CognitiveServices/accounts/listkeys/action",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.Insights/diagnosticSettings/read",
        "Microsoft.Insights/logDefinitions/read",
        "Microsoft.Insights/metricdefinitions/read",
        "Microsoft.Insights/metrics/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Health Bot Admin

Users with admin access can sign in, view and edit all of the bot resources, scenarios and configuration setting including the bot instance keys & secrets.

[Learn more](/azure/health-bot/portal-users)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthBot](../permissions/ai-machine-learning.md#microsofthealthbot)/healthBots/Admin/Action | Sign in to the management portal, view and edit all of the bot resources, scenarios, configuration settings, instance keys & secrets. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Users with admin access can sign in, view and edit all of the bot resources, scenarios and configuration setting including the bot instance keys & secrets.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f1082fec-a70f-419f-9230-885d2550fb38",
  "name": "f1082fec-a70f-419f-9230-885d2550fb38",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthBot/healthBots/Admin/Action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Health Bot Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Health Bot Editor

Users with editor access can sign in, view and edit all the bot resources, scenarios and configuration setting except for the bot instance keys & secrets and the end-user inputs (including Feedback, Unrecognized utterances and Conversation logs). A read-only access to the bot skills and channels.

[Learn more](/azure/health-bot/portal-users)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthBot](../permissions/ai-machine-learning.md#microsofthealthbot)/healthBots/Editor/Action | Sign in to the management portal, view and edit all the bot resources, scenarios and configuration settings except for the bot instance keys & secrets and the end-user inputs. Read-only access to the bot skills and channels. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Users with editor access can sign in, view and edit all the bot resources, scenarios and configuration setting except for the bot instance keys & secrets and the end-user inputs (including Feedback, Unrecognized utterances and Conversation logs). A read-only access to the bot skills and channels.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/af854a69-80ce-4ff7-8447-f1118a2e0ca8",
  "name": "af854a69-80ce-4ff7-8447-f1118a2e0ca8",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthBot/healthBots/Editor/Action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Health Bot Editor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Health Bot Reader

Users with reader access can sign in, have read-only access to the bot resources, scenarios and configuration setting except for the bot instance keys & secrets (including Authentication, Data Connection and Channels keys) and the end-user inputs (including Feedback, Unrecognized utterances and Conversation logs).

[Learn more](/azure/health-bot/portal-users)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthBot](../permissions/ai-machine-learning.md#microsofthealthbot)/healthBots/Reader/Action | Sign in to the management portal, with read-only access to resources, scenarios and configuration settings except for the bot instance keys & secrets and the end-user inputs. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Users with reader access can sign in, have read-only access to the bot resources, scenarios and configuration setting except for the bot instance keys & secrets (including Authentication, Data Connection and Channels keys) and the end-user inputs (including Feedback, Unrecognized utterances and Conversation logs).",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/eb5a76d5-50e7-4c33-a449-070e7c9c4cf2",
  "name": "eb5a76d5-50e7-4c33-a449-070e7c9c4cf2",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthBot/healthBots/Reader/Action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Health Bot Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Search Index Data Contributor

Grants full access to Azure Cognitive Search index data.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Search](../permissions/ai-machine-learning.md#microsoftsearch)/searchServices/indexes/documents/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants full access to Azure Cognitive Search index data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8ebe5a00-799e-43f5-93ac-243d3dce84a7",
  "name": "8ebe5a00-799e-43f5-93ac-243d3dce84a7",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Search/searchServices/indexes/documents/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Search Index Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Search Index Data Reader

Grants read access to Azure Cognitive Search index data.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Search](../permissions/ai-machine-learning.md#microsoftsearch)/searchServices/indexes/documents/read | Read documents or suggested query terms from an index. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants read access to Azure Cognitive Search index data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1407120a-92aa-4202-b7e9-c0e197c71c8f",
  "name": "1407120a-92aa-4202-b7e9-c0e197c71c8f",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Search/searchServices/indexes/documents/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Search Index Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Search Service Contributor

Lets you manage Search services, but not access to them.

[Learn more](/azure/search/search-security-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Search](../permissions/ai-machine-learning.md#microsoftsearch)/searchServices/* | Create and manage search services |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Search services, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7ca78c08-252a-4471-8644-bb5ff32d4ba0",
  "name": "7ca78c08-252a-4471-8644-bb5ff32d4ba0",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Search/searchServices/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Search Service Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)