---
title: Configure kube-proxy (iptables/IPVS) (preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to configure kube-proxy to utilize different load balancing configurations with Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 10/25/2022
ms.author: pahealy
author: phealy

#Customer intent: As a cluster operator, I want to utilize a different kube-proxy configuration.
---

# Configure `kube-proxy` in Azure Kubernetes Service (AKS) (preview)

`kube-proxy` is a component of Kubernetes that handles routing traffic for services within the cluster. There are two backends available for Layer 3/4 load balancing in upstream `kube-proxy` - iptables and IPVS. 

- iptables is the default backend utilized in the majority of Kubernetes clusters. It is simple and well supported, but is not as efficient or intelligent as IPVS.
- IPVS utilizes the Linux Virtual Server, a layer 3/4 load balancer built into the Linux kernel. IPVS provides a number of advantages over the default iptables configuration, including state awareness, connection tracking, and more intelligent load balancing.

The AKS managed `kube-proxy` DaemonSet can also be disabled entirely if that is desired to support [bring-your-own CNI][aks-byo-cni].

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

* Azure CLI with aks-preview extension 0.5.105 or later.
* If using ARM or the REST API, the AKS API version must be 2022-08-02-preview or later.

### Install the aks-preview CLI extension

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register the `KubeProxyConfigurationPreview` preview feature

To create an AKS cluster with custom `kube-proxy` configuration, you must enable the `KubeProxyConfigurationPreview` feature flag on your subscription.

Register the `KubeProxyConfigurationPreview` feature flag by using the `az feature register` command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "KubeProxyConfigurationPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the `az feature list` command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/KubeProxyConfigurationPreview')].{Name:name,State:properties.state}"
```

When the feature has been registered, refresh the registration of the *Microsoft.ContainerService* resource provider by using the `az provider register` command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Configurable options

The full `kube-proxy` configuration structure can be found in the [AKS Cluster Schema][aks-schema-kubeproxyconfig].

- `enabled` - whether or not to deploy the `kube-proxy` DaemonSet. Defaults to true.
- `mode` - can be set to `IPTABLES` or `IPVS`. Defaults to `IPTABLES`.
- `ipvsConfig` - if `mode` is `IPVS`, this object contains IPVS-specific configuration properties.
  - `scheduler` - which connection scheduler to utilize. Supported values:
    - `LeastConnections` - sends connections to the backend pod with the fewest connections
    - `RoundRobin` - distributes connections evenly between backend pods
  - `tcpFinTimeoutSeconds` - the value used for timeout after a FIN has been received in a TCP session
  - `tcpTimeoutSeconds` - the value used for timeout length for idle TCP sessions
  - `udpTimeoutSeconds` - the value used for timeout length for idle UDP sessions

> [!NOTE]
> IPVS load balancing operates in each node independently and is still only aware of connections flowing through the local node. This means that while `LeastConnections` results in more even load under higher number of connections, when low numbers of connections (# connects < 2 * node count) occur traffic may still be relatively unbalanced.

## Utilize `kube-proxy` configuration in a new or existing AKS cluster using Azure CLI

`kube-proxy` configuration is a cluster-wide setting. No action is needed to update your services.

>[!WARNING]
> Changing the kube-proxy configuration may cause a slight interruption in cluster service traffic flow.

To begin, create a JSON configuration file with the desired settings:

### Create a configuration file

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

### Deploy a new cluster

Deploy your cluster using `az aks create` and pass in the configuration file:

```bash
az aks create -g <resourceGroup> -n <clusterName> --kube-proxy-config kube-proxy.json
```

### Update an existing cluster

Configure your cluster using `az aks update` and pass in the configuration file:

```bash
az aks update -g <resourceGroup> -n <clusterName> --kube-proxy-config kube-proxy.json
```

## Next steps

Learn more about utilizing the Standard Load Balancer for inbound traffic at the [AKS Standard Load Balancer documentation](load-balancer-standard.md).

Learn more about using Internal Load Balancer for Inbound traffic at the [AKS Internal Load Balancer documentation](internal-lb.md).

Learn more about Kubernetes services at the [Kubernetes services documentation][kubernetes-services].

<!-- LINKS - External -->
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/
[aks-schema-kubeproxyconfig]: /azure/templates/microsoft.containerservice/managedclusters?pivots=deployment-language-bicep#containerservicenetworkprofilekubeproxyconfig

<!-- LINKS - Internal -->
[aks-byo-cni]: use-byo-cni.md