---
title: Custom monitor your Azure Digital Twins (.NET) setup | Microsoft Docs
description: Learn how to custom monitor your setup of Azure Digital Twins using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 08/30/2018
ms.author: dkshir
---

# Tutorial: Custom monitor your Azure Digital Twins setup

Azure Digital Twins service allows you to bring together people, places and things in a coherent spatial system. This is the second tutorial in a series that demonstrate how to use the Digital Twins to manage your facilities for efficient space utilization. Once you have provisioned your sample building using the steps in the previous tutorial, you can create and run custom computations on your sensor data using this tutorial.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Understand User-Defined Functions
> * Create Matchers 
> * Create User-Defined Functions
> * Simulate sensor data

If you don’t have an Azure, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

This tutorial assumes that you have completed the steps to [Provision your Azure Digital Twins setup](tutorial-facilities-setup.md). Before proceeding, make sure that you have:
- an instance of Digital Twins running, and 
- the [Azure Digital Twins sample application](https://github.com/Azure-Samples/digital-twins-samples-csharp) downloaded or cloned on your work machine.
 
## User-Defined Function
*User-defined functions* (or UDFs) allow you to customize the processing of telemetry data from your sensors. It is a custom JavaScript code that runs within your Digital Twins instance. It runs in tandem with a *matcher* that looks for specific conditions in the device data. You can create *matchers* and *user-defined functions* for each sensor that you want to monitor. For more detailed information, read [Data Processing and User-Defined Functions](concepts-user-defined-functions.md). 

In this section, we will use the Digital Twins sample downloaded in the [previous tutorial](tutorial-facilities-setup.md) to understand how to create and configure a UDF. 

## Simulate sensor data
<!--TBD This should be in a proper app in Azure Samples -->
This section shows you how to simulate sensor data for detecting motion, temperature and carbon dioxide. It uses a sample .Net application that generates this data and sends it to your Digital Twins instance. It uses your work machine's MAC ID to simulate as a unique device. 

1. Download the Azure-IoT-SSS-Samples-DeviceConnectivity sample <!--download link here-->
2. Generate SAS token for your simulated device. Using a REST client such as Postman, POST a REST call for `https://{{endpoint-management}}/api/v1.0/keystores` to the Digital Twins service with the following payload:
    ```
    {
    "Name": "Friendly name for your key store",
    "Description": "Description for your key store",
    "SpaceId": "<RootTenantId>"
    }
    ```
  Note the response GUID that you will get for this call. 
3. Create a key using the key store GUID that you received from the preceding step. POST a REST call for `https://{{endpoint-management}}/api/v1.0/keystores/<insert keystore GUID here>/keys`. Note down the response code you get for the key. 
4. Get the [SAS token](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1) from key for each individual Hardware Id, which is the MAC Id in your setup. Using a REST client, run `GET https://{{endpoint-management}}/api/v1.0/keystores/<insert keystore GUID here>/keys/<insert the response code for keys here>/token?deviceMac=<HardwareId>`
  Note down the response body. It is a SAS token in this format: *SharedAccessSignature id=<HardwareId>&<key>*.
5. Navigate to the Azure-IoT-SSS-Samples-DeviceConnectivity folder on the command line and run the sample:
    1. Open the *appSettings.json* file and update the following variables:
        - Assign the URL for your Digital Twins instance to the variable *ManagementApiUrl*. It will be in the form of `https://yourDigitalTwinsName.yourDigitalTwinsLocation.azuresmartspaces.net/management/`.
        - Assign the SAS token noted above to the variable *SasToken*.
    1. Run the following on the command line:
        ```cmd/sh
        dotnet restore
        dotnet run
        ```

## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select and **Delete** your Digital Twins resource group.
2. If you need to, you may proceed to delete the sample applications on your work machine as well. 


## Next steps

Proceed to the next tutorial in the series to learn how to create notifications for the simulated sensor data for your sample building. 
> [!div class="nextstepaction"]
> [Next steps button](tutorial-facilities-events.md)

