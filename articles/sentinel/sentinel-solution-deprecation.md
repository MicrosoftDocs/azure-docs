---
title: 'Managing end-to-end lifecycle of deprecated solutions in Microsoft Sentinel'
description: This article walks you through the process of identifying deprecated solutions in Microsoft Sentinel and managing the lifecycle of these solutions.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 12/30/2024

#CustomerIntent: As a Microsoft Sentinel user, I should be able to find and manage the lifecycle deprecated solutions in Microsoft Sentinel so that I can always have the latest updates.
---

# Identifying and managing the lifecycle of deprecated solutions in Microsoft Sentinel

The document explains how to manage the lifecycle of out-of-the-box solutions in Microsoft Sentinel that the solution author no longer supports. This document explains how to identify the solutions that are marked for deprecation and what actions to take on those solutions. 

## Reasons for solution deprecation
Here are some of the primary reasons why Solutions are sometimes deprecated in Microsoft Sentinel:
- The software service provider stopped supporting the product or service that sends data to Microsoft Sentinel.
- The author who originally published the solution is no longer actively supporting the solution or providing critical updates.
- The product or service is acquired by another company necessitating ownership transfer to a different entity.

In these cases, users have to uninstall the original solution and install alternate solutions where available. For more information on how to delete/uninstall solutions in Microsoft Sentinel, see [Delete installed Microsoft Sentinel out-of-the-box content and solutions](/azure/sentinel/sentinel-solutions-delete).

## Identifying solutions that are marked as deprecated
Solutions that are marked as deprecated can be identified using the **DEPRECATED** tag against the solution name in Microsoft Sentinel content hub. Solutions that are marked as deprecated are shown first in the content hub, followed by other solutions in alphabetical order.

   :::image type="content" source="media/sentinel-solution-deprecation/solution-marked-deprecated.png" alt-text="Screenshot of solutions marked as deprecated in Microsoft Sentinel content hub." lightbox="media/sentinel-solution-deprecation/solution-marked-deprecated.png":::   

## Actions to take on solutions that are marked as deprecated
1. Navigate to Microsoft Sentinel content hub and look for solutions that are flagged as **DEPRECATED** and the status shows **Installed**.
1. Select the solution matching this criterion. If an alternate solution is available, **Navigate to solution** button is visible at the bottom of the solutions details view. If the **Navigate to solution** button isn't available, this means that there are no alternate solutions available. In this case, proceed with uninstalling the deprecated solution.

   :::image type="content" source="media/sentinel-solution-deprecation/navigate-to-solution.png" alt-text="Screenshot showing navigate to solution option in content hub." lightbox="media/sentinel-solution-deprecation/navigate-to-solution.png" :::   

1. Select on **Navigate to solution** button to go to the alternate solution and then select the **Install** button to install the new solution.  
1. After you install the new solution, you can proceed to uninstall the deprecated solution. Disconnect the data connectors and remove the other content items that were part of the deprecated solution. For more information, see [Delete installed Microsoft Sentinel out-of-the-box content and solutions](/azure/sentinel/sentinel-solutions-delete).
1. Configure the new solution. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](/azure/sentinel/sentinel-solutions-deploy?tabs=azure-portal#discover-content).

> [!NOTE]
> Before configuring the alternate solution, make sure to fully remove all the content items in the deprecated solution to ensure that data isn't duplicated.

## Related content

[Discover and manage Microsoft Sentinel out-of-the-box content](/azure/sentinel/sentinel-solutions-deploy?tabs=azure-portal#discover-content)