---
title: Configure and manage CycleCloud Slurm 4 clusters
description: Learn how to configure partitions, scaling, topology, KeepAlive, and high availability for CycleCloud Slurm 4 clusters.
author: anhoward
ai-usage: ai-assisted
ms.date: 08/14/2026
ms.topic: how-to
ms.author: anhoward
---

# Configure and manage CycleCloud Slurm 4 clusters

This article reflects CycleCloud Slurm project version 4.0.10.

Use this article to manage nodes and partitions, scale clusters, configure topology and IMEX, set KeepAlive behavior, and configure custom scheduler names for high availability.

For job accounting, REST API access, health checks, monitoring, supported versions, configuration options, and troubleshooting, see [Operate and troubleshoot CycleCloud Slurm 4 clusters](slurm-4-operations.md).

For the project source and release-specific information, see the [CycleCloud Slurm project](https://github.com/Azure/cyclecloud-slurm).

## Manage a Slurm 4.0 cluster

### Make cluster changes

You can change a cluster through **Edit** on the cluster page or by using the CycleCloud CLI. Changes to cluster topology, such as adding partitions, usually require you to edit and reimport the cluster template.

The cluster includes the `azslurm` CLI on the scheduler node. After you change a running cluster, run the following commands as root on the scheduler:

```bash
sudo -i
azslurm scale
```

The command rebuilds `azure.conf`, creates the partitions and `gres.conf`, updates the nodes, and restarts `slurmctld`.

For changes that aren't available in the cluster **Edit** dialog, download and modify the [Slurm cluster template](https://github.com/Azure/cyclecloud-slurm/blob/master/templates/slurm.txt). Then export the cluster parameters and reimport the cluster:

```bash
cyclecloud export_parameters <cluster-name> > ./<cluster-name>.json
cyclecloud import_cluster <cluster-name> -c slurm -f ./modified-slurm.txt \
    -p ./<cluster-name>.json --force
```

For a terminated cluster, start the cluster to apply the changes. For a running cluster, apply the changes without terminating or scaling down the cluster:

```bash
cyclecloud start_cluster <cluster-name>
ssh <scheduler-ip>
sudo azslurm scale
```

### Node creation

Starting with project version 3.0.0, CycleCloud doesn't precreate execute nodes. Nodes are created when `azslurm resume` runs or when you create them manually through CycleCloud.

### Create more partitions

The default template has four partitions: `hpc`, `htc`, `gpu`, and `dynamic`. You can define custom node arrays that map directly to Slurm partitions. For example, add a second GPU partition by extending the existing `gpu` node array:

```ini
[[nodearray specialgpu]]
Extends = gpu

MachineType = $SpecialGPUMachineType
MaxCoreCount = $MaxSpecialGPUCoreCount
```

Add any new parameters, such as `SpecialGPUMachineType` and `MaxSpecialGPUCoreCount`, to the `[[parameters]]` section of the template.

If the node-array name isn't the desired partition name, set `slurm.partition`:

```ini
[[nodearray my_custom_name]]
  [[[configuration]]]
  slurm.partition = my-custom-name
```

### Configure dynamic partitions

Starting with project version 3.0.1, a node array can map to a dynamic partition. Set `slurm.dynamic_config` to one or more comma-separated Slurm features:

```ini
[[[configuration]]]
slurm.autoscale = true
# Set to true for tightly coupled multinode jobs.
slurm.hpc = false
slurm.dynamic_config := "-Z --conf \"Feature=myfeature\""
```

The configuration generates a dynamic node set and partition:

```ini
NodeSet=mydynamicns Feature=myfeature
PartitionName=mydynamic Nodes=mydynamicns
```

By default, a dynamic partition has no node records. Create records in the `CLOUD` state so Slurm can autoscale them:

```bash
scontrol create nodename=f4-[1-10] Feature=myfeature,Standard_F4 CPUs=4 State=CLOUD
scontrol create nodename=f8-[1-10] Feature=myfeature,Standard_F8 CPUs=8 State=CLOUD
```

The VM size is added as a feature automatically, so you don't need to add it to `slurm.dynamic_config`. Dynamic partitions support more than one VM size when the template parameter allows multiple selections:

```ini
[[[parameter DynamicMachineType]]]
Label = Dynamic VM type
Description = The VM type for dynamic nodes
ParameterType = Cloud.MachineType
DefaultValue = Standard_F2s_v2
Config.Multiselect = true
```

For a dynamic GPU node, add the node to `/etc/slurm/gres.conf` before you run `scontrol create`. Otherwise, Slurm rejects the node name.

Dynamic nodes scale down like nodes in other partitions. To exclude a partition from scale-down, use [`SuspendExcParts`](https://slurm.schedmd.com/slurm.conf.html).

### Scale manually

When autoscaling is disabled with `SuspendTime=-1`, CycleCloud Slurm uses the `FUTURE` state for powered-down nodes. These nodes don't appear in `sinfo`, but you can display them with:

```bash
scontrol show nodes --future
```

Start or stop nodes by using the resume and suspend programs:

```bash
/opt/azurehpc/slurm/resume_program.sh htc-[1-10]
/opt/azurehpc/slurm/suspend_program.sh htc-[1-10]
```

To change an existing cluster to manual scaling, add `SuspendTime=-1` to `slurm.conf`, run `scontrol reconfigure`, and then run:

```bash
azslurm remove_nodes
azslurm scale
```

## Configure topology

In project version 4.x, `azslurm topology` replaces `azslurm generate_topology`. It can generate tree or block topology configurations based on Virtual Machine Scale Set boundaries, a SHARP-enabled Fabric Manager, or NVLink domains.

> [!NOTE]
> Topology is useful only for manually scaled or fixed-size clusters. Autoscaling doesn't consider or update the topology.

Generate a tree topology based on Virtual Machine Scale Set boundaries:

```bash
azslurm topology --use_vmss --tree --output /etc/slurm/topology.conf
```

Generate a tree topology from a SHARP-enabled Fabric Manager:

```bash
azslurm topology --use_fabric_manager --partition gpu \
    --output /etc/slurm/topology.conf
```

Generate a block topology from NVLink domains:

```bash
azslurm topology --use_nvlink_domain --partition gpu --block \
    --block_size 18 --output /etc/slurm/topology.conf
```

Set `TopologyPlugin=topology/tree` or `TopologyPlugin=topology/block` in `slurm.conf`, as appropriate.

### Scale GB200 and GB300 clusters with scale_m1

The `scale_m1` tool scales a GB200 or GB300 partition to an exact size and keeps only fully populated racks in the generated topology. The scheduler installation includes the tool in `/opt/azurehpc/slurm/venv`. Logs are in `/opt/azurehpc/slurm/logs/scale_m1.log`.

Before using the tool, exclude the partition from automatic suspension:

```ini
SuspendExcParts=gpu
```

Add this setting to `/etc/slurm/site_specific.conf` and run `scontrol reconfigure`.

The high-level workflow is:

1. Create a reservation for the partition.
1. Power up the target number of racks or nodes.
1. Generate and install the block topology.
1. Add the block topology settings to `/etc/slurm/site_specific.conf`.
1. Reconfigure Slurm and release only healthy, powered-up nodes from the reservation.

```bash
scale_m1 create_reservation --partition gpu
scale_m1 power_up --racks 28
azslurm topology --use_nvlink_domain --partition gpu --block \
    --block_size 18 > topology.conf
cp topology.conf /sched/<cluster-name>/topology.conf
```

After the topology file is in place, add the following settings to `/etc/slurm/site_specific.conf`:

```ini
TopologyParam=BlockAsNodeRank
TopologyPlugin=topology/block
```

Don't add these settings to the template's **Slurm Configuration** parameter. `slurmctld` can't start with the block plugin before a populated topology file exists.

Run `scontrol reconfigure`, and update the `scale_m1` reservation so it contains only nodes that aren't ready. Don't delete the reservation, because deletion also releases powered-off or unhealthy nodes.

For unhealthy hardware, `scale_m1 power_up` supports `--overprovision` and `--overprovision-racks`. Use `scale_m1 prune` to list excess nodes or `scale_m1 prune_now` to terminate them. One rack is 18 nodes.

### Configure IMEX

CycleCloud Slurm includes prolog and epilog scripts that start and stop the IMEX service for each job. IMEX is enabled by default on GB200 and GB300 nodes and disabled by default on other VM sizes.

Override the default for a node array:

```ini
slurm.imex.enabled = true
```

## Set KeepAlive

Starting with project version 4.0.5, when you enable **KeepAlive** for a node in CycleCloud, `azslurmd` adds the node to `SuspendExcNodes`. When you disable **KeepAlive**, `azslurmd` removes the node if it originally added the node.

This behavior requires `ReconfigFlags=KeepPowerSaveSettings` in `slurm.conf`, which is the default starting with version 4.0.5. `azslurmd` doesn't remove nodes that were added to `SuspendExcNodes` manually or with `azslurm keep_alive`.

## Configure custom scheduler names for high availability

If a custom template renames `[node scheduler]` or `[nodearray scheduler-ha]`, identify both scheduler nodes in the configuration:

```ini
[[[configuration]]]
slurm.primary_scheduler_name = <scheduler-node-name>
slurm.secondary_scheduler_name = <scheduler-ha-node-name>
```

For a `[node]`, the `ComputerName` attribute controls the hostname. A renamed `[nodearray]` automatically uses the node-array name in its hostname.

## Next step

After you configure the cluster, see [Operate and troubleshoot CycleCloud Slurm 4 clusters](slurm-4-operations.md) to configure operational services, monitor cluster health, and resolve common problems.

[!INCLUDE [scheduler-integration](~/articles/cyclecloud/includes/scheduler-integration.md)]
