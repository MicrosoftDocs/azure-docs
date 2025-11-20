---
title: Discover .NET Apps to Azure App Service
description: Learn about .NET migration resources available to Azure App Service and about the capabilities of discovery.
author: msangapu-msft

ms.topic: concept-article
ms.date: 03/29/2021
ms.author: msangapu
ms.devlang: csharp
ms.custom: devx-track-dotnet
ms.service: azure-app-service
#customer intent: As a deployment engineer, I want to learn about discovery resources and learn the capabilities of discovery so that I can get started with discovery.

---
# At-scale discovery of .NET web apps

For ASP. Net web apps discovery you need to either install a new Azure Migrate appliance or upgrade an existing Azure Migrate appliance. 

Once the appliance is configured, Azure Migrate initiates the discovery of web apps deployed on IIS web servers hosted within your on-premises VMware environment.

## Key capabilities of ASP.NET web app discovery 

- Agentless discovery of up to 20,000 web apps with a single Azure Migrate appliance 
- Provide a rich & interactive dashboard with a list of IIS web servers and underlying VM infra details. Web apps discovery surfaces information such as:
    - web app name
    - web server type and version
    - URLs
    - binding port
    - application pool
- If web app discovery fails, the discovery dashboard allows easy navigation to review relevant error messages, possible causes of failure and suggested remediation actions

For more information about web apps discovery, see: 

- [At scale discovery and assessment for ASP.NET app migration with Azure Migrate](https://channel9.msdn.com/Shows/Inside-Azure-for-IT/At-scale-discovery-and-assessment-for-ASPNET-app-migration-with-Azure-Migrate)
- [Discover and assess ASP.NET apps at-scale with Azure Migrate](https://azure.microsoft.com/blog/discover-and-assess-aspnet-apps-atscale-with-azure-migrate/)
- [At scale discovery and assessment for ASP.NET app migration with Azure Migrate](https://channel9.msdn.com/Shows/Inside-Azure-for-IT/At-scale-discovery-and-assessment-for-ASPNET-app-migration-with-Azure-Migrate)
- [Discover software inventory on on-premises servers with Azure Migrate](../migrate/how-to-discover-applications.md)
- [Discover web apps and SQL Server instances](../migrate/how-to-discover-sql-existing-project.md)


## Related content 

- [At-scale assessment of .NET web apps](/training/modules/migrate-app-service-migration-assistant/)
