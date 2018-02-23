---
title: Prepare data for classifying Iris tutorial in Azure Machine Learning services (preview) | Microsoft Docs
description: This full-length tutorial shows how to use Azure Machine Learning services (preview) end to end. This is part one and discusses data preparation.
services: machine-learning
author: hning86
ms.author: haining, j-martens
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: tutorial
ms.date: 02/28/2018
---

# Tutorial: Classify Iris part 1 - Preparing the data

Azure Machine Learning services (preview) is an integrated, end-to-end data science and advanced analytics solution for professional data scientists to prepare data, develop experiments, and deploy models at cloud scale.

This tutorial is part one of a three-part series. In this tutorial, we walk through the basics of Azure Machine Learning services (preview). You learn how to:

> [!div class="checklist"]
> * Create a project in Azure Machine Learning Workbench.
> * Create a data preparation package.
> * Generate Python/PySpark code to invoke a data preparation package.

This tutorial uses the timeless [Iris flower data set](https://en.wikipedia.org/wiki/Iris_flower_data_set). The screenshots are Windows-specific, but the macOS experience is almost identical.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

In order to complete this tutorial, you must have:
- An Azure Machine Learning Experimentation account
- Azure Machine Learning Workbench installed

You can follow the instructions in the [Quickstart: Install and start](quickstart-installation.md) article to install the Azure Machine Learning Workbench application. This installation also includes the Azure cross-platform command-line tool, or Azure CLI.

## Create a new project in Azure Machine Learning Workbench
1. Open the Azure Machine Learning Workbench app, and log in if needed. 
   
   On Windows, just launch it using the **Machine Learning Workbench** desktop shortcut. 
   
   For macOS users, select **Azure ML Workbench** in your Launchpad.

1. Select the plus sign (+) in the **PROJECTS** pane and choose **New Project**.  

   ![New workspace](media/tutorial-classifying-iris/new_ws.png)

1. Fill out of the form fields and select the **Create** button to create a new project in the Workbench.

   Field|Suggested value for tutorial|Description
   ---|---|---
   Project name | myIris |Enter a unique name that identifies your account. You can use your own name, or a departmental or project name that best identifies the experiment. The name should be 2 to 32 characters. It should include only alphanumeric characters and the dash (-) character. 
   Project directory | c:\Temp\ | Specify the directory in which the project is created.
   Project description | _leave blank_ | Optional field useful for describing the projects.
   Visualstudio.com |_leave blank_ | Optional field. A project can optionally be associated with a Git repository on Visual Studio Team Services for source control and collaboration. [Learn how to set that up.](https://docs.microsoft.com/en-us/azure/machine-learning/preview/using-git-ml-project#step-3-set-up-a-machine-learning-project-and-git-repo). 
   Workspace | IrisGarden | Choose a workspace that you have created for your Experimentation account in the Azure portal.
   Project template | Classifying Iris | Templates contain scripts and data you can use to explore the product. This template contains the scripts and data you need for this quickstart and other tutorials in this documentation site. 

   ![New project](media/tutorial-classifying-iris/new_project.png)
 
 A new project is created and the project dashboard opens with that project. At this point, you can explore the project home page, data sources, notebooks, and source code files. 

## Create a data preparation package
1. Open the **iris.csv** file from the **File View**. The file is a table with 5 columns and 150 rows. It has four numerical feature columns and a string target column. It does not have column headers.

   ![iris.csv](media/tutorial-classifying-iris/show_iris_csv.png)

   >[!NOTE]
   > Do not include data files in your project folder, particularly when the file size is large. We include **iris.csv** in this template for demonstration purposes because it's tiny. For more information, see [How to read and write large data files](how-to-read-write-files.md).

2. In the **Data View**, select the plus sign (**+**) to add a new data source. The **Add Data Source** page opens. 

   ![Data view](media/tutorial-classifying-iris/data_view.png)

3. Select **Text Files(*.csv, .json, .txt.,... )** and click **Next**.
   ![Data Source](media/tutorial-classifying-iris/data-source.png)
   

4. Browse to the file **iris.csv**, and click **Next**.  
 
   ![Select iris](media/tutorial-classifying-iris/select_iris_csv.png)

   >[!IMPORTANT]
   >Make sure you select the **iris.csv** file from within the current project directory for this exercise. Otherwise, later steps might fail.
   
5. Leave the default values and click **Finish**.

6. A new file named **iris-1.dsource** is created. The file is named uniquely with  "-1" because the sample project already comes with an unnumbered **iris.dsource** file.  

   The file opens, and the data is shown. A series of column headers, from **Column1** to **Column5**, is automatically added to this data set. Scroll to the bottom and notice that the last row of the data set is empty. The row is empty because there is an extra line break in the CSV file.

   ![Iris data view](media/tutorial-classifying-iris/iris_data_view.png)

7. Select the **Metrics** button. Observe the histograms. A complete set of statistics has been calculated for each column. You can also select the **Data** button to see the data again. 

   ![Iris data view](media/tutorial-classifying-iris/iris_metrics_view.png)

8. Select the **Prepare** button. The **Prepare** dialog box opens. 

   The sample project comes with an **iris.dprep** file. By default, it asks you to create a new data flow in the **iris.dprep** data preparation package that already exists. 

   Select **+ New Data Preparation Package** from the drop-down menu, enter a new value for the package name, use **iris-1**, and then select **OK**.

   ![Iris data view](media/tutorial-classifying-iris/new_dprep.png)

   A new data preparation package named **iris-1.dprep** is created and opened in the data preparation editor.

9. Now let's do some basic data preparation. Rename the column names. Select each column header to make the header text editable. 

   Enter **Sepal Length**, **Sepal Width**, **Petal Length**, **Petal Width**, and **Species** for the five columns respectively.

   ![Rename the columns](media/tutorial-classifying-iris/rename_column.png)

10. To count distinct values, select the **Species** column, and then right-click to select it. Select **Value Counts** from the drop-down menu. 

   ![Select Value Counts](media/tutorial-classifying-iris/value_count.png)

   This action opens the **Inspectors** pane, and displays a histogram with four bars. The target column has three distinct values: **Iris_virginica**, **Iris_versicolor**, **Iris-setosa**, and a **(null)** value.

11. To filter out nulls, select the bar from the graph that represents the null value. There is one row with a **(null)** value. To remove this row, select the minus sign (**-**).

   ![Value count histogram](media/tutorial-classifying-iris/filter_out.png)

12. Notice the individual steps detailed in the **STEPS** pane. As you renamed the columns and filtered the null value rows, each action was recorded as a data-preparation step. You can edit individual steps to adjust the settings, reorder the steps, and remove steps.

   ![Steps](media/tutorial-classifying-iris/steps.png)

13. Close the data preparation editor. Select **Close** (x) on the **iris-1** tab with the graph icon. Your work is automatically saved into the **iris-1.dprep** file shown under the **Data Preparations** heading.

## Generate Python/PySpark code to invoke a data preparation package

1. Right-click the **iris-1.dprep** file to bring up the context menu, and then select **Generate Data Access Code File**. 

   ![Generate code](media/tutorial-classifying-iris/generate_code.png)

2. A new file named **iris-1.py** opens with the following lines of code:

   ```python
   # Use the Azure Machine Learning data preparation package
   from azureml.dataprep import package

   # Use the Azure Machine Learning data collector to log various metrics
   from azureml.logging import get_azureml_logger
   logger = get_azureml_logger()

   # This call will load the referenced package and return a DataFrame.
   # If run in a PySpark environment, this call returns a
   # Spark DataFrame. If not, it will return a Pandas DataFrame.
   df = package.run('iris-1.dprep', dataflow_idx=0)

   # Remove this line and add code that uses the DataFrame
   df.head(10)
   ```

   This code snippet invokes the logic you created as a data preparation package. Depending on the context in which this code is run, `df` represents the various kinds of dataframes. A [pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html) is used when executed in Python runtime, or a [Spark DataFrame](https://spark.apache.org/docs/latest/sql-programming-guide.html) is used when executed in a Spark context. 

   For more information on how to prepare data in Azure Machine Learning Workbench, see the [Get started with data preparation](data-prep-getting-started.md) guide.

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps
In this first part of the three-part tutorial series, you have used Azure Machine Learning Workbench to:
> [!div class="checklist"]
> * Create a new project. 
> * Create a data preparation package.
> * Generate Python/PySpark code to invoke a data preparation package.

You are ready to move on to the next part in the series, where you learn how to build an Azure Machine Learning model:
> [!div class="nextstepaction"]
> [Tutorial 2 - Classifying Iris: Build models](tutorial-classifying-iris-part-2.md)
