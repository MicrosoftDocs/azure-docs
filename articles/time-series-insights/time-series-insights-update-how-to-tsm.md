---
title: Data modeling in Azure Time Series Insights | Microsoft Docs
description: Understand data modeling in Azure Time Series Insights
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

This document describes how to work with Time Series Models following the Azure Time Series Insights Preview. It details several common data scenarios.

To learn more about how to use the update, read [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).

## Types

### Create a single type

1. Go to the Time Series Models selector panel, and select **Types** from the menu. Collapse the panel to focus on the Time Series Models types.

    ![Portal_one][1]

1. Select **Add**.
1. Input all details that pertain to types, and select **Create**. This action creates types in the environment.

    ![Portal_two][2]

### Bulk upload one or more types

1. Select **Upload JSON**.
1. Select the file that contains the type payload.
1. Select **Upload**.

    ![Portal_three][3]

### Edit a single type

Select the type, and select **Edit**. Make the required changes, and select **Save**.

![Portal_four][4]

### Delete a type

Select the type, and select **Delete**. If no instances are associated with the types, it's deleted.

![Portal_five][5]

## Hierarchies

### Create a single hierarchy

1. Go to the Time Series Models selector panel, and select **Hierarchies** from the menu. Collapse the panel to focus on the Time Series Models hierarchies.

    ![Portal_six][6]

1. Select **Add**.

    ![Portal_seven][7]

1. Select **Add Level** in the right pane.

    ![Portal_eight][8]

1. Enter the hierarchy details, and select **Create**.

    ![Portal_nine][9]

### Bulk upload one or more hierarchies

1. Select **Upload JSON**.
1. Select the file that contains the hierarchy payload.
1. Select **Upload**.

    ![Portal_ten][10]

### Edit a single hierarchy

Select the hierarchy, and select **Edit**. Make the required changes, and select **Save**.

![Portal_eleven][11]

### Delete a hierarchy

Select the hierarchy, and Select **Delete**. If no instances are associated with the hierarchy, it's deleted.

![Portal_twelve][12]

## Instances

### Create a single instance

1. Go to the Time Series Models selector panel, and select **Instances** from the menu. Collapse the panel to focus on the Time Series Models instances.

    ![Portal_thirteen][13]

1. Select **Add**.

    ![Portal_fourteen][14]

1. Enter the instance details, select the type and hierarchy association, and select **Create**.

### Bulk upload one or more instances

1. Select **Upload JSON**.
1. Select the file that contains the instances payload.

    ![Portal_fifteen][15]

1. Select **Upload**.

### Edit a single instance

Select the instance, and select **Edit**. Make the required changes, and select **Save**.

![Portal_sixteen][16]

### Delete an instance

Select the instance, and select **Delete**. If no events are associated with the instances, it's deleted.

## Next steps

- For more information about Time Series Models, read [Data modeling](./time-series-insights-update-tsm.md).

- To learn more about the preview, read the Azure Time Series Insights Preview explorer [article](./time-series-insights-update-explorer.md).

- To learn about supported JSON shapes, read [Supported JSON Shapes](./time-series-insights-send-events.md#json).

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