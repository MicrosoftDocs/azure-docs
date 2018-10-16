---
title: Collect Linux application performance in OMS Log Analytics | Microsoft Docs
description: This article provides details for configuring the OMS Agent for Linux to collect performance counters for MySQL and Apache HTTP Server. 
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: f1d5bde4-6b86-4b8e-b5c1-3ecbaba76198
ms.service: log-analytics
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/04/2017
ms.author: magoedte
ms.component: 
---

# Collect performance counters for Linux applications in Log Analytics 
This article provides details for configuring the [OMS Agent for Linux](https://github.com/Microsoft/OMS-Agent-for-Linux) to collect performance counters for specific applications.  The applications included in this article are:  

- [MySQL](#MySQL)
- [Apache HTTP Server](#apache-http-server)

## MySQL
If MySQL Server or MariaDB Server is detected on the computer when the OMS agent is installed, a performance monitoring provider for MySQL Server will be automatically installed. This provider connects to the local MySQL/MariaDB server to expose performance statistics. MySQL user credentials must be configured so that the provider can access the MySQL Server.

### Configure MySQL credentials
The MySQL OMI provider requires a preconfigured MySQL user and installed MySQL client libraries in order to query the performance and health information from the MySQL instance.  These credentials are stored in an authentication file that's stored on the Linux agent.  The authentication file specifies what bind-address and port the MySQL instance is listening on and what credentials to use to gather metrics.  

During installation of the OMS Agent for Linux the MySQL OMI provider will scan MySQL my.cnf configuration files (default locations) for bind-address and port and partially set the MySQL OMI authentication file.

The MySQL authentication file is stored at `/var/opt/microsoft/mysql-cimprov/auth/omsagent/mysql-auth`.


### Authentication file format
Following is the format for the MySQL OMI authentication file

	[Port]=[Bind-Address], [username], [Base64 encoded Password]
	(Port)=(Bind-Address), (username), (Base64 encoded Password)
	(Port)=(Bind-Address), (username), (Base64 encoded Password)
	AutoUpdate=[true|false]

The entries in the authentication file are described in the following table.

| Property | Description |
|:--|:--|
| Port | Represents the current port the MySQL instance is listening on. Port 0 specifies that the properties following are used for default instance. |
| Bind-Address| Current MySQL bind-address. |
| username| MySQL user used to use to monitor the MySQL server instance. |
| Base64 encoded Password| Password of the MySQL monitoring user encoded in Base64. |
| AutoUpdate| Specifies whether to rescan for changes in the my.cnf file and overwrite the MySQL OMI Authentication file when the MySQL OMI Provider is upgraded. |

### Default instance
The MySQL OMI authentication file can define a default instance and port number to make managing multiple MySQL instances on one Linux host easier.  The default instance is denoted by an instance with port 0. All additional instances will inherit properties set from the default instance unless they specify different values. For example, if MySQL instance listening on port ‘3308’ is added, the default instance’s bind-address, username, and Base64 encoded password will be used to try and monitor the instance listening on 3308. If the instance on 3308 is bound to another address and uses the same MySQL username and password pair only the bind-address is needed, and the other properties will be inherited.

The following table has example instance settings 

| Description | File |
|:--|:--|
| Default instance and instance with port 3308. | `0=127.0.0.1, myuser, cnBwdA==`<br>`3308=, ,`<br>`AutoUpdate=true` |
| Default instance and instance with port 3308 and different user name and password. | `0=127.0.0.1, myuser, cnBwdA==`<br>`3308=127.0.1.1, myuser2,cGluaGVhZA==`<br>`AutoUpdate=true` |


### MySQL OMI Authentication File Program
Included with the installation of the MySQL OMI provider is a MySQL OMI authentication file program which can be used to edit the MySQL OMI Authentication file. The authentication file program can be found at the following location.

	/opt/microsoft/mysql-cimprov/bin/mycimprovauth

> [!NOTE]
> The credentials file must be readable by the omsagent account. Running the mycimprovauth command as omsgent is recommended.

The following table provides details on the syntax for using mycimprovauth.

| Operation | Example | Description
|:--|:--|:--|
| autoupdate *false or true* | mycimprovauth autoupdate false | Sets whether or not the authentication file will be automatically updated on restart or update. |
| default *bind-address username password* | mycimprovauth default 127.0.0.1 root pwd | Sets the default instance in the MySQL OMI authentication file.<br>The password field should be entered in plain text - the password in the MySQL OMI authentication file will be Base 64 encoded. |
| delete *default or port_num* | mycimprovauth 3308 | Deletes the specified instance by either default or by port number. |
| help | mycimprov help | Prints out a list of commands to use. |
| print | mycimprov print | Prints out an easy to read MySQL OMI authentication file. |
| update port_num *bind-address username password* | mycimprov update 3307 127.0.0.1 root pwd | Updates the specified instance or adds the instance if it does not exist. |

The following example commands define a default user account for the MySQL server on localhost.  The password field should be entered in plain text - the password in the MySQL OMI authentication file will be Base 64 encoded

	sudo su omsagent -c '/opt/microsoft/mysql-cimprov/bin/mycimprovauth default 127.0.0.1 <username> <password>'
	sudo /opt/omi/bin/service_control restart

### Database Permissions Required for MySQL Performance Counters
The MySQL User requires access to the following queries to collect MySQL Server performance data. 

	SHOW GLOBAL STATUS;
	SHOW GLOBAL VARIABLES:


The MySQL user also requires SELECT access to the following default tables.

- information_schema
- mysql. 

These privileges can be granted by running the following grant commands.

	GRANT SELECT ON information_schema.* TO ‘monuser’@’localhost’;
	GRANT SELECT ON mysql.* TO ‘monuser’@’localhost’;


> [!NOTE]
> To grant permissions to a MySQL monitoring user the granting user must have the ‘GRANT option’ privilege as well as the privilege being granted.

### Define performance counters

Once you configure the OMS Agent for Linux to send data to Log Analytics, you must configure the performance counters to collect.  Use the procedure in [Windows and Linux performance data sources in Log Analytics](log-analytics-data-sources-windows-events.md) with the counters in the following table.

| Object Name | Counter Name |
|:--|:--|
| MySQL Database | Disk Space in Bytes |
| MySQL Database | Tables |
| MySQL Server | Aborted Connection Pct |
| MySQL Server | Connection Use Pct |
| MySQL Server | Disk Space Use in Bytes |
| MySQL Server | Full Table Scan Pct |
| MySQL Server | InnoDB Buffer Pool Hit Pct |
| MySQL Server | InnoDB Buffer Pool Use Pct |
| MySQL Server | InnoDB Buffer Pool Use Pct |
| MySQL Server | Key Cache Hit Pct |
| MySQL Server | Key Cache Use Pct |
| MySQL Server | Key Cache Write Pct |
| MySQL Server | Query Cache Hit Pct |
| MySQL Server | Query Cache Prunes Pct |
| MySQL Server | Query Cache Use Pct |
| MySQL Server | Table Cache Hit Pct |
| MySQL Server | Table Cache Use Pct |
| MySQL Server | Table Lock Contention Pct |

## Apache HTTP Server 
If Apache HTTP Server is detected on the computer when the omsagent bundle is installed, a performance monitoring provider for Apache HTTP Server will be automatically installed. This provider relies on an Apache module that must be loaded into the Apache HTTP Server in order to access performance data. The module can be loaded with the following command:
```
sudo /opt/microsoft/apache-cimprov/bin/apache_config.sh -c
```

To unload the Apache monitoring module, run the following command:
```
sudo /opt/microsoft/apache-cimprov/bin/apache_config.sh -u
```

### Define performance counters

Once you configure the OMS Agent for Linux to send data to Log Analytics, you must configure the performance counters to collect.  Use the procedure in [Windows and Linux performance data sources in Log Analytics](log-analytics-data-sources-windows-events.md) with the counters in the following table.

| Object Name | Counter Name |
|:--|:--|
| Apache HTTP Server | Busy Workers |
| Apache HTTP Server | Idle Workers |
| Apache HTTP Server | Pct Busy Workers |
| Apache HTTP Server | Total Pct CPU |
| Apache Virtual Host | Errors per Minute - Client |
| Apache Virtual Host | Errors per Minute - Server |
| Apache Virtual Host | KB per Request |
| Apache Virtual Host | Requests KB per Second |
| Apache Virtual Host | Requests per Second |



## Next steps
* [Collect performance counters](log-analytics-data-sources-performance-counters.md) from Linux agents.
* Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions. 
