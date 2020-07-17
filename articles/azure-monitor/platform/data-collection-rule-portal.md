---
title: Configure data collection for the Azure Monitor agent using the Azure portal (preview)
description: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/11/2020

---

# Configure data collection for the Azure Monitor agent using the Azure portal (preview)
Data Collection Rules (DCR) define the details of data to be collected from the guest operating system of virtual machines monitored by the Azure Monitor Agent. This article describes the procedure to create a data collection rule and assign it to a set of virtual machines using the Azure portal. This process will automatically add the Azure Monitor Agent to any selected VM that doesn't already have it installed.

## Create data collection rule
In the **Azure Monitor** menu in the Azure portal, select **Data Collection Rules** from the **Settings** section. Click **Add** to add a new Data Collection Rule and assignment.

![Data Collection Rules](media/azure-monitor-agent/data-collection-rules.png)

Click **Add** to create a new rule and set of associations. Provide a **Rule name** and specify a **Subscription** and **Resource Group**.  

![Data Collection Rule Basics](media/azure-monitor-agent/data-collection-rule-basics.png)

In the **Virtual machines** tab, add VMs that should have the Data Collection Rule applied. The Azure Monitor Agent will be installed on VMs that don't already have it installed.

![Data Collection Rule virtual machines](media/azure-monitor-agent/data-collection-rule-vms.png)

On the **Collect and deliver** tab, click **Add data source** to add a data source and destination set. Select a **Data source type**, and the corresponding details to select will be displayed. For performance counters, you can select from a predefined set of objects and their sampling rate. For events, you can select from a set of logs or facilities and the severity level. 

![Data source basic](media/azure-monitor-agent/data-collection-rule-data-source-basic.png)


To specify other logs and performance counters, select **Custom**.

![Data source custom](media/azure-monitor-agent/data-collection-rule-data-source-custom.png)

One the **Destination** tab, add one or more destinations for the data source. Windows event and Syslog data sources can only send to Log Analytics workspaces. Performance counters can send to both Azure Monitor Metrics and Log Analytics workspaces.

![Destination](media/azure-monitor-agent/data-collection-rule-destination.png)

Click **Add Data Source** and then **Review + create** to review the details of the data collection rule and association with the set of VMs. Click **Create** to create it.

## Next steps

