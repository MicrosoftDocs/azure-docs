---
title: Inbound User Provisioning API concepts
description: How to find out when a critically important user is able to access an application you have configured for user provisioning with Azure Active Directory.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: concept
ms.date: 06/06/2023
ms.author: jfields
ms.reviewer: chmutali
---

# Introduction

This document provides a conceptual overview of the Azure AD Inbound User Provisioning API.

## What problem does the Inbound Provisioning API solve? 

As the enterprise identity control plane, customers should be able to flexibly connect their Azure AD tenant to *any* authoritative system of record for inbound identity provisioning. The “system of record” could be an HR app like UltiPro, a payroll app like ADP, a spreadsheet in Google Cloud or an on-premises Oracle database. 

The MS Graph Inbound Provisioning API endpoint opens the provisioning pipeline to a broader ecosystem of customers and partners.  Customers can use automation tools of their choice to retrieve data from authoritative sources and then post the data to this API endpoint, while the IT admin still retain retains control on how the incoming data is processed and transformed with attribute mappings configured using the Azure AD provisioning service. 

## Supported Scenarios

Several inbound user provisioning scenarios can be enabled using the inbound provisioning API endpoint. The diagram below demonstrates the most common scenarios. 

:::image type="content" source="media/application-provisioning-api-concepts/api-workflow-scenarios.png" alt-text="Diagram that shows API scenarios." lightbox="media/application-provisioning-api-concepts/api-workflow-scenarios.png":::

### Scenario 1: Enable CSV file imports
You can now read a CSV file, extract and send data to the Azure AD provisioning platform through the inbound provisioning API endpoint.

### Scenario 2: Enable ISVs to build direct integration with Azure AD
ISV partners who ship apps that act as the source of truth/system of records for identities can build native integrations using the API endpoint. For example, an HR app or Student Information Systems app can send data to Azure AD as soon as a transaction is complete. They can also send end-of-day transactions as a SCIM bulk request to the API endpoint.

### Scenario 3: Enable partners to build integrations with HR vendors
Partners who specialize in reading data from HR systems can build an integration service that transforms the HR data to a SCIM bulk request for provisioning users to Azure AD.  

## End-to-end flow
:::image type="content" source="media/application-provisioning-api-concepts/end-to-end-flow.png" alt-text="Diagram of the end-to-end workflow of inbound provisioning." lightbox="media/application-provisioning-api-concepts/end-to-end-workflow.png":::

### Steps of the workflow
    1) IT Admin creates a generic inbound provisioning app in the Azure AD Portal from the Enterprise App gallery. Specify worker data accepted by the API endpoint using SCIM schema exten)ions.   
    2) IT Admin provides endpoint access details to the developer/system integrator.
    3) Developer builds API client to send HR data to Azure AD.
    4) The API client reads HR data from CSV/SQL or any HR system.
    5) The API client sends a POST request to the Azure AD Provisioning Service. The data is a SCIM Bulk Request.
    6) If successful, an “Accepted 202 Status” is returned. 
    7) The Azure AD Provisioning Service then waits for the next sync cycle to apply attribute mappings and process data.
    8) The user is provisioned into AD or Azure AD.
    9) The API Client then queries the provisioning logs API endpoint for the status of each record sent.
    10) If the processing of any record fails, the API client can check the error details and include the HR record of failed workers in the next bulk request (step 5). 
    11)	The IT Admin can check the status of the provisioning job and view events in the provisioning logs at any time.

### Key features of the Inbound Provisioning API
- It is an MS Graph API endpoint that can be accessed using valid OAuth token.
- The API endpoint accepts valid SCIM bulk request payloads.
- With SCIM schema extensions, you can send any attribute in the payload. 
- Each SCIM bulk request can contain at max 50 records. (We plan to evaluate this limitation and select a reasonable limit based on private preview feedback.) 
- The API endpoint accepts SCIM bulk request payload in async mode.
- Each API endpoint is associated with a specific provisioning app in Azure AD. You can integrate multiple data sources by creating a provisioning app for each data source. 
- Incoming request payloads are staged for processing at regular sync intervals (currently ~40 minutes). (While testing, if you want to process a request payload faster, you can stop  
  and start the provisioning job from the portal. In future release, we will provide provision-on-demand capability.)
- Admins can check provisioning progress by viewing the provisioning logs. 
- API clients can track progress by querying provisioning logs.
- Microsoft is providing a sample CSV2SCIM PowerShell script to highlight the extensibility of this API approach and how it can be used to upload user data from CSV files. 


## Next steps
[Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](user-provisioning.md)
