---
title: Migrate .NET apps to Azure App Service
description: Discover .NET migration resources available to Azure App Service.
author: msangapu-msft

ms.topic: article
ms.date: 03/29/2021
ms.author: msangapu
ms.custom: seodec18

---
# .NET migration cases for Azure App Service

Azure App Service provides easy-to-use tools to quickly discover on-premise .NET web apps, assess for readiness, and migrate both the content & supported configurations to App Service.

These tools are developed to support a variety of scenarios,focused on discovery, assessment, and migration. Following is list of .NET migration tools and use cases.

## Migrate from multiple servers at-scale

<!-- Intent: discover how to assess and migrate at scale. -->

If your use case is to discover and assess web apps deployed across your data center, Azure Migrate has recently announced the preview of at-scale, agentless discovery, and assessment of ASP.NET web apps.

With this preview feature in Azure Migrate, you can now easily discover ASP.NET web apps running on Internet Information Services (IIS) servers in a VMware environment and assess them for migration to Azure App Service.

Assessments will help you determine the migration readiness of the web apps, migration blockers and remediation guidance, recommended SKU, and cost of hosting your web apps in App Service.

Currently Azure migrate integrated experience enables at-scale discovery and assessment of ASP.NET web apps.  

### At-scale migration resources

| How-tos |
|----------------|
| [Discover web apps and SQL Server instances](../migrate/how-to-discover-sql-existing-project.md)                              |
| [Create an Azure App Service assessment](../migrate/how-to-create-azure-app-service-assessment.md)                            |
| [Tutorial to assess web apps for migration to Azure App Service](../migrate/tutorial-assess-webapps.md)                       |
| [Discover software inventory on on-premises servers with Azure Migrate](../migrate/how-to-discover-applications.md)           |
| **Blog** |
| [Discover and assess ASP.NET apps at-scale with Azure Migrate](https://azure.microsoft.com/blog/discover-and-assess-aspnet-apps-atscale-with-azure-migrate/) |
| **FAQ** |
| [Azure App Service assessments in Azure Migrate Discovery and assessment tool](../migrate/concepts-azure-webapps-assessment-calculation.md) |
| **Best practices** |
| [Assessment best practices in Azure Migrate Discovery and assessment tool](../migrate/best-practices-assessment.md) |
| **Video** |
| [At scale discovery and assessment for ASP.NET app migration with Azure Migrate](https://channel9.msdn.com/Shows/Inside-Azure-for-IT/At-scale-discovery-and-assessment-for-ASPNET-app-migration-with-Azure-Migrate) |

## Migrate from an IIS server

<!-- Intent: discover how to assess and migrate from a single IIS server  -->

You may currently migrate ASP.NET web apps from single IIS server discovered via Azure Migrate at-scale discovery experience using [PowerShell scripts](https://github.com/Azure/App-Service-Migration-Assistant/wiki/PowerShell-Scripts) [(download)](https://appmigration.microsoft.com/api/download/psscriptpreview/AppServiceMigrationScripts.zip) for ASP.NET web app migration. See the video [Updates on Migrating to Azure App Service](https://channel9.msdn.com/Shows/The-Launch-Space/Updates-on-Migrating-to-Azure-App-Service) for additional information.
 
## ASP.NET web app migration
<!-- Intent: migrate a single web app -->

Using App Service Migration Assistant, you can [migrate your standalone on-premises ASP.NET web app onto Azure App Service](https://www.youtube.com/watch?v=9LBUmkUhmXU). App Service Migration Assistant is designed to simplify your journey to the cloud through a free, simple, and fast solution to migrate applications from on-premises to the cloud. See the [Migration Assistant Tool FAQ](https://github.com/Azure/App-Service-Migration-Assistant/wiki) for more information.

## Containerize an ASP.NET web app 

Sometimes you have a web application that runs on the full .NET Framework and has dependencies to libraries and capabilities that are not available in Azure App Service. Applications like these sometimes rely on things to be installed in the Global Assembly Cache. In the past, you could only run an application like that in Azure if you run it in IIS on a Virtual Machine. Now, you can run such an application in a Windows Container in an Azure App Service Web App. 

The [App Containerization tool](https://azure.microsoft.com/blog/accelerate-application-modernization-with-azure-migrate-app-containerization/) offers a point-and-containerize approach to repackage applications as containers with minimal to no code changes by using the running state of the application. The tool currently supports containerizing ASP.NET applications and Java web applications running on Apache Tomcat. See the [containerziation and migration how-to](../migrate/tutorial-app-containerization-aspnet-app-service.md) for more information
