---
title: Azure IoT Edge module prerequisites | Microsoft Docs
description: Prerequisites for publishing an IoT Edge module.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: dan-wesley
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 10/18/2018
ms.author: pbutlerm
---

# IoT Edge module publishing prerequisites

This article describes the prerequisites for publishing an IoT Edge module offer.

To learn more about IoT Edge modules and the benefits of publishing a module to the Azure Marketplace, see the [IoT Edge modules publishing guide](https://docs.microsoft.com/azure/marketplace/iot-edge-module).

## Publishing prerequisites

To publish an IoT Edge module to the Azure Marketplace, you have to meet the following prerequisites:

<!-- P2: It would be great to point to the terms of use of CPP here. This can often be a blocker for big companies and these terms of use are not anonymously visible yet.-->
- Access to the [Cloud Partner Portal](https://cloudpartner.azure.com/). For more information, see [Azure Marketplace and AppSource publishing guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide).
- Agreement to the [Azure Marketplace Terms](https://azure.microsoft.com/support/legal/marketplace-terms/)
- Host your IoT Edge module technical asset in an Azure Container Registry.  For more information, see [how to prepare your IoT Edge module technical asset](./cpp-create-technical-assets.md)
- Have your IoT Edge module metadata ready to use. For example, (non-exhaustive list):
    - A title
    - A description (in HTML format)
    - A logo image (PNG format and fixed image sizes including 40x40px, 90x90px, 115x115px, 255x115px)
    - A term of use and privacy policy
    - A default module configuration that includes: routes, twin desired properties, createOptions, and environment variables.
    - Documentation
    - Support contacts

## Next steps

- [Prepare your IoT Edge module technical asset](./cpp-create-technical-assets.md)
- [Create your IoT Edge module offer](./cpp-create-offer.md)
