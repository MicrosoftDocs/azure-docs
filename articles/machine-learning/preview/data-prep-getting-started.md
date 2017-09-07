# Getting Started with Data Preparation #

## Introduction ##
Welcome to the Data Preparation Getting Started Guide. This short tour of Data Preparation gets you acquainted with how it works, demonstrates what it can do and accelerates your ability to build data preparation solutions.

Data Preparation provides a set of flexible and scalable tools to help you explore, discover, understand and fix problems in your data. It allows you to consume data in many forms and to transform that data into new forms that are better suited for your usage.

Data Preparation is part of the Azure Machine Learning Workbench experience and installed with it but it can deploy/target cluster and cloud as a runtime/execution environment.

The design time runtime uses Python for extensibility and depends on various Python libraries including Pandas. In Windows installations, the Python libraries needed by Data Preparation are all installed to a private application directory to avoid a clash with other versions of Python and its libraries that you may already be using(Data Preparation does not alter Python or System Environment variables as they relate to Python).

After you install Azure ML Workbench on Windows there should be a shortcut on the desktop that can be found by pressing the Windows key and then starting to type Azure ML Workbench. On OS X/macOS there will be a new application.

When you first launch Azure ML Workbench you are taken to the home screen from there create a new project by hitting the + on the menu, once you have a new project hit the + again and select "New Datasource". This will launch the datasource wizard, after the wizard is complete a "package.dprep" file will be added to the project, double click on this to launch the Data Prep experience.

## Building Blocks of Data Preparation ##
### The Package ###
The Package is the primary container for your work. A Package is the artifact that is saved to disk and loaded from disk. While working inside the client, the Package is constantly AutoSaved in the background. It is given a default name if you do not choose a name through a Save action.

A Package may be exported to Python.

A Package may be exported to a Jupyter Notebook.

A Package can be executed across multiple different rumtimes including local Python, Spark (including in Docker), and HD Insight.

A Package contains 1 or more Dataflows.

A Package may use another Package as a Data Source(this is referred to as a Reference Data Flow).

### The Dataflow ###
A Dataflow has a source and optional Transforms which are arranged through a series of Steps and optional destinations. When you click a Step in the UI, all the sources and Transforms prior to that Step are executed so that the data is represented as of the end of the Step. Steps can be added, moved and deleted within a Dataflow through the Step List.

The Step List on the right side of the client can be opened and closed to provide more screen space.

Multiple Dataflows can exist in the UI at a time, each Dataflow is represented as a tab in the UI.

### The Source
Appendix 2 provides the current list of supported sources. Each source has a different user experience to allow it to be configured. The source produces a “rectangular”/tabular view of the data. If the source data originally has a “ragged right”, then this is normalized to be “rectangular”.

### The Transform ###
Appendix 3 provides the current list of supported Transforms. Each Transform has its own UI and behavior(s). Transforms consume data in a given format, perform some operation on the data (such as changing the data type) and then produce data in the new format. Chaining several Transforms together via Steps in the Dataflow is the core of Data Preparation functionality.

### The Inspector ###
Appendix 4 provides the current list of supported Inspectors. Inspectors are visualizations of the data. Inspectors help you understand the data so you can decide which actions (Transforms) you need to take to make the data better suited for your purpose. Some Inspectors support actions that generate Transforms. For example, the Value Count Inspector allows you to select a Value and then apply a filter to include that Value or to Exclude that Value. Inspectors can also provide context for Transforms. For example, selecting one or more columns changes the possible Transforms which can be applied.

A column may have multiple Inspectors at any point in time (e.g. Column Statistics and a Histogram). There can also be multiple instances of an Inspector against different columns. For example, all numeric columns could have Histograms at the same time.

The Inspectors appear in the Profiling Well at the bottom of the UI and also in the main view. The default Inspector is the Grid. Any Inspector can be expanded into the main view. In this scenario, whichever Inspector was already in the main view minimizes to the well. Inspectors can be configured by clicking on the pencil icon. Once minimized into the well, an inspector can be moved left to support reordering.

Some Inspectors support the option for a “Halo”. This is the capability to remember the value/state before the last Transform was applied. The old value is displayed as a background grey with the current value in the foreground. This allows for easy comparison of the impact of a Transform. 

There are 2 special Inspectors, the first is the DataGrid, this is the default view when opening a Dataflow, the second is the Profiling Inspector that launches from the DataGrid. Both of these Inspectors work on the entire dataset not a column, there can only be one of these 2 Inspectors available at a time.

### The Destination
Appendix 5 provides the current list of supported destinations. A given Dataflow can have multiple destinations. Each destination has a different user experience to allow it to be configured. The destination consumes data in a “rectangular”/tabular format and writes it out to some location in a given format.

### Using Data Preparation ###
Data Preparation assumes a basic 5 step methodology/approach to data preparation.

#### Step 1: Ingestion ####
You can import data into Data Preparation through either the New Data Source option on the project view or the Open Data Source option on the Dataflow menu. All initial ingestion of data is handled through the datasource wizard.

#### Step 2: Understand/Profile the Data ####
The first action is to look at the Data Quality Bar at the top of each column. For each column, green indicates the rows that have values. Grey indicates the rows with a missing value, null etc. There are tool tips to tell the exact numbers of rows in each of the 2 buckets. The UI is scaled logarithmically, so always check the actual numbers after using the UI to get a rough feel for the volume of missing data.

The next action is to use the various Inspectors from the Inspector’s menu and also the grid to develop an understanding of the characteristics of the data and to start formulating hypotheses about the data preparation required for further analysis.While most inspectors work on a single or small number of columns the Grid and the Column Metrics inspectors work on the entire dataset. 

To look at metrics for the columns click to the right of the datset name in the grid to bring up the new view. The column metrics view shows a row for each column from the dataset and for each row it shows a series of statistics, numerical and graphical, depending on the datatype of the column. This view can also be sorted and filtered to help you deal with large volumes of columns.

It’s likely that several Inspectors across several columns will be needed to understand the data. You can scroll through various Inspectors in the Profiling Well. Within the well, you can also move Inspectors to the head of the list in order to see them in the immediately viewable area.

Different inspectors are provided for continuous vs categorical variables/columns. The Inspector menu enables and disables options depending on the type of variables/columns you have.

When working with very wide datasets that have many columns a pragmatic approach of working with subsets is advisable. This approach includes focusing on a small number of columns (e.g. 5-10), preparing them and then working through the remaining columns. The grid inspector supports vertical paritioning of columns and so if you have more than 300 columns then you need to "page" through them.
 

#### Step 3: Transform the Data ####
Transform(s) change the data and allow the execution of the data to support the current working hypothesis. Transforms appear as Steps in the Step List on the right hand side. It is possible to “time travel” through the Step List, to go backwards and forwards to any arbitrary point in the Step List simply by clicking on that Step.

A green icon to the left of a given Step indicates that it has run and the data reflects the execution of that Transform. A vertical bar to the left of the Step indicates the current state of the data in the Inspectors.

It is advisable to make small frequent changes to the data and to validate (Step 4) after each change as the hypothesis evolves.

#### Step 4: Verify the impact of the transformation. ####
Decide if the hypothesis was correct. If correct then develop the next hypothesis and repeat steps 2-3 for the new one. If incorrect then undo the last transformation and develop a new hypothesis and repeat steps 2-3.

The primary way to determine if the Transform had the right impact is to use the Inspectors. You can either use existing Inspectors with their Halo effect on or you can simply launch multiple Inspectors to view the data at given points in time.

To undo a Transformation, go the Steps List on the right hand side of the UI. The Steps List panel may need to be popped back out. To do this, click the double chevron pointing left. In the panel, select the Transform that was just executed (it is likely the last one in the list). Select the drop down on the right hand side of the UI block. Select either “Edit” to make changes or “Delete” to remove the Transform from the Steps List and the Dataflow.

#### Step 5: Output ####
A Dataflow can have many outputs. Select the Write CSV Transform to write the data out to a local file. The list of outputs is listed in Appendix 5.

### List of Appendices ###
[Appendix 1 - Supported Platforms](DataPrepAppendix/DataPrep_Appendix1_SupportedPlatforms.md)  
[Appendix 2 - Supported Data Sources](DataPrepAppendix/DataPrep_Appendix2_SupportedDataSources.md)  
[Appendix 3 - Supported Transforms](DataPrepAppendix/DataPrep_Appendix3_SupportedTransforms.md)  
[Appendix 4 - Supported Inspectors](DataPrepAppendix/DataPrep_Appendix4_SupportedInspectors.md)  
[Appendix 5 - Supported Destinations](DataPrepAppendix/DataPrep_Appendix5_SupportedDestinations.md)  
[Appendix 6 - Sample Filter Expressions in Python](DataPrepAppendix/DataPrep_Appendix6_SampleFilterExpressions_Python.md)  
[Appendix 7 - Sample Transform Dataflow Expressions in Python](DataPrepAppendix/DataPrep_Appendix7_SampleTransformDataFlow_Python.md)  
[Appendix 8 - Sample Data Sources in Python](DataPrepAppendix/DataPrep_Appendix8_SampleSourceConnections_Python.md)  
[Appendix 9 - Sample Destination Connections in Python](DataPrepAppendix/DataPrep_Appendix9_SampleDestinationConnections_Python.md)  
[Appendix 10 - Sample Column Transforms in Python](DataPrepAppendix/DataPrep_Appendix10_SampleCustomColumnTransforms_Python.md)  


