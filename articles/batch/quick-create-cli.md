---
title: Azure Quickstart - Run Batch job - CLI | Microsoft Docs
description: Quickly learn to run a Batch job with the Azure CLI.
services: batch
documentationcenter: 
author: dlepow
manager: jeconnoc
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: azurecli
ms.topic: quickstart
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 11/15/2017
ms.author: danlep
ms.custom: mvc
---

# Run your first Batch job with the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows how to use the Azure CLI to create a Batch account, a *pool* of compute nodes (virtual machines), and a sample *job* that runs a set of parallel *tasks* on the pool. This example is very basic but introduces you to the key concepts of the Batch service.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a storage account

As shown in this quickstart, you can optionally associate an Azure general purpose storage account with your Batch account. The storage account is useful to deploy applications and store input and output data. Create a storage acccount in your resource group with the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command.

```azurecli-interactive
az storage account create --resource-group myResourceGroup --name myStorageAccount --location eastus --sku Standard_LRS
```


## Create a Batch account

Create a Batch account with the [az batch account create](/cli/azure/batch/account#az_batch_account_create) command. You create compute resources (pools of compute nodes) and Batch jobs in an account.

The following example creates a Batch account named *myBatchAccount* in *myResourceGroup*, and links the storage account you created.  

```azurecli-interactive 
az batch account create --name myBatchAccount --storage-account myStorageAccount --resource-group myResourceGroup --location eastus
```

Log in to the account with the [az batch account login](/cli/azure/batch/account#az_batch_account_login) command. This example uses shared key authentication, based on the Batch account key. After you log in, you create and manage resources in that account.

```azurecli-interactive 
az batch account login --name myBatchAccount --resource-group myResourceGroup --shared-key-auth
```

## Create a Batch pool 

Create a pool of VMs for Batch using the [az batch pool create](/cli/azure/batch/pool#az_batch_pool_create) command. The following example creates a pool named *mypool-linux* of 4 size A1_V2 nodes running Ubuntu 16.04 LTS.
 
```azurecli-interactive
az batch pool create --id mypool-linux --vm-size standard_a1_v2 --target-dedicated-nodes 4 --image canonical:ubuntuserver:16.04.0-LTS    --node-agent-sku-id "batch.node.ubuntu 16.04" 
```

The following example creates a pool named *mypool-windows* of 4 size A1_V2 nodes running Windows Server 2016 Datacenter.

```azurecli-interactive
az batch pool create --id mypool-windows --vm-size standard_a1_v2 --target-dedicated-nodes 4 --image MicrosoftWindowsServer:WindowsServer:2016-Datacenter    --node-agent-sku-id "batch.node.windows amd64" 
```

It can take a few minutes to provision the pool resources. To see the status of the pool, run the [az batch pool show](/cli/azure/batch/pool#az_batch_pool_show) command. For example, the following command shows the *mypool-linux* pool:

```azurecli-interactive
az batch pool show --pool-id mypool-linux -o table
```

You can go ahead and schedule a job while the pool is resizing. The pool is completely provisioned when the `allocationState` is `Steady`. 

## Create a Batch job

Create a Batch job by using the [az batch job create](/cli/azure/batch/job#az_batch_job_create) command. A job specifies a pool to run tasks on and optionally a priority and schedule for the work. The following example creates a job *myjob-linux* to run on the pool *mypool-linux*.

```azurecli-interactive 
az batch job create --id myjob-linux --pool-id mypool-linux
```

The following example creates a job *myjob-windows* to run on the pool *mypool-windows*.

```azurecli-interactive 
az batch job create --id myjob-windows --pool-id mypool-windows
```


## Create tasks

Now use the [az batch task create](/cli/azure/batch/task#az_batch_task_create) command to create some tasks to run in the job. In this example, the task is a bash command line that runs the `printenv` command to show environment variables on a Linux compute node. When you use Batch, this command line is where you specify your app or script.

The following script creates 4 parallel tasks (*testtask1* to *testtask4*), which Batch distributes to the Linux pool nodes.

```azurecli-interactive 
for i in {1..4}
do
   az batch task create --task-id mytask$i --job-id myjob-linux --command-line "/bin/bash -c \"printenv\""
done
```

The following script creates tasks to run the `set` command on the Windows pool nodes:

```azurecli-interactive
for i in {1..4}
do
    az batch task create --task-id mytask$i --job-id myjob-windows --command-line "cmd /c \"set\""
done
```
## View task status

Use the [az batch task show](/cli/azure/batch/task#az_batch_task_show) command to view the status of the Batch tasks. The following example shows the status of *mytask3* running on one of the Linux pool nodes.

```azurecli-interactive 
az batch task show --job-id myjob-linux --task-id mytask3
```

The command output includes many details, but take note of the `exitCode` and the `nodeId`. An `exitCode` of 0 indicates that the task completed successfully. The `nodeId` indicates the ID of the pool node on which the task ran.



## View task output

Use the [az batch task file list](/cli/azure/batch/task#az_batch_task_file_list) command to list the files created by one of the Batch tasks. The following command lists the files created by *mytask3* on the Linux pool: 

```azurecli-interactive 
az batch task file list --job-id myjob-linux --task-id mytask3 -o table
```

Output is similar to the following:

```
Name        URL                                                                                         Is Directory      Content Length
----------  ------------------------------------------------------------------------------------------  --------------  ----------------
stdout.txt  https://mybatchaccount.eastus.batch.azure.com/jobs/myjob-linux/tasks/mytask3/files/stdout.txt  False                  1021
certs       https://mybatchaccount.eastus.batch.azure.com/jobs/myjob-linux/tasks/mytask3/files/certs       True
wd          https://mybatchaccount.eastus.batch.azure.com/jobs/myjob-linux/tasks/mytask3/files/wd          True
stderr.txt  https://mybatchaccount.eastus.batch.azure.com/jobs/myjob-linux/tasks/mytask3/files/stderr.txt  False                     0

```

Use the [az batch task file download](/cli/azure/batch/task#az_batch_task_file_download) command to download one of the output files to a local directory. This task returns its output in `stdout.txt`. 

```azurecli-interactive
az batch task file download --job-id myjob-linux --task-id mytask3 --file-path stdout.txt --destination ./stdout.txt
```

You can view the contents of `stdout.txt` in a text editor. The contents show the Azure Batch environment variables that are set on the node. When you create your own Batch jobs, you can reference these environment variables in task command lines, and in the programs and scripts run by the command lines.

```
AZ_BATCH_TASK_DIR=/mnt/batch/tasks/workitems/myjob-linux/job-1/mytask3
USER=_azbatch
AZ_BATCH_NODE_STARTUP_DIR=/mnt/batch/tasks/startup
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/mnt/batch/tasks/shared:/mnt/batch/tasks/workitems/myjob-linux/job-1/mytask3/wd
AZ_BATCH_CERTIFICATES_DIR=/mnt/batch/tasks/workitems/myjob-linux/job-1/mytask3/certs
PWD=/mnt/batch/tasks/workitems/myjob-linux/job-1/mytask3/wd
AZ_BATCH_ACCOUNT_URL=https://mybatchaccount.eastus.batch.azure.com/
AZ_BATCH_TASK_WORKING_DIR=/mnt/batch/tasks/workitems/myjob-linux/job-1/mytask3/wd
AZ_BATCH_NODE_SHARED_DIR=/mnt/batch/tasks/shared
SHLVL=1
HOME=/mnt/batch/tasks/workitems/myjob-linux/job-1/mytask3/wd
AZ_BATCH_TASK_USER=_azbatch
AZ_BATCH_NODE_ROOT_DIR=/mnt/batch/tasks
AZ_BATCH_JOB_ID=myjob-linux
AZ_BATCH_NODE_IS_DEDICATED=true
AZ_BATCH_NODE_ID=tvm-1392786932_2-20171026t223740z
AZ_BATCH_POOL_ID=mypool-linux
AZ_BATCH_TASK_ID=mytask3
AZ_BATCH_ACCOUNT_NAME=mybatchaccount
AZ_BATCH_TASK_USER_IDENTITY=PoolNonAdmin
_=/usr/bin/printenv

```

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, batch account, pools, and all related resources. Delete the resources as follows:

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Next steps

In this quick start, you created a Batch account, a Batch pool, and a Batch job. The job ran a sample task and created output on a compute node. To learn more about Azure Batch, continue to the XXX tutorial.


> [!div class="nextstepaction"]
> [Azure Batch tutorials](./tutorial-parallel-dotnet.md)
