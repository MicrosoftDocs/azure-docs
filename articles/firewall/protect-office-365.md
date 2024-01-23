---
title: Use Azure Firewall to protect Office 365
description: Learn how to use Azure Firewall to protect Office 365
author: vhorne
ms.service: firewall
services: firewall
ms.topic: how-to
ms.date: 11/27/2023
ms.author: yuvalpery
---

# Use Azure Firewall to protect Office 365

You can use the Azure Firewall built-in Service Tags and FQDN tags to allow outbound communication to [Office 365 endpoints and IP addresses](/microsoft-365/enterprise/urls-and-ip-address-ranges).

> [!NOTE]
> Office 365 service tags and FQDN tags are supported in Azure Firewall policy only. They aren't supported in classic rules.

## Tags creation

For each Office 365 product and category, Azure Firewall automatically retrieves the required endpoints and IP addresses, and creates tags accordingly:

- Tag name: all names begin with **Office365** and are followed by:
   - Product: Exchange / Skype / SharePoint / Common
   - Category: Optimize / Allow / Default
   - Required / Not required (optional)
- Tag type:
   - **FQDN tag** represents only the required FQDNs for the specific product and category that communicate over HTTP/HTTPS (ports 80/443) and can be used in Application Rules to secure traffic to these FQDNs and protocols.
   - **Service tag** represents only the required IPv4 addresses and ranges for the specific product and category and can be used in Network Rules to secure traffic to these IP addresses and to any required port.

You should accept a tag being available for a specific combination of product, category and required / not required in the following cases:
- For a Service Tag – this specific combination exists and has required IPv4 addresses listed.
- For an FQDN Rule – this specific combination exists and has required FQDNs listed which communicate to ports 80/443.

Tags are updated automatically with any modifications to the required IPv4 addresses and FQDNs. New tags might be created automatically in the future as well if new combinations of product and category are added.

Network rule collection:
:::image type="content" source="media/protect-office-365/network-rule-collection.png" alt-text="Screenshot showing Office 365 network rule collection.":::

Application rule collection:
:::image type="content" source="media/protect-office-365/application-rule-collection.png" alt-text="Screenshot showing Office 365 application rule collection.":::

## Rules configuration

These built-in tags provide granularity to allow and protect the outbound traffic to Office 365 based on your preferences and usage. You can allow outbound traffic only to specific products and categories for a specific source. You can also use [Azure Firewall Premium’s TLS Inspection and IDPS](premium-features.md) to monitor some of the traffic. For example, traffic to endpoints in the Default category that can be treated as normal Internet outbound traffic. For more information about Office 365 endpoint categories, see [New Office 365 endpoint categories](/microsoft-365/enterprise/microsoft-365-network-connectivity-principles#new-office-365-endpoint-categories).

When you create the rules, ensure you define the required TCP ports (for network rules) and protocols (for application rules) as required by Office 365. If a specific combination of product, category and required/not required have both a Service Tag and an FQDN tag, you should create representative rules for both tags to fully cover the required communication.

## Limitations

If a specific combination of product, category and required/not required has only FQDNs required, but uses TCP ports that aren't 80/443, an FQDN tag isn't be created for this combination. Application Rules can only cover HTTP, HTTPS or MSSQL. To allow communication to these FQDNs, create your own network rules with these FQDNs and ports. 
For more information, see [Use FQDN filtering in network rules](fqdn-filtering-network-rules.md).

## Next steps

- For more information, see [Protect Office365 and Windows365 with Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/protect-office365-and-windows365-with-azure-firewall/ba-p/3824533).
- Learn more about Office 365 network connectivity: [Microsoft 365 network connectivity overview](/microsoft-365/enterprise/microsoft-365-networking-overview)

