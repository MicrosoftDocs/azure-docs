---
title: Overview of clustering on your Azure Stack Edge device
description: Describes clustering on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 01/28/2022
ms.author: alkohli
---

# Clustering on your Azure Stack Edge Pro GPU device

This article provides a brief overview of clustering on your Azure Stack Edge device. 

## About failover clustering

Azure Stack Edge can be set up as a single standalone device or a two-node cluster. A two-node cluster consists of two independent Azure Stack Edge devices that are connected by physical cables and by software. These nodes when clustered work together as in a Windows failover cluster, provide high availability for applications and services that are running on the cluster. 

If one of the clustered nodes fails, the other node begins to provide service (the process is known as failover). The clustered roles are also proactively monitored to make sure that they’re working properly. If they aren’t working, they’re restarted or moved to the second node.

Azure Stack Edge uses Windows Server Failover Clustering for its two-node cluster. For more information, see [Failover clustering in Windows Server](/windows-server/failover-clustering/failover-clustering-overview).

## Cluster quorum and witness

A quorum is always maintained on your Azure Stack Edge cluster to remain online in the event of a failure. If one of the nodes fails, then the majority of the surviving nodes must verify that the cluster remains online. The concept of majority only exists for clusters with an odd number of nodes. For more information on cluster quorum, see [Understand quorum](/windows-server/storage/storage-spaces/understand-quorum).

For an Azure Stack Edge cluster with two nodes, if a node fails, then a cluster witness provides the third vote so that the cluster stays online (since the cluster is left with two out of three votes - a majority). A cluster witness is required on your Azure Stack Edge cluster. You can set up the witness in the cloud or in a local fileshare using the local UI of your device. 

For more information on cluster witness, see [Cluster witness on Azure Stack Edge](azure-stack-edge-gpu-cluster-witness-overview.md).


## Infrastructure cluster

The infrastructure cluster on your device provides persistent storage and is shown in the following diagram: 

![Infrastructure cluster of Azure Stack Edge](media/azure-stack-edge-gpu-clustering-overview/azure-stack-edge-infrastructure-cluster.png)

- The infrastructure cluster consists of the two independent nodes running Windows Server operating system with a Hyper-V layer. The nodes contain physical disks for storage and network interfaces that are connected back-to-back or with switches.
- The disks across the two nodes are used to create a logical storage pool. The storage spaces direct on this pool provides mirroring and parity for the cluster. 
- You can deploy your application workloads on top of the infrastructure cluster. 

    - Non-containerized workloads such as VMs can be directly deployed on top of the infrastructure cluster.

        ![VMs workloads deployed on infrastructure cluster of Azure Stack Edge](media/azure-stack-edge-gpu-clustering-overview/azure-stack-edge-virtual-machine-workloads-infrastructure-cluster.png)

    - Containerized workloads use Kubernetes for workload deployment and management. A Kubernetes cluster that consists of a master VM and two worker VMs (one for each node) is deployed on top of the infrastructure cluster.   

        <!--![Kubernetes or IoT Edge workloads deployed on infrastructure cluster of Azure Stack Edge](media/azure-stack-edge-gpu-clustering-overview/azure-stack-edge-kubernetes-workloads-infrastructure-cluster.png)-->
   
    The Kubernetes cluster allows for application orchestration whereas the infrastructure cluster provides persistent storage.


## Supported networking topologies

On your Azure Stack Edge device node: 

- Port 2 is used for management traffic.
- Port 3 and Port 4 are used for storage and cluster traffic. This traffic includes that needed for storage mirroring and Azure Stack Edge cluster heartbeat traffic that is required for the cluster to be online.  

Based on the use-case and workloads, you can select how the two Azure Stack Edge nodes will be connected. The following networking topologies are available: 

![Available network topologies](media/azure-stack-edge-gpu-clustering-overview/azure-stack-edge-network-topologies.png)

1. **Switchless** - Use this option when you don't have high speed switches available in the environment for storage and cluster traffic. 

    In this option, Port 3 and Port 4 are connected back-to-back without a switch. These ports are dedicated to storage and Azure Stack Edge cluster traffic and aren't available for workload traffic. <!--For example, these ports can't be enabled for compute--> Optionally you can also provide IP addresses for these ports.


1. **Using switches and NIC teaming** - Use this option when you have high speed switches available for use with your device nodes for storage and cluster traffic. 

    Each of ports 3 and 4 of the two nodes of your device are connected via an external switch. The Port 3 and Port 4 are teamed on each node and a virtual switch and two virtual NICs are created that allow for port-level redundancy for storage and cluster traffic. These ports can be used for workload traffic as well.

 
1. **Using switches and without NIC teaming** - Use this option when you need an extra dedicated port for workload traffic and port-level redundancy isn’t required for storage and cluster traffic. 

    Port 3 on each node is connected via an external switch. If Port 3 fails, the cluster may go offline. Separate virtual switches are created on Port 3 and Port 4. 

For more information, see how to [Choose a network topology for your device node](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md#configure-network).


## Cluster deployment  

Before you configure clustering on your device, you must cable the devices as per one of the supported network topologies that you intend to configure. To deploy a two-node infrastructure cluster on your Azure Stack Edge devices, follow these high-level steps:

![Azure Stack Edge clustering deployment](media/azure-stack-edge-gpu-clustering-overview/azure-stack-edge-clustering-deployment-1.png)

1. Order two independent Azure Stack Edge devices. For more information, see [Order an Azure Stack Edge device](azure-stack-edge-gpu-deploy-prep.md#create-a-new-resource).
1. Cable each node independently as you would for a single node device. Based on the workloads that you intend to deploy, cross connect the network interfaces on these devices via cables, and with or without switches. For detailed instructions, see [Cable your two-node cluster device](azure-stack-edge-gpu-deploy-install.md#cable-the-device).
1. Start cluster creation on the first node. Choose the network topology that conforms to the cabling across the two nodes. The chosen topology would dictate the storage and clustering traffic between the nodes. See detailed steps in [Configure network and web proxy on your device](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).
1. Prepare the second node. Configure the network on the second node the same way you configured it on the first node. Get the authentication token on this node.
1. Use the authentication token from the prepared node and join this node to the first node to form a cluster.
1. Set up a cloud witness using an Azure Storage account or a local witness on an SMB fileshare.
1. Assign a virtual IP to provide an endpoint for Azure Consistent Services or when using NFS. 
1. Assign compute or management intents to the virtual switches created on the network interfaces. You may also configure Kubernetes node IPs and Kubernetes service IPs here for the network interface enabled for compute.
1. Optionally configure web proxy, set up device settings, configure certificates and then finally, activate the device.

For more information, see the two-node device deployment tutorials starting with [Get deployment configuration checklist](azure-stack-edge-gpu-deploy-checklist.md).

## Clustering workloads

On your two-node cluster, you can deploy non-containerized workloads or containerized workloads.

- **Non-containerized workloads such as VMs**: The two-node cluster will ensure high availability of the virtual machines that are deployed on the device cluster. <!--Your two-node device actively manages capacity to ensure successful failover of the deployed VMs.--> Live migration of VMs isn’t supported.

- **Containerized workloads such as Kubernetes or IoT Edge**: The Kubernetes cluster deployed on top of the device cluster consists of one Kubernetes master VM and two Kubernetes worker VMs. Each Kubernetes node has a worker VM that is pinned to each Azure Stack Edge node. Failover results in the failover of Kubernetes master VM (if needed) and Kubernetes-based rebalancing of pods on the surviving worker VM.
 
    For more information, see [Kubernetes on a clustered Azure Stack Edge device](azure-stack-edge-gpu-kubernetes-failover-scenarios.md).


## Cluster management

You can manage the Azure Stack Edge cluster via the PowerShell interface of the device, or through the local UI. Some typical management tasks are:

- [Add a node](azure-stack-edge-placeholder.md)
- [Unprepare a node](azure-stack-edge-placeholder.md)
- [Configure cloud witness](azure-stack-edge-placeholder.md)
- [Set up a local witness](azure-stack-edge-placeholder.md)
- [Configure virtual IP settings](azure-stack-edge-placeholder.md)
- [Remove the cluster](azure-stack-edge-placeholder.md)
- Update the cluster


<!--## Cluster upgrades

A two-node clustered device upgrade will first apply the device updates followed by the Kubernetes cluster updates. Rolling updates to device nodes ensure minimal downtime of workloads. For step-by-step instructions, see [Apply updates to your two-node Azure Stack Edge device](azure-stack-edge-gpu-install-update.md).-->

## Billing

If you deploy an Azure Stack Edge two-node cluster, each node is billed separately. For more information, see [Pricing page for Azure Stack Edge](https://azure.microsoft.com/pricing/details/azure-stack/edge/#pricing).

## Next steps

- Learn about [Cluster witness for your Azure Stack Edge](azure-stack-edge-gpu-cluster-witness-overview.md).
- See [Kubernetes for your Azure Stack Edge](azure-stack-edge-gpu-kubernetes-overview.md)
- Understand [Cluster failover scenarios](azure-stack-edge-gpu-cluster-failover-scenarios.md)


