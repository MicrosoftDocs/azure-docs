---
title: Removing the MySQL resource provider on Azure Stack | Microsoft Docs
description: Learn how you can remove the MySQL resource provider from your Azure Stack deployment.
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

# Removing the MySQL resource provider  
Before removing the MySQL resource provider, it is essential to first remove any dependencies.

## Remove the MySQL resource provider 

1. Verify that you have removed any existing MySQL resource provider dependencies.

  > [!NOTE]
  > Uninstalling the MySQL resource provider will proceed even if dependent resources are currently using the resource provider. 
  
2. Ensure that you have the original deployment package that you downloaded for this version of the SQL resource provider adapter.

3. All tenant databases must be deleted from the resource provider. (Deleting the tenant databases doesn't delete the data.) This task should be performed by the tenants themselves. 

4. Tenants must unregister from the namespace. 

5. The administrator must delete the hosting servers from the MySQL Adapter. 

6. The administrator must delete any plans that reference the MySQL Adapter.

7. The administrator must delete any quotas that are associated with the MySQL Adapter. 

8. Rerun the deployment script using the following parameters: 
    - The -Uninstall parameter 
    - The Azure Resource Manager endpoints 
    - The DirectoryTenantID 
    - The credentials for the service administrator account 

## Next steps
[Offer App Services as PaaS](azure-stack-app-service-overview.md)
