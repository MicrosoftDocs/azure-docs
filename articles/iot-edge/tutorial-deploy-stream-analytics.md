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

Migrating data from your IoT Edge devices to the cloud is an important aspect in creating robust solutions.  Azure Stream Analytics stands out as a quick and customizable way to connect data while providing a richly structured query syntax for data analysis.  This tutorial walks you through creating and deploying a fully functional IoT Edge ASA module along with the necessary Azure infrastructure needed to query your data, analyze the results, and stream data to an Azure Storage container (BLOB) for download.  You learn how to:

    [!div class="checklist"]
        * Run a custom module in IoT Edge
        * Create an Azure Storage account
        * Create a custom Stream Analytics job
        * View generated data

## Prequisites

* An IoT Hub 
* An IoT Edge runtime

> [!NOTE]
> Please note your IoT Hub connection string, device connection string, and edge device ID will be necessary for this tutorial. For a tutorial on installing IoT Hub and IoT Edge runtime see [Install Azure IoT Edge and deploy a module][lnk-first-tutorial]

## Setup IoT Edge and deploy the Azure Stream Analytics module

IoT Edge takes advantage of custom pre-built modules for quick deployment and Azure Stream Analytics (ASA) is one such module.  Learn how to deploy the ASA module below.  For more information, see the **Overview** section of the [Stream Analytics Documentation][azure-stream] or see [Create a custom module][lnk-next-tutorial2] on how to create your own. 

1. From your IoT Edge runtime command-line, run the following:
```cmd/sh
launch-edge-runtime -c "<IoT Hub device connection string>"
```

2. Create the following deployment file:
```json
{ 
   "modules": { 
      "sensor": { 
         "name": "sensor", 
         "version": "1.0", 
         "type": "docker", 
         "status": "running", 
         "config": { 
            "image": "azureiotedgeprivatepreview.azurecr.io/azedge-simulated-temperature-sensor-x64", 
            "tag": "latest", 
            "env": {} 
         } 
      } 
   } 
} 
```

1. At a command prompt, run the following command to login to Edge CLI: (replaced by Ibiza UI)

    ```cmd/sh
    edge-explorer login "<IoT Hub connection string for iothubowner policy*>" 
    ```

1. Run the following command to deploy the module created above:

    ```cmd/sh
    edge-explorer edge deployment create -m <path to deployment file> -d <edge device ID> 
    ```

## Setup Azure Storage Account

An Azure Storage account provides a way to store data sent from your device through the IoT Edge. It also provides a quick endpoint to be used as an output for your Streaming Analytics job. The example below uses the BLOB storage type.  For more information, see the **Blobs** section of the [Azure Storage Documentation][azure-storage]. 

1. In the Azure portal, navigate to **New -> Storage** and click **Storage account - blob, file, table, queue**.

2. Enter a name and use the remaining default values.  Click **Create**. Note the name for later.

    ![new storage account][1]

> [!NOTE]
> Make sure the **Location** you use is the same as your IoT Hub **Location** else additional fees may apply.

## Setup Azure Stream Analytics (ASA) job

In this section, you create an Azure Stream Analytics job to take data from your IoT hub, query the sent telemetry data from your device, and forward the results to an Azure Storage Container (BLOB). For more information, see the **Overview** section of the [Stream Analytics Documentation][azure-stream]. 

1. In the Azure portal, navigate to **New -> Internet of Things** and click **Stream Analytics Job**.

1. Enter a name and use the remaining default values.  Click **Create**.

2. Go into the created job, under **Job Topology**, select **Inputs**, click **Add**.

3. Enter name and use defaults, click **Create**.

    ![ASA input][2]

4. Under **Job Topology**, select **Outputs**, click **Add**.

5. Enter name and use defaults.  Create a new Storage Container under the Storage account created previously.

    ![ASA output][3]

6. Under **Job Topology**, select **Query**, and enter the following:

```sql
SELECT  
    System.Timestamp AS OutputTime, 
    Avg(temp) AS AvgMachineTemperature 
INTO 
   [createOutputName] 
FROM 
   [createdInputName] TIMESTAMP BY timeCreated 
GROUP BY TumblingWindow(second,30) 
HAVING Avg(temp)>100
```
1.  Click Save

## Run the apps

You are now ready to run the apps.

1. In your Stream Analytics Job, under **Overview**, click **Start**.

1. After the job is running, in your Storage account, under **Blob Service**, click **Browse blobs**, select your container and select newly created JSON file.

1. Click **Download** and view the results.

## Next steps

In this tutorial, you configured an Azure Storage container and a Streaming Analytics job to analyze data from you IoT Edge device.  You then loaded a custom ASA module to move data from your device, through the stream, into a BLOB for download.  You can continue on to other tutorials to further see how Azure IoT Edge can create solutions for your business.

    [!div class="nextstepaction"] [Deploy Azure Machine Learning as a module][lnk-next-tutorial][Create a custom module][lnk-next-tutorial2]

<!-- Images. -->
[1]: ./media/tutorial-deploy-stream-analytics/storage.png
[2]: ./media/tutorial-deploy-stream-analytics/asa_input.png
[3]: ./media/tutorial-deploy-stream-analytics/asa_output.png

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