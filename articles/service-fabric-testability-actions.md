<properties
   pageTitle="Testability Action."
   description="This article talks about the testability actions found in ServiceFabric."
   documentationCenter=".net"
   authors="heeldin"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/17/2014"
   ms.author="heeldin"/>

#Testability Actions

Testability actions are the low level APIs that cause a specific fault injection, state transition or validation. Combining these actions, a service developer can write comprehensive test scenarios for your services.

Service Fabric provides some common test scenarios out of the box composed of these actions. It is highly recommended to utilize these built-in scenarios, which are carefully chosen to test common state transitions and failures case. However, actions can be used to create custom test scenarios when you want to add coverage for scenarios that are either not covered by the built-in scenarios yet or custom tailored for your application.

Actions are found in the System.Fabric.Testability.dll assembly.

## Testability Actions in Powershell and C# :

The Testability powershell module is found in the Microsoft.ServiceFabric.Testability.Powershell.dll assembly.

Testability Actions:

<table>
  <tr>
    <td><b>Actions</b></td>
    <td><b>Description</b></td>
    <td><b>Managed API</b></td>
    <td><b>Powershell Cmdlet</b></td>
  </tr>
  <tr>
    <td>CleanTestState</td>
    <td>Removes all the test state from the cluster in case of a bad shutdown of the test driver.</td>
    <td>CleanTestStateAsync</td>
    <td>Remove-ServiceFabricTestState</td>
  </tr>
  <tr>
    <td>InvokeDataLoss</td>
    <td>Induces data loss into a service partition.</td>
    <td>InvokeDataLossAsync</td>
    <td>Invoke-ServiceFabricPartitionDataLoss</td>
  </tr>
  <tr>
    <td>InvokeQuorumLoss</td>
    <td>Puts a given stateful service partition in to quorum loss.</td>
    <td>InvokeQuorumLossAsync</td>
    <td>Invoke-ServiceFabricQuorumLoss</td>
  </tr>
  <tr>
    <td>Move Primary</td>
    <td>Moves the specified primary replica of stateful service to the specified cluster node.</td>
    <td>MovePrimaryAsync</td>
    <td>Move-ServiceFabricPrimaryReplica</td>
  </tr>
  <tr>
    <td>Move Secondary</td>
    <td>Moves the current secondary replica of a stateful service to a different cluster node.</td>
    <td>MoveSecondaryAsync</td>
    <td>Move-ServiceFabricSecondaryReplica</td>
  </tr>
  <tr>
    <td>RemoveReplica</td>
    <td>Simulates a replica failure by removing a replica from a cluster. This will close the replica and will transition it to role 'None', removing all of its state from the cluster.</td>
    <td>RemoveReplicaAsync</td>
    <td>Remove-ServiceFabricReplica</td>
  </tr>
  <tr>
    <td>RestartDeployedCodePackage</td>
    <td>Simulates a code package process failure by restarting a code package deployed on a node in a cluster. This aborts the code package process which will restart all the user service replicas hosted in that process.</td>
    <td>RestartDeployedCodePackageAsync</td>
    <td>Restart-ServiceFabricDeployedCodePackage</td>
  </tr>
  <tr>
    <td>RestartNode</td>
    <td>Simulates a Service Fabric cluster node failure by restarting a node.</td>
    <td>RestartNodeAsync</td>
    <td>Restart-ServiceFabricNode</td>
  </tr>
  <tr>
    <td>RestartPartition</td>
    <td>Simulates a data center blackout or cluster blackout scenario by restarting some or all replicas of a partition.</td>
    <td>RestartPartitionAsync</td>
    <td>Restart-ServiceFabricPartition</td>
  </tr>
  <tr>
    <td>RestartReplica</td>
    <td>Simulates a replica failure by restarting a persisted replica in a cluster, closing the replica and then reopening it.</td>
    <td>RestartReplicaAsync</td>
    <td>Restart-ServiceFabricReplica</td>
  </tr>
  <tr>
    <td>StartNode</td>
    <td>Starts a node in a cluster which is already stopped.</td>
    <td>StartNodeAsync</td>
    <td>Start-ServiceFabricNode</td>
  </tr>
  <tr>
    <td>StopNode</td>
    <td>Simulates a node failure by stopping a node in a cluster. The node will stay down until StartNode is called.</td>
    <td>StopNodeAsync</td>
    <td>Stop-ServiceFabricNode</td>
  </tr>
  <tr>
    <td>ValidateApplication</td>
    <td>Validates the availability and health of all Service Fabric services within an application, usually after inducing some fault into the system.</td>
    <td>ValidateApplicationAsync</td>
    <td>Test-ServiceFabricApplication</td>
  </tr>
  <tr>
    <td>ValidateService</td>
    <td>Validates the availability and health of a Service Fabric service, usually after inducing some fault into the system.</td>
    <td>ValidateServiceAsync</td>
    <td>Test-ServiceFabricService</td>
  </tr>
</table>

## Example of using an action in powershell:
Two examples will be viewed in this section, RestartReplica and InvokeQuorumLoss.

####RestartReplica Action:
```
Connect-ServiceFabricCluster -testMode

Restart-ServiceFabricReplica -serviceName fabric:/app/svc -longPartitionKey 17 -selectPrimary
```

###InvokeQuorumLoss:
```
Connect-ServiceFabricCluster -testMode

Invoke-ServiceFabricPartitionQuorumLoss -serviceName fabric:/app/svc -randomPartition
```

## Example of using an action in C# :

###RestartReplica Action:
```
using System.Fabric.Testability;
…
FabricClient client = new FabricClient(Mode.TestMode);
var partitionSelector = new PartitionSelector(serviceName);
partitionSelector.SelectRandomPartition();

var replicaSelector = GetReplicaSelector(ps);
replicaSelector.PrimaryOf(ps)
replicaSelector.RandomSecondaryOf(ps);
await Client.RestartReplicaAsync(replicaSelector, completionMode);
```

###InvokeQuorumLoss:

```
using System.Fabric.Testability;
…
FabricClient client = new FabricClient(ClientMode.TestMode);
Uri serviceName = new Uri("fabric:/app/svc")
var partitionSelector = new PartitionSelector(serviceName);
partitionSelector.SelectRandomPartition();
Await Client.TestManager.InvokeQuorumLossAsync(serviceName, partitionSelector);
```

#Partition Selector and Replica Selector:

##Partition Selector:
PartitionSelector is a helper exposed in Testability and is used to select a specific partition on which to perform any of the Testability actions. It can be used to select a specific partition if the partition ID is known beforehand. Or, you can provide the partition key and the operation will resolve the partition ID internally. You also have the option of selecting a random partition.

To use, create the PartitionSelector object and select the partition using one of the Select* methods and then pass in the PartitionSelector object to the API that requires it. If no option is selected it defaults to random partition.

```
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

##Replica Selector:
ReplicaSelector is a helper exposed in Testability and is used to help select a replica on which to perform any of the Testability actions. It can be used to select a specific replica if the replica id is known beforehand. In addition, you have the option of selecting a primary replica or a random secondary as well. ReplicaSelector derives from PartitionSelector, so you need to select both the replica and the partition on which you wish to perform the Testability operation.

To use, create a ReplicaSelector object and set the way you want to select the replica and the partition. You can then pass it into the API that requires it. If no option is selected it defaults to random replica and random partition.

```
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
