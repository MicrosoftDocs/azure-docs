---
title: 'Azure Bastion | Microsoft Docs'
description: Learn about Azure Bastion, which provides secure and seamless RDP/SSH connectivity to your virtual machines without exposing RDP/SSH ports externally.
services: bastion
author: cherylmc
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure Bastion so that I can securely connect to my Azure virtual machines.

ms.service: bastion
ms.topic: overview
ms.date: 07/12/2021
ms.author: cherylmc
ms.custom: contperf-fy2q1-portal

---
# What is Azure Bastion?

Azure Bastion is a service you deploy that lets you connect to a virtual machine using your browser and the Azure portal. The Azure Bastion service is a fully platform-managed PaaS service that you provision inside your virtual network. It provides secure and seamless RDP/SSH connectivity to your virtual machines directly from the Azure portal over TLS. When you connect via Azure Bastion, your virtual machines do not need a public IP address, agent, or special client software.

Bastion provides secure RDP and SSH connectivity to all of the VMs in the virtual network in which it is provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH.

:::image type="content" source="./media/bastion-overview/architecture.png" alt-text="Diagram showing Azure Bastion architecture.":::

## <a name="key"></a>Key benefits

* **RDP and SSH directly in Azure portal:** You can get to the RDP and SSH session directly in the Azure portal using a single click seamless experience.
* **Remote Session over TLS and firewall traversal for RDP/SSH:** Azure Bastion uses an HTML5 based web client that is automatically streamed to your local device. You get your RDP/SSH session over TLS on port 443, enabling you to traverse corporate firewalls securely.
* **No Public IP required on the Azure VM:** Azure Bastion opens the RDP/SSH connection to your Azure virtual machine using private IP on your VM. You don't need a public IP on your virtual machine.
* **No hassle of managing [network security group](../virtual-network/network-security-groups-overview.md#security-rules) NSGs:** Azure Bastion is a fully managed platform PaaS service from Azure that is hardened internally to provide you secure RDP/SSH connectivity. You don't need to apply any NSGs to the Azure Bastion subnet. Because Azure Bastion connects to your virtual machines over private IP, you can configure your NSGs to allow RDP/SSH from Azure Bastion only. This removes the hassle of managing NSGs each time you need to securely connect to your virtual machines.
* **Protection against port scanning:** Because you do not need to expose your virtual machines to the public Internet, your VMs are protected against port scanning by rogue and malicious users located outside your virtual network.
* **Protect against zero-day exploits. Hardening in one place only:** Azure Bastion is a fully platform-managed PaaS service. Because it sits at the perimeter of your virtual network, you don’t need to worry about hardening each of the virtual machines in your virtual network. The Azure platform protects against zero-day exploits by keeping the Azure Bastion hardened and always up to date for you.

## <a name="sku"></a>SKUs

Azure Bastion has two available SKUs, Basic and Standard. The Standard SKU is currently in Preview. For more information, including how to upgrade a SKU, see the [Configuration settings](configuration-settings.md#skus) article. 

The following table shows features and corresponding SKUs.

[!INCLUDE [Azure Bastion SKUs](../../includes/bastion-sku.md)]

## <a name="architecture"></a>Architecture

Azure Bastion is deployed to a virtual network and supports virtual network peering. Specifically, Azure Bastion manages RDP/SSH connectivity to VMs created in the local or peered virtual networks.

RDP and SSH are some of the fundamental means through which you can connect to your workloads running in Azure. Exposing RDP/SSH ports over the Internet isn't desired and is seen as a significant threat surface. This is often due to protocol vulnerabilities. To contain this threat surface, you can deploy bastion hosts (also known as jump-servers) at the public side of your perimeter network. Bastion host servers are designed and configured to withstand attacks. Bastion servers also provide RDP and SSH connectivity to the workloads sitting behind the bastion, as well as further inside the network.

:::image type="content" source="./media/bastion-overview/architecture.png" alt-text="Diagram showing the Azure Bastion architecture.":::

This figure shows the architecture of an Azure Bastion deployment. In this diagram:

* The Bastion host is deployed in the virtual network that contains the AzureBastionSubnet subnet that has a minimum /27 prefix.
* The user connects to the Azure portal using any HTML5 browser.
* The user selects the virtual machine to connect to.
* With a single click, the RDP/SSH session opens in the browser.
* No public IP is required on the Azure VM.

## <a name="host-scaling"></a>Host scaling

Azure Bastion supports manual host scaling. You can configure the number of host instances (scale units) in order to manage the number of concurrent RDP/SSH connections that Azure Bastion can support. Increasing the number of host instances lets Azure Bastion manage more concurrent sessions. Decreasing the number of instances decreases the number of concurrent supported sessions. Azure Bastion supports up to 50 host instances. This feature is available for the Azure Bastion Standard SKU only.

For more information, see the [Configuration settings](configuration-settings.md#instance) article.

## <a name="pricing"></a>Pricing

Azure Bastion pricing involves a combination of hourly pricing based on SKU, scale units, and data transfer rates. Pricing information can be found on the [Pricing](https://azure.microsoft.com/pricing/details/azure-bastion) page.

## <a name="new"></a>What's new?

Subscribe to the RSS feed and view the latest Azure Bastion feature updates on the [Azure Updates](https://azure.microsoft.com/updates/?category=networking&query=Azure%20Bastion) page.

## Bastion FAQ

For frequently asked questions, see the Bastion [FAQ](bastion-faq.md).

## Next steps

* [Tutorial: Create an Azure Bastion host and connect to a Windows VM](tutorial-create-host-portal.md).
* [Learn module: Introduction to Azure Bastion](/learn/modules/intro-to-azure-bastion/).
* Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
