---
title: Export data to Webhook IoT Central | Microsoft Docs
description: How to use the new data export to export your IoT data to Webhook
services: iot-central
author: eross-msft
ms.author: lizross
ms.date: 04/28/2022
ms.topic: how-to
ms.service: iot-central
---

# Export IoT data to Webhook

This article describes how to configure data export to send data to the Webhook.

[!INCLUDE [iot-central-data-export](../../../includes/iot-central-data-export.md)]

## Set up a Webhook export destination

For Webhook destinations, IoT Central exports data in near real time. The data in the message body is in the same format as for Event Hubs and Service Bus.

## Create a Webhook destination

You can export data to a publicly available HTTP Webhook endpoint. You can create a test Webhook endpoint using [RequestBin](https://requestbin.net/). RequestBin throttles request when the request limit is reached:

1. Open [RequestBin](https://requestbin.net/).
1. Create a new RequestBin and copy the **Bin URL**. You use this URL when you test your data export.

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