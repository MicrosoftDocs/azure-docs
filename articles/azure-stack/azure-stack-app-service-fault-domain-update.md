---
title: 'App Service on Azure Stack: Fault Domain Update | Microsoft Docs'
description: How to redistribute Azure App Service on Azure Stack across fault domains
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/05/2018
ms.author: anwestg

---
# How to redistribute Azure App Service on Azure Stack across fault domains

*Applies to: Azure Stack integrated systems*

With the 1802 update, Azure Stack now supports the distribution of workloads across fault domains, a feature that's critical for high availability.

>[!IMPORTANT]
>To take advantage of fault domain support, you must update your Azure Stack integrated system to 1802. This document only applies to App Service resource provider deployments that were finished before the 1802 update. If you deployed App Service on Azure Stack after the 1802 update was applied to Azure Stack, the resource provider is already distributed across fault domains.

## Rebalance an App Service resource provider across fault domains

To redistribute the scale sets deployed for the App Service resource provider, you must perform the steps in this article for each scale set. By default, the scale set names are:

* ManagementServersScaleSet
* FrontEndsScaleSet
* PublishersScaleSet
* SharedWorkerTierScaleSet
* SmallWorkerTierScaleSet
* MediumWorkerTierScaleSet
* LargeWorkerTierScaleSet

>[!NOTE]
> If you don't have instances deployed in some of the worker tier scale sets, you don't need to rebalance those scale sets. The scale sets will be balanced correctly when you scale them out in future.

To scale out the scale sets, follow these steps:

1. Sign in to the Azure Stack Administrator Portal.
1. Select **All services**.
2. In the **COMPUTE** category, select **Virtual machine scale sets**. Existing scale sets deployed as part of the App Service deployment will be listed with instance count information. The following screen capture shows an example of scale sets.

      ![Azure App Service Scale Sets listed in Virtual Machine Scale Sets UX][1]

1. Scale out each set. For example, if you have three existing instances in the scale set you must scale out to 6 so the three new instances are deployed across fault domains. The following PowerShell example shows out to scale out the scale set.

   ```powershell
   Add-AzureRmAccount -EnvironmentName AzureStackAdmin 

   # Get current scale set
   $vmss = Get-AzureRmVmss -ResourceGroupName "AppService.local" -VMScaleSetName "SmallWorkerTierScaleSet"

   # Set and update the capacity of your scale set
   $vmss.sku.capacity = 6
   Update-AzureRmVmss -ResourceGroupName AppService.local" -Name "SmallWorkerTierScaleSet" -VirtualMachineScaleSet $vmss
   ```

   >[!NOTE]
   >This step can take several of hours to finish, depending on the type of role and the number of instances.

1. In **App Service Administration Roles**, monitor the status of the new role instances. To check the status of a role instance, select the role type in the list

    ![Azure App Service on Azure Stack Roles][2]

1. When the status of the new role instances is **Ready**, go back to **Virtual Machine Scale Set** and **delete** the old role instances.

1. Repeat these steps for **each** virtual machine scale set.

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md).

* [SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md)
* [MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md)

<!--Image references-->
[1]: ./media/azure-stack-app-service-fault-domain-update/app-service-scale-sets.png
[2]: ./media/azure-stack-app-service-fault-domain-update/app-service-roles.png
