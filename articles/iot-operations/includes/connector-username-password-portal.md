---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 05/12/2026
ms.author: dobett
---

In the operations experience, when you add the inbound endpoint and choose the **Username password** authentication mode, select **Add reference** to add the secret references for the username and password. The operations experience offers two options:

- **Create a new secret**: uploads the value to Azure Key Vault and synchronizes it to the cluster as a synced secret.
- **Add from Azure Key Vault**: synchronizes an existing Key Vault secret to the cluster.

The operations experience saves both the username and password references in a single synced secret resource on the cluster, and you give that synced secret a name.

To learn more, see [Use the operations experience to create a synced secret](../secure-iot-ops/howto-manage-secrets.md#use-the-operations-experience-to-create-a-synced-secret).