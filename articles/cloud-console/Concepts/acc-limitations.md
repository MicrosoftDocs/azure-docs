---
title: Azure Cloud Console Limitations | Microsoft Docs
description: Overview of limitations of Azure Cloud Console
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

# Limitations
Cloud Console is rapidly iterating during preview, as a result all known limitations will be provided here.

## Performance
* Cloud Console's first initiation may take 5-20 seconds, subsequent sessions should be less than 10 seconds.
* New container builds are generated often in an effort to include more tools, performance may fluctuate as this process is refined.

## Browser access
* Firefox and IE do not enable clipboard access

## Network connectivity
* Any latency in the Cloud Console is subject to local internet connectivity, Cloud Console will continue to attempt functioning to any instructions sent.