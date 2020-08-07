---
title: Files and directories in Azure Batch
description: Learn about files and directories and how they are used in an Azure Batch workflow from a development standpoint.
ms.topic: conceptual
ms.date: 05/12/2020

---
# Files and directories in Azure Batch

In Azure Batch, each task has a working directory under which it creates zero or more files and directories. This working directory can be used for storing the program that is run by the task, the data that it processes, and the output of the processing it performs. All files and directories of a task are owned by the task user.

The Batch service exposes a portion of the file system on a node as the *root directory*. Tasks can access the root directory by referencing the `AZ_BATCH_NODE_ROOT_DIR` environment variable. For more information about using environment variables, see [Environment settings for tasks](jobs-and-tasks.md#environment-settings-for-tasks).

The root directory contains the following directory structure:

![Compute node directory structure][media\files-and-directories\node-folder-structure.png]

- **applications**: Contains information about the details of application packages installed on the compute node. Tasks can access this directory by referencing the `AZ_BATCH_APP_PACKAGE` environment variable.

- **fsmounts**: The directory contains any file systems that are mounted on a compute node. Tasks can access this directory by referencing the `AZ_BATCH_NODE_MOUNTS_DIR` environment variable. For more information, see [Mount a virtual file system on a Batch pool](virtual-file-mount.md).

- **shared**: This directory provides read/write access to *all* tasks that run on a node. Any task that runs on the node can create, read, update, and delete files in this directory. Tasks can access this directory by referencing the `AZ_BATCH_NODE_SHARED_DIR` environment variable.

- **startup**: This directory is used by a start task as its working directory. All of the files that are downloaded to the node by the start task are stored here. The start task can create, read, update, and delete files under this directory. Tasks can access this directory by referencing the `AZ_BATCH_NODE_STARTUP_DIR` environment variable.

- **volatile**: This directory is for internal purposes. There's no guarantee that any files in this directory or that the directory itself will exist in the future.

- **workitems**: This directory contains the directories for jobs and their tasks on the compute node.

    Within the **workitems** directory, a **Tasks** directory is created for each task that runs on the node. This directory can be accessed by referencing the `AZ_BATCH_TASK_DIR` environment variable.
    
    Within each **Tasks** directory, the Batch service creates a working directory (`wd`) whose unique path is specified by the `AZ_BATCH_TASK_WORKING_DIR` environment variable. This directory provides read/write access to the task. The task can create, read, update, and delete files under this directory. This directory is retained based on the *RetentionTime* constraint that is specified for the task.

    The `stdout.txt` and `stderr.txt` files are written to the **Tasks** folder during the execution of the task.

> [!IMPORTANT]
> When a node is removed from the pool, all of the files that are stored on the node are removed.

## Next steps

- Learn about [error handling and detection](error-handling.md) in Azure Batch.