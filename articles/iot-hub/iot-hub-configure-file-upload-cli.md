---
title: Configure file upload to IoT Hub using Azure CLI (az.py) | Microsoft Docs
description: How to configure fileuploads to Azure IoT hub using the cross-platform Azure CLI 2.0 (az.py).
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 915f1597-272d-4fd4-8c5b-a0ccb1df0d91
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/04/2017
ms.author: dobett

---

# Configure IoT Hub file uploads using Azure CLI

[!INCLUDE [iot-hub-file-upload-selector](../../includes/iot-hub-file-upload-selector.md)]

To use the [file upload functionality in IoT Hub][lnk-upload], you must first associate an Azure Storage account with your IoT hub. You can use an existing storage account or create a new one.

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* [Azure CLI 2.0][lnk-CLI-install].
* An Azure IoT hub. If you don't have an IoT hub, you can use the `az iot hub create` [command][lnk-cli-create-iothub] to create one or use the portal to [Create an IoT hub][lnk-portal-hub].
* An Azure Storage account. If you don't have an Azure Storage account, you can use the [Azure CLI 2.0 - Manage storage accounts][lnk-manage-storage] to create one or use the portal to [Create a storage account][lnk-portal-storage].

## Sign in and set your Azure account

Sign in to your Azure account and select your subscription.

1. At the command prompt, run the [login command][lnk-login-command]:

    ```azurecli
    az login
    ```

    Follow the instructions to authenticate using the code and sign in to your Azure account through a web browser.

1. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure accounts associated with your credentials. Use the following [command to list the Azure accounts][lnk-az-account-command] available for you to use:

    ```azurecli
    az account list
    ```

    Use the following command to select subscription that you want to use to run the commands to create your IoT hub. You can use either the subscription name or ID from the output of the previous command:

    ```azurecli
    az account set --subscription {your subscription name or id}
    ```

## Retrieve your storage account details

The following steps assume that you created your storage account using the **Resource Manager** deployment model, and not the **Classic** deployment model.

You need the connection string of an Azure storage account in the same subscription as your IoT hub to configure file uploads from your devices. You also need the name of a blob container in the storage account. Use the following command to retrieve your storage account keys:

```azurecli
az storage account show-connection-string --name {your storage account name} --resource-group {your storage account resource group}
```

Make a note of the **connectionString** value. You need it in the following steps.

You can either use an existing blob container for your file uploads or create new one:

* To list the existing blob containers in your storage account, use the following command:

    ```azurecli
    az storage container list --connection-string "{your storage account connection string}"
    ```

* To create a blob container in your storage account, use the following command:

    ```azurecli
    az storage container create --name {container name} --connection-string "{your storage account connection string}"
    ```

## File upload

You can now configure your IoT hub to enable [file upload functionality][lnk-upload] using your storage account details.

The configuration requires the following values:

**Storage container**: A blob container in an Azure storage account in your current Azure subscription to associate with your IoT hub. You retrieved the necessary storage account information in the preceding section. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files.

**Receive notifications for uploaded files**: Enable or disable file upload notifications.

**SAS TTL**: This setting is the time-to-live of the SAS URIs returned to the device by IoT Hub. Set to one hour by default.

**File notification settings default TTL**: The time-to-live of a file upload notification before it is expired. Set to one day by default.

**File notification maximum delivery count**: The number of times the IoT Hub attempts to deliver a file upload notification. Set to 10 by default.

Use the following Azure CLI commands to configure the file upload settings on your IoT hub:

In a bash shell use:

```azurecli
az iot hub update --name {your iot hub name} --set properties.storageEndpoints.'$default'.connectionString="{your storage account connection string}"
az iot hub update --name {your iot hub name} --set properties.storageEndpoints.'$default'.containerName="{your storage container name}"
az iot hub update --name {your iot hub name} --set properties.storageEndpoints.'$default'.sasTtlAsIso8601=PT1H0M0S

az iot hub update --name {your iot hub name} --set properties.enableFileUploadNotifications=true
az iot hub update --name {your iot hub name} --set properties.messagingEndpoints.fileNotifications.maxDeliveryCount=10
az iot hub update --name {your iot hub name} --set properties.messagingEndpoints.fileNotifications.ttlAsIso8601=PT1H0M0S
```

At a Windows command prompt use:

```azurecli
az iot hub update --name {your iot hub name} --set "properties.storageEndpoints.$default.connectionString="{your storage account connection string}""
az iot hub update --name {your iot hub name} --set "properties.storageEndpoints.$default.containerName="{your storage container name}""
az iot hub update --name {your iot hub name} --set "properties.storageEndpoints.$default.sasTtlAsIso8601=PT1H0M0S"

az iot hub update --name {your iot hub name} --set properties.enableFileUploadNotifications=true
az iot hub update --name {your iot hub name} --set properties.messagingEndpoints.fileNotifications.maxDeliveryCount=10
az iot hub update --name {your iot hub name} --set properties.messagingEndpoints.fileNotifications.ttlAsIso8601=PT1H0M0S
```

You can review the file upload configuration on your IoT hub using the following command:

```azurecli
az iot hub show --name {your iot hub name}
```

## Next steps

For more information about the file upload capabilities of IoT Hub, see [Upload files from a device][lnk-upload] in the IoT Hub developer guide.

Follow these links to learn more about managing Azure IoT Hub:

* [Bulk manage IoT devices][lnk-bulk]
* [IoT Hub metrics][lnk-metrics]
* [Operations monitoring][lnk-monitor]

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Simulating a device with the IoT Gateway SDK][lnk-gateway]
* [Secure your IoT solution from the ground up][lnk-securing]

[13]: ./media/iot-hub-configure-file-upload/file-upload-settings.png
[14]: ./media/iot-hub-configure-file-upload/file-upload-container-selection.png
[15]: ./media/iot-hub-configure-file-upload/file-upload-selected-container.png

[lnk-upload]: iot-hub-devguide-file-upload.md

[lnk-bulk]: iot-hub-bulk-identity-mgmt.md
[lnk-metrics]: iot-hub-metrics.md
[lnk-monitor]: iot-hub-operations-monitoring.md

[lnk-devguide]: iot-hub-devguide.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-securing]: iot-hub-security-ground-up.md


[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-CLI-install]: https://docs.microsoft.com/cli/azure/install-az-cli2
[lnk-login-command]: https://docs.microsoft.com/cli/azure/get-started-with-az-cli2
[lnk-az-account-command]: https://docs.microsoft.com/cli/azure/account
[lnk-az-register-command]: https://docs.microsoft.com/cli/azure/provider
[lnk-az-addcomponent-command]: https://docs.microsoft.com/cli/azure/component
[lnk-az-resource-command]: https://docs.microsoft.com/cli/azure/resource
[lnk-az-iot-command]: https://docs.microsoft.com/cli/azure/iot
[lnk-iot-pricing]: https://azure.microsoft.com/pricing/details/iot-hub/
[lnk-manage-storage]: ../storage/storage-azure-cli.md#manage-storage-accounts
[lnk-portal-storage]: ../storage/storage-create-storage-account.md
[lnk-cli-create-iothub]: https://docs.microsoft.com/cli/azure/iot/hub#create