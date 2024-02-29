---
title: Azure Firewall policy DNS settings
description: You can configure Azure Firewall policies with  DNS server and DNS proxy settings.
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: how-to
ms.date: 04/06/2023
ms.author: victorh
---

# Azure Firewall policy DNS settings

You can configure a custom DNS server and enable DNS proxy for Azure Firewall policies. You can configure these settings when you deploy the firewall or later from the **Settings**, **DNS** page.

## DNS servers

A DNS server maintains and resolves domain names to IP addresses. By default, Azure Firewall uses Azure DNS for name resolution. The **DNS servers** setting lets you configure your own DNS servers for Azure Firewall name resolution. You can configure a single or multiple servers.

## DNS proxy

You can configure Azure Firewall to act as a DNS proxy. A DNS proxy acts as an intermediary for DNS requests from client virtual machines to a DNS server. If you configure a custom DNS server, you should enable DNS proxy to avoid DNS resolution mismatch, and enable FQDN filtering in network rules.

If you don't enable DNS proxy, DNS requests from the client may travel to a DNS server at a different time or return a different response compared to that of the firewall. DNS proxy puts Azure Firewall in the path of the client requests to avoid inconsistency.

DNS Proxy configuration requires three steps:

1. Enable DNS proxy in Azure Firewall DNS settings.
2. Optionally configure your custom DNS server or use the provided default.
3. Finally, you must configure the Azure Firewall’s private IP address as a Custom DNS address in your virtual network DNS server settings. This ensures DNS traffic is directed to Azure Firewall.

## Configure firewall policy DNS

1. Select your firewall policy.
2. Under **Settings**, select **DNS**.
1. Select **Enabled** to enable DNS settings for this policy.
1. Under **DNS servers**, you can accept the **Default (Azure provided)** setting, or select **Custom** to add custom DNS servers you'll configure for your virtual network.
1. Under **DNS Proxy**, select **Enabled** to enable DNS Proxy if you configured a customer DNS server.
1. Select **Apply**.


## Configure virtual network

To configure DNS proxy, you must also configure your virtual network DNS servers setting to use the firewall private IP address.

### Configure virtual network DNS servers

1. Select the virtual network where the DNS traffic will be routed through the Azure Firewall.
2. Under **Settings**, select **DNS servers**.
3. Select **Custom** under **DNS servers**.
4. Enter the firewall’s private IP address.
5. Select **Save**.


## Next steps

[FQDN filtering in network rules](fqdn-filtering-network-rules.md)