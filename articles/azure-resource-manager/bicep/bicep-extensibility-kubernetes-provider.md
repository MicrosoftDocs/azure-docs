---
title: Bicep extensiblity Kubernetes provider
description: Learn how to Bicep Kubernetes provider  to deploy .NET applications to Azure Kubernetes Service clusters.
ms.topic: conceptual
ms.date: 02/01/2023
---

# Bicep extensibility Kubernetes provider (Preview)

Learn how to Bicep extensibility Kubernetes provider to deploy .NET applications to [Azure Kubernetes Service clusters](../../aks/intro-kubernetes.md).

## Enable the preview feature

This preview feature can be enabled by configure the [bicepconfig.json](./bicep-config.md):

```bicep
{
  "experimentalFeaturesEnabled": {
    "extensibility": true,
  }
}
```

## Import schema for Kubernetes provider

Use the following syntax to import schema for Kubernetes provider:

```bicep
import 'kubernetes@1.0.0' with {
  namespace: 'default'
  kubeConfig: kubeConfig
}
```

*** talk about the version
*** talk about the schema
*** talk about the kubeConfig value
*** add import to the Bicep syntax
*** update resource to the Bicep syntax

## how provider-specific resource types are exposed/accessed

```bicep
resource appsDeployment_azureVoteBack 'apps/Deployment@v1' = {}
```

.apiVersion	Specifies the API group and API resource you want to use when creating the resource.
.kind	Specifies the type of resource you want to create.


## Visual Studio Code import


## The main Bicep file

```bicep
param baseName string
param dnsPrefix string
param linuxAdminUsername string
param sshRSAPublicKey string

var osDiskSizeGB = 0
var agentCount = 1
var agentVmSize = 'Standard_B2s'

#disable-next-line no-loc-expr-outside-params
var location = resourceGroup().location

resource aks 'Microsoft.ContainerService/managedClusters@2022-04-01' = {
  name: baseName
  location: location
  properties: {
    dnsPrefix: dnsPrefix
    agentPoolProfiles: [
      {
        name: 'agentpool'
        osDiskSizeGB: osDiskSizeGB
        count: agentCount
        vmSize: agentVmSize
        osType: 'Linux'
        mode: 'System'
      }
    ]
    linuxProfile: {
      adminUsername: linuxAdminUsername
      ssh: {
        publicKeys: [
          {
            keyData: sshRSAPublicKey
          }
        ]
      }
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}

module kubernetes './modules/kubernetes.bicep' = {
  name: 'buildbicep-deploy'
  params: {
    kubeConfig: aks.listClusterAdminCredential().kubeconfigs[0].value
  }
}

var dnsLabel = kubernetes.outputs.dnsLabel
var normalizedLocation = toLower(replace(location, ' ', ''))

output endpoint string = 'http://${dnsLabel}.${normalizedLocation}.cloudapp.azure.com'
```

## The module file

```bicep
@secure()
param kubeConfig string

import 'kubernetes@1.0.0' with {
  kubeConfig: kubeConfig
  namespace: 'default'
}

var build = {
  name: 'bicepbuild'
  version: 'latest'
  image: 'ghcr.io/anthony-c-martin/bicep-on-k8s:main'
  port: 80
}

@description('Configure the BicepBuild deployment')
resource buildDeploy 'apps/Deployment@v1' = {
  metadata: {
    name: build.name
  }
  spec: {
    selector: {
      matchLabels: {
        app: build.name
        version: build.version
      }
    }
    replicas: 1
    template: {
      metadata: {
        labels: {
          app: build.name
          version: build.version
        }
      }
      spec: {
        containers: [
          {
            name: build.name
            image: build.image
            ports: [
              {
                containerPort: build.port
              }
            ]
          }
        ]
      }
    }
  }
}

@description('Configure the BicepBuild service')
resource buildService 'core/Service@v1' = {
  metadata: {
    name: build.name
    annotations: {
      'service.beta.kubernetes.io/azure-dns-label-name': build.name
    }
  }
  spec: {
    type: 'LoadBalancer'
    ports: [
      {
        port: build.port
      }
    ]
    selector: {
      app: build.name
    }
  }
}

output dnsLabel string = build.name
```

## Next steps

- [Add module settings in Bicep config](bicep-config-modules.md)
- [Add linter settings to Bicep config](bicep-config-linter.md)
- Learn about the [Bicep linter](linter.md)
