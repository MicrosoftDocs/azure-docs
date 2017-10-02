---
title: Capture data from Event Hubs into Azure Data Lake Store | Microsoft Docs
description: Use Azure Data Lake Store to capture data from Event Hubs 
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 08/28/2017
ms.author: nitinme

---
# Use Azure Data Lake Store to capture data from Event Hubs

Learn how to use Azure Data Lake Store to capture data received by Azure Event Hubs.

## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **An Azure Data Lake Store account**. For instructions on how to create one, see [Get started with Azure Data Lake Store](data-lake-store-get-started-portal.md).

*  **An Event Hubs namespace**. For instructions, see [Create an Event Hubs namespace](../event-hubs/event-hubs-create.md#create-an-event-hubs-namespace). Make sure the Data Lake Store account and the Event Hubs namespace are in the same Azure subscription.


## Assign permissions to Event Hubs

In this section, you create a folder within the account where you want to capture the data from Event Hubs. You also assign permissions to Event Hubs so that it can write data into a Data Lake Store account. 

1. Open the Data Lake Store account where you want to capture data from Event Hubs and then click on **Data Explorer**.

    ![Data Lake Store data explorer](./media/data-lake-store-archive-eventhub-capture/data-lake-store-open-data-explorer.png "Data Lake Store data explorer")

2.  Click **New Folder** and then enter a name for folder where you want to capture the data.

    ![Create a new folder in Data Lake Store](./media/data-lake-store-archive-eventhub-capture/data-lake-store-create-new-folder.png "Create a new folder in Data Lake Store")

3. Assign permissions at the root of the Data Lake Store. 

    a. Click **Data Explorer**, select the root of the Data Lake Store account, and then click **Access**.

    ![Assign permissions for Data Lake Store root](./media/data-lake-store-archive-eventhub-capture/data-lake-store-assign-permissions-to-root.png "Assign permissions for Data Lake Store root")

    b. Under **Access**, click **Add**, click **Select User or Group**, and then search for `Microsoft.EventHubs`. 

    ![Assign permissions for Data Lake Store root](./media/data-lake-store-archive-eventhub-capture/data-lake-store-assign-eventhub-sp.png "Assign permissions for Data Lake Store root")
    
    Click **Select**.

    c. Under **Assign Permissions**, click **Select Permissions**. Set **Permissions** to **Execute**. Set **Add to** to **This folder and all children**. Set **Add as** to **An access permission entry and a default permission entry**.

    ![Assign permissions for Data Lake Store root](./media/data-lake-store-archive-eventhub-capture/data-lake-store-assign-eventhub-sp1.png "Assign permissions for Data Lake Store root")

    Click **OK**.

4. Assign permissions for the folder under Data Lake Store account where you want to capture data.

    a. Click **Data Explorer**, select the folder in the Data Lake Store account, and then click **Access**.

    ![Assign permissions for Data Lake Store folder](./media/data-lake-store-archive-eventhub-capture/data-lake-store-assign-permissions-to-folder.png "Assign permissions for Data Lake Store folder")

    b. Under **Access**, click **Add**, click **Select User or Group**, and then search for `Microsoft.EventHubs`. 

    ![Assign permissions for Data Lake Store folder](./media/data-lake-store-archive-eventhub-capture/data-lake-store-assign-eventhub-sp.png "Assign permissions for Data Lake Store folder")
    
    Click **Select**.

    c. Under **Assign Permissions**, click **Select Permissions**. Set **Permissions** to **Read, Write,** and **Execute**. Set **Add to** to **This folder and all children**. Finally, set **Add as** to **An access permission entry and a default permission entry**.

    ![Assign permissions for Data Lake Store folder](./media/data-lake-store-archive-eventhub-capture/data-lake-store-assign-eventhub-sp-folder.png "Assign permissions for Data Lake Store folder")
    
    Click **OK**. 

## Configure Event Hubs to capture data to Data Lake Store

In this section, you create an Event Hub within an Event Hubs namespace. You also configure the Event Hub to capture data to an Azure Data Lake Store account. This section assumes that you have already created an Event Hubs namespace.

2. From the **Overview** pane of the Event Hubs namespace, click **+ Event Hub**.

    ![Create Event Hub](./media/data-lake-store-archive-eventhub-capture/data-lake-store-create-event-hub.png "Create Event Hub")

3. Provide the following values to configure Event Hubs to capture data to Data Lake Store.

    ![Create Event Hub](./media/data-lake-store-archive-eventhub-capture/data-lake-store-configure-eventhub.png "Create Event Hub")

    a. Provide a name for the Event Hub.
    
    b. For this tutorial, set **Partition Count** and **Message Retention** to the default values.
    
    c. Set **Capture** to **On**. Set the **Time Window** (how frequently to capture) and **Size Window** (data size to capture). 
    
    d. For **Capture Provider**, select **Azure Data Lake Store** and the select the Data Lake Store you created earlier. For **Data Lake Path**, enter the name of the folder you created in the Data Lake Store account. You only need to provide the relative path to the folder.

    e. Leave the **Sample capture file name formats** to the default value. This option governs the folder structure that is created under the capture folder.

    f. Click **Create**.

## Test the setup

You can now test the solution by sending data to the Azure Event Hub. Follow the instructions at [Send events to Azure Event Hubs](../event-hubs/event-hubs-dotnet-framework-getstarted-send.md). Once you start sending the data, you see the data reflected in Data Lake Store using the folder structure you specified. For example, you see a folder structure, as shown in the following screenshot, in your Data Lake Store.

![Sample EventHub data in Data Lake Store](./media/data-lake-store-archive-eventhub-capture/data-lake-store-eventhub-data-sample.png "Sample EventHub data in Data Lake Store")

> [!NOTE]
> Even if you do not have messages coming into Event Hubs, Event Hubs writes empty files with just the headers into the Data Lake Store account. The files are written at the same time interval that you provided while creating the Event Hubs.
> 
>

## Analyze data in Data Lake Store

Once the data is in Data Lake Store, you can run analytical jobs to process and crunch the data. See [USQL Avro Example](https://github.com/Azure/usql/tree/master/Examples/AvroExamples) on how to do this using Azure Data Lake Analytics.
  

## See also
* [Secure data in Data Lake Store](data-lake-store-secure-data.md)
* [Copy data from Azure Storage Blobs to Data Lake Store](data-lake-store-copy-data-azure-storage-blob.md)
