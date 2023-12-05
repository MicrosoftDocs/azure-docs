---
title: Windows Server node pools FAQ
titleSuffix: Azure Kubernetes Service
description: See the frequently asked questions when you run Windows Server node pools and application workloads in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: build-2023, devx-track-azurecli
ms.date: 04/13/2023
#Customer intent: As a cluster operator, I want to see frequently asked questions when running Windows node pools and application workloads.
---

# Frequently asked questions for Windows Server node pools in AKS

In Azure Kubernetes Service (AKS), you can create a node pool that runs Windows Server as the guest OS on the nodes. These nodes can run native Windows container applications, such as those built on the .NET Framework. There are differences in how the Linux and Windows OS provides container support. Some common Linux Kubernetes and pod-related features are not currently available for Windows node pools.

This article outlines some of the frequently asked questions and OS concepts for Windows Server nodes in AKS.

## What kind of disks are supported for Windows?

Azure Disks and Azure Files are the supported volume types, and are accessed as NTFS volumes in the Windows Server container.

## Do Linux and Windows support generation 2 virtual machines (VMs)?

Generation 2 VMs are supported on Linux and Windows for WS2022 only. For more information, see [Support for generation 2 VMs on Azure](../virtual-machines/generation-2.md).

## How do I patch my Windows nodes?

To get the latest patches for Windows nodes, you can either [upgrade the node pool][nodepool-upgrade] or [upgrade the node image][upgrade-node-image]. Windows Updates are not enabled on nodes in AKS. AKS releases new node pool images as soon as patches are available, and it's the user's responsibility to upgrade node pools to stay current on patches and hotfixes. This patch process is also true for the Kubernetes version being used. [AKS release notes][aks-release-notes] indicate when new versions are available. For more information on upgrading the Windows Server node pool, see [Upgrade a node pool in AKS][nodepool-upgrade]. If you're only interested in updating the node image, see [AKS node image upgrades][upgrade-node-image].

> [!NOTE]
> The updated Windows Server image will only be used if a cluster upgrade (control plane upgrade) has been performed prior to upgrading the node pool.

## Is preserving the client source IP supported?

At this time, [client source IP preservation][client-source-ip] is not supported with Windows nodes.

## Can I change the maximum number of pods per node?

Yes. For the implications of making a change and the options that are available, see [Maximum number of pods][maximum-number-of-pods].

## What is the default TCP timeout in Windows OS?

The default TCP timeout in Windows OS is 4 minutes. This value isn't configurable. When an application uses a longer timeout, the TCP connections between different containers in the same node close after four minutes.

## Why am I seeing an error when I try to create a new Windows agent pool?

If you created your cluster before February 2020 and have never done any cluster upgrade operations, the cluster still uses an old Windows image. You may have seen an error that resembles:

"The following list of images referenced from the deployment template is not found: Publisher: MicrosoftWindowsServer, Offer: WindowsServer, Sku: 2019-datacenter-core-smalldisk-2004, Version: latest. Please refer to [Find and use Azure Marketplace VM images with Azure PowerShell](../virtual-machines/windows/cli-ps-findimage.md) for instructions on finding available images."

To fix this error:

1. Upgrade the [cluster control plane][upgrade-cluster-cp] to update the image offer and publisher.
1. Create new Windows agent pools.
1. Move Windows pods from existing Windows agent pools to new Windows agent pools.
1. Delete old Windows agent pools.

## Why am I seeing an error when I try to deploy Windows pods?

If you specify a value in `--max-pods` less than the number of pods you want to create, you may see the `No available addresses` error.

To fix this error, use the `az aks nodepool add` command with a high enough `--max-pods` value:

```azurecli
az aks nodepool add \
    --cluster-name $CLUSTER_NAME \
    --resource-group $RESOURCE_GROUP \
    --name $NODEPOOL_NAME \
    --max-pods 3
```
For more details, see the [`--max-pods` documentation](/cli/azure/aks/nodepool#az-aks-nodepool-add:~:text=for%20system%20nodepool.-,%2D%2Dmax%2Dpods%20%2Dm,-The%20maximum%20number).

## Why is there an unexpected user named "sshd" on my VM node?

AKS adds a user named "sshd" when installing the OpenSSH service. This user is not malicious. We recommend that customers update their alerts to ignore this unexpected user account.

## How do I rotate the service principal for my Windows node pool?

Windows node pools do not support service principal rotation. To update the service principal, create a new Windows node pool and migrate your pods from the older pool to the new one. After your pods are migrated to the new pool, delete the older node pool.

Instead of service principals, use managed identities, which are essentially wrappers around service principals. For more information, see [Use managed identities in Azure Kubernetes Service][managed-identity].

## How do I change the administrator password for Windows Server nodes on my cluster?

### [Azure CLI](#tab/azure-cli)

When you create your AKS cluster, you specify the `--windows-admin-password` and `--windows-admin-username` parameters to set the administrator credentials for any Windows Server nodes on the cluster. If you didn't specify administrator credentials when you created a cluster by using the Azure portal or when setting `--vm-set-type VirtualMachineScaleSets` and `--network-plugin azure` by using the Azure CLI, the username defaults to *azureuser* and a randomized password.

To change the administrator password, use the `az aks update` command:

```azurecli
az aks update \
    --resource-group $RESOURCE_GROUP \
    --name $CLUSTER_NAME \
    --windows-admin-password $NEW_PW
```

> [!IMPORTANT]
> Performing the `az aks update` operation upgrades only Windows Server node pools and will cause a restart. Linux node pools are not affected. 
> 
> When you're changing `--windows-admin-password`, the new password must be at least 14 characters and meet [Windows Server password requirements][windows-server-password].

### [Azure PowerShell](#tab/azure-powershell)

When you create your AKS cluster, you specify the `-WindowsProfileAdminUserPassword` and `-WindowsProfileAdminUserName` parameters to set the administrator credentials for any Windows Server nodes on the cluster. If you didn't specify administrator credentials when you created a cluster by using the Azure portal or when setting `-NodeVmSetType VirtualMachineScaleSets` and `-NetworkPlugin azure` by using the Azure PowerShell, the username defaults to *azureuser* and a randomized password.

To change the administrator password, use the `Set-AzAksCluster` command:

```azurepowershell
$cluster = Get-AzAksCluster -ResourceGroupName $RESOURCE_GROUP -Name $CLUSTER_NAME
$cluster.WindowsProfile.AdminPassword = $NEW_PW
$cluster | Set-AzAksCluster
```

> [!IMPORTANT]
> Performing the `Set-AzAksCluster` operation upgrades only Windows Server node pools and will cause a restart. Linux node pools are not affected.
>
> When you're changing the Windows administrator password, the new password must be at least 14 characters and meet [Windows Server password requirements][windows-server-password].

---

## How many node pools can I create?

The AKS cluster can have a maximum of 100 node pools. You can have a maximum of 1,000 nodes across those node pools. For more information, see [Node pool limitations][nodepool-limitations].

## What can I name my Windows node pools?

A Windows node pool can have a six-character name.

## Are all features supported with Windows nodes?

Kubenet is currently not supported with Windows nodes.

## Can I run ingress controllers on Windows nodes?

Yes, an ingress controller that supports Windows Server containers can run on Windows nodes in AKS.

## Can my Windows Server containers use gMSA?

Group-managed service account (gMSA) support is generally available for Windows on AKS. See [Enable Group Managed Service Accounts (GMSA) for your Windows Server nodes on your Azure Kubernetes Service (AKS) cluster](use-group-managed-service-accounts.md)

## Can I use Azure Monitor for containers with Windows nodes and containers?

Yes, you can. However, Azure Monitor is in public preview for gathering logs (stdout, stderr) and metrics from Windows containers. You can also attach to the live stream of stdout logs from a Windows container.

## Are there any limitations on the number of services on a cluster with Windows nodes?

A cluster with Windows nodes can have approximately 500 services (sometimes less) before it encounters port exhaustion. This limitation applies to a Kubernetes Service with External Traffic Policy set to “Cluster”. 

When external traffic policy on a Service is configured as Cluster, the traffic undergoes an additional Source NAT on the node which also results in reservation of a port from the TCPIP dynamic port pool. This port pool is a limited resource (~16K ports by default) and many active connections to a Service(s) can lead to dynamic port pool exhaustion resulting in connection drops.

If the Kubernetes Service is configured with External Traffic Policy set to “Local”, port exhaustion problems aren't likely to occur at 500 services.

## Can I use Azure Hybrid Benefit with Windows nodes?

Yes. Azure Hybrid Benefit for Windows Server reduces operating costs by letting you bring your on-premises Windows Server license to AKS Windows nodes.

Azure Hybrid Benefit can be used on your entire AKS cluster or on individual nodes. For individual nodes, you need to browse to the [node resource group][resource-groups] and apply the Azure Hybrid Benefit to the nodes directly. For more information on applying Azure Hybrid Benefit to individual nodes, see [Azure Hybrid Benefit for Windows Server][hybrid-vms].

To use Azure Hybrid Benefit on a new AKS cluster, run the `az aks create` command and use the `--enable-ahub` argument.

```azurecli
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --load-balancer-sku Standard \
    --windows-admin-password 'Password1234$' \
    --windows-admin-username azure \
    --network-plugin azure
    --enable-ahub
```

To use Azure Hybrid Benefit on an existing AKS cluster, run the `az aks update` command and use the update the cluster by using the `--enable-ahub` argument.

```azurecli
az aks update \
    --resource-group myResourceGroup
    --name myAKSCluster
    --enable-ahub
```

To check if Azure Hybrid Benefit is set on the Windows nodes in the cluster, run the `az vmss show` command with the `--name` and `--resource-group` arguments to query the virtual machine scale set. To identify the resource group the scale set for the Windows node pool is created in, you can run the `az vmss list -o table` command.

```azurecli
az vmss show --name myScaleSet --resource-group MC_<resourceGroup>_<clusterName>_<region>
```

If the Windows nodes in the scale set have Azure Hybrid Benefit enabled, the output of `az vmss show` will be similar to the following:

```console
""hardwareProfile": null,
    "licenseType": "Windows_Server",
    "networkProfile": {
      "healthProbe": null,
      "networkApiVersion": null,
```

## How do I change the time zone of a running container?

To change the time zone of a running Windows Server container, connect to the running container with a PowerShell session. For example:
    
```azurecli-interactive
kubectl exec -it CONTAINER-NAME -- powershell
```

In the running container, use [Set-TimeZone](/powershell/module/microsoft.powershell.management/set-timezone) to set the time zone of the running container. For example:

```powershell
Set-TimeZone -Id "Russian Standard Time"
```

To see the current time zone of the running container or an available list of time zones, use [Get-TimeZone](/powershell/module/microsoft.powershell.management/get-timezone).

## Can I maintain session affinity from client connections to pods with Windows containers?

Although maintaining session affinity from client connections to pods with Windows containers will be supported in the Windows Server 2022 OS version, you achieve session affinity by client IP currently by limiting your desired pod to run a single instance per node and configuring your Kubernetes service to direct traffic to the pod on the local node. 

Use the following configuration:

1. Use an AKS cluster running a minimum version of 1.20.
1. Constrain your pod to allow only one instance per Windows node. You can achieve this by using anti-affinity in your deployment configuration.
1. In your Kubernetes service configuration, set **externalTrafficPolicy=Local**. This ensures that the Kubernetes service directs traffic only to pods within the local node.
1. In your Kubernetes service configuration, set **sessionAffinity: ClientIP**. This ensures that the Azure Load Balancer gets configured with session affinity.

## Next steps

To get started with Windows Server containers in AKS, see [Create a node pool that runs Windows Server in AKS][windows-node-cli].

<!-- LINKS - external -->
[kubernetes]: https://kubernetes.io
[upstream-limitations]: https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#supported-functionality-and-limitations
[intro-windows]: https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/
[aks-roadmap]: https://github.com/Azure/AKS/projects/1
[aks-release-notes]: https://github.com/Azure/AKS/releases

<!-- LINKS - internal -->
[azure-network-models]: concepts-network.md#azure-virtual-networks
[configure-azure-cni]: configure-azure-cni.md
[nodepool-upgrade]: manage-node-pools.md#upgrade-a-single-node-pool
[windows-node-cli]: ./learn/quick-windows-container-deploy-cli.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[upgrade-cluster]: upgrade-cluster.md
[upgrade-cluster-cp]: manage-node-pools.md#upgrade-a-cluster-control-plane-with-multiple-node-pools
[azure-outbound-traffic]: ../load-balancer/load-balancer-outbound-connections.md#defaultsnat
[nodepool-limitations]: create-node-pools.md#limitations
[windows-container-compat]: /virtualization/windowscontainers/deploy-containers/version-compatibility?tabs=windows-server-2019%2Cwindows-10-1909
[maximum-number-of-pods]: azure-cni-overview.md#maximum-pods-per-node
[azure-monitor]: ../azure-monitor/containers/container-insights-overview.md#what-does-azure-monitor-for-containers-provide
[client-source-ip]: concepts-network.md#ingress-controllers
[upgrade-node-image]: node-image-upgrade.md
[managed-identity]: use-managed-identity.md
[hybrid-vms]: ../virtual-machines/windows/hybrid-use-benefit-licensing.md
[resource-groups]: faq.md#why-are-two-resource-groups-created-with-aks
[dsr]: ../load-balancer/load-balancer-multivip-overview.md#rule-type-2-backend-port-reuse-by-using-floating-ip
[windows-server-password]: /windows/security/threat-protection/security-policy-settings/password-must-meet-complexity-requirements#reference
