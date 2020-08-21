---
title: Cluster Template Reference - Parameters
description: Read reference material for cluster template parameters to be used with Azure CycleCloud. See examples, an attribute reference, and a parameter type reference.
author: KimliW
ms.date: 03/10/2020
ms.author: adjohnso
---

# Cluster Parameters

Parameter(s) are a multirank object 1, 2 ... n that can be subordinate to `[parameters]`.

`[parameter]`, singular is a parameter object and can be referenced by other objects.
`[parameters]`, plural, is a section.  

``` ini
[parameters main]
  [[parameters sub-main]]
    [[[parameters sub-sub-main]]]
      [[[[parameter my-parameter]]]]
```

The nested parameter structure are exclusively for the purpose of rendering the
parameter selection menus. Do not mix parameter ranks in a single template or UI
rendering will be adversely affected.

## Examples

Many of the attributes for parameters are dedicated to support selection of
parameter values in the UI. CycleCloud maintains a list of Azure Subnets in the
managed subscription and we have a special parameter attribute for selecting from
that list.

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

The `$` is a reference to a parameter name.

## Attribute Reference

Attributes available with the `[parameter]` object for any rank.

| Attribute | Type | Definition |
| --------- | ---- | ---------- |
| Label | String | Label of parameter entry field in the UI |
| Description | String | Longer description of the parameter entry field in the UI |
| Required | Boolean | Force the user to enter a value for this parameter in the UI. Default is false. |
| DefaultValue | Any | Default value for parameter. Can be boolean, string, list according to parameter definition. |
| Disabled | Boolean | Hide the parameter in the UI and mute the value in the cluster interpretation. |
| ParameterType | String | Custom parameter types to effect rendering, selection behavior and value constraints. See Below. Default is String. |
| Config. | String | ParameterType dependent additional configs. Use as Config.config-name = config-value. Keys include Filter |
| Widget.Plugin | String | Some parameters are provided through javascript widgets. Widget name. |
| Widget.Label | String | Label for javascript widget. |

## ParameterType Reference

CycleCloud supports a number of different parameter types to facilitate selection,
promote clarity and reduce erroneous parameter choices.

Special parameter types in Azure beginning with the `Azure` key might respect special
parameter names like Credential and Region. Credential and Region inform these
parameter selectors which options to present based on subscription and location.

| ParameterType | Definition |
| ------------- | ---------- |
| Boolean | Boolean checkbox selector |
| String | String parameter field |
| StringList | String list builder|
| Password | Entering a password with obfuscation. |
| Cloud.Region | Supported and available Azure Location. *Recommended for all Cluster Templates.* |
| Cloud.Credentials | CycleCloud Provider Account. *Recommended for all Cluster Templates.* |
| Cloud.ClusterInitSpecs | Cluster-Init Project selector. |
| Azure.LiveStorageAccount | |
| Azure.LiveStorageContainer | |
| Azure.Location | |
| Azure.StorageAccount | |
| Azure.Environment | Azure deployments existing in subscription selector |
| Azure.ResourceGroup | Azure Resource Group selector |
| Azure.MachineType | Azure VM size selector |
| Azure.ManagedIdentity | Azure Managed Identity selector |
| Azure.Subnet | Azure Subnet selector |
