---
title: COPY command
description: Reference documentation on usage of COPY command
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 06/16/2023
---

# COPY command on Azure Cosmos DB for PostgreSQL

The [COPY](https://www.postgresql.org/docs/current/sql-copy.html) command in Postgres is designed for transferring data between file-system files and database tables. It's worth noting that `COPY` is a server-based command that necessitates access to the disk, usually limited to server administrators. However, Azure Cosmos DB for PostgreSQL operates as a Platform-as-a-Service (PaaS) solution, which means that users aren't granted superuser privileges. `COPY` command is thus not supported on the platform.

Alternatively, `\COPY` is a command available in psql and other client interfaces that facilitates direct interaction with the local file system of the machine where it is executed.

# pg_azure_storage extension

The `azure_storage` extension overcomes the disk access limitation by integrating `Azure Blob Storage` to store data files, which can then be directly imported into the database tables. When enabled the extension enhances the built in `COPY` command to directly interface to Azure Blob Storage.
Loading data into the tables could be done by calling the `COPY` command.

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
> * `\COPY` is a psql based command and doesn't support azure_blob_storage integration.
>
> * `\COPY` does allow performing import\export on the cluster but requires moving\copying files across.

## Next steps

Learn more on how `COPY` command functionality is extended using azure_storage extention.

> [!div class="nextstepaction"]
> [Reference azure_storage functions](reference-pg-azure-storage.md).

> [!div class="nextstepaction"]
> [How to ingest data using pg_azure_storage](howto-ingest-azure-blob-storage.md)