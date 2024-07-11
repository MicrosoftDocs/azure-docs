---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/11/2024
ms.author: glenga
---

>[!NOTE]
>When using `APPLICATIONINSIGHTS_AUTHENTICATION_STRING` to connect to Application Insights using Microsoft Entra authentication, you should also [Disable local authentication](../articles/azure-monitor/app/azure-ad-authentication.md#disable-local-authentication). This configuration allows you to ingest telemetry authenticated exclusively by Microsoft Entra ID into your workspace and prevents the use of other authentication methods, like API keys.

