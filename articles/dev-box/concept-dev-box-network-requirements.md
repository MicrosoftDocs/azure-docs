---
title: Microsoft Dev Box Networking Requirements
description: Learn about the networking requirements for deploying dev boxes, connecting to cloud-based resources, on-premises resources, and internet resources.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
ms.topic: concept-article
ms.date: 01/15/2026
ms.custom: template-concept

#Customer intent: As a platform engineer, I want to understand Dev Box networking requirements so that developers can access the resources they need.
---

# Microsoft Dev Box networking requirements

This article describes the networking requirements for Microsoft Dev Box. Use this information to plan your network infrastructure and ensure that developers can access the resources they need from their dev boxes.

Dev boxes are cloud-based workstations that run in Azure. Users connect to dev boxes over the internet from any device and location. To support these connections, you need to configure network access according to the requirements in this article.

> [!IMPORTANT]
> Microsoft Dev Box is built on Azure Virtual Desktop and Windows 365 infrastructure. Most network requirements are identical to those services. This article covers Dev Box-specific requirements and references the comprehensive networking documentation for Azure Virtual Desktop and Windows 365. 

## Network connection options

Dev boxes require a network connection to access resources. You can choose between two connection types:

### Microsoft-hosted network connection

When you use a Microsoft-hosted connection:
- Microsoft provides and fully manages the infrastructure.
- You manage dev box security from Microsoft Intune.
- You don't need to configure an Azure virtual network.

### Azure network connection

To use your own network and provision [Microsoft Entra joined](/azure/dev-box/how-to-configure-network-connections?branch=main&tabs=AzureADJoin#review-types-of-active-directory-join) dev boxes, you must meet the following requirements:
- Azure virtual network: You must have a virtual network in your Azure subscription. The region you select for the virtual network is where Azure deploys the dev boxes. 
- A subnet within the virtual network and available IP address space.
- Network bandwidth: See [Azure's Network guidelines](/windows-server/remote/remote-desktop-services/network-guidance).

To use your own network and provision [Microsoft Entra hybrid joined](/azure/dev-box/how-to-configure-network-connections?branch=main&tabs=AzureADJoin#review-types-of-active-directory-join) dev boxes, you must meet the preceding requirements, and the following requirements:
- The Azure virtual network must resolve Domain Name Services (DNS) entries for your Active Directory Domain Services (AD DS) environment. To support this resolution, define your AD DS DNS servers as the DNS servers for the virtual network.
- The Azure virtual network must have network access to an enterprise domain controller, either in Azure or on-premises.

For DNS configuration guidance, see [DNS requirements in Windows 365 network requirements](/windows-365/enterprise/requirements-network#dns-requirements).

> [!IMPORTANT]
> When using your own network, Microsoft Dev Box currently doesn't support moving network interfaces to a different virtual network or a different subnet. 

## Required FQDNs and endpoints

Dev boxes need access to specific FQDNs and endpoints for provisioning, management, and remote connectivity. These requirements are divided into:

- **Dev Box-specific endpoints** - Required only for Dev Box service
- **Shared infrastructure endpoints** - Same as Azure Virtual Desktop and Windows 365

> [!IMPORTANT] 
> Microsoft doesn't support dev box deployments where the required FQDNs and endpoints are blocked.

### Dev Box service endpoint

The following endpoint is specific to Microsoft Dev Box:

| Category | Endpoints | Required? |
|------------------------------------|----------------------------------|-----|
| **Dev box communication endpoint** | `*.agentmanagement.dc.azure.com` | Yes |

### Shared infrastructure endpoints

Dev boxes use Azure Virtual Desktop infrastructure and require the same endpoints. For the complete list of required endpoints for Windows 365, Azure Virtual Desktop, and Microsoft Intune, follow each link in the table: [Allow network connectivity](/windows-365/enterprise/requirements-network?tabs=enterprise%2Cent#allow-network-connectivity).

### Validating endpoint access

You can validate that your dev boxes can access required endpoints by using the Azure Virtual Desktop Agent URL Tool. For instructions, see [Check access to required FQDNs and endpoints for Azure Virtual Desktop](/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint).

## Using FQDN tags and service tags

To simplify network configuration, use FQDN tags and service tags with Azure Firewall:

- **FQDN tags**: Predefined tags that represent groups of FQDNs. The **Windows365** FQDN tag includes most required endpoints for Dev Box.
- **Service tags**: Groups of IP address prefixes that are automatically updated. Use service tags like **WindowsVirtualDesktop**, **AzureActiveDirectory**, and **MicrosoftIntune** in Network Security Groups and Azure Firewall rules.

For detailed guidance on using Azure Firewall with Dev Box, see:
- [Use Azure Firewall to manage and secure Windows 365 environments](/windows-365/enterprise/azure-firewall-windows-365)
- [Use Azure Firewall to protect Azure Virtual Desktop](/azure/firewall/protect-azure-virtual-desktop)

## Network optimization and advanced scenarios

### RDP optimization

Direct connectivity to Azure Virtual Desktop RDP broker service endpoints is critical for remote performance. For guidance, see [Understanding Network Flows - Remote Desktop Protocol](/windows-365/enterprise/understanding-remote-desktop-protocol-traffic).

#### User Defined Routes (UDRs)
Use Azure Virtual Desktop service tags to configure User Defined Routes (UDRs) for optimal routing. For detailed guidance, see [Windows 365 network requirements - RDP broker service endpoints](/windows-365/enterprise/requirements-network#remote-desktop-protocol-rdp-broker-service-endpoints).

#### RDP Shortpath

RDP Shortpath provides another UDP-based connection path that can improve connectivity in suboptimal network conditions. For configuration details, see:
- [RDP Shortpath for Azure Virtual Desktop](/azure/virtual-desktop/rdp-shortpath)
- [RDP Shortpath for Windows 365](/windows-365/enterprise/rdp-shortpath-public-networks)

### Traffic interception technologies

Some enterprises use traffic interception, TLS decryption, and deep packet inspection. These technologies can cause problems with dev box provisioning and connectivity. For guidance, see [Traffic interception technologies in Windows 365 network requirements](/windows-365/enterprise/requirements-network#traffic-interception-technologies).

## Connecting to on-premises resources

You can allow dev boxes to connect to on-premises resources through a hybrid connection by using a [hub and spoke networking topology](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology). The hub connects to your on-premises network by using ExpressRoute, site-to-site VPN, or point-to-site VPN. The spoke virtual network contains the dev boxes and is peered to the hub for on-premises access.

## Dev Box-specific considerations

### Network interface limitations

When using your own network, Microsoft Dev Box currently doesn't support moving network interfaces to a different virtual network or subnet after provisioning.

### IP address planning

When you update a dev box definition image, make sure your virtual network has enough IP addresses for Azure Network Connection health checks. You need one extra IP address for each dev box, plus additional IP addresses for health checks and Dev Box infrastructure.

For more information, see [Update a dev box definition](how-to-manage-dev-box-definitions.md#update-a-dev-box-definition).

## Troubleshooting

For general Azure Virtual Desktop connectivity problems, see [Troubleshoot connections to Microsoft Entra joined VMs](/troubleshoot/azure/virtual-desktop/troubleshoot-azure-ad-connections).

For Dev Box-specific problems:

- **IPv6 addressing**: If you encounter IPv6 problems, check that the *Microsoft.AzureActiveDirectory* service endpoint isn't enabled on the virtual network or subnet, as it converts IPv4 to IPv6. See [Virtual Network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

- **Group policy problems**: In hybrid environments, test whether problems are related to group policy by temporarily excluding the dev box. See [Applying Group Policy troubleshooting guidance](/troubleshoot/windows-server/group-policy/applying-group-policy-troubleshooting-guidance).

## Related content

- [Required FQDNs and endpoints for Azure Virtual Desktop](/azure/virtual-desktop/required-fqdn-endpoint)
- [Check access to required FQDNs and endpoints for Azure Virtual Desktop](/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint)
- [Windows 365 network requirements](/windows-365/enterprise/requirements-network)
- [Understanding Azure Virtual Desktop network connectivity](/azure/virtual-desktop/network-connectivity)
- [Use Azure Firewall to protect Azure Virtual Desktop](/azure/firewall/protect-azure-virtual-desktop)
- [Use Azure Firewall to manage and secure Windows 365 environments](/windows-365/enterprise/azure-firewall-windows-365)
