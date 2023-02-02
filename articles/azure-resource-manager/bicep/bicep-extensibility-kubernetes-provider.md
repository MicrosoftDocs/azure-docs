---
title: Bicep extensibility Kubernetes provider
description: Learn how to Bicep Kubernetes provider  to deploy .NET applications to Azure Kubernetes Service clusters.
ms.topic: conceptual
ms.date: 02/01/2023
---

# Bicep extensibility Kubernetes provider (Preview)

Learn how to Bicep extensibility Kubernetes provider to deploy .NET applications to [Azure Kubernetes Service clusters (AKS)](../../aks/intro-kubernetes.md).

## Enable the preview feature

This preview feature can be enabled by configuring the [bicepconfig.json](./bicep-config.md):

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
resource aks 'Microsoft.ContainerService/managedClusters@2022-05-02-preview' existing = {
  name: clusterName
}

import 'kubernetes@1.0.0' with {
  namespace: 'default'
  kubeConfig: aks.listClusterAdminCredential().kubeconfigs[0].value
}
```

The AKS cluster can be a new resource or an existing resource. The [Import Kubernetes manifest command](./visual-studio-code.md#bicep-commands) from Visual Studio Code can automatically add the code snippet automatically.

## Define Kubernetes deployments and services

*** Do I need to cover how a Kubernetes YML is transformed into Bicep?

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: azure-vote-back
spec:
  replicas: 1
  selector:
    matchLabels:
      app: azure-vote-back
  template:
    metadata:
      labels:
        app: azure-vote-back
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: azure-vote-back
        image: mcr.microsoft.com/oss/bitnami/redis:6.0.8
        env:
        - name: ALLOW_EMPTY_PASSWORD
          value: "yes"
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
        ports:
        - containerPort: 6379
          name: redis
---
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-back
spec:
  ports:
  - port: 6379
  selector:
    app: azure-vote-back
```

```bicep
resource appsDeployment_azureVoteBack 'apps/Deployment@v1' = {
  metadata: {
    name: 'azure-vote-back'
  }
  spec: {
    replicas: 1
    selector: {
      matchLabels: {
        app: 'azure-vote-back'
      }
    }
    template: {
      metadata: {
        labels: {
          app: 'azure-vote-back'
        }
      }
      spec: {
        nodeSelector: {
          'kubernetes.io/os': 'linux'
        }
        containers: [
          {
            name: 'azure-vote-back'
            image: 'mcr.microsoft.com/oss/bitnami/redis:6.0.8'
            env: [
              {
                name: 'ALLOW_EMPTY_PASSWORD'
                value: 'yes'
              }
            ]
            resources: {
              requests: {
                cpu: '100m'
                memory: '128Mi'
              }
              limits: {
                cpu: '250m'
                memory: '256Mi'
              }
            }
            ports: [
              {
                containerPort: 6379
                name: 'redis'
              }
            ]
          }
        ]
      }
    }
  }
}

resource coreService_azureVoteBack 'core/Service@v1' = {
  metadata: {
    name: 'azure-vote-back'
  }
  spec: {
    ports: [
      {
        port: 6379
      }
    ]
    selector: {
      app: 'azure-vote-back'
    }
  }
}
```

## Visual Studio Code import

From Visual Studio Code, you can import Kubernetes manifest files to create Bicep module files. For more information, see [Visual Studio Code](./visual-studio-code.md#bicep-commands)

## Next steps

- [Add module settings in Bicep config](bicep-config-modules.md)
- [Add linter settings to Bicep config](bicep-config-linter.md)
- Learn about the [Bicep linter](linter.md)
