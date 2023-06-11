---
title: Azure Database for PostgreSQL output from Azure Stream Analytics
description: This article describes using Azure Database for PostgreSQL as output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/12/2023
---

# Azure Database for PostgreSQL output from Azure Stream Analytics

You can use [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) as an output for data that's relational in nature or for applications that require content to be hosted in a relational database. Azure Stream Analytics jobs write to an existing table in a PostgreSQL database. Azure Database for PostgreSQL output from Azure Stream Analytics is available for the Flexible Server deployment mode.

For more information about Azure Database for PostgreSQL, see [What is Azure Database for PostgreSQL?](../postgresql/overview.md).

To learn more about how to create an Azure Database for PostgreSQL server by using the Azure portal, see the [quickstart for creating an Azure Database for PostgreSQL - Flexible Server instance](../postgresql/flexible-server/quickstart-create-server-portal.md).

> [!NOTE]
> The Single Server deployment mode is being deprecated.
> To write to Hyperscale (Citus) when you're using Azure Database for PostgreSQL, use Azure Cosmos DB for PostgreSQL.

## Output configuration

The following table lists the property names and their descriptions for creating an Azure Database for PostgreSQL output.

| Property name | Description |
| --- | --- |
| Output alias |A friendly name that's used in queries to direct the query output to this database. |
|  Subscription |  The Azure subscription that you want to use for the output. |
| Server or server group name | A unique name that identifies your Azure Database for PostgreSQL server. The domain name postgres.database.azure.com is appended to the name of the server that you provide. The server can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain 3 to 63 characters. |
| Database | The name of the database where you're sending the output. |
| Username | The username that has write access to the database. Stream Analytics supports only username/password authentication. The username should be in the "username@hostname" format for Single Server and the "username" format for Flexible Server. |
| Password | The password to connect to the database. |
| Table | The table name where the output is written. The table name is case-sensitive. The schema of this table should exactly match the number of fields and their types that your job output generates. |

## Partitioning

Partitioning needs to be enabled and is based on the `PARTITION BY` clause in the query. When the Inherit Partitioning option is enabled, it follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md).

## Limitations

* The table schema must exactly match the fields and their types in your job's output.
* Managed identities for Azure Database for PostgreSQL output in Azure Stream Analytics are currently not supported.

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
