---
title: Supportability of adding Azure VM to an existing availability set | Microsoft Docs
description: Supportability of adding Azure VM to an existing availability set.
services: virtual-machines-linux
documentationcenter: ''
author: Deland-Han
manager: cshepard
editor: ''

ms.assetid: 
ms.service: virtual-machines
ms.workload: virtual-machines
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 7/15/2017
ms.author: delhan

---

You may occasionally encounter limitations when you add new virtual machines (VM) to an existing availability set. The following chart details which VM series can you mix in the same Availability set.

Here is supportability matrix to mix different type of VMs:

|Series & Availability Set|First VM|A|Av2|D|Dv2|DS|DSv2|F|Fs|H|G|GS|NC|NV|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Add second VM| | | | | |Premium|Premium| |Premium| | |Premium| ||
|A| |OK|OK|OK|OK|NO|NO|NO|NO|NO|NO|NO|NO|NO|
|Av2| |May fail on gen 2 cluster|OK|OK|OK|NO|NO|NO|NO|NO|NO|NO|NO|NO|
|D| |May fail on gen 2 cluster|OK|OK|OK|NO|NO|NO|NO|NO|NO|NO|NO|NO|
|Dv2| |NO|OK|OK|OK|NO|NO|NO|NO|NO|NO|NO|NO|NO|
|DS|Premium|NO|NO|NO|NO|OK|OK|NO|?|NO|NO|NO|NO|NO|
|DSv2|Premium|NO|NO|NO|NO|OK|OK|NO|?|NO|NO|NO|NO|NO|
|F| |NO|?|?|?|NO|NO|OK|NO|NO|NO|NO|NO|NO|
|Fs|Premium|NO|NO|NO|NO|?|?|NO|OK|NO|NO|?|NO|NO|
|H| |NO|?|?|?|NO|NO|NO|NO|OK|NO|NO|NO|NO|
|G| |NO|NO|NO| |NO|NO|NO|NO|NO|OK|NO|NO|NO|
|GS|Premium|NO|NO|NO| |?|?|NO|?|NO|NO|OK|NO|NO|
|NC| |NO|NO|NO|NO|NO|NO|NO|NO|NO|NO|NO|OK|NO|
|NV| |NO|NO|NO|NO|NO|NO|NO|NO|NO|NO|NO|NO|OK|

