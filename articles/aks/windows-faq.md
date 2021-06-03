---
title: Windows Server node pools FAQ
titleSuffix: Azure Kubernetes Service
description: See the frequently asked questions when you run Windows Server node pools and application workloads in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 10/12/2020

#Customer intent: As a cluster operator, I want to see frequently asked questions when running Windows node pools and application workloads.
---

# Frequently asked questions for Windows Server node pools in AKS

In Azure Kubernetes Service (AKS), you can create a node pool that runs Windows Server as the guest OS on the nodes. These nodes can run native Windows container applications, such as those built on the .NET Framework. There are differences in how the Linux and Windows OS provides container support. Some common Linux Kubernetes and pod-related features are not currently available for Windows node pools.

This article outlines some of the frequently asked questions and OS concepts for Windows Server nodes in AKS.

## Which Windows operating systems are supported?

AKS uses Windows Server 2019 as the host OS version and only supports process isolation. Container images built using other Windows Server versions are not supported. For more information, see [Windows container version compatibility][windows-container-compat].

## Is Kubernetes different on Windows and Linux?

Window Server node pool support includes some limitations that are part of the upstream Windows Server in Kubernetes project. These limitations are not specific to AKS. For more information on this upstream support for Windows Server in Kubernetes, see the [Supported Functionality and Limitations][upstream-limitations] section of the [Intro to Windows support in Kubernetes][intro-windows] document, from the Kubernetes project.

Kubernetes is historically Linux-focused. Many examples used in the upstream [Kubernetes.io][kubernetes] website are intended for use on Linux nodes. When you create deployments that use Windows Server containers, the following considerations at the OS-level apply:

- **Identity** - Linux identifies a user by an integer user identifier (UID). A user also has an alphanumeric user name for logging on, which Linux translates to the user's UID. Similarly Linux identifies a user group by an integer group identifier (GID) and translates a group name to its corresponding GID.
    - Windows Server uses a larger binary security identifier (SID) which is stored in the Windows Security Access Manager (SAM) database. This database is not shared between the host and containers, or between containers.
- **File permissions** - Windows Server uses an access control list based on SIDs, rather than a bitmask of permissions and UID+GID
- **File paths** - convention on Windows Server is to use \ instead of /.
    - In pod specs that mount volumes, specify the path correctly for Windows Server containers. For example, rather than a mount point of */mnt/volume* in a Linux container, specify a drive letter and location such as */K/Volume* to mount as the *K:* drive.

## What kind of disks are supported for Windows?

Azure Disks and Azure Files are the supported volume types. These are accessed as NTFS volumes in the Windows Server container.

## Can I run Windows only clusters in AKS?

The master nodes (the control plane) in an AKS cluster are hosted by AKS the service, you will not be exposed to the operating system of the nodes hosting the master components. All AKS clusters are created with a default first node pool, which is Linux-based. This node pool contains system services, which are needed for the cluster to function. It's recommended to run at least two nodes in the first node pool to ensure reliability of your cluster and the ability to do cluster operations. The first Linux-based node pool can't be deleted unless the AKS cluster itself is deleted.

## How do I patch my Windows nodes?

To get the latest patches for Windows nodes, you can either [upgrade the node pool][nodepool-upgrade] or [upgrade the node image][upgrade-node-image]. Windows Updates are not enabled on nodes in AKS. AKS releases new node pool images as soon as patches are available, and it's the user's responsibility to upgrade node pools to stay current on patches and hotfixes. This is also true for the Kubernetes version being used. [AKS release notes][aks-release-notes] indicate when new versions are available. For more information on upgrading the entire Windows Server node pool, see [Upgrade a node pool in AKS][nodepool-upgrade]. If you're only interested in updating the node image, see [AKS node image upgrades][upgrade-node-image].

> [!NOTE]
> The updated Windows Server image will only be used if a cluster upgrade (control plane upgrade) has been performed prior to upgrading the node pool.
>

## What network plug-ins are supported?

AKS clusters with Windows node pools must use the Azure CNI (advanced) networking model. Kubenet (basic) networking is not supported. For more information on the differences in network models, see [Network concepts for applications in AKS][azure-network-models]. The Azure CNI network model requires additional planning and considerations for IP address management. For more information on how to plan and implement Azure CNI, see [Configure Azure CNI networking in AKS][configure-azure-cni].

Windows nodes on AKS clusters also have [Direct Server Return (DSR)][dsr] enabled by default when Calico is enabled.

## Is preserving the client source IP supported?

At this time, [client source IP preservation][client-source-ip] is not supported with Windows nodes.

## Can I change the max. # of pods per node?

Yes. For the implications and options that are available, see [Maximum number of pods][maximum-number-of-pods].

## Why am I seeing an error when I try to create a new Windows agent pool?

If you created your cluster before February 2020 and have never done any cluster upgrade operations, the cluster still uses an old Windows image. You may have seen an error that resembles:

"The following list of images referenced from the deployment template is not found: Publisher: MicrosoftWindowsServer, Offer: WindowsServer, Sku: 2019-datacenter-core-smalldisk-2004, Version: latest. Please refer to https://docs.microsoft.com/azure/virtual-machines/windows/cli-ps-findimage for instructions on finding available images."

To fix this error:

1. Upgrade the [cluster control plane][upgrade-cluster-cp] to update the image offer and publisher.
1. Create new Windows agent pools.
1. Move Windows pods from existing Windows agent pools to new Windows agent pools.
1. Delete old Windows agent pools.

## How do I rotate the service principal for my Windows node pool?

Windows node pools do not support service principal rotation. To update the service principal, create a new Windows node pool and migrate your pods from the older pool to the new one. Once this is complete, delete the older node pool.

Instead, use managed identities, which are essentially wrappers around service principals. For more information, see [Use managed identities in Azure Kubernetes Service][managed-identity].

## How do I change the administrator password for Windows Server nodes on my cluster?

When you create your AKS cluster, you specify the `--windows-admin-password` and `--windows-admin-username` parameters to set the administrator credentials for any Windows Server nodes on the cluster. If you did not specify administrator credentials, such as when creating a cluster using the Azure Portal or when setting `--vm-set-type VirtualMachineScaleSets` and `--network-plugin azure` using the Azure CLI, the username defaults to *azureuser* and a randomized password.

To change the administrator password, use the `az aks update` command:

```azurecli
az aks update \
    --resource-group $RESOURCE_GROUP \
    --name $CLUSTER_NAME \
    --windows-admin-password $NEW_PW
```

> [!IMPORTANT]
> Performing this operation upgrades all Windows Server node pools. Linux node pools are not affected.
> 
> When changing `--windows-admin-password`, the new password must be at least 14 characters and meet [Windows Server password requirements][windows-server-password].

## How many node pools can I create?

The AKS cluster can have a maximum of 10 node pools. You can have a maximum of 1000 nodes across those node pools. [Node pool limitations][nodepool-limitations].

## What can I name my Windows node pools?

You have to keep the name to a maximum of 6 (six) characters. This is a current limitation of AKS.

## Are all features supported with Windows nodes?

Kubenet is currently not supported with Windows nodes.

## Can I run ingress controllers on Windows nodes?

Yes, an ingress-controller that supports Windows Server containers can run on Windows nodes in AKS.

## Can my Windows Server containers use gMSA?

Group managed service accounts (gMSA) support is not currently available in AKS.

## Can I use Azure Monitor for containers with Windows nodes and containers?

Yes you can, however Azure Monitor is in public preview for gathering logs (stdout, stderr) and metrics from Windows containers. You can also attach to the live stream of stdout logs from a Windows container.

## Are there any limitations on the number of services on a cluster with Windows nodes?

A cluster with Windows nodes can have approximately 500 services before it encounters port exhaustion.

## Can I use Azure Hybrid Benefit with Windows nodes?

Yes. Azure Hybrid Benefit for Windows Server reduces operating costs by letting you bring your on-premises Windows Server license to AKS Windows nodes.

Azure Hybrid Benefit can be used on your entire AKS cluster or on individual nodes. For individual nodes, you need to navigate to the [node resource group][resource-groups] and apply the Azure Hybrid Benefit to the nodes directly. For more information on applying Azure Hybrid Benefit to individual nodes, see [Azure Hybrid Benefit for Windows Server][hybrid-vms]. 

To use Azure Hybrid Benefit on a new AKS cluster, use the `--enable-ahub` argument.

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

To use Azure Hybrid Benefit on an existing AKS cluster, update the cluster using the `--enable-ahub` argument.

```azurecli
az aks update \
    --resource-group myResourceGroup
    --name myAKSCluster
    --enable-ahub
```

To check if Azure Hybrid Benefit is set on the cluster, use the following command:

```azurecli
az vmss show --name myAKSCluster --resource-group MC_CLUSTERNAME
```

If the cluster has Azure Hybrid Benefit enabled, the output of `az vmss show` will be similar to the following:

```console
"platformFaultDomainCount": 1,
  "provisioningState": "Succeeded",
  "proximityPlacementGroup": null,
  "resourceGroup": "MC_CLUSTERNAME"
```

## Can I use the Kubernetes Web Dashboard with Windows containers?

Yes, you can use the [Kubernetes Web Dashboard][kubernetes-dashboard] to access information about Windows containers, but at this time you can't run *kubectl exec* into a running Windows container directly from the Kubernetes Web Dashboard. For more details on connecting to your running Windows container, see [Connect with RDP to Azure Kubernetes Service (AKS) cluster Windows Server nodes for maintenance or troubleshooting][windows-rdp].

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

## What if I need a feature that's not supported?

We work hard to bring all the features you need to Windows in AKS, but if you do encounter gaps, the open-source, upstream [aks-engine][aks-engine] project provides an easy and fully customizable way of running Kubernetes in Azure, including Windows support. Be sure to check out our roadmap of features coming [AKS roadmap][aks-roadmap].

## Next steps

To get started with Windows Server containers in AKS, [create a node pool that runs Windows Server in AKS][windows-node-cli].

<!-- LINKS - external -->
[kubernetes]: https://kubernetes.io
[aks-engine]: https://github.com/azure/aks-engine
[upstream-limitations]: https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#supported-functionality-and-limitations
[intro-windows]: https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/
[aks-roadmap]: https://github.com/Azure/AKS/projects/1
[aks-release-notes]: https://github.com/Azure/AKS/releases

<!-- LINKS - internal -->
[azure-network-models]: concepts-network.md#azure-virtual-networks
[configure-azure-cni]: configure-azure-cni.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[windows-node-cli]: windows-container-cli.md
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[upgrade-cluster]: upgrade-cluster.md
[upgrade-cluster-cp]: use-multiple-node-pools.md#upgrade-a-cluster-control-plane-with-multiple-node-pools
[azure-outbound-traffic]: ../load-balancer/load-balancer-outbound-connections.md#defaultsnat
[nodepool-limitations]: use-multiple-node-pools.md#limitations
[windows-container-compat]: /virtualization/windowscontainers/deploy-containers/version-compatibility?tabs=windows-server-2019%2Cwindows-10-1909
[maximum-number-of-pods]: configure-azure-cni.md#maximum-pods-per-node
[azure-monitor]: ../azure-monitor/containers/container-insights-overview.md#what-does-azure-monitor-for-containers-provide
[client-source-ip]: concepts-network.md#ingress-controllers
[kubernetes-dashboard]: kubernetes-dashboard.md
[windows-rdp]: rdp.md
[upgrade-node-image]: node-image-upgrade.md
[managed-identity]: use-managed-identity.md
[hybrid-vms]: ../virtual-machines/windows/hybrid-use-benefit-licensing.md
[resource-groups]: faq.md#why-are-two-resource-groups-created-with-aks
[dsr]: ../load-balancer/load-balancer-multivip-overview.md#rule-type-2-backend-port-reuse-by-using-floating-ip
[windows-server-password]: /windows/security/threat-protection/security-policy-settings/password-must-meet-complexity-requirements#reference