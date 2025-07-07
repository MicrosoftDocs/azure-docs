---
title: HTCondor Scheduler Integration
description: HT Condor Scheduler configurations in Azure CycleCloud
author: KimliW
ms.date: 06/10/2025
ms.author: adjohnso
---

# HTCondor

You can enable [HTCondor](https://htcondor.org/manual/) on a CycleCloud cluster by modifying the `run_list` in the configuration section of your cluster definition. There are three basic components of an HTCondor cluster. The first is the **central manager**, which provides the scheduling and management daemons. The second component is one or more **schedulers**, from which jobs are submitted into the system. The final component is one or more **execute nodes**, which are the hosts that perform the computation. A simple HTCondor template might look like:

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

When you import and start a cluster with this definition in CycleCloud, you get a **manager** and a **scheduler** node, and one **execute** node. You can add **execute** nodes to the cluster by using the `cyclecloud add_node` command. To add 10 more **execute** nodes, use the following command:

```azurecli-interactive
cyclecloud add_node htcondor -t execute -c 10
```

## HTCondor Autoscaling

CycleCloud supports autoscaling for HTCondor. The software monitors the status of your queue and turns on and off nodes as needed to complete the work in an optimal amount of time and cost. To enable autoscaling for HTCondor, add `Autoscale=true` to your cluster definition:

``` ini
[cluster htcondor]
Autoscale = True
```

## HTCondor Advanced Usage

If you know the average runtime of jobs, define `average_runtime` (in minutes) in your job. CycleCloud uses that value to start the minimum number of nodes. For example, if five 10-minute jobs are submitted and `average_runtime` is set to 10, CycleCloud starts only one node instead of five.

## Autoscale Nodearray

By default, HTCondor requests cores from the nodearray called `execute`. If a job requires a different nodearray (for example, if certain jobs within a workflow have a high memory requirement), specify a `slot_type` attribute for the job. For example, adding `+slot_type = "highmemory"` causes HTCondor to request a node from the `highmemory` nodearray instead of `execute` (this setting currently requires `htcondor.slot_type = "highmemory"` to be set in the nodearray's `[[[configuration]]]` section). This setting doesn't affect how HTCondor schedules the jobs, so you might want to include the `slot_type` startd attribute in the job's `requirements` or `rank` expressions. For example: `Requirements = target.slot_type = "highmemory"`.

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

The following HTCondor-specific configuration options customize functionality:

| HTCondor-Specific Configuration Options | Description  |
| --------------------------------------- | -------------|
| htcondor.agent_enabled                  | If true, use the condor_agent for job submission and polling. Default: false     |
| htcondor.agent_version                  | The version of the condor_agent to use. Default: 1.27      |
| htcondor.classad_lifetime               | The default lifetime of classads (in seconds). Default: 700      |
| htcondor.condor_owner                   | The Linux account that owns the HTCondor scaledown scripts. Default: root   |
| htcondor.condor_group                   | The Linux group that owns the HTCondor scaledown scripts. Default: root    |
| htcondor.data_dir                       | The directory for logs, spool directories, execute directories, and local config file. Default: /mnt/condor_data (Linux), C:\All Services\condor_local (Windows)    |
| htcondor.ignore_hyperthreads            | (Windows only) Set the number of CPUs to half of the detected CPUs to "disable" hyperthreading. If using autoscale, specify the non-hyperthread core count with the `Cores` configuration setting in the [[node]] or [[nodearray]] section. Default: false |
| htcondor.install_dir                    | The directory that HTCondor is installed to. Default: /opt/condor (Linux), C:\condor (Windows)   |
| htcondor.job_start_count                | The number of jobs a schedd starts per cycle. 0 is unlimited. Default: 20    |
| htcondor.job_start_delay                | The number of seconds between each job start interval. 0 is immediate. Default: 1    |
| htcondor.max_history_log                | The maximum size of the job history file in bytes. Default: 20971520   |
| htcondor.max_history_rotations          | The maximum number of job history files to keep. Default: 20     |
| htcondor.negotiator_cycle_delay         | The minimum number of seconds before a new negotiator cycle can start. Default: 20   |
| htcondor.negotiator_interval            | How often (in seconds) the condor_negotiator starts a negotiation cycle. Default: 60   |
| htcondor.negotiator_inform_startd       | If true, the negotiator informs the startd when it matches to a job. Default: true    |
| htcondor.remove_stopped_nodes           | If true, stopped execute nodes are removed from the CycleServer view instead of being marked as "down".  |
| htcondor.running                        | If true, HTCondor collector and negotiator daemons run on the central manager. Otherwise, only the condor_master runs. Default: true     |
| htcondor.scheduler_dual                 | If true, schedulers run two schedds. Default: true     |
| htcondor.single_slot                    | If true, treats the machine as a single slot (regardless of the number of cores the machine possesses). Default: false    |
| htcondor.slot_type                      | Defines the slot_type of a node array for autoscaling. Default: execute     |
| htcondor.update_interval                | The interval (in seconds) for the startd to publish an update to the collector. Default: 240   |
| htcondor.use_cache_config               | If true, use cache_config to have the instance poll CycleServer for configuration. Default: false   |
| htcondor.version                        | The version of HTCondor to install. Default: 8.2.6                                                                                                                                                                                                                     |

## HTCondor Auto-Generated Configuration File

HTCondor has a large number of configuration settings, including user-defined attributes. CycleCloud offers the ability to create a custom configuration file using attributes defined in the cluster:

| Attribute  | Description  |
| ---------  | ------------ |
| htcondor.custom_config.enabled | If true, a configuration file is generated using the specified attributes. Default: false  |
| htcondor.custom_config.file_name | The name of the file (placed in `htcondor.data_dir`/config) to write. Default: ZZZ-custom_config.txt   |
| htcondor.custom_config.settings | The attributes to write to the custom config file such as `htcondor.custom_config.settings.max_jobs_running = 5000`|

> [!NOTE]
> You can't specify HTCondor configuration attributes containing a `.` using this method. If you need such attributes, specify them in a cookbook or a file installed with `cluster-init`.

[!INCLUDE [scheduler-integration](~/articles/cyclecloud/includes/scheduler-integration.md)]
