---
title: How To Configure Server Parameters in Azure Database for MySQL | Microsoft Docs
description: This article describes how to configure available server parameters in Azure Database for MySQL using the Azure portal.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: mysql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: portal
ms.date: 06/15/2017
---

# How to configure server parameters in Azure Database for MySQL using the Azure portal

Azure Database for MySQL supports configuration of some server parameters. This article explains where you can find the **Server parameters** setting page as well as a list to these parameters, their default values, and their selectable ranges.

## Navigate to **Server parameters** page

Login to Azure portal, then click on your MySQL server name. Under **SETTINGS** section, click **Server parameters** to open the Server parameters blade for the Azure Database for MySQL.

![Azure portal server parameters blade](./media/howto-server-parameters/auzre-portal-server-parameters.png)

## List of configurable server parameters

Below you can find a list of currently supported server parameters that can be configured easily according to your application demands.

<table table-layout="auto" border-collapse="collapse" width="100%">
  <th align="left"><strong>Parameter Name</strong>
    </td>
  <th align="left"><strong>Default Value</strong>
    </td>
  <th align="left"><strong>Range</strong>
    </td>
  <th align="left"><strong>Description</strong>
    </td>

  <tr>
    <td>binlog_group_commit_sync_delay</td>
    <td>1000</td>
    <td>0, 11-1000000</td>
    <td>Controls how many microseconds the binary log commit waits before synchronizing the binary log file to disk.</td>
  </tr>

  <tr>
    <td>binlog_group_commit_sync_no_delay_count</td>
    <td>0</td>
    <td>0-1000000</td>
    <td>The maximum number of transactions to wait for before aborting the current delay as specified by binlog-group-commit-sync-delay.</td>
  </tr>

  <tr>
    <td>character_set_server</td>
    <td>LATIN1</td>
    <td>BIG5, UTF8MB4, etc.</td>
    <td>Use charset_name as the default server character set.</td>
  </tr>

  <tr>
    <td>div_precision_increment</td>
    <td>4</td>
    <td>0-30</td>
    <td>Number of digits by which to increase the scale of the result of division operations.</td>
  </tr>

  <tr>
    <td>group_concat_max_len</td>
    <td>1024</td>
    <td>4-16777216</td>
    <td>Maximum allowed result length in bytes for the GROUP_CONCAT().</td>
  </tr>

  <tr>
    <td>innodb_adaptive_hash_index</td>
    <td>ON</td>
    <td>ON, OFF</td>
    <td>Whether innodb adaptive hash indexes are enabled or disabled.</td>
  </tr>

  <tr>
    <td>innodb_lock_wait_timeout</td>
    <td>50</td>
    <td>1-3600</td>
    <td>The length of time in seconds an InnoDB transaction waits for a row lock before giving up.</td>
  </tr>

  <tr>
    <td>interactive_timeout</td>
    <td>1800</td>
    <td>10-1800</td>
    <td>Number of seconds the server waits for activity on an interactive connection before closing it.</td>
  </tr>

  <tr>
    <td>log_bin_trust_function_creators</td>
    <td>OFF</td>
    <td>ON, OFF</td>
    <td>This variable applies when binary logging is enabled. It controls whether stored function creators can be trusted not to create stored functions that will cause unsafe events to be written to the binary log.</td>
  </tr>

  <tr>
    <td>log_queries_not_using_indexes</td>
    <td>OFF</td>
    <td>ON, OFF</td>
    <td>Logs queries that are expected to retrieve all rows to slow query log.</td>
  </tr>

  <tr>
    <td>log_slow_admin_statements</td>
    <td>OFF</td>
    <td>ON, OFF</td>
    <td>Include slow administrative statements in the statements written to the slow query log.</td>
  </tr>

  <tr>
    <td>log_throttle_queries_not_using_indexes</td>
    <td>0</td>
    <td>0-4294967295</td>
    <td>Limits the number of such queries per minute that can be written to the slow query log.</td>
  </tr>

  <tr>
    <td>long_query_time</td>
    <td>10</td>
    <td>1-1E+100</td>
    <td>If a query takes longer than this many seconds, the server increments the Slow_queries status variable.</td>
  </tr>

  <tr>
    <td>max_allowed_packet</td>
    <td>536870912</td>
    <td>1024-1073741824</td>
    <td>The maximum size of one packet or any generated/intermediate string, or any parameter sent by the mysql_stmt_send_long_data() C API function.</td>
  </tr>

  <tr>
    <td>min_examined_row_limit</td>
    <td>0</td>
    <td>0-18446744073709551615</td>
    <td>Can be used to cause queries which examine fewer than the stated number of rows not to be logged.</td>
  </tr>

  <tr>
    <td>server_id</td>
    <td>3293747068</td>
    <td>1000-4294967295</td>
    <td>The server ID, used in replication to give each master and slave a unique identity.</td>
  </tr>

  <tr>
    <td>slave_net_timeout</td>
    <td>60</td>
    <td>30-3600</td>
    <td>The number of seconds to wait for more data from the master before the slave considers the connection broken, aborts the read, and tries to reconnect.</td>
  </tr>

  <tr>
    <td>slow_query_log</td>
    <td>OFF</td>
    <td>ON, OFF</td>
    <td>Enable or disable the slow query log.</td>
  </tr>

  <tr>
    <td>sql_mode</td>
    <td>0 selected</td>
    <td>ALLOW_INVALID_DATES, IGNORE_SPACE, etc.</td>
    <td>The current server SQL mode.</td>
  </tr>

  <tr>
    <td>time_zone</td>
    <td>SYSTEM</td>
    <td>[+|-][0]{0,1}[0-9]:[0-5][0-9]|[+|-][1][0-2]:[0-5][0-9]|SYSTEM</td>
    <td>The server time zone.</td>
  </tr>

  <tr>
    <td>wait_timeout</td>
    <td>120</td>
    <td>60-240</td>
    <td>The number of seconds the server waits for activity on a noninteractive connection before closing it.</td>
  </tr>
</table>

## Next steps
- [Connection libraries for Azure Database for MySQL](concepts-connection-libraries.md)
