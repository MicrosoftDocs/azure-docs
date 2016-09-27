<properties
 pageTitle="Create an Azure function app and a storage account to process and store IoT hub messages"
 description="Use an Azure Resource Manager (ARM) template to create an Azure function app and a storage account. The Azure function app listens to Azure IoT hub events, processes incoming messages, and writes them to Azure table storage."
 services="iot-hub"
 documentationCenter=""
 authors="shizn"
 manager="timlt"
 tags=""
 keywords=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/28/2016" 
 ms.author="xshi"/>

# 3.1 Create an Azure function app and a storage account to process and store IoT hub messages

## 3.1.1 What you will do
Use an Azure Resource Manager (ARM) template to create an Azure function app and a storage account. The Azure function app listens to Azure IoT hub events, processes incoming messages, and writes them to Azure table storage.

## 3.1.2 What you will learn
- How to use [Azure Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/) to deploy Azure resources
- How to use an Azure function app to process IoT hub messages and write them to a table
 - [Azure Functions](https://azure.microsoft.com/en-us/documentation/articles/functions-overview/) is a solution for easily running small piece of code, or “functions”, in the cloud. An Azure function app hosts the execution of your functions in Azure.

## 3.1.3 What you need
- You must have successfully completed the previous lessons: [Get started with your Raspberry Pi 3 device](iot-hub-raspberry-pi-node-lesson1.md) and [Create your Azure IoT Hub](iot-hub-raspberry-pi-node-lesson2.md)

## 3.1.4 Clone the sample code
To get started, clone the `azure-blink` sample application from Github from your workspace directory (az-iot-samples).

```bash
git clone https://github.com/Azure-Samples/iot-hub-node-raspberrypi-azure-blink
```

Run the following command to open the sample project in VS Code:

```bash
code iot-hub-node-raspberrypi-azure-blink
```

![Repo Structure](media/iot-hub-raspberry-pi-lessons/lesson3/repo_structure.png)

- `app.js` in the `app` sub-folder is the key source file that contains the code sending a message 20 times to your IoT hub and blinking the LED every time it sends a message.
- `arm-template.json` is the ARM template containing an Azure function app and a storage account.
- `arm-template-param.json` file is the configuration file used by the ARM template.
- `config.json` is the configuration file that contains information required to connect to the board and your IoT hub.
- `ReceiveDeviceMessages` sub-folder contains Node.js code for the Azure function.

## 3.1.5 Configure the ARM templates and create resources
Use VS Code to update your ARM template configuration file:

![ARM template parameters](media/iot-hub-raspberry-pi-lessons/lesson3/arm_para.png)

- Replace **[your IoT Hub name]** with the **{my hub name}** you specified in [Lesson 2](iot-hub-raspberry-pi-node-lesson2-prepare_azure_iot_hub.md)
- Replace **[prefix string for new resources]** with any prefix you want. The resource name is globally unique, so this prefix helps you avoid conflict (no dash, no number initial). 

After you finished updating the `arm-template-param.json` file, change directory to `iot-hub-node-raspberrypi-azure-blink` and  run the following command to deploy to Azure:

```bash
cd iot-hub-node-raspberrypi-azure-blink
az resource group deployment create --template-file-path azuredeploy.json --parameters-file-path arm-template-param.json -g iot-sample -n mydeployment
```

It will take about 5 minutes to create these resources. While the resource creation is in progress, you can move to the next section to prepare the sample application which will be deployed to your Raspberry Pi 3.

## 3.1.6 Summary
You have now cloned the sample repo and created your Azure function app to process IoT hub messages and an Azure storage account to persist them. You can move to the next section to deploy and run the Azure blink sample application on your Raspberry Pi 3.

## Next Steps
[3.2 Run the Azure blink sample application on your Raspberry Pi 3](iot-hub-raspberry-pi-node-lesson3-run-azure-blink.md)
