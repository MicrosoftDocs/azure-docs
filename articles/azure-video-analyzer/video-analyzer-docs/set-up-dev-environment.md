---
title: How to develop with Azure Video Analyzer
description: This topic explains how to set up Azure Video Analyzer for development
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 05/25/2021
---

# How-To: Set up Azure Video Analyzer for development
In this how-to guide, you will learn how to set up Azure Video Analyzer piece-by-piece. You will create an Azure Video Analyzer account and its accompanying resources using the Azure portal.
In addition to creating your Video Analyzer account, you will be creating managed identities, a storage account, an IoT hub.
You will also be deploying the Video Analyzer edge module.

## Prerequisite

* An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).  
[!INCLUDE [the video analyzer account and storage account must be in the same subscription and region](./includes/note-account-storage-same-subscription.md)]
* An x86-64 or an ARM64 device running one of the [supported Linux operating systems](../../iot-edge/support.md#operating-systems)
* [Create and setup IoT Hub](../../iot-hub/iot-hub-create-through-portal.md)
* [Register IoT Edge device](../../iot-edge/how-to-register-device.md)
* [Install the Azure IoT Edge runtime on Debian-based Linux systems](../../iot-edge/how-to-install-iot-edge.md)

## Creating resources on IoT Edge device
Azure Video Analyzer module should be configured to run on the IoT Edge device with a non-privileged local user account. The module needs certain local folders for storing application configuration data. For this how-to guide we are leveraging a [RTSP simulator](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) that relays a video feed in real time to AVA module for analysis. This simulator takes as input pre-recorded video files from an input directory. The following script will prepare your device to be able to be used with our quickstarts and tutorials.

https://aka.ms/ava/prepare-device

`bash -c "$(curl -sL https://aka.ms/ava-edge/prep_device)"`

The prep-device script used above automates the task of creating input and configuration folders, downloading video input files, and creating user accounts with correct privileges. Once the command finishes successfully, you should see the following folders created on your edge device. 

* `/home/localedgeuser/samples`
* `/home/localedgeuser/samples/input`
* `/var/lib/videoanalyzer`
* `/var/media`

    Note the video files ("*.mkv") in the /home/localedgeuser/samples/input folder, which are used to simulate live video. 
## Creating Azure Resources
The next step is to create the required Azure resources (Video Analyzer account, storage account, user-assigned managed identity), registering a Video Analyzer edge module with the Video Analyzer account

When you create an Azure Video Analyzer account, you have to associate an Azure storage account with it. If you use Video Analyzer to record the live video from a camera, that data is stored as blobs in a container in the storage account. You must use a managed identity to grant the Video Analyzer account the appropriate access to the storage account as follows.


### User assigned managed identity for Video Analyzer

To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role assignment.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to create the user-assigned managed identity.
1. In the search box, type *Managed Identities*, and under **Services**, click **Managed Identities**.
1. Click **Add** and enter values in the following fields under **Create user assigned managed** identity pane:
    - **Subscription**: Choose the subscription to create the user-assigned managed identity under.
    - **Resource group**: Choose a resource group to create the user-assigned managed identity in or click **Create new** to create a new resource group.
    - **Region**: Choose a region to deploy the user-assigned managed identity, for example **West US**.
    - **Name**: This is the name for your user-assigned managed identity, for example UAI1.
    ![Create a user-assigned managed identity](../../active-directory/managed-identities-azure-resources/media/how-to-manage-ua-identity-portal/create-user-assigned-managed-identity-portal.png)
1. Click **Review + create** to review the changes.
1. Click **Create**.

1. Create an Azure storage account

   [!INCLUDE [the video analyzer account and storage account must be in the same subscription and region](./includes/note-account-storage-same-subscription.md)]

1. Add the [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) and [Reader](../../role-based-access-control/built-in-roles.md#reader) roles for the above storage account to the managed identity.


### Create a Video Analyzer account in the Azure portal

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. Using the search bar at the top, enter **Video Analyzer**.
1. Click on *Video Analyzers* under *Services*.
1. Click **Add**.
1. In the **Create Video Analyzer account** section enter required values.

    | Name | Description |
    | ---|---|
    |**Subscription**|If you have more than one subscription, select one from the list of Azure subscriptions that you have access to. You must select the same subscription as the storage account that you created in the previous section.|
    |**Resource Group**|Select the same resource group as the storage account that you created in the previous section. A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](/azure/azure-resource-manager/management/overview.md#resource-groups).|
    |**Video Analyzer account name**|Enter the name of the new Video Analyzer account. A Video Analyzer account name is all lowercase letters or numbers with no spaces, and is 3 to 24 characters in length.|
    |**Location**|Select the same geographic region as the storage account that you created in the previous section. This georgraphic region will be used to store the video and metadata records for your Video Analyzer account. Only the available Video Analyzer regions appear in the drop-down list box. |
    |**Storage account**|Select the storage account that you created in the previous section to provide blob storage of the video content for your Video Analyzer account. The rules for storage account names are the same as for Video Analyzer accounts.<br/>|
    |**User identity**|Select the user-assigned managed identity that you created in the previous section so that the new Video Analyzer account can use it to access the storage account. The user-assignment managed identity will be assigned the roles of [Storage Blob Data Contributor][docs-storage-access] and [Reader][docs-role-reader] for the storage account.

1. Click **Review + create** at the bottom of the form.
