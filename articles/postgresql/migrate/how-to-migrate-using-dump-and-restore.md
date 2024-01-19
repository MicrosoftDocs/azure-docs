---
title: Dump and restore - Azure Database for PostgreSQL - Flexible Server
description: You can extract a PostgreSQL database into a dump file. Then, you can restore from a file created by pg_dump in Azure Database for PostgreSQL Single Server or Flexible Server.
ms.service: postgresql
ms.subservice: migration-guide
ms.topic: how-to
ms.author: alkuchar
author: AlicjaKucharczyk
ms.date: 01/04/2024
---

# Migrate your PostgreSQL database by using dump and restore

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

You can use [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) to extract a PostgreSQL database into a dump file. The method to restore the database depends on the format of the dump you choose. If your dump is taken with the plain format (which is the default `-Fp`, so no specific option needs to be specified), then the only option to restore it is by using [psql](https://www.postgresql.org/docs/current/app-psql.html), as it outputs a plain text file. For the other three dump methods: custom, directory, and tar, [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) should be used.

> [!IMPORTANT] 
> The instructions and commands provided in this article are designed to be executed in bash terminals. This includes environments such as Windows Subsystem for Linux (WSL), Azure Cloud Shell, and other bash-compatible interfaces. Please ensure you are using a bash terminal to follow the steps and execute the commands detailed in this guide. Using a different type of terminal or shell environment may result in differences in command behavior and may not produce the intended outcomes.


In this article, we focus on the plain (default) and directory formats. The directory format is useful as it allows you to use multiple cores for processing, which can significantly enhance efficiency, especially for large databases.

The Azure portal streamlines this process via the Connect blade by offering preconfigured commands that are tailored to your server, with values substituted with your user data. It's important to note that the Connect blade is only available for Azure Database for PostgreSQL - Flexible Server and not for Single Server. Here's how you can use this feature:

1. **Access Azure portal**: First, go to the Azure portal and choose the Connect blade.

   :::image type="content" source="./media/how-to-migrate-using-dump-and-restore/portal-connect-blade.png" alt-text="Screenshot showing the placement of Connect blade in Azure portal." lightbox="./media/how-to-migrate-using-dump-and-restore/portal-connect-blade.png":::

2. **Select your database**: In the Connect blade, you find a dropdown list of your databases. Select the database you wish to perform a dump from.

   :::image type="content" source="./media/how-to-migrate-using-dump-and-restore/dropdown-list-of-databases.png" alt-text="Screenshot showing the dropdown where specific database can be chosen." lightbox="./media/how-to-migrate-using-dump-and-restore/dropdown-list-of-databases.png":::

3. **Choose the appropriate method**: Depending on your database size, you can choose between two methods:
      - **`pg_dump` & `psql` - using singular text file**: Ideal for smaller databases, this option utilizes a single text file for the dump and restore process.
      - **`pg_dump` & `pg_restore` - using multiple cores**: For larger databases, this method is more efficient as it uses multiple cores to handle the dump and restore process.

   :::image type="content" source="./media/how-to-migrate-using-dump-and-restore/different-dump-methods.png" alt-text="Screenshot showing two possible dump methods." lightbox="./media/how-to-migrate-using-dump-and-restore/different-dump-methods.png":::

4. **Copy and paste commands**: The portal provides you with ready to use `pg_dump` and `psql` or `pg_restore` commands. These commands come with values already substituted according to the server and database you've chosen. Copy and paste these commands.

## Prerequisites
If you're using a Single Server, or don't have access to the Flexible Server portal, read through this documentation page. It contains information that is similar to what is presented in the Connect blade for Flexible Server on the portal. 

To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server](../single-server/quickstart-create-server-database-portal.md), including firewall rules to allow access.
- [pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html), [psql](https://www.postgresql.org/docs/current/app-psql.html), [pg_restore](https://www.postgresql.org/docs/current/static/app-pgrestore.html) and [pg_dumpall](https://www.postgresql.org/docs/current/app-pg-dumpall.html) in case you want to migrate with roles and permissions, command-line utilities installed.
- **Decide on the location for the dump**: Choose the place you want to perform the dump from. It can be done from various locations, such as a separate VM, [cloud shell](../../cloud-shell/overview.md) (where the command-line utilities are already installed, but might not be in the appropriate version, so always check the version using, for instance, `psql --version`), or your own laptop. Always keep in mind the distance and latency between the PostgreSQL server and the location from which you're running the dump or restore.

> [!IMPORTANT]  
> It is essential to use the `pg_dump`, `psql`, `pg_restore` and `pg_dumpall` utilities that are either of the same major version or a higher major version than the database server you are exporting data from or importing data to. Failing to do so may result in unsuccessful data migration. If your target server has a higher major version than the source server, use utilities that are either the same major version or higher than the target server. 


> [!NOTE]
> It's important to be aware that `pg_dump` can export only one database at a time. This limitation applies regardless of the method you have chosen, whether it's using a singular file or multiple cores.


## Dumping users and roles with `pg_dumpall -r`
`pg_dump` is used to extract a PostgreSQL database into a dump file. However, it's crucial to understand that `pg_dump` does not dump roles or users definitions, as these are considered global objects within the PostgreSQL environment. For a comprehensive migration, including users and roles, you need to use `pg_dumpall -r`. 
This command allows you to capture all role and user information from your PostgreSQL environment. If you're migrating within databases on the same server, please feel free to skip this step and move to the [Create a new database](#create-a-new-database) section.

```bash
pg_dumpall -r -h <server name> -U <user name> > roles.sql
```

For example, if you have a server named `mydemoserver` and a user named `myuser` run the following command:
```bash
pg_dumpall -r -h mydemoserver.postgres.database.azure.com -U myuser > roles.sql
```

If you're using a Single Server, your username includes the server name component. Therefore, instead of `myuser`, use `myuser@mydemoserver`.


### Dumping Roles from a Flexible Server
In a Flexible Server environment, enhanced security measures mean users don't have access to the pg_authid table, which is where role passwords are stored. This restriction affects how you perform a roles dump, as the standard `pg_dumpall -r` command attempts to access this table for passwords and fail due to lack of permission.

When dumping roles from a Flexible Server, it's crucial to include the `--no-role-passwords` option in your `pg_dumpall` command. This option prevents `pg_dumpall` from attempting to access the `pg_authid` table, which it cannot read due to security restrictions.

To successfully dump roles from a Flexible Server, use the following command:

```bash
pg_dumpall -r --no-role-passwords -h <server name> -U <user name> > roles.sql
```

For example, if you have a server named `mydemoserver`, a user named `myuser`, run the following command:

```bash
pg_dumpall -r --no-role-passwords -h mydemoserver.postgres.database.azure.com -U myuser > roles.sql
```

### Cleaning up the roles dump
When migrating the output file `roles.sql` might include certain roles and attributes that aren't applicable or permissible in the new environment. Here's what you need to consider:

- **Removing attributes that can be set only by superusers**: If migrating to an environment where you don't have superuser privileges, remove attributes like `NOSUPERUSER` and `NOBYPASSRLS` from the roles dump.

- **Excluding service-specific users**: Exclude Single Server service users, such as `azure_superuser` or `azure_pg_admin`. These are specific to the service and will be created automatically in the new environment.

Use the following `sed` command to clean up your roles dump:

```bash
sed -i '/azure_superuser/d; /azure_pg_admin/d; /azuresu/d; /^CREATE ROLE replication/d; /^ALTER ROLE replication/d; /^ALTER ROLE/ {s/NOSUPERUSER//; s/NOBYPASSRLS//;}' roles.sql
```

This command deletes lines containing `azure_superuser`, `azure_pg_admin`, `azuresu`, lines starting with `CREATE ROLE replication` and `ALTER ROLE replication`, and removes the `NOSUPERUSER` and `NOBYPASSRLS` attributes from `ALTER ROLE` statements.

## Create a dump file that contains the data to be loaded
To export your existing PostgreSQL database on-premises or in a VM to an sql script file, run the following command in your existing environment:

#### [pg_dump & psql - using singular text file](#tab/psql)
```bash
pg_dump <database name> -h <server name> -U <user name> > <database name>_dump.sql
```

For example, if you have a server named `mydemoserver`, a user named `myuser` and a database called `testdb`, run the following command:
```bash
pg_dump testdb -h mydemoserver.postgres.database.azure.com -U myuser > testdb_dump.sql
```


#### [pg_dump & pg_restore - using multiple cores](#tab/pgrestore)
```bash
pg_dump -Fd -j <number of cores> <database name> -h <server name> -U <user name> -f <database name>.dump
```

In these commands, the `-j` option stands for the number of cores you wish to use for the dump process. You can adjust this number based on how many cores are available on your PostgreSQL server and how many you would like to allocate for the dump process. Feel free to change this setting depending on your server's capacity and your performance requirements.

For example, if you have a server named `mydemoserver`, a user named `myuser` and a database called `testdb`, and you want to use two cores for the dump, run the following command:

```bash
pg_dump -Fd -j 2 testdb -h mydemoserver.postgres.database.azure.com -U myuser -f testdb.dump
```

---

If you're using a Single Server, your username includes the server name component. Therefore, instead of `myuser`, use `myuser@mydemoserver`.


## Restore the data into the target database

### Restore roles and users
Before restoring your database objects, make sure you have properly dumped and cleaned up the roles. If you're migrating within databases on the same server, both dumping the roles and restoring them may not be necessary. However, for migrations across different servers or environments, this step is crucial.

To restore the roles and users into the target database, use the following command:

```bash
psql -f roles.sql -h <server_name> -U <user_name>
```

Replace `<server_name>` with the name of your target server and `<user_name>` with your username. This command uses the `psql` utility to execute the SQL commands contained in the `roles.sql` file, effectively restoring the roles and users to your target database.

For example, if you have a server named `mydemoserver`, a user named `myuser`, run the following command:

```bash
psql -f roles.sql -h mydemoserver.postgres.database.azure.com -U myuser
```

If you're using a Single Server, your username includes the server name component. Therefore, instead of `myuser`, use `myuser@mydemoserver`.

> [!NOTE]  
> If you already have users with the same names on your Single Server or on-premises server from which you are migrating, and your target server, be aware that this restoration process might change the passwords for these roles. Consequently, any subsequent commands you need to execute may require the updated passwords. This does not apply if your source server is a Flexible Server, as Flexible Server does not allow dumping passwords for users due to enhanced security measures.


### Create a new database
Before restoring your database, you might need to create a new, empty database. To do this, user that you are using must have the `CREATEDB` permission. Here are two commonly used methods:

1. **Using `createdb` utility**
   The `createdb` program allows for database creation directly from the bash command line, without the need to log into PostgreSQL or leave the operating system environment. For instance:

   ```bash
   createdb <new database name> -h <server name> -U <user name>
   ```
   For example, if you have a server named `mydemoserver`, a user named `myuser` and the new database you want to create is `testdb_copy`, run the following command:

   ```bash
   createdb testdb_copy -h mydemoserver.postgres.database.azure.com -U myuser
   ```

   If you're using a Single Server, your username includes the server name component. Therefore, instead of `myuser`, use `myuser@mydemoserver`.

2. **Using SQL command**
To create a database using an SQL command, you'll need to connect to your PostgreSQL server via a command line interface or a database management tool. Once connected, you can use the following SQL command to create a new database:

```sql
CREATE DATABASE <new database name>;
```

Replace `<new database name>` with the name you wish to give your new database. For example, to create a database named `testdb_copy`, the command would be:

```sql
CREATE DATABASE testdb_copy;
```


### Restoring the dump
After you've created the target database, you can restore the data into this database from the dump file. During the restoration, log any errors to an `errors.log` file and check its content for any errors after the restore is done.

#### [pg_dump & psql - using singular text file](#tab/psql)
```bash
psql -f <database name>_dump.sql <new database name> -h <server name> -U <user name> 2> errors.log
```

For example, if you have a server named `mydemoserver`, a user named `myuser` and a new database called `testdb_copy`, run the following command:

```bash
psql -f testdb_dump.sql testdb_copy -h mydemoserver.postgres.database.azure.com -U myuser 2> errors.log
```


#### [pg_dump & pg_restore - using multiple cores](#tab/pgrestore)
```bash
pg_restore -Fd -j <number of cores> -d <new database name> <database name>.dump -h <server name> -U <user name> 2> errors.log
```

In these commands, the `-j` option stands for the number of cores you wish to use for the restore process. You can adjust this number based on how many cores are available on your PostgreSQL server and how many you would like to allocate for the restore process. Feel free to change this setting depending on your server's capacity and your performance requirements.

For example, if you have a server named `mydemoserver`, a user named `myuser` and a new database called `testdb_copy`, and you want to use two cores for the dump, run the following command:

```bash
pg_restore -Fd -j 2 -d testdb_copy testdb.dump -h mydemoserver.postgres.database.azure.com -U myuser 2> errors.log
```

---

## Post-restoration check
After the restoration process is complete, it's important to review the `errors.log` file for any errors that may have occurred. This step is crucial for ensuring the integrity and completeness of the restored data. Address any issues found in the log file to maintain the reliability of your database.



## Optimize the migration process

When working with large databases, the dump and restore process can be lengthy and may require optimization to ensure efficiency and reliability. It's important to be aware of the various factors that can impact the performance of these operations and to take steps to optimize them.

For detailed guidance on optimizing the dump and restore process, refer to the [Best practices for pg_dump and pg_restore](../flexible-server/how-to-pgdump-restore.md) article. This resource provides comprehensive information and strategies that can be beneficial for handling large databases.

## Next steps
- [Best practices for pg_dump and pg_restore](../flexible-server/how-to-pgdump-restore.md).
- For more information about migrating databases to Azure Database for PostgreSQL, see the [Database Migration Guide](/data-migration/).
