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

# Release notes - 1802

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

# Best Practices for Validation as a Service

## Solution Naming Convention Recommendation
In order to facilitate the sharing of information about validation runs it is recommended that a naming convention be use for all solutions registered in VaaS. For example, 

|Product Name | Solution Size | Switch Abbreviation |
|---|:---:|---:|
My Server | 4NODE | My Switch

Solution Name = MyServer4NODEMySwitch


## Solution Validation Test Run Naming Convention Recommendation
In order to facilitate the sharing of information about validation runs it is recommended that a naming convention be use for all solutions test runs. For example,

|Build Number (Major) | Build Number (Minor) | Date | 
|---|:---:|---:|
1808 | 76 | 083018

- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).