---
title: How to rotate access key for Azure Web PubSub service
description: An overview on why the customer needs to routinely rotate the access keys and how to do it.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 11/08/2021
---

# How to rotate access key for Azure Web PubSub service

Each Azure Web PubSub service instance has a pair of access keys called Primary and Secondary keys. They're used to authenticate clients when requests are made to the service. The keys are associated with the instance endpoint URL. Keep your keys secure, and rotate them regularly. You're provided with two access keys, so you can maintain connections by using one key while regenerating the other.

## Why rotate access keys?

For security reasons and compliance requirements, routinely rotate your access keys.

## Regenerate access keys

1. Go to the [Azure portal](https://portal.azure.com/), and sign in with your credentials.

1. Find the **Keys** section in the Azure Web PubSub service instance with the keys that you want to regenerate.

1. Select **Keys** on the navigation menu.

1. Select **Regenerate Primary Key** or **Regenerate Secondary Key**.

   A new key and corresponding connection string are created and displayed.

You also can regenerate keys by using the Azure CLI, once the Azure Web PubSub service is GA.

## Update configurations with new connection strings

1. Copy the newly generated connection string.

1. Update all configurations to use the new connection string.

1. Restart the application as needed.

## Forced access key regeneration

Azure Web PubSub service might enforce a mandatory access key regeneration under certain situations. The service notifies customers via email and portal notification. If you receive this communication or encounter service failure due to an access key, rotate the keys by following the instructions in this guide.