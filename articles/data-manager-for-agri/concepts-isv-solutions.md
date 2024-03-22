---
title: ISV solution framework in Azure Data Manager for Agriculture
description: Learn about solutions that ISVs build on top of Azure Data Manager for Agriculture. 
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 02/14/2023
ms.custom: template-concept
---

# ISV solution framework in Azure Data Manager for Agriculture

In this article, you learn how Azure Data Manager for Agriculture provides a framework for customers to use solutions built by Bayer and other independent software vendor (ISV) partners.

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

## Overview

The agriculture industry is going through a significant technology transformation. Technology is playing a key role in building sustainable agriculture.

The adoption of technology like drones, satellite imagery, and Internet of Things (IoT) devices has increased. These source systems generate large volumes of data that's stored in the cloud. Companies want to efficiently manage this data and derive actionable insights that they can use to achieve more with less.

Azure Data Manager for Agriculture provides a core technology platform that hides all the technical complexity and helps customers focus on building their core business logic and drive business value.

The solution framework is built on top of Azure Data Manager for Agriculture to provide extensibility.

:::image type="content" source="./media/solution-framework-isv-1.png" alt-text="Diagram that shows the solution framework relates to Azure Data Manager for Agriculture, solutions from independent software vendors, and customers.":::

The solution framework:

* Enables ISV partners to apply their deep domain knowledge and build industry-specific solutions on top of Azure Data Manager for Agriculture.
* Helps ISV partners generate revenue by monetizing their solutions and publishing them on Azure Marketplace.
* Provides a simplified onboarding experience for ISV partners and customers.
* Offers integration that's based on asynchronous APIs.
* Complies with data privacy standards to help ensure that ISV partners and customers have the right level of access.

## Use cases

Here are a few examples of how an ISV partner could use the solution framework to build an industry-specific solution:

* **Yield prediction model**: Build a yield model by using historical data for a specific geometry, forecast estimated crop yield for the upcoming season, and track progress.
* **Carbon emission model**: Estimate the amount of carbon emitted from a field based on imagery and sensor data for a particular farm.
* **Crop identification**: Use imagery data to identify crops growing in an area of interest.

An ISV partner can come up with its own specific scenario and build a solution.

## Bayer AgPowered Services

Bayer built the following solutions in partnership with Microsoft. A customer can install them on top of an Azure Data Manager for Agriculture instance.

* Growing Degree Days
* Crop Water Usage Maps
* Biomass Variability

To install the preceding solutions, see the [article about working with ISV solutions](./how-to-set-up-isv-solution.md).

## Next steps

* [Test the Azure Data Manager for Agriculture REST APIs](/rest/api/data-manager-for-agri)
