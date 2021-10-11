---
title: Migrate to Azure App Service
description: Discover various migration resources available to migrate to Azure App Service.
author: msangapu-msft

ms.topic: article
ms.date: 03/29/2021
ms.author: msangapu
ms.custom: seodec18

---
# Migration resources for Azure App Service

Azure App Services now provides easy to use tools to quickly discover web apps deployed on on-premises web servers, assess these web apps for readiness and migrate the web apps including content & supported config to App Service. 

These tools are developed to support wide variety of scenarios focused on scope of web app discovery, assessment, and migration. Following is the list of migration tools and recommended use cases. 


## Standalone Tomcat Web App (Linux OS) or on-premises Linux container migration  

Download this preview tool If your use case is to migrate standalone Java web app running on Apache Tomcat web servers on Linux OS to App Service Or to migrate on-premises Docker containers running on Linux OS to App Service using Docker Hub or Azure Container Registry 

Video: [Point and Migrate Java Apps to Azure App Service Using the Migration System](https://www.youtube.com/watch?v=Mpxa0KE0X9k) 

Download: [App Service migration assistant for Java on Apache Tomcat](https://azure.microsoft.com/en-us/services/app-service/migration-assistant/)

How-to: [TOMCAT Java Information · Azure/App-Service-Migration-Assistant Wiki](https://github.com/Azure/App-Service-Migration-Assistant/wiki/TOMCAT-Java-Information) 

How-to: [Linux Notes · Azure/App-Service-Migration-Assistant Wiki](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Linux-Notes) 

## Standalone Tomcat Web App Migration (Windows OS) 

Download this preview tool If your use case is to migrate standalone Java web app running on Apache Tomcat web servers on Windows OS to App Service 

Video: [Updates on Migrating to Azure App Service](https://channel9.msdn.com/Shows/The-Launch-Space/Updates-on-Migrating-to-Azure-App-Service) 

Download: [Download App Service migration assistant for Java on Apache Tomcat (Windows—preview)](https://azure.microsoft.com/en-us/services/app-service/migration-assistant/) 

How-to: TOMCAT Java Information · Azure/App-Service-Migration-Assistant Wiki(https://github.com/Azure/App-Service-Migration-Assistant/wiki/TOMCAT-Java-Information) 

## Containerize standalone Tomcat Web App 

The App Containerization tool offers a point-and-containerize approach to repackage applications as containers with minimal to no code changes by using the running state of the application. The tool currently supports containerizing ASP.NET applications and Java web applications running on Apache Tomcat. 

Blog: [Accelerate application modernization with Azure Migrate: App Containerization](https://azure.microsoft.com/en-us/blog/accelerate-application-modernization-with-azure-migrate-app-containerization/) 

 How-to: [Azure App Containerization Java; Containerization and migration of Java web applications to Azure App Service](https://docs.microsoft.com/en-us/azure/migrate/tutorial-app-containerization-java-app-service) 