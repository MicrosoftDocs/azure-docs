---
title:  | Microsoft Docs
description: Batch rendering service.
services: batch
author: tamram
manager: timlt

ms.service: batch
ms.topic: article
ms.date: 07/25/2017
ms.author: tamram
---

# Get started with the Batch rendering service

What is it

The Batch rendering service provides a plug-in for Autodesk Maya that makes it easy to submit rendering jobs through the Maya user interface.

The Batch rendering service currently supports the following rendering engines:

- Autodesk Maya
- Autodesk Arnold

## Load the Maya plug-in

The Maya plug-in is available on [GitHub](https://github.com/Azure/azure-batch-maya) (???is there an installer?). Download the latest plug-in release and extract the *azure_batch_maya* directory to a location of your choice. You can load the plug-in directly from the *azure_batch_maya* directory.

To load the plug-in in Maya:

1. Run Maya
2. Open Window > Settings/Preferences > Plug-in Manager
3. Click Browse
4. Navigate to and select azure_batch_maya/plug-in/AzureBatch.py.

## Prerequisites

To use the Maya plug-in, you need: both an Azure Batch account and an Azure Storage account.  

- **An Azure Batch account.** For guidance on creating a Batch account in the Azure portal, see [Create a Batch account with the Azure portal](batch-account-create-portal.md)]. 
- **An Azure Storage account.** You can create a storage account automatically when you set up your Batch account. You can also use an existing storage account. To learn more about Storage accounts, see [How to create, manage, or delete a storage account in the Azure portal](https://docs.microsoft.com/azure/storage/storage-create-storage-account).

## Authenticate access to your Azure Batch and Azure Storage accounts

To use the plug-in, you need to authenticate using your Azure Batch and Azure Storage account keys. To retrieve your account keys:

1. Display the plug-in in Maya, and select the **Config** tab.
2. Navigate to the [Azure portal](https://portal.azure.com).
3. Select **Batch Accounts** from the left-hand menu. If necessary, click **More Services** and filter on _Batch_.
4. Locate the desired Batch account in the list.
5. Select the **Keys** menu item to display your account name, account URL, and access keys:
    a. Paste the Batch account URL into the **Service** field in the Maya plug-in. 
    b. Paste the account name into the **Batch Account** field.
    c. Paste the primary account key into the **Batch Key** field.
5. Select Storage Accounts from the left-hand menu. If necessary, click **More Services** and filter on _Storage_.
6. Locate the desired Storage account in the list. 
7. Select the **Access Keys** menu item to display the storage account name and keys.
    a. Paste the Storage account name into the **Storage Account** field in the Maya plug-in.
    b. Paste the primary account key into the **Storage Key** field.
9. Click **Authenticate** to ensure that the plug-in can access both accounts.

Once you have successfully authenticated, the plug-in sets the status field to **Authenticated**: 

![Authenticate your Batch and Storage accounts](./media/batch-rendering-service/authentication.png)

## Submit render jobs using the Batch plug-in

Before you begin using the Batch plug-in for Maya, it's helpful to be familiar with a few Batch concepts, including compute nodes, pools, and jobs. To learn more about Azure Batch, see [Run intrinsically parallel workloads with Batch](batch-technical-overview.md).

### Compute nodes

Batch is a platform service for running compute-intensive work, like rendering, on a managed collection of Azure virtual machines (VMs). Each compute node is an Azure virtual machine (VM) running either Linux or Windows.

### Pools

Batch is a platform service for running compute-intensive work, like rendering, on a managed collection, or **pool**, of compute nodes. Each compute node is an Azure virtual machine (VM) running either Linux or Windows. 

To submit a rendering job with the Batch plug-in, you must first specify a pool to use for the job.



A Batch **pool** is a collection of compute nodes. Each compute node is an Azure virtual machine (VM) running either Linux or Windows. To submit a rendering job with the plug-in, you must first specify a pool to use for the job. You can use an existing pool, or indicate that Batch should create a pool for you.
- the type of pool that  
- 
- For more information about Batch pools, see the [Pool](/batch-api-basics.md#pool) section in [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).

### Jobs

A Batch **job** is a collection of tasks that run on the compute nodes in a pool. When you submit a rendering job, Batch divides the job into tasks and distributes the tasks to the compute nodes in the pool to run.




## Configure a pool for a render job

After you have authenticated your Batch and Storage accounts, set up a pool for your rendering job. The following sections walk you through the available options:

### Specify a new or existing pool

To specify a pool, select the **Submit** tab. This tab offers options for specifying a pool for running the render job:

- You can **auto provision a pool for this job** (the default option). When you choose this option, Batch creates the pool exclusively for the current job, and automatically shuts down (???deletes the pool?) when the render job is complete. This option is best when you have a single render job to complete.
- You can **reuse an existing persistent pool**. If you already have a pool that is idle, you can specify that pool for running the render job. Reusing an existing persistent pool saves the time required to provision the pool. Use this option when you have a continuous need to run render jobs. 
- You can **create a new persistent pool**. Choosing this option creates a new pool for running the job. It does not delete the pool when the job is complete, so that you can reuse it for future jobs.

You can also create a pool using the Azure portal. 


### Specify the OS image to provision

You can specify the type of OS image to use to provision compute nodes in the pool on the **Env** (Environment) tab. Batch currently supports the following image options for rendering jobs:

|Operating System  |Image  |
|---------|---------|
|Linux     |Batch CentOS Preview ???Names are different in portal Offer field vs plugin?         |
|Windows     |???What will appear in plug-in? I only have the screenshot....         |

### Choose a VM size

You can specify the VM size on the **Env** tab. Azure now supports [GPU](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-gpu) VMs for both Linux and Windows, which may be a good choice for rendering jobs. For more information about available VM sizes, see [Linux VM sizes in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/sizes) and [Windows VM sizes in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes). 


???What is default OS and size?
???Are all sizes supported, or only a subset? From portal, it looks like A, Av2, D, Dv2 series?
???Any other guidance for choosing the right one? Cost/performance tradeoffs?

![Specify the VM OS image and size on the Env tab](./media/batch-rendering-service/environment.png)

### Specify licensing options

You can specify the license servers you wish to use on the **Env** tab. Options include:

- **Maya**, which is enabled by default.
- **Arnold**, which is enabled if Arnold is detected as the active render engine in Maya.

 If you wish to render using your own license server, you can deselect these license options and configure your license end point by adding the appropriate environment variables to the table. 

> [!IMPORTANT]
> You are billed for use of the license servers as long as VMs are running in the pool, regardless of whether they are being used for rendering.
>
>

## Configure a render job for submission

Once you have specified the parameters for the pool that will run the render job, configure the job itself. 

### Specify scene parameters

The Batch plug-in detects which rendering engine you're currently using in Maya, and displays the appropriate render settings on the **Submit** tab based on the settings found in the scene file. These settings include the start frame, end frame, output prefix,and frame step. You can override the scene file render settings by specifying different settings in the plug-in. Changes you make to the plug-in settings are not persisted back to the scene file render settings, so you can make changes on a job-by-job basis without needing to re-upload the scene file.

The plug-in warns you if the render engine that you selected in Maya is not supported.

If you load a new scene while the plug-in is open, click the **Refresh** button to make sure the settings are updated.



![Specify the VM OS image and size on the Env tab](./media/batch-rendering-service/environment.png)
