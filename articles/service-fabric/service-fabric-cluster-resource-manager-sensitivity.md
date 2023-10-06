---
title: Service sensitivity
description: An introduction to service sensitivity and how to set service sensitivity description and maximum load for max sensitivity replica
author: tracygooo

ms.topic: conceptual
ms.date: 09/07/2023
ms.author: jinghuafeng
---

# 1. Service sensitivity
Service Fabric Cluster Resource Manager provides the interface of move cost to allow the adjustment of the service failover priority when movements are conducted for balancing, defragmentation, or other requirements. However, move cost has a few limitations to satisfy the customers' needs. For instance, move cost cannot explicitly optimize an individual move as Cluster Resource Manager (CRM) relies on the total score for all movements made in a single algorithm run. Move cost does not function when CRM conducts swaps as all replicas share the same swap cost, which results in the failure of limiting the swap failover for sensitive replicas. Another limitation is the move cost only provides four possible values (Zero, Low, Medium, High) and one special value (Very High) to adjust the priority of a replica. This does not provide enough flexibility for differentiation of replica sensitivity to failover.

Starting from Service Fabric version 10.1, CRM introduced sensitivity feature, which offers an option for service fabric customers to finely tune the importance of a stateful service replica and thus to set levels of SLOs to the interruptions to the service. The service sensitivity is defined as a non-negative integer with default value of 0. Larger value implies the lower probability of victimizing (failovering) the corresponding replica. Sensitivity description class contains three different non-negative integers to represent the sensitivities of primary, secondary, and auxiliary replicas respectively. In addition, a separate boolean value `IsMaximumSensitivity` denotes if a replica is the most sensitive replica. 

When `IsMaximumSensitivity` is set to true, the Max Sensitivity Replica (MSR) can only be moved or swapped in the following cases:
* FD/UD constraint violation only if FD/UD is set to hard constraint
* replica swap during upgrade
* Node capacity violation with only MSR(s) on the node (i.e., if any other non-MSR is present on the node, the MSR is not movable.)

For instance, in the scenario as listed in the table below, Node 1 is under node capacity violation when three replicas (each has a load of 50) coexist on this node while Node 2 is completely empty. In this case, both the two MRSs are immovable as the Non-MSR will be moved to Node 2 to fix the violation.  

|       |Node Load/Capacity |MSR Service1 Load |MSR Service2 Load|Non-MSR Service Load | 
|:------|:------|:------|:------|:------|:------|
|Node 1 |150/100       |50                |50                |50                  |
|Node 2 |0/100         |                  |                  |                    |

While in the following case, two MSRs with load of 60 each collocates on Node 1, leading to the Node 1 capacity violation. The Node 2 has space of 80 with only one Non-MSR (load = 20) placed on it. One of the MSRs on node 1 has to be moved to node 2 as there is no Non-MSR present on node 1.
|       |Node Load/Capacity |MSR Service1 Load |MSR Service2 Load|Non-MSR Service Load | 
|:------|:------|:------|:------|:------|:------|
|Node 1 |120/100       |60                |60                |                  |
|Node 2 |20/100         |                  |                 |20                |

The sensitivity feature allows multiple MSRs to collocate on the same node. Nevertheless, an excessive number of MSRs may result in node capacity violation. Thus, the feature introduces the maximum load to the metric to ensure the sum of maximum loads for each metric is below or equal to the node capacity of that metric. With this upper bound set, PLB can safely collocate multiple MSRs on the same node, avoiding the scenario that the only way to fix node capacity violation is to move a max sensitivity replica.

Let's say that two customer metrics are defined for cluster node: ACU (Application CPU Usage) and IDSU (Instance Disk Usage). The node capacities for ACU and IDSU are **100 vCores** and **4 TB** respectively.

The table below shows a few examples regarding the collocation of maximum sensitivity replicas. For the three scenarios listed in the table, assume there already exists one max sensitivity replica on a node. Whether more MSR(s) can be placed on this node depends on space left on the node and resources needed for new MSR(s).
1. More MSR(s) can be placed on this node as long as it does not cause node load or MaxLoad capacity violation. (i.e., `ACU (Max)Load <= 50 vCores && IDSU (Max)Load <= 2 TB`).
2. No other MSR can be placed on this node as the MaxLoads for both ACU and IDSU have reached to their node MaxLoad capacities.  
3. No other MSR can be placed on this node as the MaxLoad for IDSU has reached to its node MaxLoad capacity though there exists room from the perspective of ACU. 


|Scenario # |ACU Load |IDSU Load|IsMaximumSensitivity |ACU MaxLoad |IDSU MaxLoad |Can another MSR be placed on this node?|
|:---|:---|:---|:---|:---|:---|:---|:---|
|1 |50 |2 | true |50 |2 |Yes |
|2 |100 |2 | true |100 |4 |No |
|3 |50 |2 | true |50 |4 |No |

> [!NOTE]
Current sensitivity feature only provides MSR functionality. For non-MSR but with different sensitivity values, CRM does not treat them differently from the perspective of sensitivity.

## 1.1. Enable/Disable service sensitivity

Sensitivity feature is turned on/off by setting config `EnableServiceSensitivity` in `PlacementAndLoadBalancing` section of cluster manifest either using XML or JSON:

In ClusterManifest.xml:
``` xml
<Section Name="PlacementAndLoadBalancing">
     <Parameter Name="EnableServiceSensitivity" Value="true" />
</Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": "EnableServiceSensitivity",
          "value": "true"
      }
    ]
  }
]
```

## 1.2. Set service sensitivity
> [!NOTE]
> Although it is not required, to set a service to a max sensitivity service, it is recommended to set the corresponding MaximumLoad to avoid overflowing the node capacity when multiple max sensitivity service collocate on the same node. Check section [Set maximum load](#13-set-maximum-load) for details.

### 1.2.1. Use Application Manifest
```xml
<Service>
  <StatefulService>
    <ServiceSensitivityDescription PrimaryDefaultSensitivity="10" SecondaryDefaultSensitivity="10" AuxiliaryDefaultSensitivity="10" IsMaximumSensitivity="False" />
  </StatefulService>
</Service>
```

### 1.2.2. Use Powershell API
To specify the sensitivity for a service when it is created:
```posh
$sensitivity = New-Object -TypeName System.Fabric.Description.ServiceSensitivityDescription
$sensitivity.PrimaryDefaultSensitivity = 10
$sensitivity.SecondaryDefaultSensitivity = 10
$sensitivity.AuxiliaryDefaultSensitivity = 10
$sensitivity.IsMaximumSensitivity = $false

New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 3 -TargetReplicaSetSize 3 -PartitionSchemeSingleton -ServiceSensitivityDescription $sensitivity
```

To specify or update sensitivity dynamically for an existing service: 
```posh
$sensitivity = New-Object -TypeName System.Fabric.Description.ServiceSensitivityDescription
$sensitivity.PrimaryDefaultSensitivity = 10
$sensitivity.SecondaryDefaultSensitivity = 10
$sensitivity.AuxiliaryDefaultSensitivity = 10
$sensitivity.IsMaximumSensitivity = $false

Update-ServiceFabricService -Stateful -ServiceName fabric:/AppName/ServiceName -ServiceSensitivityDescription $sensitivity
```

### 1.2.3. Use C# API
To specify the sensitivity for a service when it is created:
```posh
FabricClient fabricClient = new FabricClient();

ServiceSensitivityDescription serviceSensitivity = new ServiceSensitivityDescription();
serviceSensitivity.PrimaryDefaultSensitivity = 10
serviceSensitivity.SecondaryDefaultSensitivity = 10
serviceSensitivity.AuxiliaryDefaultSensitivity = 10
serviceSensitivity.IsMaximumSensitivity = $false

StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
serviceDescription.ServiceSensitivityDescription = serviceSensitivity; 

await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

To specify or update sensitivity dynamically for an existing service: 
```csharp
FabricClient fabricClient = new FabricClient();

ServiceSensitivityDescription serviceSensitivity = new ServiceSensitivityDescription();
serviceSensitivity.PrimaryDefaultSensitivity = 10
serviceSensitivity.SecondaryDefaultSensitivity = 10
serviceSensitivity.AuxiliaryDefaultSensitivity = 10
serviceSensitivity.IsMaximumSensitivity = $false

StatefulServiceUpdateDescription serviceUpdate = new StatefulServiceUpdateDescription();
serviceUpdate.ServiceSensitivityDescription = serviceSensitivity; 

await fabricClient.ServiceManager.UpdateServiceAsync(new Uri("fabric:/AppName/ServiceName"), serviceUpdate);
```

## 1.3. Set Maximum Load
### 1.3.1. Use Application Manifest
```xml
<Service>
  <StatefulService>
    <SingletonPartition />
    <LoadMetrics>
      <LoadMetric Name="CPU" PrimaryDefaultLoad="10" SecondaryDefaultLoad="5" MaximumLoad="20" Weight="High" />
    </LoadMetrics>
  </StatefulService>
</Service>

```
### 1.3.2. Use Powershell API
To specify the max load for a service when it is created:
```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName –Stateful -MinReplicaSetSize 3 -TargetReplicaSetSize 3 -PartitionSchemeSingleton –Metric @("CPU,High,10,5,0,20")
```

To specify or update the max load for an existing service:
```posh
Update-ServiceFabricService -Stateful -ServiceName fabric:/AppName/ServiceName -Metric @("CPU,High,10,5,0,20")
```
### 1.3.3. Use C# API
To specify the sensitivity for a service when it is created:
```csharp
FabricClient fabricClient = new FabricClient();

StatefulServiceLoadMetricDescription cpuMetric = new StatefulServiceLoadMetricDescription();
cpuMetric.Name = "CPU";
cpuMetric.PrimaryDefaultLoad = 10;
cpuMetric.SecondaryDefaultLoad = 5;
cpuMetric.AuxiliaryDefaultLoad = 0;
cpuMetric.Weight = ServiceLoadMetricWeight.High;
cpuMetric.MaximumLoad = 20;

StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
serviceDescription.Metrics["CPU"] = cpuMetric;

await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

To specify or update the max load for an existing service:
```csharp
FabricClient fabricClient = new FabricClient();

StatefulServiceLoadMetricDescription cpuMetric = new StatefulServiceLoadMetricDescription();
cpuMetric.Name = "CPU";
cpuMetric.PrimaryDefaultLoad = 10;
cpuMetric.SecondaryDefaultLoad = 5;
cpuMetric.AuxiliaryDefaultLoad = 0;
cpuMetric.Weight = ServiceLoadMetricWeight.High;
cpuMetric.MaximumLoad = 20;

StatefulServiceUpdateDescription updateDescription = new StatefulServiceUpdateDescription();
updateDescription.Metrics["CPU"] = cpuMetric;

await fabricClient.ServiceManager.UpdateServiceAsync(new Uri("fabric:/AppName/ServiceName"), updateDescription);
```

## 1.4. Next steps
Learn more about [Service movement cost](service-fabric-cluster-resource-manager-movement-cost.md).