---
title: How to clone an Azure IoT hub
description: How to clone an Azure IoT hub
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 09/24/2019
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

To move a hub to a different region, you need a subscription with administrative access to the original hub. Put the new hub in a new resource group and region, but in the same subscription.

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

### Export the template 

Use [VS Code](https://code.visualstudio.com) or a text editor to edit the template.

1. Go to the Downloads folder (or wherever you exported the template to) and find the zip file. In the zip file, the template name is in the format `ExportedTemplate-<ResourceManagerName>`. This example shows a generic hub with no routing configuration. It is an S1 tier hub (with 1 unit) called **ContosoTestHub1484** in region **westus**.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "IotHubs_ContosoTestHub1484_name": {
            "defaultValue": "ContosoTestHub1484",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Devices/IotHubs",
            "apiVersion": "2018-04-01",
            "name": "[parameters('IotHubs_ContosoTestHub1484_name')]",
            "location": "westus",
            "sku": {
                "name": "S1",
                "tier": "Standard",
                "capacity": 1
            },
            "properties": {
                "operationsMonitoringProperties": {
                    "events": {
                        "None": "None",
                        "Connections": "None",
                        "DeviceTelemetry": "None",
                        "C2DCommands": "None",
                        "DeviceIdentityOperations": "None",
                        "FileUploadOperations": "None",
                        "Routes": "None"
                    }
                },
                "ipFilterRules": [],
                "eventHubEndpoints": {
                    "events": {
                        "retentionTimeInDays": 1,
                        "partitionCount": 2,
                        "partitionIds": [
                            "0",
                            "1"
                        ],
                        "path": "contosotesthub1484",
                        "endpoint": "sb://iothub-ns-contosotes-2212280-c7fd261aef.servicebus.windows.net/"
                    },
                    "operationsMonitoringEvents": {
                        "retentionTimeInDays": 1,
                        "partitionCount": 2,
                        "partitionIds": [
                            "0",
                            "1"
                        ],
                        "path": "contosotesthub1484-operationmonitoring",
                        "endpoint": "sb://iothub-ns-contosotes-2212280-c7fd261aef.servicebus.windows.net/"
                    }
                },
                "routing": {
                    "endpoints": {
                        "serviceBusQueues": [],
                        "serviceBusTopics": [],
                        "eventHubs": [],
                        "storageContainers": []
                    },
                    "routes": [],
                    "fallbackRoute": {
                        "name": "$fallback",
                        "source": "DeviceMessages",
                        "condition": "true",
                        "endpointNames": [
                            "events"
                        ],
                        "isEnabled": true
                    }
                },
                "storageEndpoints": {
                    "$default": {
                        "sasTtlAsIso8601": "PT1H",
                        "connectionString": "",
                        "containerName": ""
                    }
                },
                "messagingEndpoints": {
                    "fileNotifications": {
                        "lockDurationAsIso8601": "PT1M",
                        "ttlAsIso8601": "PT1H",
                        "maxDeliveryCount": 10
                    }
                },
                "enableFileUploadNotifications": false,
                "cloudToDevice": {
                    "maxDeliveryCount": 10,
                    "defaultTtlAsIso8601": "PT1H",
                    "feedback": {
                        "lockDurationAsIso8601": "PT1M",
                        "ttlAsIso8601": "PT1H",
                        "maxDeliveryCount": 10
                    }
                },
                "features": "None"
            }
        }
    ]
}
````

### Edit the template 

You have to make some changes before you can use the template to upload the template in a new region and create the new hub.

1. Remove the parameters section at the top -- it is much simpler to just use the hub name.

```` json
    "parameters": {
        "IotHubs_ContosoTestHub1484_name": {
            "defaultValue": "ContosoTestHub1484",
            "type": "String"
        }
    },
````

1. Rename the hub. Its name is globally unique, so you can't use the same name as the original hub.

Change these two lines in the template. You don't need to use a parameter -- just put the new IoT Hub name there. Also, change the location to the location of the new hub.

    Old version.

    ```json
          "name": "[parameters('IotHubs_ContosoTestHub1484_name')]",
            "location": "westus",
    ```

    New version. Change the hub name to have **-NEW** on the end, and change the location. 

    ```json
          "name": "ContosoTestHub1484-NEW",
            "location": "eastus",
    ```

> [!NOTE]
> Ask Ashita if you have to do anything to the eventHubEndpoint that look like this:
> "sb://iothub-ns-contosotes-2212280-c7fd261aef.servicebus.windows.net/"
> This is in operation monitoring section, too.

### Create a new hub in the new region by loading the template

Now create the new hub in the new location.

1. Select **Create a resource**. 

1. In the search box, put in "template deployment" and select Return.

1. Select **template deployment**. This will take you to a screen for the Template deployment. Select **Create**.

1. Select **Build your own template in the editor**. You're going to upload your template from a file. 

1. Select **Load file**. Browse for the new template you edited and select it, then select **Open**. It loads your template in the edit window. Select **Save**.

1. Select the **Resource Group** on the **Custom deployment** screen, or create a new one. Select the new **Location**.

1. Check the box that says **I agree to the terms and conditions stated above.** and click **Purchase**.

It will now deploy your cloned hub.

> [!NOTE]
>  (mine failed, no idea why). (When I tried this manually, it wouldn't let me put it in the same resource group with the same name I picked, so it looks like it's holding on to the name). (called it -TRY2, and it worked when I deployed it manually, so my template is a fail).
>
>optimist continues...

Now your hub is created and live. The second part is to copy the devices from the old hub to the new one. 

## Managing the devices registered to the IoT hub

The devices for the IoT Hub can be copied from the old hub to the new hub. To do this, you can use the Import/Export sample app. 

> [!NOTE]
> Am still working on the import/export sample app, so these directions will probably change, hopefully they will be simpler.

1. Download the c# samples: [azure-iot-samples-csharp]  **this is not live yet**

1. Go to the iot-hub>Samples>service and double-click on IoTHubServiceSamples.sln to open it.

1. Right-click on the ImportExportDevices project and select **Set as Startup project**.

1. Tell them how to do environment variables if you have figured it out.

   ```command  
   SET IOTHUB_CONN_STRING_CSHARP = ""
   SET DEST_IOTHUB_CONN_STRING_CSHARP = ""
   SET STORAGE_ACCT_CONN_STRING_CSHARP = ""
   
   ImportExportDevicesSample.csproj  
   ```

1. Get the connection string from the original IoT Hub and put it in the environment variables IOTHUB_CONN_STRING_CSHARP.

1. Get the connection string from the new IoT Hub and put it in the environment variable DEST_IOTHUB_CONN_STRING_CSHARP.

1. Get the connection string from the storage account to be used for the import/export procedures and put it in THE STORAGE_ACCT_CONN_STRING_CSHARP environment variable. 
    
1. Go to the Main method in the Program.cs file and change the call to IotHubDevices.AddDevicesToHub to set the number of devices you want to add. You may want to start with a smaller number of devices, such as 10, to test the import/export. 

**BEING REWRITTEN** 

1. Program.cs contains code to run multiple methods.

   - **AddDevicesToHub** -- this adds new devices with random keys (helpful for testing).

   - **CopyDevicesToNewHub** -- this retrieves the devices from the previous hub and adds them to the new hub. You can not have multiple devices with the same name on the same hub, but you can have devices with the same name on different hubs. For example, you can't have two devices with the name MyFirstDevice on Hub1, but you can have a device with that name on Hub1 and Hub2.
    
   - **AddDevicesFromDeviceList** -- this imports the devices from the *devices.txt* file stored in blob storage in to the IoT hub.
    
   - **ExportDevices** -- this exports the devices registered with the IoT Hub to a file called *devices.txt* in blob storage. 
  
   - **DeleteAllDevicesFromHub** -- this deletes all of the devices registered for an IoT hub, so use it with care.

1. Be sure all of the method calls are commented out except for **AddDevicesFromDeviceList**. 

1. Run the samples application.

1. Go to the new hub using the [Azure portal](https://portal.azure.com). Select your hub, then select **IoT Devices**. You see the devices you just copied from the old hub to the clone. You can also view the properties for the clone. 

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
