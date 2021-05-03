---
 title: include file
 description: include file
 services: bastion
 author: cherylmc
 ms.service: bastion
 ms.topic: include
 ms.date: 02/05/2021
 ms.author: cherylmc
 ms.custom: include file
---

### <a name="publicip"></a>Do I need a public IP on my virtual machine to connect via Azure Bastion?

No. When you connect to a VM using Azure Bastion, you don't need a public IP on the Azure virtual machine that you are connecting to. The Bastion service will open the RDP/SSH session/connection to your virtual machine over the private IP of your virtual machine, within your virtual network.

### Is IPv6 supported?

At this time, IPv6 is not supported. Azure Bastion supports IPv4 only.

### Can I use Azure Bastion with Azure Private DNS Zones?

The use of Azure Bastion with Azure Private DNS Zones is not supported at this time. Before you deploy your Azure Bastion resource, please make sure that the host virtual network is not linked to a private DNS zone.

### <a name="rdpssh"></a>Do I need an RDP or SSH client?

No. You don't need an RDP or SSH client to access the RDP/SSH to your Azure virtual machine in your Azure portal. Use the [Azure portal](https://portal.azure.com) to let you get RDP/SSH access to your virtual machine directly in the browser.

### <a name="agent"></a>Do I need an agent running in the Azure virtual machine?

No. You don't need to install an agent or any software on your browser or your Azure virtual machine. The Bastion service is agentless and doesn't require any additional software for RDP/SSH.

### <a name="limits"></a>How many concurrent RDP and SSH sessions does each Azure Bastion support?

Both RDP and SSH are a usage-based protocol. High usage of sessions will cause the bastion host to support a lower total number of sessions. The numbers below assume normal day-to-day workflows.

[!INCLUDE [limits](bastion-limits.md)]

### <a name="rdpfeaturesupport"></a>What features are supported in an RDP session?

At this time, only text copy/paste is supported. Features, such as file copy, are not supported. Feel free to share your feedback about new features on the [Azure Bastion Feedback page](https://feedback.azure.com/forums/217313-networking?category_id=367303).

### <a name="aadj"></a>Does Bastion hardening work with AADJ VM extension-joined VMs?

This feature doesn't work with AADJ VM extension-joined machines using Azure AD users. For more information, see [Windows Azure VMs and Azure AD](../articles/active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#requirements).

### <a name="browsers"></a>Which browsers are supported?

The browser must support HTML 5. Use the Microsoft Edge browser or Google Chrome on Windows. For Apple Mac, use Google Chrome browser. Microsoft Edge Chromium is also supported on both Windows and Mac, respectively.

### <a name="data"></a>Where does Azure Bastion store customer data?

Azure Bastion doesn't move or store customer data out of the region it is deployed in.

### <a name="roles"></a>Are any roles required to access a virtual machine?

In order to make a connection, the following roles are required:

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine
* Reader role on the Azure Bastion resource

### <a name="pricingpage"></a>What is the pricing?

For more information, see the [pricing page](https://aka.ms/BastionHostPricing).

### <a name="rdscal"></a>Does Azure Bastion require an RDS CAL for administrative purposes on Azure-hosted VMs?

No, access to Windows Server VMs by Azure Bastion does not require an [RDS CAL](https://www.microsoft.com/p/windows-server-remote-desktop-services-cal/dg7gmgf0dvsv?activetab=pivot:overviewtab) when used solely for administrative purposes.

### <a name="keyboard"></a>Which keyboard layouts are supported during the Bastion remote session?

Azure Bastion currently supports en-us-qwerty keyboard layout inside the VM.  Support for other locales for keyboard layout is work in progress.

### <a name="udr"></a>Is user-defined routing (UDR) supported on an Azure Bastion subnet?

No. UDR is not supported on an Azure Bastion subnet.

For scenarios that include both Azure Bastion and Azure Firewall/Network Virtual Appliance (NVA) in the same virtual network, you don’t need to force traffic from an Azure Bastion subnet to Azure Firewall because the communication between Azure Bastion and your VMs is private. For more information, see [Accessing VMs behind Azure Firewall with Bastion](https://azure.microsoft.com/blog/accessing-virtual-machines-behind-azure-firewall-with-azure-bastion/).

### <a name="session"></a>Why do I get "Your session has expired" error message before the Bastion session starts?

A session should be initiated only from the Azure portal. Sign in to the Azure portal and begin your session again. If you go to the URL directly from another browser session or tab, this error is expected. It helps ensure that your session is more secure and that the session can be accessed only through the Azure portal.

### <a name="udr"></a>How do I handle deployment failures?

Review any error messages and [raise a support request in the Azure portal](../articles/azure-portal/supportability/how-to-create-azure-support-request.md) as needed. Deployment failures may result from [Azure subscription limits, quotas, and constraints](../articles/azure-resource-manager/management/azure-subscription-service-limits.md). Specifically, customers may encounter a limit on the number of public IP addresses allowed per subscription that causes the Azure Bastion deployment to fail.

### <a name="dr"></a>How do I incorporate Azure Bastion in my Disaster Recovery plan?

Azure Bastion is deployed within VNets or peered VNets, and is associated to an Azure region. You are responsible for deploying Azure Bastion to a Disaster Recovery (DR) site VNet. In the event of an Azure region failure, perform a failover operation for your VMs to the DR region. Then, use the Azure Bastion host that's deployed in the DR region to connect to the VMs that are now deployed there.
