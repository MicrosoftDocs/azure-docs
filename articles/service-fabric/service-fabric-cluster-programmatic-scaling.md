---
title: Azure Service Fabric Programmatic Scaling | Microsoft Docs
description: Scale an Azure Service Fabric cluster in or out programmatically, according to custom triggers
services: service-fabric
documentationcenter: .net
author: mjrousos
manager: jonjung
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/23/2018
ms.author: mikerou

---

# Scale a Service Fabric cluster programmatically 

Service Fabric clusters running in Azure are built on top of virtual machine scale sets.  [Cluster scaling](./service-fabric-cluster-scale-up-down.md) describes how Service Fabric clusters can be scaled either manually or with auto-scale rules. This article describes how to manage credentials and scale a cluster in or out using the fluent Azure compute SDK, which is a more advanced scenario. For an overview, read [programmatic methods of coordinating Azure scaling operations](service-fabric-cluster-scaling.md#programmatic-scaling). 


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Manage credentials
One challenge of writing a service to handle scaling is that the service must be able to access virtual machine scale set resources without an interactive login. Accessing the Service Fabric cluster is easy if the scaling service is modifying its own Service Fabric application, but credentials are needed to access the scale set. To sign in, you can use a [service principal](https://docs.microsoft.com/cli/azure/create-an-azure-service-principal-azure-cli) created with the [Azure CLI](https://github.com/azure/azure-cli).

A service principal can be created with the following steps:

1. Sign in to the Azure CLI (`az login`) as a user with access to the virtual machine scale set
2. Create the service principal with `az ad sp create-for-rbac`
	1. Make note of the appId (called 'client ID' elsewhere), name, password, and tenant for later use.
	2. You will also need your subscription ID, which can be viewed with `az account list`

The fluent compute library can sign in using these credentials as follows (note that core fluent Azure types like `IAzure` are in the [Microsoft.Azure.Management.Fluent](https://www.nuget.org/packages/Microsoft.Azure.Management.Fluent/) package):

```csharp
var credentials = new AzureCredentials(new ServicePrincipalLoginInformation {
                ClientId = AzureClientId,
                ClientSecret = 
                AzureClientKey }, AzureTenantId, AzureEnvironment.AzureGlobalCloud);
IAzure AzureClient = Azure.Authenticate(credentials).WithSubscription(AzureSubscriptionId);

if (AzureClient?.SubscriptionId == AzureSubscriptionId)
{
    ServiceEventSource.Current.ServiceMessage(Context, "Successfully logged into Azure");
}
else
{
    ServiceEventSource.Current.ServiceMessage(Context, "ERROR: Failed to login to Azure");
}
```

Once logged in, scale set instance count can be queried via `AzureClient.VirtualMachineScaleSets.GetById(ScaleSetId).Capacity`.

## Scaling out
Using the fluent Azure compute SDK, instances can be added to the virtual machine scale set with just a few calls -

```csharp
var scaleSet = AzureClient.VirtualMachineScaleSets.GetById(ScaleSetId);
var newCapacity = (int)Math.Min(MaximumNodeCount, scaleSet.Capacity + 1);
scaleSet.Update().WithCapacity(newCapacity).Apply(); 
``` 

Alternatively, virtual machine scale set size can also be managed with PowerShell cmdlets. [`Get-AzVmss`](https://docs.microsoft.com/powershell/module/az.compute/get-azvmss) can retrieve the virtual machine scale set object. The current capacity is available through the `.sku.capacity` property. After changing the capacity to the desired value, the virtual machine scale set in Azure can be updated with the [`Update-AzVmss`](https://docs.microsoft.com/powershell/module/az.compute/update-azvmss) command.

As when adding a node manually, adding a scale set instance should be all that's needed to start a new Service Fabric node since the scale set template includes extensions to automatically join new instances to the Service Fabric cluster. 

## Scaling in

Scaling in is similar to scaling out. The actual virtual machine scale set changes are practically the same. But, as was discussed previously, Service Fabric only automatically cleans up removed nodes with a durability of Gold or Silver. So, in the Bronze-durability scale-in case, it's necessary to interact with the Service Fabric cluster to shut down the node to be removed and then to remove its state.

Preparing the node for shutdown involves finding the node to be removed (the most recently added virtual machine scale set instance) and deactivating it. Virtual machine scale set instances are numbered in the order they are added, so newer nodes can be found by comparing the number suffix in the nodes' names (which match the underlying virtual machine scale set instance names). 

```csharp
using (var client = new FabricClient())
{
	var mostRecentLiveNode = (await client.QueryManager.GetNodeListAsync())
	    .Where(n => n.NodeType.Equals(NodeTypeToScale, StringComparison.OrdinalIgnoreCase))
	    .Where(n => n.NodeStatus == System.Fabric.Query.NodeStatus.Up)
        .OrderByDescending(n =>
        {
            var instanceIdIndex = n.NodeName.LastIndexOf("_");
            var instanceIdString = n.NodeName.Substring(instanceIdIndex + 1);
            return int.Parse(instanceIdString);
        })
	    .FirstOrDefault();
```

Once the node to be removed is found, it can be deactivated and removed using the same `FabricClient` instance and the `IAzure` instance from earlier.

```csharp
var scaleSet = AzureClient.VirtualMachineScaleSets.GetById(ScaleSetId);

// Remove the node from the Service Fabric cluster
ServiceEventSource.Current.ServiceMessage(Context, $"Disabling node {mostRecentLiveNode.NodeName}");
await client.ClusterManager.DeactivateNodeAsync(mostRecentLiveNode.NodeName, NodeDeactivationIntent.RemoveNode);

// Wait (up to a timeout) for the node to gracefully shutdown
var timeout = TimeSpan.FromMinutes(5);
var waitStart = DateTime.Now;
while ((mostRecentLiveNode.NodeStatus == System.Fabric.Query.NodeStatus.Up || mostRecentLiveNode.NodeStatus == System.Fabric.Query.NodeStatus.Disabling) &&
        DateTime.Now - waitStart < timeout)
{
    mostRecentLiveNode = (await client.QueryManager.GetNodeListAsync()).FirstOrDefault(n => n.NodeName == mostRecentLiveNode.NodeName);
    await Task.Delay(10 * 1000);
}

// Decrement VMSS capacity
var newCapacity = (int)Math.Max(MinimumNodeCount, scaleSet.Capacity - 1); // Check min count 

scaleSet.Update().WithCapacity(newCapacity).Apply(); 
```

As with scaling out, PowerShell cmdlets for modifying virtual machine scale set capacity can also be used here if a scripting approach is preferable. Once the virtual machine instance is removed, Service Fabric node state can be removed.

```csharp
await client.ClusterManager.RemoveNodeStateAsync(mostRecentLiveNode.NodeName);
```

## Next steps

To get started implementing your own auto-scaling logic, familiarize yourself with the following concepts and useful APIs:

- [Scaling manually or with auto-scale rules](./service-fabric-cluster-scale-up-down.md)
- [Fluent Azure Management Libraries for .NET](https://github.com/Azure/azure-sdk-for-net/tree/Fluent) (useful for interacting with a Service Fabric cluster's underlying virtual machine scale sets)
- [System.Fabric.FabricClient](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient) (useful for interacting with a Service Fabric cluster and its nodes)
