---
title: Export data to Webhook IoT Central
description: Learn how to use the IoT Central data export capability to continuously export your IoT data to Webhook
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 05/22/2023
ms.topic: how-to
ms.service: iot-central
---

# Export IoT data to Webhook

This article describes how to configure data export to send data to the Webhook.

[!INCLUDE [iot-central-data-export](../../../includes/iot-central-data-export.md)]

## Set up a Webhook export destination

For Webhook destinations, IoT Central exports data in near real time. The data in the message body is in the same format as for Event Hubs and Service Bus.

## Create a Webhook destination

You can export data to a publicly available HTTP Webhook endpoint. You can create a test Webhook endpoint using [RequestBin](https://requestbin.com/). RequestBin throttles request when the request limit is reached:

1. Navigate to [RequestBin](https://requestbin.com/).

1. Select **Create a RequestBin**.

1. Sign in with one of the available methods.

1. Copy the URL of your RequestBin  You use this URL when you test your data export.

To create the Azure Data Explorer destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Webhook** as the destination type.

1. Paste the callback URL for your Webhook endpoint. You can optionally configure Webhook authorization and add custom headers.

    - For **OAuth2.0**, only the client credentials flow is supported. When you save the destination, IoT Central communicates with your OAuth provider to retrieve an authorization token. This token is attached to the `Authorization` header for every message sent to this destination.
    - For **Authorization token**, you can specify a token value that's directly attached to the `Authorization` header for every message sent to this destination.

1. Select **Save**.

[!INCLUDE [iot-central-data-export-setup](../../../includes/iot-central-data-export-setup.md)]

[!INCLUDE [iot-central-data-export-message-properties](../../../includes/iot-central-data-export-message-properties.md)]

[!INCLUDE [iot-central-data-export-device-connectivity](../../../includes/iot-central-data-export-device-connectivity.md)]

[!INCLUDE [iot-central-data-export-device-lifecycle](../../../includes/iot-central-data-export-device-lifecycle.md)]

[!INCLUDE [iot-central-data-export-device-template](../../../includes/iot-central-data-export-device-template.md)]

[!INCLUDE [iot-central-data-export-audit-logs](../../../includes/iot-central-data-export-audit-logs.md)]

## Next steps

Now that you know how to export to Service Bus, a suggested next step is to learn [Export to Event Hubs](howto-export-to-event-hubs.md).
