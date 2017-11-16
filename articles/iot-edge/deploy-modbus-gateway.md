---
title: Deploy Modbus on Azure IoT Edge | Microsoft Docs
description: Allow devices that use Modbus TCP to communicate with Azure IoT Hub by creating an IoT Edge gateway device
services: iot-Edge
documentationcenter: ''
author: kgremban
manager: timlt
editor: 

ms.assetid:
ms.service: iot-hub
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/17/2017
ms.author: kgremban
ms.custom: 
---

# Connect Modbus TCP devices with Azure using an IoT Edge device as a gateway - preview

If you want to connect IoT devices that use Modbus TCP protocol to an Azure IoT hub, use an IoT Edge device as a gateway. The gateway device reads data from your Modbus devices, then communicates that data to the cloud using a supported protocol. 

This article covers how to create your own container image for a Modbus module (or you can use a prebuilt sample) and then deploy it to the IoT Edge device that will act as your gateway. 

Currently the Modbus module only supports Modbus TCP protocol. 

## Prerequisites
* The Azure IoT Edge device that you created in the quickstart or first tutorial.
* The IoT Hub connection string for the IoT hub that your IoT Edge device connects to.
* The Modbus container(use prebuilt binary or build one your own)
* A physical or simulated Modbus device supports Modbus TCP.

## Get Modbus container ready ##
If you are using a prebuilt Modbus TCP container from Microsoft public registry, continue to [Use prebuilt Modbus container](https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-deploy-modbus-tcp#use-prebuilt-modbus-container) section.  
If you are using a Modbus TCP container you built from [GitHub](https://github.com/Azure/iot-edge-modbus#howto-build), continue to [Use Modbus container from your registry](https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-deploy-modbus-tcp#use-modbus-container-from-your-registry) section.

### Use prebuilt Modbus container ###
Use the following URI to get Modbus TCP module.
```URL
microsoft/azureiotedge-modbus-tcp:1.0-preview
```
Continue to deployment at [Run the solution](https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-deploy-modbus-tcp#run-the-solution) section.

### Use Modbus container from your registry ###
This section will get your image push to a [Docker repository](https://docs.docker.com/glossary/?term=repository) hosted on a [Docker registry](https://docs.docker.com/glossary/?term=registry).


You can use any Docker-compatible registry for this tutorial. Two popular Docker registry services available in the cloud are Azure Container Registry and Docker Hub:

* [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/) is available with a [paid subscription](https://azure.microsoft.com/en-us/pricing/details/container-registry/). For this tutorial, the Basic subscription is sufficient. 
* [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags) offers one free private repository if you sign up for a (free) Docker ID. 
  1. To sign up for a Docker ID, follow the instructions in [Register for a Docker ID](https://docs.docker.com/docker-id/#register-for-a-docker-id) on the Docker site.
  2. To create a private Docker repository, follow the instructions in [Creating a new repository on Docker Hub](https://docs.docker.com/docker-hub/repos/#creating-a-new-repository-on-docker-hub) on the Docker site.

Throughout this tutorial, where appropriate, commands will be provided for both Azure Container Registry and Docker Hub.

#### Publish image to your registry ####
1. Retag the image you built from [GitHub](https://github.com/Azure/iot-edge-modbus#howto-build). For example:
   ```csg/sh
   docker tag modbus:latest <docker registry address>/modbus:latest
   ```
   where **\<docker registry address\>** is your Docker ID if you are using Docker Hub or similar to **\<your registry name\>.azurecr.io**, if you are using Azure Container Registry.
2. Sign in to Docker. In integrated terminal, enter the following command: 
   * Docker Hub (enter your credentials when prompted):
     ```csh/sh
     docker login
     ```
   * For Azure Container Registry:
     ```csh/sh
     docker login -u <username> -p <password> <Login server>
     ```
      To find the user name, password and login server to use in this command, go to the [Azure portal](https://portal.azure.com/). From **All resources**, click the tile for your Azure container registry to open its properties, then click **Access keys**. Copy the values in the **Username**, **password**, and **Login server** fields. The login server sould be of the form: **\<your registry name\>.azurecr.io**.
3. Push the image to your Docker repository. Use the same image name you used in step 1.
   ```csh/sh
   docker push <docker registry address>/modbus:latest
   ```

#### Add registry credentials to Edge runtime on your Edge device ####
Add the credentials for your registry to the Edge runtime on the computer where you are running your Edge device. This gives the runtime access to pull the container. 

* For Windows, run the following command:
  ```cmd/sh
  iotedgectl login --address <docker-registry-address> --username <docker-username> --password <docker-password> 
  ```
* For Linux, run the following command:
  ```cmd/sh
  sudo iotedgectl login --address <docker-registry-address> --username <docker-username> --password <docker-password> 
  ```

## Run the solution ##
1. On the [Azure portal](https://portal.azure.com/), navigate to your IoT hub.
2. Go to **IoT Edge (preview)** and select your IoT Edge device.
3. Select **Set modules**.
4. Select **Add IoT Edge module**.
5. In the **Name** field, enter "modbus" as the name of the module.
6. In the **Image** field, enter the image URI of the container that you made in the previous [section](https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-deploy-modbus-tcp#get-modbus-container-ready).
7. Check **Enable** box under **Module twin's desired properties**.
8. Copy the JSON below into the text box. You should make change of the **SlaveConnection** to the ipv4 address of your Modbus device.
```JSON
{  
   "properties.desired":{  
      "Interval":"2000",
      "SlaveConfigs":{  
         "Slave01":{  
            "SlaveConnection":"192.168.0.1",
            "HwId":"PowerMeter-0a:01:01:01:01:01",
            "Operations":{  
               "Op01":{  
                  "UnitId":"1",
                  "StartAddress":"400001",
                  "Count":"2",
                  "DisplayName":"Voltage"
               }
            }
         }
      }
   }
}
```
9. Click **Save**.
10. Back in the **Add Modules** step, click **Next**.
11. Update routes for your module:
12. In the **Specify Routes** step, copy the JSON below into the text box. Modules publish all messages to the Edge runtime. Declarative rules in the runtime define where those messages flow. In this tutorial you need one route. It routes all messages collected by the Modbus module to IoT Hub. In this route, ''modbusOutput'' is the endpoint that Modbus module use to output data, and ''upstream'' is a special destination that tells Edge Hub to send messages to IoT Hub. 
```JSON
{
    "routes": {
        "modbusToIoTHub":"FROM /messages/modules/modbus/outputs/modbusOutput INTO $upstream"
    }
}
```
13. Click **Next**. 
14. In the **Review Template** step, click **Submit**. 
Return to the device details page and click **Refresh**. You should see the new **modbus** running along with the **IoT Edge runtime**.

## View data ##
Run the command to see all system logs and metrics data.
```cmd/sh
docker logs -f modbus
```

You can also view the telemetry the device is sending by using the [IoT Hub explorer tool](https://github.com/azure/iothub-explorer). 

## Next steps ##
In this tutorial, you deployed an IoT Edge module powered by Modbus TCP. You can continue on to any of the other tutorials to learn about other ways that Azure IoT Edge can help you turn data into business insights at the edge.