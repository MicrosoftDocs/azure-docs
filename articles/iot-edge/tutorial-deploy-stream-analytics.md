---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy Azure Stream Analytics with Azure IoT Edge | Microsoft Docs 
description: Deploy Azure Stream Analytics as a module to an edge device
services: iot-edge
keywords: 
author: msebolt
manager: timlt

ms.author: v-masebo
ms.date: 11/15/2017
ms.topic: article
ms.service: iot-edge

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
---

# Deploy Azure Stream Analytics as an IoT Edge module - preview

IoT devices can produce large quantities of data. Sometimes this data has to be analyzed or processed before reaching the cloud to reduce the size of uploaded data or to eliminate the round-trip latency of an actionable insight.

[Azure Stream Analytics][azure-stream] (ASA) provides a richly structured query syntax for data analysis both in the cloud and on IoT Edge devices. For more information about ASA on IoT Edge, see [ASA documentation](https://go.microsoft.com/fwlink/?linkid=862381).

This tutorial walks you through the creation of an Azure Stream Analytics job, and its deployment on an IoT Edge device in order to process a local telemetry stream directly on the device, and generate alerts to drive immediate action on the device.  There are two modules involved in this tutorial. A simulated temperature sensor module (tempSensor) that generates temperature data from 20 to 120 degrees, incremented by 1 every 5 seconds, and an ASA module that filters out temperatures greater than 100 degrees. The ASA module also resets the tempSensor when the 30 seconds average reaches 100.

You learn how to:

> [!div class="checklist"]
> * Create an ASA job to process data on the Edge
> * Connect the new ASA job with other IoT Edge modules
> * Deploy the ASA job to an IoT Edge device

## Prerequisites

* An IoT Hub 
* A device that has IoT Edge runtime installed. For a tutorial on installing IoT Edge runtime, see [Install Azure IoT Edge and deploy a module][lnk-first-tutorial].
* Docker on your IoT Edge device
    * [Install Docker on Windows][lnk-docker-windows] and make sure it's running.
    * [Install Docker on Linux][lnk-docker-linux] and make sure it's running.
* Python 2.7.x on your IoT Edge device
    * [Install Python 2.7 on Windows][lnk-python].
    * Most Linux distributions, including Ubuntu, already have Python 2.7 installed.  Use the following command to make sure pip is installed: `sudo apt-get install python-pip`.

> [!NOTE]
> Note your device connection string and IoT Edge device ID will be necessary for this tutorial.

IoT Edge takes advantage of pre-built Azure Service IoT Edge modules for quick deployment and Azure Stream Analytics (ASA) is one such module. You can create an ASA job from its portal, then come to IoT Hub portal to deploy it as an IoT Edge Module.  

For more information on Azure Stream Analytics, see the **Overview** section of the [Stream Analytics Documentation][azure-stream].  If you want to learn how to create your solution-specific IoT Edge Module, instead of using Azure Service provider, see [Create an IoT Edge module][lnk-next-tutorial2]. 

## Create an ASA job

In this section, you create an Azure Stream Analytics job to take data from your IoT hub, query the sent telemetry data from your device, and forward the results to an Azure Storage Container (BLOB). For more information, see the **Overview** section of the [Stream Analytics Documentation][azure-stream]. 

> [!NOTE]
> An Azure Storage account is required to provide an endpoint to be used as an output in your ASA job. The example below uses the BLOB storage type.  For more information, see the **Blobs** section of the [Azure Storage Documentation][azure-storage].

1. In the Azure portal, navigate to **Create a resource -> Storage**, click **See all**, and click **Storage account - blob, file, table, queue**.

2. Enter a name for your storage account, and select the same location where your IoT Hub is stored. Click **Create**. Note the name for later.

    ![new storage account][1]

3. In the Azure portal, navigate to the storage account that you just created. Click **Browse blobs** under **Blob Service**. 
1. Create a new container for the ASA module to store data. Set the access level to _Container_. Click **OK**.

    ![storage settings][10]

1. In the Azure portal, navigate to **Create a resource** > **Internet of Things** and select **Stream Analytics Job**.

1. Enter a name, **choose "Edge" as Hosting environment** and use the remaining default values.  Click **Create**.

    ![ASA create][5]

2. Go into the created job, under **Job Topology**, select **Inputs**, click **Add**.

3. Enter name `temperature`, choose **Data stream** as the source type, and use defaults for the other parameters. Click **Create**.

    ![ASA input][2]

    > [!NOTE]
    > Additional inputs can include IoT Edge specific endpoints.

4. Under **Job Topology**, select **Outputs**, click **Add**.

5. Enter name `alert` and use defaults. Click **Create**.

    ![ASA output][3]

6. Under **Job Topology**, select **Query**, and enter the following:

    ```sql
    SELECT  
        'reset' AS command 
    INTO 
       alert 
    FROM 
       temperature TIMESTAMP BY timeCreated 
    GROUP BY TumblingWindow(second,30) 
    HAVING Avg(machine.temperature) > 100
    ```

## Deploy the job

You are now ready to deploy the ASA job on your IoT Edge device.

1. In the Azure portal, in your IoT Hub, navigate to **IoT Edge Explorer** and open your *{deviceId}*'s blade.

1. Select **Set modules**, then select **Import Azure Service IoT Edge Module**.

1. Select the subscription and the ASA Edge job that you created. Then select your storage account. Click **Save**.

    ![set module][6]

1. Click **Add IoT Edge Module** to add the temperature sensor module. Enter _tempSensor_ for name, `microsoft/azureiotedge-simulated-temperature-sensor:1.0-preview` for Image URL. Leave the other settings unchanged, and click **Save**.

    ![temperature module][11]

1. Copy the name of the ASA module. Click **Next** to configure routes.

1. Copy the following to **Routes**.  Replace _{moduleName}_ with the module name you copied:

    ```json
    {
        "routes": {                                                               
          "telemetryToCloud": "FROM /messages/modules/tempSensor/* INTO $upstream", 
          "alertsToCloud": "FROM /messages/modules/{moduleName}/* INTO $upstream", 
          "alertsToReset": "FROM /messages/modules/{moduleName}/* INTO BrokeredEndpoint(\"/modules/tempSensor/inputs/control\")", 
          "telemetryToAsa": "FROM /messages/modules/tempSensor/* INTO BrokeredEndpoint(\"/modules/{moduleName}/inputs/temperature\")" 
        }
    }
    ```

1. Click **Next**.

1. In the **Review Template** step, click **Submit**.

1. Return to the device details page and click **Refresh**.  You should see the new _{moduleName}_ module running along with the **IoT Edge agent** module and the **IoT Edge hub**.

    ![module output][7]

## View data

Now you can go to your IoT Edge device to check out the interaction between the ASA module and the tempSensor module.

1. At a command prompt, configure the runtime with your IoT Edge device connection string:

    ```cmd/sh
    iotedgectl setup --connection-string "{device connection string}" --auto-cert-gen-force-no-passwords  
    ```

1. Run the command to start the runtime:

    ```cmd/sh
    iotedgectl start  
    ```

1. Run the command to see the modules running:

    ```cmd/sh
    docker ps  
    ```

    ![docker output][8]

1. Run the command to see all system logs and metrics data. Use the module name from above:

    ```cmd/sh
    docker logs -f {moduleName}  
    ```

    ![docker log][9]

1. In the Azure portal, in your Storage account, under **Blob Service**, click **Browse blobs**, select your container, and select newly created JSON file.

1. Click **Download** and view the results.

## Next steps

In this tutorial, you configured an Azure Storage container and a Streaming Analytics job to analyze data from your IoT Edge device.  You then loaded a custom ASA module to move data from your device, through the stream, into a BLOB for download.  You can continue on to other tutorials to further see how Azure IoT Edge can create solutions for your business.

> [!div class="nextstepaction"] 
> [Deploy an Azure Machine Learning model as a module][lnk-ml-tutorial]

<!-- Images. -->
[1]: ./media/tutorial-deploy-stream-analytics/storage.png
[2]: ./media/tutorial-deploy-stream-analytics/asa_input.png
[3]: ./media/tutorial-deploy-stream-analytics/asa_output.png
[4]: ./media/tutorial-deploy-stream-analytics/add_device.png
[5]: ./media/tutorial-deploy-stream-analytics/asa_job.png
[6]: ./media/tutorial-deploy-stream-analytics/set_module.png
[7]: ./media/tutorial-deploy-stream-analytics/module_output.png
[8]: ./media/tutorial-deploy-stream-analytics/docker_output.png
[9]: ./media/tutorial-deploy-stream-analytics/docker_log.png
[10]: ./media/tutorial-deploy-stream-analytics/storage_settings.png
[11]: ./media/tutorial-deploy-stream-analytics/temp_module.png


<!-- Links -->
[lnk-what-is-iot-edge]: what-is-iot-edge.md
[lnk-module-dev]: module-development.md
[iot-hub-get-started-create-hub]: ../../includes/iot-hub-get-started-create-hub.md
[azure-iot]: https://docs.microsoft.com/en-us/azure/iot-hub/
[azure-storage]: https://docs.microsoft.com/en-us/azure/storage/
[azure-stream]: https://docs.microsoft.com/en-us/azure/stream-analytics/
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-tutorial1-win]: tutorial-simulate-device-windows.md
[lnk-tutorial1-lin]: tutorial-simulate-device-linux.md
[lnk-module-tutorial]: tutorial-csharp-module.md
[lnk-ml-tutorial]: tutorial-deploy-machine-learning.md

[lnk-docker-windows]: https://docs.docker.com/docker-for-windows/install/ 
[lnk-docker-linux]: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/
[lnk-python]: https://www.python.org/downloads/