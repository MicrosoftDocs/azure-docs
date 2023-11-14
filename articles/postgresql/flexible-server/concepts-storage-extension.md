---
title: Azure Storage Extension in Azure Database for PostgreSQL - Flexible Server -Preview
description: Azure Storage Extension in Azure Database for PostgreSQL - Flexible Server -Preview
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 10/12/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: conceptual
---

# Azure Database for PostgreSQL Flexible Server Azure Storage Extension - Preview

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

A common use case for our customers today is need to be able to import\export between Azure Blob Storage and Microsoft Database for PostgreSQL – Flexible Server DB instance. To simplify this use case, we introduced new **Azure Storage Extension** (azure_storage) in Azure Database for PostgreSQL - Flexible Server, currently available in **Preview**.

> [!NOTE]
> Azure Database for PostgreSQL - Flexible Server supports Azure Storage Extension in Preview

## Azure Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud. Blob Storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that doesn't adhere to a particular data model or definition, such as text or binary data.

Blob Storage offers hierarchy of three types of resources. These types include:
- The [**storage account**](../../storage/blobs/storage-blobs-introduction.md#storage-accounts). The storage account is like an administrative container, and within that container, we can have several services like *blobs*, *files*, *queues*, *tables*,* disks*, etc. And when we create a storage account in Azure, we get the unique namespace for our storage resources. That unique namespace forms the part of the URL. The storage account name should be unique across all existing storage account name in Azure.
- A [**container**](../../storage/blobs/storage-blobs-introduction.md#containers) inside storage account. The container is more like a folder where different blobs are stored. At the container level, we can define security policies and assign  policies to the container, which is cascaded to all the blobs under the same container.A storage account can contain an unlimited number of containers, and each container can contain an unlimited number of blobs up to the maximum limit of storage account size of 500 TB.
To refer this blob, once it's placed into a container inside a storage account, URL can be used, in format  like *protocol://<storage_account_name>/blob.core.windows.net/<container_name>/<blob_name>*
- A [**blob**](../../storage/blobs/storage-blobs-introduction.md#blobs) in the container.
The following diagram shows the relationship between these resources.

:::image type="content" source="./media/concepts-extensions/blob-1.png" alt-text="Diagram that shows relationships between storage resources.":::

## Key benefits of storing data as blobs in Azure Storage

Azure Blob Storage can provide following benefits:
- Azure Blob Storage is a scalable and cost-effective cloud storage solution that allows you to store data of any size and scale up or down based on your needs.
- It also provides numerous layers of security to protect your data, such as encryption at rest and in transit.
- Azure Blob Storage interfaces with other Azure services and third-party applications, making it a versatile solution for a wide range of use cases such as backup and disaster recovery, archiving, and data analysis.
- Azure Blob Storage allows you to pay only for the storage you need, making it a cost-effective solution for managing and storing massive amounts of data. Whether you're a small business or a large enterprise, Azure Blob Storage offers a versatile and scalable solution for your cloud storage needs.

## Import data from Azure Blob Storage to Azure Database for PostgreSQL - Flexible Server

To load data from Azure Blob Storage, you need [allowlist](../../postgresql/flexible-server/concepts-extensions.md#how-to-use-postgresql-extensions) **azure_storage** extension and install the **azure_storage** PostgreSQL extension in this database using create extension command:

```sql
SELECT * FROM create_extension('azure_storage');
```

When you create a storage account, Azure generates two 512-bit storage **account access keys** for that account. These keys can be used to authorize access to data in your storage account via Shared Key authorization, or via SAS tokens that are signed with the shared key.Therefore, before you can import the data, you need to map  storage account using **account_add** method, providing **account access key** defined when account was created. Code snippet shows mapping storage account *'mystorageaccount'* where access key parameter is shown as string *'SECRET_ACCESS_KEY'*.

```sql
SELECT azure_storage.account_add('mystorageaccount', 'SECRET_ACCESS_KEY');
```

Once storage is mapped,  storage account contents can be listed and data can be picked for import. Following example assumes you created storage account named mystorageaccount with blob container named mytestblob

```sql
SELECT path, bytes, pg_size_pretty(bytes), content_type
FROM azure_storage.blob_list('mystorageaccount','mytestblob'); 
```
Output of  this statement can be further filtered either by using a regular *SQL WHERE* clause, or by using the prefix parameter of the blob_list method.  Listing container contents requires an account and access key or a container with enabled anonymous access.


Finally you can use either **COPY** statement or **blob_get** function to import data from Azure Storage into existing PostgreSQL table. 
### Import data using COPY statement 
Example below shows import of data from employee.csv file residing in blob container mytestblob in same mystorageaccount Azure storage account via **COPY** command:
1. First create target table matching source file schema:
```sql
CREATE TABLE employees (
	EmployeeId int PRIMARY KEY,
	LastName VARCHAR ( 50 ) UNIQUE NOT NULL,
	FirstName VARCHAR ( 50 ) NOT NULL
);
```
2.  Next use **COPY** statement to copy data into target table, specifying that first row is headers

```sql
COPY employees
FROM 'https://mystorageaccount.blob.core.windows.net/mytestblob/employee.csv'
WITH (FORMAT 'csv', header);
```

### Import data using blob_get function

The **blob_get** function retrieves a file from blob storage. In order for **blob_get** to know how to parse the data you can either pass a value with a type that corresponds to the columns in the file, or explicit define the columns in the FROM clause.
You can use **blob_get** function in following format:
```sql
azure_storage.blob_get(account_name, container_name, path)
```
Next example shows same action from same source to same target using  **blob_get**  function.

```sql
INSERT INTO employees 
SELECT * FROM azure_storage.blob_get('mystorageaccount','mytestblob','employee.csv',options:= azure_storage.options_csv_get(header=>true)) AS res (
  CustomerId int,
  LastName varchar(50),
  FirstName varchar(50))
```

The **COPY** command and **blob_get** function  support following file extensions for import:

| **File Format** | **Description** |
| --- | --- |
| .csv | Comma-separated values format used by PostgreSQL COPY |
| .tsv | Tab-separated values, the default PostgreSQL COPY format |
| binary | Binary PostgreSQL COPY format |
| text | A file containing a single text value (for example, large JSON or XML) |

## Export data from Azure Database for PostgreSQL - Flexible Server to Azure Blob Storage

To export data from PostgreSQL Flexible Server to Azure Blob Storage, you need to [allowlist](../../postgresql/flexible-server/concepts-extensions.md#how-to-use-postgresql-extensions) **azure_storage** extension and install the **azure_storage** PostgreSQL extension in  database using create extension command:

```sql
SELECT * FROM create_extension('azure_storage');
```

When you create a storage account, Azure generates two 512-bit storage **account access keys** for that account. These keys can be used to authorize access to data in your storage account via Shared Key authorization, or via SAS tokens that are signed with the shared key.Therefore, before you can import the data, you need to map  storage account using account_add method, providing **account access key** defined when account was created. Code snippet  shows mapping storage account *'mystorageaccount'* where access key parameter is shown as string *'SECRET_ACCESS_KEY'*

```sql
SELECT azure_storage.account_add('mystorageaccount', 'SECRET_ACCESS_KEY');
```

You can use either **COPY** statement or **blob_put** function to export data from Azure Database for PostgreSQL table to Azure storage.
Example  shows export of data from employee table to new file named employee2.csv residing in blob container mytestblob in same mystorageaccount Azure storage account via **COPY** command:

```sql
COPY employees 
TO 'https://mystorageaccount.blob.core.windows.net/mytestblob/employee2.csv'
WITH (FORMAT 'csv');
```
Similarly you can export data from employees table via **blob_put** function, which gives us even more finite control over data being exported. Example  therefore only exports two columns of the table, *EmployeeId* and *LastName*, skipping *FirstName* column:
```sql
SELECT azure_storage.blob_put('mystorageaccount', 'mytestblob', 'employee2.csv', res) FROM (SELECT EmployeeId,LastName FROM employees) res;
```

The **COPY** command and **blob_put** function  support following file extensions for export:


| **File Format** | **Description** |
| --- | --- |
| .csv | Comma-separated values format used by PostgreSQL COPY |
| .tsv | Tab-separated values, the default PostgreSQL COPY format |
| binary | Binary PostgreSQL COPY format |
| text | A file containing a single text value (for example, large JSON or XML) |

## Listing objects in Azure Storage

To list objects in  Azure Blob Storage, you need to [allowlist](../../postgresql/flexible-server/concepts-extensions.md#how-to-use-postgresql-extensions) **azure_storage** extension and install the **azure_storage** PostgreSQL extension in  database using create extension command:

```sql
SELECT * FROM create_extension('azure_storage');
```

When you create a storage account, Azure generates two 512-bit storage **account access keys** for that account. These keys can be used to authorize access to data in your storage account via Shared Key authorization, or via SAS tokens that are signed with the shared key.Therefore, before you can import the data, you need to map  storage account using account_add method, providing **account access key** defined when account was created. Code snippet  shows mapping storage account *'mystorageaccount'* where access key parameter is shown as string *'SECRET_ACCESS_KEY'*

```sql
SELECT azure_storage.account_add('mystorageaccount', 'SECRET_ACCESS_KEY');
```
Azure storage extension provides a method **blob_list** allowing you to list objects in your Blob storage in format:
```sql
azure_storage.blob_list(account_name, container_name, prefix)
```
Example shows listing objects in Azure storage using **blob_list** method from storage account named *'mystorageaccount'* , blob container called *'mytestbob'* with files containing string  *'employee'* 

```sql
SELECT path, size, last_modified, etag FROM azure_storage.blob_list('mystorageaccount','mytestblob','employee');
```

## Assign permissions to nonadministrative account to access data from Azure Storage

By default, only [azure_pg_admin](./concepts-security.md#access-management) administrative role can add an account key and access the storage account in Postgres Flexible Server.
Granting the permissions to access data in Azure Storage to nonadministrative PostgreSQL Flexible server user can be done in two ways depending on permission granularity:
- Assign **azure_storage_admin** to the nonadministrative user. This role is added with installation of Azure Data Storage Extension. Example below grants this role to nonadministrative user called *support*
```sql
-- Allow adding/list/removing storage accounts
GRANT azure_storage_admin TO support;
```
- Or by calling **account_user_add** function. Example  is adding permissions to role *support* in Flex server. It's a more finite permission as it gives user access to Azure storage account named *mystorageaccount* only.

```sql
SELECT * FROM azure_storage.account_user_add('mystorageaccount', 'support');
```

Postgres administrative users can see the list of storage accounts and   permissions  in the output of **account_list** function, which shows all accounts with access keys defined:

```sql
SELECT * FROM azure_storage.account_list();
```
When Postgres administrator decides that the user should no longer have access,  method\function **account_user_remove** can be used to remove this access. Following example removes role *support* from access to storage account *mystorageaccount*. 


```sql
SELECT * FROM azure_storage.account_user_remove('mystorageaccount', 'support');
```

## Next steps

- If you don't see an extension that you'd like to use, let us know. Vote for existing requests or create new feedback requests in our [feedback forum](https://feedback.azure.com/d365community/forum/c5e32b97-ee24-ec11-b6e6-000d3a4f0da0).
