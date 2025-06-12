---
title: Migrate .NET Apps to Azure App Service
description: Learn about .NET migration resources available to help you assess and migrate web apps to Azure App Service.
author: msangapu-msft

ms.topic: article
ms.date: 04/23/2025
ms.author: msangapu
ms.devlang: csharp
ms.custom: devx-track-dotnet
---
# .NET migration cases for Azure App Service

Azure App Service provides easy-to-use tools to quickly discover on-premises .NET web apps, assess them for readiness, and migrate both the content and supported configurations to App Service.

These tools are developed to support different kinds of scenarios, focused on discovery, assessment, and migration. Following is list of .NET migration tools and use cases.

## Migrate from multiple servers at-scale

> [!NOTE]
> To learn how to migrate .NET apps to App Service using the .NET migration tutorial, see [Modernize ASP.NET web apps to Azure App Service code](../migrate/tutorial-modernize-asp-net-appservice-code.md)
>

[Azure Migrate](../migrate/migrate-services-overview.md) recently announced at-scale, agentless discovery, and assessment of ASP.NET web apps. You can now easily discover ASP.NET web apps running on Internet Information Services (IIS) servers in a VMware environment, and assess them for migration to Azure App Service. Assessments help you determine the web app migration readiness, migration blockers, remediation guidance, recommended products, and hosting costs.

After you finish assessing readiness, you should proceed with migration of ASP.NET web apps to Azure App Services.  

There are existing tools that enable migration of a standalone ASP.NET web app or multiple ASP.NET web apps hosted on a single IIS server. To learn more, see [Modernize ASP.NET web apps to Azure App Service code](../migrate/tutorial-modernize-asp-net-appservice-code.md). With the introduction of at-scale or bulk migration integrated with Azure Migrate, you can migrate multiple ASP.NET applications hosted on multiple on-premises IIS servers.  

Bulk migration provides the following key capabilities:

- Bulk migration of ASP.NET web apps to Azure App Services multitenant or App services environment 
- Migrate ASP.NET web apps assessed as *Ready* & *Ready with conditions*
- Migrate up to five App Service plans (and associated web apps) as part of a single E2E migration flow 
- Ability to change suggested SKU for the target App Service plan (for example, change suggested Pv3 to Standard PV2) 
- Ability to change suggested web apps packing density for target app service plan (add or remove web apps associated with an App Service plan) 
- Change target name for App Service plans or web apps 
- Bulk edit migration settings or attributes 
- Download CSV with details of target web app and app service plan name 
- Track progress of migration using ARM template deployment experience 

## App Service migration tools and resources

__App Service Migration Assistant tool and App Service migration assistant for PowerShell scripts are governed by the terms and conditions in the EULA.pdf packaged with the respective tools.__

|Migration tools| Description | Documentation |
|-----------|-------------|---------------|
|[App Service Migration Assistant](https://appmigration.microsoft.com/api/download/windowspreview/AppServiceMigrationAssistant.msi)|Migrate .NET web apps from Windows OS to App Service.|[App Service Migration Assistant documentation](https://github.com/Azure/App-Service-Migration-Assistant/wiki)|
|[App Service migration assistant for Java on Apache Tomcat (Windows—preview)](https://appmigration.microsoft.com/api/download/windowspreview/AppServiceMigrationAssistant.msi)|Download prerelease software for migrating Java web applications on Tomcat web server running on Windows servers.|[App Service Migration Assistant documentation](https://github.com/Azure/App-Service-Migration-Assistant/wiki)|
|[App Service Migration Assistant PowerShell scripts](https://appmigration.microsoft.com/api/download/psscripts/AppServiceMigrationScripts.zip)|Download PowerShell scripts for discovering and assessing all Microsoft Internet Information Services (IIS) web apps on a single server in bulk and migrating .NET web apps from Windows OS to App Service.|[App Service Migration Assistant PowerShell documentation](https://github.com/Azure/App-Service-Migration-Assistant/wiki/PowerShell-Scripts)<br>[SHA256 Identifier](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Release-Notes)|

| More resources to migrate .NET apps to the cloud |
|----------------|
| **Video** |
| [.NET on Azure for Beginners](https://www.youtube.com/playlist?list=PLdo4fOcmZ0oVSBX3Lde8owu6dSgZLIXfu) |
| [Start Your Cloud Journey with Azure App Service](https://aka.ms/cloudjourney/start/video) |
| **Blog** |
| [Reliable web app pattern for .NET](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/announcing-the-reliable-web-app-pattern-for-net/ba-p/3745270) |
| [Start your cloud journey with Azure App Service - Part 1](https://aka.ms/cloudjourney/start/part1) |
| [Start your cloud journey with Azure App Service - Part 2](https://aka.ms/cloudjourney/start/part2) |
| [Learn how to modernize your .NET apps from the pros](https://devblogs.microsoft.com/dotnet/learn-how-to-modernize-your-dotnet-apps/) |
| **Learning path** |
| [Migrate ASP.NET Apps to Azure](/training/paths/migrate-dotnet-apps-azure/) |
| [Host a web application with Azure App Service](/training/modules/host-a-web-app-with-azure-app-service/) |
| [Publish a web app to Azure with Visual Studio](/training/modules/publish-azure-web-app-with-visual-studio/) |


### At-scale migration resources

| How-tos |
|----------------|
| [Discover web apps and SQL Server instances](../migrate/how-to-discover-sql-existing-project.md)                              |
| [Create an Azure App Service assessment](../migrate/how-to-create-azure-app-service-assessment.md)                            |
| [Tutorial to assess web apps for migration to Azure App Service](../migrate/tutorial-assess-webapps.md)                       |
| [Discover software inventory on on-premises servers with Azure Migrate](../migrate/how-to-discover-applications.md)           |
| [Migrate .NET apps to App Service](../migrate/tutorial-modernize-asp-net-appservice-code.md) |
| **Blog** |
| [Discover and assess ASP.NET apps at-scale with Azure Migrate](https://azure.microsoft.com/blog/discover-and-assess-aspnet-apps-atscale-with-azure-migrate/) |
| **FAQ** |
| [Azure App Service assessments in Azure Migrate Discovery and assessment tool](../migrate/concepts-azure-webapps-assessment-calculation.md) |
| **Best practices** |
| [Assessment best practices in Azure Migrate Discovery and assessment tool](../migrate/best-practices-assessment.md) |
| **Video** |
| [At scale discovery and assessment for ASP.NET app migration with Azure Migrate](/Shows/Inside-Azure-for-IT/At-scale-discovery-and-assessment-for-ASPNET-app-migration-with-Azure-Migrate) |

## Migrate from an IIS server

You can migrate ASP.NET web apps from a single IIS server discovered through Azure Migrate's at-scale discovery experience using [PowerShell scripts](https://github.com/Azure/App-Service-Migration-Assistant/wiki/PowerShell-Scripts). You can [download the scripts](https://appmigration.microsoft.com/api/download/psscriptpreview/AppServiceMigrationScripts.zip). Watch the video for [updates on migrating to Azure App Service](/Shows/The-Launch-Space/Updates-on-Migrating-to-Azure-App-Service).

## ASP.NET web app migration

Using App Service Migration Assistant, you can [migrate your standalone on-premises ASP.NET web app onto Azure App Service](https://www.youtube.com/watch?v=9LBUmkUhmXU). App Service Migration Assistant is designed to simplify your journey to the cloud through a free, simple, and fast solution to migrate applications from on-premises to the cloud. For more information about the migration assistant tool, see the [FAQ](https://github.com/Azure/App-Service-Migration-Assistant/wiki#faqs).

## Containerize an ASP.NET web app

Some .NET Framework web applications might have dependencies to libraries and other capabilities not available in Azure App Service. These apps might rely on other components in the Global Assembly Cache. Previously, you could only run these applications on virtual machines. However, now you can run them in Azure App Service Windows Containers.

The [app containerization tool](https://azure.microsoft.com/blog/accelerate-application-modernization-with-azure-migrate-app-containerization/) can repackage applications as containers with minimal changes. The tool currently supports containerizing ASP.NET applications and Apache Tomcat Java applications. For more information about containerization and migration, see [ASP.NET app containerization and migration to Azure App Service](../migrate/tutorial-app-containerization-aspnet-app-service.md).

## Related content

- [Migrate an on-premises web application to Azure App Service](/training/modules/migrate-app-service-migration-assistant/)