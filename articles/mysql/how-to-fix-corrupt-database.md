---
title: Resolve Database corruption - Azure Database for MySQL
description: Learn about how to fix database corruption issues for Azure Database for MySQL
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: how-to
ms.date: 09/21/2020
---

# Troubleshoot database corruption on Azure Database for MySQL
[!INCLUDE[applies-to-single-flexible-server](includes/applies-to-single-flexible-server.md)]

Database corruption can cause downtime for your application and it is also critical to resolve the issue in time to avoid data loss. When database corruption occurs you will see in your server logs this error **InnoDB: Database page corruption on disk or a failed**.

In this guide you will learn how to fix if database or table is corrupted. Azure Database for MySQL uses InnoDB engine and it features automated corruption checking and repair operations. InnoDB checks for corrupted pages by performing checksums on every page it reads, and if it finds a checksum discrepancy it will automatically stop the MySQL server.

Try any of these options below to help quickly mitigate your database corruption issues.

## Restart your MySQL server

You typically notice that a database or table is corrupted when your application access that table ro database. Since InnoDB features a crash recovery mechanism that can resolve most issues when the server is restarted. Hence restarting the server should help the server recover from a crash that caused the database to be in bad state.

##  Resolve data corruption with Dump and restore method

It is recommended to resolve the corruption issue with a **dump and restore method**. This involves getting access to the corrupted table, using the **mysqldump** utility to create a logical backup of the table, which will retain the table structure and the data within it, and then reloading the table back into the database.

### Backup your database or tables

> [!Important]
> - Make your have configured a firewall rule in order to access the server from your client machine. See how to configure [firewall rule on single server](howto-manage-firewall-using-portal.md) and [firewall rule on flexible server](flexible-server/how-to-connect-tls-ssl.md).
> - Use SSL option ```--ssl-cert``` for **mysqldump** if SSL enabled

Create a backup file from the command-line using mysqldump using this command

```
$ mysqldump [--ssl-cert=/path/to/pem] -h [host] -u [uname] -p[pass] [dbname] > [backupfile.sql]
```

The parameters to provide are:
- [ssl-cert=/path/to/pem] Download the SSL cert on your client machine and set the path in it in the command. DO NOT use this is SSL is disabled.
- [host] is your Azure Database for MySQL server
- [uname] is your server admin username
- [pass]  is the password for your admin user
- [dbname] is the name of your database
- [backupfile.sql] if the filename for your database backup

> [!Important]
> - For Single server use the format ```admin-user@servername``` to replace ```myserveradmin``` in the commands below.
> - For Flexible server use the format ```admin-user``` to replace ```myserveradmin``` in the commands below.

If a specific table is corrupted, then select specific tables in your database to back up using this example
```
$ mysqldump --ssl-cert=</path/to/pem> -h mydemoserver.mysql.database.azure.com -u myserveradmin -p testdb table1 table2 > testdb_tables_backup.sql
```

To back up one or more databases, use the --database switch and list the database names separated by spaces.

```
$ mysqldump --ssl-cert=</path/to/pem>  -h mydemoserver.mysql.database.azure.com -u myserveradmin -p --databases testdb1 testdb3 testdb5 > testdb135_backup.sql
```

###  Restore your database or tables

The following steps show you how tp restore your database or tables. Once the backup file is created, you can restore the table or databases using ***mysql** utility. Run the command as shown below:

```
mysql  --ssl-cert=</path/to/pem> -h [hostname] -u [uname] -p[pass] [db_to_restore] < [backupfile.sql]
```
Here is an example of the restoring ```testdb``` from backup file created with **mysqldump**. 

> [!Important]
> - For Single server use the format ```admin-user@servername``` to replace ```myserveradmin``` in the command below.
> - For Flexible server use the format ```admin-user``` to replace ```myserveradmin``` in the command below. 

```
$ mysql --ssl-cert=</path/to/pem> -h mydemoserver.mysql.database.azure.com -u myserveradmin -p testdb < testdb_backup.sql
```

## Next Steps
If the above steps do not help resolve the issue, you can always restore the entire server.
- [Restore a  Azure Database for MySQL Single Server](howto-restore-server-portal.md)
- [Restore a Azure Database for MySQL Flexible Server](flexible-server/how-to-restore-server-portal.md)



