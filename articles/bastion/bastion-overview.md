---
title: 'About Azure Bastion'
description: Learn about Azure Bastion, which provides secure and seamless RDP/SSH connectivity to your virtual machines without exposing RDP/SSH ports externally.
author: cherylmc
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure Bastion so that I can securely connect to my Azure virtual machines.
ms.service: bastion
ms.topic: overview
ms.date: 04/30/2024
ms.author: cherylmc
---
# What is Azure Bastion?

Azure Bastion is a fully managed PaaS service that you provision to securely connect to virtual machines via private IP address. It provides secure and seamless RDP/SSH connectivity to your virtual machines directly over TLS from the Azure portal, or via the native SSH or RDP client already installed on your local computer. When you connect via Azure Bastion, your virtual machines don't need a public IP address, agent, or special client software.

Bastion provides secure RDP and SSH connectivity to all of the VMs in the virtual network for which it's provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH.

## <a name="key"></a>Key benefits

|Benefit    |Description|
|-----------|-----------|
|RDP and SSH through the Azure portal|You can get to the RDP and SSH session directly in the Azure portal using a single-click seamless experience.|
|Remote Session over TLS and firewall traversal for RDP/SSH|Azure Bastion uses an HTML5 based web client that is automatically streamed to your local device. Your RDP/SSH session is over TLS on port 443. This enables the traffic to traverse firewalls more securely. Bastion supports TLS 1.2. Older TLS versions aren't supported.|
|No Public IP address required on the Azure VM| Azure Bastion opens the RDP/SSH connection to your Azure VM by using the private IP address on your VM. You don't need a public IP address on your virtual machine.|
|No hassle of managing Network Security Groups (NSGs)| You don't need to apply any NSGs to the Azure Bastion subnet. Because Azure Bastion connects to your virtual machines over private IP, you can configure your NSGs to allow RDP/SSH from Azure Bastion only. This removes the hassle of managing NSGs each time you need to securely connect to your virtual machines. For more information about NSGs, see [Network Security Groups](../virtual-network/network-security-groups-overview.md#security-rules).|
|No need to manage a separate bastion host on a VM |Azure Bastion is a fully managed platform PaaS service from Azure that is hardened internally to provide you secure RDP/SSH connectivity.|
|Protection against port scanning|Your VMs are protected against port scanning by rogue and malicious users because you don't need to expose the VMs to the internet.|
|Hardening in one place only|Azure Bastion sits at the perimeter of your virtual network, so you don’t need to worry about hardening each of the VMs in your virtual network.|
|Protection against zero-day exploits |The Azure platform protects against zero-day exploits by keeping the Azure Bastion hardened and always up to date for you.|

## <a name="sku"></a>SKUs

Azure Bastion offers multiple SKU tiers. The following table shows features and corresponding SKUs. For more information about SKUs, see the [Configuration settings](configuration-settings.md#skus) article.

[!INCLUDE [Azure Bastion SKUs](../../includes/bastion-sku.md)]

## <a name="architecture"></a>Architecture

Azure Bastion offers multiple deployment architectures, depending on the selected SKU and option configurations. For most SKUs, Bastion is deployed to a virtual network and supports virtual network peering. Specifically, Azure Bastion manages RDP/SSH connectivity to VMs created in the local or peered virtual networks.

RDP and SSH are some of the fundamental means through which you can connect to your workloads running in Azure. Exposing RDP/SSH ports over the Internet isn't desired and is seen as a significant threat surface. This is often due to protocol vulnerabilities. To contain this threat surface, you can deploy bastion hosts (also known as jump-servers) at the public side of your perimeter network. Bastion host servers are designed and configured to withstand attacks. Bastion servers also provide RDP and SSH connectivity to the workloads sitting behind the bastion, as well as further inside the network.

The SKU you select when you deploy Bastion determines the architecture and the available features. You can upgrade to a higher SKU to support more features, but you can't downgrade a SKU after deploying. Certain architectures, such as Private-only and Developer SKU, must be configured at the time of deployment. For more information about each architecture, see [Bastion design and architecture](design-architecture.md).

The following diagrams show the available architectures for Azure Bastion.

**Basic SKU and higher**

:::image type="content" source="./media/bastion-overview/architecture.png" alt-text="Diagram showing Azure Bastion architecture." lightbox="./media/bastion-overview/architecture.png":::

**Developer SKU**

:::image type="content" source="./media/quickstart-developer-sku/bastion-shared-pool.png" alt-text="Diagram that shows the Azure Bastion developer SKU architecture." lightbox="./media/quickstart-developer-sku/bastion-shared-pool.png":::

**Private-only deployment (Preview)**

:::image type="content" source="./media/private-only-deployment/private-only-architecture.png" alt-text="Diagram showing Azure Bastion private-only architecture." lightbox="./media/private-only-deployment/private-only-architecture.png":::

## Availability zones

[!INCLUDE [Availability Zones description and supported regions](../../includes/bastion-availability-zones-description.md)]

## <a name="host-scaling"></a>Host scaling

Azure Bastion supports manual host scaling. You can configure the number of host **instances** (scale units) in order to manage the number of concurrent RDP/SSH connections that Azure Bastion can support. Increasing the number of host instances lets Azure Bastion manage more concurrent sessions. Decreasing the number of instances decreases the number of concurrent supported sessions. Azure Bastion supports up to 50 host instances. This feature is available for Standard SKU and higher.

For more information, see the [Configuration settings](configuration-settings.md#instance) article.

## <a name="pricing"></a>Pricing

Azure Bastion pricing is a combination of hourly pricing based on SKU and instances (scale units), plus data transfer rates. Hourly pricing starts from the moment Bastion is deployed, regardless of outbound data usage. For the latest pricing information, see the [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion) page.

## <a name="new"></a>What's new?

Subscribe to the RSS feed and view the latest Azure Bastion feature updates on the [Azure Updates](https://azure.microsoft.com/updates/?category=networking&query=Azure%20Bastion) page.

## Bastion FAQ

For frequently asked questions, see the Bastion [FAQ](bastion-faq.md).

## Next steps

* [Quickstart: Deploy Bastion automatically - Basic SKU](quickstart-host-portal.md)
* [Quickstart: Deploy Bastion automatically - Developer SKU](quickstart-developer-sku.md)
* [Tutorial: Deploy Bastion using specified settings](tutorial-create-host-portal.md)
* [Learn module: Introduction to Azure Bastion](/training/modules/intro-to-azure-bastion/)
* Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure
* [Learn more about Azure network security](../networking/security/index.yml)
