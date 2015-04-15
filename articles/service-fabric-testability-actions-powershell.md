<properties
   pageTitle="getting-started-with-microsoft-azure-service-fabric-testability-actions-using-powershell"
   description="The tutorial shows how to run a Testability action with PowerShell."
   services="service-fabric"
   documentationCenter=""
   authors="motanv"
   manager="rsinha"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="multiple"
   ms.date="04/13/2015"
   ms.author="motanv"/>

# Running a Testability Action with PowerShell

This tutorial shows you how to run a Testability action with PowerShell. You will learn how to run a Testability action against a Local (aka. one-box) cluster or an Azure cluster. Microsoft.Fabric.Testability.Powershell.dll - the Testability PowerShell module - is installed automatically when you install the Microsoft Service Fabric MSI; and, the module is loaded automatically when you open a PowerShell prompt.

Tutorial segments:

- [Run an Action Against a Local Cluster](#onebox_action)
- [Run an Action Against an Azure Cluster](#azure_action)

##<a name="onebox_action"></a>Run an Action Against a One-box Cluster

To run a Testability action against a Local Cluster, first you need to connect to the cluster and you should open the PowerShell prompt in administrator mode. Let us look at the **Restart-ServiceFabricNode** action.

    Restart-ServiceFabricNode -NodeName Node1 -CompletionMode DoNotVerify

Here the action **Restart-ServiceFabricNode** is being run on a node named "Node1" and the completion mode specifies that it should not verify whether the restart action actually succeeded; specifying the completion mode as "Verify" will cause it to verify whether the restart action actually succeeded. Instead of directly specifying the node by its name, you can specify via a partition key and the kind of replica, as follows:

    Restart-ServiceFabricNode -ReplicaKindPrimary  -PartitionKindNamed
    -PartitionKey Partition3 -CompletionMode Verify

**Restart-ServiceFabricNode** should be used to restart a service fabric node in a cluster. This will kill the Fabric.exe process which will restart all of the system service and user service replicas hosted on that node. Using this API to test your service helps uncover bugs along the failover recovery paths. It helps simulate node failures in the cluster.

The following screenshot shows the **Restart-ServiceFabricNode** Testability command in action.

![](media/service-fabric-testability-powershell-action/Restart-ServiceFabricNode.png)

The output of the first *Get-ServiceFabricNode* (a cmdlet from the ServiceFabric PowerShell module) shows that the local cluster has five nodes: Node.1 to Node.5; then after executing the Testability action (cmdlet) **Restart-ServiceFabricNode** on the node, named Node.4, we see that the node's uptime has been reset.

##<a name="azure_action"></a>Run an Action Against an Azure Cluster

Running a Testability action (with PowerShell) against an Azure Cluster is similar to running the action against a local cluster; only difference being: before you can run the action, instead of connecting to the local cluster, you need to connect to the Azure Cluster first.

##Conclusion
In this tutorial, you ran the Testability action: Restart-ServiceFabricNode with PowerShell against a local cluster and an azure cluster and observed the effect of the action.
