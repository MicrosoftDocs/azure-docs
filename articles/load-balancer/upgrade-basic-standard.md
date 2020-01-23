---
title: Upgrade from Basic Public to Standard Public - Azure Load Balancer
description: This article shows you how to upgrade Azure Public Load Balancer from Basic SKU to Standard SKU
services: load-balancer
author: irenehua
ms.service: load-balancer
ms.topic: article
ms.date: 01/23/2020
ms.author: irenehua
---

# Upgrade Azure Public Load Balancer from Basic SKU to Standard SKU
[Azure Standard Load Balancer](load-balancer-overview.md) is now available, offering additional features such as bigger scale and highly available services. However, existing Basic aren't automatically upgraded to Standard. If you want to migrate from Basic Public Load Balancer to Standard Public Load Balancer, follow the steps in this article.

There are two stages in a upgrade:

1. Migrate the configuration
2. Add VMs to backend pools of Standard Load Balancer

This article covers configuration migration. Client traffic migration varies depending on your specific environment. However, some high-level, general recommendations [are provided](#migrate-client-traffic).
