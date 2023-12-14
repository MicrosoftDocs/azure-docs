---
title: "Quickstart: Fivetran and dedicated SQL pool (formerly SQL DW)"
description: Get started with Fivetran and dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 10/12/2018
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - seo-lt-2019
  - azure-synapse
---

# Quickstart: Fivetran with dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics 

This quickstart describes how to set up a new Fivetran user to work with a dedicated SQL pool (formerly SQL DW). The article assumes that you have an existing dedicated SQL pool (formerly SQL DW).

## Set up a connection

1. Find the fully qualified server name and database name that you use to connect to your dedicated SQL pool (formerly SQL DW).
    
    If you need help finding this information, see [Connect to your dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-connection-strings.md).

2. In the setup wizard, choose whether to connect your database directly or by using an SSH tunnel.

   If you choose to connect directly to your database, you must create a firewall rule to allow access. This method is the simplest and most secure method.

   If you choose to connect using an SSH tunnel, Fivetran connects to a separate server on your network. The server provides an SSH tunnel to your database. You must use this method if your database is in an inaccessible subnet on a virtual network.

3. Add the IP address **52.0.2.4** to your server-level firewall to allow incoming connections to your dedicated SQL pool (formerly SQL DW) instance from Fivetran.

   For more information, see [Create a server-level firewall rule](create-data-warehouse-portal.md#create-a-server-level-firewall-rule).

## Set up user credentials

1. Connect to your dedicated SQL pool (formerly SQL DW) by using SQL Server Management Studio (SSMS) or the tool that you prefer. Sign in as a server admin user. Then, run the following SQL commands to create a user for Fivetran:

    - In the master database: 
    
      ```sql
      CREATE LOGIN fivetran WITH PASSWORD = '<password>'; 
      ```

    - In the dedicated SQL pool (formerly SQL DW) database:

      ```sql
      CREATE USER fivetran_user_without_login without login;
      CREATE USER fivetran FOR LOGIN fivetran;
      GRANT IMPERSONATE on USER::fivetran_user_without_login to fivetran;
      ```

2. Grant the Fivetran user the following permissions to your dedicated SQL pool (formerly SQL DW):

    ```sql
    GRANT CONTROL to fivetran;
    ```

    CONTROL permission is required to create database-scoped credentials that are used when a user loads files from Azure Blob storage by using PolyBase.

3. Add a suitable resource class to the Fivetran user. The resource class you use depends on the memory that's required to create a columnstore index. For example, integrations with products like Marketo and Salesforce require a higher resource class because of the large number of columns and the larger volume of data the products use. A higher resource class requires more memory to create columnstore indexes.

    We recommend that you use static resource classes. You can start with the `staticrc20` resource class. The `staticrc20` resource class allocates 200 MB for each user, regardless of the performance level you use. If columnstore indexing fails at the initial resource class level, increase the resource class.

    ```sql
    EXEC sp_addrolemember '<resource_class_name>', 'fivetran';
    ```

    For more information, read about [memory and concurrency limits](memory-concurrency-limits.md) and [resource classes](sql-data-warehouse-memory-optimizations-for-columnstore-compression.md#ways-to-allocate-more-memory).


## Connect from Fivetran

To connect to your dedicated SQL pool (formerly SQL DW) from your Fivetran account, enter the credentials that you use to access your dedicated SQL pool (formerly SQL DW): 

* Host (your server name).
* Port.
* Database.
* User (the user name should be **fivetran\@_server_name_** where *server_name* is part of your Azure host URI: **_server\_name_.database.windows.net**).
* Password.
