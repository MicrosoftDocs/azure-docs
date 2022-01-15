---
title: Stream your alerts from Microsoft Defender for Cloud to Security Information and Event Management (SIEM) systems and other monitoring solutions
description: Learn how to stream your security alerts to Microsoft Sentinel, third-party SIEMs, SOAR, or ITSM solutions
ms.topic: how-to
ms.date: 11/09/2021
---

# Stream alerts to a SIEM, SOAR, or IT Service Management solution

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Defender for Cloud can stream your security alerts into the most popular Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), and IT Service Management (ITSM) solutions.

There are Azure-native tools for ensuring you can view your alert data in all of the most popular solutions in use today, including:

- **Microsoft Sentinel**
- **Splunk Enterprise and Splunk Cloud**
- **IBM's QRadar**
- **ServiceNow**
- **ArcSight**
- **Power BI**
- **Palo Alto Networks**

## Stream alerts to Microsoft Sentinel 

Defender for Cloud natively integrates with Microsoft Sentinel, Azure's cloud-native SIEM and SOAR solution. 

[Learn more about Microsoft Sentinel](../sentinel/overview.md).

### Microsoft Sentinel's connectors for Defender for Cloud

Microsoft Sentinel includes built-in connectors for Microsoft Defender for Cloud at the subscription and tenant levels:

- [Stream alerts to Microsoft Sentinel at the subscription level](../sentinel/connect-azure-security-center.md)
- [Connect all subscriptions in your tenant to Microsoft Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/azure-security-center-auto-connect-to-sentinel/ba-p/1387539) 

When you connect Defender for Cloud to Microsoft Sentinel, the status of Defender for Cloud alerts that get ingested into Microsoft Sentinel is synchronized between the two services. So, for example, when an alert is closed in Defender for Cloud, that alert will display as closed in Microsoft Sentinel as well. Changing the status of an alert in Defender for Cloud "won't"* affect the status of any Microsoft Sentinel **incidents** that contain the synchronized Microsoft Sentinel alert, only that of the synchronized alert itself.

Enabling the preview feature, **bi-directional alert synchronization**, will automatically sync the status of the original Defender for Cloud alerts with Microsoft Sentinel incidents that contain the copies of those Defender for Cloud alerts. So, for example, when a Microsoft Sentinel incident containing a Defender for Cloud alert is closed, Defender for Cloud will automatically close the corresponding original alert.

Learn more in [Connect alerts from Microsoft Defender for Cloud](../sentinel/connect-azure-security-center.md).

> [!NOTE]
> The bi-directional alert synchronization feature isn't available in the Azure Government cloud.

### Configure ingestion of all audit logs into Microsoft Sentinel

Another alternative for investigating Defender for Cloud alerts in Microsoft Sentinel is to stream your audit logs into Microsoft Sentinel:
    - [Connect Windows security events](../sentinel/connect-windows-security-events.md)
    - [Collect data from Linux-based sources using Syslog](../sentinel/connect-syslog.md)
    - [Connect data from Azure Activity log](../sentinel/data-connectors-reference.md#azure-activity)

> [!TIP]
> Microsoft Sentinel is billed based on the volume of data ingested for analysis in Microsoft Sentinel and stored in the Azure Monitor Log Analytics workspace. Microsoft Sentinel offers a flexible and predictable pricing model. [Learn more at the Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/).



## Stream alerts with Azure Monitor 

To stream alerts into **ArcSight**, **Splunk**, **QRadar**, **SumoLogic**, **Syslog servers**, **LogRhythm**, **Logz.io Cloud Observability Platform**, and other monitoring solutions. connect Defender for Cloud with Azure monitor via Azure Event Hubs:

> [!NOTE]
> To stream alerts at the tenant level, use this Azure policy and set the scope at the root management group (you'll need permissions for the root management group as explained in [Defender for Cloud permissions](permissions.md)): [Deploy export to event hub for Microsoft Defender for Cloud alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcdfcce10-4578-4ecd-9703-530938e4abcb).

1. Enable [continuous export](continuous-export.md) to stream Defender for Cloud alerts into a dedicated event hub at the subscription level. To do this at the Management Group level using Azure Policy, see [Create continuous export automation configurations at scale](continuous-export.md?tabs=azure-policy#configure-continuous-export-at-scale-using-the-supplied-policies)

1. [Connect the event hub to your preferred solution using Azure Monitor's built-in connectors](../azure-monitor/essentials/stream-monitoring-data-event-hubs.md#partner-tools-with-azure-monitor-integration).

1. Optionally, stream the raw logs to the event hub and connect to your preferred solution. Learn more in [Monitoring data available](../azure-monitor/essentials/stream-monitoring-data-event-hubs.md#monitoring-data-available).

To view the event schemas of the exported data types, visit the [Event hub event schemas](https://aka.ms/ASCAutomationSchemas).


## Other streaming options 

As an alternative to Sentinel and Azure Monitor, you can use Defender for Cloud's built-in integration with [Microsoft Graph Security API](https://www.microsoft.com/security/business/graph-security-api). No configuration is required and there are no additional costs. 

You can use this API to stream alerts from your **entire tenant** (and data from many other Microsoft Security products) into third-party SIEMs and other popular platforms:

- **Splunk Enterprise and Splunk Cloud** - [Use the Microsoft Graph Security API Add-On for Splunk](https://splunkbase.splunk.com/app/4564/) 
- **Power BI** - [Connect to the Microsoft Graph Security API in Power BI Desktop](/power-bi/connect-data/desktop-connect-graph-security)
- **ServiceNow** - [Follow the instructions to install and configure the Microsoft Graph Security API application from the ServiceNow Store](https://docs.servicenow.com/bundle/orlando-security-management/page/product/secops-integration-sir/secops-integration-ms-graph/task/ms-graph-install.html)
- **QRadar** - [IBM's Device Support Module for Microsoft Defender for Cloud via Microsoft Graph API](https://www.ibm.com/support/knowledgecenter/SS42VS_DSM/com.ibm.dsm.doc/c_dsm_guide_ms_azure_security_center_overview.html) 
- **Palo Alto Networks**, **Anomali**, **Lookout**, **InSpark**, and more - [Microsoft Graph Security API](https://www.microsoft.com/security/business/graph-security-api#office-MultiFeatureCarousel-09jr2ji)



## Next steps

This page explained how to ensure your Microsoft Defender for Cloud alert data is available in your SIEM, SOAR, or ITSM tool of choice. For related material, see:

- [What is Microsoft Sentinel?](../sentinel/overview.md)
- [Alert validation in Microsoft Defender for Cloud](alert-validation.md) - Verify your alerts are correctly configured
- [Continuously export Defender for Cloud data](continuous-export.md)
