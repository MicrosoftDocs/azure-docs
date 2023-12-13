---
title: Bicep samples
description: Find Bicep samples for some of the common App Service scenarios. Learn how to automate your App Service deployment or management tasks.
author: seligj95
tags: azure-service-management

ms.topic: sample
ms.date: 11/18/2022
ms.author: jordanselig
ms.custom: mvc, fasttrack-edit, devx-track-bicep
---
# Bicep files for App Service

The following table includes links to Bicep files for Azure App Service. For quickstarts and further information about Bicep, see [Bicep documentation](../azure-resource-manager/bicep/index.yml).

To learn about the Bicep syntax and properties for App Services resources, see [Microsoft.Web resource types](/azure/templates/microsoft.web/allversions).

| Deploying an app | Description |
|-|-|
| [App Service plan and basic Linux app](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-linux) | Deploys an App Service app that is configured for Linux. |
| [App Service plan and basic Windows app](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-windows) | Deploys an App Service app that is configured for Windows. |
| **Configuring an app** | **Description** |
| [App with log analytics module](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-loganalytics)| Deploys an App Service app with log analytics. |
| [App with regional VNet integration](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/app-service-regional-vnet-integration)| Deploys an App Service app with regional VNet integration enabled. |
|**App with connected resources**| **Description** |
| [App with CosmosDB](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.documentdb/cosmosdb-webapp)| Deploys an App Service app on Linux with CosmosDB. |
| [App with MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-managed-mysql)| Deploys an App Service app on Windows with Azure Database for MySQL. |
| [App with a database in Azure SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-sql-database)| Deploys an App Service app and a database in Azure SQL Database at the Basic service level. |
| [App connected to a backend webapp](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-privateendpoint-vnet-injection)| Deploys two web apps (frontend and backend) securely connected together with VNet injection and Private Endpoint. |
| [App connected to a backend webapp with staging slots](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-secure-ntier)| Deploys two web apps (frontend and backend) with staging slots securely connected together with VNet injection and Private Endpoint. |
| [App with a database, managed identity, and monitoring](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-managed-identity-sql-db)| Deploys an App Service App with a database, managed identity, and monitoring. |
| [Two apps in separate regions with Azure Front Door](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-multi-region-front-door) | Deploys two identical web apps in separate regions with Azure Front Door to direct traffic. |
|**App Service Environment**| **Description** |
| [Create an App Service environment v2](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-asev2-create) | Creates an App Service environment v2 in your virtual network. |
