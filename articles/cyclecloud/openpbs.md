---
title: OpenPBS Integration
description: OpenPBS scheduler configuration in Azure CycleCloud.
author: adriankjohnson
ms.date: 07/29/2021
ms.author: adjohnso
---

# OpenPBS

[//]: # (Need to link to the scheduler README on Github)

::: moniker range="=cyclecloud-7"
[OpenPBS](http://openpbs.org/) can easily be enabled on a CycleCloud cluster by modifying the "run_list" in the configuration section of your cluster definition. The two basic components of a PBS Professional cluster are the 'master' node which provides a shared filesystem on which the PBS Professional software runs, and the 'execute' nodes which are the hosts that mount the shared filesystem and execute the jobs submitted. For example, a simple cluster template snippet may look like:

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

Importing and starting a cluster with definition in CycleCloud will yield a single 'master' node. Execute nodes can be added to the cluster via the `cyclecloud add_node` command. For example, to add 10 more execute nodes:

```azurecli-interactive
cyclecloud add_node my-pbspro -t execute -c 10
```

## PBS Resource-based Autoscaling

Cyclecloud maintains two resources to expand the dynamic provisioning capability. These resources are *nodearray* and *machinetype*.

If you submit a job and specify a nodearray resource by `qsub -l nodearray=highmem -- /bin/hostname`
then CycleCloud will add nodes to the nodearray named 'highmem'. If there is  no such nodearray then the job will remain idle.

Similarly if a machinetype resource is specified which a job submission, e.g. `qsub -l machinetype:Standard_L32s_v2 my-job.sh`, then CycleCloud autoscales the 'Standard_L32s_v2' in the 'execute' (default) nodearray. If that machine type is not available in the 'execute' node array then the job will remain idle.

These resources can be used in combination as:

```bash
qsub -l nodes=8:ppn=16:nodearray=hpc:machinetype=Standard_HB60rs my-simulation.sh
```

which will autoscale only if the 'Standard_HB60rs' machines are specified an the 'hpc' node array.

## Adding additional queues assigned to nodearrays

On clusters with multiple nodearrays, it's common to create separate queues to automatically route jobs to the appropriate VM type. In this example, we'll assume the following "gpu" nodearray has been defined in your cluster template:

```bash
    [[nodearray gpu]]
    Extends = execute
    MachineType = Standard_NC24rs

        [[[configuration]]]
        pbspro.slot_type = gpu
```

After importing the cluster template and starting the cluster, the following commands can be ran on the server node to create the "gpu" queue:

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
> The above queue definition will pack all VMs in the queue into a single VM scale set to support MPI jobs. To define the queue for serial jobs and allow multiple VM Scalesets, set `ungrouped = true` for both `resources_default` and `default_chunk`. You can also set `resources_default.place = pack` if you want the scheduler to pack jobs onto VMs instead of round-robin allocation of jobs. For more information on PBS job packing, see the official [PBS Professional OSS documentation](https://www.altair.com/pbs-works-documentation/).

## PBS Professional Configuration Reference

The following are the PBS Professional specific configuration options you can toggle to customize functionality:

| PBS Pro Options | Description |
| --------------- | ----------- |
| pbspro.slots                           | The number of slots for a given node to report to PBS Pro. The number of slots is the number of concurrent jobs a node can execute, this value defaults to the number of CPUs on a given machine. You can override this value in cases where you don't run jobs based on CPU but on memory, GPUs, etc.                                                               |
| pbspro.slot_type                       | The name of type of 'slot' a node provides. The default is 'execute'. When a job is tagged with the hard resource  `slot_type=<type>`, that job will *only* run on a machine of the same slot type. This allows you to create different software and hardware configurations per node and ensure an appropriate job is always scheduled on the correct type of node.  |
| pbspro.version                         | Default: '18.1.3-0'. This is the PBS Professional version to install and run. This is currently the default and *only* option. In the future additional versions of the PBS Professional software may be supported. |

::: moniker-end

::: moniker range=">=cyclecloud-8"

## Connect PBS with CycleCloud

CycleCloud manages [OpenPBS](http://openpbs.org/)  clusters through an installable agent called 
[`azpbs`](https://github.com/Azure/cyclecloud-pbspro). This agent connect to 
CycleCloud to read cluster and VM configurations and also integrates with OpenPBS
to effectively process the job and host information. All `azpbs` configurations
are found in the `autoscale.json` file, normally `/opt/cycle/pbspro/autoscale.json`. 

```
  "password": "260D39rWX13X",
  "url": "https://cyclecloud1.contoso.com",
  "username": "cyclecloud_api_user",
  "logging": {
    "config_file": "/opt/cycle/pbspro/logging.conf"
  },
  "cluster_name": "mechanical_grid",
```

### Important Files

The `azpbs` agent parses the PBS configuration each time it's called - jobs, queues, resources.
Information is provided in the stderr and stdout of the command as well as to a log file, both
at configurable levels. All PBS management commands (`qcmd`) with arguments are logged to file as well.

All these files can be found in the _/opt/cycle/pbspro/_ directory where the agent is installed.

| File  |  Location | Description |
|---|---|---|
| Autoscale Config  | autoscale.json  | Configuration for Autoscale, Resource Map, CycleCloud access information |
| Autoscale Log  | autoscale.log  | Agent main thread logging including CycleCloud host management |
| Demand Log | demand.log | Detailed log for resource matching |
| qcmd Trace Log  | qcmd.log | Logging the agent `qcmd` calls | 
| Logging Config | logging.conf | Configurations for logging masks and file locations | 


### Defining OpenPBS Resources
This project allows for a generally association of OpenPBS resources with Azure 
VM resources via the cyclecloud-pbspro (azpbs) project. This resource relationship 
defined in `autoscale.json`.

The default resources defined with the cluster template we ship with are

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

The OpenPBS resource named `mem` is equated to a node attribute named `node.memory`,
which is the total memory of any virtual machine. This configuration allows `azpbs`
to process a resource request such as `-l mem=4gb` by comparing the value of the
job resource requirements to node resources. 

Note that disk is currently hardcoded to `size::20g`. 
Here is an example of handling VM Size specific disk size
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

### Autoscale and Scalesets

CycleCloud treats spanning and serial jobs differently in OpenPBS clusters. 
Spanning jobs will land on nodes that are part of the same placement group. The
placement group has a particular platform meaning (VirtualMachineScaleSet with 
SinglePlacementGroup=true) and CC will managed a named placement group for each
spanned node set. Use the PBS resource `group_id` for this placement group name.

The `hpc` queue appends
the equivalent of `-l place=scatter:group=group_id` by using native queue defaults.


### Installing the CycleCloud OpenPBS Agent `azpbs`

The OpenPBS CycleCloud cluster will manage the installation and configuration of 
the agent on the server node. The preparation includes setting PBS resources, 
queues, and hooks. A scripted install can be done outside of CycleCloud as well.

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
> CycleCloud does not support the bursting configuration with Open PBS.

> [!NOTE]
> Even though Windows is an officially supported Open PBS platform, CycleCloud does not support running Open PBS on Windows at this time.