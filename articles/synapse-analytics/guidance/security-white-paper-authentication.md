---
title: "Azure Synapse Analytics security white paper: Authentication"
description: Implement authentication mechanisms with Azure Synapse Analytics.
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 01/14/2022
---

# Azure Synapse Analytics security white paper: Authentication

[!INCLUDE [security-white-paper-context](includes/security-white-paper-context.md)]

Authentication is the process of proving the user is who they claim to be. Authentication activities can be logged with [Azure SQL Auditing](/azure/azure-sql/database/auditing-overview), and an IT administrator can configure reports and alerts whenever a login from a suspicious location is attempted.

## Benefits

Some of the benefits of these robust authentication mechanisms include:

- Strong password policies to deter brute force attacks.
- User password encryption.
- [Firewall rules](/azure/azure-sql/database/firewall-configure).
- SQL endpoints with [Multi-factor authentication](../sql/mfa-authentication.md).
- Elimination of the need to manage credentials with [managed identity](../../data-factory/data-factory-service-identity.md).

Azure Synapse, dedicated SQL pool (formerly SQL DW), and serverless SQL pool currently support [Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) authentication and [SQL authentication](../sql/sql-authentication.md), while Apache Spark pool supports only Azure AD authentication. Multi-factor authentication and managed identity are fully supported for Azure Synapse, dedicated SQL pool (formerly SQL DW), serverless SQL pool, and Apache Spark pool.

## Next steps

In the [next article](security-white-paper-network-security.md) in this white paper series, learn about network security.
