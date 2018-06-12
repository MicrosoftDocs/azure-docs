---
title: Microsoft Azure Stack Development Kit release notes | Microsoft Docs
description: Improvements, fixes, and known issues for Azure Stack Development Kit.
services: azure-stack
documentationcenter: ''
author: twooley
manager: byronr
editor: ''

ms.assetid: a7e61ea4-be2f-4e55-9beb-7a079f348e05
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/02/2017
ms.author: twooley

---

# Azure Stack Development Kit release notes

*Applies to: Azure Stack Development Kit*

These release notes provide information about improvements, fixes, and known issues in Azure Stack Development Kit. If you're not sure which version you're running, you can [use the portal to check](azure-stack-updates.md#determine-the-current-version).

## Build 20171020.1

### Improvements and fixes

To see the list of improvements and fixes in the 20171020.1 build, see the [Improvements and fixes](azure-stack-update-1710.md#improvements-and-fixes) section of the 1710 release notes for Azure Stack integrated systems. Some of the items listed in the "Additional quality improvements and fixes" section are relevant only to integrated systems.

Also, the following fixes were made:
- Fixed an issue where the Compute resource provider displayed an unknown state.
- Fixed an issue where quotas may not show up in the administrator portal after you create them and then later try to view plan details.

### Known issues

#### PowerShell
- The release of the AzureRM 1.2.11 PowerShell module comes with a list of breaking changes. For information about upgrading from the 1.2.10 version, see the [migration guide](https://aka.ms/azspowershellmigration).
 
#### Deployment
- You must specify a time server by IP address during deployment.

#### Infrastructure management
- Do not enable infrastructure backup on the **Infrastructure backup** blade.
- The baseboard management controller (BMC) IP address and model are not shown in the essential information of a scale unit node. This behavior is expected in Azure Stack Development Kit.

#### Portal
- You may see a blank dashboard in the portal. To recover the dashboard, select the gear icon in the upper right corner of the portal, and then select **Restore default settings**.
- When you view the properties of a resource group, the **Move** button is disabled. This behavior is expected. Moving resource groups between subscriptions is not currently supported.
-  For any workflow where you select a subscription, resource group, or location in a drop-down list, you may experience one or more of the following issues:

   - You may see a blank row at the top of the list. You should still be able to select an item as expected.
   - If the list of items in the drop-down list is short, you may not be able to view any of the item names.
   - If you have multiple user subscriptions, the resource group drop-down list may be empty. 

   To work around the last two issues, you can type the name of the subscription or resource group (if you know it), or you can use PowerShell instead.

- You will see an **Activation Required** warning alert that advises you to register your Azure Stack Development Kit. This behavior is expected.
- In the **Activation Required** warning alert details, do not click the link to the **AzureBridge** component. If you do, the **Overview** blade will unsuccessfully try to load, and won't time out.
- In the administrator portal, you may see an **Error fetching tenants** error in the **Notifications** area. You can safely ignore this error.
- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.
- You are not able to view permissions to your subscription by using the Azure Stack portals. As a workaround, you can verify permissions by using PowerShell.
 
#### Marketplace
- When you try to add items to the Azure Stack marketplace by using the **Add from Azure** option, not all items may be visible for download.
- Users can browse the full marketplace without a subscription, and can see administrative items like plans and offers. These items are non-functional to users.
 
#### Compute
- Users are given the option to create a virtual machine with geo-redundant storage. This configuration causes virtual machine creation to fail. 
- You can configure a virtual machine availability set only with a fault domain of one, and an update domain of one.
- There is no marketplace experience to create virtual machine scale sets. You can create a scale set by using a template.
- Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.

#### Networking
- You can't create a load balancer with a public IP address by using the portal. As a workaround, you can use PowerShell to create the load balancer.
- You must create a network address translation (NAT) rule when you create a network load balancer. If you don't, you'll receive an error when you try to add a NAT rule after the load balancer is created.
- Under **Networking**, if you click **Connection** to set up a VPN connection, **VNet-to-VNet** is listed as a possible connection type. Do not select this option. Currently, only the **Site-to-site (IPsec)** option is supported.
- You can't disassociate a public IP address from a virtual machine (VM) after the VM has been created and associated with that IP address. Disassociation will appear to work, but the previously assigned public IP address remains associated with the original VM. This behavior occurs even if you reassign the IP address to a new VM (commonly referred to as a *VIP swap*). All future attempts to connect through this IP address result in a connection to the originally associated VM, and not to the new one. Currently, you must only use new public IP addresses for new VM creation.
 
#### SQL/MySQL 
- It can take up to an hour before tenants can create databases in a new SQL or MySQL SKU. 
- Creation of items directly on SQL and MySQL hosting servers that are not performed by the resource provider is not supported and may result in a mismatched state.

#### App Service
- A user must register the storage resource provider before they create their first Azure Function in the subscription.
 
#### Usage and billing
- Public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you can’t use this data to perform accurate accounting of public IP address usage.

## Build 20170928.3

### Known issues

#### PowerShell
- The release of the AzureRM 1.2.11 PowerShell module comes with a list of breaking changes. For information about upgrading from the 1.2.10 version, see the [migration guide](https://aka.ms/azspowershellmigration).

#### Deployment
- You must specify a time server by IP address during deployment.

 #### Infrastructure management
- Do not enable infrastructure backup on the **Infrastructure backup** blade.
- The Compute resource provider displays an unknown state.
- The baseboard management controller (BMC) IP address and model are not shown in the essential information of a scale unit node. This behavior is expected in Azure Stack Development Kit. 
   
#### Portal
- You may see a blank dashboard in the portal. To recover the dashboard, select the gear icon in the upper right corner of the portal, and then select **Restore default settings**.
- When you view the properties of a resource group, the **Move** button is disabled. This behavior is expected. Moving resource groups between subscriptions is not currently supported.
- You will see an **Activation Required** warning alert that advises you to register your Azure Stack Development Kit. This behavior is expected.
- In the **Activation Required** warning alert details, do not click the link to the **AzureBridge** component. If you do, the **Overview** blade will unsuccessfully try to load, and won't time out.
- Quotas may not show up in the administrator portal after you create them and then try to later view the plan details. As a workaround, in **Services and quotas**, click **Add**, and add a new entry.
- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.
- You are not able to view permissions to your subscription using the Azure Stack portals. As a workaround, you can verify permissions by using Powershell.
  
#### Marketplace
- Users can browse the full marketplace without a subscription, and can see administrative items like plans and offers. These items are non-functional to users.
 
#### Compute
- Users are given the option to create a virtual machine with geo-redundant storage. This configuration causes virtual machine creation to fail.
- You can configure a virtual machine availability set only with a fault domain of one, and an update domain of one.
- There is no marketplace experience to create virtual machine scale sets. You can create a scale set by using a template.

#### Networking
- You can't create a load balancer with a public IP address by using the portal. As a workaround, you can use PowerShell to create the load balancer.
- You must create a network address translation (NAT) rule when you create a network load balancer. If you don't, you'll receive an error when you try to add a NAT rule after the load balancer is created.
- Under **Networking**, if you click **Connection** to set up a VPN connection, **VNet-to-VNet** is listed as a possible connection type. Do not select this option. Currently, only the **Site-to-site (IPsec)** option is supported.
- You can't disassociate a public IP address from a virtual machine (VM) after the VM has been created and associated with that IP address. Disassociation will appear to work, but the previously assigned public IP address remains associated with the original VM. This behavior occurs even if you reassign the IP address to a new VM (sometimes referred to as a *VIP swap*). All future attempts to connect through this IP address result in a connection to the originally associated VM, and not to the new one. Currently, you must only use new public IP addresses for new VM creation.


#### SQL/MySQL
- It can take up to an hour before tenants can create databases in a new SQL or MySQL SKU. 
- Creation of items directly on SQL and MySQL hosting servers that are not performed by the resource provider is not supported and may result in a mismatched state.

#### App Service
- A user must register the storage resource provider before they create their first Azure Function in the subscription.
