---
title: Azure Bastion FAQ | Microsoft Docs
description: Learn about frequently asked questions for Azure Bastion.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 07/13/2021
ms.author: cherylmc
---
# Azure Bastion FAQ

## FAQs

### <a name="publicip"></a>Do I need a public IP on my virtual machine to connect via Azure Bastion?

No. When you connect to a VM using Azure Bastion, you don't need a public IP on the Azure virtual machine that you are connecting to. The Bastion service will open the RDP/SSH session/connection to your virtual machine over the private IP of your virtual machine, within your virtual network.

### Is IPv6 supported?

At this time, IPv6 is not supported. Azure Bastion supports IPv4 only.

### Can I use Azure Bastion with Azure Private DNS Zones?

Azure Bastion needs to be able to communicate with certain internal endpoints to successfully connect to target resources. Therefore, you *can* use Azure Bastion with Azure Private DNS Zones as long as the zone name you select does not overlap with the naming of these internal endpoints. Before you deploy your Azure Bastion resource, please make sure that the host virtual network is not linked to a private DNS zone with the following in the name:
* core.windows.net
* azure.com

Note that if you are using a Private endpoint integrated Azure Private DNS Zone, the [recommended DNS zone name](../private-link/private-endpoint-dns.md#azure-services-dns-zone-configuration) for several Azure services overlap with the names listed above. The use of Azure Bastion is *not* supported with these setups.

The use of Azure Bastion is also not supported with Azure Private DNS Zones in national clouds.

### <a name="rdpssh"></a>Do I need an RDP or SSH client?

No. You don't need an RDP or SSH client to access the RDP/SSH to your Azure virtual machine in your Azure portal. Use the [Azure portal](https://portal.azure.com) to let you get RDP/SSH access to your virtual machine directly in the browser.

### <a name="agent"></a>Do I need an agent running in the Azure virtual machine?

No. You don't need to install an agent or any software on your browser or your Azure virtual machine. The Bastion service is agentless and doesn't require any additional software for RDP/SSH.

### <a name="rdpfeaturesupport"></a>What features are supported in an RDP session?

At this time, only text copy/paste is supported. Features, such as file copy, are not supported. Feel free to share your feedback about new features on the [Azure Bastion Feedback page](https://feedback.azure.com/forums/217313-networking?category_id=367303).

### <a name="aadj"></a>Does Bastion hardening work with AADJ VM extension-joined VMs?

This feature doesn't work with AADJ VM extension-joined machines using Azure AD users. For more information, see [Windows Azure VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#requirements).

### <a name="browsers"></a>Which browsers are supported?

The browser must support HTML 5. Use the Microsoft Edge browser or Google Chrome on Windows. For Apple Mac, use Google Chrome browser. Microsoft Edge Chromium is also supported on both Windows and Mac, respectively.

### <a name="pricingpage"></a>What is the pricing?

For more information, see the [pricing page](https://aka.ms/BastionHostPricing).

### <a name="data"></a>Where does Azure Bastion store customer data?

Azure Bastion doesn't move or store customer data out of the region it is deployed in.

### <a name="roles"></a>Are any roles required to access a virtual machine?

In order to make a connection, the following roles are required:

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader Role on the Virtual Network (Not needed if there is no peered virtual network).

### <a name="rdscal"></a>Does Azure Bastion require an RDS CAL for administrative purposes on Azure-hosted VMs?

No, access to Windows Server VMs by Azure Bastion does not require an [RDS CAL](https://www.microsoft.com/p/windows-server-remote-desktop-services-cal/dg7gmgf0dvsv?activetab=pivot:overviewtab) when used solely for administrative purposes.

### <a name="keyboard"></a>Which keyboard layouts are supported during the Bastion remote session?

Azure Bastion currently supports en-us-qwerty keyboard layout inside the VM.  Support for other locales for keyboard layout is work in progress.

### <a name="timezone"></a>Does Azure Bastion support timezone configuration or timezone redirection for target VMs?

Azure Bastion currently does not support timezone redirection and is not timezone configurable.

### <a name="udr"></a>Is user-defined routing (UDR) supported on an Azure Bastion subnet?

No. UDR is not supported on an Azure Bastion subnet.

For scenarios that include both Azure Bastion and Azure Firewall/Network Virtual Appliance (NVA) in the same virtual network, you don’t need to force traffic from an Azure Bastion subnet to Azure Firewall because the communication between Azure Bastion and your VMs is private. For more information, see [Accessing VMs behind Azure Firewall with Bastion](https://azure.microsoft.com/blog/accessing-virtual-machines-behind-azure-firewall-with-azure-bastion/).

### <a name="upgradesku"></a> Can I upgrade from a Basic SKU to a Standard SKU?

Yes. For steps, see [Upgrade a SKU](upgrade-sku.md). For more information about SKUs, see the [Configuration settings](configuration-settings.md#skus) article.

### <a name="downgradesku"></a> Can I downgrade from a Standard SKU to a Basic SKU?

No. Downgrading from a Standard SKU to a Basic SKU is not supported. For more information about SKUs, see the [Configuration settings](configuration-settings.md#skus) article.

### <a name="subnet"></a> Can I deploy multiple Azure resources in my Azure Bastion subnet?

No. The Azure Bastion subnet (*AzureBastionSubnet*) is reserved only for the deployment of your Azure Bastion resource.

### <a name="session"></a>Why do I get "Your session has expired" error message before the Bastion session starts?

A session should be initiated only from the Azure portal. Sign in to the Azure portal and begin your session again. If you go to the URL directly from another browser session or tab, this error is expected. It helps ensure that your session is more secure and that the session can be accessed only through the Azure portal.

### <a name="udr"></a>How do I handle deployment failures?

Review any error messages and [raise a support request in the Azure portal](../azure-portal/supportability/how-to-create-azure-support-request.md) as needed. Deployment failures may result from [Azure subscription limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md). Specifically, customers may encounter a limit on the number of public IP addresses allowed per subscription that causes the Azure Bastion deployment to fail.

### <a name="dr"></a>How do I incorporate Azure Bastion in my Disaster Recovery plan?

Azure Bastion is deployed within VNets or peered VNets, and is associated to an Azure region. You are responsible for deploying Azure Bastion to a Disaster Recovery (DR) site VNet. In the event of an Azure region failure, perform a failover operation for your VMs to the DR region. Then, use the Azure Bastion host that's deployed in the DR region to connect to the VMs that are now deployed there.

## <a name="peering"></a>VNet peering

### Can I still deploy multiple Bastion hosts across peered virtual networks?

Yes. By default, a user sees the Bastion host that is deployed in the same virtual network in which VM resides. However, in the **Connect** menu, a user can see multiple Bastion hosts detected across peered networks. They can select the Bastion host that they prefer to use to connect to the VM deployed in the virtual network.

### If my peered VNets are deployed in different subscriptions, will connectivity via Bastion work?

Yes, connectivity via Bastion will continue to work for peered VNets across different subscription for a single Tenant. Subscriptions across two different Tenants are not supported. To see Bastion in the **Connect** drop down menu, the user must select the subs they have access to in **Subscription > global subscription**.

:::image type="content" source="./media/bastion-faq/global-subscriptions.png" alt-text="Global subscriptions filter." lightbox="./media/bastion-faq/global-subscriptions.png":::

### I have access to the peered VNet, but I can't see the VM deployed there.

Make sure the user has **read** access to both the VM, and the peered VNet. Additionally, check under IAM that the user has **read** access to following resources:

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader Role on the Virtual Network (Not needed if there is no peered virtual network).

|Permissions|Description|Permission type|
|---|---| ---|
|Microsoft.Network/bastionHosts/read |Gets a Bastion Host|Action|
|Microsoft.Network/virtualNetworks/BastionHosts/action |Gets Bastion Host references in a Virtual Network.|Action|
|Microsoft.Network/virtualNetworks/bastionHosts/default/action|Gets Bastion Host references in a Virtual Network.|Action|
|Microsoft.Network/networkInterfaces/read|Gets a network interface definition.|Action|
|Microsoft.Network/networkInterfaces/ipconfigurations/read|Gets a network interface IP configuration definition.|Action|
|Microsoft.Network/virtualNetworks/read|Get the virtual network definition|Action|
|Microsoft.Network/virtualNetworks/subnets/virtualMachines/read|Gets references to all the virtual machines in a virtual network subnet|Action|
|Microsoft.Network/virtualNetworks/virtualMachines/read|Gets references to all the virtual machines in a virtual network|Action|