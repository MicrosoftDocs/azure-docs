---
title: Monitor logs using Azure Firewall Workbook
description: Azure Firewall Workbooks provide a flexible canvas for Azure Firewall data analysis and the creation of rich visual reports within the Azure portal.
services: firewall
author: gopimsft
ms.service: firewall
ms.topic: how-to
ms.date: 11/01/2021
ms.author: victorh
---

# Monitor logs using Azure Firewall Workbook

Azure Firewall Workbook provides a flexible canvas for Azure Firewall data analysis. You can use it to create rich visual reports within the Azure portal. You can tap into multiple Firewalls deployed across Azure, and combine them into unified interactive experiences.

You can gain insights into Azure Firewall events, learn about your application and network rules, and see statistics for firewall activities across URLs, ports, and addresses. Azure Firewall Workbook allows you to filter your firewalls and resource groups, and dynamically filter per category with easy to read data sets when investigating an issue in your logs. 

## Prerequisites

Before starting, you should [enable diagnostic logging](firewall-diagnostics.md#enable-diagnostic-logging-through-the-azure-portal) through the Azure portal. Also, read [Azure Firewall logs and metrics](logs-and-metrics.md) for an overview of the diagnostics logs and metrics available for Azure Firewall.

## Get started

To deploy the workbook,  go to [Azure Monitor Workbook for Azure Firewall](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20Firewall/Workbook%20-%20Azure%20Firewall%20Monitor%20Workbook) and following the instructions on the page. Azure Firewall Workbook is designed to work across multi-tenants, multi-subscriptions, and is filterable to multiple firewalls.

## Overview page

The overview page provides you with a way to filter across workspaces, time, and firewalls. It shows events by time across firewalls and log types (application, networks, threat intel, DNS proxy).

:::image type="content" source="./media/firewall-workbook/firewall-workbook-overview.png" alt-text="Azure Firewall Workbook overview":::

## Application rule log statistics

This page shows unique sources of IP address over time, application rule count usage, denied/allowed FQDN over time, and filtered data. You can filter data based on IP address. 

:::image type="content" source="./media/firewall-workbook/firewall-workbook-application-rule.png" alt-text="Azure Firewall Workbook application rule log":::

The Web Categories view summarizes all allow and deny access log actions based on severity as configured by the firewall administrator.

:::image type="content" source="./media/firewall-workbook/firewall-workbook-webcategory.png" alt-text="Azure Firewall Web Category Summary":::

## Network rule log statistics

This page provides a view by rule action – allow/deny, target port by IP and DNAT over time. You can also filter by action, port, and destination type.

:::image type="content" source="./media/firewall-workbook/firewall-workbook-network-rule.png" alt-text="Azure Firewall Workbook network rule log":::

You can also filter logs based on time window:

:::image type="content" source="./media/firewall-workbook/firewall-workbook-network-rule-time.png" alt-text="Azure Firewall Workbook network rule log time window":::

## IDPS log statistics

This page provides an overview of the IDPS actions count for all traffic that match the IDPS rules: Protocol, Signature ID, Source IP.

:::image type="content" source="./media/firewall-workbook/firewall-workbook-idps.png" alt-text="Azure Firewall Workbook idps log":::

## Investigations

You can look at the logs and understand more about the resource based on the source IP address. You can get information like virtual machine name and network interface name. It's simple to filter to the resource from the logs.

:::image type="content" source="./media/firewall-workbook/firewall-workbook-investigation.png" alt-text="Azure Firewall Workbook investigation":::


## Next steps

- Learn more about [Azure Firewall Diagnostics](firewall-diagnostics.md)
