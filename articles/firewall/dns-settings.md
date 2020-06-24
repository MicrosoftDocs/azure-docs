---
title: Azure Firewall DNS settings
description: You can configure Azure Firewall with  DNS server and DNS proxy settings.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 06/30/2020
ms.author: victorh
---

# Azure Firewall DNS settings

You can configure a custom DNS server and enable DNS proxy for Azure Firewall. You can configure these settings when you deploy the firewall or later from the **DNS settings** page.

## DNS servers

A DNS server maintains and resolves domain names to IP addresses. By default, Azure Firewall uses Azure DNS for name resolution. The **DNS server** setting lets you configure your own DNS servers for Azure Firewall name resolution. You can configure a single or multiple servers.

### Configure custom DNS servers

1. Under Azure Firewall **Settings**, select **DNS Settings**.
2. Under **DNS servers**, you can type or add existing DNS servers that have been previously specified in your Virtual Network.
3. Select **Save**.
4. The firewall now directs DNS traffic to the specified DNS server(s) for name resolution.

:::image type="content" source="media/dns-settings/dns-servers.png" alt-text="DNS servers":::

## DNS proxy (preview)

You can configure Azure Firewall to act as a DNS proxy. With DNS proxy enabled, outbound DNS queries are processed by Azure Firewall, which initiates a new DNS resolution query to your custom DNS server or Azure DNS. This is crucial for reliable FQDN filtering in network rules and provide DNS security through integration with Microsoft Threat Intelligence feed.

 DNS Proxy configuration requires three steps:
1. Enable DNS proxy in Azure Firewall DNS settings.
2. Optionally configure your custom DNS server or use the provided default.
3. Finally, you must configure the Azure Firewall’s private IP address as a Custom DNS address in your virtual network DNS server settings. This ensures DNS traffic is directed to Azure Firewall.

### Configure DNS proxy

To configure DNS proxy, you must enable DNS Proxy in Azure Firewall **DNS settings**, then configure your virtual network DNS servers setting to use the firewall private IP address.

#### Enable DNS proxy

1. Select your Azure Firewall.
2. Under **Settings**, select **DNS settings**.
3. By default, **DNS Proxy** is disabled. Select **Enabled** to set Azure Firewall as the DNS proxy to direct DNS traffic from your virtual network to the firewall. When enabled, the firewall listens on port 53 and forwards DNS requests to the configured DNS servers.
4. Review the **DNS servers** configuration to make sure that the settings are appropriate for your environment.
5. Select **Save**.

:::image type="content" source="media/dns-settings/dns-proxy.png" alt-text="DNS proxy":::

#### Configure virtual network DNS servers

1. Select the virtual network where the DNS traffic will be routed through the Azure Firewall.
2. Under **Settings**, select **DNS servers**.
3. Select **Custom** under **DNS servers**.
4. Enter the firewall’s private IP address.
5. Select **Save**.

## Next steps

[FQDN filtering in network rules](fqdn-filtering-network-rules.md)