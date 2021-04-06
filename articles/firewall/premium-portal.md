---
title: Azure Firewall Premium Preview in the Azure portal
description: Learn about Azure Firewall Premium Preview in the Azure portal.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: conceptual
ms.date: 02/16/2021
ms.author: victorh
---

# Azure Firewall Premium Preview in the Azure portal

> [!IMPORTANT]
> Azure Firewall Premium is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

 Azure Firewall Premium Preview is a next generation firewall with capabilities that are required for highly sensitive and regulated environments. It includes the following features:

- **TLS inspection** - decrypts outbound traffic, processes the data, then encrypts the data and sends it to the destination.
- **IDPS** - A network intrusion detection and prevention system (IDPS) allows you to monitor network activities for malicious activity, log information about this activity, report it, and optionally attempt to block it.
- **URL filtering** - extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.
- **Web categories** - administrators can allow or deny user access to website categories such as gambling websites, social media websites, and others.

For more information, see [Azure Firewall Premium features](premium-features.md).

## Deploy the firewall

Deploying an Azure Firewall Premium Preview is similar to deploying a standard Azure Firewall:

:::image type="content" source="media/premium-portal/premium-portal.png" alt-text="portal deployment":::

For **Firewall tier**, you select **Premium (preview)** and for **Firewall policy**, you select an existing Premium policy or create a new one.

## Configure the Premium policy

Configuring a Premium firewall policy is similar to configuring a Standard firewall policy. With a Premium policy, you can configure the Premium features:

:::image type="content" source="media/premium-portal/premium-policy.png" alt-text="Premium policy deployment":::

### Rule configuration

When you configure application rules in a Premium policy, you can configure addition Premium features:

:::image type="content" source="media/premium-portal/premium-application-rule.png" alt-text="Premium rule":::

## Next steps

To see the Azure Firewall Premium Preview features in action, see [Deploy and configure Azure Firewall Premium Preview](premium-deploy.md).