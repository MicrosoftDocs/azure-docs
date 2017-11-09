---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy Azure Stream Analytics with Azure IoT Edge | Microsoft Docs 
description: Deploy Azure Stream Analytics as a module to an edge device
services: iot-edge
keywords: 
author: msebolt
manager: timlt

ms.author: v-masebo
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
---

# Deploy Azure Stream Analytics as an IoT Edge module

IoT devices can produce large quantities of data. Sometimes this data has to be analyzed or processed before reaching the cloud to reduce the size of uploaded data or to eliminate the round-trip latency of an actionable insight.

[Azure Stream Analytics][azure-stream] (ASA) provides a richly structured query syntax for data analysis both in the cloud and on IoT Edge devices. For more information about ASA on IoT Edge please refer to [ASA documentation](https://go.microsoft.com/fwlink/?linkid=862381).

This tutorial walks you through the creation of an Azure Stream Analytics job, and its deployment on an IoT Edge device in order to process a local telemetry stream directly on the device, and generate alerts to drive immediate action on the device.  You learn how to:

> [!div class="checklist"]
> * Create an ASA job to process data on the Edge
> * Connect the new ASA job with other IoT Edge modules
> * Deploy the ASA job to an IoT Edge device

## Prequisites

* An IoT Hub 
* An IoT Edge runtime
* Docker
    * [Windows installation][lnk-docker-windows]
    * [Linux installation][lnk-docker-linux]

> [!NOTE]
> Please note your IoT Hub connection string, device connection string, and edge device ID will be necessary for this tutorial. For a tutorial on installing IoT Hub and IoT Edge runtime see [Install Azure IoT Edge and deploy a module][lnk-first-tutorial]

IoT Edge takes advantage of pre-built Azure Service IoT Edge modules for quick deployment and Azure Stream Analytics (ASA) is one such module. You can create an ASA job from its portal, then come to IoT Hub portal to deploy it as an IoT Edge Module.  For more information, see the **Overview** section of the [Stream Analytics Documentation][azure-stream] or see [Create a custom module][lnk-next-tutorial2] on how to create your own. 

## Create an ASA job to process data on the Edge

In this section, you create an Azure Stream Analytics job to take data from your IoT hub, query the sent telemetry data from your device, and forward the results to an Azure Storage Container (BLOB). For more information, see the **Overview** section of the [Stream Analytics Documentation][azure-stream]. 

> [!NOTE]
> An Azure Storage account is required to provide an endpoint to be used as an output in your ASA job. The example below uses the BLOB storage type.  For more information, see the **Blobs** section of the [Azure Storage Documentation][azure-storage].

1. In the Azure portal, navigate to **Create a resource -> Storage**, click **See all**, and click **Storage account - blob, file, table, queue**.

2. Enter a name and use the remaining default values.  Click **Create**. Note the name for later.

    ![new storage account][1]

    > [!NOTE]
    > Make sure the **Location** you use is the same as your IoT Hub **Location** else additional fees may apply.

1. In the Azure portal, navigate to **Create a resource -> Internet of Things** and click **Stream Analytics Job**.

1. Enter a name, **choose "Edge" as Hosting environment** and use the remaining default values.  Click **Create**.

    ![ASA create][5]

2. Go into the created job, under **Job Topology**, select **Inputs**, click **Add**.

3. Enter name "temperature", choose **Data stream** as "Source Type" and use defaults for the other parameters, click **Create**.

    ![ASA input][2]

    > [!NOTE]
    > Additonal inputs can include IoT Edge specific endpoints.

4. Under **Job Topology**, select **Outputs**, click **Add**.

5. Enter name "alert" and use defaults.  Create a new Storage Container under the Storage account created previously.

    ![ASA output][3]

6. Under **Job Topology**, select **Query**, and enter the following:

    ```sql
    SELECT  
        System.Timestamp AS OutputTime, 
        Avg(machine.temperature) AS AvgMachineTemperature 
    INTO 
       alert 
    FROM 
       temperature TIMESTAMP BY timeCreated 
    GROUP BY TumblingWindow(second,30) 
    HAVING Avg(machine.temperature) > 100
    ```

1. Under **Job Topology**, select **Devices**, and click **Add** to enter in your IoT Hub information.  Select _Disabled_ under **Monitoring**.  Click **Save**.

    ![add device][4]

1. Under **Overview**, click **Start**. Your ASA job is now ready to be deployed in IoT Edge section of the IoT Hub portal.

## Deploy the ASA job to an IoT Edge device

You are now ready to deploy the ASA job on your IoT Edge device.

1. In the Azure portal, in your IoT Hub, navigate to **IoT Edge Explorer** and open your *{deviceId}*'s blade.

1. Select **Deploy modules**, then select **Add Custom IoT Edge Module**.

1. In the **Name** field, enter ```tempSensor```.  

1. In the **Image** field, enter ```edgepreview.azurecr.io/azureiotedge/simulated-temperature-sensor:1.0-preview```.

1. In the **OS** filed, select **Linux**.

1. Leave the remaining defaults and click **Save**.

1. Select **Add Azure Service IoT Edge Module**. Fill in your ASA job information and Storage account information. Click **Save**.

1. Click **Next**.

1. Copy the following to **Routes**:

    ```json
    {
        "routes": {                                                               
          "telemetryToCloud": "FROM /messages/modules/tempSensor/* INTO $upstream", 
          "alertsToCloud": "FROM /messages/modules/ASA/* INTO $upstream", 
          "alertsToReset": "FROM /messages/modules/ASA/* INTO BrokeredEndpoint(\"/messages/modules/tempSensor/inputs/reset\")", 
          "telemetryToAsa": "FROM /messages/modules/tempSensor/* INTO BrokeredEndpoint(\"/messages/modules/ASA/inputs/temperature\")" 
        }
    }      
    ```

1. Click **Next**.

1. In the **Review Template** step, click **Submit**.

1. Click **Save**.

1. Return to the device details page and click **Refresh**.  You should see the new **ASA** module running along with the **tempSensor** moudle and the **IoT Edge runtime**.

## View telemetry data (optional)

1. At a command prompt, run the following command to see the modules running:

    ```cmd/sh
    docker ps  
    ```

1. Run the command to see the telemetry data:

    ```cmd/sh
    docker logs ASA  
    ```

1. In the Azure portal, in your Storage account, under **Blob Service**, click **Browse blobs**, select your container and select newly created JSON file.

1. Click **Download** and view the results.

## Next steps

In this tutorial, you configured an Azure Storage container and a Streaming Analytics job to analyze data from you IoT Edge device.  You then loaded a custom ASA module to move data from your device, through the stream, into a BLOB for download.  You can continue on to other tutorials to further see how Azure IoT Edge can create solutions for your business.

> [!div class="nextstepaction"] 
> [Deploy Azure Machine Learning as a module]
> [lnk-next-tutorial][Create a custom module][lnk-next-tutorial2]

<!-- Images. -->
[1]: ./media/tutorial-deploy-stream-analytics/storage.png
[2]: ./media/tutorial-deploy-stream-analytics/asa_input.png
[3]: ./media/tutorial-deploy-stream-analytics/asa_output.png
[4]: ./media/tutorial-deploy-stream-analytics/add_device.png
[5]: ./media/tutorial-deploy-stream-analytics/asa_job.png

<!-- Links -->
[lnk-first-tutorial]: tutorial-install-iot-edge.md
[lnk-what-is-iot-edge]: what-is-iot-edge.md
[lnk-module-dev]: module-development.md
[iot-hub-get-started-create-hub]: ../../includes/iot-hub-get-started-create-hub.md
[azure-iot]: https://docs.microsoft.com/en-us/azure/iot-hub/
[azure-storage]: https://docs.microsoft.com/en-us/azure/storage/
[azure-stream]: https://docs.microsoft.com/en-us/azure/stream-analytics/
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-first-tutorial]: tutorial-install-iot-edge.md
[lnk-module-tutorial]: tutorial-create-custom-module.md
[lnk-next-tutorial]: tutorial-deploy-machine-learning.md
[lnk-next-tutorial2]: tutorial-create-custom-module.md

[lnk-docker-windows]: https://docs.docker.com/docker-for-windows/install/ 
[lnk-docker-linux]: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/