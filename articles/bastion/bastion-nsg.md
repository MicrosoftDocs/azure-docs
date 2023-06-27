---
title: Working with VMs and NSGs in Azure Bastion
description: Learn about using network security groups with Azure Bastion.
author: cherylmc
ms.service: bastion
ms.topic: conceptual
ms.date: 06/23/2023
ms.author: cherylmc
---
# Working with NSG access and Azure Bastion

When working with Azure Bastion, you can use network security groups (NSGs). For more information, see [Security Groups](../virtual-network/network-security-groups-overview.md).

:::image type="content" source="./media/bastion-nsg/figure-1.png" alt-text="NSG":::

In this diagram:

* The Bastion host is deployed to the virtual network.
* The user connects to the Azure portal using any HTML5 browser.
* The user navigates to the Azure virtual machine to RDP/SSH.
* Connect Integration - Single-click RDP/SSH session inside the browser
* No public IP is required on the Azure VM.

## <a name="nsg"></a>Network security groups

This section shows you the network traffic between the user and Azure Bastion, and through to target VMs in your virtual network:

> [!IMPORTANT]
> If you choose to use an NSG with your Azure Bastion resource, you **must** create all of the following ingress and egress traffic rules. Omitting any of the following rules in your NSG will block your Azure Bastion resource from receiving necessary updates in the future and therefore open up your resource to future security vulnerabilities.
> 

### <a name="apply"></a>AzureBastionSubnet

Azure Bastion is deployed specifically to ***AzureBastionSubnet***.

* **Ingress Traffic:**

   * **Ingress Traffic from public internet:** The Azure Bastion will create a public IP that needs port 443 enabled on the public IP for ingress traffic. Port 3389/22 are NOT required to be opened on the AzureBastionSubnet. Note that the source can be either the Internet or a set of public IP addresses that you specify.
   * **Ingress Traffic from Azure Bastion control plane:** For control plane connectivity, enable port 443 inbound from **GatewayManager** service tag. This enables the control plane, that is, Gateway Manager to be able to talk to Azure Bastion.
   * **Ingress Traffic from Azure Bastion data plane:** For data plane communication between the underlying components of Azure Bastion, enable ports 8080, 5701 inbound from the **VirtualNetwork** service tag to the **VirtualNetwork** service tag. This enables the components of Azure Bastion to talk to each other.
   * **Ingress Traffic from Azure Load Balancer:** For health probes, enable port 443 inbound from the **AzureLoadBalancer** service tag. This enables Azure Load Balancer to detect connectivity


   :::image type="content" source="./media/bastion-nsg/inbound.png" alt-text="Screenshot shows inbound security rules for Azure Bastion connectivity." lightbox="./media/bastion-nsg/inbound.png":::

* **Egress Traffic:**

   * **Egress Traffic to target VMs:** Azure Bastion will reach the target VMs over private IP. The NSGs need to allow egress traffic to other target VM subnets for port 3389 and 22. If you are using the custom port feature as part of Standard SKU, the NSGs will instead need to allow egress traffic to other target VM subnets for the custom value(s) you have opened on your target VMs.
   * **Egress Traffic to Azure Bastion data plane:** For data plane communication between the underlying components of Azure Bastion, enable ports 8080, 5701 outbound from the **VirtualNetwork** service tag to the **VirtualNetwork** service tag. This enables the components of Azure Bastion to talk to each other.
   * **Egress Traffic to other public endpoints in Azure:** Azure Bastion needs to be able to connect to various public endpoints within Azure (for example, for storing diagnostics logs and metering logs). For this reason, Azure Bastion needs outbound to 443 to **AzureCloud** service tag.
   * **Egress Traffic to Internet:** Azure Bastion needs to be able to communicate with the Internet for session, Bastion Shareable Link, and certificate validation. For this reason, we recommend enabling port 80 outbound to the **Internet.**


   :::image type="content" source="./media/bastion-nsg/outbound.png" alt-text="Screenshot shows outbound security rules for Azure Bastion connectivity." lightbox="./media/bastion-nsg/outbound.png":::

### Target VM Subnet
This is the subnet that contains the target virtual machine that you want to RDP/SSH to.

   * **Ingress Traffic from Azure Bastion:** Azure Bastion will reach to the target VM over private IP. RDP/SSH ports (ports 3389/22 respectively, or custom port values if you are using the custom port feature as a part of Standard SKU) need to be opened on the target VM side over private IP. As a best practice, you can add the Azure Bastion Subnet IP address range in this rule to allow only Bastion to be able to open these ports on the target VMs in your target VM subnet.


## Next steps

For more information about Azure Bastion, see the [FAQ](bastion-faq.md).
