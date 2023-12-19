---
title: Resolve database corruption
description: Learn about how to fix database corruption problems in Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
author: mksuni
ms.author: sumuth
ms.topic: troubleshooting
ms.date: 06/20/2022
---

# Troubleshoot database corruption in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Database corruption can cause downtime for your application. It's also critical to resolve corruption problems in time to avoid data loss. When database corruption occurs, you see this error in your server logs: `InnoDB: Database page corruption on disk or a failed.`

In this article, you learn how to resolve database or table corruption problems. Azure Database for MySQL flexible server uses the InnoDB engine. It features automated corruption checking and repair operations. InnoDB checks for corrupt pages by running checksums on every page it reads. If it finds a checksum discrepancy, it will automatically stop the Azure Database for MySQL flexible server instance.

Try the following options to quickly mitigate your database corruption problems.

## Restart your MySQL server

You typically notice a database or table is corrupt when your application accesses the table or database. InnoDB features a crash recovery mechanism that can resolve most problems when the server is restarted. So restarting the server can help the server recover from a crash that caused the database to be in a bad state.

## Use the dump and restore method

We recommend that you resolve corruption problems by using a *dump and restore* method. This method involves:

1. Accessing the corrupt table.
2. Using the mysqldump utility to create a logical backup of the table. The backup will retain the table structure and the data within it.
3. Reloading the table into the database.

### Back up your database or tables

> [!Important]
>
> - Make sure you have configured a firewall rule to access the server from your client machine. For more information, see [configure a firewall rule on Azure Database for MySQL single server](../single-server/how-to-manage-firewall-using-portal.md) and [configure a firewall rule on Azure Database for MySQL flexible server](how-to-connect-tls-ssl.md).
> - Use SSL option `--ssl-cert` for mysqldump if you have SSL enabled.

Create a backup file from the command line by using mysqldump. Use this command:

```
$ mysqldump [--ssl-cert=/path/to/pem] -h [host] -u [uname] -p[pass] [dbname] > [backupfile.sql]
```

Parameter descriptions:
- `[ssl-cert=/path/to/pem]`: The path to the SSL certificate. Download the SSL certificate on your client machine and set the path in it in the command. Don't use this parameter if SSL is disabled.
- `[host]`: Your Azure Database for MySQL flexible server instance.
- `[uname]`: Your server admin user name.
- `[pass]`: The password for your admin user.
- `[dbname]`: The name of your database.
- `[backupfile.sql]`: The file name of your database backup.

> [!Important]
> - For Azure Database for MySQL single server, use the format `admin-user@servername` to replace `myserveradmin` in the following commands.
> - For Azure Database for MySQL flexible server, use the format `admin-user` to replace `myserveradmin` in the following commands.

If a specific table is corrupt, select specific tables in your database to back up:
```
$ mysqldump --ssl-cert=</path/to/pem> -h mydemoserver.mysql.database.azure.com -u myserveradmin -p testdb table1 table2 > testdb_tables_backup.sql
```

To back up one or more databases, use the `--database` switch and list the database names, separated by spaces:

```
$ mysqldump --ssl-cert=</path/to/pem>  -h mydemoserver.mysql.database.azure.com -u myserveradmin -p --databases testdb1 testdb3 testdb5 > testdb135_backup.sql
```

### Restore your database or tables

The following steps show how to restore your database or tables. After you create the backup file, you can restore the tables or databases by using the mysql utility. Run this command:

```
mysql  --ssl-cert=</path/to/pem> -h [hostname] -u [uname] -p[pass] [db_to_restore] < [backupfile.sql]
```
Here's an example that restores `testdb` from a backup file created with mysqldump: 

> [!Important]
> - For Azure Database for MySQL single server, use the format `admin-user@servername` to replace `myserveradmin` in the following command.
> - For Azure Database for MySQL flexible server, use the format ```admin-user``` to replace `myserveradmin` in the following command. 

```
$ mysql --ssl-cert=</path/to/pem> -h mydemoserver.mysql.database.azure.com -u myserveradmin -p testdb < testdb_backup.sql
```

## Next steps
If the preceding steps don't resolve the problem, you can always restore the entire server:
- [Restore server in Azure Database for MySQL single server](../single-server/how-to-restore-server-portal.md)
- [Restore server in Azure Database for MySQL flexible server](how-to-restore-server-portal.md)



