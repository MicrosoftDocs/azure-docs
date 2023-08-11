---
title: API-driven inbound provisioning concepts
description: An overview of API-driven inbound provisioning. 
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: reference
ms.date: 06/22/2023
ms.author: jfields
ms.reviewer: chmutali
---

# API-driven inbound provisioning concepts (Public preview)

This document provides a conceptual overview of the Azure AD API-driven inbound user provisioning.

> [!IMPORTANT]
> API-driven inbound provisioning is currently in public preview and is governed by [Preview Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Introduction

Today enterprises have a variety of authoritative systems of record. To establish end-to-end identity lifecycle, strengthen security posture and stay compliant with regulations, identity data in Azure Active Directory must be kept in sync with workforce data managed in these systems of record. The *system of record* could be an HR app, a payroll app, a spreadsheet or SQL tables in a database hosted either on-premises or in the cloud. 

With API-driven inbound provisioning, the Azure AD provisioning service now supports integration with *any* system of record. Customers and partners can use *any* automation tool of their choice to retrieve workforce data from the system of record and ingest it into Azure AD. The IT admin has full control on how the data is processed and transformed with attribute mappings. Once the workforce data is available in Azure AD, the IT admin can configure appropriate joiner-mover-leaver business processes using [Lifecycle Workflows](../governance/what-are-lifecycle-workflows.md).  

## Supported scenarios

Several inbound user provisioning scenarios are enabled using API-driven inbound provisioning. This diagram demonstrates the most common scenarios.

:::image type="content" source="media/inbound-provisioning-api-concepts/api-workflow-scenarios.png" alt-text="Diagram that shows API scenarios." lightbox="media/inbound-provisioning-api-concepts/api-workflow-scenarios.png":::

### Scenario 1: Enable IT teams to import HR data extracts using any automation tool
Flat files, CSV files and SQL staging tables are commonly used in enterprise integration scenarios. Employee, contractor and vendor information are periodically exported into one of these formats and an automation tool is used to sync this data with enterprise identity directories. With API-driven inbound provisioning, IT teams can use any automation tool of their choice (example: PowerShell scripts or Azure Logic Apps) to modernize and simplify this integration.   

### Scenario 2: Enable ISVs to build direct integration with Azure AD
With API-driven inbound provisioning, HR ISVs can ship native synchronization experiences so that changes in the HR system automatically flow into Azure AD and connected on-premises Active Directory domains. For example, an HR app or student information systems app can send data to Azure AD as soon as a transaction is complete or as end-of-day bulk update. 

### Scenario 3: Enable system integrators to build more connectors to systems of record
Partners can build custom HR connectors to meet different integration requirements around data flow from systems of record to Azure AD. 

In all the above scenarios, the integration is greatly simplified as Azure AD provisioning service takes over the responsibility of performing identity profile comparison, restricting the data sync to scoping logic configured by the IT admin and executing rule-based attribute flow and transformation managed in the Microsoft Entra admin portal.   

## End-to-end flow
:::image type="content" source="media/inbound-provisioning-api-concepts/end-to-end-workflow.png" alt-text="Diagram of the end-to-end workflow of inbound provisioning." lightbox="media/inbound-provisioning-api-concepts/end-to-end-workflow.png":::

### Steps of the workflow

1. IT Admin configures [an API-driven inbound user provisioning app](inbound-provisioning-api-configure-app.md) from the Microsoft Entra Enterprise App gallery. 
1. IT Admin [grants access permissions](inbound-provisioning-api-grant-access.md) and provides endpoint access details to the API developer/partner/system integrator.
1. The API developer/partner/system integrator builds an API client to send authoritative identity data to Azure AD.
1. The API client reads identity data from the authoritative source.
1. The API client sends a POST request to provisioning [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint associated with the provisioning app. 
     >[!NOTE] 
     > The API client doesn't need to perform any comparisons between the source attributes and the target attribute values to determine what operation (create/update/enable/disable) to invoke. This is automatically handled by the provisioning service. The API client simply uploads the identity data read from the source system by packaging it as bulk request using SCIM schema constructs. 
1. If successful, an ```Accepted 202 Status``` is returned. 
1. The Azure AD Provisioning Service processes the data received, applies the attribute mapping rules and completes user provisioning.
1. Depending on the provisioning app configured, the user is provisioned either into on-premises Active Directory (for hybrid users) or Azure AD (for cloud-only users).
1. The API Client then queries the provisioning logs API endpoint for the status of each record sent.
1. If the processing of any record fails, the API client can check the error details and include records corresponding to the failed operations in the next bulk request (step 5). 
1. At any time, the IT Admin can check the status of the provisioning job and view events in the provisioning logs.

### Key features of API-driven inbound user provisioning

- Available as a provisioning app that exposes an *asynchronous* Microsoft Graph provisioning [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint accessed using valid OAuth token.
- Tenant admins must grant API clients interacting with this provisioning app the Graph permission `SynchronizationData-User.Upload`. 
- The Graph API endpoint accepts valid bulk request payloads using SCIM schema constructs.
- With SCIM schema extensions, you can send any attribute in the bulk request payload. 
- The rate limit for the inbound provisioning API is 40 bulk upload requests per second. Each bulk request can contain a maximum of 50 user records, thereby supporting an upload rate of 2000 records per second. 
- Each API endpoint is associated with a specific provisioning app in Azure AD. You can integrate multiple data sources by creating a provisioning app for each data source. 
- Incoming bulk request payloads are processed in near real-time.
- Admins can check provisioning progress by viewing the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md). 
- API clients can track progress by querying [provisioning logs API](/graph/api/resources/provisioningobjectsummary).

### Recommended learning path

| # | Learning objective | Guidance |
|-------|-------|-------|
| 1. | You want to learn more about the inbound provisioning API specs. | Refer to [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API spec document. |
| 2. | You want to get more familiar with the API-driven provisioning concepts, scenarios and limitations. | Refer to  [Frequently asked questions about API-driven inbound provisioning](inbound-provisioning-api-faqs.md). |
| 3. | As an *Admin user*, you want to quickly test the inbound provisioning API. | * Create [API-driven inbound provisioning app](inbound-provisioning-api-configure-app.md) <br> * [Test API using Graph Explorer](inbound-provisioning-api-graph-explorer.md) |
| 4. | With a service account or managed identity, you want to quickly test the inbound provisioning API. | * Create [API-driven inbound provisioning app](inbound-provisioning-api-configure-app.md) <br> * Grant [API permissions](inbound-provisioning-api-grant-access.md) <br> * [Test API using cURL](inbound-provisioning-api-curl-tutorial.md) or [Postman](inbound-provisioning-api-postman.md) |
| 5. | You want to extend the API-driven provisioning app to process more custom attributes. | Refer to the tutorial [Extend API-driven provisioning to sync custom attributes](inbound-provisioning-api-custom-attributes.md) |
| 6. | You want to automate data upload from your system of record to the inbound provisioning API endpoint. | Refer to the tutorials <br> * [Quick start with PowerShell](inbound-provisioning-api-powershell.md) <br> * [Quick start with Azure Logic Apps](inbound-provisioning-api-logic-apps.md) |
| 7. | You want to troubleshoot inbound provisioning API issues | Refer to the [troubleshooting guide](inbound-provisioning-api-issues.md). |


## Next steps
- [Configure API-driven inbound provisioning app](inbound-provisioning-api-configure-app.md)
- [Frequently asked questions about API-driven inbound provisioning](inbound-provisioning-api-faqs.md)
- [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](user-provisioning.md)
