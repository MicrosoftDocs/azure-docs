---
title: Move across region dashboard
description: Monitor your resources moving across regions using Move across region dashboard.
author: Aarthi-Vijayaraghavan
manager: sutalasi
ms.service: resource-mover
ms.topic: how-to
ms.date: 10/06/2021
ms.custom: engagement-fy23
ms.author: AarthiV
---
# Move across region dashboard
This article describes how to monitor the resources you are moving across regions via the Move across region dashboard in Azure Resource Mover. 
## Monitor via the dashboard
1. In **Azure Resource Mover**, select **Overview** the left navigation pane. You can toggle between two pages, **Getting started** and **Move across region dashboard**. **Getting started** page provides options to move your resources across subscription, across resource group and across region.
The **Move across region dashboard** page combines all monitoring information of your move across region in a single place.
    [![Move across region dashboard tab](media\move-across-region-dashboard\move-across-region-dashboard-tab.png)](media\move-across-region-dashboard\move-across-region-dashboard-tab.png)
2. The dashboard lists all the move combinations created by you. The following two sections are used to capture the status of your move across regions.
    In **Resources by move status**, monitor the percentage and number of resources in each state.
    In **Error Summary**, monitor the active errors that needs to be resolved before you can successfully move to the destination region.
    [![Status and issues section](media\move-across-region-dashboard\move-across-region-dashboard-status-issues.png)](media\move-across-region-dashboard\move-across-region-dashboard-status-issues.png)
> [!NOTE]
> Only the source-destination combinations that are already created in your chosen subscription would be listed in the dashboard.

3. Use the filters to choose your preferred **Subscription**, **Source region**, and **Destination region**.
    [![Filters](media\move-across-region-dashboard\move-across-region-dashboard-filters.png)](media\move-across-region-dashboard\move-across-region-dashboard-filters.png)
4. Navigate to the details page by selecting on **View all resources** next to the source - destination.
    [![Details](media\move-across-region-dashboard\move-across-region-dashboard-details.png)](media\move-across-region-dashboard\move-across-region-dashboard-details.png)
## Next steps
[Learn about](about-move-process.md) the move process.
