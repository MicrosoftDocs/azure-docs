---
title: Azure Stack Validation Best Practices. | Microsoft Docs
description: This article contains the release notes for the Validation as a Service update for 1802 for Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: John.Haskin

---

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

# Best Practices for Validation as a Service


## Suggested Naming Convention for Solution Names
In order to facilitate the sharing of information about solutions it is recommended that a consistent naming convention be use for all solutions registered in VaaS. For example, 

|Product Name | Unique Hardware Element 1 | Unique Hardware Element 2
|---|:---:|---:|
My Solution XYZ |  All Flash | My Switch X01

Solution Name = MySolutionXYZ_AllFlash_MySwitchX01

## Suggested Re-use of Registered Solution Names
In order to ensure that there is consistency in managing solution it is recommended that the same Solution name be used and only changed when there is a change to the hardware SKU.


## Suggested Naming Convention for Test / Package / Validation Workflow Names
In order to facilitate the sharing of information about specific validation runs it is recommended that a consistent naming convention be use for all solutions test runs. For example,

|Build Number (Major) | Date | Solution Size | 
|---|:---:|---:|
1808 | 081518 | 4NODE

Workflow Name = 1808_081518_4NODE

## Considerations for Partner Storage Blob Settings Used for Log Collection
In order to ensure that networking chargers are not incurred for storing logs it is recommended that the Azure storage blob be configured to use only the US West region. Data replication and the hot storage tier feature are not necessary for this data. Enabling either feature will dramatically increase partner costs. 

- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).