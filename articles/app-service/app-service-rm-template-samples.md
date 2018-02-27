---
title: Azure Resource Manager template samples - App Service | Microsoft Docs
description: Azure Resource Manager template samples - App Service
services: app-service
documentationcenter: app-service
author: tfitzmac
manager: timlt
editor: ggailey777
tags: azure-service-management

ms.service: app-service
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: app-service
ms.date: 02/26/2018
ms.author: tomfitz
ms.custom: mvc
---
# Azure Resource Manager templates for Azure Web Apps

The following table includes links to Azure Resource Manager templates. For recommendations about avoiding common errors when creating web app templates, see [Guidance on deploying web apps with Azure Resource Manager templates](web-sites-rm-template-guidance.md).

| | |
|-|-|
|**Deploy Web App**||
| [Web App linked to a GitHub repository](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-github-deploy)| Deploys an Azure web app that pulls code from GitHub. |
| [Web App with custom deployment slots](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-custom-deployment-slots)| Deploys an Azure web app with custom deployment slots/environments. |
|**Configure Web App**||
| [Web App certificate from Key Vault](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-certificate-from-key-vault)| Deploys an Azure web app certificate from Key Vault secret and uses it for SSL binding. |
| [Web App with custom domain](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-custom-domain)| Deploys an Azure web app with a custom host name. |
| [Web App with custom domain and SSL](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-custom-domain-and-ssl)| Deploys an Azure web app with a custom host name, and gets web app certificate from Key Vault for SSL binding. |
| [Web App with GoLang extension](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-with-golang)| Deploys an Azure web app with Golang site extension, which enables you to run web applications developed on Golang on Azure. |
| [Web App with Java 8 and Tomcat 8](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-java-tomcat)| Deploys an Azure web app with Java 8 and Tomcat 8 enabled, which enables you to run Java applications in Azure. |
|**Linux Web App**||
| [Web App on Linux with MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-linux-managed-mysql) | Deploys an Azure web app on Linux with Azure database for MySQL. |
| [Web App on Linux with PostgreSQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-linux-managed-postgresql) | Deploys an Azure web app on Linux with Azure database for PostgreSQL. |
|**Web App with connected resources**||
| [Web App with MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-managed-mysql)| Deploys an Azure web app on Windows with Azure database for MySQL. |
| [Web App with PostgreSQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-managed-postgresql)| Deploys an Azure web app on Windows with Azure database for PostgreSQL. |
| [Web App with a SQL Database](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-sql-database)| Deploys an Azure web app and SQL Database at the "Basic" service level. |
| [Web App with Blob Storage connection](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-blob-connection)| Deploys an Azure web app with a blob storage connection string, which enables you to use Azure Blob Storage from the web app. |
| [Web App with Redis Cache](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-with-redis-cache)| Deploys an Azure web app with Redis cache. |
|**App Service Environment**||
| [Create an App Service Environment v2](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-asev2-create) | Creates an App Service Environment v2 in your virtual network. |
| [Create an App Service Environment v2 with an ILB Address](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-asev2-ilb-create/) | Creates an App Service Environment v2 in your virtual network with a private internal load balancer address. |
| [Configure the Default SSL Certificate for an ILB ASE or an ILB ASE v2](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-ase-ilb-configure-default-ssl) | Configures the default SSL certificate for an ILB App Service Environment or an ILB App Service Environment v2 |
| | |
