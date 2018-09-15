---
title: Checking for Batch pool and node errors
description: Errors to check for and how to avoid when creating pools and nodes
services: batch
author: mscurrell
ms.author: markscu
ms.date: 0/20/2018
ms.topic: conceptual
---

# Checking for pool and node errors

When creating and managing Batch pools, there are operations that happen immediately and there are asynchronous operations that are not immediate, may take several minutes to complete, and run in the background.

Detecting failures for operations that take place immediately is straightforward, as any failures will be returned immediately by the API, CLI, or UI.

This article covers the background operations that can take place for pools and pool nodes, specifies how failures can be detected, and how the failures can be avoided.

## Pool errors

### Resize timeout or failure

When creating a new pool or resizing an existing pool, the target numbers of nodes is specified.  The operation will complete immediately, but the actual allocation of new nodes or removal of existing nodes takes place in the background over what may be several minutes.  A resize timeout is specified in the create or resize API - if the target number of nodes can't be obtained in the resize timeout, then the operation will stop with the pool going to a steady state and having resize errors.

A resize timeout is reported by the [ResizeError](https://docs.microsoft.com/rest/api/batchservice/pool/get#resizeerror) property, which lists one or more errors that occurred.

Common causes for resize timeouts include:
- Resize timeout is too short
  - The default timeout is 15 minutes, which is normally ample time for pool nodes to be allocated or removed.
  - When creating pools with a large number of nodes (over 1000 nodes or over 300 nodes when a custom image is used) or adding a large number of nodes to an existing pool, then a 30 minute timeout is recommended.
- Insufficient core quota
  - A batch account has a quota for the number of cores that be allocated across all pools.  Batch will not allocate nodes once that quota has been reached.  The core quota [can be increased](https://docs.microsoft.com/azure/batch/batch-quota-limit) to enable more nodes to be allocated.
- Insufficient subnet IPs when a [pool is in a virtual network](https://docs.microsoft.com/azure/batch/batch-virtual-network)
  - A virtual network subnet must have enough unassigned IP addresses to allocate to all the pool nodes being requested, otherwise the nodes cannot be created.
- Insufficient resources when a [pool is in a virtual network](https://docs.microsoft.com/azure/batch/batch-virtual-network)
  - Resources such as load-balancers, public IPs, and NSGs are created in the subscription used to create the Batch account.  The subscription quotas for these resources must be sufficient.
- Using a custom VM image for large pools
  - Large pools using custom images can take longer to allocate and resize timeouts can occur.  Limits and configuration recommendations are provided in the [specific article](https://docs.microsoft.com/azure/batch/batch-custom-images). 

### Auto-scale failures

Instead of explicitly setting the target number of nodes for a pool in pool creation or resize, the number of nodes in a pool can be scaled automatically.  An [auto-scale formula can be created for a pool](https://docs.microsoft.com/azure/batch/batch-automatic-scaling), which will be evaluated on a regular configurable interval to set the target number of nodes for the pool.  The following types of issues can occur and detected:

- The auto-scale evaluation can fail.
- The resulting resize operation can fail and timeout.
- There may be a problem with the auto-scale forumla leading to incorrect node target values, with the resize working or timing out.

Information about the last auto-scale evaluation is obtained using the [autoScaleRun](https://docs.microsoft.com/rest/api/batchservice/pool/get#autoscalerun) property, which reports on the time of the evaluation, the values and result of the evaluation, and any errors performing the evaluation.

Information about all evaluations is automatically captured by a [pool resize complete event](https://docs.microsoft.com/azure/batch/batch-pool-resize-complete-event).

### Delete

Assuming there are nodes in a pool, then a pool delete operation results in the nodes being deleted first, followed by the pool object itself.  It can take a few minutes for the pool nodes to be deleted.

The [pool state](https://docs.microsoft.com/rest/api/batchservice/pool/get#poolstate) will be set to 'deleting' during the delete process.  The calling application can detect if the pool delete is taking too long by using the 'state' and 'stateTransitionTime' properties.

## Pool compute node errors

Nodes can be successfully allocated in a pool, but various issues can lead to the nodes being unhealthy and not be usable.  Once nodes are allocated in a pool they incur charges and it is therefore important to detect problems to avoid paying for usable compute.

### Startup task failure

An optional [start task](https://docs.microsoft.com/rest/api/batchservice/pool/add#starttask) can be specified for a pool.  As with any task, a command line and resource files to download from storage can be specified.  The start task is specified for the pool, but actually run on each node - once each node has been started, then a start task is run.  A further pool property, 'waitForSuccess', specifies whether Batch should wait for the start task to complete successfully before scheduling any tasks to a node.

A start task can fail, plus if a start task fails and the start task configuration specified to wait for successful completion, then the node will be unusable, but still incur charges.

Start task failures can be detected by using the [result](https://docs.microsoft.com/rest/api/batchservice/computenode/get#taskexecutionresult) and [failureInfo](https://docs.microsoft.com/rest/api/batchservice/computenode/get#taskfailureinformation) properties of the top-level [startTaskInfo](https://docs.microsoft.com/rest/api/batchservice/computenode/get#starttaskinformation) node property.

A failed start task also leads to the node [state](https://docs.microsoft.com/rest/api/batchservice/computenode/get#computenodestate) being set to 'starttaskfailed'.

As with any task, there can be many causes for the start task failing.  To troubleshoot, the stdout, stdin, and any further task-specific log files should be checked.

### Application package download failure

One or more application packages can optionally be specified for a pool, with the specified package files being downloaded onto each node and uncompressed after the node has started, but before tasks are scheduled.  It is common to use a start task command line, in conjunction with application packages, to copy files to a different location or run setup, for example.

A failure to download and uncompress an application package will be reported by the node [errors](https://docs.microsoft.com/rest/api/batchservice/computenode/get#computenodeerror) property.  The node state will be set to 'unusable'.

### Node in unusable state

The [node state](https://docs.microsoft.com/rest/api/batchservice/computenode/get#computenodestate) can be set to 'unusable' for many reasons.  When 'unusable', tasks cannot be scheduled to the node, but the node will still incur charges.

Batch will always try to recover unusable nodes, but recovery may or may not be possible, depending on the cause.

Where the cause can be determined, it will be reported by the node [errors](https://docs.microsoft.com/rest/api/batchservice/computenode/get#computenodeerror) property.

Some other examples of causes for 'unusable' nodes:

- Invalid custom image; not prepared correctly, for example.
- Infrastructure failure or low-level upgrade leading to the underlying VM being moved; Batch will recover the node.

## Next steps

Ensure your application has implemented comprehensive error checking, especially for asynchronous operations, so that issues can be detected quickly and diagnosed.
