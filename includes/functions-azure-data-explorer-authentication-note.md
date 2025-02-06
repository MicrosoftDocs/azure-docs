---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 12/29/2024
ms.author: glenga
---

> [!IMPORTANT]
> For optimal security, your function app should use managed idenities when connecting to Azure Data Explorer instead of using a connection string, which contains keys. For more information, see [Kusto connection strings](/azure/data-explorer/kusto/api/connection-strings/kusto). For mananaged identity-based connections, you must set the `managedServiceIdentity` property in the binding definition.