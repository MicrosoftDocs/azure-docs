---
title: Use Azure Firewall workbooks
description: Azure Firewall Workbooks provide a flexible canvas for Azure Firewall data analysis and the creation of rich visual reports within the Azure portal.
author: gopimsft
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
ms.custom: sfi-image-nochange
# Customer intent: As a network administrator, I want to analyze and visualize Azure Firewall data using workbooks, so that I can gain insights into firewall events and enhance security monitoring across multiple firewalls in the Azure environment.
---

# Use Azure Firewall workbooks

Azure Firewall Workbook provides a flexible canvas for Azure Firewall data analysis. Use it to create rich visual reports within the Azure portal. You can tap into multiple Firewalls deployed across Azure, and combine them into unified interactive experiences.

You can gain insights into Azure Firewall events, learn about your application and network rules, and see statistics for firewall activities across URLs, ports, and addresses. Azure Firewall Workbook allows you to filter your firewalls and resource groups, and dynamically filter per category with easy-to-read data sets when investigating an issue in your logs.

## Prerequisites

Before you start, enable [Azure Structured Firewall Logs](monitor-firewall.md) through the Azure portal.

> [!IMPORTANT]
> All the following sections are valid for Firewall structured logs only.
>

If you want to use legacy logs, you can enable [diagnostic logging](monitor-firewall.md) by using the Azure portal. Then go to [GitHub Workbook for Azure Firewall](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20Firewall/Workbook%20-%20Azure%20Firewall%20Monitor%20Workbook) and follow the instructions on the page.


 Also, read [Azure Firewall logs and metrics](monitor-firewall.md) for an overview of the diagnostics logs and metrics available for Azure Firewall.

## Get started

After you set up Firewall structured logs, use the Azure Firewall embedded workbooks by following these steps:

1. In the portal, go to your Azure Firewall resource.
2. Under **Monitoring**, select **Workbooks**.
3. In the gallery, you can create new workbooks or use the existing Azure Firewall workbook as shown in the following image:

   :::image type="content" source="media/firewall-workbook/firewall-workbook-gallery.png" alt-text="Screenshot showing the firewall workbook gallery." lightbox="media/firewall-workbook/firewall-workbook-gallery.png":::
4. Select the Log Analytics workspace and one or more firewall names you want to use in this workbook as shown in the following image:

   :::image type="content" source="media/firewall-workbook/structured-logs.png" alt-text="Screenshot showing workspace and Azure Firewall selections in the workbook." lightbox="media/firewall-workbook/structured-logs.png" :::

## Workbook sections

The Azure Firewall workbook has seven tabs, each addressing distinct aspects of the service. The following sections describe each tab.

### Overview

The overview tab shows graphs and statistics related to all types of firewall events aggregated from various logging categories. This aggregation includes network rules, application rules, DNS, Intrusion Detection and Prevention System (IDPS), Threat Intelligence, and more. The available widgets in the Overview tab include:

- **Events, by time**: Displays event frequency over time.
- **Events, by firewall over time**: Shows event distribution across firewalls over time.
- **Events, by category**: Categorizes and counts events.
- **Events categories, by time**: Displays event categories over time.
- **Average throughput of firewall traffic**: Shows average data passing through the firewall.
- **SNAT Port Utilization**: Displays usage of SNAT ports.
- **Network Rule Hit count (SUM)**: Counts network rule triggers.
- **Application Rule Hit count (SUM)**: Counts application rule triggers.

:::image type="content" source="./media/firewall-workbook/firewall-workbook-overview.png" alt-text="Screenshot showing the Azure Firewall Workbook overview tab." lightbox="./media/firewall-workbook/firewall-workbook-overview.png":::

## Application rules

The **Application rules** tab shows Layer 7 related events statistics correlated with your specific application rules in Azure Firewall policy. The following widgets are available in the **Application rules** tab:

- **Application Rule Usage**: Shows usage of application rules.
- **Denied FQDNs over time**: Displays denied Fully Qualified Domain Names (FQDNs) over time.
- **Denied FQDNs by count**: Counts denied FQDNs.
- **Allowed FQDNs over time**: Displays allowed FQDNs over time.
- **Allowed FQDNs by count**: Counts allowed FQDNs.
- **Allowed Web Categories overtime**: Shows allowed web categories over time.
- **Allowed Web Categories by count**: Counts allowed web categories.
- **Denied Web Categories overtime**: Displays denied web categories over time.
- **Denied Web Categories by count**: Counts denied web categories.

:::image type="content" source="media/firewall-workbook/application-rules-tab.png" alt-text="Screenshot showing the application rules tab." lightbox="media/firewall-workbook/application-rules-tab.png":::

## Network rules

The **Network rules** tab shows Layer 4 related events statistics correlated with your specific network rules in Azure Firewall policy. The following widgets are available in the **Network rules** tab:

- **Rule actions**: Displays actions taken by rules.
- **Target ports**: Shows targeted ports in network traffic.
- **DNAT actions**: Displays actions of Destination Network Address Translation (DNAT).
- **GeoLocation**: Shows geographical locations involved in network traffic.
- **Rule actions, by IP addresses**: Displays rule actions categorized by IP addresses.
- **Target ports, by Source IP**: Shows targeted ports categorized by source IP addresses.
- **DNATed over time**: Displays DNAT actions over time.
- **GeoLocation over time**: Shows geographical locations involved in network traffic over time.
- **Actions, by time**: Displays network actions over time.
- **All IP addresses events with GeoLocation**: Shows all events involving IP addresses, categorized by geographical location.

:::image type="content" source="media/firewall-workbook/network-rules-tab.png" alt-text="Screenshot showing network rules tab." lightbox="media/firewall-workbook/network-rules-tab.png":::

## DNS proxy

This tab is relevant if you set up Azure Firewall to function as a DNS proxy, serving as an intermediary for DNS requests from client virtual machines to a DNS server. The DNS Proxy tab includes various widgets that you can use:

- **DNS Proxy Traffic by count per Firewall**: Displays DNS proxy traffic count for each firewall.
- **DNS Proxy count by Request Name**: Counts DNS proxy requests by request name.
- **DNS Proxy Request count by Client IP**: Counts DNS proxy requests by client IP address.
- **DNS Proxy Request over time by Client IP**: Displays DNS proxy requests over time, categorized by client IP.
- **DNS Proxy Information**: Provides log information related to your DNS proxy setup.

:::image type="content" source="media/firewall-workbook/dns-proxy-tab.png" alt-text="Screenshot showing the DNS proxy tab." lightbox="media/firewall-workbook/dns-proxy-tab.png" :::

## Intrusion Detection and Prevention System (IDPS)

The IDPS log statistics tab provides a summary of malicious traffic events and the preventive actions the service takes. The IDPS tab includes the following widgets:

- **IDPS Actions Count**: Counts IDPS actions.
- **IDPS Protocol Count**: Counts protocols detected by IDPS.
- **IDPS SignatureID Count**: Counts IDPS detections by signature ID.
- **IDPS SourceIP Count**: Counts IDPS detections by source IP address.
- **Filtered IDPS Actions by Count**: Counts filtered IDPS actions.
- **Filtered IDPS Protocols by Count**: Counts filtered IDPS protocols.
- **Filtered IDPS SignatureIDs by Count**: Counts filtered IDPS detections by signature ID.
- **Filtered SourceIP**: Displays filtered source IPs detected by IDPS.
- **Azure Firewall IDPS count over time**: Shows Azure Firewall IDPS count over time.
- **Azure Firewall IDPS logs with GeoLocation**: Provides Azure Firewall IDPS logs, categorized by geographical location.

:::image type="content" source="media/firewall-workbook/idps-tab.png" alt-text="Screenshot showing the IDPS tab." lightbox="media/firewall-workbook/idps-tab.png" :::

## Threat Intelligence (TI)

This tab provides a comprehensive view of threat intelligence activities, highlighting the most prevalent threats, actions, and protocols. It lists the top five fully qualified domain names (FQDNs) and IP addresses associated with these threats, and shows threat intelligence detections over time. You can also analyze detailed logs from Azure Firewall's Threat Intelligence. The Threat Intelligence tab includes the following widgets:

- **Threat Intel Actions Count**: Counts actions detected by Threat Intelligence.
- **Threat Intel Protocol Count**: Counts protocols identified by Threat Intelligence.
- **Top 5 FQDN Count**: Displays the top five most frequent fully qualified domain names (FQDNs).
- **Top 5 IP Count**: Shows the top five most frequent IP addresses.
- **Azure Firewall Threat Intel Over Time**: Displays Azure Firewall Threat Intelligence detections over time.
- **Azure Firewall Threat Intel**: Provides logs from Azure Firewall's Threat Intelligence.

:::image type="content" source="media/firewall-workbook/threat-intelligence-tab.png" alt-text="Screenshot showing the threat intelligence tab." lightbox="media/firewall-workbook/threat-intelligence-tab.png":::

## Investigations

The investigation section enables exploration and troubleshooting. It provides extra details such as the virtual machine name and network interface name associated with the initiation or termination of traffic. It also establishes correlations between source IP addresses and the fully qualified domain names (FQDNs) they attempt to access, along with a geographical location view of your traffic. The Investigation tab includes the following widgets:

- **FQDN Traffic by Count**: Counts traffic by fully qualified domain names (FQDNs).
- **Source IP Address count**: Counts occurrences of source IP addresses.
- **Source IP Address Resource Lookup**: Looks up resources associated with source IP addresses.
- **FQDN Lookup logs**: Provides logs from FQDN lookups.
- **Azure Firewall Premium with Geo Location – IDPS**: Displays Azure Firewall's Intrusion Detection and Prevention System (IDPS) detections, categorized by geographical location.

:::image type="content" source="media/firewall-workbook/investigation-tab.png" alt-text="Screenshot showing the investigation tab." lightbox="media/firewall-workbook/investigation-tab.png":::


## Next steps

- Learn more about [Azure Firewall diagnostics](monitor-firewall.md).
- Learn how to [Track rule set changes](rule-set-change-tracking.md) using Azure Resource Graph.
