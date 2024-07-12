---
title: Azure Service Fabric Auto Scaling Services and Containers 
description: Azure Service Fabric allows you to set auto scaling policies for services and containers.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Introduction to Auto Scaling
Auto scaling is another capability of Service Fabric to dynamically scale your services based on the load that services are reporting, or based on their usage of resources. Auto scaling gives great elasticity and enables provisioning of extra instances or partitions of your service on demand. The entire auto scaling process is automated and transparent, and once you set up your policies on a service there's no need for manual scaling operations at the service level. Auto scaling can be turned on either at service creation time, or at any time by updating the service.

A common scenario where auto scaling is useful is when the load on a particular service varies over time. For example, a service such as a gateway can scale based on the amount of resources necessary to handle incoming requests. Let's take a look at an example of what those scaling rules could look like:
* If all instances of my gateway are using more than two cores on average, then scale out the gateway service by adding one more instance. Do this addition every hour, but never have more than seven instances in total.
* If all instances of my gateway are using less than 0.5 cores on average, then scale the service in by removing one instance. Do this removal every hour, but never have fewer than three instances in total.

Auto scaling is supported for both containers and regular Service Fabric services. In order to use auto scaling, you need to be running on version 6.2 or above of the Service Fabric runtime. 

The rest of this article describes the scaling policies, ways to enable or to disable auto scaling, and gives examples on how to use this feature.

## Describing auto scaling
Auto scaling policies can be defined for each service in a Service Fabric cluster. Each scaling policy consists of two parts:
* **Scaling trigger** describes when scaling of the service is performed. Conditions that are defined in the trigger are checked periodically to determine if a service should be scaled or not.

* **Scaling mechanism** describes how scaling is performed when it's triggered. Mechanism is only applied when the conditions from the trigger are met.

All triggers that are currently supported work either with [logical load metrics](service-fabric-cluster-resource-manager-metrics.md), or with physical metrics like CPU or memory usage. Either way, Service Fabric monitors the reported load for the metric, and evaluates the trigger periodically to determine if scaling is needed.

There are two mechanisms that are currently supported for auto scaling. The first one is meant for stateless services or for containers where auto scaling is performed by adding or removing [instances](service-fabric-concepts-replica-lifecycle.md). For both stateful and stateless services, auto scaling can also be performed by adding or removing named [partitions](service-fabric-concepts-partitioning.md) of the service.

> [!NOTE]
> Currently there is support for only one scaling policy per service, and only one scaling trigger per scaling policy.

## Average partition load trigger with instance based scaling
The first type of trigger is based on the load of instances in a stateless service partition. Metric loads are first smoothed to obtain the load for every instance of a partition, and then these values are averaged across all instances of the partition. There are three factors that determine when the service is scaled:

* _Lower load threshold_ is a value that determines when the service is **scaled in**. If the average load of all instances of the partitions is lower than this value, then the service is scaled in.
* _Upper load threshold_ is a value that determines when the service is **scaled out**. If the average load of all instances of the partition is higher than this value, then the service is scaled out.
* _Scaling interval_ determines how often the trigger is checked. Once the trigger is checked, if scaling is needed the mechanism is applied. If scaling isn't needed, then no action is taken. In both cases, trigger isn't checked again before scaling interval expires again.

This trigger can be used only with stateless services (either stateless containers or Service Fabric services). In case when a service has multiple partitions, the trigger is evaluated for each partition separately, and each partition has the specified mechanism applied to it independently. Hence, the scaling behaviors of service partitions could vary based on their load. It's possible that some partitions of the service are scaled out, while some others are scaled in. Some partitions might not be scaled at all at the same time.

The only mechanism that can be used with this trigger is PartitionInstanceCountScaleMechanism. There are three factors that determine how this mechanism is applied:
* _Scale Increment_ determines how many instances are added or removed when mechanism is triggered.
* _Maximum Instance Count_ defines the upper limit for scaling. If number of instances of the partition reaches this limit, then the service is scaled out, regardless of the load. It's possible to omit this limit by specifying value of -1, and in that case the service is scaled out as much as possible (the limit is the number of nodes that are available in the cluster).
* _Minimum Instance Count_ defines the lower limit for scaling. If number of instances of the partition reaches this limit, then service isn't scaled in regardless of the load.

## Setting auto scaling policy for instance-based scaling

### Using application manifest
``` xml
<LoadMetrics>
<LoadMetric Name="MetricB" Weight="High"/>
</LoadMetrics>
<ServiceScalingPolicies>
<ScalingPolicy>
    <AveragePartitionLoadScalingTrigger MetricName="MetricB" LowerLoadThreshold="1" UpperLoadThreshold="2" ScaleIntervalInSeconds="100"/>
    <InstanceCountScalingMechanism MinInstanceCount="3" MaxInstanceCount="4" ScaleIncrement="1"/>
</ScalingPolicy>
</ServiceScalingPolicies>
```
### Using C# APIs
```csharp
FabricClient fabricClient = new FabricClient();
StatelessServiceDescription serviceDescription = new StatelessServiceDescription();
//set up the rest of the ServiceDescription
AveragePartitionLoadScalingTrigger trigger = new AveragePartitionLoadScalingTrigger();
PartitionInstanceCountScaleMechanism mechanism = new PartitionInstanceCountScaleMechanism();
mechanism.MaxInstanceCount = 3;
mechanism.MinInstanceCount = 1;
mechanism.ScaleIncrement = 1;
trigger.MetricName = "servicefabric:/_CpuCores";
trigger.ScaleInterval = TimeSpan.FromMinutes(20);
trigger.LowerLoadThreshold = 1.0;
trigger.UpperLoadThreshold = 2.0;
ScalingPolicyDescription policy = new ScalingPolicyDescription(mechanism, trigger);
serviceDescription.ScalingPolicies.Add(policy);
//as we are using scaling on a resource this must be exclusive service
//also resource monitor service needs to be enabled
serviceDescription.ServicePackageActivationMode = ServicePackageActivationMode.ExclusiveProcess
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```
### Using PowerShell
```posh
$mechanism = New-Object -TypeName System.Fabric.Description.PartitionInstanceCountScaleMechanism
$mechanism.MinInstanceCount = 1
$mechanism.MaxInstanceCount = 6
$mechanism.ScaleIncrement = 2
$trigger = New-Object -TypeName System.Fabric.Description.AveragePartitionLoadScalingTrigger
$trigger.MetricName = "servicefabric:/_CpuCores"
$trigger.LowerLoadThreshold = 0.3
$trigger.UpperLoadThreshold = 0.8
$trigger.ScaleInterval = New-TimeSpan -Minutes 10
$scalingpolicy = New-Object -TypeName System.Fabric.Description.ScalingPolicyDescription
$scalingpolicy.ScalingMechanism = $mechanism
$scalingpolicy.ScalingTrigger = $trigger
$scalingpolicies = New-Object 'System.Collections.Generic.List[System.Fabric.Description.ScalingPolicyDescription]'
$scalingpolicies.Add($scalingpolicy)
#as we are using scaling on a resource this must be exclusive service
#also resource monitor service needs to be enabled
Update-ServiceFabricService -Stateless -ServiceName "fabric:/AppName/ServiceName" -ScalingPolicies $scalingpolicies
```

## Average service load trigger with partition based scaling
The second trigger is based on the load of all partitions of one service. Metric loads are first smoothed to obtain the load for every replica or instance of a partition. For stateful services, the load of the partition is considered to be the load of the primary replica, while for stateless services the load of the partition is the average load of all instances of the partition. These values are averaged across all partitions of the service, and this value is used to trigger the auto scaling. Same as in previous mechanism, there are three factors that determine when the service is scaled:

* _Lower load threshold_ is a value that determines when the service is **scaled in**. If the average load of all partitions of the service is lower than this value, then the service is scaled in.
* _Upper load threshold_ is a value that determines when the service is **scaled out**. If the average load of all partitions of the service is higher than this value, then the service is scaled out.
* _Scaling interval_ determines how often the trigger is checked. Once the trigger is checked, if scaling is needed the mechanism is applied. If scaling isn't needed, then no action is taken. In both cases, trigger is checked again before scaling interval expires again.

This trigger can be used both with stateful and stateless services. The only mechanism that can be used with this trigger is AddRemoveIncrementalNamedPartitionScalingMechanism. When service is scaled out then a new partition is added, and when service is scaled in one of existing partitions is removed. There are restrictions that are checked when service is created or updated and service creation/update fails if these conditions aren't met:
* Named partition scheme must be used for the service.
* Partition names must be consecutive integer numbers, like "0," "1," ...
* First partition name must be "0."

For example, if a service is initially created with three partitions, the only valid possibility for partition names is "0", "1" and "2".

The actual auto scaling operation that is performed respects this naming scheme as well:
* If current partitions of the service are named "0," "1" and "2," then the partition added for scaling out is named "3."
* If current partitions of the service are named "0," "1" and "2," then the partition removed for scaling in is partition with name "2."

Same as with mechanism that uses scaling by adding or removing instances, there are three parameters that determine how this mechanism is applied:
* _Scale Increment_ determines how many partitions added or removed when mechanism is triggered.
* _Maximum Partition Count_ defines the upper limit for scaling. If number of partitions of the service reaches this limit, then the service isn't scaled out, regardless of the load. It's possible to omit this limit by specifying value of -1, and in that case the service is scaled out as much as possible (the limit is the actual capacity of the cluster).
* _Minimum Partition Count_ defines the lower limit for scaling. If number of partitions of the service reaches this limit, then service isn't scaled in regardless of the load.

> [!WARNING] 
> When AddRemoveIncrementalNamedPartitionScalingMechanism is used with stateful services, Service Fabric will add or remove partitions **without notification or warning**. Repartitioning of data will not be performed when scaling mechanism is triggered. In case of scale out operation, new partitions will be empty, and in case of scale in operation, **partition will be deleted together with all the data that it contains**.

## Setting auto scaling policy for partition based scaling

### Using application manifest
``` xml
<NamedPartition>
    <Partition Name="0" />
</NamedPartition>
<ServiceScalingPolicies>
    <ScalingPolicy>
        <AverageServiceLoadScalingTrigger MetricName="servicefabric:/_MemoryInMB" LowerLoadThreshold="300" UpperLoadThreshold="500" ScaleIntervalInSeconds="600"/>
        <AddRemoveIncrementalNamedPartitionScalingMechanism MinPartitionCount="1" MaxPartitionCount="3" ScaleIncrement="1"/>
    </ScalingPolicy>
</ServiceScalingPolicies>
```
### Using C# APIs
```csharp
FabricClient fabricClient = new FabricClient();
StatefulServiceUpdateDescription serviceUpdate = new StatefulServiceUpdateDescription();
AveragePartitionLoadScalingTrigger trigger = new AverageServiceLoadScalingTrigger();
PartitionInstanceCountScaleMechanism mechanism = new AddRemoveIncrementalNamedPartitionScalingMechanism();
mechanism.MaxPartitionCount = 4;
mechanism.MinPartitionCount = 1;
mechanism.ScaleIncrement = 1;
//expecting that the service already has metric NumberOfConnections
trigger.MetricName = "NumberOfConnections";
trigger.ScaleInterval = TimeSpan.FromMinutes(15);
trigger.LowerLoadThreshold = 10000;
trigger.UpperLoadThreshold = 20000;
ScalingPolicyDescription policy = new ScalingPolicyDescription(mechanism, trigger);
serviceUpdate.ScalingPolicies = new List<ScalingPolicyDescription>;
serviceUpdate.ScalingPolicies.Add(policy);
await fabricClient.ServiceManager.UpdateServiceAsync(new Uri("fabric:/AppName/ServiceName"), serviceUpdate);
```
### Using PowerShell
```posh
$mechanism = New-Object -TypeName System.Fabric.Description.AddRemoveIncrementalNamedPartitionScalingMechanism
$mechanism.MinPartitionCount = 1
$mechanism.MaxPartitionCount = 3
$mechanism.ScaleIncrement = 2
$trigger = New-Object -TypeName System.Fabric.Description.AverageServiceLoadScalingTrigger
$trigger.MetricName = "servicefabric:/_MemoryInMB"
$trigger.LowerLoadThreshold = 5000
$trigger.UpperLoadThreshold = 10000
$trigger.ScaleInterval = New-TimeSpan -Minutes 25
$scalingpolicy = New-Object -TypeName System.Fabric.Description.ScalingPolicyDescription
$scalingpolicy.ScalingMechanism = $mechanism
$scalingpolicy.ScalingTrigger = $trigger
$scalingpolicies = New-Object 'System.Collections.Generic.List[System.Fabric.Description.ScalingPolicyDescription]'
$scalingpolicies.Add($scalingpolicy)
#as we are using scaling on a resource this must be exclusive service
#also resource monitor service needs to be enabled
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -TargetReplicaSetSize 3 -MinReplicaSetSize 2 -HasPersistedState true -PartitionNames @("0","1") -ServicePackageActivationMode ExclusiveProcess -ScalingPolicies $scalingpolicies
```

## Auto scaling Based on Resources

To enable the resource monitor service to scale based on actual resources, you can add the `ResourceMonitorService` feature as follows:

``` json
"fabricSettings": [
...   
],
"addonFeatures": [
    "ResourceMonitorService"
],
```
Service Fabric supports CPU and memory governance using two built-in metrics: `servicefabric:/_CpuCores` for CPU and `servicefabric:/_MemoryInMB` for memory. The Resource Monitor Service is responsible for tracking CPU and memory usage and updating the Cluster Resource Manager with the current resource usage. This service applies a weighted moving average to account for potential short-lived spikes. Resource monitoring is supported for both containerized and noncontainerized applications on Windows and for containerized applications on Linux.

> [!NOTE]
> CPU and memory consumption monitored in the Resource Monitor Service and updated to the Cluster Resource Manager do not impact any decision-making process outside of auto scaling. If [resource governance](service-fabric-resource-governance.md#resource-governance-metrics) is needed, it can be configured without interfering with auto scaling functionalities, and vice versa.

> [!IMPORTANT]
> Resource-based auto scaling is supported only for services activated in the [exclusive process model](service-fabric-hosting-model.md#exclusive-process-model).

## Next steps
Learn more about [application scalability](service-fabric-concepts-scalability.md).
