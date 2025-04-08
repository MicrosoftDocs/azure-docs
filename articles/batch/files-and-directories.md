---
title: Files and directories in Azure Batch
description: Learn about files and directories and how they are used in an Azure Batch workflow from a development standpoint.
ms.topic: conceptual
ms.date: 06/13/2024
---
# Files and directories in Azure Batch

In Azure Batch, each task has a working directory under which it can create files and directories. This working directory can be used for storing the program that is run by the task, the data that it processes, and the output of the processing it performs. All files and directories of a task are owned by the task user.

The Batch service exposes a portion of the file system on a node as the *root directory*. This root directory is located on the temporary storage drive of the VM, not directly on the OS drive.

Tasks can access the root directory by referencing the `AZ_BATCH_NODE_ROOT_DIR` environment variable. For more information about using environment variables, see [Environment settings for tasks](jobs-and-tasks.md#environment-settings-for-tasks).

## Root directory structure

The root directory contains the following directory structure:

![Screenshot of the compute node directory structure.](media\files-and-directories\node-folder-structure.png)

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

## Batch task related files and directories location

Numbers of compute node environment variables' value will be determined by the VM size and the presence of a local temporary disk.

### AZ_BATCH_NODE_ROOT_DIR

|Local Temporary Disk Present|Operating System Type|`AZ_BATCH_NODE_ROOT_DIR` Value|
|:---|:---|:---|
|No|Linux|`/opt/batch/data`|
|Yes|Linux|`/mnt/batch` or `/mnt/resource/batch`|
|No|Windows|`C:\batch\data`|
|Yes|Windows|`D:\batch`|


### AZ_BATCH_NODE_STARTUP_DIR

|Local Temporary Disk Present|Operating System Type|`AZ_BATCH_NODE_STARTUP_DIR` Value|
|:---|:---|:---|
|No|Linux|`/opt/batch/data/startup`|
|Yes|Linux|`/mnt/batch/startup` or `/mnt/resource/batch/startup`|
|No|Windows|`C:\batch\data\startup`|
|Yes|Windows|`D:\batch\startup`|


### AZ_BATCH_NODE_SHARED_DIR

|Local Temporary Disk Present|Operating System Type|`AZ_BATCH_NODE_SHARED_DIR` Value|
|:---|:---|:---|
|No|Linux|`/opt/batch/data/shared`|
|Yes|Linux|`/mnt/batch/shared` or `/mnt/resource/batch/shared`|
|No|Windows|`C:\batch\data\shared`|
|Yes|Windows|`D:\batch\shared`|


### AZ_BATCH_NODE_MOUNTS_DIR

|Local Temporary Disk Present|Operating System Type|`AZ_BATCH_NODE_MOUNTS_DIR` Value|
|:---|:---|:---|
|No|Linux|`/opt/batch/data/fsmounts`|
|Yes|Linux|`/mnt/batch/fsmounts` or `/mnt/resource/batch/fsmounts`|
|No|Windows|`C:\batch\data\fsmounts`|
|Yes|Windows|`D:\batch\fsmounts`|


### AZ_BATCH_JOB_PREP_DIR

|Local Temporary Disk Present|Operating System Type|`AZ_BATCH_JOB_PREP_DIR` Value|
|:---|:---|:---|
|No|Linux|`/opt/batch/data/tasks/workitems/jobprepreleasesamplejob/job-1/jobpreparation`|
|Yes|Linux|`/mnt/batch/tasks/workitems/jobprepreleasesamplejob/job-1/jobpreparation` or `/mnt/resource/batch/tasks/workitems/jobprepreleasesamplejob/job-1/jobpreparation`|
|No|Windows|`C:\batch\data\tasks\workitems\jobprepreleasesamplejob\job-1\jobpreparation`|
|Yes|Windows|`D:\batch\tasks\workitems\jobprepreleasesamplejob\job-1\jobpreparation`|


### AZ_BATCH_JOB_PREP_WORKING_DIR

|Local Temporary Disk Present|Operating System Type|`AZ_BATCH_JOB_PREP_WORKING_DIR` Value|
|:---|:---|:---|
|No|Linux|`/opt/batch/data/tasks/workitems/jobprepreleasesamplejob/job-1/jobpreparation/wd`|
|Yes|Linux|`/mnt/batch/tasks/workitems/jobprepreleasesamplejob/job-1/jobpreparation/wd` or `/mnt/resource/batch/tasks/workitems/jobprepreleasesamplejob/job-1/jobpreparation/wd`|
|No|Windows|`C:\batch\data\tasks\workitems\jobprepreleasesamplejob\job-1\jobpreparation\wd`|
|Yes|Windows|`D:\batch\tasks\workitems\jobprepreleasesamplejob\job-1\jobpreparation\wd`|


### AZ_BATCH_TASK_DIR

|Local Temporary Disk Present|Operating System Type|`AZ_BATCH_TASK_DIR` Value|
|:---|:---|:---|
|No|Linux|`/opt/batch/data/tasks/workitems/batchjob001/job-1/task001`|
|Yes|Linux|`/mnt/batch/tasks/workitems/batchjob001/job-1/task001` or `/mnt/resource/batch/tasks/workitems/batchjob001/job-1/task001`|
|No|Windows|`C:\batch\data\tasks\workitems\batchjob001\job-1\task001`|
|Yes|Windows|`D:\batch\tasks\workitems\batchjob001\job-1\task001`|


### AZ_BATCH_TASK_WORKING_DIR

|Local Temporary Disk Present|Operating System Type|`AZ_BATCH_TASK_WORKING_DIR` Value|
|:---|:---|:---|
|No|Linux|`/opt/batch/data/tasks/workitems/batchjob001/job-1/task001/wd`|
|Yes|Linux|`/mnt/batch/tasks/workitems/batchjob001/job-1/task001/wd` or `/mnt/resource/batch/tasks/workitems/batchjob001/job-1/task001/wd`|
|No|Windows|`C:\batch\data\tasks\workitems\batchjob001\job-1\task001\wd`|
|Yes|Windows|`D:\batch\tasks\workitems\batchjob001\job-1\task001\wd`|


### AZ_BATCH_TASK_SHARED_DIR

|Local Temporary Disk Present|Operating System Type|`AZ_BATCH_TASK_SHARED_DIR` Value|
|:---|:---|:---|
|No|Linux|`/opt/batch/data/tasks/workitems/batchjob001/job-1/task001`|
|Yes|Linux|`/mnt/batch/tasks/workitems/batchjob001/job-1/task001` or `/mnt/resource/batch/tasks/workitems/batchjob001/job-1/task001`|
|No|Windows|`C:\batch\data\tasks\workitems\batchjob001\job-1\task001`|
|Yes|Windows|`D:\batch\tasks\workitems\batchjob001\job-1\task001`|

## Next steps

- Learn about [error handling and detection](error-handling.md) in Azure Batch.