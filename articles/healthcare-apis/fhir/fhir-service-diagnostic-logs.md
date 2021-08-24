---
title: View and enable diagnostic settings in the FHIR service - Azure Healthcare APIs
description: This article describes how to enable diagnostic settings in the FHIR service and review some sample queries for these logs.
services: healthcare-apis
author: ginalee-dotcom
ms.service: healthcare-apis
ms.topic: how-to
ms.date: 08/20/2021
ms.author: zxue
---

# View and enable diagnostic settings in the FHIR service

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you'll learn how to enable diagnostic settings in the FHIR service in the Azure Healthcare APIs (hereby called the FHIR service) and review some sample queries for these logs. Access to diagnostic logs is essential for any healthcare service. Compliance with regulatory requirements like Health Insurance Portability and Accountability Act (HIPAA), is a must. To access this feature in the Azure portal, refer to the steps below.

## Enable audit logs

1. Select your FHIR service in the Azure portal.

2. Browse to **Diagnostic** settings under the **Monitoring** menu option.

   [ ![Screenshot of the diagnostic settings page in the Azure portal.](media/diagnostic-logs/fhir-diagnostic-settings-screen.png) ](media/diagnostic-logs/fhir-diagnostic-settings-screen.png#lightbox)

3. Select **+ Add diagnostic settings**.

4. Enter a name for the setting.

5. Select the method you want to use to access your diagnostic logs.

**Archive to a storage account** is used for auditing or manual inspection. 
The storage account you want to use needs to be already created.

**Stream to event hub** is used for ingestion by a third-party service or custom analytic solution. 
You will need to create an event hub namespace and event hub policy before you can configure this step.

**Stream to the Log Analytics** is used for sending logs and metrics to a Log Analytics workspace in Azure Monitor. 
You will need to create your Logs Analytics workspace before you can select this option.

6. Select **AuditLogs**.

   [ ![Screenshot of checkbox used for enabling or disabling audit logs.](media/diagnostic-logs/fhir-diagnostic-settings-add.png) ](media/diagnostic-logs/fhir-diagnostic-settings-add.png#lightbox)

7. Select **Save**.

> [!NOTE]
> It might take up to 15 minutes for the first logs to display in the Log Analytics Workspace. Also, if the FHIR service is moved from one resource group or subscription to another, update the settings after the move is complete.


## Audit log details

At this time, the FHIR service returns the following fields in the audit log:

|Field Name|Type|Notes|
|----------|----|-----|
|CallerIdentity |Dynamic|A generic property bag containing identity information.|
|CallerIdentityIssuer | String| Issuer|
|CallerIdentityObjectId | String| Oject_ID|
|CallerIPAddress | String| The caller’s IP address.|
|CorrelationId | String| Correlation ID|
|FhirResourceType | String| The resource type for which the operation was executed.|
|LogCategory | String| The log category (we're currently returning ‘AuditLogs’ LogCategory).|
|Location | String| The location of the server that processed the request. For example, South Central US.|
|OperationDuration | Int| The time it took to complete this request in seconds.|
|OperationName | String| Describes the type of operation. For example, update and search-type.|
|RequestUri | String| The request URI.|
|ResultType | String| The available values currently are Started, Succeeded, or Failed.|
|StatusCode | Int| The HTTP status code. For example, 200.|
|TimeGenerated | DateTime| Date and time of the event.|
|Properties | String| Describes the properties of the fhirResourceType.|
|SourceSystem | String| Source System that's always Azure in this case.|
|TenantId | String | Tenant ID|
|Type | String| Type of log that's always MicrosoftHealthcareApisAuditLog in this case.|
|_ResourceId | String| Details about the resource.|		
		
## Sample queries

Listed below are a few basic Application Insights queries you can use to explore your log data.

Run the following query to view the **100 most recent** logs.

Insights
MicrosoftHealthcareApisAuditLogs
| limit 100

Run the following query to group operations by **FHIR Resource Type**.

Insights
MicrosoftHealthcareApisAuditLogs 
| summarize count() by FhirResourceType

Run the following query to get all the **failed results**.

Insights
MicrosoftHealthcareApisAuditLogs 
| where ResultType == "Failed" 	

## Conclusion

Having access to diagnostic logs is essential for monitoring a service and providing compliance reports. The FHIR service allows you to do these actions through diagnostic logs.

FHIR is the registered trademark of [HL7](https://www.hl7.org/fhir/index.html) and is used with the permission of HL7.

## Next steps

In this article, you learned how to enable audit logs for the FHIR service. 

> [!NOTE]
> Metrics will be added when the Azure Healthcare APIs is generally available.


For an overview of the FHIR service, see

>[!div class="nextstepaction"]
>[FHIR service overview](overview.md)	


	
		
		
		
		
		
		
		
		
		
		

		
		
