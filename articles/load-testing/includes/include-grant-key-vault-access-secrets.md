---
title: "Include file"
description: "Include file"
services: load-testing
author: ntrogh
ms.service: load-testing
ms.author: nicktrog
ms.custom: "include file"
ms.topic: "include"
ms.date: 10/19/2023
---

When you store load test secrets or certificates in Azure Key Vault, your load testing resource uses a [managed identity](../how-to-use-a-managed-identity.md) for accessing the key vault. After you configure the manage identity, you need to grant the managed identity of your load testing resource permissions to read these values from the key vault.

To grant your Azure load testing resource permissions to read secrets or certificates from your Azure key vault:

1. In the [Azure portal](https://portal.azure.com/), go to your Azure key vault resource.

    If you don't have a key vault, follow the instructions in [Azure Key Vault quickstart](/azure/key-vault/secrets/quick-create-cli) to create one.

1. On the left pane, select **Access Policies**, and then select **+ Create**.

1. On the **Permissions** tab, under **Secret permissions**, select **Get**, and then select **Next**.

    > [!NOTE]
    > Azure Load Testing retrieves certificates as a *secret* to ensure that the private key for the certificate is available.

1. On the **Principal** tab, search for and select the managed identity for the load testing resource, and then select **Next**. 

    If you're using a system-assigned managed identity, the managed identity name matches that of your Azure load testing resource.

1. Select **Next** again.

    When your test runs, the managed identity that's associated with your load testing resource can now read the secrets or certificates for your load test from your key vault.
