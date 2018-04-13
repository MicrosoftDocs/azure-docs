---
title: Configure Azure Stream Analytics to stream data from IoT Hub to a Data Lake Store | Microsoft Docs
description: Learn how to configure Azure Data Lake Store and Azure Stream Analytics to stream data from IoT Hub.
+services: ''
+suite: iot-suite
+author: philmea
+manager: timlt
+ms.author: philmea
+ms.date: 04/06/2018
+ms.topic: article
+ms.service: iot-suite

---
# Configure Azure Stream Analytics to stream data from IoT Hub to a Data Lake Store

Using an Azure Stream Analytics job, you can stream data from your IoT hub to a Data Lake store that can provide a single place for analytics over potentially trillions of files. Azure Data Lake Store is ideal for this application because it can store data from massive and diverse datasets as well as integrate with Azure Data Lake Analytics to provide on-demand analytics.

## Prerequisites

To complete this tutorial, [deploy the remote monitoring preconfigured solution] (/iot-suite/iot-suite-remote-monitoring-deploy).

## Create Azure Data Lake Store

Create a new Azure Data Lake Store to hold your IoT data.

1. Click **Create a resource**, select **Data + Analytics** from the Marketplace and click **Data Lake Store**.

![Create Datalake Store](media/iot-suite-integrate-data-lake/01_Create_Datalake_Store.png)

1. Enter a store name and select the appropriate Subscription and Resource group.

1. Select a Location in the same region as your remote monitoring solution. Here we are using East US 2.

By default, the deployment will enable encryption on the store using keys managed by the Data Lake Store. You can learn more about encrpytion options by reading [Encryption of data in Azure Data Lake Store](/data-lake-store/data-lake-store-encryption).

![Imported Script](media/iot-suite-integrate-data-lake/02_Create_Datalake_Store_Submit.png "Create Datalake Store")

1. Click **Create**.

## Create the File System for Streaming Data

Create the /streaming folder to store data coming from your IoT Hub devices.

1. Go to your new Data Lake Store.

1. On the Overview page, click the **Data explorer** button.

![Imported Script](media/iot-suite-integrate-data-lake/03_Datalake_Store_Date_Explore.png "Explore Data")

1. In the Data explorer, click **New folder**, enter a folder name of **streaming** and click **OK**.

![Imported Script](media/iot-suite-integrate-data-lake/05_Datalake_Store_Date_Explore_create_folder_workshop_streaming.png "Explore Data")

## Create a consumer group in your IoT hub

Create a dedicated consumer group in your IoT hub to be used by a Stream Analytics job for streaming data to your Data Lake Store.

[!NOTE]
Consumer groups are used by applications to pull data from Azure IoT Hub. You should create a new consumer group for every five output consumers. You can create up to 32 consumer groups.

1. In the Azure portal, click the **Cloud Shell** button.

1. Execute the following command to create a new consumer group:

```azurecli-interactive
az iot hub consumer-group create --hub-name contoso-rm30263 --name streamanalyticsjob --resource-group contoso-rm
```

## Create Stream Analytics Job

Create an Azure Stream Analytics job to stream the data from your IoT hub to your Azure Data Lake store.

1. Click **Create a resource**, select Internet of Things from the Marketplace, and click **Stream Analytics job**.

![Imported Script](media/iot-suite-integrate-data-lake/07_Create_Stream_Analytics_Job.png "Create Stream Analytics Job")

1. Enter a job name and select the appropriate Subscription and Resource group.

1. Select a Location in the same region as your Data Lake Store. Here we are using East US 2.

1. Ensure to leave the Hosting environment as the default **Cloud**.

1. Click **Create**.

![Imported Script](media/iot-suite-integrate-data-lake/08_Create_Stream_Analytics_Job_submit.png "Create Stream Analytics Job")

1. Go to the new **Stream Analytics job**.

1. On the Overview page, click **Inputs**.

![Imported Script](media/iot-suite-integrate-data-lake/09_Add_Input.png "Add Input")

1. Click **Add stream input** and select **IoT Hub** from the drop-down.

![Imported Script](media/iot-suite-integrate-data-lake/10_Add_IoTHub.png "Select Input")

1. On the New input tab, enter an Input alias of **IoTHub**.

1. From the Consumer group drop-down, select the consumer group you created earlier. Here we are suing **streamanalyticsjob**.

1. Click **Save**.

![Imported Script](media/iot-suite-integrate-data-lake/11_Save_IoTHub.png "Save Input")

1. On the Overview page, click **Outputs**.

![Imported Script](media/iot-suite-integrate-data-lake/12_Add_Data_Lake_Store.png "Add Data Lake Store")

1. Click **Add** and select **Data Lake Store** from the drop-down.

![Imported Script](media/iot-suite-integrate-data-lake/13_Add_Output.png "Add Output")

1. On the New output tab, enter an Output alias of **DataLakeStore**.

1. Select the Data Lake Store account you created in previous steps and provide folder structure to stream data to the store.

1. In the Date format field, enter **/streaming/{date}/{time}**. Leave the default Date format of YYYY/MM/DD and Time format of HH.

![Imported Script](media/iot-suite-integrate-data-lake/14_Save_Output.png "Provide Folder Structure")

1. Click **Authorize**.

You will have to authorize with Data Lake Store to give the Stream analytics job write access to the file system.

![Imported Script](media/iot-suite-integrate-data-lake/15_Save_Output_2.png "Authorize Stream Analytics to Data Lake Store")

You will see a popup and once the popup closes Authorize button will be greyed out after authorization is complete.

[!NOTE]
If the popup errors, open a new browser window in Incognito Mode and try again.
![Imported Script](media/iot-suite-integrate-data-lake/16_Save_Output_3.png "Authorized")

1. Click **Save**.

## Edit Stream Analytics Query

Azure Stream Analytics uses a SQL-like query language to specify an input source that streams data, transform that data as desired, and output to a varity of storage or processing destinations.

1. On the Overview tab, click **Edit query**.

![Imported Script](media/iot-suite-integrate-data-lake/17_Edit_Query.png "Edit Query")

1. In the Query editor, replace the [YourOutputAlias] and [YourInputAlias] placeholders with the values you defined previously.

```sql
SELECT
    *, System.Timestamp as time
INTO
    DataLakeStore
FROM
    IoTHub
```

1. Click **Save**.

![Imported Script](media/iot-suite-integrate-data-lake/18_Save_Query.png "Save Query")

1. Click **Yes** to accept the changes.

![Imported Script](media/iot-suite-integrate-data-lake/19_Save_Query_Yes.png "Accept Save")

## Start Streaming Analytics Job

1. On the Overview tab, click **Start**.

![Imported Script](media/iot-suite-integrate-data-lake/20_Start_Stream_Analytics_Job.png "Start Job")

1. On the Start job tab, click **Custom**.

1. Set custom time to go back a few hours to pick up data from when your device has started streaming.

1. Click **Start**.

![Imported Script](media/iot-suite-integrate-data-lake/21_Start_custom.png "Pick Custom Date")

Wait until job goes into running state, if you see errors it could be from your query, make sure to verify that the syntax is correct.

![Imported Script](media/iot-suite-integrate-data-lake/22_running.png "Job running")

The streaming job will begin to read data from your IoT Hub and store the data in your Data Lake Store. It may take a few minutes for the data to begin to appear in your Data Lake Store.

## Explore Streaming Data

1. Go to your Data Lake Store.

1. On the Overview tab, click **Data explorer**.

1. In the Data explorer, drill down to the **/streaming** folder. You will see folders created with YYYY/MM/DD/HH format.

![Imported Script](media/iot-suite-integrate-data-lake/23_datalake_store_explore_streaming_data.png "Explore Streaming Data")

You will see json files with one file per hour.

![Imported Script](media/iot-suite-integrate-data-lake/24_datalake_file.png "Explore Streaming Data")