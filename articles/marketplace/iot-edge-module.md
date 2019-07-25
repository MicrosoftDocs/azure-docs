---
title: Azure IoT Edge Modules 
description: The IoT Edge Module Offer in the Azure Marketplace for app and service publishers.
services: Azure, Marketplace, Compute, Storage, Networking, Blockchain, IoT Edge module offer
author: qianw211
manager: pabutler
ms.service: marketplace
ms.topic: article
ms.date: 09/22/2018
ms.author: pabutler
---

# IoT Edge modules

The [Azure IoT Edge](https://azure.microsoft.com/services/iot-edge/) platform is backed by Azure Cloud.  This platform enables users to deploy cloud workloads to run directly on IoT devices.  An IoT Edge module can run offline workloads and do data analysis locally. This offer type helps to save bandwidth, safeguard local and sensitive data, and offers low-latency response time.  You now have the options to take advantage of these pre-built workloads. Until now, only a handful of first-party solutions from Microsoft were available.  You had to invest the time and resources into building your own custom IoT solutions.

By introducing the [IoT Edge modules in the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1), we now have a single destination for publishers to expose and sell their solutions to the IoT audience. IoT developers can ultimately find and purchase capabilities to accelerate their solution development.  

## Key benefits of IoT Edge modules in Azure Marketplace:

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

- Access to the Cloud Partner Portal (CPP). For more information, see [Azure Marketplace and AppSource publishing guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide).
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

The primary technical requirements for an IoT Edge Module, in order for it to get certified and published in the Azure Marketplace, are detailed in the [Prepare your IoT Edge module technical assets](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/iot-edge-module/cpp-create-technical-assets).  

## Documentation and Resources

[Create an IoT Edge module offer](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/iot-edge-module/cpp-create-offer) -– The steps for publishing a new IoT Edge module offer with the Cloud Publishing Portal.

## Next steps

If you haven’t already done so,

- Register in the [Microsoft Partner Network](https://partner.microsoft.com/membership).
- Create a [Microsoft Account](https://account.microsoft.com/account/) (required for Azure Marketplace transact offers; recommended for others).
- Submit the [Marketplace Registration Form](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/azureisv). See how to [create a Partner Center account](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-account) for more information.

If you're registered and are creating a new offer or working on an existing one,

- Sign in to [Cloud Partner Portal](https://cloudpartner.azure.com/) to create or complete your offer.
- See [IoT Edge module offer publishing overview](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/iot-edge-module/cpp-offer-process-parts) for information on how to publish an IoT Edge module offer.
