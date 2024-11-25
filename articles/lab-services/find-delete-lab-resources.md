---
title: Azure Lab Services retirement guide
description: Learn about finding and deleting Azure Lab Services lab resources.
ms.topic: how-to
ms.date: 11/25/2024

# customer intent: As an Azure Lab Services customer, I want to understand how to find and delete lab resources, as well as determine which version of Azure Lab Services is deployed whether lab accounts (older version) or lab plans (newer version).
---

# Find and delete lab resources

[!INCLUDE [Retirement guide](./includes/retirement-banner.md)]

There are two versions of Azure Lab Services. Labs created from lab accounts use the older version, while labs created from lab plans use the newer version. This guide explains how to review lab resources, determine lab version, and delete unused resources.

## Find lab version
There are two versions of Azure Lab Services. Lab accounts are the older version, while lab plans are the newer version with enhanced feature. Use lab plans for improved student experience and supportability. Follow these steps to identify which lab version is currently deployed.

* [Find lab accounts](how-to-manage-lab-accounts.md#view-lab-accounts): In the [Azure portal](https://portal.azure.com/) search box, enter lab account, and then select Lab accounts.  Labs created from lab accounts use the older version. 

* [Find lab plans](how-to-manage-lab-plans.md#view-lab-plans): In the [Azure portal](https://portal.azure.com/) search box, enter lab plan, and then select Lab plans.  Labs created from lab plans use the newer version. 

## Delete unused lab resources
Regularly review and delete unused lab resources to free up cores, reduce the security surface area, prevent incurring cost from unexpected access, and formally offboard. 

* [Delete a lab account](how-to-manage-lab-accounts.md#delete-a-lab-account)  
* [Delete a lab created from a lab account](manage-labs-1.md#delete-a-lab-in-a-lab-account)
* [Delete a lab plan](how-to-manage-lab-plans.md#delete-a-lab-plan)
* [Delete a lab created from a lab plan](manage-labs.md#delete-a-lab)  
