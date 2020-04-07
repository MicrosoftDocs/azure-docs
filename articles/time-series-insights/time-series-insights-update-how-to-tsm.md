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
ms.date: 02/18/2020
ms.custom: seodec18
---

# Data modeling in Azure Time Series Insights Preview

This article describes how to work with Time Series Model in Azure Time Series Insights Preview. It details several common data scenarios.

> [!TIP]
> * Read about the Preview [Time Series Model](time-series-insights-update-tsm.md).
> * Learn more about navigating the Preview UI in [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).

## Instances

The Azure Time Series Insights explorer supports Instance **CREATE**, **READ**, **UPDATE**, and **DELETE** operations within the browser. 

To begin, select the **Model** view from the Time Series Insights explorer **Analyze** view.

### Create a single instance

1. Go to the Time Series Model selector panel, and select **Instances** from the menu. All instances associated with your selected Time Series Insights environment will be displayed.

    [![Create a single instance by first selecting Instances.](media/v2-update-how-to-tsm/how-to-tsm-instances-panel.png)](media/v2-update-how-to-tsm/how-to-tsm-instances-panel.png#lightbox)

1. Select **+ Add**.

    [![Add an instance by selecting the + Add button.](media/v2-update-how-to-tsm/how-to-tsm-add-instance.png)](media/v2-update-how-to-tsm/how-to-tsm-add-instance.png#lightbox)

1. Enter the instance details, select the type and hierarchy association, and select **Create**.

### Bulk upload one or more instances

> [!TIP]
> You may save your instances to your desktop in JSON.The downloaded JSON file can then be uploaded through the following steps.

1. Select **Upload JSON**.
1. Select the file that contains the instances payload.

    [![Bulk upload instances through JSON.](media/v2-update-how-to-tsm/how-to-tsm-bulk-upload-instances.png)](media/v2-update-how-to-tsm/how-to-tsm-bulk-upload-instances.png#lightbox)

1. Select **Upload**.

### Edit a single instance

1. Select the instance, and select the **edit** or **pencil icon**. 
1. Make the required changes, and select **Save**.

    [![Edit a single instance.](media/v2-update-how-to-tsm/how-to-tsm-edit-instance.png)](media/v2-update-how-to-tsm/how-to-tsm-edit-instance.png#lightbox)

### Delete an instance

1. Select the instance, and select the **delete** or **waste bin icon**.

   [![Delete an instance by selecting Delete.](media/v2-update-how-to-tsm/how-to-tsm-delete-instance.png)](media/v2-update-how-to-tsm/how-to-tsm-delete-instance.png#lightbox)

1. Confirm deletion by selecting **Delete**.

> [!NOTE]
> An instance must successfully pass a field validation check to be deleted.

## Hierarchies

The Azure Time Series Insights explorer supports Hierarchy **CREATE**, **READ**, **UPDATE**, and **DELETE** operations within the browser. 

To begin, select the **Model** view from the Time Series Insights explorer **Analyze** view.

### Create a single hierarchy

1. Go to the Time Series Model selector panel, and select **Hierarchies** from the menu. All hierarchies associated with your selected Time Series Insights environment will be displayed.

    [![Create a hierarchy through the pane.](media/v2-update-how-to-tsm/how-to-tsm-hierarchy-panel.png)](media/v2-update-how-to-tsm/how-to-tsm-hierarchy-panel.png#lightbox)

1. Select **+ Add**.

    [![Hierarchy + Add button.](media/v2-update-how-to-tsm/how-to-tsm-add-new-hierarchy.png)](media/v2-update-how-to-tsm/how-to-tsm-add-new-hierarchy.png#lightbox)

1. Select **+ Add level** in the right pane.

    [![Add a level to the hierarchy.](media/v2-update-how-to-tsm/how-to-tsm-save-hierarchy-levels.png)](media/v2-update-how-to-tsm/how-to-tsm-save-hierarchy-levels.png#lightbox)

1. Enter the hierarchy details, and select **Save**.

    [![Specify hierarchy details.](media/v2-update-how-to-tsm/how-to-tsm-add-hierarchy-level.png)](media/v2-update-how-to-tsm/how-to-tsm-add-hierarchy-level.png#lightbox)

### Bulk upload one or more hierarchies

> [!TIP]
> You may save your hierarchies to your desktop in JSON.The downloaded JSON file can then be uploaded through the following steps.

1. Select **Upload JSON**.
1. Select the file that contains the hierarchy payload.
1. Select **Upload**.

    [![Selections for bulk upload of hierarchies.](media/v2-update-how-to-tsm/how-to-tsm-bulk-upload-hierarchies.png)](media/v2-update-how-to-tsm/how-to-tsm-bulk-upload-hierarchies.png#lightbox)

### Edit a single hierarchy

1. Select the hierarchy, and select the **edit** or **pencil icon**.
1. Make the required changes, and select **Save**.

    [![Selections for editing a single hierarchy.](media/v2-update-how-to-tsm/how-to-tsm-edit-hierarchy.png)](media/v2-update-how-to-tsm/how-to-tsm-edit-hierarchy.png#lightbox)

### Delete a hierarchy

1. Select the hierarchy, and select the **delete** or **waste bin icon**. 

    [![Delete a hierarchy by selecting the Delete button.](media/v2-update-how-to-tsm/how-to-tsm-delete-hierarchy.png)](media/v2-update-how-to-tsm/how-to-tsm-delete-hierarchy.png#lightbox)

1. Confirm deletion by selecting **Delete**.

## Types

The Azure Time Series Insights explorer supports Type **CREATE**, **READ**, **UPDATE**, and **DELETE** operations within the browser. 

To begin, select the **Model** view from the Time Series Insights explorer **Analyze** view.

### Create a single type

1. Go to the Time Series Model selector panel, and select **Types** from the menu. All types associated with your selected Time Series Insights environment will be displayed.

    [![Time Series Model types pane.](media/v2-update-how-to-tsm/how-to-tsm-type-panel.png)](media/v2-update-how-to-tsm/how-to-tsm-type-panel.png#lightbox)

1. Select **+ Add** to display the **Add a new type** popup modal.
1. Enter properties and variables for your type. Once entered, select **Save**. 

    [![Configuration settings to add a type.](media/v2-update-how-to-tsm/how-to-tsm-add-new-type.png)](media/v2-update-how-to-tsm/how-to-tsm-add-new-type.png#lightbox)

### Bulk upload one or more types

> [!TIP]
> You may save your types to your desktop in JSON.The downloaded JSON file can then be uploaded through the following steps.

1. Select **Upload JSON**.
1. Select the file that contains the type payload.
1. Select **Upload**.

    [![Bulk types uploading options.](media/v2-update-how-to-tsm/how-to-tsm-bulk-upload-types-json.png)](media/v2-update-how-to-tsm/how-to-tsm-bulk-upload-types-json.png#lightbox)

### Edit a single type

1. Select the type, and select the **edit** or **pencil icon**.
1. Make the required changes, and select **Save**.

    [![Edit a type in the pane.](media/v2-update-how-to-tsm/how-to-tsm-edit-type.png)](media/v2-update-how-to-tsm/how-to-tsm-edit-type.png#lightbox)

### Delete a type

1. Select the type, and select the **delete** or **waste bin icon**. .

   [![Delete a type by selecting Delete.](media/v2-update-how-to-tsm/how-to-tsm-delete-type.png)](media/v2-update-how-to-tsm/how-to-tsm-delete-type.png#lightbox)

1. Confirm deletion by selecting **Delete**.

## Next steps

- For more information about Time Series Model, read [Data modeling](./time-series-insights-update-tsm.md).

- To learn more about the preview, read [Visualize data in the Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).

- To learn about supported JSON shapes, read [Supported JSON shapes](./time-series-insights-send-events.md#supported-json-shapes).
