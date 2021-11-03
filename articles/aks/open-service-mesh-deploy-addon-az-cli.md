---
title: Deploy Open Service Mesh
description: Deploy Open Service Mesh on Azure Kubernetes Service (AKS) using Azure CLI
services: container-service
ms.topic: article
ms.date: 8/26/2021
ms.custom: mvc, devx-track-azurecli
ms.author: pgibson
---

# Deploy the Open Service Mesh AKS add-on using Azure CLI

This article will discuss how to deploy the OSM add-on to AKS.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

- The Azure CLI, version 2.20.0 or later
- The `aks-preview` extension version 0.5.5 or later
- OSM version v0.9.1 or later

## Install the aks-preview extension

You will need the _aks-preview_ Azure CLI extension version 0.5.24 or greater. Install the _aks-preview_ Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Register the `AKS-OpenServiceMesh` preview feature

To create an AKS cluster that can use the Open Service Mesh add-on, you must enable the `AKS-OpenServiceMesh` feature flag on your subscription.

Register the `AKS-OpenServiceMesh` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AKS-OpenServiceMesh"
```

It takes a few minutes for the status to show _Registered_. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKS-OpenServiceMesh')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the _Microsoft.ContainerService_ resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Install Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on for a new AKS cluster

For a new AKS cluster deployment scenario, you will start with a brand new deployment of an AKS cluster enabling the OSM add-on at the cluster create operation.

### Create a resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using [az group create](/cli/azure/group#az_group_create). The following example is used to create a resource group in a specified location (region):

```azurecli-interactive
az group create --name <my-osm-aks-cluster-rg> --location <azure-region>
```

### Deploy an AKS cluster with the OSM add-on enabled

You'll now deploy a new AKS cluster with the OSM add-on enabled.

> [!NOTE]
> Please be aware the following AKS deployment command utilizes OS ephemeral disks. You can find more information here about [Ephemeral OS disks for AKS](./cluster-configuration.md#ephemeral-os)

```azurecli-interactive
az aks create -n <my-osm-aks-cluster-name> -g <my-osm-aks-cluster-rg> --node-osdisk-type Ephemeral --node-osdisk-size 30 --network-plugin azure --enable-managed-identity -a open-service-mesh
```

#### Get AKS Cluster Access Credentials

Get access credentials for the new managed Kubernetes cluster.

```azurecli-interactive
az aks get-credentials -n <my-osm-aks-cluster-name> -g <my-osm-aks-cluster-rg>
```

## Enable Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on for an existing AKS cluster

For an existing AKS cluster scenario, you will enable the OSM add-on to an existing AKS cluster that has already been deployed.

### Enable the OSM add-on to existing AKS cluster

To enable the AKS OSM add-on, you will need to run the `az aks enable-addons --addons` command passing the parameter `open-service-mesh`

```azurecli-interactive
az aks enable-addons --addons open-service-mesh -g <my-osm-aks-cluster-rg> -n <my-osm-aks-cluster-name>
```

You should see output similar to the output shown below to confirm the AKS OSM add-on has been installed.

```json
{- Finished ..
  "aadProfile": null,
  "addonProfiles": {
    "KubeDashboard": {
      "config": null,
      "enabled": false,
      "identity": null
    },
    "openServiceMesh": {
      "config": {},
      "enabled": true,
      "identity": {
...
```

## Validate the AKS OSM add-on installation

There are several commands to run to check all of the components of the AKS OSM add-on are enabled and running:

First we can query the add-on profiles of the cluster to check the enabled state of the add-ons installed. The following command should return "true".

```azurecli-interactive
az aks list -g <my-osm-aks-cluster-rg> -o json | jq -r '.[].addonProfiles.openServiceMesh.enabled'
```

The following `kubectl` commands will report the status of the osm-controller.

```azurecli-interactive
kubectl get deployments -n kube-system --selector app=osm-controller
kubectl get pods -n kube-system --selector app=osm-controller
kubectl get services -n kube-system --selector app=osm-controller
```

## Accessing the AKS OSM add-on configuration

Currently you can access and configure the OSM controller configuration via the OSM MeshConfig resource. To view the OSM controller configuration settings via the CLI use the **kubectl** get command as shown below.

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n kube-system -o yaml
```

Output of the MeshConfig should look like the following:

```
apiVersion: config.openservicemesh.io/v1alpha1
kind: MeshConfig
metadata:
  creationTimestamp: "0000-00-00A00:00:00A"
  generation: 1
  name: osm-mesh-config
  namespace: kube-system
  resourceVersion: "2494"
  uid: 6c4d67f3-c241-4aeb-bf4f-b029b08faa31
spec:
  certificate:
    serviceCertValidityDuration: 24h
  featureFlags:
    enableEgressPolicy: true
    enableMulticlusterMode: false
    enableWASMStats: true
  observability:
    enableDebugServer: true
    osmLogLevel: info
    tracing:
      address: jaeger.osm-system.svc.cluster.local
      enable: false
      endpoint: /api/v2/spans
      port: 9411
  sidecar:
    configResyncInterval: 0s
    enablePrivilegedInitContainer: false
    envoyImage: mcr.microsoft.com/oss/envoyproxy/envoy:v1.18.3
    initContainerImage: mcr.microsoft.com/oss/openservicemesh/init:v0.9.1
    logLevel: error
    maxDataPlaneConnections: 0
    resources: {}
  traffic:
    enableEgress: true
    enablePermissiveTrafficPolicyMode: true
    inboundExternalAuthorization:
      enable: false
      failureModeAllow: false
      statPrefix: inboundExtAuthz
      timeout: 1s
    useHTTPSIngress: false
```

Notice the **enablePermissiveTrafficPolicyMode** is configured to **true**. Permissive traffic policy mode in OSM is a mode where the [SMI](https://smi-spec.io/) traffic policy enforcement is bypassed. In this mode, OSM automatically discovers services that are a part of the service mesh and programs traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.

> [!WARNING]
> Before proceeding please verify that your permissive traffic policy mode is set to true, if not please change it to **true** using the command below

```OSM Permissive Mode to True
kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":true}}}' --type=merge
```

<!-- Links -->
<!-- Internal -->

[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
