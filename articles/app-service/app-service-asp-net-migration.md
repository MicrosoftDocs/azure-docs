---
title: Migrate .NET apps to Azure App Service
description: A collection of .NET migration resources available to Azure App Service.
author: msangapu-msft

ms.topic: article
ms.date: 06/28/2022
ms.author: msangapu
ms.devlang: csharp
ms.custom: seodec18

---
# .NET migration cases for Azure App Service

Azure App Service provides easy-to-use tools to quickly discover on-premises .NET web apps, assess for readiness, and migrate both the content & supported configurations to App Service.

These tools are developed to support different kinds of scenarios, focused on discovery, assessment, and migration. Following is list of .NET migration tools and use cases.

## Migrate from multiple servers at-scale

> [!NOTE]
> [Learn how to migrate .NET apps to App Service using the .NET migration tutorial.](../migrate/tutorial-migrate-webapps.md)
>

Azure Migrate recently announced at-scale, agentless discovery, and assessment of ASP.NET web apps. You can now easily discover ASP.NET web apps running on Internet Information Services (IIS) servers in a VMware environment and assess them for migration to Azure App Service. Assessments will help you determine the web app migration readiness, migration blockers, remediation guidance, recommended SKU, and hosting costs. At-scale migration resources for  are found below.

Once you have successfully assessed readiness, you should proceed with migration of ASP.NET web apps to Azure App Services.  

There are existing tools which enable migration of a standalone ASP.Net web app or multiple ASP.NET web apps hosted on a single IIS server as explained in [Migrate .NET apps to Azure App Service](../migrate/tutorial-migrate-webapps.md). With introduction of At-Scale or bulk migration feature integrated with Azure Migrate we are now opening up the possibilities to migrate multiple ASP.NET application hosted on multiple on-premises IIS servers.  

Azure Migrate provides at-scale, agentless discovery, and assessment of ASP.NET web apps. You can discover ASP.NET web apps running on Internet Information Services (IIS) servers in a VMware environment and assess them for migration to Azure App Service. Assessments will help you determine the web app migration readiness, migration blockers, remediation guidance, recommended SKU, and hosting costs. At-scale migration resources for  are found below.

Bulk migration provides the following key capabilities: 

- Bulk Migration of ASP.NET web apps to Azure App Services multitenant or App services environment 
- Migrate ASP.NET web apps assessed as "Ready" & "Ready with Conditions"
- Migrate up to five App Service Plans (and associated web apps) as part of a single E2E migration flow 
- Ability to change suggested SKU for the target App Service Plan (Ex: Change suggested Pv3 SKU to Standard PV2 SKU) 
- Ability to change web apps suggested web apps packing density for target app service plan (Add or Remove web apps associated with an App Service Plan) 
- Change target name for app service plans and\or web apps 
- Bulk edit migration settings\attributes 
- Download CSV with details of target web app and app service plan name 
- Track progress of migration using ARM template deployment experience 

### At-scale migration resources

| How-tos |
|----------------|
| [Discover web apps and SQL Server instances](../migrate/how-to-discover-sql-existing-project.md)                              |
| [Create an Azure App Service assessment](../migrate/how-to-create-azure-app-service-assessment.md)                            |
| [Tutorial to assess web apps for migration to Azure App Service](../migrate/tutorial-assess-webapps.md)                       |
| [Discover software inventory on on-premises servers with Azure Migrate](../migrate/how-to-discover-applications.md)           |
| [Migrate .NET apps to App Service](../migrate/tutorial-migrate-webapps.md) |
| **Blog** |
| [Discover and assess ASP.NET apps at-scale with Azure Migrate](https://azure.microsoft.com/blog/discover-and-assess-aspnet-apps-atscale-with-azure-migrate/) |
| **FAQ** |
| [Azure App Service assessments in Azure Migrate Discovery and assessment tool](../migrate/concepts-azure-webapps-assessment-calculation.md) |
| **Best practices** |
| [Assessment best practices in Azure Migrate Discovery and assessment tool](../migrate/best-practices-assessment.md) |
| **Video** |
| [At scale discovery and assessment for ASP.NET app migration with Azure Migrate](/Shows/Inside-Azure-for-IT/At-scale-discovery-and-assessment-for-ASPNET-app-migration-with-Azure-Migrate) |

## Migrate from an IIS server

You can migrate ASP.NET web apps from single IIS server discovered through Azure Migrate's at-scale discovery experience using [PowerShell scripts](https://github.com/Azure/App-Service-Migration-Assistant/wiki/PowerShell-Scripts) [(download)](https://appmigration.microsoft.com/api/download/psscriptpreview/AppServiceMigrationScripts.zip). Watch the video for [updates on migrating to Azure App Service](/Shows/The-Launch-Space/Updates-on-Migrating-to-Azure-App-Service).

## ASP.NET web app migration

Using App Service Migration Assistant, you can [migrate your standalone on-premises ASP.NET web app onto Azure App Service](https://www.youtube.com/watch?v=9LBUmkUhmXU). App Service Migration Assistant is designed to simplify your journey to the cloud through a free, simple, and fast solution to migrate applications from on-premises to the cloud. For more information about the migration assistant tool, see the [FAQ](https://github.com/Azure/App-Service-Migration-Assistant/wiki).

## Containerize an ASP.NET web app

Some .NET Framework web applications may have dependencies to libraries and other capabilities not available in Azure App Service. These apps may rely on other components in the Global Assembly Cache. Previously, you could only run these applications on virtual machines. However, now you can run them in Azure App Service Windows Containers.

The [app containerization tool](https://azure.microsoft.com/blog/accelerate-application-modernization-with-azure-migrate-app-containerization/) can repackage applications as containers with minimal changes. The tool currently supports containerizing ASP.NET applications and Apache Tomcat Java applications. For more information about containerization and migration, see the [how-to](../migrate/tutorial-app-containerization-aspnet-app-service.md).

## Next steps

[Migrate an on-premises web application to Azure App Service](/training/modules/migrate-app-service-migration-assistant/)
