---
title: "Azure Synapse Analytics security white paper: Access control"
description: Use different approaches or a combination of techniques to control access to data with Azure Synapse Analytics.
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 01/14/2022
---

# Azure Synapse Analytics security white paper: Access control

[!INCLUDE [security-white-paper-context](includes/security-white-paper-context.md)]

Depending on how the data has been modeled and stored, data governance and access control might require that developers and security administrators use different approaches, or combination of techniques, to implement a robust security foundation.

Azure Synapse supports a wide range of capabilities to control who can access what data. These capabilities are built upon a set of advanced access control features, including:

- [Object-level security](#object-level-security)
- [Row-level security](#row-level-security)
- [Column-level security](#column-level-security)
- [Dynamic data masking](#dynamic-data-masking)
- [Synapse role-based access control](#synapse-role-based-access-control)

## Object-level security

Every object in a dedicated SQL pool has associated permissions that can be granted to a principal. In the context of users and service accounts, that's how individual tables, views, stored procedures, and functions are secured. Object permissions, like SELECT, can be granted to user accounts (SQL logins, Azure Active Directory users or groups) and [database roles](/sql/relational-databases/security/authentication-access/database-level-roles?view=sql-server-ver15&preserve-view=true), which provides flexibility for database administrators. Further, permissions granted on tables and views can be combined with other access control mechanisms (described below), such as column-level security, row-level security, and dynamic data masking.

In Azure Synapse, all permissions are granted to database-level users and roles. Additionally, any user granted the built-in [Synapse Administrator RBAC role](../security/synapse-workspace-synapse-rbac-roles.md) at the workspace level is automatically granted full access to all dedicated SQL pools.

In addition to securing SQL tables in Azure Synapse, dedicated SQL pool (formerly SQL DW), serverless SQL pool, and Spark tables can be secured too. By default, users assigned to the **Storage Blob Data Contributor** role of data lakes connected to the workspace have READ, WRITE, and EXECUTE permissions on all Spark-created tables *when users interactively execute code in notebook*. It's called *Azure Active Directory (Azure AD) pass-through*, and it applies to all data lakes connected to the workspace. However, if the same user executes the same notebook *through a pipeline*, the workspace Managed Service Identity (MSI) is used for authentication. So, for the pipeline to successfully execute workspace MSI, it must also belong to the **Storage Blob Data Contributor** role of the data lake that's accessed.

## Row-level security

[Row-level security](/sql/relational-databases/security/row-level-security?view=azure-sqldw-latest&preserve-view=true) allows security administrators to establish and control fine grained access to specific table rows based on the profile of a user (or a process) running a query. Profile or user characteristics may refer to group membership or execution context. Row-level security helps prevent unauthorized access when users query data from the same tables but must see different subsets of data.

> [!NOTE]
> Row-level security is supported in Azure Synapse and dedicated SQL pool (formerly SQL DW), but it's not supported for Apache Spark pool and serverless SQL pool.

## Column-level security

[Column-level security](../sql-data-warehouse/column-level-security.md) allows security administrators to set permissions that limit who can access sensitive columns in tables. It's set at the database level and can be implemented without the need to change the design of the data model or application tier.

> [!NOTE]
> Column-level security is supported in Azure Synapse, serverless SQL pool views and dedicated SQL pool (formerly SQL DW), but it's not supported for serverless SQL pool external tables and Apache Spark pool. In case of a serverless SQL pool external tables workaround can be applied by creating a view on top of an external table. 

## Dynamic data masking

[Dynamic data masking](/azure/azure-sql/database/dynamic-data-masking-overview) allows security administrators to restrict sensitive data exposure by masking it on read to non-privileged users. It helps prevent unauthorized access to sensitive data by enabling administrators to determine how the data is displayed at query time. Based on the identity of the authenticated user and their group assignment in the SQL pool, a query returns either masked or unmasked data. Masking is always applied regardless of whether data is accessed directly from a table or by using a view or stored procedure.

> [!NOTE]
> Dynamic data masking is supported in Azure Synapse and dedicated SQL pool (formerly SQL DW), but it's not supported for Apache Spark pool and serverless SQL pool.

## Synapse role-based access control

Azure Synapse also includes [Synapse role-based access control (RBAC) roles](../security/synapse-workspace-understand-what-role-you-need.md) to manage different aspects of Synapse Studio. Leverage these built-in roles to assign permissions to users, groups, or other security principals to manage who can:

- Publish code artifacts and list or access published code artifacts.
- Execute code on Apache Spark pools and integration runtimes.
- Access linked (data) services that are protected by credentials.
- Monitor or cancel job executions, review job output and execution logs.

## Next steps

In the [next article](security-white-paper-authentication.md) in this white paper series, learn about authentication.
