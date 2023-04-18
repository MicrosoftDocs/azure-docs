---
title: Overview of cluster witness on your Azure Stack Edge device
description: Describes a high-level overview of a cluster witness on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 02/25/2022
ms.author: alkohli
---

# Cluster witness on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-gpu-and-pro-2-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-2-sku.md)]

This article provides a brief overview of cluster witness on your Azure Stack Edge device including cluster witness requirements, setup, and management. 

## About cluster quorum and witness

In Windows Server Failover Clustering, quorum needs to be maintained in order for the Windows Server cluster to remain online in the event of a failure. When nodes in a Windows Server cluster fail, surviving nodes need to verify that they constitute the majority of the cluster to remain online.  

However, the concept of majority only exists for clusters with an odd number of nodes. When the number of nodes in a cluster is even, the system requires a way to make the total number of votes odd. This is where the role of cluster witness is important. The cluster witness is given a vote, so that in the event of a failure, the total number of votes in the cluster (which originally had an even number of nodes) is odd. 

For more information on cluster quorum, see [Understand cluster quorum](/windows-server/storage/storage-spaces/understand-quorum).


## Cluster quorum and witness on Azure Stack Edge

Windows Server Failover Clustering is implemented on a two-node Azure Stack Edge device. A quorum is always maintained on your Azure Stack Edge cluster so that the device can remain online in the event of a failure. If one of the nodes fails, then the majority of the surviving nodes must verify that the cluster remains online. The concept of majority only exists for clusters with an odd number of nodes. 

For an Azure Stack Edge cluster with two nodes, if a node fails, then a cluster witness provides the third vote so that the cluster stays online (since the cluster is left with 2/3 votes - a majority). 

## Cluster witness on Azure Stack Edge

A two-node Azure Stack Edge cluster requires a cluster witness, so that if one of the Azure Stack Edge nodes fails, the cluster witness accounts for the third vote, and the cluster stays online (since the cluster is left with 2/3 votes - a majority). On the other hand, if both the device nodes fail simultaneously, or a second Azure Stack Edge node fails after the first has failed, there is no majority vote, and the cluster goes offline. 

 

This system requires both Azure Stack Edge nodes to have connectivity to each other and the cluster witness. If the cluster witness were to go offline or lose connectivity with either of the device nodes, the total number of votes in the event of a single Azure Stack Edge node failure would be even. In this case, Windows Server Failover Clustering will try to remediate this by arbitrarily picking a device node that will not get to vote (in order to make the total number of votes odd). In this case, if the Azure Stack Edge node that failed happened to be the one that got the single vote in the Azure Stack Edge cluster, there will be no majority vote and the cluster will go offline. This is why, in order to prevent the Azure Stack Edge cluster from going offline in the event of a single device node failure, it is important for the cluster witness to be online and have connectivity to both the device nodes. 


### Witness requirements

Cluster witness can be in the cloud or live locally. In each case, there are certain requirements that the witness must meet.

- **Cloud witness requirements**

    - Both the device nodes in the cluster should have a reliable internet connection.
    - Make sure that the HTTPS default port 443 is open on your device as cloud witness uses this port to establish outbound communication with the Azure blob service. 
    
- **Local witness requirements**

    - SMB 2.0 File share is created on-premises but not on the nodes of your device.
    - A minimum of 5 MB of free space exists on the file share.
    - Your device can access the file share over the network. 

### Cluster witness setup and configuration 

In order for the witness to have an independent vote, it must always be hosted outside of the Azure Stack Edge nodes in the device cluster. The witness can be deployed in either of the following ways. 

- **Cloud witness** - Use the cloud witness when both the nodes on your Azure Stack Edge cluster are connected to Azure. To set up a cloud witness, use an Azure Storage account in the cloud and configure the witness via the local UI of the device. 

    We recommend that you deploy the cloud witness with redundant connections so that the witness is highly available. For more information, see [Set up cloud witness via the local UI](azure-stack-edge-gpu-manage-cluster.md#configure-cloud-witness).

- **Local witness** - Use the local witness when both the nodes are not connected to Azure or have sporadic connectivity. If you're in an IT environment with other machines and file shares, use a file share witness. To set up a local witness, you can use an SMB fileshare on a local server in the network where the device is deployed and configure the fileshare path to the server via the local UI. 
    
    We recommend that you deploy the witness in a way that it is highly available. For example, a switch running a file server could be used to host a file share. For more information, see [Set up local witness via the local UI](azure-stack-edge-gpu-manage-cluster.md#configure-local-witness).


 
## Next steps

- Learn how to [Configure cloud witness for Azure Stack Edge Pro GPU](azure-stack-edge-gpu-manage-cluster.md#configure-cloud-witness).
- Learn how to [Set up local witness for Azure Stack Edge Pro GPU](azure-stack-edge-gpu-manage-cluster.md#configure-local-witness).



