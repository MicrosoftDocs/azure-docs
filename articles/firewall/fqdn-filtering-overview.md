---
title: Azure Firewall FQDN filtering
description: Learn about Azure Firewall FQDN filtering and how it works with DNAT rules, network rules, and application rules.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 6/30/2025
ms.author: duau
ms.custom: ai-usage
---

# Azure Firewall FQDN filtering

A fully qualified domain name (FQDN) is the complete domain name of a host on the internet, such as www.microsoft.com. In Azure Firewall and Firewall policy, FQDNs can be used to filter traffic in DNAT, network, and application rules, depending on the type and direction of traffic being inspected. 


## How it works

Azure Firewall handles FQDN-based filtering depending on the rule type: 

- **Application rules** use FQDNs to filter HTTP/S and MSSQL traffic. They rely on an application-level transparent proxy and the Server Name Indication (SNI) header to differentiate between FQDNs that resolve to the same IP address. In other words, FQDNs are matched and filtered against the original domain requested by the client, not based on the resolved IP address. 
- **Network and DNAT rules** filter traffic based on the resolved IP addresses of the FQDNs, using Azure DNS or a custom DNS server. Azure Firewall dynamically maintains and updates the list of associated IP addresses for the FQDNs, ensuring that traffic is routed correctly even if the underlying IP addresses change.

When DNS resolution is used, Azure Firewall:

- Resolves the FQDN to its corresponding IP address.
- Uses the resolved IP address to apply the appropriate rule type (DNAT or network)
- Refreshes FQDN-to-IP mappings every 15 seconds.
- Removes IP addresses that are no longer resolved or utilized after 15 minutes.  

## Differences between FQDN filtering in DNAT rules, and network rules, and application rules

### DNAT rules

DNAT (Destination Network Address Translation) rules are used to route inbound traffic to backend servers. These rules allow you to specify an IP address or FQDN as the target for translation. Using FQDNs in DNAT rules enables you to specify a fully qualified domain name for the backend server, which is particularly useful in dynamic environments where the backend server's IP address may change frequently.

**Key characteristics:**

- Enable inbound traffic routing to backend servers.
- Support FQDN-based targeting for dynamic environments.
- Useful for scenarios requiring flexible backend server configurations.


### Network rules

Network rules are used for filtering traffic based on any TCP or UDP protocol, such as Network Time Protocol (NTP), Secure Shell (SSH), and Remote Desktop Protocol (RDP). Unlike application rules, network rules don't depend on an application-level proxy or the SNI header.

> [!NOTE]  
> Network rules with FQDN filtering don't support the use of wildcard characters. This limitation is intentional by design.

**Key characteristics:**

- Applicable to all TCP and UDP protocols.
- Ideal for non-HTTP/S or MSSQL traffic.
- Operate at the network layer without protocol-specific inspection.

### Application rules

Application rules are designed for filtering HTTP/S and MSSQL traffic. They rely on an application-level transparent proxy and the Server Name Indication (SNI) header to differentiate between FQDNs that resolve to the same IP address. These rules are ideal for scenarios where you need to control access to web services or databases.

**Key characteristics:**

- Best suited for HTTP/S and MSSQL protocols.
- Use FQDN tags for Azure services like Azure Backup and HDInsight.
- Provide finer granularity for supported protocols.

By understanding the differences between these rule types, you can effectively configure Azure Firewall to meet your organization's security and traffic management needs.
