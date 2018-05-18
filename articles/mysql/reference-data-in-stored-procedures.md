---
title: Azure Database for MySQL Data-in Replication Stored Procedures
description: This topic introduces all stored procedures used for Data-in Replication.
services: mysql
author: ajlam
ms.author: andrela
manager: kfile
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 05/18/2018
---

# Azure Database for MySQL Data-in Replication Stored Procedures

Data-in Replication allows you to synchronize the data from a MySQL server that is running locally on-premises or in other hosted cloud locations into an Azure Database for MySQL server.

Users should use the below stored procedures to set up or remove Data-in Replication between primary and replica:

|**Stored Procedure Name**|**Input Parameters**|**Output Parameters**|**Usage Note**|
|-----|-----|-----|-----|
|*mysql.az_replication_change_primary*|master_host<br/>master_user<br/>master_password<br/>master_port<br/>master_log_file<br/>master_log_pos<br/>master_ssl_ca|N/A|To transfer data with SSL mode, pass in the CA certificate’s context into the master_ssl_ca parameter.</br>To transfer data without SSL, pass in an empty string into the master_ssl_ca parameter.|
|*mysql.az_replication _start*|N/A|N/A|Starts replication.|
|*mysql.az_replication _stop*|N/A|N/A|Stops replication.|
|*mysql.az_replication _remove_primary*|N/A|N/A|Removes the replication relationship between the primary and replica.|
|*mysql.az_replication_skip_counter*|N/A|N/A|Skips one replication error.|

To setup data-in replication between a primary and a replica in Azure Database for MySQL, please refer to [how to configure data-in replication](howto-data-in-replication.md).