---
title: Azure Quickstart - Run Batch job - Portal 
description:  Quickly learn to run a Batch job with the Azure portal.
services: batch
author: dlepow
manager: jeconnoc

ms.service: batch
ms.devlang: na
ms.topic: quickstart
ms.date: 01/10/2018
ms.author: danlep
ms.custom: mvc
---

# Run your first Batch job in the portal

This quickstart shows how to use the Azure portal to create a Batch account, a *pool* of compute nodes (virtual machines), and a *job* that runs *tasks* on the pool. The pool in this example contains Windows VMs, but Batch also supports Linux pools to run Linux jobs. Each sample task displays environment variables set by Batch on a compute node. This example is basic but introduces you to key concepts of the Batch service. 

## Log in to Azure 

Log in to the Azure portal at https://portal.azure.com.

## Create Batch account

Follow these steps to create a sample Batch account for test purposes. You need an account to create Batch pools and Batch jobs. As shown here, you can link an Azure storage account with the Batch account. Although not required for this quickstart, the storage account is useful to deploy applications and store input and output data for most real-world workloads.


1. Click **Create a resource** > **Compute** > **Batch Service**. 

  ![Batch in the Marketplace][marketplace_portal]

2. Enter values for **Account name** and **Resource group**. The account name must be unique within the Azure **Location** selected, use only lowercase characters or numbers, and contain 3-24 characters. 

3. In **Storage account**, select an existing general-purpose storage account or create a new one.

4. Keep the defaults for remaining settings, and click **Create** to create the account.

  ![Create a Batch account][account_portal]  


When the **Deployment succeeded** message appears, go to the Batch account in the portal.

## Create a Batch pool

Create a sample pool of Windows VMs for test purposes. The pool for this quick example consists of 2 size *Standard_A1* nodes running Windows Server 2012 R2 Datacenter from the Azure Marketplace. 


1. In the Batch account, click **Pools** > **Add**.

2. Enter a **Pool ID**, such as *mypool*. 
3. In **Operating System**, select the following settings (you can explore other options):

  * **Image Type** - Marketplace (Linux/Windows)
  
  * **Publisher** - MicrosoftWindowsServer

  * **Offer** - WindowsServer

  * **Sku** - 2012-R2-Datacenter

  ![Select a pool operating system][pool_os] 

4. Scroll down to add **Node Size** and **Scale** settings:
  * In **Node pricing tier**, select *Standard_A1*. This size offers a good balance of performance versus cost for this quick example.
  * In **Target dedicated nodes**, enter 2. 

  ![Select a pool size][pool_size] 

5. Keep the defaults for remaining settings, and click **OK** to create the pool.

The pool is created immediately, but it takes a few minutes to create the pool nodes. During this time, the pool's **Allocation state** is **Resizing**. You can go ahead and create a job and tasks while the pool is resizing. After a few minutes, the state of the pool is **Steady**, and the nodes start. When the state of the nodes is **Idle**, they are ready to run tasks. 



## Create a Batch job

A Batch job is a logical grouping of one or more tasks. A job includes settings common to the tasks, such as priority and the pool to run tasks on. 

 The following example creates a job on the pool you created. Initially the job has no tasks.

1. In the account view, click **Jobs** > **Add**. 

2. Enter a **Job ID**, such as *myjob*. In **Pool**, select the pool you created. Keep the defaults for the remaining settings, and click **OK**.

  ![Create a job][job_create]

After the job is created, the **Tasks** page opens.

## Create tasks

Now create sample tasks to run in the job. Typically you create multiple tasks that Batch queues and distributes to run on the compute nodes. In this example, you create two identical tasks. Each task runs a **Command line** to display the Batch environment variables on a compute node, and then waits 90 seconds. 

When you use Batch, the **Command line** is where you specify your app or script. Batch provides a number of ways to deploy apps and scripts to compute nodes. 

To create the first task:

1. Click **Add**.

2. Enter a **Task ID**, such as *mytask*. 

3. In **Command line**, enter `cmd /c "set AZ_BATCH & timeout /t 90 > NUL"`. Keep the defaults for the remaining settings, and click **OK**.

  ![Create a task][task_create]

After you create a task, Batch queues it to run on the pool. Once a node is available to run it, the task runs.

To create a second task, go back to step 1. Enter a different **Task ID**, but specify an identical command line. If the first task is still running, Batch starts the second task on the other node in the pool.

## View task output

The preceding task examples complete in a couple of minutes. To view the output of one of the tasks, click **Files on node**, and then select the file `stdout.txt`. This file shows the standard output of the task. The contents are similar to the following:


![View task output][task_output]

The contents show the Azure Batch environment variables that are set on the node. When you create your own Batch jobs and tasks, you can reference these environment variables in task command lines, and in the apps and scripts run by the command lines.




## Clean up resources

If you want to continue with Batch tutorials and samples, you can use the Batch account and linked storage account created in this quickstart. There is no charge for the Batch account itself.

You are charged for pools while the nodes are running, even if no jobs are scheduled. When you no longer need a pool, delete it. In the account view, click **Pools** and the name of the pool. Then click **Delete**.


When no longer needed, delete the resource group, Batch account, and all related resources. To do so, select the resource group for the Batch account and click **Delete resource group**.

## Next steps

In this quickstart, you created a Batch account, a Batch pool, and a Batch job. The job ran sample tasks, and you viewed output created on one of the nodes. To learn more about Azure Batch, continue to the Batch tutorials.

> [!div class="nextstepaction"]
> [Azure Batch tutorials](./tutorial-parallel-dotnet.md)

[marketplace_portal]: ./media/quick-create-portal/marketplace-batch.png

[account_portal]: ./media/quick-create-portal/batch-account-portal.png

[account_keys]: ./media/quick-create-portal/batch-account-keys.png

[pool_os]: ./media/quick-create-portal/pool-operating-system.png

[pool_size]: ./media/quick-create-portal/pool-size.png

[job_create]: ./media/quick-create-portal/job-create.png

[task_create]: ./media/quick-create-portal/task-create.png

[task_output]: ./media/quick-create-portal/task-output.png