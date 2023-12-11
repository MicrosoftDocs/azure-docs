---
title: Relocation guidance for Azure Public IP
titleSufffix: Azure Database for Azure Public IP
description: Find out about relocation guidance for Azure Public IP
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 12/11/2023
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.custom:
  - references_regions
  - subject-reliability
---


# Relocation guidance for Azure Public IP

This article shows you how to relocate Azure Public IP when moving a Platform as a Service (PaaS) service to another region. When you relocate a PaaS service to another region, the public IP address and the URL changes. As result, you must also update the Azure Public IP in the dependent services.



## Relocate Azure Public IP

To successfully relocate your PaaS service, you must:

1. Create a dependency map that includes all the Azure services used by Azure Public IP. 

1. Select the relocation strategy for each service that uses the Azure Public IP. To learn how to orchestrate and sequence multiple relocation procedures, see [automation guidelines]().

>[!IMPORTANT]
> When your move the Azure Public IP and corresponding PaaS service to a new region, the public IP address changes. You must make sure to update your DNS configuration or the endpoint configuration of the connecting services or clients.

### Public IP Addresses

- [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519&msclkid=46a2185ca6a611ec9a4eb6de3c2c4589)
- [Azure CND](/azure/cdn/cdn-pop-list-api)

### Calling IP Addresses

- [Azure Logic App](/azure/app-service-logic/app-service-logic-limits-and-config#configuration)
- [Traffic Manager](/azure/traffic-manager/traffic-manager-monitoring#faq)

## URLs

```powershell
# Azure Public
PS > Get-AzureRmEnvironment -name AzureCloud | format-list

# Azure China
PS > Get-AzureRmEnvironment -name AzureChinaCloud | format-list

# Azure US Goverment
PS > Get-AzureRmEnvironment -name AzureUSGovernment | format-list
```

| Name | AzureCloud| Extended|
|-------|-------------|------|
| ActiveDirectoryServiceEndpointResourceId          | `https://management.core.windows.net/`         |                                    |
| GalleryUrl                                        | `https://gallery.azure.com/`                   |                                  |
| ManagementPortalUrl                               | `https://portal.azure.com/`                |                                    |                                   
| ServiceManagementUrl                              | `https://management.core.windows.net/`           |                                    |
| PublishSettingsFileUrl                            | `https://go.microsoft.com/fwlink/?LinkID=301775` |                                    |
| ResourceManagerUrl                                | `https://management.azure.com/`             |                                    |
| SqlDatabaseDnsSuffix                              | `.database.windows.net`                        |                                    |
| StorageEndpointSuffix                             | `core.windows.net`                             |                                    |
| ActiveDirectoryAuthority                          | `https://login.microsoftonline.com/`          |                                    |
| GraphUrl                                          | `https://graph.windows.net/`                    |                                    |
| GraphEndpointResourceId                           | `https://graph.windows.net/`                    |                                    |
| TrafficManagerDnsSuffix                           | `trafficmanager.net`                            |                                    |
| AzureKeyVaultDnsSuffix                            | `vault.azure.net`                             |                                    |
| DataLakeEndpointResourceId                        | `https://datalake.azure.net/`                    |                                    |
| AzureDataLakeStoreFileSystemEndpointSuffix        |`azuredatalakestore.net`                         |                                    |
| AzureDataLakeAnalyticsCatalogAndJobEndpointSuffix | `azuredatalakeanalytics.net`                     |                                    |
| AzureKeyVaultServiceEndpointResourceId            | `https://vault.azure.net`                        |                                    |
| ContainerRegistryEndpointSuffix                   | `azurecr.io`                                     |                                    |
| AzureOperationalInsightsEndpointResourceId        | `https://api.loganalytics.io`                    |                                    |
| AzureOperationalInsightsEndpoint                  | `https://api.loganalytics.io/v1`                 |                                    |
| AzureAnalysisServicesEndpointSuffix               | `asazure.windows.net`                            |                                    |
| AnalysisServicesEndpointResourceId                |` https://region.asazure.windows.net`             |                                    |
| AzureAttestationServiceEndpointSuffix             | `attest.azure.net`                               |                                    |
| AzureAttestationServiceEndpointResourceId         | `https://attest.azure.net`                       |                                    |
| AzureSynapseAnalyticsEndpointSuffix               | `dev.azuresynapse.net`                           |                                    |
| AzureSynapseAnalyticsEndpointResourceId           | `https://dev.azuresynapse.net`                   |                                    |
| ExtendedProperties                                | OperationalInsightsEndpoint                    | `https://api.loganalytics.io/v1`     |
|                                                   | OperationalInsightsEndpointResourceId          | `https://api.loganalytics.io`        |
|                                                   | AzureAnalysisServicesEndpointSuffix            | `asazure.windows.net`                |
|                                                   | AnalysisServicesEndpointResourceId             | `https://region.asazure.windows.net` |
|                                                   | AzureAttestationServiceEndpointSuffix          | `attest.azure.net`                   |
|                                                   | AzureAttestationServiceEndpointResourceId      | `https://attest.azure.net`           |
|                                                   | AzureSynapseAnalyticsEndpointSuffix            | `dev.azuresynapse.net`               |
|                                                   | AzureSynapseAnalyticsEndpointResourceId        | `https://dev.azuresynapse.net`       |
|                                                   | ManagedHsmServiceEndpointResourceId            | `https://managedhsm.azure.net`       |
|                                                   | ManagedHsmServiceEndpointSuffix                | `managedhsm.azure.net`               |
|                                                   | MicrosoftGraphEndpointResourceId               | `https://graph.microsoft.com/`       |
|                                                   | MicrosoftGraphUrl                              | `https://graph.microsoft.com `       |
| BatchEndpointResourceId                           | `https://batch.core.windows.net/`                |                                    |