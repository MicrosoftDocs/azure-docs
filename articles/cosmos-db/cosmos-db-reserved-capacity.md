---
title: Prepay for Azure Cosmos DB resources to save money | Microsoft Docs
description: Learn how to buy Azure Cosmos DB reserved capacity to save on your compute costs.
services: cosmos-db
author: rimman
manager: kfile

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: rimman
ms.reviewer: sngun
---

# Prepay for Azure Cosmos DB resources with reserved capacity

Azure Cosmos DB reserved capacity helps you save money by pre-paying for Azure Cosmos DB resources for a period of one-year or three-years. Azure Cosmos DB reserved capacity allows you to get a discount on the throughput provisioned for Cosmos DB resources, for example, databases, containers (tables/collections/graphs). Azure Cosmos DB reserved capacity can significantly reduce your Cosmos DB costs—up to 65 percent on regular prices–with one-year or three-year upfront commitment. Reserved capacity provides a billing discount and does not affect the runtime state of your Cosmos DB resources.

Azure Cosmos DB reserved capacity covers throughput provisioned for your resources, it does not cover the storage and networking charges. As soon as you buy a reservation, the throughput charges that match the reservation attributes are no longer charged at the pay-as-you go rates. For more information on reservations, see [Azure reservations](../billing/billing-save-compute-costs-reservations.md) article. 

You can buy Azure Cosmos DB reserved capacity from the [Azure portal](https://portal.azure.com). To buy a reserved capacity:

* You must be in the Owner role for at least one Enterprise or Pay-As-You-Go subscription.  
* For Enterprise subscriptions, Azure reservation purchases must be enabled in the [EA portal.](https://ea.azure.com/)  
* For Cloud Solution Provider (CSP) program, only admin agents or sales agents can purchase Azure Cosmos DB reserved capacity.

## Determine the required throughput before purchase

The size of reservation should be based on the total amount of throughput used by the existing or soon-to-be-deployed Azure Cosmos DB resources (for example, databases or containers - collections, tables, graphs). You can determine the required throughput in the following ways:

* Navigate to [Azure Portal](https://portal.azure.com), find your Azure Cosmos DB account, open the Metrics blade, and get the average throughput/sec details from the **Throughput** tab over a period of 3-6 months. Provide this size as the reserved capacity units when purchasing.

Alternatively, if you are an Enterprise Agreement (EA), you can download your usage file and refer to **Service Type** value in the **Additional info** section of the usage file to get the Azure Cosmos DB throughput details.

You can also sum up the average throughput for all the workloads on your Azure Cosmos DB accounts that you anticipate running for the next one or three years and use that quantity for reservation.

## Buy Azure Cosmos DB reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com).  

2. Select **All services** > **Reservations** > **Add**.  

3. From the **Select Product Type** pane, choose **Azure Cosmos DB**, and then **Select** to purchase a new reservation.  

4. Fill in the required fields as described in the table below:

   ![Fill the reserved capacity form](./media/cosmos-db-reserved-capacity/fill_reserved_capacity_form.png) 

   |Field  |Description  |
   |---------|---------|
   |Name   |    Name of the reservation. This field is automatically populated with the `CosmosDB_Reservation_<timeStamp>`. You can provide a different name while creating the reservation or rename it after the reservation is created.      |
   |Subscription  |   The subscription used to pay for the Azure Cosmos DB reserved capacity. The payment method on the selected subscription is used in charging the upfront costs. The subscription type must be one of the following: <br/><br/>  [Enterprise Agreement](https://azure.microsoft.com/pricing/enterprise-agreement/) (offer number: MS-AZR-0017P) - For an enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage. <br/><br/> [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) (offer number: MS-AZR-0003P)- For Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.    |
   |Scope   |  	The reservation’s scope controls how many subscriptions can leverage the billing benefit associated with the reservation, and it controls how the reservation is applied to specific subscriptions. A Reservation has a scope of either Single or Shared subscription. If you select:   <br/><br/>  **Single subscription** - The reservation discount is applied to Azure Cosmos DB instances in the selected subscription. <br/><br/>  **Shared** – The reservation discount is applied to Azure Cosmos DB instances running in any subscription within your billing context. The billing context is determined based on how you signed up for Azure. For enterprise customers, the shared scope is the enrollment and includes all subscriptions (except dev/test subscriptions) within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.  <br/><br/> You can change the reservation scope after purchasing the reserved capacity.  |
   |Reserved capacity type   |  Reserved capacity type is the throughput provisioned in terms of request units.|
   |Reserved capacity units  |  	The amount of throughput that you want to reserve. You can calculate this value by determining the throughput needed for all of your Cosmos DB resources (for example, databases or containers) per region and then multiply it by the number of regions that you will associate with your Cosmos DB database.  <br/> For example: If you have five regions with 1 million RU/sec in every region, then select 5 million RU/sec for reservation capacity purchase.    |
   |Term  |   One year or three years.   |

5. Review the discount and the price of the reservation in the **Costs** section. This reservation price is applicable to Azure Cosmos DB resources with throughput provisioned across all regions.  

6. Select **Purchase**. You can see the following screenshot when the purchase is successful. 

   ![Fill the reserved capacity form](./media/cosmos-db-reserved-capacity/reserved_capacity_successful.png) 

After you purchase a reservation, it will be applied immediately to any existing Azure Cosmos DB resources that match the terms of the reservation. If you don’t have any existing Azure Cosmos DB resources, the reservation will apply when you deploy a new Cosmos DB instance that matches the terms of the reservation. In both cases, the period of the reservation starts immediately after a successful purchase. 

When your reservation expires, your Azure Cosmos DB instances will continue to run and are billed at the regular pay-as-you-go rates.

## Next steps

The reservation discount is applied automatically to the Azure Cosmos DB resources that match the reservation scope and attributes. You can update the scope of the reservation through Azure portal, PowerShell, CLI, or through the API.

*  To learn how reserved capacity discounts are applied to Azure Cosmos DB, see [Understand Azure Reservations discount](../billing/billing-understand-cosmosdb-reservation-charges.md)

* To learn more about Azure reservations, see the following articles:

   * [What are Azure reservations?](../billing/billing-save-compute-costs-reservations.md)  
   * [Manage Azure reservations](../billing/billing-manage-reserved-vm-instance.md).  
   * [Understand reservation usage for your Enterprise enrollment](../billing/billing-understand-reserved-instance-usage-ea.md)  
   * [Understand reservation usage for your Pay-As-You-Go subscription](../billing/billing-understand-reserved-instance-usage.md)
   * [Azure reservations in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

