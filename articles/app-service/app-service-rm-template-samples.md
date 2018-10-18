---
title: Azure Resource Manager template samples - App Service | Microsoft Docs
description: Azure Resource Manager template samples for the Web Apps feature of App Service
services: app-service
documentationcenter: app-service
author: tfitzmac
tags: azure-service-management

ms.service: app-service
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: app-service
ms.date: 10/15/2018
ms.author: tomfitz
ms.custom: mvc
---
# Azure Resource Manager templates for Web Apps

The following table includes links to Azure Resource Manager templates for the Web Apps feature of Azure App Service. For recommendations about avoiding common errors when you're creating web app templates, see [Guidance on deploying web apps with Azure Resource Manager templates](web-sites-rm-template-guidance.md).

| | |
|-|-|
|**Deploying a web app**||
| [App Service plan and basic Linux web app](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-basic-linux) | Deploys an Azure web app that is configured for Linux. |
| [App Service plan and basic Windows web app](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-basic-windows) | Deploys an Azure web app that is configured for Windows. |
| [Web app linked to a GitHub repository](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-github-deploy)| Deploys an Azure web app that pulls code from GitHub. |
| [Web app with custom deployment slots](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-custom-deployment-slots)| Deploys an Azure web app with custom deployment slots/environments. |
|**Configuring a web app**||
| [Web app certificate from Key Vault](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-certificate-from-key-vault)| Deploys an Azure web app certificate from an Azure Key Vault secret and uses it for SSL binding. |
| [Web app with a custom domain](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-custom-domain)| Deploys an Azure web app with a custom host name. |
| [Web app with a custom domain and SSL](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-custom-domain-and-ssl)| Deploys an Azure web app with a custom host name, and gets a web app certificate from Key Vault for SSL binding. |
| [Web app with a GoLang extension](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-with-golang)| Deploys an Azure web app with the Golang site extension. You can then run web applications developed on Golang on Azure. |
| [Web app with Java 8 and Tomcat 8](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-java-tomcat)| Deploys an Azure web app with Java 8 and Tomcat 8 enabled. You can then run Java applications in Azure. |
|**Linux web app with connected resources**||
| [Web app on Linux with MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-linux-managed-mysql) | Deploys an Azure web app on Linux with Azure Database for MySQL. |
| [Web app on Linux with PostgreSQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-linux-managed-postgresql) | Deploys an Azure web app on Linux with Azure Database for PostgreSQL. |
|**Web app with connected resources**||
| [Web app with MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-managed-mysql)| Deploys an Azure web app on Windows with Azure Database for MySQL. |
| [Web app with PostgreSQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-managed-postgresql)| Deploys an Azure web app on Windows with Azure Database for PostgreSQL. |
| [Web app with a SQL database](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-sql-database)| Deploys an Azure web app and a SQL database at the Basic service level. |
| [Web app with a Blob storage connection](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-blob-connection)| Deploys an Azure web app with an Azure Blob storage connection string. You can then use Blob storage from the web app. |
| [Web app with a Redis cache](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-with-redis-cache)| Deploys an Azure web app with a Redis cache. |
|**App Service Environment for PowerApps**||
| [Create an App Service environment v2](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-asev2-create) | Creates an App Service environment v2 in your virtual network. |
| [Create an App Service environment v2 with an ILB address](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-asev2-ilb-create/) | Creates an App Service environment v2 in your virtual network with a private internal load balancer address. |
| [Configure the default SSL certificate for an ILB App Service environment or an ILB App Service environment v2](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-ase-ilb-configure-default-ssl) | Configures the default SSL certificate for an ILB App Service environment or an ILB App Service environment v2. |
| | |
