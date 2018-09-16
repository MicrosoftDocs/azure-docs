---
title: Azure Germany IoT services | Microsoft Docs
description: Provides a starting point for IoT Suite for Azure Germany
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/01/2018
ms.author: ralfwi
---
# Azure Germany IoT services

## IoT solution accelerators
All the required services for Azure IoT Suite are available in Azure Germany. 

### Variations
The home page for Azure IoT Suite in Azure Germany is different from the page in global Azure.

## Solution accelerators
You might want to start with one of the following solution accelerators. 

### Remote Monitoring
The Remote Monitoring solution accelerator is an implementation of an end-to-end monitoring solution for multiple machines running in remote locations. The solution combines key Azure services to provide a generic implementation of the business scenario. You can use the solution as a starting point for your own implementation and customize it to meet your specific business requirements.

### Predictive Maintenance
The Predictive Maintenance solution accelerator is an end-to-end solution for a business scenario that predicts the point at which a failure is likely to occur. You can use this solution proactively for activities such as optimizing maintenance. The solution combines key Azure IoT Suite services, such as Azure IoT Hub, Stream Analytics, and a Machine Learning workspace. This workspace contains a model, based on a public sample data set, to predict the Remaining Useful Life (RUL) of an aircraft engine. The solution fully implements the IoT business scenario as a starting point for you to plan and implement a solution that meets your specific business requirements.


## Deploying the solution accelerator

Both solutions can be deployed in two ways, via website or via PowerShell.

### Deploy via website

Follow the instructions in the [tutorial for the preconfigured solutions](../iot-accelerators/iot-accelerators-remote-monitoring-explore.md) by using the home page mentioned earlier.

### Deploy via PowerShell

There's a full version (using Azure Resource Manager templates and Visual Studio) for the *remote monitoring* solution. Download from the [Azure-IoT-Remote-Monitoring repository on GitHub](https://github.com/Azure/azure-iot-remote-monitoring). The PowerShell deployment is ready for other environments like Azure Germany. Provide the *Environment* parameter "AzureGermanCloud," so it looks similar to this:

    build.cmd cloud debug AzureGermanCloud

Bing Maps is currently not available in Azure Germany and therefore cannot be subscribed to automatically. You can solve this problem by subscribing to the service in global Azure and using the service there. 

> [!NOTE]
> When you use Bing Maps the way it's described here, you leave the Azure Germany environment.

Here's how to do it:

1. Create a Bing Maps API in the global Azure portal by clicking **+ New**, searching for **Bing Maps API for Enterprise**, and following the prompts.
2. Get your Bing Maps API for Enterprise key from the global Azure portal: 
    1. Browse to the resource group where your Bing Maps API for Enterprise is in the global Azure portal.
    2. Click **All Settings** > **Key Management**. 
    3. You see two keys: MasterKey and QueryKey. Copy the value for QueryKey.
3. Pull down the latest code from the [Azure-IoT-Remote-Monitoring repository on GitHub](https://github.com/Azure/azure-iot-remote-monitoring).
4. Run a cloud deployment in your environment by following the command-line deployment guidance in the `/docs/` repository folder. 
5. After you've run the deployment, look in your root folder for the **.user.config** file created during deployment. Open this file in a text editor. 
6. Change the following line to include the value that you copied for QueryKey: `<setting name="MapApiQueryKey" value="" />`
7. Redeploy the solution by repeating step 4.
 


## Next steps
For supplemental information and updates, subscribe to the 
[Azure Germany blog](https://blogs.msdn.microsoft.com/azuregermany/).
