---
title: ISV solution framework in Azure Data Manager for Agriculture
description: Provides information on using solutions from ISVs 
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 02/14/2023
ms.custom: template-concept
---

# What is our Solution Framework?

In this article, you learn how Azure Data Manager for Agriculture provides a framework for customer to use solutions built by Bayer and other ISV Partners.

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

## Overview

The agriculture industry is going through a significant technology transformation where technology is playing a key role towards building sustainable agriculture.  With the increase in adoption of technology like drones, satellite imagery, IOT devices – there are large volumes of data generated from these source systems and stored in cloud. Today, companies are looking at ways to efficiently manage this data and derive actionable insights that are provided to the user timely and help achieve more with less. Data Manager for Agriculture provides core technology platform that hides all the technical complexity and helps customers focus on their building their core business logic and drive business value.

The solution framework is built on top of Data Manager for Agriculture that provides extensibility capabilities. It enables our Independent Software Vendor (ISV) partners to apply their deep domain knowledge and develop specialized domain specific industry solutions to top of the core platform.  The solution framework provides below capabilities:

:::image type="content" source="./media/solution-framework-isv-1.png" alt-text="Screenshot showing ISV solution framework.":::

* Enables ISV Partners to easily build industry specific solutions to top of Data Manager for Agriculture.  
* Helps ISVs generate revenue by monetizing their solution and publishing it on the Azure Marketplace* Provides simplified onboarding experience for ISV Partners and customers.
* Asynchronous Application Programming Interface (API) based integration
* Data privacy complaint ensuring the right level of access to customers and ISV Partners.
* Hides all the technical complexity of the platform and allows ISVs and customers to focus on the core business logic

## Use cases

 Following are some of the examples of use cases on how an ISV partner could use the solution framework to build an industry specific solution.

* Yield Prediction Model: An ISV partner can build a yield model using historical data for a specific geometry and track periodic progress. The ISV can then enable forecast of estimated yield for the upcoming season.
* Carbon Emission Model: An ISV partner can estimate the amount of carbon emitted from the field based upon the imagery, sensors data for a particular farm.
* Crop Identification: Use imagery data to identify crop growing in an area of interest.

The above list has only a few examples but an ISV partner can come with their own specific scenario and build a solution. 

## Bayer AgPowered Services

Additionally, Bayer has built the below Solutions in partnership with Microsoft and can be installed on top of customer's ADMA instance.
* Growing Degree Days
* Crop Water Usage Maps
* Biomass Variability

To install the above Solutions, please refer to [this](./how-to-set-up-isv-solution.md) article.

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).