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

## Prerequisites

- The Azure CLI, version 2.20.0 or later
- OSM version v0.11.1 or later

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

> [!NOTE]
> For the OSM add-on deployment to succeed, only one OSM mesh instance should be deployed on your cluster. If you have other OSM mesh instances on your cluster, please uninstall them before running the `enable-addons` command.

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

### Check OSM add-on version

The installed OSM add-on version should be v0.11.1 or higher. To verify this, you can run the following command to check the image version for the osm-controller, which is encoded in the image tag: 

```azurecli-interactive
kubectl get deployment -n kube-system osm-controller -o=jsonpath='{$.spec.template.spec.containers[:1].image}'
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

## Disable Open Service Mesh (OSM) add-on for your AKS cluster

To disable the OSM add-on, run the following command:

```azurecli-interactive
az aks disable-addons -n <AKS-cluster-name> -g <AKS-resource-group-name> -a open-service-mesh
```
After the OSM add-on is disabled, the following resources remain on the cluster:
1. OSM meshconfig custom resource
2. OSM control plane secrets
3. OSM mutating webhook configuration
4. OSM validating webhook configuration
5. OSM CRDs

> [!IMPORTANT]
> You must remove these additional resources after you disable the OSM add-on. Leaving these resources on your cluster may cause issues if you enable the OSM add-on again in the future.

To remove these remaining resources:

1. Delete the meshconfig config resource
```azurecli-interactive
kubectl delete --ignore-not-found meshconfig -n kube-system osm-mesh-config
```

2. Delete the OSM control plane secrets
```azurecli-interactive
kubectl delete --ignore-not-found secret -n kube-system osm-ca-bundle mutating-webhook-cert-secret validating-webhook-cert-secret crd-converter-cert-secret
```

3. Delete the OSM mutating webhook configuration
```azurecli-interactive
kubectl delete mutatingwebhookconfiguration -l app.kubernetes.io/name=openservicemesh.io,app.kubernetes.io/instance=osm,app=osm-injector --ignore-not-found
```

4. Delete the OSM validating webhook configuration
```azurecli-interactive
kubectl delete validatingwebhookconfiguration -l app.kubernetes.io/name=openservicemesh.io,app.kubernetes.io/instance=osm,app=osm-controller --ignore-not-found
```

5. Delete the OSM CRDs: For guidance on OSM's CRDs and how to delete them, refer to [this documentation](https://release-v0-11.docs.openservicemesh.io/docs/getting_started/uninstall/#removal-of-osm-cluster-wide-resources).

<!-- Links -->
<!-- Internal -->

[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
