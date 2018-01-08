---
title: 'Azure Database for MySQL Data-in Replication Store Procedures | Microsoft Docs'
description: 'This topic introduce all store procedures relates to Data-in Replication.'
services: mysql
author: wuta
ms.author: wuta
manager: Jason.M.Anderson
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 01/02/2018
---
# Azure Database for MySQL Data-in Replication Store Procedures
Azure Database for MySQL Data-in Replication is a service built on Azure Database for MySQL that lets you synchronize the data from an MySQL server that is running locally or in other locations to a server that is running on Azure Database for MySQL.

User should use below store procedure to set up or remove Data-in Replication between primary and replica:

> [!div class="mx-tableFixed"]
|**Store Procedure Name**|**Input Parameters**|**Output Parameters**|**Usage Note**|
|-----|-----|-----|-----|
|*MySql.az_replication_change_primary*|master_host  master_user  master_password  master_port  master_log_file  master_log_pos  master_ssl_ca|Void|If parameter *master_ssl_ca* is 0, it replicas without SSL. If it  
is not empty, the replication will transfer data in SSL mode.|
|*MySql.az_replication _start*|Void|Void|Starts both IO-Tread and SQL Thread.|
|*MySql.az_replication _stop*|Void|Void|Stops both IO-Tread and SQL Thread.|
|*MySql.az_replication _remove_primary*|Void|Void||
|*MySql.az_replication_skip_counter*|Void|Void|Skips one replication error for one time.|

## Example
Below example can be used to config an external as primary and an MySQL instance inside Azure as replica server for replication.

```sql
CALL mysql.az_replication_change_primary('primary.companya.com', 'syncuser', 'yourpassowrd', 3306, 'mysql-bin.000002', 120, '');
```
 
- **primary.companya.com** is the host name of the primary server. Usually, it is an instance running external to Azure. It can be IP address.

- You can use **show master status** command on primary server to ascertain the current binary log file name and offset.

- Call **show slave status** command on replica server to see replication status.  

```sql
show slave status ();
```

If state of *SLAVE_IO_Running* and *Slave_SQL_Running* are **yes**, that means the replication works well.

## Next steps 
For more information about MySQL Data-in Replication, see:
- [MySQL Data-in Replication Concept](./concepts-data-in.md)
- [Getting Started with Azure Database for MySQL Data-in Replication](./howto-data-in.md)

For more information about Azure Database for MySQL, see:
- [Azure Database for MySQL Overview](./overview.md)