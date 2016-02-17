<properties
   pageTitle="Scale a Service Fabric cluster up or down | Microsoft Azure"
   description="Scale a Service Fabric cluster up or down to match demand by adding or removing virtual machine nodes."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/12/2016"
   ms.author="chackdan"/>


# Scale a Service Fabric cluster up or down by adding or removing virtual machines

You can scale Azure Service Fabric clusters up or down to match demand by adding or removing virtual machines.

>[AZURE.NOTE] Your subscription must have enough cores to add the new VMs that will make up this cluster.

## Scale a Service Fabric cluster manually

### Choose the node type to scale

If your cluster has multiple node types, you will have to add or remove VMs from specific node types. Here's how:

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Navigate to **Service Fabric Clusters**.
 ![Service Fabric Clusters page in the Azure portal.][BrowseServiceFabricClusterResource]

3. Select the cluster that you want to scale up or down.

4. Navigate to the **Settings** blade on the cluster dashboard. If you do not see the **Settings** blade, then click **All Settings** on the essential part on the cluster dashboard.

5. Click **NodeTypes**, which will open the **NodeTypes list** blade.

6. Click the node type that you want to scale up or down, which will open the **NodeType detail** blade.

### Scale up by adding nodes

Adjust the number of VMs up to what you want it to be, and save. The nodes/VMs will be added once the deployment is complete.

### Scale down by removing nodes

Removing nodes is a two-step process:

1. Adjust the number of VMs to what you want and save. The lower end of the slider indicates the minimum number of VMs required for that node type.

    >[AZURE.NOTE] You must maintain a minimum of 5 VMs for the primary node type.

2. Once that deployment is complete, you will be notified of the VM names that can now be deleted. You then need to navigate to the VM resources and delete them:

    a. Return to the cluster dashboard and click **Resource Group**. It will open the **Resource Group** blade.

    b. Look under **Summary** or open the list of resources by clicking "**...**".

    c. Click the VM name that the system indicated could be deleted.

    d. Click the **Delete** icon to delete the VM.

>[AZURE.NOTE] Service Fabric clusters require a certain number of nodes to be up at all times in order to maintain availability and preserve state - referred to as "maintaining quorum". Consequently, it is typically not safe to shut down all of the machines in the cluster unless you have first performed a [full backup of your state](service-fabric-reliable-services-backup-restore.md).

## Auto-scale Service Fabric clusters

At this time, Service Fabric clusters do not support auto-scaling. In the near future, clusters will be built on top of virtual machine scale sets, at which time auto-scaling will become possible and will behave similarly to the auto-scale behavior available in cloud services.

## Scale clusters by using PowerShell/CLI

This article covers scaling clusters by using the portal. However, you can perform the same actions from the command line by using Azure Resource Manager commands on the cluster resource. The GET response of the cluster resource will provide the list of nodes that have been disabled.

## Next steps

- [Learn about cluster upgrades](service-fabric-cluster-upgrade.md)
- [Learn about partitioning stateful services for maximum scale](service-fabric-concepts-partitioning.md)

<!--Image references-->
[BrowseServiceFabricClusterResource]: ./media/service-fabric-cluster-scale-up-down/BrowseServiceFabricClusterResource.png
