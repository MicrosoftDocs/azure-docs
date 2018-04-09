---
title: How to perform an access review in Privileged Identity Management for Azure Resources | Microsoft Docs
description: This document describes how to perform and access review in PIM for Azure Resources.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: mwahl
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2018
ms.author: billmath
ms.custom: pim
---

# Resource dashboards

The Admin View dashboard has four primary components. A graphical representation of resource role activations over the past seven days. This data is scoped to the selected resource and displays activations for the most common roles (Owner, Contributor, User Access Administrator), and all roles combined.

To the right of the activations graph, are two charts that display the distribution of role assignments by assignment type, for both users and groups. Selecting a slice of the chart changes the value to a percentage (or vice versa).

![](media/azure-pim-resource-rbac/rbac-overview-top.png)

Below the charts, you see the number of users and groups with new role assignments over the last 30 days (left), and a list of roles sorted by total assignments (descending).

![](media/azure-pim-resource-rbac/role-settings.png)
