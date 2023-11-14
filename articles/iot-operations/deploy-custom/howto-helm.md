---
title: Deploy Helm chart workloads - Azure IoT Orchestrator
description: Use Helm charts to deploy custom workloads to Azure IoT Operations clusters with the Azure IoT Orchestrator
author: kgremban
ms.author: kgremban
# ms.subservice: orchestrator
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/01/2023

#CustomerIntent: As an OT professional, I want to deploy custom workloads to a Kubernetes cluster.
---

# Deploy a Helm chart to a Kubernetes cluster

Once you have Azure IoT Operations deployed to a connected cluster, you can use Azure IoT Orchestrator to deploy custom workloads including Helm charts.

## Prerequisites

* An Arc-enabled Kubernetes cluster with Azure IoT Orchestrator deployed to it. For more information, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).

## Deploy a helm chart with override values

This section shows you how to deploy a helm chart using the orchestrator through [Bicep](../../azure-resource-manager/bicep/deploy-cli.md). The helm values used during the helm install are stored in separate files that are imported at the time of the deployment. There are two helm value files that are unioned together to form the helm values used by the helm chart: a base helm values file and an overlay helm values file. The base helm values file defines values common to many deployment environments. The overlay helm values file defines a few specific values for a single deployment environment.

The following example is a Bicep template that deploys a helm chart:

>[!NOTE]
>The Bicep `union()` method is used to combine two sets of configuration values.

```bicep
@description('The location of the existing Arc-enabled cluster resource in Azure.')
@allowed(['eastus2', 'westus3'])
param clusterLocation string

@description('The namespace on the K8s cluster where the resources are installed.')
param clusterNamespace string

@description('The extended location resource name.')
param customLocationName string

// Load the base helm chart config and the overlay helm chart config.
// Apply the overlay config over the base config using union().
var baseAkriValues = loadYamlContent('base.yml')
var overlayAkriValues = loadYamlContent('overlay.yml')
var akriValues = union(baseAkriValues, overlayAkriValues)

resource helmChart 'Microsoft.iotoperationsorchestrator/targets@2023-05-22-preview' = {
  name: 'akri-helm-chart-override'
  location: clusterLocation
  extendedLocation: {
    type: 'CustomLocation'
    name: resourceId('Microsoft.ExtendedLocation/customLocations', customLocationName)
  }
  properties: {
    scope: clusterNamespace
    components: [
      {
        name: 'akri'
        type: 'helm.v3'
        properties: {
          chart: {
            repo: 'oci://azureiotoperations.azurecr.io/simple-chart',
            version: '0.1.0'
          }
          values: akriValues
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
            role: 'helm.v3'
            provider: 'providers.target.helm'
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

2. Save the following helm values YAML as **base.yml** to your local computer.

    ```yaml
    custom:
      configuration:
        enabled: true
        name: akri-opcua-asset
        discoveryHandlerName: opcua-asset
        discoveryDetails: |
          opcuaDiscoveryMethod:
            - asset:
                endpointUrl: "opc.tcp://<INSERT FQDN>:50000"
                useSecurity: false
                autoAcceptUntrustedCertificates: true   
      discovery:
        enabled: true
        name: akri-opcua-asset-discovery
        image:
          repository: e4ipreview.azurecr.io/e4i/workload/akri-opc-ua-asset-discovery
          tag: latest
          pullPolicy: Always
        useNetworkConnection: true
        port: 80
        resources:
          memoryRequest: 64Mi
          cpuRequest: 10m
          memoryLimit: 512Mi
          cpuLimit: 1000m
    kubernetesDistro: k8s
    prometheus:
      enabled: true
    opentelemetry:
      enabled: true    
    ```

3. Save the following helm values YAML as **overlay.yml** to your local computer.

    ```yaml
    custom:
      configuration:
        discoveryDetails: |
          opcuaDiscoveryMethod:
            - asset:
                endpointUrl: "opc.tcp://site.specific.endpoint:50000"
                useSecurity: false
                autoAcceptUntrustedCertificates: true 
    ```

4. Deploy the Bicep file using the Azure CLI.

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
