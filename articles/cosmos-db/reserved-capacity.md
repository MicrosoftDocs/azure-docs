---
title: Reserved capacity in Azure Cosmos DB to Optimize cost
description: Learn how to buy Azure Cosmos DB reserved capacity to save on your compute costs.
author: seesharprun
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/20/2024
ms.author: sidandrews
ms.reviewer: rosouz
---

# Optimize cost with reserved capacity in Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB reserved capacity helps you save money by committing to a reservation for Azure Cosmos DB resources for either one year or three years. With Azure Cosmos DB reserved capacity, you can get a discount on the throughput provisioned for Azure Cosmos DB resources. Examples of resources are databases and containers (tables, collections, and graphs).

## Overview

The size of the reserved capacity purchase should be based on the total amount of throughput that the existing or soon-to-be-deployed Azure Cosmos DB resources use on an hourly basis. For example: Purchase 10,000 RU/s reserved capacity if that is your consistent hourly usage pattern. 

In this example, any provisioned throughput above 10,000 RU/s is billed with your pay-as-you-go rate. If the provisioned throughput is below 10,000 RU/s in an hour, then the extra reserved capacity for that hour is wasted.

Note that:

 * There is no limit to the number of reservations.
 * It's possible to buy more reservations at any moment.
 * It's possible to buy different reservations in the same purchase.

After you buy a reservation, it's applied immediately to any existing Azure Cosmos DB resources that match the terms of the reservation. If you don’t have any existing Azure Cosmos DB resources, the reservation applies when you deploy a new Azure Cosmos DB instance that matches the terms of the reservation. In both cases, the period of the reservation starts immediately after a successful purchase.

When your reservation expires, your Azure Cosmos DB instances continue to run and are billed at the regular pay-as-you-go rates.
You can buy Azure Cosmos DB reserved capacity from the [Azure portal](https://portal.azure.com). Pay for the reservation [upfront or with monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md). 

## Required permissions

The required permissions to purchase reserved capacity for Azure Cosmos DB are:

* You must be in the Owner role for at least one Enterprise or individual  subscription with pay-as-you-go rates.  
* For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com). Or, if that setting is disabled, you must be an EA Admin on the subscription.
* For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can buy Azure Cosmos DB reserved capacity.

## Reservations consumption

As soon as you buy a reservation, the throughput charges that match the reservation attributes are no longer charged at the pay-as-you go rates. For more information on reservations, see the [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) article.

Azure Cosmos DB consumes reservations in two different ways:

 * Autoscale database operations consume reserved capacity at a rate of 100 RU/s x 1.5 x N regions. So, if you need 10,000 RU/s for all your regions, purchase 15,000 RU/s.
 * Standard database operations consume reserved capacity at a rate of 100 RU/s x N regions. So, if you need 10,000 RU/s for all your regions, purchase 10,0000 RU/s.


## Discounts

Azure Cosmos DB reserved capacity can significantly reduce your Azure Cosmos DB costs, up to 63% on regular prices, with a one-year or three-year upfront commitment. Reserved capacity provides a billing discount and doesn't affect the state of your Azure Cosmos DB resources, including performance and availability.

We offer both fixed and progressive discounts options. Note that you can mix and match different reservations options and sizes in the same purchase.

### Fixed discounts reservations

This option, using multiples of the 100 RU/s, allows you to reserve any capacity between 100 and 999,900 RU/s, with fixed discounts:

| Reservation | One-Year Single Discount  | Three-Years  Discount
|---------|---------|---------|
| 100 RU/s |  20% | 30% |
| 100 Multi-master RU/s |  20% | 30% |

For more than 999,900 RU/s reservations, you can reduce costs with progressive discounts.

### Progressive discounts reservations

This option, using multiples of our bigger reservation sizes, allows you to reserve any capacity starting on 1,000,000 RU/s, with progressive discounts:

| Reservation  | One-Year Discount  | Three-Years Discount |
|---------|---------|---------|
| 1,000,000 RU/s | 27.0% | 39.5% | 
| 1,000,000 Multi-master | 32.0% | 44.5% |
| 2,000,000 RU/s | 28.5% | 42.3% |
| 2,000,000 Multi-master RU/s | 33.5% | 47.3% |
| 3,000,000 RU/s | 29.0% | 43.2% |
| 3,000,000 Multi-master RU/s | 34.0% | 48.2% |
| 4,000,000 RU/s | 33.0% | 47.4% |
| 4,000,000 Multi-master RU/s | 38.0% | 52.4% |
| 5,000,000 RU/s | 35.4% | 49.9% |
| 5,000,000 Multi-master RU/s |  40.4% | 54.9% |
| 10,000,000 RU/s | 40.2% | 55.0% | 
| 10,000,000 Multi-master RU/s | 45.2% | 60.0% |
| 12,500,000 RU/s | 41.2% | 56.0% |
| 12,500,000 Multi-master RU/s | 46.2% | 61.0% |
| 15,000,000 RU/s | 41.8% | 56.6% |
| 15,000,000 Multi-master RU/s | 46.8% | 61.6% |
| 20,000,000 RU/s | 42.6% | 57.5% |
| 20,000,000 Multi-master RU/s | 47.6% | 62.5% |
| 25,000,000 RU/s | 43.1% | 58.0% |
| 25,000,000 Multi-master RU/s | 48.1% | 63.0% |
| 30,000,000 RU/s | 43.4% | 58.3% |
| 30,000,000 Multi-master RU/s | 48.4% | 63.3% |

You can maximize savings with the biggest reservation for your scenario. Example: You need 2 million RU/s, one year term. If you purchase two units of the 1,000,000 RU/s reservation, your discount is 27.0%. If you purchase one unit of the 2,000,000 RU/s reservation, you have exactly the same reserved capacity, but a 28.5% discount.

Create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) to purchase any quantity of the reservations bigger than 1,000,000 RU/s.

## Sample scenario 1

Imagine this hypothetical scenario: A company is working on a new application but isn't sure about the throughput requirements, they purchased RU/s on 3 different days.

* On day 1 they purchased reserved capacity for their development environment:
  * Total of 800 RU/s: eight units of the 100 RU/s option, with a 20% discount. 
  * Scoped to the development resource group.
  * One year term, since the project lasts for nine months.
  * They paid upfront, it's a small value.
* On day 30 they purchased reserved capacity for their tests environment:
  * 750,000 RU/s: 7,500 units of the 100 RU/s option, with a 20% discount.
  * Scoped to the test subscription.
  * One year term.
  * They choose to pay monthly.
* On day 180 they purchased reserved capacity for the production environment:
  * 3,500,000 RU/s: One unit of the 3,000,000 RU/s option, with a 43.2% discount. And 5,000 units of the 100 RU/s option, with a 20% discount.
  * Scoped to the production subscription.
  * Three-years term, to maximize the discounts.
  * They choose to pay monthly too.

## Sample scenario 2

Imagine this hypothetical scenario: A company needs a 10,950,000 three-years reservation. In the same purchase they got:

 * One unit of the 10,000,000 RU/s reservation, paid monthly.
 * 9,000 units of the 100 RU/s reservation, paid monthly.
 * 500 units of the 100 RU/s reservation, paid upfront.

## Determine the required throughput before purchase

We calculate purchase recommendations based on your hourly usage pattern. Usage over the last 7, 30, and 60 days is analyzed, and reserved capacity purchase that maximizes your savings is recommended. You can view recommended reservation sizes in the Azure portal using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All services** > **Reservations** > **Add**.

3. From the **Purchase reservations** pane, choose **Azure Cosmos DB**.

4. Select the **Recommended** tab to view recommended reservations:

You can filter recommendations by the following attributes:

- **Term** (One year or Three years)
- **Billing frequency** (Monthly or Upfront)
- **Throughput Type** (RU/s vs multi-region write RU/s)

Additionally, you can scope recommendations to be within a single resource group, single subscription, or your entire Azure enrollment. 

Here's an example recommendation:

:::image type="content" source="./media/reserved-capacity/reserved-capacity-recommendation.png" alt-text="Reserved Capacity recommendations":::

This recommendation to purchase a 30,000 RU/s reservation indicates that, among three year reservations, a 30,000 RU/s reservation size maximizes your savings. In this case, the recommendation is calculated based on the past 30 days of Azure Cosmos DB usage. If this recommendation, based on the past 30 days of Azure Cosmos DB usage, isn't representative of future use, then choose another recommendation period.

For a 30,000 RU/s reservation, in standard provisioned throughput, you should buy 300 units of the 100 RU/s option.


## Buy Azure Cosmos DB reserved capacity

1. Divide the reservation size you want by 100 to calculate the number of units of the 100 RU/s option you need. The maximum quantity is 9,999 units, or 999,900 RU/s. For one million RU/s or more, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) for up to 63% discounts.

2. Sign in to the [Azure portal](https://portal.azure.com).

3. Select **All services** > **Reservations** > **Add**.  

4. From the **Purchase reservations** pane, choose **Azure Cosmos DB** to buy a new reservation.  

5. Select the correct scope, billing subscription, management group if applicable, resource group if applicable, and the reservation size. The following table explains all options:


   |Field  |Description  |
   |---------|---------|
   |Scope   |  	Option that controls how many subscriptions can use the billing benefit associated with the reservation. It also controls how the reservation is applied to specific subscriptions. <br/><br/>  If you select **Shared**, the reservation discount is applied to Azure Cosmos DB instances that run in any subscription within your billing context. The billing context is based on how you signed up for Azure. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For pay-as-you-go customers, the shared scope is all individual subscriptions with pay-as-you-go rates created by the account administrator. </br></br>If you select **Management group**, the reservation discount is applied to Azure Cosmos DB instances that run in any of the subscriptions that are a part of both the management group and billing scope. <br/><br/>  If you select **Single subscription**, the reservation discount is applied to Azure Cosmos DB instances in the selected subscription. <br/><br/> If you select **Single resource group**, the reservation discount is applied to Azure Cosmos DB instances in the selected subscription and the selected resource group within that subscription. <br/><br/> You can change the reservation scope after you buy the reserved capacity.  |
   |Subscription  |   Subscription used to pay for the Azure Cosmos DB reserved capacity. The payment method on the selected subscription is used in charging the costs. The subscription must be one of the following types: <br/><br/>  Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P): For an Enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage. <br/><br/> Individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P): For an individual subscription with pay-as-you-go rates, the charges are billed to the credit card or invoice payment method on the subscription.    |
   | Resource Group | Resource group to which the reserved capacity discount is applied. |
   |Term  |   One year or three years.   |
   |Throughput Type   |  Throughput is provisioned as request units. You can buy a reservation for the provisioned throughput for both setups - single region writes and multi-master writes. The throughput type has two values to choose from: 100 RU/s per hour and 100 multi-region writes RU/s per hour.|
   | Reserved Capacity Units| The amount of throughput that you want to reserve. You can calculate this value by determining the throughput needed for all your Azure Cosmos DB resources (for example, databases or containers) per region. You then multiply it by the number of regions that you associate with your Azure Cosmos DB database. For example: If you have five regions with 1 million RU/sec in every region, select 5 million RU/s for the reservation capacity purchase. |


6. Click on the **Add to cart** blue button on the lower right corner, and then on **View Cart** when you are done. The quantities are defined next. Note that you can add different options to the cart. Example: If you need 1,100,000 RU/s, you should add both the 1,000,000 RU/s and the 100 RU/s options to the cart. 

7. In the **Purchase reservations** pane, review the billing frequency, the quantity, the discount, and the price of the reservation. This reservation price applies to Azure Cosmos DB resources with throughput provisioned across all regions. Example: You need 500,000 RU/s with auto-renew for your production environment within a specific scope, 82,000 RU/s for your tests resource group, and 10,000 RU/s for the development subscription. You can see in the image how a reservations shopping cart looks like for this scenario.

   :::image type="content" source="./media/reserved-capacity/reserved-capacity-summary.png" alt-text="Reserved capacity summary":::

10. Select **Review + buy** and then **buy now**.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Exceeding reserved capacity

When you reserve capacity for your Azure Cosmos DB resources, you are reserving [provisioned throughput](set-throughput.md). If the provisioned throughput is exceeded, requests beyond that provisioning amount are billed using pay-as-you go rates. For more information on reservations, see the [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) article. For more information on provisioned throughput, see [provisioned throughput types](how-to-choose-offer.md#overview-of-provisioned-throughput-types).

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
   * [Understand reservation usage for your pay-as-you-go subscription](../cost-management-billing/reservations/understand-reserved-instance-usage.md)
   * [Azure reservations in the Partner Center CSP program](/partner-center/azure-reservations)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
