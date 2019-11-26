---
title: How to rotate access key for Azure SignalR Service
description: An overview on why the customer needs to routinely rotate the access keys and how to do it with the Azure portal GUI and the Azure CLI.
author: sffamily
ms.service: signalr
ms.topic: conceptual
ms.date: 03/01/2019
ms.author: zhshang
---
# How to rotate access key for Azure SignalR Service

Each Azure SignalR Service instance has a pair of access keys called Primary and Secondary keys. They're used to authenticate SignalR clients when requests are made to the service. The keys are associated with the instance endpoint url. Keep your keys secure, and rotate them regularly. You're provided with two access keys, so you can maintain connections by using one key while regenerating the other.

## Why rotate access keys?

For security reasons and compliance requirements, routinely rotate your access keys.

## Regenerate access keys

1. Go to the [Azure portal](https://portal.azure.com/), and sign in with your credentials.

1. Find the **Keys** section in the Azure SignalR Service instance with the keys that you want to regenerate.

1. Select **Keys** on the navigation menu.

1. Select **Regenerate Primary Key** or **Regenerate Secondary Key**.

   A new key and corresponding connection string are created and displayed.

   ![Regenerate Keys](media/signalr-howto-key-rotation/regenerate-keys.png)

You also can regenerate keys by using the [Azure CLI](/cli/azure/signalr/key?view=azure-cli-latest#az-signalr-key-renew).

## Update configurations with new connection strings

1. Copy the newly generated connection string.

1. Update all configurations to use the new connection string.

1. Restart the application as needed.

## Forced access key regeneration

Azure SignalR Service might enforce a mandatory access key regeneration under certain situations. The service notifies customers via email and portal notification. If you receive this communication or encounter service failure due to an access key, rotate the keys by following the instructions in this guide.

## Next steps

Rotate your access keys regularly as a good security practice.

In this guide, you learned how to regenerate access keys. Continue to the next tutorials about authentication with OAuth or with Azure Functions.

> [!div class="nextstepaction"]
> [Integrate with ASP.NET core identity](./signalr-concept-authenticate-oauth.md)

> [!div class="nextstepaction"]
> [Build a serverless real-time app with authentication](./signalr-tutorial-authenticate-azure-functions.md)