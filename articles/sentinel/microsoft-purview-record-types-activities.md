---
title: Microsoft Purview Information Protection connector reference - audit log record types and activities support in Microsoft Sentinel
description: This article lists supported audit log record types and activities when using the Microsoft Purview Information Protection connector with Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 01/02/2023
---

# Microsoft Purview Information Protection connector reference - audit log record types and activities support

This article lists supported audit log record types and activities when using the Microsoft Purview Information Protection connector with Microsoft Sentinel.

When you use the [Microsoft Purview Information Protection connector](connect-microsoft-purview.md), you stream audit logs into the  
`MicrosoftPurviewInformationProtection` standardized table. Data is 
gathered through the [Office Management API](/office/office-365-management-api/office-365-management-activity-api-schema), which uses a structured schema. 

## Supported audit log record types


|Value  |Member |Name  |Description  |Operations |
|---------|---------|---------|---------|---------|
|93 |`AipDiscover` |Microsoft Purview scanner events. |Describes the type of access. |
|94 |`AipSensitivityLabelAction` |Microsoft Purview sensitivity label event. |The operation type for the audit log. The name of the user or admin activity for a description of the most common operations: <ul><li>`SensitivityLabelApplied`</li><li>`SensitivityLabelUpdated`</li><li>`SensitivityLabelRemoved`</li><li>`SensitivityLabelPolicyMatched`</li><li>`SensitivityLabeledFileOpened`</li></ul> |
|95 |`AipProtectionAction` |Microsoft Purview protection events. |Contains information related to Microsoft Purview protection events. |
|96 |`AipFileDeleted` | Microsoft Purview file deletion event. |Contains information related to Microsoft Purview file deletion events. |
|97 |`AipHeartBeat` |Microsoft Purview heartbeat event. |The operation type for the audit log. The name of the user or admin activity for a description of the most common operations or activities:<ul><li>`SensitivityLabelApplied`</li>`SensitivityLabelUpdated`</li><li>`SensitivityLabelRemoved`</li><li>`SensitivityLabelPolicyMatched`</li><li>`SensitivityLabeledFileOpened`</li> |
|43 |`MipLabel` | Events detected in the transport pipeline of email messages that are tagged (manually or automatically) with sensitivity labels. | |
|82 |`SensitivityLabelPolicyMatch` |Events generated when a file labeled with a sensitive label is opened or renamed. |
|83 |`SensitivityLabelAction` |Event generated when sensitivity labels are applied, updated or removed. | |
|84 |`SensitivityLabeledFileAction` | Events generated when a file labeled with a sensitivity label is opened or renamed. | |
|71 |`MipAutoLabelSharePointItem` |Auto-labeling events in SharePoint | |
|72 |`MipAutoLabelSharePointPolicyLocation` |Auto-labeling policy events in SharePoint. | |
|75 |`MipAutoLabelExchangeItem` |Auto-labeling events in Microsoft Exchange. | |


## Supported activities

|Friendly name |Operation |Description |
|---------|---------|---------| 
|Applied sensitivity label to file |`FileSensitivityLabelApplied` |A sensitivity label was applied to a document via Microsoft 365 apps, Office on the web, or an auto-labeling policy. |
|Changed sensitivity label applied to file |`FileSensitivityLabelChanged` |A different sensitivity label was applied to a document. An Office on the web or an auto-labeling policy changed. |
|Removed sensitivity label from file |`FileSensitivityLabelRemoved` |A sensitivity label was removed from a document via Microsoft 365 apps, Office on the web, an auto-labeling policy, or the [Unlock-SPOSensitivityLabelEncryptedFile](/powershell/module/sharepoint-online/unlock-sposensitivitylabelencryptedFile) cmdlet. |
|Applied sensitivity label to site |`SensitivityLabelApplied` | A sensitivity label was applied to a SharePoint or Teams site. |
|Changed sensitivity label applied to file |`SensitivityLabelUpdated` |A different sensitivity label was applied to a document. |
|Removed sensitivity label from site |`SensitivityLabelRemoved` |A sensitivity label was removed from a SharePoint or Teams site. |
| |`SiteSensitivityLabelApplied` |A sensitivity label was applied to a SharePoint or Teams site. |
|Changed sensitivity label on a site |`SensitivityLabelChanged` |A different sensitivity label was applied to a SharePoint or Teams site. |
|Removed sensitivity label from site |`SiteSensitivityLabelRemoved` |A sensitivity label was removed from a SharePoint or Teams site. |
|Document |`DocumentSensitivityMismatchDetected` |Non auditable activity. Signals to Substrate that the item was removed from the SharedWithMe view. This is the same as the `RemovedFromSharedWithMe` operation, but without audit. |

## Next steps

In this article, you learned about the audit log record types and activities supported when you use the Microsoft Purview Information Protection connector. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.