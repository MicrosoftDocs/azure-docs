---
title: Azure CycleCloud Cluster-Init Parameter Reference
description: See a reference for cluster-init objects to be used with Azure CycleCloud. A cluster-init object defines the CycleCloud project specifications to run on a node.
author: adriankjohnson
ms.date: 06/29/2025
ms.update-cycle: 3650-days
ms.author: adjohnso
ms.custom: compute-evergreen
---

# Cluster-Init

Cluster-init sections are subordinate to `node` and `nodearray` sections. 
The `[[[cluster-init]]]` section defines the [CycleCloud project](~/articles/cyclecloud/how-to/projects.md) specs to run on a node. 
The section uses a shorthand notation to reference the fully qualified spec:

```ini
[[[cluster-init PROJECT:SPEC:VERSION]]]
```

By default, projects are stored in the [locker](../how-to/projects.md#lockers) defined on the node. To specify a different locker, you can include a locker reference in the `[[[cluster-init]]]` section:

```ini
[[[cluster-init LOCKER/PROJECT:SPEC:VERSION]]]
```

[!NOTE]
> For built-in projects that are downloaded from GitHub, use `cyclecloud` as the locker. This will tell CycleCloud to download the project from GitHub and upload them to your locker in a special cache area. Without `cyclecloud/` in the cluster-init reference, CycleCloud will expect the project to be uploaded by you.

As an example, this cluster template defines one node that uses three specs:

``` ini
[cluster my-cluster]

  [[node defaults]]
    [[[cluster-init my-proj:default:versionA]]]

  [[node my-node]]
    Credentials = $Credentials
    SubnetId = $SubnetId
    MachineType = $MachineType
    ImageName = $ImageName

    [[[cluster-init test-locker/myproject:my-spec:x.y.z]]]

    [[[cluster-init my-proj:my-spec:versionA]]]
```

Attribute values that start with `$` reference parameters.

The CycleCloud project specs run in the order you list them in the Cluster Template File. In this example, `my-proj:default` runs first because it comes from the node defaults. Next, `myproject:my-spec` runs, which comes from the locker named `test-locker`. Finally, `my-proj:my-spec` runs.

The `[[[cluster-init LOCKER/PROJECT:SPEC:VERSION]]]` form is a shorthand for the following:
```ini
    [[[cluster-init]]]
      Project = PROJECT
      Version = VERSION
      Spec = SPEC
      Locker = LOCKER
```

## Attribute reference

Attribute | Type | Definition
------ | ----- | ----------
Project | String | Name of the CycleCloud project.
Version | String | Version of the CycleCloud project specification.
Spec | String | Name of the CycleCloud project specification.
Locker | String | Name of the locker to download the project specification from.
Order | Integer | Optional integer that you can use to override the order of the specs. The default starts at 1000 and goes up by one for each spec.

