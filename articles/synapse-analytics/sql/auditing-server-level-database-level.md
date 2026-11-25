---
title: Auditing Policy at the Server and Database Level
titleSuffix: Azure Synapse Analytics
description: Understand server-level and database-level auditing policies for Azure Synapse Analytics.
author: sravanisaluru
ms.author: srsaluru
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Auditing policy in Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

You can define an auditing policy for an individual database or as the default policy for a [logical server](logical-servers.md).

## Define server-level and database-level auditing policies

Define an auditing policy for a specific database or as a default [server](logical-servers.md) policy in Azure:

- A server-level policy applies to all existing and newly created databases on the server.
- If you enable server-level auditing, it applies to a database regardless of that database's auditing setting.
- A database-level policy doesn't override the server-level policy. If both are enabled, the database is audited twice.


- Enabling auditing on the database in addition to enabling auditing on the server *doesn't* override or change any of the settings of the server auditing. Both audits exist side by side. In other words, the database is audited twice in parallel; once by the server policy and once by the database policy.

  > [!NOTE]  
  > Avoid enabling both server auditing and database blob auditing together, unless:
  >
  > - You want to use a different *storage account*, *retention period*, or *Log Analytics Workspace* for a specific database.
  > - You want to audit event types or categories for a specific database that differ from the rest of the databases on the server. For example, you might have table inserts that need to be audited only for a specific database.
  >
  > Otherwise, enable only server-level auditing and leave the database-level auditing disabled for all databases.

## Related content

- [Auditing in Azure Synapse Analytics](auditing-overview.md)
- [Set up auditing for Azure Synapse Analytics](auditing-setup.md)
- [Manage Azure Synapse Analytics auditing using APIs](auditing-manage-using-api.md)
