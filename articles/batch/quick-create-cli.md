---
title: Azure Quickstart - Run Batch job - CLI 
description: Quickly learn to run a Batch job with the Azure CLI. Create and manage Azure resources from the command line or in scripts.
ms.topic: quickstart
ms.date: 07/03/2018
ms.custom: mvc
---

# Quickstart: Run your first Batch job with the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows how to use the Azure CLI to create a Batch account, a *pool* of compute nodes (virtual machines), and a *job* that runs *tasks* on the pool. Each sample task runs a basic command on one of the pool nodes. After completing this quickstart, you will understand the key concepts of the Batch service and be ready to try Batch with more realistic workloads at larger scale.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus2* location.

```azurecli-interactive 
az group create \
    --name myResourceGroup \
    --location eastus2
```

## Create a storage account

You can link an Azure Storage account with your Batch account. Although not required for this quickstart, the storage account is useful to deploy applications and store input and output data for most real-world workloads. Create a storage account in your resource group with the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command.

```azurecli-interactive
az storage account create \
    --resource-group myResourceGroup \
    --name mystorageaccount \
    --location eastus2 \
    --sku Standard_LRS
```

## Create a Batch account

Create a Batch account with the [az batch account create](/cli/azure/batch/account#az-batch-account-create) command. You need an account to create compute resources (pools of compute nodes) and Batch jobs.

The following example creates a Batch account named *mybatchaccount* in *myResourceGroup*, and links the storage account you created.  

```azurecli-interactive 
az batch account create \
    --name mybatchaccount \
    --storage-account mystorageaccount \
    --resource-group myResourceGroup \
    --location eastus2
```

To create and manage compute pools and jobs, you need to authenticate with Batch. Log in to the account with the [az batch account login](/cli/azure/batch/account#az-batch-account-login) command. After you log in, your `az batch` commands use this account context.

```azurecli-interactive 
az batch account login \
    --name mybatchaccount \
    --resource-group myResourceGroup \
    --shared-key-auth
```

## Create a pool of compute nodes

Now that you have a Batch account, create a sample pool of Linux compute nodes using the [az batch pool create](/cli/azure/batch/pool#az-batch-pool-create) command. The following example creates a pool named *mypool* of 2 size *Standard_A1_v2* nodes running Ubuntu 16.04 LTS. The suggested node size offers a good balance of performance versus cost for this quick example.
 
```azurecli-interactive
az batch pool create \
    --id mypool --vm-size Standard_A1_v2 \
    --target-dedicated-nodes 2 \
    --image canonical:ubuntuserver:16.04-LTS \
    --node-agent-sku-id "batch.node.ubuntu 16.04" 
```

Batch creates the pool immediately, but it takes a few minutes to allocate and start the compute nodes. During this time, the pool is in the `resizing` state. To see the status of the pool, run the [az batch pool show](/cli/azure/batch/pool#az-batch-pool-show) command. This command shows all the properties of the pool, and you can query for specific properties. The following command gets the allocation state of the pool:

```azurecli-interactive
az batch pool show --pool-id mypool \
    --query "allocationState"
```

Continue the following steps to create a job and tasks while the pool state is changing. The pool is ready to run tasks when the allocation state is `steady` and all the nodes are running. 

## Create a job

Now that you have a pool, create a job to run on it.  A Batch job is a logical group for one or more tasks. A job includes settings common to the tasks, such as priority and the pool to run tasks on. Create a Batch job by using the [az batch job create](/cli/azure/batch/job#az-batch-job-create) command. The following example creates a job *myjob* on the pool *mypool*. Initially the job has no tasks.

```azurecli-interactive 
az batch job create \
    --id myjob \
    --pool-id mypool
```

## Create tasks

Now use the [az batch task create](/cli/azure/batch/task#az-batch-task-create) command to create some tasks to run in the job. In this example, you create four identical tasks. Each task runs a `command-line` to display the Batch environment variables on a compute node, and then waits 90 seconds. When you use Batch, this command line is where you specify your app or script. Batch provides a number of ways to deploy apps and scripts to compute nodes.

The following Bash script creates 4 parallel tasks (*mytask1* to *mytask4*).

```azurecli-interactive 
for i in {1..4}
do
   az batch task create \
    --task-id mytask$i \
    --job-id myjob \
    --command-line "/bin/bash -c 'printenv | grep AZ_BATCH; sleep 90s'"
done
```

The command output shows settings for each of the tasks. Batch distributes the tasks to the compute nodes.

## View task status

After you create a task, Batch queues it to run on the pool. Once a node is available to run it, the task runs.

Use the [az batch task show](/cli/azure/batch/task#az-batch-task-show) command to view the status of the Batch tasks. The following example shows details about *mytask1* running on one of the pool nodes.

```azurecli-interactive 
az batch task show \
    --job-id myjob \
    --task-id mytask1
```

The command output includes many details, but take note of the `exitCode` of the task command line and the `nodeId`. An `exitCode` of 0 indicates that the task command line completed successfully. The `nodeId` indicates the ID of the pool node on which the task ran.

## View task output

To list the files created by a task on a compute node, use the [az batch task file list](/cli/azure/batch/task) command. The following command lists the files created by *mytask1*: 

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
stdout.txt  https://mybatchaccount.eastus2.batch.azure.com/jobs/myjob/tasks/mytask1/files/stdout.txt  False                  695
certs       https://mybatchaccount.eastus2.batch.azure.com/jobs/myjob/tasks/mytask1/files/certs       True
wd          https://mybatchaccount.eastus2.batch.azure.com/jobs/myjob/tasks/mytask1/files/wd          True
stderr.txt  https://mybatchaccount.eastus2.batch.azure.com/jobs/myjob/tasks/mytask1/files/stderr.txt  False                     0

```

To download one of the output files to a local directory, use the [az batch task file download](/cli/azure/batch/task) command. In this example, task output is in `stdout.txt`. 

```azurecli-interactive
az batch task file download \
    --job-id myjob \
    --task-id mytask1 \
    --file-path stdout.txt \
    --destination ./stdout.txt
```

You can view the contents of `stdout.txt` in a text editor. The contents show the Azure Batch environment variables that are set on the node. When you create your own Batch jobs, you can reference these environment variables in task command lines, and in the apps and scripts run by the command lines. For example:

```
AZ_BATCH_TASK_DIR=/mnt/batch/tasks/workitems/myjob/job-1/mytask1
AZ_BATCH_NODE_STARTUP_DIR=/mnt/batch/tasks/startup
AZ_BATCH_CERTIFICATES_DIR=/mnt/batch/tasks/workitems/myjob/job-1/mytask1/certs
AZ_BATCH_ACCOUNT_URL=https://mybatchaccount.eastus2.batch.azure.com/
AZ_BATCH_TASK_WORKING_DIR=/mnt/batch/tasks/workitems/myjob/job-1/mytask1/wd
AZ_BATCH_NODE_SHARED_DIR=/mnt/batch/tasks/shared
AZ_BATCH_TASK_USER=_azbatch
AZ_BATCH_NODE_ROOT_DIR=/mnt/batch/tasks
AZ_BATCH_JOB_ID=myjobl
AZ_BATCH_NODE_IS_DEDICATED=true
AZ_BATCH_NODE_ID=tvm-257509324_2-20180703t215033z
AZ_BATCH_POOL_ID=mypool
AZ_BATCH_TASK_ID=mytask1
AZ_BATCH_ACCOUNT_NAME=mybatchaccount
AZ_BATCH_TASK_USER_IDENTITY=PoolNonAdmin
```
## Clean up resources
If you want to continue with Batch tutorials and samples, use the Batch account and linked storage account created in this quickstart. There is no charge for the Batch account itself.

You are charged for pools while the nodes are running, even if no jobs are scheduled. When you no longer need a pool, delete it with the [az batch pool delete](/cli/azure/batch/pool#az-batch-pool-delete) command. When you delete the pool, all task output on the nodes is deleted. 

```azurecli-interactive
az batch pool delete --pool-id mypool
```

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, Batch account, pools, and all related resources. Delete the resources as follows:

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you created a Batch account, a Batch pool, and a Batch job. The job ran sample tasks, and you viewed output created on one of the nodes. Now that you understand the key concepts of the Batch service, you are ready to try Batch with more realistic workloads at larger scale. To learn more about Azure Batch, continue to the Azure Batch tutorials. 


> [!div class="nextstepaction"]
> [Azure Batch tutorials](./tutorial-parallel-dotnet.md)
