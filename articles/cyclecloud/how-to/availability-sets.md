---
title: How to Use Availability Sets
description: How to use availability sets within Azure CycleCloud.
author: bwatrous
ms.date: 06/21/2022
ms.author:  bewatrou
---

# Availability Sets

Azure provides several models for Virtual Machine placement for both fault isolation and proximity placement.  [Virtual Machine Scalesets](/azure/virtual-machine-scale-sets/overview), [Proximity Placement Groups](/azure/virtual-machines/linux/co-location?ocid=AID754288&wt.mc_id=azfr-c9-dbrown&wt.mc_id=CFID0493), and [Availability Sets](/azure/virtual-machines/windows/manage-availability#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy) are the most common.

In general, Azure recommends Virtual Machine Scale Sets (VMSS) and potentially Proximity Placement Groups over Availability Sets.  And, by default, Azure CycleCloud places all VMs in a NodeArray in one or more Virtual Machine Scale Sets. VMSS is the recommended deployment model for large scale, dynamic clusters, and is the correct choice for most CycleCloud clusters.

However, Azure CycleCloud does support configuring one or all NodeArrays in a cluster to place VMs using Availability Sets as an alternative to VMSS for rare cases where they are required/useful.

## When should I use Availability Sets in a CycleCloud cluster?

Availability Sets still make sense for two common use-cases.  

The first is to guarantee failure isolation for small sets of key VMs such as failover-pairs for cluster head-nodes.  For head-nodes, the richer control over each individual Virtual Machine in an Availability Set may be valuable as an alternative to simply using replica instances in a VMSS.

The second common use case is to place a mix of Nodes and NodeArrays in the same Infiniband group to enable Infiniband interconnect between disparate roles in the Cluster. For example, some clusters may benefit from co-locating a shared filesystem supporting IB in the same IB network as the compute Nodes and/or the scheduler Node. This is currently not supported with VMSS, but is well supported with Availability Sets.

## Creating and/or Adding Nodes to an Availability Set

Azure CycleCloud is able to place VMs in existing Availability Sets, but more commonly a cluster will create its own Availability Set since the Availability Set lifetime is generally associated with Cluster lifetime.

In a cluster template, the `AvailabilitySet.Name` attribute may be set on a Node or NodeArray to specify that the Node(s) should be added to the AvailabilitySet.

For example, if a cluster template sets `AvailabilitySet.Name` in the `[[node defaults]]` settings, then all nodes in the cluster will be added to the Set and if the Set does not already exist it will be created.

```ini
    [[node defaults]]
    ...
    # Add all nodes to Availability Set with name "SampleAvailSet"
    AvailabilitySet.Name = SampleAvailSet
```

> [!NOTE]
> If CycleCloud creates the Availability Set, then the Set lifetime is scoped to the cluster and CycleCloud will also destroy the Set when the cluster is deleted.

### Availability Set Attributes

CycleCloud makes the following Availability Set configuration attributes available:

Attribute | Type | Definition
------ | ----- | ----------
AvailabilitySet.Name | String | A unique name that identifies the new or existing Availability Set
AvailabilitySet.PlatformFaultDomainCount | Integer | Fault Domain count.
AvailabilitySet.PlatformUpdateDomainCount | Integer | Update Domain count.
AvailabilitySet.ResourceId | ResourceID | ID of an existing Availability Set created externally to the cluster

See the [Availability Sets reference](/rest/api/compute/availabilitysets/createorupdate#request-body) for full documentation of the uses for the available configuration attributes.

## Configuring Nodes for Infiniband

> [!IMPORTANT]
> This section describes configuring Nodes for Infiniband when VMSS is not appropriate.
> Most clusters using Infiniband for MPI should use VMSS rather than Availability Sets.  For clusters using VMSS, Infiniband is available to all Nodes in a single VMSS with `singlePlacementGroup=true`.  For CycleCloud clusters supporting auto-scaling, this is generally automatic.

There are two parts to placing cluster nodes in an Availability Set. First, the Availability Set Fault and update Domain counts must be set to 1 to ensure placement on a single network fault domain. Second, since VMSS instances can not be placed in an Availability Set, the cluster must disable the use of VMSS for node allocation using the `Azure.AllocationMethod=standalone` for all NodeArrays to be added to the Availability Set.

To place all cluster nodes in a single Infiniband switch, use the following configuration:

```ini
    [[node defaults]]
    ...
    # Add all nodes to Availability Set with name "SampleAvailSet"
    AvailabilitySet.Name = SampleAvailSet
    AvailabilitySet.PlatformFaultDomainCount = 1
    AvailabilitySet.platformUpdateDomainCount = 1

    # Disable VMSS for NodeArrays to which this attribute applies and use individual VM allocation
    Azure.AllocationMethod=standalone
```

## Further Reading

* [CycleCloud Availability Set Attribute Reference](../cluster-references/node-nodearray-reference.md)
* [Availability Sets reference](/rest/api/compute/availabilitysets/createorupdate#request-body)