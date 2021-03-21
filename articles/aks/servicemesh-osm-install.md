---
title: Install and Configure
description: Learn how to install and configure Open Service Mesh (OSM) in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 3/12/2021
zone_pivot_groups: client-operating-system
---

# Install and use the Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on (Preview)

[Open Service Mesh (OSM)](https://docs.openservicemesh.io/) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

This article will show you how to enable the OSM add-on for a new or existing Azure Kubernetes Service (AKS) cluster and how to obtain and install the `osm` client binary onto your client machine to manage the OSM instance in your AKS cluster.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

> [!NOTE]
> The following instructions reference OSM version `0.8.0`.
>
> The OSM `0.8.x` client library release have been tested by the OSM and AKS team against Kubernetes version `1.19+`. You can find additional releases of OSM versions at [OSM Releases](https://github.com/openservicemesh/osm/releases) linke on the OSM GitHub repository and information about each of the releases.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Download and install the OSM `osm` client binary
> - Deploy AKS and/or enable the OSM add-on for AKS
> - Validate the OSM add-on for AKS installation
> - Access the OSM add-on configuration
> - Uninstall and remove the OSM add-on from AKS

## Before you begin

The steps detailed in this article assume that you have already created or will be deploying a new AKS cluster with Azure virtual network connectivity (Kubernetes `1.19+` and above, with Kubernetes RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart](./kubernetes-walkthrough.md).

You must have the following resource installed:

- The Azure CLI, version 2.20.0 or later
- The `azure-preview` extension version 0.5.5 or later
- AKS cluster version 1.19+
  - Preferably using Azure CNI networking (Attached to an Azure Vnet)
- OSM version v0.8.0 or later

### Install the `aks-preview` Azure CLI

You also need the _aks-preview_ Azure CLI extension version 0.4.64 or later. Install the _aks-preview_ Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Preview service quotas and limits

As noted prior, the OSM add-on for AKS is in a preview state and will undergo additional enhancements prior to general availablity (GA). During the preview phase it is recommended to not surpass the limits shown in the following table:

| Resource                                           | Limit |
| -------------------------------------------------- | :---- |
| Kubernetes Cluster Version                         | 1.19+ |
| Maximum OSM controllers per cluster                | 1     |
| Maximum pods per OSM controller                    | 500   |
| Maximum Kubernetes service accounts managed my OSM | 50    |

## Download and install the OSM client binary

::: zone pivot="client-operating-system-linux"

[!INCLUDE [Linux - download and install client binary](includes/servicemesh/osm/install-osm-binary-linux.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [macOS - download and install client binary](includes/servicemesh/osm/install-osm-binary-macos.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [Windows - download and install client binary](includes/servicemesh/osm/install-osm-binary-windows.md)]

::: zone-end

> [!NOTE]
> Do not attempt to install OSM from the binary using `osm install`. This will result in a installation of OSM that is not integrated as an add-on for AKS.

## Enable the AKS OSM add-on

### Greenfield AKS deployment

In the greenfield scenario, you will start with a brand new deployment of an AKS cluster enabling the OSM add-on at the cluster create operation.

#### Create a resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using [az group create](/cli/azure/group#az-group-create). The following example creates a resource group named _myOsmAksGroup_ in the _eastus2_ location (region):

```azurecli-interactive
az group create --name myOsmAksGroup --location eastus2
```

#### Deploy an AKS cluster with the OSM add-on enabled

You'll now deploy a new AKS cluster with the OSM add-on enabled.

> [!NOTE]
> Please be aware the following AKS deployment command utilizes OS ephemeral disks. You can find more information here about [Ephemeral OS disks for AKS](https://docs.microsoft.com/azure/aks/cluster-configuration#ephemeral-os)

```azurecli-interactive
az aks create -n osm-addon-cluster -g myOsmAksGroup --kubernetes-version 1.19.6 --node-osdisk-type Ephemeral --node-osdisk-size 30 --network-plugin azure --enable-managed-identity -a open-service-mesh
```

### Brownfield AKS deployment

In the brownfield scenario, you will enable the OSM add-on to an existing AKS cluster that has already been deployed.

#### Enable the OSM add-on to existing AKS cluster

To enable the AKS OSM add-on you will need to run the `az aks enable-addons --addons` command passing the parameter `open-service-mesh`

```Azure CLI
az aks enable-addons --addons open-service-mesh -g <resource group name> -n <AKS cluster name>
```

You should see output similar to the output shown below to confirm the AKS OSM add-on has been installed.

```Output
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

```Azure CLI
az aks list -g <resource group name> | jq -r .[].addonProfiles.openServiceMesh.enabled
```

The following `kubectl` commands will report the status of the osm-controller.

```Console
kubectl get deployments -n kube-system --selector app=osm-controller
kubectl get pods -n kube-system --selector app=osm-controller
kubectl get services -n kube-system --selector app=osm-controller
```

## Accessing the add-on

Currently you can access and configure the OSM controller configuration via the configmap. To view the OSM controller configuration settings, query the osm-config configmap via `kubectl` to view its configuration settings.

```Console
kubectl get configmap -n kube-system osm-config -o json | jq '.data'
```

Output of the OSM configmap should look like the following:

```Output
{
  "egress": "true",
  "enable_debug_server": "true",
  "envoy_log_level": "error",
  "permissive_traffic_policy_mode": "true",
  "prometheus_scraping": "false",
  "service_cert_validity_duration": "24h",
  "use_https_ingress": "false"
}
```

## Uninstall the AKS OSM add-on

To uninstall the AKS OSM add-on you will need to run the `az aks disable-addons --addons` command passing the parameter "open-service-mesh" to install OSM.

```Azure CLI
az aks disable-addons --addons "open-service-mesh" -g <resource group name> -n <AKS cluster name>
```

## Next steps

We are developing several tutorials to get you aquainted with using OSM on AKS. Below are a few to get your started.

> [!div class="nextstepaction"] > [Deploy a multi-container application managed by Open Service Mesh (OSM) with NGINX ingress](./servicemesh-osm-tutorial-nginx.md)

> [!div class="nextstepaction"] > [Deploy a multi-container application managed by Open Service Mesh (OSM) using Azure Application Gateway ingress AKS add-on](./servicemesh-osm-tutorial-agic.md)

<!-- LINKS - external -->

[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
