---
title: Azure CycleCloud Performance Tuning | Microsoft Docs
description: Change default configuration settings in Azure CycleCloud for greater performance.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Performance Tuning

Azure CycleCloud comes configured for starting small to medium clusters (up to 8000 cores). For
larger or multiple clusters, the performance can be improved with some changes:

* Set the web server heap size in `$CS_HOME/config/cycle_server.properties` to more than 2GB, up to about half of the available RAM on the instance. Setting it to more than 8GB may not produce any benefit.
* Set the broker heap size in `$CS_HOME/config/cycle_server.properties` to at least 500MB; 1GB if possible.
* Change the maximum number of file handles (Linux) or TCP socket limits (Windows) to be twice the number of active instances you expect. Note that this typically requires an OS reboot.
