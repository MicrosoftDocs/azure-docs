---
title: Managed Identity Authentication for Azure Synapse SQL
description: Learn how to use managed identities with Microsoft Entra authentication for Azure Synapse SQL.
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf
ms.date: 10/06/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
---

# Managed identities in Microsoft Entra for Azure Synapse Analytics

Microsoft Entra ID ([formerly Azure Active Directory](/entra/fundamentals/new-name)) supports two types of managed identities: system-assigned managed identity (SMI) and user-assigned managed identity (UMI). For more information, see [Managed identity types](/entra/identity/managed-identities-azure-resources/overview#managed-identity-types).

You can use managed identities to access a Synapse SQL database by using the SQL connection string option `Authentication=Active Directory Managed Identity`. You need to create a SQL user from the managed identity in the target database by using the [CREATE USER](/sql/t-sql/statements/create-user-transact-sql?view=azure-sqldw-latest&preserve-view=true) statement. For more information, see [Using Microsoft Entra authentication with SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication).

## Create a user-assigned managed identity

For information on how to create a UMI, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

To use a UMI with a Synapse workspace, first create credentials in your service instance. For more information, see [Managed service identity for Azure Synapse Analytics](../synapse-service-identity.md#user-assigned-managed-identity).

## Permissions

To access a database in a dedicated or serverless SQL pool, create a database user for the managed identity and grant the required permissions. For details about Microsoft Entra users and database permissions in Synapse SQL, see [SQL Authentication in Azure Synapse Analytics](sql-authentication.md).

## Related content

- [Managed identities for Azure Synapse Analytics](../synapse-service-identity.md)
- [SQL Authentication in Azure Synapse Analytics](sql-authentication.md)
- [Secure a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](../sql-data-warehouse/sql-data-warehouse-overview-manage-security.md)
