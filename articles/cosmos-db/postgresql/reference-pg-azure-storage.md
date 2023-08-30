---
title: pg_azure_storage extension
description: Reference documentation for using Azure Blob Storage extension
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 06/16/2023
---

# pg_azure_storage extension

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

The pg_azure_storage extension allows you to load data in multiple file formats directly from Azure blob storage to your Azure Cosmos DB for PostgreSQL cluster. Enabling the extension also unlocks new capabilities of the [COPY](reference-copy-command.md) command. Containers with access level “Private” or “Blob” requires adding private access key.

You can create the extension by running:

```postgresql
SELECT create_extension('azure_storage');
```

## azure_storage.account_add
Function allows adding access to a storage account.

```postgresql
azure_storage.account_add
        (account_name_p text
        ,account_key_p text);
```
### Arguments
#### account_name_p
An Azure blob storage (ABS) account contains all of your ABS objects: blobs, files, queues, and tables. The storage account provides a unique namespace for your ABS that is accessible from anywhere in the world over HTTPS.

#### account_key_p
Your Azure blob storage (ABS) access keys are similar to a root password for your storage account. Always be careful to protect your access keys. Use Azure Key Vault to manage and rotate your keys securely. The account key is stored in a table that is accessible by the postgres superuser, azure_storage_admin and all roles granted those admin permissions. To see which storage accounts exist, use the function account_list.

## azure_storage.account_remove
Function allows revoking account access to storage account.

```sql
azure_storage.account_remove
        (account_name_p text);
```

### Arguments
#### account_name_p
Azure blob storage (ABS) account contains all of your ABS objects: blobs, files, queues, and tables. The storage account provides a unique namespace for your ABS that is accessible from anywhere in the world over HTTPS.

## azure_storage.account_user_add
The function allows adding access for a role to a storage account.

```postgresql
azure_storage.account_add
        ( account_name_p text
        , user_p regrole);
```

### Arguments
#### account_name_p
An Azure blob storage (ABS) account contains all of your ABS objects: blobs, files, queues, and tables. The storage account provides a unique namespace for your ABS that is accessible from anywhere in the world over HTTPS.

#### user_p
Role created by user visible on the cluster.

> [!Note]
> `account_user_add`,`account_add`,`account_remove`,`account_user_remove` functions require setting permissions for each individual nodes in cluster.

## azure_storage.account_user_remove
The function allows removing access for a role to a storage account.

```postgresql
azure_storage.account_remove
        (account_name_p text
        ,user_p regrole);
```

### Arguments
#### account_name_p
An Azure blob storage (ABS) account contains all of your ABS objects: blobs, files, queues, and tables. The storage account provides a unique namespace for your ABS that is accessible from anywhere in the world over HTTPS.

#### user_p
Role created by user visible on the cluster.

## azure_storage.account_list
The function lists the account & role having access to Azure blob storage.

```postgresql
azure_storage.account_list
        (OUT account_name text
        ,OUT allowed_users regrole[]
        )
Returns TABLE;
```

### Arguments
#### account_name
Azure blob storage (ABS) account contains all of your ABS objects: blobs, files, queues, and tables. The storage account provides a unique namespace for your ABS that is accessible from anywhere in the world over HTTPS.

#### allowed_users
Lists the users having access to the Azure blob storage.

### Return type
TABLE

## azure_storage.blob_list
The function lists the available blob files within a user container with their properties.

```postgresql
azure_storage.blob_list
        (account_name text
        ,container_name text
        ,prefix text DEFAULT ''::text
        ,OUT path text
        ,OUT bytes bigint
        ,OUT last_modified timestamp with time zone
        ,OUT etag text
        ,OUT content_type text
        ,OUT content_encoding text
        ,OUT content_hash text
        )
Returns SETOF record;
```

### Arguments
#### account_name
The `storage account name` provides a unique namespace for your Azure storage data that's accessible from anywhere in the world over HTTPS.

#### container_name
A container organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs.
A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

* Container names can be between 3 and 63 characters long.
* Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
* Two or more consecutive dash characters aren't permitted in container names.

The URI for a container is similar to:
`https://myaccount.blob.core.windows.net/mycontainer`

#### prefix
Returns file from blob container with matching string initials.
#### path
Full qualified path of Azure blob directory.
#### bytes
Size of file object in bytes.
#### last_modified
When was the file content last modified.
#### etag
An ETag property is used for optimistic concurrency during updates. It isn't a timestamp as there's another property called Timestamp that stores the last time a record was updated. For example, if you load an entity and want to update it, the ETag must match what is currently stored. Setting the appropriate ETag is important because if you have multiple users editing the same item, you don't want them overwriting each other's changes.
#### content_type
The Blob object represents a blob, which is a file-like object of immutable, raw data. They can be read as text or binary data, or converted into a ReadableStream so its methods can be used for processing the data. Blobs can represent data that isn't necessarily in a JavaScript-native format.
#### content_encoding
Azure Storage allows you to define Content-Encoding property on a blob. For compressed content, you could set the property to be GZIP.  When the browser accesses the content, it automatically decompresses the content.
#### content_hash
This hash is used to verify the integrity of the blob during transport. When this header is specified, the storage service checks the hash that has arrived with the one that was sent. If the two hashes don't match, the operation fails with error code 400 (Bad Request).

### Return type
SETOF record

> [!NOTE]
> **Permissions**
Now you can list containers set to Private and Blob access levels for that storage but only as the `citus user`, which has the `azure_storage_admin` role granted to it. If you create a new user named `support`, it won't be allowed to access container contents by default.

## azure_storage.blob_get
The function allows loading the content of file \ files from within the container, with added support on filtering or manipulation of data, prior to import.

```postgresql
azure_storage.blob_get
        (account_name text
        ,container_name text
        ,path text
        ,decoder text DEFAULT 'auto'::text
        ,compression text DEFAULT 'auto'::text
        ,options jsonb DEFAULT NULL::jsonb
        )
RETURNS SETOF record;
```

There's an overloaded version of function, containing rec parameter that allows you to conveniently define the output format record.

```postgresql
azure_storage.blob_get
        (account_name text
        ,container_name text
        ,path text
        ,rec anyelement
        ,decoder text DEFAULT 'auto'::text
        ,compression text DEFAULT 'auto'::text
        ,options jsonb DEFAULT NULL::jsonb
        )
RETURNS SETOF anyelement;
```

### Arguments
#### account
The storage account provides a unique namespace for your Azure Storage data that's accessible from anywhere in the world over HTTPS.
#### container
A container organizes a set of blobs, similar to a directory in a file system. A storage account can include an unlimited number of containers, and a container can store an unlimited number of blobs.
A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs.
#### path
Blob name existing in the container.
#### rec
Define the record output structure.
#### decoder
Specify the blob format
Decoder can be set to auto (default) or any of the following values
#### decoder description
| **Format** | **Description**                                          |
|------------|----------------------------------------------------------|
| csv        | Comma-separated values format used by PostgreSQL COPY    |
| tsv        | Tab-separated values, the default PostgreSQL COPY format |
| binary     | Binary PostgreSQL COPY format                            |
| text       | A file containing a single text value (for example, large JSON or XML)                            |

#### compression
Defines the compression format. Available options are `auto`, `gzip` & `none`. The use of the `auto` option (default), guesses the compression based on the file extension (.gz == gzip). The option `none` forces to ignore the extension and not attempt to decode. While gzip forces using the gzip decoder (for when you have a gzipped file with a non-standard extension). We currently don't support any other compression formats for the extension.
#### options
For handling custom headers, custom separators, escape characters etc., `options` works in similar fashion to `COPY` command in PostgreSQL, parameter utilizes to blob_get function.

### Return type
SETOF Record / anyelement

> [!Note]
> There are four utility functions, called as a parameter within blob_get that help building values for it. Each utility function is designated for the decoder matching its name.

## azure_storage.options_csv_get
The function acts as a utility function called as a parameter within blob_get, which is useful for decoding the csv content.

```postgresql
azure_storage.options_csv_get
        (delimiter text DEFAULT NULL::text
        ,null_string text DEFAULT NULL::text
        ,header boolean DEFAULT NULL::boolean
        ,quote text DEFAULT NULL::text
        ,escape text DEFAULT NULL::text
        ,force_not_null text[] DEFAULT NULL::text[]
        ,force_null text[] DEFAULT NULL::text[]
        ,content_encoding text DEFAULT NULL::text
        )
Returns jsonb;
```

### Arguments
#### delimiter
Specifies the character that separates columns within each row (line) of the file. The default is a tab character in text format, a comma in CSV format. It must be a single one-byte character.

#### null_string
Specifies the string that represents a null value. The default is \N (backslash-N) in text format, and an unquoted empty string in CSV format. You might prefer an empty string even in text format for cases where you don't want to distinguish nulls from empty strings.

#### header
Specifies that the file contains a header line with the names of each column in the file. On output, the first line contains the column names from the table.

#### quote
Specifies the quoting character to be used when a data value is quoted. The default is double-quote. It must be a single one-byte character.

#### escape
Specifies the character that should appear before a data character that matches the QUOTE value. The default is the same as the QUOTE value (so that the quoting character is doubled if it appears in the data). It must be a single one-byte character.

#### force_not_null
Don't match the specified columns' values against the null string. In the default case where the null string is empty, it means that empty values are read as zero-length strings rather than nulls, even when they aren't quoted.

#### force_null
Match the specified columns' values against the null string, even if it has been quoted, and if a match is found set the value to NULL. In the default case where the null string is empty, it converts a quoted empty string into NULL.

#### content_encoding
Specifies that the file is encoded in the encoding_name. If the option is omitted, the current client encoding is used.

### Return type
jsonb

## azure_storage.options_copy
The function acts as a utility function called as a parameter within blob_get.

```postgresql
azure_storage.options_copy
        (delimiter text DEFAULT NULL::text
        ,null_string text DEFAULT NULL::text
        ,header boolean DEFAULT NULL::boolean
        ,quote text DEFAULT NULL::text
        ,escape text DEFAULT NULL::text
        ,force_quote text[] DEFAULT NULL::text[]
        ,force_not_null text[] DEFAULT NULL::text[]
        ,force_null text[] DEFAULT NULL::text[]
        ,content_encoding text DEFAULT NULL::text
        )
Returns jsonb;
```

### Arguments
#### delimiter
Specifies the character that separates columns within each row (line) of the file. The default is a tab character in text format, a comma in CSV format. It must be a single one-byte character.

#### null_string
Specifies the string that represents a null value. The default is \N (backslash-N) in text format, and an unquoted empty string in CSV format. You might prefer an empty string even in text format for cases where you don't want to distinguish nulls from empty strings.

#### header
Specifies that the file contains a header line with the names of each column in the file. On output, the first line contains the column names from the table.

#### quote
Specifies the quoting character to be used when a data value is quoted. The default is double-quote. It must be a single one-byte character.

#### escape
Specifies the character that should appear before a data character that matches the QUOTE value. The default is the same as the QUOTE value (so that the quoting character is doubled if it appears in the data). It must be a single one-byte character.

#### force_quote
Forces quoting to be used for all non-NULL values in each specified column. NULL output is never quoted. If * is specified, non-NULL values are quoted in all columns.

#### force_not_null
Don't match the specified columns' values against the null string. In the default case where the null string is empty, it means that empty values are read as zero-length strings rather than nulls, even when they aren't quoted.

#### force_null
Match the specified columns' values against the null string, even if it has been quoted, and if a match is found set the value to NULL. In the default case where the null string is empty, it converts a quoted empty string into NULL.

#### content_encoding
Specifies that the file is encoded in the encoding_name. If the option is omitted, the current client encoding is used.

### Return type
jsonb

## azure_storage.options_tsv
The function acts as a utility function called as a parameter within blob_get. It's useful for decoding the tsv content.

```postgresql
azure_storage.options_tsv
        (delimiter text DEFAULT NULL::text
        ,null_string text DEFAULT NULL::text
        ,content_encoding text DEFAULT NULL::text
        )
Returns jsonb;
```

### Arguments
#### delimiter
Specifies the character that separates columns within each row (line) of the file. The default is a tab character in text format, a comma in CSV format. It must be a single one-byte character.

#### null_string
Specifies the string that represents a null value. The default is \N (backslash-N) in text format, and an unquoted empty string in CSV format. You might prefer an empty string even in text format for cases where you don't want to distinguish nulls from empty strings.

#### content_encoding
Specifies that the file is encoded in the encoding_name. If the option is omitted, the current client encoding is used.

### Return type
jsonb

## azure_storage.options_binary
The function acts as a utility function called as a parameter within blob_get. It's useful for decoding the binary content.

```postgresql
azure_storage.options_binary
        (content_encoding text DEFAULT NULL::text)
Returns jsonb;
```

### Arguments
#### content_encoding
Specifies that the file is encoded in the encoding_name. If this option is omitted, the current client encoding is used.

### Return Type
jsonb

> [!NOTE]
**Permissions**
Now you can list containers set to Private and Blob access levels for that storage but only as the `citus user`, which has the `azure_storage_admin` role granted to it. If you create a new user named support, it won't be allowed to access container contents by default.


## Examples
The examples used make use of sample Azure storage account `(pgquickstart)` with custom files uploaded for adding to coverage of different use cases. We can start by creating table used across the set of example used.
```sql
CREATE TABLE IF NOT EXISTS public.events
        (
         event_id bigint
        ,event_type text
        ,event_public boolean
        ,repo_id bigint
        ,payload jsonb
        ,repo jsonb
        ,user_id bigint
        ,org jsonb
        ,created_at timestamp without time zone
        );
```

### Adding access key of storage account (mandatory for access level = private)
The example illustrates adding of access key for the storage account to get access for querying from a session on the Azure Cosmos DB for Postgres cluster.

```sql
SELECT azure_storage.account_add('pgquickstart', 'SECRET_ACCESS_KEY');
```
> [!TIP]
> In your storage account, open **Access keys**. Copy the **Storage account name** and copy the **Key** from **key1** section (you have to select **Show** next to the key first).

:::image type="content" source="media/howto-ingestion/azure-blob-storage-account-key.png" alt-text="Screenshot of Security + networking > Access keys section of an Azure Blob Storage page in the Azure portal." border="true":::

### Removing access key of storage account
The example illustrates removing the access key for a storage account. This action would result in removing access to files hosted in private bucket in container.

```sql
SELECT azure_storage.account_remove('pgquickstart');
```

### Adding access for a role to Azure Blob storage

```sql
SELECT * FROM azure_storage.account_user_add('pgquickstart', 'support');
```

### List all the roles with access on Azure Blob storage

```sql
SELECT * FROM azure_storage.account_list();
```

### Removing the roles with access on Azure Blob storage

```sql
SELECT * FROM azure_storage.account_user_remove('pgquickstart', 'support');
```

### List the objects within a `public` container

```sql
SELECT * FROM azure_storage.blob_list('pgquickstart','publiccontainer');
```

### List the objects within a `private` container

```sql
SELECT * FROM azure_storage.blob_list('pgquickstart','privatecontainer');
```

> [!Note]
> Adding access key is mandatory.

### List the objects with specific string initials within public container

```sql
SELECT * FROM azure_storage.blob_list('pgquickstart','publiccontainer','e');
```
Alternatively

```sql
SELECT * FROM azure_storage.blob_list('pgquickstart','publiccontainer') WHERE path LIKE 'e%';
```

### Read content from an object in a container
The `blob_get` function retrieves a file from blob storage. In order for blob_get to know how to parse the data you can either pass a value (NULL::table_name), which has same format as the file.

```sql
SELECT * FROM azure_storage.blob_get
        ('pgquickstart'
        ,'publiccontainer'
        ,'events.csv.gz'
        , NULL::events)
LIMIT 5;
```

Alternatively, we can explicitly define the columns in the `FROM` clause.

```sql
SELECT * FROM azure_storage.blob_get('pgquickstart','publiccontainer','events.csv')
AS res (
         event_id BIGINT
        ,event_type TEXT
        ,event_public BOOLEAN
        ,repo_id BIGINT
        ,payload JSONB
        ,repo JSONB
        ,user_id BIGINT
        ,org JSONB
        ,created_at TIMESTAMP WITHOUT TIME ZONE)
LIMIT 5;
```

### Use decoder option
The example illustrates the use of `decoder` option. Normally format is inferred from the extension of the file, but when the file content doesn't have a matching extension you can pass the decoder argument.

```sql
SELECT * FROM azure_storage.blob_get
        ('pgquickstart'
        ,'publiccontainer'
        ,'events'
        , NULL::events
        , decoder := 'csv')
LIMIT 5;
```

### Use compression with decoder option
The example shows how to enforce using the gzip compression on a gzip compressed file without a standard .gz extension.

```sql
SELECT * FROM azure_storage.blob_get
        ('pgquickstart'
        ,'publiccontainer'
        ,'events-compressed'
        , NULL::events
        , decoder := 'csv'
        , compression := 'gzip')
LIMIT 5;
```

### Import filtered content & modify before loading from csv format object
The example illustrates the possibility to filter & modify the content being imported from object in container before loading that into a SQL table.

```sql
SELECT concat('P-',event_id::text) FROM azure_storage.blob_get
        ('pgquickstart'
        ,'publiccontainer'
        ,'events.csv'
        , NULL::events)
WHERE event_type='PushEvent'
LIMIT 5;
```

### Query content from file with headers, custom separators, escape characters
You can use custom separators and escape characters by passing the result of `azure_storage.options_copy` to the `options` argument.

```sql
SELECT * FROM azure_storage.blob_get
        ('pgquickstart'
        ,'publiccontainer'
        ,'events_pipe.csv'
        ,NULL::events
        ,options := azure_storage.options_csv_get(delimiter := '|' , header := 'true')
        );
```

### Aggregation query on content of an object in the container
This way you can query data without importing it.

```sql
SELECT event_type,COUNT(1) FROM azure_storage.blob_get
        ('pgquickstart'
        ,'publiccontainer'
        ,'events.csv'
        , NULL::events)
GROUP BY event_type
ORDER BY 2 DESC
LIMIT 5;
```

## Next steps

> [!div class="nextstepaction"]
> [How to use Azure Blob Storage with the COPY command](reference-copy-command.md)

> [!div class="nextstepaction"]
> [How to ingest data using pg_azure_storage](howto-ingest-azure-blob-storage.md)