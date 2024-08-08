---
title: Enable SAP detections and threat protection with Microsoft Sentinel
description: This article shows you how to configure initial security content for the Microsoft Sentinel solution for SAP applications in order to start enabling SAP detections and threat protection.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 07/23/2024
---

# Enable SAP detections and threat protection

While deploying the Microsoft Sentinel data collector agent and solution for SAP applications provides you with the ability to monitor SAP systems for suspicious activities and identify threats, extra configuration steps are required to ensure the solution is optimized for your SAP deployment. This article provides best practices for getting started with the security content delivered with the Microsoft Sentinel solution for SAP applications, and is the last step in deploying the SAP integration.

:::image type="content" source="media/deployment-steps/settings.png" alt-text="Diagram of the SAP solution deployment flow, highlighting the Configure solution settings step." border="false":::

Content in this article is relevant for your **security** team.

> [!IMPORTANT]
> Some components of the Microsoft Sentinel solution for SAP applications are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

Before configuring the settings described in this article, you must have your data connector agent and solution content installed.

For more information, see [Deploy the Microsoft Sentinel solution for SAP applications from the content hub](deploy-sap-security-content.md) and [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md).


## Start enabling analytics rules

By default, all analytics rules in the Microsoft Sentinel solution for SAP applications are provided as [alert rule templates](../manage-analytics-rule-templates.md#manage-template-versions-for-your-scheduled-analytics-rules-in-microsoft-sentinel). We recommend a staged approach, where you use the templates to create a few rules at a time, allowing time for fine-tuning each scenario.

We recommend starting with the following analytics rules:

- [Change in Sensitive privileged user](sap-solution-security-content.md#suspicious-privileges-operations)
- [Sensitive privileged user logged in](sap-solution-security-content.md#suspicious-privileges-operations)
- [Sensitive privileged user makes a change in other user](sap-solution-security-content.md#suspicious-privileges-operations)
- [Sensitive Users Password Change and Login](sap-solution-security-content.md#suspicious-privileges-operations)
- [Client Configuration Change](sap-solution-security-content.md#attempts-to-bypass-sap-security-mechanisms)
- [Function Module tested](sap-solution-security-content.md#persistency)

For more information, see [Built-in analytics rules](sap-solution-security-content.md#built-in-analytics-rules) and [Threat detection in Microsoft Sentinel](../threat-detection.md).

## Configure watchlists

Configure your Microsoft Sentinel solution for SAP applications by providing customer-specific information in the following watchlists:

|Watchlist name  |Configuration details  |
|---------|---------|
|**SAP - Systems**     |  The **SAP - Systems** watchlist defines the SAP systems that are present in the monitored environment. <br><br>For every system, specify: <br>- The SID<br>- Whether it's a production system or a dev/test environment<br>- A meaningful description <br><br>Configured data is used by some analytics rules, which might react differently if relevant events appear in a development or a production system.       |
|**SAP - Networks**     |  The **SAP - Networks** watchlist outlines all networks used by the organization. It's primarily used to identify whether or not user sign-ins originate from within known segments of the network, or if a user's sign-in origin changes unexpectedly. <br><br>There are many approaches for documenting network topology. You could define a broad range of addresses, like *172.16.0.0/16*, and name it *Corporate Network*, which is good enough for tracking sign-ins from outside that range. However, a more segmented approach, allows you better visibility into potentially atypical activity. <br><br>For example, you might define the following segments and geographical locations: <br>- 192.168.10.0/23:  Western Europe <br>-  10.15.0.0/16: Australia <br><br>In such cases, Microsoft Sentinel can differentiate a sign-in from *192.168.10.15* in the first segment from a sign-in from *10.15.2.1* in the second segment. Microsoft Sentinel alerts you if such behavior is identified as atypical.       |
|**SAP - Sensitive Function Modules** <br><br>**SAP - Sensitive Tables** <br><br>**SAP - Sensitive ABAP Programs**<br><br>**SAP - Sensitive Transactions**     |  **Sensitive data watchlists** identify sensitive actions or data that can be carried out or accessed by users. <br><br>While several well-known operations, tables, and authorizations are preconfigured in the watchlists, we recommend that you consult with your SAP BASIS team to identify the operations, transactions, authorizations and tables are considered to be sensitive in your SAP environment, and update the lists as needed. |
|**SAP - Sensitive Profiles** <br><br>**SAP - Sensitive Roles**<br><br>**SAP - Privileged Users** <br><br>**SAP - Critical Authorizations** | The Microsoft Sentinel solution for SAP applications uses user data gathered in **user data watchlists** from SAP systems to identify which users, profiles, and roles should be considered sensitive. While sample data is included in the watchlists by default, we recommend that you consult with your SAP BASIS team to identify the sensitive users, roles, and profiles in your organization and update the lists as needed.|

After the initial solution deployment, it might take some time until the watchlists are populated with data. If you open a watchlist for editing and find that it's empty, wait a few minutes and try again.

For more information, see [Available watchlists](sap-solution-security-content.md#available-watchlists).

## Use a workbook to check compliance for your SAP security controls

The Microsoft Sentinel solution for SAP applications includes the **SAP - Security Audit Controls** workbook, which helps you check compliance for your SAP security controls. The workbook provides a comprehensive view of the security controls that are in place and the compliance status of each control.

For more information, see [Check compliance for your SAP security controls with the SAP - Security Audit Controls workbook(Preview)](sap-audit-controls-workbook.md).

## Related content

For more information, see:

- [Automatic attack disruption for SAP (Preview)](deployment-attack-disrupt.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Update Microsoft Sentinel's SAP data connector agent](update-sap-data-connector.md)
