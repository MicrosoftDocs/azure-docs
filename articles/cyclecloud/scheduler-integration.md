---
title: Azure CycleCloud Scheduler Integration | Microsoft Docs
description: Grid Scheduling configuration for job management in Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Scheduler Integration

The Azure CycleCloud platform has built-in, first-class support for several grid scheduling software solutions allowing for simplified resource and job management in the cloud. Azure CycleCloud can automatically create, manage, and scale several well known and widely adopted scheduling technologies including but not limited to: [Open Grid Scheduler (Grid Engine)](http://gridscheduler.sourceforge.net), [HTCondor](https://research.cs.wisc.edu/htcondor/), [PBS Pro](http://pbspro.org/), and [Torque](http://www.adaptivecomputing.com/products/open-source/torque/).

## Open Grid Scheduler (Grid Engine)

[Open Grid Scheduler (Grid Engine)](http://gridscheduler.sourceforge.net/) can easily be enabled on an azure CycleCloud cluster by modifying the "run_list" in the cluster definition. The two basic components of a Grid Engine cluster are the 'master' node which provides a shared filesystem on which the Grid Engine software runs, and the 'execute' nodes which are the hosts that mount the shared filesystem and execute the jobs submitted. For example, a simple Grid Engine cluster template snippet may look like:

``` ini
[cluster grid-engine]

[[node master]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A4 # 8 cores

    [[[configuration]]]
    run_list = role[sge_master_role]

[[nodearray execute]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A1  # 1 core

    [[[configuration]]]
    run_list = role[sge_execute_role]
```

> [!NOTE]
> The role names contain 'sge' for legacy reasons: Grid Engine was a product of Sun Microsystems.

Importing and starting a cluster with definition in CycleCloud will yield a single 'master' node. Execute nodes can be added to the cluster via the 'cyclecloud add_node' command. For example, to add 10 more execute nodes:

```azurecli-interactive
cyclecloud add_node grid-engine -t execute -c 10
```

## Grid Engine Autoscaling

Azure CycleCloud supports autoscaling for Grid Engine, which means that the software will monitor the status of your queue and turn on and off nodes as needed to complete the work in an optimal amount of time/cost. You can enable autoscaling for Grid Engine by adding `Autoscale = true` to your cluster definition:

``` ini
[cluster grid-engine]
Autoscale = True
```

By default, all jobs submitted into the Grid Engine queue will run on machines of type 'execute', these are machines defined by the node array named "execute". You are not limited to the name 'execute', nor are you limited to a single type of machine configuration to run jobs and autoscale on.

As an example, a common case may be that you have a cluster with two different node definitions one is for running 'normal' jobs that consume standard CPU while another type of job may use GPU machines. In this case you would want to independently scale your queue by both normal jobs as well as GPU jobs to make sure you have an appropriate amount of each machine to consume the work queue. An example definition would be something like:

``` ini
[cluster grid-engine]
Autoscale = True

[[node master]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A3  # 4 cores

    [[[configuration]]]
    run_list = role[sge_master_role]

[[nodearray execute]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A4  # 8 cores

    [[[configuration]]]
    run_list = role[sge_execute_role]

[[nodearray gpu]]
    MachineType = Standard_NV12 # 2 GPUs
    ImageName = cycle.image.centos7

    [[[configuration]]]
    run_list = role[sge_execute_role]
    gridengine.slot_type = gpu
    gridengine.slots = 2
```

In the above example, there are now two node arrays: One is a 'standard' execute node array, the second is named 'gpu' providing a MachineType that has two Nvidia GPU's (Standard_NV12 in Azure). Also note that there are now two new items in the configuration section besides the csge:sgeexec recipe. Adding `grid_engine.slot_type = gpu` tells the Grid Engine scheduler that these nodes should be named 'gpu' nodes and thus should only run 'gpu' jobs. The name 'gpu' is arbitrary, but a name that describes the node is most useful. Set `grid_engine.slots = 2`, which tells the software to make sure that this type of node can only run two jobs at once (Standard_NV12 only has 2 GPUs). By default the number of slots per node in Grid Engine will be the number of CPUs on the system which, in this case, would cause too many jobs to concurrently execute on the node.

You can verify the number of slots and slot_type your machines have by running the command:

``` output
    -bash-4.1# qstat -F slot_type
    queuename                      qtype resv/used/tot. load_avg arch          states
    ---------------------------------------------------------------------------------
    all.q@ip-0A000404              BIP   0/0/4          0.17     linux-x64
        hf:slot_type=execute
    ---------------------------------------------------------------------------------
    all.q@ip-0A000405              BIP   0/0/2          2.18     linux-x64
        hf:slot_type=gpu
    ---------------------------------------------------------------------------------
    all.q@ip-0A000406              BIP   0/0/4          0.25     linux-x64
```

Notice that there are one of each 'slot_type' that we specified (execute and gpu) and the number of slots for the 'execute' slot is 4, which is the number of CPUs on the machine. The number of slots for the 'gpu' slot type is 2, which we specified in our cluster configuration template. The third machine is the master node which does not run jobs.

## Grid Engine Advanced Usage

The above configuration settings allow for advanced customization of nodes and node arrays. For example, if jobs require a specific amount of memory, say 10GB each, you can define an execute nodearray that starts machines with 60GB of memory, then add in the configuration options `grid_engine.slots = 6` to ensure that only 6 jobs can concurrently run on this type of node (ensuring that each job will have at least 10GB of memory to work with).

## Grouped Nodes in Grid Engine
When a parallel job is submitted to grid engine, the default autoscale behavior that CycleCloud will use is to treat each MPI job as a grouped node request. Grouped nodes are tightly-coupled and ideally suited for MPI workflows.

When a set of grouped nodes join an Grid Engine cluster, the group id of each node is used as the value of the complex value `affinity_group`. By requiring an `affinity_group` to be specified for jobs, it allows the Grid Engine scheduler to ensure that jobs only land on machines that are in the same group.

CycleCloud's automation will automatically request grouped nodes and assign them to available affinity groups when parallel jobs are encountered.

## Submitting Jobs to Grid Engine

The most generic way to submit jobs to a Grid Engine scheduler is the command:

```azurecli-interactive
qsub my_job.sh
```

This command will submit a job that will run on a node of type 'execute', that is a node defined by the nodearray 'execute'. To make a job run on a nodearray of a different type, for example the 'gpu' node type above, we modify our submission:

```azurecli-interactive
qsub -l slot_type=gpu my_gpu_job.sh
```

This command will ensure that the job only runs on a 'slot_type' of 'gpu'.

If slot_type is omitted, 'execute' will be automatically assigned to the job. The mechanism that automatically assigns slot_type's to jobs can be modified by the user. A python script located at /opt/cycle/jetpack/config/autoscale.py can be created which should define a single function "sge_job_handler". This function receives a dictionary representation of the job, similar to the output of a 'qstat -j <jobID>' command and should return a dictionary of hard resources that need to be updated for the job. As an example, below is a script which will assign a job to the 'gpu' slot_type if the jobs name contains the letters 'gpu'. This would allow a user to submit their jobs from an automated system without having to modify the job parameters and still have the jobs run on and autoscale the correct nodes:

``` python
#!/usr/env python
#
# File: /opt/cycle/jetpack/config/autoscale.py
#
def sge_job_handler(job):
  # The 'job' parameter is a dictionary containing the data present in a 'qstat -j <jobID>':
    hard_resources = {'slot_type': 'execute', 'affinity_group' : 'default' }

  # Don't modify anything if the job already has a slot type
  # You could modify the slot type at runtime by not checking this
  if 'hard_resources' in job and 'slot_type' in job['hard_resources']:
      return hard_resources

  # If the job's script name contains the string 'gpu' then it's assumed to be a GPU job.
  # Return a dictionary containing the new job_slot requirement to be updated.
  # For example: 'big_data_gpu.sh' would be run on a 'gpu' node.
  if job['job_name'].find('gpu') != -1:
      hard_resources {'slot_type': 'gpu'}
  else:
      return hard_resources
```

The parameter 'job' passed in is a dictionary that contains the data in a 'qstat -j <jobID>' call:

``` python
{
    "job_number": 5,
    "job_name": "test.sh",
    "script_file": "test.sh",
    "account": "sge",
    "owner": "cluster.user",
    "uid": 100,
    "group": "cluster.user",
    "gid": 200,
    "submission_time": "2013-10-09T09:09:09",
    "job_args": ['arg1', 'arg2', 'arg3'],
    "hard_resources": {
       'mem_free': '15G',
       'slot_type': 'execute'
    }
}
```

You can use this scripting functionality to automatically assign 'slot_type's based on any parameter defined in the job such as arguments, other resource requirements like memory, submitting user, etc.

If you were to submit 5 jobs of each 'slot_type':

```azurecli-interactive
qsub -t 1:5 gpu_job.sh
qsub -t 1:5 normal_job.sh
```

There would now be 10 jobs in the queue. Because of the script defined above, the five jobs with 'gpu' in the name would be automatically configured to only run on nodes of 'slot_type=gpu'. The CycleCloud autoscale mechanism would detect that there are  5 'gpu' jobs and 5 'execute' jobs. Since the 'gpu' nodearray is defined as having 2 slots per node, CycleCloud would start 3 of these nodes (5/2=2.5 rounded up to 3). There are 5 normal jobs, since the machine type for the 'execute' nodearray has 4 CPU's each, CycleCloud would start 2 of these nodes to handle the jobs (5/4=1.25 rounded up to 2). After a short period of time for the newly started nodes to boot and configure, all 10 jobs would run to completion and then the 5 nodes would automatically shutdown before you are billed again by the Cloud Provider.

Jobs are assumed to have a duration of one hour. If the job runtime is known the autoscale algorithm can benefit from this information. Inform autoscale of the expected job run time by adding it to the job context. The following example tells autoscale that the job runtime is on average 10 minutes:

```azurecli-interactive
qsub -ac average_runtime=10 job_with_duration_of_10m.sh
```

## Grid Engine Configuration Reference

The following are the Grid Engine specific configuration options you can toggle to customize functionality:

| SGE-Specific Configuration Options | Description |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gridengine.slots                   | The number of slots for a given node to report to Grid Engine. The number of slots is the number of concurrent jobs a node can execute, this value defaults to the number of CPUs on a given machine. You can override this value in cases where you don't run jobs based on CPU but on memory, GPUs, etc.                                                     |
| gridengine.slot_type               | The name of type of 'slot' a node provides. The default is 'execute'. When a job is tagged with the hard resource 'slot_type=', that job will *only* run on a machine of the same slot type. This allows you to create different software and hardware configurations per node and ensure an appropriate job is always scheduled on the correct type of node.  |
| gridengine.ignore_fqdn             | Default: true. Set to false if all the nodes in your cluster are not part of a single DNS domain. |
| gridengine.version                 | Default: '2011.11'. This is the Grid Engine version to install and run. This is currently the default and *only* option. In the future additional versions of the Grid Engine software may be supported.                                                                                                                                                       |
| gridengine.root                    | Default: '/sched/sge/sge-2011.11' This is where the Grid Engine will be installed and mounted on every node in the system. It is recommended this value not be changed, but if it is it should be set to the same value on **every** node in the cluster.                                                                                                      |


CycleCloud supports a `standard set <autostop-attributes>` of autostop attributes for Grid Engine.

## PBS Professional OSS

The [PBS Professional PSS (PBS Pro)](http://pbspro.org/) can easily be enabled on a CycleCloud cluster by modifying the "run_list" in the configuration section of your cluster definition. The two basic components of a PBS Pro cluster are the 'master' node which provides a shared filesystem on which the PBS Pro software runs, and the 'execute' nodes which are the hosts that mount the shared filesystem and execute the jobs submitted. For example, a simple cluster template snippet may look like:

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

Importing and starting a cluster with definition in CycleCloud will yield a single 'master' node. Execute nodes can be added to the cluster via the 'cyclecloud add_node' command. For example, to add 10 more execute nodes:

```azurecli-interactive
cyclecloud add_node my-pbspro -t execute -c 10
```

## PBS Pro Configuration Reference

The following are the PBS Pro specific configuration options you can toggle to customize functionality:

| PBS Pro-Specific Configuration Options | Description                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pbspro.slots                           | The number of slots for a given node to report to PBS Pro. The number of slots is the number of concurrent jobs a node can execute, this value defaults to the number of CPUs on a given machine. You can override this value in cases where you don't run jobs based on CPU but on memory, GPUs, etc.                                                               |
| pbspro.slot_type                       | The name of type of 'slot' a node provides. The default is 'execute'. When a job is tagged with the hard resource 'slot_type=<type>', that job will *only* run on a machine of the same slot type. This allows you to create different software and hardware configurations per node and ensure an appropriate job is always scheduled on the correct type of node.  |
| pbspro.version                         | Default: '14.2.1-0'. This is the PBS Pro version to install and run. This is currently the default and *only* option. In the future additional versions of the PBS Pro software may be supported.                                                                                                                                                                    

CycleCloud supports a standard set <autostop-attributes> of autostop attributes for PBS Pro:

| Attribute                                             | Description                                                                                               |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| cyclecloud.cluster.autoscale.stop_enabled             | Is autostop enabled on this node? true/false                                                              |
| cyclecloud.cluster.autoscale.idle_time_after_jobs     | The amount of time (in seconds) for a node to sit idle after completing jobs before it is scaled down.    |
| cyclecloud.cluster.autoscale.idle_time_before_jobs    |   The amount of time (in seconds) for a node to sit idle before completing jobs before it is scaled down. |

## HTCondor

[HTCondor](http://research.cs.wisc.edu/htcondor/manual/latest) can easily be enabled on a CycleCloud cluster by modifying the "run_list" in the configuration section of your cluster definition. There are three basic components of an HTCondor cluster. The first is the "central manager" which provides the scheduling and management daemons. The second component of an HTCondor cluster is one or more schedulers from which jobs are submitted into the system. The final component is one or more execute nodes which are the hosts perform the computation. A simple HTCondor template may look like:

``` ini
[cluster htcondor]

  [[node manager]]
  ImageName = cycle.image.centos7
  MachineType = Standard_A4 # 8 cores

      [[[configuration]]]
      run_list = role[central_manager]

  [[node scheduler]]
  ImageName = cycle.image.centos7
  MachineType = Standard_A4 # 8 cores

      [[[configuration]]]
      run_list = role[condor_scheduler_role],role[filer_role],role[scheduler]

  [[nodearray execute]]
  ImageName = cycle.image.centos7
  MachineType = Standard_A1 # 1 core
  Count = 1

      [[[configuration]]]
      run_list = role[usc_execute]
```

Importing and starting a cluster with definition in CycleCloud will yield a "manager" and a "scheduler" node, as well as one "execute" node. Execute nodes can be added to the cluster via the `cyclecloud add_node` command. To add 10 more execute nodes:

```azurecli-interactive
cyclecloud add_node htcondor -t execute -c 10
```

## HTCondor Autoscaling

CycleCloud supports autoscaling for HTCondor, which means that the software will monitor the status of your queue and turn on and off nodes as needed to complete the work in an optimal amount of time/cost. You can enable autoscaling for HTCondor by adding `Autoscale=true` to your cluster definition:

``` ini
[cluster htcondor]
Autoscale = True
```

## HTCondor Advanced Usage

If you know the average runtime of jobs, you can define `average_runtime` (in minutes) in your job. CycleCloud will use that to start the minimum number of nodes (for example, five 10-minute jobs will only start a single node instead of five when `average_runtime` is set to 10).

## Autoscale Nodearray
By default, HTCondor will request cores from the nodearray called 'execute'. If a job requires a different nodearray (for example if certain jobs within a workflow have a high memory requirement), you can specify a `slot_type` attribute for the job. For example, adding `+slot_type = "highmemory"` will cause HTCondor to request a node from the "highmemory" nodearray instead of "execute" (note that this currently requires `htcondor.slot_type = "highmemory"` to be set in the nodearray's `[[[configuration]]]` section). This will not affect how HTCondor schedules the jobs, so you may want to include the `slot_type` startd attribute in the job's `requirements` or `rank` expressions. For example: `Requirements = target.slot_type = "highmemory"`.

## Submitting Jobs to HTCondor

The most generic way to submit jobs to an HTCondor scheduler is the command (run from a scheduler node):

```azurecli-interactive
condor_submit my_job.submit
```

A sample submit file might look like this:

``` submit
      Universe = vanilla
      Executable = do_science
      Arguments = -v --win-prize=true
      Output = log/$(Cluster).$(Process).out
      Error = log/$(Cluster).$(Process).err
      Should_transfer_files = if_needed
      When_to_transfer_output = On_exit
      +average_runtime = 10
      +slot_type = "highmemory"
      Queue
```

## HTCondor Configuration Reference

CycleCloud supports a `standard set <autostop-attributes>` of autostop attributes for HTCondor.

The following are the HTCondor-specific configuration options you can set to customize functionality:

| HTCondor-Specific Configuration Options | Description                                                                                                                                                                                                                                                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| htcondor.agent_enabled                  | If true, use the condor_agent for job submission and polling. Default: false                                                                                                                                                                                           |
| htcondor.agent_version                  | The version of the condor_agent to use. Default: 1.27                                                                                                                                                                                                                  |
| htcondor.classad_lifetime               | The default lifetime of classads (in seconds). Default: 700                                                                                                                                                                                                            |
| htcondor.condor_owner                   | The Linux account that owns the HTCondor scaledown scripts. Default: root                                                                                                                                                                                              |
| htcondor.condor_group                   | The Linux group that owns the HTCondor scaledown scripts. Default: root                                                                                                                                                                                                |
| htcondor.data_dir                       | The directory for logs, spool directories, execute directories, and local config file. Default: /mnt/condor_data (Linux), C:\All Services\condor_local (Windows)                                                                                                       |
| htcondor.ignore_hyperthreads            | (Windows only) Set the number of CPUs to be half of the detected CPUs as a way to "disable" hyperthreading. If using autoscale, specify the non-hyperthread core count with the `Cores` configuration setting in the [[node]] or [[nodearray]] section. Default: false |
| htcondor.install_dir                    | The directory that HTCondor is installed to. Default: /opt/condor (Linux), C:\condor (Windows)                                                                                                                                                                         |
| htcondor.job_start_count                | The number of jobs a schedd will start per cycle. 0 is unlimited. Default: 20                                                                                                                                                                                          |
| htcondor.job_start_delay                | The number of seconds between each job start interval. 0 is immediate. Default: 1                                                                                                                                                                                      |
| htcondor.max_history_log                | The maximum size of the job history file in bytes. Default: 20971520                                                                                                                                                                                                   |
| htcondor.max_history_rotations          | The maximum number of job history files to keep. Default: 20                                                                                                                                                                                                           |
| htcondor.negotiator_cycle_delay         | The minimum number of seconds before a new negotiator cycle may start. Default: 20                                                                                                                                                                                     |
| htcondor.negotiator_interval            | How often (in seconds) the condor_negotiator starts a negotiation cycle. Default: 60                                                                                                                                                                                   |
| htcondor.negotiator_inform_startd       | If true, the negotiator informs the startd when it is matched to a job. Default: true                                                                                                                                                                                  |
| htcondor.remove_stopped_nodes           | If true, stopped execute nodes are removed from the CycleServer view instead of being marked as "down". Default: true                                                                                                                                                  |
| htcondor.running                        | If true, HTCondor collector and negotiator daemons run on the central manager. Otherwise, only the condor_master runs. Default: true                                                                                                                                   |
| htcondor.scheduler_dual                 | If true, schedulers run two schedds. Default: true                                                                                                                                                                                                                     |
| htcondor.single_slot                    | If true, treats the machine as a single slot (regardless of the number of cores the machine possesses). Default: false                                                                                                                                                 |
| htcondor.slot_type                      | Defines the slot_type of a node array for autoscaling. Default: execute                                                                                                                                                                                                |
| htcondor.update_interval                | The interval (in seconds) for the startd to publish an update to the collector. Default: 240                                                                                                                                                                           |
| htcondor.use_cache_config               | If true, use cache_config to have the instance poll CycleServer for configuration. Default: false                                                                                                                                                                      |
| htcondor.version                        | The version of HTCondor to install. Default: 8.2.6                                                                                                                                                                                                                     |

## HTCondor Auto-Generated Configuration File

HTCondor has large number of configuration settings, including user-defined attributes. CycleCloud offers the ability to create a custom configuration file using attributes defined in the cluster:

| Attribute                                             | Description                                                                                               |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| htcondor.custom_config.enabled | If true, a configuration file is generated using the specified attributes. Default: false                                                              |
| htcondor.custom_config.file_name | The name of the file (placed in `htcondor.data_dir`/config) to write. Default: ZZZ-custom_config.txt   |
| htcondor.custom_config.settings | The attributes to write to the custom config file such as `htcondor.custom_config.settings.max_jobs_running = 5000`|

> [!NOTE]
> HTCondor configuration attributes containing a . cannot be specified using this method. If such attributes are needed, they should be specified in a cookbook or a file installed with cluster-init.
