---
title: Connect Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement to Microsoft Sentinel
description: Learn how to deploy the Microsoft Sentinel solution for Business Applications with Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement to Microsoft Sentinel
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 11/14/2024


#Customer intent: As a security administrator, I want to deploy a monitoring solution for Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement so that I can detect and respond to threats and suspicious activities in real-time.

---

# Connect Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement to Microsoft Sentinel

This article describes how to deploy the [Microsoft Sentinel solution for Microsoft Business Apps](../business-applications/solution-overview.md) to connect your Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement system to Microsoft Sentinel. The solution collects audit and activity logs to detect threats, suspicious activities, illegitimate activities, and more.

> [!IMPORTANT]
>
> - The Microsoft Sentinel solution for Microsoft Business Apps is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.

## Prerequisites

Before deploying the Microsoft Sentinel solution for Microsoft Business Apps, ensure that you meet the following prerequisites:

- Your Log Analytics workspace must be enabled for Microsoft Sentinel

- You must have read and write access to the workspace. You must be able to create:

  - [Data Collection Rules/Endpoints](/azure/azure-monitor/essentials/data-collection-rule-overview), with the `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules`
    
- Your organization must use Dynamics 365 Customer Engagement and/or one or more of the Power Platform workloads.

- Audit logging must also be enabled in Microsoft Purview. For more information, see [Turn auditing on or off for Microsoft Purview](/microsoft-365/compliance/audit-log-enable-disable)

- If you're working with Microsoft Dataverse, audit logging is supported only for production environments. For more information, see [Microsoft Dataverse and model-driven apps activity logging requirements](/power-platform/admin/enable-use-comprehensive-auditing#requirements).

## Install the solution and deploy your data connectors

1. Start by installing the Microsoft Sentinel solution for Microsoft Business Applications from the Microsoft Sentinel **Content hub**.

    For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md).

1. Select **Configuration > Data connectors**, and locate any of the following data connectors you want to deploy:

   - Microsoft Dataverse
   - Microsoft Power Platform Admin Activity
   
   - Microsoft Power Automate
      
1. For each data connector, on the side pane, select **Open connector page > Connect**.

## Configure data collection for Dataverse

When working with Microsoft Dataverse, Dataverse activity logging is available only for production environments, and isn't enabled by default. Enable auditing at both the [global level for Dataverse](/power-platform/admin/manage-dataverse-auditing#startstop-auditing-for-an-environment-and-set-retention-policy), and for each Dataverse entity:

- To enable auditing on default entities, import one of the following Power Platform managed solutions:

    - For use with Dynamics 365 CE Apps, import [https://aka.ms/AuditSettings/Dynamics](https://aka.ms/AuditSettings/Dynamics).
    - Otherwise, import [https://aka.ms/AuditSettings/DataverseOnly](https://aka.ms/AuditSettings/DataverseOnly).

    The solution enables detailed auditing for each of the default entities listed in the following file: [https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE5eo4g](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE5eo4g).

- To enable auditing on custom entities, you must manually enable detailed auditing on each of the custom entities. For more information, see [Manage Dataverse auditing](/power-platform/admin/manage-dataverse-auditing#turn-on-or-off-auditing-for-specific-fields-on-an-entity).

    To get the full incident detection value of the solution, we recommend that you enable, for each Dataverse entity you want to audit, the following options in the **General** tab of the Dataverse entity settings page:

    -  Under the **Data Services** section, select **Auditing**.
    -  Under the **Auditing** section, select **Single record auditing** and **Multiple record auditing**. 

    Make sure to save and publish your customizations.

## Verify log ingestion to Microsoft Sentinel

1. After deploying your data connectors and configuring data collection, run activities like create, update, and delete to generate logs for data that you enabled for monitoring.

1. For Power Platform activity logs, wait 60 minutes for Microsoft Sentinel to ingest the data.

1. To verify that Microsoft Sentinel is getting the data you expect, run KQL queries against the data tables that collect logs from your data connectors.

   For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), run KQL queries on the **General** > **Logs** page. In the [Defender portal](https://security.microsoft.com/), run KQL queries in the **Investigation & response** > **Hunting** > **Advanced hunting**.

   For example, to verify your Power Platform log ingestion, run the following query to return 50 rows from the table with the Power Apps activity logs.

      ```kusto
   PowerPlatformAdminActivity
   | take 50
   ```

The following table lists the Log Analytics tables to query.

|Log Analytics tables |Data collected |
|---------|---------|
|PowerPlatformAdminActivity|Power Platform administrative logs|
|PowerAutomateActivity |Power Automate activity logs |
|DataverseActivity |Dataverse and model-driven apps activity logging|


   

## Related content

- [What is the Microsoft Sentinel solution for Microsoft Business Apps?](solution-overview.md)

- [Security content reference for Microsoft Power Platform and Microsoft Dynamics 365 Customer Engagement](power-platform-solution-security-content.md)
