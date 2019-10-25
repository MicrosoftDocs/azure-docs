---
title: Optimize costs for Blob storage with reserved capacity in Azure Storage 
description: Learn how to list blob containers in your Azure Storage account using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 11/01/2019
ms.author: tamram
ms.subservice: blobs
---

# Optimize costs for block blobs and Azure Data Lake Storage Gen2 with reserved capacity

You can save money on storage costs for blob data with Azure Storage reserved capacity. Azure Storage reserved capacity offers you a discount on capacity for block blobs and for Azure Data Lake Storage Gen2 in standard storage accounts when you commit to a reservation for either one year or three years.

Azure Storage reserved capacity can significantly reduce your capacity costs for block blobs and Azure Data Lake Storage Gen2 workloads. Depending on the duration of your reservation, the total capacity you choose to reserve, and the access tier that you've chosen for your storage account, you can save up to 38% on capacity costs.

Azure Storage reserved capacity covers throughput provisioned for your resources. It doesn't cover the storage and networking charges. As soon as you buy a reservation, the throughput charges that match the reservation attributes are no longer charged at the pay-as-you go rates. For more information on reservations, see the Azure reservations article.

 to 65 percent on regular prices with a one-year or three-year upfront commitment. Reserved capacity provides a billing discount and doesn't affect the runtime state of your Azure Cosmos DB resources.

Azure Storage Reserved Capacity provides options to purchase standard storage capacity in units of 100TB and 1PB per month blocks for one-year or three-years terms. To purchase Azure Storage Reserved Capacity, you can choose the required number of units for Hot, Cool or Archive storage tier on any of the available storage redundancies (e.g. LRS, ZRS, GRS), and for a specific region (e.g., US West 2). Additionally, you can choose to pay with a single, upfront payment or monthly payments. 


Azure Storage reserved capacity covers throughput provisioned for your resources. It doesn't cover the storage and networking charges. As soon as you buy a reservation, the throughput charges that match the reservation attributes are no longer charged at the pay-as-you go rates. For more information on reservations, see the Azure reservations article.


You can buy Azure Storage reserved capacity from the Azure portal. Pay for the reservation up front or with monthly payments. For more information about purchasing with monthly payments, see [Purchase Azure reservations with up front or monthly payments](/azure/billing/billing-monthly-payments-reservations)

To buy reserved capacity: