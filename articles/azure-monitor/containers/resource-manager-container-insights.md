---
title: Resource Manager template samples for Container insights
description: Sample Azure Resource Manager templates to deploy and configureContainer insights.
ms.topic: sample
ms.custom: devx-track-arm-template
ms.author: bwren
ms.date: 05/05/2022
ms.reviewer: aulgit
---

# Resource Manager template samples for Container insights

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to deploy and configure the Log Analytics agent for virtual machines in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Enable for AKS cluster

The following sample enables Container insights on an AKS cluster.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('AKS Cluster Resource ID')
param aksResourceId string

@description('Location of the AKS resource e.g. "East US"')
param aksResourceLocation string

@description('Existing all tags on AKS Cluster Resource')
param aksResourceTagValues object

@description('Azure Monitor Log Analytics Resource ID')
param workspaceResourceId string

resource aksResourceId_8 'Microsoft.ContainerService/managedClusters@2022-01-02-preview' = {
  name: split(aksResourceId, '/')[8]
  location: aksResourceLocation
  tags: aksResourceTagValues
  properties: {
    addonProfiles: {
      omsagent: {
        enabled: true
        config: {
          logAnalyticsWorkspaceResourceID: workspaceResourceId
        }
      }
    }
  }
}

```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "aksResourceId": {
      "type": "string",
      "metadata": {
        "description": "AKS Cluster Resource ID"
      }
    },
    "aksResourceLocation": {
      "type": "string",
      "metadata": {
        "description": "Location of the AKS resource e.g. \"East US\""
      }
    },
    "aksResourceTagValues": {
      "type": "object",
      "metadata": {
        "description": "Existing all tags on AKS Cluster Resource"
      }
    },
    "workspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Azure Monitor Log Analytics Resource ID"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2022-01-02-preview",
      "name": "[split(parameters('aksResourceId'), '/')[8]]",
      "location": "[parameters('aksResourceLocation')]",
      "tags": "[parameters('aksResourceTagValues')]",
      "properties": {
        "addonProfiles": {
          "omsagent": {
            "enabled": true,
            "config": {
              "logAnalyticsWorkspaceResourceID": "[parameters('workspaceResourceId')]"
            }
          }
        }
      }
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "aksResourceId": {
      "value": "/subscriptions/<SubscriptionId>/resourcegroups/<ResourceGroup>/providers/Microsoft.ContainerService/managedClusters/<ResourceName>"
    },
    "aksResourceLocation": {
      "value": "<aksClusterLocation>"
    },
    "workspaceResourceId": {
      "value": "/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroup>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>"
    },
    "aksResourceTagValues": {
      "value": {
        "<existing-tag-name1>": "<existing-tag-value1>",
        "<existing-tag-name2>": "<existing-tag-value2>",
        "<existing-tag-nameN>": "<existing-tag-valueN>"
      }
    }
  }
}
```

## Enable for new Azure Red Hat OpenShift v3 cluster

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Location')
param location string

@description('Unique name for the cluster')
param clusterName string

@description('number of master nodes')
param masterNodeCount int = 3

@description('number of compute nodes')
param computeNodeCount int = 3

@description('number of infra nodes')
param infraNodeCount int = 3

@description('The ID of an Azure Active Directory tenant')
param aadTenantId string

@description('The ID of an Azure Active Directory client application')
param aadClientId string

@description('The secret of an Azure Active Directory client application')
@secure()
param aadClientSecret string

@description('The Object ID of an Azure Active Directory Group that memberships will get synced into the OpenShift group \'osa-customer-admins\'. If not specified, no cluster admin access will be granted.')
param aadCustomerAdminGroupId string

@description('Azure ResourceId of an existing Log Analytics Workspace')
param workspaceResourceId string

resource clusterName_resource 'Microsoft.ContainerService/openShiftManagedClusters@2019-10-27-preview' = {
  location: location
  name: clusterName
  properties: {
    openShiftVersion: 'v3.11'
    networkProfile: {
      vnetCidr: '10.0.0.0/8'
    }
    authProfile: {
      identityProviders: [
        {
          name: 'Azure AD'
          provider: {
            kind: 'AADIdentityProvider'
            clientId: aadClientId
            secret: aadClientSecret
            tenantId: aadTenantId
            customerAdminGroupId: aadCustomerAdminGroupId
          }
        }
      ]
    }
    masterPoolProfile: {
      count: masterNodeCount
      subnetCidr: '10.0.0.0/24'
      vmSize: 'Standard_D4s_v3'
    }
    agentPoolProfiles: [
      {
        role: 'compute'
        name: 'compute'
        count: computeNodeCount
        subnetCidr: '10.0.0.0/24'
        vmSize: 'Standard_D4s_v3'
        osType: 'Linux'
      }
      {
        role: 'infra'
        name: 'infra'
        count: infraNodeCount
        subnetCidr: '10.0.0.0/24'
        vmSize: 'Standard_D4s_v3'
        osType: 'Linux'
      }
    ]
    routerProfiles: [
      {
        name: 'default'
      }
    ]
    monitorProfile: {
      workspaceResourceID: workspaceResourceId
      enabled: true
    }
  }
}

```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "metadata": {
        "description": "Location"
      }
    },
    "clusterName": {
      "type": "string",
      "metadata": {
        "description": "Unique name for the cluster"
      }
    },
    "masterNodeCount": {
      "type": "int",
      "defaultValue": 3,
      "metadata": {
        "description": "number of master nodes"
      }
    },
    "computeNodeCount": {
      "type": "int",
      "defaultValue": 3,
      "metadata": {
        "description": "number of compute nodes"
      }
    },
    "infraNodeCount": {
      "type": "int",
      "defaultValue": 3,
      "metadata": {
        "description": "number of infra nodes"
      }
    },
    "aadTenantId": {
      "type": "string",
      "metadata": {
        "description": "The ID of an Azure Active Directory tenant"
      }
    },
    "aadClientId": {
      "type": "string",
      "metadata": {
        "description": "The ID of an Azure Active Directory client application"
      }
    },
    "aadClientSecret": {
      "type": "secureString",
      "metadata": {
        "description": "The secret of an Azure Active Directory client application"
      }
    },
    "aadCustomerAdminGroupId": {
      "type": "string",
      "metadata": {
        "description": "The Object ID of an Azure Active Directory Group that memberships will get synced into the OpenShift group 'osa-customer-admins'. If not specified, no cluster admin access will be granted."
      }
    },
    "workspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Azure ResourceId of an existing Log Analytics Workspace"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.ContainerService/openShiftManagedClusters",
      "apiVersion": "2019-10-27-preview",
      "name": "[parameters('clusterName')]",
      "location": "[parameters('location')]",
      "properties": {
        "openShiftVersion": "v3.11",
        "networkProfile": {
          "vnetCidr": "10.0.0.0/8"
        },
        "authProfile": {
          "identityProviders": [
            {
              "name": "Azure AD",
              "provider": {
                "kind": "AADIdentityProvider",
                "clientId": "[parameters('aadClientId')]",
                "secret": "[parameters('aadClientSecret')]",
                "tenantId": "[parameters('aadTenantId')]",
                "customerAdminGroupId": "[parameters('aadCustomerAdminGroupId')]"
              }
            }
          ]
        },
        "masterPoolProfile": {
          "count": "[parameters('masterNodeCount')]",
          "subnetCidr": "10.0.0.0/24",
          "vmSize": "Standard_D4s_v3"
        },
        "agentPoolProfiles": [
          {
            "role": "compute",
            "name": "compute",
            "count": "[parameters('computeNodeCount')]",
            "subnetCidr": "10.0.0.0/24",
            "vmSize": "Standard_D4s_v3",
            "osType": "Linux"
          },
          {
            "role": "infra",
            "name": "infra",
            "count": "[parameters('infraNodeCount')]",
            "subnetCidr": "10.0.0.0/24",
            "vmSize": "Standard_D4s_v3",
            "osType": "Linux"
          }
        ],
        "routerProfiles": [
          {
            "name": "default"
          }
        ],
        "monitorProfile": {
          "workspaceResourceID": "[parameters('workspaceResourceId')]",
          "enabled": true
        }
      }
    }
  ]
}
```

---

### Parameter file

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "value": "<azure region of the cluster e.g. westcentralus>"
        },
        "clusterName": {
            "value": "<name of the aro cluster>"
        },
        "aadTenantId": {
            "value": "<id of an azure active directory tenant>"
        },
        "aadClientId": {
            "value": "<id of an azure active directory client application>"
        },
        "aadClientSecret": {
            "value": "<secret of an azure active directory client application  >"
        },
        "aadCustomerAdminGroupId": {
            "value": "<customer admin group id>"
        },
        "workspaceResourceId": {
            "value": "<resource id of an existing log analytics workspace>"
        },
        "masterNodeCount": {
            "value": "<number of master node e.g. 3>"
        },
        "computeNodeCount": {
            "value": "<number of compute nodes in agent pool profile e.g. 3>"
        },
        "infraNodeCount": {
            "value": "<number of infra nodes in agent pool profile e.g. 3>"
        }
    }
}
```

## Enable for existing Azure Red Hat OpenShift v3 cluster

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('ARO Cluster Resource ID')
param aroResourceId string

@description('Location of the aro cluster resource e.g. westcentralus')
param aroResourceLocation string

@description('Azure Monitor Log Analytics Resource ID')
param workspaceResourceId string

resource aroResourceId_8 'Microsoft.ContainerService/openShiftManagedClusters@2019-10-27-preview' = {
  name: split(aroResourceId, '/')[8]
  location: aroResourceLocation
  properties: {
    openShiftVersion: 'v3.11'
    monitorProfile: {
      enabled: true
      workspaceResourceID: workspaceResourceId
    }
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "aroResourceId": {
      "type": "string",
      "metadata": {
        "description": "ARO Cluster Resource ID"
      }
    },
    "aroResourceLocation": {
      "type": "string",
      "metadata": {
        "description": "Location of the aro cluster resource e.g. westcentralus"
      }
    },
    "workspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Azure Monitor Log Analytics Resource ID"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.ContainerService/openShiftManagedClusters",
      "apiVersion": "2019-10-27-preview",
      "name": "[split(parameters('aroResourceId'), '/')[8]]",
      "location": "[parameters('aroResourceLocation')]",
      "properties": {
        "openShiftVersion": "v3.11",
        "monitorProfile": {
          "enabled": true,
          "workspaceResourceID": "[parameters('workspaceResourceId')]"
        }
      }
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "aroResourceId": {
      "value": "/subscriptions/<subId>/resourceGroups/<rgName>/providers/Microsoft.ContainerService/openShiftManagedClusters/<clusterName>"
    },
    "aroResourceLocation": {
      "value": "<azure region of the cluster e.g. westcentralus>"
    },
    "workspaceResourceId": {
      "value": "/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroup>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>"
    }
  }
}
```

## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about Container insights](../containers/container-insights-overview.md).
