---
author: vicancy
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/28/2026
ms.author: lianwei
---

> [!IMPORTANT]
> Raw connection strings appear in this article for demonstration purposes only.
>
> A connection string includes the authorization information your application needs to access Azure Web PubSub service. The access key in the connection string acts like a root password for your service. In production environments, always protect your access keys. Use Azure Key Vault to manage and rotate your keys securely and [secure your connection with `WebPubSubServiceClient`](../howto-use-azure-identity.md).
>
> Avoid distributing access keys to other users, hard-coding them, or saving them anywhere in plain text that is accessible to others. Rotate your keys if you believe they may have been compromised.
