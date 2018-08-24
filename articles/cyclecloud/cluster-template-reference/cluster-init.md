---
title: Azure CycleCloud pogo Configuration | Microsoft Docs
description: Configure Azure CycleCloud's pogo tool.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Cluster-Init

Cluster-init objects are subordinate in rank to `node`.
The cluster-init object defines the CycleCloud project specs to run on a node.

## Example

Adding a `[[[cluster-init]]]` section to a node will include a project spec.
Cluster-init definition can also be written in short-hand notation.

```ini
[cluster my-cluster]
  
  [[node defaults]]
    [[[cluster-init my-proj:default:versionA]]]

  [[node my-node]]
    Credentials = $Credentials
    SubnetId = $SubnetId
    MachineType = $MachineType
    ImageName = $ImageName

    [[[cluster-init myspec]]]
      Project = myproject
      Version = x.y.z
      Spec = my-spec
      Locker = test-locker

    [[[cluster-init my-proj:my-spec:versionA]]]

```

The `$` is a reference to a parameter name.

The order of the Project specs is also important and respected as provided
in the Cluster Template File.  In this case `my-proj:default` will run first as it 
comes from the node defaults, followed by `myproject:x.y.x` and finally `my-proj:my-spec`


## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
`Project` | String | Name of CycleCloud Project.
`Version` | String | Version of CycleCloud project spec.
`Spec` | String | Name of CycleCloud Project spec.
`Locker` | String | Name of locker from which to download project spec.