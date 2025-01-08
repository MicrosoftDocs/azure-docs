---
title: Delegated subnet limits
description: Learn about Delegated subnet limits for Oracle Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Delegated subnet limits 

In this article, you learn about delegated subnet limits for Oracle Database@Azure.

Oracle Database@Azure infrastructure resources are connected to your Azure virtual network using a virtual NIC from your [delegated subnets](/azure/virtual-network/subnet-delegation-overview) (delegated to `Oracle.Database/networkAttachement`). By default, the Oracle Database@Azure service can use up to five delegated subnets. If you need more delegated subnet capacity, you can request a service limit increase.

## Service limits in the OCI Console

For information on viewing and increasing service limits in the OCI Console, see the following articles:
- [To view the tenancy's limits and usage (by region)](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/servicelimits.htm#To_view_your_tenancys_limits_and_usage_by_region)
- [Requesting a service limit increase](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/servicelimits.htm#Requesti)

When submitting a service limit increase, note the following:

-   The service name is `Multicloud`.
-   The resource name is `Delegated Subnet Multicloud Links`.
-   The  service limit name for Oracle Database@Azure delegated subnets is `azure-delegated-subnet-count`.
-   The limit is applied at the regional level.

## Next steps

[Network planning for Oracle Database@Azure](oracle-database-network-plan.md) in the Azure documentation for information about network topologies and constraints for Oracle Database@Azure.

