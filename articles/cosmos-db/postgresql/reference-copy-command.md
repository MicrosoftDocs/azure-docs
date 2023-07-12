---
title: COPY command on Azure Cosmos DB for PostgreSQL
description: Reference documentation on usage of COPY command
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 06/16/2023
---

# COPY command on Azure Cosmos DB for PostgreSQL

The [COPY](https://www.postgresql.org/docs/current/sql-copy.html) command is used to move data between files and database tables. `COPY` is a server-based command that requires access to the disk, usually limited to server administrators. However, Azure Cosmos DB for PostgreSQL operates as a Platform-as-a-Service (PaaS) solution, which means that users aren't granted superuser privileges. `COPY` command is thus not fully supported on the platform.

Alternatively, `\COPY` is a command available in `psql` and other client interfaces that facilitates direct interaction with the local file system of the machine where it is executed.

## Azure Blob Storage support

The `pg_azure_storage` extension overcomes disk access limitation by leveraging Azure Blob Storage as a data source. When enabled, the extension also enhances the built in `COPY` command with Azure Blob Storage support.

Load data into `github_users` table using the `COPY` command:

```postgresql
COPY github_users
FROM 'https://pgquickstart.blob.core.windows.net/github/users.csv.gz';
```
Currently the extension supports the following file formats:

|format|description|
|------|-----------|
|csv|Comma-separated values format used by PostgreSQL COPY|
|tsv|Tab-separated values, the default PostgreSQL COPY format|
|binary|Binary PostgreSQL COPY format|
|text|A file containing a single text value (for example, large JSON or XML)|

> [!Note]
> * Syntax and options supported remains likewise to Postgres Native [COPY](https://www.postgresql.org/docs/current/sql-copy.html) command, with following exceptions:
>
>   - `FREEZE [ boolean ]`
>   - `HEADER MATCH`
>
> * `COPY TO` syntax is yet not supported.
>
> * `\COPY` is a `psql` based command and doesn't support Azure Blob Storage integration.
>
> * `\COPY` does allow performing import\export on the cluster but requires moving\copying files across the network.

## Next steps

Learn more around usage of pg_azure_storage extension.

> [!div class="nextstepaction"]
> [Reference azure_storage functions](reference-pg-azure-storage.md)

> [!div class="nextstepaction"]
> [How to ingest data using pg_azure_storage](howto-ingest-azure-blob-storage.md)