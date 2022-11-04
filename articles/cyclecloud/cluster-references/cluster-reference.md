---
title: Cluster Reference Docs
description: CycleCloud template reference for the Cluster section
author: adriankjohnson
ms.date: 03/10/2020
ms.author: adjohnso
---

# Cluster Section

A cluster template file must have at least one `[cluster]` section with an inline name attribute.  This is the only required section of the file.

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

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
Abstract | Boolean | Whether cluster definition is purely for child reference.
Autoscale | Boolean | Enable auto-start and stop on nodearrays
Category | String | Which category to display the cluster icon
CategoryOrder | Integer | Install to a directory other than /opt/cycle_server
FormLayout    | String  | "SelectionPanel" for a multi-panel display or "List" for a flat list of parameters. Defaults to "List" if not set.
IconUrl  | URL | link to representative icon for cluster displayed in UI
MaxCount | Integer | To ensure that the cluster never exceeds 10 nodes you would specify a value of 10. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
MaxCoreCount | Integer | To ensure that the cluster never exceeds 100 cores you would specify a value of 100. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
ParentName | String | Assume properties of abstract parent cluster in the same cluster template file unless local override.

> [!NOTE]
> None of the cluster attributes are required.

## Subordinate Objects

The cluster object has either `[[node]]` or `[[nodearray]]` as subordinate objects.
