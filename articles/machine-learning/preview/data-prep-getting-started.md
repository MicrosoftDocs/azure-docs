---
title: Getting Started with Data Preparation  | Microsoft Docs
description: This is the getting started guide for the data prep section of AML workbench
author: cforbe
ms.author: cforbe@microsoft.com
ms.date: 9/7/2017
---

# Getting Started with Data Preparation #

## Introduction ##
Welcome to the Data Preparation Getting Started Guide. This short tour of Data Preparation gets you acquainted with how it works, demonstrates what it can do, and accelerates your ability to build data preparation solutions.

Data Preparation provides a set of flexible and scalable tools. It helps you explore, discover, understand, and fix problems in your data. It allows you to consume data in many forms and to transform that data into new forms that are better suited for your usage.

Data Preparation is part of the Azure Machine Learning Workbench experience and installed with it but it can deploy/target cluster and cloud as a runtime/execution environment.

The design time runtime uses Python for extensibility and depends on various Python libraries including Pandas. In Windows installations, the Python libraries needed by Data Preparation are all installed to a private application directory to avoid a clash with other versions of Python and its libraries that you may already be using. (Data Preparation does not alter Python or System Environment variables as they relate to Python).

After you install Azure ML Workbench on Windows, there should be a shortcut on the desktop that can be found by pressing the Windows key and then starting to type Azure ML Workbench. On OS X/macOS, there will be a new application.

When you first launch Azure ML Workbench you are taken to the home screen from there create a new project by hitting the + on the menu, once you have a new project hit the + again and select "New Data Source". This will launch the data source wizard, after the wizard is complete a "package.dprep" file will be added to the project, double-click on this to launch the Data Prep experience. [Click here for more information about the Data Source Wizard](data-source-wizard.md) 

## Building Blocks of Data Preparation ##
### The Package ###
A Package is the primary container for your work. A Package is the artifact that is saved to disk and loaded from disk. While working inside the client, the Package is constantly AutoSaved in the background. If you do not choose a name through a Save action, it is given a default name.

A Package may be exported to Python.

A Package may be exported to a Jupyter Notebook.

A Package can be executed across multiple different runtimes including local Python, Spark (including in Docker), and HDInsight.

A Package contains one or more Dataflows.

A Package may use another Package as a Data Source (this is referred to as a Reference Data Flow).

### The Dataflow ###
A Dataflow has a source and optional Transforms which are arranged through a series of Steps and optional destinations. When you click a Step in the UI, all the sources and Transforms prior to that Step are executed so that the data is represented as of the end of the Step. Steps can be added, moved, and deleted within a Dataflow through the Step List.

The Step List on the right side of the client can be opened and closed to provide more screen space.

Multiple Dataflows can exist in the UI at a time, each Dataflow is represented as a tab in the UI.

### The Source
A source is where the data comes from, and the format it is in. Each source has a different user experience to allow it to be configured. The source produces a “rectangular”/tabular view of the data. If the source data originally has a “ragged right”, then this is normalized to be “rectangular”. (Appendix 2 provides the current list of supported sources).

### The Transform ###
Transforms consume data in a given format, perform some operation on the data (such as changing the data type) and then produce data in the new format. Each Transform has its own UI and behavior(s). Chaining several Transforms together via Steps in the Dataflow is the core of Data Preparation functionality. (Appendix 3 provides the current list of supported Transforms).

### The Inspector ###
Inspectors are visualizations of the data. Inspectors help you understand the data so you can decide which actions (Transforms) you need to take to make the data better suited for your purpose. Some Inspectors support actions that generate Transforms. For example, the Value Count Inspector allows you to select a Value and then apply a filter to include that Value or to Exclude that Value. Inspectors can also provide context for Transforms. For example, selecting one or more columns changes the possible Transforms that can be applied.

A column may have multiple Inspectors at any point in time (e.g. Column Statistics and a Histogram). There can also be multiple instances of an Inspector against different columns. For example, all numeric columns could have Histograms at the same time.

The Inspectors appear in the Profiling Well at the bottom of the UI and also in the main view. The default Inspector is the Grid. Any Inspector can be expanded into the main view. In this scenario, whichever Inspector was already in the main view minimizes to the well. Inspectors can be configured by clicking on the pencil icon. Once minimized into the well, an inspector can be moved left to support reordering.

Some Inspectors support the option for a “Halo”. This is the capability to remember the value/state before the last Transform was applied. The old value is displayed as a background gray with the current value in the foreground. This allows for easy comparison of the impact of a Transform. 

There are two special Inspectors, the first is the DataGrid, this is the default view when opening a Dataflow, the second is the Profiling Inspector that launches from the DataGrid. Both of these Inspectors work on the entire dataset not a column, there can only be one of these two Inspectors available at a time. (Appendix 4 provides the current list of supported Inspectors).

### The Destination
 A Destination is where you write/export the data to after you have prepared it in a Dataflow. A given Dataflow can have multiple Destinations. Each Destination has a different user experience to allow it to be configured. The Destination consumes data in a “rectangular”/tabular format and writes it out to some location in a given format. (Appendix 5 provides the current list of supported Destinations).

### Using Data Preparation ###
Data Preparation assumes a basic five-step methodology/approach to data preparation.

#### Step 1: Ingestion ####
You can import data into Data Preparation through either the New Data Source option on the project view or the Open Data Source option on the Dataflow menu. All initial ingestion of data is handled through the data source wizard.

#### Step 2: Understand/Profile the Data ####
The first action is to look at the Data Quality Bar at the top of each column. For each column, green indicates the rows that have values. Grey indicates the rows with a missing value, null etc. Red indicates error values. There are tool tips to tell the exact numbers of rows in each of the three buckets. The UI is scaled logarithmically, so always check the actual numbers after using the UI to get a rough feel for the volume of missing data.

![columns](media/data-prep-getting-started/columns.png)

The next action is to use the various Inspectors from the Inspector’s menu and also the grid to develop an understanding of the characteristics of the data and to start formulating hypotheses about the data preparation required for further analysis. While most inspectors work on a single or small number of columns, the Grid and the Column Metrics inspectors work on the entire dataset. 

To look at metrics for the columns, click to the right of the dataset name above the grid to bring up the new view. The column metrics view shows a row for each column from the dataset and for each row it shows a series of statistics, numerical and graphical, depending on the datatype of the column. This view can also be sorted and filtered to help you deal with large volumes of columns.

![profile](media/data-prep-getting-started/profile.png)

It’s likely that several Inspectors across several columns will be needed to understand the data. You can scroll through various Inspectors in the Profiling Well. Within the well, you can also move Inspectors to the head of the list in order to see them in the immediately viewable area.

![inspectors](media/data-prep-getting-started/inspectors.png)

Different inspectors are provided for continuous vs categorical variables/columns. The Inspector menu enables and disables options depending on the type of variables/columns you have.

When working with wide datasets that have many columns, a pragmatic approach of working with subsets is advisable. This approach includes focusing on a small number of columns (e.g. 5-10), preparing them and then working through the remaining columns. The grid inspector supports vertical partitioning of columns and so if you have more than 300 columns then you need to "page" through them.
 

#### Step 3: Transform the Data ####
Transforms change the data and allow the execution of the data to support the current working hypothesis. Transforms appear as Steps in the Step List on the right-hand side. It is possible to “time travel” through the Step List, to go backwards and forwards, to any arbitrary point in the Step List simply by clicking on that Step.

A green icon to the left of a given Step indicates that it has run and the data reflects the execution of that Transform. A vertical bar to the left of the Step indicates the current state of the data in the Inspectors.

![steps](media/data-prep-getting-started/steps.png)

It is recommended to make small frequent changes to the data and to validate (Step 4) after each change as the hypothesis evolves.

#### Step 4: Verify the impact of the transformation. ####
Decide if the hypothesis was correct. If correct, then develop the next hypothesis and repeat steps 2-3 for the new one. If incorrect, then undo the last transformation and develop a new hypothesis and repeat steps 2-3.

The primary way to determine if the Transform had the right impact is to use the Inspectors. You can either use existing Inspectors with their Halo effect on or you can launch multiple Inspectors to view the data at given points in time.

![halo inspector](media/data-prep-getting-started/halo1.png) ![halo inspector](media/data-prep-getting-started/halo2.png)

To undo a Transformation, go the Steps List on the right-hand side of the UI. (The Steps List panel may need to be popped back out. To open it, click the double chevron pointing left). In the panel, select the Transform that was executed that you wish to undo. Select the drop-down on the right-hand side of the UI block. Select either “Edit” to make changes or “Delete” to remove the Transform from the Steps List and the Dataflow.

#### Step 5: Output ####
When finished with your data preparation, you can write the Dataflow to an output. A Dataflow can have many outputs. From the Transforms menu, you can select which output you want the dataset to be written as. You can also select the output's destination. The list of outputs and destinations are listed in Appendix 5.

### List of Appendices ###
[Appendix 1 - Supported Platforms](data-prep-appendix1-supported-platforms.md)  
[Appendix 2 - Supported Data Sources](data-prep-appendix2-supported-data-sources.md)  
[Appendix 3 - Supported Transforms](data-prep-appendix3-supported-transforms.md)  
[Appendix 4 - Supported Inspectors](data-prep-appendix4-supported-inspectors.md)  
[Appendix 5 - Supported Destinations](data-prep-appendix5-supported-destinations.md)  
[Appendix 6 - Sample Filter Expressions in Python](data-prep-appendix6-sample-filter-expressions-python.md)  
[Appendix 7 - Sample Transform Dataflow Expressions in Python](data-prep-appendix7-sample-transform-data-flow-python.md)  
[Appendix 8 - Sample Data Sources in Python](data-prep-appendix8-sample-source-connections-python.md)  
[Appendix 9 - Sample Destination Connections in Python](data-prep-appendix9-sample-destination-connections-python.md)  
[Appendix 10 - Sample Column Transforms in Python](data-prep-appendix10-sample-custom-column-transforms-python.md)  

