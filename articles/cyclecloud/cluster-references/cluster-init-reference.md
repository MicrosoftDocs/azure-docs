---
title: Azure CycleCloud Cluster-Init Parameter Reference
description: See a reference for cluster-init objects to be used with Azure CycleCloud. A cluster-init object defines the CycleCloud project specifications to run on a node.
author: adriankjohnson
ms.date: 03/10/2020
ms.author: adjohnso
---

# Cluster-Init

Cluster-init objects are subordinate in rank to `node` and `nodearray`. The cluster-init object defines the [CycleCloud project](~/how-to/projects.md) specs to run on a node.

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

Attribute values that begin with `$` are referencing parameters.

The order of the Project specs is respected as provided in the Cluster Template File. In this case `my-proj:default` will run first as it
comes from the node defaults, followed by `myproject:x.y.x`, and finally `my-proj:my-spec`.

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
Project | String | Name of CycleCloud project.
Version | String | Version of CycleCloud project spec.
Spec | String | Name of CycleCloud project spec.
Locker | String | Name of locker from which to download project spec.

For projects contained in the CycleCloud project, Locker should be set to `cyclecloud`.
