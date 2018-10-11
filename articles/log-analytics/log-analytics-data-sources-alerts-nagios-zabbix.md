---
title: Collect Nagios and Zabbix alerts in OMS Log Analytics | Microsoft Docs
description: Nagios and Zabbix are open source monitoring tools. You can collect alerts from these tools into Log Analytics in order to analyze them along with alerts from other sources.  This article describes how to configure the OMS Agent for Linux to collect alerts from these systems.
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
ms.date: 04/13/2018
ms.author: magoedte
ms.component: 
---

# Collect alerts from Nagios and Zabbix in Log Analytics from OMS Agent for Linux 
[Nagios](https://www.nagios.org/) and [Zabbix](http://www.zabbix.com/) are open source monitoring tools. You can collect alerts from these tools into Log Analytics in order to analyze them along with [alerts from other sources](log-analytics-alerts.md).  This article describes how to configure the OMS Agent for Linux to collect alerts from these systems.
 
## Prerequisites
The OMS Agent for Linux supports collecting alerts from Nagios up to version 4.2.x, and Zabbix up to version 2.x.

## Configure alert collection

### Configuring Nagios alert collection
To collect alerts, perform the following steps on the Nagios server.

1. Grant the user **omsagent** read access to the Nagios log file `/var/log/nagios/nagios.log`. Assuming the nagios.log file is owned by the group `nagios`, you can add the user **omsagent** to the **nagios** group. 

	sudo usermod -a -G nagios omsagent

2.	Modify the configuration file at `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`. Ensure the following entries are present and not commented out:  

        <source>  
          type tail  
          #Update path to point to your nagios.log  
	      path /var/log/nagios/nagios.log  
          format none  
          tag oms.nagios  
        </source>  
	  
        <filter oms.nagios>  
          type filter_nagios_log  
        </filter>  

3. Restart the omsagent daemon

    ```
    sudo sh /opt/microsoft/omsagent/bin/service_control restart
    ```

### Configuring Zabbix alert collection
To collect alerts from a Zabbix server, you need to specify a user and password in *clear text*.  While not ideal, we recommend that you create a Zabbix user with read-only permissions to catch relevant alarms.

To collect alerts on the Nagios server, perform the following steps.

1. Modify the configuration file at `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`. Ensure the following entries are present and not commented out.  Change the user name and password to values for your Zabbix environment.

        <source>
	     type zabbix_alerts
	     run_interval 1m
	     tag oms.zabbix
	     zabbix_url http://localhost/zabbix/api_jsonrpc.php
	     zabbix_username Admin
	     zabbix_password zabbix
        </source>

2. Restart the omsagent daemon

	`sudo sh /opt/microsoft/omsagent/bin/service_control restart`


## Alert records
You can retrieve alert records from Nagios and Zabbix using [log searches](log-analytics-log-searches.md) in Log Analytics.

### Nagios Alert records

Alert records collected by Nagios have a **Type** of **Alert** and a **SourceSystem** of **Nagios**.  They have the properties in the following table.

| Property | Description |
|:--- |:--- |
| Type |*Alert* |
| SourceSystem |*Nagios* |
| AlertName |Name of the alert. |
| AlertDescription | Description of the alert. |
| AlertState | Status of the service or host.<br><br>OK<br>WARNING<br>UP<br>DOWN |
| HostName | Name of the host that created the alert. |
| PriorityNumber | Priority level of the alert. |
| StateType | The type of state of the alert.<br><br>SOFT - Issue that has not been rechecked.<br>HARD - Issue that has been rechecked a specified number of times.  |
| TimeGenerated |Date and time the alert was created. |


### Zabbix alert records
Alert records collected by Zabbix have a **Type** of **Alert** and a **SourceSystem** of **Zabbix**.  They have the properties in the following table.

| Property | Description |
|:--- |:--- |
| Type |*Alert* |
| SourceSystem |*Zabbix* |
| AlertName | Name of the alert. |
| AlertPriority | Severity of the alert.<br><br>not classified<br>information<br>warning<br>average<br>high<br>disaster  |
| AlertState | State of the alert.<br><br>0 - State is up-to-date.<br>1 - State is unknown.  |
| AlertTypeNumber | Specifies whether alert can generate multiple problem events.<br><br>0 - State is up-to-date.<br>1 - State is unknown.    |
| Comments | Additional comments for alert. |
| HostName | Name of the host that created the alert. |
| PriorityNumber | Value indicating severity of the alert.<br><br>0 - not classified<br>1 - information<br>2 - warning<br>3 - average<br>4 - high<br>5 - disaster |
| TimeGenerated |Date and time the alert was created. |
| TimeLastModified |Date and time the state of the alert was last changed. |


## Next steps
* Learn about [alerts](log-analytics-alerts.md) in Log Analytics.
* Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions. 
