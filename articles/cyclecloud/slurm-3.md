---
title: Slurm Scheduler Integration version 3.0
description: New CycleCloud Slurm 3.0+ functionality.
author: anhoward
ms.date: 07/01/2025
ms.author: anhoward
---

# CycleCloud Slurm 3.0

We rewrote the Slurm scheduler support as part of the CycleCloud 8.4.0 release. Key features include:

* Support for dynamic nodes and dynamic partitions through dynamic node arrays. This feature supports both single and multiple virtual machine (VM) sizes.
* New Slurm versions 23.02 and 22.05.8.
* Cost reporting through the `azslurm` CLI.
* `azslurm` CLI-based autoscaler.
* Ubuntu 20 support.
* Removed need for topology plugin and any associated submit plugin.

## Slurm Clusters in CycleCloud versions earlier than 8.4.0

For more information, see [Transitioning from 2.7 to 3.0](#transitioning-from-27-to-30).

### Making cluster changes

The Slurm cluster that you deploy in CycleCloud includes a CLI called `azslurm` to help you make changes to the cluster. After making any changes to the cluster, run the following command as root on the Slurm scheduler node to rebuild the `azure.conf` and update the nodes in the cluster:

```bash
      $ sudo -i
      # azslurm scale
```

The command creates the partitions with the correct number of nodes, sets up the proper `gres.conf`, and restarts the `slurmctld`.

### Nodes aren't precreated anymore

Starting with CycleCloud version 3.0.0 Slurm project, the nodes aren't precreated. You create nodes when you invoke `azslurm resume` or when you manually create them in CycleCloud using the CLI.

### Creating extra partitions

The default template that ships with Azure CycleCloud has three partitions (`hpc`, `htc`, and `dynamic`), and you can define custom node arrays that map directly to Slurm partitions. For example, to create a GPU partition, add the following section to your cluster template:

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

### Dynamic partitions

Starting with CycleCloud version 3.0.1, the solution supports dynamic partitions. You can make a `nodearray` map to a dynamic partition by adding the following code. The `myfeature` value can be any desired feature description or more than one feature, separated by a comma.

```ini
      [[[configuration]]]
      slurm.autoscale = true
      # Set to true if nodes are used for tightly-coupled multi-node jobs
      slurm.hpc = false
      # This is the minimum, but see slurmd --help and [slurm.conf](https://slurm.schedmd.com/slurm.conf.html) for more information.
      slurm.dynamic_config := "-Z --conf \"Feature=myfeature\""
```

The shared code snippet generates a dynamic partition like the following code:

```ini
# Creating dynamic nodeset and partition using slurm.dynamic_config=-Z --conf "Feature=myfeature"
Nodeset=mydynamicns Feature=myfeature
PartitionName=mydynamicpart Nodes=mydynamicns
```

### Using dynamic partitions to autoscale

By default, a dynamic partition doesn't include any nodes. You can start nodes through CycleCloud or by running `azslurm resume` manually. The nodes join the cluster using the name you choose. However, since Slurm isn't aware of these nodes ahead of time, it can't autoscale them.

Instead, you can precreate node records like so, which allows Slurm to autoscale them.

```bash
scontrol create nodename=f4-[1-10] Feature=myfeature State=CLOUD
```

Another advantage of dynamic partitions is that you can support **multiple VM sizes in the same partition**.
Simply add the VM size name as a feature, and then `azslurm` can distinguish which VM size you want to use.

**_Note_** The VM size is added implicitly. You don't need to add it to `slurm.dynamic_config`.

```bash
scontrol create nodename=f4-[1-10] Feature=myfeature,Standard_F4 State=CLOUD
scontrol create nodename=f8-[1-10] Feature=myfeature,Standard_F8 State=CLOUD
```

Either way, when you create these nodes in a `State=Cloud` state, they become available for autoscaling like other nodes.

To support **multiple VM sizes in a CycleCloud node array**, you can change the template to allow multiple VM sizes by adding `Config.Mutiselect = true`.

```ini
        [[[parameter DynamicMachineType]]]
        Label = Dyn VM Type
        Description = The VM type for Dynamic nodes
        ParameterType = Cloud.MachineType
        DefaultValue = Standard_F2s_v2
        Config.Multiselect = true
```

### Dynamic scale down

By default, all nodes in the dynamic partition scale down just like the other partitions. To disable dynamic partition, see [SuspendExcParts](https://slurm.schedmd.com/slurm.conf.html).

### Manual scaling

If cyclecloud_slurm detects that autoscale is disabled (SuspendTime=-1), it uses the FUTURE state to denote nodes that are powered down instead of relying on the power state in Slurm. When autoscale is enabled, `sinfo` shows off nodes as `idle~`. When autoscale is disabled, `sinfo` doesn't show inactive nodes. You can still see their definition with `scontrol show nodes --future`.

To start new nodes, run `/opt/azurehpc/slurm/resume_program.sh node_list` (for example, `htc-[1-10]`).

To shut down nodes, run `/opt/azurehpc/slurm/suspend_program.sh node_list` (for example, `htc-[1-10]`).

To start a cluster in this mode, add `SuspendTime=-1` to the supplemental Slurm config in the template.

To switch a cluster to this mode, add `SuspendTime=-1` to the `slurm.conf` file and run `scontrol reconfigure`. Then run `azslurm remove_nodes` and `azslurm scale`. 

## Troubleshooting

### Transitioning from 2.7 to 3.0

1. The installation folder changed from
      `/opt/cycle/slurm`
      to
      `/opt/azurehpc/slurm`.

1. Autoscale logs are now in `/opt/azurehpc/slurm/logs` instead of `/var/log/slurmctld`. The `slurmctld.log` file is in this folder.

1. The `cyclecloud_slurm.sh` script is no longer available. A new CLI tool called `azslurm` replaces `cyclecloud_slurm.sh`. You run `azslurm` as root, and it supports autocomplete.

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
      shell                - Interactive python shell with relevant objects in local scope. Use the --script to run python scripts
      suspend              - Equivalent to SuspendProgram, shuts down nodes
      wait_for_resume      - Wait for a set of nodes to converge.
      ```

1. CycleCloud doesn't create nodes ahead of time. It only creates nodes when you need them.

6. All Slurm binaries are inside the `azure-slurm-install-pkg*.tar.gz` file, under `slurm-pkgs`. They're pulled from a specific binary release. The current binary release is [4.0.0](https://github.com/Azure/cyclecloud-slurm/releases/tag/4.0.0).

7. For MPI jobs, the only default network boundary is the partition. Unlike version 2.x, each partition doesn't include multiple "placement groups". So you only have one colocated VMSS per partition. There's no need for the topology plugin anymore, so the job submission plugin isn't needed either. Instead, submitting to multiple partitions is the recommended option for use cases that require jobs submission to multiple placement groups.

[!INCLUDE [scheduler-integration](~/articles/cyclecloud/includes/scheduler-integration.md)]
