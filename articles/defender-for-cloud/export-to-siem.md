---
title: Stream your alerts from Microsoft Defender for Cloud to Security Information and Event Management (SIEM) systems and other monitoring solutions
description: Learn how to stream your security alerts to Microsoft Sentinel, third-party SIEMs, SOAR, or ITSM solutions
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 04/04/2022
---

# Stream alerts to a SIEM, SOAR, or IT Service Management solution

Microsoft Defender for Cloud can stream your security alerts into the most popular Security Information and Event Management (SIEM),
Security Orchestration Automated Response (SOAR), and IT Service Management (ITSM) solutions.
Security alerts are notifications that Defender for Cloud generates when it detects threats on your resources.
Defender for Cloud prioritizes and lists the alerts, along with the information needed for you to quickly investigate the problem.
Defender for Cloud also provides detailed steps to help you remediate attacks.
Alerts data is retained for 90 days.

There are built-in Azure tools for ensuring you can view your alert data in all of the most popular solutions in use today, including:

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

When you connect Defender for Cloud to Microsoft Sentinel, the status of Defender for Cloud alerts that get ingested into Microsoft Sentinel is synchronized between the two services. So, for example, when an alert is closed in Defender for Cloud, that alert is also shown as closed in Microsoft Sentinel. If you change the status of an alert in Defender for Cloud, the status of the alert in Microsoft Sentinel is also updated, but the statuses of any Microsoft Sentinel **incidents** that contain the synchronized Microsoft Sentinel alert aren't updated.

You can enable the **bi-directional alert synchronization** feature to automatically sync the status of the original Defender for Cloud alerts with Microsoft Sentinel incidents that contain the copies of those Defender for Cloud alerts. So, for example, when a Microsoft Sentinel incident that contains a Defender for Cloud alert is closed, Defender for Cloud automatically closes the corresponding original alert.

Learn more in [Connect alerts from Microsoft Defender for Cloud](../sentinel/connect-azure-security-center.md).

> [!NOTE]
> The bi-directional alert synchronization feature isn't available in the Azure Government cloud.

### Configure ingestion of all audit logs into Microsoft Sentinel

Another alternative for investigating Defender for Cloud alerts in Microsoft Sentinel is to stream your audit logs into Microsoft Sentinel:

- [Connect Windows security events](../sentinel/connect-windows-security-events.md)
- [Collect data from Linux-based sources using Syslog](../sentinel/connect-syslog.md)
- [Connect data from Azure Activity log](../sentinel/data-connectors/azure-activity.md)

> [!TIP]
> Microsoft Sentinel is billed based on the volume of data that it ingests for analysis in Microsoft Sentinel and stores in the Azure Monitor Log Analytics workspace. Microsoft Sentinel offers a flexible and predictable pricing model. [Learn more at the Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/).

## Stream alerts to QRadar and Splunk

The export of security alerts to Splunk and QRadar uses Event Hubs and a built-in connector.
You can either use a PowerShell script or the Azure portal to set up the requirements for exporting security alerts for your subscription or tenant.
Then you’ll need to use the procedure specific to each SIEM to install the solution in the SIEM platform.

### Prerequisites

Before you set up the Azure services for exporting alerts, make sure you have:

- Azure subscription ([Create a free account](https://azure.microsoft.com/free/))
- Azure resource group ([Create a resource group](../azure-resource-manager/management/manage-resource-groups-portal.md))
- **Owner** role on the alerts scope (subscription, management group or tenant), or these specific permissions:
  - Write permissions for event hubs and the Event Hub Policy
  - Create permissions for [Azure AD applications](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app), if you aren't using an existing Azure AD application
  - Assign permissions for policies, if you're using the Azure Policy 'DeployIfNotExist'
  <!-- - To export to a Log Analytics workspace:
    - if it **has the SecurityCenterFree solution**, you'll need a minimum of read permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/read`
    - if it **doesn't have the SecurityCenterFree solution**, you'll need write permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/action` -->

### Step 1: Set up the Azure services

You can set up your Azure environment to support continuous export using either:

- A PowerShell script (Recommended)

    Download and run [the PowerShell script](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Powershell%20scripts/3rd%20party%20SIEM%20integration).
    Enter the required parameters and the script performs all of the steps for you.
    When the script finishes, it outputs the information you’ll use to install the solution in the SIEM platform.

- The Azure portal

    Here's an overview of the steps you'll do in the Azure portal:

    1. Create an Event Hubs namespace and event hub.
    2. Define a policy for the event hub with “Send” permissions.
    3. **If you're streaming alerts to QRadar** - Create an event hub "Listen" policy, then copy and save the connection string of the policy that you’ll use in QRadar.
    4. Create a consumer group, then copy and save the name that you’ll use in the SIEM platform.
    5. Enable continuous export of security alerts to the defined event hub.
    6. **If you're streaming alerts to QRadar** - Create a storage account, then copy and save the connection string to the account that you’ll use in QRadar.
    7. **If you're streaming alerts to Splunk**:
        1. Create an Azure Active Directory (AD) application.
        2. Save the Tenant, App ID, and App password.
        3. Give permissions to the Azure AD Application to read from the event hub you created before.

    For more detailed instructions, see [Prepare Azure resources for exporting to Splunk and QRadar](export-to-splunk-or-qradar.md).

### Step 2: Connect the event hub to your preferred solution using the built-in connectors

Each SIEM platform has a tool to enable it to receive alerts from Azure Event Hubs. Install the tool for your platform to start receiving alerts.

| Tool | Hosted in Azure | Description |
|:---|:---| :---|
|  IBM QRadar | No | The Microsoft Azure DSM and Microsoft Azure Event Hubs Protocol are available for download from [the IBM support website](https://www.ibm.com/docs/en/qsip/7.4?topic=microsoft-azure-platform). |
| Splunk | No | [Splunk Add-on for Microsoft Cloud Services](https://splunkbase.splunk.com/app/3110/) is an open source project available in Splunkbase. <br><br> If you can't install an add-on in your Splunk instance, for example if you're using a proxy or running on Splunk Cloud, you can forward these events to the Splunk HTTP Event Collector using [Azure Function For Splunk](https://github.com/splunk/azure-functions-splunk), which is triggered by new messages in the event hub. |

## Stream alerts with continuous export

To stream alerts into **ArcSight**, **SumoLogic**, **Syslog servers**, **LogRhythm**, **Logz.io Cloud Observability Platform**, and other monitoring solutions, connect Defender for Cloud using continuous export and Azure Event Hubs:

> [!NOTE]
> To stream alerts at the tenant level, use this Azure policy and set the scope at the root management group. You'll need permissions for the root management group as explained in [Defender for Cloud permissions](permissions.md): [Deploy export to an event hub for Microsoft Defender for Cloud alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcdfcce10-4578-4ecd-9703-530938e4abcb).

1. Enable [continuous export](continuous-export.md) to stream Defender for Cloud alerts into a dedicated event hub at the subscription level. To do this at the Management Group level using Azure Policy, see [Create continuous export automation configurations at scale](continuous-export.md?tabs=azure-policy#configure-continuous-export-at-scale-using-the-supplied-policies).

2. Connect the event hub to your preferred solution using the built-in connectors:

    | Tool | Hosted in Azure | Description |
    |:---|:---| :---|
    | SumoLogic | No | Instructions for setting up SumoLogic to consume data from an event hub are available at [Collect Logs for the Azure Audit App from Event Hubs](https://help.sumologic.com/docs/send-data/collect-from-other-data-sources/azure-monitoring/collect-logs-azure-monitor/). |
    | ArcSight | No | The ArcSight Azure Event Hubs smart connector is available as part of [the ArcSight smart connector collection](https://community.microfocus.com/cyberres/arcsight/f/arcsight-product-announcements/163662/announcing-general-availability-of-arcsight-smart-connectors-7-10-0-8114-0). |
    | Syslog server | No | If you want to stream Azure Monitor data directly to a syslog server, you can use a [solution based on an Azure function](https://github.com/miguelangelopereira/azuremonitor2syslog/).
    | LogRhythm | No| Instructions to set up LogRhythm to collect logs from an event hub are available [here](https://logrhythm.com/six-tips-for-securing-your-azure-cloud-environment/).
    |Logz.io | Yes | For more information, see [Getting started with monitoring and logging using Logz.io for Java apps running on Azure](/azure/developer/java/fundamentals/java-get-started-with-logzio)

3. Optionally, stream the raw logs to the event hub and connect to your preferred solution. Learn more in [Monitoring data available](../azure-monitor/essentials/stream-monitoring-data-event-hubs.md#monitoring-data-available).

To view the event schemas of the exported data types, visit the [Event Hubs event schemas](https://aka.ms/ASCAutomationSchemas).

## Use the Microsoft Graph Security API to stream alerts to third-party applications

As an alternative to Microsoft Sentinel and Azure Monitor, you can use Defender for Cloud's built-in integration with [Microsoft Graph Security API](/graph/security-concept-overview/). No configuration is required.

You can use this API to stream alerts from your **entire tenant** (and data from many Microsoft Security products) into third-party SIEMs and other popular platforms:

- **Splunk Enterprise and Splunk Cloud** - [Use the Microsoft Graph Security API Add-On for Splunk](https://splunkbase.splunk.com/app/4564/)
- **Power BI** - [Connect to the Microsoft Graph Security API in Power BI Desktop](/power-bi/connect-data/desktop-connect-graph-security).
- **ServiceNow** - [Install and configure the Microsoft Graph Security API application from the ServiceNow Store](https://docs.servicenow.com/bundle/sandiego-security-management/page/product/secops-integration-sir/secops-integration-ms-graph/task/ms-graph-install.html?cshalt=yes).
- **QRadar** - [Use IBM's Device Support Module for Microsoft Defender for Cloud via Microsoft Graph API](https://www.ibm.com/support/knowledgecenter/SS42VS_DSM/com.ibm.dsm.doc/c_dsm_guide_ms_azure_security_center_overview.html).
- **Palo Alto Networks**, **Anomali**, **Lookout**, **InSpark**, and more - [Use the Microsoft Graph Security API](https://www.microsoft.com/security/business/graph-security-api#office-MultiFeatureCarousel-09jr2ji).

> [!NOTE]
> The preferred way to export alerts is through [Continuously export Microsoft Defender for Cloud data](continuous-export.md).

## Next steps

This page explained how to ensure your Microsoft Defender for Cloud alert data is available in your SIEM, SOAR, or ITSM tool of choice. For related material, see:

- [What is Microsoft Sentinel?](../sentinel/overview.md)
- [Alert validation in Microsoft Defender for Cloud](alert-validation.md) - Verify your alerts are correctly configured
- [Continuously export Defender for Cloud data](continuous-export.md)
