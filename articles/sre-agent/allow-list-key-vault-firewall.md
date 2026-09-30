---
title: Allow List Outbound IPs for Key Vault in Azure SRE Agent
description: Learn how to allow list your agent's outbound IP addresses in your Azure Key Vault firewall so certificate-based connectors can retrieve certificates successfully.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
---

# Allow list outbound IPs for Key Vault in Azure SRE Agent

In this article, you add your agent's outbound IP addresses to a Key Vault firewall so certificate-based connectors can retrieve certificates.

## Prerequisites

- An agent in **Running** state
- An Azure Key Vault with a **firewall enabled** (set to "Allow access from specific virtual networks and IP addresses")
- **Key Vault Contributor** or **Network Contributor** role on the Key Vault resource

## Find your agent's outbound IPs

1. In the agent portal, go to **Settings > Basics**.
1. Find the **Outbound IP addresses** row.
1. Select the **copy icon** next to each IP address to copy it to your clipboard.

> [!TIP]
> The same IPs also appear as an info banner when you configure a certificate-based connector. Either location works.

## Add IPs to your Key Vault firewall

1. Open the [Azure portal](https://portal.azure.com).
1. Go to your Key Vault resource.
1. Select **Networking** from the left menu.
1. Under **Firewalls and virtual networks**, confirm **Allow access from specific virtual networks and IP addresses** is selected.
1. In the **Firewall** section, add each outbound IP address from Step 1.
1. Select **Save**.

## Verify the connection

1. Return to the agent portal.
1. Configure or retest your certificate-based connector.
1. The connector should now retrieve certificates from the Key Vault without firewall errors.

> [!TIP]
> If the connector still fails after adding the IPs, verify:
>
> - You added **all** IPs (not just the first one).
> - You saved the Key Vault firewall changes.
> - The agent's managed identity has the correct Key Vault role (**Key Vault Secrets User** or **Key Vault Certificate User**).

## Related content

- [Network requirements](network-requirements.md)
