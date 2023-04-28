---
title: Configure Microsoft Sentinel solution for SAP® applications
description: This article shows you how to configure the deployed Microsoft Sentinel solution for SAP® applications
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 03/10/2023
---

# Configure Microsoft Sentinel solution for SAP® applications

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article provides best practices for configuring the Microsoft Sentinel solution for SAP® applications. The full deployment process is detailed in a whole set of articles linked under [Deployment milestones](deployment-overview.md#deployment-milestones).

> [!IMPORTANT]
> Some components of the Microsoft Sentinel solution for SAP® applications are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Deployment of the data collector agent and solution in Microsoft Sentinel provides you with the ability to monitor SAP systems for suspicious activities and identify threats. However, for best results, best practices for operating the solution strongly recommend carrying out several additional configuration steps that are very dependent on the SAP deployment.

## Deployment milestones

Track your SAP solution deployment journey through this series of articles:

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Work with the solution across multiple workspaces](cross-workspace.md) (PREVIEW)

1. [Prepare SAP environment](preparing-sap.md)

1. [Deploy data connector agent](deploy-data-connector-agent-container.md)

1. [Deploy SAP security content](deploy-sap-security-content.md)

1. **Configure Microsoft Sentinel solution for SAP® applications (*You are here*)**

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure data connector to use SNC](configure-snc.md)
   - [Select SAP ingestion profiles](select-ingestion-profiles.md)

## Configure watchlists

Microsoft Sentinel solution for SAP® applications configuration is accomplished by providing customer-specific information in the provisioned watchlists.

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

The Microsoft Sentinel solution for SAP® applications uses User Master data gathered from SAP systems to identify which users, profiles, and roles should be considered sensitive. Some sample data is included in the watchlists, though we recommend you consult with the SAP BASIS team to identify sensitive users, roles and profiles and populate the watchlists accordingly.

## Start enabling analytics rules
By default, all analytics rules provided in the Microsoft Sentinel solution for SAP® applications are provided as [alert rule templates](../manage-analytics-rule-templates.md#manage-template-versions-for-your-scheduled-analytics-rules-in-microsoft-sentinel). We recommend a staged approach, where a few rules are created from templates at a time, allowing time for fine tuning each scenario.
 We consider the following rules to be easiest to implement, so best to start with those:

1. Change in Sensitive Privileged User
2. Client configuration change
3. Sensitive privileged user logon
4. Sensitive privileged user makes a change in other
5. Sensitive privilege user password change and login
6. Function module tested

## Enable or disable the ingestion of specific SAP logs

To enable or disable the ingestion of a specific log:
 
1. Edit the *systemconfig.ini* file located under */opt/sapcon/SID/* on the connector's VM. 
1. Inside the configuration file, locate the relevant log and do one of the following:
    - To enable the log, change the value to `True`. 
    - To disable the log, change the value to `False`.

For example, to stop ingestion for the `ABAPJobLog`, change its value to `False`:

```
ABAPJobLog = False
```
Review the list of available logs in the [Systemconfig.ini file reference](reference-systemconfig.md#logs-activation-status-section).

You can also [stop ingesting the user master data tables](sap-solution-deploy-alternate.md#configuring-user-master-data-collection).

> [!NOTE]
>
> Once you stop one of the logs or tables, the workbooks and analytics queries that use that log may not work.
> [Understand which log each workbook uses](sap-solution-security-content.md#built-in-workbooks) and [understand which log each analytic rule uses](sap-solution-security-content.md#built-in-analytics-rules).

## Stop log ingestion and disable the connector

To stop ingesting SAP logs into the Microsoft Sentinel workspace, and to stop the data stream from the Docker container, run this command: 

```
docker stop sapcon-[SID]
```

The Docker container stops and doesn't send any more SAP logs to the Microsoft Sentinel workspace. This both stops the ingestion and billing for the SAP system related to the connector.

If you need to reenable the Docker container, run this command: 

```
docker start sapcon-[SID]
```

## Remove the user role and the optional CR installed on your ABAP system

To remove the user role and optional CR imported to your system, import the deletion CR *NPLK900259* into your ABAP system.
