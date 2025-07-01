---
title: Slurm Scheduler Integration
description: Slurm scheduler configuration in Azure CycleCloud.
author: KimliW
ms.date: 07/01/2025
ms.author: adjohnso
---

# Slurm

[//]: # (Need to link to the scheduler README on GitHub)

Slurm is a highly configurable open source workload manager. For more information, see the overview on the [Slurm project site](https://www.schedmd.com/).

> [!NOTE]
> Starting with CycleCloud 8.4.0, we rewrote the Slurm integration to support new features and functionality. For more information, see [Slurm 3.0](slurm-3.md) documentation.

::: moniker range="=cyclecloud-7"
::: moniker range=">=cyclecloud-8"
To enable Slurm on a CycleCloud cluster, modify the `run_list` in the configuration section of your cluster definition. A Slurm cluster has two main parts: the scheduler node, which provides a shared file system and runs the Slurm software, and the execute nodes, which mount the shared file system and run the submitted jobs. For example, a simple cluster template snippet might look like:

``` ini
[cluster custom-slurm]

[[node scheduler]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A4 # 8 cores

    [[[cluster-init cyclecloud/slurm:default]]]
    [[[cluster-init cyclecloud/slurm:scheduler]]]
    [[[configuration]]]
    run_list = role[slurm_scheduler_role]

[[nodearray execute]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A1  # 1 core

    [[[cluster-init cyclecloud/slurm:default]]]
    [[[cluster-init cyclecloud/slurm:execute]]]
    [[[configuration]]]
    run_list = role[slurm_scheduler_role]
    slurm.autoscale = true
    # Set to true if nodes are used for tightly-coupled multi-node jobs
    slurm.hpc = true
    slurm.default_partition = true
```

::: moniker-end
## Editing existing Slurm clusters

Slurm clusters running in CycleCloud versions 7.8 and later use an updated version of the autoscaling APIs that allows the clusters to use multiple node arrays and partitions. To make this functionality work in Slurm, CycleCloud prepopulates the executed nodes in the cluster. Because of this prepopulation, you need to run a command on the Slurm scheduler node after you make any changes to the cluster, such as changing the autoscale limits or VM types.

### Making cluster changes

The Slurm cluster deployed in CycleCloud contains a script that facilitates the changes. After making any changes to the cluster, run the next command as root (for example, by running `sudo -i`) on the Slurm scheduler node to rebuild the `slurm.conf` file and update the nodes in the cluster:

::: moniker range="=cyclecloud-7"

``` bash
/opt/cycle/slurm/cyclecloud_slurm.sh remove_nodes
/opt/cycle/slurm/cyclecloud_slurm.sh scale
```

> [!NOTE]
> For CycleCloud versions before 7.9.10, the `cyclecloud_slurm.sh` script is located in _/opt/cycle/jetpack/system/bootstrap/slurm_.

> [!IMPORTANT]
> If you make any changes that affect the VMs for nodes in an MPI partition (such as VM size, image, or cloud-init), you **must** terminate all the nodes first.
> The `remove_nodes` command prints a warning in this case, but it doesn't exit with an error.
> If you change the VMs for nodes in an MPI partition (such as the VM size, image, or cloud-init) while the nodes are running, new nodes can't start and you see the error `This node doesn't match existing scaleset attribute`.

::: moniker-end

::: moniker range=">=cyclecloud-8"

``` bash
/opt/cycle/slurm/cyclecloud_slurm.sh apply_changes
```

> [!NOTE]
> For CycleCloud versions < 8.2, the `cyclecloud_slurm.sh` script is located in _/opt/cycle/jetpack/system/bootstrap/slurm_.

If you change the VMs for nodes in an MPI partition (such as the VM size, image, or cloud-init) while the nodes are running, new nodes can't start and you see the error `This node doesn't match existing scaleset attribute`. For this reason, the `apply_changes` command makes sure the nodes are terminated. If the nodes aren't terminated, the command fails with this error message: _The following nodes must be fully terminated before applying changes_.

If you're making a change that doesn't affect the VM properties for MPI nodes, you don't need to terminate running nodes first. In this case, you can make the changes by using these two commands:

``` bash
/opt/cycle/slurm/cyclecloud_slurm.sh remove_nodes
/opt/cycle/slurm/cyclecloud_slurm.sh scale
```

> [!NOTE]
> The `apply_changes` command is available only in CycleCloud 8.3+. In earlier versions, you need to use the `remove_nodes` and `scale` commands to make a change. Make sure the `remove_nodes` command doesn't print a warning about nodes that need to be terminated.

::: moniker-end

### Creating supplemental partitions

The default template that ships with Azure CycleCloud has two partitions (`hpc` and `htc`), and you can define custom node arrays that map directly to Slurm partitions. For example, to create a GPU partition, add the following section to your cluster template:

``` ini
    [[nodearray gpu]]
    MachineType = $GPUMachineType
    ImageName = $GPUImageName
    MaxCoreCount = $MaxGPUExecuteCoreCount
    Interruptible = $GPUUseLowPrio
    AdditionalClusterInitSpecs = $ExecuteClusterInitSpecs

        [[[configuration]]]
        slurm.autoscale = true
        # Set to true if nodes are used for tightly-coupled multi-node jobs
        slurm.hpc = false

        [[[cluster-init cyclecloud/slurm:execute:2.0.1]]]
        [[[network-interface eth0]]]
        AssociatePublicIpAddress = $ExecuteNodesPublic
```

### Memory settings

CycleCloud automatically sets the amount of available memory for Slurm to use for scheduling purposes. Because available memory can vary slightly due to Linux kernel options, and the OS and VM use a small amount of memory, CycleCloud automatically reduces the memory value in the Slurm configuration. By default, CycleCloud holds back 5% of the reported available memory in a VM, but you can override this value in the cluster template by setting `slurm.dampen_memory` to the percentage of memory to hold back. For example, to hold back 20% of a VM's memory:

``` ini
    slurm.dampen_memory=20
```

## Disabling autoscale for specific nodes or partitions

While the built-in CycleCloud "KeepAlive" feature doesn't currently work for Slurm clusters, you can disable autoscale for a running Slurm cluster by editing the slurm.conf file directly. You can exclude either individual nodes or entire partitions from being autoscaled.

### Excluding a node

To exclude one or more nodes from autoscale, add `SuspendExcNodes=<listofnodes>` to the Slurm configuration file. For example, to exclude nodes 1 and 2 from the `hpc` partition, add the following code to `/sched/slurm.conf`:

```bash
SuspendExcNodes=hpc-pg0-[1-2]
```

Then restart the `slurmctld` service for the new configuration to take effect.

### Excluding a partition

To exclude entire partitions from autoscale, use a similar process to excluding nodes. To exclude the entire `hpc` partition, add the following code to `/sched/slurm.conf`:

```bash
SuspendExcParts=hpc
```

Then restart the `slurmctld` service.

## Troubleshooting

### UID conflicts for Slurm and munge users

By default, this project uses a UID and GID of 11100 for the Slurm user and 11101 for the munge user. If these defaults cause a conflict with another user or group, you can override them.

To override the UID and GID values, select the **edit** button for both the `scheduler` node:

::: moniker range="=cyclecloud-7"
![Edit Scheduler](~/articles/cyclecloud/images/version-7/slurm-master-node-edit.png "Edit Scheduler")
:::

::: moniker range=">=cyclecloud-8"
![Edit Scheduler](~/articles/cyclecloud/images/version-8/slurm-schedule-node-edit.png "Edit Scheduler")
:::

And the `execute` nodearray:
![Edit Nodearray](~/articles/cyclecloud/images/slurmnodearraytab.png "Edit nodearray")

Add the following attributes to the `Configuration` section:
![Edit Configuration](~/articles/cyclecloud/images/slurmnodearrayedit.png "Edit configuration")

``` ini
    slurm.user.name = slurm
    slurm.user.uid = 11100
    slurm.user.gid = 11100
    munge.user.name = munge
    munge.user.uid = 11101
    munge.user.gid = 11101
```

### Autoscale

CycleCloud uses Slurm's [Elastic Computing](https://slurm.schedmd.com/elastic_computing.html) feature. To debug autoscale issues, check a few logs on the scheduler node. First, make sure the power save resume calls are happening by checking `/var/log/slurmctld/slurmctld.log`. You should see lines like:

``` bash
[2019-12-09T21:19:03.400] power_save: pid 8629 waking nodes htc-1
```

Check `/var/log/slurmctld/resume.log`. If the resume step is failing, check `/var/log/slurmctld/resume_fail.log`. If you see messages about unknown or invalid node names, make sure you follow the steps in the "Making Cluster Changes" section before adding nodes to the cluster.

## Slurm configuration reference

The following table describes the Slurm-specific configuration options you can toggle to customize functionality:

| Slurm specific configuration options | Description |
| ------------------------------------ | ----------- |
| slurm.version                        | Default: `18.08.7-1`. Sets the version of Slurm to install and run. Currently, it's the default and *only* version available. More versions might be supported in the future. |
| slurm.autoscale                      | Default: `false`. A per-nodearray setting that controls whether Slurm automatically stops and starts nodes in this node array. |
| slurm.hpc                            | Default: `true`. A per-nodearray setting that controls whether nodes in the node array are in the same placement group. Primarily used for node arrays that use VM families with InfiniBand. It only applies when `slurm.autoscale` is set to `true`. |
| slurm.default_partition              | Default: `false`. A per-nodearray setting that controls whether the nodearray should be the default partition for jobs that don't request a partition explicitly. |
| slurm.dampen_memory                  | Default: `5`. The percentage of memory to hold back for OS/VM overhead. |
| slurm.suspend_timeout                | Default: `600`. The amount of time in seconds between a suspend call and when that node can be used again. |
| slurm.resume_timeout                 | Default: `1800`. The amount of time in seconds to wait for a node to successfully boot. |
| slurm.install                        | Default: `true`.  Determines if Slurm is installed at node boot (`true`). If you install Slurm in a custom image, set this configuration option to `false` (proj version 2.5.0+). |
| slurm.use_pcpu                       | Default: `true`. A per-nodearray setting to control scheduling with hyperthreaded vCPUs. Set to `false` to set `CPUs=vcpus` in `cyclecloud.conf`. |
| slurm.user.name                      | Default: `slurm`. The user name for the Slurm service to use. |
| slurm.user.uid                       | Default: `11100`. The user ID to use for the Slurm user. |
| slurm.user.gid                       | Default: `11100`. The group ID to use for the Slurm user. |
| munge.user.name                      | Default: `munge`. The user name for the MUNGE authentication service to use. |
| munge.user.uid                       | Default: `11101`. The user ID to use for the MUNGE user. |
| munge.user.gid                       | Default: `11101`. The group ID for the MUNGE user. |

[!INCLUDE [scheduler-integration](~/articles/cyclecloud/includes/scheduler-integration.md)]
