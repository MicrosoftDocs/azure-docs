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

At the end of this tutorial, you have a fully functional IoT Edge deployed Azure Stream Analytics module capable of querying telemetry data and streaming to an Azure Storage container (BLOB).  You will run an ASA module to in IoT Edge to generate telemetry data (temperature), stream the data and query based on an aggregated average peak, and store the results in a storage container to download at the end of the tutorial.  The entire solution set will include an Azure IoT Hub, Azure Storage Container, Azure Stremaing Analytics job, and IoT Edge container deployment.

For further reference see:

* **[IoT Edge][lnk-what-is-iot-edge]**, quick-start tutorial on getting started in IoT Edge.
* **Azure IoT Hub**, overview on Azure IoT Hub.
* **Azure Streaming Analytics**, overview on .
* **[Azure Storage][azure-storage]**, for an overview on Azure Storage Container.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both applications to run on devices and your solution back end.

To complete this tutorial, you need the following:
[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

You have now created your IoT hub, and you have the host name and IoT Hub connection string that you need to complete the rest of this tutorial.
* IoT Hub setup (see installation guide [here][iot-hub-get-started-create-hub])
* IoT Edge runtime installed (see setup [here][lnk-first-tutorial])
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

> [!NOTE]
> Please note your IoT Hub connection string and edge device ID for use later in this tutorial.

## Setup Azure Storage Account

In this section, you create an Azure Storage Account to be used to store data results sent from your device. A device sends it data to the hub where it is picked up by an Azure Streaming Analytics job and forwarded to the BLOB storage created here. For more information, see the **Blobs** section of the [Azure Storage Documentation][azure-storage]. Run this app to generate the unique device ID and key your device uses to identify itself when it sends device-to-cloud messages.

1.  Under New..., Storage..., create a Storage account.
![new storage account][1]
1. In Storage, under Blob Service, click Browse blobs, click Add Container, enter name, click OK. (include this step as part of Analytics creation)

## Setup Azure Stream Analytics (ASA) job

In this section, you create an Azure Stream Analytics job to take data from your IoT hub, query the sent telemetry data from your device, and forward the results to an Azure Storage Container (BLOB). For more information, see the **Overview** section of the [Stream Analytics Documentation][azure-stream]. 

1.  Under New..., Internet of Things..., create a Stream Analytics Job... in Azure portal
2. Select the new ASA, under Job Topology, select Inputs, click Add
3. Enter name, click Create.
4. Under Job Topology, select Outputs, click Add
5. Enter name, select Blob storage for Sink, select storage container created previously, click Create.
6. Under job Topology, select Query, enter in query
```
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
7.  Click Save

## Setup IoT Edge with ASA module

In this section, you create an Azure Stream Analytics job to take data from your IoT hub, query the sent telemetry data from your device, and forward the results to an Azure Storage Container (BLOB). For more information, see the **Overview** section of the [Stream Analytics Documentation][azure-stream]. 

1. From your command-line, start the IoT Edge runtime:
```
launch-edge-runtime -c "<IoT Hub device connection string>
```

2. Create the following deployment file: (to be replaced by ASA module?)
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

## Run the apps

You are now ready to run the apps.

1. Under the Stream Analytics Job, under Overview, click Start.

1. At a command prompt, run the following command to login to Edge CLI: (replaced by Ibiza UI)

    ```cmd/sh
    edge-explorer login "<IoT Hub connection string for iothubowner policy*>" 
    ```

1. Run the following command to deploy the module created above:

    ```cmd/sh
    edge-explorer edge deployment create -m <path to deployment file> -d <edge device ID> 
    ```


## Next steps

In this tutorial, you configured an Azure Storage container and Streaming Analytics job to analyze data coming in from you IoT Edge device.

To continue getting started with IoT Edge and to explore other Edge scenarios, see:

* [What is IoT Edge][lnk-what-is-iot-edge]
* [Create custom modules][lnk-module-tutorial]
* [Deploy machine learning][lnk-next-tutorial]

TBD 
Open IoT Edge Explorer 
Open {device Id} blade 
Select "Deploy modules" 
Add ASA module 
Select created job 
Çopy routes snippet 
"routes": {                                                               
  "telemetryToCloud": "FROM /messages/modules/tempSensor/* INTO $upstream", 
  "alertsToCloud": "FROM /messages/modules/ASA/* INTO $upstream", 
  "alertsToReset": "FROM /messages/modules/ASA/* INTO BrokeredEndpoint("/messages/modules/tempSensor/inputs/reset")", 
  "telemetryToAsa": "FROM /messages/modules/tempSensor/* INTO BrokeredEndpoint("/messages/modules/ASA/inputs/temperature")" 
}      
Click "deploy" 
Go in device detail blade, click refresh, see things working. 
 
On box (optional): 
Use hub explorer to get telemetry 
Link storage account and ASA  (ASA portal) 
Create query  (ASA portal) 
Compile query to storage account (ASA portal) 
Update deployment with ASA module using the "deploy to device" wizard: 
Add existing module JSON, ASA module JSON, ASA module twin via service to service integration 
Add routes 
Push deploy 
Monitor container reporting status in Ibiza 
[Optional] see the telemetry flowing in with iothub explorer 
[Optional] see logs on device 

<!-- Images. -->
[1]: ./media/tutorial-deploy-stream-analytics/storage.png

<!-- Links -->
[lnk-what-is-iot-edge]: what-is-iot-edge.md
[lnk-module-dev]: module-development.md
[iot-hub-get-started-create-hub]: ../../includes/iot-hub-get-started-create-hub.md
[azure-storage]: https://docs.microsoft.com/en-us/azure/storage/
[azure-stream]: https://docs.microsoft.com/en-us/azure/stream-analytics/
[lnk-first-tutorial]: tutorial-install-iot-edge.md
[lnk-module-tutorial]: tutorial-create-custom-module.md
[lnk-next-tutorial]: tutorial-deploy-machine-learning.md