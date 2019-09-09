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

This article explores the options and methods you can look at to clone an IoT hub, and provides a recommended course of action. Why would you want to clone an IoT hub in a different region? Your hub may be set up in East US, and you want a copy of your hub in West US. Rising flood waters? A hurricane heading your way? Global warming?

> [!NOTE]
> Need more example on why you would use this.

## Prerequisites 

* You must have an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

> [!NOTE]
> I'm not sure if a free account will work, plus they need access to the old resources in order to clone them. 
> Can we just recommend they have access to the original subscription, and does it need to be admin access? 

## Things to consider

* Do not remove the original resources before creating and verifying the cloned version. Once you remove a hub, it's gone forever, and there is no way to recover it to check the settings or data to make sure you had replicated them correctly.

* Many resources require globally unique names, so we strongly recommend you use different names for the cloned versions. 

* If all of your resources are in a resource group, use a resource group with a different name for the cloned version.

* Your data is not transferred, including metrics and logging for the current hub. For data routed to other resources, such as a storage account, you have to transfer that data outside of these procedures. For Azure storage, see [Get started with AzCopy](storage-use-azcopy-v10.md).


> [!NOTE]
> Is this right? What about telemetry data? 
> What if they're routing info to storage? I think if they want to clone a storage account, that should be in a Storage article. 
> Can't "replicate" service bus content or event hub messages because they're more of a point-in-time thing than a store-for-all-time thing.

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

* The method we recommend for moving an IoT Hub from one region to another is:

   1. Export the hub and its settings to a Resource Manager template. 
   
   1. Make the necessary changes to the template, such as the resource name and encrypted keys.
   
   1. Update the parameter file, if needed. 
   
   1. Import the template into a new resource group.
   
   1. Debug as needed. 
   
   1. Add anything that wasn't exported to the template. For example, Consumer Group is not exported to the template. You need to add the Consumer group to the template manually or use the [Azure portal](https://portal.azure.com] after the hub is created. 

* Another method you could use is to create the new hub in the new location and use the portal to compare the settings of the original hub versus the clone, making changes to the clone to match the original hub. This way of cloning a hut is not a reproducible method you can run repeatedly with ease.

## Examples of resources used for the routing rules (?)

> [!NOTE]
> Do we need to provide this information, or put all of the examples in a separate article and link to it? 
> *  How to move resources when using a storage account as a custom endpoint.
> *  How to move resources when using a service bus queue as a custom endpoint.
> *  How to move resource when using a service bus topic 
> *  How to move resource when using an event hub as a custom endpoint.
> *  What about the use of Event Grid and the use of Azure Data Lake?

## Steps for migrating the hub to another region

1. Sign into the [Azure portal](https://portal.azure.com). 

1. Go to **Resource Group** and select the resource group that contains the hub you want to move. You can also go to **Resources** and find the hub that way. Click on the hub.

1. Select **Export template** from the list of properties and settings for the hub. 

[screenshot]

1. Select **Download** to download the template. Save the file somewhere you can find it again. 

   Now go to the Downloads folder (or wherever you downloaded it to) and find the zip file. In the zip file, the template name  is in the format `ExportedTemplate-<ResourceManagerName>`. This example shows a generic hub with no routing rules.
   
   This is the exported template. 

   [include template]

   To make this work, replace [the key values]. To find those key values, go to the portal and find the original hub and select it. Then select **Shared access policies**, and then **iothubowner**. Select the Copy button next to the primary key to copy the key into your buffer. Then go to the template and fill in the copied key where it says [whatever it says].

   > [!NOTE]
   > Ask Jimaco for the policy to select. 

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

1. Run the samples application.

1. Now if you go to the new hub using the [Azure portal](https://portal.azure.com) and select your hub, then select **IoT Devices**, you see the devices you just imported. You can also view the properties for the clone. 

Now you know how to clone an IoT Hub to a different region.

## Next steps

* [IoT Hub developer's guide](iot-hub-devguide.md)

* [IoT Hub routing](tutorial-routing.md)

* [IoT Hub device management overview](iot-hub-device-management-overview.md)
