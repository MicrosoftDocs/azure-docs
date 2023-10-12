---
title:  Azure Data Extension in Azure Database for PostgreSQL - Flexible Server -Preview
description: Azure Data Extension in Azure Database for PostgreSQL - Flexible Server -Preview
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: gennadyk
author: gennadNY
ms.date: 10/02/2022
---
# Azure Database for PostgreSQL Flexible Server Azure Data Extension - Preview

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

A common use case for our customers today is need to be able to import\export between Azure Blob Storage and Microsoft Database for PostgreSQL – Flexible Server DB instance. To simplify this use case, we introduced new **Azure Data Extension** in Azure Database for PostgreSQL - Flexible Server, currently available in **Preview**

## Azure Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud. Blob Storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that doesn't adhere to a particular data model or definition, such as text or binary data.

Blob Storage offers hierarchy of three types of resources. These types include:
* The [**storage account**](../../storage/blobs/storage-blobs-introduction.md#storage-accounts). The storage account is like an administrative container, and within that container, we can have several services like *blobs*, *files*, *queues*, *tables*,* disks*, etc. And when we create a storage account in Azure, we'll get the unique namespace for our storage resources. That unique namespace forms the part of the URL. The storage account name should be unique across all existing storage account name in Azure.
* A [**container**](../../storage/blobs/storage-blobs-introduction.md#containers) inside storage account. The container is more like a folder where different blobs are stored. At the container level, we can define security policies and assign  policies to the container, which is cascaded to all the blobs under the same container.A storage account can contain an unlimited number of containers, and each container can contain an unlimited number of blobs up to the maximum limit of storage account size of 500 TB.
To refer this blob, once it's placed into a container inside a storage account, URL can be used, in format  like *protocol://<storage_account_name>/blob.core.windows.net/<container_name>/<blob_name>*
* A [**blob**](../../storage/blobs/storage-blobs-introduction.md#blobs) in the container.
The following diagram shows the relationship between these resources.

 :::image type="content" source="./media/concepts-extensions/blob1.png" alt-text="Diagram that shows relationships between storage resources.":::

## Key benefits of storing data as blobs in Azure Storage

Azure Blob Storage can provide following benefits:
* Azure Blob Storage is a scalable and cost-effective cloud storage solution that allows you to store data of any size and scale up or down based on your needs.
* It also provides numerous layers of security to protect your data, such as encryption at rest and in transit.
* Azure Blob Storage interfaces with other Azure services and third-party applications, making it a versatile solution for a wide range of use cases such as backup and disaster recovery, archiving, and data analysis.
* Azure Blob Storage allows you to pay only for the storage you need, making it a cost-effective solution for managing and storing massive amounts of data. Whether you’re a small business or a large enterprise, Azure Blob Storage offers a versatile and scalable solution for your cloud storage needs.

## Importing data from Azure Blob Storage to Azure Database for PostgreSQL - Flexible Server

To load data from Azure Blob Storage, you'll need [allowlist](../../postgresql/flexible-server/concepts-extensions.md#how-to-use-postgresql-extensions) **pg_azure_storage** extension and install the **pg_azure_storage** PostgreSQL extension in this database using create extension command:

```sql
SELECT * FROM create_extension('azure_storage');
```


When you create a storage account, Azure generates two 512-bit storage **account access keys** for that account. These keys can be used to authorize access to data in your storage account via Shared Key authorization, or via SAS tokens that are signed with the shared key.Therefore, before you can import the data, you need to map his storage account using account_add method, providing **account access key** defined when account was created. Code snippet below shows mapping storage account 'mystorageaccount' where access key parameter is shown as string 'SECRET_ACCESS_KEY'.

```sql
SELECT azure_storage.account_add('mystorageaccount', 'SECRET_ACCESS_KEY');
```

Once storage is mapped,  storage account contents can be listed and data can be picked for import:

```sql
SELECT path, bytes, pg_size_pretty(bytes), content_type
  FROM azure_storage.blob_list('pgquickstart','github');

```
 Output of above statement can be further filtered either by using a regular *SQL WHERE* clause, or by using the prefix parameter of the blob_list method. This filters the returned rows on the Azure Blob Storage side. Listing container contents requires an account and access key or a container with enabled anonymous access.

Finally you can use either **COPY** statement or **blob_get** UDF to import data from Azure Storage into PostgreSQL table, like shown in below example with *COPY* statement:

```sql
COPY github_users
FROM 'https://pgquickstart.blob.core.windows.net/github/users.csv.gz'
WITH (FORMAT 'csv');
```

Or with *blob_get* UDF

```sql
INSERT INTO github_users
     SELECT user_id, url, UPPER(login), avatar_url, gravatar_id, display_login
       FROM azure_storage.blob_get('pgquickstart', 'github', 'users.csv.gz', NULL::github_users,
                                    options := azure_storage.options_csv_get(force_not_null := ARRAY['gravatar_id']));
```

The **COPY** command and **blob_get** method support following file extensions for import:

| **File Format**  | **Description**| 
|--------------|-----------|
| .csv         | Comma-separated values format used by PostgreSQL COPY|      
|.tsv          | Tab-separated values, the default PostgreSQL COPY format|
| binary       | Binary PostgreSQL COPY format|
| text         | A file containing a single text value (for example, large JSON or XML)|


## Export data from Azure Database for PostgreSQL - Flexible Server to Azure Blob Storage 

To export data from PostgreSQL Flexible Server to Azure Blob Storage you need to [allowlist](../../postgresql/flexible-server/concepts-extensions.md#how-to-use-postgresql-extensions) **pg_azure_storage** extension and install the **pg_azure_storage** PostgreSQL extension in  database using create extension command:
```sql
SELECT * FROM create_extension('azure_storage');
```

When you create a storage account, Azure generates two 512-bit storage **account access keys** for that account. These keys can be used to authorize access to data in your storage account via Shared Key authorization, or via SAS tokens that are signed with the shared key.Therefore, before you can import the data, you need to map  storage account using account_add method, providing **account access key** defined when account was created. Code snippet below shows mapping storage account 'mystorageaccount' where access key parameter is shown as string 'SECRET_ACCESS_KEY'.

```sql
SELECT azure_storage.account_add('mystorageaccount', 'SECRET_ACCESS_KEY');
```

You can use either **COPY** statement or **blob_put** UDF to export data from Azure Storage into PostgreSQL table, like:
```sql
COPY (SELECT * FROM github_users)
TO ‘https://pgquickstart.blob.core.windows.net/github/users.csv.gz'
WITH (FORMAT 'csv');
```
The **COPY** command and **blob_get** method  support following file extensions for export:

| **File Format**  | **Description**| 
|--------------|-----------|
| .csv         | Comma-separated values format used by PostgreSQL COPY|      
|.tsv          | Tab-separated values, the default PostgreSQL COPY format|
| binary       | Binary PostgreSQL COPY format|
| text         | A file containing a single text value (for example, large JSON or XML)|

## Assigning permissions to nonadministrative account to access data from Azure Storage

Granting the permissions to access data in Azure Storage to nonadministrative PostgreSQL Flex user is as simple as calling **account_user_add** function. Example below is adding permissions to role *support* in Flex server:
```sql
SELECT * FROM azure_storage.account_user_add('mystorageaccount', 'support');
```

Postgres admin users can see the allowed users in the output of account_list function, which shows all accounts with access keys defined:
```sql
SELECT * FROM azure_storage.account_list();
```
When Postgres administrator decides that the user should no longer have access, he'll can use method\function account_user_remove to remove this role. 
```sql
SELECT * FROM azure_storage.account_user_remove('mystorageaccount', 'support');
```


## Next steps

If you don't see an extension that you'd like to use, let us know. Vote for existing requests or create new feedback requests in our [feedback forum](https://feedback.azure.com/d365community/forum/c5e32b97-ee24-ec11-b6e6-000d3a4f0da0).
