---
title: Azure Firewall Manager filtering in network rules
description: How to use FQDN filtering in network rules
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: article
ms.date: 04/06/2023
ms.author: victorh
---

# FQDN filtering in network rules

A fully qualified domain name (FQDN) represents a domain name of a host or IP address(es). You can use FQDNs in network rules based on DNS resolution in Azure Firewall and Firewall policy. This capability allows you to filter outbound traffic with any TCP/UDP protocol (including NTP, SSH, RDP, and more). You must enable DNS Proxy to use FQDNs in your network rules. For more information, see [Azure Firewall policy DNS settings](dns-settings.md).

## How it works

Once you define which DNS server your organization needs (Azure DNS or your own custom DNS), Azure Firewall translates the FQDN to an IP address(es) based on the selected DNS server. This translation happens for both application and network rule processing.

What’s the difference between using domain names in application rules compared to that of network rules? 

- FQDN filtering in application rules for HTTP/S and MSSQL is based on an application level transparent proxy and the SNI header. As such, it can discern between two FQDNs that are resolved to the same IP address. This isn't the case with FQDN filtering in network rules. Always use application rules when possible.
- In application rules, you can use HTTP/S and MSSQL as your selected protocols. In network rules, you can use any TCP/UDP protocol with your destination FQDNs.

## Next steps

[Azure Firewall DNS settings](dns-settings.md)
