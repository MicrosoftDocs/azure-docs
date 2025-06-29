---
title: Cluster Template Reference - Parameters
description: Read reference material for cluster template parameters to be used with Azure CycleCloud. See examples, an attribute reference, and a parameter type reference.
author: KimliW
ms.date: 06/03/2024
ms.author: adjohnso
ms.topic: conceptual
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---

# Cluster Parameters

Parameters are multirank objects 1, 2, ... n that you can subordinate to `[parameters]`.

`[parameter]`, singular, is a parameter object that other objects can reference.  
`[parameters]`, plural, is a section.

``` ini
[parameters main]
  [[parameters sub-main]]
    [[[parameters sub-sub-main]]]
      [[[[parameter my-parameter]]]]
```

The nested parameter structure exists only to render the parameter selection menus. Don't mix parameter ranks in a single template. Mixing ranks adversely affects UI rendering.

## Examples

Many of the attributes for parameters support selection of parameter values in the UI. CycleCloud maintains a list of Azure Subnets in the managed subscription, and it has a special parameter attribute for selecting from that list.

``` ini
[cluster scheduler]
Autoscale = $Autoscale
  [[node defaults]]
  SubnetId = $SubnetId

[parameter SubnetId]
  Label = Subnet ID
  Description = Subnet Resource Path (ResourceGroup/VirtualNetwork/Subnet)
  ParameterType = Azure.Subnet
  Required = True

[parameter Autoscale]
  Label = Autoscale
  DefaultValue = true
  Widget.Plugin = pico.form.BooleanCheckBox
  Widget.Label = Start and stop execute instances automatically
```

The `$` references a parameter name.

## Attribute reference

Attributes available with the `[parameter]` object for any rank.

| Attribute | Type | Definition |
| --------- | ---- | ---------- |
| Label | String | Label of parameter entry field in the UI |
| Description | String | Longer description of the parameter entry field in the UI |
| Required | Boolean | Force the user to enter a value for this parameter in the UI. Default is false. |
| DefaultValue | Any | Default value for parameter. Can be boolean, string, list according to parameter definition. |
| Disabled | Boolean | Hide the parameter in the UI and mute the value in the cluster interpretation. |
| ParameterType | String | Custom parameter types to affect rendering, selection behavior and value constraints. See Below. Default is String. |
| Config. | String | ParameterType dependent additional configs. Use as Config.config-name = config-value. Keys include Filter |
| Widget.Plugin | String | Some parameters are provided through JavaScript widgets. Widget name. |
| Widget.Label | String | Label for JavaScript widget. |

## ParameterType reference

CycleCloud supports different parameter types to make selection easier, promote clarity, and reduce errors.

Special parameter types in Azure that start with the `Azure` key might respect special parameter names like Credential and Region. Credential and Region inform these parameter selectors which options to present based on subscription and location.

| ParameterType | Definition |
| ------------- | ---------- |
| Boolean | Boolean checkbox selector |
| String | String parameter field |
| StringList | String list builder |
| Password | Password entry with obfuscation |
| Cloud.Region | Supported and available Azure Location. *Recommended for all Cluster Templates.* |
| Cloud.Credentials | CycleCloud Provider Account. *Recommended for all Cluster Templates.* |
| Cloud.ClusterInitSpecs | Cluster-Init Project selector |
| Azure.LiveStorageAccount | |
| Azure.LiveStorageContainer | |
| Azure.Location | |
| Azure.StorageAccount | |
| Azure.Environment | Azure deployments existing in subscription selector |
| Azure.ResourceGroup | Azure Resource Group selector |
| Azure.MachineType | Azure VM size selector |
| Azure.ManagedIdentity | Azure Managed Identity selector |
| Azure.Subnet | Azure Subnet selector |
