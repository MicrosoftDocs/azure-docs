---
title: Azure Service Fabric dynamic node tags
description: Azure Service Fabric allows you to dynamically add and remove node tags.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Introduction to dynamic node tags
Node tags allow you to dynamically add and remove tags from nodes in order to influence the placement of services. Node tagging is very flexible and allows changes to service placement without application or cluster upgrades. Tags can be added or removed from nodes at any time, and services can specify requirements for certain tags when they are created. A service can also have its tag requirements updated dynamically while it is running.

Node tagging is similar to [placement constraints](service-fabric-cluster-resource-manager-configure-services.md) and is typically used to control what nodes a service runs on. Each Service Fabric service can be configured to require tag to be placed or to keep running.

Node tagging is supported for all Service Fabric hosted service types (Reliable Services, Guest Executables, and Containers). To use node tagging, you need to be running version 8.0 or above of the Service Fabric runtime.

The rest of this article describes ways to enable or to disable node tagging and gives examples on how to use this feature.


## Describing dynamic node tags
Services can specify the tags they require. There are two types of tags:
* **Tags required for placement** describe a set of tags, which are required only for service placement. Once replica is placed, these tags can be removed without interrupting the service. If any of these tags are removed from the node, the service replica will keep functioning, and Service Fabric will not remove the service

* **Tags required to run** describe a set of tags, which are required for both placement and running of the service. If any of the required running tags get removed, Service Fabric will move the service to another node which has those tags specified.

Example:
Required for placement tags can be utilized when you use some sort of container activator service, and you need that service for your container to be placed, and as soon as container gets activated, you don't need activator anymore, and you can remove the tag associated with it, but container should keep running.
Required for running tags can be used when you have a billing service, which is useful to be collocated with user-facing service. When billing service fails on the node, you remove tag associated with it, and user-facing service gets moved to another node, which has billing service, and its tag, present.

A tag or set of tags can be added, updated, or removed from a single node using standard Service Fabric interface mechanisms such as C# APIs, REST APIs, or PowerShell commands.

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
          "name": "NodeTaggingEnabled",
          "value": "true"
      }
    ]
  }
]
```

## Setting dynamic node tags

### Using PowerShell

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

### Using PowerShell

Creating new service:

```posh
New-ServiceFabricService -ApplicationName fabric:/HelloWorld -ServiceName fabric:/HelloWorld/svc1 -ServiceTypeName HelloWorldStateful -Stateful -PartitionSchemeSingleton -TargetReplicaSetSize 5 -MinReplicaSetSize 3 -TagsRequiredToRun @("SampleTag1") - TagsRequiredToPlace @("SampleTag2")
```
This command creates a service, which requires "SampleTag2" to be present on a node in order for the service to be placed there, and "SampleTag1" to be present in order for the service to continue running on that node.

Updating existing service:

```posh
Update-ServiceFabricService -Stateful -ServiceName fabric:/myapp/test -TagsRequiredToRun @("SampleTag1") -TagsRequiredToPlace @("SampleTag2")
```
This command updates a service, which requires "SampleTag2" to be present on a node in order for the service to be placed there, and "SampleTag1" to be present in order for the service to continue running on that node.

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

## Next steps
Learn more about [placement constraints](service-fabric-cluster-resource-manager-configure-services.md)
