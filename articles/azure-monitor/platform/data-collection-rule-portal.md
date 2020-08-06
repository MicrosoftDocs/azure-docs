---
title: Configure data collection for the Azure Monitor agent (preview)
description: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/27/2020

---

# Configure data collection for the Azure Monitor agent (preview)
Data Collection Rules (DCR) define data coming into Azure Monitor and specify where it should be sent. This article describes how to create a data collection rule to collect data from virtual machines using the Azure Monitor agent.

For a complete description of data collection rules, see [Data collection rules in Azure Monitor (preview)](data-collection-rule-overview.md).

> [!NOTE]
> This article describes how to configure data for virtual machines with the Azure Monitor agent which is currently in preview. See [Overview of Azure Monitor agents](agents-overview.md) for a description of agents that are generally available.


## DCR associations
To apply a DCR to a virtual machine, you create an association for the virtual machine. A virtual machine may have an association to multiple DCRs, and a DCR may have multiple virtual machines associated to it. This allows you to define a set of DCRs, each matching a particular requirement, and apply them to only the virtual machines where they apply. 

The following diagram shows an example of how you might define a set of DCRs and apply them to different virtual machines in your environment.

<Diagram of DCR and VM associations>


## Create using the Azure portal
You can use the Azure portal to create a data collection rule and associate virtual machines in your subscription to that rule. The Azure Monitor agent will be automatically installed and a managed identity created. 

In the **Azure Monitor** menu in the Azure portal, select **Data Collection Rules** from the **Settings** section. Click **Add** to add a new Data Collection Rule and assignment.

![Data Collection Rules](media/azure-monitor-agent/data-collection-rules.png)

Click **Add** to create a new rule and set of associations. Provide a **Rule name** and specify a **Subscription** and **Resource Group**. This specifies where the DCR will be created. The virtual machines and their associations can be in any subscription or resource group in the tenant.

![Data Collection Rule Basics](media/azure-monitor-agent/data-collection-rule-basics.png)

In the **Virtual machines** tab, add VMs that should have the Data Collection Rule applied. The Azure Monitor Agent will be installed on VMs that don't already have it installed.

![Data Collection Rule virtual machines](media/azure-monitor-agent/data-collection-rule-vms.png)

On the **Collect and deliver** tab, click **Add data source** to add a data source and destination set. Select a **Data source type**, and the corresponding details to select will be displayed. For performance counters, you can select from a predefined set of objects and their sampling rate. For events, you can select from a set of logs or facilities and the severity level. 

![Data source basic](media/azure-monitor-agent/data-collection-rule-data-source-basic.png)


To specify other logs and performance counters, select **Custom**. You can then specify an [XPath ](https://www.w3schools.com/xml/xpath_syntax.asp) for any specific values to collect. See [Sample DCR](data-collection-rule-overview.md#sample-dcr) for examples.

![Data source custom](media/azure-monitor-agent/data-collection-rule-data-source-custom.png)

On the **Destination** tab, add one or more destinations for the data source. Windows event and Syslog data sources can only send to Log Analytics workspaces. Performance counters can send to both Azure Monitor Metrics and Log Analytics workspaces.

![Destination](media/azure-monitor-agent/data-collection-rule-destination.png)

Click **Add Data Source** and then **Review + create** to review the details of the data collection rule and association with the set of VMs. Click **Create** to create it.

Once the DCR and associations have been created, it may take up to 5 minutes for data to be sent to the destinations.

## Create using REST API
Follow the steps below to create a DCR and associations using the REST API. 

1. Manually create the DCR file using the JSON format shown in [Sample DCR](data-collection-rule-overview.md#sample-dcr).
2. Create the rule using the [REST API](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#definitions).
3. Create an association between the DCR and each virtual machine using the [REST API](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionruleassociations/datacollectionruleassociations_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#examples).

## Next steps


