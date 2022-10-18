---
title: Data ingestion with Azure Blob Storage - Azure Cosmos DB for PostgreSQL
description: How to ingest data using Azure Blob Storage as a staging area 
ms.author: adamwolk
author: mulander
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 10/14/2022
---

# How to ingest data using Azure Blob Storage

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

[Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/#features) (ABS) is a cloud-native scalable, durable and secure storage service. These characteristics of ABS make it a good choice of storing and moving existing data into the cloud.

Learn how to use pg_azure_storage storage account to manipulate and load data into your Azure Cosmos DB for PostgreSQL directly from Azure Blob Storage.

## Steps to use ABS with Azure Cosmos DB for PostgreSQL

1. Loading your data into Azure Blob Storage

    Follow [migrate your on-premises data to cloud storage](../../storage/common/storage-use-azcopy-migrate-on-premises-data.md) to learn how to get your datasets efficiently into Azure Blob Storage.

    > [!NOTE]
    >
    > Selecting "Container (anonymous read access for containers and blobs)" will allow you to ingest files from Azure Blob Storage using their public URLs and enumerating the container contents without the need to configure an account key in pg_azure_storage. Containers set to access level "Private (no anonymous access)" or "Blob (anonymous read access for blobs only)" will require an access key.


1. Create the extension in our database
    
    ```sql
    SELECT * FROM create_extension('azure_storage');
    ``` 

1. List public container contents
    
    We can easily see what files are present in the `github` container of the `pgquickstart` Azure Blob Storage account by using the `azure_storage.blob_list(account, container)` function.
    
    ```sql
    SELECT path, bytes, pg_size_pretty(bytes), content_type FROM azure_storage.blob_list('pgquickstart','github');
    ```
    
    ```
         path      |  bytes   |     last_modified      |       etag        |    content_type    | content_encoding |           content_hash
    ---------------+----------+------------------------+-------------------+--------------------+------------------+----------------------------------
     events.csv.gz | 41691786 | 2022-10-12 18:49:51+00 | 0x8DAAC828B970928 | application/x-gzip |                  | 473b6ad25b7c88ff6e0a628889466aed
     users.csv.gz  |  5382831 | 2022-10-12 18:49:18+00 | 0x8DAAC8277D84814 | application/x-gzip |                  | f49886ee815cba1904858f8504c9f6ea
    (2 rows)
    ```
    
    If you have a different container with multiple files, you can filter the output either by using a regular SQL `WHERE` clauses, or by using the `prefix` parameter of the `blob_list` UDF. The latter will filter the returned rows on the Azure Blob Storage side.
    
    
    > [!NOTE]
    >
    > Listing container contents requires an account and access key or a container with enabled anonymous access.
    
    
    ```sql
    SELECT * FROM azure_storage.blob_list('mystorageaccount','dataverse','a-set');
    ```
    
    ```
        path     |  bytes  |     last_modified      |       etag        | content_type | content_encoding |           content_hash
    -------------+---------+------------------------+-------------------+--------------+------------------+----------------------------------
     a-set-0.csv | 1048576 | 2022-10-14 15:12:58+00 | 0x8DAADF693E69946 | text/csv     |                  | 34b1b5373ef99e5e313daf310b9cec43
     a-set-1.csv | 1048576 | 2022-10-14 15:12:57+00 | 0x8DAADF693B22361 | text/csv     |                  | d38a97dba51b2465b77c6b20a92933b9
     a-set-2.csv | 1048576 | 2022-10-14 15:12:59+00 | 0x8DAADF694BE6342 | text/csv     |                  | 6c85c043a601f42285d2bd570ddf1bf6
     a-set-3.csv | 1048576 | 2022-10-14 15:13:00+00 | 0x8DAADF69515C560 | text/csv     |                  | 77208eb2a3832fd95f2b0773e8b87c91
     a-set-4.csv | 1048576 | 2022-10-14 15:12:58+00 | 0x8DAADF693FBA4DE | text/csv     |                  | 7ebf3e6269412fe5eee30b1019aebe7b
     a-set-5.csv | 1048576 | 2022-10-14 15:12:59+00 | 0x8DAADF694F3EA6C | text/csv     |                  | 9b45373b38807639e15c5b4f9e795834
     a-set-6.csv | 1048576 | 2022-10-14 15:12:59+00 | 0x8DAADF694F5E5F1 | text/csv     |                  | ec4018a32a1b0f9c6b7482d55534e762
     a-set-7.csv | 1048576 | 2022-10-14 15:12:59+00 | 0x8DAADF694CB0B9E | text/csv     |                  | e258529823462a9371a78a2eb9a0411b
     a-set-8.csv | 1048576 | 2022-10-14 15:12:53+00 | 0x8DAADF691675052 | text/csv     |                  | f1e2e2b8cc7ee3891a79dad3dab6f229
     a-set-9.csv | 1048576 | 2022-10-14 15:12:54+00 | 0x8DAADF691AD01B5 | text/csv     |                  | 1ef7c66c6b64145be26ea49c6d475bfb
    (10 rows)
    ```
    
    ```sql
    SELECT * FROM azure_storage.blob_list('mystorageaccount','datasets') WHERE path LIKE 'b-set%';
    ```
    
    ```
        path     |  bytes  |     last_modified      |       etag        | content_type | content_encoding |           content_hash
    -------------+---------+------------------------+-------------------+--------------+------------------+----------------------------------
     b-set-0.csv | 1048576 | 2022-10-14 15:12:56+00 | 0x8DAADF693358B77 | text/csv     |                  | 6a89c46c1cb8b5747996a4222a16e4c3
     b-set-1.csv | 1048576 | 2022-10-14 15:12:54+00 | 0x8DAADF691849809 | text/csv     |                  | fdc5cb981d011288f45f1fab549a40ba
     b-set-2.csv | 1048576 | 2022-10-14 15:12:55+00 | 0x8DAADF69218AC2B | text/csv     |                  | 2bb0ceb6c2e7f70d229f0de5b10ae746
     b-set-3.csv | 1048576 | 2022-10-14 15:12:54+00 | 0x8DAADF6918DE586 | text/csv     |                  | 3ad3a4d9ff7e610367321fb049343691
     b-set-4.csv | 1048576 | 2022-10-14 15:12:55+00 | 0x8DAADF69296A373 | text/csv     |                  | f7b31641118159a84148b2cde002e53f
     b-set-5.csv | 1048576 | 2022-10-14 15:12:56+00 | 0x8DAADF692B0904F | text/csv     |                  | 7454f78fc3a268751e9836b9a5061d6d
     b-set-6.csv | 1048576 | 2022-10-14 15:12:55+00 | 0x8DAADF6926AB7DB | text/csv     |                  | e2c7078875eff6259b65bdc47ba889f4
     b-set-7.csv | 1048576 | 2022-10-14 15:12:58+00 | 0x8DAADF6942B1258 | text/csv     |                  | e8ada4945cf45683e7bff88e337e5be1
     b-set-8.csv | 1048576 | 2022-10-14 15:12:57+00 | 0x8DAADF693CB9B17 | text/csv     |                  | 8fcfab56a747e6e74ca1244e241a6bb9
     b-set-9.csv | 1048576 | 2022-10-14 15:12:56+00 | 0x8DAADF6932F23BE | text/csv     |                  | fa1d8a4720895c2985a9151744912a4b
    (10 rows)
    ```

    Without an access key, we won't be allowed to list containers that are set to Private or Blob access levels.

    ```
    citus=> SELECT * FROM azure_storage.blob_list('mystorageaccount','privdatasets');
    ERROR:  azure_storage: missing account access key
    HINT:  Use SELECT azure_storage.account_add('<account name>', '<access key>')
    ```

1. Obtain your account name and access key

    In your storage account, open **Access keys**. Copy the **Storage account name** and copy the **Key** from **key1** section (you have to select **Show** next to the key first).

    :::image type="content" source="media/howto-ingestion/azure-blob-storage-account-key.png" alt-text="Security + networking > Access keys section of an Azure Blob Storage page on the Azure portal. Red underline is under Access keys section in the left navigation menu, another red underline is under Storage account name, which states mystorageaccount. Final red underline is present under Key in the key1 section underlining the masked secret value." border="true":::

1. Adding an account to pg_azure_storage
    
    ```sql
    SELECT azure_storage.account_add('mystorageaccount', 'SECRET_ACCESS_KEY');
    ```

    Now you can list containers set to Private and Blob access levels for that storage but only as the `citus` user, which has the `azure_storage_admin` role granted to it. If you create a new user named `support`, it won't be allowed to access container contents by default.

    ```
    citus=> select * from azure_storage.blob_list('pgabs','dataverse');
    ERROR:  azure_storage: current user support is not allowed to use storage account pgabs
    citus=>
    ```

1. Allow the `support` user to use a specific Azure Blob Storage account

    Granting the permission is as simple as calling `account_user_add`.

    ```sql
    SELECT * FROM azure_storage.account_user_add('mystorageaccount', 'support');
    ```

    We can see the allowed users in the output of `account_list`, which shows all accounts with access keys defined.

    ```sql
    SELECT * FROM azure_storage.account_list();
    ```

    ```
     account_name     | allowed_users
    ------------------+---------------
     mystorageaccount | {support}
    (1 row)
    ```

    If you ever decide, that the user should no longer have access. Just call `account_user_remove`.
    

    ```sql
    SELECT * FROM azure_storage.account_user_remove('mystorageaccount', 'support');
    ```

1. Load data using the `COPY` command

    Start by creating a sample schema.

    ```sql
    CREATE TABLE github_users
    (
    	user_id bigint,
    	url text,
    	login text,
    	avatar_url text,
    	gravatar_id text,
    	display_login text
    );
    
    CREATE TABLE github_events
    (
    	event_id bigint,
    	event_type text,
    	event_public boolean,
    	repo_id bigint,
    	payload jsonb,
    	repo jsonb,
    	user_id bigint,
    	org jsonb,
    	created_at timestamp
    );
    
    CREATE INDEX event_type_index ON github_events (event_type);
    CREATE INDEX payload_index ON github_events USING GIN (payload jsonb_path_ops);

    SELECT create_distributed_table('github_users', 'user_id');
    SELECT create_distributed_table('github_events', 'user_id');
    ```

    Loading data into the tables becomes as simple as calling the `COPY` command.

    
    ```sql
    -- download users and store in table
    
    COPY github_users FROM 'https://pgquickstart.blob.core.windows.net/github/users.csv.gz';
    
    -- download events and store in table
    
    COPY github_events FROM 'https://pgquickstart.blob.core.windows.net/github/events.csv.gz';
    ```
    
    Notice how the extension recognized that the URLs provided to the copy command are from Azure Blob Storage, the files we pointed were gzip compressed and that was also automatically handled for us.

    The `COPY` command supports more parameters and formats. In the above example, the format and compression were auto-selected based on the file extensions. You can however provide the format directly similar to the regular `COPY` command.

    ```sql
    COPY github_users FROM 'https://pgquickstart.blob.core.windows.net/github/users.csv.gz' WITH (FORMAT 'csv');
    ```

    Currently the extension supports the following file formats:

    |format|description|
    |------|-----------|
    |csv|Comma-separated values format used by PostgreSQL COPY|
    |tsv|Tab-separated values, the default PostgreSQL COPY format|
    |binary|Binary PostgreSQL COPY format|
    |text|A file containing a single text value (for example, large JSON or XML)|
    

1. Accessing and importing file content using `blob_get`

    The `COPY` command is convenient but is limited in flexibility. Internally COPY uses the `blob_get` function, which you can use directly to manipulate data in much more complex scenarios.

    ```sql
    SELECT * FROM azure_storage.blob_get('pgquickstart', 'github', 'users.csv.gz', NULL::github_users) LIMIT 3;
    ```

    ```
     user_id |                    url                    |    login     |                 avatar_url                  | gravatar_id | display_login
    ---------+-------------------------------------------+--------------+---------------------------------------------+-------------+---------------
          21 | https://api.github.com/users/technoweenie | technoweenie | https://avatars.githubusercontent.com/u/21? |             | technoweenie
          22 | https://api.github.com/users/macournoyer  | macournoyer  | https://avatars.githubusercontent.com/u/22? |             | macournoyer
          38 | https://api.github.com/users/atmos        | atmos        | https://avatars.githubusercontent.com/u/38? |             | atmos
    (3 rows)
    ```

    > [!NOTE]
    >
    > In the above query, the file is fully fetched before `LIMIT 3` is applied.

    With this function, you can manipulate data on the fly in complex queries, and do imports as `INSERT FROM SELECT`.

    ```sql
    INSERT INTO github_users
         SELECT user_id, url, UPPER(login), avatar_url, gravatar_id, display_login
           FROM azure_storage.blob_get('pgquickstart', 'github', 'users.csv.gz', NULL::github_users)
          WHERE gravatar_id IS NOT NULL;
    ```

    ```
    INSERT 0 264308
    ```

    In the above command, we filtered the data to accounts with a `gravatar_id` present and upper cased their logins on the fly.

1. Options for `blob_get`

    In some situations, you may need to control exactly what `blob_get` attempts to do by using the `decoder`, `compression` and `options` parameters.

    Decoder can be set to `auto` (default) or any of the following values:

    |format|description|
    |------|-----------|
    |csv|Comma-separated values format used by PostgreSQL COPY|
    |tsv|Tab-separated values, the default PostgreSQL COPY format|
    |binary|Binary PostgreSQL COPY format|
    |text|A file containing a single text value (for example, large JSON or XML)|

    `compression` can be either `auto` (default), `none` or `gzip`.

    Finally, the `options` parameter is of type `jsonb`. There are four utility functions that help building values for it.
    Each utility function is designated for the decoder matching its name.

    |decoder|options function  |
    |-------|------------------|
    |csv    |`options_csv_get` |
    |tsv    |`options_tsv`     |
    |binary |`options_binary`  |
    |text   |`options_copy`    |

    By looking at the function definitions, you can see which parameters are supported by which decoder.

    `options_csv_get` - delimiter, null_string, header, quote, escape, force_not_null, force_null, content_encoding
    `options_tsv` - delimiter, null_string, content_encoding
    `options_copy` - delimiter, null_string, header, quote, escape, force_quote, force_not_null, force_null, content_encoding.
    `options_binary` - content_encoding

    Knowing the above, we can discard recordings with null `gravatar_id` during parsing.

    ```sql
    INSERT INTO github_users
         SELECT user_id, url, UPPER(login), avatar_url, gravatar_id, display_login
           FROM azure_storage.blob_get('pgquickstart', 'github', 'users.csv.gz', NULL::github_users,
                                        options := azure_storage.options_csv_get(force_not_null := ARRAY['gravatar_id']));
    ```


    ```
    INSERT 0 264308
    ```


    Congratulations, you just learned how to load data into Azure Cosmos DB for PostgreSQL directly from Azure Blob Storage.

## Next steps

Learn how to create a [real-time dashboard](tutorial-design-database-realtime.md) with Azure Cosmos DB for PostgreSQL.