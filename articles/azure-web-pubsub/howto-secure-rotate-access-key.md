---
title: Rotate access keys
description: Learn how and when to rotate Azure Web PubSub access keys by regenerating one key at a time.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 08/16/2024
---

# Rotate access keys

Each Azure Web PubSub instance has a pair of access keys that helps you authenticate clients when requests are made to the service. Both keys are associated with the instance endpoint URL.

Each instance has a primary access key and a secondary access key. Rotate one access key at a time by regenerating a new key of that type, either primary or secondary. Update one access key while the other access key maintains existing authenticated connections.

## When to rotate access keys

For security and compliance requirements, we recommend that you routinely rotate your access keys.

To regenerate an access key, complete the steps that are described in the following sections.

### Enforced access key rotation

In some scenarios, Azure Web PubSub might enforce a mandatory access key rotation. The service sends notifications via email and in the portal. If you receive this kind of notification or if you encounter service failure due to an access key issue, regenerate your access keys to rotate the keys.

## Regenerate an access key

1. In the [Azure portal](https://portal.azure.com/), sign in with your subscription credentials.

1. Go to the Web PubSub instance that has keys you want to rotate.

1. On the left menu, select **Keys**.

1. Select **Regenerate Primary Key** or **Regenerate Secondary Key**. A new key and a corresponding connection string are created. You manage them in your Web PubSub instance.

When the Azure Web PubSub service becomes generally available, you can also regenerate a key by using the Azure CLI.

## Update configurations with the new connection string

1. Copy the new connection string.

1. Update all existing configurations to use the new connection string.

1. Close the application, and then reopen it.
