---
title: Cluster configuration in Azure Kubernetes Services (AKS)
description: Learn how to configure a cluster in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 02/09/2020
ms.author: jpalma
author: palma21
---

# Configure an AKS cluster

As part of creating an AKS cluster, you may need to customize your cluster configuration to suit your needs. This article introduces a few options for customizing your AKS cluster.

## OS configuration

AKS now supports Ubuntu 18.04 as the default node operating system (OS) in general availability (GA) for clusters in kubernetes versions higher than 1.18 For versions below 1.18, AKS Ubuntu 16.04 is still the default base image. From kubernetes v1.18 and higher, the default base is AKS Ubuntu 18.04.

> [!IMPORTANT]
> Node pools created on Kubernetes v1.18 or greater default to `AKS Ubuntu 18.04` node image. Node pools on a supported Kubernetes version less than 1.18 receive `AKS Ubuntu 16.04` as the node image, but will be updated to `AKS Ubuntu 18.04` once the node pool Kubernetes version is updated to v1.18 or greater.
> 
> It is highly recommended to test your workloads on AKS Ubuntu 18.04 node pools prior to using clusters on 1.18 or greater.


### Use AKS Ubuntu 18.04 (GA) on new clusters

Clusters created on Kubernetes v1.18 or greater default to `AKS Ubuntu 18.04` node image. Node pools on a supported Kubernetes version less than 1.18 will still receive `AKS Ubuntu 16.04` as the node image, but will be updated to `AKS Ubuntu 18.04` once the cluster or node pool Kubernetes version is updated to v1.18 or greater.

It is highly recommended to test your workloads on AKS Ubuntu 18.04 node pools prior to using clusters on 1.18 or greater.

To create a cluster using `AKS Ubuntu 18.04` node image, simply create a cluster running kubernetes v1.18 or greater as shown below

```azurecli
az aks create --name myAKSCluster --resource-group myResourceGroup --kubernetes-version 1.18.14
```

### Use AKS Ubuntu 18.04 (GA) on existing clusters

Clusters created on Kubernetes v1.18 or greater default to `AKS Ubuntu 18.04` node image. Node pools on a supported Kubernetes version less than 1.18 will still receive `AKS Ubuntu 16.04` as the node image, but will be updated to `AKS Ubuntu 18.04` once the cluster or node pool Kubernetes version is updated to v1.18 or greater.

It is highly recommended to test your workloads on AKS Ubuntu 18.04 node pools prior to using clusters on 1.18 or greater.

If your clusters or node pools are ready for `AKS Ubuntu 18.04` node image, you can simply upgrade them to a v1.18 or higher as below.

```azurecli
az aks upgrade --name myAKSCluster --resource-group myResourceGroup --kubernetes-version 1.18.14
```

If you just want to upgrade just one node pool:

```azurecli
az aks nodepool upgrade -name ubuntu1804 --cluster-name myAKSCluster --resource-group myResourceGroup --kubernetes-version 1.18.14
```

### Test AKS Ubuntu 18.04 (GA) on existing clusters

Node pools created on Kubernetes v1.18 or greater default to `AKS Ubuntu 18.04` node image. Node pools on a supported Kubernetes version less than 1.18 will still receive `AKS Ubuntu 16.04` as the node image, but will be updated to `AKS Ubuntu 18.04` once the node pool Kubernetes version is updated to v1.18 or greater.

It is highly recommended to test your workloads on AKS Ubuntu 18.04 node pools prior to upgrading your production node pools.

To create a node pool using `AKS Ubuntu 18.04` node image, simply create a node pool running kubernetes v1.18 or greater. Your cluster control plane needs to be at least on v1.18 or greater as well but your other node pools can remain on an older kubernetes version.
Below we are first upgrading the control plane and then creating a new node pool with v1.18 that will receive the new node image OS version.

```azurecli
az aks upgrade --name myAKSCluster --resource-group myResourceGroup --kubernetes-version 1.18.14 --control-plane-only

az aks nodepool add --name ubuntu1804 --cluster-name myAKSCluster --resource-group myResourceGroup --kubernetes-version 1.18.14
```

## Container runtime configuration

A container runtime is software that executes containers and manages container images on a node. The runtime helps abstract away sys-calls or operating system (OS) specific functionality to run containers on Linux or Windows. AKS clusters using Kubernetes version 1.19 node pools and greater use `containerd` as its container runtime. AKS clusters using Kubernetes prior to v1.19 for node pools use [Moby](https://mobyproject.org/) (upstream docker) as its container runtime.

![Docker CRI 1](media/cluster-configuration/docker-cri.png)

[`Containerd`](https://containerd.io/) is an [OCI](https://opencontainers.org/) (Open Container Initiative) compliant core container runtime that provides the minimum set of required functionality to execute containers and manage images on a node. It was [donated](https://www.cncf.io/announcement/2017/03/29/containerd-joins-cloud-native-computing-foundation/) to the Cloud Native Compute Foundation (CNCF) in March of 2017. The current Moby version that AKS uses already leverages and is built on top of `containerd`, as shown above.

With a `containerd`-based node and node pools, instead of talking to the `dockershim`, the kubelet will talk directly to `containerd` via the CRI (container runtime interface) plugin, removing extra hops on the flow when compared to the Docker CRI implementation. As such, you'll see better pod startup latency and less resource (CPU and memory) usage.

By using `containerd` for AKS nodes, pod startup latency improves and node resource consumption by the container runtime decreases. These improvements are enabled by this new architecture where kubelet talks directly to `containerd` through the CRI plugin while in Moby/docker architecture kubelet would talk to the `dockershim` and docker engine before reaching `containerd`, thus having extra hops on the flow.

![Docker CRI 2](media/cluster-configuration/containerd-cri.png)

`Containerd` works on every GA version of Kubernetes in AKS, and in every upstream kubernetes version above v1.19, and supports all Kubernetes and AKS features.

> [!IMPORTANT]
> Clusters with node pools created on Kubernetes v1.19 or greater default to `containerd` for its container runtime. Clusters with node pools on a supported Kubernetes version less than 1.19 receive `Moby` for its container runtime, but will be updated to `ContainerD` once the node pool Kubernetes version is updated to v1.19 or greater. You can still use `Moby` node pools and clusters on older supported versions until those fall off support.
> 
> It is highly recommended to test your workloads on AKS node pools with `containerD` prior to using clusters on 1.19 or greater.

### `Containerd` limitations/differences

* To use `containerd` as the container runtime you must use AKS Ubuntu 18.04 as your base OS image.
* While the docker toolset is still present on the nodes, Kubernetes uses `containerd` as the container runtime. Therefore, since Moby/Docker doesn't manage the Kubernetes-created containers on the nodes, you can't view or interact with your containers using Docker commands (like `docker ps`) or the Docker API.
* For `containerd`, we recommend using [`crictl`](https://kubernetes.io/docs/tasks/debug-application-cluster/crictl) as a replacement CLI instead of the Docker CLI for **troubleshooting** pods, containers, and container images on Kubernetes nodes (for example, `crictl ps`). 
   * It doesn't provide the complete functionality of the docker CLI. It's intended for troubleshooting only.
   * `crictl` offers a more kubernetes-friendly view of containers, with concepts like pods, etc. being present.
* `Containerd` sets up logging using the standardized `cri` logging format (which is different from what you currently get from docker’s json driver). Your logging solution needs to support the `cri` logging format (like [Azure Monitor for Containers](../azure-monitor/containers/container-insights-enable-new-cluster.md))
* You can no longer access the docker engine, `/var/run/docker.sock`, or use Docker-in-Docker (DinD).
  * If you currently extract application logs or monitoring data from Docker Engine, please use something like [Azure Monitor for Containers](../azure-monitor/containers/container-insights-enable-new-cluster.md) instead. Additionally AKS doesn't  support running any out of band commands on the agent nodes that could cause instability.
  * Even when using Moby/docker, building images and directly leveraging the docker engine via the methods above is strongly discouraged. Kubernetes isn't fully aware of those consumed resources, and those approaches present numerous issues detailed [here](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/) and [here](https://securityboulevard.com/2018/05/escaping-the-whale-things-you-probably-shouldnt-do-with-docker-part-1/), for example.
* Building images - You can continue to use your current docker build workflow as normal, unless you are building images inside your AKS cluster. In this case, please consider switching to the recommended approach for building images using [ACR Tasks](../container-registry/container-registry-quickstart-task-cli.md), or a more secure in-cluster option like [docker buildx](https://github.com/docker/buildx).

## Generation 2 virtual machines

Azure supports [Generation 2 (Gen2) virtual machines (VMs)](../virtual-machines/generation-2.md). Generation 2 VMs support key features that aren't supported in generation 1 VMs (Gen1). These features include increased memory, Intel Software Guard Extensions (Intel SGX), and virtualized persistent memory (vPMEM).

Generation 2 VMs use the new UEFI-based boot architecture rather than the BIOS-based architecture used by generation 1 VMs.
Only specific SKUs and sizes support Gen2 VMs. Check the [list of supported sizes](../virtual-machines/generation-2.md#generation-2-vm-sizes), to see if your SKU supports or requires Gen2.

Additionally not all VM images support Gen2, on AKS Gen2 VMs will use the new [AKS Ubuntu 18.04 image](#os-configuration). This image supports all Gen2 SKUs and sizes.

## Ephemeral OS

By default, Azure automatically replicates the operating system disk for an virtual machine to Azure storage to avoid data loss should the VM need to be relocated to another host. However, since containers aren't designed to have local state persisted, this behavior offers limited value while providing some drawbacks, including slower node provisioning and higher read/write latency.

By contrast, ephemeral OS disks are stored only on the host machine, just like a temporary disk. This provides lower read/write latency, along with faster node scaling and cluster upgrades.

Like the temporary disk, an ephemeral OS disk is included in the price of the virtual machine, so you incur no additional storage costs.

> [!IMPORTANT]
>When a user does not explicitly request managed disks for the OS, AKS will default to ephemeral OS if possible for a given nodepool configuration.

When using ephemeral OS, the OS disk must fit in the VM cache. The sizes for VM cache are available in the [Azure documentation](../virtual-machines/dv3-dsv3-series.md) in parentheses next to IO throughput ("cache size in GiB").

Using the AKS default VM size Standard_DS2_v2 with the default OS disk size of 100GB as an example, this VM size supports ephemeral OS but only has 86GB of cache size. This configuration would default to managed disks if the user does not specify explicitly. If a user explicitly requested ephemeral OS, they would receive a validation error.

If a user requests the same Standard_DS2_v2 with a 60GB OS disk, this configuration would default to ephemeral OS: the requested size of 60GB is smaller than the maximum cache size of 86GB.

Using Standard_D8s_v3 with 100GB OS disk, this VM size supports ephemeral OS and has 200GB of cache space. If a user does not specify the OS disk type, the nodepool would receive ephemeral OS by default. 

Ephemeral OS requires at least version 2.15.0 of the Azure CLI.

### Use Ephemeral OS on new clusters

Configure the cluster to use Ephemeral OS disks when the cluster is created. Use the `--node-osdisk-type` flag to set Ephemeral OS as the OS disk type for the new cluster.

```azurecli
az aks create --name myAKSCluster --resource-group myResourceGroup -s Standard_DS3_v2 --node-osdisk-type Ephemeral
```

If you want to create a regular cluster using network-attached OS disks, you can do so by specifying `--node-osdisk-type=Managed`. You can also choose to add more ephemeral OS node pools as per below.

### Use Ephemeral OS on existing clusters
Configure a new node pool to use Ephemeral OS disks. Use the `--node-osdisk-type` flag to set as the OS disk type as the OS disk type for that node pool.

```azurecli
az aks nodepool add --name ephemeral --cluster-name myAKSCluster --resource-group myResourceGroup -s Standard_DS3_v2 --node-osdisk-type Ephemeral
```

> [!IMPORTANT]
> With ephemeral OS you can deploy VM and instance images up to the size of the VM cache. In the AKS case, the default node OS disk configuration uses 128GB, which means that you need a VM size that has a cache larger than 128GB. The default Standard_DS2_v2 has a cache size of 86GB, which is not large enough. The Standard_DS3_v2 has a cache size of 172GB, which is large enough. You can also reduce the default size of the OS disk by using `--node-osdisk-size`. The minimum size for AKS images is 30GB. 

If you want to create node pools with network-attached OS disks, you can do so by specifying `--node-osdisk-type Managed`.

## Custom resource group name

When you deploy an Azure Kubernetes Service cluster in Azure, a second resource group gets created for the worker nodes. By default, AKS will name the node resource group `MC_resourcegroupname_clustername_location`, but you can also provide your own name.

To specify your own resource group name, install the aks-preview Azure CLI extension version 0.3.2 or later. Using the Azure CLI, use the `--node-resource-group` parameter of the `az aks create` command to specify a custom name for the resource group. If you use an Azure Resource Manager template to deploy an AKS cluster, you can define the resource group name by using the `nodeResourceGroup` property.

```azurecli
az aks create --name myAKSCluster --resource-group myResourceGroup --node-resource-group myNodeResourceGroup
```

The secondary resource group is automatically created by the Azure resource provider in your own subscription. You can only specify the custom resource group name when the cluster is created. 

As you work with the node resource group, keep in mind that you can't:

- Specify an existing resource group for the node resource group.
- Specify a different subscription for the node resource group.
- Change the node resource group name after the cluster has been created.
- Specify names for the managed resources within the node resource group.
- Modify or delete Azure-created tags of managed resources within the node resource group.

## Next steps

- Learn how [upgrade the node images](node-image-upgrade.md) in your cluster.
- See [Upgrade an Azure Kubernetes Service (AKS) cluster](upgrade-cluster.md) to learn how to upgrade your cluster to the latest version of Kubernetes.
- Read more about [`containerd` and Kubernetes](https://kubernetes.io/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/)
- See the list of [Frequently asked questions about AKS](faq.md) to find answers to some common AKS questions.
- Read more about [Ephemeral OS disks](../virtual-machines/ephemeral-os-disks.md).


<!-- LINKS - internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
