---
title: Azure Government Web, Mobile and API | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: gsacavdm
manager: pathuff

ms.assetid: a1e173a9-996a-4091-a2e3-6b1e36da9ae1
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 11/19/2019
ms.author: gsacavdm
---
# Azure Government Web + Mobile

This article outlines the web and mobile services for the Azure Government environment, describing feature variations that differ from the public version, as well as any environment-specific considerations.

## Azure Cognitive Search

[Azure Cognitive Search](https://docs.microsoft.com/azure/search/) is generally available in Azure Government. For a self-directed exploration of search functionality using public data, visit the [Content Search and Intelligence](http://documentsearch.azurewebsites.net/home/) web site, select the dataset "US Court of Appeals District 1", and then choose one of the demo options.

Functionality that has proven popular in government search applications includes [cognitive skills](https://docs.microsoft.com/azure/search/cognitive-search-concept-intro), useful for extracting structure and information from large undifferentiated text documents.

Basic query syntax, formulating queries to search over large amounts of content, is also relevant to application developers. Azure Cognitive Search supports two syntaxes: [simple](https://docs.microsoft.com/azure/search/query-simple-syntax) and [full](https://docs.microsoft.com/azure/search/query-lucene-syntax). You can review [query expression examples](https://docs.microsoft.com/azure/search/search-query-simple-examples) for an orientation.

### Variations
The endpoint for search services created in Azure Government is as follows:

| Service Type | Azure Public | Azure Government |
| ------------ | ------------ | ---------------- |
| Azure Cognitive Search Service |\*.search.windows.net |\*.search.windows.us|

All generally available and preview features in the public cloud is also available in Azure Government.

<!-- ### Considerations
The following information identifies the Azure Government boundary for Azure Cognitive Search:

EXAMPLE

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| ----------------------------------- | --------------------------------------- |
| Data entered, stored, and processed within Azure Cognitive Search can contain export-controlled data. Binaries running within Azure App Service. Static authenticators, such as passwords and smartcard PINs for access to Azure platform components. Private keys of certificates used to manage Azure platform components. SQL connection strings. Other security information/secrets, such as certificates, encryption keys, master keys, and storage keys stored in Azure services. | Metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your Azure App Service. Do not enter Regulated/controlled data into the following fields: Resource groups, Resource names, Resource tags|

FROM NATI

1.	Management APIs (none of the following is considered secured): 
a.	The actual name of the search service (e.g. customers can use credit card numbers for their search service name)
b.	The names of the Azure subscription and resource group containing the search service 
c.	Resource tags (key-value strings a user can associate with its search service)
2.	Data APIs:
a.	Resource metadata, like index definitions, indexers, data sources, synonym-maps, skillsets. Note that some parts of these metadata are not secured like the names of created resources (e.g. index name, data source name) and certain parts of index metadata (e.g. field names, custom analyzers names, etc.), while other parts of metadata are secured, like data source’s connection strings and index definition’ encrypted index credentials, for example.
b.	Indexed documents, including data from data sources that is indexed to the service
c.	Search/query strings sent as part of the search API  
d.	Http headers sent to Azure search REST API -->


## App Services
### Variations
Azure App Services is generally available in Azure Government.

The address for Azure App Service apps created in Azure Government is different from 
those apps created in the public cloud:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| App Service |\*.azurewebsites.net |\*.azurewebsites.us|
| Service Principal ID| abfa0a7c-a6b6-4736-8310-5855508787cd | 6a02c803-dafd-4136-b4c3-5a6f318b4714 |

Some App Service features available in the public cloud are not yet available 
in Azure Government:

- Diagnose and solve problems
- Deployment
    - Deployment Options: Only Local Git Repository and External Repository are available.
    - Deployment Center
- Settings
    - Application Insights
- Development Tools
    - Performance test
    - Resource explorer
    - PHP Debugging
- Support & Troubleshooting
    - App Service Advisor
- App Service Certificates


### Considerations
The following information identifies the Azure Government boundary for App Service:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| Data entered, stored, and processed within Azure App Service can contain export-controlled data. Binaries running within Azure App Service. Static authenticators, such as passwords and smartcard PINs for access to Azure platform components. Private keys of certificates used to manage Azure platform components. SQL connection strings. Other security information/secrets, such as certificates, encryption keys, master keys, and storage keys stored in Azure services. |Metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your Azure App Service. Do not enter Regulated/controlled data into the following fields: Resource groups, Resource names, Resource tags|

## API Management
For details on this service and how to use it, see [Azure API Management documentation](../api-management/index.yml).

### Variations

Azure API Management service  is generally available in Azure Government. Features that are not currently available in API Management service for Azure Government are:

- Azure AD B2C Integration 
    - Integration with Azure AD B2C is not available in Azure Government 

The URLs for accessing Azure API Management in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
|API Management gateway| \*.azure-api.net| \*.azure-api.us|
|API Management portal | \*.portal.azure-api.net |\*.portal.azure-api.us| 
|API Management management|	\*.management.azure-api.net	|\*.management.azure-api.us|

### Considerations
The following information identifies the Azure Government boundary for Azure API Management service:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
|All data stored and processed in Azure API Management service can contain Azure Government-regulated data.|Azure API Management service metadata is not permitted to contain export-controlled data. Do not enter regulated/controlled data into the following fields: API Management service name, Subscription name, Resource groups, Resource tags.|

## Next Steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog.](https://blogs.msdn.microsoft.com/azuregov/)

