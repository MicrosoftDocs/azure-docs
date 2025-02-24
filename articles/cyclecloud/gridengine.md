---
title: Grid Engine Scheduler Integration
description: Grid Engine scheduler configuration in Azure CycleCloud.
author: adriankjohnson
ms.date: 08/08/2021
ms.author: adjohnso
---

# CycleCloud GridEngine Cluster

::: moniker range="=cyclecloud-7"

[//]: # (Need to link to the scheduler README on Github)

[Open Grid Scheduler (Grid Engine)](http://gridscheduler.sourceforge.net/) can easily be enabled on an Azure CycleCloud cluster by modifying the "run_list" in the cluster definition. The two basic components of a Grid Engine cluster are the 'master' node which provides a shared filesystem on which the Grid Engine software runs, and the 'execute' nodes which are the hosts that mount the shared filesystem and execute the jobs submitted. For example, a simple Grid Engine cluster template snippet may look like:

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

Importing and starting a cluster with definition in CycleCloud will yield a single 'master' node. Execute nodes can be added to the cluster via the `cyclecloud add_node` command. For example, to add 10 more execute nodes:

```azurecli-interactive
cyclecloud add_node grid-engine -t execute -c 10
```

## Grid Engine Autoscaling

Azure CycleCloud supports autoscaling for Grid Engine, which means that the software will monitor the status of your queue and turn on and off nodes as needed to complete the work in an optimal amount of time/cost. You can enable autoscaling for Grid Engine by adding `Autoscale = true` to your cluster definition:

``` ini
[cluster grid-engine]
Autoscale = True
```

By default, all jobs submitted into the Grid Engine queue will run on machines of type 'execute', these are machines defined by the node array named 'execute'. You are not limited to the name 'execute', nor are you limited to a single type of machine configuration to run jobs and autoscale on.

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
    
    # Set the number of cores to the number of GPUs for autoscaling purposes
    CoreCount = 2  
    
    [[[configuration]]]
    run_list = role[sge_execute_role]
    gridengine.slot_type = gpu
    gridengine.slots = 2
```

In the above example, there are now two node arrays: One is a 'standard' execute node array, the second is named 'gpu' providing a MachineType that has two Nvidia GPU's (Standard_NV12 in Azure). Also note that there are now two new items in the configuration section besides the 'csge:sgeexec' recipe. Adding `gridengine.slot_type = gpu` tells the Grid Engine scheduler that these nodes should be named 'gpu' nodes and thus should only run 'gpu' jobs. The name 'gpu' is arbitrary, but a name that describes the node is most useful. Set `gridengine.slots = 2`, which tells the software to make sure that this type of node can only run two jobs at once (Standard_NV12 only has 2 GPUs). By default the number of slots per node in Grid Engine will be the number of CPUs on the system which, in this case, would cause too many jobs to concurrently execute on the node. In the above example, `CoreCount=2` is set on the nodearray to match the number of GPUs available on the MachineType, allowing CycleCloud to correctly scale that array on GPU vs CPU count.

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

The above configuration settings allow for advanced customization of nodes and node arrays. For example, if jobs require a specific amount of memory, say 10GB each, you can define an execute nodearray that starts machines with 60GB of memory, then add in the configuration options `gridengine.slots = 6` to ensure that only 6 jobs can concurrently run on this type of node (ensuring that each job will have at least 10GB of memory to work with).

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

If slot_type is omitted, 'execute' will be automatically assigned to the job. The mechanism that automatically assigns slot_type's to jobs can be modified by the user. A python script located at _/opt/cycle/jetpack/config/autoscale.py_ can be created which should define a single function "sge_job_handler". This function receives a dictionary representation of the job, similar to the output of a `qstat -j JOB_ID` command and should return a dictionary of hard resources that need to be updated for the job. As an example, below is a script which will assign a job to the 'gpu' slot_type if the jobs name contains the letters 'gpu'. This would allow a user to submit their jobs from an automated system without having to modify the job parameters and still have the jobs run on and autoscale the correct nodes:

``` python
#!/usr/env python
#
# File: /opt/cycle/jetpack/config/autoscale.py
#
def sge_job_handler(job):
  # The 'job' parameter is a dictionary containing the data present in a 'qstat -j JOB_ID':
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

The parameter 'job' passed in is a dictionary that contains the data in a `qstat -j JOB_ID` call:

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

You can use this scripting functionality to automatically assign slot_type's based on any parameter defined in the job such as arguments, other resource requirements like memory, submitting user, etc.

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
| ---------------------------------- | ----------- |
| gridengine.slots                   | The number of slots for a given node to report to Grid Engine. The number of slots is the number of concurrent jobs a node can execute, this value defaults to the number of CPUs on a given machine. You can override this value in cases where you don't run jobs based on CPU but on memory, GPUs, etc.   |
| gridengine.slot_type               | The name of type of 'slot' a node provides. The default is 'execute'. When a job is tagged with the hard resource 'slot_type=', that job will *only* run on a machine of the same slot type. This allows you to create different software and hardware configurations per node and ensure an appropriate job is always scheduled on the correct type of node.  |
| gridengine.ignore_fqdn             | Default: true. Set to false if all the nodes in your cluster are not part of a single DNS domain. |
| gridengine.version                 | Default: '2011.11'. This is the Grid Engine version to install and run. This is currently the default and *only* option. In the future additional versions of the Grid Engine software may be supported. |
| gridengine.root                    | Default: '/sched/sge/sge-2011.11' This is where the Grid Engine will be installed and mounted on every node in the system. It is recommended this value not be changed, but if it is it should be set to the same value on **every** node in the cluster.   |

[!INCLUDE [scheduler-integration](~/articles/cyclecloud/includes/scheduler-integration.md)]

## Known Issues

* `qsh` command for interactive session does not work. Use `qrsh` as an alternative.
* The `exclusive=1` complex is not respected by autoscale. Fewer nodes than expected may start as a result.

> [!NOTE]
> Even though Windows is an officially supported GridEngine platform, CycleCloud does not support running GridEngine on Windows at this time.
::: moniker-end

::: moniker range="=cyclecloud-8"

This page concerns capabilities and configuration of using (Altair) GridEngine with CycleCloud.

## Configuring Resources
The cyclecloud-gridengine application matches sge resources to azure cloud resources 
to provide rich autoscaling and cluster configuration tools. The application will be deployed
automatically for clusters created via the CycleCloud UI or it can be installed on any 
gridengine admin host on an existing cluster.

### Installing or Upgrading cyclecloud-gridengine

The cyclecloud-gridengine bundle is available in [github](https://github.com/Azure/cyclecloud-gridengine/releases) 
as a release artifact. Installing and upgrading will be the same process. 
The application requires python3 with virtualenv.

```bash
tar xzf cyclecloud-gridengine-pkg-*.tar.gz
cd cyclecloud-gridengine
./install.sh
```

### Important Files

The application parses the sge configuration each time it's called - jobs, queues, complexes.
Information is provided in the stderr and stdout of the command as well as to a log file, both
at configurable levels. All gridengine management commands with arguments are logged to file as well.

| Description  |  Location |
|---|---|
| Autoscale Config  | /opt/cycle/gridengine/autoscale.json  |
| Autoscale Log  | /opt/cycle/jetpack/logs/autoscale.log  |
| qconf trace log  | /opt/cycle/jetpack/logs/qcmd.log  |

### SGE queues, hostgroups and parallel environments

The cyclecloud-gridengine autoscale utility, `azge`, will add hosts to the cluster according
to the cluster configuration. The autoscaling operations perform the following actions.

1. Read the job resource request and find an appropriate VM to start
1. Start the VM and wait for it to be ready
1. Read the queue and parallel environment from the job
1. Based on the queue/pe assign the host to an appropriate hostgroup
1. Add the host to the cluster as well as to any other queue containing the hostgroup

Consider the following queue definition for a queue named _short.q_

```ini
hostlist              @allhosts @mpihg01 @mpihg02 @lowprio 
...
seq_no                10000,[@lowprio=10],[@mpihg01=100],[@mpihg02=200]
pe_list               NONE,[@mpihg01=mpi01], \
                      [@mpihg02=mpi02]
```

Submitting a job by `qsub -q short.q -pe mpi02 12 my-script.sh` will start at lease one VM,
and when it's added to the cluster, it will join hostgroup _@mpihg02_ because that's the hostgroup
both available to the queue and to the parallel environment. It will also be added to _@allhosts_, which
is a special hostgroup.

Without specifying a pe, `qsub -q short.q my-script.sh` the resulting VM will be added to _@allhosts_ 
and _@lowpriority_ these are the hostgroups in the queue which aren't assigned pes.

Finally, a job submitted with `qsub -q short.q -pe mpi0* 12 my-script.sh` will result in a VM added to
either _@mpihg01_ or _@mpihg02_ depending on CycleCloud allocation predictions.

Parallel environments implicitly equate to cyclecloud placement group. VMs in a PE are constrained to
be within the same network. If you wish to use a PE that doesn't keep a placement group then use the
_autoscale.json_ to opt out.

Here we opt out of placement groups for the _make_ pe:

```json
"gridengine": {
    "pes": {
      "make": {
        "requires_placement_groups": false
      }
    },
```

### CycleCloud Placement Groups
CycleCloud placement groups map one-to-one to Azure VMSS with SinglePlacementGroup - VMs in a placementgroup
share an Infiniband Fabric and share only with VMs within the placement group. 
To intuitively preserve these silos, the placementgroups map 1:1 with gridengine parallel environment 
as well.

Specifying a parallel environment for a job will restrict the job to run in a placement group via smart 
hostgroup assignment logic. You can opt out of this behavior with the aforementioned configuration in 
_autoscale.json_ : `"required_placement_groups" : false`.

### Autoscale config

This plugin will automatically scale the grid to meet the demands of the workload. 
The _autoscale.json_ config file determines the behavior of the Grid Engine autoscaler.

* Set the cyclecloud connection details
* Set the termination timer for idle nodes
* Multi-dimensional autoscaling is possible, set which attributes to use in the job packing e.g. slots, memory
* Register the queues, parallel environments and hostgroups to be managed


| Configuration | Type  | Description  |
|---|---|---|
| url  | String  | CC URL  |
| username/password  | String  | CC Connection Details  |
| cluster_name  | String  | CC Cluster Name  |
| default_resources  | Map  | Link a node resource to a Grid Engine host resource for autoscale  |
| idle_timeout  | Int  | Wait time before terminating idle nodes (s)  |
| boot_timeout  | Int  | Wait time before terminating nodes during long configuration phases (s)  |
| gridengine.relevant_complexes  | List (String)  | Grid engine complexes to consider in autoscaling e.g. slots, mem_free  |
| gridengine.logging | File | Location of logging config file |
| gridengine.pes | Struct | Specify behavior of PEs, e.g. _requires\_placement\_group = false_ |

The autoscaling program will only consider *Relevant Resource*

### Additional autoscaling resource

By default, the cluster with scale based on how many slots are
requested by the jobs. We can add another dimension to autoscaling. 

Let's say we want to autoscale by the job resource request for `m_mem_free`.

1. Add `m_mem_free` to the `gridengine.relevant_resources` in _autoscale.json_
2. Link `m_mem_free` to the node-level memory resource in _autoscale.json_

These attributes can be references with `node.*` as the _value_ in _default/_resources_.

| Node  | Type  | Description  |
|---|---|---|
nodearray | String | Name of the cyclecloud nodearray
placement_group |  String | Name of the cyclecloud placement group within a nodearray
vm_size | String | VM product name, e.g. "Standard_F2s_v2"
vcpu_count | Int | Virtual CPUs available on the node as indicated on individual product pages
pcpu_count | Int | Physical CPUs available on the node
memory | String | Approximate physical memory available in the VM with unit indicator, e.g. "8.0g"

Additional attributes are in the `node.resources.*` namespace, e.g. `node.resources.

| Node  | Type  | Description  |
|---|---|---|
ncpus | String | Number of CPUs available in in the VM 
pcpus |  String | Number of physical CPUs available in the VM
ngpus | Integer | Number of GPUs available in the VM
memb  | String | Approximate physical memory available in the VM with unit indicator, e.g. "8.0b"
memkb | String | Approximate physical memory available in the VM with unit indicator, e.g. "8.0k"
memmb | String | Approximate physical memory available in the VM with unit indicator, e.g. "8.0m"
memgb | String | Approximate physical memory available in the VM with unit indicator, e.g. "8.0g"
memtb | String | Approximate physical memory available in the VM with unit indicator, e.g. "8.0t"
slots | Integer | Same as ncpus
slot_type | String | Addition label for extensions. Not generally used.
m_mem_free | String | Expected free memory on the execution host, e.g. "3.0g"
mfree | String | Same as _m/_mem/_free_

### Resource Mapping

There are also maths available to the default_resources - reduce the slots on a particular node array by two and add the docker resource to all nodes:

```json
    "default_resources": [
    {
      "select": {"node.nodearray": "beegfs"},
      "name": "slots",
      "value": "node.vcpu_count",
      "subtract": 2
    },
    {
      "select": {},
      "name": "docker",
      "value": true
    },
```

Mapping the node vCPUs to the slots complex, and `memmb` to `mem_free` are commonly used defaults.
The first association is required.

```json
    "default_resources": [
    {
      "select": {},
      "name": "slots",
      "value": "node.vcpu_count"
    },
    {
      "select": {},
      "name": "mem_free",
      "value": "node.resources.memmb"
    }
 ],
```

Note that if a complex has a shortcut not equal to the entire value, then define both in _default\_resources_
where `physical_cpu` is the complex name:

```json
"default_resources": [
    {
      "select": {},
      "name": "physical_cpu",
      "value": "node.pcpu_count"
    },
    {
      "select": {},
      "name": "pcpu",
      "value": "node.resources.physical_cpu"
    }
]
```

Ordering is important when you want a particular behavior for a specific attribute. To allocate a single slot
for a specific nodearray while retaining default slot count for all other nodearrays:

```json
    "default_resources": [
    {
      "select": {"node.nodearray": "FPGA"},
      "name": "slots",
      "value": "1",
    },
    {
      "select": {},
      "name": "slots",
      "value": "node.vcpu_count"
    },
]
```

## Hostgroups

The CycleCloud autoscaler, in attempting to satisfy job requirements, will map nodes to
the appropriate hostgroup. Queues, parallel environments and complexes are all considered.
Much of the logic is matching the appropriate cyclecloud bucket (and node quantity) with
the appropriate sge hostgroup. 

For a job submitted as:
`qsub -q "cloud.q" -l "m_mem_free=4g" -pe "mpi*" 48 ./myjob.sh`

CycleCloud will find get the intersection of hostgroups which:

1. Are included in the _pe\_list_ for _cloud.q_ and match the pe name, e.g. `pe_list [@allhosts=mpislots],[@hpc1=mpi]`.
1. Have adequate resources and subscription quota to provide all job resources.
1. Are not filtered by the hostgroup constraints configuration.

It's possible that multiple hostgroups will meet these requirements, in which case
the logic will need to choose. There are three ways to resolve ambiguities in hostgroup
membership:

1. Configure the queues so that there aren't ambiguities. 
1. Add constraints to _autoscale.json_.
1. Let CycleCloud choose amoungst the matching hostgroups in a name-ordered fashion by adjusting `weight_queue_host_sort < weight_queue_seqno` in the scheduler configuration.
1. Set `seq_no 10000,[@hostgroup1=100],[@hostgroup2=200]` in the queue configuration to indicate a hostgroup preference.

### Hostgroup constraints

When multiple hostgroups are defined by a queue or xproject then all these hostgroups can potentially have
the hosts added to them. You can limit what kinds of hosts can be added to which queues by setting hostgroup
constraints. Set a constraint based on the node properties. 

```json
"gridengine": {
    "hostgroups": {
      "@mpi": {
        "constraints": {
          "node.vm_size": "Standard_H44rs"
        }
      },
      "@amd-mem": {
        "constraints" : { 
            "node.vm_size": "Standard_D2_v3",
            "node.nodearray": "hpc" 
            }
        },
    }
  }
  ```

> HINT:
> Inspect all the available node properties by `azge buckets`.

## azge
This package comes with a command-line, _azge_. This program should be used
to perform autoscaling and has broken out all the subprocesses under autoscale.
These commands rely on the gridengine environment variables to be set - you must be
able to call `qconf` and `qsub` from the same profile where `azge` is called.

| _azge_ commands  | Description  |
|---|---|
| validate | Checks for known configuration errors in the autoscaler or gridengine 
| jobs | Shows all jobs in the queue 
| buckets | Shows available resource pools for autoscaling 
| nodes | Shows cluster hosts and properties 
| demand | Matches job requirements to cyclecloud buckets and provides autoscale result 
| autoscale | Does full autoscale, starting and removing nodes according to configurations 

When modifying scheduler configurations (_qconf_) or autoscale configurations (_autoscale.json_), 
or even setting up for the first time, _azge_ can be used to check autoscale behavior is matching
expections. As root, you can run the following operations. It's advisable to get familiar with these
to understand the autoscale behavior.

1. Run `azge validate` to verify configurations for known issues.
1. Run `azge buckets` to examine what resources your CycleCloud cluster is offering.
1. Run `azge jobs` to inspect the queued job details.
1. Run `azge demand` perform the job to bucket matching, examine which jobs get matched to which buckets and hostgroups.
1. Run `azge autoscale` to kickoff the node allocation process, or add nodes which are ready to join.

Then, when these commands are behaving as expected, enable ongoing autoscale by adding the `azge autoscale`
command to the root crontab. (Souce the gridengine environment variables)

```cron
* * * * * . $SGE_ROOT/common/settings.sh && /usr/local/bin/azge autoscale -c /opt/cycle/gridengine/autoscale.json
```

## Creating a hybrid cluster

CycleCloud will support the scenario of bursting to the cloud. The base configuration assumes that the `$SGE_ROOT`
directory is available to the cloud nodes. This assumption can be relaxed by setting `gridengine.shared.spool = false`, 
`gridengine.shared.bin = false` and installing GridEngine locally.
For a simple case, you should provide a filesystem that can be mounted by the execute nodes which contains the `$SGE_ROOT` directory
and configure that mount in the optional settings. When the dependency of the sched and shared directories are released, you 
can shut down the scheduler node that is part of the cluster by-default and use the configurations 
from the external filesystem.

1. Create a new gridengine cluster.
1. Disable return proxy.
1. Replace _/sched_ and _/shared_ with external filesystems.
1. Save the cluster.
1. Remove the scheduler node as an action in the UI.
1. Start the cluster, no nodes will start initially.
1. Configure `cyclecloud-gridengine` with _autoscale.json_ to use the new cluster

## Using Univa Grid Engine in CycleCloud

CycleCloud project for GridEngine uses _sge-2011.11_ by default. You may use your own
[Altair GridEngine](https://www.altair.com/grid-engine/) installers according to your Altair license agreement.  
This section documents how to use Altair GridEngine with the CycleCloud GridEngine project.

### Prerequisites

This example will use the 8.6.1-demo version, but all ge versions > 8.4.0 are supported.

1. Users must provide UGE binaries

  * ge-8.6.x-bin-lx-amd64.tar.gz
  * ge-8.6.x-common.tar.gz

2. The CycleCloud CLI must be configured. Documentation is available [here](~/articles/cyclecloud/how-to/install-cyclecloud-cli.md) 

### Copy the binaries into the cloud locker

A complementary version of AGE (8.6.7-demo) is distributed with CycleCloud. To use another version upload the
binaries to the storage account that CycleCloud uses.

```bash

$ azcopy cp ge-8.6.12-bin-lx-amd64.tar.gz https://<storage-account-name>.blob.core.windows.net/cyclecloud/gridengine/blobs/
$ azcopy cp ge-8.6.12-common.tar.gz https://<storage-account-name>.blob.core.windows.net/cyclecloud/gridengine/blobs/
```

### Modifying configs to the cluster template

Make a local copy of the gridengine template and modify it to use the UGE installers instead of the default.

```bash
wget https://raw.githubusercontent.com/Azure/cyclecloud-gridengine/master/templates/gridengine.txt
```

In the _gridengine.txt_ file, locate the first occurrence of `[[[configuration]]]` and insert text such that it matches the snippet below.  This file is not sensitive to indentation.

> NOTE:
> The details in the configuration, particularly version, should match the installer file name.

```ini
[[[configuration gridengine]]]
    make = ge
    version = 8.6.12-demo
    root = /sched/ge/ge-8.6.12-demo
    cell = "default"
    sge_qmaster_port = "537"
    sge_execd_port = "538"
    sge_cluster_name = "grid1"
    gid_range = "20000-20100"
    qmaster_spool_dir = "/sched/ge/ge-8.6.12-demo/default/spool/qmaster" 
    execd_spool_dir = "/sched/ge/ge-8.6.12-demo/default/spool"
    spooling_method = "berkeleydb"
    shadow_host = ""
    admin_mail = ""
    idle_timeout = 300

    managed_fs = true
    shared.bin = true

    ignore_fqdn = true
    group.name = "sgeadmin"
    group.gid = 536
    user.name = "sgeadmin"
    user.uid = 536
    user.gid = 536
    user.description = "SGE admin user"
    user.home = "/shared/home/sgeadmin"
    user.shell = "/bin/bash"

```

These configs will override the default gridengine version and installation location when the cluster starts.
It is not safe to move off of the `/sched` as it's a specifically shared nfs location in the cluster.
::: moniker-end
