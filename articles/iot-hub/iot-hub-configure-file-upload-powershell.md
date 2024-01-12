---
title: Use Azure PowerShell to configure file upload
description: How to use Azure PowerShell cmdlets to configure your IoT hub to enable file uploads from connected devices. Includes information about configuring the destination Azure storage account.
author: kgremban

ms.author: kgremban 
ms.service: iot-hub
ms.topic: how-to
ms.date: 07/20/2021
ms.custom: devx-track-azurepowershell
---

# Configure IoT Hub file uploads using PowerShell

[!INCLUDE [iot-hub-file-upload-selector](../../includes/iot-hub-file-upload-selector.md)]

This article shows you how to configure file uploads on your IoT hub using PowerShell. 

To use the [file upload functionality in IoT Hub](iot-hub-devguide-file-upload.md), you must first associate an Azure storage account and blob container with your IoT hub. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files. In addition to the storage account and blob container, you can set the time-to-live for the SAS URI and configure settings for the optional file upload notifications that IoT Hub can deliver to backend services.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

* An active Azure account. If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.

* An Azure IoT hub. If you don't have an IoT hub, you can use the [New-AzIoTHub cmdlet](/powershell/module/az.iothub/new-aziothub) to create one or use the portal to [Create an IoT hub](iot-hub-create-through-portal.md).

* An Azure storage account. If you don't have an Azure storage account, you can use the [Azure Storage PowerShell cmdlets](/powershell/module/az.storage/) to create one or use the portal to [Create a storage account](../storage/common/storage-account-create.md)

* Use the PowerShell environment in [Azure Cloud Shell](../cloud-shell/quickstart-powershell.md).

   [![Launch Cloud Shell in a new window](./media/iot-hub-configure-file-upload-powershell/hdi-launch-cloud-shell.png)](https://shell.azure.com)

* If you prefer, [install](/powershell/scripting/install/installing-powershell) PowerShell locally.

  * [Install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell). (The module is installed by default in the Azure Cloud Shell PowerShell environment.) 
  * Sign in to PowerShell by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command.  To finish the authentication process, follow the steps displayed in your terminal.  For additional sign-in options, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).


## Sign in and set your Azure account

Sign in to your Azure account and select your subscription. If you're using Azure Cloud Shell, you should be signed in already; however, you still might need to select your Azure subscription if you have multiple subscriptions.

1. At the PowerShell prompt, run the **Connect-AzAccount** cmdlet:

    ```powershell
    Connect-AzAccount
    ```

2. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure subscriptions associated with your credentials. Use the [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription) command to list the Azure subscriptions available for you to use:

    ```powershell
    Get-AzSubscription
    ```

    Use the following command to select the subscription that you want to use to run the commands to manage your IoT hub. You can use either the subscription name or ID from the output of the previous command:

    ```powershell
    Select-AzSubscription `
        -Name "{your subscription name}"
    ```

    > [!NOTE]
    > The **Select-AzSubscription** command is an alias of the [Select-AzContext](/powershell/module/az.accounts/select-azcontext) that allows you to use the subscription name (**Name**) or subscription ID (**Id**) returned by the **Get-AzSubscription** command rather than the more complex context name required for the **Select-AzContext** command.

## Retrieve your storage account details

The following steps assume that you created your storage account using the **Resource Manager** deployment model, and not the **Classic** deployment model.

To configure file uploads from your devices, you need the connection string for an Azure storage account. The storage account must be in the same subscription as your IoT hub. You also need the name of a blob container in the storage account. Use the [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) command to retrieve your storage account keys:

```powershell
Get-AzStorageAccountKey `
  -Name {your storage account name} `
  -ResourceGroupName {your storage account resource group}
```

Make a note of the **key1** storage account key value. You need it in the following steps.

You can either use an existing blob container for your file uploads or create new one:

* To list the existing blob containers in your storage account, use the [New-AzStorageContext](/powershell/module/az.storage/new-azstoragecontext) and [Get-AzStorageContainer](/powershell/module/az.storage/get-azstoragecontainer)  commands:

    ```powershell
    $ctx = New-AzStorageContext `
        -StorageAccountName {your storage account name} `
        -StorageAccountKey {your storage account key}
    Get-AzStorageContainer -Context $ctx
    ```

* To create a blob container in your storage account, use the [New-AzStorageContext](/powershell/module/az.storage/new-azstoragecontext) and [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) commands:

    ```powershell
    $ctx = New-AzStorageContext `
        -StorageAccountName {your storage account name} `
        -StorageAccountKey {your storage account key}
    New-AzStorageContainer `
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

* **File notification settings default TTL**: The time-to-live of a file upload notification before it's expired. Set to one day by default.

* **File notification maximum delivery count**: The number of times the IoT Hub attempts to deliver a file upload notification. Set to 10 by default.

Use the [Set-AzIotHub](/powershell/module/az.iothub/set-aziothub) command to configure the file upload settings on your IoT hub:

```powershell
Set-AzIotHub `
    -ResourceGroupName "{your iot hub resource group}" `
    -Name "{your iot hub name}" `
    -FileUploadNotificationTtl "01:00:00" `
    -FileUploadSasUriTtl "01:00:00" `
    -EnableFileUploadNotifications $true `
    -FileUploadStorageConnectionString "DefaultEndpointsProtocol=https;AccountName={your storage account name};AccountKey={your storage account key};EndpointSuffix=core.windows.net" `
    -FileUploadContainerName "{your blob container name}" `
    -FileUploadNotificationMaxDeliveryCount 10
```

> [!NOTE]
> By default, IoT Hub authenticates with Azure Storage using the account key in the connection string. Authentication using either system-assigned or user-assigned managed identities is also available. Managed identities provide Azure services with an automatically managed identity in Microsoft Entra ID in a secure manner. To learn more, see [IoT Hub support for managed identities](./iot-hub-managed-identity.md). Currently, there are not parameters on the **Set-AzIotHub** command to set the authentication type. Instead, you can use either the [Azure portal](./iot-hub-configure-file-upload.md) or [Azure CLI](./iot-hub-configure-file-upload-cli.md). 

## Next steps

* [Upload files from a device overview](iot-hub-devguide-file-upload.md)
* [IoT Hub support for managed identities](./iot-hub-managed-identity.md)
* [File upload how-to guides](./file-upload-dotnet.md)
