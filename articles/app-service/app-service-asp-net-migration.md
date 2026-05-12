---
title: .NET migration cases for Azure App Service
description: Learn about the tools, resources, and best practices available for assessing and migrating .NET web applications to Azure App Service.
author: msangapu-msft
ms.author: msangapu
ms.topic: concept-article
ms.date: 05/11/2026
ms.devlang: csharp
ms.custom: devx-track-dotnet
ms.service: azure-app-service
---

# .NET migration cases for Azure App Service

Azure App Service provides tools and resources to help you discover, assess, and migrate .NET web applications from on-premises environments to Azure. These tools support a variety of migration scenarios, including standalone applications, large-scale migrations, and containerized workloads.

This article outlines the available migration tools, guidance, and learning resources for migrating .NET applications to Azure App Service.

## Migrate from multiple servers at scale

> [!NOTE]
> To learn how to migrate .NET apps to Azure App Service using the migration tutorial, see [Modernize ASP.NET web apps to Azure App Service](../migrate/tutorial-modernize-asp-net-appservice-code.md).

[Azure Migrate](../migrate/migrate-services-overview.md) supports agentless discovery and assessment of ASP.NET web applications running on Internet Information Services (IIS) servers in VMware environments. Assessments help determine application readiness for migration, identify blockers, provide remediation guidance, recommend Azure services, and estimate hosting costs.

After completing the assessment, you can migrate ASP.NET web apps to Azure App Service.

Azure Migrate also supports bulk migration scenarios for ASP.NET web applications hosted across multiple on-premises IIS servers.

### Bulk migration capabilities

Bulk migration provides the following capabilities:

- Migrate ASP.NET web apps to Azure App Service multitenant environments or App Service Environments
- Migrate applications assessed as **Ready** or **Ready with conditions**
- Migrate up to five App Service plans and associated web apps in a single migration workflow
- Customize the recommended App Service plan SKU
- Adjust web app packing density within App Service plans
- Rename target App Service plans and web apps
- Bulk edit migration settings and configuration attributes
- Download migration details as a CSV file
- Track migration progress through Azure Resource Manager (ARM) deployments

## App Service migration tools and resources

> [!IMPORTANT]
> App Service Migration Assistant and App Service Migration Assistant PowerShell scripts are governed by the terms and conditions included in the `EULA.pdf` file packaged with the tools.

| Tool | Description | Documentation |
|------|-------------|---------------|
| [App Service Migration Assistant](https://appmigration.microsoft.com/api/download/windowspreview/AppServiceMigrationAssistant.msi) | Migrates .NET web applications from Windows servers to Azure App Service. | [Migration Assistant documentation](https://github.com/Azure/App-Service-Migration-Assistant/wiki) |
| [App Service Migration Assistant for Java on Apache Tomcat (Windows preview)](https://appmigration.microsoft.com/api/download/windowspreview/AppServiceMigrationAssistant.msi) | Migrates Java web applications running on Apache Tomcat on Windows servers. | [Migration Assistant documentation](https://github.com/Azure/App-Service-Migration-Assistant/wiki) |
| [App Service Migration Assistant PowerShell scripts (preview)](https://appmigration.microsoft.com/api/download/psscriptpreview/AppServiceMigrationScripts.zip) | Provides PowerShell scripts for discovering, assessing, and migrating IIS-hosted .NET web applications in bulk. | [PowerShell scripts documentation](https://github.com/Azure/App-Service-Migration-Assistant/wiki/PowerShell-Scripts)<br>[SHA256 identifiers](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Release-Notes) |

## Learning resources for .NET migration

### Videos

- [.NET on Azure for Beginners](https://www.youtube.com/playlist?list=PLdo4fOcmZ0oVSBX3Lde8owu6dSgZLIXfu)
- [Start your cloud journey with Azure App Service](https://aka.ms/cloudjourney/start/video)

### Blogs

- [Reliable web app pattern for .NET](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/announcing-the-reliable-web-app-pattern-for-net/ba-p/3745270)
- [Start your cloud journey with Azure App Service - Part 1](https://aka.ms/cloudjourney/start/part1)
- [Start your cloud journey with Azure App Service - Part 2](https://aka.ms/cloudjourney/start/part2)
- [Learn how to modernize your .NET apps](https://devblogs.microsoft.com/dotnet/learn-how-to-modernize-your-dotnet-apps/)

### Learning paths

- [Migrate ASP.NET apps to Azure](/training/paths/migrate-dotnet-apps-azure/)
- [Host a web application with Azure App Service](/training/modules/host-a-web-app-with-azure-app-service/)
- [Publish a web app to Azure with Visual Studio](/training/modules/publish-azure-web-app-with-visual-studio/)

## At-scale migration resources

### How-to guides

- [Discover web apps and SQL Server instances](../migrate/how-to-discover-sql-existing-project.md)
- [Create an Azure App Service assessment](../migrate/how-to-create-azure-app-service-assessment.md)
- [Assess web apps for migration to Azure App Service](../migrate/tutorial-assess-webapps.md)
- [Discover software inventory on on-premises servers](../migrate/how-to-discover-applications.md)
- [Migrate .NET apps to Azure App Service](../migrate/tutorial-modernize-asp-net-appservice-code.md)

### Blogs

- [Discover and assess ASP.NET apps at scale with Azure Migrate](https://azure.microsoft.com/blog/discover-and-assess-aspnet-apps-atscale-with-azure-migrate/)

### FAQ

- [Azure App Service assessments in Azure Migrate](../migrate/concepts-azure-webapps-assessment-calculation.md)

### Best practices

- [Assessment best practices in Azure Migrate](../migrate/best-practices-assessment.md)

### Video

- [At-scale discovery and assessment for ASP.NET app migration with Azure Migrate](/Shows/Inside-Azure-for-IT/At-scale-discovery-and-assessment-for-ASPNET-app-migration-with-Azure-Migrate)

## Migrate from an IIS server

You can migrate ASP.NET web applications hosted on a single IIS server discovered through Azure Migrate by using the [PowerShell migration scripts](https://github.com/Azure/App-Service-Migration-Assistant/wiki/PowerShell-Scripts).

You can also download the scripts directly:

- [Download App Service Migration PowerShell scripts](https://appmigration.microsoft.com/api/download/psscriptpreview/AppServiceMigrationScripts.zip)

For more information, watch [Updates on migrating to Azure App Service](/Shows/The-Launch-Space/Updates-on-Migrating-to-Azure-App-Service).

## ASP.NET web app migration

You can use App Service Migration Assistant to migrate standalone ASP.NET web applications to Azure App Service.

- [Migrate an ASP.NET web app to Azure App Service](https://www.youtube.com/watch?v=9LBUmkUhmXU)

App Service Migration Assistant simplifies migration with a guided experience for moving applications from on-premises environments to Azure.

For more information, see the [Migration Assistant FAQ](https://github.com/Azure/App-Service-Migration-Assistant/wiki#faqs).

## Containerize ASP.NET web applications

Some .NET Framework applications depend on libraries or features that aren't available in Azure App Service. These applications might also rely on components installed in the Global Assembly Cache (GAC).

You can containerize these applications and run them in Azure App Service Windows Containers.

The [App containerization tool](https://azure.microsoft.com/blog/accelerate-application-modernization-with-azure-migrate-app-containerization/) helps repackage applications into containers with minimal code changes.

The tool currently supports:

- ASP.NET applications
- Apache Tomcat Java applications

For more information, see [ASP.NET app containerization and migration to Azure App Service](../migrate/tutorial-app-containerization-aspnet-app-service.md).

## Related content

- [Migrate an on-premises web application to Azure App Service](/training/modules/migrate-app-service-migration-assistant/)