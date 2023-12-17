---
title: Enable diagnostic logging in the DICOM service - Azure Health Data Services
description: This article explains how to enable diagnostic logging in the DICOM service.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: conceptual
ms.date: 10/13/2023
ms.author: mmitrik
---

# Enable audit and diagnostic logging in the DICOM service

In this article, you'll learn how to enable diagnostic logging in DICOM service and be able to review some sample queries for these logs. Access to diagnostic logs is essential for any healthcare service where compliance with regulatory requirements is a must. The feature in DICOM service enables diagnostic logs is the [Diagnostic settings](../../azure-monitor/essentials/diagnostic-settings.md) in the Azure portal. 

## Enable logs

1. To enable logging DICOM service, select your DICOM service in the Azure portal.
2. Select the **Activity log** on the left pane, and then select **Diagnostic settings**.

   [ ![Screenshot of Azure activity log.](media/dicom-activity-log.png) ](media/dicom-activity-log.png#lightbox)

3. Select **+ Add diagnostic setting**.

   [ ![Screenshot of Add Diagnostic settings.](media/add-diagnostic-settings.png) ](media/add-diagnostic-settings.png#lightbox)

4. Enter the **Diagnostic settings name**.

   [ ![Screenshot of Configure Diagnostic settings.](media/configure-diagnostic-settings.png) ](media/configure-diagnostic-settings.png#lightbox)

5. Select the **Category** and **Destination** details for accessing the diagnostic logs.

   * **Send to Log Analytics workspace** in the Azure Monitor. You need to create your Logs Analytics workspace before you can select this option. For more information about the platform logs, see [Overview of Azure platform logs](../../azure-monitor/essentials/platform-logs-overview.md).
   * **Archive to a storage account** for auditing or manual inspection. The storage account you want to use needs to be already created.
   * **Stream to an event hub** for ingestion by a third-party service or custom analytic solution. You need to create an event hub namespace and event hub policy before you can configure this step.
   * **Send to partner solution** that you're working with as partner organization in Azure. For information about potential partner integrations, see [Azure partner solutions documentation](../../partner-solutions/overview.md)

     For information about supported metrics, see [Supported metrics with Azure Monitor](.././../azure-monitor/essentials/metrics-supported.md).

6. Select **Save**.


   > [!Note] 
   > It might take up to 15 minutes for the first Logs to show in Log Analytics. Also, if the DICOM service is moved from one resource group or subscription to another, update the settings once the move is complete. 
 
   For information on how to work with diagnostic logs, see [Azure Resource Log documentation](../../azure-monitor/essentials/platform-logs-overview.md)

## Log details
The log schema used differs based on the destination. Log Analytics has a schema that differs from other destinations. Each log type has a schema that differs.

### Audit log details

#### Raw logs

The DICOM service returns the following fields in the audit log as seen when streamed outside of Log Analytics: 

|Field Name  |Type  |Notes  |
|---------|---------|---------|
|correlationId|String|Correlation ID
|operationName|String|Describes the type of operation (for example, Retrieve, Store, Query, etc.) 
|time|DateTime|Date and time of the event. 
|resourceId|String| Azure path to the resource.
|identity|Dynamic|A generic property bag containing identity information (currently doesn't apply to DICOM).
|location|String|The location of the server that processed the request.
|uri|String|The request URI.
|resultType|String| The available values currently are Started, Succeeded, or Failed.
|resultSignature|Int|The HTTP Status Code (for example, 200)
|type|String|Type of log (it's always MicrosoftHealthcareApisAuditLog in this case).
|level|String|Log level (Informational, Error).


#### Log Analytics logs

The DICOM service returns the following fields in the audit sign-in Log Analytics: 

|Field Name  |Type  |Notes  |
|---------|---------|---------|
|CorrelationId|String|Correlation ID
|OperationName|String|Describes the type of operation (for example, Retrieve, Store, Query, etc.) 
|TimeGenerated [UTC]|DateTime|Date and time of the event. 
|_ResourceId|String| Azure path to the resource.
|Identity|Dynamic|A generic property bag containing identity information (currently doesn't apply to DICOM).
|Uri|String|The request URI.
|ResultType|String| The available values currently are Started, Succeeded, or Failed.
|StatusCode|Int|The HTTP Status Code (for example, 200)
|Type|String|Type of log (it's always AHDSDicomAuditLogs in this case).
|Level|String|Log level (Informational, Error).
|TenantId|String| Tenant ID.


### Diagnostic log details

#### Raw logs

The DICOM service returns the following fields in the audit log as seen when streamed outside of Log Analytics: 

|Field Name  |Type  |Notes  |
|---------|---------|---------|
|correlationId|String|Correlation ID
|operationName|String|Describes the type of operation (for example, Retrieve, Store, Query, etc.) 
|time|DateTime|Date and time of the event. 
|resultDescription|String|Description of the log entry. An example is a diagnostic log with a validation warning message when storing a file.
|resourceId|String| Azure path to the resource.
|identity|Dynamic|A generic property bag containing identity information (currently doesn't apply to DICOM).
|location|String|The location of the server that processed the request.
|properties|String|Additional information about the event in JSON array format. Examples include DICOM identifiers present in the request.
|level|String|Log level (Informational, Error).

#### Log Analytics logs

The DICOM service returns the following fields in the audit sign-in Log Analytics: 

|Field Name  |Type  |Notes  |
|---------|---------|---------|
|CorrelationId|String|Correlation ID
|OperationName|String|Describes the type of operation (for example, Retrieve, Store, Query, etc.) 
|TimeGenerated|DateTime|Date and time of the event. 
|Message|String|Description of the log entry. An example is a diagnostic log with a validation warning message when storing a file.
|Location|String|The location of the server that processed the request.
|Properties|String|Additional information about the event in JSON array format. Examples include DICOM identifiers present in the request.
|LogLevel|String|Log level (Informational, Error).

## Sample Log Analytics queries

Here are a few basic Application Insights queries you can use to explore your log data.

Run the following query to see the **100 most recent** logs:

```Application Insights
MicrosoftHealthcareApisAuditLogs
| limit 100
```

Run the following query to group operations by **DICOM Resource Type**:

```Application Insights
MicrosoftHealthcareApisAuditLogs 
| summarize count() by DICOMResourceType
```

Run the following query to get all the **failed results**

```Application Insights
MicrosoftHealthcareApisAuditLogs 
| where ResultType == "Failed" 
```

## Next steps

Having access to diagnostic logs is essential for monitoring a service and providing compliance reports. The DICOM service allows you to do these actions through diagnostic logs. For more information, see [Azure Activity Log event schema](.././../azure-monitor/essentials/activity-log-schema.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]