---
title: Understand how the reservation discount is applied to Azure Cosmos DB | Microsoft Docs
description: Learn how reservation discount is applied to provisioned throughput (RU/s) in Azure Cosmos DB.
services: cosmos-db
author: rimman
manager: kfile

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/17/2018
ms.author: rimman
---

# Understand how the reservation discount is applied to Azure Cosmos DB

After you buy an Azure Cosmos DB reserved capacity, the reservation discount is automatically applied to Azure Cosmos DB resources that match the attributes and quantity of the reservation. A reservation covers the throughput provisioned for Azure Cosmos DB resources and it doesn’t cover software, networking, storage or pre-defined container charges.

For Reserved Virtual Machine Instances and Azure SQL Databases, see [Understand Azure Reserved VM Instances discount]() and [Understand Azure Reserved capacity for SQL Databases]().

## Reservation discount applied to Azure Cosmos DB accounts

Reservation discount is applied to provisioned throughput (RU/s) on an hour-by-hour basis. For Azure Cosmos DB resources that don't run the full hour, the reservation discount is automatically applied to other Cosmos DB resources that match the reservation attributes. The discount can apply to Azure Cosmos DB resources that are running concurrently. If you don't have Cosmos DB resources that run for the full hour and that match the reservation attributes, you don't get the full benefit of the reservation discount for that hour.

* The discounts are tiered which means reservations with higher request units provide higher discounts.  

* The reservation purchase will apply discounts to all regions in the ratio equivalent to the regional on-demand pricing. For reservation discount ratio in each region see [reservation discount per region]() section of this article.

## Reservation discount per region
The reservation discount applies to meter usage in the following ratio:

Meter Description 	Region 	Ratio 
Azure Cosmos DB - 100 RU/s/Hour - AP Southeast 	AP Southeast 	1 
Azure Cosmos DB - 100 RU/s/Hour - AP East 	AP East 	1 
Azure Cosmos DB - 100 RU/s/Hour - EU North 	EU North 	1 
Azure Cosmos DB - 100 RU/s/Hour - KR South 	KR South 	1 
Azure Cosmos DB - 100 RU/s/Hour - EU West 	EU West 	1 
Azure Cosmos DB - 100 RU/s/Hour - KR Central 	KR Central 	1 
Azure Cosmos DB - 100 RU/s/Hour - UK South 	UK South 	1 
Azure Cosmos DB - 100 RU/s/Hour - UK West 	UK West 	1 
Azure Cosmos DB - 100 RU/s/Hour - UK North 	UK North 	1 
Azure Cosmos DB - 100 RU/s/Hour - UK South 2 	UK South 2 	1 
Azure Cosmos DB - 100 RU/s/Hour - US East 2 	US East 2 	1 
Azure Cosmos DB - 100 RU/s/Hour - US North Central 	US North Central 	1 
Azure Cosmos DB - 100 RU/s/Hour - US West 	US West 	1 
Azure Cosmos DB - 100 RU/s/Hour - US Central 	US Central 	1 
Azure Cosmos DB - 100 RU/s/Hour - US West 2 	US West 2 	1 
Azure Cosmos DB - 100 RU/s/Hour - US West Central 	US West Central 	1 
Azure Cosmos DB - 100 RU/s/Hour - US East 	US East 	1 
Azure Cosmos DB - 100 RU/s/Hour - SA North 	SA North 	1 
Azure Cosmos DB - 100 RU/s/Hour - SA West 	SA West 	1 
Azure Cosmos DB - 100 RU/s/Hour - IN South 	IN South 	1.0375 
Azure Cosmos DB - 100 RU/s/Hour - CA East 	CA East 	1.1 
Azure Cosmos DB - 100 RU/s/Hour - JA East 	JA East 	1.125 
Azure Cosmos DB - 100 RU/s/Hour - JA West 	JA West 	1.125 
Azure Cosmos DB - 100 RU/s/Hour - IN West 	IN West 	1.1375 
Azure Cosmos DB - 100 RU/s/Hour - IN Central 	IN Central 	1.1375 
Azure Cosmos DB - 100 RU/s/Hour - AU East 	AU East 	1.15 
Azure Cosmos DB - 100 RU/s/Hour - CA Central 	CA Central 	1.2 
Azure Cosmos DB - 100 RU/s/Hour - FR Central 	FR Central 	1.25 
Azure Cosmos DB - 100 RU/s/Hour - BR South 	BR South 	1.5 
Azure Cosmos DB - 100 RU/s/Hour - AU Central 	AU Central 	1.5 
Azure Cosmos DB - 100 RU/s/Hour - AU Central 2 	AU Central 2 	1.5 
Azure Cosmos DB - 100 RU/s/Hour - FR South 	FR South 	1.625 

## Examples

Consider the following requirements for a reservation:

* Required throughput: 50,000 RU/s   

* Regions used: 2, for reservation discount ratio in each region see [reservation discount per region]() section of this article.  
* In this case your total on-demand charges are for 500 quantity of 100 RU/s meter  in these 2 regions, for a total RU/s consumption of 100,000 every hour. 

If your deployments were in the following regions, then a reservation purchase of 100,000 RU/s would completely balance your on-demand charges for RU/s. 


|Column1  |Column2  |Column3  |Column4  |
|---------|---------|---------|---------|
|Row1     |         |         |         |
|Row2     |         |         |         |
|Row3     |         |         |         |


Meter Description	Region	Usage (RU/s)	Reservation discount applied to RU/s
Azure Cosmos DB - 100 RU/s/Hour - US North Central	US North Central	50,000 	50,000
Azure Cosmos DB - 100 RU/s/Hour - US West	US West	50,000	50,000

If your deployments were in the following regions, then a reservation purchase of 100,000 RU/s would provide discounts as follows (Assuming that AU Central 2 usage was discounted first):


|Column1  |Column2  |Column3  |Column4  |
|---------|---------|---------|---------|
|Row1     |         |         |         |
|Row2     |         |         |         |
|Row3     |         |         |         |


Meter Description	Region	Usage (RU/s)	Reservation discount applied to RU/s
Azure Cosmos DB - 100 RU/s/Hour - AU Central 2	AU Central 2	50,000	50,000
Azure Cosmos DB - 100 RU/s/Hour - FR South	FR South	50,000	15,384

**Logic behind the calculation** 

* Using the ratios in the first table: 50,000 units of usage in AU Central 2 corresponds to 75,000 (Usage * reservation_discount_ratio for that region) that is: 50,000 * 1.5 = 75,000 normalized usage. For reservation discount ratio in each region see [reservation discount per region]() section of this article.  

* 100,000 units of normalized reservation purchase would offset the 75,000 usage and the left over 25,000 units will apply discount to up to 25,000 / 1.625  units of usage in FR South. The Azure billing system will assign the Reservation billing benefit to the first instance that is processed which matches the Reservation configuration

To understand and view the application of your Azure reservations in billing usage reports, see [Understand Azure reservation usage]().

## Next steps

To learn more about Azure Reservations, see the following articles:

* What are Azure Reservations?  

* Prepay for Azure Cosmos DB resources with Azure Cosmos DB reserved capacity  

* Prepay for SQL Database compute resources with Azure SQL Database reserved capacity

   * Manage Azure Reservations  
   * Understand reservation usage for your Pay-As-You-Go subscription  
   * Understand reservation usage for your Enterprise enrollment  
   * Understand reservation usage for CSP subscriptions

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

