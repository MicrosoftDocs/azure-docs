---
title: Collect data from CollectD in OMS Log Analytics | Microsoft Docs
description: CollectD is an open source Linux daemon that periodically collects data from applications and system level information.  This article provides information on collecting data from CollectD in Log Analytics.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.assetid: f1d5bde4-6b86-4b8e-b5c1-3ecbaba76198
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/04/2017
ms.author: bwren

---
# Collect data from CollectD on Linux agents in Log Analytics
[CollectD](https://collectd.org/) is an open source Linux daemon that periodically collects data from applications and system level information. Example applications include the Java Virtual Machine (JVM), MySQL Server, and Nginx. This article provides information on collecting data from CollectD in Log Analytics.

A full list of available plugins can be found at [Table of Plugins](https://collectd.org/wiki/index.php/Table_of_Plugins).


![CollectD overview](media/log-analytics-data-sources-collectd/overview.png)

## Versions supported
- Log Analytics currently supports CollectD version 4.8 and above.
- OMS Agent for Linux v1.1.0-217 or above is required for CollectD metric collection.


## Configuration
There basic steps to configure collection of CollectD data in Log Analytics.

1. Configure CollectD to send data to the OMS Agent for Linux using the write_http plugin.  
2. Configure the OMS Agent for Linux to listen for the CollectD data on the appropriate port.
3. Restart CollectD and OMS Agent for Linux.


### Installation program
If you [install the OMS Agent for Linux](http://github.com/Microsoft/OMS-Agent-for-Linux) using the **–collectd** switch, both configuration files are installed with default settings. This configures both CollectD sending data to the agent and the agent listening for CollectD data.

	sudo sh ./omsagent-1.2.0-25.universal.x64.sh --upgrade --collectd -w <YOUR OMS WORKSPACE ID> -s <YOUR OMS WORKSPACE PRIMARY KEY>

If OMS Agent for Linux is already installed on your machine, you can run the following command to copy the configuration file.

	sudo /opt/microsoft/omsagent/bin/omsadmin.sh –c

### Configure CollectD to forward data 
CollectD is instructed to forward data to the OMS Agent for Linux using write_http with the `oms.conf` configuration file.  The default version of this file that sends CollectD data to port 26000 is included with the OMS Agent for Linux installation and is automatically copied to **/etc/collectd/collectd.conf.d** by the installation program.  

Following is the contents of the default version of `oms.conf`.  This is valid for CollectD version 5.5 and later.

	LoadPlugin write_http
	
	<Plugin write_http>
	         <Node "oms">
	         URL "127.0.0.1:26000/oms.collectd"
	         Format "JSON"
	         StoreRates true
	         </Node>
	</Plugin>


For versions of CollectD before 5.5, modify `oms.conf` to the following format.

	LoadPlugin write_http
		
	<Plugin write_http>
	       <URL "127.0.0.1:26000/oms.collectd">
	        Format "JSON"
	         StoreRates true
	       </URL>
	</Plugin>



### Configure OMS Agent for Linux to listen for CollectD data
The OMS Agent for Linux is instructed to listen for CollectD data with the `collectd.conf` configuration file. The default version of this file that listens on port 26000 is included with the OMS Agent for Linux installation and is automatically copied to **/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.d/** by the installation program.  


Following is the contents of the default version of `collectd.conf`.

	<source>
	 type http
	  port 26000
	  bind 127.0.0.1
	</source>
	
	<filter oms.collectd>
	  type filter_collectd
	</filter>


### Restart CollectD and OMS Agent for Linux
You can restart CollectD and OMS Agent for Linux with the following commands.

    sudo service collectd restart
    sudo /opt/microsoft/omsagent/bin/service_control restart


## CollectD metrics to Log Analytics schema conversion
To maintain a familiar model between infrastructure metrics already collected by OMS Agent for Linux and the new metrics collected by CollectD the following schema mapping is used:

| CollectD Metric field | Log Analytics field |
|:--|:--|
| host | Computer |
| plugin | None |
| plugin_instance | Instance Name<br>If **plugin_instance** is *null* then InstanceName="*_Total*" |
| type | ObjectName |
| type_instance | CounterName<br>If **type_instance** is *null* then CounterName=**blank** |
| dsnames[] | CounterName |
| dstypes | None |
| values[] | CounterValue |

## Next steps
* Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions. 
* Use [Custom Fields](log-analytics-custom-fields.md) to parse data from syslog records into individual fields.
* [Configure Linux agents](log-analytics-linux-agents.md) to collect other types of data. 
