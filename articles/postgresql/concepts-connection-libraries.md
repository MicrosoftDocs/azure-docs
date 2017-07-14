---
title: 'Connection libraries for Azure Database for PostgreSQL | Microsoft Docs'
description: 'Lists each library or driver that client programs can use when connecting to Azure Database for PostgreSQL.'
keywords: azure cloud postgresql postgres
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.topic: article
ms.date: 06/14/2017
---
# Connection libraries for Azure Database for PostgreSQL
This topic lists each library or driver that client programs can use when connecting to Azure Database for PostgreSQL.

## Client interfaces
Most language client libraries to connect to PostgreSQL server are external projects, and are distributed independently. These are supported on Windows, Linux, and Mac platforms. Some of the popular client drivers are listed:
| **Language** | **Client interface** | **Additional information** | **Download** |
|--------------|----------------------------------------------------------------|-------------------------------------|--------------------------------------------------------------------|
| Python | [psycopg](http://initd.org/psycopg/) | DB API 2.0-compliant | [Download](http://initd.org/psycopg/download/) |
| PHP | [php-pgsql](https://php.net/manual/en/book.pgsql.php) | Database extension | [Install](https://secure.php.net/manual/en/pgsql.installation.php) |
| Node.js | [Pg npm package](https://www.npmjs.com/package/pg) | Pure JavaScript non-blocking client | [Install](https://www.npmjs.com/package/pg) |
| Java | [JDBC](http://jdbc.postgresql.org/) | Type 4 JDBC driver | [Download](https://jdbc.postgresql.org/download.html)  |
| Ruby | [Pg gem](https://deveiate.org/code/pg/) | Ruby Interface | [Download](https://rubygems.org/downloads/pg-0.20.0.gem) |
| Go | [Package pq](https://godoc.org/github.com/lib/pq) | Pure Go postgres driver | [Install](https://github.com/lib/pq/blob/master/README.md) |
| C\#/ .NET | [Npgsql](http://www.npgsql.org/) | ADO.NET Data Provider | [Download](https://www.microsoft.com/net/) |
| ODBC | [psqlODBC](https://odbc.postgresql.org/) | ODBC Driver | [Download](http://www.postgresql.org/ftp/odbc/versions/) |
| C | [libpq](https://www.postgresql.org/docs/9.6/static/libpq.html) | Primary C language interface | Included |
| C++ | [libpqxx](http://pqxx.org/) | New-style C++ interface | [Download](http://pqxx.org/download/software/) |

## Next steps
- For an overview of the service, see [Azure Database for PostgreSQL Overview](overview.md).
- For further details on servers, see [Azure Database for PostgreSQL servers](concepts-servers.md).
- To create your first PostgreSQL server, see [Create an Azure Database for PostgreSQL in the Azure portal](quickstart-create-server-database-portal.md).
