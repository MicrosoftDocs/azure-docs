---
title: Migrate Java Apps to Azure App Service
description: Discover Java migration resources available to Azure App Service.
author: msangapu-msft

ms.topic: concept-article
ms.date: 11/17/2025
ms.author: msangapu
ms.devlang: java
ms.custom: devx-track-extended-java, linux-related-content
ms.service: azure-app-service
---
# Java migration resources for Azure App Service

Azure App Service provides tools to discover web apps deployed to on-premises web servers. You can assess these apps for readiness, then migrate them to App Service. Both the web app content and supported configuration can be migrated to App Service. These tools are developed to support a wide variety of scenarios focused on discovery, assessment, and migration.

## Java Tomcat migration (Linux)

Download the [App Service Migration Assistant](https://azure.microsoft.com/services/app-service/migration-assistant/) to migrate a Java app running on Apache Tomcat web server. You can also use Azure Container Registry to migrate on-premises Linux Docker containers to App Service.

| Resources |
|-----------|
| **How-tos** |
| [Tomcat Java information](https://github.com/Azure/App-Service-Migration-Assistant/wiki/TOMCAT-Java-Information) |
| [Install on Linux](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Linux-Notes) |
| **Videos** |
| [Point and Migrate Java Apps to Azure App Service](https://www.youtube.com/watch?v=Mpxa0KE0X9k) |

## Standalone Tomcat web app migration (Windows)

Download the [App Service migration assistant for Java on Apache Tomcat (Windows—preview)](https://azure.microsoft.com/services/app-service/migration-assistant/) to migrate a Java web app on Apache Tomcat to App Service on Windows.

For more information, see the [Updates on Migrating to Azure App Service video](/Shows/The-Launch-Space/Updates-on-Migrating-to-Azure-App-Service) and [TOMCAT Java information](https://github.com/Azure/App-Service-Migration-Assistant/wiki/TOMCAT-Java-Information).

## Containerize a standalone Tomcat web app

App containerization offers a simple approach to repackage applications as containers with minimal code changes. The tool currently supports containerizing ASP.NET and Apache Tomcat Java web applications.

For more information, see the following articles:

- [Accelerate application modernization with Azure Migrate: App Containerization](https://azure.microsoft.com/blog/accelerate-application-modernization-with-azure-migrate-app-containerization/)
- [Java web app containerization and migration to Azure App Service](../migrate/tutorial-app-containerization-java-app-service.md)

## Next step

> [!div class="nextstepaction"]
> [Migrate Tomcat applications to Tomcat on Azure App Service](/azure/developer/java/migration/migrate-tomcat-to-tomcat-app-service)
