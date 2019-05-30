---
title: Manage alerts from SCOM, Zabbix and Nagios in Azure Monitor
description: Manage alerts from SCOM, Zabbix and Nagios in Azure Monitor
author: anantr
services: monitoring
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: anantr
ms.subservice: alerts
---

# Manage alerts from SCOM, Zabbix and Nagios in Azure Monitor

You can now view your alerts from Nagios, Zabbix, and System Center Operations Manager in [Azure Monitor](https://aka.ms/azure-alerts-overview). These alerts come from integrations with Nagios/Zabbix servers or System Center Operations Manager into Log Analytics. 

## Prerequisites
Any records in the Log Analytics repository with a type of Alert will get imported into Azure Monitor, so you must perform the configuration that is required to collect these records.
1. For **Nagios** and **Zabbix** alerts, [configure those servers](https://docs.microsoft.com/azure/log-analytics/log-analytics-linux-agents) to [send alerts](https://docs.microsoft.com/azure/azure-monitor/platform/data-sources-alerts-nagios-zabbix?toc=%2Fazure%2Fazure-monitor%2Ftoc.json) to Log Analytics.
1. For **System Center Operations Manager** alerts, [connect your Operations Manager management group to your Log Analytics workspace](https://docs.microsoft.com/azure/log-analytics/log-analytics-om-agents). Following this, deploy the [Alert Management](https://docs.microsoft.com/azure/azure-monitor/platform/alert-management-solution) solution from the Azure solutions marketplace. Once done, any alerts created in System Center Operations Manager are imported into Log Analytics.

## View your alert instances
Once you have configured the import into Log Analytics, you can start viewing alert instances from these monitoring services in [Azure Monitor](https://aka.ms/azure-alerts-overview). Once they are present in Azure Monitor, you can [manage your alert instances](https://aka.ms/managing-alert-instances), [manage smart groups created on these alerts](https://aka.ms/managing-smart-groups) and [change the state of your alerts and smart groups](https://aka.ms/managing-alert-smart-group-states).

> [!NOTE]
>  1. This solution only allows you to view SCOM/Zabbix/Nagios fired alert instances in Azure Monitor. Alert rule configuration can only be viewed/edited in respective monitoring tools. 
>  1. All fired alert instances will be available both in Azure Monitor and Azure Log Analytics. Currently, there is no way to choose between the two or ingest only specific fired alerts.
>  1. All alerts from SCOM, Zabbix and Nagios have the signal type "Unknown" since the underlying telemetry type is not available.
>  1. Nagios alerts are not stateful – for example, the [monitor condition](https://aka.ms/azure-alerts-overview) of an alert will not go from "Fired" to "Resolved". Instead, both the “Fired” and “Resolved” are displayed as separate alert instances. 

