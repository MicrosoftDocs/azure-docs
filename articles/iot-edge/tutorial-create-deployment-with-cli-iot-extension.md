---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy modules to IoT Edge devices using IoT extension for Azure CLI 2.0 | Microsoft Docs 
description: Deploy modules to an IoT Edge device using IoT extension for Azure CLI 2.0
services: iot-edge
keywords: 
author: chrissie926
manager: timlt

ms.author: menchi
ms.date: 03/02/2018
ms.topic: article
ms.service: iot-edge

ms.custom: 
ms.reviewer: kgremban
---

# Deploy modules to an IoT Edge device using IoT extension for Azure CLI 2.0

[Azure CLI 2.0](https://docs.microsoft.com/cli/azure?view=azure-cli-latest) is an open-source cross platform command-line tool for managing Azure resources such as IoT Edge. Azure CLI 2.0 is available on Windows, Linux, and MacOS.

Azure CLI 2.0 enables you to manage Azure IoT Hub resources, device provisioning service instances, and linked-hubs out of the box. The new IoT extension enriches Azure CLI 2.0 with features such as device management and full IoT Edge capability.

In this article, you set up Azure CLI 2.0 and the IoT extension. Then you learn how to deploy modules to an IoT Edge device using the available CLI commands.

## Prerequisites

* An Azure account. If you don't have one yet, you can [create a free account](https://azure.microsoft.com/free/?v=17.39a) today. 

* [Python 2.7x or Python 3.x](https://www.python.org/downloads/).

* [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) in your environment. At a minimum, your Azure CLI 2.0 version must be 2.0.24 or above. Use `az –-version` to validate. This version supports az extension commands and introduces the Knack command framework. One simple way to install on Windows is to download and install the [MSI](https://aka.ms/InstallAzureCliWindows).

* [The IoT extension for Azure CLI 2.0](https://github.com/Azure/azure-iot-cli-extension):
   1. Run `az extension add --name azure-cli-iot-ext`. 
   2. After installation, use `az extension list` to validate the currently installed extensions or `az extension show --name azure-cli-iot-ext` to see details about the IoT extension.
   3. To remove the extension, use `az extension remove --name azure-cli-iot-ext`.


## Create an IoT Edge device
This article gives instructions to create an IoT Edge deployment. The example shows you how to sign in to your Azure account, create an Azure Resource Group (a container that holds related resources for an Azure solution), create an IoT Hub, create three IoT Edge devices identity, set tags and then create an IoT Edge deployment that targets those devices. 

Log in to your Azure account. After you enter the following login command, you're prompted to use a web browser to sign in using a one-time code: 

   ```cli
   az login
   ```

Create a new resource group called **IoTHubCLI** in the East US region: 

   ```cli
   az group create -l eastus -n IoTHubCLI
   ```

   ![Create resource group][2]

Create an IoT hub called **CLIDemoHub** in the newly created resource group:

   ```cli
   az iot hub create --name CLIDemoHub --resource-group IoTHubCLI --sku S1
   ```

   >[!TIP]
   >Each subscription is allotted one free IoT hub. To create a free hub with the CLI command, replace the SKU value with `--sku F1`. If you already have a free hub in your subscription, you'll get an error message when you try to create a second one. 

Create an IoT Edge device:

   ```cli
   az iot hub device-identity create --device-id edge001 -hub-name CLIDemoHub --edge-enabled
   ```

   ![Create IoT Edge device][4]

## Configure the IoT Edge device

Create a deployment JSON template, and save it locally as a txt file. You will need the path to the file when you run the apply-configuration command.

Deployment JSON templates should always include the two system modules, edgeAgent and edgeHub. In addition to those two, you can use this file to deploy additional modules to the IoT Edge device. Use the following sample to configure you IoT Edge device with one tempSensor module:

   ```json
   {
     "moduleContent": {
       "$edgeAgent": {
         "properties.desired": {
           "schemaVersion": "1.0",
           "runtime": {
             "type": "docker",
             "settings": {
               "minDockerVersion": "v1.25",
               "loggingOptions": ""
             }
           },
           "systemModules": {
             "edgeAgent": {
               "type": "docker",
               "settings": {
                 "image": "microsoft/azureiotedge-agent:1.0-preview",
                 "createOptions": "{}"
               }
             },
             "edgeHub": {
               "type": "docker",
               "status": "running",
               "restartPolicy": "always",
               "settings": {
                 "image": "microsoft/azureiotedge-hub:1.0-preview",
                 "createOptions": "{}"
               }
             }
           },
           "modules": {
             "tempSensor": {
               "version": "1.0",
               "type": "docker",
               "status": "running",
               "restartPolicy": "always",
               "settings": {
                 "image": "microsoft/azureiotedge-simulated-temperature-sensor:1.0-preview",
                 "createOptions": "{}"
               }
             }
           }
         }
       },
       "$edgeHub": {
         "properties.desired": {
           "schemaVersion": "1.0",
           "routes": {},
           "storeAndForwardConfiguration": {
             "timeToLiveSecs": 7200
           }
         }
       },
       "tempSensor": {
         "properties.desired": {}
       }
     }
   }
   ```

Apply the configuration to your IoT Edge device:

   ```cli
   az iot hub apply-configuration --device-id edge001 --hub-name CLIDemoHub --content C:\<configuration.txt file path>
   ```

View the modules on your IoT Edge device:
    
   ```cli
   az iot hub module-identity list --device-id edge001 --hub-name CLIDemoHub
   ```

   ![List modules][6]

## Next steps

* Learn how to [use an IoT Edge device as a gateway](how-to-create-transparent-gateway.md)

<!--Links-->
[lnk-tutorial1-win]: tutorial-simulate-device-windows.md
[lnk-tutorial1-lin]: tutorial-simulate-device-linux.md

<!-- Images -->
[2]: ./media/tutorial-create-deployment-with-cli-iot-extension/create-resource-group.png
[4]: ./media/tutorial-create-deployment-with-cli-iot-extension/Create-edge-device.png
[6]: ./media/tutorial-create-deployment-with-cli-iot-extension/list-modules.png

