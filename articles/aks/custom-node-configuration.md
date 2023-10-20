---
title: Customize the node configuration for Azure Kubernetes Service (AKS) node pools
description: Learn how to customize the configuration on Azure Kubernetes Service (AKS) cluster nodes and node pools.
ms.custom: event-tier1-build-2022, devx-track-azurecli
ms.topic: article
ms.date: 04/24/2023
ms.author: jpalma
author: palma21
---

# Customize node configuration for Azure Kubernetes Service (AKS) node pools

Customizing your node configuration allows you to adjust operating system (OS) settings or kubelet parameters to match the needs of your workloads. When you create an AKS cluster or add a node pool to your cluster, you can customize a subset of commonly used OS and kubelet settings. To configure settings beyond this subset, you can [use a daemon set to customize your needed configurations without losing AKS support for your nodes](support-policies.md#shared-responsibility).

## Create an AKS cluster with a customized node configuration

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Prerequisites for Windows kubelet custom configuration (preview)

Before you begin, make sure you have an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You also need to register the feature flag using the following steps:


1. Install the aks-preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command.

    ```azurecli
    az extension update --name aks-preview
    ```

3. Register the `WindowsCustomKubeletConfigPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "WindowsCustomKubeletConfigPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

4. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "WindowsCustomKubeletConfigPreview"
    ```

5. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

### Create config files

#### Kubelet configuration

### [Linux node pools](#tab/linux-node-pools)

Create a `linuxkubeletconfig.json` file with the following contents:

```json
{
 "cpuManagerPolicy": "static",
 "cpuCfsQuota": true,
 "cpuCfsQuotaPeriod": "200ms",
 "imageGcHighThreshold": 90,
 "imageGcLowThreshold": 70,
 "topologyManagerPolicy": "best-effort",
 "allowedUnsafeSysctls": [
  "kernel.msg*",
  "net.*"
],
 "failSwapOn": false
}
```

### [Windows node pools](#tab/windows-node-pools)

> [!NOTE]
> Windows kubelet custom configuration only supports the parameters `imageGcHighThreshold`, `imageGcLowThreshold`, `containerLogMaxSizeMB`, and `containerLogMaxFiles`.

Create a `windowskubeletconfig.json` file with the following contents:

```json
{
 "imageGcHighThreshold": 90,
 "imageGcLowThreshold": 70,
 "containerLogMaxSizeMB": 20,
 "containerLogMaxFiles": 6
}
```

---

#### OS configuration

### [Linux node pools](#tab/linux-node-pools)

Create a `linuxosconfig.json` file with the following contents:

```json
{
 "transparentHugePageEnabled": "madvise",
 "transparentHugePageDefrag": "defer+madvise",
 "swapFileSizeMB": 1500,
 "sysctls": {
  "netCoreSomaxconn": 163849,
  "netIpv4TcpTwReuse": true,
  "netIpv4IpLocalPortRange": "32000 60000"
 }
}
```

### [Windows node pools](#tab/windows-node-pools)

Not currently supported.

---

### Create a new cluster using custom configuration files

When creating a new cluster, you can use the customized configuration files created in the previous steps to specify the kubelet configuration, OS configuration, or both.

> [!NOTE]
> If you specify a configuration when creating a cluster, only the nodes in the initial node pool will have that configuration applied. Any settings not configured in the JSON file will retain the default value. `CustomLinuxOsConfig` isn't supported for OS type: Windows.

Create a new cluster using custom configuration files using the [`az aks create`][az-aks-create] command and specifying your configuration files. The following example command creates a new cluster with the custom `./linuxkubeletconfig.json` and `./linuxosconfig.json` files:

```azurecli
az aks create --name myAKSCluster --resource-group myResourceGroup --kubelet-config ./linuxkubeletconfig.json --linux-os-config ./linuxosconfig.json
```

### Add a node pool using custom configuration files

When adding a node pool to a cluster, you can use the customized configuration file created in the previous step to specify the kubelet configuration. `CustomKubeletConfig` is supported for Linux and Windows node pools.

> [!NOTE]
> When you add a Linux node pool to an existing cluster, you can specify the kubelet configuration, OS configuration, or both. When you add a Windows node pool to an existing cluster, you can only specify the kubelet configuration. If you specify a configuration when adding a node pool, only the nodes in the new node pool will have that configuration applied. Any settings not configured in the JSON file will retain the default value.

### [Linux node pools](#tab/linux-node-pools)

```azurecli
az aks nodepool add --name mynodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup --kubelet-config ./linuxkubeletconfig.json
```

### [Windows node pools](#tab/windows-node-pools)

```azurecli
az aks nodepool add --name mynodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup --os-type Windows --kubelet-config ./windowskubeletconfig.json
```

---

### Other configurations

The following settings can be used to modify other operating system settings:

#### Message of the Day

Pass the ```--message-of-the-day``` flag with the location of the file to replace the Message of the Day on Linux nodes at cluster creation or node pool creation.

```azurecli
az aks create --cluster-name myAKSCluster --resource-group myResourceGroup --message-of-the-day ./newMOTD.txt
```

##### Nodepool creation

```azurecli
az aks nodepool add --name mynodepool1 --cluster-name myAKSCluster --resource-group myResourceGroup --message-of-the-day ./newMOTD.txt
```

### Confirm settings have been applied

After you apply custom node configuration, you can confirm the settings have been applied to the nodes by [connecting to the host][node-access] and verifying `sysctl` or configuration changes have been made on the filesystem.

## Custom node configuration supported parameters

### Kubelet custom configuration

Kubelet custom configuration is supported for Linux and Windows node pools. Supported parameters differ and are documented below.

#### Linux Kubelet custom configuration

| Parameter | Allowed values/interval | Default | Description |
| --------- | ----------------------- | ------- | ----------- |
| `cpuManagerPolicy` | none, static | none | The static policy allows containers in [Guaranteed pods](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/) with integer CPU requests access to exclusive CPUs on the node. |
| `cpuCfsQuota` | true, false | true |  Enable/Disable CPU CFS quota enforcement for containers that specify CPU limits. |
| `cpuCfsQuotaPeriod` | Interval in milliseconds (ms) | `100ms` | Sets CPU CFS quota period value. | 
| `imageGcHighThreshold` | 0-100 | 85 | The percent of disk usage after which image garbage collection is always run. Minimum disk usage that **will** trigger garbage collection. To disable image garbage collection, set to 100. |
| `imageGcLowThreshold` | 0-100, no higher than `imageGcHighThreshold` | 80 | The percent of disk usage before which image garbage collection is never run. Minimum disk usage that **can** trigger garbage collection. |
| `topologyManagerPolicy` | none, best-effort, restricted, single-numa-node | none | Optimize NUMA node alignment, see more [here](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/). |
| `allowedUnsafeSysctls` | `kernel.shm*`, `kernel.msg*`, `kernel.sem`, `fs.mqueue.*`, `net.*` | None | Allowed list of unsafe sysctls or unsafe sysctl patterns. |
| `containerLogMaxSizeMB` | Size in megabytes (MB) | 50 | The maximum size (for example, 10 MB) of a container log file before it's rotated. |
| `containerLogMaxFiles` | ≥ 2 | 5 | The maximum number of container log files that can be present for a container. |
| `podMaxPids` | -1 to kernel PID limit | -1 (∞)| The maximum amount of process IDs that can be running in a Pod |

#### Windows Kubelet custom configuration (preview)

| Parameter | Allowed values/interval | Default | Description |
| --------- | ----------------------- | ------- | ----------- |
| `imageGcHighThreshold` | 0-100 | 85 | The percent of disk usage after which image garbage collection is always run. Minimum disk usage that **will** trigger garbage collection. To disable image garbage collection, set to 100. |
| `imageGcLowThreshold` | 0-100, no higher than `imageGcHighThreshold` | 80 | The percent of disk usage before which image garbage collection is never run. Minimum disk usage that **can** trigger garbage collection. |
| `containerLogMaxSizeMB` | Size in megabytes (MB) | 10 | The maximum size (for example, 10 MB) of a container log file before it's rotated. |
| `containerLogMaxFiles` | ≥ 2 | 5 | The maximum number of container log files that can be present for a container. |

## Linux custom OS configuration settings

> [!IMPORTANT]
> To simplify search and readability, the OS settings are displayed in this article by their name, but they should be added to the configuration JSON file or AKS API using [camelCase capitalization convention](/dotnet/standard/design-guidelines/capitalization-conventions).
>
> For example, if you modify the 'vm.max_map_count setting', you should reformat to 'vmMaxMapCount' in the configuration JSON file.
> 

### File handle limits

When serving a lot of traffic, the traffic commonly comes from a large number of local files. You can adjust the below kernel settings and built-in limits to allow you to handle more, at the cost of some system memory.

| Setting | Allowed values/interval | Default | Description |
| ------- | ----------------------- | ------- | ----------- |
| `fs.file-max` | 8192 - 12000500 | 709620 | Maximum number of file-handles that the Linux kernel will allocate, by increasing this value you can increase the maximum number of open files permitted. |
| `fs.inotify.max_user_watches` | 781250 - 2097152 | 1048576 | Maximum number of file watches allowed by the system. Each *watch* is roughly 90 bytes on a 32-bit kernel, and roughly 160 bytes on a 64-bit kernel. |
| `fs.aio-max-nr` | 65536 - 6553500 | 65536 | The aio-nr shows the current system-wide number of asynchronous io requests. aio-max-nr allows you to change the maximum value aio-nr can grow to. |
| `fs.nr_open` | 8192 - 20000500 | 1048576 | The maximum number of file-handles a process can allocate. |

### Socket and network tuning

For agent nodes, which are expected to handle very large numbers of concurrent sessions, you can use the subset of TCP and network options below that you can tweak per node pool.

| Setting | Allowed values/interval | Default | Description |
| ------- | ----------------------- | ------- | ----------- |
| `net.core.somaxconn` | 4096 - 3240000 | 16384 | Maximum number of connection requests that can be queued for any given listening socket. An upper limit for the value of the backlog parameter passed to the [listen(2)](http://man7.org/linux/man-pages/man2/listen.2.html) function. If the backlog argument is greater than the `somaxconn`, then it's silently truncated to this limit.
| `net.core.netdev_max_backlog` | 1000 - 3240000 | 1000 | Maximum number of packets, queued on the INPUT side, when the interface receives packets faster than kernel can process them. |
| `net.core.rmem_max` | 212992 - 134217728 | 212992 | The maximum receive socket buffer size in bytes. |
| `net.core.wmem_max` | 212992 - 134217728 | 212992 | The maximum send socket buffer size in bytes. | 
| `net.core.optmem_max` | 20480 - 4194304 | 20480 | Maximum ancillary buffer size (option memory buffer) allowed per socket. Socket option memory is used in a few cases to store extra structures relating to usage of the socket. | 
| `net.ipv4.tcp_max_syn_backlog` | 128 - 3240000 | 16384 | The maximum number of queued connection requests that have still not received an acknowledgment from the connecting client. If this number is exceeded, the kernel will begin dropping requests. |
| `net.ipv4.tcp_max_tw_buckets` | 8000 - 1440000 | 32768 | Maximal number of `timewait` sockets held by system simultaneously. If this number is exceeded, time-wait socket is immediately destroyed and warning is printed. |
| `net.ipv4.tcp_fin_timeout` | 5 - 120 | 60 | The length of time an orphaned (no longer referenced by any application) connection will remain in the FIN_WAIT_2 state before it's aborted at the local end. |
| `net.ipv4.tcp_keepalive_time` | 30 - 432000 | 7200 | How often TCP sends out `keepalive` messages when `keepalive` is enabled. |
| `net.ipv4.tcp_keepalive_probes` | 1 - 15 | 9 | How many `keepalive` probes TCP sends out, until it decides that the connection is broken. |
| `net.ipv4.tcp_keepalive_intvl` | 10 - 75 | 75 | How frequently the probes are sent out. Multiplied by `tcp_keepalive_probes` it makes up the time to kill a connection that isn't responding, after probes started. |
| `net.ipv4.tcp_tw_reuse` | 0 or 1 | 0 | Allow to reuse `TIME-WAIT` sockets for new connections when it's safe from protocol viewpoint. | 
| `net.ipv4.ip_local_port_range` | First: 1024 - 60999 and Last: 32768 - 65000] | First: 32768 and Last: 60999 | The local port range that is used by TCP and UDP traffic to choose the local port. Comprised of two numbers: The first number is the first local port allowed for TCP and UDP traffic on the agent node, the second is the last local port number. | 
| `net.ipv4.neigh.default.gc_thresh1`| 	128 - 80000 | 4096 | Minimum number of entries that may be in the ARP cache. Garbage collection won't be triggered if the number of entries is below this setting. |
| `net.ipv4.neigh.default.gc_thresh2`| 	512 - 90000 | 8192 | Soft maximum number of entries that may be in the ARP cache. This setting is arguably the most important, as ARP garbage collection will be triggered about 5 seconds after reaching this soft maximum. |
| `net.ipv4.neigh.default.gc_thresh3`| 	1024 - 100000 | 16384 | Hard maximum number of entries in the ARP cache. |
| `net.netfilter.nf_conntrack_max` | 131072 - 1048576 | 131072 | `nf_conntrack` is a module that tracks connection entries for NAT within Linux. The `nf_conntrack` module uses a hash table to record the *established connection* record of the TCP protocol. `nf_conntrack_max` is the maximum number of nodes in the hash table, that is, the maximum number of connections supported by the `nf_conntrack` module or the size of connection tracking table. |
| `net.netfilter.nf_conntrack_buckets` | 65536 - 147456 | 65536 | `nf_conntrack` is a module that tracks connection entries for NAT within Linux. The `nf_conntrack` module uses a hash table to record the *established connection* record of the TCP protocol. `nf_conntrack_buckets` is the size of hash table. |

### Worker limits

Like file descriptor limits, the number of workers or threads that a process can create are limited by both a kernel setting and user limits. The user limit on AKS is unlimited.

| Setting | Allowed values/interval | Default | Description |
| ------- | ----------------------- | ------- | ----------- |
| `kernel.threads-max` | 20 - 513785 | 55601 | Processes can spin up worker threads. The maximum number of all threads that can be created is set with the kernel setting `kernel.threads-max`. |

### Virtual memory

The settings below can be used to tune the operation of the virtual memory (VM) subsystem of the Linux kernel and the `writeout` of dirty data to disk.

| Setting | Allowed values/interval | Default | Description |
| ------- | ----------------------- | ------- | ----------- |
| `vm.max_map_count` | 	65530 - 262144 | 65530 | This file contains the maximum number of memory map areas a process may have. Memory map areas are used as a side-effect of calling `malloc`, directly by `mmap`, `mprotect`, and `madvise`, and also when loading shared libraries. |
| `vm.vfs_cache_pressure` | 1 - 100 | 100 | This percentage value controls the tendency of the kernel to reclaim the memory, which is used for caching of directory and inode objects. |
| `vm.swappiness` | 0 - 100 | 60 | This control is used to define how aggressive the kernel will swap memory pages. Higher values will increase aggressiveness, lower values decrease the amount of swap. A value of 0 instructs the kernel not to initiate swap until the amount of free and file-backed pages is less than the high water mark in a zone. |
| `swapFileSizeMB` | 1 MB - Size of the [temporary disk](../virtual-machines/managed-disks-overview.md#temporary-disk) (/dev/sdb) | None | SwapFileSizeMB specifies size in MB of a swap file will be created on the agent nodes from this node pool. |
| `transparentHugePageEnabled` | `always`, `madvise`, `never` | `always` | [Transparent Hugepages](https://www.kernel.org/doc/html/latest/admin-guide/mm/transhuge.html#admin-guide-transhuge) is a Linux kernel feature intended to improve performance by making more efficient use of your processor’s memory-mapping hardware. When enabled the kernel attempts to allocate `hugepages` whenever possible and any Linux process will receive 2-MB pages if the `mmap` region is 2 MB naturally aligned. In certain cases when `hugepages` are enabled system wide, applications may end up allocating more memory resources. An application may `mmap` a large region but only touch 1 byte of it, in that case a 2-MB page might be allocated instead of a 4k page for no good reason. This scenario is why it's possible to disable `hugepages` system-wide or to only have them inside `MADV_HUGEPAGE madvise` regions. |
| `transparentHugePageDefrag` | `always`, `defer`, `defer+madvise`, `madvise`, `never` | `madvise` | This value controls whether the kernel should make aggressive use of memory compaction to make more `hugepages` available. |



## Next steps

- Learn [how to configure your AKS cluster](cluster-configuration.md).
- Learn how [upgrade the node images](node-image-upgrade.md) in your cluster.
- See [Upgrade an Azure Kubernetes Service (AKS) cluster](upgrade-cluster.md) to learn how to upgrade your cluster to the latest version of Kubernetes.
- See the list of [Frequently asked questions about AKS](faq.md) to find answers to some common AKS questions.

<!-- LINKS - internal -->
[node-access]: node-access.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az-provider-register
