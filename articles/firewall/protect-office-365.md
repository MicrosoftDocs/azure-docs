---
title: Use Azure Firewall to protect Microsoft 365
description: Learn how to use Azure Firewall to protect Microsoft 365
author: duongau
ms.author: yuvalpery
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
ms.custom: sfi-image-nochange
# Customer intent: As a network administrator, I want to configure Azure Firewall with Microsoft 365 service and FQDN tags, so that I can effectively control and secure outbound traffic to Microsoft 365 endpoints while optimizing performance and compliance.
---

# Use Azure Firewall to protect Microsoft 365

Use the Azure Firewall built-in service tags and FQDN tags to allow outbound communication to [Microsoft 365 endpoints and IP addresses](/microsoft-365/enterprise/urls-and-ip-address-ranges).

> [!NOTE]
> Azure Firewall policy supports Microsoft 365 service tags and FQDN tags. Classic rules don't support them.

## Tags creation

For each Microsoft 365 product and category, Azure Firewall automatically retrieves the required endpoints and IP addresses, and creates tags accordingly:

- Tag name: all names begin with **Microsoft365** and are followed by:
   - Product: Exchange, Skype, SharePoint, or Common
   - [Category](/microsoft-365/enterprise/microsoft-365-network-connectivity-principles#optimizing-connectivity-to-microsoft-365-services):
      - Optimize and Allow: Network endpoints with **Optimize** or **Allow** category carry higher traffic volume and are sensitive to network latency and performance. These endpoints have IP addresses listed with the domain.
      - Default: Network endpoints in the **Default** category don't have associated IP addresses because they're dynamic in nature and IP addresses change over time.
   - Required or Not required (optional)
- Tag type:
   - **FQDN tag** represents only the required FQDNs for the specific product and category that communicate over HTTP/HTTPS (ports 80/443). Use these tags in Application Rules to secure traffic to these FQDNs and protocols.
   - **Service tag** represents only the required IPv4 addresses and ranges for the specific product and category. Use these tags in Network Rules to secure traffic to these IP addresses and to any required port.

Accept a tag for a specific combination of product, category, and required or not required in the following cases:
- For a Service Tag – this specific combination exists and has required IPv4 addresses listed.
- For an FQDN Rule – this specific combination exists and has required FQDNs listed that communicate to ports 80/443.

Azure Firewall automatically updates tags with any modifications to the required IPv4 addresses and FQDNs. In the future, Azure Firewall might automatically create new tags if new combinations of product and category are added.

Network rule collection:
:::image type="content" source="media/protect-office-365/network-rule-collection.png" alt-text="Screenshot showing Microsoft 365 network rule collection.":::

Application rule collection:
:::image type="content" source="media/protect-office-365/application-rule-collection.png" alt-text="Screenshot showing Microsoft 365 application rule collection.":::

## Rules configuration

These built-in tags provide granularity to allow and protect the outbound traffic to Microsoft 365 based on your preferences and usage. You can allow outbound traffic only to specific products and categories for a specific source. You can also use [Azure Firewall Premium’s TLS Inspection and IDPS](premium-features.md) to monitor some of the traffic. For example, traffic to endpoints in the Default category that can be treated as normal Internet outbound traffic. For more information about Microsoft 365 endpoint categories, see [New Microsoft 365 endpoint categories](/microsoft-365/enterprise/microsoft-365-network-connectivity-principles#new-office-365-endpoint-categories).

When you create the rules, ensure you define the required TCP ports (for network rules) and protocols (for application rules) as required by Microsoft 365. If a specific combination of product, category, and required or not required status has both a Service Tag and an FQDN tag, create representative rules for both tags to fully cover the required communication.

## Limitations

If a specific combination of product, category, and required or not required status has only FQDNs required but uses TCP ports that aren't 80 or 443, the system doesn't create an FQDN tag for this combination. Application Rules can only cover HTTP, HTTPS, or MSSQL. To allow communication to these FQDNs, create your own network rules with these FQDNs and ports.
For more information, see [Use FQDN filtering in network rules](fqdn-filtering-network-rules.md).

## Next steps

- For more information, see [Protect Microsoft 365 and Windows 365 with Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/protect-office365-and-windows365-with-azure-firewall/ba-p/3824533).
- Learn more about Microsoft 365 network connectivity: [Microsoft 365 network connectivity overview](/microsoft-365/enterprise/microsoft-365-networking-overview).

