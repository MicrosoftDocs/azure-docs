---
title: Using Synapse Analytics Studio Notebook 
description: Introduction of how to use synapse analytics studio notebook  
services: sql-data-warehouse 
author: ruixinxu 
ms.service: sql-data-warehouse 
ms.topic: conceptual 
ms.subservice: development
ms.date: 10/15/2019
ms.author: ruxu 
ms.reviewer: 
---

# Using Synapse Analytics Studio Notebook 

This document highlights following capabilities in Synapse Analytics Studio Notebook:


## Spark Session Config
You can specify the number and the size of the compute resource to be given in the spark pool for current notebook in `spark session configuration`. Restarting of spark session is required for the changes to take effect. All cached notebook variables will be cleared.

![spark_session_config](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_spark_session_mgmt.png)
[back to top](#using-synapse-analytics-studio-notebook)

## Magic Commands
Synapse Analytics Studio Notebook allows you to write multiple languages in one notebook. You can use following magic commands to switch the cell level language.

|Magic | Description |  
|---|------|
|%%pyspark| Execute `Python` query against Spark Context.  |
|%%spark| Execute `Scala` query against Spark Context.  |  
|%%sql| Execute `SparkSQL` query against Spark Context.  |
|%%csharp | Execute `Spark.NET C#` query against Spark Context. |

For example, you can write Scala query with `%%spark` or SparkSQL query with `%%sql` in a `pyspark` notebook:
![spark_magic](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_spark_magic.png)

Notes: You cannot reference data or variables directly cross different languages in Synapse Analytics Studio Notebook. In Spark, temporary table can be referenced across languages. Here is an example of reading a `Scala` DataFrame in `PySpark` and `SparkSQL` using Spark Temp Table as a workaround.

Cell 1, read a DataFrame from SQL DW connector using Scala and create a temperate table
```
%%scala
val scalaDataFrame = spark.read.option(“format”, “DW connector predefined type”)
scalaDataFrame.registerTempTable( "mydataframetable" )
```
Cell 2, use data in Spark SQL
```
%%sql
SELECT * FROM mydataframetable

```
Cell 3, use data in PySpark
```
%%pyspark
myNewPythonDataFrame = spark.sql(“SELECT * FROM mydataframetable”)
```
[back to top](#using-synapse-analytics-studio-notebook)

## Language Service


|Languages| Syntax Highlight | Syntax Error Marker  | Syntax Code Completion | Variable Code Completion| System Function Code Completion| User Function Code Completion| Smart Indent | Code Folding|
|--|--|--|--|--|--|--|--|--|
|`PySpark`|Y|Y|Y|Y|Y|Y|Y|Y|
|`SparkSQL`|Y|Y|Y|Y|--|--|--|--|
|`Spark`|Y|Y|Y|Y|--|--|--|Y|
|`Spark.NET C#`|Y|--|--|--|--|--|?|--|


### Language Service Examples - `PySpark (Python)`
Syntax Highlight
![syntax_highlight](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_syntax_highlight_pyspark.png)

Syntax Error Marker

![syntax_error_marker](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_syntax_error_marker_pyspark.png)


Syntax Code Completion

![syntax_code_completion](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_syntax_code_completion_pyspark.gif)

Variable Code Completion (to be added)

System Function Code Completion (to be added)


User Function Code Completion (to be added)

Smart Indent 

![smart_indent](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_smart_indent_pyspark.gif)

Code Folding

![code_folding](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_code_folding_pyspark.gif)


### Language Service Examples - `SparkSQL`

### Language Service Examples - `Spark (Scala)`

Syntax Highlight
![syntax_highlight](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/Arcadia_Scala_Syn_Highlight.JPG)

Syntax Error Marker

![syntax_error_marker](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/Arcadia_Scala_Syn_Error.JPG)


Syntax Code Completion

![syntax_code_completion](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/Arcadia_Scala_Syn_Complete.gif)

Variable Code Completion 
![variable_code_completion](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/Arcadia_Scala_Var_Complete.gif)

Code Folding

![code_folding](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/Arcadia_Scala_Folding.gif)

### Language Service Examples - `Spark.NET C#` 

//to be added

[back to top](#using-synapse-analytics-studio-notebook)

## Shortcut Keys

Same with Jupyter Notebook, Synapse Analytics Studio Notebook has a modal user interface. The keyboard does different things depending on which mode the Notebook cell is in. Synapse Analytics Studio Notebook supports following two modes for a given code cell:
- Command Mode. Command mode is indicated by a blue cell border. 
![command_mode](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_command_mode.PNG)
    When a cell is in Command mode, you can edit the notebook as a whole but not type into individual cells. Enter command mode by pressing `ESC` or using the mouse to click outside of a cell's editor area.
- Edit Mode. Edit mode is indicated by a green cell border and prompt showing in the editor area.
 ![edit_mode](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_edit_mode.PNG)
    When a cell is in edit mode, you cant type into the cell. Enter edit mode by pressing `Enter` or using the mouse to click on a cell's editor area.


### Shortcut Keys under Command Mode
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


### Shortcut Keys under Edit Mode
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

[back to top](#using-synapse-analytics-studio-notebook)


## Native Matplotlib support on PySpark DataFrame
 We provide native matplotlib support for PySpark DataFrame. You can use matplotlib directly on the PySpark DataFrame just as it is in python. 

[back to top](#using-synapse-analytics-studio-notebook)

## Visualization

### display()
We provide a tabular results view with built-in bar chart, line chart, pie chart, scatter chart, and area chart to help you do data operations easily. You can customize the chart settings in the Chart Options. The output of `%%sql` magic commands will appear in the rendered table view by default. For Spark DataFrames or RDDs you can call the `display(<DataFrame name>)` function to produce the rendered table view.

![builtin-charts](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_builtin_charts.png)

### displayHTML()
You can also use `displayHTML()` function to render HTML or interactive libraries like `bokeh`.


![display_html](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/displayHTML.PNG)


```python
# Bokeh code sample 
from bokeh.plotting import figure
from bokeh.embed import components, file_html
from bokeh.resources import CDN

x = [1, 2, 3, 4, 5] 
y = [6, 7, 2, 4, 5] 
p = figure(title="simple line example", x_axis_label='x', y_axis_label='y') 
p.line(x, y, legend="Temp.", line_width=2) 
html = file_html(p, CDN, "my plot1") 
displayHTML(html)

```


[back to top]((#using-synapse-analytics-studio-notebook)


## Spark Progress Indicator

We provide a Spark job progress indicator with a real-time progress bar appears to help you understand the job execution status.

![spark_progress_indicator](https://adsnotebookrelease.blob.core.windows.net/nbsamples/images/arcadia_spark_progress_indicator_1.png)
[back to top](#using-synapse-analytics-studio-notebook)



## Next steps

Check this sample notebook for more details: links to be added.