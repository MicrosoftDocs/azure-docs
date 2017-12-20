---
title: Azure Quickstart - Run Batch job - CLI 
description: Quickly learn to run a Batch job with the Azure CLI.
services: batch
author: dlepow
manager: jeconnoc

ms.service: batch
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 12/20/2017
ms.author: danlep
ms.custom: mvc
---

# Run your first Batch job with the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows how to use the Azure CLI to create a Batch account, a *pool* of compute nodes (virtual machines), and a *job* that runs *tasks* on the pool. The pool in this example contains Linux VMs, but Batch also supports Windows pools to run Windows jobs. Each sample task displays environment variables set by Batch on a compute node. This example is basic but introduces you to key concepts of the Batch service.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create \
    --name myResourceGroup \
    --location eastus
```

## Create a storage account

As shown in this quickstart, you can link an Azure general-purpose storage account with your Batch account. The storage account is useful to deploy applications and store input and output data. Create a storage account in your resource group with the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command.

```azurecli-interactive
az storage account create \
    --resource-group myResourceGroup \
    --name mystorageaccount \
    --location eastus \
    --sku Standard_LRS
```

## Create a Batch account

Create a Batch account with the [az batch account create](/cli/azure/batch/account#az_batch_account_create) command. You need an account to create compute resources (pools of compute nodes) and Batch jobs.

The following example creates a Batch account named *mybatchaccount* in *myResourceGroup*, and links the storage account you created.  

```azurecli-interactive 
az batch account create \
    --name mybatchaccount \
    --storage-account mystorageaccount \
    --resource-group myResourceGroup \
    --location eastus
```

To create and manage compute pools and jobs, you need to authenticate with Batch. Log in to the account with the [az batch account login](/cli/azure/batch/account#az_batch_account_login) command. This example uses shared key authentication, based on the Batch account name and key. After you log in, your `az batch` commands use this account context.

```azurecli-interactive 
az batch account login \
    --name mybatchaccount \
    --resource-group myResourceGroup \
    --shared-key-auth
```

## Create a Batch pool 

Create a sample pool of Linux VMs for Batch using the [az batch pool create](/cli/azure/batch/pool#az_batch_pool_create) command. The following example creates a pool named *mypool* of 2 size *Standard_A1_v2* nodes running Ubuntu 16.04 LTS. The size suggested offers a good balance of performance versus cost for this quick example.
 
```azurecli-interactive
az batch pool create \
    --id mypool --vm-size Standard_A1_v2 \
    --target-dedicated-nodes 2 \
    --image canonical:ubuntuserver:16.04.0-LTS \
    --node-agent-sku-id "batch.node.ubuntu 16.04" 
```

It takes a few minutes to provision the pool resources. To see the status of the pool, run the [az batch pool show](/cli/azure/batch/pool#az_batch_pool_show) command. The following command gets the allocation state of the pool:

```azurecli-interactive
az batch pool show --pool-id mypool \
    --query "allocationState"
```

Continue the following steps to create a job and tasks while the pool state is changing. The pool is completely provisioned when the allocation state is `Steady`. 

## Create a Batch job

A Batch job specifies a pool to run tasks on and optional settings such as a priority and schedule for the work. Create a Batch job by using the [az batch job create](/cli/azure/batch/job#az_batch_job_create) command. The following example creates a job *myjob* on the pool *mypool*. Initially the job has no tasks.

```azurecli-interactive 
az batch job create \
    --id myjob \
    --pool-id mypool
```

## Create tasks

Now use the [az batch task create](/cli/azure/batch/task#az_batch_task_create) command to create some tasks to run in the job. In this example, you create four identical tasks. Each task runs a `command-line` to display the Batch environment variables on a compute node, and then waits 90 seconds. When you use Batch, this command line is where you specify your app or script. Batch provides a number of ways to deploy apps and scripts to compute nodes.

The following script creates 4 parallel tasks (*mytask1* to *mytask4*).

```azurecli-interactive 
for i in {1..4}
do
   az batch task create \
    --task-id mytask$i \
    --job-id myjob \
    --command-line "/bin/bash -c \"printenv | grep AZ_BATCH; sleep 90s\""
done
```

The command output shows settings for each of the tasks. Batch distributes the tasks to the compute nodes.

## View task status

Use the [az batch task show](/cli/azure/batch/task#az_batch_task_show) command to view the status of the Batch tasks. The following example shows details about *mytask1* running on one of the pool nodes.

```azurecli-interactive 
az batch task show \
    --job-id myjob \
    --task-id mytask1
```

The command output includes many details, but take note of the `exitCode` and the `nodeId`. An `exitCode` of 0 indicates that the task completed successfully. The `nodeId` indicates the ID of the pool node on which the task ran.



## View task output

To list the files output from the tasks on the nodes where they completed, use the [az batch task file list](/cli/azure/batch/task#az_batch_task_file_list) command. The following command lists the files created by *mytask1*: 

```azurecli-interactive 
az batch task file list \
    --job-id myjob \
    --task-id mytask1 \
    --output table
```

Output is similar to the following:

```
Name        URL                                                                                         Is Directory      Content Length
----------  ------------------------------------------------------------------------------------------  --------------  ----------------
stdout.txt  https://mybatchaccount.eastus.batch.azure.com/jobs/myjob/tasks/mytask1/files/stdout.txt  False                  695
certs       https://mybatchaccount.eastus.batch.azure.com/jobs/myjob/tasks/mytask1/files/certs       True
wd          https://mybatchaccount.eastus.batch.azure.com/jobs/myjob/tasks/mytask1/files/wd          True
stderr.txt  https://mybatchaccount.eastus.batch.azure.com/jobs/myjob/tasks/mytask1/files/stderr.txt  False                     0

```

To download one of the output files to a local directory, use the [az batch task file download](/cli/azure/batch/task#az_batch_task_file_download) command. The sample task command in this quickstart returns its output in `stdout.txt`. 

```azurecli-interactive
az batch task file download \
    --job-id myjob \
    --task-id mytask1 \
    --file-path stdout.txt \
    --destination ./stdout.txt
```

You can view the contents of `stdout.txt` in a text editor. The contents show the Azure Batch environment variables that are set on the node. When you create your own Batch jobs, you can reference these environment variables in task command lines, and in the apps and scripts run by the command lines.

```
AZ_BATCH_TASK_DIR=/mnt/batch/tasks/workitems/myjob-linux/job-1/mytask3
AZ_BATCH_NODE_STARTUP_DIR=/mnt/batch/tasks/startup
AZ_BATCH_CERTIFICATES_DIR=/mnt/batch/tasks/workitems/myjob-linux/job-1/mytask3/certs
AZ_BATCH_ACCOUNT_URL=https://mybatchaccount.eastus.batch.azure.com/
AZ_BATCH_TASK_WORKING_DIR=/mnt/batch/tasks/workitems/myjob-linux/job-1/mytask3/wd
AZ_BATCH_NODE_SHARED_DIR=/mnt/batch/tasks/shared
AZ_BATCH_TASK_USER=_azbatch
AZ_BATCH_NODE_ROOT_DIR=/mnt/batch/tasks
AZ_BATCH_JOB_ID=myjob-linux
AZ_BATCH_NODE_IS_DEDICATED=true
AZ_BATCH_NODE_ID=tvm-1392786932_2-20171026t223740z
AZ_BATCH_POOL_ID=mypool-linux
AZ_BATCH_TASK_ID=mytask3
AZ_BATCH_ACCOUNT_NAME=mybatchaccount
AZ_BATCH_TASK_USER_IDENTITY=PoolNonAdmin
```

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, Batch account, pools, and all related resources. Delete the resources as follows:

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you created a Batch account, a Batch pool, and a Batch job. The job ran a sample task and created output on a compute node. To learn more about Azure Batch, continue to the Azure Batch tutorials.


> [!div class="nextstepaction"]
> [Azure Batch tutorials](./tutorial-parallel-dotnet.md)
