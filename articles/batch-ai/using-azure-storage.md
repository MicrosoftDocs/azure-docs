---
title: Storing Job Input/Output with Azure Storage | Microsoft Docs
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
# Storing Job Input/Output with Azure Storage

This guide describes how to use Azure Storage for storing input and output files when running a job. Batch AI integrates with Azure Storage by mounting Azure Storage systems to a Batch AI job's filesystem, allowing seamless access to files stored in the cloud.

## Introduction to Azure Storage

Azure Storage is Microsoft's cloud storage solution. Batch AI supports mounting Azure Blob and File Share systems, allowing files to be accessed as if they were in the native filesystem. For more information on Azure Storage, please see [Introduction to Azure Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-introduction).

## Workflow

### 1. Store Dataset and Input Scripts in Azure Storage

It is recommended that you store your input files (e.g. dataset) in a Blob container, which has higher throughput, and you store your training output in a File Share, which supports streaming (allowing reading of output logs while the job is concurrently running).

Before you can use Azure Storage, you must [create an Azure Storage account](https://docs.microsoft.com/en-us/azure/storage/common/storage-create-storage-account#create-a-storage-account). The Azure Storage account can hold multiple Blob and/or File Share instances.

To create a Blob container and to upload your dataset to an Azure Blob container, choose one of the following:
- using [Azure portal](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal) for uploading with a web-based GUI. To upload a small number of files, Azure portal will provide the simplest operation.
- using [Azure Storage CLI](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-cli) for uploading via the command line (supports directory upload). To upload directories of files, you should use the Azure Storage CLI (i.e. with `az storage blob upload-batch`).
- for other techniques, including using application SDKs, see [here](https://docs.microsoft.com/en-us/azure/storage/common/storage-moving-data)

Similarly, to create an Azure File Share, choose one of the following:
- using [Azure portal](https://docs.microsoft.com/en-us/azure/storage/files/storage-how-to-use-files-portal)
- using [Azure Storage CLI](https://docs.microsoft.com/en-us/azure/storage/files/storage-how-to-use-files-cli)
- using [other techniques](https://docs.microsoft.com/en-us/azure/storage/common/storage-moving-data)

### 2. Mount Azure Storage to Job Filesystem

Mounting an Azure Storage volume allows it to be accessed via the job's filesystem. Therefore, a job can read and write files seamlessly to cloud storage as if they were local files.

To mount an Azure Storage volume to a job, use the `mountVolumes` property in your `job.json` file (or `models.JobCreateParamters.mount_volumes` if using the Batch AI SDK). For an example, see the [Batch AI CLI quickstart](https://docs.microsoft.com/en-us/azure/batch-ai/quickstart-cli#prepare-job-configuration-file). The schema for `mountVolumes` is:
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
- STORAGE_ACCOUNT_NAME: the name of the Azure Storage account which holds the File Share
- FILE_SHARE_NAME: the name of File Share
- BLOB_CONTAINER_NAME: the name of the Blob container

When using the Azure Batch AI SDKs (e.g. `models.JobCreateParamters.mount_volumes`), the schemas are similar; however, you must also provide the storage account's credentials when mounting volumes.

### 3. Access Mounted Filesystem in Job Script

#### $AZ_BATCHAI_JOB_MOUNT_ROOT Environment Variable

Inside the job's execution environment, the directory containing the mounted storage systems can be accessed with the `$AZ_BATCHAI_JOB_MOUNT_ROOT` environment variable.

To provide the path of data in a mounted volume, you must use the environment variable `$AZ_BATCHAI_JOB_MOUNT_ROOT` together with the mounted path. For example, if the training script `train.py` was uploaded to an Azure File Share mounted at relative mount path `scripts`, the file will be available at `$AZ_BATCHAI_JOB_MOUNT_ROOT/scripts/train.py`.

If your training script requires knowledge of a path, you should pass it as a command-line argument. For example, if you stored your data in a folder called `train_data` in a Azure Blob container mounted at path `data`, you can pass `--data-dir=$AZ_BATCHAI_JOB_MOUNT_ROOT/data/train_data` as a command-line argument to your script. Accordingly, you must write your script to accept command-line arguments.

#### Abbreviate Input Paths

To abbreviate input paths as an environment variable, use the the `inputDirectories` property of your `job.json` file (or `models.JobCreateParamters.input_directories` if using the Batch AI SDK). The schema of `inputDirectories` is:
```json
{
    "inputDirectories": [{
        "id": "<ID>",
        "path": "<PATH>" 
    }]
}
```
Each path specified will be placed in an environment variable called `$AZ_BATCHAI_INPUT_<ID>`. Using this method can simplify the paths to input files/directories. For example, to abbreviate the path to a training script: if `"id"` is `"SCRIPT"` and `"path"` is `"$AZ_BATCHAI_JOB_MOUNT_ROOT/scripts/train.py"`, then that path is available at `$AZ_BATCHAI_INPUT_SCRIPT` for the job.

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

The Azure Portal is a convenient way for viewing the output of jobs with a GUI file explorer. However, if you wish to view the output from stdout/stderr, or from a path in  `outputDirectories`, the files are placed in an autogenerated path in your Azure Storage volume. See below for more information.

#### Accessing Stdout and Stderr Output

Use the `stdOutErrPathPrefix` property of `job.json` to tell the job where to place the job's execution logs and stdout/stderr output. For example, if you have mounted a File Share at relative mount path `outputs`, and you specify the `stdOutErrPathPrefix` to be `"$AZ_BATCHAI_JOB_MOUNT_ROOT/outputs"`, then the stdout/stderr job output will be available at `{subscription id}/{resource group}/workspaces/{workspace name}/experiments/{experiment name}/jobs/{job name}/{job uuid}/stdouterr` in that mounted volume. This autogenerated path is used to mitigate output collisions between jobs of the same name.

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