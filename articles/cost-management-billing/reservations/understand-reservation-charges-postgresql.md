---
title: How a reservation discount is applied to Azure Database for PostgreSQL Single server
description: How a reservation discount is applied to Azure Database for PostgreSQL Single server
author: kummanish
ms.author: manishku
ms.service: cost-management-billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/17/2019
---

# How a reservation discount is applied to Azure Database for PostgreSQL Single server

After you buy an Azure Database for PostgreSQL Single server reserved capacity, the reservation discount is automatically applied to PostgreSQL Single servers databases that match the attributes and quantity of the reservation. A reservation covers only the compute costs of your Azure Database for PostgreSQL Single server. You're charged for storage and networking at the normal rates. 

## How reservation discount is applied

A reservation discount is ***use-it-or-lose-it***. So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.</br>

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are lost.

## Discount applied to Azure Database for PostgreSQL Single server

The Azure Database for PostgreSQL Single server reserved capacity discount is applied to running your PostgreSQL Single server on an hourly basis. The reservation that you buy is matched to the compute usage emitted by the running Azure Database for PostgreSQL Single server. For PostgreSQL Single servers that don't run the full hour, the reservation is automatically applied to other Azure Database for PostgreSQL Single server matching the reservation attributes. The discount can apply to Azure Database for PostgreSQL Single servers that are running concurrently. If you don't have an PostgreSQL Single server that run for the full hour that match the reservation attributes, you don't get the full benefit of the reservation discount for that hour.

The following examples show how the Azure Database for PostgreSQL Single server reserved capacity discount applies depending on the number of cores you bought, and when they're running.

* **Example 1**: You buy an Azure Database for PostgreSQL Single server reserved capacity for an 8 vCore. If you are running a 16 vCore Azure Database for PostgreSQL Single server that matches the rest of the attributes of the reservation, you're charged the pay-as-you-go price for 8 vCore of your PostgreSQL Single server compute usage and you get the reservation discount for one hour of 8 vCore PostgreSQL Single server compute usage.</br>

For the rest of these examples, assume that the Azure Database for PostgreSQL Single server reserved capacity you buy is for a 16 vCore Azure Database for PostgreSQL Single server and the rest of the reservation attributes match the running PostgreSQL Single servers.

* **Example 2**: You run two Azure Database for PostgreSQL Single servers with 8 vCore each for an hour. The 16 vCore reservation discount is applied to compute usage for both the 8 vCore Azure Database for PostgreSQL Single server.

* **Example 3**: You run one 16 vCore Azure Database for PostgreSQL Single server from 1 pm to 1:30 pm. You run another 16 vCore Azure Database for PostgreSQL Single server from 1:30 to 2 pm. Both are covered by the reservation discount.

* **Example 4**: You run one 16 vCore Azure Database for PostgreSQL Single server from 1 pm to 1:45 pm. You run another 16 vCore Azure Database for PostgreSQL Single server from 1:30 to 2 pm. You're charged the pay-as-you-go price for the 15-minute overlap. The reservation discount applies to the compute usage for the rest of the time.

To understand and view the application of your Azure Reservations in billing usage reports, see [Understand Azure reservation usage](https://docs.microsoft.com/azure/billing/billing-understand-reserved-instance-usage-ea).

## Need help? Contact us
If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
