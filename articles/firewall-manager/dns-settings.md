---
title: Azure Firewall policy DNS settings (preview)
description: You can configure Azure Firewall policies with  DNS server and DNS proxy settings.
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: how-to
ms.date: 06/30/2020
ms.author: victorh
---

# Azure Firewall policy DNS settings (preview)

> [!IMPORTANT]
> Azure Firewall DNS settings is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can configure a custom DNS server and enable DNS proxy for Azure Firewall policies. You can configure these settings when you deploy the firewall or later from the **DNS settings** page.

## DNS servers

A DNS server maintains and resolves domain names to IP addresses. By default, Azure Firewall uses Azure DNS for name resolution. The **DNS server** setting lets you configure your own DNS servers for Azure Firewall name resolution. You can configure a single or multiple servers.

### Configure custom DNS servers

1. Select your firewall policy.
2. Under **Settings**, select **DNS Settings**.
3. Under **DNS servers**, you can type or add existing DNS servers that have been previously specified in your Virtual Network.
4. Select **Save**.
5. The firewall now directs DNS traffic to the specified DNS server(s) for name resolution.

## DNS proxy (preview)

You can configure Azure Firewall to act as a DNS proxy. A DNS proxy acts as an intermediary for DNS requests from client virtual machines to a DNS server. If you configure a custom DNS server, you should enable DNS proxy to avoid DNS resolution mismatch, and enable FQDN filtering in network rules.

If you don't enable DNS proxy, DNS requests from the client may travel to a DNS server at a different time or return a different response compared to that of the firewall. DNS proxy puts Azure Firewall in the path of the client requests to avoid inconsistency.

DNS Proxy configuration requires three steps:
1. Enable DNS proxy in Azure Firewall DNS settings.
2. Optionally configure your custom DNS server or use the provided default.
3. Finally, you must configure the Azure Firewall’s private IP address as a Custom DNS address in your virtual network DNS server settings. This ensures DNS traffic is directed to Azure Firewall.

### Configure DNS proxy (preview)

To configure DNS proxy, you must configure your virtual network DNS servers setting to use the firewall private IP address. Then, enable DNS Proxy in Azure Firewall policy **DNS settings**.

#### Configure virtual network DNS servers

1. Select the virtual network where the DNS traffic will be routed through the Azure Firewall.
2. Under **Settings**, select **DNS servers**.
3. Select **Custom** under **DNS servers**.
4. Enter the firewall’s private IP address.
5. Select **Save**.

#### Enable DNS proxy (preview)

1. Select your Azure Firewall policy.
2. Under **Settings**, select **DNS settings**.
3. By default, **DNS Proxy** is disabled. When enabled, the firewall listens on port 53 and forwards DNS requests to the configured DNS servers.
4. Review the **DNS servers** configuration to make sure that the settings are appropriate for your environment.
5. Select **Save**.

## Next steps

[FQDN filtering in network rules](fqdn-filtering-network-rules.md)