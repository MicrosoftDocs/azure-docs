---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy modules to IoT Edge devices using IoT extension for Azure CLI 2.0 | Microsoft Docs 
description: Deploy modules to an IoT Edge device using IoT extension for Azure CLI 2.0
services: iot-edge
keywords: 
author: chrissie926
manager: timlt

ms.author: menchi
ms.date: 01/11/2018
ms.topic: tutorial
ms.service: iot-edge

# Optional fields. Don't forget to remove # if you need a field.
ms.custom: mvc
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
---

# Deploy modules to an IoT Edge device using IoT extension for Azure CLI 2.0

[Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/overview?view=azure-cli-latest) is an open source cross platform command line tool for managing Azure resources such as IoT Edge. Azure CLI 2.0 is available on Windows, Linux and MacOS.

Azure CLI 2.0 enables you to manage Azure IoT Hub resources, device provisioning service instances, and linked-hubs out of the box. The new IoT extension enriches Azure CLI 2.0 with features such as device management and full IoT Edge capability.

In this tutorial, you first complete the steps to set up Azure CLI 2.0 and the IoT extension. Then you learn how to deploy modules to an IoT Edge device using the available CLI commands.

## Installation 

### Step 1 - Install Python

[Python 2.7x or Python 3.x](https://www.python.org/downloads/) is required.

### Step 2 - Install Azure CLI 2.0

Follow the [installation instruction](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) to setup Azure CLI 2.0 in your environment. At a minimum, your Azure CLI 2.0 version must be 2.0.24 or above. Use `az –version` to validate. This version supports az extension commands and introduces the Knack command framework. One simple way to install on Windows is to download and install the [MSI](https://aka.ms/InstallAzureCliWindows).

### Step 3 - Install IoT extension

[The IoT extension readme](https://github.com/Azure/azure-iot-cli-extension) describes several ways to install the extension. The simplest way is to run `az extension add --name azure-cli-iot-ext`. After installation, you can use `az extension list` to validate the currently installed extensions or `az extension show --name azure-cli-iot-ext` to see details about the IoT extension. To remove the extension, you can use `az extension remove --name azure-cli-iot-ext`.


## Deploy modules to an IoT Edge device
In this tutorial, you will learn how to create an IoT Edge deployment. The example shows you how to login to your Azure account, create an Azure Resource Group (a container that holds related resources for an Azure solution), create an IoT Hub, create three IoT Edge devices identity, set tags and then create an IoT Edge deployment that targets those devices. Complete the installation steps described previously before you begin. If you don't have an Azure account yet, you can [create a free account](https://azure.microsoft.com/free/?v=17.39a) today. 


### 1. Login to the Azure account
  
    az login

![login][1]

### 2. Create a resource group IoTHubBlogDemo in eastus

    az group create -l eastus -n IoTHubBlogDemo

![Create resource group][2]


### 3. Create an IoT Hub blogDemoHub under the newly created resource group

    az iot hub create --name blogDemoHub --resource-group IoTHubBlogDemo

![Create IoT Hub][3]


### 4. Create an IoT Edge device

    az iot hub device-identity create -d edge001 -n blogDemoHub --edge-enabled

![Create IoT Edge device][4]

### 5. Apply configuration to the IoT Edge device

Save your deployment JSON template locally as a txt file. You will need the path to the file when you run the apply-configuration command.

Below is a sample deployment JSON template which contains one tempSensor module:

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
              "image": "edgepreview.azurecr.io/azureiotedge/edge-agent:1.0-preview",
              "createOptions": "{}"
            }
          },
          "edgeHub": {
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "edgepreview.azurecr.io/azureiotedge/edge-hub:1.0-preview",
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
              "image": "edgepreview.azurecr.io/azureiotedge/simulated-temperature-sensor:1.0-preview",
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

    az iot hub apply-configuration --device-id edge001 --hub-name blogDemoHub --content C:\<yourLocation>\edgeconfig.txt

![Apply configuration][5]

### 6. List modules
    
    az iot hub module-identity list --device-id edge001 --hub-name blogDemoHub

![List modules][6]

## Next steps

In this tutorial, you created an Azure Function that contains code to filter raw data generated by your IoT Edge device. To keep exploring Azure IoT Edge, learn how to use an IoT Edge device as a gateway. 

> [!div class="nextstepaction"]
> [Create an IoT Edge gateway device](how-to-create-transparent-gateway.md)

<!--Links-->
[lnk-tutorial1-win]: tutorial-simulate-device-windows.md
[lnk-tutorial1-lin]: tutorial-simulate-device-linux.md

<!-- Images -->
[1]: ./media/tutorial-create-deployment-with-cli-extension/login.jpg
[2]: ./media/tutorial-create-deployment-with-cli-extension/create-resource-group.jpg
[3]: ./media/tutorial-create-deployment-with-cli-extension/create-hub.jpg
[4]: ./media/tutorial-create-deployment-with-cli-extension/Create-edge-device.png
[5]: ./media/tutorial-create-deployment-with-cli-extension/apply-configuration.PNG
[6]: ./media/tutorial-create-deployment-with-cli-extension/list-modules.PNG

