---
title: HTCondor Scheduler Integration
description: HT Condor Scheduler configurations in Azure CycleCloud
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# HTCondor

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

The following are the HTCondor-specific configuration options you can set to customize functionality:

| HTCondor-Specific Configuration Options | Description  |
| --------------------------------------- | -------------|
| htcondor.agent_enabled                  | If true, use the condor_agent for job submission and polling. Default: false     |
| htcondor.agent_version                  | The version of the condor_agent to use. Default: 1.27      |
| htcondor.classad_lifetime               | The default lifetime of classads (in seconds). Default: 700      |
| htcondor.condor_owner                   | The Linux account that owns the HTCondor scaledown scripts. Default: root   |
| htcondor.condor_group                   | The Linux group that owns the HTCondor scaledown scripts. Default: root    |
| htcondor.data_dir                       | The directory for logs, spool directories, execute directories, and local config file. Default: /mnt/condor_data (Linux), C:\All Services\condor_local (Windows)    |
| htcondor.ignore_hyperthreads            | (Windows only) Set the number of CPUs to be half of the detected CPUs as a way to "disable" hyperthreading. If using autoscale, specify the non-hyperthread core count with the `Cores` configuration setting in the [[node]] or [[nodearray]] section. Default: false |
| htcondor.install_dir                    | The directory that HTCondor is installed to. Default: /opt/condor (Linux), C:\condor (Windows)   |
| htcondor.job_start_count                | The number of jobs a schedd will start per cycle. 0 is unlimited. Default: 20    |
| htcondor.job_start_delay                | The number of seconds between each job start interval. 0 is immediate. Default: 1    |
| htcondor.max_history_log                | The maximum size of the job history file in bytes. Default: 20971520   |
| htcondor.max_history_rotations          | The maximum number of job history files to keep. Default: 20     |
| htcondor.negotiator_cycle_delay         | The minimum number of seconds before a new negotiator cycle may start. Default: 20   |
| htcondor.negotiator_interval            | How often (in seconds) the condor_negotiator starts a negotiation cycle. Default: 60   |
| htcondor.negotiator_inform_startd       | If true, the negotiator informs the startd when it is matched to a job. Default: true    |
| htcondor.remove_stopped_nodes           | If true, stopped execute nodes are removed from the CycleServer view instead of being marked as "down".  |
| htcondor.running                        | If true, HTCondor collector and negotiator daemons run on the central manager. Otherwise, only the condor_master runs. Default: true     |
| htcondor.scheduler_dual                 | If true, schedulers run two schedds. Default: true     |
| htcondor.single_slot                    | If true, treats the machine as a single slot (regardless of the number of cores the machine possesses). Default: false    |
| htcondor.slot_type                      | Defines the slot_type of a node array for autoscaling. Default: execute     |
| htcondor.update_interval                | The interval (in seconds) for the startd to publish an update to the collector. Default: 240   |
| htcondor.use_cache_config               | If true, use cache_config to have the instance poll CycleServer for configuration. Default: false   |
| htcondor.version                        | The version of HTCondor to install. Default: 8.2.6                                                                                                                                                                                                                     |

## HTCondor Auto-Generated Configuration File

HTCondor has large number of configuration settings, including user-defined attributes. CycleCloud offers the ability to create a custom configuration file using attributes defined in the cluster:

| Attribute  | Description  |
| ---------  | ------------ |
| htcondor.custom_config.enabled | If true, a configuration file is generated using the specified attributes. Default: false  |
| htcondor.custom_config.file_name | The name of the file (placed in `htcondor.data_dir`/config) to write. Default: ZZZ-custom_config.txt   |
| htcondor.custom_config.settings | The attributes to write to the custom config file such as `htcondor.custom_config.settings.max_jobs_running = 5000`|

> [!NOTE]
> HTCondor configuration attributes containing a . cannot be specified using this method. If such attributes are needed, they should be specified in a cookbook or a file installed with cluster-init.

[!INCLUDE [scheduler-integration](~/articles/cyclecloud/includes/scheduler-integration.md)]