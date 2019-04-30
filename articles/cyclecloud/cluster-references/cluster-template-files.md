---
title: Azure CycleCloud Cluster Template Reference | Microsoft Docs
description: Use or Build Cluster Templates within Azure CycleCloud
author: mvrequa
ms.date: 08/22/2018
ms.author: mirequa
---

# CycleCloud Cluster Template File

CycleCloud cluster definitions are contained within a CycleCloud Cluster Template file.
This section documents the file hierarchy including the meaning and options for
the different sections.

> [!NOTE]
> The CycleCloud cluster template file is case insensitive throughout.

## CycleCloud Cluster Template File Hierarchy

Cluster template file is organized into the following hierarchical structure. The specific order is not important. Each section has a primary attribute, which is the attribute name that appears in the section header (eg. `[cluster my-cluster]`). The number of square brackets represents the rank, with fewer brackets indicating higher rank.  

- [cluster]
  - [[node, nodearray]]
    - [[[volume]]]
    - [[[network-interface]]]
    - [[[cluster-init]]]
    - [[[input-endpoint]]]
    - [[[configuration]]]
- [environment]
- [noderef]
- [parameters]
  - [[parameters]]
    - [[[parameter]]]

A `[cluster]` may contain a `[[node]]`, which may contain a `[[[volume]]]`.

A `[[[volume]]]` must be within a `[[node]]`, which must be within a `[cluster]`.

## Object Attributes

Each object type may possess attributes which govern their behavior:

``` ini
[[node my-node]]
Attribute1 = Value1
Attribute2 = Value2
```

## Parameters

Cluster Parameters are variables set at cluster creation time. They
can be used in the definition of any attribute.

``` ini
[cluster MyCluster]
  Attribute0 = $MyParameter

[[parameter MyParameter]]
DefaultValue = 200
```

The `$` is the special character to denote a parameter value by name.  

Parameters have properties both to define the type and to control how
they're represented in the cluster UI selectors. Parameters are defined
at the time of cluster creation, so they can either be set via command line parameter flag `-p parameter-file.json`, or by using the cluster UI.

### Special Parsing

The template parser is capable of handling certain logic and special definitions and process functions of parameter values:

``` ini
Attribute1 = ${ifThenElse(AccessSubnet !== undefined, AccessSubnet, ComputeSubnet)}
```

The special parser is activated with the `${}` syntax.
  
