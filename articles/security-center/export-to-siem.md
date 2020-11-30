---
title: Stream your alerts from Azure Security Center to Security Information and Event Management (SIEM) systems and other monitoring solutions
description: Learn how to stream your security alerts to Azure Sentinel, third-party SIEMs, SOAR, or ITSM solutions
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 10/06/2020
ms.author: memildin

---

# Stream alerts to a SIEM, SOAR, or IT Service Management solution

Azure Security Center can stream your security alerts into the most popular Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), and IT Service Management (ITSM) solutions.

There are Azure-native tools for ensuring you can view your alert data in all of the most popular solutions in use today, including:

- **Azure Sentinel**
- **Splunk Enterprise and Splunk Cloud**
- **IBM's QRadar**
- **ServiceNow**
- **ArcSight**
- **Power BI**
- **Palo Alto Networks**

## Stream alerts to Azure Sentinel 

Security Center natively integrates with Azure Sentinel, Azure's cloud-native SIEM and SOAR solution. 

[Learn more about Azure Sentinel](../sentinel/overview.md).

### Azure Sentinel's connectors for Security Center

Azure Sentinel includes built-in connectors for Azure Security Center at the subscription and tenant levels:

- [Stream alerts to Azure Sentinel at the subscription level](../sentinel/connect-azure-security-center.md)
- [Connect all subscriptions in your tenant to Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-security-center-auto-connect-to-sentinel/ba-p/1387539) 

### Configure ingestion of all audit logs into Azure Sentinel 

Another alternative for investigating Security Center alerts in Azure Sentinel is to stream your audit logs into Azure Sentinel:
    - [Connect Windows security events](../sentinel/connect-windows-security-events.md)
    - [Collect data from Linux-based sources using Syslog](../sentinel/connect-syslog.md)
    - [Connect data from Azure Activity log](../sentinel/connect-azure-activity.md)

> [!TIP]
> Azure Sentinel is billed based on the volume of data ingested for analysis in Azure Sentinel and stored in the Azure Monitor Log Analytics workspace. Azure Sentinel offers a flexible and predictable pricing model. [Learn more at the Azure Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/).


## Stream alerts with Microsoft Graph Security API

Security Center has out-of-the-box integration with Microsoft Graph Security API. No configuration is required and there are no additional costs. 

You can use this API to stream alerts from your **entire tenant** (and data from many other Microsoft Security products) into third-party SIEMs and other popular platforms:

- **Splunk Enterprise and Splunk Cloud** - [Use the Microsoft Graph Security API Add-On for Splunk](https://splunkbase.splunk.com/app/4564/) 
- **Power BI** - [Connect to the Microsoft Graph Security API in Power BI Desktop](https://docs.microsoft.com/power-bi/connect-data/desktop-connect-graph-security)
- **ServiceNow** - [Follow the instructions to install and configure the Microsoft Graph Security API application from the ServiceNow Store](https://docs.servicenow.com/bundle/orlando-security-management/page/product/secops-integration-sir/secops-integration-ms-graph/task/ms-graph-install.html)
- **QRadar** - [IBM's Device Support Module for Azure Security Center via Microsoft Graph API](https://www.ibm.com/support/knowledgecenter/SS42VS_DSM/com.ibm.dsm.doc/c_dsm_guide_ms_azure_security_center_overview.html) 
- **Palo Alto Networks**, **Anomali**, **Lookout**, **InSpark**, and more - [Microsoft Graph Security API](https://www.microsoft.com/security/business/graph-security-api#office-MultiFeatureCarousel-09jr2ji)

[Learn more about Microsoft Graph Security API](https://www.microsoft.com/security/business/graph-security-api).


## Stream alerts with Azure Monitor 

To stream alerts into **ArcSight**, **Splunk**, **SumoLogic**, Syslog servers, **LogRhythm**, **Logz.io Cloud Observability Platform**, and other monitoring solutions. connect Security Center with Azure monitor via Azure Event Hubs:

1. Enable [continuous export](continuous-export.md) to stream Security Center alerts into a dedicated Azure Event Hub at the subscription level. 
    > [!TIP]
    > To do this at the Management Group level using Azure Policy, see [Create continuous export automation configurations at scale](continuous-export.md?tabs=azure-policy#configure-continuous-export-at-scale-using-the-supplied-policies)

1. [Connect the Azure Event hub to your preferred solution using Azure Monitor's built-in connectors](../azure-monitor/platform/stream-monitoring-data-event-hubs.md#partner-tools-with-azure-monitor-integration).

1. Optionally, stream the raw logs to the Azure Event Hub and connect to your preferred solution. Learn more in [Monitoring data available](../azure-monitor/platform/stream-monitoring-data-event-hubs.md#monitoring-data-available).

> [!TIP]
> To view the event schemas of the exported data types, visit the [Event Hub event schemas](https://aka.ms/ASCAutomationSchemas).


## Next steps

This page explained how to ensure your Azure Security Center alert data is available in your SIEM, SOAR, or ITSM tool of choice. For related material, see:

- [What is Azure Sentinel?](../sentinel/overview.md)
- [Alert validation in Azure Security Center](security-center-alert-validation.md) - Verify your alerts are correctly configured
- [Continuously export security alerts and recommendations](continuous-export.md)