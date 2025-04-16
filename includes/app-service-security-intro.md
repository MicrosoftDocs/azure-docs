---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 04/15/2020
ms.author: cephalin
---
The platform components of Azure App Service, including Azure virtual machines (VMs), storage, network connections, web frameworks, and management and integration features are actively secured and hardened. App Service goes through vigorous compliance checks on a continuous basis to make sure that:

- Your app resources are [secured](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox) from other customers' Azure resources.
- [VM instances and runtime software are regularly updated](/azure/app-service/overview-patch-os-runtime) to address newly discovered vulnerabilities.
- Communication of secrets (such as connection strings) between your app and other Azure resources (such as [Azure SQL Database](https://azure.microsoft.com/services/sql-database/)) stays within Azure and doesn't cross any network boundaries. Secrets are always encrypted when stored.
- All communication over the App Service connectivity features, such as [hybrid connection](/azure/app-service/app-service-hybrid-connections), is encrypted.
- Connections with remote management tools like Azure PowerShell, the Azure CLI, Azure SDKs, and REST APIs, are all encrypted.
- 24-hour threat management protects the infrastructure and platform against malware, distributed denial-of-service (DDoS), man-in-the-middle attacks, and other threats.

For more information on infrastructure and platform security in Azure, see the [Azure Trust Center](https://azure.microsoft.com/overview/trusted-cloud/).
