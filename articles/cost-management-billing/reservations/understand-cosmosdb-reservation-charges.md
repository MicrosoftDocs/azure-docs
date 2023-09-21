---
title: Understand reservation discount in Azure Cosmos DB
description: Learn how reservation discount is applied to provisioned throughput (RU/s) in Azure Cosmos DB.
author: bandersmsft
ms.author: banders
ms.reviewer: sngun
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 12/06/2022
---
# Understand how the reservation discount is applied to Azure Cosmos DB

After you buy an Azure Cosmos DB reserved capacity, the reservation discount is automatically applied to Azure Cosmos DB resources that match the attributes and quantity of the reservation. A reservation covers the throughput provisioned for Azure Cosmos DB resources. It doesn’t cover software, networking, storage, or predefined container charges.

## How reservation discount is applied

A reservation discount is "*use-it-or-lose-it*". So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are *lost*.

Stopped resources are billed and continue to use reservation hours. Deallocate or delete resources or scale-in other resources to use your available reservation hours with other workloads. 

## Reservation discount applied to Azure Cosmos DB accounts

A reservation discount is applied to [provisioned throughput](../../cosmos-db/request-units.md) in terms of request units per second (RU/s) on an hour-by-hour basis. For Azure Cosmos DB resources that don't run the full hour, the reservation discount is automatically applied to other Azure Cosmos DB resources that match the reservation attributes. The discount can apply to Azure Cosmos DB resources that are running concurrently. If you don't have Azure Cosmos DB resources that run for the full hour and that match the reservation attributes, you don't get the full benefit of the reservation discount for that hour.

The discounts are tiered. Reservations with higher request units provide higher discounts.

The reservation purchase will apply discounts to all regions in the ratio equivalent to the regional on-demand pricing. For reservation discount ratios in each region, see the [Reservation discount per region](#reservation-discount-per-region) section of this article.

## Reservation discount per region
The reservation discount is applied to Azure Cosmos DB throughput costs on an hour-by-hour basis. It's applied at either the single subscription or the enrolled/account scope. The reservation discount applies to meter usage in different regions in the following ratios:

|Meter description  |Region |Ratio  |
|---------|---------|---------|
|Azure Cosmos DB - 100 RU/s/Hour - AP Southeast  |  AP Southeast    |   1      |
|Azure Cosmos DB - 100 RU/s/Hour - AP East |   AP East   |    1     |
|Azure Cosmos DB - 100 RU/s/Hour - EU North|  EU North       |    1     |
|Azure Cosmos DB - 100 RU/s/Hour - KR South|    KR South     |     1    |
|Azure Cosmos DB - 100 RU/s/Hour - EU West|    EU West     |      1   |
|Azure Cosmos DB - 100 RU/s/Hour - KR Central|   KR Central    |       1  |
|Azure Cosmos DB - 100 RU/s/Hour - UK South|   UK South      |     1    |
|Azure Cosmos DB - 100 RU/s/Hour - UK West|   UK West      |    1     |
|Azure Cosmos DB - 100 RU/s/Hour - UK North |   UK North    |     1    |
|Azure Cosmos DB - 100 RU/s/Hour - UK South 2|   UK South 2      |     1    |
|Azure Cosmos DB - 100 RU/s/Hour - US East 2|  US East 2     |     1    |
|Azure Cosmos DB - 100 RU/s/Hour - US North Central|   US North Central      |     1    |
|Azure Cosmos DB - 100 RU/s/Hour - US West|   US West      |     1    |
|Azure Cosmos DB - 100 RU/s/Hour - US Central| US Central        |     1    |
|Azure Cosmos DB - 100 RU/s/Hour - US West 2|   US West 2      |      1   |
|Azure Cosmos DB - 100 RU/s/Hour - US West Central|   US West Central      |       1  |
|Azure Cosmos DB - 100 RU/s/Hour - US East|   US East      |  1       |
|Azure Cosmos DB - 100 RU/s/Hour - SA North|     SA North    |   1      |
|Azure Cosmos DB - 100 RU/s/Hour - SA West |    SA West      |    1     |
|Azure Cosmos DB - 100 RU/s/Hour - IN South|    IN South     |    1.0375    |
|Azure Cosmos DB - 100 RU/s/Hour - CA East|   CA East      |    1.1      |
|Azure Cosmos DB - 100 RU/s/Hour - JA East|   JA East      |    1.125     |
|Azure Cosmos DB - 100 RU/s/Hour - JA West|     JA West    |   1.125       |
|Azure Cosmos DB - 100 RU/s/Hour - IN West|     IN West    |    1.1375     |
|Azure Cosmos DB - 100 RU/s/Hour - IN Central|    IN Central     |  1.1375       |
|Azure Cosmos DB - 100 RU/s/Hour - AU East|     AU East    |   1.15       |
|Azure Cosmos DB - 100 RU/s/Hour - CA Central|  CA Central       |   1.2       |
|Azure Cosmos DB - 100 RU/s/Hour - FR Central|   FR Central      |    1.25      |
|Azure Cosmos DB - 100 RU/s/Hour - BR South|  BR South       |   1.5      |
|Azure Cosmos DB - 100 RU/s/Hour - AU Central|   AU Central      |   1.5      |
|Azure Cosmos DB - 100 RU/s/Hour - AU Central 2| AU Central 2        |    1.5     |
|Azure Cosmos DB - 100 RU/s/Hour - FR South|    FR South     |    1.625     |

## Scenarios that show how the reservation discount is applied

Consider the following requirements for a reservation:

* Required throughput: 50,000 RU/s  
* Regions used: 2

In this case, your total on-demand charges are for 500 quantity of 100 RU/s meter in these two regions. The total RU/s consumption is 100,000 every hour.

**Scenario 1**

For example, assume that you need Azure Cosmos DB deployments in the US North Central and US West regions. Each region has a throughput consumption of 50,000 RU/s. A reservation purchase of 100,000 RU/s would completely balance your on-demand charges.

The discount that a reservation covers is computed as: throughput consumption * reservation_discount_ratio_for_that_region. For the US North Central and US West regions, the reservation discount ratio is 1. So, the total discounted RU/s are 100,000. This value is computed as: 50,000 * 1 + 50,000 * 1 = 100,000 RU/s. You don't have to pay any additional charges at the regular pay-as-you-go rates.

|Meter description | Region |Throughput consumption (RU/s) |Reservation discount applied to RU/s |
|---------|---------|---------|---------|
|Azure Cosmos DB - 100 RU/s/Hour - US North Central  |   US North Central  | 50,000  | 50,000  |
|Azure Cosmos DB - 100 RU/s/Hour - US West  |  US West   |  50,000  |  50,000 |

**Scenario 2**

For example, assume that you need Azure Cosmos DB deployments in the AU Central 2 and FR South regions. Each region has a throughput consumption of 50,000 RU/s. A reservation purchase of 100,000 RU/s would be applicable as follows (assuming that AU Central 2 usage was discounted first):

|Meter description | Region |Throughput consumption (RU/s) |Reservation discount applied to RU/s |
|---------|---------|---------|---------|
|Azure Cosmos DB - 100 RU/s/Hour - AU Central 2  |  AU Central 2   |  50,000  |  50,000   |
|Azure Cosmos DB - 100 RU/s/Hour - FR South  |  FR South   |  50,000 |  15,384  |

*  A usage of 50,000 units in the AU Central 2 region corresponds to 75,000 RU/s of billable reservation usage (or normalized usage). This value is computed as: throughput consumption * reservation_discount_ratio_for_that_region. The computation equals 75,000 RU/s of billable or normalized usage. This value is computed as: 50,000 * 1.5 = 75,000 RU/s.

* A usage of 50,000 units in the FR South region corresponds to  50,000 * 1.625 = 81,250 RU/s reservation is needed.

* Total reservation purchase is 100,000. Because AU central2 region uses 75,000 RU/s which leaves 25,000 RU/s for the other region.

* For FR south region 25,000 RU/s reservation purchase is used and it leaves 56,250 reservation RU/s (81,250 – 25,000 = 56,250 Ru/s).

* 56,250 RU/s are required when using reservation. To pay for these RU/s with regular pricing, you need to convert it into regular RU/s by dividing with the reservation ratio 56,250 / 1.625 = 34,616 RU/s. Regular RU/s are charged at the normal pay-as-you-go rates.

The Azure billing system will assign the reservation billing benefit to the first instance that is processed and that matches the reservation configuration. For example, it's AU Central 2 in this case.

To understand and view the application of your Azure reservations in billing usage reports, see [Understand Azure reservation usage](understand-reserved-instance-usage-ea.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure reservations, see the following articles:

* [What are reservations for Azure](save-compute-costs-reservations.md)  
* [Prepay for Azure Cosmos DB resources with Azure Cosmos DB reserved capacity](../../cosmos-db/cosmos-db-reserved-capacity.md)  
* [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](/azure/azure-sql/database/reserved-capacity-overview)  
* [Manage reservations for Azure](manage-reserved-vm-instance.md)  
* [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)  
* [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
* [Understand reservation usage for CSP subscriptions](/partner-center/azure-reservations)
