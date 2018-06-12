---
title: Azure Quickstart - CNTK training with Batch AI - Azure CLI | Microsoft Docs
description: Quickly learn to run a CNTK training job with Batch AI using the Azure CLI
services: batch-ai
documentationcenter: na
author: AlexanderYukhanov
manager: Vaman.Bedekar
editor: tysonn

ms.assetid:
ms.custom: 
ms.service: batch-ai
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: CLI
ms.topic: quickstart
ms.date: 10/06/2017
ms.author: Alexander.Yukhanov
---

# Run a CNTK training job using the Azure CLI

This quickstart details using the Azure command-line interface (CLI) to run a Microsoft Cognitive Toolkit (CNTK) training job using the Batch AI service. The Azure CLI is used to create and manage Azure resources from the command line or in scripts.

In this example, you use the MNIST database of handwritten images to train a convolutional neural network (CNN) on a single-node GPU cluster managed by Batch AI.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quickstart requires that you are running the latest Azure CLI version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

The Batch AI resource providers also need to be registered once for your subscription using the Azure Cloud Shell or Azure CLI. A provider registration can take up to 15 minutes.

```azurecli
az provider register -n Microsoft.BatchAI
az provider register -n Microsoft.Batch
```



## Create a resource group

Batch AI clusters and jobs are Azure resources and must be placed in an Azure resource group.

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command.

The following example creates a resource group named *myResourceGroup* in the *eastus* location. It then uses the [az configure](/cli/azure#az_configure) command to set this resource group and location as the default.

```azurecli
az group create --name myResourceGroup --location eastus

az configure --defaults group=myResourceGroup 

az configure --defaults location=eastus 
```

## Create a storage account

This quickstart uses an Azure storage account to host data and scripts for the training job. Create a storage account with the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command.

```azurecli
az storage account create --name mystorageaccount --sku Standard_LRS 
```

For later commands, set default storage account environment variables:

* **Linux**

  ```azurecli
  export AZURE_STORAGE_ACCOUNT=mystorageaccount

  export AZURE_STORAGE_KEY=$(az storage account keys list --account-name mystorageaccount -o tsv --query [0].value)

  export AZURE_BATCHAI_STORAGE_ACCOUNT=mystorageaccount

  export AZURE_BATCHAI_STORAGE_KEY=$(az storage account keys list --account-name mystorageaccount -o tsv --query [0].value)

  ```

* **Windows**

  ```azurecli
  set AZURE_STORAGE_ACCOUNT=mystorageaccount

  az storage account keys list --account-name mystorageaccount -o tsv --query [0].value > temp.txt

  set /p AZURE_STORAGE_KEY=< temp.txt

  set AZURE_BATCHAI_STORAGE_ACCOUNT=mystorageaccount

  set /p AZURE_BATCHAI_STORAGE_KEY=< temp.txt

  del temp.txt
  ```

## Prepare Azure file share

For illustration purposes, this quickstart uses an Azure file share to host the training data and scripts for the learning job. 

1. Create a file share named *batchaiquickstart* using the [az storage share create](/cli/azure/storage/share#az_storage_share_create) command.

  ```azurecli
  az storage share create --name batchaiquickstart
  ```
2. Create a directory in the share named *mnistcntksample* using the [az storage directory create](/cli/azure/storage/directory#az_storage_directory_create) command.

  ```azurecli
  az storage directory create --share-name batchaiquickstart  --name mnistcntksample
  ```

3. Download the [sample package](https://batchaisamples.blob.core.windows.net/samples/BatchAIQuickStart.zip?st=2017-09-29T18%3A29%3A00Z&se=2099-12-31T08%3A00%3A00Z&sp=rl&sv=2016-05-31&sr=b&sig=hrAZfbZC%2BQ%2FKccFQZ7OC4b%2FXSzCF5Myi4Cj%2BW3sVZDo%3D) and unzip. Upload the contents to the directory using the [az storage file upload](/cli/azure/storage/file#az_storage_file_upload) command:

  ```azurecli
  az storage file upload --share-name batchaiquickstart --source Train-28x28_cntk_text.txt --path mnistcntksample 

  az storage file upload --share-name batchaiquickstart --source Test-28x28_cntk_text.txt --path mnistcntksample

  az storage file upload --share-name batchaiquickstart --source ConvNet_MNIST.py --path mnistcntksample
  ```


## Create GPU cluster
Use the [az batchai cluster create](/cli/azure/batchai/cluster#az_batchai_cluster_create) command to create a Batch AI cluster consisting of a single GPU VM node. In this example, the VM runs the default Ubuntu LTS image. Specify `image UbuntuDSVM` instead to run the Microsoft Deep Learning Virtual Machine, which supports additional training frameworks. The NC6 size has one NVIDIA K80 GPU. Mount the file share at a folder named *azurefileshare*. The full path of this folder on the GPU compute node is $AZ_BATCHAI_MOUNT_ROOT/azurefileshare. 


```azurecli
az batchai cluster create --name mycluster --vm-size STANDARD_NC6 --image UbuntuLTS --min 1 --max 1 --afs-name batchaiquickstart --afs-mount-path azurefileshare --user-name <admin_username> --password <admin_password> 
```


After the cluster is created, output is similar to the following:

```azurecli
{
  "allocationState": "resizing",
  "allocationStateTransitionTime": "2017-10-05T02:09:03.194000+00:00",
  "creationTime": "2017-10-05T02:09:01.998000+00:00",
  "currentNodeCount": 0,
  "errors": null,
  "id": "/subscriptions/10d0b7c6-9243-4713-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.BatchAI/clusters/mycluster",
  "location": "eastus",
  "name": "mycluster",
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
    "leavingNodeCount": 0,
    "preparingNodeCount": 0,
    "runningNodeCount": 0,
    "unusableNodeCount": 0
  },
  "provisioningState": "succeeded",
  "provisioningStateTransitionTime": "2017-10-05T02:09:02.857000+00:00",
  "resourceGroup": "myresourcegroup",
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
## Get cluster status

To get an overview of the cluster status, run the [az batchai cluster list](/cli/azure/batchai/cluster#az_batchai_cluster_list) command:

```azurecli
az batchai cluster list -o table
```

Output is similar to the following:

```azurecli
Name      Resource Group    VM Size       State      Idle    Running    Preparing    Unusable    Leaving
-------   ----------------  --------      -------    ------  ---------  -----------  ----------  ----------
mycluster myresourcegroup   STANDARD_NC6  steady     1       0          0            0            0
``` 

For more detail, run the [az batchai cluster show](/cli/azure/batchai/cluster#az_batchai_cluster_show) command. It returns all the cluster properties shown after cluster creation.

The cluster is ready when the nodes are allocated and finished preparation (see the `nodeStateCounts` attribute). If something went wrong, the `errors` attribute contains the error description.

## Create training job

After the cluster is ready, configure and submit the learning job. 

1. Create a JSON template file for job creation named job.json:

  ```JSON
  {
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
            "commandLineArgs": "$AZ_BATCHAI_INPUT_SAMPLE $AZ_BATCHAI_OUTPUT_MODEL"
        }
    }
  }
  ```
2. Create a job named *myjob* to run on the cluster with the [az batchai job create](/cli/azure/batchai/job#az_batchai_job_create) command:

  ```azurecli
  az batchai job create --name myjob --cluster-name mycluster --config job.json
  ```

Output is similar to the following:

```azurecli
{
  "caffeSettings": null,
  "chainerSettings": null,
  "cluster": {
    "id": "/subscriptions/10d0b7c6-9243-4713-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.BatchAI/clusters/mycluster",
    "resourceGroup": "myresourcegroup"
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

Use the [az batchai job list](/cli/azure/batchai/job#az_batchai_job_list) command to get an overview of the job status:

```azurecli
az batchai job list -o table
```

Output is similar to the following:

```azurecli
Name        Resource Group    Cluster    Cluster RG      Nodes  State    Exit code
----------  ----------------  ---------  --------------- -----  -------  -----------
myjob       myresourcegroup   mycluster  myresourcegroup 1      running            

```

For more detail, run the [az batchai job show](/cli/azure/batchai/job#az_batchai_job_show) command. 

The `executionState` contains the current execution state of the job:

* `queued`: the job is waiting for the cluster nodes to become available
* `running`: the job is running
*	`succeeded` (or `failed`) : the job is completed and `executionInfo` contains details about the result


## List stdout and stderr output
Use the [az batchai job list-files](/cli/azure/batchai/job#az_batchai_job_list_files) command to list links to the stdout and stderr log files:

```azurecli
az batchai job list-files --name myjob --output-directory-id stdouterr
```

Output is similar to the following:

```azurecli
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


## Observe output

You can stream or tail a job's output files while the job is executing. The following example uses the [az batchai job stream-file](/cli/azure/batchai/job#az_batchai_job_stream_file) command to stream the stderr.txt log:

```azurecli
az batchai job stream-file --job-name myjob --output-directory-id stdouterr --name stderr.txt
```

Output is similar to the following. Interrupt the output by pressing [Ctrl]-[C].

```azurecli
…
Finished Epoch[2 of 40]: [Training] loss = 0.104846 * 60000, metric = 3.00% * 60000 3.849s (15588.5 samples/s);
Finished Epoch[3 of 40]: [Training] loss = 0.077043 * 60000, metric = 2.23% * 60000 3.902s (15376.7 samples/s);
Finished Epoch[4 of 40]: [Training] loss = 0.063050 * 60000, metric = 1.82% * 60000 3.811s (15743.9 samples/s);
…

```

## Delete resources

Use the [az batchai job delete](/cli/azure/batchai/job#az_batchai_job_delete) command to delete the job:

```azurecli
az batchai job delete --name myjob
```
Use the [az batchai cluster delete](/cli/azure/batchai/cluster#az_batchai_cluster_delete) command to delete the cluster:

```azurecli
az batchai cluster delete --name mycluster
```

## Next steps

In this quickstart, you learned how to run a CNTK training job on a Batch AI cluster, using the Azure CLI. To learn more about using Batch AI with different toolkits, see the [training recipes](https://github.com/Azure/BatchAI).


