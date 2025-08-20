---
title: "Azure Operator Nexus - Example of cluster.jsonc template file"
description: Example of cluster.jsonc template file to use with ARM template in creating a cluster.
author: bartpinto
ms.author: bpinto
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 07/21/2025
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
        "description": "Name of the Environment"
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
        "description": "Managed Resource Group for the Resource."
      }
    },
    "assignedIdentity": {
      "type": "string",
      "metadata": {
        "description": "Managed identity resource ID for the Cluster."
      }
    },
    "analyticsWorkspaceId": {
      "type": "string",
      "metadata": {
        "description": "Log Analytics Workspace and Managed Identity resource IDs for the Cluster."
      }
    },
    "containerUrl": {
      "type": "string",
      "metadata": {
        "description": "Storage Account URL for Cluster command output."
      }
    },
    "vaultUri": {
      "type": "string",
      "metadata": {
        "description": "KeyVault Uri for Cluster"
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
        "description": "The type of the Cluster, single or multi-rack"
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
        "description": "The Custom Location of the Cluster Manager"
      }
    },
    "aggregatorOrSingleRack": {
      "type": "object",
      "metadata": {
        "description": "Aggregator Rack or single Rack definition"
      }
    },
    "computeRacks": {
      "type": "array",
      "metadata": {
        "description": "Compute Rack definitions"
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
            "assignedIdentity": {
              "type": "string",
              "metadata": {
                "description": "Managed identity resource ID for the Cluster."
              }
            },
            "analyticsWorkspaceId": {
              "type": "string",
              "metadata": {
                "description": "Log Analytics Workspace and Managed Identity resource IDs for the Cluster."
              }
            },
            "analyticsOutputSettings": {
              "type": "object"
            },
            "secretArchiveSettings": {
              "type": "object"
            },
            "commandOutputSettings": {
              "type": "object"
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
                "description": "The type of the Cluster, single or multi-rack"
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
                "description": "The Custom Location of the Cluster Manager"
              }
            },
            "aggregatorOrSingleRack": {
              "type": "object",
              "metadata": {
                "description": "Aggregator Rack or single Rack definition"
              }
            },
            "computeRacks": {
              "type": "array",
              "metadata": {
                "description": "Compute Rack definitions"
              }
            },
            "managedResourceGroupConfiguration": {
              "type": "object"
            }
          },
          "variables": {},
          "resources": [
            {
              "type": "Microsoft.NetworkCloud/clusters",
              "apiVersion": "2025-02-01",
              "name": "[parameters('name')]",
              "location": "[parameters('location')]",
              "tags": {},
              "identity": {
                "type": "UserAssigned",
                "userAssignedIdentities": {
                  "[parameters('assignedIdentity')]": {}
                }
              }, 
              "extendedLocation": {
                "name": "[parameters('customLocation')]",
                "type": "CustomLocation"
              },
              "properties": {
                "networkFabricId": "[parameters('networkFabricId')]",
                "clusterType": "[parameters('clusterType')]",
                "clusterVersion": "[parameters('clusterVersion')]",
                "clusterLocation": "[parameters('clusterLocation')]",
                "analyticsWorkspaceId": "[parameters('analyticsWorkspaceId')]",
                "aggregatorOrSingleRackDefinition": "[parameters('aggregatorOrSingleRack')]",
                "computeRackDefinitions": "[parameters('computeRacks')]",
                "managedResourceGroupConfiguration": "[parameters('managedResourceGroupConfiguration')]",
                "analyticsOutputSettings": "[parameters('analyticsOutputSettings')]",
                "secretArchiveSettings": "[parameters('secretArchiveSettings')]",
                "commandOutputSettings": "[parameters('commandOutputSettings')]"
              }
            }
          ],
          "outputs": {}
        },
        "parameters": {
          "environment": {
            "value": "[parameters('environment')]"
          },
          "name": {
            "value": "[parameters('name')]"
          },
          "location": {
            "value": "[parameters('location')]"
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
          "assignedIdentity": {
            "value": "[parameters('assignedIdentity')]"
          }, 
          "analyticsWorkspaceId": {
            "value": "[parameters('analyticsWorkspaceId')]"
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
          "analyticsOutputSettings": {
            "value": {
              "analyticsWorkspaceId": "[parameters('analyticsWorkspaceId')]",
              "associatedIdentity": {
                "identityType": "UserAssignedIdentity",
                "userAssignedIdentityResourceId": "[parameters('assignedIdentity')]"
              }
            }
          },
          "commandOutputSettings": {
            "value": {
              "containerUrl": "[parameters('containerUrl')]",
              "associatedIdentity": {
                "identityType": "UserAssignedIdentity",
                "userAssignedIdentityResourceId": "[parameters('assignedIdentity')]"
              }
            }
          },
          "secretArchiveSettings": {
            "value": {
              "vaultUri": "[parameters('vaultUri')]",
              "associatedIdentity": {
                "identityType": "UserAssignedIdentity",
                "userAssignedIdentityResourceId": "[parameters('assignedIdentity')]"
              }
            }
          },
          "computeRacks": {
            "value": "[parameters('computeRacks')]"
          }
        }
      }
    }
  ],
  "outputs": {}
}
```
