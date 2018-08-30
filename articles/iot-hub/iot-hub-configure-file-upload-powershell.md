---
title: Use the Azure PowerShell to configure file upload | Microsoft Docs
description: How to use the Azure PowerShell cmdlets to configure your IoT hub to enable file uploads from connected devices. Includes information about configuring the destination Azure storage account.
author: dominicbetts
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/08/2017
ms.author: dobett
---

# Configure IoT Hub file uploads using PowerShell

[!INCLUDE [iot-hub-file-upload-selector](../../includes/iot-hub-file-upload-selector.md)]

To use the [file upload functionality in IoT Hub](iot-hub-devguide-file-upload.md), you must first associate an Azure storage account with your IoT hub. You can use an existing storage account or create a new one.

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a [free account](http://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.

* [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure/install-azurerm-ps).

* An Azure IoT hub. If you don't have an IoT hub, you can use the [New-AzureRmIoTHub cmdlet](https://docs.microsoft.com/powershell/module/azurerm.iothub/new-azurermiothub) to create one or use the portal to [Create an IoT hub](iot-hub-create-through-portal.md).

* An Azure storage account. If you don't have an Azure storage account, you can use the [Azure Storage PowerShell cmdlets](https://docs.microsoft.com/powershell/module/azurerm.storage/) to create one or use the portal to [Create a storage account](../storage/common/storage-create-storage-account.md)

## Sign in and set your Azure account

Sign in to your Azure account and select your subscription.

1. At the PowerShell prompt, run the **Connect-AzureRmAccount** cmdlet:

    ```powershell
    Connect-AzureRmAccount
    ```

2. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure subscriptions associated with your credentials. Use the following command to list the Azure subscriptions available for you to use:

    ```powershell
    Get-AzureRMSubscription
    ```

    Use the following command to select the subscription that you want to use to run the commands to manage your IoT hub. You can use either the subscription name or ID from the output of the previous command:

    ```powershell
    Select-AzureRMSubscription `
        -SubscriptionName "{your subscription name}"
    ```

## Retrieve your storage account details

The following steps assume that you created your storage account using the **Resource Manager** deployment model, and not the **Classic** deployment model.

To configure file uploads from your devices, you need the connection string for an Azure storage account. The storage account must be in the same subscription as your IoT hub. You also need the name of a blob container in the storage account. Use the following command to retrieve your storage account keys:

```powershell
Get-AzureRmStorageAccountKey `
  -Name {your storage account name} `
  -ResourceGroupName {your storage account resource group}
```

Make a note of the **key1** storage account key value. You need it in the following steps.

You can either use an existing blob container for your file uploads or create new one:

* To list the existing blob containers in your storage account, use the following commands:

    ```powershell
    $ctx = New-AzureStorageContext `
        -StorageAccountName {your storage account name} `
        -StorageAccountKey {your storage account key}
    Get-AzureStorageContainer -Context $ctx
    ```

* To create a blob container in your storage account, use the following commands:

    ```powershell
    $ctx = New-AzureStorageContext `
        -StorageAccountName {your storage account name} `
        -StorageAccountKey {your storage account key}
    New-AzureStorageContainer `
        -Name {your new container name} `
        -Permission Off `
        -Context $ctx
    ```

## Configure your IoT hub

You can now configure your IoT hub to [upload files to the IoT hub](iot-hub-devguide-file-upload.md) using your storage account details.

The configuration requires the following values:

* **Storage container**: A blob container in an Azure storage account in your current Azure subscription to associate with your IoT hub. You retrieved the necessary storage account information in the preceding section. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files.

* **Receive notifications for uploaded files**: Enable or disable file upload notifications.

* **SAS TTL**: This setting is the time-to-live of the SAS URIs returned to the device by IoT Hub. Set to one hour by default.

* **File notification settings default TTL**: The time-to-live of a file upload notification before it is expired. Set to one day by default.

* **File notification maximum delivery count**: The number of times the IoT Hub attempts to deliver a file upload notification. Set to 10 by default.

Use the following PowerShell cmdlet to configure the file upload settings on your IoT hub:

```powershell
Set-AzureRmIotHub `
    -ResourceGroupName "{your iot hub resource group}" `
    -Name "{your iot hub name}" `
    -FileUploadNotificationTtl "01:00:00" `
    -FileUploadSasUriTtl "01:00:00" `
    -EnableFileUploadNotifications $true `
    -FileUploadStorageConnectionString "DefaultEndpointsProtocol=https;AccountName={your storage account name};AccountKey={your storage account key};EndpointSuffix=core.windows.net" `
    -FileUploadContainerName "{your blob container name}" `
    -FileUploadNotificationMaxDeliveryCount 10
```

## Next steps

For more information about the file upload capabilities of IoT Hub, see [Upload files from a device](iot-hub-devguide-file-upload.md).

Follow these links to learn more about managing Azure IoT Hub:

* [Bulk manage IoT devices](iot-hub-bulk-identity-mgmt.md)
* [IoT Hub metrics](iot-hub-metrics.md)
* [Operations monitoring](iot-hub-operations-monitoring.md)

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide](iot-hub-devguide.md)
* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/tutorial-simulate-device-linux.md)
* [Secure your IoT solution from the ground up](../iot-fundamentals/iot-security-ground-up.md)