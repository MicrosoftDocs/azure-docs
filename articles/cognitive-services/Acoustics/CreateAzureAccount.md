---
title: Create an Azure account for Acoustics | Microsoft Docs
description: Use advanced acoustics and spatialization in your Unity title
services: cognitive-services
author: kegodin
manager: noelc
ms.service: cognitive-services
ms.component: acoustics
ms.topic: article
ms.date: 08/03/2018
ms.author: kegodin
---

# Creating an Azure Batch account for acoustics
This article gives a step-by-step walkthrough of recommended settings for creating an Azure Batch account for use with Microsoft Acoustics. For more information about what Microsoft Acoustics is, see the [Introduction to Microsoft Acoustics](index.md). For information about how to incorporate Microsoft Acoustics into your Unity project, see the [Getting Started guide](GettingStarted.md).  

## Requirements for acoustics
In order to be able to execute bakes in Azure, you'll need both an [Azure Batch](https://azure.microsoft.com/en-us/services/batch/) subscription, and an [Azure Storage](https://azure.microsoft.com/en-us/services/storage/) subscription. You'll be able to use the free version of the Storage account to get started, but the compute requirements mean you'll need to get a paid subscription of the Batch account off the bat, as the VM sizes included in the free offering don't have enough RAM to support a bake.

- [ ] TODO: FINISH ALL THE OTHER INFORMATION RELATED TO CREATING AN ACCOUNT