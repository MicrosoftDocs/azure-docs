---
title: 'Data modeling in Preview environments - Azure Time Series Insights | Microsoft Docs'
description: Learn about data modeling in Azure Time Series Insights Preview.
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/20/2019
ms.custom: seodec18
---

# Data modeling in Azure Time Series Insights Preview

This article describes how to work with Time Series Model in Azure Time Series Insights Preview. It details several common data scenarios.

To learn more about how to use the update, read [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).

## Types

### Create a single type

1. Go to the Time Series Model selector panel, and select **Types** from the menu. Collapse the panel to focus on the Time Series Model types.

    [![Time Series Model types pane.](media/v2-update-how-to-tsm/portal-one.png)](media/v2-update-how-to-tsm/portal-one.png#lightbox)

1. Select **+ Add**.
1. Enter all details that pertain to types, and select **Create**. This action creates types in the environment.

    [![Configuration settings to add a type.](media/v2-update-how-to-tsm/portal-two.png)](media/v2-update-how-to-tsm/portal-two.png#lightbox)

### Bulk upload one or more types

1. Select **Upload JSON**.
1. Select the file that contains the type payload.
1. Select **Upload**.

    [![Bulk types uploading options.](media/v2-update-how-to-tsm/portal-three.png)](media/v2-update-how-to-tsm/portal-three.png#lightbox)

### Edit a single type

1. Select the type, and select **Edit**. 
1. Make the required changes, and select **Save**.

    [![Edit a type in the pane.](media/v2-update-how-to-tsm/portal-four.png)](media/v2-update-how-to-tsm/portal-four.png#lightbox)

### Delete a type

1. Select the type, and select **Delete**.
1. If no instances are associated with the types, it's deleted.

    [![Delete a type by selecting Delete.](media/v2-update-how-to-tsm/portal-five.png)](media/v2-update-how-to-tsm/portal-five.png#lightbox)

## Hierarchies

### Create a single hierarchy

1. Go to the Time Series Model selector panel, and select **Hierarchies** from the menu. Collapse the panel to focus on the Time Series Model hierarchies.

    [![Create a hierarchy through the pane.](media/v2-update-how-to-tsm/portal-six.png)](media/v2-update-how-to-tsm/portal-six.png#lightbox)

1. Select **+ Add**.

    [![Hierarchy + Add button.](media/v2-update-how-to-tsm/portal-seven.png)](media/v2-update-how-to-tsm/portal-seven.png#lightbox)

1. Select **+ Add Level** in the right pane.

    [![Add a level to the hierarchy.](media/v2-update-how-to-tsm/portal-eight.png)](media/v2-update-how-to-tsm/portal-eight.png#lightbox)

1. Enter the hierarchy details, and select **Create**.

    [![Specify hierarchy details.](media/v2-update-how-to-tsm/portal-nine.png)](media/v2-update-how-to-tsm/portal-nine.png#lightbox)

### Bulk upload one or more hierarchies

1. Select **Upload JSON**.
1. Select the file that contains the hierarchy payload.
1. Select **Upload**.

    [![Selections for bulk upload of hierarchies.](media/v2-update-how-to-tsm/portal-ten.png)](media/v2-update-how-to-tsm/portal-ten.png#lightbox)

### Edit a single hierarchy

1. Select the hierarchy, and select **Edit**.
1. Make the required changes, and select **Save**.

    [![Selections for editing a single hierarchy.](media/v2-update-how-to-tsm/portal-eleven.png)](media/v2-update-how-to-tsm/portal-eleven.png#lightbox)

### Delete a hierarchy

1. Select the hierarchy, and select **Delete**. 
1. If no instances are associated with the hierarchy, it's deleted.

    [![Delete a hiearchy by selecting the Delete button.](media/v2-update-how-to-tsm/portal-twelve.png)](media/v2-update-how-to-tsm/portal-twelve.png#lightbox)

## Instances

### Create a single instance

1. Go to the Time Series Model selector panel, and select **Instances** from the menu. Collapse the panel to focus on the Time Series Model instances.

    [![Create a single instance.](media/v2-update-how-to-tsm/portal-thirteen.png)](media/v2-update-how-to-tsm/portal-thirteen.png#lightbox)

1. Select **Add**.

    [![Add an instance by selecting the + Add button.](media/v2-update-how-to-tsm/portal-fourteen.png)](media/v2-update-how-to-tsm/portal-fourteen.png#lightbox)

1. Enter the instance details, select the type and hierarchy association, and select **Create**.

### Bulk upload one or more instances

1. Select **Upload JSON**.
1. Select the file that contains the instances payload.

    [![Bulk upload instances through JSON.](media/v2-update-how-to-tsm/portal-fifteen.png)](media/v2-update-how-to-tsm/portal-fifteen.png#lightbox)

1. Select **Upload**.

### Edit a single instance

1. Select the instance, and select **Edit**. 
1. Make the required changes, and select **Save**.

    [![Edit a single instance.](media/v2-update-how-to-tsm/portal-sixteen.png)](media/v2-update-how-to-tsm/portal-sixteen.png#lightbox)

## Next steps

- For more information about Time Series Model, read [Data modeling](./time-series-insights-update-tsm.md).

- To learn more about the preview, read [Visualize data in the Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).

- To learn about supported JSON shapes, read [Supported JSON shapes](./time-series-insights-send-events.md#supported-json-shapes).
