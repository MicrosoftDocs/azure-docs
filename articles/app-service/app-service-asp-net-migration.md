---
title: Migrate .NET apps to Azure App Service
description: Discover various migration resources available to migrate to Azure App Service.
author: msangapu-msft

ms.topic: article
ms.date: 03/29/2021
ms.author: msangapu
ms.custom: seodec18

---
# .NET migration resources for Azure App Service

Azure App Services provides easy-to-use tools to quickly discover .NET web apps deployed on-premise web servers, assess for readiness and migrate apps including content & supported config to App Service. 

These tools are developed to support wide variety of scenarios focused on scope of web app discovery, assessment, and migration. Following is the list of migration tools and recommended use cases. 


## At Scale Discovery and Assessment of Web Apps ASP.NET migration cases

Intent: discover how to assess and migrate at scale. 

If your use case is to discover and assess web apps deployed across your data center, Azure Migrate has recently announced the preview of at-scale, agentless discovery, and assessment of ASP.NET web apps. 

With this preview feature in Azure Migrate, you can now easily discover ASP.NET web apps running on Internet Information Services (IIS) servers in a VMware environment and assess them for migration to Azure App Service. Assessments will help you determine the migration readiness of the web apps, migration blockers and remediation guidance, recommended SKU, and cost of hosting your web apps in App Service. 

Currently Azure migrate integrated experience enables at-scale discovery and assessment of ASP.NET web apps.  

You may currently migrate ASP.Net web apps from single IIS server discovered via Azure Migrate at-scale discovery experience using PowerShell scripts for ASP.Net web app migration. Please refer to  [Updates on Migrating to Azure App Service](https://channel9.msdn.com/Shows/The-Launch-Space/Updates-on-Migrating-to-Azure-App-Service)


### Resources

Intent: discover how to assess and migrate at scale. 

Blog: [Discover and assess ASP.NET apps at-scale with Azure Migrate](https://azure.microsoft.com/blog/discover-and-assess-aspnet-apps-atscale-with-azure-migrate/)

Video: [At scale discovery and assessment for ASP.NET app migration with Azure Migrate](https://channel9.msdn.com/Shows/Inside-Azure-for-IT/At-scale-discovery-and-assessment-for-ASPNET-app-migration-with-Azure-Migrate) 

How-to: [Discover software inventory on on-premises servers with Azure Migrate](../migrate/how-to-discover-applications) 

How-to: [Discover web apps and SQL Server instances](../migrate/how-to-discover-sql-existing-project)

How-to: [Create an Azure App Service assessment](../migrate/how-to-create-azure-app-service-assessment)

How-to: Tutorial to assess web apps for migration to Azure App Service(../migrate/tutorial-assess-webapps) 

FAQ: [Azure App Service assessments in Azure Migrate Discovery and assessment tool](../migrate/concepts-azure-webapps-assessment-calculation)
 
Best practices: [Assessment best practices in Azure Migrate Discovery and assessment tool](../migrate/best-practices-assessment)

## Discovery, Assessment and Migration of ASP.Net Web Apps for an IIS Web Server 

Intent: discover how to assess and migrate from a single IIS server 

Download prerelease PowerShell scripts for discovering and assessing all ASP.Net web apps on a single IIS web server in bulk and migrate them Azure App Service.


### Resources
Intent: discover how to assess and migrate from a single IIS server 

Scripts: PowerShell Scripts - App-Service-Migration-Assistant(https://github.com/Azure/App-Service-Migration-Assistant/wiki/PowerShell-Scripts)

Download: Download the PowerShell scripts in preview(https://appmigration.microsoft.com/api/download/psscriptpreview/AppServiceMigrationScripts.zip)

Video: Updates on Migrating to Azure App Service(https://channel9.msdn.com/Shows/The-Launch-Space/Updates-on-Migrating-to-Azure-App-Service?term=the%20launch%20space&lang-en=true)

## Standalone ASP.Net Web App Migration 

Intent: migrate a single web app 

Using App Service Migration Assistant, you can migrate your standalone on-premises ASP.Net web app onto Azure App Service. App Service Migration Assistant is designed to simplify your journey to the cloud through a free, simple, and fast solution to migrate applications from on-premises to the cloud. 

FAQ: Azure App Service Migration Assistant Tool Documentation(https://github.com/Azure/App-Service-Migration-Assistant/wiki) 

Video: How to migrate web apps to Azure App Service(https://www.youtube.com/watch?v=9LBUmkUhmXU) 

## Containerize standalone ASP.Net Web App 

Sometimes you have a web application that runs on the full .NET Framework and has dependencies to libraries and capabilities that are not available in Azure App Service. Applications like these sometimes rely on things to be installed in the GAC (Global Assembly Cache). In the past, you could only run an application like that in Azure if you run it in IIS on a Virtual Machine. Now, you can run such an application in a Windows Container in an Azure App Service Web App. 

The App Containerization tool offers a point-and-containerize approach to repackage applications as containers with minimal to no code changes by using the running state of the application. The tool currently supports containerizing ASP.NET applications and Java web applications running on Apache Tomcat. 

Blog: Accelerate application modernization with Azure Migrate: App Containerization(https://azure.microsoft.com/blog/accelerate-application-modernization-with-azure-migrate-app-containerization/) 

How-to: Azure App Containerization ASP.NET; Containerization and migration of ASP.NET applications to Azure App Service(../migrate/tutorial-app-containerization-aspnet-app-service)
