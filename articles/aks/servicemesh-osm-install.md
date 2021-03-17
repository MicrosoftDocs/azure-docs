---
title: Install and Configure
description: Learn how to install and configure Open Service Mesh (OSM) in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 3/12/2021
---

# Install and use the Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on (Preview)

[Open Service Mesh (OSM)](https://docs.openservicemesh.io/) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

This article will show you how to enable the OSM add-on for Azure Kubernetes Service (AKS) and how to obtain and install the `osm` client binary onto your client machine to manage the OSM instance in your AKS cluster.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

> [!NOTE]
> The following instructions reference OSM version `0.8.0`.
>
> The OSM `0.8.x` releases have been tested by the AKS team against Kubernetes version `1.18+`. You can find additional releases of OSM versions at [OSM Releases](https://github.com/openservicemesh/osm/releases) linke on the OSM GitHub repository and information about each of the releases.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Download and install the OSM `osm` client binary
> - Enable the OSM add-on for AKS
> - Validate the OSM add-on for AKS installation
> - Access the add-on
> - Uninstall and remove the OSM add-on from AKS

## Before you begin

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.18` and above, with Kubernetes RBAC enabled) and have established a `kubectl` connection with the cluster. If you need help with any of these items, then see the [AKS quickstart](./kubernetes-walkthrough.md).

### Preview service quotas and limits

As noted prior, the OSM add-on for AKS is in a preview state and will undergo additional enhancements prior to general availablity (GA). During the preview phase it is recommended to not surpass the limits shown in the following table:

| Resource                                           | Limit |
| -------------------------------------------------- | :---- |
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

## Enable the AKS OSM add-on

To enable the AKS OSM add-on you will need to run the `az aks enable-addons --addons` command passing the parameter "open-service-mesh" to install OSM.

```bash
az aks enable-addons --addons "open-service-mesh" -g <resource group name> -n <AKS cluster name>
```

You should see output similar to the output shown below to confirm the AKS OSM add-on has been installed.

```console
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

```Console
az aks list -g <resource group name> | jq -r .[].addonProfiles.openServiceMesh.enabled
```

The following `kubectl` commands will report the status of the osm-controller.

```
kubectl get deployments -n kube-system --selector app=osm-controller
kubectl get pods -n kube-system --selector app=osm-controller
kubectl get services -n kube-system --selector app=osm-controller
```

## Accessing the add-on

Currently you can access and configure the OSM controller configuration via the configmap. To view the OSM controller configuration settings, query the osm-config configmap via `kubectl` to view its configuration settings.

```
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

## Enable Metrics and Observability Components

Open Service Mesh (OSM) generates detailed metrics for all services communicating within the mesh. These metrics provide insights into the behavior of services in the mesh helping users to troubleshoot, maintain and analyze their applications.

As of today OSM collects metrics directly from the sidecar proxies (Envoy). OSM provides rich metrics for incoming and outgoing traffic for all services in the mesh. With these metrics the user can get information about the overall volume of traffic, errors within traffic and the response time for requests.

### Prometheus

### Grafana

### Jaeger

## Uninstall OSM from AKS

## Next steps
