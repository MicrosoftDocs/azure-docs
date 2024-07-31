---
title: SQL scripts in Synapse Studio
description: Get an introduction to Synapse Studio SQL scripts in Azure Synapse Analytics.  
author: pimorano 
ms.service: azure-synapse-analytics 
ms.subservice: sql
ms.topic: conceptual 
ms.date: 04/15/2020
ms.author: pimorano 
ms.reviewer: omafnan
---

# Synapse Studio SQL scripts in Azure Synapse Analytics 

Synapse Studio provides a web interface for SQL scripts where you can author SQL queries.

## Begin authoring in a SQL script

To start the authoring experience in a SQL script, you can create a new SQL script through one of the following methods on the **Develop** pane:

- Select the plus sign (**+**), and then select **SQL script**.

- Right-click **SQL scripts**, and then select **New SQL script**.

- Right-click **SQL scripts**, and then select **Import**. Select an existing SQL script from your local storage.

  ![Screenshot that shows the Develop pane and the command to import a SQL script.](media/author-sql-script/new-sql-script-3-actions.png)

## Create your SQL script

1. Choose a name for your SQL script by selecting the **Properties** button and replacing the default name assigned to the SQL script.

   ![Screenshot that shows the pane for SQL script properties.](media/author-sql-script/new-sql-script-rename.png)

2. On the **Connect to** dropdown menu, select the specific dedicated SQL pool or serverless SQL pool. Or if necessary, choose the database from **Use database**.

   ![Screenshot that shows the dropdown menu for selecting a SQL pool.](media/author-sql-script/new-sql-choose-pool.png)

3. Start authoring your SQL script by using the IntelliSense feature.

## Run your SQL script

To run your SQL script, select the **Run** button. The results appear in a table by default.

![Screenshot that shows the button for running a SQL script and the table that lists results.](media/author-sql-script/new-sql-script-results-table.png)

Synapse Studio creates a new session for each SQL script execution. After a SQL script execution finishes, the session is automatically closed.

Temporary tables are visible only in the session where you created them. They're automatically dropped when the session closes.

## Export your results

You can export the results to your local storage in various formats (including CSV, Excel, JSON, and XML) by selecting **Export results** and choosing the extension.

You can also visualize the SQL script results in a chart by selecting the **Chart** button. Then select the **Chart type** and **Category column** values. You can export the chart into a picture by selecting **Save as image**.

![Screenshot that shows a results chart for a SQL script.](media/author-sql-script/new-sql-script-results-chart.png)

## Explore data from a Parquet file

You can explore Parquet files in a storage account by using a SQL script to preview the file contents.

![Screenshot that shows selections for using a SQL script to preview contents of a Parquet file.](media/author-sql-script/new-script-sqlod-parquet.png)

## Use SQL tables, external tables, and views

By using a shortcut menu on the **Data** pane, you can select actions for resources like SQL tables, external tables, and views. Explore the available commands by right-clicking the nodes of SQL databases. The commands for **New SQL script** include:

- **Select TOP 100 rows**
- **CREATE**
- **DROP**
- **DROP and CREATE**

![Screenshot that shows shortcut menus for a table node.](media/author-sql-script/new-script-database.png)

## Create folders and move SQL scripts into a folder

To create a folder:

1. On the **Develop** pane, right-click **SQL scripts** and then select **New folder**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot that shows an example of a SQL script and a shortcut menu with the command to create a new folder.](./media/author-sql-script/new-sql-script-create-folder.png)

1. On the pane that opens, enter the name of the new folder.

To move a SQL script into a folder:

1. Right-click the SQL script, and then select **Move to**.

1. On the **Move to** pane, choose a destination folder, and then select **Move here**. You can also quickly drag the SQL script and drop it into a folder.  

> [!div class="mx-imgBorder"]
> ![Screenshot that shows selections for moving a SQL script into a folder.](./media/author-sql-script/new-sql-script-move-folder.png)

## Related content

- For more information about authoring a SQL script, see the
[Azure Synapse Analytics documentation](../index.yml).
