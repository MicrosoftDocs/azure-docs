---
title: Managing Nagios, Zabbix, SCOM alerts
description: Managing Nagios, Zabbix and SCOM alerts in Azure Monitor
author: anantr
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: anantr
ms.component: alerts
---

# Overview

You can now view your alerts from Nagios, Zabbix, and System Center Operations Manager in the unified alerts experience. These alerts come from integrations with Nagios/Zabbix servers or System Center Operations Manager into Log Analytics. 

## Prerequisites
Any records in the Log Analytics repository with a type of Alert will get imported into the unified alerts experience, so you must perform whatever configuration is required to collect these records.
1. For **Nagios** and **Zabbix** alerts, [configure those servers](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-linux-agents) to send alerts to Log Analytics.
1. For **System Center Operations Manager** alerts, [connect your Operations Manager management group to your Log Analytics workspace](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-om-agents). Any alerts created in System Center Operations Manager are imported into Log Analytics.

Once you have configured the import into Log Analytics, you’re good to go and can start viewing fired alerts from these sources in the unified alerts experience.

**Note**: Nagios alerts in the unified alerts experience are not stateful – a “fired” alert instance will not be changed to “resolved”. Instead, both the “fired” and “resolved” are displayed as separate alert instances. 
