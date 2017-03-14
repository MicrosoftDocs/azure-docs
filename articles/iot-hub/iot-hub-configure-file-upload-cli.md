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
ms.date: 01/05/2017
ms.author: dobett

---
# Configure IoT Hub file uploads using Azure CLI
To use the [file upload functionality in IoT Hub][lnk-upload], you must first associate an Azure Storage account with your IoT hub. You can use an existing storage account or create a new one.

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* [Azure CLI 2.0][lnk-CLI-install].
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

1. Install the Azure CLI _iot component_. Run the following [command to add the iot component][lnk-az-addcomponent-command]:

    ```azurecli
    az component update --add iot
    ```

1. Register the IoT provider before you can deploy IoT resources. Run the following [command to register the IoT provider][lnk-az-register-command]:

    ```azurecli
    az provider register -namespace Microsoft.Devices
    ```

## File upload

To use the [file upload functionality in IoT Hub][lnk-upload], you must first associate an Azure Storage account with your hub. Select the **File upload** settings to display a list of file upload properties for the IoT hub that is being modified.

# Configure IoT Hub file uploads using the Azure portal
## File upload
To use the [file upload functionality in IoT Hub][lnk-upload], you must first associate an Azure Storage account with your hub. Select the **File upload** settings to display a list of file upload properties for the IoT hub that is being modified.

![][13]

**Storage container**: Use the Azure portal to select a blob container in an Azure Storage account in your current Azure subscription to associate with your IoT Hub. If necessary, you can create an Azure Storage account on the **Storage accounts** blade and blob container on the **Containers** blade. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files.

![][14]

**Receive notifications for uploaded files**: Enable or disable file upload notifications via the toggle.

**SAS TTL**: This setting is the time-to-live of the SAS URIs returned to the device by IoT Hub. Set to one hour by default but can be customized to other values using the slider.

**File notification settings default TTL**: The time-to-live of a file upload notification before it is expired. Set to one day by default but can be customized to other values using the slider.

**File notification maximum delivery count**: The number of times the IoT Hub attempts to deliver a file upload notification. Set to 10 by default but can be customized to other values using the slider.

![][15]

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