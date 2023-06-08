---
title: 'Quickstart: Use the Azure portal to create a Batch account and run a job'
description: Follow this quickstart to use the Azure portal to create a Batch account, a pool of compute nodes, and a job that runs basic tasks on the pool.
ms.date: 04/13/2022
ms.topic: quickstart
ms.custom: mvc, mode-ui
---

# Quickstart: Use the Azure portal to create a Batch account and run a job

This quickstart shows you how to get started with Azure Batch by using the Azure portal. You create a Batch account that has a pool of virtual machines (VMs), or compute nodes. You then create and run a job with tasks that run on the pool nodes.

After you complete this quickstart, you understand the [key concepts of the Batch service](batch-service-workflow-features.md) and are ready to use Batch with more realistic, larger scale workloads.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

>[!NOTE]
>For some regions and subscription types, quota restrictions might cause Batch account or node creation to fail or not complete. In this situation, you can request a quota increase at no charge. For more information, see [Batch service quotas and limits](batch-quota-limit.md).

<a name="create-a-batch-account"></a>
## Create a Batch account and Azure Storage account

You need a Batch account to create pools and jobs. The following steps create an example Batch account. You also create an Azure Storage account to link to your Batch account. Although this quickstart doesn't use the storage account, most real-world Batch workloads use a linked storage account to deploy applications and store input and output data.

1. Sign in to the [Azure portal](https://portal.azure.com), and search for and select **batch accounts**.

   :::image type="content" source="media/quick-create-portal/marketplace-batch.png" alt-text="Screenshot of selecting Batch accounts in the Azure portal.":::

1. On the **Batch accounts** page, select **Create**.

1. On the **New Batch account** page, enter or select the following values:

   - Under **Resource group**, select **Create new**, enter the name *qsBatch*, and then select **OK**. The resource group is a logical container that holds the Azure resources for this quickstart.
   - For **Account name**, enter the name *mybatchaccount*. The Batch account name must be unique within the Azure region you select, can contain only lowercase letters and numbers, and must be between 3-24 characters.
   - For **Location**, select **East US**.
   - Under **Storage account**, select the link to **Select a storage account**.

   :::image type="content" source="media/quick-create-portal/new-batch-account.png" alt-text="Screenshot of the New Batch account page in the Azure portal.":::

1. On the **Create storage account** page, under **Name**, enter **mybatchstorage**. Leave the other settings at their defaults, and select **OK**.

1. Select **Review + create** at the bottom of the **New Batch account** page, and when validation passes, select **Create**.

1. When the **Deployment succeeded** message appears, select **Go to resource** to go to the Batch account that you created.

## Create a pool of compute nodes

Next, create a pool of Windows compute nodes in your Batch account. The following steps create a pool that consists of two Standard_A1_v2 size VMs running Windows Server 2019. This node size offers a good balance of performance versus cost for this quickstart.

1. On your Batch account page, select **Pools** from the left navigation.

1. On the **Pools** page, select **Add**.

1. On the **Add pool** page, for **Name**, enter *myPool*.

1. Under **Operating System**, select the following settings:
   - **Publisher**: Select **microsoftwindowsserver**.
   - **Sku**: Select **2019-datacenter-core-smalldisk**.

1. Scroll down to **Node size**, and for **VM size**, select **Standard_A1_v2**.

1. Under **Scale**, for **Target dedicated nodes**, enter *2*.

1. Accept the defaults for the remaining settings, and select **OK** at the bottom of the page.

Batch creates the pool immediately, but takes a few minutes to allocate and start the compute nodes. On the **Pools** page, you can select **myPool** to go to the **myPool** page and see the pool status of **Resizing** under **Essentials** > **Allocation state**. You can proceed to create a job and tasks while the pool state is still **Resizing** or **Starting**.

After a few minutes, the **Allocation state** changes to **Steady**, and the nodes start. To check the state of the nodes, select **Nodes** in the **myPool** page left navigation. When a node's state is **Idle**, it's ready to run tasks.

## Create a job

Now create a job to run on the pool. A Batch job is a logical group of one or more tasks. The job includes settings common to the tasks, such as priority and the pool to run tasks on. The job doesn't have tasks until you create them.

1. On the **mybatchaccount** page, select **Jobs** from the left navigation.

1. On the **Jobs** page, select **Add**.

1. On the **Add job** page, for **Job ID**, enter *myJob*.

1. Select **Select pool**, and on the **Select pool** page, select **myPool**, and then select **Select**.

1. On the **Add job** page, select **OK**. Batch creates the job and lists it on the **Jobs** page.

## Create tasks

Jobs can contain multiple tasks that Batch queues and distributes to run on the compute nodes. Batch provides several ways to deploy apps and scripts to compute nodes. When you create a task, you specify your app or script in a command line. 

The following procedure creates and runs two identical tasks in your job. Each task runs a command line that displays the Batch environment variables on the compute node, and then waits 90 seconds.

1. On the **Jobs** page, select **myJob**.

1. On the **Tasks** page, select **Add**.

1. On the **Add task** page, for **Task ID**, enter *myTask1*.

1. In **Command line**, enter `cmd /c "set AZ_BATCH & timeout /t 90 > NUL"`.

1. Accept the defaults for the remaining settings, and select **Submit**.

1. Repeat the preceding steps to create a second task, but enter *myTask2* for **Task ID**.

After you create each task, Batch queues it to run on the pool. Once a node is available, the task runs on the node. In the quickstart example, if the first task is still running on one node, Batch starts the second task on the other node in the pool.

## View task output

The tasks should complete in a couple of minutes. To update task status, select **Refresh** at the top of the **Tasks** page.

To view the output of a completed task, you can select the task from the **Tasks** page. On the **myTask1** page, select the *stdout.txt* file to view the standard output of the task.

:::image type="content" source="media/quick-create-portal/task-page.png" alt-text="Screenshot of a task page for a completed Batch job.":::

The contents of the *stdout.txt* file are similar to the following example:

:::image type="content" source="media/quick-create-portal/task-output.png" alt-text="Screenshot of the standard output file from a completed task.":::

The standard output for this task shows the Azure Batch environment variables that are set on the node. As long as this node exists, you can refer to these environment variables in Batch job task command lines, and in the apps and scripts the command lines run.

## Clean up resources

If you want to continue with Batch tutorials and samples, you can use the Batch account and linked storage account that you created in this quickstart. There's no charge for the Batch account itself.

Pools and nodes incur charges while the nodes are running, even if they aren't running jobs. When you no longer need a pool, delete it.

To delete a pool:

1. On your Batch account page, select **Pools** from the left navigation.
1. On the **Pools** page, select the pool to delete, and then select **Delete**.
1. On the **Delete pool** screen, enter the name of the pool, and then select **Delete**.

Deleting a pool deletes all task output on the nodes, and the nodes themselves.

When you no longer need any of the resources you created for this quickstart, you can delete the resource group and all its resources, including the storage account, Batch account, and node pools. To delete the resource group, select **Delete resource group** at the top of the **qsBatch** resource group page. On the **Delete a resource group** screen, enter the resource group name *qsBatch*, and then select **Delete**.

## Next steps

In this quickstart, you created a Batch account and pool, and created and ran a Batch job and tasks. You monitored node and task status, and viewed task output from the nodes.

Now that you understand the key concepts of the Batch service, you're ready to use Batch with more realistic, larger scale workloads. To learn more about Azure Batch, continue to the Azure Batch tutorials.

> [!div class="nextstepaction"]
> [Azure Batch tutorials](./tutorial-parallel-dotnet.md)
