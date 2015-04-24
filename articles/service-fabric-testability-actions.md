<properties
   pageTitle="Testability Action."
   description="This article talks about the testability actions found in ServiceFabric."
   services="service-fabric"
   documentationCenter=".net"
   authors="heeldin","motanv"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/17/2014"
   ms.author="heeldin,motanv"/>

# Testability actions

Testability actions are the low level APIs that cause a specific fault injection, state transition or validation. Combining these actions, a service developer can write comprehensive test scenarios for your services.

Service Fabric provides some common test scenarios out of the box composed of these actions. It is highly recommended to utilize these built-in scenarios, which are carefully chosen to test common state transitions and failures case. However, actions can be used to create custom test scenarios when you want to add coverage for scenarios that are either not covered by the built-in scenarios yet or custom tailored for your application.

Actions are found in the System.Fabric.Testability.dll assembly.

The Testability powershell module is found in the Microsoft.ServiceFabric.Testability.Powershell.dll assembly.

## Testability actions list

| Actions | Description | Managed API | Powershell Cmdlet | Gracefull/UnGracefull Faults |
|---------|-------------|-------------|-------------------|------------------------------|
|CleanTestState| Removes all the test state from the cluster in case of a bad shutdown of the test driver. | CleanTestStateAsync | Remove-ServiceFabricTestState | Gracefull |
| InvokeDataLoss | Induces data loss into a service partition. | InvokeDataLossAsync | Invoke-ServiceFabricPartitionDataLoss | Gracefull |
| InvokeQuorumLoss | Puts a given stateful service partition in to quorum loss. | InvokeQuorumLossAsync | Invoke-ServiceFabricQuorumLoss | Gracefull |
| Move Primary | Moves the specified primary replica of stateful service to the specified cluster node. | MovePrimaryAsync | Move-ServiceFabricPrimaryReplica | Gracefull |
| Move Secondary | Moves the current secondary replica of a stateful service to a different cluster node. | MoveSecondaryAsync | Move-ServiceFabricSecondaryReplica | Gracefull |
| RemoveReplica | Simulates a replica failure by removing a replica from a cluster. This will close the replica and will transition it to role 'None', removing all of its state from the cluster. | RemoveReplicaAsync | Remove-ServiceFabricReplica | Gracefull |
| RestartDeployedCodePackage | Simulates a code package process failure by restarting a code package deployed on a node in a cluster. This aborts the code package process which will restart all the user service replicas hosted in that process. | RestartDeployedCodePackageAsync | Restart-ServiceFabricDeployedCodePackage | UnGracefull |
| RestartNode | Simulates a Service Fabric cluster node failure by restarting a node. | RestartNodeAsync | Restart-ServiceFabricNode | UnGracefull |
| RestartPartition | Simulates a data center blackout or cluster blackout scenario by restarting some or all replicas of a partition. | RestartPartitionAsync | Restart-ServiceFabricPartition | Gracefull |
| RestartReplica | Simulates a replica failure by restarting a persisted replica in a cluster, closing the replica and then reopening it. | RestartReplicaAsync | Restart-ServiceFabricReplica | Gracefull |
| StartNode | Starts a node in a cluster which is already stopped. | StartNodeAsync | Start-ServiceFabricNode | Gracefull |
| StopNode | Simulates a node failure by stopping a node in a cluster. The node will stay down until StartNode is called. | StopNodeAsync | Stop-ServiceFabricNode | Gracefull |
| ValidateApplication | Validates the availability and health of all Service Fabric services within an application, usually after inducing some fault into the system. | ValidateApplicationAsync | Test-ServiceFabricApplication | Gracefull |
| ValidateService | Validates the availability and health of a Service Fabric service, usually after inducing some fault into the system. | ValidateServiceAsync | Test-ServiceFabricService | Gracefull |



## Running a testability action with Powershell

This tutorial shows you how to run a Testability action with PowerShell. You will learn how to run a Testability action against a Local (aka. one-box) cluster or an Azure cluster. Microsoft.Fabric.Testability.Powershell.dll - the Testability PowerShell module - is installed automatically when you install the Microsoft Service Fabric MSI; and, the module is loaded automatically when you open a PowerShell prompt.

Tutorial segments:

- [Run an action against a one-box cluster](#onebox_action)
- [Run an action against an azure cluster](#azure_action)

### Run an action against a one-box cluster

To run a Testability action against a Local Cluster, first you need to connect to the cluster and you should open the PowerShell prompt in administrator mode. Let us look at the **Restart-ServiceFabricNode** action.

    Restart-ServiceFabricNode -NodeName Node1 -CompletionMode DoNotVerify

Here the action **Restart-ServiceFabricNode** is being run on a node named "Node1" and the completion mode specifies that it should not verify whether the restart action actually succeeded; specifying the completion mode as "Verify" will cause it to verify whether the restart action actually succeeded. Instead of directly specifying the node by its name, you can specify via a partition key and the kind of replica, as follows:

    Restart-ServiceFabricNode -ReplicaKindPrimary  -PartitionKindNamed
    -PartitionKey Partition3 -CompletionMode Verify

**Restart-ServiceFabricNode** should be used to restart a service fabric node in a cluster. This will kill the Fabric.exe process which will restart all of the system service and user service replicas hosted on that node. Using this API to test your service helps uncover bugs along the failover recovery paths. It helps simulate node failures in the cluster.

The following screenshot shows the **Restart-ServiceFabricNode** Testability command in action.

![](media/service-fabric-testability-action/Restart-ServiceFabricNode.png)

The output of the first *Get-ServiceFabricNode* (a cmdlet from the ServiceFabric PowerShell module) shows that the local cluster has five nodes: Node.1 to Node.5; then after executing the Testability action (cmdlet) **Restart-ServiceFabricNode** on the node, named Node.4, we see that the node's uptime has been reset.

### Run an action against an azure cluster

Running a Testability action (with PowerShell) against an Azure Cluster is similar to running the action against a local cluster; only difference being: before you can run the action, instead of connecting to the local cluster, you need to connect to the Azure Cluster first.


### Further examples of using an action in powershell
Two examples will be viewed in this section, RestartReplica and InvokeQuorumLoss.

#### RestartReplica action
```powershell
Connect-ServiceFabricCluster -testMode

Restart-ServiceFabricReplica -serviceName fabric:/app/svc -longPartitionKey 17 -selectPrimary
```

#### InvokeQuorumLoss action
```powershell
Connect-ServiceFabricCluster -testMode

Invoke-ServiceFabricPartitionQuorumLoss -serviceName fabric:/app/svc -randomPartition
```

## Running a Testability action with C# 

To run a Testability action using C#, first you need to connect to the cluster using the FabricClient. Then obtain the parameters needed to run the action.
Let us look at the RestartServiceFabricNode action:

```C#
RestartNodeAsync(nodeName, nodeInstanceId, completeMode, operationTimeout, CancellationToken.None)
```
Here, RestartServiceFabricNode uses nodeName in order to be executed.

<u>Several parameter explaination</u> :

<b>CompleteMode</b> - completion mode specifies that it should not verify whether the restart action actually succeeded; specifying the completion mode as "Verify" will cause it to verify whether the restart action actually succeeded.  
<b>OperationTimeout</b> - sets the amount of time for the operation to finish before a TimeoutException exception is thrown.
<b>CancellationToken</b> - enables a pending call to be canceled.

Instead of directly specifying the node by its name, you can specify via a partition key and the kind of replica.

For further information see [Partition Selector and Replica Selector](#partition_replica_selector).


```C#
using System.Fabric.Testability;

public void RestartNode(string[] gatewayAddress, Uri serviceName, string nodeName, BigInteger nodeInstanceId, TimeSpan operationTimeout, CompletionMode completeMode)
{
    FabricClient fabricclient = new FabricClient(gatewayAddress);

    //RestartServiceFabricNode using NodeName
    fabricclient.ClusterManager.RestartNodeAsync(nodeName, nodeInstanceId, completeMode, operationTimeout, CancellationToken.None).Wait();

    //RestartNode using ReplicaSelector
    PartitionSelector ps = PartitionSelector.RandomOf(serviceName);
    ReplicaSelector rs = ReplicaSelector.PrimaryOf(ps);
    fabricclient.ClusterManager.RestartNodeAsync(rs, completeMode);
    fabclient.ClusterManager.RestartNodeAsync(rs, completeMode).Wait();

}

```


### Furthur examples of using an action in C#

#### RestartReplica action
```C#
fabricclient.ClusterManager.RestartReplicaAsync(replicaSelector, completionMode).Wait();

```

#### InvokeQuorumLoss action

```C#
fabricclient.ClusterManager.InvokeQuorumLossAsync(serviceName, partitionSelector).Wait();

```

## Partition Selector and Replica Selector

### Partition Selector
PartitionSelector is a helper exposed in Testability and is used to select a specific partition on which to perform any of the Testability actions. It can be used to select a specific partition if the partition ID is known beforehand. Or, you can provide the partition key and the operation will resolve the partition ID internally. You also have the option of selecting a random partition.

To use, create the PartitionSelector object and select the partition using one of the Select* methods and then pass in the PartitionSelector object to the API that requires it. If no option is selected it defaults to random partition.

```C#
Uri serviceName = new Uri("fabric:/samples/InMemoryToDoListApp/InMemoryToDoListService");
Guid partitionIdGuid = new Guid("8fb7ebcc-56ee-4862-9cc0-7c6421e68829");
string partitionName = "Partition1";
Int64 partitionKeyUniformInt64 = 1;

// Select Random partition
PartitionSelector randomPartitionSelector = PartitionSelector.RandomOf(serviceName);

// Select partition based on Id
PartitionSelector partitionSelectorById = PartitionSelector.PartitionIdOf(serviceName, partitionIdGuid);

// Select partition based on name
PartitionSelector namedPartitionSelector = PartitionSelector.PartitionKeyOf(serviceName, partitionName);

// Select partition based on partition key
PartitionSelector uniformIntPartitionSelector = PartitionSelector.PartitionKeyOf(serviceName, partitionKeyUniformInt64);
```

### Replica Selector
ReplicaSelector is a helper exposed in Testability and is used to help select a replica on which to perform any of the Testability actions. It can be used to select a specific replica if the replica id is known beforehand. In addition, you have the option of selecting a primary replica or a random secondary as well. ReplicaSelector derives from PartitionSelector, so you need to select both the replica and the partition on which you wish to perform the Testability operation.

To use, create a ReplicaSelector object and set the way you want to select the replica and the partition. You can then pass it into the API that requires it. If no option is selected it defaults to random replica and random partition.

```C#
Guid partitionIdGuid = new Guid("8fb7ebcc-56ee-4862-9cc0-7c6421e68829");
PartitionSelector partitionSelector = PartitionSelector.PartitionIdOf(serviceName, partitionIdGuid);
long replicaId = 130559876481875498;

// Select Random replica
ReplicaSelector randomReplicaSelector = ReplicaSelector.RandomOf(partitionSelector);

// Select primary replica
ReplicaSelector primaryReplicaSelector = ReplicaSelector.PrimaryOf(partitionSelector);

// Select replica by Id
ReplicaSelector replicaByIdSelector = ReplicaSelector.ReplicaIdOf(partitionSelector, replicaId);

// Select random secondary replica
ReplicaSelector secondaryReplicaSelector = ReplicaSelector.RandomSecondaryOf(partitionSelector);
```
