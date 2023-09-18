---
title: Support matrix for web apps migration
description: Support matrix for web apps migration
author: vineetvikram
ms.author: vivikram
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 08/31/2023
ms.custom: template-concept, engagement-fy23
---

# Support matrix for web apps migration

This article summarizes support settings and limitations for agentless migration of web apps to Azure App Service [Azure Migrate: Migration and modernization](migrate-services-overview.md#migration-and-modernization-tool) . If you're looking for information about assessing web apps for migration to Azure App Service, review the [assessment support matrix](concepts-azure-webapps-assessment-calculation.md).

## Migration options

You can perform agentless migration of ASP.NET web apps at-scale to [Azure App Service](https://azure.microsoft.com/services/app-service/) using Azure Migrate. However, agent based migration is not supported.

## Limitations

- Currently, At-Scale Discovery, Assessment and Migration is supported for ASP.NET web apps deployed to on-premises IIS servers hosted on VMware Environment.
- You can select up to five App Service Plans as part of single migration.
- Currently, we do not support selecting existing App service plans during the migration flow.
- You can migrate web apps up to max 2 GB in size including content stored in mapped virtual directory.
- Currently, we do not support migrating UNC directory content.
- You need Windows PowerShell 4.0 installed on VMs hosting the IIS web servers from which you plan to migrate ASP.NET web apps to Azure App Services.
- Currently, the migration flow does not support VNet integrated scenarios.

## ASP.NET web apps migration requirements

Azure Migrate now supports agentless at-scale migration of ASP.NET web apps to [Azure App Service](https://azure.microsoft.com/services/app-service/). Performing [web apps assessment](./tutorial-assess-webapps.md) is mandatory for migration web apps using the integrated flow in Azure Migrate.

Support | Details
--- | ---
**Supported servers** | Currently supported only for windows servers running IIS in your VMware environment.
**Windows servers** | Windows Server 2012 R2 and later are supported.
**Linux servers** | Currently not supported.
**IIS access** | Web apps discovery requires a local admin user account.
**IIS versions** | IIS 7.5 and later are supported.
**PowerShell version** | PowerShell 4.0

## Next steps

- Learn how to [perform at-scale agentless migration of ASP.NET web apps to Azure App Service](./tutorial-modernize-asp-net-appservice-code.md).
- Once you have successfully completed migration, you may explore the following steps based on web app specific requirement(s):
  - [Map existing custom DNS name](../app-service/app-service-web-tutorial-custom-domain.md).
  - [Secure a custom DNS with a TLS/SSL binding](../app-service/configure-ssl-bindings.md).
  - [Securely connect to Azure resources](../app-service/tutorial-connect-overview.md).
  - [Deployment best practices](../app-service/deploy-best-practices.md).
  - [Security recommendations](../app-service/security-recommendations.md).
  - [Networking features](../app-service/networking-features.md).
  - [Monitor App Service with Azure Monitor](../app-service/monitor-app-service.md).
  - [Configure Azure AD authentication](../app-service/configure-authentication-provider-aad.md).
- [Review best practices](../app-service/deploy-best-practices.md) for deploying to Azure App service.
