---
title: Cluster Template Reference Overview
description: View reference information on cluster templates in Azure CycleCloud. See cluster template file hierarchy, object attributes, parameters, and template objects.
author: mvrequa
ms.date: 06/29/2025
ms.author: mirequa
ms.topic: conceptual
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---

# CycleCloud cluster template file

You define CycleCloud clusters in declarative and hierarchical text files called templates. You can [download](~/articles/cyclecloud/download-cluster-templates.md) several example CycleCloud cluster templates.

> [!NOTE]
> The CycleCloud cluster template file is case insensitive.

## CycleCloud cluster template file hierarchy

The cluster template file uses a hierarchical structure. Each section defines a primary object and includes the object's name in the section header (for example, `[cluster my-cluster]`). The number of square brackets shows the rank, with fewer brackets indicating higher rank. The top of the hierarchy, and the only required object in the cluster template file, is the `[cluster]` object. The specific order of the sections doesn't matter.

``` template
[cluster]
  [[node, nodearray]]
    [[[volume]]]
    [[[network-interface]]]
    [[[cluster-init]]]
    [[[input-endpoint]]]
    [[[configuration]]]
[environment]
[noderef]
[parameters]
  [[parameters]]
    [[[parameter]]]
```

A `[cluster]` can contain a `[[node]]`, which can contain a `[[[volume]]]`.

A `[[[volume]]]` must be within a `[[node]]`, which must be within a `[cluster]`.

Many objects correspond to Azure resources. For example, `[[node]]` corresponds to Azure VM, `[[[volume]]]` corresponds to Azure Disk, and `[[[network-interface]]]` corresponds to Network Interface.

## Object Attributes

Each object can have attributes that control its behavior:

``` ini
[[node my-node]]
Attribute1 = Value1
Attribute2 = Value2
```

## Parameters

[Cluster Parameters](./parameter-reference.md) are variables you set when you create a cluster. Use these parameters in the definition of any attribute.

``` ini
[cluster MyCluster]
  Attribute0 = $MyParameter

  [[parameter MyParameter]]
  DefaultValue = 200
```

The `$` character lets you specify a parameter value by name.

Parameters have properties that define their type and control how the cluster UI selectors represent them. You define parameters when you create the cluster. You can set them by using the command line parameter flag `-p parameter-file.json` or the cluster UI.

### Special Parsing

The [template parser](./special-parsing.md) can handle certain logic, special definitions, and process functions of parameter values:

``` ini
Attribute1 = ${ifThenElse(AccessSubnet !== undefined, AccessSubnet, ComputeSubnet)}
```

The `${}` syntax activates the special parser.

## Template objects

The following template objects are currently supported:

* [**cluster**](./cluster-reference.md)
* [**node, nodearray**](./node-nodearray-reference.md)
* [**volume**](./volume-reference.md)
* [**network-interface**](./network-interface-reference.md)
* [**configuration**](./configuration-reference.md)
* [**cluster-init**](./cluster-init-reference.md)
* [**environment**](./environment-reference.md)
* [**noderef**](./noderef-reference.md)
* [**parameters**](./parameter-reference.md)
