---
title: Azure CycleCloud Cluster Template Reference | Microsoft Docs
description: Attributes for nodes and nodearrays within cluster templates for use with Azure CycleCloud
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Node and Nodearray Objects

Node and nodearray objects are rank 2, and subordinate to `cluster`. A node represents a single Virtual Machine, whereas a nodearray can represent a collection of Virtual Machines, or at least one Virtual Machine scale set.

## Node Defaults

The `[[node defaults]]` is a special abstract node for default setting on all other nodes and nodearrays in a cluster:

``` ini
[cluster my-cluster]
  [[node defaults]]
  Credentials = $Credentials
  SubnetId = my-rg/my-vnet/my-subnet
  MachineType = Standard_D2s_v3

  [[nodearray grid]]
  ImageName = cycle.image.centos6
  MachineType = Standard_H16
```

The `$` is a reference to a parameter name.

In `my-cluster`, the `grid` nodearray inherits the Credential and SubnetId from the node defaults, but uses a specific HPC VM size of `Standard_H16`.

## Example

In this example, you are creating a cluster with two nodes and a nodearray. The proxy node has the special role of `ReturnProxy`, which will be the endpoint for a reverse channel proxy coming from CycleCloud when the cluster starts.

``` ini
[cluster my-cluster]

  [[node defaults]]
    Credentials = $Credentials
    SubnetId = $SubnetId
    KeyPairLocation = ~/.ssh/cyclecloud.pem
    ImageName = cycle.image.centos7

  [[node proxy]]
    IsReturnProxy = true
    MachineType = Standard_B2

  [[node master]]
    MachineType = Standard_D4s_v3

  [[nodearray execute]]
    MachineType = Standard_D16s_v3
```

## Required Attribute Reference

There are a minimum of 4 required attributes to successfully start a node:

Attribute | Type | Definition
------ | ----- | ----------
MachineType | String | The Azure VM Size
SubnetId | String | Subnet definition in the form `${rg}/${vnet}/${subnet}`
Credentials | String | Name of the Cloud Provider account.
ImageName | String | Cycle-supported image name.  cycle.image.[win2016, win2012, centos7, centos6, ubuntu16, ubuntu14]

### Image Attributes

The VM image is also a required setting to launch a virtual machine. There are three valid forms of image definition. Along with Cycle-managed Marketplace Images, any marketplace image can be used.

Attribute | Type | Definition
------ | ----- | ----------
Azure.Publisher | String | Publisher of VM Marketplace image
Azure.Offer | String | Offer for VM Marketplace image
Azure.Sku | String | Sku of VM Marketplace image
Azure.ImageVersion | String | Image Version of Marketplace image.

Alternatively, the resource ID of a VM image in the Credential subscription can be used:

Attribute | Type | Definition
------ | ----- | ----------
ImageId | String | Resource ID of vm image, requires `Azure.SinglePlacementGroup`

These two variations need a few additional settings to properly configure the CycleCloud OS extension:

Attribute | Type | Definition
------ | ----- | ----------
InstallJetpack | Boolean | CycleCloud will install jetpack with os extension.
AwaitInstallation | Boolean | Once a vm is started, wait for jetpack to report installation details.
JetpackPlatform | String | Jetpack installer platform to use: centos-7, centos-6, ubuntu-14, ubuntu-16, windows
ImageOs | String | Either `windows` or `linux` to inform CycleCloud how to structure the os extension.

### Alternative Image Sample

Here is a sample template using the three alternate image constructs for the nodes:

``` ini
[cluster image-example]
  [[node defaults]]
    Credentials = $Credentials
    MachineType = Standard_D2_v3
    SubnetId = my-rg/my-vnet/my-subnet

  [[node cycle-image]]
    ImageName = cycle.image.ubuntu16

  [[node my-custom-vm-image]]
    ImageId = /subscriptions/9B16BFF1-879F-4DB3-A55E-8F8AC1E6D461/resourceGroups/my-rg/providers/Microsoft.Compute/images/jetpack-rhel7-1b1e3e93

    # Jetpack already installed on image
    InstallJetpack = false
    AwaitInstallation = true
    ImageOs = linux  

  [[node marketplace-vm-image]]
    Azure.Publisher = Canonical
    Azure.Offer = UbuntuServer
    Azure.Sku = 16.04-LTS
    Azure.ImageVersion = latest

    # Install jetpack at launch time
    InstallJetpack = true
    JetpackPlatform = ubuntu-16.04
    AwaitInstallation = true
    ImageOs = linux
```

## Advanced Networking Attributes

Attribute | Type | Definition
------ | ----- | ----------
IsReturnProxy | boolean | Establish reverse channel proxy to this node. Only one node per cluster may have this setting as true.
KeyPairLocation | Integer | Where CycleCloud will find a ssh keypair on the local filesystem
ReturnPath.Hostname | Hostname | Hostname where node can reach CycleCloud.
ReturnPath.WebserverPort | Integer | Webserver port where node can reach CycleCloud.
ReturnPath.BrokerPort | Integer | Broker where node can reach CycleCloud.
AuthorizedKeysPath | String | Path on node where public keypair will be placed. e.g. _/opt/cycle/home/cyclecloud/.ssh/authorized_keys_

### Tags

CycleCloud supports tagging VMs and VMSS.

Attribute | Type | Definition
------ | ----- | ----------
Tags. | String | Use `tags.my-tag = my-tag-value` to add tags to the deployment in
addition to the tags assigned by CycleCloud by default.

### Nodearray-Specific Attributes

All of the attributes for a node are valid for a nodearray, but a node array is an
elastic resource so additional attributes are available.

Attribute | String | Definition
------ | ----- | ----------
Azure.AllocationMethod  | String | Set this to `StandAlone` to manage single VMs or leave undefined to use VM ScaleSets
Azure.SinglePlacementGroup  | Boolean | Use a single placement group for all VMSS, required by `ImageId`
InitialCount | Integer | Number of nodes to start when cluster starts.
MaxCount | Integer | To ensure that the cluster never exceeds 10 nodes you would specify a value of 10. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
InitialCoreCount | Integer | Number of cores to start when cluster starts.
MaxCoreCount | Integer | To ensure that the cluster never exceeds 100 cores you would specify a value of 100. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.

## Subordinate Objects

The node/nodearray objects have `volume`, `network-interface`, `cluster-init`,
`input-endpoint`, and `configuration` as subordinate objects.
