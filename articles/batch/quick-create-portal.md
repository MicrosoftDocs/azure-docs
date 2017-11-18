---
title: Azure Quickstart - Run Batch job - Portal | Microsoft Docs
description:  Quickly learn to run a Batch job with the Azure portal.
services: batch
documentationcenter: 
author: dlepow
manager: jeconnoc
editor: 
ms.assetid: 
ms.service: batch
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 11/15/2017
ms.author: danlep
ms.custom: mvc
---

# Run your first Batch job in the portal

This quickstart shows how to use the Azure portal to create a Batch account, a *pool* of compute nodes (virtual machines), and a sample *job* that runs a *task* on the pool. This example is very basic but introduces you to the key concepts of the Batch service.

## Log in to Azure 

Log in to the Azure portal at http://portal.azure.com.

## Create Batch account

Follow these steps to create a sample Batch account for test purposes. You create compute resources (pools of compute nodes) and Batch jobs in an account. As shown in this example, you can optionally associate an Azure storage account with the Batch account, which is useful to deploy applications and store input and output data.


1. Select **New** > **Compute** > **Batch Service**. 

  ![Batch in the Marketplace][marketplace_portal]

2. Enter values for **Account name** and **Resource group**. The account name must be unique within the Azure **Location** selected, use only lowercase characters or numbers, and contain 3-24 characters. 

3. In **Storage account**, select an existing general purpose storage account or create a new one.

4. Keep the defaults for remaining settings, and click **Create** to create the account.

  ![Create a Batch account][account_portal]  



When the **Deployment succeeded** message appears, go to the Batch account in the portal.

## Create a Batch pool

Create a sample pool of Windows virtual machines for test purposes. The pool consists of 4 size A1 nodes running Windows Server 2016 from the Azure Marketplace. If you prefer a Linux pool, select one of the available Linux distributions.


1. Click **Pools** > **Add**.

2. Enter a **Pool ID**, such as *mypool-windows*. 
3. In **Operating System**, select the following settings (you can explore other options):

  * **Image Type** - Marketplace (Linux/Windows)
  
  * **Publisher** - MicrosoftWindowsServer

  * **Offer** - WindowsServer

  * **Sku** - 2016-Datacenter

  ![Select a pool operating system][pool_os] 

4. In **Node Size**, select Standard_A1. In **Target dedicated nodes**, enter 2. Keep the defaults for remaining settings, and click **OK** to create the pool.

  ![Select a pool size][pool_size] 

While the compute nodes are starting, you see a **Resizing** message. You can go ahead and schedule a job while the pool is resizing. After a few minutes, the **Allocation state** of the nodes is **Steady**. 



## Create a Batch job

A Batch job specifies a pool to run tasks on and optionally a priority and schedule for the work. The following example creates a job to run on the pool you created.

1. In the account view, click **Jobs** > **Add**. 

2. Enter a **Job ID**, such as *myjob-windows*. In **Pool**, select the pool you created. Keep the defaults for the remaining setttings, and click **OK**.

  ![Create a job][job_create]

After the job is crated, the **Tasks** page opens.

## Create tasks

Now create sample tasks to run in the job. Typically you create multiple tasks that Batch queues and distributes to run on the compute nodes. In this example you create two identical tasks. Each task is a command to wait 90 seconds and then run the `set` command on a compute nodes. This `cmd` command dispays the Windows environment variables. When you use Batch, the command line is where you specify your app or script. 

1. Click **Add**.

2. Enter a **Task ID**, such as *mytask-windows*. 

3. In **Command line**, enter `cmd /c "timeout /t 90 /nobreak > NUL & set"`. Keep the defaults for the remaining setttings, and click **OK**.

  ![Create a task][task_create]

After the task is created, it starts running on one of the nodes in the pool.

While the task runs, create a second task with an identical command line. If the first task is still running, Batch starts the second task on the other node in the pool.

> [!TIP]
> If you are running a task on a Linux pool, try a similar **Command line** like `/bin/bash -c "sleep 90s; printenv"`.
>

## View task output

The preceding task examples should complete in a couple of minutes. To view the output of one of the tasks, click **Files on node**, and then select the file stdout.txt. This file shows the standard output of the task command. The contents are similar to the following:


![View task output][task_output]

The contents show the Azure Batch environment variables that are set on the node. When you create your own Batch jobs, you can reference these environment variables in task command lines, and in the programs and scripts run by the command lines.




## Clean up resources

When no longer needed, delete the resource group, Batch account, and all related resources. To do so, select the resource group for the Batch account and click **Delete**.

## Next steps

In this quick start, you created a Batch account, a Batch pool, and a Batch job. The job ran a sample task and created output on a compute node. To learn more about Azure Batch, continue to the XXX tutorial.

> [!div class="nextstepaction"]
> [Azure Batch tutorials](./tutorial-parallel-dotnet.md)

[marketplace_portal]: ./media/quick-create-portal/marketplace-batch.png

[account_portal]: ./media/quick-create-portal/batch-account-portal.png

[pool_os]: ./media/quick-create-portal/pool-operating-system.png

[pool_size]: ./media/quick-create-portal/pool-size.png

[job_create]: ./media/quick-create-portal/job-create.png

[task_create]: ./media/quick-create-portal/task-create.png

[task_output]: ./media/quick-create-portal/task-output.png