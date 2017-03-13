---
title: Azure Cloud Console Pricing | Microsoft Docs
description: Overview of pricing of Azure Cloud Console
services: 
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: 
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 03/09/2017
ms.author: juluk
---

# Pricing
The Cloud Console is free to use, however regular storage cost is incurred if explicitly mounted via `createclouddrive`.

## Compute
The VM housing your container is provided for free.

## Storage
Attaching persistent storage incurs regular storage costs. This includes any files and the default 5GB image used to persist your $HOME directory.
* The 5GB image runs ~40 cents a month to store.

Check [here for details on Azure Files costs](https://azure.microsoft.com/en-us/pricing/details/storage/files/).