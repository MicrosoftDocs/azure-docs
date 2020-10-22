---
title: Handle long-running stored procedures for the SQL connector
description: When a stored procedure duration exceeds the connector's timeout limit, s Work around the timeout limit on stored procedures exceed the timeout limit To work around the timeout limit for stored procedures that exceed the timeout limit when you use the SQL connector in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: camerost, logicappspm
ms.topic: conceptual
ms.date: 10/26/2020
---

# Handle the stored procedure timeout limit when using the SQL connector in Azure Logic Apps

When you work with result sets so large that the SQL connector doesn't return all the results at the same time, or you want better control over the size and structure for your result sets, you can create a [*stored procedure*](/sql/relational-databases/stored-procedures/stored-procedures-database-engine) that organizes the results the way that you want. The SQL connector provides many backend features that you can access by using Azure Logic Apps so that you can more easily automate business tasks that work with SQL database tables.

For example, when getting or inserting multiple rows, your logic app can iterate through these rows by using an [*until loop*](../logic-apps/logic-apps-control-flow-loops.md#until-loop) within these [limits](../logic-apps/logic-apps-limits-and-config.md). However, when your logic app has to work with record sets so large, for example, thousands or millions of rows, that you want to minimize the costs resulting from calls to the database. For more information, see [Handle bulk data using the SQL connector](../connectors/connectors-create-api-sqlazure).

However, with this connector, a stored procedure execution is limited to a [less than 2-minute timeout limit](/connectors/sql/#known-issues-and-limitations). Some stored procedures might take longer than this limit to process and completely finish, which generates a `504 TIMEOUT` error. Actually, some long-running processes are coded as stored procedures explicitly for this purpose. Calling these procedures from Azure Logic Apps might create problems due to this timeout limit. Although the SQL connector doesn't natively support an asynchronous mode, you can simulate this mode by using a SQL completion trigger, native SQL pass-through query, a state table, and server-side jobs by using the [Azure Elastic Job Agent](../azure-sql/database/elastic-jobs-overview.md).




