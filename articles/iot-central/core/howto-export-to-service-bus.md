---
title: Export data to Service Bus IoT Central
description: Learn how to use the IoT Central data export capability to continuously export your IoT data to Service Bus
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 05/22/2023
ms.topic: how-to
ms.service: iot-central
ms.custom: devx-track-azurecli
---

# Export IoT data to Service Bus

This article describes how to configure data export to send data to the Service Bus.

[!INCLUDE [iot-central-data-export](../../../includes/iot-central-data-export.md)]

## Set up a Service Bus export destination

Both queues and topics are supported for Azure Service Bus destinations.

IoT Central exports data in near real time. The data is in the message body and is in JSON format encoded as UTF-8.

The annotations or system properties bag of the message contains the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` fields that have the same values as the corresponding fields in the message body.

## Connection options

Service Bus destinations let you configure the connection with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

[!INCLUDE [iot-central-managed-identities](../../../includes/iot-central-managed-identities.md)]

### Create a Service Bus queue or topic destination

# [Connection string](#tab/connection-string)

If you don't have an existing Service Bus namespace to export to, run the following script in the Azure Cloud Shell bash environment. The script creates a resource group, Service Bus namespace, and queue. It then prints the connection string to use when you configure the data export in IoT Central:

```azurecli-interactive
# Replace the Service Bus namespace name with your own unique value
SBNS=your-service-bus-namespace-$RANDOM
SBQ=exportdata
RG=centralexportresources
LOCATION=eastus

az group create -n $RG --location $LOCATION
az servicebus namespace create --name $SBNS --resource-group $RG -l $LOCATION

# This example uses a Service Bus queue. You can use a Service Bus topic.
az servicebus queue create --name $SBQ --resource-group $RG --namespace-name $SBNS
az servicebus queue authorization-rule create --queue-name $SBQ --resource-group $RG --namespace-name $SBNS --name SendRule --rights Send

CS=$(az servicebus queue authorization-rule keys list --queue-name $SBQ --resource-group $RG --namespace-name $SBNS --name SendRule --query "primaryConnectionString" -o tsv)

echo "Service bus connection string: $CS"
```

To create the Service Bus destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Service Bus Queue** or  **Azure Service Bus Topic** as the destination type.

1. Select **Connection string** as the authorization type.

1. Paste in the connection string for your Service Bus resource, and enter the case-sensitive queue or topic name if necessary.

1. Select **Save**.

# [Managed identity](#tab/managed-identity)

This article shows how to create a managed identity using the Azure CLI. You can also use the Azure portal to create a manged identity.

If you don't have an existing Service Bus namespace to export to, run the following script in the Azure Cloud Shell bash environment. The script creates a resource group, Service Bus namespace, and queue. The script then enables the managed identity for your IoT Central application and assigns the role it needs to access your Service Bus queue:

```azurecli-interactive
# Replace the Service Bus namespace name with your own unique value
SBNS=your-service-bus-namespace-$RANDOM

# Replace the IoT Central app name with the name of your
# IoT Central application.
CA=your-iot-central-app

SBQ=exportdata
RG=centralexportresources
LOCATION=eastus

RGID=$(az group create -n $RG --location $LOCATION --query "id" --output tsv)
az servicebus namespace create --name $SBNS --resource-group $RG -l $LOCATION
az servicebus queue create --name $SBQ --resource-group $RG --namespace-name $SBNS

# This assumes your IoT Central application is in the 
# default `IOTC` resource group.
az iot central app identity assign --name $CA --resource-group IOTC --system-assigned
PI=$(az iot central app identity show --name $CA --resource-group IOTC --query "principalId" --output tsv)

az role assignment create --assignee $PI --role "Azure Service Bus Data Sender" --scope $RGID

az role assignment list --assignee $PI --all -o table

echo "Host name: $SBNS.servicebus.windows.net"
echo "Queue: $SBQ"
```

To further secure your queue or topic and only allow access from trusted services with managed identities, see [Export data to a secure destination on an Azure Virtual Network](howto-connect-secure-vnet.md).

To create the Service Bus destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Service Bus Queue** or  **Azure Service Bus Topic** as the destination type.

1. Select **System-assigned managed identity** as the authorization type.

1. Enter the host name of your Service Bus resource. Then enter the case-sensitive queue or topic name. A host name looks like: `contoso-waste.servicebus.windows.net`.

1. Select **Save**.

If you don't see data arriving in your destination service, see [Troubleshoot issues with data exports from your Azure IoT Central application](troubleshoot-data-export.md).

---

[!INCLUDE [iot-central-data-export-setup](../../../includes/iot-central-data-export-setup.md)]

[!INCLUDE [iot-central-data-export-message-properties](../../../includes/iot-central-data-export-message-properties.md)]

[!INCLUDE [iot-central-data-export-device-connectivity](../../../includes/iot-central-data-export-device-connectivity.md)]

[!INCLUDE [iot-central-data-export-device-lifecycle](../../../includes/iot-central-data-export-device-lifecycle.md)]

[!INCLUDE [iot-central-data-export-device-template](../../../includes/iot-central-data-export-device-template.md)]

[!INCLUDE [iot-central-data-export-audit-logs](../../../includes/iot-central-data-export-audit-logs.md)]

For Service Bus, IoT Central exports new messages data to your Service Bus queue or topic in near real time. In the user properties (also referred to as application properties) of each message, the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` are included automatically.

## Next steps

Now that you know how to export to Service Bus, a suggested next step is to learn [Export to Event Hubs](howto-export-to-event-hubs.md).
