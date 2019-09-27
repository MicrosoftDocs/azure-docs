---
title: 'Create an Azure Peering connection - CLI | Microsoft Docs'
description: 
services: networking
documentationcenter: na
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: v-meravi
---
# Peering Service - Onboarding
## Peering Service - A glimpse

Peering Service, also known as Microsoft Azure Peering Service [MAPS] is a networking service that aims at improving internet access to Microsoft SAAS services such as Office 365 and Azure. Customers can onboard MAPS by rendering the service from a MAPS certified Service Providers with no interference of Microsoft. 

## Onboarding Peering service
**1. Objective**

To get best accessibility to Microsoft network.

**2. Step required**

- Work with Internet Service provider or Internet Exchange Partner to obtain Peering Service to connect your network with Microsoft network.
- Ensure the connectivity providers are Microsoft Azure Peering Service [MAPS] certified.

**3. Result**

- Well provisioned network to access Microsoft network.
- Better performance and reliable internet connectivity to Microsoft.

## Onboarding internet telemetry 

In addition to the MAPS enabled service, customers can opt for internet telemetry metrics such as route analytics to monitor networking latency and performance in accessing Microsoft network. This can be achieved by registering peering service in Azure Portal.

**1. Objective**

In addition to MAPS enabled service, to opt for telemetry metrics such as monitoring capabilities.

**2. Steps required**

Register the Peering Service connection in the Azure Portal. To register the Peering Service in the Azure Portal following pre-requisites should be met.
Step-by-step process are discussed below:

**Pre-requisites**

**Azure account**

A valid and active Microsoft Azure account. This account is required to set up the Peering Service connection. Peering Services are resources within Azure subscriptions. 

**Connectivity provider**

You can work with Internet Service provider or Internet Exchange Partner to obtain Peering Service to connect your network with Microsoft network.
Ensure the connectivity providers are Microsoft Azure Peering Service [MAPS] certified.

## Register Peering Service connection

**Sign into the Azure portal**

From a browser, navigate to the Azure portal and sign in with your Azure account.

**Create a new Peering Service connection**

1. You can create a **Peering Service connection** by selecting the option to create a new resource. Click *Create a resource > Peering Service* as depicted below:

![first mile ](./media/peering-service-onboarding/peering-service-click-peering.png)
 
2.	Clicking on the **Peering Service**  from the **Marketplace**  page, **Peering Service**  page appears as shown below:

![first mile ](./media/peering-service-onboarding/peering-service-icon.png)

3.	Next, click on the **Create button**  below the Peering Service. By doing so, Create a peering service connection page appears as depicted below:

![first mile ](./media/peering-service-onboarding/peering-service-basic.png)
 
4.	Click on the **Basics**  tab at the left top of the **Create a peering service connection**  page.
5.	Choose the **Subscription**  and the **Resource group** associated with the subscription as shown in the screen below:

> [!Note]
> Ensure existing resource group is chosen from the Resource group drop-down list, as Peering Service supports only existing ones.
>

6.	Next, provide a **Name** to which the Peering Service instance should be created.

![first mile ](./media/peering-service-onboarding/peering-service-basic.png)
 
7.	Now, click on the **Next: Configuration**  button at the bottom. Doing so, Configuration page appears.

## Configure Peering Service connection

1.	In the **Configuration**  page, choose the location to which the **Peering Service** must be enabled by from the **Peering service location** drop-down list.

2.	Now, choose the service provider from whom the Peering Service must be procured by choosing provider name from the **Peering service provider**  drop-down list.

![first mile ](./media/peering-service-onboarding/peering-service-configuration.png)
 
3.	**Prefixes –** 
Clicking on the **Create new**  under Prefixes, text boxes appear. Now, provide **Name** of the prefix resource and the **Prefix** that is associated with the Service Provider.

4.	Provide a name to the prefix resource in the Name text box and provide the prefix range in the Prefixes text box that is associated with the service provider.

![first mile ](./media/peering-service-onboarding/peering-service-prefixes.png)
 
5.	Now, click on the **Review + create** button at the bottom right of the page. Doing so, **Review + create**  page appears as depicted below:


![first mile ](./media/peering-service-onboarding/peering-service-review-create.png)
