---
title: Resource Manager templates for Azure Cosmos DB Gremlin API
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB Gremlin API. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/12/2020
ms.author: mjbrown
---

# Manage Azure Cosmos DB Gremlin API resources using Azure Resource Manager templates

In this article, you learn how to use Azure Resource Manager templates to help deploy and manage your Azure Cosmos DB accounts, databases, and graphs.

This article has examples for Gremlin API accounts only, to find examples for other API type accounts see: use Azure Resource Manager templates with Azure Cosmos DB's API for [Cassandra](manage-cassandra-with-resource-manager.md), [SQL](manage-sql-with-resource-manager.md), [MongoDB](manage-mongodb-with-resource-manager.md), [Table](manage-table-with-resource-manager.md) articles.

> [!IMPORTANT]
>
> * Account names are limited to 44 characters, all lowercase.
> * To change the throughput values, redeploy the template with updated RU/s.
> * When you add or remove locations to an Azure Cosmos account, you can't simultaneously modify other properties. These operations must be done separately.

To create any of the Azure Cosmos DB resources below, copy the following example template into a new json file. You can optionally create a parameters json file to use when deploying multiple instances of the same resource with different names and values. There are many ways to deploy Azure Resource Manager templates including, [Azure portal](../azure-resource-manager/templates/deploy-portal.md), [Azure CLI](../azure-resource-manager/templates/deploy-cli.md), [Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md) and [GitHub](../azure-resource-manager/templates/deploy-to-azure-button.md).

<a id="create-autoscale"></a>

## Azure Cosmos DB account for Gremlin with autoscale provisioned throughput

This template will create an Azure Cosmos account for Gremlin API with a database and graph with autoscale throughput.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "accountName": {
            "type": "string",
            "metadata": {
                "description": "Cosmos DB account name"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for the Cosmos DB account."
            }
        },
        "primaryRegion": {
            "type": "string",
            "metadata": {
                "description": "The primary replica region for the Cosmos DB account."
            }
        },
        "secondaryRegion": {
            "type": "string",
            "metadata": {
                "description": "The secondary replica region for the Cosmos DB account."
            }
        },
        "defaultConsistencyLevel": {
            "type": "string",
            "defaultValue": "Session",
            "allowedValues": [
                "Eventual",
                "ConsistentPrefix",
                "Session",
                "BoundedStaleness",
                "Strong"
            ],
            "metadata": {
                "description": "The default consistency level of the Cosmos DB account."
            }
        },
        "maxStalenessPrefix": {
            "type": "int",
            "defaultValue": 100000,
            "minValue": 10,
            "maxValue": 2147483647,
            "metadata": {
                "description": "Max stale requests. Required for BoundedStaleness. Valid ranges, Single Region: 10 to 1000000. Multi Region: 100000 to 1000000."
            }
        },
        "maxIntervalInSeconds": {
            "type": "int",
            "defaultValue": 300,
            "minValue": 5,
            "maxValue": 86400,
            "metadata": {
                "description": "Max lag time (seconds). Required for BoundedStaleness. Valid ranges, Single Region: 5 to 84600. Multi Region: 300 to 86400."
            }
        },
        "automaticFailover": {
            "type": "bool",
            "defaultValue": true,
            "allowedValues": [
                true,
                false
            ],
            "metadata": {
                "description": "Enable automatic failover for regions"
            }
        },
        "databaseName": {
            "type": "string",
            "defaultValue": "database1",
            "metadata": {
                "description": "The name for the Gremlin database"
            }
        },
        "graphName": {
            "type": "string",
            "defaultValue": "graph1",
            "metadata": {
                "description": "The name for the Gremlin graph"
            }
        },
        "throughputPolicy":{
            "type": "string",
            "defaultValue": "Autoscale",
            "allowedValues": [ "Manual", "Autoscale" ],
            "metadata": {
                "description": "The throughput policy for the Container"
            }
        },
        "manualProvisionedThroughput": {
            "type": "int",
            "defaultValue": 400,
            "minValue": 400,
            "maxValue": 1000000,
            "metadata": {
                "description": "Throughput value when using Provisioned Throughput Policy for the container"
            }
        },
        "maxAutoscaleThroughput": {
            "type": "int",
            "defaultValue": 4000,
            "minValue": 4000,
            "maxValue": 1000000,
            "metadata": {
                "description": "Maximum throughput when using Autoscale Throughput Policy for the container"
            }
        }
    },
    "variables": {
        "accountName": "[toLower(parameters('accountName'))]",
        "consistencyPolicy": {
            "Eventual": {
                "defaultConsistencyLevel": "Eventual"
            },
            "ConsistentPrefix": {
                "defaultConsistencyLevel": "ConsistentPrefix"
            },
            "Session": {
                "defaultConsistencyLevel": "Session"
            },
            "BoundedStaleness": {
                "defaultConsistencyLevel": "BoundedStaleness",
                "maxStalenessPrefix": "[parameters('maxStalenessPrefix')]",
                "maxIntervalInSeconds": "[parameters('maxIntervalInSeconds')]"
            },
            "Strong": {
                "defaultConsistencyLevel": "Strong"
            }
        },
        "locations": [
            {
                "locationName": "[parameters('primaryRegion')]",
                "failoverPriority": 0,
                "isZoneRedundant": false
            },
            {
                "locationName": "[parameters('secondaryRegion')]",
                "failoverPriority": 1,
                "isZoneRedundant": false
            }
        ],
        "throughputPolicy": {
            "Manual": {
                "Throughput": "[parameters('manualProvisionedThroughput')]"
            },
            "Autoscale": {
                "autoscaleSettings": { "maxThroughput": "[parameters('maxAutoscaleThroughput')]" }
            }
        },
        "throughputPolicyToUse": "[if(equals(parameters('throughputPolicy'), 'Manual'), variables('throughputPolicy').Manual, variables('throughputPolicy').Autoscale)]"
    },
    "resources": [
        {
            "type": "Microsoft.DocumentDB/databaseAccounts",
            "name": "[variables('accountName')]",
            "apiVersion": "2020-03-01",
            "location": "[parameters('location')]",
            "kind": "GlobalDocumentDB",
            "properties": {
                "capabilities": [
                    {
                        "name": "EnableGremlin"
                    }
                ],
                "consistencyPolicy": "[variables('consistencyPolicy')[parameters('defaultConsistencyLevel')]]",
                "locations": "[variables('locations')]",
                "databaseAccountOfferType": "Standard",
                "enableAutomaticFailover": "[parameters('automaticFailover')]"
            }
        },
        {
            "type": "Microsoft.DocumentDB/databaseAccounts/gremlinDatabases",
            "name": "[concat(variables('accountName'), '/', parameters('databaseName'))]",
            "apiVersion": "2020-03-01",
            "dependsOn": [
                "[resourceId('Microsoft.DocumentDB/databaseAccounts/', variables('accountName'))]"
            ],
            "properties": {
                "resource": {
                    "id": "[parameters('databaseName')]"
                }
            }
        },
        {
            "type": "Microsoft.DocumentDb/databaseAccounts/gremlinDatabases/graphs",
            "name": "[concat(variables('accountName'), '/', parameters('databaseName'), '/', parameters('graphName'))]",
            "apiVersion": "2020-03-01",
            "dependsOn": [
                "[resourceId('Microsoft.DocumentDB/databaseAccounts/gremlinDatabases', variables('accountName'),  parameters('databaseName'))]"
            ],
            "properties": {
                "resource": {
                    "id": "[parameters('graphName')]",
                    "indexingPolicy": {
                        "indexingMode": "consistent",
                        "includedPaths": [
                            {
                                "path": "/*"
                            }
                        ],
                        "excludedPaths": [
                            {
                                "path": "/myPathToNotIndex/*"
                            }
                        ]
                    },
                    "partitionKey": {
                        "paths": [
                            "/myPartitionKey"
                        ],
                        "kind": "Hash"
                    },
                    "options": "[variables('throughputPolicyToUse')]"
                }
            }
        }
    ]
}
```

<a id="create-manual"></a>

## Azure Cosmos DB account for Gremlin with standard provisioned throughput

This template will create an Azure Cosmos account for Gremlin API with a database and graph with standard (manual) throughput.

This template is also available for one-click deploy from Azure Quickstart Templates Gallery.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-cosmosdb-gremlin%2Fazuredeploy.json)

:::code language="json" source="~/quickstart-templates/101-cosmosdb-gremlin/azuredeploy.json":::

## Next steps

Here are some additional resources:

* [Azure Resource Manager documentation](/azure/azure-resource-manager/)
* [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
* [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.DocumentDB&pageNumber=1&sort=Popular)
* [Troubleshoot common Azure Resource Manager deployment errors](../azure-resource-manager/templates/common-deployment-errors.md)