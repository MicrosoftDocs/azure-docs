---
title: Service sensitivity
description: An introduction to service sensitivity and how to set/get service sensitivity description
author: tracygooo

ms.topic: conceptual
ms.date: 09/07/2023
ms.author: jinghuafeng
---

# Introduction to service sensitivity
Service Fabric Cluster Resource Manager provides the interface of move cost to allow the adjustment of the service failover priority when movements has to be conducted for balancing, defragmentation, and other requirements. However, move cost has a few limitations to satisfy the customers' needs. For instance, Move cost cannot explicitly optimize an individual move as Cluster Resource Manager (CRM) relies on the total score for all movements made in a single algorithm run. Moreover, move cost does not function when CRM conducts swaps as all replicas share the same swap cost, which results in the failure of limiting the swap failover for sensitive replicas. Another limitation is the move cost only provides four possible values  (Zero, Low, Medium, High) and one special value (Very High) to adjust the priority of a replica. This does not provide enough flexibility for differentiation of replica sensitivity to failover. In addition, very high move cost (VHMC) does not provide enough protection on a high-priority replica, i.e., the replica with VHMC is allowed to be moved in quite a few cases.

CRM sensitivity feature offers an option for service fabric customers to finely tune the importance of a stateful service replica and thus to set levels of SLOs to the interruptions to the service. The service sensitivity is defined as a non-negative integer with default value of 0. Larger value implies the lower probability of victimizing (failovering) the corresponding replica. Sensitivity description class contains three different non-negative integers to represent the sensitivities of primary, secondary, and auxiliary replicas respectively. In addition, a separate boolean value IsMaximumSensitivity denotes if a replica is the most sensitive replica. 

A Max Sensitivity Replica (MSR) can only be moved or swapped in the following cases:
* FD/UD constraint violation only if FD/UD is set to hard constraint
* Swap during upgrade
* Node capacity violation with only MSR(s) on the node (i.e., if any other non-MSR is present on the node, the MSR should not be movable.)

## Enable/Disable service sensitivity
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

## Set service sensitivity

### Use service Manifest
```xml
<ServiceTypes>
  <StatefulServiceType ServiceTypeName="ServiceType">
    <Sensitivity>
      <PrimaryDefaultSensitivity>10</PrimaryDefaultSensitivity>
      <SecondaryDefaultSensitivity>10</SecondaryDefaultSensitivity>
      <AuxiliaryDefaultSensitivity>10</AuxiliaryDefaultSensitivity>
      <IsMaximumSensitivity>false</IsMaximumSensitivity>
    </Sensitivity>
  </StatefulServiceType>
</ServiceTypes>
```

### Use Powershell API

Update sensitivity for existing service
```posh
$sensitivity = New-Object -TypeName System.Fabric.Description.ServiceSensitivityDescription
$sensitivity.PrimaryDefaultSensitivity = 10
$sensitivity.SecondaryDefaultSensitivity = 10
$sensitivity.AuxiliaryDefaultSensitivity = 10
$sensitivity.IsMaximumSensitivity = $false
Update-ServiceFabricService -Stateful -ServiceName fabric:/AppName/ServiceName -ServiceSensitivityDescription $sensitivity
```

### Use C# API
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

# Next steps
Learn more about [Service movement cost](service-fabric-cluster-resource-manager-movement-cost.md).
