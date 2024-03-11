---
title: Reserved capacity in Azure Cosmos DB to Optimize cost
description: Learn how to buy Azure Cosmos DB reserved capacity to save on your compute costs.
author: seesharprun
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/11/2024
ms.author: sidandrews
ms.reviewer: jucocchi
---

# Optimize cost with reserved capacity in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB reserved capacity helps you save money by committing to a reservation for Azure Cosmos DB resources for either one year or three years. With Azure Cosmos DB reserved capacity, you can get a discount on the throughput provisioned for Azure Cosmos DB resources. Examples of resources are databases and containers (tables, collections, and graphs).

Azure Cosmos DB reserved capacity can significantly reduce your Azure Cosmos DB costs, up to 63% on regular prices, with a one-year or three-year upfront commitment. Reserved capacity provides a billing discount and doesn't affect the runtime state of your Azure Cosmos DB resources, including performance and availability.

You can buy Azure Cosmos DB reserved capacity from the [Azure portal](https://portal.azure.com). Pay for the reservation [upfront or with monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md). To buy reserved capacity:

* You must be in the Owner role for at least one Enterprise or individual  subscription with pay-as-you-go rates.  
* For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com). Or, if that setting is disabled, you must be an EA Admin on the subscription.
* For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can buy Azure Cosmos DB reserved capacity.

## Overview

The size of the reserved capacity purchase should be based on the total amount of throughput that the existing or soon-to-be-deployed Azure Cosmos DB resources will use on an hourly basis. For example: Purchase 10,000 RU/s reserved capacity if that's your consistent hourly usage pattern. 

In this example, any provisioned throughput above 10,000 RU/s will be billed using your Pay-as-you-go rate. If provisioned throughput is below 10,000 RU/s in an hour, then the extra reserved capacity for that hour will be wasted.

It is possible to buy reservations in multiples of 100 RU/s, enabling savings for all sizes of customers and workloads.

## Scenarios

Azure Cosmos DB reserved capacity covers throughput provisioned for your resources. It doesn't cover the storage and networking charges. As soon as you buy a reservation, the throughput charges that match the reservation attributes are no longer charged at the pay-as-you go rates. For more information on reservations, see the [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) article.

### Autoscale provisioned throughput scenarios

Reserved capacity is consumed by autoscale database operations at a rate of 100 RU/s x 1.5 x N regions. For the usable net RU/s per region of a reservation, the formula is inverted. 

Examples:

| Scenario | Autoscale Rate | Regions |Formula | Net RU/s per region|
|----------|---------|----------|---------|---------|
| 10,000 RU/s | 1.5 | 1 | (10,000 / 1.5) / 1 | 6,666.66 |
| 10,000 RU/s | 1.5 | 2 | (10,000 / 1.5) / 2 | 3,333.33 |
| 15,000 RU/s | 1.5 | 1 | (15,000 / 1.5) / 1 | 10,000 |
| 30,000 RU/s | 1.5 | 2 | (30,000 / 1.5) / 2 | 10,000 |


### Standard provisioned throughput scenarios

Reserved capacity is consumed by standard database operations at a rate of 100 RU/s x N regions. For the usable net RU/s per region of a reservation, the formula is inverted. 

Examples:

| Scenario |  Regions |Formula | Net RU/s per region|
|----------|----------|---------|---------|
| 10,000 RU/s | 1 | 10,000 / 1 | 10,000 |
| 10,000 RU/s | 2 | 10,000 / 2 | 5,000 |
| 15,000 RU/s | 1 | 15,000 / 1 | 15,000 |
| 30,000 RU/s | 2 | 30,000 / 2 | 15,000 |


## Discounts for reservations smaller than one million RU/s

You can buy up to 9999 units of the 100 RU/s option with the discounts rates below:

|Commitment  |Discount  |
|---------|---------|
| One-year | 20% | 
| Three-years | 30% |

## Discounts for reservations equal or bigger than one million RU/s

You can also buy any of the following options:

|Reservation Size in RU/s  | One-Year Single Region Discount  | Three-Years Single Region Discount | One-Year Multi Regions Discount  | Three-Years Multi Regions Discount | 
|---------|---------|---------|---------|---------|
| 1,000,000 | 27.0% | 39.5% | 32.0% | 44.5% |
| 2,000,000 | 28.5% | 42.3% | 33.5% | 47.3% |
| 3,000,000 | 29.0% | 43.2% | 34.0% | 48.2% |
| 4,000,000 | 33.0% | 47.4% | 38.0% | 52.4% |
| 5,000,000 | 35.4% | 49.9% | 40.4% | 54.9% |
| 10,000,000 | 40.2% | 55.0% | 45.2% | 60.0% |
| 12,500,000 | 41.2% | 56.0% | 46.2% | 61.0% |
| 15,000,000 | 41.8% | 56.6% | 46.8% | 61.6% |
| 20,000,000 | 42.6% | 57.5% | 47.6% | 62.5% |
| 25,000,000 | 43.1% | 58.0% | 48.1% | 63.0% |
| 30,000,000 | 43.4% | 58.3% | 48.4% | 63.3% |

Please [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) to purchase these reservations bigger than ope million RU/s.

### Existing reservations



## Determine the required throughput before purchase

We calculate purchase recommendations based on your hourly usage pattern. Usage over last 7, 30 and 60 days is analyzed, and reserved capacity purchase that maximizes your savings is recommended. You can view recommended reservation sizes in the Azure portal using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All services** > **Reservations** > **Add**.

3. From the **Purchase reservations** pane, choose **Azure Cosmos DB**.

4. Select the **Recommended** tab to view recommended reservations:

You can filter recommendations by the following attributes:

- **Term** (1 year or 3 years)
- **Billing frequency** (Monthly or Upfront)
- **Throughput Type** (RU/s vs multi-region write RU/s)

Additionally, you can scope recommendations to be within a single resource group, single subscription, or your entire Azure enrollment. 

Here's an example recommendation:

:::image type="content" source="./media/reserved-capacity/reserved-capacity-recommendation.png" alt-text="Reserved Capacity recommendations":::

This recommendation to purchase a 30,000 RU/s reservation indicates that, among 3 year reservations, a 30,000 RU/s reservation size will maximize savings. In this case, the recommendation is calculated based on the past 30 days of Azure Cosmos DB usage. If this customer expects that the past 30 days of Azure Cosmos DB usage is representative of future use, they would maximize savings by purchasing a 30,000 RU/s reservation.

For a 30,000 RU/s reservation, in standard provisioned throughput, you should buy 300 units of the 100 RU/s option.


## Buy Azure Cosmos DB reserved capacity

1. Devide the reservation size by 100 to calculate the number of units of the 100 RU/s option you need. The maximum quantity is 9999 units, or 999,900 RU/s. For more than this, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) for up to 63% discounts.

2. Sign in to the [Azure portal](https://portal.azure.com).

3. Select **All services** > **Reservations** > **Add**.  

4. From the **Purchase reservations** pane, choose **Azure Cosmos DB** to buy a new reservation.  

5. Fill in the required fields as described in the following table:

   :::image type="content" source="./media/reserved-capacity/fill-reserved-capacity-form.png" alt-text="Fill the reserved capacity form":::

   |Field  |Description  |
   |---------|---------|
   |Scope   |  	Option that controls how many subscriptions can use the billing benefit associated with the reservation. It also controls how the reservation is applied to specific subscriptions. <br/><br/>  If you select **Shared**, the reservation discount is applied to Azure Cosmos DB instances that run in any subscription within your billing context. The billing context is based on how you signed up for Azure. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For pay-as-you-go customers, the shared scope is all individual subscriptions with pay-as-you-go rates created by the account administrator. </br></br>If you select **Management group**, the reservation discount is applied to Azure Cosmos DB instances that run in any of the subscriptions that are a part of both the management group and billing scope. <br/><br/>  If you select **Single subscription**, the reservation discount is applied to Azure Cosmos DB instances in the selected subscription. <br/><br/> If you select **Single resource group**, the reservation discount is applied to Azure Cosmos DB instances in the selected subscription and the selected resource group within that subscription. <br/><br/> You can change the reservation scope after you buy the reserved capacity.  |
   |Subscription  |   Subscription that's used to pay for the Azure Cosmos DB reserved capacity. The payment method on the selected subscription is used in charging the costs. The subscription must be one of the following types: <br/><br/>  Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P): For an Enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage. <br/><br/> Individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P): For an individual subscription with pay-as-you-go rates, the charges are billed to the credit card or invoice payment method on the subscription.    |
   | Resource Group | Resource group to which the reserved capacity discount is applied. |
   |Term  |   One year or three years.   |
   |Throughput Type   |  Throughput is provisioned as request units. You can buy a reservation for the provisioned throughput for both setups - single region writes as well as multiple region writes. The throughput type has two values to choose from: 100 RU/s per hour and 100 multi-region writes RU/s per hour.|
   | Reserved Capacity Units| The amount of throughput that you want to reserve. You can calculate this value by determining the throughput needed for all your Azure Cosmos DB resources (for example, databases or containers) per region. You then multiply it by the number of regions that you'll associate with your Azure Cosmos DB database. For example: If you have five regions with 1 million RU/sec in every region, select 5 million RU/sec for the reservation capacity purchase. |


6. After you fill the form, the price required to purchase the reserved capacity is calculated. The output also shows the percentage of discount you get with the chosen options. Next click **Select**

7. In the **Purchase reservations** pane, review the discount and the price of the reservation. This reservation price applies to Azure Cosmos DB resources with throughput provisioned across all regions.  

   :::image type="content" source="./media/reserved-capacity/reserved-capacity-summary.png" alt-text="Reserved capacity summary":::

8. Select **Review + buy** and then **buy now**. You see the following page when the purchase is successful:

After you buy a reservation, it's applied immediately to any existing Azure Cosmos DB resources that match the terms of the reservation. If you don’t have any existing Azure Cosmos DB resources, the reservation will apply when you deploy a new Azure Cosmos DB instance that matches the terms of the reservation. In both cases, the period of the reservation starts immediately after a successful purchase.

When your reservation expires, your Azure Cosmos DB instances continue to run and are billed at the regular pay-as-you-go rates.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Exceeding reserved capacity

When you reserve capacity for your Azure Cosmos DB resources, you are reserving [provisioned throughput](set-throughput.md). If the provisioned throughput is exceeded, requests beyond that provisioning will be billed using pay-as-you go rates. For more information on reservations, see the [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) article. For more information on provisioned throughput, see [provisioned throughput types](how-to-choose-offer.md#overview-of-provisioned-throughput-types).

## Limitations

 * Currently we don't support reservations for vCore based services.
 * Currently we don't support reservations for Serverless accounts.
 * Currently we don't support reservations for storage or network.

## Next steps

The reservation discount is applied automatically to the Azure Cosmos DB resources that match the reservation scope and attributes. You can update the scope of the reservation through the Azure portal, PowerShell, Azure CLI, or the API.

*  To learn how reserved capacity discounts are applied to Azure Cosmos DB, see [Understand the Azure reservation discount](../cost-management-billing/reservations/understand-cosmosdb-reservation-charges.md).

* To learn more about Azure reservations, see the following articles:

   * [What are Azure reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)  
   * [Manage Azure reservations](../cost-management-billing/reservations/manage-reserved-vm-instance.md)  
   * [Understand reservation usage for your Enterprise enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)  
   * [Understand reservation usage for your Pay-As-You-Go subscription](../cost-management-billing/reservations/understand-reserved-instance-usage.md)
   * [Azure reservations in the Partner Center CSP program](/partner-center/azure-reservations)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
