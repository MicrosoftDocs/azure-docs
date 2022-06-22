---
title: Configure Microsoft Sentinel Threat Monitoring for SAP solution
description: This article shows you how to configure the deployed Threat Monitoring for SAP
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/27/2022
---

# Configure Threat Monitoring for SAP solution

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article provides best practices for configuring the Microsoft Sentinel Threat Monitoring solution for SAP. The full deployment process is detailed in a whole set of articles linked under [Deployment milestones](deployment-overview.md#deployment-milestones).

> [!IMPORTANT]
> The Microsoft Sentinel Threat Monitoring for SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Deployment of the data collector agent and solution in Microsoft Sentinel provides you with the ability to monitor SAP systems for suspicious activities and identify threats. However, for best results, best practices for operating the solution strongly recommend carrying out several additional configuration steps that are very dependent on the SAP deployment.

## Deployment milestones

Track your SAP solution deployment journey through this series of articles:

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Prepare SAP environment](preparing-sap.md)

1. [Deploy data connector agent](deploy-data-connector-agent-container.md)

1. **Deploy SAP security content (*You are here*)**

1. **Configure Threat Monitoring for SAP solution (*You are here*)**

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure SAP data connector to use SNC](configure-snc.md)

## Configure watchlists

Threat Monitoring for SAP solution configuration is accomplished by providing customer-specific information in the provisioned watchlists.

> [!NOTE]
>
> After initial solution deployment, it may take some time before watchlists are populated with data.
> If you edit a watchlist and find it is empty, please wait a few minutes and retry opening the watchlist for editing.

### SAP - Systems watchlist
SAP - Systems watchlist defines which SAP Systems are present in the monitored environment. For every system, specify it's SID, whether it is production system or a dev/test environment, as well as a description
This information is then leveraged by some analytic rules, which may react differently if relevant events appear in a Development or a Production system

### SAP - Networks watchlist
SAP - Networks watchlist outlines all networks used by the organization. It is primarily used to identify whether user logons are originating from within known segments of the network, as well as if user logon origin changes unexpectedly.
A number of approaches on documenting the network topology exists - you can define a broad range of addresses, like 172.16.0.0/16 and name that range "Corporate Network", which will be good enough for tracking logons from outside of this defined range, however it's a better idea to spend some time defining the actual segments in use along with their geography, so that Microsoft Sentinel can distinguish that (for example) logon from 192.168.10.15 (defined by network segment 192.168.10.0/23) has been from one geographical location, and logon from 10.15.2.1 (defined by a network segment 10.15.0.0/16) was from another geographical location and alert you if such behavior is identified as atypical

### SAP - Sensitive Function Modules, SAP - Sensitive Tables,  SAP - Sensitive ABAP Programs, SAP - Sensitive Transactions, SAP - Critical Authorizations,
All of these watchlists idenfity sensitive actions or data that can be carried out or accessed by users. Several well-known operations, tables and authorizations have been pre-configured in the watchlists, however we recommend you consult with the SAP BASIS team to identify which operations, transactions, authorizations and tables are considered to be sensitive in your SAP environment.

### SAP - Sensitive Profiles, SAP - Sensitive Roles, SAP - Privileged Users
Threat Monitoring for SAP solution uses User Master data gathered from SAP systems to identify which users, which profiles and roles should be considered sensitive. Some sample data is included in the watchlists, however we recommend you consult with the SAP BASIS team to identify sensitive users, roles and profiles and populate the watchlists accordingly

## Start enabling rules
By default all rules are disabled, when you install the solution, we recommend that you do not enable all rules at once to prevent noise, instead use a staged approach, enabling rules over time, ensuring you are not receiving noise or false positives. Ensure alerts are operationalized, i.e. a plan exists to respond to each of the alerts. We consider the following rules to be easiest to setup, so recommend to start with them
1. Deactivation of Security Audit Log
1. Client Configuration Change
1. Change in Sensitive Privileged User
1. Client configuration change
1. Sensitive privileged user logon
1. Sensitive privileged user makes a change in other
1. Sensitive privilege user password change and login
1. System configuration change
1. Brute force (RFC)
1. Function module tested

