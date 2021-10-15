---
title: Overview of clustering on your Azure Stack Edge device
description: Describes clustering on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 10/13/2021
ms.author: alkohli
---

# Clustering on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article provides a brief overview of clustering on your Azure Stack Edge device. 

## About clustering

In Windows Server Failover Clustering, quorum needs to be maintained in order for the Windows Server cluster to remain online in the event of a failure. When nodes in a Windows Server cluster fail, surviving nodes need to verify that they constitute the majority of the cluster to remain online.  

However, the concept of majority only exists for clusters with an odd number of nodes. When the number of nodes in a cluster is even, the system requires a way to make the total number of votes odd. This is where the cluster witness’ role is important. The cluster witness is given a vote, so that in the event of a failure, the total number of votes in the cluster (which originally had an even number of nodes) is odd. 

Windows Server Failover Clustering is implemented on the Azure Stack Edge device and a two-node device cluster can be created.  

## Cluster quorum and witness

A quorum is always maintained on your Azure Stack Edge cluster to remain online in the event of a failure. If one of the nodes fails, then the majority of the surviving nodes must verify that the cluster remains online. The concept of majority only exists for clusters with an odd number of nodes. 

For an Azure Stack Edge cluster with two nodes, if a node fails, then a cluster witness provides the third vote so that the cluster stays online (since the cluster is left with 2/3 votes - a majority). For more information on cluster quorum, see []().

 
For more information on cluster witness, see [Cluster witness on Azure Stack Edge]().

ASE (2-node) clusters require a cluster witness, so that in the event of a single ASE node failure the cluster witness accounts for the third vote, and the cluster stays online (since the cluster is left with 2/3 votes - a majority). On the other hand, if both ASE nodes fail simultaneously, or a second ASE node fails after the first has failed, there is no majority vote, and the ASE cluster goes offline. 

 

Note that this system requires both ASE nodes to have connectivity to each other as well as the cluster witness. If the cluster witness were to go offline or lose connectivity with either of the ASE nodes, the total number of votes in the event of a single ASE node failure would be even. In this case, Windows Server Failover Clustering will try to remediate this by arbitrarily picking an ASE node that will not get to vote (in order to make the total number of votes odd). In this case, if the ASE node that failed happened to be the one that got the single vote in the ASE cluster, there will be no majority vote and the cluster will go offline. This is why, in order to prevent the ASE cluster from going offline in the event of a single ASE node failure, it is extremely important for the cluster witness to be online and have connectivity to both ASE nodes. 


### Witness requirements

- Cloud witness requirements

    - Both the device nodes in the cluster should have a reliable internet connection.
    - Make sure that the HTTPS default port 443 is open on your device as cloud witness uses this port to establish outbound communication with the Azure blob service. 
    
- Local witness requirements

    - SMB 2 File share is created on-premises but not on the nodes of your device.
    - A minimum of 5 MB of free space on the file share.
    - Your device should be able to access the file share over the network. 

### Cluster witness setup and configuration 

In order for the witness to have an independent vote, it must always be hosted outside of the ASE nodes in the ASE cluster. It can be deployed in either of the following ways. 


- Cloud witness - Use the cloud witness when both the nodes on your Azure Stack Edge cluster are connected to Azure. To set up a cloud witness, you use an Azure Storage account in the cloud and configure the witness via the local UI of the device. 

    We recommend that you deploy the cloud witness with redundant connections so that the witness is highly available. For more information, see [Set up cloud witness via the local UI]().

- Local witness - Use the local witness when both the nodes are not connected to Azure or have a sporadic connectivity. If you're in an IT environment with other machines and file shares, use a file share witness. To set up a local witness, you can use an SMB fileshare on a local server in the network where the device is deployed and configure the fileshare path to the server via the local UI. 
    
    We recommend that you deploy the witness in way that it is highly available. For example, a switch running a file server could be used to host a file share. For more information, see [Set up local witness via the local UI]().

| Option              | Tasks                                                                                                                                 | Details                                                                                                                                                                                           |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Cloud Witness       | Create an Azure Storage Account to use as a Cloud Witness <br> Configure the Cloud Witness as a quorum witness for your ASE cluster using the ASE local UI                                                                             | Requires connectivity to Azure from both ASE nodes in the ASE cluster <br> In order to prevent the witness from being a single point of failure, the cluster witness can be deployed in the cloud in a way that makes it highly available, with redundant connections to it|
| File Share Witness  | Create a share on an SMB device on premises (but not on either of the ASE nodes in the ASE cluster), with at least 5MB of free space <br> Create the file share witness as a quorum witness for your ASE cluster using the ASE local UI  | Ideal when not all servers in the ASE cluster have a reliable connection to Azure <br> High availability of the witness needs to be designed based on the on-premises environment. For example, a switch running a file server could be used to host a file share  |









 
## Next steps

- Learn about [VM sizes and types for Azure Stack Edge Pro GPU](azure-stack-edge-gpu-virtual-machine-sizes.md).


