---
title: Cluster Template Reference - Nodes
description: Attributes for nodes and nodearrays within cluster templates for use with Azure CycleCloud
author: adriankjohnson
ms.date: 07/15/2024
ms.author: adjohnso
---

# Node and Nodearray Objects

Node and nodearray objects are rank 2 objects that subordinate to `cluster`. A node represents a single virtual machine, whereas a nodearray can represent a collection of virtual machines or at least one virtual machine scale set.

## Node Defaults

The `[[node defaults]]` is a special abstract node that specifies the default settings for all nodes and nodearrays in a cluster:

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

The `$Credentials` is a reference to a parameter named `Credentials`.

In `my-cluster`, the `grid` nodearray [inherits](#inheritance) the Credential and SubnetId values from the `node defaults` node but uses a specific HPC VM size of `Standard_H16`.

## Example

This example template creates a cluster with two nodes and a node array. The proxy node uses the `IsReturnProxy` property to define the special role of `ReturnProxy`. This node acts as the endpoint for a reverse channel proxy that comes from CycleCloud when the cluster starts.

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

You need at least four required attributes to successfully start a node:

Attribute | Type | Definition
------ | ----- | ----------
MachineType | String | The Azure VM Size
SubnetId | String | Subnet definition in the form `${rg}/${vnet}/${subnet}`. Note this value isn't the full resource ID.
Credentials | String | Name of the Cloud Provider account.

The fourth required attribute relates to an image. You must provide an image attribute, but you can choose from several forms. For more information, see Image Attributes.

## Additional attributes

::: moniker range="=cyclecloud-7"
Attribute | Type | Definition
------ | ----- | ----------
ComputerName | String | Computer name for the VM. If you specify this attribute, it overrides the system-generated name.
ComputerNamePrefix | String | Prefix added to system-generated computer names.
Zone | String (list) | Availability Zone for the VM or VMSS. Can be a list for VMSS. For example, `Zone = 1,3`.
KeyPairLocation | Integer | Location where CycleCloud finds an SSH keypair on the local filesystem.
KeepAlive | Boolean | If true, CycleCloud prevents the termination of this node.
Locker | String | Name of the locker to use for downloading project specs. See [Use Projects](~/articles/cyclecloud/how-to/projects.md).
::: moniker-end

::: moniker range=">=cyclecloud-8"
Attribute | Type | Definition
------ | ----- | ----------
ComputerName | String | Computer name for the VM. If you specify a name, it overrides the system-generated name.
ComputerNamePrefix | String | Prefix added to system-generated computer names.
EphemeralOSDisk | Boolean | Use an ephemeral boot disk for the VM, if supported.
Zone | String (list) | Availability Zone for the VM or VMSS. Can be a list for VMSS. For example, `Zone = 1,3`.
ProximityPlacementGroupId | String | Full ID for the Proximity Placement Group to put this node in. Must start with `/subscriptions/`.
PlacementGroupId | String | If set, this label places the node in a single placement group with all other nodes that have a matching value for `PlacementGroupId`. This configuration offers lower latency communication and is required to enable InfiniBand on VM sizes that support it. The scheduler usually sets this value as needed, so you don't need to specify it manually.
KeyPairLocation | Integer | Where CycleCloud finds an SSH keypair on the local filesystem
KeepAlive | Boolean | If true, CycleCloud prevents the termination of this node
Locker | String | Name of the locker from which to download project specs. See [Use Projects](~/articles/cyclecloud/how-to/projects.md)
BootDiagnosticsUri | String | Storage URI for boot diagnostics (example: `https://mystorageaccount.blob.core.windows.net/`), if specified. Storage charges apply.
HybridBenefit | Boolean | If true, enables "Azure Hybrid Benefit" licensing for Windows VMs
NetworkSecurityGroupId | String | If given, the full resource ID for a Network Security Group to use for this node. You can also specify this value as `SecurityGroup` on a [network interface](network-interface-reference.md).
EnableTerminateNotification (8.2.0+) | Boolean | If true, enables [Terminate Notification](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification) to send events on VM deletion to the VM for local handling. This setting only applies to scale set VMs.
TerminateNotificationTimeout (8.2.2+) | Relative Time | If terminate notification is enabled, this setting controls how long VMs have to handle the event before being deleted.
ThrottleCapacity (8.2.2+) | Boolean | If true, the node array reports 0 capacity to autoscales for a default of five minutes after encountering a capacity issue.
ThrottleCapacityTime (8.2.2+) | Relative Time | If you enable `ThrottleCapacity`, set how long to report 0 availability after capacity is constrained. The default is "5m".
HybridBenefitLicense (8.3.0+)| String | If `HybridBenefit` is true, specify the license to use: `RHEL_BYOS`, `SLES_BYOS`, or `Windows_Server`. The default is `Windows_Server`.
FlexScaleSetId (8.3.0+) | String | Enter the fully qualified ID of a scale set in [Flex orchestration mode](../how-to/flex-scalesets.md) that you want to use for the VM in this node.
EncryptionAtHost (8.4.0+) | Boolean | If true, the virtual machine has [Encryption At Host](/azure/virtual-machines/disk-encryption) enabled.
SecurityType (8.5.0+) | String | Sets the [security type](../how-to/vm-security.md); either undefined, `TrustedLaunch`, or `ConfidentialVM`.
| EnableSecureBoot (8.5.0+) | Boolean | Enables [Secure Boot](../how-to/vm-security.md) if you use Trusted Launch VMs or Confidential VMs.
| EnableVTPM (8.5.0+) | Boolean | Enables [Virtual Trusted Platform Module](../how-to/vm-security.md) if you use Trusted Launch VMs or Confidential VMs.
| ScaleSetUpgradePolicyMode (8.6.2+) | String | Specifies the scale set upgrade policy. This policy controls what happens to existing VMs in a scale set when you modify the scale set template outside CycleCloud. Generally, enable this policy if you use an automated tool to modify existing scale sets, such as Azure Policy. Note: this policy doesn't automatically upgrade the OS image. Choose one of `Automatic`, `Rolling`, or `Manual` (the default).

> [!NOTE]
> A proximity placement group is a general Azure feature. You need to create one before you can reference it on a node. 
> This feature lets CycleCloud VMs colocate with other Azure resources in that proximity placement group, but it doesn't enable InfiniBand networking. 
> In contrast, `PlacementGroupId` is an arbitrary string in CycleCloud that you use to group VMs for nodes into a single scale set. This scale set is constrained to be under the same networking switch, but it might not colocate with other Azure resources. 
> You can use both features together, but this combination might reduce the number of VMs that you can allocate.

::: moniker-end

### Image attributes

You must specify the VM image to launch a virtual machine. There are three valid forms of image definition: default CycleCloud image names, Marketplace image definitions, and image IDs.

#### ImageName

CycleCloud supports several default Marketplace images for different OS flavors. You can specify these images with an `ImageName`.

Attribute | Type | Definition
------ | ----- | ----------
ImageName | String | Cycle-supported image name. Use one of the following: `cycle.image.win2016`, `cycle.image.win2012`, `cycle.image.centos7`, `cycle.image.centos6`, `cycle.image.ubuntu16`, `cycle.image.ubuntu14`.

#### Marketplace images

Along with cycle-managed marketplace images, you can use any marketplace image by specifying the `Publisher`, `Offer`, `Sku`, and `ImageVersion`.

Attribute | Type | Definition
------ | ----- | ----------
Azure.Publisher | String | Publisher of VM Marketplace image
Azure.Offer | String | Offer for VM Marketplace image
Azure.Sku | String | Sku of VM Marketplace image
Azure.ImageVersion | String | Image version of marketplace image

> [!NOTE]
> You can also specify a marketplace image in the `ImageName` attribute. Encode it as a URN in the form `Publisher:Offer:Sku:ImageVersion`.

#### Images with custom pricing plan

Shared Image Gallery images that have a pricing plan attached require information about the plan to be used, unless that information is stored in the Shared Image Gallery image. Specify this information with the `ImagePlan` attribute by using the Publisher, Product, and Plan nested attributes.

> [!NOTE]
> Using custom images with a pricing plan requires CycleCloud 8.0.2 or later.

#### ImageId

You can also use the resource ID of a VM image in the Credential's subscription:

Attribute | Type | Definition
------ | ----- | ----------
ImageId | String | Resource ID of VM image

#### Image attributes

Marketplace images and images you define with ImageIds need a few extra settings to work with the CycleCloud OS extension:

Attribute | Type | Definition
------ | ----- | ----------
DownloadJetpack | Boolean | If false, CycleCloud doesn't download Jetpack from the storage account. Jetpack must already be installed. Note: only Linux nodes are supported. Defaults to true. Added in 8.4.1. 
InstallJetpack | Boolean | If false, CycleCloud doesn't install Jetpack on new VMs. Defaults to true.
AwaitInstallation | Boolean | If false, CycleCloud doesn't wait for Jetpack to report installation details when it creates the VM. Defaults to true.
JetpackPlatform | String | Jetpack installer platform to use: `centos-7`, `centos-6`, `ubuntu-14.04`, `ubuntu-16.04`, `windows`. Deprecated in 7.7.0.

> [!WARNING]
> We don't recommend setting `InstallJetpack` or `AwaitInstallation`. In addition, setting `DownloadJetpack` requires a custom image with the correct version of Jetpack install. Set `DownloadJetpack` only if your environment is experiencing issues downloading from storage accounts. 

> [!NOTE]
> If you include multiple image definitions in a single node definition, the deployment uses `ImageId` by default.

### Alternative image sample

The following sample template uses the three alternate image constructs for the nodes:

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

## Advanced networking attributes

Attribute | Type | Definition
------ | ----- | ----------
IsReturnProxy | Boolean | Set up a reverse channel proxy to this node. Only one node per cluster can have this setting as true.
ReturnPath.Hostname | Hostname | Hostname where node can reach CycleCloud.
ReturnPath.WebserverPort | Integer | Webserver port where node can reach CycleCloud.
ReturnPath.BrokerPort | Integer | Broker where node can reach CycleCloud.

### Tags

CycleCloud supports tagging VMs and VMSS.

Attribute | String | Definition
------ | ----- | ----------
Tags | String | Use `tags.my-tag = my-tag-value` to add tags to the deployment in addition to the tags assigned by CycleCloud by default.

### Regular/Spot attributes

CycleCloud supports the use of Spot VMs through the following attributes. For more information, see [Spot Virtual Machines](~/articles/cyclecloud/how-to/cluster-templates.md#spot-virtual-machines).

Attribute | String | Definition
------ | ----- | ----------
Interruptible | Boolean | If true, the VM is a Spot VM that offers reduced pricing.
MaxPrice | Float | The maximum price you want to pay for the VM. (Default: -1)

### Nodearray-specific attributes

All of the attributes for a node are valid for a nodearray, but a node array is an elastic resource so additional attributes are available. 
Nodearray is a driver for Azure VirtualMachine ScaleSets (VMSS) and can have many backing VMSSs.  

::: moniker range="=cyclecloud-7"
Attribute | String | Definition
------ | ----- | ----------
Azure.AllocationMethod  | String | Set this attribute to `StandAlone` to manage single VMs or leave undefined to use VMSS.
Azure.SingleScaleset  | Boolean | Use a single VMSS for all nodes (Default: false).
Azure.SinglePlacementGroup | Boolean | Use the single placement group setting for the VMSS. (Default: false)
Azure.Overprovision | Boolean | Use the Overprovision feature of VMSS. Cyclecloud dynamically sets this value depending on the scenario. This value is an override.
Azure.MaxScaleSetSize | Integer | Limit the number of VMs in a single VMSS. Once this maximum is reached, CycleCloud adds extra VMSS to the cluster. (Default: \`40\`)
InitialCount | Integer | Number of nodes to start when the cluster starts.
MaxCount | Integer | To ensure that the cluster never exceeds 10 nodes, specify a value of 10. Use MaxCount and MaxCoreCount together. The lower effective constraint takes effect.
InitialCoreCount | Integer | Number of cores to start when the cluster starts.
MaxCoreCount | Integer | To ensure that the cluster never exceeds 100 cores, specify a value of 100. Use MaxCount and MaxCoreCount together. The lower effective constraint takes effect.
ShutdownPolicy | String | Indicates what to do with the VM when a node shuts down. If `terminate`, the VM is deleted when the node shuts down. If `deallocate`, the node is stopped instead. (Default: terminate)
::: moniker-end

::: moniker range=">=cyclecloud-8"
Attribute | String | Definition
------ | ----- | ----------
Azure.AllocationMethod  | String | Set this value to `StandAlone` to manage single VMs or leave it undefined to use VMSS.
Azure.SingleScaleset  | Boolean | Use a single VMSS for all nodes (Default: false).
Azure.SinglePlacementGroup | Boolean | Use the single placement group setting for the VMSS. (Default: false)
Azure.Overprovision | Boolean | Use the Overprovision feature of VMSS. CycleCloud dynamically sets this value depending on the scenario. This setting acts as an override.
Azure.MaxScaleSetSize | Integer | Limit the number of VMs in a single VMSS. Once this maximum is reached, CycleCloud adds extra VMSS to the cluster. (Default: \`40\`)
InitialCount | Integer | Number of nodes to start when the cluster starts.
MaxCount | Integer | To ensure that the cluster never exceeds 10 nodes, specify a value of 10. Use MaxCount and MaxCoreCount together. The lower effective constraint takes effect.
InitialCoreCount | Integer | Number of cores to start when the cluster starts.
MaxCoreCount | Integer | To ensure that the cluster never exceeds 100 cores, specify a value of 100. Use MaxCount and MaxCoreCount together. The lower effective constraint takes effect.
ShutdownPolicy | String | Indicates what to do with the VM when a node shuts down. If you set the value to `terminate`, the VM is deleted when the node shuts down. If you set the value to `deallocate`, the node is stopped instead. (Default: terminate)
ThrottleCapacity | Boolean | Whether to suspend requests to Azure upon receiving `Insufficient Capacity` signal. (Default: false)
ThrottleCapacityTime | Relative Time | Backoff time after receiving `Insufficient Capacity` signal from Azure. `AvailableCount` is reported as zero during this time. (Default: \`5m\`)
::: moniker-end

> [!NOTE]
> All VMSSs are assigned `FaultDomainCount = 1`.

### Inheritance

You can derive nodes and node arrays that are closely related from other nodes in the same cluster template. These inherited definitions reduce the number of declarations you need by sharing common attributes. The commonly used `[[node defaults]]` section is a special abstract definition that applies to all nodes and node arrays in the cluster.

Attribute | String | Definition
------ | ----- | ----------
Abstract | Boolean | If true, don't create a node or node array in the cluster. Use the abstract for inheritance. (Default: false)
Extends | String (list) | Ordered list of inherited node and node array names. Items later in the list take precedence when values conflict. The `defaults` node is always effectively first in the list. (Default: [])

## Subordinate objects

The node and nodearray objects have [volume](./volume-reference.md), [network-interface](./network-interface-reference.md), [cluster-init](./cluster-init-reference.md), [input-endpoint](./input-endpoint-reference.md), and [configuration](./configuration-reference.md) as subordinate objects.
