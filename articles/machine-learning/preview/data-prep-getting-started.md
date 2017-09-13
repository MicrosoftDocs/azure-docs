---
title: Getting Started with Data Preparation  | Microsoft Docs
description: This is the getting started guide for the data prep section of AML workbench
author: cforbe
ms.author: cforbe@microsoft.com
ms.date: 9/7/2017
---

# Getting Started with Data Preparation #

## Introduction ##
Welcome to the Data Preparation Getting Started Guide. 

Data Preparation provides a set of tools for efficiently exploring, understanding, and fixing problems in data. It allows you to consume data in many forms and transform that data into cleansed data that is better suited for downstream usage.

Data Preparation is installed as part of the Azure Machine Learning Workbench experience.  Use Data Preparation locally or deploy to a target cluster and cloud as a runtime or execution environment.

The design time runtime uses Python for extensibility and depends on various Python libraries such as Pandas. In Windows installations, the Python libraries needed by Data Preparation are installed in a private application directory.  Doing so avoids a clash with other versions of Python or libraries that may already be in use. (Data Preparation does not alter Python or System Environment variables as they relate to Python).

After Azure ML Workbench is installed on Windows, open the application by clicking on the corresponding desktop icon.  Another way to open the application is by pressing the Windows key and typing Azure Machine Learning Workbench. 

On OS X/macOS, there a new application becomes available.  Within Spotlight, another option is to type Azure ML Workbench.

When Azure ML Workbench is first launched, the Home screen is visible.  From the Home screen, create a new project by clicking "+" on the menu and complete the form.  Navigate to the Data section of the project by selecting the Data icon [<INSERT DATA ICON>] on the left of the screen.  Click "+" again to "Add a Data Source." The Data Source Wizard should launch and adds a "package.dprep" file to the project after completing the wizard.  Summary statistics are shown within a new tab.  After reviewing the summary statistics, click on "Prepare" at the top of the screen to start preparation. You can also Double-click on the .dprep file to launch the Data Prep experience. [More information about the Data Source Wizard](data-source-wizard.md) 

## Building Blocks of Data Preparation ##
### The Package ###
A Package is the primary container for your work. A Package is the artifact that is saved to and loaded from disk. While working inside the client, the Package is constantly AutoSaved in the background. If you do not choose a name through a Save action, it is given a default name.

A Package may be exported to Python.

A Package may be exported to a Jupyter Notebook.

A Package can be executed across multiple runtimes including local Python, Spark (including in Docker), and HDInsight.

A Package contains one or more Dataflows that are the steps and transforms applied to the data.

A Package may use another Package as a Data Source (referred to as a Reference Data Flow).

### The Dataflow ###
A Dataflow has a source and optional Transforms which are arranged through a series of Steps and optional destinations. Clicking on a Step re-executes all the sources and Transforms prior to and including the selected Step.  The transformed data through that step is shown within the grid. Steps can be added, moved, and deleted within a Dataflow through the Step List.

The Step List on the right side of the client can be opened and closed to provide more screen space.

Multiple Dataflows can exist in the UI at a time, each Dataflow is represented as a tab in the UI.

### The Source
A source is where the data comes from, and the format it is in. Each source has a different user experience to allow it to be configured. The source produces a “rectangular”/tabular view of the data. If the source data originally has a “ragged right”, then the structure is normalized to be “rectangular.” (Appendix 2 provides the current list of supported sources).

### The Transform ###
Transforms consume data in a given format, perform some operation on the data (such as changing the data type) and then produce data in the new format. Each Transform has its own UI and behavior(s). Chaining several Transforms together via Steps in the Dataflow is the core of Data Preparation functionality. (Appendix 3 provides the current list of supported Transforms).

### The Inspector ###
Inspectors are visualizations of the data and are available to improve understanding of the data.  Understanding the data and data quality issues helps you decide which actions (Transforms) should be taken. Some Inspectors support actions that generate Transforms. For example, the Value Count Inspector allows you to select a Value and then apply a filter to include that Value or to Exclude that Value. Inspectors can also provide context for Transforms. For example, selecting one or more columns changes the possible Transforms that can be applied.

A column may have multiple Inspectors at any point in time (for example, Column Statistics and a Histogram). There can also be instances of an Inspector across multiple columns. For example, all numeric columns could have Histograms at the same time.

Inspectors appear in the Profiling Well at the bottom of the screen.  Maximize inspectors to see them larger within the main content area. Think of the data grid as the default inspector. Any Inspector can be expanded into the main content area. Inspectors within the main content area minimize to the Profiling Well. Customize an Inspector by clicking on the pencil icon within the Inspector. Reorder Inspectors within the Well using drag and drop.

Some Inspectors support a “Halo” mode. This mode shows the value or state before the last Transform was applied. The old value is displayed in gray with the current value in the foreground and shows the impact of a Transform. 

There are two special Inspectors.  The first is the Data Grid and is the default view when opening a Dataflow.  The second is the Profiling Inspector that launches from the Data Grid. Both Inspectors work on the entire dataset rather than a column or selected columns. Only one of these two Inspectors can be in focus at any one time. (Appendix 4 provides the current list of supported Inspectors).

### The Destination
 A Destination is where you write/export the data to after you have prepared it in a Dataflow. A given Dataflow can have multiple Destinations. Each Destination has a different user experience to allow it to be configured. The Destination consumes data in a “rectangular”/tabular format and writes it out to some location in a given format. (Appendix 5 provides the current list of supported Destinations).

### Using Data Preparation ###
Data Preparation assumes a basic five-step methodology/approach to data preparation.

#### Step 1: Ingestion ####
Import data for Data Preparation by using the New Data Source option within the project view.  Another options it to use the Open Data Source option in the Dataflow menu. All initial ingestion of data is handled through the Data Source Wizard.

#### Step 2: Understand/Profile the Data ####
First, look at the Data Quality Bar at the top of each column. Green represents the rows that have values. Gray represents rows with a missing value, null, etc. Red indicates error values. Hover over the bar to get a tool tip with the exact numbers of rows in each of the three buckets. The Data Quality Bar uses a logarithmic scale so always check the actual numbers to get a rough feel for the volume of missing data.

![columns](media/data-prep-getting-started/columns.png)

Next, use a combination of other Inspectors plus the grid to better understand data characteristics.  Start formulating hypotheses about the data preparation required for further analysis. Most inspectors work on a single column or a small number of columns.  The Data Grid and Column Metrics inspectors work on the entire dataset. 

To look at metrics for the columns, click to the right of the dataset name above the grid to bring up the new view. The column metrics view shows a row for each column of the dataset.  The column metrics view also shows statistics and information appropriate for the datatype. This view can also be sorted and filtered to help deal with large volumes of columns.

![profile](media/data-prep-getting-started/profile.png)

It’s likely that several Inspectors across several columns are needed to understand the data. You can scroll through various Inspectors in the Profiling Well. Within the well, you can also move Inspectors to the head of the list in order to see them in the immediately viewable area.

![inspectors](media/data-prep-getting-started/inspectors.png)

Different inspectors are provided for continuous vs categorical variables/columns. The Inspector menu enables and disables options depending on the type of variables/columns you have.

When working with wide datasets that have many columns, a pragmatic approach of working with subsets is advisable. This approach includes focusing on a small number of columns (for example, 5-10), preparing them and then working through the remaining columns. The grid inspector supports vertical partitioning of columns and so if you have more than 300 columns then you need to "page" through them.
 

#### Step 3: Transform the Data ####
Transforms change the data and allow the execution of the data to support the current working hypothesis. Transforms appear as Steps in the Step List on the right-hand side. It is possible to “time travel” through the Step List by clicking on any arbitrary point in the Step List.

A green icon to the left of a given Step indicates that it has run and the data reflects the execution of the Transform. A vertical bar to the left of the Step indicates the current state of the data in the Inspectors.

![steps](media/data-prep-getting-started/steps.png)

Try to make small frequent changes to the data and to validate (Step 4) after each change as the hypothesis evolves.

#### Step 4: Verify the impact of the transformation. ####
Decide if the hypothesis was correct. If correct, then develop the next hypothesis and repeat steps 2-3 for the new one. If incorrect, then undo the last transformation and develop a new hypothesis and repeat steps 2-3.

The primary way to determine if the Transform had the right impact is to use the Inspectors. Use existing. Use Inspectors with the Halo effect enabled or launch multiple Inspectors to view the data at given points in time.

![halo inspector](media/data-prep-getting-started/halo1.png) ![halo inspector](media/data-prep-getting-started/halo2.png)

To undo a Transformation, go the Steps List on the right-hand side of the UI. (The Steps List panel may need to be popped back out. To open it, click the double chevron pointing left). In the panel, select the Transform that was executed that you wish to undo. Select the drop-down on the right-hand side of the UI block. Select either “Edit” to make changes or “Delete” to remove the Transform from the Steps List and the Dataflow.

#### Step 5: Output ####
When finished with your data preparation, you can write the Dataflow to an output. A Dataflow can have many outputs. From the Transforms menu, you can select which output you want the dataset to be written as. You can also select the output's destination. The list of outputs and destinations are listed in Appendix 5.

### List of Appendices ###
<!-- Commenting out this link because it's currently broken, Appendix 1 doesn't exist at the moment (Gary)
[Appendix 1 - Supported Platforms](data-prep-appendix1-supported-platforms.md)  
-->
[Appendix 2 - Supported Data Sources](data-prep-appendix2-supported-data-sources.md)  
[Appendix 3 - Supported Transforms](data-prep-appendix3-supported-transforms.md)  
[Appendix 4 - Supported Inspectors](data-prep-appendix4-supported-inspectors.md)  
[Appendix 5 - Supported Destinations](data-prep-appendix5-supported-destinations.md)  
[Appendix 6 - Sample Filter Expressions in Python](data-prep-appendix6-sample-filter-expressions-python.md)  
[Appendix 7 - Sample Transform Dataflow Expressions in Python](data-prep-appendix7-sample-transform-data-flow-python.md)  
[Appendix 8 - Sample Data Sources in Python](data-prep-appendix8-sample-source-connections-python.md)  
[Appendix 9 - Sample Destination Connections in Python](data-prep-appendix9-sample-destination-connections-python.md)  
[Appendix 10 - Sample Column Transforms in Python](data-prep-appendix10-sample-custom-column-transforms-python.md)  

