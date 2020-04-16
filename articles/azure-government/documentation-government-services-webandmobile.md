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
ms.date: 11/22/2019
ms.author: gsacavdm
---
# Azure Government Web + Mobile

This article outlines the web and mobile services for the Azure Government environment, describing feature variations that differ from the public version, as well as any environment-specific considerations.

## Azure Cognitive Search

[Azure Cognitive Search](https://docs.microsoft.com/azure/search/) is generally available in Azure Government. For a self-directed exploration of search functionality using public government data, visit the [Content Search and Intelligence](https://documentsearch.azurewebsites.net/home/) web site, select the dataset "US Court of Appeals District 1", and then choose one of the demo options.

Search features that have been widely adopted in government search applications include [cognitive skills](https://docs.microsoft.com/azure/search/cognitive-search-concept-intro), useful for extracting structure and information from large undifferentiated text documents.

Basic query syntax, formulating queries to search over large amounts of content, is also relevant to application developers. Azure Cognitive Search supports two syntaxes: [simple](https://docs.microsoft.com/azure/search/query-simple-syntax) and [full](https://docs.microsoft.com/azure/search/query-lucene-syntax). You can review [query expression examples](https://docs.microsoft.com/azure/search/search-query-simple-examples) for an orientation.

### Variations
The endpoint for search services created in Azure Government is as follows:

| Service Type | Azure Public | Azure Government |
| ------------ | ------------ | ---------------- |
| Azure Cognitive Search Service |\*.search.windows.net |\*.search.windows.us|

All generally available and preview features in the public cloud are also available in Azure Government.

### Considerations

The following information identifies the Azure Government boundary for Azure Cognitive Search:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| ----------------------------------- | --------------------------------------- |
| All data stored and processed in Azure Cognitive Search can contain Azure Government-regulated data. | Azure Cognitive Search metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your service. Do not enter regulated/controlled data into the following fields: Subscription name, Resource groups, Service name, Resource names, Resource tags, or any object you name or describe in Cognitive Search (indexes, indexers, data sources, synonym maps, and skillsets). Do not include sensitive data in HTTP headers sent to the REST API pr in search/query strings sent as part of the API.|

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

- Deployment
    - Deployment Options: Only Local Git Repository and External Repository are available.
- Development Tools
    - Resource explorer


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

