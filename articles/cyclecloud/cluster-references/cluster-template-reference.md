---
title: Cluster Template Reference Overview
description: View reference information on cluster templates in Azure CycleCloud. See cluster template file hierarchy, object attributes, parameters, and template objects.
author: mvrequa
ms.date: 03/9/2020
ms.author: mirequa
---

# CycleCloud Cluster Template File

CycleCloud clusters are defined in declarative and hierarchical text files called templates. A number of example CycleCloud cluster templates are available for [download](~/download-cluster-templates.md)

> [!NOTE]
> The CycleCloud cluster template file is case insensitive throughout.

## CycleCloud Cluster Template File Hierarchy

The cluster template file is organized into a hierarchical structure. Each section defines a primary object and the object's name appears in the section header (eg. `[cluster my-cluster]`). The number of square brackets represents the rank, with fewer brackets indicating higher rank. The top of the hierarchy, and the only required object in the Cluster Template file is the `[cluster]` object. The specific order of the sections is not important.

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

A `[cluster]` may contain a `[[node]]`, which may contain a `[[[volume]]]`.

A `[[[volume]]]` must be within a `[[node]]`, which must be within a `[cluster]`.

Many objects correspond to Azure resources. For example, `[[node]]` corresponds to Azure VM, `[[[volume]]]` corresponds to Azure Disk, and `[[[network-interface]]]` corresponds to Network Interface.

## Object Attributes

Each object may possess attributes which govern the object's behavior:

``` ini
[[node my-node]]
Attribute1 = Value1
Attribute2 = Value2
```

## Parameters

[Cluster Parameters](./parameter-reference.md) are variables set at cluster creation time. They can be used in the definition of any attribute.

``` ini
[cluster MyCluster]
  Attribute0 = $MyParameter

  [[parameter MyParameter]]
  DefaultValue = 200
```

The `$` is a special character to denote a parameter value by name.  

Parameters have properties both to define the type and to control how they are represented in the cluster UI selectors. Parameters are defined
at the time of cluster creation so they can either be set via command line parameter flag `-p parameter-file.json`, or by using the cluster UI.

### Special Parsing

The [template parser](./special-parsing.md) is capable of handling certain logic and special definitions and process functions of parameter values:

``` ini
Attribute1 = ${ifThenElse(AccessSubnet !== undefined, AccessSubnet, ComputeSubnet)}
```

The special parser is activated with the `${}` syntax.

## Template Objects

These are the currently supported template objects:

* [**cluster**](./cluster-reference.md)
* [**node, nodearray**](./node-nodearray-reference.md)
* [**volume**](./volume-reference.md)
* [**network-interface**](./network-interface-reference.md)
* [**configuration**](./configuration-reference.md)
* [**cluster-init**](./cluster-init-reference.md)
* [**environment**](./environment-reference.md)
* [**noderef**](./noderef-reference.md)
* [**parameters**](./parameter-reference.md)
