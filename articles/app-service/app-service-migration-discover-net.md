---
title: Discover .NET Apps to Azure App Service
description: Learn about .NET migration resources available to Azure App Service and about the capabilities of discovery.
author: msangapu-msft

ms.topic: concept-article
ms.date: 11/17/2025
ms.author: msangapu
ms.devlang: csharp
ms.custom: devx-track-dotnet
ms.service: azure-app-service
#customer intent: As a deployment engineer, I want to learn about discovery resources and learn the capabilities of discovery so that I can get started with discovery.

---
# At-scale discovery of .NET web apps

For ASP.NET web apps discovery, you need to either install a new [Azure Migrate appliance](../migrate/migrate-appliance.md) or upgrade an existing one.

Once the appliance is configured, Azure Migrate initiates the discovery of web apps deployed on Internet Information Services (IIS) web servers hosted within your on-premises VMware environment.

## Key capabilities of ASP.NET web app discovery

- Agentless discovery of up to 20,000 web apps with a single Azure Migrate appliance
- Rich and interactive dashboard that lists IIS web servers and underlying VM infra details. Web apps discovery surfaces information such as:
    - web app name
    - web server type and version
    - URLs
    - binding port
    - application pool
- If web apps discovery fails, the discovery dashboard allows easy navigation to review relevant error messages, possible causes of failure, and suggested remediation actions

## Related content

- [At scale discovery and assessment for ASP.NET app migration with Azure Migrate](/shows/inside-azure-for-it/at-scale-discovery-and-assessment-for-aspnet-app-migration-with-azure-migrate)
- [Discover and assess ASP.NET apps at-scale with Azure Migrate](https://azure.microsoft.com/blog/discover-and-assess-aspnet-apps-atscale-with-azure-migrate/)
- [Discover installed software inventory, web apps, and database instances](../migrate/how-to-discover-applications.md)
- [Discover web apps and SQL Server instances in an existing project](../migrate/how-to-discover-sql-existing-project.md)
