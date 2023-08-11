---
title: Migrate Java apps to Azure App Service
description: Discover Java migration resources available to Azure App Service.
author: msangapu-msft

ms.topic: article
ms.date: 03/29/2021
ms.author: msangapu
ms.devlang: java
ms.custom: seodec18, devx-track-extended-java
---
# Java migration resources for Azure App Service

Azure App Service provides tools to discover web apps deployed to on-premises web servers. You can assess these apps for readiness, then migrate them to App Service. Both the web app content and supported configuration can be migrated to App Service. These tools are developed to support a wide variety of scenarios focused on discovery, assessment, and migration.

## Java Tomcat migration (Linux)

[Download the assistant](https://azure.microsoft.com/services/app-service/migration-assistant/) to migrate a Java app running on Apache Tomcat web server. You can also use Azure Container Registry to migrate on-premises Linux Docker containers to App Service.

| Resources |
|-----------|
| **How-tos** |
| [Java App-Service-Migration-Assistant Wiki](https://github.com/Azure/App-Service-Migration-Assistant/wiki/TOMCAT-Java-Information) |
| [Azure/App-Service-Migration-Assistant Wiki](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Linux-Notes) |
| **Videos** |
|[Point and Migrate Java Apps to Azure App Service Using the Migration System](https://www.youtube.com/watch?v=Mpxa0KE0X9k) |

## Standalone Tomcat Web App Migration (Windows OS)

Download this [preview tool](https://azure.microsoft.com/services/app-service/migration-assistant/) to migrate a Java web app on Apache Tomcat to App Service on Windows. For more information, see the [video](/Shows/The-Launch-Space/Updates-on-Migrating-to-Azure-App-Service) and [how-to](https://github.com/Azure/App-Service-Migration-Assistant/wiki/TOMCAT-Java-Information).

## Containerize standalone Tomcat Web App

App Containerization offers a simple approach to repackage applications as containers with minimal code changes. The tool currently supports containerizing ASP.NET and Apache Tomcat Java web applications. For more information, see the [blog](https://azure.microsoft.com/blog/accelerate-application-modernization-with-azure-migrate-app-containerization/) and [how-to](../migrate/tutorial-app-containerization-java-app-service.md).

## Next steps

[Migrate Tomcat applications to Tomcat on Azure App Service](/azure/developer/java/migration/migrate-tomcat-to-tomcat-app-service)
