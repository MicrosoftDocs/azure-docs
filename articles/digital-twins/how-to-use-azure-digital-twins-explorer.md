---
# Mandatory fields.
title: Use Azure Digital Twins Explorer (preview)
titleSuffix: Azure Digital Twins
description: Learn how to use all the features of Azure Digital Twins Explorer (preview)
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/29/2023
ms.topic: how-to
ms.service: digital-twins
ms.custom: event-tier1-build-2022

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Use Azure Digital Twins Explorer (preview)

[Azure Digital Twins Explorer (preview)](concepts-azure-digital-twins-explorer.md) is a tool for visualizing and working with Azure Digital Twins. This article describes the features of Azure Digital Twins Explorer, and how to use them to manage the data in your Azure Digital Twins instance. You can interact with the Azure Digital Twins Explorer using clicks or [keyboard shortcuts](#accessibility-and-advanced-settings).

## How to access

The main way to access Azure Digital Twins Explorer is through the [Azure portal](https://portal.azure.com).

To open Azure Digital Twins Explorer for an Azure Digital Twins instance, first navigate to the instance in the portal, by searching for its name in the portal search bar.

[!INCLUDE [digital-twins-access-explorer.md](../../includes/digital-twins-access-explorer.md)]

### Switch contexts within the app

Once in the application, you're also able to change which instance is currently connected to the explorer, by selecting the instance name from the top toolbar.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/instance-url-1.png" alt-text="Screenshot of Azure Digital Twins Explorer. The instance name in the top toolbar is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/instance-url-1.png":::

Doing so will bring up the **Azure Digital Twins URL modal**, where you can enter the host name of another Azure Digital Twins instance after the `https://` prefix to connect to that instance.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/instance-url-2.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Azure Digital Twins URL modal displays an editable box containing https:// and a host name." lightbox="media/how-to-use-azure-digital-twins-explorer/instance-url-2.png":::

>[!NOTE]
>At this time, the ability to switch contexts within the app isn't available for personal Microsoft Accounts (MSA). MSA users will need to access the explorer from the chosen instance in the Azure portal, or may connect to a certain instance through a [direct link to the environment](#link-to-your-environment-and-specific-query).


## Query your digital twin graph

You can use the **Query Explorer** panel to run [queries](concepts-query-language.md) on your graph.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/query-explorer-panel.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Query Explorer panel is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/query-explorer-panel.png":::

Enter the query you want to run. If you want to enter a query in multiple lines, you can use SHIFT + ENTER to add a new line to the query box. 

Select the **Run Query** button to display query results in the **Twin Graph** panel.

>[!NOTE]
> Query results containing relationships can only be rendered in the **Twin Graph** panel if the results include at least one twin as well. While queries that return only relationships are possible in Azure Digital Twins, you can only view them in Azure Digital Twins Explorer by using the [Output panel](#accessibility-and-advanced-settings).

### Overlay query results

You can check the **Overlay results** box before running your query if you'd like the results to be highlighted from what is currently being shown in the **Twin Graph** panel, instead of completely replacing the panel's contents with the new query results.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/query-explorer-panel-overlay-results.png" alt-text="Screenshot of Azure Digital Twins Explorer Query Explorer panel. The Overlay results box is checked, and two twins are highlighted in the larger graph that is shown in the Twin Graph panel." lightbox="media/how-to-use-azure-digital-twins-explorer/query-explorer-panel-overlay-results.png":::

If the query result includes something that isn't currently being shown in the **Twin Graph** panel, the element will be added onto the existing view.

### Save and rerun queries

Queries can be saved in local storage in your browser, making them easy to select and rerun.

>[!NOTE]
>Local browser storage means that saved queries will not be available in other browsers apart from the one where you saved them, and they will remain in the browser storage indefinitely until the local storage is cleared.

To save a query, enter it into the query box and select the **Save** icon at the right of the panel. Enter a name for the saved query when prompted.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/query-explorer-panel-save.png" alt-text="Screenshot of Azure Digital Twins Explorer Query Explorer panel. The Save icon is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/query-explorer-panel-save.png":::

Once the query has been saved, it's available to select from the **Saved Queries** dropdown menu to easily run it again.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/query-explorer-panel-saved-queries.png" alt-text="Screenshot of Azure Digital Twins Explorer Query Explorer panel. The Saved Queries dropdown menu is highlighted and shows two sample queries." lightbox="media/how-to-use-azure-digital-twins-explorer/query-explorer-panel-saved-queries.png":::

To delete a saved query, select the **X** icon next to the name of the query when the **Saved Queries** dropdown menu is open.

>[!TIP]
>For large graphs, it's suggested to query only a limited subset and then load the remainder of the graph as required. You can double-click on a twin in the **Twin Graph** panel to retrieve additional related nodes.

## Explore the Twin Graph

The **Twin Graph** panel allows you to explore the twins and relationships in your instance.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Twin Graph panel is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel.png":::

You can use this panel to [explore twin data](#explore-twin-data).

The Twin Graph panel also provides several abilities to customize your graph viewing experience:
* [Change twin display property](#change-twin-display-property)
* [Edit twin graph layout](#edit-twin-graph-layout)
* [Control twin graph expansion](#control-twin-graph-expansion)
* [Show and hide twin graph elements](#show-and-hide-twin-graph-elements)
* [Filter and highlight twin graph elements](#filter-and-highlight-twin-graph-elements)

### Explore twin data

Run a query using the [Query Explorer](#query-your-digital-twin-graph) to see the twins and relationships in the query result displayed in the **Twin Graph** panel.

>[!TIP]
>The query to display all twins and relationships is `SELECT * FROM digitaltwins`.

#### View twin and relationship properties

To view the property values of a twin or a relationship, select the twin or relationship in the **Twin Graph** and use the **Toggle property inspector** button to expand the **Twin Properties** or **Relationship Properties** panel, respectively. This panel will display all the properties associated with the element, along with their values. It also includes default values for properties that haven't yet been set.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-highlight-graph-properties.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The FactoryA twin is selected, and the Twin Properties panel is expanded, showing the properties of the twin." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-highlight-graph-properties.png":::

##### Data type icons

The properties shown in the **Twin Properties** and **Relationship Properties** panels are each displayed with an icon, indicating the type of the field from the DTDL model. You can hover over an icon to display the associated type.

The table below shows the possible data types and their corresponding icons. The table also contains links from each data type to its schema description in the [DTDL v3 Language Description](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md).

| Icon | Data type |
| --- | --- |
| ![boolean icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/boolean.svg) | [boolean](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#primitive-schema) |
| ![component icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/component.svg) | [component](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#component) |
| ![date icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/date.svg) | [date](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#primitive-schema) |
| ![dateTime icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/datetime.svg) | [dateTime](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#primitive-schema) |
| ![duration icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/duration.svg) | [duration](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#primitive-schema) |
| ![enum icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/enum.svg) | [enum](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#enum) |
| ![map icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/map.svg) | [map](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#map) |
| ![numeric icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/numeric.svg) | Numeric types, including [double, float, integer, and long](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#primitive-schema) |
| ![object icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/object.svg) | [object](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#object) |
| ![string icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/string.svg) | [string](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#primitive-schema) |
| ![time icon](./media/how-to-use-azure-digital-twins-explorer/data-icons/time.svg) | [time](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v3/DTDL.v3.md#primitive-schema) |

##### Errors

The Twin Properties panel will display error messages if the twin or some of its properties no longer match its model. 

There are two possible error scenarios that each give their own error message:
* **One or many models used by the twin are missing**. As a result, all the properties associated with that model will be flagged as "missing" in the Twin Properties panel. This error can happen if the model has been deleted since the twin was created.
* **Some properties on the twin are not part of the twin's model**. Only these properties will be flagged as "missing" in the Twin Properties panel. This error can happen if the model for the twin has been replaced or changed since the properties were set, and the properties no longer exist in the most recent version of the model.

Both of these error messages are shown in the screenshot below:

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/properties-errors.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Properties panel, showing two error messages. One error indicates that models are missing, and the other indicates that properties are missing a model." lightbox="media/how-to-use-azure-digital-twins-explorer/properties-errors-large.png":::

#### Validate and explore historized properties

If your Azure Digital Twins instance has [data history](concepts-data-history.md) enabled, you can validate and explore its historized data in Azure Digital Twins Explorer. Follow the steps below to visualize historized data in a chart, or view raw values in a table.

1. From the **Twin Graph** viewer, select a twin whose historized properties you want to view to open it in the **Twin Properties** panel. In the top right corner of the panel, select the **Time series** icon to open the **Data history explorer**. 

    :::image type="content" source="media/how-to-use-azure-digital-twins-explorer/open-data-history.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Properties panel, highlighting the icon to open the data history explorer." lightbox="media/how-to-use-azure-digital-twins-explorer/open-data-history.png":::

1. Select the twin name from the left to bring up the options for choosing which historical properties of the twin to view. The **Twin ID** field will be pre-populated with the twin selection. Next to this field, you can select the **Inspect properties** icon to view the twin data, or the **Advanced twin search** icon to find other twins by querying property values.

    :::image type="content" source="media/how-to-use-azure-digital-twins-explorer/data-history-explorer.png" alt-text="Screenshot of the Data history explorer and a modal asking for twin and property details." lightbox="media/how-to-use-azure-digital-twins-explorer/data-history-explorer.png":::    

1. In the **Property** field, select the property whose historized data you'd like to view. If the property is not numeric, but it consists of numeric values, use the **Cast property value to number** option to attempt to cast this data to numbers so it can be visualized on the chart.

    :::image type="content" source="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-property.png" alt-text="Screenshot of the Data history explorer with the property details highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-property.png":::

1. Choose a **Label** for the time series and select **Update**.  

This will load the chart view of the historized values for the chosen property. You can use the tabs above the chart to toggle between the [chart view](#view-history-in-chart) and [table view](#view-history-in-table).

To add more properties to the visualization, use the **Add time series** button on the left.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-add-time-series.png" alt-text="Screenshot of the Data history explorer highlighting the option to add another time series." lightbox="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-add-time-series.png":::

To exit the data history explorer and return to the main Azure Digital Twins Explorer, select **Close**.

##### View history in chart

The **Chart** view of historized properties shows property values as points on a line graph over time.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-chart.png" alt-text="Screenshot of the Data history explorer showing a chart of historized values for a property." lightbox="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-chart.png":::

You can use the icons above the chart to control the chart settings, including...
* changing the time range for the data that's included in the chart.
* selecting whether multiple time series are shown independently or on a shared y-axis. Selecting **Independent** for the axes means that each time series will scale to the chart and maintain their own axis for scale. Selecting **Shared** axes means that all time series data will be scaled to the same axis. 
* choosing the aggregation logic for the chart. When the property has more data points than can be shown on the chart, the data will be aggregated into a finite number of data points using either average, minimum or maximum functions.

There's also a button to **Open query in Azure Data Explorer**, where you can view and modify the current query to further explore the time series data.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-azure-data-explorer.png" alt-text="Screenshot of the button to open query in Azure Data Explorer." lightbox="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-azure-data-explorer.png":::  

##### View history in table

The **Table** view of historized properties shows property values and their timestamps in a table.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-table.png" alt-text="Screenshot of the Data history explorer showing a table of historized values for a property." lightbox="media/how-to-use-azure-digital-twins-explorer/data-history-explorer-table.png":::

You can use the icons above the table to control the table settings, including...
* changing the time range for the data that's included in the table.
* downloading the table data for independent analysis.

#### View a twin's relationships

You can also quickly view the code of all relationships that involve a certain twin (including incoming and outgoing relationships).

Right-click a twin in the graph, and choose **Get relationships**. Doing so brings up a **Relationship Information** modal displaying the [JSON representation](concepts-twins-graph.md#relationship-json-format) of all incoming and outgoing relationships.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-get-relationships.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The center of the screen displays a Relationship Information modal showing Incoming and Outgoing relationships." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-get-relationships.png":::

### Change twin display property

You can configure which property you'd like to display to identify twins in your twin graph. The default is the `$dtId` value, but you can choose from any properties that exist in your model set (even ones that aren't present on every twin). 

To change the display property, use the **Select Twin Display Name Property** dropdown menu. The dropdown menu is ordered by the number of models that contain the property. 

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-display-name-property.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The Select Twin Display Name Property button is highlighted, showing a menu that lists different properties of the twins in the graph." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-display-name-property.png":::

If you choose a property that isn't present on every twin, any twins in the graph that don't have that property will display with an asterisk (*) followed by their `$dtId` value.

### Edit twin graph layout

You can rearrange the twins into different configurations by clicking and dragging them around the Twin Graph screen.

You can also apply one of several layout algorithms to the graph from the options in the **Choose Layout** menu. 

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-layout.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The Choose Layout button is highlighted, showing a menu with the layout options Cola, Dagre, fCoSE, and Klay." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-layout.png":::

### Control twin graph expansion

While viewing a query result in the **Twin Graph** panel, you can double-click a twin to have the graph fetch its relationships and related twins and display them if they're not already present in the view. You can customize this expansion by setting a size and direction to determine how many twins to fetch.

To set the number of layers to expand, use the **Expansion Level** option. This number indicates how many layers of relationships to fetch from the selected twin.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-expansion-level.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The Expansion Level button is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-expansion-level.png":::

To indicate which types of relationships to follow when expanding, use the **Expansion Direction** button. Doing so allows you to select from incoming, outgoing, or both incoming and outgoing relationships.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-expansion-direction.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The Expansion Direction button is highlighted, showing a menu with the options In, Out, and In/Out." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-expansion-direction.png":::

### Show and hide twin graph elements

You can toggle the option to hide twins or relationships from the graph view. 

To hide a twin or relationship, right-click it in the **Twin Graph** window. Doing so will bring up a menu with options to hide the element or other related elements.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-hide.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The FactoryA twin is selected, and there's a menu containing options to Hide selected, Hide selected + Children, Hide all others, and Hide non children." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-hide.png":::

You can also hide multiple twins or relationships at once by using the CTRL/CMD or SHIFT keys to multi-select several elements of the same type in the graph. From here, follow the same right-click process to see the hide options.

To return to showing all twins after some have been hidden, use the **Show All** button. To return to showing all relationships, use the **Show All Relationships** button.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-show.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The Show All and Show All Relationships buttons are highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-show.png":::

### Filter and highlight twin graph elements

You can filter the twins and relationships that appear in the graph by text, by selecting this **Filter** icon:

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-filter-text.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The text filter icon is selected, showing the Filter tab where you can enter a search term." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-filter-text.png":::

You can also highlight the twins and relationships that appear in the graph by text, by selecting this **Highlight** icon:

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-highlight-text.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The text filter icon is selected, showing the Highlight tab where you can enter a search term." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-highlight-text.png":::

## Manage twins and graph

Azure Digital Twins Explorer provides several ways to manage the [twins](concepts-twins-graph.md#digital-twins) and [relationships](concepts-twins-graph.md#relationships-a-graph-of-digital-twins) in your instance.

This section describes how to perform the following management activities:
* [View flat list of twins and relationships](#view-flat-list-of-twins-and-relationships)
* [Create twins](#create-twins), with or without initial properties
* [Create relationships](#create-relationships) between twins
* [Edit twin and relationship properties](#edit-twin-and-relationship-properties)
* [Delete twins and relationships](#delete-twins-and-relationships)

For information about the viewing experience for twins and relationships, see [Explore twins and the Twin Graph](#explore-the-twin-graph).

### View flat list of twins and relationships

The **Twins** panel shows a flat list of your twins and their associated relationships. You can search for twins by name, and expand them for details about their incoming and outgoing relationships.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twins-panel.png" alt-text="Screenshot of Azure Digital Twins Explorer Twins panel. A twin is highlighted and its relationships are shown." lightbox="media/how-to-use-azure-digital-twins-explorer/twins-panel.png":::

### Create twins

You can create a new digital twin from its model definition in the **Models** panel.

To create a twin from a model, find that model in the list and choose the menu dots next to the model name. Then, select **Create a Twin**. You'll be asked to enter a **name** for the new twin, which must be unique. Then save the twin, which will add it to your graph.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel-create-a-twin.png" alt-text="Screenshot of Azure Digital Twins Explorer Models panel. The menu dots for a single model are highlighted, and the menu option to Create a Twin is also highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/models-panel-create-a-twin-large.png":::

To add property values to your twin, see [Edit twin and relationship properties](#edit-twin-and-relationship-properties).

### Create relationships

To create a relationship between two twins, start by selecting the source twin for the relationship in the **Twin Graph** window. Next, hold down a CTRL/CMD or SHIFT key while you select a second twin to be the target of the relationship.

Once the two twins are simultaneously selected, right-click the target twin to bring up a menu with an option to **Add relationships** between them.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-add-relationship.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The FactoryA and Consumer twins are selected, and a menu shows the option to Add relationships." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-add-relationship.png":::

Doing so will bring up the **Create Relationship** dialog, populated with the source twin and target twin of the relationship (you can also use the **Swap Relationship** icon to switch them). There is a **Relationship** dropdown menu that contains the types of relationship that the source twin can have, according to its DTDL model. Select an option for the relationship type, and **Save** the new relationship.

### Edit twin and relationship properties

To view the property values of a twin or a relationship, select the element in the **Twin Graph** and use the **Toggle property inspector** button to expand the **Twin Properties** or **Relationship Properties** panel, respectively.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-highlight-graph-properties.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The FactoryA twin is selected, and the Twin Properties panel is expanded, showing the properties of the twin." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-highlight-graph-properties.png":::

You can use this panel to directly edit writable properties. Update their values inline, and select the **Save changes** button at the top of the panel to save. When the update is saved, the screen displays a modal window showing the JSON Patch operation that was applied by the [update API](/rest/api/azure-digitaltwins/).

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-highlight-graph-properties-save.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The center of the screen displays a Path Information modal showing JSON Patch code." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-highlight-graph-properties-save.png":::

>[!TIP]
> The properties shown in the **Twin Properties** and **Relationship Properties** panels are each displayed with an icon, indicating the type of the field from the DTDL model. For more information about the type icons, see [Data type icons](#data-type-icons).

### Delete twins and relationships

To delete a twin or a relationship, right-click it in the **Twin Graph** window. Doing so will bring up a menu with an option to delete the element.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-delete.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The FactoryA twin is selected, and there's a menu containing an option to Delete twin(s)." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-delete.png":::

You can delete multiple twins or multiple relationships at once, by using the CTRL/CMD or SHIFT keys to multi-select several elements of the same type in the graph. From here, follow the same right-click process to delete the elements.

You can also choose to delete all of the twins in your instance at the same time, using the **Delete All Twins** button in the top toolbar.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/delete-all-twins.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Delete All Twins icon is selected." lightbox="media/how-to-use-azure-digital-twins-explorer/delete-all-twins.png":::

## Explore models and the Model Graph

Models can be viewed both in the **Models** panel on the left side of the Azure Digital Twins Explorer screen, and in the **Model Graph** panel in the middle of the screen.

The **Models** panel:
:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Models panel is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/models-panel.png":::

The **Model Graph** panel:
:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/model-graph-panel.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Model Graph panel is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/model-graph-panel.png":::

[!INCLUDE [digital-twins-explorer-dtdl](../../includes/digital-twins-explorer-dtdl.md)]

You can use these panels to [view your models](#view-models).

The Model Graph panel also provides several abilities to customize your graph viewing experience:
* [Edit model graph layout](#edit-model-graph-layout)
* [Filter and highlight model graph elements](#filter-and-highlight-model-graph-elements)
* [Upload model images](#upload-model-images) to represent models in the graphs

### View models

You can view a flat list of the models in your instance in the **Models** panel. This list is searchable using the **Search** bar in the panel.

You can use the **Model Graph** panel to view a graphical representation of the models in your instance, along with the relationships, inheritance, and components that connect them to each other.

[!INCLUDE [digital-twins-explorer-dtdl](../../includes/digital-twins-explorer-dtdl.md)]

#### View model definition

To see the full definition of a model, find that model in the **Models** pane and select the menu dots next to the model name. Then, select **View Model**. Doing so will display a **Model Information** modal showing the raw DTDL definition of the model.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel-view.png" alt-text="Screenshot of Azure Digital Twins Explorer Models panel. The menu dots for a single model are highlighted, and the menu option to View Model is also highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/models-panel-view-large.png":::

You can also view a model's full definition by selecting it in the **Model Graph**, and using the **Toggle model details** button to expand the **Model Detail** panel. This panel will also display the full DTDL code for the model.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-highlight-graph-details.png" alt-text="Screenshot of Azure Digital Twins Explorer Model Graph panel. The Floor model is selected, and the Model DetailS panel is expanded, showing the DTDL code of the model." lightbox="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-highlight-graph-details.png":::

### Edit model graph layout

You can rearrange the models into different configurations by clicking and dragging them around the Model Graph screen.

You can also apply one of several layout algorithms to the model graph from the options in the **Choose Layout** menu. 

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-layout.png" alt-text="Screenshot of Azure Digital Twins Explorer Model Graph panel. The Choose Layout button is highlighted, showing a menu with the layout options Cola, Dagre, fCoSE, Klay, and d3Force." lightbox="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-layout.png":::

### Filter and highlight model graph elements

You can filter the types of model references that appear in the Model Graph. Turning off one of the reference types via the switches in this menu will prevent that reference type from displaying in the graph.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-filter-references.png" alt-text="Screenshot of Azure Digital Twins Explorer Model Graph panel. The filter menu for Relationships, Inheritance, and Components are highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-filter-references.png":::

You can also filter the models and references that appear in the graph by text, by selecting this **Filter** icon:

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-filter-text.png" alt-text="Screenshot of Azure Digital Twins Explorer Model Graph panel. The text filter icon is selected, showing the Filter tab where you can enter a search term." lightbox="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-filter-text.png":::

You can highlight the models and references that appear in the graph by text, by selecting this **Highlight** icon:

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-highlight-text.png" alt-text="Screenshot of Azure Digital Twins Explorer Model Graph panel. The text filter icon is selected, showing the Highlight tab where you can enter a search term." lightbox="media/how-to-use-azure-digital-twins-explorer/model-graph-panel-highlight-text.png":::

### Upload model images

You can upload custom images to represent different models in the Model Graph and [Twin Graph](#explore-the-twin-graph) views. You can upload images for individual models, or for several models at once.

>[!NOTE]
>These images are stored in local browser storage. This means that the images will not be available in other browsers apart from the one where you saved them, and they will remain in the browser storage indefinitely until the local storage is cleared.

To upload an image for a single model, find that model in the **Models** panel and select the menu dots next to the model name. Then, select **Upload Model Image**. In the file selector box that appears, navigate on your machine to the image file you want to upload for that model. Choose **Open** to upload it.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel-upload-one-image.png" alt-text="Screenshot of Azure Digital Twins Explorer Models panel. The menu dots for a single model are highlighted, and the menu option to Upload Model Image is also highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/models-panel-upload-one-image-large.png":::

You can also upload model images in bulk.

First, use the following instructions to set the image file names before uploading. Doing so enables Azure Digital Twins Explorer to automatically assign the images to the correct models after upload. 
1. Start with the model ID value (for example, `dtmi:example:Floor;1`)
1. Replace instances of ":" with "_" (the example becomes `dtmi_example_Floor;1`)
1. Replace instances of ";" with "-" (the example becomes `dtmi_example_Floor-1`)
1. Make sure the file has an image extension (the example becomes something like `dtmi_example_Floor-1.png`)

> [!NOTE]
> If you try to upload an image that does not map to any existing model using the criteria above, the image will not be uploaded or stored.

Then, to upload the images at the same time, use the **Upload Model Images** icon at the top of the Models panel. In the file selector box, choose which image files to upload. 

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel-upload-images.png" alt-text="Screenshot of Azure Digital Twins Explorer Models panel. The Upload Model Images icon is highlighted.":::

## Manage models

You can use the **Models** panel on the left side of the Azure Digital Twins Explorer screen to perform management activities on the entire set of models, or on individual models. 

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Models panel is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/models-panel.png":::

With this panel, you can complete the following model management activities:
* [Upload models](#upload-models) into your Azure Digital Twins instance
* [Delete models](#delete-models) from your instance
* [Refresh models](#refresh-models) to reload the list of all models into this panel

For information about the viewing experience for models, see [Explore models and the Model Graph](#explore-models-and-the-model-graph).

### Upload models

You can upload models from your machine by selecting model files individually, or by uploading an entire folder of model files at once. If you're uploading one JSON file that contains the code for many models, be sure to review the [bulk model upload limitations](#limitations-of-bulk-model-upload).

[!INCLUDE [digital-twins-explorer-dtdl](../../includes/digital-twins-explorer-dtdl.md)]

To upload one or more models that are individually selected, select the **Upload a model** icon showing an upwards arrow.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel-upload.png" alt-text="Screenshot of Azure Digital Twins Explorer Models panel. The Upload a model icon is highlighted.":::

In the file selector box that appears, navigate on your machine to the model(s) you want to upload. You can select one or more JSON model files and select **Open** to upload them.

To upload a folder of models, including everything that's inside it, select the **Upload a directory of Models** icon showing a file folder.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel-upload-directory.png" alt-text="Screenshot of Azure Digital Twins Explorer Models panel. The Upload a directory of Models icon is highlighted.":::

In the file selector box that appears, navigate on your machine to a folder containing JSON model files. Select **Open** to upload that top-level folder and all of its contents.

>[!IMPORTANT]
>If a model references another model in its definition, like when you're defining relationships or components, the model being referenced needs to be present in the instance in order to upload the model that uses it. If you're uploading models one-by-one, that means that you should upload the model being referenced **before** uploading any models that use it. If you're uploading models in bulk, you can select them all in the same import and Azure Digital Twins will infer the order to upload them in. However, if you're uploading more than 50 models in the same file, see the [bulk model upload limitations](#limitations-of-bulk-model-upload).

#### Limitations of bulk model upload

The limitations in this section apply to models that are contained within a single JSON file, being uploaded to Azure Digital Twins Explorer at the same time.

While there's no limit to how many models you can include with a single JSON file, there are special considerations for files containing more than 50 models. If you're uploading more than 50 models within the same model file, follow these tips:
* If there are any models that inherit from other models that are defined in the same file, place them near the end of the list.
* If there are any models that reference other models defined in the same file as components, place them near the end of the list.
* Verify that wherever a model references another model that's defined in the same file (either through inheritance or as a component), the model that contains the reference comes later in the list than the referenced model definition.

This will help make sure that model dependencies are resolved correctly during the upload process.

### Delete models

You can use the Models panel to delete individual models, or all of the models in your instance at once.

To delete a single model, find that model in the list and select the menu dots next to the model name. Then, select **Delete Model**.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel-delete-one.png" alt-text="Screenshot of Azure Digital Twins Explorer Models panel. The menu dots for a single model are highlighted, and the menu option to Delete Model is also highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/models-panel-delete-one-large.png":::

To delete all of the models in your instance at once, choose the **Delete All Models** icon at the top of the Models panel.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel-delete-all.png" alt-text="Screenshot of Azure Digital Twins Explorer Models panel. The Delete All Models icon is highlighted.":::

### Refresh models

When you open Azure Digital Twins Explorer, the Models panel should automatically show all available models in your environment. 

However, you can manually refresh the panel at any time to reload the list of all models in your Azure Digital Twins instance. To do so, select the **Refresh models** icon. 

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/models-panel-refresh.png" alt-text="Screenshot of Azure Digital Twins Explorer Models panel. The Refresh models icon is highlighted.":::

## Import/export graph

From the **Twin Graph** panel, you have the options to [import](#import-graph) and [export](#export-graph-and-models) graph features.

### Import graph

You can use the import feature to add twins, relationships, and models to your instance. This feature can be useful for creating many twins, relationships, and/or models at once.

>[!NOTE]
> If your graph import file includes models, they'll be subject to the [bulk model upload limitations](#limitations-of-bulk-model-upload).

#### Create import file

The first step in importing a graph is creating a file representing the twins and relationships you want to add.

The import file can be in either of these two formats:
* The *JSON-based format* generated on [graph export](#export-graph-and-models). This format can contain twins, relationships, and/or models.
* The *custom Excel-based format* described in the rest of this section. This format allows you to upload twins and relationships.

##### Create import file in Excel

To create a custom graph in Excel that can upload twins and relationships to Azure Digital Twins Explorer, use the following format.

Each row represents an element to create: either a twin, a relationship, or a combination of twin and corresponding relationship.
Use the following columns to structure the twin or relationship data. The column names can be customized, but they should remain in this order.

| ModelID | ID | Relationship (source) | Relationship Name | Init Data |
| --- | --- | --- | --- | --- |
| (Optional)<br>The DTMI ID of the model to use for the new twin. This model definition should already exist in the instance.<br><br>You can leave this column blank for a row if you want that row to create only a relationship (no twins). | (Required)<br>The unique ID for a twin.<br><br>If a new twin is being created in this row, this value will be the ID of the new twin.<br>If there's relationship information in the row, this ID will be used as the target of the relationship. | (Optional)<br>The ID of a twin that should be the source twin for a new relationship.<br><br>You can leave this column blank for a row if you want that row to create only a twin (no relationships). | (Optional)<br>The name for the new relationship to create. The relationship direction will be from the twin in column C to the twin in column B. | (Optional)<br>A JSON string containing property settings for the twin to be created. The properties must match the ones defined in the model from column A. |

Here's an example .xlsx file creating a small graph of two floors and two rooms.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/import-example.png" alt-text="Screenshot of graph data in Excel. The column headers correspond to the fields above, in order, and the rows contain corresponding data values." lightbox="media/how-to-use-azure-digital-twins-explorer/import-example.png":::

You can view this file and other .xlsx graph examples in the [Azure Digital Twins Explorer repository](https://github.com/Azure-Samples/digital-twins-explorer/tree/main/client/examples) on GitHub.

>[!NOTE]
>The properties and relationships described in the .xlsx must match what's defined in the model definitions for the related twins.

#### Import file to Azure Digital Twins Explorer

Once you have a file on your machine that's ready to be imported, select the **Import Graph** icon in the Twin Graph panel.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-import.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The Import Graph button is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-import.png":::

In the file selector box that appears, navigate on your machine to the graph file (.xlsx or .json) that you want to upload and choose **Open** to upload it.

Azure Digital Twins will open an **Import** panel showing a preview of the graph to be imported. To confirm, select the **Save** icon in the upper-right corner of the panel.

If import is successful, a modal window will display the number of models, twins, and relationships that were uploaded.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-import-successful.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The center of the screen displays an Import Successful modal showing four twins imported and two relationships imported." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-import-successful.png":::

### Export graph and models

You can use the export feature to export partial or complete graphs, including models, twins, and relationships. Export serializes the twins and relationships from the most recent query results, as well as all models in the instance, to a JSON-based format that you can download to your machine.

To begin, use the [Query Explorer](#query-your-digital-twin-graph) panel to run a query that selects the twins and relationships that you want to download. Doing so will populate them in the Twin Graph panel.

>[!TIP]
>The query to display all twins and relationships is `SELECT * FROM digitaltwins`.

Once the Twin Graph panel is showing the portion of the graph you want to download, select the **Export Graph** icon.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-export.png" alt-text="Screenshot of Azure Digital Twins Explorer Twin Graph panel. The Export Graph button is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/twin-graph-panel-export.png":::

This action enables a **Download** link in the Twin Graph box. Select it to download a JSON-based representation of the query result, and all the models in your instance, to your machine.

>[!TIP]
>This file can be edited and/or re-uploaded to Azure Digital Twins through the [import](#import-graph) feature.

## Link to your environment and specific query

You can share a link to your Azure Digital Twins Explorer environment with others to collaborate on work. This section describes how to generate a link to your Azure Digital Twins Explorer environment, which can optionally include a specific query to run when the link is opened. This section also describes what permissions the recipient needs to have in order to interact with your twin data.

### Recipient access requirements

For the recipient to open the link and view the instance in Azure Digital Twins Explorer, they must log into their Azure account, and have **Azure Digital Twins Data Reader** access to the instance (you can read more about Azure Digital Twins roles in [Security](concepts-security.md)). 

For the recipient to make changes to the graph and the data, they must have the **Azure Digital Twins Data Owner** role on the instance.

### Generate link to environment with specific query

To generate a link to your Azure Digital Twins Explorer environment that includes a specific query, enter the query you want to capture in the **Query Explorer**, then select the **Share** button to copy the full link.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/send-with-query.png" alt-text="Screenshot of Azure Digital Twins Explorer Query Explorer panel. The query text and the Send button are highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/send-with-query.png":::

For the example and query in the screenshot above, the **Share** button produces this link: `https://explorer.digitaltwins.azure.net/?query=SELECT%20*%20FROM%20digitaltwins%20T%20WHERE%20T.InFlow%20%3E%2070&tid=<tenant-ID>&eid=<Azure-Digital-Twins-instance-host-name>`. The link contains the tenant ID and host name of the Azure Digital Twins instance, as well as formatted query text.

You can share this URL to allow someone to access your instance and this query. When they open Azure Digital Twins Explorer with the link, the results of the query will automatically populate in the **Twin Graph** panel.

### Generate link to environment without specific query

To share a link to your Azure Digital Twins Explorer environment with no specific query attached, start by using the **Share** button to copy the link to your instance.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/send-without-query.png" alt-text="Screenshot of Azure Digital Twins Explorer Query Explorer panel. Only the Send button is highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/send-without-query.png":::

Then, manually remove the query parameter from the result.

For example, the **Share** button in the screenshot above would produce this link: `https://explorer.digitaltwins.azure.net/?query=SELECT%20*%20FROM%20digitaltwins&tid=<tenant-ID>&eid=<Azure-Digital-Twins-instance-host-name>`. You can remove the `query=SELECT%20*%20FROM%20digitaltwins&` portion to produce the URL `https://explorer.digitaltwins.azure.net/?tid=<tenant-ID>&eid=<Azure-Digital-Twins-instance-host-name>`.

Then, share this URL to allow someone to access your instance. When they open Azure Digital Twins Explorer with the link, they'll be connected to your instance and won't see any pre-populated query results.

## Accessibility and advanced settings

You can enable several advanced settings for Azure Digital Twins Explorer to customize your experience or make it more accessible.

You can use the **Keyboard Shortcuts** icon in the top-right toolbar to view a list of keyboard shortcuts that can be used to navigate the Azure Digital Twins Explorer.

 :::image type="content" source="media/how-to-use-azure-digital-twins-explorer/keyboard-shortcuts.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Keyboard Shortcuts icon is highlighted in the top toolbar." lightbox="media/how-to-use-azure-digital-twins-explorer/keyboard-shortcuts.png":::

There are several advanced features that can be accessed under the Settings cog in the top-right toolbar:
* **Eager Loading**: When a query returns twins that have relationships to other twins that aren't included in the query results, this feature will load the "missing" twins before rendering the graph.
* **Caching**: When this feature is enabled, Azure Digital Twins Explorer will keep a local cache of relationships and models in memory to improve query performance. These caches are cleared on any write operations on the relevant elements, as well as on browser refresh. This feature is off by default.
* **Console**: This feature enables display of a console window, capable of using simple shell functions for working with the graph.
* **Output**: This feature enables display of an output window, which shows a diagnostic trace of operations.
* **High Contrast**: This feature changes the colors of the Azure Digital Twins Explorer so they appear with greater contrast.

You can customize the panel layout by editing the positions of the panels that make up Azure Digital Twins Explorer (Query Explorer, Twins, Models, Twin Graph, Model Graph). To move a panel to a different location, click and hold the panel name, and drag it to its new desired position.

:::image type="content" source="media/how-to-use-azure-digital-twins-explorer/panels.png" alt-text="Screenshot of Azure Digital Twins Explorer. The names of the Query Explorer, Models, Twin Graph, and Model Graph panels are highlighted." lightbox="media/how-to-use-azure-digital-twins-explorer/panels.png":::

The panel positions will be reset upon refresh of the browser window.

## Next steps 

Learn about writing queries for the Azure Digital Twins twin graph: 
* [Query language](concepts-query-language.md)
* [Query the twin graph](how-to-query-graph.md)
