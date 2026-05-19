---
title: Use Azure Firewall to protect Azure Virtual Desktop
description: Learn how to use Azure Firewall to protect Azure Virtual Desktop deployments.
author: duongau
ms.service: azure-firewall
services: firewall
ms.topic: how-to
ms.date: 03/26/2026
ms.author: duau
# Customer intent: As an IT administrator, I want to configure Azure Firewall for Azure Virtual Desktop, so that I can securely manage outbound access and enhance the protection of my virtual desktop environment.
---

# Use Azure Firewall to protect Azure Virtual Desktop deployments

Azure Virtual Desktop is a cloud virtual desktop infrastructure (VDI) service that runs on Azure. When an end user connects to Azure Virtual Desktop, their session comes from a session host in a host pool. A host pool is a collection of Azure virtual machines that register to Azure Virtual Desktop as session hosts. These virtual machines run in your virtual network and are subject to the virtual network security controls. They need outbound internet access to the Azure Virtual Desktop service to operate properly and might also need outbound internet access for end users. Azure Firewall can help you lock down your environment and filter outbound traffic.

:::image type="content" source="media/protect-windows-virtual-desktop/windows-virtual-desktop-architecture-diagram.png" alt-text="A diagram showing the architecture of Azure Firewall with Azure Virtual Desktop." lightbox="media/protect-windows-virtual-desktop/windows-virtual-desktop-architecture-diagram.png":::

Follow the guidelines in this article to provide extra protection for your Azure Virtual Desktop host pool by using Azure Firewall.

## Prerequisites

 - A deployed Azure Virtual Desktop environment and host pool. For more information, see [Deploy Azure Virtual Desktop](/azure/virtual-desktop/deploy-azure-virtual-desktop).
 - An Azure Firewall deployed with at least one Firewall Manager Policy.
 - DNS and DNS Proxy enabled in the Firewall Policy to use [FQDN in Network Rules](../firewall/fqdn-filtering-network-rules.md).

To learn more about Azure Virtual Desktop terminology, see [Azure Virtual Desktop terminology](/azure/virtual-desktop/terminology).

> [!WARNING]
> Azure Virtual Desktop disconnections can occur during Azure Firewall scale-ins if you route all traffic to the Azure Firewall by using a default route. To avoid these disconnections, make sure you have direct access to the gateway and broker for Azure Virtual Desktop. Use one of the following options based on your deployment:
> - **Hub-and-spoke**: Add a route to the route table applied to the Azure Virtual Desktop subnet with the *destination type* set to **Service tag**, the *destination service* set to **WindowsVirtualDesktop**, and the *next hop* set to **Internet**.
> - **Azure Virtual WAN**: Add a route to the route table applied to the subnet (spoke virtual network) that hosts the Azure Virtual Desktop workloads with the *destination type* set to **Service tag**, the *destination service* set to **WindowsVirtualDesktop**, and the *next hop* set to **Internet**.

## Host pool outbound access to Azure Virtual Desktop

The Azure virtual machines you create for Azure Virtual Desktop must have access to several fully qualified domain names (FQDNs) to function properly. Azure Firewall uses the Azure Virtual Desktop FQDN tag `WindowsVirtualDesktop` to simplify this configuration. You need to create an Azure Firewall Policy and create rule collections for network rules and application rules. Give the rule collection a priority and an *allow* or *deny* action.

You need to create rules for each of the required FQDNs and endpoints. The list is available at [Required FQDNs and endpoints for Azure Virtual Desktop](/azure/virtual-desktop/required-fqdn-endpoint). To identify a specific host pool as *Source*, you can create an [IP Group](../firewall/ip-groups.md) with each session host to represent it. 

> [!IMPORTANT]
> Don't use TLS inspection with Azure Virtual Desktop. For more information, see the [proxy server guidelines](/azure/virtual-desktop/proxy-server-support#dont-use-ssl-termination-on-the-proxy-server).

## Azure Firewall Policy sample

You can deploy all the mandatory and optional rules mentioned previously in a single Azure Firewall Policy by using the template published at [AzureFirewallPolicyForAVD](https://github.com/Azure/RDS-Templates/tree/master/AzureFirewallPolicyForAVD).
Before deploying into production, review all the network and application rules defined to ensure alignment with Azure Virtual Desktop official documentation and security requirements. 

## Host pool outbound access to the internet

Depending on your organization's needs, you might want to enable secure outbound internet access for your end users. If the list of allowed destinations is well-defined (for example, for [Microsoft 365 access](/microsoft-365/enterprise/microsoft-365-ip-web-service)), use Azure Firewall application and network rules to configure the required access. This configuration routes end-user traffic directly to the internet for best performance. If you need to allow network connectivity for Windows 365 or Intune, see [Network requirements for Windows 365](/windows-365/enterprise/requirements-network#allow-network-connectivity) and [Network endpoints for Intune](/mem/intune/fundamentals/intune-endpoints).

If you want to filter outbound user internet traffic by using an existing on-premises secure web gateway, you can configure web browsers or other applications running on the Azure Virtual Desktop host pool with an explicit proxy configuration. For example, see [How to use Microsoft Edge command-line options to configure proxy settings](/deployedge/edge-learnmore-cmdline-options-proxy-settings). These proxy settings only influence your end-user internet access, allowing the Azure Virtual Desktop platform outbound traffic directly via Azure Firewall.

## Control user access to the web

Admins can allow or deny user access to different website categories. Add a rule to your Application Collection from your specific IP address to web categories you want to allow or deny. Review all the [web categories](web-categories.md).

## Next step

- To learn more about Azure Virtual Desktop, see [What is Azure Virtual Desktop?](/azure/virtual-desktop/overview)
