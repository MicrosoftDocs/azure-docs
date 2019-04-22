---
title: Azure CycleCloud Submit Once Command List | Microsoft Docs
description: Commands you can use with Azure CycleCloud's Submit Once tool.
author: KimliW
ms.technology: submitonce
ms.date: 08/01/2018
ms.author: adjohnso
---

# Submit Once Commands

Below is a listing of available commands. Note that most of the Grid Engine specific commands (csub, cstat, etc.) take the same arguments and output the same information as their Grid Engine counterparts, but there are some important differences as highlighted below.

## `cacct`

Behaves like the Grid Engine "qacct", but takes the following additional arguments:

| Argument         | Description                                |
| ---------------- | ------------------------------------------ |
| -c [clustername] | Only display output for the given cluster. |

## `cdel`

Like Grid Engine's "qdel", with these additional arguments:

| Argument              | Description                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| -c [clustername]      | Only delete jobs from the given cluster (required when deleting jobs by jobid or taskid.                                          |
| -cid [submission_id]  | Delete all jobs with the given CycleSubmissionId (this value is unique even across clusters – see csub command for more details). |

## `chost`

Like Grid Engine's "qhost", with these additional arguments:

| Argument         | Description                                |
| ---------------- | ------------------------------------------ |
| -c [clustername] | Only display output for the given cluster. |


## `cstat`

Like Grid Engine's "qstat", with these additional arguments:


| Argument              | Description                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| -c [clustername]      | Only delete jobs from the given cluster (required when deleting jobs by jobid or taskid.                                          |
| -cid [submission_id]  | Only display output or the given CycleSubmissionID |

## `csub`

csub can be used to submit like Grid Engine's "qsub", with these additional arguments:

| Argument                        | Description                                                                |
| ------------------------------- | -------------------------------------------------------------------------- |
| c | -cluster [cluster_name]     | Submit directly to the given cluster.                                      |
| -ac applications=[app1,app2,..] | Only submit to clusters with all applications in the comma-separated list. |

## `croute`

Takes the same arguments as `csub`, but can be used to determine what cluster(s) a job will run on without performing an actual submission. Outputs the result of the routing decision.

## `initialize`

Initializes the SubmitOnce CLI by configuring ~/.cycle/config.ini automatically and running the setup_clusters_ command.

If no clusters have been configured for SubmitOnce the user will be prompted to add their home cluster.

## add_cluster CLUSTER_NAME

Configures a cluster with name `CLUSTER_NAME` for use as a SubmitOnce target cluster.

The `add_cluster` command requires access to the SubmitOnce functional user account's
(cycle_server's) private key or the path to the functional user's private key on the CycleServer
host.

## setup_clusters

Tests SSH connectivity to each cluster in your environment and assists in setting up any clusters that fail this test (by prompting for an SSH key and/or password).

## show_jobs

Shows a scheduler-agnostic listing of jobs, including submission ids and the scheduler's job id.

# Examples

Below you will find various examples of using the SubmitOnce Grid Engine tools to submit, view and manage jobs. In these examples, there are two clusters, one named "internal" which simulates your local Grid Engine cluster and a second named "external" that simulates a remote cluster that you want to be able to take advantage of.  Think of the "internal" cluster as your own physical datacenter and that the "external" cluster as a larger remote HPC environment (such as one of your remote datacenters or a CycleCloud cluster). Both clusters use a shared filesystem for home directories, any job submission will be from subdirectories of $HOME.

The following diagram shows the clusters used in the example.

![Example Cluster Diagram](~/images/example_cluster_diagram.png)

## Example #1: Simple Job Submission

First let's try submitting a simple sleep job. On a node in the internal cluster, run the following commands:

```azurecli-interactive
$ mkdir -p ~/sleep
$ cd ~/sleep
$ touch sleep.sh
```

The contents of sleep.sh should be:

``` script
#!/bin/bash
#$ -N sleep

# Sleep for 5 minutes
/bin/sleep 300
```

To submit the sleep job, execute the csub command:

```azurecli-interactive
$ csub sleep.sh
Submission ID: 116
Your job 11 ("sleep") has been submitted
```

You may view the status of your job using either the SubmitOnce submission ID or the regular Grid Engine job number:

    $ cstat -cid 116
    internal > ==============================================================
    internal > job_number:                 11
    internal > exec_file:                  job_scripts/11
    internal > submission_time:            Wed Apr 24 19:27:48 2013
    internal > owner:                      cluster.user
    ...

    $ cstat -j 11
    internal > ==============================================================
    internal > job_number:                 11
    internal > exec_file:                  job_scripts/11
    internal > submission_time:            Wed Apr 24 19:27:48 2013
    internal > owner:                      cluster.user
    ...

Note that in either case, the output is prefixed by the cluster name (internal in this case).

## Example #2: Using croute

If you want to know where your jobs will land before running csub, use the croute command:

```azurecli-interactive
# This job will go to the "internal" cluster
$ croute sleep.sh
internal
```

Because this is only a single job, and there are 2 execute nodes (1 free slot each) in the internal cluster, that's where it will run. All things being equal, jobs will prefer to run locally due to the lack of file transfer time. Try submitting a task array of 100 and you'll see a different result:

```azurecli-interactive
$ croute -t 1-100 sleep.sh
external
```

Because there are twice the number of free slots on the external cluster and there aren't enough slots to run the job locally, this job will run externally.

Lastly, if you want to force the task array to run locally anyway, you can use the "-c targetcluster" option:

```azurecli-interactive
$ croute -t 1-100 -c "internal" sleep.sh
internal
```

## Example #3: Deleting Jobs

Using cdel, you can delete jobs across clusters without worrying about overlapping job ids. Let's submit a new task array then delete it:

```azurecli-interactive
$ csub -t 1-4 sleep.sh
Submission ID: 353
Your job-array 8.1-4:1 ("sleep") has been submitted
```

The first line of output gives the SubmitOnce submission ID, which you can use to delete jobs across clusters:

```azurecli-interactive
$ cdel -cid 353
external > cluster.user has registered the job-array task 8.1 for deletion
external > cluster.user has registered the job-array task 8.2 for deletion
external > cluster.user has registered the job-array task 8.3 for deletion
external > cluster.user has registered the job-array task 8.4 for deletion
```

Alternatively, you can delete the jobs by their Grid Engine job numbers using the -c flag to specify the cluster to delete from:

```azurecli-interactive
$ cdel -c external -j 8
external > cluster.user has registered the job-array task 8.1 for deletion
external > cluster.user has registered the job-array task 8.2 for deletion
external > cluster.user has registered the job-array task 8.3 for deletion
external > cluster.user has registered the job-array task 8.4 for deletion
```
