---
title: Data modeling in Azure Time Series Insights | Microsoft Docs
description: Understanding data modeling in Azure Time Series Insights
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/03/2018
---

# Data modeling in Azure Time Series Insights

This document describes how to work with **Time Series Models** following the Azure Time Series Insights (Preview). It details several common data scenarios.

Read the [Azure TSI (Preview) explorer](./time-series-insights-update-explorer.md) article, to learn more about navigating the update.

## Types

### How to create a single type

1. Start by heading to the TSM model selector panel and select types from the menu. Then, collapse the panel to focus on TSM types:

    ![portal_one][1]

1. Click on **Add**.
1. Input all details pertaining to types and click **Create**. Doing so should create types in the environment:

    ![portal_two][2]

### How to bulk upload one or more types

1. Click on **upload JSON**.
1. Choose that file that contains the type payload.
1. Click on **upload**

    ![portal_three][3]

### How to edit a single type

* Select the type and click on **Edit** button. Make required changes and click **Save**:

    ![portal_four][4]

### How to delete a type

* Select the type and click on **Delete** button. If no instances are associated to the types, it will be deleted:

    ![portal_five][5]

## Hierarchies

### How to create a single hierarchy

1. Start by heading to the TSM model selector panel and select hierarchies from the menu. Then, collapse the panel to focus on TSM types:

    ![portal_six][6]

1. Click on **Add**

    ![portal_seven][7]

1. Click on **Add Level** in the right pane:

    ![portal_eight][8]

1. Enter the hierarchy details and click **Create**:

    ![portal_nine][9]

### How to bulk upload one or more hierarchies

1. Click on **Upload JSON**.
1. Choose the file that contains the hierarchy payload.
1. Click on **Upload**:

    ![portal_ten][10]

### How to edit a single hierarchy

* Select the Hierarchy and click on the **Edit** button. Make required changes and click **Save**:

    ![portal_eleven][11]

### How to delete a hierarchy

* Select the hierarchy and click on **Delete** button. If no instances are associated to the hierarchy, it will be deleted.

    ![portal_twelve][12]

## Instances

### How to create a single instance

1. Start by heading to the TSM model selector panel and select instances from the menu. Then,  collapse the panel to focus on TSM types:

    ![portal_thirteen][13]

1. Click on **Add**:

    ![portal_fourteen][14]

1. Enter the instance details, select type and hierarchy association and click **Create**.

### How to bulk upload one or more instances

1. Click on **Upload JSON**.
1. Choose the file that contains the instances payload:

    ![portal_fifteen][15]

1. Click on **Upload**.

### How to edit a single instance

* Select the instance and click on the **Edit** button. Make required changes and click **Save**:

    ![portal_sixteen][16]

### How to delete an instance

* Select the instance and click on **Delete** button. If no events are associated to the instances, it will be deleted.

## Next steps

Read about [Data modeling](./time-series-insights-update-tsm.md) for more information about **Time Series Models**.

View the Azure TSI (Preview) explorer [article](./time-series-insights-update-explorer.md) to learn more about the preview.

Learn about supported JSON shapes by reading [Supported JSON Shapes](./time-series-insights-send-events.md#json).

<!-- Images -->
[1]: media/v2-update-how-to-tsm/portal_one.png
[2]: media/v2-update-how-to-tsm/portal_two.png
[3]: media/v2-update-how-to-tsm/portal_three.png
[4]: media/v2-update-how-to-tsm/portal_four.png
[5]: media/v2-update-how-to-tsm/portal_five.png
[6]: media/v2-update-how-to-tsm/portal_six.png
[7]: media/v2-update-how-to-tsm/portal_seven.png
[8]: media/v2-update-how-to-tsm/portal_eight.png
[9]: media/v2-update-how-to-tsm/portal_nine.png
[10]: media/v2-update-how-to-tsm/portal_ten.png
[11]: media/v2-update-how-to-tsm/portal_eleven.png
[12]: media/v2-update-how-to-tsm/portal_twelve.png
[13]: media/v2-update-how-to-tsm/portal_thirteen.png
[14]: media/v2-update-how-to-tsm/portal_fourteen.png
[15]: media/v2-update-how-to-tsm/portal_fifteen.png
[16]: media/v2-update-how-to-tsm/portal_sixteen.png