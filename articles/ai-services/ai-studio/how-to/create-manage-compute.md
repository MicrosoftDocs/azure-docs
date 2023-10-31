---
title: How to create and manage compute instances in Azure AI Studio
titleSuffix: Azure AI services
description: This article provides instructions on how to create and manage compute instances in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to create and manage compute instances in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In this article, you learn how to create a compute instance in Azure AI Studio. You can create a compute instance in the Azure AI Studio or in the Azure portal. 

You need a compute instance to use prompt flow with Azure AI services. You also need a compute instance to open Visual Studio Code (Web) in the Azure AI Studio. You can use the same compute instance for both purposes. Note that a compute instance can't be shared. It can only be used by a single assigned user. By default, it will be assigned to the creator and you can change this to a different user in the Security step.

Compute instances can run jobs securely in a virtual network environment, without requiring enterprises to open up SSH ports. The job executes in a containerized environment and packages your model dependencies in a Docker container.

> [!IMPORTANT]
> Compute instances get the latest VM images at the time of provisioning. Microsoft releases new VM images on a monthly basis. Once a compute instance is deployed, it does not get actively updated. You could query an instance's operating system version. 
> To keep current with the latest software updates and security patches, you could: Recreate a compute instance to get the latest OS image (recommended) or regularly update OS and Python packages on the compute instance to get the latest security patches.

## Create a compute instance

To create a compute instance in Azure AI Studio:

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select your project from the **Build** page. If you don't have a project already, first create a project.
1. Under **Manage**, select **Compute instances** > **+ New**.

    :::image type="content" source="../media/how-to/compute-create.png" alt-text="Screenshot of the option to create a new compute instance from the manage page." lightbox="../media/how-to/compute-create.png":::

1. Enter a custom name for your compute.

    :::image type="content" source="../media/how-to/compute-create.png" alt-text="Screenshot of the option to create a new compute instance from the manage page." lightbox="../media/how-to/compute-create.png":::

1. Select your virtual machine type and size and then select **Next**. 

    - Virtual machine type: Choose CPU or GPU. The type can't be changed after creation.
    - Virtual machine size: Supported virtual machine sizes might be restricted in your region. Check the [availability list](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines)
    
    For more information on configuration details such as CPU and RAM, see [Azure Machine Learning pricing](https://azure.microsoft.com/pricing/details/machine-learning/) and [virtual machine sizes](/azure/virtual-machines/sizes).

1. Select Review + Create unless you want to configure advanced settings for the compute instance.
1. Select Next to go to Scheduling if you want to schedule the compute to start or stop on a recurring basis. See enable idle shutdown & add schedule sections.
1. Select Security if you want to configure security settings such as SSH, virtual network, root access, and managed identity for your compute instance. Use this section to:
    - Assign the computer to another user. For more about assigning to other users, see Create on behalf of
    - AAssign a managed identity. See Assign managed identity.
    - Enable SSH access. Follow the detailed SSH access instructions.
    - Enable virtual network:
        - If you're using an Azure Virtual Network, specify the Resource group, Virtual network, and Subnet to create the compute instance inside an Azure Virtual Network. You can also select No public IP to prevent the creation of a public IP address, which requires a private link workspace. You must also satisfy these network requirements for virtual network setup.
        - If you're using a managed virtual network, the compute instance is created inside the managed virtual network. You can also select No public IP to prevent the creation of a public IP address. For more information, see managed compute with a managed network.
    - Allow root access. (preview)
1. Select Applications if you want to add custom applications to use on your compute instance, such as RStudio or Posit Workbench. See Add custom applications such as RStudio or Posit Workbench.
1. Select Tags if you want to add additional information to categorize the compute instance.
1. Select Review + Create to review your settings.
1. After reviewing the settings, select Create to create the compute instance.

## Configure idle shutdown

To avoid getting charged for a compute instance that is switched on but inactive, you can configure when to shut down your compute instance due to inactivity.

The setting can be configured during compute instance creation or for existing compute instances.

### Configuring idle shutdown for a new compute instance

1. Select Next to advance to Scheduling after completing required settings.
1. Select Enable idle shutdown to enable or disable.
1. Specify the shutdown period when enabled.

### Configuring idle shutdown for an existing compute instance

1. In the left navigation bar, select Compute
1. In the list, select the compute instance you wish to change
1. Select the Edit pencil in the Schedules section.
1. Screenshot: Edit idle time for a compute instance.

### Schedule automatic start and stop

Define multiple schedules for autoshutdown and autostart. For instance, create a schedule to start at 9 AM and stop at 6 PM from Monday-Thursday, and a second schedule to start at 9 AM and stop at 4 PM for Friday. You can create a total of four schedules per compute instance.

Prior to a scheduled shutdown, users see a notification alerting them that the Compute Instance is about to shut down. At that point, the user can choose to dismiss the upcoming shutdown event. For example, if they are in the middle of using their Compute Instance.

1. Fill out the form:
    - Enter a name for the compute instance.
        - Name is required and must be between 3 to 24 characters long.
        - Valid characters are upper and lower case letters, digits, and the - character.
        - Name must start with a letter
        - Name needs to be unique across all existing computes within an Azure region. You see an alert if the name you choose isn't unique
        - If `-` character is used, then it needs to be followed by at least one letter later in the name
    - Virtual machine type: Choose CPU or GPU. This type can't be changed after creation
    - Virtual machine size: Supported virtual machine sizes might be restricted in your region. Check the [availability list](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines)
1. Select Next to advance to Scheduling after completing required settings.
1. Select Add schedule to add a new schedule.
1. Select Start compute instance or Stop compute instance.
1. Select the Time zone.
1. Select the Startup time or Shutdown time.
1. Select the days when this schedule is active.
1. Select Add schedule again if you want to create another schedule.

Once the compute instance is created, you can view, edit, or add new schedules from the compute instance details section.

> [!NOTE]
> Timezone labels don't account for day light savings. For instance, (UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna is actually UTC+02:00 during day light savings.


## Assign managed identity

You can assign a system- or user-assigned managed identity to a compute instance, to authenticate against other Azure resources such as storage. Using managed identities for authentication helps improve workspace security and management. For example, you can allow users to access training data only when logged in to a compute instance. Or use a common user-assigned managed identity to permit access to a specific storage account.

You can create compute instance with managed identity from Azure AI Studio:

1. Fill out the form to [create a new compute instance](#create-a-compute-instance).
1. Select Security.
1. Enable Assign a managed identity.
1. Select System-assigned or User-assigned under Identity type.
1. If you selected User-assigned, select subscription and name of the identity.
1. Once the managed identity is created, grant the managed identity at least Storage Blob Data Reader role on the storage account of the datastore, see Accessing storage services. Then, when you work on the compute instance, the managed identity is used automatically to authenticate against datastores.

> [!NOTE]
> The name of the created system managed identity will be in the format /workspace-name/computes/compute-instance-name in your Microsoft Entra ID.


## Next steps

- [Create and manage prompt flow runtimes](./create-manage-runtime.md)
