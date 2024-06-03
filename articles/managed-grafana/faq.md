---
title: Azure Managed Grafana FAQ
description: Frequently asked questions about Azure Managed Grafana
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: reference
ms.date: 04/05/2024
---

# Azure Managed Grafana FAQ

This article answers frequently asked questions about Azure Managed Grafana.

## Do you use open source Grafana for Azure Managed Grafana?

No. Azure Managed Grafana hosts a commercial version called [Grafana Enterprise](https://grafana.com/products/enterprise/grafana/) that Microsoft is licensing from Grafana Labs. While not all of the Enterprise features are available yet, Azure Managed Grafana continues to add support as these features are fully integrated with Azure.

> [!NOTE]
> [Grafana Enterprise plugins](https://grafana.com/grafana/plugins/?enterprise=1&orderBy=weight&direction=asc) aren't included in the base service. They're purchasable as a separately licensed [add-on option](./how-to-grafana-enterprise.md) for Azure Managed Grafana.

## Does Managed Grafana encrypt my data?

Yes. Azure Managed Grafana always encrypts all data at rest and in transit. It supports [encryption at rest](./encryption.md) using Microsoft-managed keys. All network communication is over TLS 1.2. You can further restrict network traffic using a [private link](./how-to-set-up-private-access.md) for connecting to Grafana and [managed private endpoints](./how-to-connect-to-data-source-privately.md) for data sources.

## Where does the Azure Managed Grafana data reside?

Customer data, including dashboards and data source configuration, created in Azure Managed Grafana are stored in the region where the customer's Azure Managed Grafana workspace is located. This data residency applies to all available regions. Customers may move, copy, or access their data from any location globally.

## Does Azure Managed Grafana support Grafana's built-in SAML and LDAP authentications?

No. Azure Managed Grafana uses its implementation for Microsoft Entra authentication.

## Can I install more plugins?

No. Currently all Grafana plugins are preinstalled. Managed Grafana supports all popular plugins for Azure data sources.

## In terms of pricing, what constitutes an active user in Azure Managed Grafana?

The Azure Managed Grafana [pricing page](https://azure.microsoft.com/pricing/details/managed-grafana/) mentions a price per active user. 

An active user is billed only once for accessing multiple Azure Managed Grafana instances under the same Azure Subscription. 

Charges for active users are prorated during the first and the last calendar month of service usage. For example:

- For an instance running from January 15 at 00:00 to January 25 at 23:59 with 10 users, the charge is for the prorated period they had access to the instance. Pricing is calculated for 10 users for 11 out of 31 days, which equals a charge for 3.54 active users.

- For an instance running from January 15 at 00:00 to March 25 at 23:59:

  - On January 31, the charge is for 10 users prorated for 16 days of January out of 31 days, totaling a charge for 5.16 active users.
  - On February 28, the full monthly charge applies for 20 users.
  - Upon deletion on March 25, the charge for March would be prorated for 15 users for 25 days out of 31 days, totaling a charge for 12.09 active users.

## Next steps

> [!div class="nextstepaction"]
> [About Azure Managed Grafana](./overview.md)
