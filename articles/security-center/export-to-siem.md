---
title: Stream your alerts from Azure Security Center to SIEMs and monitoring solutions
description: Learn how to stream your security alerts to Azure Sentinel or a third-party SIEM, SOAR, or ITSM solutions
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 10/06/2020
ms.author: memildin

---

# Stream alerts to a SIEM, SOAR, or ITSM solutions

Azure Security Center can stream your security alerts into the most popular SIEM (Security information and event management), SOAR (Security orchestration automated response), and ITSM (IT service management) solutions.

There are Azure-native tools for ensuring you can view your alert data in all of the most popular solutions in use today.

## Stream alerts to Azure Sentinel 

Security Center natively integrates with Azure Sentinel - Azure cloud-native SIEM and SOAR solution. You can stream Azure Security Center alerts into Azure Sentinel with few simple clicks. 

- stream Azure Security Center alerts to Azure Sentinel in subscription level - Learn more> 
- Automatically connect all subscriptions in your tenant to Azure Sentinel – Learn more> 
- stream audit logs into Azure Sentinel to allow easier investigation of ASC alerts (Note: very expensive) - Windows, syslog, Activity log 

## Microsoft Graph streams alerts to Splunk, QRadar, ServiceNow, and Power BI

Security Center has out-of-the-box integration with Microsoft Graph (no configuration required, no additional costs) which allow you to stream your security alerts using Microsoft Graph into popular SIEM solutions (Splunk, QRadar) and other popular platforms (ServiceNow, PowerBI and more) with easy integration for your entire tenant together with data from many other Microsoft Security products:  

- stream security alerts  to Splunk, ServiceNow and PowerBI using built-in connectors – Learn more> 
- stream security alerts to QRadar  - Learn more>  
- stream security alerts to Palo-Alto Networks, Anomli, Lookout, Inspark and more – Learn more> 

## Azure Monitor streams alerts to ArcSight and other monitoring solutions 

You can integrate Azure Security Center with Azure monitor using Azure Event Hubs to stream Azure Security Center alerts into ArcSight and additional monitoring solutions (Splunk, ArcSight, SumoLogic, Syslog server, LogRythm, Logz.io, and more) using the steps below. 

1. Setup [continuous export](continuous-export.md) to stream Security Center alerts into a dedicated Azure Event Hub at the subscription level. 
    > [!TIP]
    > To do this at the Management Group level using Azure Policy, see [Create continuous export automation configurations at scale](continuous-export.md#create-continuous-export-automation-configurations-at-scale)

1. Connect the Azure Event hub to your preferred solution (ArcSight, SumoLogic, Syslog server, LogRythm, Logz.io, Splunk) using Azure Monitor built-it connectors. Learn more in [Partner tools with Azure Monitor integration](../azure-monitor/platform/stream-monitoring-data-event-hubs.md#partner-tools-with-azure-monitor-integration).
1. Optionally, stream the raw logs to the Azure Event Hub and connect to your preferred solution. Learn more in [Monitoring data available](../azure-monitor/platform/stream-monitoring-data-event-hubs.md#monitoring-data-available).




## Configure SIEM integration via Azure Event Hubs

Azure Event Hubs is a great solution for programatically consuming any streaming data. For Azure Security Center alerts and recommendations, it's the preferred way to integrate with a third-party SIEM.

> [!NOTE]
> The most effective method to stream monitoring data to external tools in most cases is using Azure Event Hubs. [This article](https://docs.microsoft.com/azure/azure-monitor/platform/stream-monitoring-data-event-hubs) provides a brief description for how you can stream monitoring data from different sources to an Event Hub and links to detailed guidance.

> [!NOTE]
> If you previously exported Security Center alerts to a SIEM using Azure Activity log, the procedure below replaces that methodology.

To view the event schemas of the exported data types, visit the [Event Hub event schemas](https://aka.ms/ASCAutomationSchemas).


### To integrate with a SIEM 

After you have configured continuous export of your chosen Security Center data to Azure Event Hubs, you can set up the appropriate connector for your SIEM:

* **Azure Sentinel** - Use the native Azure Security Center alerts [data connector](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center) offered there.
* **Splunk** - Use the [Azure Monitor Add-On for Splunk](https://github.com/Microsoft/AzureMonitorAddonForSplunk/blob/master/README.md)
* **IBM QRadar** - Use [a manually configured log source](https://www.ibm.com/support/knowledgecenter/SS42VS_DSM/com.ibm.dsm.doc/t_dsm_guide_microsoft_azure_enable_event_hubs.html)
* **ArcSight** – Use [SmartConnector](https://community.microfocus.com/t5/ArcSight-Connectors/SmartConnector-for-Microsoft-Azure-Monitor-Event-Hub/ta-p/1671292)

Also, if you'd like to move the continuously exported data automatically from your configured Event Hub to Azure Data Explorer, use the instructions in [Ingest data from Event Hub into Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/ingest-data-event-hub).

