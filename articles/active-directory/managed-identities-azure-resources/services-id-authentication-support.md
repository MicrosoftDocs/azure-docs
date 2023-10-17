---
title: Azure services that support Microsoft Entra authentication
description: List of services that support Microsoft Entra authentication
services: active-directory
author: barclayn
ms.author: barclayn
ms.date: 08/01/2023
ms.topic: conceptual
ms.service: active-directory
ms.subservice: msi
manager: amycolannino
---

# Azure services that support Microsoft Entra authentication

The following services support Microsoft Entra authentication. New services are added to Azure every day. Refer to each service's documentation for specific details on their level of Microsoft Entra ID support.

| Service Name                    |  Documentation                                                                                                                                                                                |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| API Management                  | [Authorize developer accounts by using Microsoft Entra ID in Azure API Management](/azure/api-management/api-management-howto-aad)                                                                                            |
| Azure App Configuration         | [Authorize access to Azure App Configuration using Microsoft Entra ID](/azure/azure-app-configuration/concept-enable-rbac)                                                                                                           |
| Azure App Services              | [Configure your App Service or Azure Functions app to use Microsoft Entra login](/azure/app-service/configure-authentication-provider-aad)    |
| Azure Batch                     | [Authenticate Batch service solutions with Active Directory](/azure/batch/batch-aad-auth)         |
| Azure Container Registry        | [Authenticate with an Azure container registry](/azure/container-registry/container-registry-authentication)                                                                       |
| Azure AI services        | [Authenticate requests to Azure AI services](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)                                                                          |
| Azure Communication Services    | [Authenticate to Azure Communication Services](/azure/communication-services/concepts/authentication)   |
| Azure Cosmos DB                 | [Configure role-based access control with Microsoft Entra ID for your Azure Cosmos DB account](/azure/cosmos-db/how-to-setup-rbac) |
| Azure Databricks                | [Authenticate using Microsoft Entra tokens](/azure/databricks/dev-tools/auth)
| Azure Data Explorer             | [How-To Authenticate with Microsoft Entra ID for Azure Data Explorer Access](/azure/data-explorer/kusto/api/rest/authenticate-with-msal)                                                                                                     |
| Azure Data Lake Storage Gen1    | [Authentication with Azure Data Lake Storage Gen1 using Microsoft Entra ID](/azure/data-lake-store/data-lakes-store-authentication-using-azure-active-directory)                                                                                                  |
| Azure Database for PostgreSQL   | [Use Microsoft Entra ID for authentication with PostgreSQL](../develop/configure-app-multi-instancing.md)
| Azure Digital Twins             | [Set up an Azure Digital Twins instance and authentication (portal)](/azure/digital-twins/how-to-set-up-instance-portal#set-up-user-access-permissions)                                                                                            |
| Azure Event Hubs                | [Authenticate an application with Microsoft Entra ID to access Event Hubs resources](/azure/event-hubs/authenticate-application)
| Azure IoT Hub                   | [Control access to IoT Hub](../develop/configure-app-multi-instancing.md)                                                                               |
| Azure Key Vault                 | [Authentication in Azure Key Vault](/azure/key-vault/general/authentication)
| Azure Kubernetes Service (AKS)  | [Control access to cluster resources using Kubernetes role-based access control and Microsoft Entra identities in Azure Kubernetes Service](/azure/aks/azure-ad-rbac)                                                                                                                           |
| Azure Machine Learning Services | [Set up authentication for Azure Machine Learning resources and workflows](/azure/machine-learning/how-to-setup-authentication)                                                                                         |
| Azure Maps                      | [Manage authentication in Azure Maps](/azure/azure-maps/how-to-manage-authentication) |
| Azure Media services            | [Access the Azure Media Services API with Microsoft Entra authentication](/previous-versions/media-services/previous/media-services-use-aad-auth-to-access-ams-api) |
| Azure Monitor                   | [Microsoft Entra authentication for Application Insights (Preview)](/azure/azure-monitor/app/azure-ad-authentication?tabs=net)                                                                                              |
| Azure Resource Manager          | [Azure security baseline for Azure Resource Manager](/security/benchmark/azure/baselines/azure-resource-manager-security-baseline?toc=/azure/azure-resource-manager/management/toc.json)
| Azure Service Fabric            | [Set up Microsoft Entra ID for client authentication](/azure/service-fabric/service-fabric-cluster-creation-setup-aad)                                                                                                        |
| Azure Service Bus               | [Service Bus authentication and authorization](/azure/service-bus-messaging/service-bus-authentication-and-authorization)
| Azure SignalR Service           | [Authorize access with Microsoft Entra ID for Azure SignalR Service](/azure/azure-signalr/signalr-concept-authorize-azure-active-directory)                                                                                                     |
| Azure SQL                       | [Use Microsoft Entra authentication](/azure/azure-sql/database/authentication-aad-overview)                                                                                     |
| Azure SQL Managed Instance      | [What is Azure SQL Managed Instance?](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview#azure-active-directory-integration)                                                                                       |
| Azure Static Web Apps           | [Authentication and authorization for Azure Static Web Apps](/azure/static-web-apps/authentication-authorization?tabs=invitations)
| Azure Storage                   | [Authorize access to blobs using Microsoft Entra ID](/azure/storage/blobs/authorize-access-azure-active-directory) |
| Azure Virtual Machines                | [Secure and use policies on virtual machines in Azure](../devices/howto-vm-sign-in-azure-ad-windows.md)   |

## Next steps

- [Microsoft Azure operated by 21Vianet developer guide](/azure/china/resources-developer-guide)
- [Compare Azure Government and global Azure](/azure/azure-government/compare-azure-government-global-azure)
- [Azure services that can use Managed identities to access other services](managed-identities-status.md)
