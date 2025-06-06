---
title: Azure Application Gateway classic to Resource Manager
description: Learn about moving Azure Application Gateway resources from the classic deployment model to the Resource Manager deployment model.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 05/01/2025
ms.author: mbender
---

# Application gateway classic to Resource Manager migration

This article describes benefits of the new [Azure Resource Manager](../azure-resource-manager/management/overview.md) (ARM) deployment model and provides guidance on how to migrate Azure Application Gateway from [classic deployment](#what-is-azure-service-manager-and-what-does-it-mean-by-classic) to Azure Resource Manager deployment.  For more information about deployment models, see [Azure Resource Manager vs. classic deployment](/azure/azure-resource-manager/management/deployment-models).

> [!NOTE]
> For information about retirement of the classic deployment model, see [Azure updates](https://azure.microsoft.com/updates?id=azure-classic-resource-providers-will-be-retired-on-31-august-2024).

Azure Resource Manager has many features and benefits, including:
* Deployment of complex applications through [templates](/azure/azure-resource-manager/templates/overview) 
* Configuration of virtual machines with [VM extensions](/azure/virtual-machines/extensions/overview) 
* Incorporation of [access management](/azure/role-based-access-control/) and [tagging](/azure/azure-resource-manager/management/tag-resources) 
* Scalable, parallel deployment for virtual machines into [availability sets](/azure/virtual-machines/availability-set-overview)
* Independent lifecycle management of compute, network, and storage resources

At a high level, migration of an application gateway from classic to Resource Manager requires three steps:
1. Remove (delete) the application gateway resource from the VNet.
2. [Migrate your IaaS resources](/azure/virtual-machines/migration/migration-classic-resource-manager-ps).
3. [Recreate the application gateway resource](#creating-a-new-application-gateway-resource) using Resource Manager.

> [!IMPORTANT]
> Application gateway resources are **not** migrated automatically as part of VNet migration from classic to Resource Manager. If you have an application gateway resource present on the VNet that you're trying to migrate to Resource Manager deployment model, automatic migration fails.

## Creating a new application gateway resource 

See the following articles for more information on how to set up an application gateway resource after VNet migration:

* [Deployment via portal](quick-create-portal.md)
* [Deployment via PowerShell](quick-create-powershell.md)
* [Deployment via Azure CLI](quick-create-cli.md)
* [Deployment via ARM template](quick-create-template.md)

## Common questions

### What is Azure Service Manager and what does it mean by classic?

The word "classic" in classic networking service refers to networking resources managed by Azure Service Manager (ASM). Azure Service Manager (ASM) is the old control plane of Azure responsible for creating, managing, deleting VMs and performing other control plane operations.

> [!NOTE]
> To view all the classic resources in your subscription, Open the **All Resources** blade and look for a **(Classic)** suffix after the resource name.

### What is Azure Resource Manager?

Azure Resource Manager is the latest control plane of Azure responsible for creating, managing, deleting VMs and performing other control plane operations.

### Where can I find more information regarding classic to Azure Resource Manager migration?

Refer to [Frequently asked questions about classic to Azure Resource Manager migration](/azure/virtual-machines/migration-classic-resource-manager-faq)

### How can I clean up my classic application gateway deployment?

Step 1: Install the old PowerShell version for managing legacy resources.

[Installing the Azure PowerShell Service Management module](/powershell/azure/servicemanagement/install-azure-ps)

> [!NOTE]
> The cmdlets referenced in this documentation are for managing legacy Azure resources that use Azure Service Manager (ASM) APIs. This legacy PowerShell module isn't recommended for creating new resources since ASM is scheduled for retirement.

Step 2: Run the following command to remove the application gateway: [Remove-AzureApplicationGateway](/powershell/module/servicemanagement/azure/remove-azureapplicationgateway)

 ```
# Sign in to account and set proper subscription
Add-AzureAccount
Get-AzureSubscription
Select-AzureSubscription -SubscriptionId <SubscriptionId> -Default
 
# Get the list of application gateways in the subscription
Get-AzureApplicationGateway
 
# Remove the desired application gateway
Remove-AzureApplicationGateway -Name <NameofGateway>
```

### How do I report an issue?

Post your issues and questions about migration to our [Microsoft Q&A page](/answers/topics/azure-virtual-network.html). We recommend posting all your questions on this forum. If you have a support contract, you're welcome to log a support ticket as well.

## Next steps

To get started, see [Platform-supported migration of IaaS resources from classic to Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-ps)

Also see [Prepare for Azure classic administrator roles retirement](/azure/cost-management-billing/manage/classic-administrator-retire?source=recommendations) and [Azure classic subscription administrators](/azure/role-based-access-control/classic-administrators?source=recommendations&tabs=azure-portal).

For any concerns around migration, you can contact Azure Support. Learn more about [Azure support here](https://azure.microsoft.com/support/options/).
