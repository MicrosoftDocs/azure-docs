---
title: Bicep Samples
description: Find Bicep samples for some of the common Azure App Service scenarios. Learn how to automate your App Service deployment or management tasks.
author: seligj95
tags: azure-service-management

ms.topic: sample
ms.date: 03/02/2026
ms.author: jordanselig
ms.custom: mvc, fasttrack-edit, devx-track-bicep
ms.service: azure-app-service
---
# Bicep files for App Service

The following table includes links to Bicep files for Azure App Service. For quickstarts and further information about Bicep, see [Bicep documentation](/azure/azure-resource-manager/bicep/index).

To learn about the Bicep syntax and properties for App Services resources, see [Microsoft.Web resource types](/azure/templates/microsoft.web/allversions).


| Deploy application | Description |
|-|-|
| [App Service plan and Linux app](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-linux) | Deploy a basic App Service web app configured for Linux. |
| [App Service plan and Windows app](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-windows) | Deploy a basic App Service web app configured for Windows. |
| [App Service plan and <br>Windows container](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/app-service-docs-windows-container) | Deploy an App Service web app configured for an Azure Container Apps instance on Windows. |


| Configure application | Description |
|-|-|
| [App with log analytics module](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-loganalytics)| Deploy an App Service app with log analytics. |
| [App with regional <br>virtual network integration](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/app-service-regional-vnet-integration)| Deploy an App Service app with regional Azure Virtual Network integration enabled. |


| Create application with connected resources | Description |
|-|-|
| [App with Azure Cosmos DB](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.documentdb/cosmosdb-webapp)| Deploy an App Service app on Linux with Azure Cosmos DB. |
| [App with Azure Database for MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-managed-mysql)| Deploy an App Service app on Windows with Azure Database for MySQL. |
| [App with database in SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-sql-database)| Deploy an App Service app and a database in Azure SQL Database at the Basic service level. |
| [App connected to backend](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-privateendpoint-vnet-injection)| Deploy two web apps, a frontend and a backend. The connection is established securely with Virtual Network injection and a private endpoint via Azure Private Link. |
| [App connected to back-end app <br>with staging slots](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-secure-ntier)| Deploy two web apps (frontend and backend) with staging slots. The connection is established securely with Virtual Network injection and a private endpoint via Private Link. |
| [App with database, managed identity, <br>monitoring](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-managed-identity-sql-db)| Deploy an App Service App with a database, managed identity, and monitoring. |
| [Two apps in separate regions <br>with Azure Front Door](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-multi-region-front-door) | Deploy two identical web apps in separate regions and use Azure Front Door to direct traffic. |


| Create App Service Environment | Description |
|-|-|
| [Create App Service Environment v3](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-asp-app-on-asev3-create) | Creates an App Service Environment v3 instance (also referred to as _ASEv3_), an App Service plan, an App Service web app, and all associated networking resources. |
