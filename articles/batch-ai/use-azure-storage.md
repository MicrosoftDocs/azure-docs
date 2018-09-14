---
title: Storing Batch AI job input and output with Azure Storage | Microsoft Docs
description: How to use Azure Storage with Batch AI for fast and easy cloud storage of input and output files
services: batch-ai
documentationcenter: ''
author: kevwang1
manager: jeconnoc
editor: ''

ms.service: batch-ai
ms.topic: article
ms.date: 08/14/2018
ms.author: danlep
ms.custom: mvc

---
# Store Batch AI job input and output with Azure Storage

This guide describes how to use Azure Storage for storing input and output files when running a job. Azure Storage is one of several storage options supported by Batch AI. Batch AI integrates with Azure Storage by mounting Azure Storage systems to a Batch AI job or cluster filesystem, allowing seamless access to files stored in the cloud. 

## Introduction to Azure Storage

Azure Storage is Microsoft's cloud storage solution. Batch AI supports mounting Azure Blob containers and Azure file shares to Batch AI jobs or clusters, allowing files to be accessed from a job as if they were in the native filesystem. Batch AI mounts Azure Blob containers with [blobfuse](https://github.com/Azure/azure-storage-fuse), and Azure file shares via the SMB protocol. For more information on Azure Storage, see [Introduction to Azure Storage](../storage/common/storage-introduction.md).

## Store datasets and input scripts in Azure Storage

When you choose Azure Storage for your Batch AI environment, we recommend that you store your input files (such as datasets) in a Blob container, which has higher throughput, and you store your training output in a file share, which supports streaming (allowing reading of output logs while the job is concurrently running). 

Before you can use Azure Storage, you must [create an Azure Storage account](../storage/common/storage-quickstart-create-account.md). Batch AI supports mounting volumes from both General-purpose v1 (GPv1) and General-purpose v2 (GPv2) Azure Storage accounts. The Azure Storage account can hold multiple Blob containers or file share instances. Consider your cost and performance requirements when choosing the type of storage account to create. For more information, see [Azure storage account overview](../storage/common/storage-account-overview.md). 

To create a Blob container and to upload your dataset to an Azure Blob container, choose one of the following methods:
- [Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md) for uploading with a web-based GUI. To upload a small number of files, Azure portal provides the simplest operation.
- [Azure Storage CLI](../storage/blobs/storage-quickstart-blobs-cli.md) for uploading via the command line (supports directory upload). To upload directories of files, use  `az storage blob upload-batch`.
- [other techniques](../storage/common/storage-moving-data.md), including using application SDKs.

Similarly, to create an Azure File share, choose one of the following methods:
- [Azure portal](../storage/files/storage-how-to-use-files-portal.md)
- [Azure Storage CLI](../storage/files/storage-how-to-use-files-cli.md)
- [other techniques](../storage/common/storage-moving-data.md)

### Auto-storage with Batch AI

Alternatively, you can create an Azure Storage account with an Azure file share and Blob container (and automatically mount these volumes to a Batch AI cluster) by using the `--use-auto-storage` parameter with `az batchai cluster create`. For more information, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#auto-storage-account).

## Mount Azure Storage 

### Mount volumes to a job

Mounting an Azure Storage volume allows it to be accessed via the filesystem created for each job. Therefore, a job can read and write files seamlessly to cloud storage as if they were local files.

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

`azureFileShares` and `azureBlobFileSystems` are both arrays of objects that represent the volumes to mount. Descriptions of the placeholders:

- <RELATIVE_MOUNT_PATH> - the volume will be mounted at this path. For example, if `relativeMountPath` is `jobs`, the volume will be located at `$AZ_BATCHAI_JOB_MOUNT_ROOT/jobs`)
- <STORAGE_ACCOUNT_NAME> - the name of the Azure Storage account that holds the file share or Blob container
- <FILE_SHARE_NAME> - the name of the file share
- <BLOB_CONTAINER_NAME> - the name of the Blob container

To mount Azure Storage volumes with the Azure Batch AI SDKs, set the `mount_volumes` (Python) or `MountVolumes` (C#, Java) property on `JobCreateParameters`. You must provide the storage account's credentials when mounting volumes with Azure Batch AI SDKs. View the schemas for mounting volumes in [Python](https://docs.microsoft.com/python/api/azure-mgmt-batchai/azure.mgmt.batchai.models.MountVolumes?view=azure-python), [C#](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.batchai.models.mountvolumes?view=azure-dotnet), and [Java](https://docs.microsoft.com/java/api/com.microsoft.azure.management.batchai._mount_volumes?view=azure-java-stable).

### Mount volumes to a cluster

Batch AI also supports mounting Azure Storage volumes to a Batch AI cluster. When a volume is mounted to a cluster, all jobs running on that cluster may use volumes mounted to that cluster. While job-level mounting provides the most flexibility (allowing each job to have different mounted volumes), cluster-level mounting may be sufficient in simple scenarios.

To mount an Azure Storage volume to a cluster created with the Azure CLI, use the `mountVolumes` property in your `cluster.json` file when running `az batchai cluster create`. The schema for `mountVolumes` when mounting a cluster is the same as when mounting to a job. 

Similarly, you can use the `mount_volumes` (Python) or `MountVolumes` (C#, Java) property on `ClusterCreateParameters` when mounting with the Azure Batch AI SDKs. 

## Access mounted filesystem in a job

### $AZ_BATCHAI_JOB_MOUNT_ROOT environment variable

Inside the job's execution environment, the directory containing the mounted storage systems can be accessed with the `$AZ_BATCHAI_JOB_MOUNT_ROOT` environment variable (if you use job-level mounting). If you use cluster-level mounting, this environment variable is `$AZ_BATCHAI_MOUNT_ROOT`. The following examples assume you use job-level mounting.

To provide the path of data in a mounted volume, use the environment variable `$AZ_BATCHAI_JOB_MOUNT_ROOT` together with the mounted path. For example, if the training script `train.py` was uploaded to an Azure File share mounted at relative mount path `scripts`, the file will be available at `$AZ_BATCHAI_JOB_MOUNT_ROOT/scripts/train.py`.

If your training script requires knowledge of a path, you should pass it as a command-line argument. For example, if you stored your data in a folder called `train_data` in an Azure Blob container mounted at path `data`, you could pass `--data-dir=$AZ_BATCHAI_JOB_MOUNT_ROOT/data/train_data` as a command-line argument to your script. Accordingly, you must modify your script to accept command-line arguments.

### Abbreviate input paths

To abbreviate input paths as an environment variable, use the `inputDirectories` property of your `job.json` file (or `models.JobCreateParamters.input_directories` if using the Batch AI SDK). The schema of `inputDirectories` is:

```json
{
    "inputDirectories": [{
        "id": "<ID>",
        "path": "<PATH>" 
    }]
}
```

Each path specified will be placed in an environment variable called `$AZ_BATCHAI_INPUT_<ID>`. Using this method can simplify the paths to input files or directories. For example, to abbreviate the path to a training script: if `"id"` is `"SCRIPT"` and `"path"` is `"$AZ_BATCHAI_JOB_MOUNT_ROOT/scripts/train.py"`, then that path is available at `$AZ_BATCHAI_INPUT_SCRIPT` in the job's execution environment.

For more information, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#input-directories).

### Abbreviate output paths

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

Each path specified will be placed in an environment variable called `$AZ_BATCHAI_OUTPUT_<ID>`. The `pathPrefix` determines the mounted volume to store the output (for example, `"$AZ_BATCHAI_JOB_MOUNT_ROOT/output"`). The `pathSuffix` determines the folder name of the output (for example, `"logs"`, `"checkpoints"`). The actual path of the output is a concatenation of `pathPrefix`, `jobOutputDirectoryPathSegment` (autogenerated for each job) and `pathSuffix`.

For more information, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#output-directories).

## Retrieve job output from Azure Storage

### Use Azure portal

The Azure portal is a convenient way to view the output of jobs by using a GUI file explorer. However, if you wish to view the output from Stdout and Stderr, or from a path in  `outputDirectories`, the files are placed in an autogenerated path in your Azure Storage volume. See below for more information.

### Access Stdout and Stderr output

Use the `stdOutErrPathPrefix` property of `job.json` to tell the job where to place the job's execution logs and Stdout and Stderr output. For example, if you  mounted a file share at relative mount path `outputs`, and you specify the `stdOutErrPathPrefix` to be `"$AZ_BATCHAI_JOB_MOUNT_ROOT/outputs"`, then the Stdout and Stderr job output will be available at `{subscription id}/{resource group}/workspaces/{workspace name}/experiments/{experiment name}/jobs/{job name}/{job uuid}/stdouterr` in that mounted volume. This autogenerated path is used to prevent output collisions between jobs of the same name.

For more information, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#standard-and-error-output).

### List the output files

You can use the Azure CLI to list the available output files of a job with the `az batchai job file list` command. For example, to list the files in the standard output directory of a job, use `az batchai job file list -j <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> -e <EXPERIMENT_NAME>`.

For more information and examples, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#stream-files-from-output-directories).

### Stream output files

You can use the Azure CLI to stream files with the `az batchai job file stream` command. For example, to view:
- Stdout: `az batchai job file stream -j <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> -e <EXPERIMENT_NAME> -f stdout.txt`
- Stderr: `az batchai job file stream -j <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> -e <EXPERIMENT_NAME> -f stderr.txt`

For more information and examples, see [here](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#stream-files-from-output-directories).

## Next steps
- To learn more about CLI commands to interface with Azure Storage, view the [Azure Batch AI CLI documentation](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md).
- To find more usage examples of Batch AI, including mounting storage and reading output files, see the [Jupyter Notebook recipes for Batch AI](https://github.com/Azure/BatchAI).
- Explore other options for mounting storage, including [mounting an NFS server](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#mounting-nfs) and [mounting your own NFS, cifs, or GlusterFS cluster](https://github.com/Azure/BatchAI/blob/master/documentation/using-azure-cli-20.md#mounting-nfs)