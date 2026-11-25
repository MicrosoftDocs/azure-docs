---
title: Send a Service Bus message with Microsoft Entra ID authentication
description: Use Postman to request a Microsoft Entra ID access token and send a message to an Azure Service Bus queue over HTTPS.
author: EldertGrootenboer
ms.author: egrootenboer
ms.service: azure-service-bus
ms.topic: how-to
ms.date: 10/13/2026
---

# Send a Service Bus message with Microsoft Entra ID authentication

Use a Microsoft Entra ID access token to authorize a REST request to Service Bus. This article shows how to request a token for an application's identity and send a message with Postman. For authentication options in an application, see [Authenticate an application](authenticate-application.md).

## Prerequisites

- An Azure Service Bus namespace and a queue. To create them, follow [Create a Service Bus queue](service-bus-quickstart-portal.md).
- Permission to register an application in your Microsoft Entra ID tenant and assign an Azure role at the queue or namespace scope.
- The [Postman desktop app](https://learning.postman.com/docs/getting-started/installation/install-app/).

This example uses Azure public cloud endpoints and a client secret for a manual test. For production applications hosted in Azure, prefer [managed identity](service-bus-managed-service-identity.md) where available.

## 1. Register the application and grant send access

1. [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app). Record the **Application (client) ID** and **Directory (tenant) ID**.
1. For this test, [create a client secret](authenticate-application.md#create-a-client-secret). Store the secret value securely; use the value, not the secret identifier.
1. Assign the **Azure Service Bus Data Sender** role to the application's service principal at the queue scope, or at the namespace scope if the application needs to send to multiple entities. Follow [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).
1. Allow up to five minutes for the role assignment to propagate.

> [!IMPORTANT]
> Keep the client secret and access token private. Use local secret storage for this test and exclude these values from shared collections, source control, screenshots, and logs.

## 2. Request an access token in Postman

The [OAuth 2.0 client credentials flow](/entra/identity-platform/v2-oauth2-client-creds-grant-flow#first-case-access-token-request-with-a-shared-secret) uses a `POST` request with a URL-encoded form body.

1. Create a request in Postman and select **POST**.
1. Enter `https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token`. Replace `<tenant-id>` with the application's directory tenant ID.
1. On the **Body** tab, select **x-www-form-urlencoded** and enter these fields:

   | Key | Value |
   | --- | --- |
   | `grant_type` | `client_credentials` |
   | `client_id` | Your application client ID |
   | `client_secret` | Your client secret value |
   | `scope` | `https://servicebus.azure.net/.default` |

1. Confirm that the request has `Content-Type: application/x-www-form-urlencoded`. Postman encodes the form values, including special characters in the secret.
1. Select **Send**. A successful response contains an `access_token` value. Use that value without the enclosing JSON quotes in the next request.

Request the token for `https://servicebus.azure.net/.default`, rather than for the individual namespace URL.

## 3. Send a message to the queue

1. Create another Postman request and select **POST**.
1. Enter `https://<namespace-name>.servicebus.windows.net/<queue-name>/messages`. Replace the placeholders with your namespace and queue names, for example `https://your-namespace.servicebus.windows.net/orders/messages`.
1. On the **Headers** tab, add the following values:

   | Key | Value |
   | --- | --- |
   | `Authorization` | `Bearer <access-token>` |
   | `Content-Type` | `text/plain; charset=utf-8` |

1. On the **Body** tab, select **raw** and enter `This is a message.`.

   :::image type="content" source="./media/rest-send-entra-token/postman-body-message.png" alt-text="Screenshot showing a raw message body in a Postman request to a Service Bus queue.":::

1. Select **Send**. A successful [Send message](/rest/api/servicebus/send-message-to-queue) request returns `201 Created`.

The equivalent HTTP request has the following shape:

```http
POST https://your-namespace.servicebus.windows.net/orders/messages HTTP/1.1
Authorization: Bearer <access-token>
Content-Type: text/plain; charset=utf-8

This is a message.
```

## Verify the result

In the Azure portal, open the queue and use [Service Bus Explorer](explorer.md) to peek at the message body. Peeking inspects the message without removing it. If another consumer is running, it might receive the message before you inspect it.

If the send request returns `401 Unauthorized`, check the token's audience and expiration, the `Bearer` header, and the application's role assignment and scope. Obtain a new token after the current token expires. If the token request itself fails, inspect the Microsoft identity platform error response and verify the tenant ID, client ID, secret value, and form encoding.

After the test, remove the test client secret and any role assignment or application registration you created solely for this walkthrough.

## Next steps

- [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md)
- [HTTP message headers and properties](service-bus-rest-message-properties.md)
- [Send message REST reference](/rest/api/servicebus/send-message-to-queue)
