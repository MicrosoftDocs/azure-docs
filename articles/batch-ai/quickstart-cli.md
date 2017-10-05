---
title: Azure Quickstart - CNTK training with Batch AI - Azure CLI | Microsoft Docs
description: Quickly learn to run a CNTK training job with Batch AI using the Azure CLI
services: batchai
documentationcenter: na
author: dlepow
manager: timlt
editor: tysonn

ms.assetid:
ms.custom: mvc
ms.service: batchai
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: CLI
ms.topic: quickstart
ms.date: 10/09/2017
ms.author: danlep
---

# Run a CNTK training job using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This Quickstart details using the Azure CLI to run a Microsoft Cognitive Toolkit (CNTK) training job using the Batch AI service. 
In this example, you use the MNIST database of handwritten images to train a convolutional neural network (CNN) on a single-node GPU cluster.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the latest Azure CLI version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create a resource group

Batch AI clusters and jobs are Azure resources and must be placed in an Azure resource group, a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create][/cli/azure/group#create] command.

The following example creates a resource group named *myResourceGroup* in the *eastus* location. It then uses the [az configure](/cli/azure) command to set this resource group as the default.

```azurecli-interactive
az group create --name myResourceGroup --location eastus

az configure --defaults group=myResourceGroup 
```

## Create a storage account

This quickstart uses an Azure storage account to host data and scripts for the training job. Create a storage account with the [az storage account create](/cli/azure/storage/account#create) command.

```azure-cli-interactive
az storage account create \
    --name mystorageaccount \
    --sku Standard_LRS 
 ```

For later commands, set default storage account environment variables:

* **Linux**

  ```azure-cli-interactive
  export AZURE_STORAGE_ACCOUNT=mystorageaccount

  export AZURE_STORAGE_KEY=$(az storage account keys list --account-name mystorageaccount -o tsv --query [0].value)
  ```

* **Windows**

  ```azure-cli-interactive
  set AZURE_STORAGE_ACCOUNT=mystorageaccount

  az storage account keys list --account-name mystorageaccount -o tsv --query [0].value > temp.txt

  set /p AZURE_STORAGE_KEY=< temp.txt

  del temp.txt
  ```

## Prepare Azure file share

For illustration purposes, this quickstart uses an Azure file share to host the training data and scripts for the learning job. Create a file share named *batchaiquickstart* using the [az storage share create](/cli/azure/storage/share#az_storage_share_create) command.

```azure-cli-interactive
az storage share create --name batchaiquickstart
```
Create a directory in the share named *mnistcntksample* using the [az storage directory create](/cli/azure/storage/directory#az_storage_directory_create) command.

```azure-cli-interactive
az storage directory create --share-name batchaisample --name mnistcntksample
```

Download the [sample package](https://batchaisamples.blob.core.windows.net/samples/BatchAIQuickStart.zip?st=2017-09-29T18%3A29%3A00Z&se=2099-12-31T08%3A00%3A00Z&sp=rl&sv=2016-05-31&sr=b&sig=hrAZfbZC%2BQ%2FKccFQZ7OC4b%2FXSzCF5Myi4Cj%2BW3sVZDo%3D), unzip, and upload the contents to the directory using the [az storage file upload](/cli/azure/storage/file#az_storage_file_upload) command.

```azure-cli-interactive
wget -O BatchAIQuickStart.zip "https://batchaisamples.blob.core.windows.net/samples/BatchAIQuickStart.zip?st=2017-09-29T18%3A29%3A00Z&se=2099-12-31T08%3A00%3A00Z&sp=rl&sv=2016-05-31&sr=b&sig=hrAZfbZC%2BQ%2FKccFQZ7OC4b%2FXSzCF5Myi4Cj%2BW3sVZDo%3D" 

unzip BatchAIQuickStart.zip

az storage file upload --share-name batchaiquickstart --source Train-28x28_cntk_text.txt --path mnistcntksample 

az storage file upload --share-name batchaiquickstart --source Test-28x28_cntk_text.txt --path mnistcntksample

az storage file upload --share-name batchaiquickstart --source ConvNet_MNIST.cntk --path mnistcntksample


```azure-cli-interactive

```


## Create GPU cluster
Use the [az bachai cluster create](/cli/azure/batchai/cluster#create) command to create a Batch AI cluster. In this example, the cluster consists of a single STANDARD_NC6 VM node. This VM size has one NVIDIA K80 GPU. Mount the file share at a folder named *azurefileshare*. The full path of this folder on the GPU compute node is $AZ_BATCHAI_MOUNT_ROOT/azurefileshare. 

```
az batchai cluster create --name mycluster... [provide complete command line]
```

After the cluster is created, output is similar to the following:

```azure-cli
{
  "allocationState": "resizing",
  "allocationStateTransitionTime": "2017-10-05T02:09:03.194000+00:00",
  "creationTime": "2017-10-05T02:09:01.998000+00:00",
  "currentNodeCount": 0,
  "errors": null,
  "id": "/subscriptions/10d0b7c6-9243-4713-xxxx-xxxxxxxxxxxx/resourceGroups/demo/providers/Microsoft.BatchAI/clusters/mycluster",
  "location": "eastus",
  "name": "cluster",
  "nodeSetup": {
    "mountVolumes": {
      "azureBlobFileSystems": null,
      "azureFileShares": [
        {
          "accountName": "batchaisamples",
          "azureFileUrl": "https://batchaisamples.file.core.windows.net/batchaiquickstart",
          "credentialsInfo": {
            "accountKey": null,
            "accountKeySecretUrl": null
          },
          "directoryMode": "0777",
          "fileMode": "0777",
          "relativeMountPath": "azurefileshare"
        }
      ],
      "fileServers": null,
      "unmanagedFileSystems": null
    },
    "setupTask": null
  },
  "nodeStateCounts": {
    "idleNodeCount": 0,
    "preparingNodeCount": 0,
    "runningNodeCount": 0,
    "unusableNodeCount": 0
  },
  "provisioningState": "succeeded",
  "provisioningStateTransitionTime": "2017-10-05T02:09:02.857000+00:00",
  "resourceGroup": "demo",
  "scaleSettings": {
    "autoScale": null,
    "manual": {
      "nodeDeallocationOption": "requeue",
      "targetNodeCount": 1
    }
  },
  "subnet": {
    "id": null
  },
  "tags": null,
  "type": "Microsoft.BatchAI/Clusters",
  "userAccountSettings": {
    "adminUserName": "demoUser",
    "adminUserPassword": null,
    "adminUserSshPublicKey": null
  },
  "virtualMachineConfiguration": {
    "imageReference": {
      "offer": "UbuntuServer",
      "publisher": "Canonical",
      "sku": "16.04-LTS",
      "version": "latest"
    }
  },
  "vmPriority": "dedicated",
  "vmSize": "STANDARD_NC6"
```
### Monitor cluster creation

To monitor the cluster state, run the [az batchai cluster show](/cli/azure/batchai/cluster#show) command:

```azure-cli-interactive
az batchai cluster show  --cluster-name mycluster
```

This command returns the properties shown previously. The cluster is ready when the nodes are allocated and finished preparation (see the `nodeStateCounts` attribute). If something went wrong, the `errors` attribute contains the error description.

## Create training job

After the cluster is ready, configure and submit the learning job. 

1. Create a JSON template file for job creation named job.json:

  ```JSON
  {
    "location": "eastus",
    "properties": {
        "stdOutErrPathPrefix": "$AZ_BATCHAI_MOUNT_ROOT/azurefileshare",
       "inputDirectories": [{
            "id": "SAMPLE",
            "path": "$AZ_BATCHAI_MOUNT_ROOT/azurefileshare/mnistcntksample"
        }],
        "outputDirectories": [{
            "id": "MODEL",
            "pathPrefix": "$AZ_BATCHAI_MOUNT_ROOT/azurefileshare",
            "pathSuffix": "model",
            "type": "custom"
        }],
        "containerSettings": {
            "imageSourceRegistry": {
                "image": "microsoft/cntk:2.1-gpu-python3.5-cuda8.0-cudnn6.0"
            }
        },
        "nodeCount": 1,
        "cntkSettings": {
            "pythonScriptFilePath": "$AZ_BATCHAI_INPUT_SAMPLE/ConvNet_MNIST.py",
            "commandLineArgs": "$AZ_BATCHAI_INPUT_SAMPLE $AZ_BATCHAI_OUTPUT_MODEL",
        }
    }
  }
  ```
2. Create a job named *myjob* to run on the cluster with the [az batchai job create](/cli/azure/batchai/job#create) command:

  ```azure-cli-interactive
  az batchai job create --cluster-name mycluster -n myjob -c job.json
  ```

Output is similar to the following:

```azure-cli
{
  "caffeSettings": null,
  "chainerSettings": null,
  "cluster": {
    "id": "/subscriptions/10d0b7c6-9243-4713-xxxx-xxxxxxxxxxxx/resourceGroups/demo/providers/Microsoft.BatchAI/clusters/mycluster",
    "resourceGroup": "demo"
  },
  "cntkSettings": {
    "commandLineArgs": "$AZ_BATCHAI_INPUT_SAMPLE $AZ_BATCHAI_OUTPUT_MODEL",
    "configFilePath": null,
    "languageType": "Python",
    "processCount": 1,
    "pythonInterpreterPath": null,
    "pythonScriptFilePath": "$AZ_BATCHAI_INPUT_SAMPLE/ConvNet_MNIST.py"
  },
  "constraints": {
    "maxTaskRetryCount": null,
    "maxWallClockTime": "7 days, 0:00:00"
  },
  "containerSettings": {
    "imageSourceRegistry": {
      "credentials": null,
      "image": "microsoft/cntk:2.1-gpu-python3.5-cuda8.0-cudnn6.0",
      "serverUrl": null
    }
  },
  "creationTime": "2017-10-05T06:41:42.163000+00:00",
  "customToolkitSettings": null,
  "environmentVariables": null,
  "executionInfo": {
    "endTime": null,
    "errors": null,
    "exitCode": null,
    "lastRetryTime": null,
    "retryCount": null,
    "startTime": "2017-10-05T06:41:44.392000+00:00"
  },
  "executionState": "running",
  "executionStateTransitionTime": "2017-10-05T06:41:44.953000+00:00",
  "experimentName": null,
  "id": "/subscriptions/10d0b7c6-9243-4713-xxxx-xxxxxxxxxxxx/resourceGroups/demo/providers/Microsoft.BatchAI/jobs/myjob",
  "inputDirectories": [
    {
      "id": "SAMPLE",
      "path": "$AZ_BATCHAI_MOUNT_ROOT/azurefileshare/mnistcntksample"
    }
  ],
  "jobPreparation": null,
  "location": null,
  "name": "cntk_job",
  "nodeCount": 1,
  "outputDirectories": [
    {
      "createNew": true,
      "id": "MODEL",
      "pathPrefix": "$AZ_BATCHAI_MOUNT_ROOT/azurefileshare",
      "pathSuffix": "model",
      "type": "Custom"
    }
  ],
  "priority": 0,
  "provisioningState": "succeeded",
  "provisioningStateTransitionTime": "2017-10-05T06:41:44.238000+00:00",
  "resourceGroup": "demo",
  "stdOutErrPathPrefix": "$AZ_BATCHAI_MOUNT_ROOT/azurefileshare",
  "tags": null,
  "tensorFlowSettings": null,
  "toolType": "CNTK",
  "type": "Microsoft.BatchAI/Jobs"
}
```

## Monitor job

Use the [az batchai job show](/cli/azure/batchai/job#create) command to inspect the job state:

```azure-cli-interactive
az batchai job show --job-name myjob
```

The `executionState` contains the current execution state of the job:
•	`queued`: the job is waiting for the cluster nodes to become available
•	`running`: the job is running
•	`succeeded` (or `failed`) : the job is completed and `executionInfo` contains details about the result


## List stdout and stderr output
Use the [az batchai job list-files](/cli/azure/batchai/job#list-files) command view to links to the stdout and stderr log files:

```azure-cli-interactive
az batchai job list-files -n myjob --output-directory-id stdouterr
```

Output is similar to the following:

```azure-cli
[
  {
    "contentLength": 733,
    "downloadUrl": "https://batchaisamples.file.core.windows.net/batchaiquickstart/10d0b7c6-9243-4713-91a9-2730375d3a1b/demo/jobs/cntk_job/stderr.txt?sv=2016-05-31&sr=f&sig=Rh%2BuTg9C1yQxm7NfA9YWiKb%2B5FRKqWmEXiGNRDeFMd8%3D&se=2017-10-05T07%3A44%3A38Z&sp=rl",
    "lastModified": "2017-10-05T06:44:38+00:00",
    "name": "stderr.txt"
  },
  {
    "contentLength": 300,
    "downloadUrl": "https://batchaisamples.file.core.windows.net/batchaiquickstart/10d0b7c6-9243-4713-91a9-2730375d3a1b/demo/jobs/cntk_job/stdout.txt?sv=2016-05-31&sr=f&sig=jMhJfQOGry9jr4Hh3YyUFpW5Uaxnp38bhVWNrTTWMtk%3D&se=2017-10-05T07%3A44%3A38Z&sp=rl",
    "lastModified": "2017-10-05T06:44:29+00:00",
    "name": "stdout.txt"
  }
]
```


## Observe output files

You can stream or tail a job's output files while the job is executing. The following example uses the [az batchai job stream-file](/cli/azure/batchai/job#stream-file) command to stream the stderr.txt log:

```azure-cli-interactive
az batchai job stream-file --job-name myjob --output-directory-id stdouterr -n stderr.txt
```


## Delete job

## Delete resources

## Next steps

In this Quickstart, you learned how to 

> [!div class="nextstepaction"]
> 
