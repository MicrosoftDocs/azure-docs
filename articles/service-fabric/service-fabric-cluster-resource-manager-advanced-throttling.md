<properties
   pageTitle="Throttling in the Service Fabric cluster resource manager | Microsoft Azure"
   description="Learn to configure the throttles provided by the Service Fabric Cluster Resource Manager."
   services="service-fabric"
   documentationCenter=".net"
   authors="masnider"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/20/2016"
   ms.author="masnider"/>


# Throttling the behavior of the Service Fabric cluster resource manager
Sometimes, even if you’ve configured the resource manager correctly, the cluster can get disrupted (many node or fault domain failures, while upgrades are going on, while updates are being applied, etc). The Resource Manager will try its best to fix everything, but in times like this you may want to consider a backstop so that the cluster itself has a chance to stabilize (the nodes which are going to come back come back, the network conditions health themselves, corrected bits get deployed). To help with these sorts of situations, the Resource Manager does include several throttles. Note that these are fairly “big hammers” and generally shouldn’t be used unless there’s been some careful math done around the amount of parallel work that can actually be done in the cluster, as well as a frequent need to respond to these sorts of (ahem) unplanned macroscopic reconfiguration events (AKA: “Very Bad Days”).

Generally, we recommend avoiding very bad days through other options (like regular code updates and avoiding overscheduling the cluster to begin with) rather than throttling your cluster to prevent it from using resources when it is trying to fix itself). That said you may determine that there are cases which (until you can remedy them) where you need to have a couple of throttles in place, even if it means the cluster will take longer to stabilize.

##Configuring the throttles
The throttles that are included by default are:

-	GlobalMovementThrottleThreshold – this controls the total number of movements in the cluster over some time (defined as the GlobalMovementThrottleCountingInterval, value in seconds)
-	MovementPerPartitionThrottleThreshold – this controls the total number of movements for any service partition over some time (the MovementPerPartitionThrottleCountingInterval, value in seconds)

``` xml
<Section Name="PlacementAndLoadBalancing">
     <Parameter Name="GlobalMovementThrottleThreshold" Value="1000" />
     <Parameter Name="GlobalMovementThrottleCountingInterval" Value="600" />
     <Parameter Name="MovementPerPartitionThrottleThreshold" Value="50" />
     <Parameter Name="MovementPerPartitionThrottleCountingInterval" Value="600" />
</Section>
```

Be aware that most of the time we’ve seen customers use these throttles it has been because	they were already in a resource constrained environment (such as limited network bandwidth into individual nodes) which meant that such operations wouldn’t succeed or would be slow anyway and the customers were comfortable knowing that they were potentially extending the amount of time it would take the cluster to reach a stable state, including knowing that they could end up running at a lower overall reliability while they were throttled.

## Next steps
- To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
- The Cluster Resource Manager has a lot of options for describing the cluster. To find out more about them check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)
