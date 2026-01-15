---
title: What is Azure Bastion?
description: Azure Bastion is a fully managed service that provides secure and seamless RDP/SSH connectivity to virtual machines without exposing RDP/SSH ports externally.
author: abell
ms.author: abell
ms.service: azure-bastion
services: bastion
ms.topic: overview
ms.custom: mvc, references_regions, ignite-2024
ms.date: 01/14/2026
# Customer intent: As an administrator, I want to evaluate Azure Bastion so I can determine if I want to use it.
---

# What is Azure Bastion?

Azure Bastion is a fully managed PaaS service that provides secure and seamless RDP/SSH connectivity to your virtual machines directly over TLS from the Azure portal, or via the native SSH or RDP client already installed on your local computer. Azure Bastion is deployed directly in your virtual network and supports all VMs in the virtual network using private IP addresses. When you connect via Azure Bastion, your virtual machines don't need a public IP address, agent, or special client software.

Azure Bastion is available in four SKUs: Developer, Basic, Standard, and Premium.

> [!NOTE]
> Azure Bastion is one of the services that make up the Network Security category in Azure. Other services in this category include [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md), [Azure Firewall](../firewall/overview.md), and [Azure Web Application Firewall](../web-application-firewall/overview.md). Each service has its own unique features and use cases. For more information on this service category, see [Network Security](../networking/security/network-security.md).

## Key benefits

Azure Bastion provides the following benefits:

* **Secure connectivity over TLS**: Connect to VMs using RDP/SSH over TLS on port 443. Learn more about [connection methods](vm-about.md) and [Kerberos authentication](kerberos-authentication-portal.md).
* **Protection from external threats**: Your VMs are protected from port scanning. Deploy with [availability zones](configuration-settings.md#az) for additional resilience.
* **Scalability and flexibility**: Configure [host scaling](configuration-settings.md#instance), use [shareable links](shareable-link.md), and connect via [IP address](connect-ip-address.md).
* **Reduced management overhead**: Deploy once and use [virtual network peering](vnet-peering.md) to serve multiple networks.
* **Compliance and audit**: Use [session recording](session-recording.md) for compliance requirements (Premium SKU).

## <a name="sku"></a>SKUs

Azure Bastion offers four SKU tiers:

* **Premium**: Includes all Standard features plus session recording for compliance and private-only deployment.
* **Standard**: Includes all Basic features plus scalability and advanced features (native client, shareable links, IP-based connections, custom ports, file transfer).
* **Basic**: Dedicated deployment with fixed capacity for production environments with moderate connection requirements.
* **Developer**: Free tier using shared infrastructure recommended for development and testing. Supports one VM at a time. Available in select regions.

For a complete feature comparison and capacity details, see [Choose the right Azure Bastion SKU](bastion-sku-comparison.md).

## <a name="architecture"></a>Architecture

Azure Bastion offers three deployment architectures:

**Private-only deployment**: Premium SKU without public IP address for enhanced security.

:::image type="content" source="media/private-only-deployment/private-only-architecture.png" alt-text="Diagram showing Azure Bastion private-only architecture." lightbox="media/private-only-deployment/private-only-architecture.png":::

For detailed information about each architecture, deployment requirements, and network topology options, see [Bastion design and architecture](design-architecture.md).

**Dedicated deployment**: Basic, Standard, and Premium SKUs deployed to your virtual network.

:::image type="content" source="media/bastion-overview/architecture.png" alt-text="Diagram showing Azure Bastion architecture." lightbox="media/bastion-overview/architecture.png":::

**Developer**: Shared infrastructure for development and testing environments.

:::image type="content" source="media/quickstart-developer/bastion-shared-pool.png" alt-text="Architecture diagram illustrating Azure Bastion Developer deployment using shared infrastructure.":::

## Requirements

Deployment requirements vary by SKU. Developer uses shared infrastructure with no virtual network required. Basic, Standard, and Premium require a dedicated subnet (AzureBastionSubnet) and public IP address. Premium supports private-only deployment without a public IP.

For complete requirements including subnet sizing and NSG rules, see [About Bastion configuration settings](configuration-settings.md).

## Connection methods

Azure Bastion supports multiple connection methods:

* **Browser-based connections**: Connect through the Azure portal using an HTML5 web client. Available for all SKU tiers. No additional client software required.
* **Native client connections**: Connect using the SSH or RDP client already installed on your local computer. Available for Standard and Premium SKUs. Supports Microsoft Entra ID authentication and file transfer.
* **Shareable links**: Create shareable links that allow users to connect to VMs without accessing the Azure portal. Available for Standard and Premium SKUs.

For more information about connection methods and authentication options, see [About VM connections and features](vm-about.md).


## What's new

Azure Bastion is continuously updated with new features and improvements. To learn about the latest updates and announcements, see [What's new in Azure Bastion?](whats-new.md).

## Troubleshooting and FAQ

For information about troubleshooting and frequently asked questions, see the [troubleshooting guide](troubleshoot.md) and [Azure Bastion FAQ](bastion-faq.md).

## Next steps

* [Quickstart: Deploy Bastion automatically with default settings and Standard SKU](quickstart-host-portal.md)
* [Quickstart: Deploy Bastion Developer](quickstart-developer.md)
* [Tutorial: Deploy Bastion using specified settings and SKUs](tutorial-create-host-portal.md)
* [Choose the right Azure Bastion SKU](bastion-sku-comparison.md)
* [About Bastion configuration settings](configuration-settings.md)
* [Azure Bastion FAQ](bastion-faq.md)
* [Learn module: Introduction to Azure Bastion](/training/modules/intro-to-azure-bastion/)
