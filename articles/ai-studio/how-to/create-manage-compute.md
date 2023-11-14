---
title: How to create and manage compute instances in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article provides instructions on how to create and manage compute instances in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# How to create and manage compute instances in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In this article, you learn how to create a compute instance in Azure AI Studio. You can create a compute instance in the Azure AI Studio or in the Azure portal. 

You need a compute instance to:
- Use prompt flow in Azure AI Studio. 
- Create an index
- Open Visual Studio Code (Web) in the Azure AI Studio.

You can use the same compute instance for multiple scenarios and workflows. Note that a compute instance can't be shared. It can only be used by a single assigned user. By default, it will be assigned to the creator and you can change this to a different user in the security step.

Compute instances can run jobs securely in a virtual network environment, without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container.

> [!IMPORTANT]
> Compute instances get the latest VM images at the time of provisioning. Microsoft releases new VM images on a monthly basis. Once a compute instance is deployed, it does not get actively updated. You could query an instance's operating system version. 
> To keep current with the latest software updates and security patches, you could: Recreate a compute instance to get the latest OS image (recommended) or regularly update OS and Python packages on the compute instance to get the latest security patches.

## Create a compute instance

To create a compute instance in Azure AI Studio:

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select your project from the **Build** page. If you don't have a project already, first create a project.
1. Under **Manage**, select **Compute instances** > **+ New**.

    :::image type="content" source="../media/compute/compute-create.png" alt-text="Screenshot of the option to create a new compute instance from the manage page." lightbox="../media/compute/compute-create.png":::

1. Enter a custom name for your compute.

    :::image type="content" source="../media/compute/compute-create.png" alt-text="Screenshot of the option to create a new compute instance from the manage page." lightbox="../media/compute/compute-create.png":::

1. Select your virtual machine type and size and then select **Next**. 

    - Virtual machine type: Choose CPU or GPU. The type can't be changed after creation.
    - Virtual machine size: Supported virtual machine sizes might be restricted in your region. Check the [availability list](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines)
    
    For more information on configuration details such as CPU and RAM, see [Azure Machine Learning pricing](https://azure.microsoft.com/pricing/details/machine-learning/) and [virtual machine sizes](/azure/virtual-machines/sizes).

1. On the **Scheduling** page under **Auto shut down** make sure idle shutdown is enabled by default. You can opt to automatically shut down compute after the instance has been idle for a set amount of time. If you disable auto shutdown costs will continue to accrue even during periods of inactivity. For more information, see [Configure idle shutdown](#configure-idle-shutdown).

    :::image type="content" source="../media/compute/compute-scheduling.png" alt-text="Screenshot of the option to enable idle shutdown and create a schedule." lightbox="../media/compute/compute-scheduling.png":::

1. You can update the schedule days and times to meet your needs. You can also add additional schedules. For example, you can create a schedule to start at 9 AM and stop at 6 PM from Monday-Thursday, and a second schedule to start at 9 AM and stop at 4 PM for Friday. You can create a total of four schedules per compute instance.

    :::image type="content" source="../media/compute/compute-schedule-add.png" alt-text="Screenshot of the available new schedule options." lightbox="../media/compute/compute-schedule-add.png":::

1. On the **Security** page you can optionally configure security settings such as SSH, virtual network, root access, and managed identity for your compute instance. Use this section to:
    - **Assign to another user**: You can create a compute instance on behalf of another user. Note that a compute instance can't be shared. It can only be used by a single assigned user. By default, it will be assigned to the creator and you can change this to a different user.
    - **Assign a managed identity**: You can attach system assigned or user assigned managed identities to grant access to resources. The name of the created system managed identity will be in the format `/workspace-name/computes/compute-instance-name` in your Microsoft Entra ID.
    - **Enable SSH access**: Enter credentials for an administrator user account that will be created on each compute node. These can be used to SSH to the compute nodes.
Note that disabling SSH prevents SSH access from the public internet. But when a private virtual network is used, users can still SSH from within the virtual network.
    - **Enable virtual network**:
        - If you're using an Azure Virtual Network, specify the Resource group, Virtual network, and Subnet to create the compute instance inside an Azure Virtual Network. You can also select No public IP to prevent the creation of a public IP address, which requires a private link workspace. You must also satisfy these network requirements for virtual network setup.
        - If you're using a managed virtual network, the compute instance is created inside the managed virtual network. You can also select No public IP to prevent the creation of a public IP address. For more information, see managed compute with a managed network.

1. On the **Applications** page you can add custom applications to use on your compute instance, such as RStudio or Posit Workbench. Then select **Next**.
1. On the **Tags** page you can add additional information to categorize the resources you create. Then select **Review + Create** or **Next** to review your settings.

    :::image type="content" source="../media/compute/compute-review-create.png" alt-text="Screenshot of the option to review before creating a new compute instance." lightbox="../media/compute/compute-review-create.png":::

1. After reviewing the settings, select **Create** to create the compute instance.

## Configure idle shutdown

To avoid getting charged for a compute instance that is switched on but inactive, you can configure when to shut down your compute instance due to inactivity. 

The setting can be configured during compute instance creation or for existing compute instances.

For new compute instances, you can configure idle shutdown during compute instance creation. For more information, see [Create a compute instance](#create-a-compute-instance) earlier in this article.

To configure idle shutdown for existing compute instances follow these steps:

1. From the top menu, select **Manage** > **Compute instances**.
1. In the list, select the compute instance that you want to configure.
1. Select **Schedule and idle shutdown**.

    :::image type="content" source="../media/compute/compute-schedule-update.png" alt-text="Screenshot of the option to change the idle shutdown schedule for a compute instance." lightbox="../media/compute/compute-schedule-update.png":::

1. Update or add to the schedule. You can have a total of four schedules per compute instance. Then select **Update** to save your changes.


## Start or stop a compute instance

You can start or stop a compute instance from the Azure AI Studio.

1. From the top menu, select **Manage** > **Compute instances**.
1. In the list, select the compute instance that you want to configure.
1. Select **Stop** to stop the compute instance. Select **Start** to start the compute instance. Only stopped compute instances can be started and only started compute instances can be stopped.

    :::image type="content" source="../media/compute/compute-start-stop.png" alt-text="Screenshot of the option to start or stop a compute instance." lightbox="../media/compute/compute-start-stop.png":::


## Next steps

- [Create and manage prompt flow runtimes](./create-manage-runtime.md)
