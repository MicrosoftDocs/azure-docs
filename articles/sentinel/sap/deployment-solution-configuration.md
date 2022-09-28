---
title: Configure Microsoft Sentinel Solution for SAP
description: This article shows you how to configure the deployed Microsoft Sentinel Solution for SAP
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/27/2022
---

# Configure Microsoft Sentinel Solution for SAP

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article provides best practices for configuring the Microsoft Sentinel Solution for SAP. The full deployment process is detailed in a whole set of articles linked under [Deployment milestones](deployment-overview.md#deployment-milestones).

> [!IMPORTANT]
> Some components of the Microsoft Sentinel Solution for SAP are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Deployment of the data collector agent and solution in Microsoft Sentinel provides you with the ability to monitor SAP systems for suspicious activities and identify threats. However, for best results, best practices for operating the solution strongly recommend carrying out several additional configuration steps that are very dependent on the SAP deployment.

## Deployment milestones

Track your SAP solution deployment journey through this series of articles:

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Prepare SAP environment](preparing-sap.md)

1. [Deploy data connector agent](deploy-data-connector-agent-container.md)

1. [Deploy SAP security content](deploy-sap-security-content.md)

1. **Configure Microsoft Sentinel Solution for SAP (*You are here*)**

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure data connector to use SNC](configure-snc.md)

## Configure watchlists

Microsoft Sentinel Solution for SAP configuration is accomplished by providing customer-specific information in the provisioned watchlists.

> [!NOTE]
>
> After initial solution deployment, it may take some time before watchlists are populated with data.
> If you edit a watchlist and find it is empty, please wait a few minutes and retry opening the watchlist for editing.

### SAP - Systems watchlist
SAP - Systems watchlist defines which SAP Systems are present in the monitored environment. For every system, specify its SID, whether it's a production system or a dev/test environment, as well as a description.
This information is used by some analytics rules, which may react differently if relevant events appear in a Development or a Production system.

### SAP - Networks watchlist
SAP - Networks watchlist outlines all networks used by the organization. It's primarily used to identify whether or not user logons are originating from within known segments of the network, also if user logon origin changes unexpectedly.

There are a number of approaches for documenting network topology. You could define a broad range of addresses, like 172.16.0.0/16, and name it "Corporate Network", which will be good enough for tracking logons from outside that range. A more segmented approach, however, allows you better visibility into potentially atypical activity. 

For example: define the following two segments and their geographical locations:

| Segment | Location |
| ---- | ---- |
| 192.168.10.0/23 | Western Europe |
| 10.15.0.0/16 | Australia |

Now Microsoft Sentinel will be able to differentiate a logon from 192.168.10.15 (in the first segment) from a logon from 10.15.2.1 (in the second segment) and alert you if such behavior is identified as atypical.

### Sensitive data watchlists

- SAP - Sensitive Function Modules
- SAP - Sensitive Tables
- SAP - Sensitive ABAP Programs
- SAP - Sensitive Transactions

All of these watchlists identify sensitive actions or data that can be carried out or accessed by users. Several well-known operations, tables and authorizations have been pre-configured in the watchlists, however we recommend you consult with the SAP BASIS team to identify which operations, transactions, authorizations and tables are considered to be sensitive in your SAP environment.

### User master data watchlists

- SAP - Sensitive Profiles
- SAP - Sensitive Roles
- SAP - Privileged Users
- SAP - Critical Authorizations

The Microsoft Sentinel Solution for SAP uses User Master data gathered from SAP systems to identify which users, profiles, and roles should be considered sensitive. Some sample data is included in the watchlists, though we recommend you consult with the SAP BASIS team to identify sensitive users, roles and profiles and populate the watchlists accordingly.

## Start enabling analytics rules
By default, all analytics rules provided in the Microsoft Sentinel Solution for SAP are provided as [alert rule templates](../manage-analytics-rule-templates.md#manage-template-versions-for-your-scheduled-analytics-rules-in-microsoft-sentinel). We recommend a staged approach, where a few rules are created from templates at a time, allowing time for fine tuning each scenario.
 We consider the following rules to be easiest to implement, so best to start with those:

1. Change in Sensitive Privileged User
2. Client configuration change
3. Sensitive privileged user logon
4. Sensitive privileged user makes a change in other
5. Sensitive privilege user password change and login
6. Brute force (RFC)
7. Function module tested
8. The SAP audit log monitoring analytics rules

#### Configuring the SAP audit log monitoring analytics rules
The two [SAP Audit log monitor rules](sap-solution-security-content.md#built-in-sap-analytics-rules-for-monitoring-the-sap-audit-log) are delivered as ready to run out of the box, and allow for further fine tuning using watchlists:
- **SAP_Dynamic_Audit_Log_Monitor_Configuration**
  The **SAP_Dynamic_Audit_Log_Monitor_Configuration** is a watchlist detailing all available SAP standard audit log message IDs and can be extended to contain additional message IDs you might create on your own using ABAP enhancements on your SAP NetWeaver systems.This watchlist allows for customizing an SAP message ID (=event type), at different levels:
    -	Severities per production/ non-production systems -for example, debugging activity gets “High” for production systems, and “Disabled” for other systems
    -	Assigning different thresholds for production/ non-production systems- which are considered as “speed limits”. Setting a threshold of 60 events an hour, will trigger an incident if more than 30 events were observed within 30 minutes
    -	Assigning Rule Types- either “Deterministic” or “AnomaliesOnly” determines by which manner this event is considered
    -	Roles and Tags to Exclude- specific users can be excluded from specific event types. This field can either accept SAP roles, SAP profiles or Tags:
        -	Listing SAP roles or SAP profiles ([see User Master data collection](sap-solution-deploy-alternate.md#configuring-user-master-data-collection)) would exclude any user bearing those roles/ profiles from these event types for the same SAP system. For example, specifying the “BASIC_BO_USERS” ABAP role for the RFC related event types will ensure Business Objects users won't trigger incidents when making massive RFC calls.
        - Listing tags to be used as identifiers. Tagging an event type works just like specifying SAP roles or profiles, except that tags can be created within the Sentinel workspace, allowing the SOC personnel freedom in excluding users per activity without the dependency on the SAP team. For example, the audit message IDs AUB (authorization changes) and AUD (User master record changes) are assigned with the tag “MassiveAuthChanges”. Users assigned with this tag are excluded from the checks for these activities. Running the workspace function **SAPAuditLogConfigRecommend** will produce a list of recommended tags to be assigned to users, such as 'Add the tags ["GenericTablebyRFCOK"] to user SENTINEL_SRV using the SAP_User_Config watchlist'
- **SAP_User_Config** 
  This configuration-based watchlist is there to allow for specifying user related tags and other active directory identifiers for the SAP user. Tags are then used for identifying the user in specific contexts. For example, assigning the user GRC_ADMIN with the tag “MassiveAuthChanges” will prevent incidents from being created on user master record and authorization events made by GRC_ADMIN.

More information is available [in this blog](https://aka.ms/Sentinel4sapDynamicDeterministicAuditRuleBlog)




