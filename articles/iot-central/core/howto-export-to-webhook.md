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

    - For **OAuth2.0**, only the [client credentials grant flow](/entra/identity-platform/v2-oauth2-client-creds-grant-flow#first-case-access-token-request-with-a-shared-secret) is supported. When you save the destination, IoT Central communicates with your OAuth provider to retrieve an authorization token. This token is attached to the `Authorization` header for every message sent to this destination.
    - For **Authorization token**, you can specify a token value that's directly attached to the `Authorization` header for every message sent to this destination.

1. Select **Save**.

### Example OAuth 2.0 configuration

This example shows how to configure a Webhook destination to use an Azure Function App that's protected by using [Microsoft Entra sign-in](../../app-service/configure-authentication-provider-aad.md):

| Setting | Example | Notes |
|---------|---------|-------|
| Destination type | Webhook | |
| Callback URL | `https://myapp.azurewebsites.net/api/HttpExample` | The function URL. |
| Authorization | OAuth 2.0 | |
| Token URL | `https://login.microsoftonline.com/your-tenant-id/oauth2/v2.0/token` | The URL to use to retrieve a token. You can find this value in your Function App: **Authentication > Your Microsoft Identity provider > Endpoints > OAuth 2.0 token endpoint (v2)**  |
| Client ID | `your-client-id` | The client ID of your Function App. You can find this value in your Function App: **Authentication > Your Microsoft Identity provider > Application (client) ID** |
| Client secret | `your-client-secret` | The client secret of your Function App. You can find this value in your Function App: **Authentication > Your Microsoft Identity provider > Certificates & secrets** |
| Audience | N/A | Blank if you're using a Function App. |
| Scope | `https://your-client-id/.default` | The scope of the token. For a Function App, use the client ID value.** |
| Token request content type | **Auto** | |

Other webhook destinations might require different values for these settings.

[!INCLUDE [iot-central-data-export-setup](../../../includes/iot-central-data-export-setup.md)]

[!INCLUDE [iot-central-data-export-message-properties](../../../includes/iot-central-data-export-message-properties.md)]

[!INCLUDE [iot-central-data-export-device-connectivity](../../../includes/iot-central-data-export-device-connectivity.md)]

[!INCLUDE [iot-central-data-export-device-lifecycle](../../../includes/iot-central-data-export-device-lifecycle.md)]

[!INCLUDE [iot-central-data-export-device-template](../../../includes/iot-central-data-export-device-template.md)]

[!INCLUDE [iot-central-data-export-audit-logs](../../../includes/iot-central-data-export-audit-logs.md)]

## Next steps

Now that you know how to export to Service Bus, a suggested next step is to learn [Export to Event Hubs](howto-export-to-event-hubs.md).
