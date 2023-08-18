---
title: Azure Firewall FQDN filtering in network rules
description: How to use Azure Firewall FQDN filtering in network rules
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 10/28/2022
ms.author: victorh
ms.custom: engagement-fy23
---

# Use FQDN filtering in network rules

A fully qualified domain name (FQDN) represents a domain name of a host or IP address(es). You can use FQDNs in network rules based on DNS resolution in Azure Firewall and Firewall policy. This capability allows you to filter outbound traffic with any TCP/UDP protocol (including NTP, SSH, RDP, and more). You must enable DNS Proxy to use FQDNs in your network rules. For more information see [Azure Firewall DNS settings](dns-settings.md).

> [!NOTE]
> By design, FQDN filtering in network rules doesn’t support wildcards

## How it works

Once you define which DNS server your organization needs (Azure DNS or your own custom DNS), Azure Firewall translates the FQDN to an IP address(es) based on the selected DNS server. This translation happens for both application and network rule processing.

When a new DNS resolution takes place, new IP addresses are added to firewall rules. Old IP addresses that are no longer returned by the DNS server expire in 15 minutes. Azure Firewall rules are updated every 15 seconds from DNS resolution of the FQDNs in network rules.

### Differences in application rules vs. network rules

- FQDN filtering in application rules for HTTP/S and MSSQL is based on an application level transparent proxy and the SNI header. As such, it can discern between two FQDNs that are resolved to the same IP address. This is not the case with FQDN filtering in network rules. 

   Always use application rules when possible:
  - If the protocol is HTTP/S or MSSQL, use application rules for FQDN filtering.
  - For services like AzureBackup, HDInsight, etc., use application rules with FQDN tags.
  - For any other protocols, you can use network rules for FQDN filtering.

## Next steps

[Azure Firewall DNS settings](dns-settings.md)
