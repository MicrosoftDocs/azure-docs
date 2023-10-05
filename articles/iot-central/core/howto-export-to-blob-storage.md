---
title: Export data to Blob Storage IoT Central
description: Learn how to use the IoT Central data export capability to continuously export your IoT data to Blob Storage
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 05/22/2023
ms.topic: how-to
ms.service: iot-central
ms.custom: devx-track-azurecli
---

# Export IoT data to Blob Storage

This article describes how to configure data export to send data to the Blob Storage service.

[!INCLUDE [iot-central-data-export](../../../includes/iot-central-data-export.md)]

To learn how to manage data export by using the IoT Central REST API, see [How to use the IoT Central REST API to manage data exports.](../core/howto-manage-data-export-with-rest-api.md)

## Set up a Blob Storage export destination

IoT Central exports data once per minute, with each file containing the batch of changes since the previous export. Exported data is saved in JSON format. The default paths to the exported data in your storage account are:

- Telemetry: *{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}*
- Property changes: *{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}*

To browse the exported files in the Azure portal, navigate to the file and select **Edit blob**.

## Connection options

Blob Storage destinations let you configure the connection with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

> [!TIP]
> If the Blob Storage destination is protected by a firewall, you must use a managed identity to connect to it.

[!INCLUDE [iot-central-managed-identities](../../../includes/iot-central-managed-identities.md)]

### Create an Azure Blob Storage destination

# [Connection string](#tab/connection-string)


If you don't have an existing Azure storage account to export to, run the following script in the Azure Cloud Shell bash environment. The script creates a resource group, Azure Storage account, and blob container. It then prints the connection string to use when you configure the data export in IoT Central:

```azurecli-interactive
# Replace the storage account name with your own unique value
SA=yourstorageaccount$RANDOM
CN=exportdata
RG=centralexportresources
LOCATION=eastus

az group create -n $RG --location $LOCATION
az storage account create --name $SA --resource-group $RG --location $LOCATION --sku Standard_LRS
az storage container create --account-name $SA --resource-group $RG --name $CN

CS=$(az storage account show-connection-string --resource-group $RG --name $SA --query "connectionString" --output tsv)

echo "Storage connection string: $CS"
```

You can learn more about creating new [Azure Blob Storage accounts](../../storage/blobs/storage-quickstart-blobs-portal.md) or [Azure Data Lake Storage v2 storage accounts](../../storage/common/storage-account-create.md). Data export can only write data to storage accounts that support block blobs. The following table shows the known compatible storage account types:

|Performance Tier|Account Type|
|-|-|
|Standard|General Purpose V2|
|Standard|General Purpose V1|
|Standard|Blob storage|
|Premium|Block Blob storage|

To create the Blob Storage destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Blob Storage** as the destination type.

1. Select **Connection string** as the authorization type.

1. Paste in the connection string for your Blob Storage resource, and enter the case-sensitive container name if necessary.

1. Select **Save**.

# [Managed identity](#tab/managed-identity)

This article shows how to create a managed identity using the Azure CLI. You can also use the Azure portal to create a manged identity.

If you don't have an existing Azure storage account to export to, run the following script in the Azure Cloud Shell bash environment. The script creates a resource group, Azure Storage account, and blob container. The script then enables the managed identity for your IoT Central application and assigns the role it needs to access your storage account:

```azurecli-interactive
# Replace the storage account name with your own unique value.
SA=yourstorageaccount$RANDOM

# Replace the IoT Central app name with the name of your
# IoT Central application.
CA=your-iot-central-app

CN=exportdata
RG=centralexportresources
LOCATION=eastus

az group create -n $RG --location $LOCATION
SAID=$(az storage account create --name $SA --resource-group $RG --location $LOCATION --sku Standard_LRS --query "id" --output tsv)
az storage container create --account-name $SA --resource-group $RG --name $CN

# This assumes your IoT Central application is in the 
# default `IOTC` resource group.
az iot central app identity assign --name $CA --resource-group IOTC --system-assigned
PI=$(az iot central app identity show --name $CA --resource-group IOTC --query "principalId" --output tsv)

az role assignment create --assignee $PI --role "Storage Blob Data Contributor" --scope $SAID

az role assignment list --assignee $PI --all -o table

echo "Endpoint URI: https://$SA.blob.core.windows.net/"
echo "Container: $CN"
```

You can learn more about creating new [Azure Blob Storage accounts](../../storage/blobs/storage-quickstart-blobs-portal.md) or [Azure Data Lake Storage v2 storage accounts](../../storage/common/storage-account-create.md). Data export can only write data to storage accounts that support block blobs. The following table shows the known compatible storage account types:

|Performance Tier|Account Type|
|-|-|
|Standard|General Purpose V2|
|Standard|General Purpose V1|
|Standard|Blob storage|
|Premium|Block Blob storage|

To further secure your blob container and only allow access from trusted services with managed identities, see [Export data to a secure destination on an Azure Virtual Network](howto-connect-secure-vnet.md).

To create the Blob Storage destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Blob Storage** as the destination type.

1. Select **System-assigned managed identity** as the authorization type.

1. Enter the endpoint URI for your storage account and the case-sensitive container name. An endpoint URI looks like: `https://contosowaste.blob.core.windows.net`.

1. Select **Save**.

If you don't see data arriving in your destination service, see [Troubleshoot issues with data exports from your Azure IoT Central application](troubleshoot-data-export.md).

---

[!INCLUDE [iot-central-data-export-setup](../../../includes/iot-central-data-export-setup.md)]

For Blob Storage, messages are batched and exported once per minute.

The following example shows an exported telemetry message:

```json

{
    "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
    "messageSource": "telemetry",
    "deviceId": "1vzb5ghlsg1",
    "schema": "default@v1",
    "templateId": "urn:qugj6vbw5:___qbj_27r",
    "enqueuedTime": "2020-08-05T22:26:55.455Z",
    "telemetry": {
        "Activity": "running",
        "BloodPressure": {
            "Diastolic": 7,
            "Systolic": 71
        },
        "BodyTemperature": 98.73447010562934,
        "HeartRate": 88,
        "HeartRateVariability": 17,
        "RespiratoryRate": 13
    },
    "enrichments": {
      "userSpecifiedKey": "sampleValue"
    },
    "module": "VitalsModule",
    "component": "DeviceComponent",
    "messageProperties": {
      "messageProp": "value"
    }
}
```

---

[!INCLUDE [iot-central-data-export-message-properties](../../../includes/iot-central-data-export-message-properties.md)]

For Blob Storage, messages are batched and exported once per minute.

The following snippet shows a property change message exported to Blob Storage:

```json
{
    "applicationId": "fb74969c-8682-4708-af01-33499a7f7d98",
    "messageSource": "properties",
    "deviceId": "Pepjmh1Hcc",
    "enqueuedTime": "2023-03-02T10:35:39.281Z",
    "enrichments": {},
    "messageType": "devicePropertyReportedChange",
    "schema": "default@v1",
    "templateId": "dtmi:azureiot:ddzig4ascxz",
    "properties": [
        {
            "component": "device_info",
            "name": "swVersion",
            "value": "12"
        },
        {
            "component": "device_info",
            "name": "osName",
            "value": "Android"
        },
        {
            "component": "device_info",
            "name": "processorArchitecture",
            "value": "arm64-v8a"
        },
        {
            "component": "device_info",
            "name": "processorManufacturer",
            "value": "unknown"
        }
    ]
}
```

[!INCLUDE [iot-central-data-export-device-connectivity](../../../includes/iot-central-data-export-device-connectivity.md)]

For Blob Storage, messages are batched and exported once per minute.

The following example shows an exported device connectivity message received in Azure Blob Storage.

```json
{
  "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
  "messageSource": "deviceConnectivity",
  "messageType": "connected",
  "deviceId": "1vzb5ghlsg1",
  "schema": "default@v1",
  "templateId": "urn:qugj6vbw5:___qbj_27r",
  "enqueuedTime": "2021-04-05T22:26:55.455Z",
  "enrichments": {
    "userSpecifiedKey": "sampleValue"
  }
}

```

[!INCLUDE [iot-central-data-export-device-lifecycle](../../../includes/iot-central-data-export-device-lifecycle.md)]

For Blob Storage, messages are batched and exported once per minute.

The following example shows an exported device lifecycle message received in Azure Blob Storage.

```json
{
  "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
  "messageSource": "deviceLifecycle",
  "messageType": "registered",
  "deviceId": "1vzb5ghlsg1",
  "schema": "default@v1",
  "templateId": "urn:qugj6vbw5:___qbj_27r",
  "enqueuedTime": "2021-01-01T22:26:55.455Z",
  "enrichments": {
    "userSpecifiedKey": "sampleValue"
  }
}
```

[!INCLUDE [iot-central-data-export-device-template](../../../includes/iot-central-data-export-device-template.md)]

For Blob Storage, messages are batched and exported once per minute.

The following example shows an exported device lifecycle message received in Azure Blob Storage.

```json
{
  "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
  "messageSource": "deviceTemplateLifecycle",
  "messageType": "created",
  "schema": "default@v1",
  "templateId": "urn:qugj6vbw5:___qbj_27r",
  "enqueuedTime": "2021-01-01T22:26:55.455Z",
  "enrichments": {
    "userSpecifiedKey": "sampleValue"
  }
}
```

[!INCLUDE [iot-central-data-export-audit-logs](../../../includes/iot-central-data-export-audit-logs.md)]

The following example shows an exported audit log message received in Azure Blob Storage:

```json
{
  "actor": {
    "id": "test-audit",
    "type": "apiToken"
    },
  "applicationId": "570c2d7b-1111-2222-abcd-000000000000",
  "enqueuedTime": "2022-07-25T21:54:40.000Z",
  "enrichments": {},
  "messageSource": "audit",
  "messageType": "created",
  "resource": {
    "displayName": "Sensor 1",
    "id": "sensor",
    "type": "device"    
  },
  "schema": "default@v1"
}
```

## Next steps

Now that you know how to export to Blob Storage, a suggested next step is to learn [Export to Service Bus](howto-export-to-service-bus.md).
