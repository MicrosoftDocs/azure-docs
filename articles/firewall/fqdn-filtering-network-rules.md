---
title: FQDN filtering in network rules
description: How to use FQDN filtering in network rules
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 06/30/2020
ms.author: victorh
---

# FQDN filtering in network rules

A fully qualified domain name (FQDN) represents a domain name of a host. A domain name is associated with a single or multiple IP addresses. You can allow or block FQDNs and FQDN tags in application rules. Using custom DNS and DNS proxy settings, you can also use FQDN filtering in network rules.

## How it works

Azure Firewall translates the FQDN to an IP address(es) using its DNS settings and does rule processing based on Azure DNS or a custom DNS configuration.

To use FQDNs in network rules, you should enable DNS proxy. If you don't enable DNS proxy, secure rule processing is at risk. You can choose to override this requirement by acknowledging the risk before selecting **Save** in the rule collection.

## Next steps

[Azure Firewall DNS settings](dns-settings.md)
