---
title: Azure Firewall DNS Proxy details
description: Learn how Azure Firewall DNS Proxy works
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 05/26/2021
ms.author: victorh
---

# Azure Firewall DNS Proxy details

You can configure Azure Firewall to act as a DNS proxy. A DNS proxy is an intermediary for DNS requests from client virtual machines to a DNS server.

The following information describes some implementation details for Azure Firewall DNS Proxy.

## FQDNs with multiple A records

Azure Firewall acts as a standard DNS client. If multiple A records are in the response, the firewall stores all the records in cache. If there’s one record per response, the firewall stores only single record. There's no way for a client to know ahead of time if it should expect one or multiple A records in responses.

## FQDN Time to Live (TTL)

When a FQDN TTL (time-to-live) is about to expire,  records are cached and expired according to their TTLs. Pre-fetching isn't used, so the firewall doesn't do a lookup prior to TTL expiration to refresh the record.

## Clients not configured to use the firewall DNS proxy

If a client computer is configured to use a DNS server that isn't the firewall DNS proxy, the results can be unpredictable.

For example, assume a client workload is in US East, and uses a primary DNS server hosted in US East. Azure Firewall DNS server settings are configured for a secondary DNS server hosted in US West. The firewall’s DNS server hosted in US West results in a response different than that of the client in US East.

This is a common scenario, and why clients should use the firewall’s DNS proxy functionality. Clients should use the  firewall as their resolver if you use FQDNs in Network rules. You can ensure IP address resolution consistency by clients and the firewall itself.

In this example, if an FQDN is configured in Network rules, the firewall resolves the FQDN to IP1 (IP address 1) and updates the network rules to allow access to IP1. If and when the client resolves the same FQDN to IP2 because of a difference in DNS response, its connection attempt won't match the rules on the firewall and will be denied. 

For HTTP/S FQDNs in Application rules, the firewall parses out the FQDN from the host or SNI header, resolves it, and then connects to that IP address. The destination IP address the client was trying to connect to is ignored.

## Next steps

- [Azure Firewall DNS settings](dns-settings.md)