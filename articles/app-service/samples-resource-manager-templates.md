---
title: Azure Resource Manager template samples
description: Find Azure Resource Manager template samples for some of the common App Service scenarios. Learn how to automate your App Service deployment or management tasks.
author: tfitzmac
tags: azure-service-management

ms.topic: sample
ms.date: 08/26/2020
ms.author: tomfitz
ms.custom: mvc, fasttrack-edit, devx-track-arm-template
---
# Azure Resource Manager templates for App Service

The following table includes links to Azure Resource Manager templates for Azure App Service. For recommendations about avoiding common errors when you're creating app templates, see [Guidance on deploying apps with Azure Resource Manager templates](deploy-resource-manager-template.md).

To learn about the JSON syntax and properties for App Services resources, see [Microsoft.Web resource types](/azure/templates/microsoft.web/allversions).

| Deploying an app | Description |
|-|-|
| [App Service plan and basic Linux app](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-linux) | Deploys an App Service app that is configured for Linux. |
| [App Service plan and basic Windows app](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-windows) | Deploys an App Service app that is configured for Windows. |
| [App linked to a GitHub repository](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-github-deploy)| Deploys an App Service app that pulls code from GitHub. |
| [App with custom deployment slots](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-custom-deployment-slots)| Deploys an App Service app with custom deployment slots/environments. |
| [App with Private Endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/private-endpoint-webapp)| Deploys an App Service app with a Private Endpoint. |
|**Configuring an app**| **Description** |
| [App certificate from Key Vault](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-certificate-from-key-vault)| Deploys an App Service app certificate from an Azure Key Vault secret and uses it for TLS/SSL binding. |
| [App with a custom domain and SSL](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-custom-domain-and-ssl)| Deploys an App Service app with a custom host name, and gets an app certificate from Key Vault for TLS/SSL binding. |
| [App with Java 8 and Tomcat 8](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-java-tomcat)| Deploys an App Service app with Java 8 and Tomcat 8 enabled. You can then run Java applications in Azure. |
| [App with regional VNet integration](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/app-service-regional-vnet-integration)| Deploys an App Service app with regional VNet integration enabled. |
|**Protecting an app**| **Description** |
| [App integrated with Azure Application Gateway](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-with-app-gateway-v2)| Deploys an App Service app and an Application Gateway, and isolates the traffic using service endpoint and access restrictions. |
|**Linux app with connected resources**| **Description** |
| [App on Linux with MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-linux-managed-mysql) | Deploys an App Service app on Linux with Azure Database for MySQL. |
| [App on Linux with PostgreSQL](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-linux-managed-postgresql) | Deploys an App Service app on Linux with Azure Database for PostgreSQL. |
|**App with connected resources**| **Description** |
| [App with MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-managed-mysql)| Deploys an App Service app on Windows with Azure Database for MySQL. |
| [App with PostgreSQL](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-managed-postgresql)| Deploys an App Service app on Windows with Azure Database for PostgreSQL. |
| [App with a database in Azure SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-sql-database)| Deploys an App Service app and a database in Azure SQL Database at the Basic service level. |
| [App with a Blob storage connection](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-blob-connection)| Deploys an App Service app with an Azure Blob storage connection string. You can then use Blob storage from the app. |
| [App with an Azure Cache for Redis](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-with-redis-cache)| Deploys an App Service app with an Azure Cache for Redis. |
| [App connected to a backend webapp](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-privateendpoint-vnet-injection)| Deploys two web apps (frontend and backend) securely connected together with VNet injection and Private Endpoint. |
| [App connected to a backend webapp with staging slots](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-secure-ntier)| Deploys two web apps (frontend and backend) with staging slots securely connected together with VNet injection and Private Endpoint. |
| [Two apps in separate regions with Azure Front Door](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-multi-region-front-door) | Deploys two identical web apps in separate regions with Azure Front Door to direct traffic. |
|**App Service Environment**| **Description** |
| [Create an App Service environment v2](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-asev2-create) | Creates an App Service environment v2 in your virtual network. |
| [Create an App Service environment v2 with an ILB address](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-asev2-ilb-create) | Creates an App Service environment v2 in your virtual network with a private internal load balancer address. |
| [Configure the default SSL certificate for an ILB App Service environment or an ILB App Service environment v2](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/web-app-ase-ilb-configure-default-ssl) | Configures the default TLS/SSL certificate for an ILB App Service environment or an ILB App Service environment v2. |
| | |
