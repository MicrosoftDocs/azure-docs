---
title: Manage alerts from System Center Operations Manager, Zabbix and Nagios in Azure Monitor
description: Manage alerts from System Center Operations Manager, Zabbix and Nagios in Azure Monitor
ms.topic: conceptual
ms.date: 09/24/2018
ms.subservice: alerts
---

# Manage alerts from System Center Operations Manager, Zabbix and Nagios in Azure Monitor

You can now view your alerts from Nagios, Zabbix, and System Center Operations Manager in [Azure Monitor](./alerts-overview.md). These alerts come from integrations with Nagios/Zabbix servers or System Center Operations Manager into Log Analytics. 

## Prerequisites
Any records in the Log Analytics repository with a type of Alert will get imported into Azure Monitor, so you must perform the configuration that is required to collect these records.
1. For **Nagios** and **Zabbix** alerts, [configure those servers](../learn/quick-collect-linux-computer.md) to [send alerts](./data-sources-custom-logs.md?toc=/azure/azure-monitor/toc.json) to Log Analytics.
1. For **System Center Operations Manager** alerts, [connect your Operations Manager management group to your Log Analytics workspace](./om-agents.md). Following this, deploy the [Alert Management](./alert-management-solution.md) solution from the Azure solutions marketplace. Once done, any alerts created in System Center Operations Manager are imported into Log Analytics.

## View your alert instances
Once you have configured the import into Log Analytics, you can start viewing alert instances from these monitoring services in [Azure Monitor](./alerts-overview.md). Once they are present in Azure Monitor, you can [manage your alert instances](./alerts-managing-alert-instances.md?toc=%252fazure%252fazure-monitor%252ftoc.json), [manage smart groups created on these alerts](./alerts-managing-smart-groups.md?toc=%252fazure%252fazure-monitor%252ftoc.json) and [change the state of your alerts and smart groups](./alerts-managing-alert-states.md?toc=%252fazure%252fazure-monitor%252ftoc.json).

> [!NOTE]
>  1. This solution only allows you to view System Center Operations Manager/Zabbix/Nagios fired alert instances in Azure Monitor. Alert rule configuration can only be viewed/edited in respective monitoring tools. 
>  1. All fired alert instances will be available both in Azure Monitor and Azure Log Analytics. Currently, there is no way to choose between the two or ingest only specific fired alerts.
>  1. All alerts from System Center Operations Manager, Zabbix and Nagios have the signal type "Unknown" since the underlying telemetry type is not available.
>  1. Nagios alerts are not stateful – for example, the [monitor condition](./alerts-overview.md) of an alert will not go from "Fired" to "Resolved". Instead, both the “Fired” and “Resolved” are displayed as separate alert instances.