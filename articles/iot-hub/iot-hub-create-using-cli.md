<properties
	pageTitle="Create an IoT Hub using CLI | Microsoft Azure"
	description="Follow this article to create an IoT Hub using the Azure Command Line Interface."
	services="iot-hub"
	documentationCenter=".net"
	authors="BeatriceOltean"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="multiple"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="09/21/2016"
     ms.author="boltean"/>

# Create an IoT Hub using CLI

[AZURE.INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction

You can use Azure Command Line Interface is a to create and manage Azure IoT hubs programmatically. This article shows you how to use a Azure CLI to create an IoT hub.

To complete this tutorial you need the following:

- An active Azure account. You can create an [Azure Free Trial][lnk-free-trial] account in just a couple of minutes.
- [Azure CLI 0.10.4][lnk-CLI-install] or later. If you already have Azure CLI you can validate the current version at the command prompt with the following command:
```
    azure --version
```

> [AZURE.NOTE] Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../resource-manager-deployment-model.md). The Azure CLI must be in Azure Resource Manager mode:
```
    azure config mode arm
```

## Set your Azure account and subscription 

1. At command prompt login by typing the following command
```
    azure login
```
That will provide in command line the web browser and the code to authenticate.

2. If you have multiple Azure subscriptions, connecting to Azure will grant access to all subscriptions associated with your credentials. You can view the subscriptions, as well as which one is the default, using the command
```
    azure account list 
```

To set the subscription context under which you want to run the rest of the commands use

```
    azure account set <subscription name>
```

3. If you do not have a resource group you can create one named **exampleResourceGroup** 
```
    azure group create -n exampleResourceGroup -l westus
```

> [AZURE.TIP] The article [Use the Azure CLI to manage Azure resources and resource groups][lnk-CLI-arm] provides more information about how to use Azure CLI to manage Azure resources. 


## Create and IoT Hub

Required parameters:

```
 azure iothub create -g <resource-group> -n <name> -l <location> -s <sku-name> -u <units>  
	- <resourceGroup> The resource group name (case insensitive alphanumeric, underscore and hyphen, 1-64 length)
	- <name> (The name of the IoT hub to be created. The format is case insensitive alphanumeric, underscore and hyphen, 3-50 length )
	- <location> (The location (azure region/datacenter) where the IoT hub will be provisioned.
	- <sku-name> (The name of the sku, one of: [F1, S1, S2, S3] etc. For the latest full list refer to the pricing page for IoT Hub.
    - <units> (The number of provisioned units. Range : F1 [1-1] : S1, S2 [1-200] : S3 [1-10]. IoT Hub units are based on your total message count and the number of devices you want to connect.)
```
To see all the parameters available for creation you can use the help command in command prompt
```
	azure iothub create -h 
```
Quick example:

 To create an IoT Hub called **exampleIoTHubName** in the resource group **exampleResourceGroup** simply run the following command
```
    azure iothub create -g exampleResourceGroup -n exampleIoTHubName -l westus -k s1 -u 1
```

> [AZURE.NOTE] This CLI command creates an S1 Standard IoT Hub for which you are billed. You can delete the IoT hub **exampleIoTHubName** using following command 
```
    azure iothub delete -g exampleResourceGroup -n exampleIoTHubName
```


## Next steps
To learn more about developing for IoT Hub, see the following:
- [IoT Hub SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

- [Using the Azure Portal to manage IoT Hub][lnk-portal]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-azure-portal]: https://portal.azure.com/
[lnk-status]: https://azure.microsoft.com/status/
[lnk-CLI-install]: ../xplat-cli-install.md
[lnk-rest-api]: https://msdn.microsoft.com/library/mt589014.aspx
[lnk-azure-rm-overview]: ../resource-group-overview.md
[lnk-CLI-arm]: ../xplat-cli-azure-resource-manager.md

[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-portal]: iot-hub-create-through-portal.md 
