---
title: Delegated subnet limits
description: Learn about Delegated subnet limits for Oracle AI Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
# Customer intent: As a network administrator, I want to understand delegated subnet limits for Oracle AI Database@Azure, so that I can effectively manage and plan my cloud network resources.
---

# Delegated subnet limits 

In this article, you learn about delegated subnet limits for Oracle AI Database@Azure.

Oracle AI Database@Azure infrastructure resources are connected to your Azure virtual network using a virtual NIC from your [delegated subnets](/azure/virtual-network/subnet-delegation-overview) (delegated to `Oracle.Database/networkAttachment`). By default, the Oracle AI Database@Azure service can use up to five delegated subnets. If you need more delegated subnet capacity, you can request a service limit increase.

## Service limits in the OCI Console

For information on viewing and increasing service limits in the OCI Console, see the following articles:
- [To view the tenancy's limits and usage (by region)](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/servicelimits.htm#To_view_your_tenancys_limits_and_usage_by_region)
- [Requesting a service limit increase](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/servicelimits.htm#Requesti)

When submitting a service limit increase, note the following:

-   The service name is `Multicloud`.
-   The resource name is `Delegated Subnet Multicloud Links`.
-   The  service limit name for Oracle AI Database@Azure delegated subnets is `azure-delegated-subnet-count`.
-   The limit is applied at the regional level.

## Next steps

[Network planning for Oracle AI Database@Azure](oracle-database-network-plan.md) in the Azure documentation for information about network topologies and constraints for Oracle AI Database@Azure.

