---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/16/2026
ms.author: glenga
---

### [Flex Consumption plan](#tab/flex-consumption-plan)

Provides fast horizontal scaling, with flexible compute options, virtual network integration, and full support for connections using Microsoft Entra ID authentication. In this plan, instances dynamically scale out based on configured per-instance concurrency, incoming events, and per-function workloads for optimal efficiency. Flex Consumption is the recommended plan for serverless hosting. For more information, see [Azure Functions Flex Consumption plan hosting](../articles/azure-functions/flex-consumption-plan.md).

### [Consumption plan](#tab/consumption-plan)

Provides dynamic scale and serverless hosting when your app must run on Windows, on the full .NET Framework, or with full support for PowerShell. Use the Flex Consumption plan for hosting new apps, unless your app requires these specialized hosting conditions. For more information, see [Azure Functions Consumption plan hosting](../articles/azure-functions/consumption-plan.md).

---