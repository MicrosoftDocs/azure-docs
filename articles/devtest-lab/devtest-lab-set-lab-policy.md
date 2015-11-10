<properties
pageTitle="Define lab policies | Microsoft Azure"
description="Learn how to define lab policies such as VM sizes, maximum VMs per user, and shutdown automation."
services="devtest-lab,virtual-machines"
documentationCenter="na"
authors="tomarcher"
manager="douge"
editor=""/>

<tags
ms.service="devtest-lab"
ms.workload="na"
ms.tgt_pltfrm="na"
ms.devlang="na"
ms.topic="article"
ms.date="11/01/2015"
ms.author="tarcher"/>

# Define lab policies

## Overview

DevTest Lab allows you to specify key policies that govern how your lab and its VMs are used. These policies include cost thresholds, allowed VM sizes, maximum number of VMs per user, and auto shutdown.

## Define max VMs per lab and per user

1. Sign in to the [Azure portal](http://portal.azure.com).

1. Tap **Browse**, and then tap **DevTest Labs** from the list.

1. From the list of labs, tap the desired lab.   

1. Tap **Settings**.

![Settings](./media/devtest-lab-set-lab-policy/lab-blade-settings.png)

1. On the **Settings** blade, there is a grouping of settings called **Policies**. Within that grouping, tap **Maximum VMs**.

1. On the **Max VMs Policies** blade:

1. To set the maximum number of VMs allowed per user, tap  **On** under **Policy per User** and - under *Maximum VMs Allowed per User* - enter a numeric value indicating the maximum number of VMs that can be run concurrently by a user. If you enter a number that is too large, the UI will display the maximum number allowed for this field.

1. To set the maximum number of VMs allowed per lab, tap  **On** under **Policy per Lab** and - under *Maximum VMs Allowed per Lab* - enter a numeric value indicating the maximum number of VMs that can be created for the current lab. If you enter a number that is too large, the UI will display the maximum number allowed for this field.

1. Tap **Save**.

![Settings](./media/devtest-lab-set-lab-policy/max-vms-policies.png)
