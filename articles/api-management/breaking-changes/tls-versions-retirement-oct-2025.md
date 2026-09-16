---
title: Retirement of TLS 1.0 and TLS 1.1 versions in Azure API Management
description: Retirement of TLS 1.0 and 1.1 affects connections to Azure services. Update your Azure API Management client connections to TLS 1.2 or later.
author: PatAltimore
ms.author: patricka
ms.date: 8/03/2026
ms.topic: reference
ms.service: azure-api-management
---

# Retirement of TLS 1.0 and TLS 1.1 versions in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../../includes/api-management-availability-all-tiers.md)]

Following the announcement on November 10, 2023, Microsoft is continuing its transition to requiring TLS 1.2 or later for all connections to Azure services. To minimize disruption to customer workloads, several services continue supporting TLS 1.0 and TLS 1.1 versions and complete their transitions by August 31, 2025 when TLS 1.2 or later is required for all connections to Azure services (unless explicitly indicated in service documentation). The list of remaining services is updated as transitions to TLS 1.2 or later complete.

While the Microsoft implementation of TLS 1.0 and TLS 1.1 versions isn't known to have vulnerabilities, TLS 1.2 or later versions provide improved security features, including perfect forward secrecy and stronger cipher suites. 

Customers using TLS 1.0 or 1.1 should transition their workloads to TLS 1.2 or later versions to ensure uninterrupted connectivity to Azure services. 

For more information about the notice, see [Retirement: Update on retirement of TLS 1.0 and TLS 1.1 versions in Azure Services](https://azure.microsoft.com/updates?id=Update-retirement-TLS1-0-TLS1-1-versions-Azure-Services).

## Recommended action

To avoid potential service disruptions, confirm that your resources that interact with Azure services are using TLS 1.2 or later. Then:

- If they're already exclusively using TLS 1.2 or later, you don't need to take further action.
- If they have a dependency on TLS 1.0 or 1.1, transition them to TLS 1.2 or later. For more information, see [Manage protocols and ciphers in Azure API Management](../api-management-howto-manage-protocols-ciphers.md).

For more information about the update to TLS 1.2 or later, see [solving the TLS 1.0 problem](/security/engineering/solving-tls1-problem).
