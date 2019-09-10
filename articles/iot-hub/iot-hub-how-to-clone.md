---
title: How to clone an Azure IoT hub
description: How to clone an Azure IoT hub
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 09/09/2019
ms.author: robinsh
# intent: As a customer using IoT Hub, I need to clone my IoT hub to another region. 
---
# How to clone an Azure IoT hub 

This article explores the options and methods you can look at to clone an IoT hub, and provides a recommended course of action. Why would you want to clone an IoT hub in a different region? One use for this is to migrate your hub from the Free or Basic tier to a Standard tier. 

> [!NOTE]
> Need examples on what the customer would use this for.

To move a hub to a different region, you need a subscription with administrative access to the original hub. You can put the new hub in a new resource group and region, but it can be in the same subscription.

## Things to consider

* Do not remove the original resources before creating and verifying the cloned version. Once you remove a hub, it's gone forever, and there is no way to recover it to check the settings or data to make sure you had replicated them correctly.

* Many resources require globally unique names, so we strongly recommend you use different names for the cloned versions. 

* If all of your resources are in a resource group, use a resource group with a different name for the cloned version.

* Data for the original IoT hub data is not migrated. This includes all telemetry messages, C2D commands, and job-related information such as schedules and history. Metrics and logging results are also not migrated. For data or messages routed to Azure Storage, you can leave the data in the original storage account, or transfer that data to a new storage account in the new region. For more information, see [Get started with AzCopy](../storage/common/storage-use-azcopy-v10.md).

* Data for Service Bus Topics and Queues and Event Hubs can not be migrated, as this is point-in-time data and is not stored long-term.

## Routing 

If you have custom routing defined for the original hub, exporting the template for the hub includes the routing rules. However, it does not export the creation of the resources used. For example, you can set up routing on your hub to send all messages with the string "critical" to Azure Storage. When you export that hub to a template, it includes the routing rules required to send the data to a storage account meeting that condition. However, it does not create the storage account, so the routing rule fails. 

You could export the hub and its routing rules, and then set up the separate resources using the [Azure portal](https://portal.azure.com) before importing the template to create the hub. You could also add the resources to the RM template to be created when it creates the hub, although adding resources with the exact right syntax is difficult unless you have expertise in Resource Manager template. 

> [!NOTE]
> Test this so you know exactly what it does. I'm not sure if it causes an error when you upload the template, or if that actually works, but if you send messages to the hub, it fails after it writes the message to the hub and when it tries to route the message. At what point does this mess up the works?
> 
> Do we provide examples or just show them how to clone a simple hub without useful bits like the routing?
> 
> Do we need to write an article about how to add the resources to the template?

## Methodology 

This is the general method we recommend for moving an IoT Hub from one region to another. This assumes the hub does not have routing rules.

   1. Export the hub and its settings to a Resource Manager template. 
   
   1. Make the necessary changes to the template, such as the resource name and encrypted keys.
   
   1. Update the parameter file, if needed. 
   
   1. Import the template into a new resource group in the new region.
   
   1. Debug as needed. 
   
   1. Add anything that wasn't exported to the template. For example, Consumer Group is not exported to the template. You need to add the Consumer group to the template manually or use the [Azure portal](https://portal.azure.com] after the hub is created. 

## Examples of resources used for the routing rules (?)

> [!NOTE]
> Do we need to provide this information, or put all of the examples in a separate article and link to it? 
> *  How to move resources when using a storage account as a custom endpoint.
> *  How to move resources when using a service bus queue as a custom endpoint.
> *  How to move resource when using a service bus topic 
> *  How to move resource when using an event hub as a custom endpoint.
> *  What about the use of Event Grid and the use of Azure Data Lake?

## Steps for migrating the hub to another region

### Find the original hub and export it to a resource template.

1. Sign into the [Azure portal](https://portal.azure.com). 

1. Go to **Resource Group** and select the resource group that contains the hub you want to move. You can also go to **Resources** and find the hub that way. Click on the hub.

1. Select **Export template** from the list of properties and settings for the hub. 

[screenshot]

1. Select **Download** to download the template. Save the file somewhere you can find it again. 

### Open the template in [VS Code](https://code.visualstudio.com) or a text editor. 

1. Go to the Downloads folder (or wherever you exported the template to) and find the zip file. In the zip file, the template name  is in the format `ExportedTemplate-<ResourceManagerName>`. This example shows a generic hub with no routing rules.
   
   [include the template here]

You have to make some changes before you can turn around and upload the template in a new region. 

1. Replace the [key values].

   * To find the key values for the hub, go to the portal and find the original hub and select it. 
   * Then select **Shared access policies**, and then **iothubowner**. 
   * Select the Copy button next to the primary key to copy the key into your buffer. 
   * Go to the template and fill in the copied key where it says [whatever it says].

   > [!NOTE]
   > Ask Jimaco for the policy to select. 

1. Rename the hub. Its name is globally unique, so you can't use the same name as the original hub. Find `whatever-the-string-is` in the template and change the hub name name.

Now recreate the hub in the new location.

## Load template in to new region.

Your hub is created and live. Now add the devices that were registered to the original hub.

## Managing the devices registered to the IoT hub

The devices for the IoT Hub must be exported from the old hub and reimported to the new hub. To do this, you can use the Import/Export sample app to export the data and then reimport it to the new hub. 

1. Download the c# samples: [azure-iot-samples-csharp]  **this is not live yet**

1. Go to the iot-hub>Samples>device  and double-click on IoTHubDeviceSamples.sln to open it.

1. Right-click on the ImportExportDevices project and select **Set as Startup project**.
 
1. Get the connection string from the original IoT Hub and put it in ProcessImpExpCommands.cs where it says {connection string to your IoT hub}.

1. Get the connection string from the storage account to be used for the import/export procedures and put it in ProcessImpExpCommands.cs where it says {your storage account connection string}.
    
1. Go to the Main method in the Program.cs file and change the call to IotHubDevices.AddDevicesToHub to set the  number of devices you want to add. You may want to start with a smaller number of devices, such as 1000, to test the import/export. 
    
1. Program.cs contains code to run multiple methods.

   - **AddDevicesToHub** -- this adds new devices with random keys (helpful for testing).
    
   - **AddDevicesFromDeviceList** -- this imports the devices from the *devices.txt* file stored in blob storage in to the IoT hub.
    
   - **ExportDevicesToBlobStorage** -- this exports the devices registered with the IoT Hub to a file called *devices.txt* in blob storage. 

   - **ReadAndDisplayExportedDeviceList** -- this reads the devices registered with the IoT Hub and writes the to blob storage and displays the list of devices on the console.
    
   - **DeleteAllDevicesFromHub** -- this deletes all of the devices registered for an IoT hub, so use it with care.

1. Be sure all of the method calls are commented out except for **AddDevicesFromDeviceList**. 

1. Run the samples application. [ROBIN - HAVE A SPECIFIC METHOD IN THE PROGRAM.CS THAT THEY CAN RUN TO MOVE THE DEVICES.]

1. Go to the new hub using the [Azure portal](https://portal.azure.com). Select your hub, then select **IoT Devices**. You see the devices you just imported. You can also view the properties for the clone. 

> [!NOTE]
> Do I need to migrate the device twins? 

## Next steps

You have cloned the original IoT hub into a new hub in a new region, complete with the devices. For more information about IoT Hub and development for the hub, please see the following articles.

* [IoT Hub developer's guide](iot-hub-devguide.md)

* [IoT Hub routing](tutorial-routing.md)

* [IoT Hub device management overview](iot-hub-device-management-overview.md)
