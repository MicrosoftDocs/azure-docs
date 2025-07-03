---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 07/02/2025
ms.author: cephalin
---
Azure App Service actively secures and hardens its platform components, including Azure virtual machines (VMs), storage, network connections, web frameworks, and management and integration features. App Service undergoes continuous, rigorous compliance checks to ensure that:

- [Apps are segregated from other Azure apps and resources](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox).
- [Regular updates of VMs and runtime software occur](/azure/app-service/overview-patch-os-runtime) to address newly discovered vulnerabilities.
- Communication of secrets and connection strings between apps and other Azure resources like [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) occurs only within Azure, without crossing any network boundaries. Stored secrets are always encrypted.
- All communication over App Service connectivity features like [Hybrid Connection](/azure/app-service/app-service-hybrid-connections) are encrypted.
- All connections via remote management tools like Azure PowerShell, Azure CLI, Azure SDKs, and REST APIs are encrypted.
- Continuous threat management protects the infrastructure and platform against malware, distributed denial-of-service (DDoS) and man-in-the-middle attacks, and other threats.

For more information on infrastructure and platform security in Azure, see the [Azure Trust Center](https://www.microsoft.com/trust-center).
