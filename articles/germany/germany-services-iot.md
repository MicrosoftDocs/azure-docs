---
title: Azure Germany Internet of Things | Microsoft Docs
description: This provides a starting point for the IoT Suite for Azure Germany
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
ms.date: 04/13/2017
ms.author: ralfwi
---
# Azure IoT services in Azure IoT Suite

All of the required services for Azure IoT Suite are available in Azure Germany. 

## Preconfigured solutions
You might want to start with one of the preconfigured solutions, either *Remote Monitoring* or *Predictive Maintenance*. Those solutions can be deployed in two ways, via website or via PowerShell.

### Variations

The start page for the Azure IoT Suite is different from those in global Azure. Please use [http://www.azureiotsuite.de](http://www.azureiotsuite.de) and follow the instructions. 

### Deploy solution over PowerShell

There is the full version (using Resource Manager templates and Visual Studio) for the *Remote Monitoring* solution. Download from [GitHub](https://github.com/Azure/azure-iot-remote-monitoring). The deployment over PowerShell is ready for other environments like Azure Germany. Just provide the *Environment* parameter "AzureGermanCloud", so it will look similar to this:

    build.cmd cloud debug AzureGermanCloud

For using the Bing Maps you have to make an additional step since this service is currently not available in Azure Germany and therefore cannot be subscribed automatically. You can solve this by subscribing to the service in the global Azure cloud and use the service there (please keep in mind that you are leaving your environment by doing this). Here is how to do it:

* Create a Bing Maps API in the global Azure portal by clicking `+ New`, search for *Bing Maps API for Enterprise* and follow the prompts to create.
* Get your Bing Maps API for Enterprise QueryKey from global Azure portal: 
    * Navigate to the Resource Group where your Bing Maps API for Enterprise is in the global Azure portal.
    * Click All Settings, then Key Management. 
    * You'll see two keys: MasterKey and QueryKey. Copy the value for QueryKey.
* Pull down the latest code from the [Azure-IoT-Remote-Monitoring repository on GitHub](https://github.com/Azure/azure-iot-remote-monitoring)
* Run a cloud deployment in your environment following commandline deployment guidance in the `/docs/` folder in the repository. 
* After you've run the deployment, look in your root folder for the ***.user.config** file created during deployment. Open this file in a text editor. 
* Change the following line to include the value you copied for your QueryKey: `<setting name="MapApiQueryKey" value="" />`
* Redeploy the solution by repeating step 4.
 


## Next steps
For supplemental information and updates, subscribe to the 
[Azure Germany Blog](https://blogs.msdn.microsoft.com/azuregermany/).
