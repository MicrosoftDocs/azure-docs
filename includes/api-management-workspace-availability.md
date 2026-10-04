---
author: PatAltimore
ms.service: azure-api-management
ms.topic: include
ms.date: 06/24/2024
ms.author: patricka
---
> [!NOTE]
> Currently, this feature isn't available in [workspaces](../articles/api-management/workspaces-overview.md) itself, and workspaces don't support related features such as storing secrets in Azure Key Vault or the  `authentication-managed-identity`  policy. As an exception, a workspace logger (Application Insights or Azure Event Hub) can authenticate using the service-level managed identity by specifying its client ID (or  `SystemAssigned` ) as  `identityClientId`  in the logger's credentials.
