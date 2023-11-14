---
 title: include file
 description: include file
 author: kgremban
 ms.topic: include
 ms.date: 10/19/2023
 ms.author: kgremban
ms.custom:
  - include file
  - ignite-2023
---

```bicep
@description('The name of the existing Arc-enabled cluster where the orchestration occurs.')
param clusterName string

@description('The location of the existing Arc-enabled cluster resource in Azure.')
@allowed(['eastus2', 'westus3'])
param clusterLocation string

@description('The namespace on the K8s cluster where the resources are installed.')
param clusterNamespace string

@description('The extended location resource name.')
param customLocationName string

resource cluster 'Microsoft.Kubernetes/connectedClusters@2021-03-01' existing = {
  name: clusterName
}

resource orchestratorExtension 'Microsoft.KubernetesConfiguration/extensions@2022-03-01' = {
  name: 'orchestrator'
  location: cluster.location
  scope: cluster
  properties: {
    extensionType: 'microsoft.alicesprings'
    autoUpgradeMinorVersion: false
    scope: {
      cluster: {
        releaseNamespace: clusterNamespace
      }
    }
    version: '0.44.8'
    releaseTrain: 'private-preview'
    configurationSettings: {
      'Microsoft.CustomLocation.ServiceAccount': 'default'
    }
  }
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' = {
  name: customLocationName
  location: clusterLocation
  properties: {
    hostResourceId: cluster.id
    namespace: clusterNamespace
    displayName: customLocationName
    clusterExtensionIds: [
      orchestratorExtension.id
    ]
  }
}

resource syncRule 'Microsoft.ExtendedLocation/customLocations/resourceSyncRules@2021-08-31-preview' = {
  parent: customLocation
  name: '${customLocationName}-sync'
  location: clusterLocation
  properties: {
    priority: 100
    targetResourceGroup: resourceGroup().id
    selector: {
      matchLabels: {
        'management.azure.com/provider-name': 'microsoft.iotoperationsorchestrator'
      }
    }
  }
}
```
