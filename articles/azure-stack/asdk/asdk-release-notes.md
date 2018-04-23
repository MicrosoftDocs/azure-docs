---
title: Microsoft Azure Stack Development Kit release notes | Microsoft Docs
description: Improvements, fixes, and known issues for Azure Stack Development Kit.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/20/2018
ms.author: jeffgilb
ms.reviewer: misainat

---

# Azure Stack Development Kit release notes
These release notes provide information about improvements, fixes, and known issues in Azure Stack Development Kit. If you're not sure which version you're running, you can [use the portal to check](.\.\azure-stack-updates.md#determine-the-current-version).

> Stay up-to-date with what's new in the ASDK by subscribing to the [![RSS](./media/asdk-release-notes/feed-icon-14x14.png)](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#) [feed](https://docs.microsoft.com/api/search/rss?search=Azure+Stack+Development+Kit+release+notes&locale=en-us#).

## Build 20180329.1

### New features and fixes
The new features and fixes released for Azure Stack integrated systems version 1803 apply to the Azure Stack Development Kit. See the [new features](.\.\azure-stack-update-1803.md#new-features) and [fixed issues](.\.\azure-stack-update-1803.md#fixed-issues) sections of the Azure Stack 1803 update release notes for details.  
> [!IMPORTANT]    
> Some of the items listed in the **new features** and **fixed issues** sections are relevant only to Azure Stack integrated systems.

### Changes
- The way to change the state of a newly created offer from *private* to *public* or *decommissioned* has changed. For more information, see [Create an offer](.\.\azure-stack-create-offer.md). 


### Known issues
 
#### Portal
- The ability [to open a new support request from the dropdown](.\.\azure-stack-manage-portals.md#quick-access-to-help-and-support) from within the administrator portal isn’t available. Instead, use the following link:     
    - For Azure Stack Development Kit, use https://aka.ms/azurestackforum.    

- <!-- 2050709 --> In the admin portal, it is not possible to edit storage metrics for Blob service, Table service, or Queue service. When you go to Storage, and then select the blob, table, or queue service tile, a new blade opens that displays a metrics chart for that service. If you then select Edit from the top of the metrics chart tile, the Edit Chart blade opens but does not display options to edit metrics.  

- When you view the properties of a resource or resource group, the **Move** button is disabled. This behavior is expected. Moving resources or resource groups between resource groups or subscriptions is not currently supported.
 
- You see an **Activation Required** warning alert that advises you to register your Azure Stack Development Kit. This behavior is expected.

- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.

- You cannot view permissions to your subscription using the Azure Stack portals. As a workaround, use PowerShell to verify permissions.

- In the dashboard of the admin portal, the Update tile fails to display information about updates. To resolve this issue, click on the tile to refresh it.

-	In the admin portal, you might see a critical alert for the Microsoft.Update.Admin component. The Alert name, description, and remediation all display as:  
    - *ERROR - Template for FaultType ResourceProviderTimeout is missing.*

    This alert can be safely ignored. 



#### Marketplace
- Users can browse the full marketplace without a subscription, and can see administrative items like plans and offers. These items are non-functional to users.
 
#### Compute
- Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.

- When you create virtual machines on the Azure Stack user portal, the portal displays an incorrect number of data disks that can attach to a DS series VM. DS series VMs can accommodate as many data disks as the Azure configuration.

- When a VM image fails to be created, a failed item that you cannot delete might be added to the VM images compute blade.

  As a workaround, create a new VM image with a dummy VHD that can be created through Hyper-V (New-VHD -Path C:\dummy.vhd -Fixed -SizeBytes 1 GB). This process should fix the problem that prevents deleting the failed item. Then, 15 minutes after creating the dummy image, you can successfully delete it.

  You can then try to redownload the VM image that previously failed.

-  If provisioning an extension on a VM deployment takes too long, users should let the provisioning time-out instead of trying to stop the process to deallocate or delete the VM.  

- <!-- 1662991 --> Linux VM diagnostics is not supported in Azure Stack. When you deploy a Linux VM with VM diagnostics enabled, the deployment fails. The deployment also fails if you enable the Linux VM basic metrics through diagnostic settings. 


#### Networking
- Under **Networking**, if you click **Connection** to set up a VPN connection, **VNet-to-VNet** is listed as a possible connection type. Do not select this option. Currently, only the **Site-to-site (IPsec)** option is supported.

- After a VM is created and associated with a public IP address, you can't disassociate that VM from that IP address. Disassociation appears to work, but the previously assigned public IP address remains associated with the original VM.

  Currently, you must use only new public IP addresses for new VMs you create.

  This behavior occurs even if you reassign the IP address to a new VM (commonly referred to as a *VIP swap*). All future attempts to connect through this IP address result in a connection to the originally associated VM, and not to the new one.



- Azure Stack supports a single *local network gateway* per IP address. This is true across all tenant subscriptions. After the creation of the first local network gateway connection, subsequent attempts to create a local network gateway resource with the same IP address are blocked.

- On a Virtual Network that was created with a DNS Server setting of *Automatic*, changing to a custom DNS Server fails. The updated settings are not pushed to VMs in that Vnet.
 
- Azure Stack does not support adding additional network interfaces to a VM instance after the VM is deployed. If the VM requires more than one network interface, they must be defined at deployment time.



#### SQL and MySQL 
- It can take up to one hour before users can create databases in a new SQL or MySQL SKU.

- The database hosting servers must be dedicated for use by the resource provider and user workloads. You cannot use an instance that is being used by any other consumer, including App Services.

#### App Service
- Users must register the storage resource provider before they create their first Azure Function in the subscription.

- In order to scale out infrastructure (workers, management, front-end roles), you must use PowerShell as described in the release notes for Compute.
 
#### Usage  
- Usage Public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you can’t use this data to perform accurate accounting of public IP address usage.
<!--
#### Identity
-->

#### Downloading Azure Stack Tools from GitHub
- When using the *invoke-webrequest* PowerShell cmdlet to download the Azure Stack tools from Github, you receive an error:     
    -  *invoke-webrequest : The request was aborted: Could not create SSL/TLS secure channel.*     

  This error occurs because of a recent GitHub support deprecation of the Tlsv1 and Tlsv1.1 cryptographic standards (the default for PowerShell). For more information, see [Weak cryptographic standards removal notice](https://githubengineering.com/crypto-removal-notice/).

  To resolve this issue, add `[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12` to the top of the script to force the PowerShell console to use TLSv1.2 when downloading from GitHub repositories.






## Build 20180302.1

### New features and fixes
See the [new features and fixes](.\.\azure-stack-update-1802.md#new-features-and-fixes) section of the Azure Stack 1802 update release notes for Azure Stack integrated systems.

> [!IMPORTANT]    
> Some of the items listed in the **new features and fixes** section are relevant only to Azure Stack integrated systems.


### Known issues
 
#### Portal
- The ability [to open a new support request from the dropdown](.\.\azure-stack-manage-portals.md#quick-access-to-help-and-support) from within the administrator portal isn’t available. Instead, use the following link:     
    - For Azure Stack Development Kit, use https://aka.ms/azurestackforum.    

- <!-- 2050709 --> In the admin portal, it is not possible to edit storage metrics for Blob service, Table service, or Queue service. When you go to Storage, and then select the blob, table, or queue service tile, a new blade opens that displays a metrics chart for that service. If you then select Edit from the top of the metrics chart tile, the Edit Chart blade opens but does not display options to edit metrics.  

- When you view the properties of a resource or resource group, the **Move** button is disabled. This behavior is expected. Moving resources or resource groups between resource groups or subscriptions is not currently supported.
 
- You see an **Activation Required** warning alert that advises you to register your Azure Stack Development Kit. This behavior is expected.

- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.

- You cannot view permissions to your subscription using the Azure Stack portals. As a workaround, use PowerShell to verify permissions.

- In the dashboard of the admin portal, the Update tile fails to display information about updates. To resolve this issue, click on the tile to refresh it.

-	In the admin portal, you might see a critical alert for the Microsoft.Update.Admin component. The Alert name, description, and remediation all display as:  
    - *ERROR - Template for FaultType ResourceProviderTimeout is missing.*

    This alert can be safely ignored. 

- In both the admin portal and user portal, the Overview blade fails to load when you select the Overview blade for storage accounts that were created with an older API version (example: 2015-06-15). 

  As a workaround, use PowerShell to run the **Start-ResourceSynchronization.ps1** script to restore access to the storage account details. [The script is available from GitHub]( https://github.com/Azure/AzureStack-Tools/tree/master/Support/scripts), and must run with service administrator credentials on the development kit host if you use the ASDK.  

- The **Service Health** blade fails to load. When you open the Service Health blade in either the admin or user portal, Azure Stack displays an error and does not load information. This is expected behavior. Although you can select and open Service Health, this feature is not yet available but will be implemented in a future version of Azure Stack.

#### Health and monitoring
In the Azure Stack admin portal, you might see a critical alert with the name **Pending external certificate expiration**.  This alert can be safely ignored and does affect operations of the Azure Stack Development Kit. 


#### Marketplace
- Users can browse the full marketplace without a subscription, and can see administrative items like plans and offers. These items are non-functional to users.
 
#### Compute
- Scaling settings for virtual machine scale sets are not available in the portal. As a workaround, you can use [Azure PowerShell](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-powershell#change-the-capacity-of-a-scale-set). Because of PowerShell version differences, you must use the `-Name` parameter instead of `-VMScaleSetName`.

- Azure Stack supports using only Fixed type VHDs. Some images offered through the marketplace on Azure Stack use dynamic VHDs but those have been removed. Resizing a virtual machine (VM) with a dynamic disk attached to it leaves the VM in a failed state.

  To mitigate this issue, delete the VM without deleting the VM’s disk, a VHD blob in a storage account. Then convert the VHD from a dynamic disk to a fixed disk, and then re-create the virtual machine.

- When you create virtual machines on the Azure Stack user portal, the portal displays an incorrect number of data disks that can attach to a DS series VM. DS series VMs can accommodate as many data disks as the Azure configuration.

- When a VM image fails to be created, a failed item that you cannot delete might be added to the VM images compute blade.

  As a workaround, create a new VM image with a dummy VHD that can be created through Hyper-V (New-VHD -Path C:\dummy.vhd -Fixed -SizeBytes 1 GB). This process should fix the problem that prevents deleting the failed item. Then, 15 minutes after creating the dummy image, you can successfully delete it.

  You can then try to redownload the VM image that previously failed.

-  If provisioning an extension on a VM deployment takes too long, users should let the provisioning time-out instead of trying to stop the process to deallocate or delete the VM.  

- <!-- 1662991 --> Linux VM diagnostics is not supported in Azure Stack. When you deploy a Linux VM with VM diagnostics enabled, the deployment fails. The deployment also fails if you enable the Linux VM basic metrics through diagnostic settings. 


#### Networking
- Under **Networking**, if you click **Connection** to set up a VPN connection, **VNet-to-VNet** is listed as a possible connection type. Do not select this option. Currently, only the **Site-to-site (IPsec)** option is supported.

- After a VM is created and associated with a public IP address, you can't disassociate that VM from that IP address. Disassociation appears to work, but the previously assigned public IP address remains associated with the original VM.

  Currently, you must use only new public IP addresses for new VMs you create.

  This behavior occurs even if you reassign the IP address to a new VM (commonly referred to as a *VIP swap*). All future attempts to connect through this IP address result in a connection to the originally associated VM, and not to the new one.

-	The IP Forwarding feature is visible in the portal, however enabling IP Forwarding has no effect. This feature is not yet supported.

- Azure Stack supports a single *local network gateway* per IP address. This is true across all tenant subscriptions. After the creation of the first local network gateway connection, subsequent attempts to create a local network gateway resource with the same IP address are blocked.

- On a Virtual Network that was created with a DNS Server setting of *Automatic*, changing to a custom DNS Server fails. The updated settings are not pushed to VMs in that Vnet.
 
- Azure Stack does not support adding additional network interfaces to a VM instance after the VM is deployed. If the VM requires more than one network interface, they must be defined at deployment time.



#### SQL and MySQL 
- It can take up to one hour before users can create databases in a new SQL or MySQL SKU.

- The database hosting servers must be dedicated for use by the resource provider and user workloads. You cannot use an instance that is being used by any other consumer, including App Services.

#### App Service
- Users must register the storage resource provider before they create their first Azure Function in the subscription.

- In order to scale out infrastructure (workers, management, front-end roles), you must use PowerShell as described in the release notes for Compute.
 
#### Usage  
- Usage Public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you can’t use this data to perform accurate accounting of public IP address usage.
<!--
#### Identity
-->

#### Downloading Azure Stack Tools from GitHub
- When using the *invoke-webrequest* PowerShell cmdlet to download the Azure Stack tools from Github, you receive an error:     
    -  *invoke-webrequest : The request was aborted: Could not create SSL/TLS secure channel.*     

  This error occurs because of a recent GitHub support deprecation of the Tlsv1 and Tlsv1.1 cryptographic standards (the default for PowerShell). For more information, see [Weak cryptographic standards removal notice](https://githubengineering.com/crypto-removal-notice/).

  To resolve this issue, add `[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12` to the top of the script to force the PowerShell console to use TLSv1.2 when downloading from GitHub repositories.




## Build 20180103.2

### New features and fixes

- See the [new features and fixes](.\.\azure-stack-update-1712.md#new-features-and-fixes) section of the Azure Stack 1712 update release notes for Azure Stack integrated systems.

	> [!IMPORTANT]
	> Some of the items listed in the **new features and fixes** section are relevant only to Azure Stack integrated systems.

### Known issues
 
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
- If the **Component** link is clicked from any **Infrastructure Role** alert, the resulting **Overview** blade tries to load and fails. Additionally the **Overview **blade does not time out.
- Deleting user subscriptions results in orphaned resources. As a workaround, first delete user resources or the entire resource group, and then delete user subscriptions.
- You are not able to view permissions to your subscription by using the Azure Stack portals. As a workaround, you can verify permissions by using PowerShell.
- The **Service Health** blade fails to load. When you open the Service Health blade in either the admin or user portal, Azure Stack displays an error and does not load information. This is expected behavior. Although you can select and open Service Health, this feature is not yet available but will be implemented in a future version of Azure Stack.
#### Marketplace
- Some marketplace items are being removed in this release due to compatibility concerns. These will be re-enabled after further validation.
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
- Azure Stack operators may be unable to deploy, delete, modify VNETs or Network Security Groups. This issue is primarily seen on subsequent update attempts of the same package. This is caused by a packaging issue with an update which is currently under investigation.
- Internal Load Balancing (ILB) improperly handles MAC addresses for back-end VMs which drop packets to the back-end network when using Linux instances.
 
#### SQL/MySQL 
- It can take up to an hour before tenants can create databases in a new SQL or MySQL SKU. 
- Creation of items directly on SQL and MySQL hosting servers that are not performed by the resource provider is not supported and may result in a mismatched state.

#### App Service
- A user must register the storage resource provider before they create their first Azure Function in the subscription.
 
#### Usage  
- Usage Public IP address usage meter data shows the same *EventDateTime* value for each record instead of the *TimeDate* stamp that shows when the record was created. Currently, you can’t use this data to perform accurate accounting of public IP address usage.

#### Identity

In Azure Active Directory Federation Services (ADFS) deployed environments, the **azurestack\azurestackadmin** account is no longer the owner of the Default Provider Subscription. Instead of logging into the **Admin portal / adminmanagement endpoint** with the **azurestack\azurestackadmin**, you can use the **azurestack\cloudadmin** account, so that you can manage and use the Default Provider Subscription.

> [!IMPORTANT]
> Even the **azurestack\cloudadmin** account is the owner of the Default Provider Subscription in ADFS deployed environments, it does not have permissions to RDP into the host. Continue to use the **azurestack\azurestackadmin** account or the local administrator account to login, access and manage the host as needed.


