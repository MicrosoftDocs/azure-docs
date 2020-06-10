---
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 04/15/2020
ms.author: cephalin
---
The platform components of App Service, including Azure VMs, storage, network connections, web frameworks, management and integration features, are actively secured and hardened. App Service goes through vigorous compliance checks on a continuous basis to make sure that:

- Your app resources are [secured](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox) from the other customers' Azure resources.
- [VM instances and runtime software are regularly updated](../articles/app-service/overview-patch-os-runtime.md) to address newly discovered vulnerabilities. 
- Communication of secrets (such as connection strings) between your app and other Azure resources (such as [SQL Database](https://azure.microsoft.com/services/sql-database/)) stays within Azure and doesn't cross any network boundaries. Secrets are always encrypted when stored.
- All communication over the App Service connectivity features, such as [hybrid connection](../articles/app-service/app-service-hybrid-connections.md), is encrypted. 
- Connections with remote management tools like Azure PowerShell, Azure CLI, Azure SDKs, REST APIs, are all encrypted.
- 24-hour threat management protects the infrastructure and platform against malware, distributed denial-of-service (DDoS), man-in-the-middle (MITM), and other threats.

For more information on infrastructure and platform security in Azure, see [Azure Trust Center](https://azure.microsoft.com/overview/trusted-cloud/).