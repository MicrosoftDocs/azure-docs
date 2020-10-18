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
Understand ParallelRunStep
Tune PRS parameters
Tune nodes

> [!div class="mx-imgBorder"]
> ![Overall Architecture](media/how-to-tune-performance-of-parallel-run-step/overall-architecture.png)

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


parallel requirement estimation

run duration *
bound by storage (check metrics)

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
Logs of ParallelRunStep are stored in temporary location of local disk during the job which cost minor disk usage. Under specific circumstances where dataset is consumed in "download" mode, users have to ensure computes have enough disk space to handle mini-batch.

Disk size limit, VM size

Dataset limit link to Dataset doc

### Check Storage Metrics

## How to Choose Compute Target

For the concept of compute target, please refer to:
- [What are compute targets in Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/concept-compute-target)

For the sizes and options for Azure virtual machines, please refer to:
- [Sizes for virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/sizes)


## Best Practices of Compute Target Choice
TBC.


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