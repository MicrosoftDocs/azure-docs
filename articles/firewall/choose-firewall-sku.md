---
title: Choose the right Azure Firewall SKU to meet your needs
description: Quick comparison guide to help you choose between Azure Firewall Basic, Standard, and Premium SKUs based on your requirements.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 09/18/2025
ms.author: duau
# Customer intent: As a network security administrator, I want to compare Azure Firewall SKUs and use a decision framework, so that I can quickly choose the most suitable option for my organization's security and performance requirements.
---

# Choose the right Azure Firewall SKU to meet your needs

Azure Firewall offers three SKUs to meet various customer needs:

- **Azure Firewall Premium**: Ideal for securing highly sensitive applications, such as payment processing. It includes advanced threat protection features like malware and TLS inspection.
- **Azure Firewall Standard**: Suitable for customers requiring Layer 3–Layer 7 firewall capabilities with autoscaling to manage peak traffic up to 30 Gbps. It includes enterprise features like threat intelligence, DNS proxy, custom DNS, and web categories.
- **Azure Firewall Basic**: Designed for SMB customers with throughput requirements up to 250 Mbps.

For detailed information about all Azure Firewall features, see [Azure Firewall features by SKU](features-by-sku.md).

## Feature comparison

Compare the features of the three Azure Firewall versions:

| Category | Feature | Firewall Basic | Firewall Standard | Firewall Premium |
| --- | --- | --- | --- | --- |
| **L3-L7 filtering** | Application level FQDN filtering (SNI based) for HTTPS/SQL | ✓ | ✓ | ✓ |
|  | Network level FQDN filtering – all ports and protocols |  | ✓ | ✓ |
|  | Stateful firewall (5 tuple rules) | ✓ | ✓ | ✓ |
|  | Network address translation (SNAT+DNAT) | ✓ | ✓ | ✓ |
| **Reliability & performance** | Availability zones | ✓ | ✓ | ✓ |
|  | Built-in HA | ✓ | ✓ | ✓ |
|  | Cloud scalability (auto-scale as traffic grows) | Up to 250Mbps | Up to 30 Gbps | Up to 100 Gbps |
|  | Fat flow support | N/A | 1 Gbps | 10 Gbps |
| **Ease of management** | Central management via firewall manager | ✓ | ✓ | ✓ |
|  | Policy analytics (rule management over time) | ✓ | ✓ | ✓ |
| **Enterprise integration** | Full logging including SIEM integration | ✓ | ✓ | ✓ |
|  | Service tags and FQDN tags for easy policy management | ✓ | ✓ | ✓ |
|  | Easy DevOps integration using REST/PowerShell/CLI/templates/Terraform | ✓ | ✓ | ✓ |
|  | Web content filtering (web categories) |  | ✓ | ✓ |
|  | DNS proxy + custom DNS |  | ✓ | ✓ |
| **Advanced threat protection** | Threat intelligence-based filtering (known malicious IP address/domains) | Alert | ✓ | ✓ |
|  | Inbound TLS termination (TLS reverse proxy) |  |  | Using Azure Application Gateway |
|  | Outbound TLS termination (TLS forward proxy) |  |  | ✓ |
|  | Fully managed IDPS |  |  | ✓ |
|  | URL filtering (full path - including SSL termination) |  |  | ✓ |


## Flow chart

Use the following flow chart to determine the best Azure Firewall version for your needs.

<!-- Art Library Source# ConceptArt-0-000-011 -->
:::image type="content" source="media/choose-firewall-sku/firewall-sku-flow.svg" alt-text="Flow chart to help you choose a firewall version." lightbox="media/choose-firewall-sku/firewall-sku-flow.svg":::

## Next steps

- [Azure Firewall features by SKU](features-by-sku.md)
- [Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal-policy.md)