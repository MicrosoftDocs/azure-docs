---
title: 'Azure Bastion FAQ'
description: Learn about frequently asked questions for Azure Bastion.
author: cherylmc
ms.service: bastion
ms.topic: conceptual
ms.date: 04/01/2024
ms.author: cherylmc
ms.custom: references_regions
---

# Azure Bastion FAQ

## <a name="host"></a>Bastion service and deployment FAQs

### <a name="browsers"></a>Which browsers are supported?

The browser must support HTML 5. Use the Microsoft Edge browser or Google Chrome on Windows. For Apple Mac, use Google Chrome browser. Microsoft Edge Chromium is also supported on both Windows and Mac, respectively.

### <a name="pricingpage"></a>How does pricing work?

Azure Bastion pricing is a combination of hourly pricing based on SKU and instances (scale units), plus data transfer rates. Hourly pricing starts from the moment Bastion is deployed, regardless of outbound data usage. For the latest pricing information, see the [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion) page.

### <a name="ipv6"></a>Is IPv6 supported?

At this time, IPv6 isn't supported. Azure Bastion supports IPv4 only. This means that you can only assign an IPv4 public IP address to your Bastion resource, and that you can use your Bastion to connect to IPv4 target VMs. You can also use your Bastion to connect to dual-stack target VMs, but you'll only be able to send and receive IPv4 traffic via Azure Bastion.

### <a name="data"></a>Where does Azure Bastion store customer data?

Azure Bastion doesn't move or store customer data out of the region it's deployed in.

### <a name="az"></a>Does Azure Bastion support availability zones?

[!INCLUDE [Availability Zones description and supported regions](../../includes/bastion-availability-zones-description.md)]

If you aren't able to select a zone, you might have selected an Azure region that doesn't yet support availability zones.

For more information about availability zones, see [Availability Zones](../reliability/availability-zones-overview.md?tabs=azure-cli).

### <a name="vwan"></a>Does Azure Bastion support Virtual WAN?

Yes, you can use Azure Bastion for Virtual WAN deployments. However, deploying Azure Bastion within a Virtual WAN hub isn't supported. You can deploy Azure Bastion in a spoke virtual network and use the [IP-based connection](connect-ip-address.md) feature to connect to virtual machines deployed across a different virtual network via the Virtual WAN hub. If the Azure Virtual WAN hub will be integrated with Azure Firewall as a [Secured Virtual Hub](../firewall-manager/secured-virtual-hub.md), the AzureBastionSubnet must reside within a Virtual Network where the default 0.0.0.0/0 route propagation is disabled at the virtual network connection level.

### <a name="forcedtunnel"></a>Can I use Azure Bastion if I'm force-tunneling Internet traffic back to my on-premises location?

No, if you're advertising a default route (0.0.0.0/0) over ExpressRoute or VPN, and this route is being injected in to your Virtual Networks, this will break the Azure Bastion service.

Azure Bastion needs to be able to communicate with certain internal endpoints to successfully connect to target resources. Therefore, you *can* use Azure Bastion with Azure Private DNS Zones as long as the zone name you select doesn't overlap with the naming of these internal endpoints. Before you deploy your Azure Bastion resource, make sure that the host virtual network isn't linked to a private DNS zone with the following exact names:

* management.azure.com
* blob.core.windows.net
* core.windows.net
* vaultcore.windows.net
* vault.azure.net
* azure.com

You can use a private DNS zone ending with one of the names in the previous list (ex: privatelink.blob.core.windows.net).

Azure Bastion isn't supported with Azure Private DNS Zones in national clouds.

### My privatelink.azure.com can't resolve to management.privatelink.azure.com

This might be due to the private DNS zone for privatelink.azure.com linked to the Bastion virtual network causing management.azure.com CNAMEs to resolve to management.privatelink.azure.com behind the scenes. Create a CNAME record in their privatelink.azure.com zone for management.privatelink.azure.com to arm-frontdoor-prod.trafficmanager.net to enable successful DNS resolution.

### <a name="dns"></a>Does Azure Bastion support Private Link?

No, Azure Bastion doesn't currently support Azure Private Link.

### Why do I get a "Failed to add subnet" error when using "Deploy Bastion" in the portal?

At this time, for most address spaces, you must add a subnet named **AzureBastionSubnet** to your virtual network before you select **Deploy Bastion**.

### <a name="write-permissions"></a>Are special permissions required to deploy Bastion to the AzureBastionSubnet?

To deploy Bastion to the AzureBastionSubnet, write permissions are required. Example: **Microsoft.Network/virtualNetworks/write**.

### <a name="subnet"></a>Can I have an Azure Bastion subnet of size /27 or smaller (/28, /29, etc.)?

For Azure Bastion resources deployed on or after November 2, 2021, the minimum AzureBastionSubnet size is /26 or larger (/25, /24, etc.). All Azure Bastion resources deployed in subnets of size /27 before this date are unaffected by this change and will continue to work. However, we highly recommend increasing the size of any existing AzureBastionSubnet to /26 in case you choose to take advantage of [host scaling](./configure-host-scaling.md) in the future.

### <a name="subnet"></a> Can I deploy multiple Azure resources in my Azure Bastion subnet?

No. The Azure Bastion subnet (*AzureBastionSubnet*) is reserved only for the deployment of your Azure Bastion resource.

### <a name="udr"></a>Is user-defined routing (UDR) supported on an Azure Bastion subnet?

No. UDR isn't supported on an Azure Bastion subnet.

For scenarios that include both Azure Bastion and Azure Firewall/Network Virtual Appliance (NVA) in the same virtual network, you don’t need to force traffic from an Azure Bastion subnet to Azure Firewall because the communication between Azure Bastion and your VMs is private. For more information, see [Accessing VMs behind Azure Firewall with Bastion](https://azure.microsoft.com/blog/accessing-virtual-machines-behind-azure-firewall-with-azure-bastion/).

### <a name="all-skus"></a> What SKU should I use?

Azure Bastion has multiple SKUs. You should select a SKU based on your connection and feature requirements. For a full list of SKU tiers and supported connections and features, see the [Configuration settings](configuration-settings.md#skus) article.

### <a name="upgradesku"></a> Can I upgrade a SKU?

Yes. For steps, see [Upgrade a SKU](upgrade-sku.md). For more information about SKUs, see the [Configuration settings](configuration-settings.md#skus) article.

### <a name="downgradesku"></a> Can I downgrade a SKU?

No. Downgrading a SKU isn't supported. For more information about SKUs, see the [Configuration settings](configuration-settings.md#skus) article.

### <a name="virtual-desktop"></a>Does Bastion support connectivity to Azure Virtual Desktop?

No, Bastion connectivity to Azure Virtual Desktop isn't supported.

### <a name="udr"></a>How do I handle deployment failures?

Review any error messages and [raise a support request in the Azure portal](../azure-portal/supportability/how-to-create-azure-support-request.md) as needed. Deployment failures can result from [Azure subscription limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md). Specifically, customers might encounter a limit on the number of public IP addresses allowed per subscription that causes the Azure Bastion deployment to fail.

### <a name="dr"></a>How do I incorporate Azure Bastion in my Disaster Recovery plan?

Azure Bastion is deployed within virtual networks or peered virtual networks, and is associated to an Azure region. You're responsible for deploying Azure Bastion to a Disaster Recovery (DR) site virtual network. If there's an Azure region failure, perform a failover operation for your VMs to the DR region. Then, use the Azure Bastion host that's deployed in the DR region to connect to the VMs that are now deployed there.

### <a name="move-virtual-network"></a>Does Bastion support moving a VNet to another resource group?

No. If you move your virtual network to another resource group (even if it's in the same subscription), you'll need to first delete Bastion from virtual network, and then proceed to move the virtual network to the new resource group. Once the virtual network is in the new resource group, you can deploy Bastion to the virtual network.

### <a name="zone-redundant"></a>Does Bastion support zone redundancies?

Currently, by default, new Bastion deployments don't support zone redundancies. Previously deployed bastions might or might not be zone-redundant. The exceptions are Bastion deployments in Korea Central and Southeast Asia, which do support zone redundancies.

### <a name="azure-ad-guests"></a>Does Bastion support Microsoft Entra guest accounts?

Yes, [Microsoft Entra guest accounts](../active-directory/external-identities/what-is-b2b.md) can be granted access to Bastion and can connect to virtual machines. However, Microsoft Entra guest users can't connect to Azure VMs via Microsoft Entra authentication. Non-guest users are supported via Microsoft Entra authentication. For more information about Microsoft Entra authentication for Azure VMs (for non-guest users), see [Log in to a Windows virtual machine in Azure by using Microsoft Entra ID](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md).

### <a name="shareable-links-domains"></a>Are custom domains supported with Bastion shareable links?

No, custom domains aren't supported with Bastion shareable links. Users receive a certificate error upon trying to add specific domains in the CN/SAN of the Bastion host certificate.

## <a name="vm"></a>VM connection and available features FAQs

### <a name="roles"></a>Are any roles required to access a virtual machine?

In order to make a connection, the following roles are required:

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).

Additionally, the user must have the rights (if required) to connect to the VM. For example, if the user is connecting to a Windows VM via RDP and isn't a member of the local Administrators group, they must be a member of the Remote Desktop Users group.

### <a name="session"></a>Why do I get "Your session has expired" error message before the Bastion session starts?

If you go to the URL directly from another browser session or tab, this error is expected. It helps ensure that your session is more secure and that the session can be accessed only through the Azure portal. Sign in to the Azure portal and begin your session again.

### <a name="publicip"></a>Do I need a public IP on my virtual machine to connect via Azure Bastion?

No. When you connect to a VM using Azure Bastion, you don't need a public IP on the Azure virtual machine that you're connecting to. The Bastion service opens the RDP/SSH session/connection to your virtual machine over the private IP of your virtual machine, within your virtual network.

### <a name="rdpssh"></a>Do I need an RDP or SSH client?

No. You can access your virtual machine from the Azure portal using your browser. For available connections and methods, see [About VM connections and features](vm-about.md).

### <a name="rdpusers"></a>Do users need specific rights on a target VM for RDP connections?

[!INCLUDE [Remote Desktop Users](../../includes/bastion-remote-desktop-users.md)]

### <a name="native-client"></a>Can I connect to my VM using a native client?

Yes. You can connect to a VM from your local computer using a native client. See [Connect to a VM using a native client](native-client.md).

### <a name="agent"></a>Do I need an agent running in the Azure virtual machine?

No. You don't need to install an agent or any software on your browser or your Azure virtual machine. The Bastion service is agentless and doesn't require any additional software for RDP/SSH.

### <a name="rdpfeaturesupport"></a>What features are supported for VM sessions?

See [About VM connections and features](vm-about.md) for supported features.

### <a name="shareable-links-passwords"></a>Is Reset Password available for local users connecting via shareable link?

No. Some organizations have company policies that require a password reset when a user logs into a local account for the first time. When using shareable links, the user can't change the password, even though a "Reset Password" button might appear.

### <a name="audio"></a>Is remote audio available for VMs?

Yes. See [About VM connections and features](vm-about.md#audio).

### <a name="file-transfer"></a>Does Azure Bastion support file transfer?

Azure Bastion offers support for file transfer between your target VM and local computer using Bastion and a native RDP or SSH client. At this time, you can’t upload or download files using PowerShell or via the Azure portal. For more information, see [Upload and download files using the native client](vm-upload-download-native.md).

### <a name="aadj"></a>Does Bastion hardening work with AADJ VM extension-joined VMs?

This feature doesn't work with AADJ VM extension-joined machines using Microsoft Entra users. For more information, see [Sign in to a Windows virtual machine in Azure by using Microsoft Entra ID](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#requirements).

### <a name="rdscal-compatibility"></a>Is Bastion compatible with VMs set up as RDS session hosts?

Bastion doesn't support connecting to a VM that is set up as an RDS session host.

### <a name="keyboard"></a>Which keyboard layouts are supported during the Bastion remote session?

Azure Bastion currently supports the following keyboard layouts inside the VM:

* en-us-qwerty
* en-gb-qwerty
* de-ch-qwertz
* de-de-qwertz
* fr-be-azerty
* fr-fr-azerty
* fr-ch-qwertz
* hu-hu-qwertz
* it-it-qwerty
* ja-jp-qwerty
* pt-br-qwerty
* es-es-qwerty
* es-latam-qwerty
* sv-se-qwerty
* tr-tr-qwerty

To establish the correct key mappings for your target language, you must set the keyboard layout on your local computer to your target language *and* the keyboard layout inside the target VM to your target language. Both keyboards must be set to your target language to establish the correct key mappings inside the target VM. 

To set your target language as your keyboard layout on a Windows workstation, navigate to Settings > Time & Language > Language & Region. Under "Preferred languages," select "Add a language" and add your target language. You'll then be able to see your keyboard layouts on your toolbar. To set English (United States) as your keyboard layout, select "ENG" on your toolbar or click Windows + Spacebar to open keyboard layouts.

### <a name="shortcut"></a>Is there a keyboard solution to toggle focus between a VM and browser?

Users can use "Ctrl+Shift+Alt" to effectively switch focus between the VM and the browser.

### <a name="keyboard-focus"></a>How do I take back keyboard or mouse focus from an instance?

Click the Windows key twice in a row to take back focus within the Bastion window.

### <a name="res"></a>What is the maximum screen resolution supported via Bastion?

Currently, 1920x1080 (1080p) is the maximum supported resolution.

### <a name="timezone"></a>Does Azure Bastion support timezone configuration or timezone redirection for target VMs?

Azure Bastion currently doesn't support timezone redirection and isn't timezone configurable. Timezone settings for a VM can be manually updated after successfully connecting to the Guest OS.

### <a name="disconnect"></a>Will an existing session disconnect during maintenance on the Bastion host?

Yes, existing sessions on the target Bastion resource will disconnect during maintenance on the Bastion resource.

### I'm connecting to a VM using a JIT policy, do I need additional permissions?

If user is connecting to a VM using a JIT policy, there are no additional permissions needed. For more information on connecting to a VM using a JIT policy, see [Enable just-in-time access on VMs](../defender-for-cloud/just-in-time-access-usage.yml).

## <a name="peering"></a>VNet peering FAQs

### Can I still deploy multiple Bastion hosts across peered virtual networks?

Yes. By default, a user sees the Bastion host that is deployed in the same virtual network in which VM resides. However, in the **Connect** menu, a user can see multiple Bastion hosts detected across peered networks. They can select the Bastion host that they prefer to use to connect to the VM deployed in the virtual network.

### If my peered VNets are deployed in different subscriptions, will connectivity via Bastion work?

Yes, connectivity via Bastion will continue to work for peered virtual networks across different subscription for a single Tenant. Subscriptions across two different Tenants aren't supported. To see Bastion in the **Connect** drop down menu, the user must select the subs they have access to in **Subscription > global subscription**.

:::image type="content" source="./media/bastion-faq/global-subscriptions.png" alt-text="Global subscriptions filter." lightbox="./media/bastion-faq/global-subscriptions.png":::

### I have access to the peered VNet, but I can't see the VM deployed there.

Make sure the user has **read** access to both the VM, and the peered virtual network. Additionally, check under IAM that the user has **read** access to following resources:

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader role on the virtual network (Not needed if there isn't a peered virtual network).

|Permissions|Description|Permission type|
|---|---| ---|
|Microsoft.Network/bastionHosts/read |Gets a Bastion Host|Action|
|Microsoft.Network/virtualNetworks/BastionHosts/action |Gets Bastion Host references in a virtual network.|Action|
|Microsoft.Network/virtualNetworks/bastionHosts/default/action|Gets Bastion Host references in a virtual network.|Action|
|Microsoft.Network/networkInterfaces/read|Gets a network interface definition.|Action|
|Microsoft.Network/networkInterfaces/ipconfigurations/read|Gets a network interface IP configuration definition.|Action|
|Microsoft.Network/virtualNetworks/read|Get the virtual network definition|Action|
|Microsoft.Network/virtualNetworks/subnets/virtualMachines/read|Gets references to all the virtual machines in a virtual network subnet|Action|
|Microsoft.Network/virtualNetworks/virtualMachines/read|Gets references to all the virtual machines in a virtual network|Action|

## Next steps

For more information, see [What is Azure Bastion](bastion-overview.md).
