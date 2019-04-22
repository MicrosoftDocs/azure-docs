---
title: Azure CycleCloud Cluster Template Reference | Microsoft Docs
description: Parameter reference for cluster templates for use with Azure CycleCloud
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Cluster-Init

Cluster-init objects are subordinate in rank to `node`. The cluster-init object defines the [CycleCloud project](~/projects.md) specs to run on a node.

Adding a `[[[cluster-init]]]` section to a node will include a project spec. Cluster-init definition can also be written in short-hand notation:

``` ini
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

The order of the Project specs is important, and respected as provided
in the Cluster Template File. In this case `my-proj:default` will run first as it
comes from the node defaults, followed by `myproject:x.y.x`, and finally `my-proj:my-spec`

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
Project | String | Name of CycleCloud Project.
Version | String | Version of CycleCloud project spec.
Spec | String | Name of CycleCloud Project spec.
Locker | String | Name of locker from which to download project spec.

For projects contained in the CycleCloud project, Locker should be set to `cyclecloud`.