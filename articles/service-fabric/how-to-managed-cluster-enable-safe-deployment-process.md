---
title: Enable coordinated Safe Deployment Process (SDP) on Service Fabric managed clusters
description: Learn how to enable coordinated Safe Deployment Process (SDP) on Service Fabric managed clusters.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric

services: service-fabric
ms.date: 05/08/2024
---

# Enable coordinated Safe Deployment Process (SDP) on Service Fabric managed clusters

Service Fabric managed clusters can enable coordinated SDP by using configurations for service groups (ARCO).

## What is ARCO?

Artifact configuration for service groups allows users to tag multiple services, such as virtual machine scale sets that have the same configuration, across the globe and to do configuration updates. Moreover, users can designate any new deployment into a service group to use the same configuration as the rest of the group from the get-go. ARCO can also give more control to service owners to define how to perform configuration updates such as image version updates for particular service groups.

## What is coordinated SDP?

Coordinated SDP offers flexibility for customers to specify the SDP rollout scope, schedule, and health signal for their applications deployed as virtual machine scale sets.

Today, without coordinated SDP, virtual machine scale set autoupdate is rolled out at a fixed regional schedule at the scale set level. [Azure Virtual Machine Scale Set automatic OS image upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) describes the existing process.

With coordinated SDP, customers can specify a corresponding schedule policy and set of health signals for a group's rollout process.

## Enable ARCO

Complete the following process to enable service artifact.

Pass your `serviceArtifactReferenceId` to your node type ARM template resource:

```json
{ 
  "apiVersion": "2023-07-01-preview", 
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes", 
  "properties": { 
    "serviceArtifactReferenceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SampleResourceGroup/providers/Microsoft.Compute/galleries/SampleImageGallery/serviceArtifacts/SampleArtifactName/vmArtifactsProfiles/SampleVmArtifactProfile" 
  } 
} 
```

## Next steps

Learn more about [virtual machine scale set automatic OS image upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md).
