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

At the end of this tutorial, you have a fully functional IoT Edge deployed Azure Stream Analytics module capable of querying telemetry data and streaming to an Azure Storage container (BLOB).  You will then run the ASA module in IoT Edge to generate telemetry data (temperature), stream this data and query based on an aggregated average peak, and store the results in a storage container to download at the end of the tutorial.  The entire solution set will include an Azure IoT Hub, Azure Storage Container, Azure Stremaing Analytics job, and IoT Edge container deployment.

For further reference see:

* **[IoT Edge][lnk-what-is-iot-edge]**, as a quick-start tutorial on getting started in IoT Edge.
* **[Azure IoT Hub][azure-iot]**, for an overview on Azure IoT Hub.
* **[Azure Streaming Analytics][azure-stream]**, for an overview on Azuure Streaming Analytics.
* **[Azure Storage][azure-storage]**, for an overview on Azure Storage Container.

To complete this tutorial, you need the following:

* IoT Hub setup (see installation guide [here][iot-hub-get-started-create-hub])
* IoT Edge runtime installed (see setup [here][lnk-first-tutorial])
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

> [!NOTE]
> Please note your IoT Hub connection string and edge device ID for use later in this tutorial.

## Setup Azure Storage Account

In this section, you create an Azure Storage Account to be used to store data results sent from your device. A device sends it data to the hub where it is picked up by an Azure Streaming Analytics job and forwarded to the BLOB storage created here. For more information, see the **Blobs** section of the [Azure Storage Documentation][azure-storage]. Run this app to generate the unique device ID and key your device uses to identify itself when it sends device-to-cloud messages.

1.  Under New..., Storage..., create a Storage account.

2.  Enter a name and use remaining default values.  Click Create.

    ![new storage account][1]

## Setup Azure Stream Analytics (ASA) job

In this section, you create an Azure Stream Analytics job to take data from your IoT hub, query the sent telemetry data from your device, and forward the results to an Azure Storage Container (BLOB). For more information, see the **Overview** section of the [Stream Analytics Documentation][azure-stream]. 

1.  Under New..., Internet of Things..., create a Stream Analytics Job... in Azure portal

2. Select the new ASA, under Job Topology, select Inputs, click Add

3. Enter name and use defaults, click Create.

    ![ASA input][2]

4. Under Job Topology, select Outputs, click Add

5. Enter name and use defaults.  Create a new Storage Container under the Storage Account created previously.

    ![ASA output][3]

6. Under job Topology, select Query, enter in query

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

1. Download the BLOB JSON data file from the Storage Account and see the results.

## Next steps

In this tutorial, you configured an Azure Storage container and Streaming Analytics job to analyze data coming in from you IoT Edge device.

To continue getting started with IoT Edge and to explore other Edge scenarios, see:

* [What is IoT Edge][lnk-what-is-iot-edge]
* [Create custom modules][lnk-module-tutorial]
* [Deploy Azure Machine Learning as a module][lnk-next-tutorial]

## Un-finalized Steps

1. Open IoT Edge Explorer 

1. Open {device Id} blade 

1. Select "Deploy modules" 

1. Add ASA module 

1. Select created job 

1. Çopy routes snippet 

```
"routes": {                                                               
  "telemetryToCloud": "FROM /messages/modules/tempSensor/* INTO $upstream", 
  "alertsToCloud": "FROM /messages/modules/ASA/* INTO $upstream", 
  "alertsToReset": "FROM /messages/modules/ASA/* INTO BrokeredEndpoint("/messages/modules/tempSensor/inputs/reset")", 
  "telemetryToAsa": "FROM /messages/modules/tempSensor/* INTO BrokeredEndpoint("/messages/modules/ASA/inputs/temperature")" 
}    
```  

1. Click "deploy" 

1. Go in device detail blade, click refresh, see things working. 
 
On box (optional): 

1. Use hub explorer to get telemetry 

1. Link storage account and ASA  (ASA portal) 

1. Create query  (ASA portal) 

1. Compile query to storage account (ASA portal) 

1. Update deployment with ASA module using the "deploy to device" wizard: 

1. Add existing module JSON, ASA module JSON, ASA module twin via service to service integration 

1. Add routes 

1. Push deploy 

1. Monitor container reporting status in Ibiza 

1. see logs on device 

<!-- Images. -->
[1]: ./media/tutorial-deploy-stream-analytics/storage.png
[2]: ./media/tutorial-deploy-stream-analytics/asa_input.png
[3]: ./media/tutorial-deploy-stream-analytics/asa_output.png

<!-- Links -->
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