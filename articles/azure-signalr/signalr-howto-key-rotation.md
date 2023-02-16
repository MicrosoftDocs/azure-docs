---
title: Rotate access keys for Azure SignalR Service
description: An overview on why the customer needs to routinely rotate the access keys and how to do it with the Azure portal GUI and the Azure CLI.
author: vicancy
ms.service: signalr
ms.topic: how-to
ms.date: 07/18/2022
ms.author: lianwei
---
# Rotate access keys for Azure SignalR Service

For security reasons and compliance requirements, it is important to routinely rotate your access keys. This article describes how to rotate access keys for Azure SignalR Service.

Each Azure SignalR Service instance has a primary and a secondary key. They're used to authenticate SignalR clients when requests are made to the service. The keys are associated with the instance endpoint URL. Keep your keys secure, and rotate them regularly. You're provided with two access keys so that you can maintain connections by using one key while regenerating the other.


## Regenerate access keys

1. Go to the [Azure portal](https://portal.azure.com/), and sign in with your credentials.

1. Find the **Keys** section in the Azure SignalR Service instance with the keys that you want to regenerate.

1. Select **Keys** on the navigation menu.

1. Select **Regenerate Primary Key** or **Regenerate Secondary Key**.

   A new key and corresponding connection string are created and displayed.

   ![Regenerate Keys](media/signalr-howto-key-rotation/regenerate-keys.png)

You also can regenerate keys by using the [Azure CLI](/cli/azure/signalr/key#az-signalr-key-renew).

## Update configurations with new connection strings

1. Copy the newly generated connection string.

1. Update all configurations to use the new connection string.

1. Restart the application as needed.

## Forced access key regeneration

The Azure SignalR Service can enforce a mandatory access key regeneration under certain situations. The service notifies customers of mandatory key regeneration via email and portal notification. If you receive this communication or encounter service failure due to an access key, rotate the keys by following the instructions in this guide.

## Next steps

> [!div class="nextstepaction"]
> [Azure SignalR Service authentication](./signalr-concept-authenticate-oauth.md)

> [!div class="nextstepaction"]
> [Build a serverless real-time app with authentication](./signalr-tutorial-authenticate-azure-functions.md)