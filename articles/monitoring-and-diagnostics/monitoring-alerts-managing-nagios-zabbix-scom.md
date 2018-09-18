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

# Managing alerts from other monitoring services

You can now view your alerts from Nagios, Zabbix, and System Center Operations Manager in the [unified alerts experience](https:). These alerts come from integrations with Nagios/Zabbix servers or System Center Operations Manager into Log Analytics. 

## Prerequisites
Any records in the Log Analytics repository with a type of Alert will get imported into the unified alerts experience, so you must perform the configuration that is required to collect these records.
1. For **Nagios** and **Zabbix** alerts, [configure those servers](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-linux-agents) to send alerts to Log Analytics.
1. For **System Center Operations Manager** alerts, [connect your Operations Manager management group to your Log Analytics workspace](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-om-agents). Any alerts created in System Center Operations Manager are imported into Log Analytics.

Once you have configured the import into Log Analytics, youd can start viewing fired alerts from these sources in the unified alerts experience. Once they are present in the unified alerts experience, you can [manage your alert instances](https://aka.ms/managing-alert-instances), [manage smart groups created on these alerts](https://aka.ms/managing-smart-groups) and [change the state of your alerts and smart groups](https://aka.ms/managing-alert-smart-group-states).

**Note**: Nagios alerts in the unified alerts experience are not stateful – for example, the [monitor condition](https://aka.ms/azure-alerts-overview) of an alert will not go from "Fired" to "Resolved". Instead, both the “Fired” and “Resolved” are displayed as separate alert instances. 
