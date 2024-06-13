---
title: Export IoT Central data to a secure VNet
description: Learn how to use IoT Central data export to send data to a destination in a secure VNet. Data export destinations include Blob Storage and Azure Event Hubs.
author: dominicbetts
ms.author: dobett
ms.date: 05/22/2023
ms.topic: how-to
ms.service: iot-central
services: iot-central

# Administrator
---

# Export data to a secure destination on an Azure Virtual Network

Data export in IoT Central lets you continuously stream device data to destinations such as Azure Blob Storage, Azure Event Hubs, Azure Service Bus Messaging, or Azure Data Explorer. You can lock down these destinations by using an Azure Virtual Network (VNet) and private endpoints.

Currently, it's not possible to connect an IoT Central application directly to VNet for data export. However, because IoT Central is a trusted Azure service, it's possible to configure an exception to the firewall rules and connect to a secure destination on a VNet. In this scenario, you typically use a managed identity to authenticate and authorize with the destination.

## Prerequisites

- An IoT Central application. To learn more, see [Create an IoT Central application](howto-create-iot-central-application.md).

- Data export configured in your IoT Central application to send device data to a destination such as Azure Blob Storage, Azure Event Hubs, Azure Service Bus, or Azure Data Explorer. The destination must be configured to use a managed identity. To learn more, see  [Export IoT data to cloud destinations using Blob Storage](howto-export-to-blob-storage.md).

## Configure the destination service

To configure Azure Blob Storage to use a VNet and private endpoint see:

- [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json)
- [Private endpoints for your storage account](../../storage/common/storage-private-endpoints.md)

To configure Azure Event Hubs to use a VNet and private endpoint see:

- [Allow access to Azure Event Hubs namespaces from specific virtual networks](../../event-hubs/event-hubs-service-endpoints.md)
- [Allow access to Azure Event Hubs namespaces via private endpoints](../../event-hubs/private-link-service.md)

To configure Azure Service Bus Messaging to use a VNet and private endpoint see:

- [Allow access to Azure Service Bus namespace from specific virtual networks](../../service-bus-messaging/service-bus-service-endpoints.md)
- [Allow access to Azure Service Bus namespaces via private endpoints](../../service-bus-messaging/private-link-service.md)

## Configure the firewall exception

To allow IoT Central to connect to a destination on a VNet, enable a firewall exception on the VNet to allow connections from trusted Azure services.

To configure the exception in the Azure portal for Azure Blob Storage, navigate to **Networking > Firewalls and virtual networks**. Then select **Allow Azure services on the trusted services list to access this storage account.**:

:::image type="content" source="media/howto-connect-secure-vnet/blob-storage-exception.png" alt-text="Screenshot from Azure portal that shows firewall exception for Azure Blob Storage virtual network.":::

To configure the exception in the Azure portal for Azure Event Hubs, navigate to **Networking > Public access**. Then select **Yes** to allow trusted Microsoft services to bypass this firewall:

:::image type="content" source="media/howto-connect-secure-vnet/event-hubs-exception.png" alt-text="Screenshot from Azure portal that shows firewall exception for Azure Event Hubs virtual network.":::

To configure the exception in the Azure portal for Azure Service Bus, navigate to **Networking > Public access**. Then select **Yes** to allow trusted Microsoft services to bypass this firewall:

:::image type="content" source="media/howto-connect-secure-vnet/service-bus-queue-exception.png" alt-text="Screenshot from Azure portal that shows firewall exception for Azure Service Bus virtual network.":::

## Next steps

Now that you've learned how to export data to a destination locked down on a VNet, here's the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md).
