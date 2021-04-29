---
title: Tutorial - Render a scene in the cloud
description: Learn how to render an Autodesk 3ds Max scene with Arnold using the Batch Rendering Service and Azure Command-Line Interface
ms.topic: tutorial
ms.date: 12/30/2020
ms.custom: mvc, devx-track-azurecli
ROBOTS: NOINDEX
---

# Tutorial: Render a scene with Azure Batch

Azure Batch provides cloud-scale rendering capabilities on a pay-per-use basis. Azure Batch supports rendering apps including Autodesk Maya, 3ds Max, Arnold, and V-Ray. This tutorial shows you the steps to render a small scene with Batch using the Azure Command-Line Interface. You learn how to:

> [!div class="checklist"]
> - Upload a scene to Azure storage
> - Create a Batch pool for rendering
> - Render a single-frame scene
> - Scale the pool, and render a multi-frame scene
> - Download rendered output

In this tutorial, you render a 3ds Max scene with Batch using the [Arnold](https://www.autodesk.com/products/arnold/overview) ray-tracing renderer. The Batch pool uses an Azure Marketplace image with pre-installed graphics and rendering applications that provide pay-per-use licensing.

## Prerequisites

- You need a pay-as-you-go subscription or other Azure purchase option to use rendering applications in Batch on a pay-per-use basis. **Pay-per-use licensing isn't supported if you use a free Azure offer that provides a monetary credit.**

- The sample 3ds Max scene for this tutorial is on [GitHub](https://github.com/Azure/azure-docs-cli-python-samples/tree/master/batch/render-scene), along with a sample Bash script and JSON configuration files. The 3ds Max scene is from the [Autodesk 3ds Max sample files](https://download.autodesk.com/us/support/files/3dsmax_sample_files/2017/Autodesk_3ds_Max_2017_English_Win_Samples_Files.exe). (Autodesk 3ds Max sample files are available under a Creative Commons Attribution-NonCommercial-Share Alike license. Copyright &copy; Autodesk, Inc.)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

- This tutorial requires version 2.0.20 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

> [!TIP]
> You can view [Arnold job templates](https://github.com/Azure/batch-extension-templates/tree/master/templates/arnold/render-windows-frames) in the Azure Batch Extension Templates GitHub repository.

## Create a Batch account

If you haven't already, create a resource group, a Batch account, and a linked storage account in your subscription.

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. The following example creates a resource group named *myResourceGroup* in the *eastus2* location.

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location eastus2
```

Create an Azure Storage account in your resource group with the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command. For this tutorial, you use the storage account to store an input 3ds Max scene and the rendered output.

```azurecli-interactive
az storage account create \
    --resource-group myResourceGroup \
    --name mystorageaccount \
    --location eastus2 \
    --sku Standard_LRS
```

Create a Batch account with the [az batch account create](/cli/azure/batch/account#az_batch_account_create) command. The following example creates a Batch account named *mybatchaccount* in *myResourceGroup*, and links the storage account you created.  

```azurecli-interactive
az batch account create \
    --name mybatchaccount \
    --storage-account mystorageaccount \
    --resource-group myResourceGroup \
    --location eastus2
```

To create and manage compute pools and jobs, you need to authenticate with Batch. Log in to the account with the [az batch account login](/cli/azure/batch/account#az_batch_account_login) command. After you log in, your `az batch` commands use this account context. The following example uses shared key authentication, based on the Batch account name and key. Batch also supports authentication through [Azure Active Directory](batch-aad-auth.md), to authenticate individual users or an unattended application.

```azurecli-interactive
az batch account login \
    --name mybatchaccount \
    --resource-group myResourceGroup \
    --shared-key-auth
```

## Upload a scene to storage

To upload the input scene to storage, you first need to access the storage account and create a destination container for the blobs. To access the Azure storage account, export the `AZURE_STORAGE_KEY` and `AZURE_STORAGE_ACCOUNT` environment variables. The first Bash shell command uses the [az storage account keys list](/cli/azure/storage/account/keys#az_storage_account_keys_list) command to get the first account key. After you set these environment variables, your storage commands use this account context.

```azurecli-interactive
export AZURE_STORAGE_KEY=$(az storage account keys list --account-name mystorageaccount --resource-group myResourceGroup -o tsv --query [0].value)

export AZURE_STORAGE_ACCOUNT=mystorageaccount
```

Now, create a blob container in the storage account for the scene files. The following example uses the [az storage container create](/cli/azure/storage/container#az_storage_container_create) command to create a blob container named *scenefiles* that allows public read access.

```azurecli-interactive
az storage container create \
    --public-access blob \
    --name scenefiles
```

Download the scene `MotionBlur-Dragon-Flying.max` from [GitHub](https://github.com/Azure/azure-docs-cli-python-samples/raw/master/batch/render-scene/MotionBlur-DragonFlying.max) to a local working directory. For example:

```azurecli-interactive
wget -O MotionBlur-DragonFlying.max https://github.com/Azure/azure-docs-cli-python-samples/raw/master/batch/render-scene/MotionBlur-DragonFlying.max
```

Upload the scene file from your local working directory to the blob container. The following example uses the [az storage blob upload-batch](/cli/azure/storage/blob#az_storage_blob_upload_batch) command, which can upload multiple files:

```azurecli-interactive
az storage blob upload-batch \
    --destination scenefiles \
    --source ./
```

## Create a rendering pool

Create a Batch pool for rendering using the [az batch pool create](/cli/azure/batch/pool#az_batch_pool_create) command. In this example, you specify the pool settings in a JSON file. Within your current shell, create a file name *mypool.json*, then copy and paste the following contents. Be sure all the text copies correctly. (You can download the file from [GitHub](https://raw.githubusercontent.com/Azure/azure-docs-cli-python-samples/master/batch/render-scene/json/mypool.json).)


```json
{
  "id": "myrenderpool",
  "vmSize": "standard_d2_v2",
  "virtualMachineConfiguration": {
    "imageReference": {
      "publisher": "batch",
      "offer": "rendering-windows2016",
      "sku": "rendering",
      "version": "1.3.8"
    },
    "nodeAgentSKUId": "batch.node.windows amd64"
  },
  "targetDedicatedNodes": 0,
  "targetLowPriorityNodes": 1,
  "enableAutoScale": false,
  "applicationLicenses":[
         "3dsmax",
         "arnold"
      ],
  "enableInterNodeCommunication": false 
}
```

Batch supports dedicated nodes and [low-priority](batch-low-pri-vms.md) nodes, and you can use either or both in your pools. Dedicated nodes are reserved for your pool. Low-priority nodes are offered at a reduced price from surplus VM capacity in Azure. Low-priority nodes become unavailable if Azure does not have enough capacity.

The pool specified contains a single low-priority node running a Windows Server image with software for the Batch Rendering service. This pool is licensed to render with 3ds Max and Arnold. In a later step, you scale the pool to a larger number of nodes.

If you aren't already signed in to your Batch account, use the [az batch account login](/cli/azure/batch/account#az_batch_account_login) command to do so. Then create the pool by passing the JSON file to the `az batch pool create` command:

```azurecli-interactive
az batch pool create \
    --json-file mypool.json
```

It takes a few minutes to provision the pool. To see the status of the pool, run the [az batch pool show](/cli/azure/batch/pool#az_batch_pool_show) command. The following command gets the allocation state of the pool:

```azurecli-interactive
az batch pool show \
    --pool-id myrenderpool \
    --query "allocationState"
```

Continue the following steps to create a job and tasks while the pool state is changing. The pool is completely provisioned when the allocation state is `steady` and the nodes are running.  

## Create a blob container for output

In the examples in this tutorial, every task in the rendering job creates an output file. Before scheduling the job, create a blob container in your storage account as the destination for the output files. The following example uses the [az storage container create](/cli/azure/storage/container#az_storage_container_create) command to create the *job-myrenderjob* container with public read access.

```azurecli-interactive
az storage container create \
    --public-access blob \
    --name job-myrenderjob
```

To write output files to the container, Batch needs to use a Shared Access Signature (SAS) token. Create the token with the [az storage account generate-sas](/cli/azure/storage/account#az_storage_account_generate_sas) command. This example creates a token to write to any blob container in the account, and the token expires on November 15, 2021:

```azurecli-interactive
az storage account generate-sas \
    --permissions w \
    --resource-types co \
    --services b \
    --expiry 2021-11-15
```

Take note of the token returned by the command, which looks similar to the following. You'll use this token in a later step.

`se=2021-11-15&sp=rw&sv=2019-09-24&ss=b&srt=co&sig=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Render a single-frame scene

### Create a job

Create a rendering job to run on the pool by using the [az batch job create](/cli/azure/batch/job#az_batch_job_create) command. Initially, the job has no tasks.

```azurecli-interactive
az batch job create \
    --id myrenderjob \
    --pool-id myrenderpool
```

### Create a task

Use the [az batch task create](/cli/azure/batch/task#az_batch_task_create) command to create a rendering task in the job. In this example, you specify the task settings in a JSON file. Within your current shell, create a file named *myrendertask.json*, then copy and paste the following contents. Be sure all the text copies correctly. (You can download the file from [GitHub](https://raw.githubusercontent.com/Azure/azure-docs-cli-python-samples/master/batch/render-scene/json/myrendertask.json).)

The task specifies a 3ds Max command to render a single frame of the scene *MotionBlur-DragonFlying.max*.

Modify the `blobSource` and `containerURL` elements in the JSON file so that they include the name of your storage account and your SAS token. 

> [!TIP]
> Your `containerURL` ends with your SAS token and is similar to:
> `https://mystorageaccount.blob.core.windows.net/job-myrenderjob/$TaskOutput?se=2018-11-15&sp=rw&sv=2017-04-17&ss=b&srt=co&sig=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

```json
{
  "id": "myrendertask",
  "commandLine": "cmd /c \"%3DSMAX_2018%3dsmaxcmdio.exe -secure off -v:5 -rfw:0 -start:1 -end:1 -outputName:\"dragon.jpg\" -w 400 -h 300 MotionBlur-DragonFlying.max\"",
  "resourceFiles": [
    {
        "httpUrl": "https://mystorageaccount.blob.core.windows.net/scenefiles/MotionBlur-DragonFlying.max",
        "filePath": "MotionBlur-DragonFlying.max"
    }
  ],
    "outputFiles": [
        {
            "filePattern": "dragon*.jpg",
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
az batch task create \
    --job-id myrenderjob \
    --json-file myrendertask.json
```

Batch schedules the task, and the task runs as soon as a node in the pool is available.

### View task output

The task takes a few minutes to run. Use the [az batch task show](/cli/azure/batch/task#az_batch_task_show) command to view details about the task.

```azurecli-interactive
az batch task show \
    --job-id myrenderjob \
    --task-id myrendertask
```

The task generates *dragon0001.jpg* on the compute node and uploads it to the *job-myrenderjob* container in your storage account. To view the output, download the file from storage to your local computer using the [az storage blob download](/cli/azure/storage/blob#az_storage_blob_download) command.

```azurecli-interactive
az storage blob download \
    --container-name job-myrenderjob \
    --file dragon.jpg \
    --name dragon0001.jpg

```

Open *dragon.jpg* on your computer. The rendered image looks similar to the following:

![Rendered dragon frame 1](./media/tutorial-rendering-cli/dragon-frame.png) 

## Scale the pool

Now modify the pool to prepare for a larger rendering job, with multiple frames. Batch provides a number of ways to scale the compute resources, including [autoscaling](batch-automatic-scaling.md) which adds or removes nodes as task demands change. For this basic example, use the [az batch pool resize](/cli/azure/batch/pool#az_batch_pool_resize) command to increase the number of low-priority nodes in the pool to *6*:

```azurecli-interactive
az batch pool resize --pool-id myrenderpool --target-dedicated-nodes 0 --target-low-priority-nodes 6
```

The pool takes a few minutes to resize. While that process takes place, set up the next tasks to run in the existing rendering job.

## Render a multiframe scene

As in the single-frame example, use the [az batch task create](/cli/azure/batch/task#az_batch_task_create) command to create rendering tasks in the job named *myrenderjob*. Here, specify the task settings in a JSON file called *myrendertask_multi.json*. (You can download the file from [GitHub](https://raw.githubusercontent.com/Azure/azure-docs-cli-python-samples/master/batch/render-scene/json/myrendertask_multi.json).) Each of the six tasks specifies an Arnold command line to render one frame of the 3ds Max scene *MotionBlur-DragonFlying.max*.

Create a file in your current shell named *myrendertask_multi.json*, and copy and paste the contents from the downloaded file. Modify the `blobSource` and `containerURL` elements in the JSON file to include the name of your storage account and your SAS token. Be sure to change the settings for each of the six tasks. Save the file, and run the following command to queue the tasks:

```azurecli-interactive
az batch task create --job-id myrenderjob --json-file myrendertask_multi.json
```

### View task output

The task takes a few minutes to run. Use the [az batch task list](/cli/azure/batch/task#az_batch_task_list) command to view the state of the tasks. For example:

```azurecli-interactive
az batch task list \
    --job-id myrenderjob \
    --output table
```

Use the [az batch task show](/cli/azure/batch/task#az_batch_task_show) command to view details about individual tasks. For example:

```azurecli-interactive
az batch task show \
    --job-id myrenderjob \
    --task-id mymultitask1
```

The tasks generate output files named *dragon0002.jpg* - *dragon0007.jpg* on the compute nodes and upload them to the *job-myrenderjob* container in your storage account. To view the output, download the files to a folder on your local computer using the [az storage blob download-batch](/cli/azure/storage/blob) command. For example:

```azurecli-interactive
az storage blob download-batch \
    --source job-myrenderjob \
    --destination .
```

Open one of the files on your computer. Rendered frame 6 looks similar to the following:

![Rendered dragon frame 6](./media/tutorial-rendering-cli/dragon-frame6.png) 

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, Batch account, pools, and all related resources. Delete the resources as follows:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this tutorial, you learned about how to:

> [!div class="checklist"]
> - Upload scenes to Azure storage
> - Create a Batch pool for rendering
> - Render a single-frame scene with Arnold
> - Scale the pool, and render a multi-frame scene
> - Download rendered output

To learn more about cloud-scale rendering, see the Batch rendering documentation.

> [!div class="nextstepaction"]
> [Batch Rendering service](batch-rendering-service.md)
