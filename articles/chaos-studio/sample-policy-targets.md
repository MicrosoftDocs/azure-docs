---
title: Azure Policy samples for adding resources to Chaos Studio
description: Sample Azure policies to add resources to Azure Chaos Studio by using targets and capabilities.
services: chaos-studio
author: prasha-microsoft 
ms.topic: sample
ms.date: 11/11/2021
ms.author: prashabora
ms.service: chaos-studio
---

# Azure Policy samples for adding resources to Azure Chaos Studio
This article includes sample [Azure Policy](../governance/policy/overview.md) definitions that create [targets and capabilities](chaos-studio-targets-capabilities.md) for a specific resource type. You can automatically add resources to Azure Chaos Studio. First, you [deploy these samples as custom policy definitions](../governance/policy/tutorials/create-and-manage.md). Then you [assign the policy](../governance/policy/assign-policy-portal.md) to a scope.

In these samples, we add service-direct targets and capabilities for each [supported resource type](chaos-studio-fault-providers.md) by using [targets and capabilities](chaos-studio-targets-capabilities.md).

> [!NOTE]
> Each of these policies differs slightly, and you should consult the documentation of the Resource (e.g. Compute, Storage, etc.) you are using in addition to these below sample definitions to ensure you are setting everything ocrrectly for your specific scenario


> [!NOTE]
> Make sure the subscription you are using for the automated Azure policy deployment has the correct [RBAC permissions](../governance/policy/overview.md) to do this. 

## Azure Cache for Redis policy definition

```json
{
  "displayName": "Deploy Chaos Target and Capability for Azure Cache for Redis",
  "policyType": "Custom",
  "mode": "Indexed",
  "metadata": {
    "category": "Chaos Studio"
  },
  "description": "Deploys the target and capabilities for an Azure Cache for Redis instance for onboarding to Azure Chaos Studio."
  "parameters": {
    "effect": {
      "type": "String",
      "metadata": {
        "displayName": "Effect",
        "description": "Enable or disable the execution of the policy"
      },
      "allowedValues": [
        "DeployIfNotExists",
        "Disabled"
      ],
      "defaultValue": "DeployIfNotExists"
    }
  },
  "policyRule": {
    "if": {
      "field": "type",
      "equals": "Microsoft.Cache/Redis"
    },
    "then": {
      "effect": "[parameters('effect')]",
      "details": {
        "type": "Microsoft.Chaos/targets",
        "name": "Microsoft-AzureCacheForRedis",
        "roleDefinitionIds": [
          "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
        ],
        "deployment": {
          "properties": {
            "mode": "incremental",
            "template": {
              "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
              "contentVersion": "1.0.0.0",
              "parameters": {
                "resourceName": {
                  "type": "string"
                },
                "location": {
                  "type": "string"
                }
              },
              "variables": {},
              "resources": [
                {
                  "type": "Microsoft.Cache/Redis/providers/targets",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureCacheForRedis')]",
                  "location": "[parameters('location')]",
                  "properties": {}
                },
                {
                  "type": "Microsoft.Cache/Redis/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureCacheForRedis/Reboot-1.0')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.Cache/Redis', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureCacheForRedis')]"
                  ],
                  "properties": {}
                }
              ],
              "outputs": {}
            },
            "parameters": {
              "resourceName": {
                "value": "[field('name')]"
              },
              "location": {
                "value": "[field('location')]"
              }
            }
          }
        }
      }
    }
  }
}
```

## Azure Cosmos DB policy definition

```json
{
  "displayName": "Deploy Chaos Target and Capability for Cosmos DB",
  "policyType": "Custom",
  "mode": "Indexed",
  "description": "Deploys the target and capabilities for a Cosmos DB for onboarding to Azure Chaos Studio.",
  "metadata": {
    "category": "Chaos Studio"
  },
  "parameters": {
    "effect": {
      "type": "String",
      "metadata": {
        "displayName": "Effect",
        "description": "Enable or disable the execution of the policy"
      },
      "allowedValues": [
        "DeployIfNotExists",
        "Disabled"
      ],
      "defaultValue": "DeployIfNotExists"
    }
  },
  "policyRule": {
    "if": {
      "field": "type",
      "equals": "Microsoft.DocumentDB/databaseAccounts"
    },
    "then": {
      "effect": "[parameters('effect')]",
      "details": {
        "type": "Microsoft.Chaos/targets",
        "name": "Microsoft-CosmosDB",
        "roleDefinitionIds": [
          "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
        ],
        "deployment": {
          "properties": {
            "mode": "incremental",
            "template": {
              "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
              "contentVersion": "1.0.0.0",
              "parameters": {
                "resourceName": {
                  "type": "string"
                },
                "location": {
                  "type": "string"
                }
              },
              "variables": {},
              "resources": [
                {
                  "type": "Microsoft.DocumentDB/databaseAccounts/providers/targets",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-CosmosDB')]",
                  "location": "[parameters('location')]",
                  "properties": {}
                },
                {
                  "type": "Microsoft.DocumentDB/databaseAccounts/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-CosmosDB/Failover-1.0')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.DocumentDB/databaseAccounts', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-CosmosDB')]"
                  ],
                  "properties": {}
                }
              ],
              "outputs": {}
            },
            "parameters": {
              "resourceName": {
                "value": "[field('name')]"
              },
              "location": {
                "value": "[field('location')]"
              }
            }
          }
        }
      }
    }
  }
}
```

## Azure Kubernetes Service policy definition

```json
{
  "displayName": "Deploy Chaos Target and Capabilities for Azure Kubernetes Service",
  "policyType": "Custom",
  "mode": "Indexed",
  "description": "Deploys the target and capabilities for an AKS cluster for onboarding to Azure Chaos Studio.",
  "metadata": {
    "category": "Chaos Studio"
  },
  "parameters": {
    "effect": {
      "type": "String",
      "metadata": {
        "displayName": "Effect",
        "description": "Enable or disable the execution of the policy"
      },
      "allowedValues": [
        "DeployIfNotExists",
        "Disabled"
      ],
      "defaultValue": "DeployIfNotExists"
    }
  },
  "policyRule": {
    "if": {
      "field": "type",
      "equals": "Microsoft.ContainerService/managedClusters"
    },
    "then": {
      "effect": "[parameters('effect')]",
      "details": {
        "type": "Microsoft.Chaos/targets",
        "name": "Microsoft-AzureKubernetesServiceChaosMesh",
        "roleDefinitionIds": [
          "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
        ],
        "deployment": {
          "properties": {
            "mode": "incremental",
            "template": {
              "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
              "contentVersion": "1.0.0.0",
              "parameters": {
                "resourceName": {
                  "type": "string"
                },
                "location": {
                  "type": "string"
                }
              },
              "variables": {},
              "resources": [
                {
                  "type": "Microsoft.ContainerService/managedClusters/providers/targets",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh')]",
                  "location": "[parameters('location')]",
                  "properties": {}
                },
                {
                  "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/NetworkChaos-2.1')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
                  ],
                  "properties": {}
                },
                {
                  "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/PodChaos-2.1')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
                  ],
                  "properties": {}
                },
                {
                  "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/StressChaos-2.1')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
                  ],
                  "properties": {}
                },
                {
                  "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/IOChaos-2.1')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
                  ],
                  "properties": {}
                },
                {
                  "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/TimeChaos-2.1')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
                  ],
                  "properties": {}
                },
                {
                  "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/KernelChaos-2.1')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
                  ],
                  "properties": {}
                },
                {
                  "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/DNSChaos-2.1')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
                  ],
                  "properties": {}
                },
                {
                  "type": "Microsoft.ContainerService/managedClusters/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-AzureKubernetesServiceChaosMesh/HTTPChaos-2.1')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.ContainerService/managedClusters', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh')]"
                  ],
                  "properties": {}
                }
              ],
              "outputs": {}
            },
            "parameters": {
              "resourceName": {
                "value": "[field('name')]"
              },
              "location": {
                "value": "[field('location')]"
              }
            }
          }
        }
      }
    }
  }
}
```

## Azure network security group policy definition

```json
{
  "displayName": "Deploy Chaos Target and Capability for Network Security Groups",
  "policyType": "Custom",
  "mode": "Indexed",
  "description": "Deploys the target and capabilities for a network security group for onboarding to Azure Chaos Studio.",
  "metadata": {
    "category": "Chaos Studio"
  },
  "parameters": {
    "effect": {
      "type": "String",
      "metadata": {
        "displayName": "Effect",
        "description": "Enable or disable the execution of the policy"
      },
      "allowedValues": [
        "DeployIfNotExists",
        "Disabled"
      ],
      "defaultValue": "DeployIfNotExists"
    }
  },
  "policyRule": {
    "if": {
      "field": "type",
      "equals": "Microsoft.Network/networkSecurityGroups"
    },
    "then": {
      "effect": "[parameters('effect')]",
      "details": {
        "type": "Microsoft.Chaos/targets",
        "name": "Microsoft-NetworkSecurityGroup",
        "roleDefinitionIds": [
          "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
        ],
        "deployment": {
          "properties": {
            "mode": "incremental",
            "template": {
              "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
              "contentVersion": "1.0.0.0",
              "parameters": {
                "resourceName": {
                  "type": "string"
                },
                "location": {
                  "type": "string"
                }
              },
              "variables": {},
              "resources": [
                {
                  "type": "Microsoft.Network/networkSecurityGroups/providers/targets",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-NetworkSecurityGroup')]",
                  "location": "[parameters('location')]",
                  "properties": {}
                },
                {
                  "type": "Microsoft.Network/networkSecurityGroups/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-NetworkSecurityGroup/SecurityRule-1.0')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.Network/networkSecurityGroups', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-NetworkSecurityGroup')]"
                  ],
                  "properties": {}
                }
              ],
              "outputs": {}
            },
            "parameters": {
              "resourceName": {
                "value": "[field('name')]"
              },
              "location": {
                "value": "[field('location')]"
              }
            }
          }
        }
      }
    }
  }
}
```

## Azure Virtual Machines policy definition

```json
{
  "displayName": "Deploy Chaos Target and Capability for Virtual Machines (service-direct)",
  "policyType": "Custom",
  "mode": "Indexed",
  "description": "Deploys the target and capabilities for a virtual machine for onboarding to Azure Chaos Studio (service-direct faults).",
  "metadata": {
    "category": "Chaos Studio"
  },
  "parameters": {
    "effect": {
      "type": "String",
      "metadata": {
        "displayName": "Effect",
        "description": "Enable or disable the execution of the policy"
      },
      "allowedValues": [
        "DeployIfNotExists",
        "Disabled"
      ],
      "defaultValue": "DeployIfNotExists"
    }
  },
  "policyRule": {
    "if": {
      "field": "type",
      "equals": "Microsoft.Compute/virtualMachines"
    },
    "then": {
      "effect": "[parameters('effect')]",
      "details": {
        "type": "Microsoft.Chaos/targets",
        "name": "Microsoft-VirtualMachine",
        "roleDefinitionIds": [
          "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
        ],
        "deployment": {
          "properties": {
            "mode": "incremental",
            "template": {
              "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
              "contentVersion": "1.0.0.0",
              "parameters": {
                "resourceName": {
                  "type": "string"
                },
                "location": {
                  "type": "string"
                }
              },
              "variables": {},
              "resources": [
                {
                  "type": "Microsoft.Compute/virtualMachines/providers/targets",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-VirtualMachine')]",
                  "location": "[parameters('location')]",
                  "properties": {}
                },
                {
                  "type": "Microsoft.Compute/virtualMachines/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-VirtualMachine/Shutdown-1.0')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.Compute/virtualMachines', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine')]"
                  ],
                  "properties": {}
                }
              ],
              "outputs": {}
            },
            "parameters": {
              "resourceName": {
                "value": "[field('name')]"
              },
              "location": {
                "value": "[field('location')]"
              }
            }
          }
        }
      }
    }
  }
}
```

## Azure Virtual Machine Scale Sets policy definition

```json
{
  "displayName": "Deploy Chaos Target and Capability for Virtual Machine Scale Sets (service-direct)",
  "policyType": "Custom",
  "mode": "Indexed",
  "description": "Deploys the target and capabilities for virtual machine scale sets for onboarding to Azure Chaos Studio (service-direct faults).",
  "metadata": {
    "category": "Chaos Studio"
  },
  "parameters": {
    "effect": {
      "type": "String",
      "metadata": {
        "displayName": "Effect",
        "description": "Enable or disable the execution of the policy"
      },
      "allowedValues": [
        "DeployIfNotExists",
        "Disabled"
      ],
      "defaultValue": "DeployIfNotExists"
    }
  },
  "policyRule": {
    "if": {
      "field": "type",
      "equals": "Microsoft.Compute/virtualMachineScaleSets"
    },
    "then": {
      "effect": "[parameters('effect')]",
      "details": {
        "type": "Microsoft.Chaos/targets",
        "name": "Microsoft-VirtualMachineScaleSet",
        "roleDefinitionIds": [
          "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
        ],
        "deployment": {
          "properties": {
            "mode": "incremental",
            "template": {
              "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
              "contentVersion": "1.0.0.0",
              "parameters": {
                "resourceName": {
                  "type": "string"
                },
                "location": {
                  "type": "string"
                }
              },
              "variables": {},
              "resources": [
                {
                  "type": "Microsoft.Compute/virtualMachineScaleSets/providers/targets",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-VirtualMachineScaleSet')]",
                  "location": "[parameters('location')]",
                  "properties": {}
                },
                {
                  "type": "Microsoft.Compute/virtualMachineScaleSets/providers/targets/capabilities",
                  "apiVersion": "2023-11-01",
                  "name": "[concat(parameters('resourceName'), '/', 'Microsoft.Chaos/Microsoft-VirtualMachineScaleSet/Shutdown-1.0')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[concat(resourceId('Microsoft.Compute/virtualMachineScaleSets', parameters('resourceName')), '/', 'providers/Microsoft.Chaos/targets/Microsoft-VirtualMachineScaleSet')]"
                  ],
                  "properties": {}
                }
              ],
              "outputs": {}
            },
            "parameters": {
              "resourceName": {
                "value": "[field('name')]"
              },
              "location": {
                "value": "[field('location')]"
              }
            }
          }
        }
      }
    }
  }
}
```

## Troubleshooting issues related to Azure Policy/RBAC
Please visit [Troubleshoot errors with using Azure Policy](../governance/policy/troubleshoot/general.md) to do this. 


## Next steps

* [Learn more about Chaos Studio](chaos-studio-overview.md)
* [Learn more about targets and capabilities](chaos-studio-targets-capabilities.md)
