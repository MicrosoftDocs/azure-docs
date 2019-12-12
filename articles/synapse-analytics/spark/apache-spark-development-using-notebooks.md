---
title: Using Azure Synapse Analytics studio notebook 
description: Introduction of how to use Azure Synapse Analytics studio notebook  
services: synapse analytics 
author: ruixinxu 
ms.service: synapse-analytics 
ms.topic: conceptual 
ms.subservice:
ms.date: 10/15/2019
ms.author: ruxu 
ms.reviewer: 
---

# Using Azure Synapse Analytics studio notebook

Azure Synapse Analytics studio notebook is a web interface for you to create files that contain live code, visualizations, and narrative text. Notebook is a good place to validate ideas and get insights from Big Data with quick experiments. It also has been widely used in data preparation, data visualization, machine learning, and more.

With Azure Synapse Analytics studio notebook you will:

- Be able to jump-start with zero setup effort.
- Enjoy enterprise security of the notebook content.
- Analyze data across raw formats (CSV, txt, JSON etc.), processed file formats (parquet, Delta Lake, ORC etc.), and SQL tabular data files against Spark and SQL seamlessly.
- Be productive with enhanced authoring capabilities and built-in data visualization.

This document describes how to use notebook in Azure Synapse Analytics Studio.

## Create a notebook

You can either create a new notebook or import an existing notebook to Azure Synapse Analytics workspace from the Object Explorer. Azure Synapse Analytics Studio notebook can recognize standard Jupyter Notebook IPYNB files.

[!div class="mx-imgBorder"]
<img src="./media/apache-spark-development-using-notebooks/synapse-create-import-notebook.png" alt="import_notebook" width="350"/>

## Develop notebooks

### Add a cell

There are a couple ways to add a cell:

Expand the upper left **+ Cell** button, and select **Add code cell** or **Add text cell**.

<img src="./media/apache-spark-development-using-notebooks/synapse-add-cell-1.png" alt="add-cell-1" width="200"/>

Hover over the space between two cells and click **Add code** or **Add text**.

<img src="./media/apache-spark-development-using-notebooks/synapse-add-cell-2.png" alt="add-cell-2" width="400"/>

Access the notebook cell menu at the far right, click the **...** , and select **Insert code cell above** or **Insert code cell below** or **Insert text cell above** or **Insert code text cell beloW**.

<img src="./media/apache-spark-development-using-notebooks/synapse-add-cell-3.png" alt="add-cell-3" width="200"/>

Use [Shortcut keys](#shortcut-keys-under-command-mode).

### Primary language

Azure Synapse Analytic studio notebook supports four spark languages: **pyspark (python)**, **spark (Scala)**, **sparkSQL**, and **Spark.NET (C#)**. You can set the primary language for new added cells from the dropdown list in the top command bar.

<img src="./media/apache-spark-development-using-notebooks/synapse-default-language.png" alt="default_language" width="200"/>

### Mix languages

You can write mixed languages in one notebook by specifying the language magic commands at the beginning of a cell. The following table lists the magic commands available.

|Magic Commands |Language | Description |  
|---|------|-----|
|%%pyspark| Python | Execute **Python** query against Spark Context.  |
|%%spark| Scala | Execute **Scala** query against Spark Context.  |  
|%%sql| SparkSQL | Execute **SparkSQL** query against Spark Context.  |
|%%csharp | Spark.NET C# | Execute **Spark.NET C#** query against Spark Context. |

For example, you can write Scala query with **%%spark** or SparkSQL query with **%%sql** in a **pyspark** notebook:
![spark_magic](./media/apache-spark-development-using-notebooks/synapse-spark-magics.png)

You cannot reference data or variables directly cross different languages in Synapse Analytics Studio Notebook. In Spark, a temporary table can be referenced across languages. Here is an example of reading a `Scala` DataFrame in `PySpark` and `SparkSQL` using Spark Temp Table as a workaround.

Cell 1, read a DataFrame from SQL DW connector using Scala and create a temperate table

```java
%%scala
val scalaDataFrame = spark.read.option(“format”, “DW connector predefined type”)
scalaDataFrame.registerTempTable( "mydataframetable" )
```

Cell 2, use data in Spark SQL

```sql
%%sql
SELECT * FROM mydataframetable
```

Cell 3, use data in PySpark

```python
%%pyspark
myNewPythonDataFrame = spark.sql(“SELECT * FROM mydataframetable”)
```

### IDE-style intelliSense

Azure Synapse Analytic Studio notebook integrates with the Monaco editor to bring IDE-style intelliSense to cell editor. Syntax highlight, error maker, and auto code completions will help you to write code faster and figure out issues quicker. 

The intelliSense are at different levels of maturity for different languages, check the table below for details. 

|Languages| Syntax Highlight | Syntax Error Marker  | Syntax Code Completion | Variable Code Completion| System Function Code Completion| User Function Code Completion| Smart Indent | Code Folding|
|--|--|--|--|--|--|--|--|--|
|PySpark (Python)|Y|Y|Y|Y|Y|Y|Y|Y|
|Spark (Scala)|Y|Y|Y|Y|-|-|-|Y|
|SparkSQL|Y|Y|-|-|-|-|-|-|
|Spark.NET (C#)|Y|-|-|-|-|-|-|-|

## Run notebooks

### Run cells

To run a cell, hover on the cell you want to run and click the **Run Cell** button or press **Ctrl+Enter**.

<img src="./media/apache-spark-development-using-notebooks/synapse-run-cell.png" alt="run-cell" width="80"/> 

Access the notebook cell menu at the far right, click the **...** , and select **Run cell**

<img src="./media/apache-spark-development-using-notebooks/synapse-add-cell-3.png" alt="run-cell-2" width="200"/>

Click the **Run All** button to run all the cells in current notebook in sequence. 

<img src="./media/apache-spark-development-using-notebooks/synapse-run-all.png" alt="run-all-cell" width="80"/>

### Cell status indicator
A step-by-step cell execution status is displayed beneath the cell to help you see its current progress. Once the cell run is complete, an execution summary with the total duration and end time will be shown and kept there for future reference.

<img src="./media/apache-spark-development-using-notebooks/synapse-cell-status.png" alt="cell-status" width="500"/>

### Spark progress indicator

Azure Synapse Analytics studio notebook is purely Spark based. Code cells will be executed on the spark pool remotely. A Spark job progress indicator is provided with a real-time progress bar appears to help you understand the job execution status.

![spark_progress_indicator](./media/apache-spark-development-using-notebooks/synapse-spark-progress-indicator.png)

### Spark session config

You can specify the number and the size of executors to give to current Spark session in **spark session configuration**. Restarting of spark session is required for the changes to take effect. All cached notebook variables will be cleared.

![spark_session_config](./media/apache-spark-development-using-notebooks/synapse-spark-session-mgmt.png)

## Bring data to a notebook

You can load data from Azure Blob Storage, Azure Data Lake Store Gen 2, and SQL Data Warehouse as shown in the sample code below:

```python
#read a csv file from Azure Data Lake Store Gen2 as Spark DataFrame

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

```python
#read a csv file from Azure Blob Storage as Spark DataFrame

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

### Bring data from primary storage account

You can access data in the primary storage account directly. No need to provide the secret keys. In data explorer, right click on a file and click **New notebook**, you will see a new notebook with data extractor auto generated.

<img src="./media/apache-spark-development-using-notebooks/synapse-data-to-cell.png" alt="data-to-cell" width="800"/>

## Visualize data in notebook

### Display()

 A tabular results view is provided with built-in bar chart, line chart, pie chart, scatter chart, and area chart. You can visualize your data without having to write code. The charts can be customized in the Chart Options. The output of **%%sql** magic commands will appear in the rendered table view by default. You can call the **display(`<DataFrame name>`)** on Spark DataFrames or RDDs function to produce the rendered table view.

![builtin-charts](./media/apache-spark-development-using-notebooks/synapse-builtin-charts.png)

### DisplayHTML()

You can also use **displayHTML()** function to render HTML or interactive libraries like **bokeh**.

Here is an example of using **bokeh** to show the passengers drop off density of New York City green taxi data.

![bokeh example](./media/apache-spark-development-using-notebooks/synapse-bokeh-image.png)

```python
# Bokeh code sample
# view the dropoff density of new york city green taxi in geographic map

# importing plotting pacakges
from bokeh.plotting import figure, show, output_file
from bokeh.tile_providers import get_provider, Vendors
from bokeh.models import BoxZoomTool
from bokeh.embed import components, file_html
from bokeh.resources import CDN

# define a base image
NYC = x_range, y_range = ((-8242000,-8210000), (4965000,4990000))

plot_width = int(750)
plot_height = int(plot_width//1.2)

def base_plot(tools='pan, wheel_zoom, reset', plot_width=plot_width, plot_height=plot_height, **plot_args):
 p = figure(tools=tools, plot_width=plot_width, plot_height=plot_height,
 x_range=x_range, y_range=y_range, x_axis_type="mercator", y_axis_type="mercator")

 tile_provider = get_provider(Vendors.CARTODBPOSITRON)
 p.add_tile(tile_provider)

 p.axis.visible = True
 p.xgrid.grid_line_color = None
 p.ygrid.grid_line_color = None

 p.xaxis.axis_label = "drop off longtitude"
 p.yaxis.axis_label = "drop off latitude"
 return p

options = dict(line_color=None, fill_color='blue', size=3)

p = base_plot()

# sample data to plot
samples = nyc_green_taxi_df.sample(True, 0.001, seed=10)

# convert geographical coordinates (longtitude,latitude) to web mercator coordinates
samplesmercator = samples.withColumn('dropoffLongitudemer',col('dropoffLongitude')*6378137 * 3.14159 / 180)\
 .withColumn('dropoffLatitudemer',log(tan((col('dropoffLatitude')+90) * 3.14159/360))*6378137)

# convert spark dataframe columns to list
x = samplesmercator.select('dropoffLongitudemer').rdd.flatMap(lambda x:x).collect()
y = samplesmercator.select('dropoffLatitudemer').rdd.flatMap(lambda x:x).collect()

# draw pick up points on 
p.circle(x=x, y=y, **options)

# create an html document that embeds the Bokeh plot
html = file_html(p, CDN, "my plot1")

# display this html
displayHTML(html)

```

## Save notebooks

To save your changes of current notebook, click the **Publish** button on the notebook command bar.

<img src="./media/apache-spark-development-using-notebooks/synapse-publish-notebook.png" alt="publish-notebook" width="80"/> 

Click the **Publish all** button on the workspace command bar to save all the changes on current workspace.  

<img src="./media/apache-spark-development-using-notebooks/synapse-publish-all.png" alt="publish-all" width="120"/> 

In the notebook properties, you can config whether to include the cell output when saving. 

<img src="./media/apache-spark-development-using-notebooks/synapse-notebook-properties.png" alt="notebook-properties" width="300"/> 

## Shortcut keys

Same with Jupyter Notebook, Synapse Analytics Studio Notebook has a modal user interface. The keyboard does different things depending on which mode the Notebook cell is in. Synapse Analytics Studio Notebook supports following two modes for a given code cell:

- Command Mode. Command mode is indicated when there is no prompt showing up.
    <img src="./media/apache-spark-development-using-notebooks/synapse-command-mode2.png" alt="command-mode" width="600" /> 

    When a cell is in Command mode, you can edit the notebook as a whole but not type into individual cells. Enter command mode by pressing `ESC` or using the mouse to click outside of a cell's editor area.

- Edit Mode. Edit mode is indicated by a prompt showing in the editor area.

    <img src="./media/apache-spark-development-using-notebooks/synapse-edit-mode2.png" alt="edit mode" width="600"/> 

    When a cell is in edit mode, you cant type into the cell. Enter edit mode by pressing `Enter` or using the mouse to click on a cell's editor area.

### Shortcut keys under command mode

| Action |Synapse Analytics Studio Notebook Shortcuts  |
|--|--|
|Run the current cell and select below | Shift+Enter |
|Run the current cell and insert below | Alt+Enter |
|Select cell above| Up |
|Select cell below| Down |
|Insert cell above| A |
|Insert cell below| B |
|Extend selected cells above| Shift+Up |
|Extend selected cells below| Shift+Down|
|Delete selected cells|D,D|
|Switch to edit mode| Enter |

### Shortcut keys under edit mode

| Action |Synapse Analytics Studio Notebook Shortcuts  |
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
