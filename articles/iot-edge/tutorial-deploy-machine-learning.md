---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy Azure Machine Learning with Azure IoT Edge | Microsoft Docs 
description: Deploy Azure Machine Learning as a module to an edge device
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

---

# Deploy Azure Machine Learning as an IoT Edge module

You can use IoT Edge modules to deploy code that implements your business logic directly to your IoT Edge devices. This tutorial walks you through deploying an Azure Machine Learning module that predicts when a device fails based on sensor data on the simulated IoT Edge device that you created in the Deploy Azure IoT Edge on a simulated device on [Windows][lnk-tutorial1-win] or [Linux][lnk-tutorial1-lin] tutorials. You learn how to: 

> [!div class="checklist"]
> * Deploy an Azure Machine Learning module to your IoT Edge device
> * View generated data

The Azure Machine Learning module is a module hosted in DockerHub that contains a sample machine learning model.  When you want to use your own Azure Machine Learning model in your solution you will [deploy a model](https://docs.microsoft.com/en-us/azure/machine-learning/preview/tutorial-classifying-iris-part-3) for IoT Edge and host it in a container registry like [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/).

## Prerequisites

* The Azure IoT Edge device that you created in the quickstart or first tutorial.
* The IoT Hub connection string for the IoT hub that your IoT Edge device connects to.  

## Run the solution

1. On the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Go to **IoT Edge (preview)** and select your IoT Edge device.
1. Select **Set modules**.
1. Select **Add IoT Edge module**.
1. In the **Name** field, enter `tempSensor`.
1. In the **Image URI** field, enter `edgepreview.azurecr.io/azureiotedge/simulated-temperature-sensor:1.0-preview`.
1. Leave the other settings unchanged and select **Save**.
1. Still on the **Add Modules** step, select **Add IoT Edge module** again.
1. In the **Name** field, enter `machinelearningmodule`.
1. In the **Image** field, enter `microsoft/azureiotedge-sensor-anomaly-detection:latest`.
1. Click **Save**.
1. Back in the **Add Modules** step, click **Next**.
1. Update routes for your module:
1. In the **Specify Routes** step, copy the JSON below into the text box. Modules publish all messages to the Edge runtime. Declarative rules in the runtime define where those messages flow. In this tutorial you need two routes. The first route transports messages from the temperature sensor to the machine learning module via the "mlInput" endpoint, which is the endpoint that all Azure Machine Learning modules use. The second route transports messages from the machine learning module to IoT Hub. In this route, ''mlOutput'' is the endput that all Azure Machine Learning modules use to output data, and ''upstream'' is a special destination that tells Edge Hub to send messages to IoT Hub. 

    ```json
    {
        "routes": {
            "sensorToMachineLearning":"FROM /messages/modules/tempSensor/outputs/temperatureOutput INTO BrokeredEndpoint(\"/modules/machinelearningmodule/inputs/amlInput\")",
            "machineLearningToIoTHub": "FROM /messages/modules/machinelearningmodule/outputs/amlOutput INTO $upstream"
        }
    }
    ``` 

1. Click **Next**. 
1. In the ''Review Template'' step, click ''Submit''. 
1. Return to the device details page and click ''Refresh.''  You should see the new ''machinelearningmodule'' running along with the ''tempSensor module'' and the ''IoT Edge runtime''.

## View generated data

 In VS Code, use the **View | Command Palette... | IoT: Start Monitoring D2C Messages** menu command to monitor data arriving in the IoT Hub. 

## Next steps

In this tutorial, you deployed an IoT Edge module powered by Azure Machine Learning. You can continue on to any of the other tutorials to learn about other ways that Azure IoT Edge can help you turn data into business insights at the edge.

> [!div class="nextstepaction"]
> [Deploy an Azure Function as a module](tutorial-deploy-function.md)

<!--Links-->
[lnk-tutorial1-win]: tutorial-simulate-device-windows.md
[lnk-tutorial1-lin]: tutorial-simulate-device-linux.md
