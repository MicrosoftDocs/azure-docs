---
title: Move Across Region Dashboard
description: Monitor your resources moving across regions using Move across region dashboard.
author: Aarthi-Vijayaraghavan
manager: sutalasi
ms.service: resource-move
ms.topic: Monitoring
ms.date: 08/30/2021
ms.author: AarthiV
---
# Move across region dashboard
This article describes how to monitor your resources moving across regions using Move across region dashboard in Azure Resource Mover. 

## Monitor in the dashboard

1. In **Azure Resource Mover**, select **overview**. You can toggle between two pages, Getting started and Move across region dashboard. Getting started page provides options to move your resources across subscription, across resource group and across region.
The Move across region dashboard page combines all monitoring information of your move across region in a single place.

    ![Move across region dashboard tab](media\move-across-region-dashboard\Move_across_region_dashboard_tab.png)

2. The dashboard lists all the moves created by you. Two sections are used to capture the status of your move across regions.
    In **Resources by move status** section, monitor the percentage and number of resources in each state.
    In **Error Summary** section, monitor the active errors that affect your move to destination region.

    ![Status and issues section](media\move-across-region-dashboard\Move_across_region_dashboard_status_issues.png)

> [!NOTE]
> Only the source-destination combination created by you within your subscription would be listed in the dashboard.

3. Use the filters to choose your preferred Subscription, Source, and Destination.
    
    ![Filters](media\move-across-region-dashboard\Move_across_region_dashboard_Filters.png)

4. Navigate to the details page by selecting on View all resources next to the source - destination.

    ![details](media\move-across-region-dashboard\Move_across_region_dashboard_details.png)

## Next steps
[Learn about](about-move-process.md) the move process.