---
title: Solutions targeting in Operations Management Suite (OMS) | Microsoft Docs
description: 
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: jwhit
editor: tysonn

ms.assetid: 1f054a4e-6243-4a66-a62a-0031adb750d8
ms.service: operations-management-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/01/2017
ms.author: bwren

---
# Targeting solutions in Operations Management Suite (OMS) (Preview)
When you add a solution to OMS, by default it's automatically deployed to all Windows and Linux agents connected to your Log Analytics workspace.  You may want to scope a solution to particular set of agents in order to manage your costs by limiting the amount of data collected for a solution.

Keep in mind the following limitations for solution targeting.

- Solution targeting only applies to solutions provided by Microsoft.  It does not apply to solutions created by yourself or partners](operations-management-suite-solutions-creating.md).
- You can only remove agents directly connected to Log Analytics to the scope of a solution.  The solution will automatically deploy to any agents that are part of a connected Operations Manager management group.


## Create a solution target
There are two steps to scoping a solution.  First you create a [computer group](log-analytics-computer-groups.md) using the OMS portal.  Then you 
 

## Next steps

