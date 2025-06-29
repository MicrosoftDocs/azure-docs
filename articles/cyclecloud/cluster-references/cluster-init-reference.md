---
title: Azure CycleCloud Cluster-Init Parameter Reference
description: See a reference for cluster-init objects to be used with Azure CycleCloud. A cluster-init object defines the CycleCloud project specifications to run on a node.
author: adriankjohnson
ms.date: 05/31/2024
ms.author: adjohnso
ms.custom: compute-evergreen
---

# Cluster-Init

Cluster-init objects are subordinate to `node` and `nodearray` objects. The cluster-init object defines the [CycleCloud project](~/articles/cyclecloud/how-to/projects.md) specs to run on a node.

When you add a `[[[cluster-init]]]` section to a node, you include a project spec. You can also use shorthand notation to define cluster-init:

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

Attribute values that start with `$` reference parameters.

The CycleCloud project specs run in the order you list them in the Cluster Template File. In this example, `my-proj:default` runs first because it comes from the node defaults. Next, `myproject:x.y.x` runs, and finally, `my-proj:my-spec` runs.

## Attribute reference

Attribute | Type | Definition
------ | ----- | ----------
Project | String | Name of the CycleCloud project.
Version | String | Version of the CycleCloud project specification.
Spec | String | Name of the CycleCloud project specification.
Locker | String | Name of the locker to download the project specification from.

For projects in the CycleCloud project, set the `Locker` attribute to `cyclecloud`.
