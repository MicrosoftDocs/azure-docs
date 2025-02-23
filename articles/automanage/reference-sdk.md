---
title: SDK Overview
description: Get started with the Automanage SDKs.
author: andrsmith
ms.service: azure-automanage
ms.topic: reference
ms.date: 11/17/2022
ms.author: andrsmith
---

# Automanage SDK overview

> [!CAUTION]
> On September 30, 2027, the Azure Automanage Best Practices service will be retired. As a result, attempting to create a new configuration profile or onboarding a new subscription to the service will result in an error. Learn more [here](https://aka.ms/automanagemigration/) about how to migrate to Azure Policy before that date. 

> [!CAUTION]
> Starting February 1st 2025, Azure Automanage will begin rolling out changes to halt support and enforcement for all services dependent on the deprecated Microsoft Monitoring Agent (MMA). To continue using Change Tracking and Management, VM Insights, Update Management, and Azure Automation, [migrate to the new Azure Monitor Agent (AMA)](https://aka.ms/mma-to-ama/).

Azure Automanage currently supports the following SDKs:

- [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/automanage/azure-mgmt-automanage)
- [Go](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/automanage/armautomanage)
- [Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/automanage/azure-resourcemanager-automanage)
- [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/automanage/arm-automanage)
- [CSharp](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/automanage/Azure.ResourceManager.Automanage)
- [Azure CLI](https://github.com/Azure/azure-cli-extensions/tree/main/src/automanage)

Here's a list of a few of the primary operations the SDKs provide:

- Create custom configuration profiles
- Delete custom configuration profiles
- Create Best Practices profile assignments
- Create custom profile assignments
- Remove assignments
- Delete profiles
