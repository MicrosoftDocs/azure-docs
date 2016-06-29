<properties
	pageTitle="Create a custom dashboard in Log Analytics | Microsoft Azure"
	description="This guide helps you understand how Log Analytics Dashboards can visualize all of your saved log searches, giving you a single lens to view your environment."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/28/2016"
	ms.author="banders"/>

# Create a custom dashboard in Log Analytics

This guide helps you understand how Log Analytics Dashboards can visualize all of your saved log searches, giving you a single lens to view your environment.

![Example Dashboard](./media/log-analytics-dashboards/oms-dashboards-example-dash.png)

## How do I create my dashboard?

To begin, go to the OMS Overview by clicking the Overview button on the left navigation. You'll see the "My Dashboard" tile on the left. Click it to drill down into your dashboard.

![Overview](./media/log-analytics-dashboards/oms-dashboards-overview.png)



## Adding a tile

In dashboards, tiles are powered by your saved log searches. OMS comes with many pre-made saved log searches, so you can begin right away. You'll see the following pictorial outlining how to begin.

![Pictorial](./media/log-analytics-dashboards/oms-dashboards-pictorial.png)

In the My Dashboard view, simply click on the 'customize' gear at the bottom of the page to enter customize mode. The panel that opens on the right side of the page shows all of your workspace's saved log searches.

![Add Tiles 1](./media/log-analytics-dashboards/oms-dashboards-add-tile1.png)

To visualize a saved log search as a tile, just drag it onto the empty space to the left. As you drag it will turn into a tile.

![Add Tiles 2](./media/log-analytics-dashboards/oms-dashboards-add-tile2.png)

![Add Tiles 3](./media/log-analytics-dashboards/oms-dashboards-add-tile3.png)


## Edit a tile

In the My Dashboard view, simply click on the 'customize' gear at the bottom of the page to enter customize mode. Click the tile you want to edit. The right panel changes to edit, and gives a selection of options:

![Edit Tile](./media/log-analytics-dashboards/oms-dashboards-edit-tile.png)

### Tile visualizations#
There are two kinds of tile visualizations to choose from:

|chart type|what it does|
|---|---|
|![Bar Chart](./media/log-analytics-dashboards/oms-dashboards-bar-chart.png)|Displays a timeline of your saved log search's results, or a list of results by a field depending on if your log search aggregates results by a field or not.
|![metric](./media/log-analytics-dashboards/oms-dashboards-metric.png)|Displays your total log search result hits as a number in a tile. Metric tiles allow you to set a threshold that will highlight the tile when the threshold is reached.|

### Threshold
You can create a threshold on a tile using the Metric visualization. Select on to create a threshold value on the tile. Choose whether to highlight the tile when the value is over or under the chosen threshold, then set the threshold value below.

## Organizing the dashboard
To organize your dashboard, navigate to the My Dashboard view and click on the 'customize' gear at the bottom of the page to enter customize mode. Click and drag the tile you want to move, and move it to where you want your tile to be.

![Organize your Dashboard](./media/log-analytics-dashboards/oms-dashboards-organize.png)

## Remove a tile
To remove a tile, navigate to the My Dashboard view and click on the **customize** gear at the bottom of the page to enter customize mode. Select the tile you want to remove, then on the right panel select **Remove Tile**.

![Remove a Tile](./media/log-analytics-dashboards/oms-dashboards-remove-tile.png)

## Next steps

- Create alerts in Log Analytics to generate notifications and to remediate problems.
