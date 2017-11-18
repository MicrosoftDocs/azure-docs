---
title: Render a scene with Arnold - Azure Batch CLI | Microsoft Docs
description: Tutorial - Step-by-step instructions to render an Autodesk 3ds Max scene with Arnold using the Batch Rendering Service and Azure CLI
services: batch
documentationcenter: 
author: dlepow
manager: jeconnoc
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: 
ms.topic: tutorial
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 11/15/2017
ms.author: danlep
ms.custom: mvc
---

# Render a 3ds Max scene with Arnold using the Batch Rendering service

Azure Batch provides cloud-scale rendering capabilities on a pay-per-use basis. The Batch Rendering service supports Autodesk Maya, 3ds Max, Arnold, and V-Ray. This tutorial shows you the steps to render a 3ds Max scene with Batch using the Arnold ray-tracing renderer. You learn how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z


## Prerequisites

This tutorial requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create a Batch account

If you haven't already, create a resource group, a Batch account, and a linked storage account in your subscription. 

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

Create a standard storage account in your resource group with the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command. For this tutorial, you use the storage account to store input 3ds Max scenes and the rendered output.

```azurecli-interactive
az storage account create --resource-group myResourceGroup --name myStorageAccount --location eastus --sku Standard_LRS
```
Create a Batch account with the [az batch account create](/cli/azure/batch/account#az_batch_account_create) command. The following example creates a Batch account named *myBatchAccount* in *myResourceGroup*, and links the storage account you created.  

```azurecli-interactive 
az batch account create --name myBatchAccount --storage-account myStorageAccount --resource-group myResourceGroup --location eastus
```

Log in to the account with the [az batch account login](/cli/azure/batch/account#az_batch_account_login) command. This example uses shared key authentication, based on the Batch account key. After you log in, you create and manage compute pools and rendering jobs in that account.

```azurecli-interactive 
az batch account login --name myBatchAccount --resource-group myResourceGroup --shared-key-auth
```
## Upload 3ds Max scenes to storage

Download sample 3ds Max scene files from [here](TBD) to a working directory on your local computer. 

Export environment variables to access the Azure storage account. The first bash shell command uses the [az storage account keys list](/cli/azure/storage/account/keys#az_storage_account_keys_list) command to get the first account key.

```azurecli-interactive
export AZURE_STORAGE_KEY=$(az storage account keys list --account-name myStorageAccount --resource-group myResourceGroup -o tsv --query [0].value)

export AZURE_STORAGE_ACCOUNT=myStorageAccount
```

Create a blob container in the storage account for the scene file data. The following example uses the [az storage container create](/cli/azure/storage/container#az_storage_container_create) command to create a blob container named *scenefiles* that allows public read access.

```azurecli-interactive
az storage container create --public-access blob --name scenefiles
```

Now upload the scene files from your local working folder to the blob container, using the [az storage blob upload-batch](/cli/azure/storage/blob#az_storage_blob_upload_batch) command:

```azurecli-interactive
az storage blob upload-batch --destination scenefiles --source .
```


## Create a Batch pool

Create a Batch pool for rendering using the [az batch pool create](/cli/azure/batch/pool#az_batch_pool_create) command. In this example, you specify the pool settings in a JSON file.

Create a local JSON file named *mypool.json* with the following content. The pool specified contains a single dedicated compute node (VM) running a Windows Server rendering image that Batch can use for the Rendering service. This pool is licensed to render with 3ds Max and Arnold. In a later step, the pool is scaled up to a larger number of nodes.

```JSON
{
  "id": "myrenderpool",
  "vmSize": "standard_d1_v2",
  "virtualMachineConfiguration": {
    "imageReference": {
      "publisher": "batch",
      "offer": "rendering-windows2016",
      "sku": "rendering",
      "version": "latest"
    },
    "nodeAgentSKUId": "batch.node.windows amd64"
  },
  "targetDedicatedNodes": 1,
  "targetLowPriorityNodes": 0,
  "enableAutoScale": false,
  "applicationLicenses":[
         "3dsmax",
         "arnold"
      ],
  "enableInterNodeCommunication": false 
}
```

Create the pool by passing the JSON file to the `az batch pool create` command:

```azurecli-interactive
az batch pool create --json-file mypool.json
``` 
It can take a few minutes to provision the pool. To see the status of the pool, run the [az batch pool show](/cli/azure/batch/pool#az_batch_pool_show) command. For example:

```azurecli-interactive
az batch pool show --pool-id myrenderpool -o table
```

You can continue the following steps while the pool is resizing. The pool is completely provisioned when the `allocationState` is `Steady`. 

## Create a blob container for output

Before scheduling a rendering job, create a blob container in your storage account called called *job-myrenderjob*. This container is the destination for the rendered output files. As before, use the [az storage container create](/cli/azure/storage/container#az_storage_container_create) command to create the container with public read access. 

```azurecli-interactive
az storage container create --public-access blob --name job-myrenderjob
```

To write output files to the container, Batch needs to use a Shared Access Signature (SAS) token. For this example, create the token with the [az storage account generate-sas](/cli/azure/storage/account#az_storage_account_generate_sas) command. This example creates a token to use to write to any blob containers in the account, and the token expires on November 15, 2018:

```azurecli-interactive
az storage account generate-sas --permissions w --resource-types co --services b --expiry 2018-11-15
```

Take note of the token returned by the command, which looks similar to the following:

```
se=2018-11-15&sp=rw&sv=2017-04-17&ss=b&srt=co&sig=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```


## Run a single-frame rendering job

Create a rendering job to run on the pool by using the [az batch job create](/cli/azure/batch/job#az_batch_job_create) command. 

```azurecli-interactive
az batch job create --id myrenderjob --pool-id myrenderpool
```

Use the [az batch task create](/cli/azure/batch/task#az_batch_task_create) command to create a rendering task in the job. In this example, you specify the task settings in a JSON file.

Create a local JSON file named *myrendertask.json* with the following content. The task specified uses an Arnold command line to render a single frame of the 3ds Max scene *Robo_Dummy_Lo_Res.max*. The task generates a JPEG output file that is uploaded to the *job-myrenderjob* container in your storage account. Modify the `blobSource` and `containerURL` elements in the JSON file to include the name of your storage account and the SAS token you generated previously. 

> [!TIP]
> Your `containerURL` is similar to:
> 
> ```
> https://mystorageaccount.blob.core.windows.net/job-myrenderjob/$TaskOutput?se=2018-11-15&sp=rw&sv=2017-04-17&ss=b&srt=co&sig=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
> ```

```JSON
{
  "id": "myrendertask",
  "commandLine": "cmd /c \"3dsmaxcmdio.exe -secure off -v:5 -rfw:0 -start:1 -end:1 -outputName:\"image.jpg\" -w 1600 -h 1200 Robo_Dummy_Lo_Res.max\"",
  "resourceFiles": [
    {
        "blobSource": "https://mystorageaccount.blob.core.windows.net/maxfile/Robo_Dummy_Lo_Res.max",
        "filePath": "Robo_Dummy_Lo_Res.max"
    },
    {
        "blobSource": "https://mystorageaccount.blob.core.windows.net/maxfile/Lo_Res_Diff_Clean_Eyes.jpg",
        "filePath": "Lo_Res_Diff_Clean_Eyes.jpg"}
],
    "outputFiles": [
        {
            "filePattern": "image*.jpg",
            "destination": {
                "container": {
                    "containerUrl": "https://mystorageaccount.blob.core.windows.net/job-myrenderjob/myrendertask/$TaskOutput?Add_Your_SAS_Token_Here"
                }
            },
            "uploadOptions": {
                "uploadCondition": "TaskSuccess"
            }
        }
    ],
  "userIdentity": {
    "autoUser": {
      "scope": "task",
      "elevationLevel": "nonAdmin"
    }
  }
}
```

Add the task to the job with the following command:

```azurecli-interactive
az batch task create --job-id myrenderjob --json-file myrendertask.json
```

Batch schedules the task to run immediately on the pool.


## View task output

The task takes a few minutes to run. Use the [az batch task show](/cli/azure/batch/task#az_batch_task_show) command to view the status of the Batch task.

```azurecli-interactive
az batch task show --job-id myrenderjob --task-id myrendertask
```

The task generates *image0001.jpg* on the compute node and uploads it to the *job-myrenderjob* container in your storage account. To view the output, download the file to your local computer using the [az storage blob download](/cli/azure/storage/blob#az_storage_blob_download) command.

```azurecli-interactive
az storage blob download --container-name job-myrenderjob --file image.jpg --name image0001.jpg

```

Open the file on your computer. The rendered image looks similar to the following:

![Rendered dummy](./media/tutorial-rendering-cli/low-res-dummy.png) 


## Scale the pool

Now modify the pool to prepare for a larger rendering job with multiple frames. Apply an autoscaling formula to the pool using the [az batch pool autoscale enable](/cli/azure/batch/pool/autoscale#az_batch_pool_autoscale_enable) command. The autoscale formula in this example keeps a minimum of one dedicated node, and adjusts the node count according to the active tasks, up to a maximum of 8. This is just one way to scale the compute resources.

```azurecli-interactive
az batch pool autoscale enable --pool-id myrenderpool --auto-scale-formula "$averageActiveTaskCount = avg($ActiveTasks.GetSample(TimeInterval_Minute * 5));$TargetDedicatedNodes = min(8, $averageActiveTaskCount + 1);"
```


## Run a multiframe rendering job


## Clean up resources



In this tutorial, you learned about  how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

Advance to the next tutorial to learn about ....  

> [!div class="nextstepaction"]

