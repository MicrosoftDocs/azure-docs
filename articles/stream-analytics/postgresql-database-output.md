---
title: Azure Database for PostgreSQL output from Azure Stream Analytics
description: This article describes Azure Database for PostgreSQL as output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 10/27/2022
---

# Azure Database for PostgreSQL output from Azure Stream Analytics

You can use [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/) as an output for data that is relational in nature or for applications that depend on the content being hosted in a relational database. Azure Stream Analytics jobs write to an existing table in PostgreSQL Database. The table schema must exactly match the fields and their types in your job's output. 

Azure Database for PostgreSQL powered by the PostgreSQL community edition is available in three deployment options:
*    Single Server
*    Flexible Server
*    Hyperscale (Citus)

For more information about Azure Database for PostgreSQL please visit the: [What is Azure Database for PostgreSQL documentation.](../postgresql/overview.md)

To learn more about how to create an Azure Database for PostgreSQL server by using the Azure portal please visit: 
*    [Quick start for Azure Database for PostgreSQL – Single server](../postgresql/quickstart-create-server-database-portal.md)
*    [Quick start for Azure Database for PostgreSQL – Flexible server](../postgresql/flexible-server/quickstart-create-server-portal.md)
*    [Quick start for Azure Database for PostgreSQL – Hyperscale (Citus)](../postgresql/hyperscale/quickstart-create-portal.md)


> [!NOTE] 
> Managed identities for Azure Database for PostgreSQL output in Azure Stream Analytics is currently not supported.

## Output configuration

The following table lists the property names and their description for creating an Azure Database for PostgreSQL output.

| Property name | Description |
| --- | --- |
| Output alias |A friendly name used in queries to direct the query output to this database. |
|  Subscription |  select the desired Azure Subscription. |
| Server or server group name | A unique name that identifies your Azure Database for PostgreSQL server. The domain name postgres.database.azure.com is appended to the name of the  server you provide. The server can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain at least 3 through 63 characters. |
| Database | The name of the database where you are sending your output |
| Username | The username that has write access to the database. Stream Analytics supports only username/password authentication. The username should be in the "username@hostname" format for Single Server, "username" for Flexible servers and Hyperscale (Citus) server groups. |
| Password | The password to connect to the database. |
| Table | The table name where the output is written. The table name is case-sensitive. The schema of this table should exactly match the number of fields and their types that your job output generates. |


## Partitioning

Partitioning needs to enabled and is based on the PARTITION BY clause in the query. When the Inherit Partitioning option is enabled, it follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md). 


## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
