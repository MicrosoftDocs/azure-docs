---
title: Configure file upload to IoT Hub using Azure CLI | Microsoft Docs
description: How to configure file uploads to Azure IoT Hub using the cross-platform Azure CLI.
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/08/2017
ms.author: robinsh
---

# Configure IoT Hub file uploads using Azure CLI

[!INCLUDE [iot-hub-file-upload-selector](../../includes/iot-hub-file-upload-selector.md)]

To [upload files from a device](iot-hub-devguide-file-upload.md), you must first associate an Azure Storage account with your IoT hub. You can use an existing storage account or create a new one.

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.

* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

* An Azure IoT hub. If you don't have an IoT hub, you can use the [`az iot hub create` command](https://docs.microsoft.com/cli/azure/iot/hub#az-iot-hub-create) to create one or [Create an IoT hub using the portal](iot-hub-create-through-portal.md).

* An Azure Storage account. If you don't have an Azure Storage account, you can use the Azure CLI to create one. For more information, see [Create a storage account](../storage/common/storage-create-storage-account.md).

## Sign in and set your Azure account

Sign in to your Azure account and select your subscription.

1. At the command prompt, run the [login command](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest):

    ```azurecli
    az login
    ```

    Follow the instructions to authenticate using the code and sign in to your Azure account through a web browser.

2. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure accounts associated with your credentials. Use the following [command to list the Azure accounts](https://docs.microsoft.com/cli/azure/account) available for you to use:

    ```azurecli
    az account list
    ```

    Use the following command to select the subscription that you want to use to run the commands to create your IoT hub. You can use either the subscription name or ID from the output of the previous command:

    ```azurecli
    az account set --subscription {your subscription name or id}
    ```

## Retrieve your storage account details

The following steps assume that you created your storage account using the **Resource Manager** deployment model, and not the **Classic** deployment model.

To configure file uploads from your devices, you need the connection string for an Azure storage account. The storage account must be in the same subscription as your IoT hub. You also need the name of a blob container in the storage account. Use the following command to retrieve your storage account keys:

```azurecli
az storage account show-connection-string --name {your storage account name} \
  --resource-group {your storage account resource group}
```

Make a note of the **connectionString** value. You need it in the following steps.

You can either use an existing blob container for your file uploads or create a new one:

* To list the existing blob containers in your storage account, use the following command:

    ```azurecli
    az storage container list --connection-string "{your storage account connection string}"
    ```

* To create a blob container in your storage account, use the following command:

    ```azurecli
    az storage container create --name {container name} \
      --connection-string "{your storage account connection string}"
    ```

## File upload

You can now configure your IoT hub to enable the ability to [upload files to the IoT hub](iot-hub-devguide-file-upload.md) using your storage account details.

The configuration requires the following values:

* **Storage container**: A blob container in an Azure storage account in your current Azure subscription to associate with your IoT hub. You retrieved the necessary storage account information in the preceding section. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files.

* **Receive notifications for uploaded files**: Enable or disable file upload notifications.

* **SAS TTL**: This setting is the time-to-live of the SAS URIs returned to the device by IoT Hub. Set to one hour by default.

* **File notification settings default TTL**: The time-to-live of a file upload notification before it is expired. Set to one day by default.

* **File notification maximum delivery count**: The number of times the IoT Hub attempts to deliver a file upload notification. Set to 10 by default.

Use the following Azure CLI commands to configure the file upload settings on your IoT hub:

<!--Robinsh this is out of date, add cloud powershell -->

In a bash shell, use:

```azurecli
az iot hub update --name {your iot hub name} \
  --set properties.storageEndpoints.'$default'.connectionString="{your storage account connection string}"

az iot hub update --name {your iot hub name} \
  --set properties.storageEndpoints.'$default'.containerName="{your storage container name}"

az iot hub update --name {your iot hub name} \
  --set properties.storageEndpoints.'$default'.sasTtlAsIso8601=PT1H0M0S

az iot hub update --name {your iot hub name} \
  --set properties.enableFileUploadNotifications=true

az iot hub update --name {your iot hub name} \
  --set properties.messagingEndpoints.fileNotifications.maxDeliveryCount=10

az iot hub update --name {your iot hub name} \
  --set properties.messagingEndpoints.fileNotifications.ttlAsIso8601=PT1H0M0S
```

You can review the file upload configuration on your IoT hub using the following command:

```azurecli
az iot hub show --name {your iot hub name}
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
