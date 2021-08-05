---
title: Use Azure Firewall to protect Azure Virtual Desktop
description: Learn how to use Azure Firewall to protect Azure Virtual Desktop deployments
author: vhorne
ms.service: firewall
services: firewall
ms.topic: how-to
ms.date: 8/9/2021
ms.author: victorh
---

# Use Azure Firewall to protect Azure Virtual Desktop deployments

Azure Virtual Desktop is a desktop and app virtualization service that runs on Azure. When an end user connects to a Azure Virtual Desktop environment, their session is run by a host pool. A host pool is a collection of Azure virtual machines that register to Azure Virtual Desktop as session hosts. These virtual machines run in your virtual network and are subject to the virtual network security controls. They need outbound Internet access to the Azure Virtual Desktop service to operate properly and might also need outbound Internet access for end users. Azure Firewall can help you lock down your environment and filter outbound traffic.

[ ![Azure Virtual Desktop architecture](media/protect-windows-virtual-desktop/windows-virtual-desktop-architecture-diagram.png) ](media/protect-windows-virtual-desktop/windows-virtual-desktop-architecture-diagram.png#lightbox)

Follow the guidelines in this article to provide additional protection for your Azure Virtual Desktop host pool using Azure Firewall.

## Prerequisites


 - A deployed Azure Virtual Desktop environment and host pool.
 - An Azure Firewall deployed with at least one Firewall Manager Policy 

   For more information, see [Tutorial: Create a host pool by using the Azure Portal](../virtual-desktop/create-host-pools-azure-marketplace.md)

To learn more about Azure Virtual Desktop environments see [Azure Virtual Desktop environment](../virtual-desktop/environment-setup.md).

## Host pool outbound access to Azure Virtual Desktop

The Azure virtual machines you create for Azure Virtual Desktop must have access to several Fully Qualified Domain Names (FQDNs) to function properly. Azure Firewall provides a Azure Virtual Desktop FQDN Tag to simplify this configuration. Use the following steps to allow outbound Azure Virtual Desktop platform traffic:

You will need to create an Azure Firewall Policy and create Rule Collections for Network Rules and Applications Rules. Give the Rule Collection a priority and allow or deny action. 

### Create Network Rules

| Name | Source Type | Source | Protocol | Destination Ports | Destination Type | Destination 
--- | --- | --- | --- | --- | --- | ---
| Rule Name | IP Address | VNet or Subnet IP Address | 80 | TCP |  IP Address | 169.254.169.254, 168.63.129.16
| Rule Name | IP Address | VNet or Subnet IP Address | 443 | TCP | Service Tag | AzureCloud, WindowsVirtualDesktop
| Rule Name | IP Address | VNet or Subnet IP Address | 52 | TCP, UDP | IP Address | *


### Create Application Rules 

| Name | Source Type | Source | Protocol | TLS Inspection (optional) | Destination Type | Destination 
--- | --- | --- | --- | --- | --- | ---
| Rule Name| IP Address | VNet or Subnet IP Address | Https:443 | | FQDN Tag | WindowsVirtualDesktop, WindowsUpdate, Windows Diagnostics, MicrosoftActiveProtectionService |
| Rule Name| IP Address | VNet or Subnet IP Address | Https:1688 | | FQDN | kms.core.windows.net 

> [!NOTE]
> Some deployments may not need DNS rules, for example Azure Active Directory Domain controllers forward DNS queries to Azure DNS at 168.63.129.16.

## Host pool outbound access to the Internet

Depending on your organization needs, you may want to enable secure outbound Internet access for your end users. In cases where the list of allowed destinations is well-defined (for example, [Microsoft 365 access](/microsoft-365/enterprise/microsoft-365-ip-web-service)) you can use Azure Firewall application and network rules to configure the required access. This routes end-user traffic directly to the Internet for best performance. If you need to allow network connectivity for W365 or Intune, see [Network Requirments for W365](https://docs.microsoft.com/en-us/windows-365/requirements-network#allow-network-connectivity) and [Network Endpoints for Intune](https://docs.microsoft.com/en-us/mem/intune/fundamentals/intune-endpoints)

If you want to filter outbound user Internet traffic using an existing on-premises secure web gateway, you can configure web browsers or other applications running on the Azure Virtual Desktop host pool with an explicit proxy configuration. For example, see [How to use Microsoft Edge command-line options to configure proxy settings](/deployedge/edge-learnmore-cmdline-options-proxy-settings). These proxy settings only influence your end-user Internet access, allowing the Azure Virtual Desktop platform outbound traffic directly via Azure Firewall. 

## Control User Access to the web. 

Admins can allow or deny user access to different website categories. Add a rule to your Application Collection from your specific IP address to Web categories you want to allow or deny. Review all the [Web categories](https://docs.microsoft.com/en-us/azure/firewall/web-categories) here. 

## Additional considerations

You may need to configure additional firewall rules, depending on your requirements:

- NTP server access

   By default, virtual machines running Windows connect to time.windows.com over UDP port 123 for time synchronization. Create a network rule to allow this access, or for a time server that you use in your environment.

## Next steps

- Learn more about Azure Virtual Desktop: [What is Azure Virtual Desktop?](../virtual-desktop/overview.md)
