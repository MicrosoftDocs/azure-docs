---
title: Microsoft Sentinel Solution for SAP® BTP - security content reference
description: Learn about the built-in security content provided by the  Microsoft Sentinel Solution for SAP® BTP.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 03/30/2023
---

#  Microsoft Sentinel Solution for SAP® BTP: security content reference

This article details the security content available for the Microsoft Sentinel Solution for SAP® BTP.

> [!IMPORTANT]
> The Microsoft Sentinel Solution for SAP® BTP is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Available security content currently includes a built-in workbook and analytics rules. You can also add SAP-related [watchlists](../watchlists.md) to use in your search, detection rules, threat hunting, and response playbooks.

[Learn more about the solution](sap-btp-solution-overview.md).

## SAP BTP workbook

The BTP Activity Workbook provides a dashboard overview of BTP activity. 

:::image type="content" source="./media/sap-btp-security-content/sap-btp-workbook-btp-overview.png" alt-text="Screenshot of the Overview tab of the SAP BTP workbook." lightbox="./media/sap-btp-security-content/sap-btp-workbook-btp-overview.png":::

The **Overview** tab shows: 

- An overview of BTP subaccounts, helping analysts identify the most active accounts and the type of ingested data. 
- Subaccount sign-in activity, helping analysts identify spikes and trends that may be associated with sign-in failures in SAP Business Application Studio (BAS). 
- Timeline of BTP activity and number of BTP security alerts, helping analysts search for any correlation between the two.
 
The **Identity Management** tab shows a grid of identity management events, such as user and security role changes, in a human-readable format. The search bar lets you quickly find specific changes.

:::image type="content" source="./media/sap-btp-security-content/sap-btp-workbook-identity-management.png" alt-text="Screenshot of the Identity Management tab of the SAP BTP workbook." lightbox="./media/sap-btp-security-content/sap-btp-workbook-identity-management.png":::

For more information, see [Tutorial: Visualize and monitor your data](../monitor-your-data.md) and [Deploy Microsoft Sentinel Solution for SAP® BTP](deploy-sap-btp-solution.md).

## Built-in analytics rules

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **BTP - Failed access attempts across multiple BAS subaccounts** |Identifies failed Business Application Studio (BAS) access attempts over a predefined number of subaccounts.<br>Default threshold: 3 | Run failed login attempts to BAS over the defined threshold number of subaccounts. <br><br>**Data sources**: SAPBTPAuditLog_CL | Discovery, Reconnaissance |
| **BTP - Malware detected in BAS dev space** |Identifies instances of malware detected by the SAP internal malware agent within BAS developer spaces. | Copy or create a malware file in a BAS developer space. <br><br>**Data sources**: SAPBTPAuditLog_CL| Execution, Persistence, Resource Development |
| **BTP - User added to sensitive privileged role collection** |Identifies identity management actions where a user is added to a set of monitored privileged role collections. | Assign one of the following role collections to a user: "Subaccount Service Administrator", "Subaccount Administrator", "Connectivity and Destination Administrator", "Destination Administrator", "Cloud Connector Administrator”. <br><br>**Data sources**: SAPBTPAuditLog_CL | Lateral Movement, Privilege Escalation |
| **BTP - Trust and authorization Identity Provider monitor** |Identifies create, read, update, and delete (CRUD) operations on Identity Provider settings within a subaccount. | Change, read, update, or delete any of the identity provider settings within a subaccount. <br><br>**Data sources**: SAPBTPAuditLog_CL | Credential Access, Privilege Escalation |
| **BTP - Mass user deletion in a subaccount** |Identifies user account deletion activity where the number of deleted users exceeds a predefined threshold.<br>Default threshold: 10 | Delete count of user accounts over the defined threshold. <br><br>**Data sources**: SAPBTPAuditLog_CL | Impact |

## Next steps

In this article, you learned about the security content provided with the Microsoft Sentinel Solution for SAP® BTP.

- [Deploy Microsoft Sentinel solution for SAP® BTP](deploy-sap-btp-solution.md)
- [Microsoft Sentinel Solution for SAP® BTP overview](sap-btp-solution-overview.md)
