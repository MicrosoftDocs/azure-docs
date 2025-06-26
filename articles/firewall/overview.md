---
title: What is Azure Firewall?
description: Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources.
author: duongau
ms.author: duau
ms.service: azure-firewall
services: firewall
ms.topic: overview
ms.custom: mvc, references_regions
ms.date: 03/17/2025
# Customer intent: As an administrator, I want to evaluate Azure Firewall so I can determine if I want to use it.
---

# What is Azure Firewall?

Azure Firewall is a cloud-native, intelligent network firewall security service that offers top-tier threat protection for your Azure cloud workloads. It is a fully stateful firewall as a service, featuring built-in high availability and unlimited cloud scalability. Azure Firewall inspects both east-west and north-south traffic. To understand these traffic types, see [east-west and north-south traffic](/azure/well-architected/security/networking#scope-of-influence).

Azure Firewall is available in three SKUs: Basic, Standard, and Premium.

> [!NOTE]
> Azure Firewall is one of the services that make up the Network Security category in Azure. Other services in this category include [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md) and [Azure Web Application Firewall](../web-application-firewall/overview.md). Each service has its own unique features and use cases. For more information on this service category, see [Network Security](../networking/security/network-security.md).

## Azure Firewall Basic

Azure Firewall Basic is designed for small and medium-sized businesses (SMBs) to secure their Azure cloud environments. It provides essential protection at an affordable price.

:::image type="content" source="media/overview/firewall-basic-diagram.png" alt-text="Diagram showing Firewall Basic.":::

Key limitations of Azure Firewall Basic include:

- Supports Threat Intel *alert mode* only
- Fixed scale unit with two virtual machine backend instances
- Recommended for environments with an estimated throughput of 250 Mbps

For more information, see [Azure Firewall Basic features](basic-features.md).

## Azure Firewall Standard

Azure Firewall Standard offers L3-L7 filtering and threat intelligence feeds directly from Microsoft Cyber Security. It can alert and block traffic from/to known malicious IP addresses and domains, updated in real-time to protect against new and emerging threats.

:::image type="content" source="media/overview/firewall-standard.png" alt-text="Diagram showing Firewall Standard.":::

For more information, see [Azure Firewall Standard features](features.md).

## Azure Firewall Premium

Azure Firewall Premium provides advanced capabilities, including signature-based IDPS for rapid attack detection by identifying specific patterns. These patterns can include byte sequences in network traffic or known malicious instruction sequences used by malware. With over 67,000 signatures in more than 50 categories, updated in real-time, it protects against new and emerging exploits such as malware, phishing, coin mining, and Trojan attacks.

:::image type="content" source="media/overview/firewall-premium.png" alt-text="Diagram showing Firewall Premium.":::

For more information, see [Azure Firewall Premium features](premium-features.md).

## Feature comparison

To compare all Azure Firewall SKU features, see [Choose the right Azure Firewall SKU to meet your needs](choose-firewall-sku.md).

## Azure Firewall Manager

Azure Firewall Manager allows you to centrally manage Azure Firewalls across multiple subscriptions. It uses firewall policies to apply a common set of network and application rules and configurations to the firewalls in your tenant.

Firewall Manager supports firewalls in both virtual network and Virtual WAN (Secure Virtual Hub) environments. Secure Virtual Hubs use the Virtual WAN route automation solution to simplify routing traffic to the firewall with just a few steps.

To learn more, see [Azure Firewall Manager](../firewall-manager/overview.md).

## Pricing and SLA

For pricing details, see [Azure Firewall pricing](https://azure.microsoft.com/pricing/details/azure-firewall/).

For SLA information, see [Azure Firewall SLA](https://azure.microsoft.com/support/legal/sla/azure-firewall/).

## Supported regions

For a list of supported regions, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-firewall).

## What's new

To learn about the latest updates, see [Azure updates](https://azure.microsoft.com/updates?filters=%5B%22Azure+Firewall%22%5D).

## Known issues

For known issues, see [Azure Firewall known issues](firewall-known-issues.md).

## Next steps

- [Quickstart: Create an Azure Firewall and a firewall policy - ARM template](../firewall-manager/quick-firewall-policy.md)
- [Quickstart: Deploy Azure Firewall with Availability Zones - ARM template](deploy-template.md)
- [Tutorial: Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md)
- [Learn module: Introduction to Azure Firewall](/training/modules/introduction-azure-firewall/)
- [Learn more about Azure network security](../networking/security/index.yml)
