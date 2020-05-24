---
title: Azure Marketplace IoT Edge module offers 
description: Learn about publishing IoT Edge module offers in Azure Marketplace.
author: qianw211
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: dsindona
---

# IoT Edge modules

The [Azure IoT Edge](https://azure.microsoft.com/services/iot-edge/) platform is backed by Microsoft Azure.  This platform enables users to deploy cloud workloads to run directly on IoT devices.  An IoT Edge module can run offline workloads and do data analysis locally. This offer type helps to save bandwidth, safeguard local and sensitive data, and offers low-latency response time.  You now have the options to take advantage of these pre-built workloads. Until now, only a handful of first-party solutions from Microsoft were available.  You had to invest the time and resources into building your own custom IoT solutions.

With [IoT Edge modules in the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1), we now have a single destination for publishers to expose and sell their solutions to the IoT audience. IoT developers can ultimately find and purchase capabilities to accelerate their solution development.  

## Key benefits of IoT Edge modules in Azure Marketplace

| **For publishers**    | **For customers (IoT developers)**  |
| :------------------- | :-------------------|
| Reach millions of developers looking to build and deploy IoT Edge solutions.  | Compose an IoT Edge solution with the confidence of using secure and tested components. |
| Publish once and run across any IoT Edge hardware that supports containers. | Reduce time to market by finding and deploying 1st and 3rd party IoT Edge modules for specific needs. |
| Monetize with flexible billing options <ul> <li> Free and Bring Your Own License (BYOL). </li> </ul> | Make purchases with your choice of billing models. <ul> <li> Free and Bring Your Own License (BYOL). </li> </ul> |

## What is an IoT Edge module?

Azure IoT Edge lets you deploy and manage business logic on the edge in the form of modules. Azure IoT Edge modules are the smallest computation units managed by IoT Edge, and can contain Microsoft services (such as Azure Stream Analytics), 3rd-party services or your own solution-specific code. To learn more about IoT Edge modules, see [Understand Azure IoT Edge modules](https://docs.microsoft.com/azure/iot-edge/iot-edge-modules).

**What is the difference between a Container offer type and an IoT Edge module offer type?**

The IoT Edge module offer type is a specific type of container running on an IoT Edge device. It comes with default configuration settings to run in the IoT Edge context, and optionally uses the IoT Edge module SDK to be integrated with the IoT Edge runtime.

## Publishing your IoT Edge module

**Selecting the right storefront**

IoT Edge Modules are only published to the Azure Marketplace, AppSource does not apply.  For more information on the differences and target audience across storefronts, see [determining the publishing option for your solution](https://docs.microsoft.com/azure/marketplace/determine-your-listing-type).
 
**Billing options**

The marketplace currently supports **Free** and **Bring Your Own License (BYOL)** billing options for IoT Edge modules.
 
**Publishing options**

In all cases, IoT Edge modules should select the **Transact** publishing option.  See [choose a publishing option](https://docs.microsoft.com/azure/marketplace/determine-your-listing-type) for more details on publishing options.  

## Eligibility Criteria

All the terms of the Microsoft Azure Marketplace agreements and policies apply to IoT Edge module offers.  Additionally, there are pre-requisites and technical requirements for IoT Edge modules.  

**Pre-requisites**

To publish an IoT Edge module to the Azure Marketplace, you need to meet the following prerequisites:

- Access to the Partner Center. For more information, see [Azure Marketplace and AppSource publishing guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide).
- Host your IoT Edge module in an Azure Container Registry. 
- Have your IoT Edge module metadata ready such as (non-exhaustive list): 
    - A title
    - A description (in HTML format)
    - A logo image (PNG format and fixed image sizes including 40x40px, 90x90px, 115x115px, 255x115px)
    - A term of use and privacy policy
    - Default module configuration (route, twin desired properties, createOptions, environment variables)
    - Documentation
    - Support contacts

**Technical Requirements**

The primary technical requirements for an IoT Edge Module, in order for it to get certified and published in the Azure Marketplace, are detailed in the [Prepare your IoT Edge module technical assets](./partner-center-portal/create-iot-edge-module-asset.md).

## Documentation and Resources

[Create an IoT Edge module offer](./partner-center-portal/azure-iot-edge-module-creation.md) -- The steps for publishing a new IoT Edge module offer in Partner Center.

## Next steps

If you haven't already done so,

- [Learn](https://azuremarketplace.microsoft.com/sell) about the marketplace.

To register in Partner Center, and start creating a new offer or working on an existing one,

- Sign in to [Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- See [create an IoT Edge module offer](./partner-center-portal/azure-iot-edge-module-creation.md) for information on how to publish an IoT Edge module offer.
