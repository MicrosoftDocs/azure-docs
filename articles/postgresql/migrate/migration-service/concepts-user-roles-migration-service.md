---
title: "Migration service - Migration of users/roles, ownerships, and privileges"
description: Migration of users/roles, ownerships, and privileges along with schema and data
author: shriramm
ms.author: shriramm
ms.reviewer: maghan
ms.date: 03/13/2024
ms.service: postgresql
ms.topic: conceptual
---

# Migration of user roles, ownerships, and privileges for the migrations service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

> [!IMPORTANT]  
> The migration of user roles, ownerships, and privileges feature is available only for the Azure Database for PostgreSQL Single server as the source. This feature is currently disabled for PostgreSQL version 16 servers.

The service automatically provides the following built-in capabilities for the Azure Database for PostgreSQL single server as the source and data migration.

- Migration of user roles on your source server to the target server.
- Migration of ownership of all the database objects on your source server to the target server.
- Migration of permissions of database objects on your source server, such as GRANTS/REVOKES, to the target server.

## Permission differences between Azure Database for PostgreSQL Single server and Flexible server
This section explores the differences in permissions granted to the **azure_pg_admin** role across single server and flexible server environments.

### PG catalog permissions
Unlike user-created schemas, which organize database objects into logical groups, pg_catalog is a system schema. It houses crucial system-level information, such as details about tables, columns, and other internal bookkeeping data. Essentially, it’s where PostgreSQL stores important metadata.

In a single server environment, a user belonging to the azure_pg_admin role is granted select privileges for all pg_catalog tables and views. However, in a flexible server, we restricted privileges for certain tables and views, allowing only the super user to query them. 

We removed all privileges for non-superusers on the following pg_catalog tables. 
- pg_authid 

- pg_largeobject 

- pg_subscription 

- pg_user_mapping 

We removed all privileges for non-superusers on the following pg_catalog views.
- pg_config 

- pg_file_settings 

- pg_hba_file_rules 

- pg_replication_origin_status 

- pg_shadow 

Allowing unrestricted access to these system tables and views could lead to unauthorized modifications, accidental deletions, or even security breaches. By restricting access, we're reducing the risk of unintended changes or data exposure. 

#### What is the impact?
- If your application is designed to directly query the affected tables and views, it will encounter issues upon migrating to the flexible server. We strongly advise you to refactor your application to avoid direct queries to these system tables. 

- If you have granted privileges to any users or roles for the affected pg_catalog tables and views, you encounter an error during the migration process. This error will be identified by the following pattern: **"pg_restore error: could not execute query GRANT/REVOKE PRIVILEGES on TABLENAME to username."**
To resolve this error, it's necessary to revoke the select privileges granted to various users and roles on the pg_catalog tables and views. You can accomplish this by taking the following steps.
   1. Take a pg_dump of the database containing only the schema by executing the following command from a machine with access to your single server.
    ```bash
        pg_dump -h <singleserverhostname> -U <username@singleserverhostname> -d <databasename> -s > dump_output.sql  
    ```
   2.  Search for **GRANT** statements associated with the impacted tables and views in the dump file. These GRANT statements follow this format.
    ```bash
        GRANT <privileges> to pg_catalog.<impacted tablename/viewname> to <username>; 
    ```
   3. If any such statements exist, ensure to execute the following command on your single server for each GRANT statement. 
    ```bash
        REVOKE <privileges> to pg_catalog.<impacted tablename/viewname> from <username>; 
    ```    

##### Understanding pg_pltemplate deprecation
Another important consideration is the deprecation of the **pg_pltemplate** system table within the pg_catalog schema by the PostgreSQL community **starting from version 13.** Therefore, if you're migrating to Flexible Server versions 13 and above, and if you have granted permissions to users on the pg_pltemplate table, it is necessary to revoke these permissions before initiating the migration process. You can follow the same steps outlined above and conduct a search for **pg_pltemplate** in Step 2. Failure to do so leads to a failed migration.

After completing these steps, you can proceed to initiate a new migration from the single server to the flexible server using the migration tool. You're expected not to encounter permission-related issues during this process.

## Related content
- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
