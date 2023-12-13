---
title: Configure kube-proxy (iptables/IPVS) (Preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to configure kube-proxy to utilize different load balancing configurations with Azure Kubernetes Service (AKS).
ms.subservice: aks-networking
ms.custom: devx-track-azurecli, devx-track-linux
ms.topic: how-to
ms.date: 09/25/2023
ms.author: allensu
author: asudbring
#Customer intent: As a cluster operator, I want to utilize a different kube-proxy configuration.
---

# Configure `kube-proxy` in Azure Kubernetes Service (AKS) (Preview)

`kube-proxy` is a component of Kubernetes that handles routing traffic for services within the cluster. There are two backends available for Layer 3/4 load balancing in upstream `kube-proxy`: iptables and IPVS.

- **iptables** is the default backend utilized in the majority of Kubernetes clusters. It's simple and well-supported, but not as efficient or intelligent as IPVS.
- **IPVS** uses the Linux Virtual Server, a layer 3/4 load balancer built into the Linux kernel. IPVS provides a number of advantages over the default iptables configuration, including state awareness, connection tracking, and more intelligent load balancing. IPVS *doesn't support Azure Network Policy*.

For more information, see the [Kubernetes documentation on kube-proxy](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/).

> [!NOTE]
> If you want, you can disable the AKS-managed `kube-proxy` DaemonSet to support [bring-your-own CNI][aks-byo-cni].

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

## Before you begin

- If using the Azure CLI, you need the `aks-preview` extension. See [Install the `aks-preview` Azure CLI extension](#install-the-aks-preview-azure-cli-extension).
- If using ARM or the REST API, the AKS API version must be *2022-08-02-preview or later*.
- You need to register the `KubeProxyConfigurationPreview` feature flag. See [Register the `KubeProxyConfigurationPreview` feature flag](#register-the-kubeproxyconfigurationpreview-feature-flag).

### Install the `aks-preview` Azure CLI extension

1. Install the `aks-preview` extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

### Register the `KubeProxyConfigurationPreview` feature flag

1. Register the `KubeProxyConfigurationPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "KubeProxyConfigurationPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "KubeProxyConfigurationPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## `kube-proxy` configuration options

You can view the full `kube-proxy` configuration structure in the [AKS Cluster Schema][aks-schema-kubeproxyconfig].

- **`enabled`**: Determines deployment of the `kube-proxy` DaemonSet. Defaults to `true`.
- **`mode`**: You can set to either `IPTABLES` or `IPVS`. Defaults to `IPTABLES`.
- **`ipvsConfig`**: If `mode` is `IPVS`, this object contains IPVS-specific configuration properties.
  - **`scheduler`**: Determines which connection scheduler to use. Supported values include:
    - **`LeastConnection`**: Sends connections to the backend pod with the fewest connections.
    - **`RoundRobin`**: Evenly distributes connections between backend pods.
  - **`tcpFinTimeoutSeconds`**: Sets the timeout length value after a TCP session receives a FIN.
  - **`tcpTimeoutSeconds`**: Sets the timeout length value for idle TCP sessions.
  - **`udpTimeoutSeconds`**: Sets the timeout length value for idle UDP sessions.

> [!NOTE]
> IPVS load balancing operates in each node independently and is only aware of connections flowing through the local node. This means that while `LeastConnection` results in a more even load under a higher number of connections, when a low amount of connections (# connects < 2 * node count) occur, traffic may be relatively unbalanced

## Use `kube-proxy` in a new or existing AKS cluster

`kube-proxy` configuration is a cluster-wide setting. You don't need to update your services.

> [!WARNING]
> Changing the kube-proxy configuration may cause a slight interruption in cluster service traffic flow.

1. Create a configuration file with the desired `kube-proxy` configuration. For example, the following configuration enables IPVS with the `LeastConnection` scheduler and sets the TCP timeout to 900 seconds.

    ```json
    {
      "enabled": true,
      "mode": "IPVS",
      "ipvsConfig": {
        "scheduler": "LeastConnection",
        "TCPTimeoutSeconds": 900,
        "TCPFINTimeoutSeconds": 120,
        "UDPTimeoutSeconds": 300
      }
    }
    ```

2. Create a new cluster or update an existing cluster with the configuration file using the [`az aks create`][az-aks-create] or [`az aks update`][az-aks-update] command with the `--kube-proxy-config` parameter set to the configuration file.

    ```azurecli-interactive
    # Create a new cluster
    az aks create -g <resourceGroup> -n <clusterName> --kube-proxy-config kube-proxy.json
    
    # Update an existing cluster
    az aks update -g <resourceGroup> -n <clusterName> --kube-proxy-config kube-proxy.json
    ```

## Next steps

This article covered how to configure `kube-proxy` in Azure Kubernetes Service (AKS). To learn more about load balancing in AKS, see the following articles:

- [Use a standard public load balancer in AKS](load-balancer-standard.md)
- [Use an internal load balancer in AKS](internal-lb.md)

<!-- LINKS - External -->
[aks-schema-kubeproxyconfig]: /azure/templates/microsoft.containerservice/managedclusters?pivots=deployment-language-bicep#containerservicenetworkprofilekubeproxyconfig

<!-- LINKS - Internal -->
[aks-byo-cni]: use-byo-cni.md
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
