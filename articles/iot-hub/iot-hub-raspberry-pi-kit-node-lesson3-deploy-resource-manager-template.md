<properties
 pageTitle="Create an Azure function app and storage account | Microsoft Azure"
 description="The Azure function app listens to Azure IoT hub events, processes incoming messages, and writes them to Azure table storage."
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
 ms.date="10/21/2016"
 ms.author="xshi"/>

# 3.1 Create an Azure function app and storage account

[Azure Functions](../../articles/azure-functions/functions-overview.md) is a solution for easily running *functions* (small pieces of code) in the cloud. An Azure function app hosts the execution of your functions in Azure.

## 3.1.1 What you will do

Use an Azure Resource Manager template to create an Azure function app and a storage account. The Azure function app listens to Azure IoT hub events, processes incoming messages, and writes them to Azure table storage. If you have any problems, look for solutions in the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## 3.1.2 What you will learn

In this section, you will learn:

- How to use [Azure Resource Manager](../../articles/azure-resource-manager/resource-group-overview.md) to deploy Azure resources.
- How to use an Azure function app to process IoT hub messages and write them to a table in Azure table storage.

## 3.1.3 What you need

You must have successfully completed the previous lessons: [Get started with your Raspberry Pi 3](iot-hub-raspberry-pi-kit-node-get-started.md) and [Create your Azure IoT hub](iot-hub-raspberry-pi-kit-node-get-started.md).

## 3.1.4 Open the sample app

Open the sample project in Visual Studio Code by running the following commands:

```bash
cd Lesson3
code .
```

![Repo Structure](media/iot-hub-raspberry-pi-lessons/lesson3/repo_structure.png)

- The `app.js` file in the `app` subfolder is the key source file. This source file contains the code to send a message 20 times to your IoT hub and blink the LED for each message it sends.
- The `arm-template.json` file is the Azure Resource Manager template that contains an Azure function app and a storage account.
- The `arm-template-param.json` file is the configuration file used by the Azure Resource Manager template.
- The `ReceiveDeviceMessages` subfolder contains the Node.js code for the Azure function.

## 3.1.5 Configure Azure Resource Manager templates and create resources in Azure

Update the `arm-template-param.json` file in Visual Studio Code.

![Azure Resource Manager template parameters](media/iot-hub-raspberry-pi-lessons/lesson3/arm_para.png)

- Replace **[your IoT Hub name]** with **{my hub name}** that you specified in [Lesson 2](iot-hub-raspberry-pi-kit-node-lesson2-prepare-azure-iot-hub.md).
- Replace **[prefix string for new resources]** with any prefix you want. The prefix ensures that the resource name is globally unique to avoid conflict. Do not use a dash or number initial in the prefix.

> [AZURE.NOTE] You don't need `azure_storage_connection_string` in this section. Keep it as is.

After you update the `arm-template-param.json` file, deploy the resources to Azure by running the following command:

```bash
az resource group deployment create --template-file-path arm-template.json --parameters-file-path arm-template-param.json -g iot-sample -n mydeployment
```

It takes about five minutes to create these resources. While the resource creation is in progress, you can move on to the next section.

## 3.1.6 Summary

You've created your Azure function app to process IoT hub messages and an Azure storage account to store these messages. You can move on to the next section to deploy and run the sample to send device-to-cloud messages on your Pi.

## Next Steps

[3.2 Run sample application to send device-to-cloud messages on your Raspberry Pi 3](iot-hub-raspberry-pi-kit-node-lesson3-run-azure-blink.md)
