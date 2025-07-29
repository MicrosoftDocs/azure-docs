---
title: How to Use Availability Sets
description: How to use availability sets within Azure CycleCloud.
author: bwatrous
ms.date: 06/21/2022
ms.author:  bewatrou
---

# Availability sets

Azure provides several models for virtual machine placement for both fault isolation and proximity placement.  [Virtual Machine Scalesets](/azure/virtual-machine-scale-sets/overview), [Proximity Placement Groups](/azure/virtual-machines/linux/co-location?ocid=AID754288&wt.mc_id=azfr-c9-dbrown&wt.mc_id=CFID0493), and [Availability Sets](/azure/virtual-machines/windows/manage-availability#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy) are the most common.

In general, Azure recommends virtual machine scale sets (VMSS) and potentially proximity placement groups over availability sets. By default, Azure CycleCloud places all VMs in a NodeArray in one or more virtual machine scale sets. VMSS is the recommended deployment model for large scale, dynamic clusters, and is the correct choice for most CycleCloud clusters.

However, Azure CycleCloud supports configuring one or all NodeArrays in a cluster to place VMs using availability sets as an alternative to VMSS for rare cases where they're required or useful.

## When should I use Availability Sets in a CycleCloud cluster?

Availability Sets make sense for two common use-cases.  

The first use-case is to guarantee failure isolation for small sets of key VMs, such as failover pairs for cluster head-nodes. For head-nodes, the richer control over each individual Virtual Machine in an Availability Set might be valuable as an alternative to simply using replica instances in a VMSS.

The second use-case is to place a mix of Nodes and NodeArrays in the same Infiniband group to enable Infinband interconnect between disparate roles in the Cluster. For example, some clusters might benefit from colocating a shared filesystem supporting IB in the same IB network as the compute Nodes and the scheduler Node. This configuration currently isn't supported with VMSS, but is well supported with Availability Sets.

## Creating and adding nodes to an availability set

Azure CycleCloud can place VMs in existing availability sets, but more commonly a cluster creates its own availability set. The availability set lifetime usually matches the cluster lifetime.

In a cluster template, set the `AvailabilitySet.Name` attribute on a node or node array to specify the nodes you want to add to the availability set.

For example, if a cluster template sets `AvailabilitySet.Name` in the `[[node defaults]]` settings, the cluster adds all nodes to the set and creates the set if it doesn't already exist.

```ini
    [[node defaults]]
    ...
    # Add all nodes to Availability Set with name "SampleAvailSet"
    AvailabilitySet.Name = SampleAvailSet
```

> [!NOTE]
> If CycleCloud creates the availability set, it scopes the set lifetime to the cluster. CycleCloud also destroys the set when you delete the cluster.

### Availability set attributes

CycleCloud provides the following attributes for configuring an availability set:

Attribute | Type | Definition
------ | ----- | ----------
AvailabilitySet.Name | String | A unique name for the new or existing availability set
AvailabilitySet.PlatformFaultDomainCount | Integer | Fault domain count
AvailabilitySet.PlatformUpdateDomainCount | Integer | Update domain count
AvailabilitySet.ResourceId | ResourceID | ID of an existing availability set that you created outside the cluster

For more information about these configuration attributes, see the [Availability Sets reference](/rest/api/compute/availabilitysets/createorupdate#request-body).

## Configuring nodes for InfiniBand

> [!IMPORTANT]
> This section describes configuring nodes for InfiniBand when VMSS isn't appropriate.
> Most clusters that use InfiniBand for MPI should use VMSS rather than availability sets. For clusters that use VMSS, all nodes in a single VMSS with `singlePlacementGroup=true` can access InfiniBand. For CycleCloud clusters that support auto-scaling, this configuration happens automatically.

Placing cluster nodes in an availability set involves two steps. First, set the availability set fault and update domain counts to 1 to make sure the nodes go on a single network fault domain. Second, since you can't place VMSS instances in an availability set, disable the use of VMSS for node allocation by setting `Azure.AllocationMethod=standalone` for all NodeArrays that you add to the availability set.

To place all cluster nodes in a single InfiniBand switch, use the following configuration:

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

## Further reading

* [CycleCloud Availability Set Attribute Reference](../cluster-references/node-nodearray-reference.md)
* [Availability Sets reference](/rest/api/compute/availabilitysets/createorupdate#request-body)