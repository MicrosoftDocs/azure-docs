<properties
   pageTitle="Scaling a Service Fabric cluster up or down | Microsoft Azure"
   description="Scale a Service Fabric Cluster up or down to match demand by adding or removing virtual machine nodes"
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
   ms.date="11/03/2015"
   ms.author="chackdan"/>

# Scaling a Service Fabric Cluster up or down by adding or removing Virtual Machines (VMs) from it.

You can scale Service Fabric clusters up or down to match demand by adding or removing virtual machines.

>[AZURE.NOTE] It is assumed that your subscription has enough cores to add the new VMs that will make up this cluster.


## Manually scaling a Service Fabric cluster

### Choosing the node type to scale

If your cluster has multiple Node types, you will now have to add or remove VMs from specific Node Types.

1. Log on to the Azure Portal [http://aka.ms/servicefabricportal](http://aka.ms/servicefabricportal).

2. Navigate to the Service Fabric Clusters
 ![BrowseServiceFabricClusterResource][BrowseServiceFabricClusterResource]

3. Select the cluster you would like to scale up or down

4. Navigate to settings blade on the cluster dashboard. If you do not see the settings blade, then click on "All Settings" on the essential part on the cluster dashboard.

5. Click on the NodeTypes, which will open up the NodeTypes list blade.

7. Click on the Node type you want to scale up or down, which will then open up the Node Type detail blade.

### Scaling up by adding nodes

Adjust the number of VMs up to what you want it to be and save.The nodes/VMs will now get added once the deployment is complete.

### Scaling down by removing nodes

Removing nodes is a two-step process:

1. Adjust the number of VMs to what you would like and save.The lower end of the slider will indicate the minimum VM requirement for that NodeType.

  >[AZURE.NOTE] You must maintain a minimum of 5 VMs for the primary Node Type.

	Once that deployment is complete, you will get notified of the VM names that can now be deleted. You now need to navigate to the VM resource and delete it.

2. Return to the cluster dashboard and click on the Resource Group. It will open up the Resource Group Blade.

3. Look under Summary or open up the list of resouces by clicking on "..."

4. Click on the VM name that the system had indicated can be deleted.

5. Click on the Delete icon to delete the VM.

## Auto Scaling of the Service Fabric cluster

At this time, Service Fabric clusters do not support auto-scaling. In the near future, clusters will be built on top of virtual machine scale sets (VMSS), at which time auto-scaling will become possible and will behave similarly to the auto-scale behavior available in Cloud Services.

## Scaling using PowerShell/CLI

This article covered scaling clusters using the portal. However, you can perform the same actions from the command line using ARM commands on the cluster resource. The GET response of the ClusterResource will provide the list of nodes which have been disabled.

## Next steps

- [Learn about cluster upgrades](service-fabric-cluster-upgrade.md)
- [Learn about partitioning stateful services for maximum scale](service-fabric-concepts-partitioning.md)


<!--Image references-->
[BrowseServiceFabricClusterResource]: ./media/service-fabric-cluster-scale-up-down/BrowseServiceFabricClusterResource.png
