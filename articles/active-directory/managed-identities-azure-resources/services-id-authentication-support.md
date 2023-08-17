---
title: Azure services that support Azure AD authentication
description: List of services that support Azure AD authentication
services: active-directory
author: barclayn
ms.author: barclayn
ms.date: 08/01/2023
ms.topic: conceptual
ms.service: active-directory
ms.subservice: msi
manager: amycolannino
---

# Azure services that support Azure AD authentication

The following services support Azure AD authentication. New services are added to Azure every day. Refer to each service's documentation for specific details on their level of Azure Active Directory support.

| Service Name                    |  Documentation                                                                                                                                                                                |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| API Management                  | [Authorize developer accounts by using Azure Active Directory in Azure API Management](../../api-management/api-management-howto-aad.md)                                                                                            |
| Azure App Configuration         | [Authorize access to Azure App Configuration using Azure Active Directory](../../azure-app-configuration/concept-enable-rbac.md)                                                                                                           |
| Azure App Services              | [Configure your App Service or Azure Functions app to use Azure AD login](../../app-service/configure-authentication-provider-aad.md)    |
| Azure Batch                     | [Authenticate Batch service solutions with Active Directory](../../batch/batch-aad-auth.md)         |
| Azure Container Registry        | [Authenticate with an Azure container registry](../../container-registry/container-registry-authentication.md)                                                                       |
| Azure Cognitive Services        | [Authenticate requests to Azure Cognitive Services](../../ai-services/authentication.md?tabs=powershell#authenticate-with-azure-active-directory)                                                                          |
| Azure Communication Services    | [Authenticate to Azure Communication Services](../../communication-services/concepts/authentication.md)   |
| Azure Cosmos DB                 | [Configure role-based access control with Azure Active Directory for your Azure Cosmos DB account](../../cosmos-db/how-to-setup-rbac.md) |
| Azure Databricks                | [Authenticate using Azure Active Directory tokens](/azure/databricks/dev-tools/api/latest/aad/)
| Azure Data Explorer             | [How-To Authenticate with Azure Active Directory for Azure Data Explorer Access](/azure/data-explorer/kusto/management/access-control/how-to-authenticate-with-aad)                                                                                                     |
| Azure Data Lake Storage Gen1    | [Authentication with Azure Data Lake Storage Gen1 using Azure Active Directory](../../data-lake-store/data-lakes-store-authentication-using-azure-active-directory.md)                                                                                                  |
| Azure Database for PostgreSQL   | [Use Azure Active Directory for authentication with PostgreSQL](../../postgresql/howto-configure-sign-in-aad-authentication.md)
| Azure Digital Twins             | [Set up an Azure Digital Twins instance and authentication (portal)](../../digital-twins/how-to-set-up-instance-portal.md#set-up-user-access-permissions)                                                                                            |
| Azure Event Hubs                | [Authenticate an application with Azure Active Directory to access Event Hubs resources](../../event-hubs/authenticate-application.md)
| Azure IoT Hub                   | [Control access to IoT Hub](../../iot-hub/iot-hub-devguide-security.md)                                                                               |
| Azure Key Vault                 | [Authentication in Azure Key Vault](../../key-vault/general/authentication.md)
| Azure Kubernetes Service (AKS)  | [Control access to cluster resources using Kubernetes role-based access control and Azure Active Directory identities in Azure Kubernetes Service](../../aks/azure-ad-rbac.md)                                                                                                                           |
| Azure Machine Learning Services | [Set up authentication for Azure Machine Learning resources and workflows](../../machine-learning/how-to-setup-authentication.md)                                                                                         |
| Azure Maps                      | [Manage authentication in Azure Maps](../../azure-maps/how-to-manage-authentication.md) |
| Azure Media services            | [Access the Azure Media Services API with Azure AD authentication](/azure/media-services/previous/media-services-use-aad-auth-to-access-ams-api) |
| Azure Monitor                   | [Azure AD authentication for Application Insights (Preview)](../../azure-monitor/app/azure-ad-authentication.md?tabs=net)                                                                                              |
| Azure Resource Manager          | [Azure security baseline for Azure Resource Manager](/security/benchmark/azure/baselines/resource-manager-security-baseline?toc=/azure/azure-resource-manager/management/toc.json)
| Azure Service Fabric            | [Set up Azure Active Directory for client authentication](../../service-fabric/service-fabric-cluster-creation-setup-aad.md)                                                                                                        |
| Azure Service Bus               | [Service Bus authentication and authorization](../../service-bus-messaging/service-bus-authentication-and-authorization.md)
| Azure SignalR Service           | [Authorize access with Azure Active Directory for Azure SignalR Service](../../azure-signalr/signalr-concept-authorize-azure-active-directory.md)                                                                                                     |
| Azure SQL                       | [Use Azure Active Directory authentication](/azure/azure-sql/database/authentication-aad-overview)                                                                                     |
| Azure SQL Managed Instance      | [What is Azure SQL Managed Instance?](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview#azure-active-directory-integration)                                                                                       |
| Azure Static Web Apps           | [Authentication and authorization for Azure Static Web Apps](../../static-web-apps/authentication-authorization.md?tabs=invitations)
| Azure Storage                   | [Authorize access to blobs using Azure Active Directory](../../storage/blobs/authorize-access-azure-active-directory.md) |
| Azure Virtual Machines                | [Secure and use policies on virtual machines in Azure](../devices/howto-vm-sign-in-azure-ad-windows.md)   |

## Next steps

- [Microsoft Azure operated by 21Vianet developer guide](/azure/china/resources-developer-guide)
- [Compare Azure Government and global Azure](../../azure-government/compare-azure-government-global-azure.md)
- [Azure services that can use Managed identities to access other services](managed-identities-status.md)
