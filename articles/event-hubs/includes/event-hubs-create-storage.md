---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 10/16/2018
ms.author: spelluru
ms.custom: "include file"

---

### Create a storage account for Event Processor Host
The Event Processor Host is an intelligent agent that simplifies receiving events from Event Hubs by managing persistent checkpoints and parallel receives. For checkpointing, the Event Processor Host requires a storage account. The following example shows how to create a storage account and how to get its keys for access:

1. From the Azure portal menu, select **Create a resource**.

    ![Create a resource menu item, Microsoft Azure portal](./media/event-hubs-create-storage/create-resource.png)

2. Select **Storage** > **Storage account**.
   
    ![Select Storage account, Microsoft Azure portal](./media/event-hubs-create-storage/select-storage-account.png)

3. On the **Create storage account** page, take the following steps: 

   1. Enter the **Storage account name**.
   2. Choose an Azure **Subscription** that contains the event hub.
   3. Choose or create the **Resource group** that has the event hub.
   4. Pick a **Location** in which to create the resource. 
   5. Select **Review + create**.
   
        ![Review + create, Create storage account, Microsoft Azure portal](./media/event-hubs-create-storage/review-create.png)

4. On the **Review + create** page, review the values, and select **Create**. 

    ![Review storage account settings and create, Microsoft Azure portal](./media/event-hubs-create-storage/create-storage-account.png)
5. After you see the **Deployments Succeeded** message in your notifications, select **Go to resource** to open the Storage Account page. Alternatively, you can expand **Deployment details** and then select your new resource from the resource list.  

    ![Go to resource, storage account deployment, Microsoft Azure portal](./media/event-hubs-create-storage/go-to-resource.png) 
6. Select **Containers**.

    ![Select the Blobs container service, storage accounts, Microsoft Azure portal](./media/event-hubs-create-storage/select-blob-container-service.png)
7. Select **+ Container** at the top, enter a **Name** for the container, and select **OK**. 

    ![Create a new blob container, storage accounts, Microsoft Azure portal](./media/event-hubs-create-storage/create-new-blob-container.png)
8. Choose **Access keys** from the **Storage account** page menu, and copy the value of **key1**.

    Save the following values to Notepad or some other temporary location.
    - Name of the storage account
    - Access key for the storage account
    - Name of the container
