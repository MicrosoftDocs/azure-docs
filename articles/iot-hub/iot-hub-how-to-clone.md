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

This article explores ways to clone an IoT Hub and provides some questions you need to answer before you start. There are several reasons you might want to clone an IoT hub from one region to another. 

* You want to migrate your hub from the Free or Basic tier to a Standard tier. You can't change the tier of a hub using the Azure portal, Azure PowerShell, or Azure CLI.

* You are moving your company from one region to another, such as from Europe to North America (or vice versa), and you want your resources and data to be geographically close to your new location.

* You are setting up a hub for a development vs production environment.

* You want to do a custom implementation of multi-hub high availability. 

> [!NOTE]
> John -- next time we talk, can you please provide a 2 minute overview of the last item so I know how the customer would do that, just generally.

To move a hub to a different region, you need a subscription with administrative access to the original hub. You can put the new hub in a new resource group and region, but it can be in the same subscription.

## Things to consider

There are several things to consider when preparing to clone an IoT hub.

* Do not remove the original resources before creating and verifying the cloned version. Once you remove a hub, it's gone forever, and there is no way to recover it to check the settings or data to make sure you had replicated them correctly.

* Many resources require globally unique names, so you must use different names for the cloned versions. Also use a different name for the resource group to which the cloned hub belongs. 

* Data for the original IoT hub data is not migrated. This includes telemetry messages, cloud-to-device (C2D) commands, and job-related information such as schedules and history. Metrics and logging results are also not migrated. 

* For data or messages routed to Azure Storage, you can leave the data in the original storage account, or transfer that data to a new storage account in the new region. For more information on moving data in Blob storage, see [Get started with AzCopy](../storage/common/storage-use-azcopy-v10.md).

* Data for Event Hubs and for Service Bus Topics and Queues can not be migrated. This is point-in-time data and is not stored after the messages are processed.

* You will need to schedule downtime for the migration. Cloning the devices to the new hub will take time. It can take up to a second to move 100 devices. If you interpolate that upward, it can take 3 hours to move a million devices. 

* You will need to update any certificates you are using so you can use them with the new resources. Also, you probably have the hub defined in a DNS table somewhere -- this will need to be updated as well.

## Methodology 

This is the general method we recommend for moving an IoT Hub from one region to another. This assumes the hub does not have any custom routing. See below for some ideas you can use to deal with routing.

   1. Export the hub and its settings to a Resource Manager template. 
   
   1. Make the necessary changes to the template, such as the hub name and the encrypted keys.
   
   1. Update the parameter file, if needed. 
   
   1. Import the template into a new resource group in the new region.
   
   1. Debug as needed. 
   
   1. Add anything that wasn't exported to the template. For example, Consumer Group is not exported to the template. You need to add the Consumer group to the template manually or use the [Azure portal](https://portal.azure.com) after the hub is created. There is an example of adding consumer group to a template in the article [Use an Azure Resource Manager template to configure IoT Hub message routing](tutorial-routing-config-message-routing-rm-template.md).

## Steps for migrating the hub to another region

This section outlines the instructions for following the general methodology of migrating a hub.

### Find the original hub and export it to a resource template.

1. Sign into the [Azure portal](https://portal.azure.com). 

1. Go to **Resource Group** and select the resource group that contains the hub you want to move. You can also go to **Resources** and find the hub that way. Click on the hub.

1. Select **Export template** from the list of properties and settings for the hub. 

   [screenshot]

1. Select **Download** to download the template. Save the file somewhere you can find it again. 

### Edit the template 

Use [VS Code](https://code.visualstudio.com) or a text editor to edit the template.

1. Go to the Downloads folder (or wherever you exported the template to) and find the zip file. In the zip file, the template name is in the format `ExportedTemplate-<ResourceManagerName>`. This example shows a generic hub with no routing configuration.
   
   [show a template for an IoT Hub here]

You have to make some changes before you can use the template to upload the template in a new region and create the new hub.

1. Replace the [key values].

   * To find the key values for the hub, go to the portal and find the original hub and select it. 

   * Select **Shared access policies**, and then **iothubowner**. 

     > [!NOTE]
     > Ask Jimaco which policy to select. 

   * Select the Copy button next to the primary key to copy the key into your buffer. 

   * Go to the template and paste the copied key where it says [whatever it says].

1. Rename the hub. Its name is globally unique, so you can't use the same name as the original hub. Find `whatever-the-string-is` in the template and put in the new hub name.

## Create the hub in the new region by loading the template

Now you will recreate the hub in the new location.

> [!NOTE]
> Robin -- Add instructions for importing the RM template and creating the new hub here.

Your hub is created and live. Now add the devices that were registered to the original hub.

## Managing the devices registered to the IoT hub

The devices for the IoT Hub can be copied from the old hub to the new hub. To do this, you can use the Import/Export sample app. 

> [!NOTE]
> Am still working on the import/export sample app, so these directions will probably change, hopefully they will be simpler.

1. Download the c# samples: [azure-iot-samples-csharp]  **this is not live yet**

1. Go to the iot-hub>Samples>device and double-click on IoTHubDeviceSamples.sln to open it.

1. Right-click on the ImportExportDevices project and select **Set as Startup project**.
 
1. Get the connection string from the original IoT Hub and put it in ProcessImpExpCommands.cs where it says {connection string to your IoT hub}.

1. Get the connection string from the storage account to be used for the import/export procedures and put it in ProcessImpExpCommands.cs where it says {your storage account connection string}.
    
1. Go to the Main method in the Program.cs file and change the call to IotHubDevices.AddDevicesToHub to set the  number of devices you want to add. You may want to start with a smaller number of devices, such as 1000, to test the import/export. 
    
1. Program.cs contains code to run multiple methods.

   - **AddDevicesToHub** -- this adds new devices with random keys (helpful for testing).

   - **CopyDevicesToNewHub** -- this retrieves the devices from the previous hub and adds them to the new hub. You can not have multiple devices with the same name on the same hub, but you can have devices with the same name on different hubs. For example, you can't have two devices with the name MyFirstDevice on Hub1, but you can have a device with that name on Hub1 and Hub2.
    
   - **AddDevicesFromDeviceList** -- this imports the devices from the *devices.txt* file stored in blob storage in to the IoT hub.
    
   - **ExportDevices** -- this exports the devices registered with the IoT Hub to a file called *devices.txt* in blob storage. 
  
   - **DeleteAllDevicesFromHub** -- this deletes all of the devices registered for an IoT hub, so use it with care.

1. Be sure all of the method calls are commented out except for **AddDevicesFromDeviceList**. 

1. Run the samples application.

1. Go to the new hub using the [Azure portal](https://portal.azure.com). Select your hub, then select **IoT Devices**. You see the devices you just imported. You can also view the properties for the clone. 

> [!NOTE]
> Robin -- be sure the import/export includes the device twins. I think in the C# version you have to specifically say to include them. 

## Routing 

If you have custom routing defined for the original hub, exporting the template for the hub includes the routing configuration. However, it does not export resources used. For example, you can set up routing on your hub to send all messages containing the string *critical* to Azure Storage. When you export that hub to a template, it includes the routing configuration required to send messages meeting that condition to a storage account. However, it does not create the storage account, so the routing fails. 

### Do-it-yourself by creating the resources before importing the template

In these steps, you export the template, manually create the resources used by the routing, and then import the template to create the hub and the routing configuration.

1. Export the hub and its routing configuration to a Resource Manager template. 

1. Manually recreate the resources used by the routing (with new names) using the [Azure portal](https://portal.azure.com).

1. Edit the template and change the name of the hub to its new name. Also update the resource names in the routing configuration.

1. Import the template to create the hub and set up the routing configuration.

### Do-it-yourself by adding resources to the template

In these steps, you add the resources used by the routing to the template.

1. Export the hub and its routing configuration to a Resource Manager template. 

1. Edit the template and change the name of the hub to its new name. 

1. Edit the template and add the resources (with new names) used by the routing. This is difficult to get exactly right unless you have an example to follow, such as the one in the article [Use an Azure Resource Manager template to configure IoT Hub message routing](tutorial-routing-config-message-routing-rm-template.md). The article shows  several of the custom endpoints in a Resource Manager template.

1. Change the names of any resources listed in the routing sections as needed.

1. Import the template to create the hub and its resources. 

> [!NOTE]
> Robin -- Test this so you know exactly what it does. I'm not sure if it causes an error when you upload the template, or if that actually works, but if you send messages to the hub, it fails after it writes the message to the hub and when it tries to route the message. At what point does this mess up the works?

## Checking the results 

To check the results, change your IoT solution to point to your new hub in its new location and run it. In other words, perform the same actions with the new hub that you performed with the previous hub and make sure they work correctly. 

If you have implemented routing, test that and make sure your messages are routed to the new resources correctly.

## Next steps

You have cloned the original IoT hub into a new hub in a new region, complete with the devices. For more information about IoT Hub and development for the hub, please see the following articles.

* [IoT Hub developer's guide](iot-hub-devguide.md)

* [IoT Hub routing](tutorial-routing.md)

* [IoT Hub device management overview](iot-hub-device-management-overview.md)
