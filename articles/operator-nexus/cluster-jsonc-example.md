---
title: "Azure Operator Nexus - Example of cluster.jsonc template file"
description: Example of cluster.jsonc template file to use with ARM template in creating a cluster.
author: bartpinto
ms.author: bpinto
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 03/31/2025
ms.custom: template-how-to, devx-track-arm-template
---

# Example of cluster.jsonc template file.

```cluster.jsonc

{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environment": {
      "type": "string",
      "metadata": {
        "description": "Name of the environment"
      }
    },
    "name": {
      "type": "string",
      "metadata": {
        "description": "Name of Cluster Resource"
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "Location of Cluster Resource"
      }
    },
    "resourceGroupName": {
      "type": "string",
      "metadata": {
        "description": "RG of Cluster Resource"
      },
      "defaultValue": ""
    },
    "managedResourceGroupName": {
      "type": "string",
      "metadata": {
        "description": "Specify a Managed Resource Group for the Resource."
      }
    },
    "networkFabricId": {
      "type": "string",
      "metadata": {
        "description": "ARM ID of the Network Fabric"
      }
    },
    "clusterType": {
      "type": "string",
      "metadata": {
        "description": "The type of the cluster, whether single or multi-rack"
      },
      "allowedValues": [
        "SingleRack",
        "MultiRack"
      ]
    },
    "clusterVersion": {
      "type": "string",
      "metadata": {
        "description": "The version of the cluster to install"
      }
    },
    "clusterLocation": {
      "type": "string",
      "metadata": {
        "description": "Customer name of physical location"
      }
    },
    "customLocation": {
      "type": "string",
      "metadata": {
        "description": "The custom location of the cluster manager"
      }
    },
    "aggregatorOrSingleRack": {
      "type": "object",
      "metadata": {
        "description": "Aggregator rack or single rack definition"
      }
    },
    "computeRacks": {
      "type": "array",
      "metadata": {
        "description": "Compute Rack definitions"
      }
    "secretArchiveSettings": {
      "type": "secureobject",
      "metadata": {
        "description": "SecretArchiveSettings supports the key vault URI along with the managed identity to be used for accessing the key vault"
      },
    },
    "analyticsWorkspaceName": {
      "type": "string",
      "metadata": {
        "description": "The name of the analytics workspace to create for the cluster"
      }
    },
    "analyticsOutputSettings": {
      "type": "object",
      "metadata": {
        "description": "The resource ID of the analytics workspace to create for the cluster"
      }
    },
    "commandOutputSettings": {
      "type": "object",
      "metadata": {
        "description": "commandOutputSettings supports the Storage Account URI along with the managed identity to be used for accessing the Storage Account"
      }
    },
    "clusterServicePrincipal": {
      "type": "secureobject",
      "metadata": {
        "description": "Service principal account details used by the cluster to install the Arc Appliance. This field is needed in the near-term for Arc enrollment."
      }
    },
    "assignedIdentities": {
      "type": "object",
      "metadata": {
        "description": "The assigned identities for the cluster"
      }
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "[concat(parameters('environment'), '-lab-cluster-deployment')]",
      "resourceGroup": "[parameters('resourceGroupName')]",
      "tags": {},
      "properties": {
        "debugSetting": {
          "detailLevel": "requestContent, responseContent"
        },
        "mode": "Incremental",
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "environment": {
              "type": "string",
              "metadata": {
                "description": "Environment name of the resource e.g. m15"
              }
            },
            "name": {
              "type": "string",
              "metadata": {
                "description": "Name of Cluster Resource"
              }
            },
            "location": {
              "type": "string",
              "metadata": {
                "description": "Location of Cluster Resource"
              }
            },
            "resourceGroupName": {
              "type": "string"
            },
            "networkFabricId": {
              "type": "string",
              "metadata": {
                "description": "ARM ID of the Network Fabric"
              }
            },
            "clusterType": {
              "type": "string",
              "metadata": {
                "description": "The type of the cluster, whether single or multi-rack"
              },
              "allowedValues": [
                "SingleRack",
                "MultiRack"
              ]
            },
            "clusterVersion": {
              "type": "string",
              "metadata": {
                "description": "The version of the Cluster to install"
              }
            },
            "clusterLocation": {
              "type": "string",
              "metadata": {
                "description": "Customer name of physical location"
              }
            },
            "customLocation": {
              "type": "string",
              "metadata": {
                "description": "The custom location of the cluster manager"
              }
            },
            "aggregatorOrSingleRack": {
              "type": "secureobject",
              "metadata": {
                "description": "Aggregator rack or single rack definition"
              }
            },
            "computeRacks": {
              "type": "array",
              "metadata": {
                "description": "Compute rack definitions"
              }
            },
            "managedResourceGroupConfiguration": {
              "type": "object"
            },
            "secretArchiveSettings": {
              "type": "object",
              "metadata": {
                "description": "SecretArchiveSettings supports the key vault URI along with the managed identity to be used for accessing the key vault"
              }
            },
            "analyticsOutputSettings": {
              "type": "object",
              "metadata": {
                "description": "The resource ID of the analytics workspace to create for the cluster"
              }
            },
            "commandOutputSettings": {
              "type": "object",
              "metadata": {
                "description": "commandOutputSettings supports the Storage Account URI along with the managed identity to be used for accessing the Storage Account"
              }
            },
            "assignedIdentities": {
              "type": "object",
              "metadata": {
                "description": "The assigned identities for the cluster"
              }
            }
          },
          "variables": {},
          "resources": [
            {
              "type": "Microsoft.OperationalInsights/workspaces",
              "apiVersion": "2021-12-01-preview",
              "name": "[parameters('analyticsWorkspaceName')]",
              "location": "[parameters('location')]",
              "properties": {
                "sku": {
                  "name": "pergb2018"
                },
                "retentionInDays": 120,
                "features": {
                  "enableLogAccessUsingOnlyResourcePermissions": true
                }
              }
            },
            {
              "dependsOn": [
                "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('analyticsWorkspaceName'))]"
              ],
              "type": "Microsoft.NetworkCloud/clusters",
              "apiVersion": "2025-02-01",
              "name": "[parameters('name')]",
              "location": "[parameters('location')]",
              "tags": {},
              "extendedLocation": {
                "name": "[parameters('customLocation')]",
                "type": "CustomLocation"
              },
              "identity": "[parameters('assignedIdentities')]",
              "properties": {
                "networkFabricId": "[parameters('networkFabricId')]",
                "clusterType": "[parameters('clusterType')]",
                "clusterVersion": "[parameters('clusterVersion')]",
                "clusterLocation": "[parameters('clusterLocation')]",
                "aggregatorOrSingleRackDefinition": "[parameters('aggregatorOrSingleRack')]",
                "computeRackDefinitions": "[parameters('computeRacks')]",
                "managedResourceGroupConfiguration": "[parameters('managedResourceGroupConfiguration')]",
                "analyticsWorkspaceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('analyticsWorkspaceName'))]",
                "analyticsOutputSettings": "[parameters('analyticsOutputSettings')]",
                "secretArchiveSettings": "[parameters('secretArchiveSettings')]",
                "commandOutputSettings": "[parameters('commandOutputSettings')]"
              }
            }
          ],
          "outputs": {}
        }
      }
    }
  },
  "outputs": {}
}
```
