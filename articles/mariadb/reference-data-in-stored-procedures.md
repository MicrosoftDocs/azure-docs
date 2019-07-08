---
title: Azure Database for MariaDB Data-in Replication Stored Procedures
description: This article introduces all stored procedures used for Data-in Replication.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: reference
ms.date: 09/24/2018
---

# Azure Database for MariaDB Data-in Replication Stored Procedures

Data-in Replication allows you to synchronize data from a MariaDB server running on-premises, in virtual machines, or database services hosted by other cloud providers into the Azure Database for MariaDB service.

The following stored procedures are used to set up or remove Data-in Replication between a master and replica.

|**Stored Procedure Name**|**Input Parameters**|**Output Parameters**|**Usage Note**|
|-----|-----|-----|-----|
|*mysql.az_replication_change_master*|master_host<br/>master_user<br/>master_password<br/>master_port<br/>master_log_file<br/>master_log_pos<br/>master_ssl_ca|N/A|To transfer data with SSL mode, pass in the CA certificate’s context into the master_ssl_ca parameter. </br><br>To transfer data without SSL, pass in an empty string into the master_ssl_ca parameter.|
|*mysql.az_replication _start*|N/A|N/A|Starts replication.|
|*mysql.az_replication _stop*|N/A|N/A|Stops replication.|
|*mysql.az_replication _remove_master*|N/A|N/A|Removes the replication relationship between the master and replica.|
|*mysql.az_replication_skip_counter*|N/A|N/A|Skips one replication error.|

To set up data-in replication between a master and a replica in Azure Database for MariaDB, refer to [how to configure data-in replication](howto-data-in-replication.md).
