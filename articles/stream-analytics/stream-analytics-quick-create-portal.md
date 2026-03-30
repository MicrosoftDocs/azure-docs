---
title: Create a Stream Analytics Job using Azure portal
description: This quickstart shows you how to get started by creating a Stream Analytic job, configuring inputs, outputs, and defining a query.
author: spelluru
ms.author: spelluru
ms.date: 02/19/2026
ms.topic: quickstart
ms.service: azure-stream-analytics
ms.custom:
  - mvc
  - mode-ui
  - sfi-image-nochange
#Customer intent: As an IT admin/developer, I want to create a Stream Analytics job, configure input and output, and analyze data by using the Azure portal.
---

# Quickstart: Create a Stream Analytics job by using the Azure portal
In this quickstart, you create a Stream Analytics job in the Azure portal. You define a Stream Analytics job that reads real-time streaming data and filters messages with a temperature greater than 27. The Stream Analytics job reads data from IoT Hub, transforms the data, and writes the output data to a container in an Azure blob storage. The input data used in this quickstart is generated using a Raspberry Pi online simulator. 

## Prerequisites
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Prepare the input data
Before defining the Stream Analytics job, prepare the input data. The solution ingests the real-time sensor data to IoT Hub, which you later configure as the job input. To prepare the input data required by the job, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Create a resource**. On the **Create a resource** page, select **Internet of Things** > **IoT Hub**.

    :::image type="content" source="./media/stream-analytics-quick-create-portal/iot-hub-menu.png" alt-text="Screenshot showing the IoT Hub menu on the Create a resource page." lightbox="./media/stream-analytics-quick-create-portal/iot-hub-menu.png":::
1. On **IoT Hub** page, follow these steps:
    1. For **Subscription**, select your Azure subscription.
    1. For **Resource group**, select an existing resource group or create a new resource group. 
    1. For **IoT hub name**, enter a name for your IoT hub. 
    1. For **Region**, select the region that's closest to you. 
    1. For **Tier**, select **Free**, if it's still available on your subscription. For more information, see [IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/). 
    1. For **Daily message limit**, keep the default value. 
    1. Select **Next: Networking** at the bottom of the page.

    :::image type="content" source="./media/stream-analytics-quick-create-portal/create-iot-hub.png" alt-text="Screenshot showing the IoT Hub page for creation." lightbox="./media/stream-analytics-quick-create-portal/create-iot-hub.png":::
1. Select **Review + create**. Review your IoT Hub information and select **Create**. Your IoT Hub might take a few minutes to create. You can monitor the progress in the **Notifications** pane.
1. After the resource (IoT hub) is created, select **Go to resource** to navigate to the IoT Hub page.
1. On the **IoT Hub** page, select **Devices** on the left menu, and then select **+ Add device**. 

    :::image type="content" source="./media/stream-analytics-quick-create-portal/add-device-button.png" lightbox="./media/stream-analytics-quick-create-portal/add-device-button.png" alt-text="Screenshot showing the Add device button on the Devices page.":::
1. Enter a **Device ID** and select **Save**.

    :::image type="content" source="./media/stream-analytics-quick-create-portal/add-device-iot-hub.png" alt-text="Screenshot showing the Create a device page." lightbox="./media/stream-analytics-quick-create-portal/add-device-iot-hub.png":::
1. Once the device is created, you see the device in the **IoT devices** list. Select **Refresh** button on the page if you don't see it. 

    :::image type="content" source="./media/stream-analytics-quick-create-portal/device-list.png" lightbox="./media/stream-analytics-quick-create-portal/device-list.png" alt-text="Screenshot showing the list of devices.":::    
1. Select your device from the list.
1. On the device page, select the copy button next to  **Primary Connection String**, and save it to a notepad to use later.

    :::image type="content" source="./media/stream-analytics-quick-create-portal/save-iot-device-connection-string.png" lightbox="./media/stream-analytics-quick-create-portal/save-iot-device-connection-string.png" alt-text="Screenshot showing the copy button next to device connection string.":::    

## Run the IoT simulator

1. Open the [Raspberry Pi Azure IoT Online Simulator](https://azure-samples.github.io/raspberry-pi-web-simulator/).
1. Replace the placeholder in line 15 with the Azure IoT Hub device connection string you saved in a previous section.
1. Select **Run**. The output shows the sensor data and messages that are sent to your IoT Hub.

   :::image type="content" source="./media/stream-analytics-quick-create-portal/ras-pi-connection-string.png" lightbox="./media/stream-analytics-quick-create-portal/ras-pi-connection-string.png" alt-text="Screenshot showing the **Raspberry Pi Azure IoT Online Simulator** page with the sample query."::: 


## Create blob storage

1. From the upper left-hand corner of the Azure portal, select **Create a resource**. Select **Storage** under **Categories** on the left menu, and then select **Storage account**. 

    :::image type="content" source="./media/stream-analytics-quick-create-portal/select-storage-account-type.png" alt-text="Screenshot showing the Create a resource page." lightbox="./media/stream-analytics-quick-create-portal/select-storage-account-type.png":::
1. On the **Storage account** page, select **Create** to start creating a storage account. 
1. In the **Create storage account** page, follow these steps:
    1. Enter a storage account name, location, and resource group. Choose the same location and resource group as the IoT Hub you created. Then select **Review** at the bottom of the page.
    1. For **Preferred storage type**, select **Azure Blob Storage or Azure Data Lake Storage Gen2**. This option allows you to use the storage account for Stream Analytics job output.
    1. Select **Review + create** at the bottom of the page. Review your settings.

    :::image type="content" source="./media/stream-analytics-quick-create-portal/create-storage-account.png" alt-text="Screenshot showing the Create a storage account page." lightbox="./media/stream-analytics-quick-create-portal/create-storage-account.png":::
1. On the **Review + create** page, review your settings, and select **Create** to create the account.
1. After the resource is created, select **Go to resource** to navigate to the **Storage account** page.
1. On the **Storage account** page, select **Containers** on the left menu, and then select **+ Add Container**. 

    :::image type="content" source="./media/stream-analytics-quick-create-portal/add-container-menu.png" alt-text="Screenshot showing the Add container menu on the Containers page." lightbox="./media/stream-analytics-quick-create-portal/add-container-menu.png":::
1. On the **New container** page, provide a name for your container, such as *container1*, and select **Create**.

    :::image type="content" source="./media/stream-analytics-quick-create-portal/create-blob-container.png" alt-text="Screenshot showing the **Add container** page." lightbox="./media/stream-analytics-quick-create-portal/create-blob-container.png":::

## Create a Stream Analytics job

1. On a separate tab of the same browser window or in a separate browser window, sign in to the [Azure portal](https://portal.azure.com).
1. Select **All services** on the left menu. Select **Analytics** under **Categories**. Hover the mouse over **Stream Analytics jobs**, and select **+** or select **+ Create** in the pop-up window. 

    :::image type="content" source="./media/stream-analytics-quick-create-portal/create-job-menu.png" alt-text="Screenshot that shows the Stream Analytics job menu." lightbox="./media/stream-analytics-quick-create-portal/create-job-menu.png":::      
1. On **New Stream Analytics job**, follow these steps:
    1. For **Subscription**, select your Azure subscription. 
    1. For **Resource group**, select the same resource that you used earlier in this quickstart. 
    1. For **Name**, enter a name for the job. Stream Analytics job name can contain alphanumeric characters, hyphens, and underscores only and it must be between 3 and 63 characters long.
    1. For **Hosting environment**, confirm that **Cloud** is selected. Stream Analytics jobs can be deployed to cloud or edge. Cloud allows you to deploy to Azure cloud, and the **Edge** option allows you to deploy to an IoT Edge device.
    1. For **Stream units**, select **1**. Streaming units represent the computing resources that are required to execute a job. To learn about scaling streaming units, refer to [understanding and adjusting streaming units](stream-analytics-streaming-unit-consumption.md) article.
    1. Select **Review + create** at the bottom of the page.

        :::image type="content" source="./media/stream-analytics-quick-create-portal/create-asa-job.png" alt-text="Screenshot showing the **New Stream Analytics job** page." lightbox="./media/stream-analytics-quick-create-portal/create-asa-job.png":::
1. On **Review + create**, review settings, and select **Create** to create a Stream Analytics page.
1. On the deployment page, select **Go to resource** to navigate to the **Stream Analytics job** page. 

## Configure job input

In this section, you configure an IoT Hub device input to the Stream Analytics job. Use the IoT Hub you created in the previous section of the quickstart.

1. On the **Stream Analytics job** page, select **Inputs** under **Job topology** in the left menu. 
1. On the **Inputs** page, select **Add input** > **IoT Hub**.

    :::image type="content" source="./media/stream-analytics-quick-create-portal/add-input-menu.png" lightbox="./media/stream-analytics-quick-create-portal/add-input-menu.png" alt-text="Screenshot showing the **Inputs** page with **Add stream input** > **IoT Hub** menu selected.":::  
1. On the **IoT Hub** page, follow these steps:
    1. For **Input alias**, enter **IoTHubInput**.
    1. For **Subscription**, select the subscription that has the IoT hub you created earlier. This quickstart assumes that you create the IoT hub in the same subscription.
    1. For **IoT Hub**, select your IoT hub. 
    1. Select **Save** to save the input settings for the Stream Analytics job. 
    
        :::image type="content" source="./media/stream-analytics-quick-create-portal/configure-asa-input.png" alt-text="Screenshot showing the New input page to enter input IoT hub information." lightbox="./media/stream-analytics-quick-create-portal/configure-asa-input.png":::

## Configure job output

1. Select **Outputs** under **Job topology** in the left menu.
1. On the **Outputs** page, select **Add output** > **Blob storage/ADLS Gen2**. 

   :::image type="content" source="./media/stream-analytics-quick-create-portal/add-output-menu.png" alt-text="Screenshot showing the **Outputs** page with **Add** -> **Blob storage** option selected in the menu." lightbox="./media/stream-analytics-quick-create-portal/add-output-menu.png":::
1. On the **New output** page for **Blob storage/ADLS Gen2**, follow these steps:
    1. For **Output alias**, enter **BlobOutput**.
    1. For **Subscription**, select the subscription that has the Azure storage account you created earlier. This quickstart assumes that you created the storage account in the same subscription.
    1. For **Storage account**, select your storage account. 
    1. For **Container**, select your blob container if it isn't already selected. 
    1. For **Authentication mode**, select **Connection string**. 
    1. Select **Save** at the bottom of the page to save the output settings. 

        :::image type="content" source="./media/stream-analytics-quick-create-portal/configure-asa-output.png" alt-text="Screenshot showing the **New output** page to enter input Azure storage account information." lightbox="./media/stream-analytics-quick-create-portal/configure-asa-output.png":::
 
## Define the transformation query

1. Select **Query** under **Job topology** in the left menu.
1. Enter the following query into the query window. In this example, the query reads the data from IoT Hub and copies it to a new file in the blob. 

   ```sql
   SELECT *
   INTO BlobOutput
   FROM IoTHubInput
   WHERE Temperature > 27
   ```
1. Select **Save query** on the toolbar. 

   :::image type="content" source="./media/stream-analytics-quick-create-portal/add-asa-query.png" lightbox="./media/stream-analytics-quick-create-portal/add-asa-query.png" alt-text="Screenshot showing the **Query** page with the sample query."::: 

## Start the Stream Analytics job and check the output

1. Return to the job overview page in the Azure portal, and select **Start job**.

   :::image type="content" source="./media/stream-analytics-quick-create-portal/start-job-menu.png" alt-text="Screenshot showing the **Overview** page with **Start** button selected." lightbox="./media/stream-analytics-quick-create-portal/start-job-menu.png":::
1. On the **Start job** page, confirm that **Now** is selected for **Job output start time**, and then select **Start** at the bottom of the page.

   :::image type="content" source="./media/stream-analytics-quick-create-portal/start-job-page.png" alt-text="Screenshot showing the **Start job** page." lightbox="./media/stream-analytics-quick-create-portal/start-job-page.png":::
1. After a few minutes, in the portal, find the storage account and the container that you configured as output for the job. You can now see the output file in the container. The job takes a few minutes to start for the first time. After it starts, it continues to run as the data arrives.  

   :::image type="content" source="./media/stream-analytics-quick-create-portal/output-file-blob-container.png" lightbox="./media/stream-analytics-quick-create-portal/output-file-blob-container.png" alt-text="Screenshot showing the **Container** page with the sample output file."::: 
1. Select the file, and then on the **Blob** page, select **Edit** to view contents in the file. 

   :::image type="content" source="./media/stream-analytics-quick-create-portal/check-asa-results.png" lightbox="./media/stream-analytics-quick-create-portal/check-asa-results.png" alt-text="Screenshot showing the sample output file."::: 

## Clean up resources

When you no longer need the resources, delete the resource group, the Stream Analytics job, and all related resources. Deleting the job stops billing for the streaming units the job consumes. If you plan to use the job in the future, you can stop it and restart it later when you need. If you aren't going to continue to use this job, delete all resources created by this quickstart by using the following steps:

1. From the left-hand menu in the Azure portal, select **Resource groups** and then select the name of the resource you created.  
1. On your resource group page, select **Delete**, type the name of the resource to delete in the text box, and then select **Delete**.
1. On the **Raspberry Pi Azure IoT Online Simulator** app, select **Reset** next to Run in the bottom pane to the right. 

## Next step
To learn about configuring other input sources and performing real-time detection, continue to the following article:

> [!div class="nextstepaction"]
> [Real-time fraud detection using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
