---
title: ParallelRunStep Performance Tuning Guide
titleSuffix: Azure Machine Learning
description: This guide describes how to optimize ParallelRunStep pipeline run.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: troubleshooting
ms.reviewer: jmartens, larryfr, vaidyas, laobri, tracych
ms.author: bi
author: bi
ms.date: 09/15/2020
---

# ParallelRunStep Performance Tuning Guide
This guide helps users to measure and tune parameters in term of performance when using ParallelRunStep. It includes how to:
1. Select virtual machine. Decide virtual machine type, priority and size.
1. Choose node count and the number of worker processes per node.
1. Choose mini batch size.
1. Check performance metrics.

>[!NOTE]
>Note that we're continuously improving log and metrics. The content here may not match the actual prod exactly at a given time. We'll align them with on-going releases.

# Select Virtual Machine
1. Choose CPU or GPU virtual machine.
1. Choose virtual machine size based on your rough estimation of cores, RAM, local storage, cost requirements. This is a **rough estimation** and you can change to new cluster based on your tuning result.
1. Choose Dedicated or Low priority. For dev purpose, you can always use a few Dedicated virtual machines to ensure you can have a quick response.
1. Minimum number of nodes that you want to provision. If you want a dedicated number of nodes, set that count here. For dev purpose, you can set this to the number to keep node in provisioned state to save the time of provision when running a job.

> [!div class="mx-imgBorder"]
> ![New Compute Cluster](media/how-to-tune-performance-of-parallel-run-step/new-compute-cluster.png)

# Choose node_count and process_count_per_node
The max number of worker processes running in parallel is `node_count * process_count_per_node`.
In dev phase, you have tested out the duration per mini batch
`node_count * process_count_per_node = total mini batches / duration per mini batch`


# Choose mini batch size

Pipeline lifecycle
1. provision nodes. before ParallelTask, a run will start after all required nodes provisioned.
1. build image. This is required for the first time of a run and then it will be cached. **Link to the cache doc**
1. job preparation.
1. start PRS launcher on the master node and then give control to PRS.
1. a master role start task scheduling. scheduling logs to `logs/sys/master_role....`.
1. while scheduling tasks, an agent manager on each node start worker process up to the number specified by `process_count_per_node`.
1. each worker process calls init(), then picks mini batch up and call run() by passing the mini batch and turn control to user code. meanwhile, the agent manager monitors the progress of a worker process.
1. the master role collect the progress.
1. the master role concatenate the temp files.

# Check performance metrics

## Progress overview
The file is `logs/job_progress_overview.yyyymmddhh.txt`. It is `logs/overview.txt` in old versions.
It has scheduling progress, mini batch processing progress and file concatenating progress for append_row. It provides a user readable text as the job is running.

## Mini batch scheduling performance

### The duration to create the first task
This matters for if there is a folder with a large number of files, it will take time to load the list and then pick up the first set of files. For example, given a folder with 1m files in blob in the same region as the run, it will take about 5 minutes to pick up the first one. If the folder is in other region than the run, it will take much longer time.

To reduce the waiting time, we suggest to keep a single folder up to 1m files.
If you want to have more files to process, for example, 20m files. You can create 20 folders with each has 1m files. Then pass 20 inputs like:
```python
step = ParallelRunStep(
    ...
    inputs=[input0, input1, input2, ..., input19]
    ...
)
```
In this way, it will pick up files from one folder and then move to next. It won't list a single folder will 20m files.
To reduce the costing of progress tracking, increase mini_batch_size, such as to 100 or 1000. If 1000 is used, there will be total of 200k mini batches.


Check `logs/sys/master_role.*.txt`. Usually, this is in the first `master_role` file if there are more than one. One round of master role failover will create a `master_role` log file.
```html
2020-10-09 01:38:51,269|INFO|356|140501711763200|Start scheduling.
2020-10-09 01:38:51,288|INFO|356|140501711763200|The task provider type is FileDatasetProvider.
2020-10-09 01:38:51,830|INFO|356|140501711763200|Input folders ['/mnt/batch/tasks/shared/LS_root/jobs/[workspace]/azureml/e01a2bf3-8fa7-4231-a904-3eeba3345e97/mounts/stress_data_datastore_small_files/input_1m'], from index 0.
2020-10-09 01:38:51,830|INFO|356|140501711763200|Scheduling tasks for input 0: /mnt/batch/tasks/shared/LS_root/jobs/[workspace]/azureml/e01a2bf3-8fa7-4231-a904-3eeba3345e97/mounts/stress_data_datastore_small_files/input_1m.
[There are five minute between next line and prior line.]
2020-10-09 01:43:13,674|INFO|356|140501711763200|Save checkpoint for folder 0, offset 0, task_id 0, total_items 1, finished=False.
2020-10-09 01:43:16,124|INFO|356|140501711763200|10.0.0.6: setting job stage to FIRST_TASK_SCHEDULED, reason: The first task created at 2020-10-09 01:43:16.124027.
2020-10-09 01:43:16,124|INFO|356|140501711763200|Setting job stage to FIRST_TASK_SCHEDULED.
```

[TBD for tabular dataset]

## Mini batch processing metrics

### logs/job_

## Duration of Entry Script Functions



## Introduction to Performance Report
The performance report is located in `logs/sys/perf/`. It consists of resource usage reports in several dimensions. All reports are grouped by node. Under folder of each node, the below files are included:

- `node_resource_usage.csv`: This file provides an overview of resource usage of a node.
- `node_disk_usage.csv`: This file provides detailed disk usage of a node.
- `processes_resource_usage.csv`: This file provides an overview of resource usage of each worker process in a node.


## Understanding ParallelRunStep Resource Requirements

### CPU and Memory
The internal scripts of ParallelRunStep requires minor CPU and memory. In common, users only need to take care of CPU and memory usage of their own scripts.

### Network
ParallelRunStep requires a lot of network I/O operation to support dataset processing, mini-batch scheduling and processing. Bandwidth and latency are the primary concerns of network.

### Disk
Logs of ParallelRunStep are stored in temporary location of local disk which cost minor disk usage.
Under specific circumstances where dataset is consumed in "download" mode, users have to ensure computes have enough disk space to handle mini-batch. For example, there is a job where the size of each mini-match is 500 MB and the process_count_per_node is 4. If this job is running on Windows compute, where ParallelRunStep will cache each mini-batch to local disk by default, the minimum disk space should be 2000 MB.

Disk size limit, VM size

Dataset limit link to Dataset doc

### Storage Metrics
1. View all properties of your workspace.
1. Click the storage link on the right pane.
1. Click Metrics or Metrics (classic) on the left.
1. Add the metrics you want to observe.

> [!div class="mx-imgBorder"]
> ![Storage Metrics](media/how-to-tune-performance-of-parallel-run-step/storage-metrics.png)

### Check Storage Metrics

## How to Choose Compute Target

For the concept of compute target, please refer to:
- [What are compute targets in Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/concept-compute-target)

For the sizes and options for Azure virtual machines, please refer to:
- [Sizes for virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/sizes)


## How To Choose Mini-batch Size
Mini-batch size is passed to a single run() call in entry script. To investigate the performance of mini-batch processing, a detailed log can be found in `logs/sys/job_report/processed_mini-batch.csv`. There are three metrics which are helpful:
- Elapsed Seconds: The total duration of mini-batch processing.
- Process Seconds: The CPU time of mini-batch processing. This metric indicates the busyness of CPU.
- Run Method Seconds: The duration of run() in entry script.

## How To Choose Node Count
Node count determines the number of compute nodes to be used for running the user script. It should not exceed the maximum number of nodes of compute target.
In general, more node counts can provide better parallelism and save more job running time. The number of mini-batches processed by each node can be found in `logs/sys/job_report/node_summary.csv`. If the report shows mini-batches allocation skews a lot among all nodes, a possible explanation is that the compute resource is more than sufficient for current job. User can consider reducing node count to save budget.


## How to Choose Process Count Per Node
The best practice is to set it to the core number of GPU or CPU on one node. If too many processes are used, the synchronization overhead will increase and will not save overall runtime.

## How to Do Profiling
You can set the argument ```profiling_module``` to enable profiling.
The accepted values are:
1. Not specified, default value. Don't do profiling.
2. cProfile
3. profile
The generated profile file will be saved in logs/sys/.

Check [The Python Profilers](https://docs.python.org/3/library/profile.html#the-python-profilers) for more details.

You can download them and inspect with viewers, such as [profile-viewer](https://pypi.org/project/profile-viewer/). Here is a sample:
![Profile Viewer](media/how-to-tune-performance-of-parallel-run-step/profile-viewer.png)


## FAQ on Performance Issues
Performance degradation
Understand ParallelRunStep flow
1. scheduling
1. processing
1. agent manager
1. entry script init(), run(), shutdown()
1.
1.
1.

Limits
100 nodes,
1m folder per folder
1m mini batches
1000 files in one mini batch, 64K limit


ParallelTask
1000 nodes, 65536?

Understand ParallelRunStep
Tune PRS parameters
Tune nodes

> [!div class="mx-imgBorder"]
> ![Overall Architecture](media/how-to-tune-performance-of-parallel-run-step/overall-architecture.png)