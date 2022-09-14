---
title: Real-time data ingestion with Azure Stream Analytics - Hyperscale (Citus) - Azure DB for PostgreSQL
description: How to transform and ingest streaming data
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 08/11/2022
---

# How to ingest data using Azure Stream Analytics

[Azure Stream
Analytics](https://azure.microsoft.com/services/stream-analytics/#features)
(ASA) is a real-time analytics and event-processing engine that is designed to
process high volumes of fast streaming data from devices, sensors, and web
sites. It's also available on the Azure IoT Edge runtime, enabling data
processing on IoT devices.

:::image type="content" source="../media/howto-hyperscale-ingestion/azure-stream-analytics-01-reference-arch.png" alt-text="Reference architecture of ASA with Hyperscale (Citus)." border="true":::

Hyperscale (Citus) shines at real-time workloads such as
[IoT](quickstart-build-scalable-apps-model-high-throughput.md). For these workloads,
Azure Stream Analytics (ASA) can act as a no-code, performant and scalable
alternative to pre-process and stream data from Event Hubs, IoT Hub and Azure
Blob Storage into Hyperscale (Citus).

## Steps to set up ASA with Hyperscale (Citus)

> [!NOTE]
>
> This article uses [Azure IoT Hub](../../iot-hub/iot-concepts-and-iot-hub.md)
> as an example datasource, but the technique is applicable to any other source
> supported by ASA. Also, the demonstration data shown below comes from the
> [Azure IoT Device Telemetry
> Simulator](https://github.com/Azure-Samples/Iot-Telemetry-Simulator). This
> article doesn't cover setting up the simulator.

1. Open **Azure portal** and select **Create a resource** in the upper left-hand corner of the Azure portal.
1. Select **Analytics** > **Stream Analytics job** from the results list.
1. Fill out the Stream Analytics job page with the following information:
   * **Job name** - Name to identify your Stream Analytics job.
   * **Subscription** - Select the Azure subscription that you want to use for this job.
   * **Resource group** - Select the same resource group as your IoT Hub.
   * **Location** - Select geographic location where you can host your Stream Analytics job. Use the location that's closest to your users for better performance and to reduce the data transfer cost.
   * **Streaming units** - Streaming units represent the computing resources that are required to execute a job.
   * **Hosting environment** - **Cloud** allows you to deploy to Azure Cloud, and **Edge** allows you to deploy to an IoT Edge device.
1. Select **Create**. You should see a **Deployment in progress...** notification displayed in the top right of your browser window.

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-stream-analytics-02-create.png" alt-text="Create Azure Stream Analytics form." border="true":::

1. Configure job input.

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-stream-analytics-03-input.png" alt-text="Configure job input in Azure Stream Analytics." border="true":::

   1. Once the resource deployment is complete, navigate to your Stream Analytics
      job. Select **Inputs** > **Add Stream input** > **IoT Hub**.

   1. Fill out the IoT Hub page with the following values:
      * **Input alias** - Name to identify the job's input.
      * **Subscription** - Select the Azure subscription that has the IOT Hub account you created.
      * **IoT Hub** – Select the name of the IoT Hub you have already created.
      * Leave other options as default values
   1. Select **Save** to save the settings.
   1. Once the input stream is added, you can also verify/download the dataset flowing in.
      Below is the data for sample event in our use case:

      ```json
      {
         "deviceId": "sim000001",
         "time": "2022-04-25T13:49:11.6892185Z",
         "counter": 1,
         "EventProcessedUtcTime": "2022-04-25T13:49:41.4791613Z",
         "PartitionId": 3,
         "EventEnqueuedUtcTime": "2022-04-25T13:49:12.1820000Z",
         "IoTHub": {
           "MessageId": null,
           "CorrelationId": "990407b8-4332-4cb6-a8f4-d47f304397d8",
           "ConnectionDeviceId": "sim000001",
           "ConnectionDeviceGenerationId": "637842405470327268",
           "EnqueuedTime": "2022-04-25T13:49:11.7060000Z"
         }
      }
      ```

1. Configure Job Output.

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-stream-analytics-04-output.png" alt-text="Configure job output in Azure Stream Analytics." border="true":::

   1. Navigate to the Stream Analytics job that you created earlier.
   1. Select **Outputs** > **Add** > **Azure PostgreSQL**.
   1. Fill out the **Azure PostgreSQL** page with the following values:
      * **Output alias** - Name to identify the job's output.
      * Select **"Provide PostgreSQL database settings manually"** and enter the DB server connection details like server FQDN, database, table name, username, and password.
      * For our example dataset, we chose the table name `device_data`.
   1. Select **Save** to save the settings.

      > [!NOTE]
      > The **Test Connection** feature for Hyperscale (Citus) is currently not
      > supported and might throw an error, even when the connection works fine.

1. Define transformation query.

   :::image type="content" source="../media/howto-hyperscale-ingestion/azure-stream-analytics-05-transformation-query.png" alt-text="Transformation query in Azure Stream Analytics." border="true":::

   1. Navigate to the Stream Analytics job that you created earlier.
   1. For this tutorial, we'll be ingesting only the alternate events from IoT Hub into Hyperscale (Citus) to reduce the overall data size.

      ```sql
      select
         counter,
         iothub.connectiondeviceid,
         iothub.correlationid,
         iothub.connectiondevicegenerationid,
         iothub.enqueuedtime
      from
         [src-iot-hub]
      where counter%2 = 0;
      ```

   1. Select **Save Query**

      > [!NOTE]
      > We are using the query to not only sample the data, but also extract the
      > desired attributes from the data stream. The custom query option with
      > stream analytics is helpful in pre-processing/transforming the data
      > before it gets ingested into the DB.

1. Start the Stream Analytics job and verify output.

   1. Return to the job overview page and select Start.
   1. Under **Start job**, select **Now**, for the Job output start time field. Then, select **Start** to start your job.
   1. After few minutes, you can query the Hyperscale (Citus) database to verify the data loaded. The job will take some time to start at the first time, but once triggered it will continue to run as the data arrives.

      ```
      citus=> SELECT * FROM public.device_data LIMIT 10;

       counter | connectiondeviceid |            correlationid             | connectiondevicegenerationid |         enqueuedtime
      ---------+--------------------+--------------------------------------+------------------------------+------------------------------
             2 | sim000001          | 7745c600-5663-44bc-a70b-3e249f6fc302 | 637842405470327268           | 2022-05-25T18:24:03.4600000Z
             4 | sim000001          | 389abfde-5bec-445c-a387-18c0ed7af227 | 637842405470327268           | 2022-05-25T18:24:05.4600000Z
             6 | sim000001          | 3932ce3a-4616-470d-967f-903c45f71d0f | 637842405470327268           | 2022-05-25T18:24:07.4600000Z
             8 | sim000001          | 4bd8ecb0-7ee1-4238-b034-4e03cb50f11a | 637842405470327268           | 2022-05-25T18:24:09.4600000Z
            10 | sim000001          | 26cebc68-934e-4e26-80db-e07ade3775c0 | 637842405470327268           | 2022-05-25T18:24:11.4600000Z
            12 | sim000001          | 067af85c-a01c-4da0-b208-e4d31a24a9db | 637842405470327268           | 2022-05-25T18:24:13.4600000Z
            14 | sim000001          | 740e5002-4bb9-4547-8796-9d130f73532d | 637842405470327268           | 2022-05-25T18:24:15.4600000Z
            16 | sim000001          | 343ed04f-0cc0-4189-b04a-68e300637f0e | 637842405470327268           | 2022-05-25T18:24:17.4610000Z
            18 | sim000001          | 54157941-2405-407d-9da6-f142fc8825bb | 637842405470327268           | 2022-05-25T18:24:19.4610000Z
            20 | sim000001          | 219488e5-c48a-4f04-93f6-12c11ed00a30 | 637842405470327268           | 2022-05-25T18:24:21.4610000Z
      (10 rows)
      ```

## Next steps

Learn how to create a [real-time
dashboard](tutorial-design-database-realtime.md) with Hyperscale (Citus).
