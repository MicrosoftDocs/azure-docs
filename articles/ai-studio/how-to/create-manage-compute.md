---
title: How to create and manage compute instances in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article provides instructions on how to create and manage compute instances in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: deeikele
ms.author: sgilley
author: sdgilley
---

# How to create and manage compute instances in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn how to create a compute instance in Azure AI Studio. You can create a compute instance in the Azure AI Studio or in the Azure portal. 

You need a compute instance to:
- Use prompt flow in Azure AI Studio. 
- Create an index
- Open Visual Studio Code (Web or Desktop) in Azure AI Studio.

You can use the same compute instance for multiple scenarios and workflows. A compute instance can't be shared. It can only be used by a single assigned user. By default, it is assigned to the creator. You can change the assignment to a different user in the security step during creation.

Compute instances can run jobs securely in a virtual network environment, without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container.

> [!IMPORTANT]
> Compute instances get the latest VM images at the time of provisioning. Microsoft releases new VM images on a monthly basis. Once a compute instance is deployed, it does not get actively updated. You could query an instance's operating system version. 
> To keep current with the latest software updates and security patches, you could: Recreate a compute instance to get the latest OS image (recommended) or regularly update OS and Python packages on the compute instance to get the latest security patches.

## Create a compute instance

To create a compute instance in Azure AI Studio:

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select your project. If you don't have a project already, first create one.
1. Under **Settings**, select **Create compute**.

    :::image type="content" source="../media/compute/compute-create.png" alt-text="Screenshot of the option to create a new compute instance from the manage page." lightbox="../media/compute/compute-create.png":::

1. Enter a custom name for your compute.

1. Select your virtual machine type and size and then select **Next**. 

    - Virtual machine type: Choose CPU or GPU. The type can't be changed after creation.
    - Virtual machine size: Supported virtual machine sizes might be restricted in your region. Check the [availability list](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines)
    
    For more information on configuration details such as CPU and RAM, see [Azure Machine Learning pricing](https://azure.microsoft.com/pricing/details/machine-learning/) and [virtual machine sizes](/azure/virtual-machines/sizes).

1. On the **Scheduling** page under **Auto shut down** make sure idle shutdown is enabled by default. You can opt to automatically shut down compute after the instance has been idle for a set amount of time. If you disable auto shutdown costs continue to accrue even during periods of inactivity. For more information, see [Configure idle shutdown](#configure-idle-shutdown).

    :::image type="content" source="../media/compute/compute-scheduling.png" alt-text="Screenshot of the option to enable idle shutdown and create a schedule." lightbox="../media/compute/compute-scheduling.png":::

    > [!IMPORTANT]
    > The compute can't be idle if you have [prompt flow compute sessions](./create-manage-compute-session.md) in **Running** status on the compute. Delete any active compute sessions so the compute instance can be eligible for idle shutdown. You also can't have any active [VS Code (Web)](./develop/vscode.md) sessions hosted on the compute instance.

1. You can update the schedule days and times to meet your needs. You can add additional schedules. For example, create a schedule to start at 9 AM and stop at 6 PM from Monday-Thursday, and a second schedule to start at 9 AM and stop at 4 PM for Friday. You can create a total of four schedules per compute instance.

    :::image type="content" source="../media/compute/compute-schedule-add.png" alt-text="Screenshot of the available new schedule options." lightbox="../media/compute/compute-schedule-add.png":::

1. On the **Security** page, optionally configure security settings such as SSH, virtual network, root access, and managed identity for your compute instance. Use this section to:
    - **Assign to another user**: Create a compute instance on behalf of another user. A compute instance can't be shared. It can only be used by a single assigned user. By default, it will be assigned to the creator and you can change this to a different user.
    - **Assign a managed identity**: Attach system assigned or user assigned managed identities to grant access to resources. The name of the created system managed identity will be in the format `/workspace-name/computes/compute-instance-name` in your Microsoft Entra ID.
    - **Enable SSH access**: Enter credentials for an administrator user account that will be created on each compute node. These can be used to SSH to the compute nodes.

1. On the **Tags** page you can add additional information to categorize the resources you create. Then select **Review + Create** or **Next** to review your settings.

    :::image type="content" source="../media/compute/compute-review-create.png" alt-text="Screenshot of the option to review before creating a new compute instance." lightbox="../media/compute/compute-review-create.png":::

1. After reviewing the settings, select **Create** to create the compute instance.

## Configure idle shutdown

To avoid getting charged for a compute instance that is switched on but inactive, configure when to shut down your compute instance due to inactivity.

The setting can be configured during compute instance creation or modified for existing compute instances.

For a new compute instance, configure idle shutdown during compute instance creation. For more information, see [Create a compute instance](#create-a-compute-instance) earlier in this article.

To configure idle shutdown for an existing compute instance follow these steps:

1. From the left menu, select **Settings**.
1. Under **Computes**, select **View all** to see the list of available compute instances.
1. Select **Schedule and idle shutdown**.

    :::image type="content" source="../media/compute/compute-schedule-update.png" alt-text="Screenshot of the option to change the idle shutdown schedule for a compute instance." lightbox="../media/compute/compute-schedule-update.png":::

    > [!IMPORTANT]
    > The compute won't be idle if you have a [prompt flow compute session](./create-manage-compute-session.md) in **Running** status on the compute. You need to delete any active compute sessions to make the compute instance eligible for idle shutdown. You also can't have any active [VS Code (Web)](./develop/vscode.md) sessions hosted on the compute instance.

1. Update or add to the schedule. You can have a total of four schedules per compute instance. Then select **Update** to save your changes.

## Start or stop a compute instance

You can start or stop a compute instance from the Azure AI Studio.

1. From the left menu, select **Settings**.
1. Under **Computes**, select **View all** to see the list of available compute instances.
1. Select **Stop** to stop the compute instance. Select **Start** to start the compute instance. Only stopped compute instances can be started and only started compute instances can be stopped.

    :::image type="content" source="../media/compute/compute-start-stop.png" alt-text="Screenshot of the option to start or stop a compute instance." lightbox="../media/compute/compute-start-stop.png":::

## Next steps

- [Create and manage prompt flow compute session](./create-manage-compute-session.md)
- [Vulnerability management](../concepts/vulnerability-management.md)
