---
title: How to clone an Azure IoT hub
description: How to clone an Azure IoT hub
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/18/2019
ms.author: robinsh
# intent: As a customer using IoT Hub, I need to clone my IoT hub to another region. 
---
# How to clone an Azure IoT hub 

This article will explore the options and methods you can look at in order to clone an IoT hub. For example, your hub may be set up in East US, and global warming causes the ocean levels to rise and inundate the east coast. You may want to move your hub to the west coast before the data center goes out and all the electrical circuits fail and before the guards have to swim out.

There is no guarantee that this will work cleanly, so we recommend that you do not remove the "old" resources before creating the new ones, and that you use different names for the new resources.

## Things to consider/know

* If you want to have an exact copy of your current hub in a different region, you must delete the current hub before you recreate it. This is because the hub name is a globally unique value, and can not exist in two places. For example, you could have an IoT Hub called ContosoBusiness in the East, but when you create it in the west, call it ContosoBusiness2 or ContosoBusinessW, so the name is different.

* You also need to use a different resource group name. You can also create the new infrastructure after deleting the previous resource group. This is not the recommended method.

* We do not recommend that you remove the current hub without recreating it first and doublechecking that the functionality of the new hub is correct. Once you remove a hub, it's gone forever, and there is no way to check for different settings or data.

* Your data will not be transferred - primarily, this would be any metrics and logging that exist on the current hub. You can develop a program to export this data and import it in the new location if you need to move this kind of information.

* The method we recommend for moving an IoT Hub from one region to another is to export the hub and its settings into a Resource Manager template, make some small changes to that template, and use it to create the hub in the new location. The small changes would be information that is not exported, such as any encrypted keys. 

* Your only other option is to create the new hub in the new location and use the portal to compare all of its settings to the old hub. This is long and tedious.

* What about manual failover? Does that create a second hub for you?

* If you have custom routing configured for your hub, the routing configuration is retained in the exported RM template. However, the resources are not. For example, if you are routing everything going to the custom endpoint to a storage account, the storage account is not set up for you, but the routing configuration is retained in the ARM template. This would be one of the changes you would have to make to the RM template. You could either create the storage account in the RM template or manually, before importing the template with the hub and its configuration data. Note that the names for storage accounts must be globally unique, so you will need to either delete the current storage and use the same name, or change the name.  

* Not all data is exported to the RM template. One known data point that is not exported is Consumer Group. You will need to either add this to the template manually or add the consumer group after the hub is created. 
    - Add to the template manually.
    - Add Consumer Group through the portal.

* To get keys for 
    - the iot hub 
    - the iot hub devices (do this at export time as part of the export -- choose to export the keys)

* The devices for the IoT Hub must be exported from the old hub and reimported to the new hub. To do this, you can use the Import/Export app to export the data and then reimport it to the new hub. 
    - Download the c# samples: [link to sample]
    - Go to the CloneAHub folder and use Visual Studio to open the CloneHubDevices.sln file.
    - Get the connection string from the old IoT Hub and put it in the code where it says {iot hub connection string}.
    - Go to the ExportDevices method in the Program.cs file and set the number num_of_devices to the number of devices you want toe export. You may want to start with a smaller number of devices (like under 10,000) to test the import/export. Set the container and storage account information where the devices will be stored.
    - In program.cs, it has code to run three methods.

      . **exportdevices** -- this exports the devices registered with the IoT Hub to a file called *devices.txt* in blob storage. 
      . **importandandddevices** -- this will add new devices with random keys (helpful for testing)
      . **importexistingdevices** -- this will import the devices from the *devices.txt* file stored in blob storage in to the IoT hub.
      . **deletedevices** -- this will delete all of the devices registered for an IoT hub. 

*  How to move resources when using a storage account as a custom endpoint.
*  How to move the resources when using a service bus queue as a custom endpoint.
*  How to move the resource when using a service bus topic 
*  How to move the resource when using an event hub as a custom endpoint.
*  How to move the resource when using Azure Data Lake as a custom endpoint.
