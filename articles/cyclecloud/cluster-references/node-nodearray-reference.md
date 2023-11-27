---
title: Cluster Template Reference - Nodes
description: Attributes for nodes and nodearrays within cluster templates for use with Azure CycleCloud
author: adriankjohnson
ms.date: 03/27/2023
ms.author: adjohnso
---

# Node and Nodearray Objects

Node and nodearray objects are rank 2, and subordinate to `cluster`. A node represents a single Virtual Machine, whereas a nodearray can represent a collection of Virtual Machines, or at least one Virtual Machine scale set.

## Node Defaults

The `[[node defaults]]` is a special abstract node that specifies the default setting for all nodes and nodearrays in a cluster:

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

The `$Credentials` is a reference to a parameter named "Credentials".

In `my-cluster`, the `grid` nodearray [inherits](#inheritance) the Credential and SubnetId from the node `defaults`, but uses a specific HPC VM size of `Standard_H16`.

## Example

This example template creates a cluster with two nodes and a nodearray. The proxy node uses the `IsReturnProxy` to define the special role of `ReturnProxy`, which will be the endpoint for a reverse channel proxy coming from CycleCloud when the cluster starts.

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

  [[node scheduler]]
    MachineType = Standard_D4s_v3

  [[nodearray execute]]
    MachineType = Standard_D16s_v3
```

## Required Attribute Reference

There are a minimum of four required attributes to successfully start a node:

Attribute | Type | Definition
------ | ----- | ----------
MachineType | String | The Azure VM Size
SubnetId | String | Subnet definition in the form `${rg}/${vnet}/${subnet}`
Credentials | String | Name of the Cloud Provider account.

The fourth required attribute is related to an image. An image attribute is required
but there are several forms it can take - see Image Attributes.

## Additional Attributes

::: moniker range="=cyclecloud-7"
Attribute | Type | Definition
------ | ----- | ----------
ComputerName | String | Computer name for VM. If specified, overrides the system-generated name.
ComputerNamePrefix | String | Prefix pre-pended to system-generated computer names
Zone | String (list) | Availability Zone for VM or VMSS. Can be a list for VMSS. E.g. `Zone = 1,3`
KeyPairLocation | Integer | Where CycleCloud will find a SSH keypair on the local filesystem
KeepAlive | Boolean | If true, CycleCloud will prevent the termination of this node
Locker | String | Specify the name of the locker from which to download project specs. See [Use Projects](~/how-to/projects.md)
::: moniker-end

::: moniker range=">=cyclecloud-8"
Attribute | Type | Definition
------ | ----- | ----------
ComputerName | String | Computer name for VM. If specified, overrides the system-generated name.
ComputerNamePrefix | String | Prefix pre-pended to system-generated computer names
EphemeralOSDisk | Boolean | Use ephemeral boot disk for VM, if supported
Zone | String (list) | Availability Zone for VM or VMSS. Can be a list for VMSS. E.g. `Zone = 1,3`
ProximityPlacementGroupId | String | The full id for the Proximity Placement Group to put this node in. Must start with `/subscriptions/`
PlacementGroupId | String | If set, this label is used to place this node in a single placement group with all other nodes that have a matching value for PlacementGroupId. This offers lower latency communication and is required to enable InfiniBand on VM sizes that support it. This is usually set by the scheduler as needed so it does not need to be manually specified.
KeyPairLocation | Integer | Where CycleCloud will find a SSH keypair on the local filesystem
KeepAlive | Boolean | If true, CycleCloud will prevent the termination of this node
Locker | String | Specify the name of the locker from which to download project specs. See [Use Projects](~/how-to/projects.md)
BootDiagnosticsUri | String | Storage URI for boot diagnostics (example: https://mystorageaccount.blob.core.windows.net), if specified. Storage charges will apply.
HybridBenefit | Boolean | If true, enables "Azure Hybrid Benefit" licensing for Windows VMs
EnableTerminateNotification (8.2.0+) | Boolean | If true, enables [Terminate Notification](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification) to send events on VM deletion to the VM for local handling. This only applies to scaleset VMs.
TerminateNotificationTimeout (8.2.2+) | Relative Time | If terminate-notification is enabled, this controls how long VMs are given to handle the event before being deleted.
ThrottleCapacity (8.2.2+) | Boolean | If true, this nodearray will report 0 capacity to autoscalers for a default of 5 minutes after encountering a capacity issue
ThrottleCapacityTime (8.2.2+) | Relative Time | If `ThrottleCapacity` is enabled, this is how long to report 0 availability after capacity is constrained. Default is "5m".
HybridBenefitLicense (8.3.0+)| String | If `HybridBenefit` is true, this specifies the license to use: `RHEL_BYOS`, `SLES_BYOS`, or `Windows_Server`. Default is  `Windows_Server`.
FlexScaleSetId (8.3.0+) | String | If set, this is the fully qualified id of a scaleset in [Flex orchestration mode](../how-to/flex-scalesets.md) that is used for the VM for this node.
EncryptionAtHost (8.4.0+) | Boolean | If true, the virtual machine will have [Encryption At Host](https://learn.microsoft.com/azure/virtual-machines/disk-encryption) enabled.
SecurityType (8.5.0+) | String | Sets the [security type](../how-to/vm-security.md); either undefined, `TrustedLaunch` or `ConfidentialVM`
| EnableSecureBoot (8.5.0+) | Boolean | Enables [Secure Boot](../how-to/vm-security.md), if using Trusted Launch VMs or Confidential VMs.
| EnableVTPM (8.5.0+) | Boolean | Enables [Virtual Trusted Platform Module](../how-to/vm-security.md), if using Trusted Launch VMs or Confidential VMs.

> [!NOTE]
> A Proximity Placement Group is a general Azure feature, and one must be created before it can be referenced on a node. 
> This lets CycleCloud VMs be collocated with other Azure resources in that proximity placement group, but does not enable InfiniBand networking. 
> In contrast, `PlacementGroupId` is an arbitrary string in CycleCloud used to group VMs for nodes into a single scaleset that is constrained to be under the same networking switch, but may not be collocated with other Azure resources. 
> They can both be used together but this may reduce the number of VMs that can be allocated.

::: moniker-end

### Image Attributes

The VM image is a required setting to launch a virtual machine. There are three valid forms of image definition: default CycleCloud image names, Marketplace image definitions and Image IDs.

#### ImageName

CycleCloud supports a number of default Marketplace images that are available for different OS flavors. These can be specified with an `ImageName`.

Attribute | Type | Definition
------ | ----- | ----------
ImageName | String | Cycle-supported image name.  cycle.image.[win2016, win2012, centos7, centos6, ubuntu16, ubuntu14]

#### Marketplace Images

Along with Cycle-managed Marketplace Images, any marketplace image can be used by specifying the `Publisher`, `Offer`, `Sku` and `ImageVersion`.

Attribute | Type | Definition
------ | ----- | ----------
Azure.Publisher | String | Publisher of VM Marketplace image
Azure.Offer | String | Offer for VM Marketplace image
Azure.Sku | String | Sku of VM Marketplace image
Azure.ImageVersion | String | Image Version of Marketplace image.

> [!NOTE]
> A Marketplace image can also be specified in the `ImageName` attribute, encoded as a URN in the form `Publisher:Offer:Sku:ImageVersion`.

#### Images With Custom Pricing Plan

Shared Image Gallery images that have a pricing plan attached require information about the plan to be used, unless that information is stored in the Shared Image Gallery image. That is specified with the `ImagePlan` attribute using the Publisher, Product, and Plan nested attributes.

> [!NOTE]
> Using custom images with a pricing plan requires CycleCloud 8.0.2 or later.

#### ImageId

Alternatively, the resource ID of a VM image in the Credential's subscription can also be used:

Attribute | Type | Definition
------ | ----- | ----------
ImageId | String | Resource ID of VM image

#### Image Attributes

Marketplace image and images defined by ImageIds need a few additional settings to properly configure the CycleCloud OS extension:

Attribute | Type | Definition
------ | ----- | ----------
DownloadJetpack | Boolean | If false, CycleCloud will not download Jetpack from the storage account. Jetpack must already be installed. Note: only Linux nodes are supported. Defaults to true. Added in 8.4.1. 
InstallJetpack | Boolean | If false, CycleCloud will not install Jetpack on new VMs. Defaults to true.
AwaitInstallation | Boolean | If false, CycleCloud will not wait for Jetpack to report installation details when the VM is created. Defaults to true.
JetpackPlatform | String | Jetpack installer platform to use: `centos-7`, `centos-6`, `ubuntu-14.04`, `ubuntu-16.04`, `windows`. Deprecated in 7.7.0.

> [!WARNING]
> Setting `InstallJetpack` or `AwaitInstallation` is not recommended. In addition, setting `DownloadJetpack` requires a custom image with correct version of Jetpack install and is only recommended for environments that are experiencing issues downloading from storage accounts. 

> [!NOTE]
> `ImageId` is used by default if multiple image definitions are included in a single node definition.

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
    DownloadJetpack = false

  [[node marketplace-vm-image]]
    Azure.Publisher = Canonical
    Azure.Offer = UbuntuServer
    Azure.Sku = 16.04-LTS
    Azure.ImageVersion = latest

  [[node custom-marketplace-vm-image]]
    ImageName = /subscriptions/9B16BFF1-879F-4DB3-A55E-8F8AC1E6D461/resourceGroups/my-rg/providers/Microsoft.Compute/images/jetpack-rhel8-1b1e3e93
    ImagePlan.Name = rhel-lvm8
    ImagePlan.Publisher = redhat
    ImagePlan.Product = rhel-byos
```

## Advanced Networking Attributes

Attribute | Type | Definition
------ | ----- | ----------
IsReturnProxy | Boolean | Establish reverse channel proxy to this node. Only one node per cluster may have this setting as true.
ReturnPath.Hostname | Hostname | Hostname where node can reach CycleCloud.
ReturnPath.WebserverPort | Integer | Webserver port where node can reach CycleCloud.
ReturnPath.BrokerPort | Integer | Broker where node can reach CycleCloud.

### Tags

CycleCloud supports tagging VMs and VMSS.

Attribute | String | Definition
------ | ----- | ----------
Tags | String | Use `tags.my-tag = my-tag-value` to add tags to the deployment in addition to the tags assigned by CycleCloud by default.

### Regular/Spot Attributes

CycleCloud supports the use of Spot VMs via the following attributes. See [Spot Virtual Machines](~/how-to/cluster-templates.md#spot-virtual-machines) for more detail.

Attribute | String | Definition
------ | ----- | ----------
Interruptible | Boolean | If true, the VM will be a Spot VM to provide reduced pricing.
MaxPrice | Float | The maximum price to spend on the VM. (Default: -1)

### Nodearray-Specific Attributes

All of the attributes for a node are valid for a nodearray, but a node array is an elastic resource so additional attributes are available. 
Nodearray is a driver for Azure VirtualMachine ScaleSets (VMSS) and can have many backing VMSSs.  

::: moniker range="=cyclecloud-7"
Attribute | String | Definition
------ | ----- | ----------
Azure.AllocationMethod  | String | Set this to `StandAlone` to manage single VMs or leave undefined to use VMSS.
Azure.SingleScaleset  | Boolean | Use a single VMSS for all nodes (Default: false).
Azure.SinglePlacementGroup | Boolean | Use the single placement group setting for the VMSS. (Default: false)
Azure.Overprovision | Boolean | Use the Overprovision feature of VMSS. Cyclecloud will dynamically set depending on the scenario. This is an override.
Azure.MaxScaleSetSize | Integer | Limit the number of VMs in a single VMSS. Once this maximum is reached, CycleCloud will add additional VMSS to cluster. (Default: \`40\`)
InitialCount | Integer | Number of nodes to start when cluster starts.
MaxCount | Integer | To ensure that the cluster never exceeds 10 nodes you would specify a value of 10. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
InitialCoreCount | Integer | Number of cores to start when cluster starts.
MaxCoreCount | Integer | To ensure that the cluster never exceeds 100 cores you would specify a value of 100. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
ShutdownPolicy | String | Indicates what to do with the VM when a node shuts down. If 'terminate' the VM is deleted when the node shuts down. If 'deallocate', the node is stopped instead. (Default: terminate)
::: moniker-end

::: moniker range=">=cyclecloud-8"
Attribute | String | Definition
------ | ----- | ----------
Azure.AllocationMethod  | String | Set this to `StandAlone` to manage single VMs or leave undefined to use VMSS.
Azure.SingleScaleset  | Boolean | Use a single VMSS for all nodes (Default: false).
Azure.SinglePlacementGroup | Boolean | Use the single placement group setting for the VMSS. (Default: false)
Azure.Overprovision | Boolean | Use the Overprovision feature of VMSS. Cyclecloud will dynamically set depending on the scenario. This is an override.
Azure.MaxScaleSetSize | Integer | Limit the number of VMs in a single VMSS. Once this maximum is reached, CycleCloud will add additional VMSS to cluster. (Default: \`40\`)
InitialCount | Integer | Number of nodes to start when cluster starts.
MaxCount | Integer | To ensure that the cluster never exceeds 10 nodes you would specify a value of 10. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
InitialCoreCount | Integer | Number of cores to start when cluster starts.
MaxCoreCount | Integer | To ensure that the cluster never exceeds 100 cores you would specify a value of 100. Note that MaxCount and MaxCoreCount can be used together, in which case the lower effective constraint will take effect.
ShutdownPolicy | String | Indicates what to do with the VM when a node shuts down. If 'terminate' the VM is deleted when the node shuts down. If 'deallocate', the node is stopped instead. (Default: terminate)
ThrottleCapacity | Boolean | Whether to suspend requests to Azure upon receiving `Insufficient Capacity` signal. (Default: false)
ThrottleCapacityTime | Relative Time | Backoff time after receiving `Insufficient Capacity` signal from Azure. `AvailableCount` will be reported as zero during this time. (Default: \`5m\`)
::: moniker-end

> [!NOTE]
> All VMSSs will be assigned `FaultDomainCount = 1`

### Inheritance

Nodes and nodearrays which are closely related can be derived from other nodes in the same cluster template.
These inherited definitions minimize the declarations needed by sharing common attributes. Commonly used is the
`[[node defaults]]` section, which is a special abstract definition that applies to all nodes and nodearrays in 
the cluster.

Attribute | String | Definition
------ | ----- | ----------
Abstract | Boolean | If true, don't create an node or nodearray in the cluster. The abstract can be used for inheritance. (Default: false)
Extends | String (list) | Ordered list of inherited node/nodearray names. Items later in the list take precedence when values conflict. 'defaults' node will always effectively be first in the list. (Default: [])

## Subordinate Objects

The node/nodearray objects have [volume](./volume-reference.md), [network-interface](./network-interface-reference.md), [cluster-init](./cluster-init-reference.md), [input-endpoint](./input-endpoint-reference.md), and [configuration](./configuration-reference.md) as subordinate objects.
