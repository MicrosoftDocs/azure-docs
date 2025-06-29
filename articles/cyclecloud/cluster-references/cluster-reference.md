---
title: Cluster Reference Docs
description: CycleCloud template reference for the Cluster section
author: adriankjohnson
ms.date: 05/31/2024
ms.author: adjohnso
ms.custom: compute-evergreen
---

# Cluster section

A cluster template file must have at least one `[cluster]` section with an inline name attribute. This section is the only required section of the file.

## Examples

Conventional cluster template files have a single cluster declaration.

``` ini
[cluster my-cluster]
    FormLayout = SelectionPanel
    Category = My Templates
    CategoryOrder = 100
    MaxCount = 200
    Autoscale = $Autoscale

    [[node defaults]]
        Credentials = $Credentials
```

## Attribute reference

Attribute | Type | Definition
------ | ----- | ----------
Abstract | Boolean | Whether the cluster definition is purely for child reference.
Autoscale | Boolean | Enable auto-start and stop on node arrays.
Category | String | Which category to display the cluster icon.
CategoryOrder | Integer | Install to a directory other than `/opt/cycle_server`.
FormLayout | String | `"SelectionPanel"` for a multi-panel display or `"List"` for a flat list of parameters. Defaults to `"List"` if not set.
IconUrl | URL | Link to representative icon for cluster displayed in UI.
MaxCount | Integer | To ensure that the cluster never exceeds 10 nodes, specify a value of 10. You can use `MaxCount` and `MaxCoreCount` together. The lower effective constraint takes effect.
MaxCoreCount | Integer | To ensure that the cluster never exceeds 100 cores, enter 100. You can use MaxCount and MaxCoreCount together. The lower effective constraint takes effect.
ParentName | String | Assume properties of abstract parent cluster in the same cluster template file unless local override.

> [!NOTE]
> None of the cluster attributes are required.

## Subordinate objects

The cluster object has either `[[node]]` or `[[nodearray]]` as subordinate objects.
