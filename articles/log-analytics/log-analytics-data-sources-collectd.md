---
title: Collect data from CollectD in OMS Log Analytics | Microsoft Docs
description: CollectD is an open source Linux daemon that periodically collects data from applications and system level information.  This article provides information on collecting data from CollectD in Log Analytics.
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
ms.date: 05/02/2017
ms.author: magoedte
ms.component: 
---

# Collect data from CollectD on Linux agents in Log Analytics
[CollectD](https://collectd.org/) is an open source Linux daemon that periodically collects performance metrics from applications and system level information. Example applications include the Java Virtual Machine (JVM), MySQL Server, and Nginx. This article provides information on collecting performance data from CollectD in Log Analytics.

A full list of available plugins can be found at [Table of Plugins](https://collectd.org/wiki/index.php/Table_of_Plugins).

![CollectD overview](media/log-analytics-data-sources-collectd/overview.png)

The following CollectD configuration is included in the OMS Agent for Linux to route  CollectD data to the OMS Agent for Linux.

    LoadPlugin write_http

    <Plugin write_http>
         <Node "oms">
         URL "127.0.0.1:26000/oms.collectd"
         Format "JSON"
         StoreRates true
         </Node>
    </Plugin>

Additionally, if using an versions of collectD before 5.5 use the following configuration instead.

    LoadPlugin write_http

    <Plugin write_http>
       <URL "127.0.0.1:26000/oms.collectd">
        Format "JSON"
         StoreRates true
       </URL>
    </Plugin>

The CollectD configuration uses the default`write_http` plugin to send performance metric data over port 26000 to OMS Agent for Linux. 

> [!NOTE]
> This port can be configured to a custom-defined port if needed.

The OMS Agent for Linux also listens on port 26000 for CollectD metrics and then converts them to OMS schema metrics. The following is the OMS Agent for Linux configuration  `collectd.conf`.

    <source>
      type http
      port 26000
      bind 127.0.0.1
    </source>

    <filter oms.collectd>
      type filter_collectd
    </filter>


## Versions supported
- Log Analytics currently supports CollectD version 4.8 and above.
- OMS Agent for Linux v1.1.0-217 or above is required for CollectD metric collection.


## Configuration
The following are basic steps to configure collection of CollectD data in Log Analytics.

1. Configure CollectD to send data to the OMS Agent for Linux using the write_http plugin.  
2. Configure the OMS Agent for Linux to listen for the CollectD data on the appropriate port.
3. Restart CollectD and OMS Agent for Linux.

### Configure CollectD to forward data 

1. To route CollectD data to the OMS Agent for Linux, `oms.conf` needs to be added to CollectD's configuration directory. The destination of this file depends on the Linux  distro of your machine.

    If your CollectD config directory is located in /etc/collectd.d/:

        sudo cp /etc/opt/microsoft/omsagent/sysconf/omsagent.d/oms.conf /etc/collectd.d/oms.conf

    If your CollectD config directory is located in /etc/collectd/collectd.conf.d/:

        sudo cp /etc/opt/microsoft/omsagent/sysconf/omsagent.d/oms.conf /etc/collectd/collectd.conf.d/oms.conf

    >[!NOTE]
    >For CollectD versions before 5.5 you will have to modify the tags in `oms.conf` as shown above.
    >

2. Copy collectd.conf to the desired workspace's omsagent configuration directory.

        sudo cp /etc/opt/microsoft/omsagent/sysconf/omsagent.d/collectd.conf /etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.d/
        sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.d/collectd.conf

3. Restart CollectD and OMS Agent for Linux with the following commands.

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

