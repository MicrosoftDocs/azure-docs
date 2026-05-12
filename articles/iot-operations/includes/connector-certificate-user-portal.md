---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 05/12/2026
ms.author: dobett
---

In the operations experience, when you add the inbound endpoint and choose the **X509 certificate** authentication mode, select **Add reference** to add the secret reference for the client certificate and private key. The operations experience offers two options:

- **Create a new secret**: uploads the certificate and private key files to Azure Key Vault and synchronizes them to the cluster as a synced secret.
- **Add from Azure Key Vault**: synchronizes existing Key Vault secrets to the cluster.

The operations experience saves the certificate and key references in a single synced secret resource on the cluster, and you give that synced secret a name.

To learn more, see [Sync a client certificate and private key for mutual TLS](../secure-iot-ops/howto-manage-secrets.md#sync-a-client-certificate-and-private-key-for-mutual-tls).
