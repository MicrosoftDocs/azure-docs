---
title: How to create custom role in Azure Operator Service Manager
description: Learn how to create a custom role in Azure Operator Service Manager.
author: sherrygonz
ms.author: sherryg
ms.date: 10/19/2023
ms.topic: how-to
ms.service: azure-operator-service-manager
ms.custom: devx-track-bicep
---

# Create a custom role

In this how-to guide, you learn how to create a custom role for Service Operators. A custom role provides the necessary permissions to access Azure Operator Service Manager (AOSM) Publisher resources when deploying a Site Network Service (SNS).

## Prerequisites

Contact your Microsoft account team to register your Azure subscription for access to Azure Operator Service Manager (AOSM) or express your interest through the [partner registration form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR7lMzG3q6a5Hta4AIflS-llUMlNRVVZFS00xOUNRM01DNkhENURXU1o2TS4u).

## Permissions/Actions required by the custom role

- Microsoft.HybridNetwork/Publishers/NetworkFunctionDefinitionGroups/NetworkFunctionDefinitionVersions/**use**/**action**

- Microsoft.HybridNetwork/Publishers/NetworkFunctionDefinitionGroups/NetworkFunctionDefinitionVersions/**read**

- Microsoft.HybridNetwork/Publishers/NetworkServiceDesignGroups/NetworkServiceDesignVersions/**use**/**action**

- Microsoft.HybridNetwork/Publishers/NetworkServiceDesignGroups/NetworkServiceDesignVersions/**read**

- Microsoft.HybridNetwork/Publishers/ConfigurationGroupSchemas/**read**

## Decide the scope

Decide the scope that you want the role to be assignable to:

- If the publisher resources are in a single resource group, you can use the assignable scope of that resource group.

- If the publisher resources are spread across multiple resource groups within a single subscription, you must use the assignable scope of that subscription.

- If the publisher resources are spread across multiple subscriptions, you must create a custom role assignable to each of these subscriptions.

## Create custom role using Bicep

Create a custom role using Bicep. For more information, see [Create or update Azure custom roles using Bicep](/azure/role-based-access-control/custom-roles-bicep?tabs=CLI)

As an example, you can use the following sample as the main.bicep template. This sample creates the role with subscription-wide assignable scope.

```
targetScope = 'subscription'

@description('Array of actions for the roleDefinition')
param actions array = [
  'Microsoft.HybridNetwork/Publishers/NetworkFunctionDefinitionGroups/NetworkFunctionDefinitionVersions/use/action'
  'Microsoft.HybridNetwork/Publishers/NetworkFunctionDefinitionGroups/NetworkFunctionDefinitionVersions/read'
  'Microsoft.HybridNetwork/Publishers/NetworkServiceDesignGroups/NetworkServiceDesignVersions/use/action'
  'Microsoft.HybridNetwork/Publishers/NetworkServiceDesignGroups/NetworkServiceDesignVersions/read'
  'Microsoft.HybridNetwork/Publishers/ConfigurationGroupSchemas/read'
]

@description('Array of notActions for the roleDefinition')
param notActions array = []

@description('Friendly name of the role definition')
param roleName string = 'Custom Role - AOSM Service Operator access to Publisher'

@description('Detailed description of the role definition')
param roleDescription string = 'Provides read and use access to AOSM Publisher resources'

var roleDefName = guid(subscription().id, string(actions), string(notActions))

resource roleDef 'Microsoft.Authorization/roleDefinitions@2022-04-01' = {
  name: roleDefName
  properties: {
    roleName: roleName
    description: roleDescription
    type: 'customRole'
    permissions: [
      {
        actions: actions
        notActions: notActions
      }
    ]
    assignableScopes: [
      subscription().id
    ]
  }
}
```
When you deploy the template, it should be deployed in the same subscription as the Publisher resources.

```azurecli
az login

az account set --subscription <publisher subscription>

az deployment sub create --location <location> --name customRole --template-file main.bicep 
```

## Create a custom role using the Azure portal

Create a custom role using Azure portal. For more information, see [Create or update Azure custom roles using Azure portal](/azure/role-based-access-control/custom-roles-portal)

If you prefer, you can specify most of your custom role values in a JSON file. 

Sample JSON:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.22.6.54827",
      "templateHash": "14238097231376848271"
    }
  },
  "parameters": {
    "actions": {
      "type": "array",
      "defaultValue": [
        "Microsoft.HybridNetwork/Publishers/NetworkFunctionDefinitionGroups/NetworkFunctionDefinitionVersions/use/action",
        "Microsoft.HybridNetwork/Publishers/NetworkFunctionDefinitionGroups/NetworkFunctionDefinitionVersions/read",
        "Microsoft.HybridNetwork/Publishers/NetworkServiceDesignGroups/NetworkServiceDesignVersions/use/action",
        "Microsoft.HybridNetwork/Publishers/NetworkServiceDesignGroups/NetworkServiceDesignVersions/read",
        "Microsoft.HybridNetwork/Publishers/ConfigurationGroupSchemas/read"
      ],
      "metadata": {
        "description": "Array of actions for the roleDefinition"
      }
    },
    "notActions": {
      "type": "array",
      "defaultValue": [],
      "metadata": {
        "description": "Array of notActions for the roleDefinition"
      }
    },
    "roleName": {
      "type": "string",
      "defaultValue": "Custom Role - AOSM Service Operator Role",
      "metadata": {
        "description": "Friendly name of the role definition"
      }
    },
    "roleDescription": {
      "type": "string",
      "defaultValue": "Role Definition for AOSM Service Operator Role",
      "metadata": {
        "description": "Detailed description of the role definition"
      }
    }
  },
  "variables": {
    "roleDefName": "[guid(subscription().id, string(parameters('actions')), string(parameters('notActions')))]"
  },
  "resources": [
    {
      "type": "Microsoft.Authorization/roleDefinitions",
      "apiVersion": "2022-04-01",
      "name": "[variables('roleDefName')]",
      "properties": {
        "roleName": "[parameters('roleName')]",
        "description": "[parameters('roleDescription')]",
        "type": "customRole",
        "permissions": [
          {
            "actions": "[parameters('actions')]",
            "notActions": "[parameters('notActions')]"
          }
        ],
        "assignableScopes": [
          "[subscription().id]"
        ]
      }
    }
  ]
}
```

## Next steps

- [Assign a custom role](how-to-assign-custom-role.md)
