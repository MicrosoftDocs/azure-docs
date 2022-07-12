---
title: Slurm Scheduler Integration
description: Slurm scheduler configuration in Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Slurm

[//]: # (Need to link to the scheduler README on Github)

Slurm is a highly configurable open source workload manager. See the [Slurm project site](https://www.schedmd.com/) for an overview.

::: moniker range="=cyclecloud-7"
Slurm can easily be enabled on a CycleCloud cluster by modifying the "run_list" in the configuration section of your cluster definition. The two basic components of a Slurm cluster are the 'master' (or 'scheduler') node which provides a shared filesystem on which the Slurm software runs, and the 'execute' nodes which are the hosts that mount the shared filesystem and execute the jobs submitted. For example, a simple cluster template snippet may look like:

``` ini
[cluster custom-slurm]

[[node master]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A4 # 8 cores

    [[[cluster-init cyclecloud/slurm:default]]]
    [[[cluster-init cyclecloud/slurm:master]]]
    [[[configuration]]]
    run_list = role[slurm_master_role]

[[nodearray execute]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A1  # 1 core

    [[[cluster-init cyclecloud/slurm:default]]]
    [[[cluster-init cyclecloud/slurm:execute]]]
    [[[configuration]]]
    run_list = role[slurm_master_role]
    slurm.autoscale = true
    # Set to true if nodes are used for tightly-coupled multi-node jobs
    slurm.hpc = true
    slurm.default_partition = true
```

::: moniker-end

::: moniker range=">=cyclecloud-8"
Slurm can easily be enabled on a CycleCloud cluster by modifying the "run_list" in the configuration section of your cluster definition. The two basic components of a Slurm cluster are the 'scheduler' node which provides a shared filesystem on which the Slurm software runs, and the 'execute' nodes which are the hosts that mount the shared filesystem and execute the jobs submitted. For example, a simple cluster template snippet may look like:

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
`
::: moniker-end
## Editing Existing Slurm Clusters

Slurm clusters running in CycleCloud versions 7.8 and later implement an updated version of the autoscaling APIs that allows the clusters to utilize multiple nodearrays and partitions. To facilitate this functionality in Slurm, CycleCloud pre-populates the execute nodes in the cluster. Because of this, you need to run a command on the Slurm scheduler node after making any changes to the cluster, such as autoscale limits or VM types.

### Making Cluster Changes

The Slurm cluster deployed in CycleCloud contains a script that facilitates this. After making any changes to the cluster, run the following command as root (e.g., by running `sudo -i`) on the Slurm scheduler node to rebuild the `slurm.conf` and update the nodes in the cluster:

``` bash
cd /opt/cycle/slurm
./cyclecloud_slurm.sh scale
```

::: moniker range="=cyclecloud-7"
> [!NOTE]
> For CycleCloud versions < 7.9.10 the script is located under _/opt/cycle/jetpack/system/bootstrap/slurm_
::: moniker-end

::: moniker range=">=cyclecloud-8"
> [!NOTE]
> For CycleCloud versions > 8.2 the script is located under _/opt/cycle/slurm_
::: moniker-end

### Removing all execute nodes

As all the Slurm compute nodes have to be pre-created, it's required that all nodes in a cluster be completely removed when making big changes (such as VM type or Image). It is possible to remove all nodes via the UI, but the `cyclecloud_slurm.sh` script has a `remove_nodes` option that will remove any nodes that aren't currently running jobs.

### Creating additional partitions

The default template that ships with Azure CycleCloud has two partitions (`hpc` and `htc`), and you can define custom nodearrays that map directly to Slurm partitions. For example, to create a GPU partition, add the following section to your cluster template:

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

CycleCloud automatically sets the amount of available memory for Slurm to use for scheduling purposes. Because the amount of available memory can change slightly due to different Linux kernel options, and the OS and VM can use up a small amount of memory that would otherwise be available for jobs, CycleCloud automatically reduces the amount of memory in the Slurm configuration. By default, CycleCloud holds back 5% of the reported available memory in a VM, but this value can be overridden in the cluster template by setting `slurm.dampen_memory` to the percentage of memory to hold back. For example, to hold back 20% of a VM's memory:

``` ini
    slurm.dampen_memory=20
```

## Disabling autoscale for specific nodes or partitions

While the built-in CycleCloud "KeepAlive" feature does not currently work for Slurm clusters, it is possible to disable autoscale for a running Slurm cluster by editing the slurm.conf file directly. You can exclude either individual nodes or entire partitions from being autoscaled.

### Excluding a node

To exclude a node or multiple nodes from autoscale, add `SuspendExcNodes=<listofnodes>` to the Slurm configuration file. For example, to exclude nodes 1 and 2 from the hpc partition, add the following to `/sched/slurm.conf`:

```bash
SuspendExcNodes=hpc-pg0-[1-2]
```

Then restart the `slurmctld` service for the new configuration to take effect.
### Excluding a partition
Excluding entire partitions from autoscale is similar to excluding nodes. To exclude the entire `hpc` partition, add the following to `/sched/slurm.conf`

```bash
SuspendExcParts=hpc
```

Then restart the `slurmctld` service.

## Troubleshooting

### UID conflicts for Slurm and Munge users

By default, this project uses a UID and GID of 11100 for the Slurm user and 11101 for the Munge user. If this causes a conflict with another user or group, these defaults may be overridden.

To override the UID and GID, click the edit button for both the `scheduler` node:

::: moniker range="=cyclecloud-7"
![Edit Scheduler](~/images/version-7/slurmmasternodeedit.png "Edit Scheduler")
::: moniker-end

::: moniker range=">=cyclecloud-8"
![Edit Scheduler](~/images/version-8/slurmschednodeedit.png "Edit Scheduler")
::: moniker-end

And the `execute` nodearray:
![Edit Nodearray](~/images/slurmnodearraytab.png "Edit nodearray")

 and add the following attributes to the `Configuration` section:

![Edit Configuration](~/images/slurmnodearrayedit.png "Edit configuration")

``` ini
    slurm.user.name = slurm
    slurm.user.uid = 11100
    slurm.user.gid = 11100
    munge.user.name = munge
    munge.user.uid = 11101
    munge.user.gid = 11101
```

### Autoscale

CycleCloud uses Slurm's [Elastic Computing](https://slurm.schedmd.com/elastic_computing.html) feature. To debug autoscale issues, there are a few logs on the scheduler node you can check. The first is making sure that the power save resume calls are being made by checking `/var/log/slurmctld/slurmctld.log`. You should see lines like:

``` bash
[2019-12-09T21:19:03.400] power_save: pid 8629 waking nodes htc-1
```

The other log to check is `/var/log/slurmctld/resume.log`. If the resume step is failing, there will also be a `/var/log/slurmctld/resume_fail.log`. If there are messages about unknown or invalid node names, make sure you haven't added nodes to the cluster without following the steps in the "Making Cluster Changes" section above.

## Slurm Configuration Reference

The following are the Slurm specific configuration options you can toggle to customize functionality:

| Slurm Specific Configuration Options | Description |
| ------------------------------------ | ----------- |
| slurm.version                        | Default: '18.08.7-1'. This is the Slurm version to install and run. This is currently the default and *only* option. In the future additional versions of the Slurm software may be supported. |
| slurm.autoscale                      | Default: 'false'. This is a per-nodearray setting that controls whether Slurm should automatically stop and start nodes in this nodearray. |
| slurm.hpc                            | Default: 'true'. This is a per-nodearray setting that controls whether nodes in the nodearray will be placed in the same placement group. Primarily used for nodearrays using VM families with InfiniBand. It only applies when slurm.autoscale is set to 'true'. |
| slurm.default_partition              | Default: 'false'. This is a per-nodearray setting that controls whether the nodearray should be the default partition for jobs that don't request a partition explicitly. |
| slurm.dampen_memory                  | Default: '5'. The percentage of memory to hold back for OS/VM overhead. |
| slurm.suspend_timeout                | Default: '600'. The amount of time (in seconds) between a suspend call and when that node can be used again. |
| slurm.resume_timeout                 | Default: '1800'. The amount of time (in seconds) to wait for a node to successfully boot. |
| slurm.install                        | Default: 'true'.  Determines if Slurm is installed at node boot ('true').  If Slurm is installed in a custom image this should be set to 'false'.  (proj version 2.5.0+) |
| slurm.use_pcpu                       | Default: 'true'.  This is a per-nodearray setting to control scheduling with hyperthreaded vcpus.  Set to 'false' to set CPUs=vcpus in cyclecloud.conf. |
| slurm.user.name                      | Default: 'slurm'. This is the username for the Slurm service to use. |
| slurm.user.uid                       | Default: '11100'. The User ID to use for the Slurm user. |
| slurm.user.gid                       | Default: '11100'. The Group ID to use for the Slurm user. |
| munge.user.name                      | Default: 'munge'. This is the username for the MUNGE authentication service to use. |
| munge.user.uid                       | Default: '11101'. The User ID to use for the MUNGE user. |
| munge.user.gid                       | Default: '11101'. The Group ID to use for the MUNGE user. |

[!INCLUDE [scheduler-integration](~/includes/scheduler-integration.md)]
