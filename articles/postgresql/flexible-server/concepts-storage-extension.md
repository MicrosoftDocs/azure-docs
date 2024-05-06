---
title: Azure Storage extension in Azure Database for PostgreSQL - Flexible Server
description: Learn about the Azure Storage extension in Azure Database for PostgreSQL - Flexible Server.
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom:
  - ignite-2023
---

# Azure Storage extension in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

A common use case for Microsoft customers is the ability to import and export data between Azure Blob Storage and an Azure Database for PostgreSQL flexible server instance. The Azure Storage extension (`azure_storage`) in Azure Database for PostgreSQL flexible server simplifies this use case.

## Azure Blob Storage

Azure Blob Storage is an object storage solution for the cloud. Blob Storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that doesn't adhere to a particular data model or definition, such as text or binary data.

Blob Storage offers a hierarchy of three types of resources:

- The [storage account](../../storage/blobs/storage-blobs-introduction.md#storage-accounts) is an administrative entity that holds services for items like blobs, files, queues, tables, or disks.

  When you create a storage account in Azure, you get a unique namespace for your storage resources. That unique namespace forms part of the URL. The storage account name should be unique across all existing storage account names in Azure.

- A [container](../../storage/blobs/storage-blobs-introduction.md#containers) is inside a storage account. A container is like a folder where blobs are stored.

  You can define security policies and assign policies to the container. Those policies cascade to all the blobs in the container.

  A storage account can contain an unlimited number of containers. Each container can contain an unlimited number of blobs, up to the maximum storage account size of 500 TB.

  After you place a blob into a container that's inside a storage account, you can refer to the blob by using a URL in this format: `protocol://<storage_account_name>/blob.core.windows.net/<container_name>/<blob_name>`.

- A [blob](../../storage/blobs/storage-blobs-introduction.md#blobs) is a piece of data that resides in the container.

The following diagram shows the relationship between these resources.

:::image type="content" source="./media/concepts-extensions/blob-1.png" alt-text="Diagram that shows an example of storage resources.":::

## Key benefits of storing data as blobs in Azure Blob Storage

Azure Blob Storage can provide following benefits:

- It's a scalable and cost-effective cloud storage solution. You can use it to store data of any size and scale up or down based on your needs.
- It provides layers of security to help protect your data, such as encryption at rest and in transit.
- It communicates with other Azure services and partner applications. It's a versatile solution for a wide range of use cases, such as backup and disaster recovery, archiving, and data analysis.
- It's a cost-effective solution for managing and storing massive amounts of data in the cloud, whether the organization is a small business or a large enterprise. You pay only for the storage that you need.

## Import data from Azure Blob Storage to Azure Database for PostgreSQL flexible server

To load data from Azure Blob Storage, you need to [allowlist](../../postgresql/flexible-server/concepts-extensions.md#how-to-use-postgresql-extensions) the `azure_storage` PostgreSQL extension. You then install the extension in the database by using the `CREATE EXTENSION` command:

```sql
 CREATE EXTENSION azure_storage;
```

When you create a storage account, Azure generates two 512-bit storage *account access keys* for that account. You can use these keys to authorize access to data in your storage account via shared key authorization.

Before you can import the data, you need to map the storage account by using the `account_add` method. Provide the account access key that was defined when you created the account. The following code example maps the storage account `mystorageaccount` and uses the string `SECRET_ACCESS_KEY` as the access key parameter:

```sql
SELECT azure_storage.account_add('mystorageaccount', 'SECRET_ACCESS_KEY');
```

After you map the storage, you can list storage account contents and choose data for import. The following example assumes that you created a storage account named `mystorageaccount` and a blob container named `mytestblob`:

```sql
SELECT path, bytes, pg_size_pretty(bytes), content_type
FROM azure_storage.blob_list('mystorageaccount','mytestblob'); 
```

You can filter the output of  this statement by using either a regular `SQL WHERE` clause or the `prefix` parameter of the `blob_list` method. Listing container contents requires either an account and access key or a container with enabled anonymous access.

Finally, you can use either the `COPY` statement or the `blob_get` function to import data from Azure Blob Storage into an existing Azure Database for PostgreSQL flexible server table.

### Import data by using a COPY statement

The following example shows the import of data from an *employee.csv* file that resides in the blob container `mytestblob` in the same `mystorageaccount` Azure storage account via the `COPY` command:

1. Create a target table that matches the source file schema:

   ```sql
   CREATE TABLE employees (
     EmployeeId int PRIMARY KEY,
     LastName VARCHAR ( 50 ) UNIQUE NOT NULL,
     FirstName VARCHAR ( 50 ) NOT NULL
   );
   ```

2. Use a `COPY` statement to copy data into the target table. Specify that the first row is headers.

   ```sql
   COPY employees
   FROM 'https://mystorageaccount.blob.core.windows.net/mytestblob/employee.csv'
   WITH (FORMAT 'csv', header);
   ```

### Import data by using the blob_get function

The `blob_get` function retrieves a file from Blob Storage. To make sure that `blob_get` can parse the data, you can either pass a value with a type that corresponds to the columns in the file or explicitly define the columns in the `FROM` clause.

You can use the `blob_get` function in following format:

```sql
azure_storage.blob_get(account_name, container_name, path)
```

The next example shows the same action from the same source to the same target by using the `blob_get` function:

```sql
INSERT INTO employees 
SELECT * FROM azure_storage.blob_get('mystorageaccount','mytestblob','employee.csv',options:= azure_storage.options_csv_get(header=>true)) AS res (
  CustomerId int,
  LastName varchar(50),
  FirstName varchar(50))
```

The `COPY` command and `blob_get` function  support the following file extensions for import:

| File format | Description |
| --- | --- |
| .csv | Comma-separated values format used by PostgreSQL `COPY` |
| .tsv | Tab-separated values, the default PostgreSQL `COPY` format |
| binary | Binary PostgreSQL `COPY` format |
| text | File that contains a single text value (for example, large JSON or XML) |

## Export data from Azure Database for PostgreSQL flexible server to Azure Blob Storage

To export data from Azure Database for PostgreSQL flexible server to Azure Blob Storage, you need to [allowlist](../../postgresql/flexible-server/concepts-extensions.md#how-to-use-postgresql-extensions) the `azure_storage` extension. You then install the `azure_storage` PostgreSQL extension in  the database by using the `CREATE EXTENSION` command:

```sql
CREATE EXTENSION azure_storage;
```

When you create a storage account, Azure generates two 512-bit storage account access keys for that account. You can use these keys to authorize access to data in your storage account via shared key authorization, or via shared access signature (SAS) tokens that are signed with the shared key.

Before you can import the data, you need to map the storage account by using the `account_add` method. Provide the account access key that was defined when you created the account. The following code example maps the storage account `mystorageaccount` and uses the string `SECRET_ACCESS_KEY` as the access key parameter:

```sql
SELECT azure_storage.account_add('mystorageaccount', 'SECRET_ACCESS_KEY');
```

You can use either the `COPY` statement or the `blob_put` function to export data from an Azure Database for PostgreSQL table to Azure Blob Storage. The following example shows the export of data from an employee table to a new file named *employee2.csv* via the `COPY` command. The file resides in the blob container `mytestblob` in the same `mystorageaccount` Azure storage account.

```sql
COPY employees 
TO 'https://mystorageaccount.blob.core.windows.net/mytestblob/employee2.csv'
WITH (FORMAT 'csv');
```

Similarly, you can export data from an employee table via the `blob_put` function, which gives you even more finite control over the exported data. The following example exports only two columns of the table, `EmployeeId` and `LastName`. It skips the `FirstName` column.

```sql
SELECT azure_storage.blob_put('mystorageaccount', 'mytestblob', 'employee2.csv', res) FROM (SELECT EmployeeId,LastName FROM employees) res;
```

The `COPY` command and the `blob_put` function support the following file extensions for export:

| File format | Description |
| --- | --- |
| .csv | Comma-separated values format used by PostgreSQL `COPY` |
| .tsv | Tab-separated values, the default PostgreSQL `COPY` format |
| binary | Binary PostgreSQL `COPY` format |
| text | A file that contains a single text value (for example, large JSON or XML) |

## List objects in Azure Storage

To list objects in Azure Blob Storage, you need to [allowlist](../../postgresql/flexible-server/concepts-extensions.md#how-to-use-postgresql-extensions) the `azure_storage` extension. You then install the `azure_storage` PostgreSQL extension in the database by using the `CREATE EXTENSION` command:

```sql
CREATE EXTENSION azure_storage;
```

When you create a storage account, Azure generates two 512-bit storage   account access keys for that account. You can use these keys to authorize access to data in your storage account via shared key authorization, or via SAS tokens that are signed with the shared key.

Before you can import the data, you need to map the storage account by using the `account_add` method. Provide the account access key that was defined when you created the account. The following code example maps the storage account `mystorageaccount` and uses the string `SECRET_ACCESS_KEY` as the access key parameter:

```sql
SELECT azure_storage.account_add('mystorageaccount', 'SECRET_ACCESS_KEY');
```

The Azure Storage extension provides a `blob_list` method. You can use this method to list objects in Blob Storage in the following format:

```sql
azure_storage.blob_list(account_name, container_name, prefix)
```

The following example shows listing objects in Azure Storage by using the `blob_list` method from a storage account named `mystorageaccount` and a blob container called `mytestbob`. Files in the container have the string `employee`.

```sql
SELECT path, size, last_modified, etag FROM azure_storage.blob_list('mystorageaccount','mytestblob','employee');
```

## Assign permissions to a nonadministrative account to access data from Azure Storage

By default, only the [azure_pg_admin](./concepts-security.md#access-management) administrative role can add an account key and access the storage account in Azure Database for PostgreSQL flexible server.

You can grant the permissions to access data in Azure Storage to nonadministrative Azure Database for PostgreSQL flexible server users in two ways, depending on permission granularity:

- Assign `azure_storage_admin` to the nonadministrative user. This role is added with the installation of the Azure Storage extension. The following example grants this role to a nonadministrative user called `support`:

  ```sql
  -- Allow adding/list/removing storage accounts
  GRANT azure_storage_admin TO support;
  ```

- Call the `account_user_add` function. The following example adds permissions to the role `support` in Azure Database for PostgreSQL flexible server. It's a more finite permission, because it gives user access to only an Azure storage account named `mystorageaccount`.

  ```sql
  SELECT * FROM azure_storage.account_user_add('mystorageaccount', 'support');
  ```

Administrative users of Azure Database for PostgreSQL flexible server can get a list of storage accounts and  permissions in the output of the `account_list` function. This function shows all accounts with access keys defined.

```sql
SELECT * FROM azure_storage.account_list();
```

When the Azure Database for PostgreSQL flexible server administrator decides that the user should no longer have access, the administrator can use the `account_user_remove` method or function to remove this access. The following example removes the role `support` from access to the storage account `mystorageaccount`:

```sql
SELECT * FROM azure_storage.account_user_remove('mystorageaccount', 'support');
```

## Next steps

- If you don't see an extension that you want to use, let us know. Vote for existing requests or create new feedback requests in our [feedback forum](https://aka.ms/pgfeedback).
