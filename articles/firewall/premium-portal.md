---
title: Azure Firewall Premium in the Azure portal
description: Learn about Azure Firewall Premium in the Azure portal.
author: duongau
ms.service: azure-firewall
services: firewall
ms.topic: how-to
ms.date: 12/31/2025
ms.author: duau
ms.custom: sfi-image-nochange
# Customer intent: "As a security administrator, I want to implement Azure Firewall Premium for my organization's network, so that I can enhance our security posture with advanced features like TLS inspection, IDPS, and URL filtering for regulated environments."
---

# Azure Firewall Premium in the Azure portal

Azure Firewall Premium is an advanced firewall designed for highly sensitive and regulated environments. It offers enhanced security features, including:

- **TLS inspection**: Decrypts outbound traffic, inspects it for threats, then re-encrypts the data before sending it to its destination.
- **IDPS (Intrusion Detection and Prevention System)**: Monitors network activity for malicious behavior, logs and reports incidents, and can block threats in real time.
- **URL filtering**: Filters traffic based on the full URL path (for example, `www.contoso.com/a/c`), not just the domain name.
- **Web categories**: Lets administrators control access to websites by category, such as social media, gambling, and more.
- **Enhanced performance**: Uses a more powerful virtual machine SKU and can scale up to 100 Gbps with 10 Gbps fat flow support. The Premium SKU also complies with Payment Card Industry Data Security Standard (PCI DSS) requirements.

For more information, see [Azure Firewall Premium features](premium-features.md).

## Deploy the firewall

Deploying Azure Firewall Premium follows the same steps as deploying a standard Azure Firewall:

:::image type="content" source="media/premium-portal/premium-portal.png" alt-text="portal deployment":::

For **Firewall tier**, choose **Premium**. For **Firewall policy**, either select an existing Premium policy or create a new one.

## Configure the Premium policy

Configuring a Premium firewall policy is similar to configuring a Standard firewall policy. However, with a Premium policy, you can enable advanced features such as TLS inspection, IDPS, URL filtering, and web categories to enhance your network security.

:::image type="content" source="media/premium-portal/premium-policy.png" alt-text="Premium policy deployment":::

### Rule configuration
When configuring application rules in a Premium policy, you can enable additional Premium features, such as TLS inspection, IDPS, URL filtering, and web categories.

:::image type="content" source="media/premium-portal/premium-application-rule.png" alt-text="Premium rule":::

## Next steps

To see the Azure Firewall Premium features in action, see [Deploy and configure Azure Firewall Premium](premium-deploy.md).