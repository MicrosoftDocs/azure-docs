---
title: Optimize cost of Azure Cosmos DB resources with reserved capacity
description: Learn how to buy Azure Cosmos DB reserved capacity to save on your compute costs.
author: bandersmsft
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/01/2019
ms.author: rimman
ms.reviewer: sngun
---

# Optimize cost with reserved capacity in Azure Cosmos DB

Azure Cosmos DB reserved capacity helps you save money by pre-paying for Azure Cosmos DB resources for either one year or three years. With Azure Cosmos DB reserved capacity, you can get a discount on the throughput provisioned for Cosmos DB resources. Examples of resources are databases and containers (tables, collections, and graphs).

Azure Cosmos DB reserved capacity can significantly reduce your Cosmos DB costs&mdash;up to 65 percent on regular prices with a one-year or three-year upfront commitment. Reserved capacity provides a billing discount and doesn't affect the runtime state of your Azure Cosmos DB resources.

Azure Cosmos DB reserved capacity covers throughput provisioned for your resources. It doesn't cover the storage and networking charges. As soon as you buy a reservation, the throughput charges that match the reservation attributes are no longer charged at the pay-as-you go rates. For more information on reservations, see the [Azure reservations](../billing/billing-save-compute-costs-reservations.md) article.

You can buy Azure Cosmos DB reserved capacity from the [Azure portal](https://portal.azure.com). To buy reserved capacity:

* You must be in the Owner role for at least one Enterprise or individual  subscription with pay-as-you-go rates.  
* For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com). Or, if that setting is disabled, you must be an EA Admin on the subscription.
* For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can buy Azure Cosmos DB reserved capacity.

## Determine the required throughput before purchase

The size of the reservation should be based on the total amount of throughput that the existing or soon-to-be-deployed Azure Cosmos DB resources will use. You can determine the required throughput in the following ways:

* Get the historical data for the total provisioned throughput across your Azure Cosmos DB accounts, databases, and collections across all regions. For example, you can evaluate the daily average provisioned throughput by downloading your daily usage statement from `https://account.azure.com`.

* If you're an Enterprise Agreement (EA) customer, you can download your usage file to get the Azure Cosmos DB throughput details. Refer to the **Service Type** value in the **Additional info** section of the usage file.

* You can sum up the average throughput for all the workloads on your Azure Cosmos DB accounts that you expect to run for the next one or three years. You can then use that quantity for the reservation.

## Buy Azure Cosmos DB reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com).  

2. Select **All services** > **Reservations** > **Add**.  

3. From the **Purchase reservations** pane, choose **Azure Cosmos DB** to buy a new reservation.  

4. Fill in the required fields as described in the following table:

   ![Fill the reserved capacity form](./media/cosmos-db-reserved-capacity/fill-reserved-capacity-form.png)

   |Field  |Description  |
   |---------|---------|
   |Scope   |  	Option that controls how many subscriptions can use the billing benefit associated with the reservation. It also controls how the reservation is applied to specific subscriptions. <br/><br/>  If you select **Shared**, the reservation discount is applied to Azure Cosmos DB instances that run in any subscription within your billing context. The billing context is based on how you signed up for Azure. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For pay-as-you-go customers, the shared scope is all individual subscriptions with pay-as-you-go rates created by the account administrator.  <br/><br/>  If you select **Single subscription**, the reservation discount is applied to Azure Cosmos DB instances in the selected subscription. <br/><br/> If you select **Single resource group**, the reservation discount is applied to Azure Cosmos DB instances in the selected subscription and the selected resource group within that subscription. <br/><br/> You can change the reservation scope after you buy the reserved capacity.  |
   |Subscription  |   Subscription that's used to pay for the Azure Cosmos DB reserved capacity. The payment method on the selected subscription is used in charging the upfront costs. The subscription type must be one of the following: <br/><br/>  Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P): For an Enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. <br/><br/> Individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P): For an individual subscription with pay-as-you-go rates, the charges are billed to the credit card or invoice payment method on the subscription.    |
   | Resource Group | Resource group to which the reserved capacity discount is applied. |
   |Term  |   One year or three years.   |
   |Throughput Type   |  Throughput is provisioned as request units. You can buy a reservation for the provisioned throughput for both setups - single region writes as well as multiple region writes. The throughput type has two values to choose from: 100 RU/s per hour and 100 Multi-master RU/s per hour.|
   | Reserved Capacity Units| The amount of throughput that you want to reserve. You can calculate this value by determining the throughput needed for all your Cosmos DB resources (for example, databases or containers) per region. You then multiply it by the number of regions that you'll associate with your Cosmos DB database. For example: If you have five regions with 1 million RU/sec in every region, select 5 million RU/sec for the reservation capacity purchase. |
 

5. After you fill the form, the price required to purchase the reserved capacity is calculated. The output also shows the percentage of discount you get with the chosen options. Next click **Select**

6. In the **Purchase reservations** pane, review the discount and the price of the reservation. This reservation price applies to Azure Cosmos DB resources with throughput provisioned across all regions.  

   ![Reserved capacity summary](./media/cosmos-db-reserved-capacity/reserved-capacity-summary.png)

7. Select **Review + buy** and then **buy now**. You see the following page when the purchase is successful:

After you buy a reservation, it's applied immediately to any existing Azure Cosmos DB resources that match the terms of the reservation. If you don’t have any existing Azure Cosmos DB resources, the reservation will apply when you deploy a new Cosmos DB instance that matches the terms of the reservation. In both cases, the period of the reservation starts immediately after a successful purchase.

When your reservation expires, your Azure Cosmos DB instances continue to run and are billed at the regular pay-as-you-go rates.

## Cancellation and exchanges

For help in identifying the right reserved capacity, see [Understand how the reservation discount is applied to Azure Cosmos DB](../billing/billing-understand-cosmosdb-reservation-charges.md). If you need to cancel or exchange an Azure Cosmos DB reservation, see [Reservation exchanges and refunds](../billing/billing-azure-reservations-self-service-exchange-and-refund.md).

## Next steps

The reservation discount is applied automatically to the Azure Cosmos DB resources that match the reservation scope and attributes. You can update the scope of the reservation through the Azure portal, PowerShell, Azure CLI, or the API.

*  To learn how reserved capacity discounts are applied to Azure Cosmos DB, see [Understand the Azure reservation discount](../billing/billing-understand-cosmosdb-reservation-charges.md).

* To learn more about Azure reservations, see the following articles:

   * [What are Azure reservations?](../billing/billing-save-compute-costs-reservations.md)  
   * [Manage Azure reservations](../billing/billing-manage-reserved-vm-instance.md)  
   * [Understand reservation usage for your Enterprise enrollment](../billing/billing-understand-reserved-instance-usage-ea.md)  
   * [Understand reservation usage for your Pay-As-You-Go subscription](../billing/billing-understand-reserved-instance-usage.md)
   * [Azure reservations in the Partner Center CSP program](https://docs.microsoft.com/partner-center/azure-reservations)

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
