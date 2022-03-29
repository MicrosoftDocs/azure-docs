---
title: Manually Condemn a Node
description: 
ms.topic: how-to
ms.subservice:  
ms.date: 03/31/2021
---

# Manually Condemn a Node

If any issues occur in a node in a cluster, you can choose to replace that node. The condemn node operation first adds a new node to the cluster, migrates the VMs running on the node you 
want to condemn to the newly added node, and then removes the node you want to condemn.

> [!NOTE]
> As long as the node stays in your account, it keeps your data. Your data is retained even when the node is rebooted. 
However, all data is erased when a node is deallocated (i.e., condemned in Nutanix Clusters portal or deleted from the Azure Portal (which you should never do)).

> [!NOTE]
> The condemn node operation is not supported in a single-node cluster.

Perform the following to condemn a node in a cluster.

> [!NOTE]
> If a node turns unhealthy and you add another node to a cluster for evacuation of data or VMs, Azure charges you additionally for the new node.

1. Log on to Nutanix Clusters from the My Nutanix dashboard.
1. In the drop-down list in the center of the screen, select Clusters.
1. In the Clusters page, click the name of the cluster.
1. In the Details tab of the navigation pane, under Hosts, click the ellipsis in the row of the node you want to condemn, and click Condemn Node.
1. In the Condemn Node dialog box, specify why you want to condemn the node and click Condemn.

## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
