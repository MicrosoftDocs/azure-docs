---
title: Azure CycleCloud Cluster-Init Parameter Reference
description: See a reference for cluster-init objects to be used with Azure CycleCloud. A cluster-init object defines the CycleCloud project specifications to run on a node.
author: dougclayton
ms.author: doclayto
ms.date: 09/23/2025
ms.update-cycle: 3650-days
ms.custom: compute-evergreen
---

# Cluster-Init

Cluster-init sections are subordinate to `node` and `nodearray` sections. 
The `[[[cluster-init]]]` section defines the [CycleCloud project](~/articles/cyclecloud/how-to/projects.md) specs to run on a node. 
The section uses a shorthand notation to reference the fully qualified spec:

```ini
[[[cluster-init PROJECT:SPEC:VERSION]]]
```

By default, projects are assumed to be stored in the [locker](../how-to/projects.md#lockers) already. However, if you're using a project defined in GitHub, you can indicate that with the `cyclecloud/` prefix:

```ini
[[[cluster-init cyclecloud/PROJECT:SPEC:VERSION]]]
```

This section tells CycleCloud to download the project files from GitHub and upload them to your locker in a special cache area. Without `cyclecloud/` in the cluster-init reference, CycleCloud expects you to upload the project manually.

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

The `[[[cluster-init PROJECT:SPEC:VERSION]]]` form is a shorthand for the following section:
```ini
    [[[cluster-init]]]
      Project = PROJECT
      Version = VERSION
      Spec = SPEC
```

You can also use `[[[cluster-init SOURCE_LOCKER/PROJECT:SPEC:VERSION]]]` to specify a `SourceLocker` for the cluster-init spec. The source locker is optional. Without it, CycleCloud assumes the locker already has the files staged. If set to the special name `cyclecloud`, it uses a built-in project defined in CycleCloud whose contents are stored in GitHub. Otherwise, if set to a different locker, it stages the files from that locker to the target locker before starting the node. This feature is useful for custom cluster-init projects and multi-region deployments. You manually stage the files to a single locker, and CycleCloud uses that locker as a source locker for nodes in other regions.

> [!NOTE]
> Projects that are staged automatically are put in a special cache directory of the target locker so that they don't conflict with projects you stage manually.

## Attribute reference

Attribute | Type | Definition
------ | ----- | ----------
Project | String | Name of the CycleCloud project.
Version | String | Version of the CycleCloud project specification.
Spec | String | Name of the CycleCloud project specification.
Locker | String | Name of the locker to download the project specification from.
SourceLocker | String | Optional. Name of another locker that should be used to stage files from. If set to the special name _cyclecloud_, it uses a built-in project defined in CycleCloud whose contents are stored in GitHub.
Order | Integer | Optional integer that you can use to override the order of the specs. The default starts at 1000 and goes up by one for each spec.

