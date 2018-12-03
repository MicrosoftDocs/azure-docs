---
title: Bike-share tutorial - Advanced data preparation with Azure Machine Learning Workbench
description: In this tutorial, you perform an end-to-end data preparation task by using Azure Machine Learning Workbench
services: machine-learning
author: ranvijaykumar
ms.author: ranku
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.topic: tutorial
ms.date: 09/21/2017

ROBOTS: NOINDEX
---



# Tutorial: Use Azure Machine Learning Workbench for advanced data preparation (Bike share data)

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

Azure Machine Learning (preview) is an integrated, end-to-end data science and advanced analytics solution for professional data scientists to prepare data, develop experiments, and deploy models at cloud scale.

In this tutorial, you use Machine Learning (preview) to learn how to:
> [!div class="checklist"]
> * Prepare data interactively with the Machine Learning data preparation tool.
> * Import, transform, and create a test dataset.
> * Generate a data preparation package.
> * Run the data preparation package by using Python.
> * Generate a training dataset by reusing the data preparation package for additional input files.
> * Execute scripts in a local Azure CLI window.
> * Execute scripts in a cloud Azure HDInsight environment.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* A local installation of Azure Machine Learning Workbench. For more information, follow the [installation quickstart](quickstart-installation.md).
* If you don't have the Azure CLI installed, follow the instructions to [install the latest Azure CLI version](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).
* An [HDInsights Spark cluster](how-to-create-dsvm-hdi.md#create-an-apache-spark-for-azure-hdinsight-cluster-in-azure-portal) created in Azure.
* An Azure storage account.
* Familiarity with how to create a new project in Workbench.
* Although it's not required, it's helpful to have [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) installed so that you can upload, download, and view the blobs in your storage account.

## Data acquisition
This tutorial uses the [Boston hubway dataset](https://s3.amazonaws.com/hubway-data/index.html) and Boston weather data from [NOAA](http://www.noaa.gov/).

1. Download the data files from the following links to your local development environment:

   * [Boston weather data](https://azuremluxcdnprod001.blob.core.windows.net/docs/azureml/bikeshare/BostonWeather.csv)

   * Hubway trip data from the hubway website:

      - [201501-hubway-tripdata.zip](https://s3.amazonaws.com/hubway-data/201501-hubway-tripdata.zip)
      - [201504-hubway-tripdata.zip](https://s3.amazonaws.com/hubway-data/201504-hubway-tripdata.zip)
      - [201510-hubway-tripdata.zip](https://s3.amazonaws.com/hubway-data/201510-hubway-tripdata.zip)
      - [201601-hubway-tripdata.zip](https://s3.amazonaws.com/hubway-data/201601-hubway-tripdata.zip)
      - [201604-hubway-tripdata.zip](https://s3.amazonaws.com/hubway-data/201604-hubway-tripdata.zip)
      - [201610-hubway-tripdata.zip](https://s3.amazonaws.com/hubway-data/201610-hubway-tripdata.zip)
      - [201701-hubway-tripdata.zip](https://s3.amazonaws.com/hubway-data/201701-hubway-tripdata.zip)

1. Unzip each .zip file after download.

## Upload data files to Azure Blob storage
You can use Azure Blob storage to host your data files.

1. Use the same storage account that is used for the HDInsight cluster you use.

    ![HDInsight cluster storage account](media/tutorial-bikeshare-dataprep/hdinsightstorageaccount.png)

1. Create a new container named **data-files** to store the **BikeShare** data files.

1. Upload the data files. Upload `BostonWeather.csv` to a folder named `weather`. Upload the trip data files to a folder named `tripdata`.

    ![Upload data files](media/tutorial-bikeshare-dataprep/azurestoragedatafile.png)

> [!TIP]
> You also can use Storage Explorer to upload blobs. Use this tool when you want to view the contents of any files generated in the tutorial, too.

## Learn about the datasets
1. The __Boston weather__ file contains the following weather-related fields, reported on an hourly basis:

   * **DATE**

   * **REPORTTPYE**

   * **HOURLYDRYBULBTEMPF**

   * **HOURLYRelativeHumidity**

   * **HOURLYWindSpeed**

1. The __hubway__ data is organized into files by year and month. For example, the file named `201501-hubway-tripdata.zip` contains a .csv file that contains data for January 2015. The data contains the following fields, with each row representing a bike trip:

   * **Trip Duration (in seconds)**

   * **Start Time and Date**

   * **Stop Time and Date**

   * **Start Station Name & ID**

   * **End Station Name & ID**

   * **Bike ID**

   * **User Type (Casual = 24-Hour or 72-Hour Pass user; Member = Annual or Monthly Member)**

   * **ZIP Code (if user is a member)**

   * **Gender (self-reported by member)**

## Create a new project
1. Start **Machine Learning Workbench** from your Start menu or launcher.

1. Create a new Machine Learning project. Select the **+** button on the **Projects** page, or select **File** > **New**.

   * Use the **Bike Share** template.

   * Name your project **BikeShare**. 

## <a id="newdatasource"></a>Create a new data source

1. Create a new data source. Select the **Data** button (cylinder icon) on the left toolbar to display the **Data** view.

   ![Data view tab](media/tutorial-bikeshare-dataprep/navigatetodatatab.png)

1. Add a data source. Select the **+** icon, and then select **Add Data Source**.

   ![Add Data Source option](media/tutorial-bikeshare-dataprep/newdatasource.png)

## Add weather data

1. **Data Store**: Select the data store that contains the data. Because you're using files, select **File(s)/Directory**. Select **Next** to continue.

   ![File(s)/Directory entry](media/tutorial-bikeshare-dataprep/datasources.png)

1. **File Selection**: Add the weather data. Browse and select the `BostonWeather.csv` file that you uploaded to Blob Storage earlier. Select **Next**.

   ![File selection with BostonWeather.csv selected](media/tutorial-bikeshare-dataprep/azureblobpickweatherdatafile.png)

1. **File Details**: Verify the file schema that is detected. Machine Learning Workbench analyzes the data in the file and infers the schema to use.

   ![Verify file details](media/tutorial-bikeshare-dataprep/fileparameters.png)

   > [!IMPORTANT]
   > Workbench might not detect the correct schema in some cases. Always verify that the parameters are correct for your data set. For the weather data, verify that they are set to the following values:
   >
   > * __File Type__: Delimited File (csv, tsv, txt, etc.)
   > * __Separator__: Comma [,]
   > * __Comment Line Character__: No value is set.
   > * __Skip Lines Mode__: Don't skip
   > * __File Encoding__: utf-8
   > * __Promote Headers Mode__: Use Headers From First File

   The preview of the data should display the following columns:

   * **Path**

   * **DATE**

   * **REPORTTYPE**

   * **HOURLYDRYBULBTEMPF**
   
   * **HOURLYRelativeHumidity**

   * **HOURLYWindSpeed**

   To continue, select **Next**.

1. **Data Types**: Review the data types that are detected automatically. Machine Learning Workbench analyzes the data in the file and infers the data types to use.

   a. For this data, change **DATA TYPE** for all the columns to **String**.

   > [!NOTE]
   > String is used to highlight the capabilities of Workbench later in this tutorial. 

   ![Review data types](media/tutorial-bikeshare-dataprep/datatypedetection.png)

   b. To continue, select __Next__. 

1. **Sampling**: To create a sampling scheme, select **Edit**. Select the new __Top 10000__ row that is added, and then select __Edit__. Set __Sample Strategy__ to **Full File**, and then select **Apply**.

   ![Add a new sampling strategy](media/tutorial-bikeshare-dataprep/weatherdatasamplingfullfile.png)

   To use the __Full File__ strategy, select the __Full File__ entry, and then select __Set as Active__. A star appears next to __Full File__ to indicate that it's the active strategy.

   ![Full File set as active strategy](media/tutorial-bikeshare-dataprep/fullfileactive.png)

   To continue, select **Next**.

1. **Path Column**: Use the __Path Column__ section to include the full file path as a column in the imported data. Select __Do Not Include Path Column__.

   > [!TIP]
   > Including the path as a column is useful if you're importing a folder of many files with different file names. It's also useful if the file names contain information that you want to extract later.

   ![Path Column set to do not include](media/tutorial-bikeshare-dataprep/pathcolumn.png)

1. **Finish**: To finish creating the data source, select **Finish**.

    A new data source tab named __BostonWeather__ opens. A sample of the data is displayed in a grid view. The sample is based on the active sampling scheme specified previously.

    Notice that the **Steps** pane on the right side of the screen displays the individual actions taken while creating this data source.

   ![Display data source, sample, and steps](media/tutorial-bikeshare-dataprep/weatherdataloaded.png)

### View data source metrics

Select __Metrics__ at the upper left of the tab's grid view. This view displays the distribution and other aggregated statistics of the sampled data.

![Metrics display](media/tutorial-bikeshare-dataprep/weathermetrics.png)

> [!NOTE]
> To configure the visibility of the statistics, use the **Choose Metric** drop-down list. Select and clear metrics there to change the grid view.

To return to the __Data__ view, select __Data__ in the upper left of the page.

## Add a data source to the data preparation package

1. Select __Prepare__ to begin preparing the data. 

1. When prompted, enter a name for the data preparation package, such as **BikeShare Data Prep**. 

1. Select __OK__ to continue.

   ![Prepare dialog box](media/tutorial-bikeshare-dataprep/dataprepdialog.png)

1. A new package named **BikeShare Data Prep** appears under the __Data Preparation__ section of the __Data__ tab. 

   To display the package, select this entry. 

1. Select the **>>** button to expand __Dataflows__ and display the dataflows contained in the package. In this example, __BostonWeather__ is the only dataflow.

   > [!IMPORTANT]
   > A package can contain multiple dataflows.

   ![Dataflows in the package](media/tutorial-bikeshare-dataprep/weatherdataloadedingrid.png)

## Filter data by value
1. To filter data, right-click a cell with a certain value, and select __Filter__. Then select the type of filter.

1. For this tutorial, select a cell that contains the value `FM-15`. Then set the filter to **equals**.  Now the data is filtered to only return rows where the __REPORTTYPE__ is `FM-15`.

   ![Filter dialog box](media/tutorial-bikeshare-dataprep/weatherfilterinfm15.png)

   > [!NOTE]
   > FM-15 is a type of Meteorological Terminal Aviation Routine (METAR) weather report. The FM-15 reports are empirically observed to be the most complete, with little missing data.

## Remove a column

You no longer need the __REPORTTYPE__ column. Right-click the column header, and select **Remove Column**.

   ![Remove Column option](media/tutorial-bikeshare-dataprep/weatherremovereporttype.png)

## Change datatypes and remove errors
1. Select Ctrl (Command ⌘ on Mac) while you select column headers to select multiple columns at the same time. Use this technique to select the following column headers:

   * **HOURLYDRYBULBTEMPF**

   * **HOURLYRelativeHumidity**

   * **HOURLYWindSpeed**

1. Right-click one of the selected column headers, and select **Convert Field Type to Numeric**. This option converts the data type for the columns to numeric.

   ![Convert multiple columns to numeric](media/tutorial-bikeshare-dataprep/weatherconverttonumeric.png)

1. Filter out the error values. Some columns have data type conversion problems. This problem is indicated by the red color in the __Data Quality Bar__ for the column.

   To remove the rows that have errors, right-click the **HOURLYDRYBULBTEMPF** column heading. Select **Filter Column**. Use the default **I Want To** as **Keep Rows**. Change the **Conditions** drop-down list to select **is not error**. Select **OK** to apply the filter.

   ![Filter error values](media/tutorial-bikeshare-dataprep/filtererrorvalues.png)

1. To eliminate the remaining error rows in the other columns, repeat this filter process for the **HOURLYRelativeHumidity** and **HOURLYWindSpeed** columns.

## Use by example transformations

To use the data in a prediction for two-hour time blocks, you must compute the average weather conditions for two-hour periods. Use the following actions:

* Split the **DATE** column into separate **Date** and **Time** columns. See the following section for the detailed steps.

* Derive an **Hour_Range** column from the **Time** column. See the following section for the detailed steps.

* Derive a **Date\_Hour\_Range** column from the **DATE** and **Hour_Range** columns. See the following section for the detailed steps.

### Split column by example

1. Split the **DATE** column into separate **Date** and **Time** columns. Right-click the **DATE** column header, and select **Split Column by Example**.

   ![Split Column by Example entry](media/tutorial-bikeshare-dataprep/weathersplitcolumnbyexample.png)

1. Machine Learning Workbench automatically identifies a meaningful delimiter and creates two columns by splitting the data into date and time values. 

1. Select __OK__ to accept the split operation results.

   ![Split columns DATE_1 and DATE_2](media/tutorial-bikeshare-dataprep/weatherdatesplitted.png)

### Derive column by example

1. To derive a two-hour range, right-click the __DATE\_2__ column header, and select **Derive Column by Example**.

   ![Derive Column by Example entry](media/tutorial-bikeshare-dataprep/weatherdate2range.png)

   A new empty column is added with null values.

1. Select in the first empty cell in the new column. To provide an example of the time range desired, type **12AM-2AM** in the new column, and then select Enter.

   ![New column with value of 12AM-2AM](media/tutorial-bikeshare-dataprep/weathertimerangeexample.png)

   > [!NOTE]
   > Machine Learning Workbench synthesizes a program based on the examples provided by you and applies the same program on remaining rows. All other rows are automatically populated based on the example you provided. Workbench also analyzes your data and tries to identify edge cases. 

   > [!IMPORTANT]
   > Identification of edge cases might not work on Mac in the current version of Workbench. Skip the following step 3 and step 4 on Mac. Instead, select __OK__ after all the rows are populated with the derived values.
   
1. The text **Analyzing Data** above the grid indicates that Workbench is trying to detect edge cases. When finished, the status changes to **Review next suggested row** or **No suggestions**. In this example, **Review next suggested row** is returned.

1. To review the suggested changes, select **Review next suggested row**. The cell that you should review and correct, if needed, is highlighted on the display.

   ![Review next suggested row](media/tutorial-bikeshare-dataprep/weatherreviewnextsuggested.png)

    Select __OK__ to accept the transformation.
 
1. You are returned to the grid view of data for __BostonWeather__. The grid now contains the three columns added previously.

   ![Grid view with added rows](media/tutorial-bikeshare-dataprep/timerangecomputed.png)

   > [!TIP]
   > All the changes you made are preserved in the **Steps** pane. Go to the step that you created in the **Steps** pane, select the down arrow, and select **Edit**. The advanced window for **Derive Column by Example** is displayed. All your examples are preserved here. You also can add examples manually by double-clicking on a row in the following grid. Select **Cancel** to return to the main grid without applying changes. You also can access this view by selecting **Advanced mode** while you perform a **Derive Column by Example** transform.

1. To rename the column, double-click the column header, and type **Hour Range**. Select Enter to save the change.

   ![Rename the column](media/tutorial-bikeshare-dataprep/weatherhourrangecolumnrename.png)

1. To derive the date and hour range, multi-select the **Date\_1** and **Hour Range** columns, right-click, and then select **Derive Column by Example**.

   ![Derive Column by Example](media/tutorial-bikeshare-dataprep/weatherderivedatehourrange.png)

   Type **Jan 01, 2015 12AM-2AM** as the example against the first row, and select Enter.

   Workbench determines the transformation based on the example you provide. In this example, the result is that the date format is changed and concatenated with the two-hour window.

   ![The example Jan 01, 2015 12AM-2AM](media/tutorial-bikeshare-dataprep/wetherdatehourrangeexample.png)

   > [!IMPORTANT]
   > On a Mac, take the following step instead of step 8:
   >
   > * Go to the first cell that contains **Feb 01, 2015 12AM-2AM**. It should be row 15. Correct the value to **Jan 02, 2015 12AM-2AM**, and select Enter. 
   

1. Wait for the status to change from **Analyzing Data** to **Review next suggested row**. This change might take several seconds. Select the status link to go to the suggested row. 

   ![Suggested row to review](media/tutorial-bikeshare-dataprep/wetherdatehourrangedisambiguate.png)

   The row has a null value because the source date value can be for either dd/mm/yyyy or mm/dd/yyyy. Type the correct value of **Jan 13, 2015 2AM-4AM**, and select Enter. Workbench uses the two examples to improve the derivation for the remaining rows.

   ![Correctly formatted data](media/tutorial-bikeshare-dataprep/wetherdatehourrangedisambiguated.png)

1. Select **OK** to accept the transform.

   ![Completed transformation grid](media/tutorial-bikeshare-dataprep/weatherdatehourrangecomputed.png)

   > [!TIP]
   > To use the **Advanced mode** of **Derive Column by Example** for this step. select the down arrow in the **Steps** pane. In the data grid, there are check boxes next to the **DATE\_1** and **Hour Range** columns. Clear the check box next to the **Hour Range** column to see how the output changes. In the absence of the **Hour Range** column as input, **12AM-2AM** is treated as a constant and is appended to the derived values. Select **Cancel** to return to the main grid without applying your changes.
   ![Advanced mode](media/tutorial-bikeshare-dataprep/derivedcolumnadvancededitdeselectcolumn.png)

1. To rename the column, double-click the header. Change the name to **Date Hour Range**, and then select Enter.

1. Multi-select the **DATE**, **DATE\_1**, **DATE\_2**, and **Hour Range** columns. Right-click, and then select **Remove column**.

## Summarize data (mean)

The next step is to summarize the weather conditions by taking the mean of the values, grouped by hour range.

1. Select the **Date Hour Range** column, and then on the **Transforms** menu, select **Summarize**.

    ![Transforms menu](media/tutorial-bikeshare-dataprep/weathersummarizemenu.png)

1. To summarize the data, drag columns from the grid at the bottom of the page to the left and right panes at the top. The left pane contains the text **Drag columns here to group data**. The right pane contains the text **Drag columns here to summarize data**. 

    a. Drag the **Date Hour Range** column from the grid at the bottom to the left pane. Drag **HOURLYDRYBULBTEMPF**, **HOURLYRelativeHumidity**, and **HOURLYWindSpeed** to the right pane. 

    b. In the right pane, select **Mean** as the **Aggregate** measure for each column. Select **OK** to finish the summarization.

    ![Summarized data screen](media/tutorial-bikeshare-dataprep/weathersummarize.png)

## Transform dataflow by using script

Changing the data in the numeric columns to a range of 0 to 1 allows some models to converge quickly. Currently, there is no built-in transformation to generically do this transformation. Use a Python script to perform this operation.

1. On the **Transform** menu, select **Transform Dataflow (Script)**.

1. Enter the following code in the text box that appears. If you used the column names, the code should work without modification. You are writing a simple min-max normalization logic in Python.

    > [!WARNING]
    > The script expects the column names used previously in this tutorial. If you have different column names, you must change the names in the script.

   ```python
   maxVal = max(df["HOURLYDRYBULBTEMPF_Mean"])
   minVal = min(df["HOURLYDRYBULBTEMPF_Mean"])
   df["HOURLYDRYBULBTEMPF_Mean"] = (df["HOURLYDRYBULBTEMPF_Mean"]-minVal)/(maxVal-minVal)
   df.rename(columns={"HOURLYDRYBULBTEMPF_Mean":"N_DryBulbTemp"},inplace=True)

   maxVal = max(df["HOURLYRelativeHumidity_Mean"])
   minVal = min(df["HOURLYRelativeHumidity_Mean"])
   df["HOURLYRelativeHumidity_Mean"] = (df["HOURLYRelativeHumidity_Mean"]-minVal)/(maxVal-minVal)
   df.rename(columns={"HOURLYRelativeHumidity_Mean":"N_RelativeHumidity"},inplace=True)

   maxVal = max(df["HOURLYWindSpeed_Mean"])
   minVal = min(df["HOURLYWindSpeed_Mean"])
   df["HOURLYWindSpeed_Mean"] = (df["HOURLYWindSpeed_Mean"]-minVal)/(maxVal-minVal)
   df.rename(columns={"HOURLYWindSpeed_Mean":"N_WindSpeed"},inplace=True)

   df
   ```

    > [!TIP]
    > The Python script must return `df` at the end. This value is used to populate the grid.
    
   ![Transform Dataflow (Script) dialog box](media/tutorial-bikeshare-dataprep/transformdataflowscript.png)

1. Select __OK__ to use the script. The numeric columns in the grid now contain values in the range of 0 to 1.

    ![Grid that contains values between 0 and 1](media/tutorial-bikeshare-dataprep/datagridwithdecimals.png)

You have finished preparing the weather data. Next, prepare the trip data.

## Load trip data

1. To import the `201701-hubway-tripdata.csv` file, use the steps in the [Create a new data source](#newdatasource) section. Use the following options during the import process:

    * __File Selection__: Select **Azure Blob** when you browse to select the file.

    * __Sampling Scheme__: Select **Full File** sampling scheme, and make the sample active.

    * __Data Type__: Accept the defaults.

1. After you import the data, select __Prepare__ to begin preparing the data. Select the existing **BikeShare Data Prep.dprep** package, and then select __OK__.

    This process adds a **Dataflow** to the existing **Data Preparation** file rather than creating a new one.

    ![Select the existing package](media/tutorial-bikeshare-dataprep/addjandatatodprep.png)

1. After the grid has loaded, expand __DATAFLOWS__. There are now two dataflows: **BostonWeather** and **201701-hubway-tripdata**. Select the **201701-hubway-tripdata** entry.

    ![201701-hubway-tripdata entry](media/tutorial-bikeshare-dataprep/twodfsindprep.png)

## Use the map inspector

For data preparation, useful visualizations called inspectors are available for string, numeric, and geographical data. They help you to understand the data better and identify outliers. Follow these steps to use the map inspector.

1. Multi-select the **start station latitude** and **start station longitude** columns. Right-click one of the columns, and then select **Map**.

    > [!TIP]
    > To enable multi-select, hold down the Ctrl key (Command ⌘ on Mac), and select the header for each column.

    ![Map visualization](media/tutorial-bikeshare-dataprep/launchMapInspector.png)

1. To maximize the map visualization, select the **Maximize** icon. To fit the map to the window, select the **E** icon on the upper-left side of the visualization.

    ![Maximized image](media/tutorial-bikeshare-dataprep/maximizedmap.png)

1. Select the **Minimize** button to return to the grid view.

## Use the column statistics inspector

To use the column statistics inspector, right-click the __tripduration__ column, and select __Column Statistics__.

![Column statistics entry](media/tutorial-bikeshare-dataprep/tripdurationcolstats.png)

This process adds a new visualization titled __tripduration Statistics__ in the __INSPECTORS__ pane.

![The tripduration Statistics inspector](media/tutorial-bikeshare-dataprep/tripdurationcolstatsinwell.png)

> [!IMPORTANT]
> The maximum value of the trip duration is 961,814 minutes, which is about two years. It seems there are some outliers in the dataset.

## Use the histogram inspector

To attempt to identify outliers, right-click the __tripduration__ column, and select __Histogram__.

![Histogram inspector](media/tutorial-bikeshare-dataprep/tripdurationhistogram.png)

The histogram isn't helpful because the outliers skew the graph.

## Add a column by using script

1. Right-click the **tripduration** column, and select **Add Column (Script)**.

    ![Add Column (Script) menu](media/tutorial-bikeshare-dataprep/computecolscript.png)

1. In the __Add Column (Script)__ dialog box, use the following values:

    * __New Column Name__: logtripduration

    * __Insert this New Column After__: tripduration

    * __New Column Code__: `math.log(row.tripduration)`

    * __Code Block Type__: Expression

   ![Add Column (Script) dialog box](media/tutorial-bikeshare-dataprep/computecolscriptdialog.png)

1. Select __OK__ to add the **logtripduration** column.

1. Right-click the column, and select **Histogram**.

    ![Histogram of logtripduration column](media/tutorial-bikeshare-dataprep/logtriphistogram.png)

    Visually, this histogram seems like a normal distribution with an abnormal tail.

## Use an advanced filter

Using a filter on the data updates the inspectors with the new distribution. 

1. Right-click the **logtripduration** column, and select **Filter Column**. 

1. In the __Edit__ dialog box, use the following values:

    * __Filter this Number Column__: logtripduration

    * __I Want To__: Keep Rows

    * __When__: Any of the Conditions below are True (logical OR)

    * __If this Column__: less than

    * __The Value__: 9

    ![Filter options](media/tutorial-bikeshare-dataprep/loftripfilter.png)

1. Select __OK__ to apply the filter.

    ![Updated histograms after filter is applied](media/tutorial-bikeshare-dataprep/loftripfilteredinspector.png)

### The halo effect

1. Maximize the **logtripduration** histogram. A blue histogram is overlaid on a gray histogram. This display is called the **Halo Effect**:

    * The gray histogram represents the distribution before the operation (in this case, the filtering operation).

    * The blue histogram represents the histogram after the operation. 

   The halo effect helps with visualizing the effect of an operation on the data.

   ![Halo effect](media/tutorial-bikeshare-dataprep/loftripfilteredinspectormaximized.png)

    > [!NOTE]
    > The blue histogram appears shorter compared to the previous one. This difference is due to automatic re-bucketing of data in the new range.

1. To remove the halo, select __Edit__ and clear __Show halo__.

    ![Options for the histogram](media/tutorial-bikeshare-dataprep/uncheckhalo.png)

1. Select **OK** to disable the halo effect. Then minimize the histogram.

### Remove columns

In the trip data, each row represents a bike pickup event. For this tutorial, you need only the **starttime** and **start station id** columns. To remove the other columns, multi-select these two columns, right-click the column header, and then select **Keep Column**. Other columns are removed.

![Keep Column option](media/tutorial-bikeshare-dataprep/tripdatakeepcolumn.png)

### Summarize data (count)

To summarize bike demand for a two-hour period, use derived columns.

1. Right-click the **starttime** column, and select **Derive Column by Example**.

    ![Derive Column by Example option](media/tutorial-bikeshare-dataprep/tripdataderivebyexample.png)

1. For the example, enter a value of **Jan 01, 2017 12AM-2AM** for the first row.

    > [!IMPORTANT]
    > In the previous example of deriving columns, you used multiple steps to derive a column that contained the date and time period. In this example, you can see that this operation can be performed as a single step by providing an example of the final output.

    > [!NOTE]
    > You can give an example against any of the rows. For this example, the value of **Jan 01, 2017 12AM-2AM** is valid for the first row of data.

    ![Example data](media/tutorial-bikeshare-dataprep/tripdataderivebyexamplefirstexample.png)

   > [!IMPORTANT]
   > On a Mac, follow this step instead of step 3:
   >
   > * Go to the first cell that contains **Jan 01, 2017 1AM-2AM**. It should be row 14. Correct the value to **Jan 01, 2017 12AM-2AM**, and select Enter. 

1. Wait until the application computes the values against all the rows. The process might take several seconds. After the analysis is finished, use the __Review next suggested row__ link to review data.

   ![Finished analysis with review link](media/tutorial-bikeshare-dataprep/tripdatabyexanalysiscomplete.png)

    Ensure that the computed values are correct. If not, update the value with the expected value, and select Enter. Then wait for the analysis to finish. Complete the **Review next suggested row** process until you see **No suggestions**. **No suggestions** means the application looked at the edge cases and is satisfied with the synthesized program. It's a best practice to perform a visual inspection of the transformed data before you accept the transformation. 

1. Select **OK** to accept the transform. Rename the newly created column to **Date Hour Range**.

    ![Renamed column](media/tutorial-bikeshare-dataprep/tripdatasummarize.png)

1. Right-click the **starttime** column header, and select **Remove column**.

1. To summarize the data, on the __Transform__ menu, select __Summarize__. To create the transformation, use the following steps:

    * Drag __Date Hour Range__ and __start station id__ to the **Group By** pane on the left.

    * Drag __start station id__ to the **summarize data** pane on the right.

   ![Summarization options](media/tutorial-bikeshare-dataprep/tripdatacount.png)

1. Select **OK** to accept the summary result.

## Join dataflows

To join the weather data with the trip data, use the following steps:

1. On the __Transforms__ menu, select __Join__.

1. __Tables__: Select **BostonWeather** as the **Left** dataflow and **201701-hubway-tripdata** as the **Right** dataflow. To continue, select **Next**.

    ![Tables selections](media/tutorial-bikeshare-dataprep/jointableselection.png)

1. __Key Columns__: Select the **Date Hour Range** column in both the tables, and then select __Next__.

    ![Key Columns selections](media/tutorial-bikeshare-dataprep/joinkeyselection.png)

1. __Join Type__: Select __Matching rows__ as the join type, and then select __Finish__.

    ![Matching rows join type](media/tutorial-bikeshare-dataprep/joinscreen.png)

    This process creates a new dataflow named __Join Result__.

## Create additional features

1. To create a column that contains the day of the week, right-click the **Date Hour Range** column and select **Derive Column by Example**. Use a value of __Sun__ for a date that occurred on a Sunday. An example is **Jan 01, 2017 12AM-2AM**. Select Enter, and then select **OK**. Rename this column to __Weekday__.

    ![Create new column for day of the week](media/tutorial-bikeshare-dataprep/featureweekday.png)

1. To create a column that contains the time period for a row, right-click the **Date Hour Range** column, and select **Derive Column by example**. Use a value of **12AM-2AM** for the row that contains **Jan 01, 2017 12AM-2AM**. Select Enter, and then select **OK**. Rename this column to **Period**.

    ![Period column](media/tutorial-bikeshare-dataprep/featurehourrange.png)

1. To remove the **Date Hour Range** and **r_Date Hour Range** columns, select Ctrl (Command ⌘ on Mac), and then select each column header. Right-click, and select **Remove Column**.

## Read data from Python

You can run a data preparation package from Python or PySpark and retrieve the result as a **Data Frame**.

To generate an example Python script, right-click __BikeShare Data Prep__, and select __Generate Data Access Code File__. The example Python file is created in your **Project Folder** and is also loaded in a tab within Workbench. The following Python script is an example of the code that is generated:

```python
# Use the Azure Machine Learning data preparation package
from azureml.dataprep import package

# Use the Azure Machine Learning data collector to log various metrics
from azureml.logging import get_azureml_logger
logger = get_azureml_logger()

# This call will load the referenced package and return a DataFrame.
# If run in a PySpark environment, this call returns a
# Spark DataFrame. If not, it will return a Pandas DataFrame.
df = package.run('BikeShare Data Prep.dprep', dataflow_idx=0)

# Remove this line and add code that uses the DataFrame
df.head(10)
```

For this tutorial, the name of the file is `BikeShare Data Prep.py`. This file is used later in the tutorial.

## Save test data as a CSV file

To save the **Join Result** dataflow to a .csv file, you must change the `BikeShare Data Prep.py` script. 

1. Open the project for editing in Visual Studio Code.

    ![Open project in Visual Studio Code](media/tutorial-bikeshare-dataprep/openprojectinvscode.png)

1. Update the Python script in the `BikeShare Data Prep.py` file by using the following code:

    ```python
    import pyspark

    from azureml.dataprep.package import run
    from pyspark.sql.functions import *

    # start Spark session
    spark = pyspark.sql.SparkSession.builder.appName('BikeShare').getOrCreate()

    # dataflow_idx=2 sets the dataflow to the 3rd dataflow (the index starts at 0), the Join Result.
    df = run('BikeShare Data Prep.dprep', dataflow_idx=2)
    df.show(n=10)
    row_count_first = df.count()

    # Example file name: 'wasb://data-files@bikesharestorage.blob.core.windows.net/testata'
    # 'wasb://<your container name>@<your azure storage name>.blob.core.windows.net/<csv folder name>
    blobfolder = 'Your Azure Storage blob path'

    df.write.csv(blobfolder, mode='overwrite') 

    # retrieve csv file parts into one data frame
    csvfiles = "<Your Azure Storage blob path>/*.csv"
    df = spark.read.option("header", "false").csv(csvfiles)
    row_count_result = df.count()
    print(row_count_result)
    if (row_count_first == row_count_result):
        print('counts match')
    else:
        print('counts do not match')
    print('done')
    ```

1. Replace `Your Azure Storage blob path` with the path to the output file to be created. Replace for both the `blobfolder` and `csvfiles` variables.

## Create an HDInsight run configuration

1. In Machine Learning Workbench, open the command-line window, select the **File** menu, and then select **Open Command Prompt**. Your command prompt starts in the project folder with the prompt `C:\Projects\BikeShare>`.

    ![Open command prompt](media/tutorial-bikeshare-dataprep/opencommandprompt.png)

   >[!IMPORTANT]
   >You must use the command-line window (opened from Workbench) to accomplish the steps that follow.

1. Use the command prompt to sign in to Azure. 

   The Workbench app and CLI use independent credential caches when you authenticate against Azure resources. You need to do this only once until the cached token expires. The `az account list` command returns the list of subscriptions available to your login. If there is more than one, use the ID value from the desired subscription. Set that subscription as the default account to use with the `az account set -s` command, and then provide the subscription ID value. Then confirm the setting by using the account `show` command.

   ```azurecli
   REM login by using the aka.ms/devicelogin site
   az login
   
   REM lists all Azure subscriptions you have access to 
   az account list -o table
   
   REM sets the current Azure subscription to the one you want to use
   az account set -s <subscriptionId>
   
   REM verifies that your current subscription is set correctly
   az account show
   ```

1. Create the HDInsight run config. You need the name of your cluster and the `sshuser` password.

    ```azurecli
    az ml computetarget attach cluster --name hdinsight --address <yourclustername>.azurehdinsight.net --username sshuser --password <your password>
    az ml experiment prepare -c hdinsight
    ```
> [!NOTE]
> When a blank project is created, the default run configurations are **local** and **docker**. This step creates a new run configuration that is available in Workbench when you run your scripts. 

## Run in an HDInsight cluster

Return to the Machine Learning Workbench application to run your script in the HDInsight cluster.

1. Return to the home screen of your project by selecting the **Home** icon on the left.

1. Select **hdinsight** from the drop-down list to run your script in the HDInsight cluster.

1. Select **Run**. The script is submitted as a job. The job status changes to __Completed__ after the file is written to the specified location in your storage container.

    ![HDInsight run script](media/tutorial-bikeshare-dataprep/hdinsightrunscript.png)


## Substitute data sources

In the previous steps, you used the `201701-hubway-tripdata.csv` and `BostonWeather.csv` data sources to prepare the test data. To use the package with the other trip data files, use the following steps:

1. Create a new data source by using the steps given previously, with the following changes to the process:

    * __File Selection__: When you select a file, multi-select the six remaining trip tripdata .csv files.

    ![Load six remaining files](media/tutorial-bikeshare-dataprep/browseazurestoragefortripdatafiles.png)

    > [!NOTE]
     > The __+5__ entry indicates that there are five additional files beyond the one that is listed.

    * __File Details__: Set __Promote Headers Mode__ to **All Files Have The Same Headers**. This value indicates that each of the files contains the same header.

    ![File details selection](media/tutorial-bikeshare-dataprep/headerfromeachfile.png) 

   Save the name of this data source because it's used in later steps.

1. Select the folder icon to view the files in your project. Expand the __aml\_config__ directory, and then select the `hdinsight.runconfig` file.

    ![Location of hdinsight.runconfig](media/tutorial-bikeshare-dataprep/hdinsightsubstitutedatasources.png) 

1. Select the **Edit** button to open the file in Visual Studio Code.

1. Add the following lines at the end of the `hdinsight.runconfig` file, and then select the disk icon to save the file.

    ```yaml
    DataSourceSubstitutions:
      201701-hubway-tripdata.dsource: 201501-hubway-tripdata.dsource
    ```

    This change replaces the original data source with the one that contains the six trip data files.

## Save training data as a CSV file

1. Browse to the Python file `BikeShare Data Prep.py` that you edited previously. Provide a different file path to save the training data.

    ```python
    import pyspark

    from azureml.dataprep.package import run
    from pyspark.sql.functions import *

    # start Spark session
    spark = pyspark.sql.SparkSession.builder.appName('BikeShare').getOrCreate()

    # dataflow_idx=2 sets the dataflow to the 3rd dataflow (the index starts at 0), the Join Result.
    df = run('BikeShare Data Prep.dprep', dataflow_idx=2)
    df.show(n=10)
    row_count_first = df.count()

    # Example file name: 'wasb://data-files@bikesharestorage.blob.core.windows.net/traindata'
    # 'wasb://<your container name>@<your azure storage name>.blob.core.windows.net/<csv folder name>
    blobfolder = 'Your Azure Storage blob path'

    df.write.csv(blobfolder, mode='overwrite') 

    # retrieve csv file parts into one data frame
    csvfiles = "<Your Azure Storage blob path>/*.csv"
    df = spark.read.option("header", "false").csv(csvfiles)
    row_count_result = df.count()
    print(row_count_result)
    if (row_count_first == row_count_result):
        print('counts match')
    else:
        print('counts do not match')
    print('done')
    ```

1. Use the folder named `traindata` for the training data output.

1. To submit a new job, select **Run**. Make sure **hdinsight** is selected. A job is submitted with the new configuration. The output of this job is the training data. This data is created by using the same data preparation steps that you followed previously. The job might take a few minutes to finish.


## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps
You have finished the bike-share data preparation tutorial. In this tutorial, you used Machine Learning (preview) to learn how to:
> [!div class="checklist"]
> * Prepare data interactively with the Machine Learning data preparation tool.
> * Import, transform, and create a test dataset.
> * Generate a data preparation package.
> * Run the data preparation package by using Python.
> * Generate a training dataset by reusing the data preparation package for additional input files.

Next, learn more about data preparation:
> [!div class="nextstepaction"]
> [Data preparation user guide](data-prep-user-guide.md)
