---
title: Overview of Azure App Service
description: Learn how Azure App Service helps you develop and host web applications.

ms.assetid: 94af2caf-a2ec-4415-a097-f60694b860b3
ms.topic: overview
ms.date: 04/24/2025
ms.update-cycle: 1095-days
ms.custom: UpdateFrequency3, linux-related-content
ms.author: msangapu
author: msangapu-msft
ms.service: azure-app-service
#customer intent: As a developer or IT decision maker, I want a clear overview of Azure App Service features and supported workloads so that I can evaluate its fit for hosting my web applications, APIs, and back ends with minimal infrastructure management.
---

# App Service overview

Azure App Service is a platform that lets you run web applications, mobile back ends, and RESTful APIs without worrying about managing the underlying infrastructure. Think of it as a powerful web hosting service that takes care of all the heavy lifting for you, so you can focus on creating great applications.

App Service supports a variety of web stacks: .NET, Java (in Java SE, Tomcat, and JBoss flavors), Node.js, Python, and PHP, and can run them on both Windows and Linux. Or, if your app is containerized, you can just deploy it as a custom container.

## Why Use Azure App Service?

Whether you're a student, a small business, a startup, or an enterprise, App Service offers a wide range of features tailored to meet your needs.

### Students

- **Free access**: In addition to the widely available [free tier](https://azure.microsoft.com/pricing/purchase-options/azure-account), students can take advantage of the [Azure for Students Starter](https://azure.microsoft.com/pricing/offers/ms-azr-0144p) program.
- **IDE support**: Purpose-built deployment tools are available for Visual Studio, Visual Studio Code, IntelliJ, and Eclipse.
- **Easy to use**: Run your apps without needing experience in infrastructure management.
- **Learning Resources**: Plenty of tutorials and guides to help you get started.

### Small businesses and startups

- **Brand security**: Protect your brand and your customers quickly with an [App Service domain](manage-custom-dns-buy-domain.md) and a [free managed certificate](configure-ssl-certificate.md). Or, bring your domain and certificate to App Service.
- **Cost-effective**: Pay only for the resources you use, and scale [up](manage-scale-up.md) or [out](/azure/azure-monitor/autoscale/autoscale-get-started) with your business.
- **Command-line friendly**: Deploy using command line tools you already use, such as Maven, Gradle, Azure Developer CLI, Azure CLI, and Azure PowerShell.
- **Scalability**: Automatically scale your applications based on demand.
- **Global reach**: Deploy your apps in data centers around the world.
- **Application templates**: Choose from an extensive list of application templates in the [Azure Marketplace](https://azure.microsoft.com/marketplace/), such as WordPress, Joomla, Django , Node.js and Drupal.
- **Social sign-in support**: Turn-key social sign-in with [Google](configure-authentication-provider-google.md), [Facebook](configure-authentication-provider-facebook.md), [X](configure-authentication-provider-twitter.md), and [Microsoft accounts](configure-authentication-provider-microsoft.md).

### Enterprises

- **CI/CD**: [Deploy continuously](deploy-continuous-deployment.md) with GitHub Actions, Azure Pipelines, and more. Deploy predictably through [staging environments](deploy-staging-slots.md).
- **High-density hosting savings**: Run more applications on fewer VMs with the memory-optimized [P*mv3 tiers](https://azure.microsoft.com/pricing/details/app-service/), and save up to 55% on predictable workloads with [Azure savings plans](https://azure.microsoft.com/pricing/offers/savings-plan-compute) and [reserved instances](https://azure.microsoft.com/pricing/reservations/).
- **Full isolation**: Secure ingress and egress with [Azure Virtual Network integration](./tutorial-networking-isolate-vnet.md), or run fully isolated applications with [App Service environments](./environment/ase-multi-tenant-comparison.md), using dedicated networking and VMs.
- **Line-of-business**: Develop business applications easily with built-in authentication, Microsoft Graph, and [connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) to your line-of-business applications.
- **Reliability**: Robust [SLA](https://azure.microsoft.com/support/legal/sla/app-service/) and zone redundancy features help disaster-proof your application.
- **Security and compliance**: [ISO, SOC, and PCI compliance](https://www.microsoft.com/trust-center) meet the strictest requirements of large enterprises.

For information about which Azure compute services best fit your scenario, see [Choose an Azure compute service](/azure/architecture/guide/technology-choices/compute-decision-tree).

## Managed Instance on App Service (preview)

> [!NOTE]
> Managed Instance (preview) adds customization with plan-scoped isolation for legacy or infrastructure-bound web apps requiring Component Object Model (COM), registry access, Windows/Microsoft Installers (MSI), drive mapping, or stricter network boundaries.

Key points:
- Startup PowerShell install scripts enable COM, registry, IIS, ACL updates, MSI execution.
- Registry adapters: Plan-level registry key definitions with secret values stored in Azure Key Vault.
- Drive letter access: Configure access to SMB/UNC paths for legacy components (map or reference as supported).
- RDP (via Azure Bastion): Diagnostics only—script persistent configuration.
- Supports: Windows workloads (.NET, Java), COM/registry/MSI, drive mapping, managed identity, VNet integration, MSMQ client, CI/CD, Entra ID auth.
- Not supported: Linux, containers, ASE, remote debugging (preview), non-PV4/PMV4 SKUs.

> [!IMPORTANT]
> Validate telemetry (Application Insights/logging), certificate automation, and operational processes before production adoption. Persistent changes must be scripted using configuration (install) scripts; Changes made during RDP sessions are not persisted.

### Quick decision guide snapshot

Choose [Managed Instance](quickstart-managed-instance.md) if:
- Legacy dependencies (COM, registry, MSI, drive mapping) exist.
- Plan-level enforced network isolation needed for a focused set of apps.
- Diagnostics RDP access desired.

Choose a standard [App Service plan](getting-started.md) if:
- You need Linux or container support.
- You want broad runtime flexibility with automatic OS/runtime management and patching.

Choose [ASE](./environment/ase-multi-tenant-comparison.md) if:
- You require large-scale isolation for many apps rather than deep per-plan OS customization.

## Next Steps

- [Getting started with Azure App Service](getting-started.md)
- [Managed Instance quickstart](quickstart-managed-instance.md)
