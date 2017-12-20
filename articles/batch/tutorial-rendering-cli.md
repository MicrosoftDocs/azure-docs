---
title: Render a scene with Arnold - Azure Batch 
description: Tutorial - Step-by-step instructions to render an Autodesk 3ds Max scene with Arnold using the Batch Rendering Service and Azure Command-Line Interface
services: batch
author: dlepow
manager: jeconnoc

ms.service: batch
ms.topic: tutorial
ms.date: 12/19/2017
ms.author: danlep
ms.custom: mvc
---

# Render a 3ds Max scene with Arnold using the Batch Rendering service

Azure Batch provides cloud-scale rendering capabilities on a pay-per-use basis. The Batch Rendering service supports Autodesk Maya, 3ds Max, Arnold, and V-Ray. This tutorial shows you the steps to render a 3ds Max scene with Batch using the Arnold ray-tracing renderer. You learn how to:

> [!div class="checklist"]
> * Upload scenes to Azure storage
> * Create a Batch pool for rendering
> * Render a single-frame scene with Arnold
> * Scale the pool, and render a multi-frame scene
> * Download rendered output


## Prerequisites

This tutorial requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).


## Download the sample

[Download or clone the sample files](https://github.com/dlepow/batchmvc) from GitHub. 

Change to the directory that contains the sample 3ds Max scene files and Batch configuration files:

```bash
cd tutorial_rendering
```


## Create a Batch account

If you haven't already, create a resource group, a Batch account, and a linked storage account in your subscription. 

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

Create a standard storage account in your resource group with the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command. For this tutorial, you use the storage account to store input 3ds Max scenes and the rendered output.

```azurecli-interactive
az storage account create --resource-group myResourceGroup --name mystorageaccount --location eastus --sku Standard_LRS
```
Create a Batch account with the [az batch account create](/cli/azure/batch/account#az_batch_account_create) command. The following example creates a Batch account named *mybatchaccount* in *myResourceGroup*, and links the storage account you created.  

```azurecli-interactive 
az batch account create --name mybatchaccount --storage-account myStorageAccount --resource-group myResourceGroup --location eastus
```

To create and manage compute pools and jobs, you need to authenticate with Batch. Log in to the account with the [az batch account login](/cli/azure/batch/account#az_batch_account_login) command. After you log in, your `az batch` commands use this account context. The following example uses shared key authentication, based on the Batch account name and key. Batch also supports authentication through [Azure Active Directory](batch-aad-auth.md), to authenticate individual users or an unattended application.

```azurecli-interactive 
az batch account login --name mybatchaccount --resource-group myResourceGroup --shared-key-auth
```
## Upload 3ds Max scenes to storage

To upload input scenes to storage, you first need to access the storage account and create a destination container for the blobs. To access the Azure storage account, export the `AZURE_STORAGE_KEY` and `AZURE_STORAGE_ACCOUNT` environment variables. The first bash shell command uses the [az storage account keys list](/cli/azure/storage/account/keys#az_storage_account_keys_list) command to get the first account key.

```azurecli-interactive
export AZURE_STORAGE_KEY=$(az storage account keys list --account-name mystorageaccount --resource-group myResourceGroup -o tsv --query [0].value)

export AZURE_STORAGE_ACCOUNT=mystorageaccount
```

Now, create a blob container in the storage account for the scene files. The following example uses the [az storage container create](/cli/azure/storage/container#az_storage_container_create) command to create a blob container named *scenefiles* that allows public read access.

```azurecli-interactive
az storage container create --public-access blob --name scenefiles
```

Upload the scene files from your local working folder to the blob container, using the [az storage blob upload-batch](/cli/azure/storage/blob#az_storage_blob_upload_batch) command:

```azurecli-interactive
az storage blob upload-batch --destination scenefiles --source ./scenes
```



## Create a Batch pool

Create a Batch pool for rendering using the [az batch pool create](/cli/azure/batch/pool#az_batch_pool_create) command. In this example, you specify the pool settings in a JSON file called *mypool.json* (this file is included in the files you downloaded for this tutorial). Within your current shell, create a file name *mypool.json*, then copy and paste the following contents. Be sure all the text copies correctly.


```json
{
  "id": "myrenderpool",
  "vmSize": "standard_d2_v2",
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
The pool specified contains a single dedicated compute node (VM) running a Windows Server image with software for the Batch Rendering service. This pool is licensed to render with 3ds Max and Arnold. In a later step, you scale the pool to a larger number of nodes.

Create the pool by passing the JSON file to the `az batch pool create` command:

```azurecli-interactive
az batch pool create --json-file mypool.json
``` 
It can take a few minutes to provision the pool. To see the status of the pool, run the [az batch pool show](/cli/azure/batch/pool#az_batch_pool_show) command. For example:

```azurecli-interactive
az batch pool show --pool-id myrenderpool -o table
```

Continue the following steps while the pool is resizing. The pool is provisioned when the `allocationState` is `Steady`. 

## Create a blob container for output

The rendering job in this tutorial creates an output file for every input file. Before scheduling the job, create a blob container in your storage account as the destination for the output files. The following example uses the [az storage container create](/cli/azure/storage/container#az_storage_container_create) command to create the *job-myrenderjob* container with public read access. 

```azurecli-interactive
az storage container create --public-access blob --name job-myrenderjob
```

To write output files to the container, Batch needs to use a Shared Access Signature (SAS) token. Create the token with the [az storage account generate-sas](/cli/azure/storage/account#az_storage_account_generate_sas) command. This example creates a token to write to any blob container in the account, and the token expires on November 15, 2018:

```azurecli-interactive
az storage account generate-sas --permissions w --resource-types co --services b --expiry 2018-11-15
```

Take note of the token returned by the command, which looks similar to the following. You use this token in a later step.

```
se=2018-11-15&sp=rw&sv=2017-04-17&ss=b&srt=co&sig=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```


## Render a single-frame scene

Create a rendering job to run on the pool by using the [az batch job create](/cli/azure/batch/job#az_batch_job_create) command. 

```azurecli-interactive
az batch job create --id myrenderjob --pool-id myrenderpool
```

Use the [az batch task create](/cli/azure/batch/task#az_batch_task_create) command to create a rendering task in the job. In this example, you specify the task settings in a JSON file called *myrendertask.json* (this file is included in the files you downloaded for this tutorial). Within your current shell, create a file name *myrendertask.json*, then copy and paste the following contents. Be sure all the text copies correctly.

The task specifies an Arnold command line to render a single frame of the 3ds Max scene *Robo_Dummy_Lo_Res.max*.

Modify the `blobSource` and `containerURL` elements in the JSON file so that they include the name of your storage account and your SAS token. 

> [!TIP]
> Your `containerURL` ends with your SAS token and is similar to:
> 
> ```
> https://mystorageaccount.blob.core.windows.net/job-myrenderjob/$TaskOutput?se=2018-11-15&sp=rw&sv=2017-04-17&ss=b&srt=co&sig=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
> ```

```json
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

Batch schedules the task, and the task runs as soon as the pool is available.


## View task output

The task takes a few minutes to run. Use the [az batch task show](/cli/azure/batch/task#az_batch_task_show) command to view details about the task.

```azurecli-interactive
az batch task show --job-id myrenderjob --task-id myrendertask
```

The task generates *image0001.jpg* on the compute node and uploads it to the *job-myrenderjob* container in your storage account. To view the output, download the file from storage to your local computer using the [az storage blob download](/cli/azure/storage/blob#az_storage_blob_download) command.

```azurecli-interactive
az storage blob download --container-name job-myrenderjob --file image.jpg --name image0001.jpg

```

Open the file on your computer. The rendered image looks similar to the following:

![Rendered dummy](./media/tutorial-rendering-cli/low-res-dummy.png) 


## Scale the pool

Now modify the pool to prepare for a larger rendering job, with multiple frames. Batch provides a number of ways to scale the compute resources, including [autoscaling](batch-automatic-scaling,nd) to add or remove nodes as task demands change. For this basic example, use the [az batch pool resize](/cli/azure/batch/pool#az_batch_pool_resize) command to increase the number of nodes in the pool to *6*:

```azurecli-interactive
az batch pool resize --pool-id myrenderpool --target-dedicated-nodes 6
```

The pool takes a few minutes to resize. While that process takes place, set up the next tasks to run in the rendering job.


## Render a multiframe scene

As in the single-frame example, use the [az batch task create](/cli/azure/batch/task#az_batch_task_create) command to create rendering tasks in the job. In this example, specify the task settings in a JSON file called *myrendertask_multi.json* (this file is included in the files you downloaded for this tutorial). Each of the six tasks specifies an Arnold command line to render one frame of the 3ds Max scene *MotionBlur-DragonFlying.max*.

As you did in the previous example, create a file in your current shell named *myrendertask_multi.json*, and copy and paste the contents from the downloaded file. Modify the `blobSource` and `containerURL` elements in the JSON file to include the name of your storage account and your SAS token. Be sure to change the settings for each of the six tasks. Save the file, and run the following command to queue the tasks:

```azurecli-interactive
az batch task create --job-id myrenderjob --json-file myrendertask_multi.json
```

## View task output

The task takes a few minutes to run. Use the [az batch task list](/cli/azure/batch/task#az_batch_task_show) command to view the state of the tasks. For example:

```azurecli-interactive
az batch task show --job-id myrenderjob --output table
```

Use the [az batch task show](/cli/azure/batch/task#az_batch_task_show) command to view details about individual tasks. For example:

```azurecli-interactive
az batch task show --job-id myrenderjob --task-id mymultitask1
```
 
The tasks generate output files named *dragon000x.jpg* on the compute nodes and upload them to the *job-myrenderjob* container in your storage account. To view the output, download the files to a folder on your local computer using the [az storage blob download-batch](/cli/azure/storage/blob#az_storage_blob_download_batch) command. For example:

```azurecli-interactive
az storage blob download-batch --source job-myrenderjob --destination .
```

Open one of the files on your computer. A rendered image looks similar to the following:

![Rendered dragon frame](./media/tutorial-rendering-cli/dragon-frame.png) 



## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, Batch account, pools, and all related resources. Delete the resources as follows:

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Next steps

In this tutorial, you learned about how to:

> [!div class="checklist"]
> * Upload scenes to Azure storage
> * Create a Batch pool for rendering
> * Render a single-frame scene with Arnold
> * Scale the pool, and render a multi-frame scene
> * Download rendered output

For more information about rendering options with Batch, see the [Batch Rendering](batch-rendering-service.md) article. For example, you can also use the [BatchLabs](https://github.com/Azure/BatchLabs) desktop application or the [Batch Template CLI (Preview)](batch-cli-templates.md) for rendering workloads.

Advance to the next tutorial to learn about how to run a parallel R simulation with Batch.  

> [!div class="nextstepaction"]
> [Run a parallel R simulation](tutorial-r-doazureparallel.md)
