--- 
title: Use MySQL databases as PaaS on Azure Stack | Microsoft Docs 
description: Learn how you can deploy the MySQL Resource Provider and provide MySQL databases as a service on Azure Stack. 
services: azure-stack 
documentationCenter: '' 
author: jeffgilb 
manager: femila 
editor: '' 
ms.service: azure-stack 
ms.workload: na 
ms.tgt_pltfrm: na 
ms.devlang: na 
ms.topic: article 
ms.date: 06/14/2018 
ms.author: jeffgilb 
ms.reviewer: jeffgo 
--- 

# Use MySQL databases on Microsoft Azure Stack 
You can deploy a MySQL resource provider on Azure Stack. After you deploy the resource provider, you can create MySQL servers and databases through Azure Resource Manager deployment templates. You can also provide MySQL databases as a service.  

MySQL databases, which are common on web sites, support many website platforms. For example, after you deploy the resource provider, you can create WordPress websites from the Web Apps platform as a service (PaaS) add-on for Azure Stack. 
 
To deploy the MySQL provider on a system that does not have Internet access, copy the file [mysql-connector-net-6.10.5.msi](https://dev.mysql.com/get/Download/sConnector-Net/mysql-connector-net-6.10.5.msi) to a local share. Then provide that share name when you are prompted for it. You must install the Azure and Azure Stack PowerShell modules. 

## MySQL Server resource provider adapter architecture 
The resource provider is made up of three components: 
- **The MySQL resource provider adapter VM**, which is a Windows virtual machine that's running the provider services. 
- **The resource provider itself**, which processes provisioning requests and exposes database resources. 
- **Servers that host MySQL Server**, which provide capacity for databases that are called hosting servers. You need to create MySQL instances yourself or provide access to external SQL instances. Visit the [Azure Stack Quickstart Gallery](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/mysql-standalone-server-windows) for an example template that can: 
    - Create a MySQL server for you. 
    - Download and deploy a MySQL Server from Azure Marketplace. 


> [!NOTE] 
> Hosting servers that are installed on Azure Stack integrated systems must be created from a tenant subscription. They can't be created from the default provider subscription. They must be created from the tenant portal or from a PowerShell session with an appropriate sign-in. All hosting servers are chargeable VMs and must have appropriate licenses. The service administrator can be the owner of the tenant subscription. 

### Required privileges 
The system account must have the following privileges: 
- Database: Create, drop 
- Login: Create, set, drop, grant, revoke  

## Next steps
[Deploy the MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md)
