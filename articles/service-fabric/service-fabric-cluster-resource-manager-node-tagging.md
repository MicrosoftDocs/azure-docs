---
title: Azure Service Fabric Dynamic Node Tags
description: Azure Service Fabric allows you to dynamically add and remove node tags.
author: yu-supersonic

ms.topic: conceptual
ms.date: 04/05/2021
ms.author: branim
ms.custom: devx-track-csharp
---
# Introduction to Dynamic node tags
Dynamic node tags are an additional capability of Service Fabric to dynamically tag your nodes and influence placement of services according to those tags. Node tagging gives great elasticity and enables you to influence placement of your services without application or cluster upgrade on demand. Node tagging can be turned on either at service creation time, or at any time by updating the service.

Node tagging’s primary use is to specify on which nodes service can run, similar to [placement constraints](service-fabric-cluster-resource-manager-configure-services.md). Unlike them, this functionality can be updated via Powershell or REST which makes it dynamic. Each Service Fabric service can be configured to require tag to be placed or to keep running.

Node tagging is supported for both containers and regular Service Fabric services. To use node tagging, you need to be running version 8.0 or above of the Service Fabric runtime.

The rest of this article describes ways to enable or to disable node tagging and gives examples on how to use this feature.


## Describing dynamic node tags
Required tags can be defined for each service in a Service Fabric cluster. Each tag can belong to one of two groups:
* **Tags required to place** describes a set of tags which are required only for service placement. Once replica is placed, those tags can be removed without interrupting the service, so if any of the required placement tags gets removed from the node, service replica will keep functioning.

* **Tags required to run** describes a set of tags which are required for both placement and running of the service. If any of the required running tags gets removed, service will be moved to another node which has those tags specified.

Tag or sets of tags can be added, updated or removed from a single node using standard Service Fabric interface mechanisms such as C# APIs, REST APIS or PowerShell commands.

> [!NOTE]
> Service Fabric does not maintain UD/FD distributions when using node tags. Please manage node tags appropriately, so you don't get FD/UD violations due to bad distribution of tags across domains.

## Enabling dynamic node tags
In order for this feature to work, you’ll need to enable NodeTaggingEnabled config in PlacementAndLoadBalancing section of cluster manifest either using XML or JSON:

``` xml
<Section Name="PlacementAndLoadBalancing">
     <Parameter Name="NodeTaggingEnabled" Value="true" />
</Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": " NodeTaggingEnabled ",
          "value": "true"
      }
    ]
  }
]
```

## Setting dynamic node tags

### Using Powershell

Adding node tags to the node:

```posh
Add-ServiceFabricNodeTags -NodeName "DB.1" -NodeTags @("SampleTag1", "SampleTag2")
```
This command will add tags “SampleTag1” and “SampleTag2” on node DB.1.

Remove node tags from the node:

```posh
Remove-ServiceFabricNodeTags -NodeName "DB.1" -NodeTags @("SampleTag1", "SampleTag2")
```
This command will remove tags “SampleTag1” and “SampleTag2” on node DB.1.

### Using C# APIs

Adding node tags to the node:

```csharp
FabricClient fabricClient = new FabricClient();
List<string> nodeTagsList = new List<string>();
nodeTagsList.Add("SampleTag1");
nodeTagsList.Add("SampleTag2");
await fabricClient.ClusterManager.AddNodeTagsAsync("DB.1", nodeTagsList);
```

Remove node tags from the node:

```csharp
FabricClient fabricClient = new FabricClient();
List<string> nodeTagsList = new List<string>();
nodeTagsList.Add("SampleTag1");
nodeTagsList.Add("SampleTag2");
await fabricClient.ClusterManager.RemoveNodeTagsAsync("DB.1", nodeTagsList);
```

## Setting required tags for services

### Using Powershell

Creating new service:

```posh
New-ServiceFabricService -ApplicationName fabric:/HelloWorld -ServiceName fabric:/HelloWorld/svc1 -ServiceTypeName HelloWorldStateful -Stateful -PartitionSchemeNamed -PartitionNames @("Seattle","Vancouver") -MinReplicaSetSize 3 -TargetReplicaSetSize 3 -TagsRequiredToRun @("SampleTag1") - TagsRequiredToPlace @("SampleTag2")
```
This command creates a Service Fabric stateful service from the specified application instance with named partitioning scheme and requiring tags “SampleTag1” and “SampleTag2” which will be required on a node, when placing this service and “SampleTag1” will be needed for service to keep running. 

Updating existing service:

```posh
Update-ServiceFabricService -Stateful -ServiceName fabric:/myapp/test -TagsRequiredToRun @("SampleTag1") -TagsRequiredToPlace @("SampleTag2")
```
This command updates a Service Fabric stateful service requiring tags “SampleTag1” and “SampleTag2” which will be required on a node, when placing this service, and “SampleTag1” will be needed for service to keep running.

### Using C# APIs

Creating new service:

```csharp
FabricClient fabricClient = new FabricClient();
StatefulServiceDescription serviceDescription = new StatefulServiceDescription();
//set up the rest of the ServiceDescription
ServiceTags serviceTags = new ServiceTags();
serviceTags.TagsRequiredToPlace.Add("SampleTag1");
serviceTags.TagsRequiredToRun.Add("SampleTag2");
serviceDescription.ServiceTags = serviceTags;
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

Updating existing service:

```csharp
FabricClient fabricClient = new FabricClient();
StatefulServiceUpdateDescription serviceUpdate = new StatefulServiceUpdateDescription();
ServiceTags serviceTags = new ServiceTags();
serviceTags.TagsRequiredToPlace.Add("SampleTag1");
serviceTags.TagsRequiredToRun.Add("SampleTag2");
serviceUpdate.ServiceTags = serviceTags;
await fabricClient.ServiceManager.UpdateServiceAsync(new Uri("fabric:/AppName/ServiceName"), serviceUpdate);
```

All these commands apply equally to stateless services.
