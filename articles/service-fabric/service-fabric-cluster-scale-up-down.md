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
   ms.date="01/11/2016"
   ms.author="chackdan"/>

# Scaling a Service Fabric Cluster up or down by adding or removing Virtual Machines (VMs) from it.

You can scale Service Fabric clusters up or down to match demand by adding or removing virtual machines.

>[AZURE.NOTE] It is assumed that your subscription has enough cores to add the new VMs that will make up this cluster.


## Manually scaling a Service Fabric cluster

If your cluster has multiple Node types, you will have to add or remove VMs to/from specific node types. Ypu can add VMs to one node type and remove VMs from the other, in the same deployment.

### upgrading a cluster you had deployed using the portal

Since modifying the ARM template is an involved process,  we have a powershell Module uploaded to a Git Repo, that does this for you. 

**Step 1**: Copy this folder down to your machine from this [Git repo](https://github.com/ChackDan/Service-Fabric/tree/master/Scripts/ServiceFabricRPHelpers).

**Step 2**: Make sure  Azure SDK 1.0+ installed on your machine.

**Step 3**: Open a Powershell window and import the ServiceFabricRPHelpers.psm

```
Remove-Module ServiceFabricRPHelpers
```

Copy the following cmd and change the path to the .psm1 to be that of your machine. Here is an example

```
Import-Module "C:\Users\chackdan\Documents\GitHub\Service-Fabric\Scripts\ServiceFabricRPHelpers\ServiceFabricRPHelpers.psm1"
```

 **Step 4**: Log in to your Azure Account

```
Login-AzureRmAccount
```

Run the Invoke-ServiceFabricRPClusterScaleUpgrade command , make sure that you have the resource group name and the subscription correct.

```
Invoke-ServiceFabricRPClusterScaleUpgrade -ResourceGroupName <string> -SubscriptionId <string>
```

here is a filled out example of the PS command
```
Invoke-ServiceFabricRPClusterScaleUpgrade -ResourceGroupName chackod02 -SubscriptionId 18ad2z84-84fa-4798-ad71-e70c07af879f
```

  **Step 5**: The command will now retrieve the cluster information and walk you through all the node types, first telling you the current VM count for that node type and then ask you to provide what the new node count should be.

 **For a scaleup of this node type**, specify a larger number than the current VM count.

**For a Scale down of this node type**, specify a smaller number than the current VM count. 

These prompt will now loop through for all the node types. If your cluster has only one nodetype, then you will get prompted only once.
 
  **Step 6**: If you are adding new nodes, you will now get a prompt to provide the remote desktop userid and password for the VMs you are adding.
 
**Step 7**: In the output window, you will now see messages, telling you the progress of your deployment. Once the deployment is complete, your cluster should have the number of VMs you specified in Step 5.


![ScaleupDownPSOut][ScaleupDownPSOut]

### upgrading a cluster that you had deployed using ARM PowerShell/CLI

If you had deployed your cluster using an ARM template, then you need to modify the count of the VMs for a given node type and all the resources that support the VM. The minimum number of VMs allowed for the primary node type is 5 (for non-test clusters), for test clusters the minimum is 3.

Once you have the new template, you can deploy it via ARM using the same resource group as the cluster that you are upgrading. 

Suggestion - The Powershell module ServiceFabricRPHelpers.psm1 (Step 3 above) uses the ARM PS/CLI commands to deploy the ARM template it creates, you can use the same commands to deploy your template.

## Auto Scaling of the Service Fabric cluster

At this time, Service Fabric clusters do not support auto-scaling. In the near future, clusters will be built on top of virtual machine scale sets (VMSS), at which time auto-scaling will become possible and will behave similarly to the auto-scale behavior available in Cloud Services.


## Next steps

- [Learn about cluster upgrades](service-fabric-cluster-upgrade.md)
- [Learn about partitioning stateful services for maximum scale](service-fabric-concepts-partitioning.md)


<!--Image references-->
[ScaleupDownPSOut]: ./media/service-fabric-cluster-scale-up-down/ScaleupDownPSOut.png
