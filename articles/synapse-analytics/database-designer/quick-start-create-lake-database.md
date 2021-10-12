---
title: Azure Synapse lake database concepts
description: Learn how database templates in Azure Synapse help to define database schema from standardized templates. 
author: prlangad
ms.author: prlangad
ms.service: synapse-analytics
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 11/02/2021
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Quick Start to create a lake database

Within this quick start we will use a very common Retail example to show you the power of the common data models in Synapse. Start by creating a new Synapse Database. This can be launched directly from the main page of synapse. 

@@ Select the industry template you want to use 

The first step is to select the corresponding tables from the database template for your project. 

For our scenario we will use the following entities
 - **Product** - A product is anything that can be offered to a market that might satisfy a want or need by potential customers. That product is the sum of all physical, psychological, symbolic, and service attributes associated with it.
 - **Transaction** - The lowest level of executable work or customer activity.
A transaction consists of one or more discrete events.
 - **TransactionLineItem** - The components of a Transaction broken down by Product and Quantity, one per line item.
 - **Party** - A party is an individual, organization, legal entity, social organization or business unit of interest to the business.
 - **Customer** - A customer is an individual or legal entity that has or has purchased a product or service.
 - **Channel** - A channel is a means by which products or services are sold and/or distributed.
The easiest way to find them is by using the search box above the different business areas that contain the tables. 
 
After all the necessary tables have been selected, you can press the “Create Database” button which will bring you back to the Data hub where the new Database is now created. 
After you have created the database make sure the storage account & filepath is set to a location where you wish to save the data. This will default to the primary storage account. 
  

After this step, Click the “Publish” button to publish the database. 
This step completes the setup of the database. It is now ready to use but does not have any data in it. 

@@ Avaialbilty with SQL/ Spark / PowerBI
