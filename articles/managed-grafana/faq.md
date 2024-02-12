---
title: Azure Managed Grafana FAQ
description: Frequently asked questions about Azure Managed Grafana
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: reference
ms.date: 07/17/2023

---

# Azure Managed Grafana FAQ

This article answers frequently asked questions about Azure Managed Grafana.

## Do you use open source Grafana for Managed Grafana?

No. Managed Grafana hosts a commercial version called [Grafana Enterprise](https://grafana.com/products/enterprise/grafana/) that Microsoft is licensing from Grafana Labs. While not all of the Enterprise features are available yet, Managed Grafana continues to add support as these features are fully integrated with Azure.

> [!NOTE]
> [Grafana Enterprise plugins](https://grafana.com/grafana/plugins/?enterprise=1&orderBy=weight&direction=asc) aren't included in the base service. They're purchasable as a separately licensed [addon option](./how-to-grafana-enterprise.md) for Managed Grafana.

## Does Managed Grafana encrypt my data?

Yes. Managed Grafana always encrypts all data at rest and in transit. It supports [encryption at rest](./encryption.md) using Microsoft-managed keys. All network communication is over TLS 1.2. You can further restrict network traffic using a [private link](./how-to-set-up-private-access.md) for connecting to Grafana and [managed private endpoints](./how-to-connect-to-data-source-privately.md) for data sources.

## Where do Managed Grafana data reside?

Customer data, including dashboards and data source configuration, created in Managed Grafana are stored in the region where the customer's Managed Grafana workspace is located. This data residency applies to all available regions. Customers may move, copy, or access their data from any location globally.

## Does Managed Grafana support Grafana's built-in SAML and LDAP authentications?

No. Managed Grafana uses its implementation for Microsoft Entra authentication.

## Can I install more plugins?

No. Currently all Grafana plugins are preinstalled. Managed Grafana supports all popular plugins for Azure data sources.

## Next steps

> [!div class="nextstepaction"]
> [About Azure Managed Grafana](./overview.md)
