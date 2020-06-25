---
title: Create, develop, and maintain Azure Synapse Studio (preview) notebooks
description: In this article, you learn how to create and develop Azure Synapse Studio (preview) notebooks to do data preparation and visualization.
services: synapse analytics 
author: ruixinxu 
ms.service: synapse-analytics 
ms.topic: conceptual 
ms.subservice: spark
ms.date: 05/01/2020
ms.author: ruxu 
ms.reviewer: 
ms.custom: tracking-python
---

# Create, develop, and maintain Azure Synapse Studio (preview) notebooks

An Azure Synapse Studio (preview) notebook is a web interface for you to create files that contain live code, visualizations, and narrative text. Notebooks are a good place to validate ideas and use quick experiments to get insights from your data. Notebooks are also widely used in data preparation, data visualization, machine learning, and other Big Data scenarios.

With an Azure Synapse Studio notebook, you can:

* Get started with zero setup effort.
* Keep data secure with built-in enterprise security features.
* Analyze data across raw formats (CSV, txt, JSON, etc.), processed file formats (parquet, Delta Lake, ORC, etc.), and SQL tabular data files against Spark and SQL.
* Be productive with enhanced authoring capabilities and built-in data visualization.

This article describes how to use notebooks in Azure Synapse Studio.

## Create a notebook

There are two ways to create a notebook. You can create a new notebook or import an existing notebook to an Azure Synapse workspace from the **Object Explorer**. Azure Synapse Studio notebooks can recognize standard Jupyter Notebook IPYNB files.

![synapse-create-import-notebook](./media/apache-spark-development-using-notebooks/synapse-create-import-notebook.png)

## Develop notebooks

Notebooks consist of cells, which are individual blocks of code or text that can be ran independently or as a group.

### Add a cell

There are multiple ways to add a new cell to your notebook.

1. Expand the upper left **+ Cell** button, and select **Add code cell** or **Add text cell**.

    ![add-cell-with-cell-button](./media/apache-spark-development-using-notebooks/synapse-add-cell-1.png)

2. Hover over the space between two cells and select **Add code** or **Add text**.

    ![add-cell-between-space](./media/apache-spark-development-using-notebooks/synapse-add-cell-2.png)

3. Use [Shortcut keys under command mode](#shortcut-keys-under-command-mode). Press **A** to insert a cell above the current cell. Press **B** to insert a cell below the current cell.

### Set a primary language

Azure Synapse Studio notebooks support four Apache Spark languages:

* pySpark (Python)
* Spark (Scala)
* SparkSQL
* .NET for Apache Spark (C#)

You can set the primary language for new added cells from the dropdown list in the top command bar.

   ![default-synapse-language](./media/apache-spark-development-using-notebooks/synapse-default-language.png)

### Use multiple languages

You can use multiple languages in one notebook by specifying the correct language magic command at the beginning of a cell. The following table lists the  magic commands to switch cell languages.

|Magic command |Language | Description |  
|---|------|-----|
|%%pyspark| Python | Execute a **Python** query against Spark Context.  |
|%%spark| Scala | Execute a **Scala** query against Spark Context.  |  
|%%sql| SparkSQL | Execute a **SparkSQL** query against Spark Context.  |
|%%csharp | .NET for Spark C# | Execute a **.NET for Spark C#** query against Spark Context. |

The following image is an example of how you can write a PySpark query using the **%%pyspark** magic command or a SparkSQL query with the **%%sql** magic command in a **Spark(Scala)** notebook. Notice that the primary language for the notebook is set to pySpark.

   ![synapse-spark-magics](./media/apache-spark-development-using-notebooks/synapse-spark-magics.png)

### Use temp tables to reference data across languages

You cannot reference data or variables directly across different languages in a Synapse Studio notebook. In Spark, a temporary table can be referenced across languages. Here is an example of how to read a `Scala` DataFrame in `PySpark` and `SparkSQL` using a Spark temp table as a workaround.

1. In Cell 1, read a DataFrame from SQL pool connector using Scala and create a temporary table.

   ```scala
   %%scala
   val scalaDataFrame = spark.read.option("format", "DW connector predefined type")
   scalaDataFrame.registerTempTable( "mydataframetable" )
   ```

2. In Cell 2, query the data using Spark SQL.
   
   ```sql
   %%sql
   SELECT * FROM mydataframetable
   ```

3. In Cell 3, use the data in PySpark.

   ```python
   %%pyspark
   myNewPythonDataFrame = spark.sql("SELECT * FROM mydataframetable")
   ```

### IDE-style IntelliSense

Azure Synapse Studio notebooks are integrated with the Monaco editor to bring IDE-style IntelliSense to the cell editor. Syntax highlight, error maker, and automatic code completions help you to write code and identify issues quicker.

The IntelliSense features are at different levels of maturity for different languages. Use the table below to see what's supported.

|Languages| Syntax Highlight | Syntax Error Marker  | Syntax Code Completion | Variable Code Completion| System Function Code Completion| User Function Code Completion| Smart Indent | Code Folding|
|--|--|--|--|--|--|--|--|--|
|PySpark (Python)|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Spark (Scala)|Yes|Yes|Yes|Yes|-|-|-|Yes|
|SparkSQL|Yes|Yes|-|-|-|-|-|-|
|.NET for Spark (C#)|Yes|-|-|-|-|-|-|-|

### Format text cell with toolbar buttons

You can use the format buttons in the text cells toolbar to do common markdown actions. It includes bolding text, italicizing text, inserting code snippets, inserting unordered list, inserting ordered list and inserting image from URL.

  ![synapse-text-cell-toolbar](./media/apache-spark-development-using-notebooks/synapse-text-cell-toolbar.png)

### Undo cell operations
Click the **undo** button or press **Ctrl+Z** to revoke the most recent cell operation. Now you can undo up to the latest 20 historical cell actions. 

   ![synapse-undo-cells](./media/apache-spark-development-using-notebooks/synapse-undo-cells.png)

### Move a cell

Select the ellipses (...) to access the additional cell actions menu at the far right. Then select **Move cell up** or **Move cell down** to move the current cell. 

You can also use [shortcut keys under command mode](#shortcut-keys-under-command-mode). Press **Ctrl+Alt+↑** to move up the current cell. Press **Ctrl+Alt+↓** to move the current cell down.

   ![move-a-cell](./media/apache-spark-development-using-notebooks/synapse-move-cells.png)

### Delete a cell

To delete a cell, select the ellipses (...) to access the additional cell actions menu at the far right then select **Delete cell**. 

You can also use [shortcut keys under command mode](#shortcut-keys-under-command-mode). Press **D,D** to delete the current cell.
  
   ![delete-a-cell](./media/apache-spark-development-using-notebooks/synapse-delete-cell.png)

### Collapse a cell input
Click the arrow button at the bottom of the current cell to collapse it. To expand it, click the arrow button while the cell is collapsed.

   ![collapse-cell-input](./media/apache-spark-development-using-notebooks/synapse-collapse-cell-input.gif)

### Collapse a cell output

Click the **collapse output** button at the upper left of the current cell output to collapse it. To expand it, click the **Show cell output** while the cell output is collapsed.

   ![collapse-cell-output](./media/apache-spark-development-using-notebooks/synapse-collapse-cell-output.gif)

## Run notebooks

You can run the code cells in your notebook individually or all at once. The status and progress of each cell is represented in the notebook.

### Run a cell

There are several ways to run the code in a cell.

1. Hover on the cell you want to run and select the **Run Cell** button or press **Ctrl+Enter**.

   ![run-cell-1](./media/apache-spark-development-using-notebooks/synapse-run-cell.png)


2. To Access the additional cell actions menu at the far right, select the ellipses (**...**). Then, select **Run cell**.

   ![run-cell-2](./media/apache-spark-development-using-notebooks/synapse-run-cell-2.png)
   
3. Use [Shortcut keys under command mode](#shortcut-keys-under-command-mode). Press **Shift+Enter** to run the current cell and select the cell below. Press **Alt+Enter** to run the current cell and insert a new cell below.


### Run all cells
Click the **Run All** button to run all the cells in current notebook in sequence.

   ![run-all-cells](./media/apache-spark-development-using-notebooks/synapse-run-all.png)

### Run all cells above or below

To Access the additional cell actions menu at the far right, select the ellipses (**...**). Then, select **Run cells above** to run all the cells above the current in sequence. Select **Run cells below** to run all the cells below the current in sequence.

   ![run-cells-above-or-below](./media/apache-spark-development-using-notebooks/synapse-run-cells-above-or-below.png)


### Cell status indicator

A step-by-step cell execution status is displayed beneath the cell to help you see its current progress. Once the cell run is complete, an execution summary with the total duration and end time are shown and kept there for future reference.

![cell-status](./media/apache-spark-development-using-notebooks/synapse-cell-status.png)

### Spark progress indicator

Azure Synapse Studio notebook is purely Spark based. Code cells are executed on the Spark pool remotely. A Spark job progress indicator is provided with a real-time progress bar appears to help you understand the job execution status.


![spark-progress-indicator](./media/apache-spark-development-using-notebooks/synapse-spark-progress-indicator.png)

### Spark session config

You can specify the timeout duration, the number, and the size of executors to give to the current Spark session in **Configure session**. Restart the Spark session is for configuration changes to take effect. All cached notebook variables are cleared.

![session-mgmt](./media/apache-spark-development-using-notebooks/synapse-spark-session-mgmt.png)


## Bring data to a notebook

You can load data from Azure Blob Storage, Azure Data Lake Store Gen 2, and SQL pool as shown in the code samples below.

### Read a CSV from Azure Data Lake Store Gen2 as a Spark DataFrame

```python
from pyspark.sql import SparkSession
from pyspark.sql.types import *
account_name = "Your account name"
container_name = "Your container name"
relative_path = "Your path"
adls_path = 'abfss://%s@%s.dfs.core.windows.net/%s' % (blob_container_name, blob_account_name,  blob_relative_path)

spark.conf.set("fs.azure.account.auth.type.%s.dfs.core.windows.net" %account_name, "SharedKey")
spark.conf.set("fs.azure.account.key.%s.dfs.core.windows.net" %account_name ,"Your ADLSg2 Primary Key")

df1 = spark.read.option('header', 'true') \
                .option('delimiter', ',') \
                .csv(adls_path + '/Testfile.csv')

```

#### Read a CSV from Azure Blob Storage as a Spark DataFrame

```python

from pyspark.sql import SparkSession
from pyspark.sql.types import *

blob_account_name = "Your blob account name"
blob_container_name = "Your blob container name"
blob_relative_path = "Your blob relative path"
blob_sas_token = "Your blob sas token"

wasbs_path = 'wasbs://%s@%s.blob.core.windows.net/%s' % (blob_container_name, blob_account_name, blob_relative_path)
spark.conf.set('fs.azure.sas.%s.%s.blob.core.windows.net' % (blob_container_name, blob_account_name), blob_sas_token)

df = spark.read.option("header", "true") \
            .option("delimiter","|") \
            .schema(schema) \
            .csv(wasbs_path)

```

### Read data from the primary storage account

You can access data in the primary storage account directly. There's no need to provide the secret keys. In Data Explorer, right-click on a file and select **New notebook** to see a new notebook with data extractor autogenerated.

![data-to-cell](./media/apache-spark-development-using-notebooks/synapse-data-to-cell.png)

## Visualize data in a notebook

### Display()

A tabular results view is provided with the option to create a bar chart, line chart, pie chart, scatter chart, and area chart. You can visualize your data without having to write code. The charts can be customized in the **Chart Options**. 

The output of **%%sql** magic commands appear in the rendered table view by default. You can call **display(`<DataFrame name>`)** on Spark DataFrames or Resilient Distributed Datasets (RDD) function to produce the rendered table view.

   ![builtin-charts](./media/apache-spark-development-using-notebooks/synapse-builtin-charts.png)

### DisplayHTML()

You can render HTML or interactive libraries, like **bokeh**, using the **displayHTML()**.

The following image is an example of plotting glyphs over a map using **bokeh**.

   ![bokeh-example](./media/apache-spark-development-using-notebooks/synapse-bokeh-image.png)
   

Run the following sample code to draw the image above.

```python
from bokeh.plotting import figure, output_file
from bokeh.tile_providers import get_provider, Vendors
from bokeh.embed import file_html
from bokeh.resources import CDN
from bokeh.models import ColumnDataSource

tile_provider = get_provider(Vendors.CARTODBPOSITRON)

# range bounds supplied in web mercator coordinates
p = figure(x_range=(-9000000,-8000000), y_range=(4000000,5000000),
           x_axis_type="mercator", y_axis_type="mercator")
p.add_tile(tile_provider)

# plot datapoints on the map
source = ColumnDataSource(
    data=dict(x=[ -8800000, -8500000 , -8800000],
              y=[4200000, 4500000, 4900000])
)

p.circle(x="x", y="y", size=15, fill_color="blue", fill_alpha=0.8, source=source)

# create an html document that embeds the Bokeh plot
html = file_html(p, CDN, "my plot1")

# display this html
displayHTML(html)

```

## Save notebooks

You can save a single notebook or all notebooks in your workspace.

1. To save changes you made to a single notebook, select the **Publish** button on the notebook command bar.

   ![publish-notebook](./media/apache-spark-development-using-notebooks/synapse-publish-notebook.png)

2. To save all notebooks in your workspace, select the **Publish all** button on the workspace command bar. 

   ![publish-all](./media/apache-spark-development-using-notebooks/synapse-publish-all.png)

In the notebook properties, you can configure whether to include the cell output when saving.

   ![notebook-properties](./media/apache-spark-development-using-notebooks/synapse-notebook-properties.png)

## Magic commands
You can use your familiar Jupyter magic commands in Azure Synapse Studio notebooks. Check the list below as the current available magic commands. Tell us your use cases on GitHub so that we can continue to build out more magic commands to meet your needs.

Available line magics:
[%lsmagic](https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-lsmagic), [%time](https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-time), [%timeit](https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-timeit)

Available cell magics:
[%%time](https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-time), [%%timeit](https://ipython.readthedocs.io/en/stable/interactive/magics.html#magic-timeit), [%%capture](https://ipython.readthedocs.io/en/stable/interactive/magics.html#cellmagic-capture), [%%writefile](https://ipython.readthedocs.io/en/stable/interactive/magics.html#cellmagic-writefile), [%%sql](#use-multiple-languages), [%%pyspark](#use-multiple-languages), [%%spark](#use-multiple-languages), [%%csharp](#use-multiple-languages)

## Shortcut keys

Similar to Jupyter Notebooks, Azure Synapse Studio notebooks have a modal user interface. The keyboard does different things depending on which mode the notebook cell is in. Synapse Studio notebooks support the following two modes for a given code cell: command mode and edit mode.

1. A cell is in command mode when there is no text cursor prompting you to type. When a cell is in Command mode, you can edit the notebook as a whole but not type into individual cells. Enter command mode by pressing `ESC` or using the mouse to click outside of a cell's editor area.

   ![command-mode](./media/apache-spark-development-using-notebooks/synapse-command-mode2.png)

2. Edit mode is indicated by a text cursor prompting you to type in the editor area. When a cell is in edit mode, you can type into the cell. Enter edit mode by pressing `Enter` or using the mouse to click on a cell's editor area.
   
   ![edit-mode](./media/apache-spark-development-using-notebooks/synapse-edit-mode2.png)

### Shortcut keys under command mode

Using the following keystroke shortcuts, you can more easily navigate and run code in Azure Synapse notebooks.

| Action |Synapse Studio notebook Shortcuts  |
|--|--|
|Run the current cell and select below | Shift+Enter |
|Run the current cell and insert below | Alt+Enter |
|Select cell above| Up |
|Select cell below| Down |
|Insert cell above| A |
|Insert cell below| B |
|Extend selected cells above| Shift+Up |
|Extend selected cells below| Shift+Down|
|Move cell up| Ctrl+Alt+↑ |
|Move cell down| Ctrl+Alt+↓ |
|Delete selected cells| D, D |
|Switch to edit mode| Enter |

### Shortcut keys under edit mode

Using the following keystroke shortcuts, you can more easily navigate and run code in Azure Synapse notebooks when in Edit mode.

| Action |Synapse Studio notebook shortcuts  |
|--|--|
|Move cursor up | Up |
|Move cursor down|Down|
|Undo|Ctrl + Z|
|Redo|Ctrl + Y|
|Comment/Uncomment|Ctrl + /|
|Delete word before|Ctrl + Backspace|
|Delete word after|Ctrl + Delete|
|Go to cell start|Ctrl + Home|
|Go to cell end |Ctrl + End|
|Go one word left|Ctrl + Left|
|Go one word right|Ctrl + Right|
|Select all|Ctrl + A|
|Indent| Ctrl + ]|
|Dedent|Ctrl + [|
|Switch to command mode| Esc |

## Next steps

- [Quickstart: Create an Apache Spark pool (preview) in Azure Synapse Analytics using web tools](../quickstart-apache-spark-notebook.md)
- [What is Apache Spark in Azure Synapse Analytics](apache-spark-overview.md)
- [Use .NET for Apache Spark with Azure Synapse Analytics](spark-dotnet.md)
- [.NET for Apache Spark documentation](/dotnet/spark?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
- [Azure Synapse Analytics](https://docs.microsoft.com/azure/synapse-analytics)
