---
title: Azure services that support Azure AD authentication - Azure AD
description: List of services that support Azure AD authentication
services: active-directory
author: barclayn
ms.author: barclayn
ms.date: 12/02/2021
ms.topic: conceptual
ms.service: active-directory
ms.subservice: msi
manager: karenh444
ms.custom: references_regions
---

# Azure services that support Azure AD authentication

The following services support Azure AD authentication.

## New format


| Service Name                    |  Documentation                                                                                                                                                                                |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| API Management                  | [Authorize developer accounts by using Azure Active Directory in Azure API Management](../../api-management/api-management-howto-aad.md)                                                                                            |
| Azure App Configuration         | [Authorize access to Azure App Configuration using Azure Active Directory](../../azure-app-configuration/concept-enable-rbac.md)                                                                                                           |
| Azure App Services              | [Configure your App Service or Azure Functions app to use Azure AD login](../../app-service/configure-authentication-provider-aad.md)    |     
| Azure Batch                     | [Authenticate Batch service solutions with Active Directory](../../batch/batch-aad-auth.md)         |
| Azure Container Registry        | [Authenticate with an Azure container registry](../../container-registry/container-registry-authentication.md)                                                                       |
| Azure Cognitive Services        | [Authenticate requests to Azure Cognitive Services](../../cognitive-services/authentication.md?tabs=powershell#authenticate-with-azure-active-directory)                                                                          |
| Azure DataBricks                | [Authenticate using Azure Active Directory tokens](https://docs.microsoft.com/azure/databricks/dev-tools/api/latest/aad/)
| Azure Data Explorer             | [How-To Authenticate with AAD for Azure Data Explorer Access](https://docs.microsoft.com/azure/data-explorer/how-to-authenticate-with-aad)                                                                                                     |
| Azure Data Lake Storage Gen1    | [Authentication with Azure Data Lake Storage Gen1 using Azure Active Directory](../../storage/common/data-lakes-store-authentication-using-azure-active-directory.md)                                                                                                  |
| Azure Digital Twins             | [Set up an Azure Digital Twins instance and authentication (portal)](../../digital-twins/how-to-set-up-instance-portal.md#set-up-user-access-permissions)                                                                                            |
| Azure Event Hubs                | [Authenticate an application with Azure Active Directory to access Event Hubs resources](../../event-hubs/authenticate-application.md)
| Azure IoT Hub                   | [Control access to IoT Hub](../../iot-hub/iot-hub-devguide-security.md)                                                                               |
| Azure Key Vault                 | [Authentication in Azure Key Vault](../../key-vault/general/authentication.md)
| Azure Kubernetes Service (AKS)  | [Control access to cluster resources using Kubernetes role-based access control and Azure Active Directory identities in Azure Kubernetes Service](../../aks/azure-ad-rbac.md)                                                                                                                           |
| Azure Machine Learning Services | [Set up authentication for Azure Machine Learning resources and workflows](/machine-learning/how-to-setup-authentication.md)                                                                                         |
| Azure Maps                      | [Manage authentication in Azure Maps](../../azure-maps/how-to-manage-authentication.md) |
| Azure Media services            | [Access the Azure Media Services API with Azure AD authentication](../../media-services/previous/media-services-use-aad-auth-to-access-ams-api.md) |
| Azure Monitor                   | [Azure AD authentication for Application Insights (Preview)](../../azure-monitor/app/azure-ad-authentication?tabs=net)                                                                                              |
| Azure Resource Manager          | [Azure security baseline for Azure Resource Manager](https://docs.microsoft.com/security/benchmark/azure/baselines/resource-manager-security-baseline?toc=/azure/azure-resource-manager/management/toc.json)
| Azure Service Fabric            | [Set up Azure Active Directory for client authentication](../../service-fabric/service-fabric-cluster-creation-setup-aad.md)                                                                                                        |
| Azure Service Bus               | [Service Bus authentication and authorization](../../service-bus-messaging/service-bus-authentication-and-authorization.md)
| Azure SignalR Service           | [Authorize access with Azure Active Directory for Azure SignalR Service](../../azure-signalr/signalr-concept-authorize-azure-active-directory.md)                                                                                                     |
| Azure SQL                       | [Use Azure Active Directory authentication](../../azure-sql/database/authentication-aad-overview.md)                                                                                     |
| Azure SQL Managed Instance      | [What is Azure SQL Managed Instance?](../../azure-sql/managed-instance/sql-managed-instance-paas-overview.md#azure-active-directory-integration)                                                                                       |
| Azure Static Web Apps           | [Authentication and authorization for Azure Static Web Apps](../../static-web-apps/authentication-authorization.md?tabs=invitations)
| Azure Storage                   | [Authorize access to blobs using Azure Active Directory](../../storage/blobs/authorize-access-azure-active-directory.md) |
| Azure Virtual Machines                | [Secure and use policies on virtual machines in Azure](../devices/howto-vm-sign-in-azure-ad-windows.md)                                                                  |


Old format shown below. 
## Azure Resource Manager

Refer to the following list to configure access to Azure Resource Manager:

- [Assign access via Azure portal](howto-assign-access-portal.md)
- [Assign access via PowerShell](howto-assign-access-powershell.md)
- [Assign access via Azure CLI](howto-assign-access-CLI.md)
- [Assign access via Azure Resource Manager template](../../role-based-access-control/role-assignments-template.md)

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://management.azure.com/`| ![Available][check] |
| Azure Government | `https://management.usgovcloudapi.net/` | ![Available][check] |
| Azure Germany | `https://management.microsoftazure.de/` | ![Available][check] |
| Azure China 21Vianet | `https://management.chinacloudapi.cn` | ![Available][check] |

## Azure Key Vault

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://vault.azure.net`| ![Available][check] |
| Azure Government | `https://vault.usgovcloudapi.net` | ![Available][check] |
| Azure Germany |  `https://vault.microsoftazure.de` | ![Available][check] |
| Azure China 21Vianet | `https://vault.azure.cn` | ![Available][check] |

## Azure Data Lake

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://datalake.azure.net/` | ![Available][check] |
| Azure Government |  | Not Available |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

## Azure SQL

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://database.windows.net/` | ![Available][check] |
| Azure Government | `https://database.usgovcloudapi.net/` | ![Available][check] |
| Azure Germany | `https://database.cloudapi.de/` | ![Available][check] |
| Azure China 21Vianet | `https://database.chinacloudapi.cn/` | ![Available][check] |

## Azure Data Explorer

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://<account>.<region>.kusto.windows.net` | ![Available][check] |
| Azure Government | `https://<account>.<region>.kusto.usgovcloudapi.net` | ![Available][check] |
| Azure Germany | `https://<account>.<region>.kusto.cloudapi.de` | ![Available][check] |
| Azure China 21Vianet | `https://<account>.<region>.kusto.chinacloudapi.cn` | ![Available][check] |

## Azure Event Hubs

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://eventhubs.azure.net` | ![Available][check] |
| Azure Government |  | Not Available |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

## Azure Service Bus

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://servicebus.azure.net`  | ![Available][check] |
| Azure Government |  | ![Available][check] |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

## Azure Storage blobs and queues

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://storage.azure.com/` <br /><br />`https://<account>.blob.core.windows.net` <br /><br />`https://<account>.queue.core.windows.net` | ![Available][check] |
| Azure Government | `https://storage.azure.com/`<br /><br />`https://<account>.blob.core.usgovcloudapi.net` <br /><br />`https://<account>.queue.core.usgovcloudapi.net` | ![Available][check] |
| Azure Germany | `https://storage.azure.com/`<br /><br />`https://<account>.blob.core.cloudapi.de` <br /><br />`https://<account>.queue.core.cloudapi.de` | ![Available][check] |
| Azure China 21Vianet | `https://storage.azure.com/`<br /><br />`https://<account>.blob.core.chinacloudapi.cn` <br /><br />`https://<account>.queue.core.chinacloudapi.cn` | ![Available][check] |

## Azure Analysis Services

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://*.asazure.windows.net` | ![Available][check] |
| Azure Government | `https://*.asazure.usgovcloudapi.net` | ![Available][check] |
| Azure Germany | `https://*.asazure.cloudapi.de` | ![Available][check] |
| Azure China 21Vianet | `https://*.asazure.chinacloudapi.cn` | ![Available][check] |

> [!Note]
> Microsoft Power BI also [supports managed identities](../../stream-analytics/powerbi-output-managed-identity.md).

[check]: media/services-support-managed-identities/check.png "Available"