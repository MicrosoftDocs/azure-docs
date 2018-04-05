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
ms.date: 03/09/2018
ms.author: anwestg

---
# How to redistribute Azure App Service on Azure Stack across fault domains

*Applies to: Azure Stack integrated systems*

With the 1802 update, Azure Stack now supports the distribution of workloads across fault domains, a feature, which is critical for high availability.

> [!IMPORTANT]
> You must have updated your Azure Stack integrated system to 1802 to be able to take advantage of fault domain support.  This document only applies to App Service resource provider deployments that were completed prior to the 1802 update.  If you have deployed App Service on Azure Stack after the 1802 update was applied to Azure Stack, the resource provider is already distributed across fault domains.
>
>

## Rebalance an App Service resource provider across fault domains

In order to redistribute the scale sets deployed for the App Service resource provider, you must perform the following steps for each scale set.  By default the scaleset names are:

* ManagementServersScaleSet
* FrontEndsScaleSet
* PublishersScaleSet
* SharedWorkerTierScaleSet
* SmallWorkerTierScaleSet
* MediumWorkerTierScaleSet
* LargeWorkerTierScaleSet

> [!NOTE]
> If you have no instances deployed in some of the worker tier scale sets, you do not need to rebalance those scale sets.  The scale sets will be balanced correctly when you scale them out in future.
>
>

1. Browse to the Virtual Machine Scale Sets in the Azure Stack Administrator Portal.  Existing scale sets deployed as part of the App Service deployment will be listed with instance count information.

    ![Azure App Service Scale Sets listed in Virtual Machine Scale Sets UX][1]

2. Next scale out each set.  For example, if you have three existing instances in the scale set you must scale out to 6 so that the three new instances will be provisioned across fault domains.
    a. [Setup the Azure Stack Admin environment in PowerShell](azure-stack-powershell-configure-admin.md)
    b. Use this example to scale out the scale set:
        ```powershell
                Login-AzureRMAccount -EnvironmentName AzureStackAdmin 

                # Get current scale set
                $vmss = Get-AzureRmVmss -ResourceGroupName "AppService.local" -VMScaleSetName "SmallWorkerTierScaleSet"

                # Set and update the capacity of your scale set
                $vmss.sku.capacity = 6
                Update-AzureRmVmss -ResourceGroupName "AppService.local" -Name "SmallWorkerTierScaleSet" -VirtualMachineScaleSet $vmss
        '''
> [!NOTE]
> This step can take a number of hours to complete depending on the type of role and the number of instances.
>
>

3. Monitor the status of the new role instances in the App Service Administration Roles blade.  Check the status of an individual role instance by clicking the role type in the list

    ![Azure App Service on Azure Stack Roles][2]

4. One new instances are in a **Ready** state, go back to the Virtual Machine Scale Set blade and **delete**  the old instances.

5. Repeat these steps for **each** virtual machine scale set.

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md).

* [SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md)
* [MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md)

<!--Image references-->
[1]: ./media/azure-stack-app-service-fault-domain-update/app-service-scale-sets.png
[2]: ./media/azure-stack-app-service-fault-domain-update/app-service-roles.png
