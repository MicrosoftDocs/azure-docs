---
title: Create an Azure workbook
description: Learn how to create a workbook in Azure Workbooks.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/30/2022
ms.reviewer: gardnerjr 
---

# Create an Azure workbook

This article describes how to create a new workbook and how to add elements to your Azure workbook.

This video walks you through creating workbooks.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4B4Ap]

## Create a new workbook

To create a new workbook:

1. On the **Azure Workbooks** page, select an empty template or select **New**.
1. Combine any of these elements to add to your workbook:
   - [Text](#add-text)
   - [Queries](#add-queries)
   - [Parameters](#add-parameters)
   - [Metric charts](#add-metric-charts)
   - [Links](#add-links)
   - [Groups](#add-groups)
   - Configuration options

## Add text

You can include text blocks in your workbooks. For example, the text can be human analysis of the telemetry, information to help users interpret the data, and section headings.

   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-example.png" alt-text="Screenshot that shows adding text to a workbook.":::

Text is added through a Markdown control that you use to add your content. You can use the full formatting capabilities of Markdown like different heading and font styles, hyperlinks, and tables. By using Markdown, you can create rich Word- or portal-like reports or analytic narratives. Text can contain parameter values in the Markdown text. Those parameter references are updated as the parameters change.

Edit mode:
   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-control-edit-mode.png" alt-text="Screenshot that shows adding text to a workbook in edit mode.":::

Preview mode:
   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-control-edit-mode-preview.png" alt-text="Screenshot that shows adding text to a workbook in preview mode.":::

### Add text to a workbook

1. Make sure you're in edit mode by selecting **Edit**.
1. Add text by doing one of these steps:

   * Select **Add** > **Add text** below an existing element or at the bottom of the workbook.
   * Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook. Then select **Add** > **Add text**.

1. Enter Markdown text in the editor field.
1. Use the **Text Style** option to switch between plain Markdown and Markdown wrapped with the Azure portal's standard info, warning, success, and error styling.
   
   > [!TIP]
   > Use this [Markdown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to see the different formatting options.

1. Use the **Preview** tab to see how your content will look. The preview shows the content inside a scrollable area to limit its size. At runtime, the Markdown content expands to fill whatever space it needs, without a scrollbar.
1. Select **Done Editing**.

### Text styles

These text styles are available.

| Style     | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
|plain| No formatting is applied.                                                     |
|info| The portal's info style, with an `ℹ` or similar icon and blue background.    |
|error| The portal's error style, with an `❌` or similar icon and red background.    |
|success| The portal's success style, with a `✔` or similar icon and green background. |
|upsell| The portal's upsell style, with a `🚀` or similar icon and purple background.  |
|warning| The portal's warning style, with a `⚠` or similar icon and blue background.  |

You can also choose a text parameter as the source of the style. The parameter value must be one of the preceding text values. The absence of a value or any unrecognized value is treated as plain style.

### Text style examples

Info style example:
   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-control-edit-mode-preview.png" alt-text="Screenshot that shows adding text to a workbook in preview mode showing info style.":::

Warning style example:
   :::image type="content" source="media/workbooks-create-workbook/workbooks-text-example-warning.png" alt-text="Screenshot that shows a text visualization in warning style.":::

## Add queries

You can query any of the supported workbook [data sources](workbooks-data-sources.md).

For example, you can query Azure Resource Health to help you view any service problems affecting your resources. You can also query Azure Monitor metrics, which is numeric data collected at regular intervals. Azure Monitor metrics provide information about an aspect of a system at a particular time.

### Add a query to a workbook

1. Make sure you're in edit mode by selecting **Edit**.
1. Add a query by doing one of these steps:
    - Select **Add** > **Add query** below an existing element or at the bottom of the workbook.
    - Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook. Then select **Add** > **Add query**.
1. Select the [data source](workbooks-data-sources.md) for your query. The other fields are determined based on the data source you choose.
1. Select any other values that are required based on the data source you selected.
1. Select the [visualization](workbooks-visualizations.md) for your workbook.
1. In the query section, enter your query, or select from a list of sample queries by selecting **Samples**. Then edit the query to your liking.
1. Select **Run Query**.
1. When you're sure you have the query you want in your workbook, select **Done Editing**.

## Add parameters

This section discusses how to add parameters.

### Best practices for using resource-centric log queries

This video shows you how to use resource-level logs queries in Azure Workbooks. It also has tips and tricks on how to enable advanced scenarios and improve performance.

> [!VIDEO https://www.youtube.com/embed/8CvjM0VvOA80]

#### Use a dynamic resource type parameter

Dynamic resource type parameters use dynamic scopes for more efficient querying. The following snippet uses this heuristic:

1. **Individual resources**: If the count of selected resource is less than or equal to 5
1. **Resource groups**: If the number of resources is over 5 but the number of resource groups the resources belong to is less than or equal to 3
1. **Subscriptions**: Otherwise

   ```
    Resources
    | take 1
    | project x = dynamic(["microsoft.compute/virtualmachines", "microsoft.compute/virtualmachinescalesets", "microsoft.resources/resourcegroups", "microsoft.resources/subscriptions"])
    | mvexpand x to typeof(string)
    | extend jkey = 1
    | join kind = inner (Resources 
    | where id in~ ({VirtualMachines})
    | summarize Subs = dcount(subscriptionId), resourceGroups = dcount(resourceGroup), resourceCount = count()
    | extend jkey = 1) on jkey
    | project x, label = 'x', 
          selected = case(
            x in ('microsoft.compute/virtualmachinescalesets', 'microsoft.compute/virtualmachines') and resourceCount <= 5, true, 
            x == 'microsoft.resources/resourcegroups' and resourceGroups <= 3 and resourceCount > 5, true, 
            x == 'microsoft.resources/subscriptions' and resourceGroups > 3 and resourceCount > 5, true, 
            false)
   ```

#### Use a static resource scope for querying multiple resource types

```json
[
    { "value":"microsoft.compute/virtualmachines", "label":"Virtual machine", "selected":true },
    { "value":"microsoft.compute/virtualmachinescaleset", "label":"Virtual machine scale set", "selected":true }
]
```

#### Use resource parameters grouped by resource type

```
Resources
| where type =~ 'microsoft.compute/virtualmachines' or type =~ 'microsoft.compute/virtualmachinescalesets' 
| where resourceGroup in~({ResourceGroups}) 
| project value = id, label = id, selected = false, 
      group = iff(type =~ 'microsoft.compute/virtualmachines', 'Virtual machines', 'Virtual machine scale sets') 
```

## Add a parameter

You can control how your parameter controls are presented to consumers with workbooks. Examples include text box versus dropdown list, single- versus multi-select, or values from text, JSON, KQL, or Azure Resource Graph.

### Add a parameter to a workbook

1. Make sure you're in edit mode by selecting **Edit**.
1. Add a parameter by doing one of these steps:
    - Select **Add** > **Add parameter** below an existing element or at the bottom of the workbook.
    - Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook. Then select **Add** > **Add parameter**.
1. In the new parameter pane that appears, enter values for these fields:

    - **Parameter name**: Parameter names can't include spaces or special characters.
    - **Display name**: Display names can include spaces, special characters, and emojis.
    - **Parameter type**: 
    - **Required**: 

1. Select **Done Editing**.

      :::image type="content" source="media/workbooks-parameters/workbooks-time-settings.png" alt-text="Screenshot that shows the creation of a time range parameter.":::

## Add metric charts

Most Azure resources emit metric data about state and health, such as CPU utilization, storage availability, count of database transactions, and failing app requests. You can create visualizations of this metric data as time-series charts in workbooks.

The following example shows the number of transactions in a storage account over the prior hour. This information allows you to see the transaction trend and look for anomalies in behavior.

  :::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-area.png" alt-text="Screenshot that shows a metric area chart for storage transactions in a workbook.":::

### Add a metric chart to a workbook

1. Make sure you're in edit mode by selecting **Edit**.
1. Add a metric chart by doing one of these steps:
    - Select **Add** > **Add metric** below an existing element or at the bottom of the workbook.
    - Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook. Then select **Add** > **Add metric**.
1. Select a **resource type**, the resources to target, the metric namespace and name, and the aggregation to use.
1. Set parameters such as time range, split by, visualization, size, and color palette, if needed.
1. Select **Done Editing**.

Example of a metric chart in edit mode:

:::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-area-edit.png" alt-text="Screenshot that shows a metric area chart for storage transactions in edit mode.":::

### Metric chart parameters

| Parameter | Description | Examples |
| ------------- |:-------------|:-------------|
| Resource type| The resource type to target. | Storage or Virtual Machine |
| Resources| A set of resources to get the metrics value from. | MyStorage1 |
| Namespace | The namespace with the metric. | Storage > Blob |
| Metric| The metric to visualize. | Storage > Blob > Transactions |
| Aggregation | The aggregation function to apply to the metric. | Sum, count, average |
| Time range | The time window to view the metric in. | Last hour, last 24 hours |
| Visualization | The visualization to use. | Area, bar, line, scatter, grid |
| Split by| Optionally split the metric on a dimension. | Transactions by geo type |
| Size | The vertical size of the control. | Small, medium, or large |
| Color palette | The color palette to use in the chart. It's ignored if the **Split by** parameter is used. | Blue, green, red |

### Metric chart examples

Examples of metric charts are shown.

#### Transactions split by API name as a line chart

  :::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-split-line.png" alt-text="Screenshot that shows a metric line chart for storage transactions split by API name.":::

#### Transactions split by response type as a large bar chart

  :::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-bar-large.png" alt-text="Screenshot that shows a large metric bar chart for storage transactions split by response type.":::

#### Average latency as a scatter chart

  :::image type="content" source="media/workbooks-create-workbook/workbooks-metric-chart-storage-scatter.png" alt-text="Screenshot that shows a metric scatter chart for storage latency.":::

## Add links

You can use links to create links to other views, workbooks, and other components inside a workbook, or to create tabbed views within a workbook. The links can be styled as hyperlinks, buttons, and tabs.

### Link styles

You can apply styles to the link element itself and to individual links.

#### Link element styles

|Style  |Sample  |Notes  |
|---------|---------|---------|
|Bullet List     | :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-bullet.png" alt-text="Screenshot that shows a bullet-style workbook link.":::         |  The default, links, appears as a bulleted list of links, one on each line.  The **Text before link** and **Text after link** fields can be used to add more text before or after the link components.       |
|List     |:::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-list.png" alt-text="Screenshot that shows a list-style workbook link.":::         | Links appear as a list of links, with no bullets.        |
|Paragraph     | :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-paragraph.png" alt-text="Screenshot that shows a paragraph-style workbook link.":::        |Links appear as a paragraph of links, wrapped like a paragraph of text.         |
|Navigation     | :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-navigation.png" alt-text="Screenshot that shows a navigation-style workbook link.":::        | Links appear as links with vertical dividers, or pipes, between each link.        |
|Tabs     |  :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-tabs.png" alt-text="Screenshot that shows a tabs-style workbook link.":::       |Links appear as tabs. Each link appears as a tab. No link styling options apply to individual links. To configure tabs, see the [Use tabs](#use-tabs) section.         |
|Toolbar     | :::image type="content" source="media/workbooks-create-workbook/workbooks-link-style-toolbar.png" alt-text="Screenshot that shows a toolbar-style workbook link.":::        | Links appear as an Azure portal-styled toolbar, with icons and text.  Each link appears as a toolbar button. To configure toolbars, see the [Use toolbars](#use-toolbars) section.        |

#### Link styles

| Style | Description |
|:------------- |:-------------|
| Link | By default, links appear as a hyperlink. URL links can only be link style.  |
| Button (primary) | The link appears as a "primary" button in the portal, usually a blue color. |
| Button (secondary) | The links appear as a "secondary" button in the portal, usually a "transparent" color, a white button in light themes, and a dark gray button in dark themes.  |

If required parameters are used in button text, tooltip text, or value fields, and the required parameter is unset when you use buttons, the button is disabled. You can use this capability, for example, to disable buttons when no value is selected in another parameter or control.

### Link actions

Links can use all the link actions available in [link actions](workbooks-link-actions.md), and they have two more available actions.

| Action | Description |
|:------------- |:-------------|
|Set a parameter value | A parameter can be set to a value when you select a link, button, or tab. Tabs are often configured to set a parameter to a value, which hides and shows other parts of the workbook based on that value.|
|Scroll to a step| When you select a link, the workbook moves focus and scrolls to make another component visible. This action can be used to create a "table of contents" or a "go back to the top"-style experience.   |

### Use tabs

Most of the time, tab links are combined with the **Set a parameter value** action. This example shows the links step configured to create two tabs, where selecting either tab sets a **selectedTab** parameter to a different value. The example also shows a third tab being edited to show the parameter name and parameter value placeholders.

  :::image type="content" source="media/workbooks-create-workbook/workbooks-creating-tabs.png" alt-text="Screenshot that shows creating tabs in workbooks.":::

You can then add other components in the workbook that are conditionally visible if the **selectedTab** parameter value is **1** by using the advanced settings.

  :::image type="content" source="media/workbooks-create-workbook/workbooks-selected-tab.png" alt-text="Screenshot that shows conditionally visible tab in workbooks.":::

The first tab is selected by default, initially setting **selectedTab** to **1** and making that component visible. Selecting the second tab changes the value of the parameter to **2**, and different content is displayed.

  :::image type="content" source="media/workbooks-create-workbook/workbooks-selected-tab2.png" alt-text="Screenshot that shows workbooks with content displayed when the selected tab is 2.":::

A sample workbook with the preceding tabs is available in [sample Azure workbooks with links](workbooks-sample-links.md#sample-workbook-with-links).

### Tabs limitations

 - URL links aren't supported in tabs. A URL link in a tab appears as a disabled tab.
 - No component styling is supported in tabs. components are displayed as tabs, and only the tab name (link text) field is displayed. Fields that aren't used in tab style are hidden while in edit mode.
 - The first tab is selected by default, invoking whatever action that tab has specified. If the first tab's action opens another view, as soon as the tabs are created, a view appears.
 - You can use tabs to open other views, but use this functionality sparingly. Most users won't expect to navigate by selecting a tab. If other tabs set a parameter to a specific value, a tab that opens a view wouldn't change that value, so the rest of the workbook content will continue to show the view/data for the previous tab.

### Use toolbars

Use the toolbar style to have your links appear styled as a toolbar. In toolbar style, you must fill in fields for:

 - **Button text**: The text to display on the toolbar. Parameters can be used in this field.
 - **Icons**: The icons to display on the toolbar.
 - **Tooltip text**: Text to be displayed on the toolbar button's tooltip text. Parameters can be used in this field.

 :::image type="content" source="media/workbooks-create-workbook/workbooks-links-create-toolbar.png" alt-text="Screenshot of creating links styled as a toolbar in workbooks.":::

If any required parameters are used in button text, tooltip text, or value fields, and the required parameter is unset, the toolbar button will be disabled. For example, this functionality can be used to disable toolbar buttons when no value is selected in another parameter/control.

A sample workbook with toolbars, global parameters, and Azure Resource Manager actions is available in [sample workbooks with links](workbooks-sample-links.md#sample-workbook-with-toolbar-links).

## Add groups

You can logically group a set of components by using a group component in a workbook.

Groups in workbooks are useful for several things:

  - **Layout**: When you want components to be organized vertically, you can create a group of components that will all stack up and set the styling of the group to be a percentage width instead of setting percentage width on all the individual components.
  - **Visibility**: When you want several components to hide or show together, you can set the visibility of the entire group of components, instead of setting visibility settings on each individual component. This functionality can be useful in templates that use tabs. You can use a group as the content of the tab, and the entire group can be hidden or shown based on a parameter set by the selected tab.
  - **Performance**: When you have a large template with many sections or tabs, you can convert each section into its own subtemplate. You can use groups to load all the subtemplates within the top-level template. The content of the subtemplates won't load or run until a user makes those groups visible. Learn more about [how to split a large template into many templates](#split-a-large-template-into-many-templates).

### Add a group to your workbook

1. Make sure you're in edit mode by selecting **Edit**.
1. Add a group by doing one of these steps:
    - Select **Add** > **Add group** below an existing element or at the bottom of the workbook.
    - Select the ellipses (...) to the right of the **Edit** button next to one of the elements in the workbook. Then select **Add** > **Add group**.

      :::image type="content" source="media/workbooks-create-workbook/workbooks-add-group.png" alt-text="Screenshot that shows adding a group to a workbook. ":::

1. Select components for your group.
1. Select **Done Editing.**

   This group is in read mode with two components inside: a text component and a query component.
   
   :::image type="content" source="media/workbooks-create-workbook/workbooks-groups-view.png" alt-text="Screenshot that shows a group in read mode in a workbook.":::

   In edit mode, you can see those two components are actually inside a group component. In the following screenshot, the group is in edit mode. The group contains two components inside the dashed area. Each component can be in edit or read mode, independent of each other. For example, the text step is in edit mode while the query step is in read mode.

   :::image type="content" source="media/workbooks-create-workbook/workbooks-groups-edit.png" alt-text="Screenshot of a group in edit mode in a workbook.":::

### Scoping a group

A group is treated as a new scope in the workbook. Any parameters created in the group are only visible inside the group. This is also true for merge. You can only see data inside the group or at the parent level.

### Group types

You can specify which type of group to add to your workbook. There are two types of groups:

 - **Editable**: The group in the workbook allows you to add, remove, or edit the contents of the components in the group. This group is most commonly used for layout and visibility purposes.
 - **From a template**: The group in the workbook loads from the contents of another workbook by its ID. The content of that workbook is loaded and merged into the workbook at runtime. In edit mode, you can't modify any of the contents of the group. They'll just load again from the template the next time the component loads. When you load a group from a template, use the full Azure Resource ID of an existing workbook.

### Load types

You can specify how and when the contents of a group are loaded.

#### Lazy loading

Lazy loading is the default. In lazy loading, the group is only loaded when the component is visible. This functionality allows a group to be used by tab components. If the tab is never selected, the group never becomes visible, so the content isn't loaded.

For groups created from a template, the content of the template isn't retrieved and the components in the group aren't created until the group becomes visible. Users see progress spinners for the whole group while the content is retrieved.

#### Explicit loading

In this mode, a button is displayed where the group would be. No content is retrieved or created until the user explicitly selects the button to load the content. This functionality is useful in scenarios where the content might be expensive to compute or rarely used. You can specify the text to appear on the button.

This screenshot shows explicit load settings with a configured **Load More** button:

   :::image type="content" source="media/workbooks-create-workbook/workbooks-groups-explicitly-loaded.png" alt-text="Screenshot that shows explicit load settings for a group in the workbook.":::

This screenshot shows the group before being loaded in the workbook:

  :::image type="content" source="media/workbooks-create-workbook/workbooks-groups-explicitly-loaded-before.png" alt-text="Screenshot that shows an explicit group before being loaded in the workbook.":::

This screenshot shows the group after being loaded in the workbook:

  :::image type="content" source="media/workbooks-create-workbook/workbooks-groups-explicitly-loaded-after.png" alt-text="Screenshot that shows an explicit group after being loaded in the workbook.":::

#### Always mode

In **Always** mode, the content of the group is always loaded and created as soon as the workbook loads. This functionality is most frequently used when you're using a group only for layout purposes, where the content is always visible.

### Use templates inside a group

When a group is configured to load from a template, by default, that content is loaded in lazy mode. It only loads when the group is visible.

When a template is loaded into a group, the workbook attempts to merge any parameters declared in the template with parameters that already exist in the group. Any parameters that already exist in the workbook with identical names are merged out of the template being loaded. If all parameters in a parameter component are merged out, the entire parameters component disappears.

#### Example 1: All parameters have identical names

Suppose you have a template that has two parameters at the top, a time range parameter and a text parameter named **Filter**:

   :::image type="content" source="media/workbooks-create-workbook/workbooks-groups-top-level-params.png" alt-text="Screenshot that shows top-level parameters in a workbook.":::

Then a group component loads a second template that has its own two parameters and a text component, where the parameters are named the same:

   :::image type="content" source="media/workbooks-create-workbook/workbooks-groups-merged-away.png" alt-text="Screenshot that shows a workbook template with top-level parameters.":::

When the second template is loaded into the group, the duplicate parameters are merged out. Because all the parameters are merged away, the inner parameters component is also merged out. The result is that the group contains only the text component.

### Example 2: One parameter has an identical name

Suppose you have a template that has two parameters at the top, a time range parameter and a text parameter named **FilterB** ():

   :::image type="content" source="media/workbooks-create-workbook/workbooks-groups-wont-merge-away.png" alt-text="Screenshot that shows a group component with the result of parameters merged away.":::

When the group's component's template is loaded, the **TimeRange** parameter is merged out of the group. The workbook contains the initial parameters component with **TimeRange** and **Filter**, and the group's parameter only includes **FilterB**.

  :::image type="content" source="media/workbooks-create-workbook/workbooks-groups-wont-merge-away-result.png" alt-text="Screenshot that shows a workbook group where parameters won't merge away.":::

If the loaded template had contained **TimeRange** and **Filter** (instead of **FilterB**), the resulting workbook would have a parameters component and a group with only the text component remaining.

### Split a large template into many templates

To improve performance, it's helpful to break up a large template into multiple smaller templates that load some content in lazy mode or on demand by the user. This arrangement makes the initial load faster because the top-level template can be much smaller.

When you split a template into parts, you need to split the template into many templates (subtemplates) that all work individually. If the top-level template has a **TimeRange** parameter that other components use, the subtemplate also needs to have a parameters component that defines a parameter with the same exact name. The subtemplates work independently and can load inside larger templates in groups.

To turn a larger template into multiple subtemplates:

1. Create a new empty group near the top of the workbook, after the shared parameters. This new group eventually becomes a subtemplate.
1. Create a copy of the shared parameters component. Then use **move into group** to move the copy into the group created in step 1. This parameter allows the subtemplate to work independently of the outer template and is merged out when it's loaded inside the outer template.
    
    > [!NOTE]
    > Subtemplates don't technically need to have the parameters that get merged out if you never plan on the subtemplates being visible by themselves. If the subtemplates don't have the parameters, they'll be hard to edit or debug if you need to do so later.

1. Move each component in the workbook you want to be in the subtemplate into the group created in step 1.
1. If the individual components moved in step 3 had conditional visibilities, that will become the visibility of the outer group (like used in tabs). Remove them from the components inside the group and add that visibility setting to the group itself. Save here to avoid losing changes. You can also export and save a copy of the JSON content.
1. If you want that group to be loaded from a template, you can use **Edit** in the group. This action opens only the content of that group as a workbook in a new window. You can then save it as appropriate and close this workbook view. Don't close the browser. Only close that view to go back to the previous workbook where you were editing.
1. You can then change the group component to load from a template and set the template ID field to the workbook/template you created in step 5. To work with workbook IDs, the source needs to be the full Azure Resource ID of a shared workbook. Select **Load** and the content of that group is now loaded from that subtemplate instead of being saved inside this outer workbook.

## Next steps

[Common Azure Workbooks use cases](workbooks-commonly-used-components.md)
