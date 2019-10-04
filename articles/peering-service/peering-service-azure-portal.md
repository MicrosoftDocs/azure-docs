---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: v-meravi
---

# Create Peering Service – Azure Portal

## What is Peering Service? 

Peering Service, also known as Microsoft Azure Peering Service [MAPS] is a networking service that aims at improving the customer’s internet experience. It provides better accessibility to Microsoft SAAS services such as Office 365 and Azure. Microsoft has partnered with Internet Service Providers and Internet Exchange Partners to provide reliable internet connectivity by meeting the technical requirements as listed below:
- Local redundancy
- Geo redundancy
- Shortest network path

In this article, you will learn how to cerate a Peering Service connection.

## Create a Peering Service Connection

-  **Sign into the Azure portal**
From a browser, navigate to the Azure portal and sign in with your Azure account.

- **Create a new Peering Service connection**

1. You can create a **Peering Service connection** by selecting the option to create a new resource. Click *Create a resource > Peering Service* as depicted below:
 
2.	Clicking on the **Peering Service**  from the **Marketplace**  page, **Peering Service**  page appears as shown below:
 
3.	Next, click on the **Create button**  below the Peering Service. By doing so, Create a peering service connection page appears as depicted below:
 
4.	Click on the **Basics**  tab at the left top of the **Create a peering service connection**  page.
5.	Choose the **Subscription**  and the **Resource group** associated with the subscription as shown in the screen below:

[!Note]
Ensure existing resource group is chosen from the Resource group drop-down list, as Peering Service supports only existing ones.

6.	Next, provide a Name to which the Peering Service instance should be created.
 
7.	Now, click on the **Next: Configuration**  button at the bottom. Doing so, Configuration page appears.

## Configure Peering Service connection

1.	In the **Configuration**  page, choose the location to which the **Peering Service** must be enabled by from the **Peering service location** drop-down list.

2.	Now, choose the service provider from whom the Peering Service must be procured by choosing provider name from the **Peering service provider**  drop-down list.
 
3.	**Prefixes –** 
Clicking on the **Create new**  under Prefixes, text boxes appear. Now, provide **Name** of the prefix resource and the **Prefix** that is associated with the Service Provider.

4.	Provide a name to the prefix resource in the Name text box and provide the prefix range in the Prefixes text box that is associated with the service provider.
 
5.	Now, click on the **Review + create** button at the bottom right of the page. Doing so, **Review + create**  page appears as depicted below:
 

