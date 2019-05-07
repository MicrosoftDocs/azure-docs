---
title: 'Data modeling in Azure Time Series Insights Preview | Microsoft Docs'
description: Understand data modeling in Azure Time Series Insights Preview.
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 05/07/2019
ms.custom: seodec18
---

# Data modeling in Azure Time Series Insights Preview

This document describes how to work with Time Series Models following the Azure Time Series Insights Preview. It details several common data scenarios.

To learn more about how to use the update, read [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).

## Types

### Create a single type

1. Go to the Time Series Models selector panel, and select **Types** from the menu. Collapse the panel to focus on the Time Series Models types.

    [![Portal_one](media/v2-update-how-to-tsm/portal_one.png)](media/v2-update-how-to-tsm/portal_one.png#lightbox)

1. Select **Add**.
1. Input all details that pertain to types, and select **Create**. This action creates types in the environment.

    [![Portal_two](media/v2-update-how-to-tsm/portal_two.png)](media/v2-update-how-to-tsm/portal_two.png#lightbox)

### Bulk upload one or more types

1. Select **Upload JSON**.
1. Select the file that contains the type payload.
1. Select **Upload**.

    [![Portal_three](media/v2-update-how-to-tsm/portal_three.png)](media/v2-update-how-to-tsm/portal_three.png#lightbox)

### Edit a single type

Select the type, and select **Edit**. Make the required changes, and select **Save**.

[![Portal_four](media/v2-update-how-to-tsm/portal_four.png)](media/v2-update-how-to-tsm/portal_four.png#lightbox)

### Delete a type

Select the type, and select **Delete**. If no instances are associated with the types, it's deleted.

[![Portal_five](media/v2-update-how-to-tsm/portal_five.png)](media/v2-update-how-to-tsm/portal_five.png#lightbox)

## Hierarchies

### Create a single hierarchy

1. Go to the Time Series Models selector panel, and select **Hierarchies** from the menu. Collapse the panel to focus on the Time Series Models hierarchies.

    [![Portal_six](media/v2-update-how-to-tsm/portal_six.png)](media/v2-update-how-to-tsm/portal_six.png#lightbox)

1. Select **Add**.

    [![Portal_seven](media/v2-update-how-to-tsm/portal_seven.png)](media/v2-update-how-to-tsm/portal_seven.png#lightbox)

1. Select **Add Level** in the right pane.

    [![Portal_eight](media/v2-update-how-to-tsm/portal_eight.png)](media/v2-update-how-to-tsm/portal_eight.png#lightbox)

1. Enter the hierarchy details, and select **Create**.

    [![Portal_nine](media/v2-update-how-to-tsm/portal_nine.png)](media/v2-update-how-to-tsm/portal_nine.png#lightbox)

### Bulk upload one or more hierarchies

1. Select **Upload JSON**.
1. Select the file that contains the hierarchy payload.
1. Select **Upload**.

    [![Portal_ten](media/v2-update-how-to-tsm/portal_ten.png)](media/v2-update-how-to-tsm/portal_ten.png#lightbox)

### Edit a single hierarchy

Select the hierarchy, and select **Edit**. Make the required changes, and select **Save**.

[![Portal_eleven](media/v2-update-how-to-tsm/portal_eleven.png)](media/v2-update-how-to-tsm/portal_eleven.png#lightbox)

### Delete a hierarchy

Select the hierarchy, and Select **Delete**. If no instances are associated with the hierarchy, it's deleted.

[![Portal_twelve](media/v2-update-how-to-tsm/portal_twelve.png)](media/v2-update-how-to-tsm/portal_twelve.png#lightbox)

## Instances

### Create a single instance

1. Go to the Time Series Models selector panel, and select **Instances** from the menu. Collapse the panel to focus on the Time Series Models instances.

    [![Portal_thirteen](media/v2-update-how-to-tsm/portal_thirteen.png)](media/v2-update-how-to-tsm/portal_thirteen.png#lightbox)

1. Select **Add**.

    [![Portal_fourteen](media/v2-update-how-to-tsm/portal_fourteen.png)](media/v2-update-how-to-tsm/portal_fourteen.png#lightbox)

1. Enter the instance details, select the type and hierarchy association, and select **Create**.

### Bulk upload one or more instances

1. Select **Upload JSON**.
1. Select the file that contains the instances payload.

    [![Portal_fifteen](media/v2-update-how-to-tsm/portal_fifteen.png)](media/v2-update-how-to-tsm/portal_fifteen.png#lightobx)

1. Select **Upload**.

### Edit a single instance

Select the instance, and select **Edit**. Make the required changes, and select **Save**.

[![Portal_sixteen](media/v2-update-how-to-tsm/portal_sixteen.png)](media/v2-update-how-to-tsm/portal_sixteen.png#lightbox)

### Delete an instance

Select the instance, and select **Delete**. If no events are associated with the instances, it's deleted.

## Next steps

- For more information about Time Series Models, read [Data modeling](./time-series-insights-update-tsm.md).

- To learn more about the preview, read [Visualize data in the Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).

- To learn about supported JSON shapes, read [Supported JSON Shapes](./time-series-insights-send-events.md#json).
