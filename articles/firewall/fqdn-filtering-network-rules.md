---
title: Azure Firewall FQDN filtering in network rules
description: How to use Azure Firewall FQDN filtering in network rules
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/17/2025
ms.author: duau
ms.custom: engagement-fy23
# Customer intent: "As a network administrator, I want to implement FQDN filtering in Azure Firewall network rules, so that I can control outbound traffic based on domain names and ensure security for various protocols without using wildcards."
---

# Use FQDN filtering in network rules

A fully qualified domain name (FQDN) represents the complete domain name of a host or one or more IP addresses. In Azure Firewall and Firewall policy, you can use FQDNs in network rules based on DNS resolution. This feature allows you to filter outbound traffic using any TCP/UDP protocol, including NTP, SSH, and RDP. To use FQDNs in your network rules, you must enable DNS Proxy. For more information, see [Azure Firewall DNS settings](dns-settings.md).

> [!NOTE]
> FQDN filtering in network rules doesn't support wildcards by design.

## How it works

First, define the DNS server your organization uses (either Azure DNS or a custom DNS). Azure Firewall then translates the FQDN to an IP address or addresses based on the chosen DNS server. This translation applies to both application and network rule processing.

When a new DNS resolution occurs, new IP addresses are added to the firewall rules. Old IP addresses expire after 15 minutes if the DNS server no longer returns them. Azure Firewall updates its rules every 15 seconds based on the DNS resolution of the FQDNs in network rules.

### Differences between application rules and network rules

- FQDN filtering in application rules for HTTP/S and MSSQL relies on an application-level transparent proxy and the SNI header. This allows it to differentiate between two FQDNs that resolve to the same IP address. This capability isn't available with FQDN filtering in network rules.

  Always use application rules when possible:
  - For HTTP/S or MSSQL protocols, use application rules for FQDN filtering.
  - For services like AzureBackup and HDInsight, use application rules with FQDN tags.
  - For other protocols, use network rules for FQDN filtering.

## Next steps

[Azure Firewall DNS settings](dns-settings.md)
