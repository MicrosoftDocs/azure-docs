---
title: Slurm Scheduler Integration version 3.0
description: New CycleCloud Slurm 3.0+ functionality.
author: anhoward
ms.date: 01/23/2025
ms.author: anhoward
---

# CycleCloud Slurm 3.0

Slurm scheduler support was rewritten as part of the CycleCloud 8.4.0 release. Key features include:

* Support for dynamic nodes, and dynamic partitions via dynamic nodearays, supporting both single and multiple VM sizes
* New slurm versions 23.02 and 22.05.8
* Cost reporting via `azslurm` CLI
* `azslurm` cli based autoscaler
* Ubuntu 20 support
* Removed need for topology plugin, and therefore also any submit plugin

## Slurm Clusters in CycleCloud versions < 8.4.0

See [Transitioning from 2.7 to 3.0](#transitioning-from-27-to-30) for more information.

### Making Cluster Changes

The Slurm cluster deployed in CycleCloud contains a cli called `azslurm` to facilitate making changes to the cluster. After making any changes to the cluster, run the following command as root on the Slurm scheduler node to rebuild the `azure.conf` and update the nodes in the cluster:

```bash
      $ sudo -i
      # azslurm scale
```

This should create the partitions with the correct number of nodes, the proper `gres.conf` and restart the `slurmctld`.

### No longer pre-creating execute nodes

As of version 3.0.0 of the CycleCloud Slurm project, we are no longer pre-creating the nodes in CycleCloud. Nodes are created when `azslurm resume` is invoked, or by manually creating them in CycleCloud via CLI.

### Creating additional partitions

The default template that ships with Azure CycleCloud has three partitions (`hpc`, `htc` and `dynamic`), and you can define custom nodearrays that map directly to Slurm partitions. For example, to create a GPU partition, add the following section to your cluster template:

```ini
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

      [[[cluster-init cyclecloud/slurm:execute:3.0.1]]]
      [[[network-interface eth0]]]
      AssociatePublicIpAddress = $ExecuteNodesPublic
```

### Dynamic Partitions

As of `3.0.1`, we support dynamic partitions. You can make a `nodearray` map to a dynamic partition by adding the following.
Note that `myfeature` could be any desired Feature description. It can also be more than one feature, separated by a comma.

```ini
      [[[configuration]]]
      slurm.autoscale = true
      # Set to true if nodes are used for tightly-coupled multi-node jobs
      slurm.hpc = false
      # This is the minimum, but see slurmd --help and [slurm.conf](https://slurm.schedmd.com/slurm.conf.html) for more information.
      slurm.dynamic_config := "-Z --conf \"Feature=myfeature\""
```

This will generate a dynamic partition like the following

```ini
# Creating dynamic nodeset and partition using slurm.dynamic_config=-Z --conf "Feature=myfeature"
Nodeset=mydynamicns Feature=myfeature
PartitionName=mydynamicpart Nodes=mydynamicns
```

### Using Dynamic Partitions to Autoscale

By default, we define no nodes in the dynamic partition. Instead, you can start nodes via CycleCloud or by manually invoking `azslurm resume` and they will join the cluster with whatever name you picked. However, Slurm does not know about these nodes so it can not autoscale them up.

Instead, you can also pre-create node records like so, which allows Slurm to autoscale them up.

```bash
scontrol create nodename=f4-[1-10] Feature=myfeature State=CLOUD
```

One other advantage of dynamic partitions is that you can support **multiple VM sizes in the same partition**.
Simply add the VM Size name as a feature, and then `azslurm` can distinguish which VM size you want to use.

**_Note_ The VM Size is added implicitly. You do not need to add it to `slurm.dynamic_config`**

```bash
scontrol create nodename=f4-[1-10] Feature=myfeature,Standard_F4 State=CLOUD
scontrol create nodename=f8-[1-10] Feature=myfeature,Standard_F8 State=CLOUD
```

Either way, once you have created these nodes in a `State=Cloud` they are now available to autoscale like other nodes.

To support **multiple VM sizes in a CycleCloud nodearray**, you can alter the template to allow multiple VM sizes by adding `Config.Mutiselect = true`.

```ini
        [[[parameter DynamicMachineType]]]
        Label = Dyn VM Type
        Description = The VM type for Dynamic nodes
        ParameterType = Cloud.MachineType
        DefaultValue = Standard_F2s_v2
        Config.Multiselect = true
```

### Dynamic Scaledown

By default, all nodes in the dynamic partition will scale down just like the other partitions. To disable this, see [SuspendExcParts](https://slurm.schedmd.com/slurm.conf.html).

### Manual scaling

If cyclecloud_slurm detects that autoscale is disabled (SuspendTime=-1), it will use the FUTURE state to denote nodes that are powered down instead of relying on the power state in Slurm. i.e. When autoscale is enabled, off nodes are denoted as `idle~` in sinfo. When autoscale is disabled, the off nodes will not appear in sinfo at all. You can still see their definition with `scontrol show nodes --future`.

To start new nodes, run `/opt/azurehpc/slurm/resume_program.sh node_list` (e.g. htc-[1-10]).

To shutdown nodes, run `/opt/azurehpc/slurm/suspend_program.sh node_list` (e.g. htc-[1-10]).

To start a cluster in this mode, simply add `SuspendTime=-1` to the additional slurm config in the template.

To switch a cluster to this mode, add `SuspendTime=-1` to the slurm.conf and run `scontrol reconfigure`. Then run `azslurm remove_nodes && azslurm scale`. 

## Troubleshooting

### Transitioning from 2.7 to 3.0

1. The installation folder changed
      `/opt/cycle/slurm`
      ->
      `/opt/azurehpc/slurm`

2. Autoscale logs are now in `/opt/azurehpc/slurm/logs` instead of `/var/log/slurmctld`. Note, `slurmctld.log` will still be in this folder.

3. `cyclecloud_slurm.sh` no longer exists. Instead there is a new `azslurm` cli, which can be run as root. `azslurm` supports autocomplete.

      ```bash
      [root@scheduler ~]# azslurm
      usage: 
      accounting_info      - 
      buckets              - Prints out autoscale bucket information, like limits etc
      config               - Writes the effective autoscale config, after any preprocessing, to stdout
      connect              - Tests connection to CycleCloud
      cost                 - Cost analysis and reporting tool that maps Azure costs to Slurm Job Accounting data. This is an experimental feature.
      default_output_columns - Output what are the default output columns for an optional command.
      generate_topology    - Generates topology plugin configuration
      initconfig           - Creates an initial autoscale config. Writes to stdout
      keep_alive           - Add, remove or set which nodes should be prevented from being shutdown.
      limits               - 
      nodes                - Query nodes
      partitions           - Generates partition configuration
      refresh_autocomplete - Refreshes local autocomplete information for cluster specific resources and nodes.
      remove_nodes         - Removes the node from the scheduler without terminating the actual instance.
      resume               - Equivalent to ResumeProgram, starts and waits for a set of nodes.
      resume_fail          - Equivalent to SuspendFailProgram, shuts down nodes
      retry_failed_nodes   - Retries all nodes in a failed state.
      scale                - 
      shell                - Interactive python shell with relevant objects in local scope. Use --script to run python scripts
      suspend              - Equivalent to SuspendProgram, shuts down nodes
      wait_for_resume      - Wait for a set of nodes to converge.
      ```

4. Nodes are no longer pre-populated in CycleCloud. They are only created when needed.

5. All slurm binaries are inside the `azure-slurm-install-pkg*.tar.gz` file, under `slurm-pkgs`. They are pulled from a specific binary release. The current binary releaes is [2023-03-13](https://github.com/Azure/cyclecloud-slurm/releases/tag/2023-03-13-bins)

6. For MPI jobs, the only network boundary that exists by default is the partition. There are not multiple "placement groups" per partition like 2.x. So you only have one colocated VMSS per partition. There is also no use of the topology plugin, which necessitated the use of a job submission plugin that is also no longer needed. Instead, submitting to multiple partitions is now the recommended option for use cases that require submitting jobs to multiple placement groups.

[!INCLUDE [scheduler-integration](~/articles/cyclecloud/includes/scheduler-integration.md)]
