---
title: OpenPBS Integration
description: OpenPBS scheduler configuration in Azure CycleCloud.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# OpenPBS

[//]: # (Need to link to the scheduler README on GitHub)

::: moniker range="=cyclecloud-7"
You can enable [OpenPBS](http://openpbs.org/) on a CycleCloud cluster by changing the `run_list` in the configuration section of your cluster definition. A PBS Professional (PBS Pro) cluster has two main parts: the **primary** node, which runs the software on a shared filesystem, and the **execute** nodes, which mount that filesystem and run the submitted jobs. For example, a simple cluster template snippet might look like:

``` ini
[cluster my-pbspro]

[[node master]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A4 # 8 cores

    [[[configuration]]]
    run_list = role[pbspro_master_role]

[[nodearray execute]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A1  # 1 core

    [[[configuration]]]
    run_list = role[pbspro_execute_role]
```

When you import and start a cluster with this definition in CycleCloud, you get a single **primary** node. You can add **execute** nodes to the cluster by using the `cyclecloud add_node` command. For example, to add 10 more **execute** nodes, use:

```azurecli-interactive
cyclecloud add_node my-pbspro -t execute -c 10
```

## PBS resource-based autoscaling

CycleCloud maintains two resources to expand the dynamic provisioning capability. These resources are *nodearray* and *machinetype*.

When you submit a job and specify a node array resource with `qsub -l nodearray=highmem -- /bin/hostname`, CycleCloud adds nodes to the node array named `highmem`. If the node array doesn't exist, the job stays idle.

When you specify a machine type resource in a job submission, such as `qsub -l machinetype:Standard_L32s_v2 my-job.sh`, CycleCloud autoscales the `Standard_L32s_v2` machines in the `execute` (default) node array. If the machine type isn't available in the `execute` node array, the job stays idle.

You can use these resources together as:

```bash
qsub -l nodes=8:ppn=16:nodearray=hpc:machinetype=Standard_HB60rs my-simulation.sh
```
Autoscales only if you specify the `Standard_HB60rs` machines in the `hpc` node array.

## Adding extra queues assigned to node arrays

On clusters with multiple node arrays, create separate queues to automatically route jobs to the appropriate VM type. In this example, assume the following `gpu` node array is defined in your cluster template:

```bash
    [[nodearray gpu]]
    Extends = execute
    MachineType = Standard_NC24rs

        [[[configuration]]]
        pbspro.slot_type = gpu
```

After you import the cluster template and start the cluster, run the following commands on the server node to create the `gpu` queue:

```bash
/opt/pbs/bin/qmgr -c "create queue gpu"
/opt/pbs/bin/qmgr -c "set queue gpu queue_type = Execution"
/opt/pbs/bin/qmgr -c "set queue gpu resources_default.ungrouped = false"
/opt/pbs/bin/qmgr -c "set queue gpu resources_default.place = scatter"
/opt/pbs/bin/qmgr -c "set queue gpu resources_default.slot_type = gpu"
/opt/pbs/bin/qmgr -c "set queue gpu default_chunk.ungrouped = false"
/opt/pbs/bin/qmgr -c "set queue gpu default_chunk.slot_type = gpu"
/opt/pbs/bin/qmgr -c "set queue gpu enabled = true"
/opt/pbs/bin/qmgr -c "set queue gpu started = true"
```

> [!NOTE]
> As shown in the example, the queue definition packs all VMs in the queue into a single virtual machine scale set to support MPI jobs. To define the queue for serial jobs and allow multiple virtual machine scale sets, set `ungrouped = true` for both `resources_default` and `default_chunk`. Set `resources_default.place = pack` if you want the scheduler to pack jobs onto VMs instead of round-robin allocation of jobs. For more information on PBS job packing, see the official [PBS Professional OSS documentation](https://www.altair.com/pbs-works-documentation/).

## PBS Professional configuration reference

The following table describes the PBS Professional (PBS Pro) specific configuration options you can toggle to customize functionality:

| PBS Pro Options | Description |
| --------------- | ----------- |
| pbspro.slots                           | The number of slots for a given node to report to PBS Pro. The number of slots is the number of concurrent jobs a node can execute. This value defaults to the number of CPUs on a given machine. You can override this value in cases where you don't run jobs based on CPU but on memory, GPUs, and other resources.                                                               |
| pbspro.slot_type                       | The name of the type of 'slot' a node provides. The default is 'execute'. When you tag a job with the hard resource `slot_type=<type>`, the job runs *only* on the machines with the same slot type. This setting lets you create different software and hardware configurations for each node and ensures that the right job is always scheduled on the correct type of node.  |
| pbspro.version                         | Default: '18.1.3-0'. This version is currently the default and *only* option to install and run. In the future, more versions of the PBS Pro software might be supported. |

::: moniker-end

::: moniker range=">=cyclecloud-8"

## Connect PBS with CycleCloud

CycleCloud manages [OpenPBS](http://openpbs.org/) clusters through an installable agent called [`azpbs`](https://github.com/Azure/cyclecloud-pbspro). This agent connects to CycleCloud to read cluster and VM configurations. It also integrates with OpenPBS to process the job and host information. You can find all `azpbs` configurations in the `autoscale.json` file, usually located at `/opt/cycle/pbspro/autoscale.json`.

```
  "password": "260D39rWX13X",
  "url": "https://cyclecloud1.contoso.com",
  "username": "cyclecloud_api_user",
  "logging": {
    "config_file": "/opt/cycle/pbspro/logging.conf"
  },
  "cluster_name": "mechanical_grid",
```

### Important files

The `azpbs` agent parses the PBS configuration each time it's called - jobs, queues, resources. The agent provides this information in the stderr and stdout of the command and to a log file, both at configurable levels. The agent also logs all PBS management commands (`qcmd`) with arguments to a file.

You can find all these files in the _/opt/cycle/pbspro/_ directory where you install the agent.

| File  |  Location | Description |
|---|---|---|
| Autoscale Config  | autoscale.json  | Configuration for Autoscale, Resource Map, CycleCloud access information |
| Autoscale Log  | autoscale.log  | Agent main thread logging including CycleCloud host management |
| Demand Log | demand.log | Detailed log for resource matching |
| qcmd Trace Log  | qcmd.log | Logging the agent `qcmd` calls |
| Logging Config | logging.conf | Configurations for logging masks and file locations | 


### Defining OpenPBS Resources
This project enables you to associate OpenPBS resources with Azure VM resources through the cyclecloud-pbspro (azpbs) project. You define this resource relationship in `autoscale.json`.
The cluster template includes the following default resources:

```json
{"default_resources": [
   {
      "select": {},
      "name": "ncpus",
      "value": "node.vcpu_count"
   },
   {
      "select": {},
      "name": "group_id",
      "value": "node.placement_group"
   },
   {
      "select": {},
      "name": "host",
      "value": "node.hostname"
   },
   {
      "select": {},
      "name": "mem",
      "value": "node.memory"
   },
   {
      "select": {},
      "name": "vm_size",
      "value": "node.vm_size"
   },
   {
      "select": {},
      "name": "disk",
      "value": "size::20g"
   }]
}
```

The OpenPBS resource named `mem` corresponds to a node attribute named `node.memory`, which represents the total memory of any virtual machine. This configuration lets `azpbs` handle a resource request like `-l mem=4gb` by comparing the value of the job resource requirements to node resources. 

Currently, the disk size is set to `size::20g`. Here's an example of how to handle VM Size specific disk size:
```json
   {
      "select": {"node.vm_size": "Standard_F2"},
      "name": "disk",
      "value": "size::20g"
   },
   {
      "select": {"node.vm_size": "Standard_H44rs"},
      "name": "disk",
      "value": "size::2t"
   }
```

### Autoscale and scale sets

CycleCloud treats spanning and serial jobs differently in OpenPBS clusters. Spanning jobs land on nodes that are part of the same placement group. The placement group has a particular platform meaning VirtualMachineScaleSet with SinglePlacementGroup=true) and CycleCloud manages a named placement group for each spanned node set. Use the PBS resource `group_id` for this placement group name.

The `hpc` queue appends the equivalent of `-l place=scatter:group=group_id` by using native queue defaults.


### Installing the CycleCloud OpenPBS Agent `azpbs`

The OpenPBS CycleCloud cluster manages the installation and configuration of the agent on the server node. The preparation steps include setting PBS resources, queues, and hooks. You can also perform a scripted installation outside of CycleCloud.

```bash
# Prerequisite: python3, 3.6 or newer, must be installed and in the PATH
wget https://github.com/Azure/cyclecloud-pbspro/releases/download/2.0.5/cyclecloud-pbspro-pkg-2.0.5.tar.gz
tar xzf cyclecloud-pbspro-pkg-2.0.5.tar.gz
cd cyclecloud-pbspro

# Optional, but recommended. Adds relevant resources and enables strict placement
./initialize_pbs.sh

# Optional. Sets up workq as a colocated, MPI focused queue and creates htcq for non-MPI workloads.
./initialize_default_queues.sh

# Creates the azpbs autoscaler
./install.sh  --venv /opt/cycle/pbspro/venv

# Otherwise insert your username, password, url, and cluster name here.
./generate_autoscale_json.sh --install-dir /opt/cycle/pbspro \
                             --username user \
                             --password password \
                             --url https://fqdn:port \
                             --cluster-name cluster_name

azpbs validate
```

::: moniker-end

[!INCLUDE [scheduler-integration](~/articles/cyclecloud/includes/scheduler-integration.md)]

> [!NOTE]
> CycleCloud doesn't support the bursting configuration with Open PBS.

> [!NOTE]
> Even though Windows is an officially supported Open PBS platform, CycleCloud doesn't support running Open PBS on Windows at this time.
