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
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/10/2017
ms.author: mikerou

---

# Scale a Service Fabric cluster programmatically 

Fundamentals of scaling a Service Fabric cluster in Azure are covered in documentation on [cluster scaling](./service-fabric-cluster-scale-up-down.md). That article covers how Service Fabric clusters are built on top of virtual machine scale sets and can be scaled either manually or with auto-scale rules. This document looks at programmatic methods of coordinating Azure scaling operations for more advanced scenarios. 

## Reasons for programmatic scaling
In many scenarios, scaling manually or via auto-scale rules are good solutions. In other scenarios, though, they may not be the right fit. Potential drawbacks to these approaches include:

- Manually scaling requires you to log in and explicitly request scaling operations. If scaling operations are required frequently or at unpredictable times, this approach may not be a good solution.
- When auto-scale rules remove an instance from a virtual machine scale set, they do not automatically remove knowledge of that node from the associated Service Fabric cluster unless the node type has a durability level of Silver or Gold. Because auto-scale rules work at the scale set level (rather than at the Service Fabric level), auto-scale rules can remove Service Fabric nodes without shutting them down gracefully. This rude node removal will leave 'ghost' Service Fabric node state behind after scale-in operations. An individual (or a service) would need to periodically clean up removed node state in the Service Fabric cluster.
  - Note that a node type with a durability level of Gold or Silver will automatically clean up removed nodes.  
- Although there are [many metrics](../monitoring-and-diagnostics/insights-autoscale-common-metrics.md) supported by auto-scale rules, it is still a limited set. If your scenario calls for scaling based on some metric not covered in that set, then auto-scale rules may not be a good option.

Based on these limitations, you may wish to implement more customized automatic scaling models. 

## Scaling APIs
Azure APIs exist which allow applications to programmatically work with virtual machine scale sets and Service Fabric clusters. If existing auto-scale options don't work for your scenario, these APIs make it possible to implement custom scaling logic. 

One approach to implementing this 'home-made' auto-scaling functionality is to add a new stateless service to the Service Fabric application to manage scaling operations. Within the service's `RunAsync` method, a set of triggers can determine if scaling is required (including checking parameters such as maximum cluster size and scaling cooldowns).   

The API used for virtual machine scale set interactions (both to check the current number of virtual machine instances and to modify it) is the fluent [Azure Management Compute library](https://www.nuget.org/packages/Microsoft.Azure.Management.Compute.Fluent/1.0.0-beta50). The fluent compute library provides an easy-to-use API for interacting with virtual machine scale sets.

To interact with the Service Fabric cluster itself, use [System.Fabric.FabricClient](/dotnet/api/system.fabric.fabricclient).

Of course, the scaling code doesn't need to run as a service in the cluster to be scaled. Both `IAzure` and `FabricClient` can connect to their associated Azure resources remotely, so the scaling service could easily be a console application or Windows service running from outside the Service Fabric application. 

## Credential management
One challenge of writing a service to handle scaling is that the service must be able to access virtual machine scale set resources without an interactive login. Accessing the Service Fabric cluster is easy if the scaling service is modifying its own Service Fabric application, but credentials are needed to access the scale set. To log in, you can use a [service principal](https://github.com/Azure/azure-sdk-for-net/blob/Fluent/AUTH.md#creating-a-service-principal-in-azure) created with the [Azure CLI 2.0](https://github.com/azure/azure-cli).

A service principal can be created with the following steps:

1. Log in to the Azure CLI (`az login`) as a user with access to the virtual machine scale set
2. Create the service principal with `az ad sp create-for-rbac`
	1. Make note of the appId (called 'client ID' elsewhere), name, password, and tenant for later use.
	2. You will also need your subscription ID, which can be viewed with `az account list`

The fluent compute library can log in using these credentials as follows:

```C#
var credentials = AzureCredentials.FromServicePrincipal(AzureClientId, AzureClientKey, AzureTenantId, AzureEnvironment.AzureGlobalCloud);
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

```C#
var scaleSet = AzureClient?.VirtualMachineScaleSets.GetById(ScaleSetId);
var newCapacity = Math.Min(MaximumNodeCount, NodeCount.Value + 1);
scaleSet.Update().WithCapacity(newCapacity).Apply(); 
``` 

**There is currently [a bug](https://github.com/Azure/azure-sdk-for-net/issues/2716) that keeps this code from working**, but a fix has been merged, so the issue should be resolved in published versions of Microsoft.Azure.Management.Compute.Fluent soon. The bug is that when changing virtual machine scale set properties (like capacity) with the fluent compute API, protected settings from the scale set's Resource Manager template are lost. These missing settings cause (among other things) Service Fabric services to not set up properly on new virtual machine instances.

As a temporary workaround, PowerShell cmdlets can be invoked from the scaling service to enact the same change (though this route means that PowerShell tools must be present):

```C#
using (var psInstance = PowerShell.Create())
{
    psInstance.AddScript($@"
        $clientId = ""{AzureClientId}""
        $clientKey = ConvertTo-SecureString -String ""{AzureClientKey}"" -AsPlainText -Force
        $Credential = New-Object -TypeName ""System.Management.Automation.PSCredential"" -ArgumentList $clientId, $clientKey
        Login-AzureRmAccount -Credential $Credential -ServicePrincipal -TenantId {AzureTenantId}
        
        $vmss = Get-AzureRmVmss -ResourceGroupName {ResourceGroup} -VMScaleSetName {NodeTypeToScale}
        $vmss.sku.capacity = {newCapacity}
        Update-AzureRmVmss -ResourceGroupName {ResourceGroup} -Name {NodeTypeToScale} -VirtualMachineScaleSet $vmss
    ");

    psInstance.Invoke();

    if (psInstance.HadErrors)
    {
        foreach (var error in psInstance.Streams.Error)
        {
            ServiceEventSource.Current.ServiceMessage(Context, $"ERROR adding node: {error.ToString()}");
        }
    }                
}
```

As when adding a node manually, adding a scale set instance should be all that's needed to start a new Service Fabric node since the scale set template includes extensions to automatically join new instances to the Service Fabric cluster. 

## Scaling in

Scaling in is similar to scaling out. The actual virtual machine scale set changes are practically the same. But, as was discussed previously, Service Fabric only automatically cleans up removed nodes with a durability of Gold or Silver. So, in the Bronze-durability scale-in case, it's necessary to interact with the Service Fabric cluster to shut down the node to be removed and then to remove its state.

Preparing the node for shutdown involves finding the node to be removed (the most recently added node) and deactivating it. For non-seed nodes, newer nodes can be found by comparing `NodeInstanceId`. 

```C#
using (var client = new FabricClient())
{
	var mostRecentLiveNode = (await client.QueryManager.GetNodeListAsync())
	    .Where(n => n.NodeType.Equals(NodeTypeToScale, StringComparison.OrdinalIgnoreCase))
	    .Where(n => n.NodeStatus == System.Fabric.Query.NodeStatus.Up)
	    .OrderByDescending(n => n.NodeInstanceId)
	    .FirstOrDefault();
```

Be aware that *seed* nodes don't seem to always follow the convention that greater instance IDs are removed first.

Once the node to be removed is found, it can be deactivated and removed using the same `FabricClient` instance and the `IAzure` instance from earlier.

```C#
var scaleSet = AzureClient?.VirtualMachineScaleSets.GetById(ScaleSetId);

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
var newCapacity = Math.Max(MinimumNodeCount, NodeCount.Value - 1); // Check min count 

scaleSet.Update().WithCapacity(newCapacity).Apply(); 
```

Once the virtual machine instance is removed, Service Fabric node state can be removed.

```C#
await client.ClusterManager.RemoveNodeStateAsync(mostRecentLiveNode.NodeName);
```

As before, you need to work around `IVirtualMachineScaleSet.Update()` not working until [Azure/azure-sdk-for-net#2716](https://github.com/Azure/azure-sdk-for-net/issues/2716) is addressed.

## Potential drawbacks

As demonstrated in the preceding code snippets, creating your own scaling service provides the highest degree of control and customizability over your application's scaling behavior. This can be useful for scenarios requiring precise control over when or how an application scales in or out. However, this control comes with a tradeoff of code complexity. Using this approach means that you need to own scaling code, which is non-trivial.

How you should approach Service Fabric scaling depends on your scenario. If scaling is uncommon, the ability to add or remove nodes manually is probably sufficient. For more complex scenarios, auto-scale rules and SDKs exposing the ability to scale programmatically offer powerful alternatives.

## Next steps

To get started implementing your own auto-scaling logic, familiarize yourself with the following concepts and useful APIs:

- [Scaling manually or with auto-scale rules](./service-fabric-cluster-scale-up-down.md)
- [Fluent Azure Management Libraries for .NET](https://github.com/Azure/azure-sdk-for-net/tree/Fluent) (useful for interacting with a Service Fabric cluster's underlying virtual machine scale sets)
- [System.Fabric.FabricClient](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient) (useful for interacting with a Service Fabric cluster and its nodes)