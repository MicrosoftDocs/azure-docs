---
title: Azure CycleCloud Template File Reference | Microsoft Docs
description: Parameter reference for CycleCloud Template Files.
services: azure cyclecloud
author: mvrequa
ms.prod: cyclecloud
ms.devlang: na
ms.topic: reference
ms.date: 08/01/2018
ms.author: a-kiwels
---

# CycleCloud Template File Reference

CycleCloud clusters are defined in declarative and hierarchical text files.
The top of the hierarchy and the only required object in the Cluster Template
File is the `[cluster]` object.  Many objects correspond to Azure resources.
`[[node]]` corresponds to Azure VM, `[[[volume]]]` corresponds to Azure Disk, and
`[[[network-interface]]]` corresponds to Network Interface.  

Documented below are the attributes for all template objects.  All objects have
an object name expressed in the object declaration.  The cluster template file is
case insensitive throughout.

Use of all attributes is done in the form of Attribute = Value pairs below the
object declaration.

```ini
  [[node my-node]]
    Attribute = Value
```

## `[cluster <name>]`

Top level object, highest rank.

Attribute | Type | Definition
------ | ----- | ----------
Abstract | boolean | Whether cluster definition is purely for child reference.
Autoscale | boolean | Enable auto-start and stop on nodearrays
Category | String | Which category to display the cluster icon
CategoryOrder | Integer | Install to a directory other than /opt/cycle_server
FormLayout    | String  | SectionPanel for multi-panel display of parameters
IconUrl  | URL | link to representative icon for cluster displayed in UI
MaxCount | Integer | To ensure that the cluster never exceeds 10 nodes you would specify a value of 10. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
MaxCoreCount | Integer | To ensure that the cluster never exceeds 100 cores you would specify a value of 100. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
ParentName | String | Assume properties of abstract parent cluster in the same cluster template file unless local override.

## `[[node <name>]]` and `[[nodearray <name>]]`

Second level object, child of `[cluster]`
Attributes for use with `[[node]]` and`[[nodearray]]` which correspond to Azure VM.

Attribute | Type | Definition
------ | ----- | ----------
MachineType | String | (Required) The Azure VM Size
SubnetId | String | (Required) Subnet definition in the form `${rg}/${vnet}/${subnet}`
Credentials | String | (Required) Name of the Cloud Provider account.
ImageName | String | Cycle-supported image name.  cycle.image.[win2016, win2012, centos7, centos6, ubuntu16, ubuntu14]
Azure.Publisher | String | Publisher of VM Marketplace image
Azure.Offer | String | Offer for VM Marketplace image
Azure.Sku | String | Sku of VM Marketplace image
Azure.ImageVersion | String | Image Version of Marketplace image.
ImageId | String | Resource ID of VM image
InstallJetpack | Boolean | CycleCloud will install jetpack with os extension.
AwaitInstallation | Boolean | Once a vm is started, wait for jetpack to report installation details.
JetpackPlatform | String | Jetpack installer platform to use: centos-7, centos-6, ubuntu-14, ubuntu-16, windows
ImageOs | String | Either `windows` or `linux` to inform CycleCloud how to structure the os extension.
IsReturnProxy | boolean | Establish reverse channel proxy to this node. Only one node per cluster may have this setting as true.
KeyPairLocation | Integer | Where CycleCloud will find a ssh keypair on the local filesystem
ReturnPath.Hostname | Hostname | Hostname where node can reach CycleCloud.
ReturnPath.WebserverPort | Integer | Webserver port where node can reach CycleCloud.
ReturnPath.BrokerPort | Integer | Broker where node can reach CycleCloud.

## `[[nodearray <name>]]`

Second level object, child of `[cluster]`.
Elastic attributes for use with `[[nodearray]]`, but not `[[node]]`.

Attribute | String | Definition
------ | ----- | ----------
Azure.AllocationMethod  | String | Set this to `StandAlone` to manage single VMs or leave undefined to use VM ScaleSets
Azure.SinglePlacementGroup  | Boolean | Use a single placement group for all VMSS, required by `ImageId`
InitialCount | Integer | Number of nodes to start when cluster starts.
MaxCount | Integer | To ensure that the cluster never exceeds 10 nodes you would specify a value of 10. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
InitialCoreCount | Integer | Number of cores to start when cluster starts.
MaxCoreCount | Integer | To ensure that the cluster never exceeds 100 cores you would specify a value of 100. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.

## `[[[volume <name>]]]`

Third rank object, child of `[[node]]`.  Corresponds to Azure Disk.

Attribute | Type | Definition
------ | ----- | ----------
Size | String | (Required) Size of disk in GB
VolumeId | String | Resource id for existing Azure Disk.
SSD | Boolean | If true use premium disk sku otherwise use standard disk. Default is false.
Azure.Lun | Integer | Override the auto-assigned LUN ID.
Mount | String | Name of mount construct, described in `configuration` object
Azure.Caching | String | None, readonly, readwrite. Default is none.
Persistent | Boolean | If false, disk will be deleted with vm is deleted. Default is false.


## `[[[network-interface <name>]]]`

Third rank object, child of `[[node]]`. Corresponds to Azure Network Interface.

Attribute | Type | Definition
------ | ----- | ----------
AssociatePublicIpAddress | Integer | Associate a public ip address with the NIC.
EnableIpForwarding | Boolean | If true, allow ip forwarding.
PrivateIp | IP Address | Assign a specific private ip address (node only)
NetworkInterfaceId | String | Specify an existing NIC by resource ID.
ApplicationSecurityGroups | String (list) | List of Application Security Groups by Resource ID and separated by comma

## `[[[cluster-init <name>]]]`

Third rank object, child of `[[node]]`. CycleCloud project spec, the object name
can be overloaded.  See CycleCloud Project.

Attribute | Type | Definition
------ | ----- | ----------
Project | String | Name of CycleCloud Project.
Version | String | Version of CycleCloud project spec.
Spec | String | Name of CycleCloud Project spec.
Locker | String | Name of locker from which to download project spec.

## `[[[input-endpoint <name>]]]`

Third rank object, child of `[[node]]`. Corresponds to Azure Network Security Group Rule.

Attribute | Type | Definition
------ | ----- | ----------
PublicPort | Integer | Port on public interface to allow to all traffic.  Starting value for VMSS will increment for each VM added.
PrivatePort | Integer | Port to receive public port redirection for VMSS load balancer.
Protocol | String | Tcp or udp. Default is tcp.

## `[[[configuration <name>]]]`

Configurable properties of CycleCloud Project Specs (see [Cluster Reference](~/cluster-references/cluster-reference.md)).

Attribute | Type | Definition
------ | ----- | ----------
PublicPort | Integer | Port on public interface to allow to all traffic.  Starting value for VMSS will increment for each VM added.
PrivatePort | Integer | Port to receive public port redirection for VMSS load balancer.
Protocol | String | Tcp or udp. Default is tcp.
