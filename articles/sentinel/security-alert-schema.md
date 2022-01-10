---
title: Microsoft Sentinel security alert schema reference
description: This article displays the schema of security alerts in Microsoft Sentinel.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
ms.topic: reference
ms.date: 11/17/2021
ms.author: yelevin

---

# Microsoft Sentinel security alert schema reference

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This article lists supported Azure and third-party data source schemas, with links to their reference documentation.

## Schema definitions

| Column Name | Type | Descrption | Yechiel's Comments |
| --- | --- | --- | --- |
| **AlertLink** | string | Link to the alert in the portal of the originating product. |  |
| **AlertName** | string | Display name of the alert. For scheduled rules, it will be taken from the rule name. | ASC wanted to deprecate one (display and alert name) but left the 2 <br>For non-scheduled rules, what will this say? |
| **AlertSeverity** | string | Severity of the alert (informational, low, medium, high). |  |
| **AlertType** | string | The type of alert. Alerts of the same type should have the same name. For scheduled rules, this will be populated by the rule ID. | For other rule types, what is this? The alert type (anomaly, NRT, Microsoft Security, etc.)? |
| **CompromisedEntity** | string | Display name of the main entity being alerted on. |  |
| **ConfidenceLevel** | string | The confidence level of this alert: how sure the provider is that this is not a false positive. |  |
| **ConfidenceScore** | real | The confidence score of the alert, if applicable. This property allows for a more fine-grained representation of the confidence level of the alert compared to the ConfidenceLevel field. Valid values are in the range of 0.0-1.0 (inclusive). |  |
| **Description** | string | The description of the alert. |  |
| **DisplayName** | string | Display name of the alert. For scheduled rules   it will be taken from the rule name. | ASC wanted to deprecate one (display and alert name) but left the 2 |
| **EndTime** | datetime | The end time of the impact of the alert (the time of the last event or activity included in the alert). For scheduled rule alerts, this is the value of the TimeGenerated field for the last event captured by the query. |  |
| **Entities** | string | A list of entities related to the alert. This list can include a combination of entities of different types. The entities' types can be any of those defined in the [documentation](entities-reference.md). |  |
| **ExtendedLinks** | string | A bag (a collection) for all links related to the alert. This bag can include a combination of links of different types. |  |
| **ExtendedProperties** | string | A collection of other properties of the alert, including user-defined properties. Any custom details defined in the alert, and any dynamic content in the alert details, are stored here. |  |
| **IsIncident** | boolean | DEPRECATED. Will always be set to *false*. | was used before for ASC they had Alert (incident) and alert  |
| **ProcessingEndTime** | datetime | The time of the alert's publishing. For scheduled rule alerts, this is the value of the TimeGenerated field. |  |
| **ProductComponentName** | string | The name of the component of the product that generated the alert. |  |
| **ProductName** | string | The name of the product that published the alert. |  |
| **ProviderName** | string | The name of the alert provider ***------------------(e.g. Scheduled alert - ASI Scheduled Alerts, NRT - ASI NRT Alerts, Azure defender - Azure Security Center)------------------*** | This needs to be better differentiated from ProductName. Maybe a footnote (or a cross-reference) explaining what an alert provider is? |
| **RemediationSteps** | string | Manual action items to take to remediate the alert. |  |
| **ResourceId** | string | A unique identifier for the resource that the alert is associated with. |  |
| **SourceComputerId** | string | DEPRECATED. Was the agent ID that created the alert. |  |
| **SourceSystem** | string | DEPRECATED. Will always be populated with the string "Detection". | Not to document? Because deprecated? |
| **StartTime** | datetime | The start time of the impact of the alert (the time of the first event or activity included in the alert). For scheduled rule alerts, this is the value of the TimeGenerated field for the first event captured by the query. |  |
| **Status** | string | The status of the alert within the life cycle. [New / InProgress / Resolved / Dismissed / Unknown] |  |
| **SystemAlertId** | string | Internal unique ID for the alert in Sentinel. |  |
| **Tactics** | string | MITRE tactics associated with the alert, in comma-separated list form. |  |
| **TenantId** | string | Unique ID of the tenant. | Not to document |
| **TimeGenerated** | datetime | The time the alert was generated (in UTC). |  |
| **Type** | string | The name of the table. |  |
| **VendorName** | string | The vendor of the product that produces the alert. | Is this ever anything besides the manufacturer of ProductName/ProviderName? |
| **VendorOriginalId** | string | Unique id for the specific alert instance set by the provider. |  |
| **WorkspaceResourceGroup** | string | The Azure resource group for the Log Analytics workspace storing this alert | DEPRECATED |
| **WorkspaceSubscriptionId** | string | The Azure subscription ID for the Log Analytics workspace storing this alert | DEPRECATED |
|  |  |  |  |

## Next steps

Learn more about security alerts and analytics rules:

- [Detect threats out-of-the-box](detect-threats-built-in.md)

- [Create custom analytics rules to detect threats](detect-threats-custom.md)

- [Export and import analytics rules to and from ARM templates](import-export-analytics-rules.md)
