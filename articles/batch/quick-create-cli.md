---
title: 'Quickstart: Use the Azure CLI to create a Batch account and run a job'
description: Follow this quickstart to use the Azure CLI to create a Batch account, a pool of compute nodes, and a job that runs basic tasks on the pool.
ms.topic: quickstart
ms.date: 04/12/2023
ms.custom: mvc, devx-track-azurecli, mode-api
---

# Quickstart: Use the Azure CLI to create an Azure Batch account and run a job

This quickstart shows you how to get started with Azure Batch by using Azure CLI commands. You create a Batch account that has a *pool* of virtual machines, or compute *nodes*. You then create and run a *job* with *tasks* that run on the pool nodes.

This quickstart uses the Azure CLI to create and manage Azure resources from the command line and in a script. After you complete this quickstart, you understand the [key concepts of the Batch service](batch-service-workflow-features.md) and are ready to use Batch with more realistic, larger scale workloads.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- Azure Cloud Shell or Azure CLI.

  You can run the Azure CLI commands in this quickstart interactively in Azure Cloud Shell. To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also [run Cloud Shell from within the Azure portal](https://shell.azure.com). Cloud Shell always uses the latest version of the Azure CLI.

  You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. The steps in this article require Azure CLI version 2.0.20 or later. Run [az version](/cli/azure/reference-index?#az-version) to see your installed version and dependent libraries, and run [az upgrade](/cli/azure/reference-index?#az-upgrade) to upgrade.

  If you use a local installation, sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command. If you're prompted on first use, install the Azure CLI extension.

## Create a resource group

Run the following [az group create](/cli/azure/group#az-group-create) command to create an Azure resource group named `qsBatch` in the `eastus` Azure region. The resource group is a logical container that holds the Azure resources for this quickstart.

```azurecli-interactive
az group create \
    --name qsBatch \
    --location eastus2
```

## Create a storage account

Use the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command to create an Azure Storage account to link to your Batch account. Although this quickstart doesn't use the storage account, most real-world Batch workloads use a linked storage account to deploy applications and store input and output data. Run the following command to create a `Stamdard_LRS` SKU storage account named `mybatchstorage` in your resource group:

```azurecli-interactive
az storage account create \
    --resource-group qsBatch \
    --name mybatchstorage \
    --location eastus2 \
    --sku Standard_LRS
```

## Create a Batch account

Run the following [az batch account create](/cli/azure/batch/account#az-batch-account-create) command to create a Batch account named `mybatchaccount` in your resource group and link it with the `mybatchstorage` storage account.

```azurecli-interactive
az batch account create \
    --name mybatchaccount \
    --storage-account mybatchstorage \
    --resource-group qsBatch \
    --location eastus2
```

Sign in to the new Batch account by running the [az batch account login](/cli/azure/batch/account#az-batch-account-login) command. After you authenticate with Batch, the remaining `az batch` commands use this account context to create and manage compute pools and jobs.

```azurecli-interactive
az batch account login \
    --name mybatchaccount \
    --resource-group qsBatch \
    --shared-key-auth
```

## Create a pool of compute nodes

Use the [az batch pool create](/cli/azure/batch/pool#az-batch-pool-create) command to create a pool of Linux compute nodes in your Batch account. The following example creates a pool named `myPool` that consists of two `Standard_A1_v2` size nodes running `Ubuntu 18.04 LTS` OS. The node size offers a good balance of performance versus cost for this quickstart example.

```azurecli-interactive
az batch pool create \
    --id myPool --vm-size Standard_A1_v2 \
    --target-dedicated-nodes 2 \
    --image canonical:ubuntuserver:18.04-LTS \
    --node-agent-sku-id "batch.node.ubuntu 18.04"
```

Batch creates the pool immediately, but takes a few minutes to allocate and start the compute nodes. During this time, the pool is in the `resizing` state.

To see the pool status, run the [az batch pool show](/cli/azure/batch/pool#az-batch-pool-show) command. This command shows all the properties of the pool, and you can query for specific properties. The following command shows the pool allocation state:

```azurecli-interactive
az batch pool show --pool-id myPool \
    --query "allocationState"
```

You can do the following steps to create a job and tasks while the pool state is changing. The pool is ready to run tasks when the allocation state is `steady` and all the nodes are running.

## Create a job

Use the [az batch job create](/cli/azure/batch/job#az-batch-job-create) command to create a Batch job to run on your pool. A Batch job is a logical group of one or more tasks. The job includes settings common to the tasks, such as the pool to run tasks on. The following example creates a job called `myJob` on `myPool` that initially has no tasks.

```azurecli-interactive
az batch job create \
    --id myJob \
    --pool-id myPool
```

## Create job tasks

Use the [az batch task create](/cli/azure/batch/task#az-batch-task-create) command to create some tasks to run in the job. Each task has a command line that specifies an app or script. Batch provides several ways to deploy apps and scripts to compute nodes.

The following Bash script creates four identical, parallel tasks called `myTask1` through `myTask4`. The task command line displays the Batch environment variables on the compute node, and then waits 90 seconds.


```azurecli-interactive
for i in {1..4}
do
   az batch task create \
    --task-id myTask$i \
    --job-id myJob \
    --command-line "/bin/bash -c 'printenv | grep AZ_BATCH; sleep 90s'"
done
```

The command output shows the settings for each task. Batch distributes the tasks to the compute nodes.

## View task status

After you create the task, Batch queues the task to run on the pool. Once a node is available, the task runs on the node.

Use the [az batch task show](/cli/azure/batch/task#az-batch-task-show) command to view the status of Batch tasks. The following example shows details about the status of `myTask1`:

```azurecli-interactive
az batch task show \
    --job-id myJob \
    --task-id myTask1
```

The command output includes many details, but note the `nodeId` and the task command line `exitCode`. The `nodeId` shows the name of the pool node that ran the task. An `exitCode` of `0` indicates that the task command line completed successfully.

## View task output

Use the [az batch task file list](/cli/azure/batch/task) command to list the files a task created on a node. The following command lists the files that `myTask1` created:

```azurecli-interactive
az batch task file list \
    --job-id myJob \
    --task-id myTask1 \
    --output table
```

Results are similar to the following output:

```output
Name        URL                                                                                         Is Directory      Content Length
----------  ------------------------------------------------------------------------------------------  --------------  ----------------
stdout.txt  https://mybatchaccount.eastus2.batch.azure.com/jobs/myJob/tasks/myTask1/files/stdout.txt  False                  695
certs       https://mybatchaccount.eastus2.batch.azure.com/jobs/myJob/tasks/myTask1/files/certs       True
wd          https://mybatchaccount.eastus2.batch.azure.com/jobs/myJob/tasks/myTask1/files/wd          True
stderr.txt  https://mybatchaccount.eastus2.batch.azure.com/jobs/myJob/tasks/myTask1/files/stderr.txt  False                     0

```

Use the [az batch task file download](/cli/azure/batch/task) command to download output files to a local directory. The following example downloads the *stdout.txt* file:

```azurecli-interactive
az batch task file download \
    --job-id myJob \
    --task-id myTask1 \
    --file-path stdout.txt \
    --destination ./stdout.txt
```

You can view the contents of the *stdout.txt* output file in a text editor. The following example shows a typical *stdout.txt* file. The standard output from this task shows the Azure Batch environment variables that are set on the node. You can reference these environment variables in your Batch job task command lines, and in the apps and scripts the command lines run. 

```text
AZ_BATCH_TASK_DIR=/mnt/batch/tasks/workitems/myJob/job-1/myTask1
AZ_BATCH_NODE_STARTUP_DIR=/mnt/batch/tasks/startup
AZ_BATCH_CERTIFICATES_DIR=/mnt/batch/tasks/workitems/myJob/job-1/myTask1/certs
AZ_BATCH_ACCOUNT_URL=https://mybatchaccount.eastus2.batch.azure.com/
AZ_BATCH_TASK_WORKING_DIR=/mnt/batch/tasks/workitems/myJob/job-1/myTask1/wd
AZ_BATCH_NODE_SHARED_DIR=/mnt/batch/tasks/shared
AZ_BATCH_TASK_USER=_azbatch
AZ_BATCH_NODE_ROOT_DIR=/mnt/batch/tasks
AZ_BATCH_JOB_ID=myJobl
AZ_BATCH_NODE_IS_DEDICATED=true
AZ_BATCH_NODE_ID=tvm-257509324_2-20180703t215033z
AZ_BATCH_POOL_ID=myPool
AZ_BATCH_TASK_ID=myTask1
AZ_BATCH_ACCOUNT_NAME=mybatchaccount
AZ_BATCH_TASK_USER_IDENTITY=PoolNonAdmin
```

## Clean up resources

If you want to continue with Batch tutorials and samples, you can use the Batch account and linked storage account you created in this quickstart. There's no charge for the Batch account itself.

Pools and nodes incur charges while the nodes are running, even if they aren't running jobs. When you no longer need a pool, use the [az batch pool delete](/cli/azure/batch/pool#az-batch-pool-delete) command to delete it. Deleting a pool deletes all task output on the nodes, and the nodes themselves.

```azurecli-interactive
az batch pool delete --pool-id myPool
```

When you no longer need any of the resources you created for this quickstart, you can use the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group and all its resources. To delete the resource group and the storage account, Batch account, node pools, and all related resources, run the following command:

```azurecli-interactive
az group delete --name qsBatch
```

## Next steps

In this quickstart, you created a Batch account and a Batch pool, and created and ran a Batch job. The job ran sample tasks, and you viewed output from one of the nodes. Now that you understand the key concepts of the Batch service, you're ready to use Batch with more realistic workloads at larger scale. To learn more about Azure Batch, continue to the Azure Batch tutorials.

> [!div class="nextstepaction"]
> [Azure Batch tutorials](./tutorial-parallel-dotnet.md)
