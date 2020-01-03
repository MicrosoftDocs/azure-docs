---
author: mgblythe
ms.service: data-explorer
ms.topic: include
ms.date: 11/14/2018
ms.author: mblythe
---

Now that you have data in Power BI Desktop, you can create reports based on that data. You'll create a simple report with a column chart that shows crop damage by state.

1. On the left side of the main Power BI window, select the report view.

    ![Report view](media/data-explorer-power-bi-visualize-basic/report-view.png)

1. In the **VISUALIZATIONS** pane, select the clustered column chart.

    ![Add column chart](media/data-explorer-power-bi-visualize-basic/add-column-chart.png)

    A blank chart is added to the canvas.

    ![Blank chart](media/data-explorer-power-bi-visualize-basic/blank-chart.png)

1. In the **FIELDS** list, select **DamageCrops** and **State**.

    ![Select fields](media/data-explorer-power-bi-visualize-basic/select-fields.png)

    You now have a chart that shows the damage to crops for the top 1000 rows in the table.

    ![Crop damage by state](media/data-explorer-power-bi-visualize-basic/damage-column-chart.png)

1. Save the report.