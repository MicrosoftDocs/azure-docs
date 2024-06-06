---
title: "Azure Operator Nexus - Example of cluster.jsonc template file"
description: Example of cluster.jsonc template file to use with ARM template in creating a cluster.
author: jeffreymason
ms.author: jeffreymason
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/08/2024
ms.custom: template-how-to
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
        "description": "Specify a managed resource group for the resource."
      }
    },
    "clusterLawName": {
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
        "description": "Compute rack definitions"
      }
    },
    "clusterServicePrincipal": {
      "type": "secureobject",
      "metadata": {
        "description": "Service principal account details used by the cluster to install the Arc Appliance.  This field is needed in the near-term for Arc enrollment"
      }
    },
    "secretArchive": {
      "type": "string",
      "metadata": {
        "description": "Secret KeyVault for credential rotation"
      }
    },
    "sshKeyUrl": {
      "type": "string",
      "metadata": {
        "description": "SSH Key URL that is used for to gather list of Public Keys"
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
            "analyticsWorkspaceId": {
              "type": "string"
            },
            "clusterLawName": {
              "type": "string"
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
                "description": "Compute rack definitions"
              }
            },
            "clusterServicePrincipal": {
              "type": "secureobject",
              "metadata": {
                "description": "Service principal account details used by the cluster to install the Arc Appliance. This field is needed for Arc enrollment."
              }
            },
            "managedResourceGroupConfiguration": {
              "type": "object"
            },
            "secretArchive": {
              "type": "string",
              "metadata": {
                "description": "Secret KeyVault for credential rotation"
              }
            },
            "sshKeyUrl": {
              "type": "string",
              "metadata": {
                "description": "SSH Key URL that is used for to gather list of Public Keys"
              }
            }
          },
          "variables": {},
          "resources": [
            {
              "type": "Microsoft.OperationalInsights/workspaces",
              "apiVersion": "2021-12-01-preview",
              "name": "[parameters('clusterLawName')]",
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
                "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('clusterLawName'))]"
              ],
              "type": "Microsoft.NetworkCloud/clusters",
              "apiVersion": "2023-07-01",
              "name": "[parameters('name')]",
              "location": "[parameters('location')]",
              "tags": {
                "LabEnvironment": "[parameters('environment')]",
                "ResourceType": "cluster",
                "sshKeyUrl": "[parameters('sshKeyUrl')]"
              },
              "extendedLocation": {
                "name": "[parameters('customLocation')]",
                "type": "CustomLocation"
              },
              "properties": {
                "analyticsWorkspaceId": "[parameters('analyticsWorkspaceId')]",
                "networkFabricId": "[parameters('networkFabricId')]",
                "clusterType": "[parameters('clusterType')]",
                "clusterVersion": "[parameters('clusterVersion')]",
                "clusterLocation": "[parameters('clusterLocation')]",
                "aggregatorOrSingleRackDefinition": "[parameters('aggregatorOrSingleRack')]",
                "computeRackDefinitions": "[parameters('computeRacks')]",
                "clusterServicePrincipal": "[parameters('clusterServicePrincipal')]",
                "managedResourceGroupConfiguration": "[parameters('managedResourceGroupConfiguration')]"
              }
            }
          ],
          "outputs": {}
        },
        "parameters": {
          "environment": {
            "value": "[parameters('environment')]"
          },
          "analyticsWorkspaceId": {
            "value": "[concat(subscription().id, '/resourceGroups/', parameters('resourceGroupName'), '/providers/Microsoft.OperationalInsights/workspaces/', parameters('clusterLawName'))]"
          },
          "name": {
            "value": "[parameters('name')]"
          },
          "location": {
            "value": "[parameters('location')]"
          },
          "clusterLawName": {
            "value": "[parameters('clusterLawName')]"
          },
          "resourceGroupName": {
            "value": "[parameters('resourceGroupName')]"
          },
          "managedResourceGroupConfiguration": {
            "value": {
              "location": "[parameters('location')]",
              "name": "[parameters('managedResourceGroupName')]"
            }
          },
          "networkFabricId": {
            "value": "[parameters('networkFabricId')]"
          },
          "clusterType": {
            "value": "[parameters('clusterType')]"
          },
          "clusterVersion": {
            "value": "[parameters('clusterVersion')]"
          },
          "clusterLocation": {
            "value": "[parameters('clusterLocation')]"
          },
          "customLocation": {
            "value": "[parameters('customLocation')]"
          },
          "aggregatorOrSingleRack": {
            "value": "[parameters('aggregatorOrSingleRack')]"
          },
          "computeRacks": {
            "value": "[parameters('computeRacks')]"
          },
          "clusterServicePrincipal": {
            "value": "[parameters('clusterServicePrincipal')]"
          },
          "secretArchive": {
            "value": {
              "keyVaultId": "[parameters('secretArchive')]",
              "useKeyVault": "True"

          },
          "sshKeyUrl": {
            "value": "[parameters('sshKeyUrl')]"
          }
        }
      }
    }
  ],
  "outputs": {}
}
```
