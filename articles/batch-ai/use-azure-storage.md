---
title: Storing Batch AI Job Input/Output with Azure Storage | Microsoft Docs
description: Learn about using Azure Storage with Batch AI for fast and easy cloud storage of input/output files
services: batch-ai
documentationcenter: ''
author: kevwang1
manager: Vaman Bedekar
editor: ''

ms.service: batch-ai
ms.topic: article
ms.date: 07/24/2018
ms.author: t-wewa
ms.custom: mvc

---
# Storing Batch AI Job Input/Output with Azure Storage

This guide describes how to use Azure Storage for storing input and output files when running a job. Batch AI integrates with Azure Storage by mounting Azure Storage systems to a Batch AI job or cluster filesystem, allowing seamless access to files stored in the cloud.

## Introduction to Azure Storage

Azure Storage is Microsoft's cloud storage solution. Batch AI supports mounting Azure Blob containers and Azure File shares to Batch AI jobs or clusters, allowing files to be accessed from a job as if they were in the native filesystem. Batch AI mounts Azure Blob containers with [blobfuse](https://github.com/Azure/azure-storage-fuse), and Azure File shares via the SMB protocol. For more information on Azure Storage, see [Introduction to Azure Storage](../storage/common/storage-introduction.md).

## Workflow

### 1. Store Dataset and Input Scripts in Azure Storage

We recommend that you store your input files (e.g. dataset) in a Blob container, which has higher throughput, and you store your training output in a File share, which supports streaming (allowing reading of output logs while the job is concurrently running). Batch AI supports mounting volumes from both General-purpose v1 and General-purpose v2 Azure Storage accounts.

Before you can use Azure Storage, you must [create an Azure Storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account). The Azure Storage account can hold multiple Blob and/or File share instances.

To create a Blob container and to upload your dataset to an Azure Blob container, choose one of the following methods:
- using [Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md) for uploading with a web-based GUI. To upload a small number of files, Azure portal provides the simplest operation.
- using [Azure Storage CLI](../storage/blobs/storage-quickstart-blobs-cli.md) for uploading via the command line (supports directory upload). To upload directories of files, use Azure Storage CLI (i.e. with `az storage blob upload-batch`).
- for other techniques, including using application SDKs, see [here](../storage/common/storage-moving-data.md)

Similarly, to create an Azure File share, choose one of the following methods:
- using [Azure portal](../storage/files/storage-how-to-use-files-portal.md)
- using [Azure Storage CLI](../storage/files/storage-how-to-use-files-cli.md)
- using [other techniques](../storage/common/storage-moving-data.md)

#### Auto-storage with Batch AI

Alternatively, you can create an Azure Storage account with an Azure File share and Blob container (and automatically mount these volumes to a Batch AI cluster) using the `--use-auto-storage` flag with `az batchai cluster create`. For more information, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#auto-storage-account).

### 2. Mount Azure Storage to Job Filesystem

#### Mount Volumes to Job

Mounting an Azure Storage volume allows it to be accessed via the job's filesystem. Therefore, a job can read and write files seamlessly to cloud storage as if they were local files.

To mount an Azure Storage volume to a job created with the Azure CLI, use the `mountVolumes` property in your `job.json` file when running `az batchai job create`. For an example, see the [Tensorflow GPU Distributed Recipe](https://github.com/Azure/BatchAI/blob/master/recipes/TensorFlow/TensorFlow-GPU-Distributed/job.json). The schema for `mountVolumes` is:
```json
{
    "mountVolumes": {
        "azureFileShares": [{
            "azureFileUrl": "https://<STORAGE_ACCOUNT_NAME>.file.core.windows.net/<FILE_SHARE_NAME>",
            "relativeMountPath": "<RELATIVE_MOUNT_PATH>"
        }],
        "azureBlobFileSystems": [{
            "accountName": "<STORAGE_ACCOUNT_NAME>",
            "containerName": "<BLOB_CONTAINER_NAME>",
            "relativeMountPath": "<RELATIVE_MOUNT_PATH>"
        }]
    }
}
```
The property `azureFileShares` and `azureBlobFileSystems` both are an array of objects that represent the volumes to mount. Descriptions of the placeholders:
- RELATIVE_MOUNT_PATH: the volume will be mounted at this path. For example, if `relativeMountPath` is `foo`, the volume will be located at `$AZ_BATCHAI_JOB_MOUNT_ROOT/foo`)
- STORAGE_ACCOUNT_NAME: the name of the Azure Storage account that holds the File share or Blob container
- FILE_SHARE_NAME: the name of File share
- BLOB_CONTAINER_NAME: the name of the Blob container

To mount Azure Storage volumes with the Azure Batch AI SDKs, you must set the `mount_volumes` (Python) or `MountVolumes` (C#, Java) property on `JobCreateParameters`. You must provide the storage account's credentials when mounting volumes with Azure Batch AI SDKs. View the schemas for mounting volumes in [Python](https://docs.microsoft.com/en-us/python/api/azure-mgmt-batchai/azure.mgmt.batchai.models.MountVolumes?view=azure-python), [C#](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.management.batchai.models.mountvolumes?view=azure-dotnet), and [Java](https://docs.microsoft.com/en-us/java/api/com.microsoft.azure.management.batchai._mount_volumes?view=azure-java-stable).

#### Mount Volumes to Cluster

Batch AI also supports mounting Azure Storage volumes to a Batch AI cluster. When a volume is mounted to a cluster, all jobs running on that cluster may use volumes mounted to that cluster. While job-level mounting provides the most flexibility (allowing each job to have different mounted volumes), cluster-level mounting may be sufficient in simple scenarios.

To mount an Azure Storage volume to a job created with the Azure CLI, use the `mountVolumes` property in your `cluster.json` file when running `az batchai cluster create`. The schema for `mountVolumes` when mounting a cluster is the same as when mounting to a job. 

Similarly, you can use the `mount_volumes` (Python) or `MountVolumes` (C#, Java) property on `ClusterCreateParameters` when mounting with Azure Batch AI SDKs. 

### 3. Access Mounted Filesystem in Job Script

#### $AZ_BATCHAI_JOB_MOUNT_ROOT Environment Variable

Inside the job's execution environment, the directory containing the mounted storage systems can be accessed with the `$AZ_BATCHAI_JOB_MOUNT_ROOT` environment variable (if you have used job-level mounting). If you have used cluster-level mounting, this environment variable is `$AZ_BATCHAI_MOUNT_ROOT`. The following examples will assume you have used job-level mounting.

To provide the path of data in a mounted volume, you must use the environment variable `$AZ_BATCHAI_JOB_MOUNT_ROOT` together with the mounted path. For example, if the training script `train.py` was uploaded to an Azure File share mounted at relative mount path `scripts`, the file will be available at `$AZ_BATCHAI_JOB_MOUNT_ROOT/scripts/train.py`.

If your training script requires knowledge of a path, you should pass it as a command-line argument. For example, if you stored your data in a folder called `train_data` in an Azure Blob container mounted at path `data`, you can pass `--data-dir=$AZ_BATCHAI_JOB_MOUNT_ROOT/data/train_data` as a command-line argument to your script. Accordingly, you must write your script to accept command-line arguments.

#### Abbreviate Input Paths

To abbreviate input paths as an environment variable, use the `inputDirectories` property of your `job.json` file (or `models.JobCreateParamters.input_directories` if using the Batch AI SDK). The schema of `inputDirectories` is:
```json
{
    "inputDirectories": [{
        "id": "<ID>",
        "path": "<PATH>" 
    }]
}
```
Each path specified will be placed in an environment variable called `$AZ_BATCHAI_INPUT_<ID>`. Using this method can simplify the paths to input files/directories. For example, to abbreviate the path to a training script: if `"id"` is `"SCRIPT"` and `"path"` is `"$AZ_BATCHAI_JOB_MOUNT_ROOT/scripts/train.py"`, then that path is available at `$AZ_BATCHAI_INPUT_SCRIPT` inside the job's execution.

For more information, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#input-directories).

#### Abbreviate Output Paths

To abbreviate output paths as an environment variable, use the `outputDirectories` property of your `job.json` file (or `models.JobCreateParamters.output_directories` if using the Batch AI SDK). Using this method can simplify the paths for output files. The schema of `outputDirectories` is:
```json
{
    "outputDirectories": [{
        "id": "<ID>",
        "pathPrefix": "<PATH_PREFIX>",
        "pathSuffix": "<PATH_SUFFIX>"
    }]
}
```
Each path specified will be placed in an environment variable called `$AZ_BATCHAI_OUTPUT_<ID>`. The `pathPrefix` determines which mounted volume to store the output (e.g. `"$AZ_BATCHAI_JOB_MOUNT_ROOT/output"`). The `pathSuffix` determines the folder name of the output (e.g. `"logs"`, `"checkpoints"`). The actual path of the output is a concatenation of `pathPrefix`, `jobOutputDirectoryPathSegment` (autogenerated for each job) and `pathSuffix`.

For more information, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#output-directories).

### 4. Retrieve Job Output from Azure Storage

#### Using Azure Portal

The Azure portal is a convenient way for viewing the output of jobs with a GUI file explorer. However, if you wish to view the output from stdout/stderr, or from a path in  `outputDirectories`, the files are placed in an autogenerated path in your Azure Storage volume. See below for more information.

#### Accessing Stdout and Stderr Output

Use the `stdOutErrPathPrefix` property of `job.json` to tell the job where to place the job's execution logs and stdout/stderr output. For example, if you have mounted a File share at relative mount path `outputs`, and you specify the `stdOutErrPathPrefix` to be `"$AZ_BATCHAI_JOB_MOUNT_ROOT/outputs"`, then the stdout/stderr job output will be available at `{subscription id}/{resource group}/workspaces/{workspace name}/experiments/{experiment name}/jobs/{job name}/{job uuid}/stdouterr` in that mounted volume. This autogenerated path is used to mitigate output collisions between jobs of the same name.

For more information, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#standard-and-error-output).

#### List the Output Files

You can use the Azure CLI to list the available output files of a job with the `az batchai job file list` command. For example, to list the files in the standard output directory of a job, use `az batchai job file list -j <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> -e <EXPERIMENT_NAME>`.

For more information and examples, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#stream-files-from-output-directories).

#### Stream Output Files (including Stdout/Stderr)

You can use the Azure CLI to stream files with the `az batchai job file stream` command. For example, to view:
- stdout: `az batchai job file stream -j <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> -e <EXPERIMENT_NAME> -f stdout.txt`
- stderr: `az batchai job file stream -j <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> -e <EXPERIMENT_NAME> -f stderr.txt`

For more information and examples, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#stream-files-from-output-directories).

## Next Steps
- To learn more about CLI commands to interface with Azure Storage, view the [Azure Batch AI CLI documentation](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md).
- To find more usage examples of Batch AI, including mounting storage and reading output files, see the [Jupyter Notebook recipes for Batch AI](https://github.com/Azure/BatchAI).
- Explore other options for mounting storage, including [mounting an NFS server](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#mounting-nfs) and [mounting your own NFS, cifs, or GlusterFS cluster](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#mounting-nfs)