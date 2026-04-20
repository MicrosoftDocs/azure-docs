---

title: Reference list of Azure domains 
description: Reference list of Azure domains (not comprehensive) 
services: security
author: msmbaldwin
ms.author: mbaldwin

ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 01/06/2026
---
# Reference list of Azure domains (not comprehensive)

This page is a partial list of the Azure domains in use. Some of them are REST API endpoints.

Unlike IP address ranges (which Azure publishes in the [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) download), a complete list of all Azure FQDNs isn't feasible because:

- **Dynamic resource names**: Azure creates subdomains dynamically based on customer-provided resource names (for example, `myapp.azurewebsites.net` or `mystorageaccount.blob.core.windows.net`), resulting in millions of unique FQDNs.
- **Regional variations**: Many services use region-specific endpoints (for example, `*.westus2.cloudapp.azure.com`).
- **Constant evolution**: New services and endpoints are added regularly.

For firewall configurations, use the wildcard patterns shown in the **Subdomain** column (for example, `*.blob.core.windows.net`) rather than attempting to enumerate all possible FQDNs. For service-specific endpoint requirements, see the individual service documentation.


|Service  |Subdomain  |
|---------|---------|
|[Azure Access Control Service](https://azure.microsoft.com/blog/one-month-retirement-notice-access-control-service/) (retired)|*.accesscontrol.windows.net|
|[Microsoft Entra ID](/entra/fundamentals/whatis)|*.graph.windows.net / *.onmicrosoft.com|
|[Azure API Management](https://azure.microsoft.com/services/api-management/)|*.azure-api.net|
|[Azure BizTalk Services](https://azure.microsoft.com/pricing/details/biztalk-services/) (retired)|*.biztalk.windows.net|
|[Azure Blob storage](../../storage/blobs/storage-blobs-introduction.md)|*.blob.core.windows.net|
|[Azure Cloud Services](../../cloud-services/cloud-services-choose-me.md) and [Azure Virtual Machines](/azure/virtual-machines/)|*.cloudapp.net|
|[Azure Cloud Services](../../cloud-services/cloud-services-choose-me.md) and [Azure Virtual Machines](/azure/virtual-machines/)|*.cloudapp.azure.com|
|[Azure Container Registry](https://azure.microsoft.com/services/container-registry/)|*.azurecr.io|
|Azure Container Service (deprecated)|*.azurecontainer.io|
|[Azure Content Delivery Network (CDN)](https://azure.microsoft.com/services/cdn/)|*.vo.msecnd.net|
|[Azure Cosmos DB](/azure/cosmos-db/)|*.cosmos.azure.com|
|[Azure Cosmos DB](/azure/cosmos-db/)|*.documents.azure.com|
|[Azure Files](../../storage/files/storage-files-introduction.md)|*.file.core.windows.net|
|[Azure Front Door](/azure/frontdoor/) (classic)|*.azurefd.net|
|[Azure Front Door](/azure/frontdoor/) Standard/Premium|*.z01.azurefd.net|
|[Azure Key Vault](/azure/key-vault/general/overview)| *.vault.azure.net|
|[Azure Kubernetes Service](/azure/aks/)|*.azmk8s.io|
|Azure Management Services|*.management.core.windows.net|
|[Azure Media Services](https://azure.microsoft.com/services/media-services/)|*.origin.mediaservices.windows.net|
|[Azure Mobile Apps](https://azure.microsoft.com/services/app-service/mobile/)|*.azure-mobile.net|
|[Azure Queue Storage](https://azure.microsoft.com/services/storage/queues/)|*.queue.core.windows.net|
|[Azure Service Bus](../../service-bus-messaging/service-bus-messaging-overview.md)|*.servicebus.windows.net|
|[Azure SQL Database](https://azure.microsoft.com/services/sql-database/)|*.database.windows.net|
|[Azure CDN](/azure/cdn/) (migrated to [Azure Front Door](/azure/frontdoor/))|*.azureedge.net|
|[Azure Table Storage](../../storage/tables/table-storage-overview.md)|*.table.core.windows.net|
|[Azure Traffic Manager](../../traffic-manager/traffic-manager-overview.md)|*.trafficmanager.net|
|Azure Websites|*.azurewebsites.net|
|[GitHub Codespaces](https://visualstudio.microsoft.com/services/github-codespaces/)|*.visualstudio.com|
