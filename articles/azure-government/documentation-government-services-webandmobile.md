---
title: Azure Government Web, Mobile and API | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: brendalee
manager: zakramer

ms.assetid: a1e173a9-996a-4091-a2e3-6b1e36da9ae1
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/17/2017
ms.author: brendal
---
# Azure Government Web + Mobile
## App Services
### Variations
Azure App Services is generally available in Azure Government.

The Address for Azure App Service apps created in Azure Government is different from 
those apps created in the public cloud:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| App Service |*.azurewebsites.net |*.azurewebsites.us|

Some App Service features available in Azure Government have variations:

- Deployment Options are limited to local git and external git.

Some App Service features available in the public cloud are not yet available 
in Azure Government:

- App Service Environments
- Settings
    - Security scanning
- Development Tools
    - Performance test
    - Resource explorer
    - PHP Debugging
- Monitoring
    - Application Insights
    - Metrics per instance
    - Live HTTP traffic
    - Application events
    - FREB logs
- Support & Troubleshooting
    - App Service Advisor
    - Failure History
    - Diagnostics as a Service
    - Mitigate


### Considerations
The following information identifies the Azure Government boundary for App Service:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| Data entered, stored, and processed within Azure App Service can contain export-controlled data. Binaries running within Azure App Service. Static authenticators, such as passwords and smartcard PINs for access to Azure platform components. Private keys of certificates used to manage Azure platform components. SQL connection strings. Other security information/secrets, such as certificates, encryption keys, master keys, and storage keys stored in Azure services. |Metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your Azure App Service. Do not enter Regulated/controlled data into the following fields: Resource groups, Resource names, Resource tags|

## API Management
For details on this service and how to use it, see [Azure API Management documentation](../api-management/index.md).

### Variations

Azure API Management service is in public preview in Azure Government. Features that are not currently available in API Management service for Azure Government are:

- Azure Monitor Integration 
    - API Management and Azure Monitor integration is in progress in Azure Government.  As of now it is not available for customers.  Hence, Azure Monitor metrics and diagnostic logs will not be available to API Management customers in Azure Government.
- Azure AAD B2C Integration 
    - Integration with Azure AAD B2C is not available in Azure Government 

The URLs for accessing Azure API Management in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
|API Management gateway| *.azure-api.net| *.azure-api.us|
|API Management portal | *.portal.azure-api.net |*.portal.azure-api.us| 
|API Management management|	*.management.azure-api.net	|*.management.azure-api.us|

### Considerations
The following information identifies the Azure Government boundary for Azure API Management service:
| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
|All data stored and processed in Azure API Management service can contain Azure Government-regulated data.|Azure API Management service metadata is not permitted to contain export-controlled data. Do not enter regulated/controlled data into the following fields: API Management service name, Subscription name, Resource groups, Resource tags.|

## Next Steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog.](https://blogs.msdn.microsoft.com/azuregov/)

