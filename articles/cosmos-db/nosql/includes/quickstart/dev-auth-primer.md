---
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: include
ms.date: 01/08/2024
ms.custom: include file
---

Application requests to most Azure services must be authorized. Use the `DefaultAzureCredential` type as the preferred way to implement a passwordless connection between your applications and Azure Cosmos DB for NoSQL. `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime.

> [!IMPORTANT]
> You can also authorize requests to Azure services using passwords, connection strings, or other credentials directly. However, this approach should be used with caution. Developers must be diligent to never expose these secrets in an unsecure location. Anyone who gains access to the password or secret key is able to authenticate to the database service. `DefaultAzureCredential` offers improved management and security benefits over the account key to allow passwordless authentication without the risk of storing keys.
