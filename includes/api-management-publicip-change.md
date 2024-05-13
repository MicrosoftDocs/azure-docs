---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/02/2024
ms.author: danlep
---
When changing from an internal to external virtual network, or updating an API Management instance in an external network by migrating from the `stv1` to `stv2` platform, changing subnets in the network, or updating availability zones, you can optionally supply a different [public IP address](../articles/api-management/api-management-using-with-vnet.md?tabs=stv2#prerequisites). If you don't provide one, an Azure-managed public IP address is automatically configured.