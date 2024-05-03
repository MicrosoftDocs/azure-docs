---
title: Configure file upload to IoT Hub using Azure CLI
description: How to configure file uploads to Azure IoT Hub using the cross-platform Azure CLI.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 07/20/2021
ms.custom: devx-track-azurecli
---

# Configure IoT Hub file uploads using Azure CLI

[!INCLUDE [iot-hub-file-upload-selector](../../includes/iot-hub-file-upload-selector.md)]

This article shows you how to configure file uploads on your IoT hub using the Azure CLI. 

To use the [file upload functionality in IoT Hub](iot-hub-devguide-file-upload.md), you must first associate an Azure storage account and blob container with your IoT hub. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files. In addition to the storage account and blob container, you can set the time-to-live for the SAS URI and the type of authentication that IoT Hub uses with Azure storage. You can also configure settings for the optional file upload notifications that IoT Hub can deliver to backend services.

## Prerequisites

* An active Azure account. If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.

* An Azure IoT hub. If you don't have an IoT hub, you can use the [`az iot hub create` command](/cli/azure/iot/hub#az-iot-hub-create) to create one or [Create an IoT hub using the portal](iot-hub-create-through-portal.md).

* An Azure Storage account. If you don't have an Azure Storage account, you can use the Azure CLI to create one. For more information, see [Create a storage account](../storage/common/storage-account-create.md).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

[!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]

## Sign in and set your Azure account

Sign in to your Azure account and select your subscription. If you're using Azure Cloud Shell, you should be signed in already; however, you still might need to select your Azure subscription if you have multiple subscriptions.

1. At the command prompt, run the [login command](/cli/azure/get-started-with-azure-cli):

    ```azurecli
    az login
    ```

    Follow the instructions to authenticate using the code and sign in to your Azure account through a web browser.

2. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure accounts associated with your credentials. Use the following [command to list the Azure accounts](/cli/azure/account) available for you to use:

    ```azurecli
    az account list
    ```

    Use the following command to select the subscription that you want to use to run the commands to create your IoT hub. You can use either the subscription name or ID from the output of the previous command:

    ```azurecli
    az account set --subscription {your subscription name or id}
    ```

## Retrieve your storage account details

The following steps assume that you created your storage account using the **Resource Manager** deployment model, and not the **Classic** deployment model.

To configure file uploads from your devices, you need the connection string for an Azure Storage account. The storage account must be in the same subscription as your IoT hub. You also need the name of a blob container in the storage account. Use the following command to retrieve your storage account keys:

```azurecli
az storage account show-connection-string --name {your storage account name} \
  --resource-group {your storage account resource group}
```
The connection string will be similar to the following output:

```json
{
  "connectionString": "DefaultEndpointsProtocol=https;EndpointSuffix=core.windows.net;AccountName={your storage account name};AccountKey={your storage account key}"
}
```

Make a note of the `connectionString` value. You need it in the following steps.

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

## Configure your IoT hub

You can now configure your IoT hub to enable the ability to [upload files to the IoT hub](iot-hub-devguide-file-upload.md) using your storage account details.

The configuration requires the following values:

* **Storage container**: A blob container in an Azure storage account in your current Azure subscription to associate with your IoT hub. You retrieved the necessary storage account information in the preceding section. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files.

* **Receive notifications for uploaded files**: Enable or disable file upload notifications.

* **SAS TTL**: This setting is the time-to-live of the SAS URIs returned to the device by IoT Hub. Set to one hour by default.

* **File notification settings default TTL**: The time-to-live of a file upload notification before it expires. Set to one day by default.

* **File notification maximum delivery count**: The number of times the IoT Hub attempts to deliver a file upload notification. Set to 10 by default.

* **File notification lock duration**: The lock duration for the file notification queue. Set to 60 seconds by default.

* **Authentication type**: The type of authentication for IoT Hub to use with Azure Storage. This setting determines how your IoT hub authenticates and authorizes with Azure Storage. The default is key-based authentication; however, system-assigned and user-assigned managed identities can also be used. Managed identities provide Azure services with an automatically managed identity in Microsoft Entra ID in a secure manner. To learn how to configure managed identities on your IoT hub and Azure Storage account, see [IoT Hub support for managed identities](./iot-hub-managed-identity.md). Once configured, you can set one of your managed identities to use for authentication with Azure storage.

    > [!NOTE]
    > The authentication type setting configures how your IoT hub authenticates with your Azure Storage account. Devices always authenticate with Azure Storage using the SAS URI that they get from the IoT hub. 


The following commands show how to configure the file upload settings on your IoT hub. These commands are shown separately for clarity, but, typically, you would issue a single command with all the required parameters for your scenario. Include quotes where they appear in the command line. Don't include the braces. More detail about each parameter can be found in the Azure CLI documentation for the [az iot hub update](/cli/azure/iot/hub#az-iot-hub-update) command.

The following command configures the storage account and blob container.

```azurecli
az iot hub update --name {your iot hub name} \
    --fileupload-storage-connectionstring "{your storage account connection string}" \
    --fileupload-storage-container-name "{your container name}" 
```

The following command sets the SAS URI time to live to the default (one hour).

```azurecli
az iot hub update --name {your iot hub name} \
    --fileupload-sas-ttl 1 
```

The following command enables file notifications and sets the file notification properties to their default values. (The file upload notification time to live is set to one hour and the  lock duration is set to 60 seconds.)

```azurecli
az iot hub update --name {your iot hub name} \
    --fileupload-notifications true  \
    --fileupload-notification-max-delivery-count 10 \
    --fileupload-notification-ttl 1 \
    --fileupload-notification-lock-duration 60
```

The following command configures key-based authentication:

```azurecli
az iot hub update --name {your iot hub name} \
    --fileupload-storage-auth-type keyBased
```

The following command configures authentication using the IoT hub's system-assigned managed identity. Before you can run this command, you need to enable the system-assigned managed identity for your IoT hub and grant it the correct RBAC role on your Azure Storage account. To learn how, see [IoT Hub support for managed identities](./iot-hub-managed-identity.md).

```azurecli
az iot hub update --name {your iot hub name} \
    --fileupload-storage-auth-type identityBased \
    --fileupload-storage-identity [system] 
```

The following commands retrieve the user-assigned managed identities configured on your IoT hub and configure authentication with one of them. Before you can use a user-assigned managed identity to authenticate, it must be configured on your IoT hub and granted an appropriate RBAC role on your Azure Storage account. For more detail and steps, see [IoT Hub support for managed identities](./iot-hub-managed-identity.md).

To query for user-assigned managed identities on your IoT hub, use the [az iot hub identity show](/cli/azure/iot/hub/identity#az-iot-hub-identity-show) command.

```azurecli
az iot hub identity show --name {your iot hub name} --query userAssignedIdentities
```

The command returns a collection of the user-assigned managed identities configured on your IoT hub. The following output shows a collection that contains a single user-assigned managed identity.

```json
{
  "/subscriptions/{your subscription ID}/resourcegroups/{your resource group}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{your user-assigned managed identity name}": 
  {
    "clientId": "<client ID GUID>",
    "principalId": "<principal ID GUID>"
  }
}
```

The following command configures authentication to use the user-assigned identity above.

```azurecli
az iot hub update --name {your iot hub name} \
    --fileupload-storage-auth-type identityBased \
    --fileupload-storage-identity  "/subscriptions/{your subscription ID}/resourcegroups/{your resource group}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{your user-assigned managed identity name}"
```

You can review the settings on your IoT hub using the following command:

```azurecli
az iot hub show --name {your iot hub name}
```

To review only the file upload settings, use the following command:

```azurecli
az iot hub show --name {your iot hub name}
    --query '[properties.storageEndpoints, properties.enableFileUploadNotifications, properties.messagingEndpoints.fileNotifications]'
```

For most situations, using the named parameters in the Azure CLI commands is easiest; however, you can also configure file upload settings with the `--set` parameter. The following commands can help you understand how. 

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

## Next steps

* [Upload files from a device overview](iot-hub-devguide-file-upload.md)
* [IoT Hub support for managed identities](./iot-hub-managed-identity.md)
* [File upload how-to guides](./file-upload-dotnet.md)
* Azure CLI [az iot hub update](/cli/azure/iot/hub#az-iot-hub-update), [az iot hub identity show](/cli/azure/iot/hub/identity#az-iot-hub-identity-show), and [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create) commands
