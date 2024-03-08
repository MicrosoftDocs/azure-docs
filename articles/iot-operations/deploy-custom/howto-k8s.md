---
title: Deploy K8s workloads - Azure IoT Orchestrator
description: Use K8s to deploy custom workloads to Azure IoT Operations clusters with the Azure IoT Orchestrator
author: kgremban
ms.author: kgremban
# ms.subservice: orchestrator
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/01/2023

#CustomerIntent: As an OT professional, I want to deploy custom workloads to a Kubernetes cluster.
---

# Deploy a K8s resource to a Kubernetes cluster

Once you have Azure IoT Operations deployed to a connected cluster, you can use Azure IoT Orchestrator to deploy custom workloads including K8s custom resources.

## Prerequisites

* An Arc-enabled Kubernetes cluster with Azure IoT Orchestrator deployed to it. For more information, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).

## Deploy a K8s resource

This article shows you how to deploy a K8s custom resource using Azure IoT Orchestrator through [Bicep](../../azure-resource-manager/bicep/deploy-cli.md).

The following example is a Bicep template that deploys a K8s ConfigMap:

```bicep
@description('The location of the existing Arc-enabled cluster resource in Azure.')
@allowed(['eastus2', 'westus3'])
param clusterLocation string

@description('The namespace on the K8s cluster where the resources are installed.')
param clusterNamespace string

@description('The extended location resource name.')
param customLocationName string

var k8sConfigMap = loadYamlContent('config-map.yml')

resource k8sResource 'Microsoft.iotoperationsorchestrator/targets@2023-10-04-preview' = {
  name: 'k8s-resource'
  location: clusterLocation
  extendedLocation: {
    type: 'CustomLocation'
    name: resourceId('Microsoft.ExtendedLocation/customLocations', customLocationName)
  }
  properties: {
    scope: clusterNamespace
    components: [
      {
        name: 'config-map-1'
        type: 'yaml.k8s'
        properties: {
          resource: k8sConfigMap
        }
      }
    ]
    topologies: [
      {
        bindings: [
          {
            role: 'instance'
            provider: 'providers.target.k8s'
            config: {
              inCluster: 'true'
            }
          }
          {
            role: 'yaml.k8s'
            provider: 'providers.target.kubectl'
            config: {
              inCluster: 'true'
            }
          }
        ]
      }
    ]
  }
}
```

You can use the Azure CLI to deploy the Bicep file.

1. Save the Bicep file as **main.bicep** to your local computer.

2. Save the following ConfigMap YAML as **config-map.yml** to your local computer.

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: config-demo
    data:
      # property-like keys; each key maps to a simple value
      player_initial_lives: "3"
      ui_properties_file_name: "user-interface.properties"

      # file-like keys
      game.properties: |
        enemy.types=aliens,monsters
        player.maximum-lives=5    
      user-interface.properties: |
        color.good=purple
        color.bad=yellow
        allow.textmode=true    
    ```

3. Deploy the Bicep file using the Azure CLI.

    ```azurecli
    az deployment group create --resource-group exampleRG --template-file ./main.bicep --parameters clusterLocation=<existing-cluster-location> clusterNamespace=<namespace-on-cluster> customLocationName=<existing-custom-location-name>
    ```

    Replace **\<existing-cluster-location\>** with the existing Arc-enabled cluster resource's location. Replace **\<namespace-on-cluster\>** with the namespace where you want resources deployed on the Arc-enabled cluster. Replace **\<existing-custom-location-name\>** with the name of the existing custom location resource that is linked to your Arc-enabled cluster.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal or Azure CLI to list the deployed resources in the resource group.

```azurecli
az resource list --resource-group exampleRG
```
