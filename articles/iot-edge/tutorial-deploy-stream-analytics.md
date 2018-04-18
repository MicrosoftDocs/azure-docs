---
title: Deploy Azure Stream Analytics with Azure IoT Edge | Microsoft Docs 
description: Deploy Azure Stream Analytics as a module to an edge device
services: iot-edge
keywords: 
author: msebolt
manager: timlt

ms.author: v-masebo
ms.date: 11/28/2017
ms.topic: article
ms.service: iot-edge
---

# Deploy Azure Stream Analytics as an IoT Edge module - preview

IoT devices can produce large quantities of data. To reduce the amount of uploaded data or to eliminate the round-trip latency of an actionable insight, the data must sometimes be analyzed or processed before it reaches the cloud.

Azure IoT Edge takes advantage of pre-built Azure service IoT Edge modules for quick deployment. [Azure Stream Analytics][azure-stream] is one such module. You can create an Azure Stream Analytics job from its portal and then go to the Azure IoT Hub portal to deploy it as an IoT Edge module. 

Azure Stream Analytics provides a richly structured query syntax for data analysis both in the cloud and on IoT Edge devices. For more information about Azure Stream Analytics on IoT Edge, see [Azure Stream Analytics documentation](../stream-analytics/stream-analytics-edge.md).

This tutorial walks you through creating an Azure Stream Analytics job and deploying it on an IoT Edge device. Doing so lets you process a local telemetry stream directly on the device and generate alerts that drive immediate action on the device. 

The tutorial presents two modules: 
* A simulated temperature sensor module (tempSensor) that generates temperature data from 20 to 120 degrees, incremented by 1 every 5 seconds. 
* A Stream Analytics module that resets the tempSensor when the 30-second average reaches 70. In a production environment, you might use this functionality to shut off a machine or take preventative measures when the temperature reaches dangerous levels. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Stream Analytics job to process data on the edge.
> * Connect the new Azure Stream Analytics job with other IoT Edge modules.
> * Deploy the Azure Stream Analytics job to an IoT Edge device.

## Prerequisites

* An IoT hub. 
* The device that you created and configured in the quickstart or in the articles about deploying Azure IoT Edge on a simulated device in [Windows][lnk-tutorial1-win] or in [Linux][lnk-tutorial1-lin]. You need to know the device connection key and the device ID. 
* Docker running on your IoT Edge device.
    * [Install Docker on Windows][lnk-docker-windows].
    * [Install Docker on Linux][lnk-docker-linux].
* Python 2.7.x on your IoT Edge device.
    * [Install Python 2.7 on Windows][lnk-python].
    * Most Linux distributions, including Ubuntu, already have Python 2.7 installed. To ensure that pip is installed, use the following command: `sudo apt-get install python-pip`.

## Create an Azure Stream Analytics job

In this section, you create an Azure Stream Analytics job to take data from your IoT hub, query the sent telemetry data from your device, and then forward the results to an Azure Blob storage container. For more information, see the "Overview" section of the [Stream Analytics documentation][azure-stream]. 

### Create a storage account

An Azure Storage account is required to provide an endpoint to be used as an output in your Azure Stream Analytics job. The example in this section uses the Blob storage type. For more information, see the "Blobs" section of the [Azure Storage documentation][azure-storage].

1. In the Azure portal, go to **Create a resource**, enter **Storage account** in the search box, and then select **Storage account - blob, file, table, queue**.

2. In the **Create storage account** pane, enter a name for your storage account, select the same location where your IoT hub is stored, and then select **Create**. Note the name for later use.

    ![Create a storage account][1]

3. Go to the storage account that you just created, and then select **Browse blobs**. 

4. Create a new container for the Azure Stream Analytics module to store data, set the access level to **Container**, and then select **OK**.

    ![Storage settings][10]

### Create a Stream Analytics job

1. In the Azure portal, go to **Create a resource** > **Internet of Things**, and then select **Stream Analytics Job**.

2. In the **New Stream Analytics Job** pane, do the following:

    a. In the **Job name** box, type a job name.
    
    b. Under **Hosting environment**, select **Edge**.
    
    c. In the remaining fields, use the default values.

    > [!NOTE]
    > Currently, Azure Stream Analytics jobs on IoT Edge aren't supported in the West US 2 region. 

3. Select **Create**.

4. In the created job, under **Job Topology**, select **Inputs**, and then select **Add**.

5. In the **New input** pane, do the following:

    a. In the **Input alias** box, enter **temperature**.
    
    b. In the **Source Type** box, select **Data stream**.
    
    c. In the remaining fields, use the default values.

   ![Azure Stream Analytics input](./media/tutorial-deploy-stream-analytics/asa_input.png)

6. Select **Create**.

7. Under **Job Topology**, select **Outputs**, and then select **Add**.

8. In the **New output** pane, do the following:

    a. In the **Output alias** box, type **alert**.
    
    b. In the remaining fields, use the default values. 
    
    c. Select **Create**.

   ![Azure Stream Analytics output](./media/tutorial-deploy-stream-analytics/asa_output.png)


9. Under **Job Topology**, select **Query**, and then replace the default text with the following query:

    ```sql
    SELECT  
        'reset' AS command 
    INTO 
       alert 
    FROM 
       temperature TIMESTAMP BY timeCreated 
    GROUP BY TumblingWindow(second,30) 
    HAVING Avg(machine.temperature) > 70
    ```

10. Select **Save**.

## Deploy the job

You are now ready to deploy the Azure Stream Analytics job on your IoT Edge device.

1. In the Azure portal, in your IoT hub, go to **IoT Edge (preview)**, and then open the details page for your IoT Edge device.

2. Select **Set modules**.  
    If you previously deployed the tempSensor module on this device, it might autopopulate. If it does not, add the module by doing the following:

   a. Select **Add IoT Edge Module**.

   b. For the name, type **tempSensor**.
    
   c. For the image URI, enter **microsoft/azureiotedge-simulated-temperature-sensor:1.0-preview**. 

   d. Leave the other settings unchanged.
   
   e. Select **Save**.

3. To add your Azure Stream Analytics Edge job, select **Import Azure Stream Analytics IoT Edge Module**.

4. Select your subscription and the Azure Stream Analytics Edge job that you created. 

5. Select your subscription and the storage account that you created, and then select **Save**.

    ![Set module][6]

6. Copy the name of your Azure Stream Analytics module. 

    ![Temperature module][11]

7. To configure routes, select **Next**.

8. Copy the following code to **Routes**. Replace _{moduleName}_ with the module name that you copied:

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

9. Select **Next**.

10. In the **Review Template** step, select **Submit**.

11. Return to the device details page, and then select **Refresh**.  
    You should see the new Stream Analytics module running, along with the IoT Edge agent module and the IoT Edge hub.

    ![Module output][7]

## View data

Now you can go to your IoT Edge device to check out the interaction between the Azure Stream Analytics module and the tempSensor module.

1. Check that all the modules are running in Docker:

   ```cmd/sh
   docker ps  
   ```

   ![Docker output][8]

2. View all system logs and metrics data. Use the Stream Analytics module name:

   ```cmd/sh
   docker logs -f {moduleName}  
   ```

You should be able to watch the machine's temperature gradually rise until it reaches 70 degrees for 30 seconds. Then the Stream Analytics module triggers a reset, and the machine temperature drops back to 21. 

   ![Docker log][9]


## Next steps

In this tutorial, you configured an Azure storage container and a Streaming Analytics job to analyze data from your IoT Edge device. You then loaded a custom Azure Stream Analytics module to move data from your device, through the stream, into a blob for download. To see how Azure IoT Edge can create more solutions for your business, continue on to the other tutorials.

> [!div class="nextstepaction"] 
> [Deploy an Azure Machine Learning model as a module][lnk-ml-tutorial]

<!-- Images. -->
[1]: ./media/tutorial-deploy-stream-analytics/storage.png
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
[azure-iot]: https://docs.microsoft.com/azure/iot-hub/
[azure-storage]: https://docs.microsoft.com/azure/storage/
[azure-stream]: https://docs.microsoft.com/azure/stream-analytics/
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-tutorial1-win]: tutorial-simulate-device-windows.md
[lnk-tutorial1-lin]: tutorial-simulate-device-linux.md
[lnk-module-tutorial]: tutorial-csharp-module.md
[lnk-ml-tutorial]: tutorial-deploy-machine-learning.md

[lnk-docker-windows]: https://docs.docker.com/docker-for-windows/install/ 
[lnk-docker-linux]: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/
[lnk-python]: https://www.python.org/downloads/
