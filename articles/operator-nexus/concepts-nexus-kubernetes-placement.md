---
title: "Resource Placement in Azure Operator Nexus Kubernetes"
description: An explanation of how Operator Nexus schedules Nexus Kubernetes resources.
author: jaypipes
ms.author: jaypipes
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 04/19/2024
ms.custom: template-concept
---

# Resource placement in Azure Operator Nexus Kubernetes

Operator Nexus instances are deployed at the customer premises. Each instance
comprises one or more racks of bare metal servers.

When a user creates a Nexus Kubernetes Cluster (NKS), they specify a count and
a [stock keeping unit](./reference-nexus-kubernetes-cluster-sku.md) (SKU) for
virtual machines (VM) that make up the Kubernetes Control Plane and one or more
Agent Pools. Agent Pools are the set of Worker Nodes on which a customer's
containerized network functions run.

The Nexus platform is responsible for deciding the bare metal server on which
each NKS VM launches.

## How the Nexus platform schedules a Nexus Kubernetes Cluster VM

Nexus first identifies the set of potential bare metal servers that meet all of
the resource requirements of the NKS VM SKU. For example, if the user
specified an `NC_G48_224_v1` VM SKU for their agent pool, Nexus collects the
bare metal servers that have available capacity for 48 vCPU, 224Gi of RAM, etc.

Nexus then examines the `AvailabilityZones` field for the Agent Pool or Control
Plane being scheduled. If this field isn't empty, Nexus filters the list of
potential bare metal servers to only those servers in the specified
availability zones (racks). This behavior is a *hard scheduling constraint*. If
there's no bare metal servers in the filtered list, Nexus *doesn't schedule*
the NKS VM and the cluster fails to provision.

Once Nexus identifies a list of potential bare metal servers on which to place
the NKS VM, Nexus then picks one of the bare metal servers after applying the
following sorting rules:

1. Prefer bare metal servers in availability zones (racks) that don't have NKS
   VMs from this NKS Cluster. In other words, *spread the NKS VMs for an NKS
   Cluster across availability zones*.

1. Prefer bare metal servers within a single availability zone (rack) that
   don't have other NKS VMs from the same NKS Cluster. In other words,
   *spread the NKS VMs for an NKS Cluster across bare metal servers within an
   availability zone*.

1. If the NKS VM SKU is either `NC_G48_224_v1` or `NC_P46_224_v1`, prefer
   bare metal servers that already house `NC_G48_224_v1` or `NC_P46_224_v1`
   NKS VMs from other NKS Clusters. In other words, *group the extra-large
   VMs from different NKS Clusters on the same bare metal servers*. This rule
   "bin packs" the extra-large VMs in order to reduce fragmentation of the
   available compute resources.

## Example placement scenarios

The following sections highlight behavior that Nexus users should expect
when creating NKS Clusters against an Operator Nexus environment.

> **Hint**: You can see which bare metal server your NKS VMs were scheduled to
> by examining the `nodes.bareMetalMachineId` property of the NKS
> KubernetesCluster resource or viewing the "Host" column in Azure Portal's
> display of Kubernetes Cluster Nodes.

:::image type="content" source="media/nexus-kubernetes/show-baremetal-host.png" lightbox="media/nexus-kubernetes/show-baremetal-host.png" alt-text="A screenshot showing bare metal server for NKS VMs.":::

The example Operator Nexus environment has these specifications:

* Eight racks of 16 bare metal servers
* Each bare metal server contains two [Non-Uniform Memory Access][numa] (NUMA) cells
* Each NUMA cell provides 48 CPU and 224Gi RAM

[numa]: https://en.wikipedia.org/wiki/Non-uniform_memory_access

### Empty environment

Given an empty Operator Nexus environment with the given capacity, we create
three differently sized Nexus Kubernetes Clusters.

The NKS Clusters have these specifications, and we assume for the purposes of
this exercise that the user creates the three Clusters in the following order:

Cluster A

* Control plane, `NC_G12_56_v1` SKU, three count
* Agent pool #1, `NC_P46_224_v1` SKU, 24 count
* Agent pool #2, `NC_G6_28_v1` SKU, six count

Cluster B
 
* Control plane, `NC_G24_112_v1` SKU, five count
* Agent pool #1, `NC_P46_224_v1` SKU, 48 count
* Agent pool #2, `NC_P22_112_v1` SKU, 24 count

Cluster C

* Control plane, `NC_G12_56_v1` SKU, three count
* Agent pool #1, `NC_P46_224_v1` SKU, 12 count, `AvailabilityZones = [1,4]`

Here's a table summarizing what the user should see after launching Clusters
A, B, and C on an empty Operator Nexus environment.

| Cluster | Pool             | SKU             | Total Count | Expected # Racks | Actual # Racks | Expected # VMs per Rack | Actual # VMs per Rack |
| ------- | ---------------- | --------------- | ----------- | ---------------- | -------------- | ----------------------- | --------------------- |
| A       | Control Plane    | `NC_G12_56_v1`  | 3           | 3                | 3              | 1                       | 1                     |
| A       | Agent Pool #1    | `NC_P46_224_v1` | 24          | 8                | 8              | 3                       | 3                     |
| A       | Agent Pool #2    | `NC_G6_28_v1`   | 6           | 6                | 6              | 1                       | 1                     |
| B       | Control Plane    | `NC_G24_112_v1` | 5           | 5                | 5              | 1                       | 1                     |
| B       | Agent Pool #1    | `NC_P46_224_v1` | 48          | 8                | 8              | 6                       | 6                     |
| B       | Agent Pool #2    | `NC_P22_112_v1` | 24          | 8                | 8              | 3                       | 3                     |
| C       | Control Plane    | `NC_G12_56_v1`  | 3           | 3                | 3              | 1                       | 1                     |
| C       | Agent Pool #1    | `NC_P46_224_v1` | 12          | 2                | 2              | 6                       | 6                     |

There are eight racks so the VMs for each pool are spread over up to eight
racks. Pools with more than eight VMs require multiple VMs per rack spread
across different bare metal servers.

Cluster C Agent Pool #1 has 12 VMs restricted to AvailabilityZones [1, 4] so it
has 12 VMs on 12 bare metal servers, six in each of racks 1 and 4.

Extra-large VMs (the `NC_P46_224_v1` SKU) from different clusters are placed
on the same bare metal servers (see rule #3 in [How the Nexus platform schedules a Nexus Kubernetes Cluster VM](#how-the-nexus-platform-schedules-a-nexus-kubernetes-cluster-vm)).

Here's a visualization of a layout the user might see after deploying Clusters
A, B, and C into an empty environment.

:::image type="content" source="media/nexus-kubernetes/after-first-deployment.png" lightbox="media/nexus-kubernetes/after-first-deployment.png" alt-text="Diagram showing possible layout of VMs after first deployment.":::

### Half-full environment

We now run through an example of launching another NKS Cluster when the target
environment is half-full. The target environment is half-full after Clusters A,
B, and C are deployed into the target environment.

Cluster D has the following specifications:

* Control plane, `NC_G24_112_v1` SKU, five count
* Agent pool #1, `NC_P46_224_v1` SKU, 24 count, `AvailabilityZones = [7,8]`
* Agent pool #2, `NC_P22_112_v1` SKU, 24 count

Here's a table summarizing what the user should see after launching Cluster D
into the half-full Operator Nexus environment that exists after launching
Clusters A, B, and C.

| Cluster | Pool             | SKU             | Total Count | Expected # Racks | Actual # Racks | Expected # VMs per Rack | Actual # VMs per Rack |
| ------- | ---------------- | --------------- | ----------- | ---------------- | -------------- | ----------------------- | --------------------- |
| D       | Control Plane    | `NC_G12_56_v1`  | 5           | 5                | 5              | 1                       | 1                     |
| D       | Agent Pool #1    | `NC_P46_224_v1` | 24          | 2                | 2              | 12                      | 12                    |
| D       | Agent Pool #2    | `NC_P22_112_v1` | 24          | 8                | 8              | 3                       | 3                     |

Cluster D Agent Pool #1 has 12 VMs restricted to AvailabilityZones [7, 8] so it
has 12 VMs on 12 bare metal servers, six in each of racks 7 and 8. Those VMs
land on bare metal servers also housing extra-large VMs from other clusters due
to the sorting rule that groups extra-large VMs from different clusters onto
the same bare metal servers.

If a Cluster D control plane VM lands on rack 7 or 8, it's likely that one
Cluster D Agent Pool #1 VM lands on the same bare metal server as that Cluster
D control plane VM. This behavior is due to Agent Pool #1 being "pinned" to
racks 7 and 8. Capacity constraints in those racks cause the scheduler to
collocate a control plane VM and an Agent Pool #1 VM from the same NKS
Cluster.

Cluster D's Agent Pool #2 has three VMs on different bare metal servers on each
of the eight racks. Capacity constraints resulted from Cluster D's Agent Pool #1
being pinned to racks 7 and 8. Therefore, VMs from Cluster D's Agent Pool #1
and Agent Pool #2 are collocated on the same bare metal servers in racks 7 and
8.

Here's a visualization of a layout the user might see after deploying Cluster
D into the target environment.

:::image type="content" source="media/nexus-kubernetes/after-second-deployment.png" lightbox="media/nexus-kubernetes/after-second-deployment.png" alt-text="Diagram showing possible layout of VMs after second deployment.":::

### Nearly full environment

In our example target environment, four of the eight racks are
close to capacity. Let's try to launch another NKS Cluster. 

Cluster E has the following specifications:

* Control plane, `NC_G24_112_v1` SKU, five count
* Agent pool #1, `NC_P46_224_v1` SKU, 32 count

Here's a table summarizing what the user should see after launching Cluster E
into the target environment.

| Cluster | Pool             | SKU             | Total Count | Expected # Racks | Actual # Racks | Expected # VMs per Rack | Actual # VMs per Rack |
| ------- | ---------------- | --------------- | ----------- | ---------------- | -------------- | ----------------------- | --------------------- |
| E       | Control Plane    | `NC_G24_112_v1` | 5           | 5                | 5              | 1                       | 1                     |
| E       | Agent Pool #1    | `NC_P46_224_v1` | 32          | 8                | 8              | **4**                   | **3, 4 or 5**         |

Cluster E's Agent Pool #1 will spread unevenly over all eight racks. Racks 7
and 8 will have three NKS VMs from Agent Pool #1 instead of the expected four
NKS VMs because there's no more capacity for the extra-large SKU VMs in those
racks after scheduling Clusters A through D. Because racks 7 and 8 don't have
capacity for the fourth extra-large SKU in Agent Pool #1, five NKS VMs will
land on the two least-utilized racks. In our example, those least-utilized
racks were racks 3 and 6.

Here's a visualization of a layout the user might see after deploying Cluster
E into the target environment.

:::image type="content" source="media/nexus-kubernetes/after-third-deployment.png" lightbox="media/nexus-kubernetes/after-third-deployment.png" alt-text="Diagram showing possible layout of VMs after third deployment.":::

## Placement during a runtime upgrade 

As of April 2024 (Network Cloud 2304.1 release), runtime upgrades are performed
using a rack-by-rack strategy. Bare metal servers in rack 1 are reimaged all at
once. The upgrade process pauses until all the bare metal servers successfully
restart and tell Nexus that they're ready to receive workloads.

> [!NOTE]
> It is possible to instruct Operator Nexus to only reimage a portion of
> the bare metal servers in a rack at once, however the default is to reimage
> all bare metal servers in a rack in parallel.

When an individual bare metal server is reimaged, all workloads running on that
bare metal server, including all NKS VMs, lose power, and connectivity. Workload
containers running on NKS VMs will, in turn, lose power, and connectivity.
After one minute of not being able to reach those workload containers, the NKS
Cluster's Kubernetes Control Plane will mark the corresponding Pods as
unhealthy. If the Pods are members of a Deployment or StatefulSet, the NKS
Cluster's Kubernetes Control Plane attempts to launch replacement Pods to
bring the observed replica count of the Deployment or StatefulSet back to the
desired replica count.

New Pods only launch if there's available capacity for the Pod in the remaining
healthy NKS VMs. As of April 2024 (Network Cloud 2304.1 release), new NKS VMs
aren't created to replace NKS VMs that were on the bare metal server being
reimaged.

Once the bare metal server is successfully reimaged and able to accept new NKS
VMs, the NKS VMs that were originally on the same bare metal server relaunch
on the newly reimaged bare metal server. Workload containers may then be
scheduled to those NKS VMs, potentially restoring the Deployments or
StatefulSets that had Pods on NKS VMs that were on the bare metal server.

> [!NOTE]
> This behavior may seem to the user as if the NKS VMs did not
> "move" from the bare metal server, when in fact a new instance of an identical
> NKS VM was launched on the newly reimaged bare metal server that retained the
> same bare metal server name as before reimaging.

## Best practices

When working with Operator Nexus, keep the following best practices in mind.

* Avoid specifying `AvailabilityZones` for an Agent Pool.
* Launch larger NKS Clusters before smaller ones.
* Reduce the Agent Pool's Count before reducing the VM SKU size.

### Avoid specifying AvailabilityZones for an Agent Pool

As you can tell from the above placement scenarios, specifying
`AvailabilityZones` for an Agent Pool is the primary reason that NKS VMs from
the same NKS Cluster would end up on the same bare metal server. By specifying
`AvailabilityZones`, you "pin" the Agent Pool to a subset of racks and
therefore limit the number of potential bare metal servers in that set of racks
for other NKS Clusters and other Agent Pool VMs in the same NKS Cluster to
land on.

Therefore, our first best practice is to avoid specifying `AvailabilityZones`
for an Agent Pool. If you require pinning an Agent Pool to a set of
Availability Zones, make that set as large as possible to minimize the
imbalance that can occur.

The one exception to this best practice is when you have a scenario with only
two or three VMs in an agent pool. You might consider setting
`AvailabilityZones` for that agent pool to `[1,3,5,7]` or `[0,2,4,6]` to
increase availability during runtime upgrades.

### Launch larger NKS Clusters before smaller ones

As of April 2024, and the Network Cloud 2403.1 release, NKS Clusters are
scheduled in the order in which they're created. To most efficiently pack your
target environment, we recommended you create larger NKS Clusters before
smaller ones. Likewise, we recommended you schedule larger Agent Pools before
smaller ones.

This recommendation is important for Agent Pools using the extra-large
`NC_G48_224_v1` or `NC_P46_224_v1` SKU. Scheduling the Agent Pools with the
greatest count of these extra-large SKU VMs creates a larger set of bare metal
servers upon which other extra-large SKU VMs from Agent Pools in other NKS
Clusters can collocate.

### Reduce the Agent Pool's count before reducing the VM SKU size

If you run into capacity constraints when launching an NKS Cluster or Agent
Pool, reduce the Count of the Agent Pool before adjusting the VM SKU size. For
example, if you attempt to create an NKS Cluster with an Agent Pool with VM SKU
size of `NC_P46_224_v1` and a Count of 24 and get back a failure to provision
the NKS Cluster due to insufficient resources, you may be tempted to use a VM
SKU Size of `NC_P36_168_v1` and continue with a Count of 24. However, due to
requirements for workload VMs to be aligned to a single NUMA cell on a bare
metal server, it's likely that that same request results in similar
insufficient resource failures. Instead of reducing the VM SKU size, consider
reducing the Count of the Agent Pool to 20. There's a better chance your
request fits within the target environment's resource capacity and your overall
deployment has more CPU cores than if you downsized the VM SKU.
