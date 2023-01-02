---
title: Stream data from Microsoft Purview Information Protection to Microsoft Sentinel 
description: Stream data from Microsoft Purview Information Protection (formerly Microsoft Information Protection) to Microsoft Sentinel so you can analyze and report on data from the Microsoft Purview labeling clients and scanners.
author: limwainstein
ms.topic: how-to
ms.date: 01/02/2023
ms.author: lwainstein
#Customer intent: As a security operator, I want to get specific labeling data from Microsoft Purview, so I can track, analyze, report on the data and use it for compliance purposes.
---

# Stream data from Microsoft Purview Information Protection to Microsoft Sentinel

This article describes how to stream data from Microsoft Purview Information Protection (formerly Microsoft Information Protection) to Microsoft Sentinel. You can use the data ingested from the Microsoft Purview labeling clients and scanners to track, analyze, report on the data, and use it for compliance purposes. 

> [!IMPORTANT]
> The Microsoft Purview Information Protection connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.   

## Overview 

Auditing and reporting are an important part of the security and compliance strategy for many organizations. With the continued expansion of the technology landscape that has an ever-increasing number of systems, endpoints, operations, and regulations, it becomes even more important to have a comprehensive logging and reporting solution in place.

With the Microsoft Purview Information Protection connector, you stream auditing events generated from unified labeling clients and scanners. The data is then emitted to the Microsoft 365 audit log for central reporting in Microsoft Sentinel.
 
With the connector, you can:

- Track adoption of labels, explore, query and detects events.
- Monitor labeled and protected documents and emails 
- Monitor user access to labeled documents and emails, while tracking classification changes. 
- Gain visibility into activities performed on labels, policies, configurations, files and documents. This helps security teams to identify security breaches, and risk and compliance violations.
- Use the connector data during an audit, to prove that the organization is compliant.

### Schema and API

If you're currently using the Azure Information Protection connector, note that the Azure Information Protection (AIP) service is undergoing sunsetting. 

When you enable the Microsoft Purview Information Protection connector, audit logs stream into the standardized 
`MicrosoftPurviewInformationProtection` table. Data is gathered through the [Office Management API](/office/office-365-management-api/office-365-management-activity-api-schema), which uses a structured schema. The new standardized schema is adjusted to enhance the deprecated schema used by AIP, with more fields and easier access to 
parameters.

Review the list of supported [audit log record types and activities](microsoft-purview-record-types-activities.md).

## Prerequisites

Before you begin, verify that you have:

- The Microsoft Sentinel solution enabled. 
- A defined Microsoft Sentinel workspace.
- A valid license to [Microsoft Purview Information Protection](/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance).
- [Enabled Sensitivity labels for Office](/microsoft-365/compliance/sensitivity-labels-sharepoint-onedrive-files?view=o365-worldwide#use-the-microsoft-purview-compliance-portal-to-enable-support-for-sensitivity-labels) and [enabled auditing](/microsoft-365/compliance/turn-audit-log-search-on-or-off?view=o365-worldwide#use-the-compliance-center-to-turn-on-auditing).
- The Global Administrator or Security Administrator role on the workspace.

## Set up the connector

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.
1. In the **Data connectors** blade, in the search bar, type *Purview*.
1. Select the **Microsoft Purview Information Protection (Preview)** connector.
1. Below the connector description, select **Open connector page**.
1. Under **Configuration**, select **Connect**.

    When a connection is established, the **Connect** button changes to **Disconnect**. You are now connected to the Microsoft Purview Information Protection.     

## Disconnect the Azure Information Protection connector

If you the Azure Information Protection connector is still connected in your workspace, you must disconnect the Azure Information Protection connector. 

We recommend to use the Azure Information Protection connector and the Microsoft Purview Information Protection connector simultaneously (both enabled) for a short testing period. After the testing period, we recommend that you disconnect the Azure Information Protection connector to avoid data duplication and redundant costs. 

To disconnect the Azure Information Protection connector:

1. In the **Data connectors** blade, in the search bar, type *Azure Information Protection*. 
1. Select **Azure Information Protection**.
1. Below the connector description, select **Open connector page**.
1. Under **Configuration**, select **Disconnect**.

## Known Issues And Limitations

### Office Management API doesn't obtain a Downgrade Label

- The Office Management API doesn't obtain a Downgrade Label with the names of the labels before and after the downgrade. To retrieve this information, extracting the `labelId` of each label and enrich the results. 

    Here's an example KQL query:

    ```kusto
    let labelsMap = parse_json('{'
     '"566a334c-ea55-4a20-a1f2-cef81bfaxxxx": "MyLabel1",'
     '"aa1c4270-0694-4fe6-b220-8c7904b0xxxx": "MyLabel2",'
     '"MySensitivityLabelId": "MyLabel3"'
     '}');
     MicrosoftPurviewInformationProtection
     | extend SensitivityLabelName = iif(isnotempty(SensitivityLabelId), 
    tostring(labelsMap[tostring(SensitivityLabelId)]), "")
     | extend OldSensitivityLabelName = iif(isnotempty(OldSensitivityLabelId), 
    tostring(labelsMap[tostring(OldSensitivityLabelId)]), "")
    ```
 
- The `MicrosoftPurviewInformationProtection` table and the `OfficeActivity` table might include some duplicated events.