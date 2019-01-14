---
title: Manage alerts from SCOM, Zabbix and Nagios in Azure Monitor
description: Manage alerts from SCOM, Zabbix and Nagios in Azure Monitor
author: anantr
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: anantr
ms.component: alerts
---

# Manage alerts from SCOM, Zabbix and Nagios in Azure Monitor

You can now view your alerts from Nagios, Zabbix, and System Center Operations Manager in the [unified alerts experience](https://aka.ms/azure-alerts-overview). These alerts come from integrations with Nagios/Zabbix servers or System Center Operations Manager into Log Analytics. 

## Prerequisites
Any records in the Log Analytics repository with a type of Alert will get imported into the unified alerts experience, so you must perform the configuration that is required to collect these records.
1. For **Nagios** and **Zabbix** alerts, [configure those servers](https://docs.microsoft.com/azure/log-analytics/log-analytics-linux-agents) to [send alerts](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-sources-alerts-nagios-zabbix?toc=%2Fazure%2Fazure-monitor%2Ftoc.json) to Log Analytics.
1. For **System Center Operations Manager** alerts, [connect your Operations Manager management group to your Log Analytics workspace](https://docs.microsoft.com/azure/log-analytics/log-analytics-om-agents). Following this, the ["Alert Management"](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/alert-management-solution) solution has to be deployed from the Azure solutions marketplace. Once done, any alerts created in System Center Operations Manager are imported into Log Analytics.

## View your alert instances
Once you have configured the import into Log Analytics, you can start viewing alert instances from these monitoring services in the [unified alerts experience](https://aka.ms/azure-alerts-overview). Once they are present in the unified alerts experience, you can [manage your alert instances](https://aka.ms/managing-alert-instances), [manage smart groups created on these alerts](https://aka.ms/managing-smart-groups) and [change the state of your alerts and smart groups](https://aka.ms/managing-alert-smart-group-states).

> [!NOTE]
>  1. This method only allows you to view the alert instances on Azure Monitor, and not the alert rule configurations themselves.
>  1. Currently, you cannot filter or choose the alert instances that can be managed on Azure Monitor. As soon as the alert is populated in Log Analytics, it will turn up on the Alerts blade in Azure Monitor.
>  1. These alerts from SCOM, Zabbix and Nagios will be populated with the signal type "Unknown".
>  1. Nagios alerts in the unified alerts experience are not stateful – for example, the [monitor condition](https://aka.ms/azure-alerts-overview) of an alert will not go from "Fired" to "Resolved". Instead, both the “Fired” and “Resolved” are displayed as separate alert instances. 
