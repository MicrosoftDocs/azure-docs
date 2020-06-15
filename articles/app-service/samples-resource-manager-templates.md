---
title: Azure Resource Manager template samples
description: Find Azure Resource Manager template samples for some of the common App Service scenarios. Learn how to automate your App Service deployment or management tasks.
author: tfitzmac
tags: azure-service-management

ms.topic: sample
ms.date: 01/04/2019
ms.author: tomfitz
ms.custom: mvc, fasttrack-edit
---
# Azure Resource Manager templates for App Service

The following table includes links to Azure Resource Manager templates for Azure App Service. For recommendations about avoiding common errors when you're creating app templates, see [Guidance on deploying apps with Azure Resource Manager templates](deploy-resource-manager-template.md).

To learn about the JSON syntax and properties for App Services resources, see [Microsoft.Web resource types](/azure/templates/microsoft.web/allversions).

| | |
|-|-|
|**Deploying an app**||
| [App Service plan and basic Linux app](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-basic-linux) | Deploys an App Service app that is configured for Linux. |
| [App Service plan and basic Windows app](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-basic-windows) | Deploys an App Service app that is configured for Windows. |
| [App linked to a GitHub repository](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-github-deploy)| Deploys an App Service app that pulls code from GitHub. |
| [App with custom deployment slots](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-custom-deployment-slots)| Deploys an App Service app with custom deployment slots/environments. |
|**Configuring an app**||
| [App certificate from Key Vault](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-certificate-from-key-vault)| Deploys an App Service app certificate from an Azure Key Vault secret and uses it for TLS/SSL binding. |
| [App with a custom domain](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-custom-domain)| Deploys an App Service app with a custom host name. |
| [App with a custom domain and SSL](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-custom-domain-and-ssl)| Deploys an App Service app with a custom host name, and gets an app certificate from Key Vault for TLS/SSL binding. |
| [App with a GoLang extension](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-with-golang)| Deploys an App Service app with the Golang site extension. You can then run web applications developed on Golang on Azure. |
| [App with Java 8 and Tomcat 8](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-java-tomcat)| Deploys an App Service app with Java 8 and Tomcat 8 enabled. You can then run Java applications in Azure. |
| [App with regional VNet integration](https://github.com/Azure/azure-quickstart-templates/tree/master/101-app-service-regional-vnet-integration)| Deploys an App Service app with regional VNet integration enabled. |
|**Protecting an app**||
| [App integrated with Azure Application Gateway](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-with-app-gateway-v2)| Deploys an App Service app and an Application Gateway, and isolates the traffic using service endpoint and access restrictions. |
|**Linux app with connected resources**||
| [App on Linux with MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-linux-managed-mysql) | Deploys an App Service app on Linux with Azure Database for MySQL. |
| [App on Linux with PostgreSQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-linux-managed-postgresql) | Deploys an App Service app on Linux with Azure Database for PostgreSQL. |
|**App with connected resources**||
| [App with MySQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-managed-mysql)| Deploys an App Service app on Windows with Azure Database for MySQL. |
| [App with PostgreSQL](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webapp-managed-postgresql)| Deploys an App Service app on Windows with Azure Database for PostgreSQL. |
| [App with a SQL database](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-sql-database)| Deploys an App Service app and a SQL database at the Basic service level. |
| [App with a Blob storage connection](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-blob-connection)| Deploys an App Service app with an Azure Blob storage connection string. You can then use Blob storage from the app. |
| [App with an Azure Cache for Redis](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-with-redis-cache)| Deploys an App Service app with an Azure Cache for Redis. |
|**App Service Environment**||
| [Create an App Service environment v2](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-asev2-create) | Creates an App Service environment v2 in your virtual network. |
| [Create an App Service environment v2 with an ILB address](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-asev2-ilb-create/) | Creates an App Service environment v2 in your virtual network with a private internal load balancer address. |
| [Configure the default SSL certificate for an ILB App Service environment or an ILB App Service environment v2](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-ase-ilb-configure-default-ssl) | Configures the default TLS/SSL certificate for an ILB App Service environment or an ILB App Service environment v2. |
| | |
