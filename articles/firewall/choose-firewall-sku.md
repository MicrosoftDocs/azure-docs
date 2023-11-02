---
title: Choose the right Azure Firewall SKU to meet your needs
description: Learn about the different Azure Firewall SKUs and how to choose the right one for your needs.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 03/15/2023
ms.author: victorh
---

# Choose the right Azure Firewall SKU to meet your needs

Azure Firewall now supports three different SKUs to cater to a wide range of customer use cases and preferences.

- Azure Firewall Premium is recommended to secure highly sensitive applications (such as payment processing). It supports advanced threat protection capabilities like malware and TLS inspection.
- Azure Firewall Standard is recommended for customers looking for Layer 3–Layer 7 firewall and needs autoscaling to handle peak traffic periods of up to 30 Gbps. It supports enterprise features like threat intelligence, DNS proxy, custom DNS, and web categories.
- Azure Firewall Basic is recommended for SMB customers with throughput needs of 250 Mbps.

## Feature comparison

Take a closer look at the features across the three Azure Firewall SKUs:

:::image type="content" source="media/choose-firewall-sku/azure-firewall-sku-table.png" alt-text="Table of Azure Firewall Sku features." lightbox="media/choose-firewall-sku/azure-firewall-sku-table-large.png":::

## Next steps

- [Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md)