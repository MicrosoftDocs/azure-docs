---
title: Prepare data for classifying Iris tutorial in Azure Machine Learning services (preview) | Microsoft Docs
description: This full-length tutorial shows how to use Azure Machine Learning services (preview) end to end. This is part one and discusses data preparation.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: hero-article
ms.date: 09/28/2017
---

# Classify Iris part 1: Prepare the data
Azure Machine Learning services (preview) is an integrated, end-to-end data science and advanced analytics solution for professional data scientists to prepare data, develop experiments, and deploy models at cloud scale.

This tutorial is part one of a three-part series. In this tutorial, we walk through the basics of Azure Machine Learning services (preview). You learn how to:
> [!div class="checklist"]
> * Create a project in Azure Machine Learning Workbench.
> * Create a data preparation package.
> * Generate Python/PySpark code to invoke a data preparation package.

This tutorial uses the timeless [Iris flower data set](https://en.wikipedia.org/wiki/Iris_flower_data_set). The screenshots are Windows-specific, but the Mac OS experience is almost identical.

## Prerequisites
- Create an Azure Machine Learning Experimentation account.
- Install Azure Machine Learning Workbench.

You can follow the instructions in the [Install and create Quickstart](quickstart-installation.md) article to install the Azure Machine Learning Workbench application. This installation also includes the Azure cross-platform command-line tool, or Azure CLI.

## Create a new project in Azure Machine Learning Workbench
1. Open the Azure Machine Learning Workbench app, and log in if needed. In the **PROJECTS** pane, select the plus sign (**+**) to create a **New Project**.

   ![New workspace](media/tutorial-classifying-iris/new_ws.png)

2. Fill in the **Create New Project** details: 

   ![New project](media/tutorial-classifying-iris/new_project.png)

   - Fill in the **Project name** box with a name for the project. For example, use the value **myIris**.
   - Select the **Project directory** in which the project is created. For example, use the value `C:\Temp\`. 
   - Enter the **Project description**, which is optional. 
   - The **Git Repository** field is also optional and can be left blank. You can provide an existing empty Git repo (a repo with no master branch) on Visual Studio Team Services. If you use a Git repo that already exists, you can enable the roaming and sharing scenarios later. For more information, see [Use Git repo](using-git-ml-project.md). 
   - Select a **Workspace**, for example, this tutorial uses **IrisGarden**. 
   - Select the **Classifying Iris** template from the project template list. 

3. Select the **Create** button. The project is now created and opened for you.

## Create a data preparation package
1. Open the **iris.csv** file from the **File View**. The file is a table with 5 columns and 150 rows. It has four numerical feature columns and a string target column. It does not have column headers.

   ![iris.csv](media/tutorial-classifying-iris/show_iris_csv.png)

   >[!NOTE]
   > Do not include data files in your project folder, particularly when the file size is large. We include **iris.csv** in this template for demonstration purposes because it's tiny. For more information, see [How to read and write large data files](how-to-read-write-files.md).

2. In the **Data View**, select the plus sign (**+**) to add a new data source. The **Add Data Source** page opens. 

   ![Data view](media/tutorial-classifying-iris/data_view.png)

3. Leave the default values, and then select the **Next** button.  
 
   ![Select iris](media/tutorial-classifying-iris/select_iris_csv.png)

   >[!IMPORTANT]
   >Make sure you select the **iris.csv** file from within the current project directory for this exercise, otherwise later steps might fail. 

4. A new file named **iris-1.dsource** is created. The file is named uniquely with a dash-1, because the sample project already comes with an unnumbered **iris.dsource** file.  

   The file opens, and the data is shown. A series of column headers, from **Column1** to **Column5**, are automatically added to this data set. Scroll to the bottom and notice that the last row of the data set is empty. The row is empty because there is an extra line break in the CSV file.

   ![Iris data view](media/tutorial-classifying-iris/iris_data_view.png)

5. Select the **Metrics** button. Observe the histograms. A complete set of statistics have been calculated for each column. You can also select the **Data** button to see the data again. 

   ![Iris data view](media/tutorial-classifying-iris/iris_metrics_view.png)

6. Select the **Prepare** button. The **Prepare** dialog box opens. 

   The sample project comes with a **iris.dprep** file, so by default it asks you to create a new data flow in the **iris.dprep** data preparation package that already exists. 

   Select **+ New Data Preparation Package** from the drop-down menu, enter a new value for the package name, use **iris-1**, and then select **OK**.

   ![Iris data view](media/tutorial-classifying-iris/new_dprep.png)

   A new data preparation package named **iris-1.dprep** is created and opened in data preparation editor.

7. Now let's do some basic data preparation. Rename the column names. Select each column header to make the header text editable. 

   Enter **Sepal Length**, **Sepal Width**, **Petal Length**, **Petal Width**, and **Species** for the five columns respectively.

   ![Rename the columns](media/tutorial-classifying-iris/rename_column.png)

8. To count distinct values, select the **Species** column, and then right-click to select it. Select **Value Counts** from the drop-down menu. 

   ![Select Value Counts](media/tutorial-classifying-iris/value_count.png)

   This action opens the **Inspectors** pane, and displays a histogram with four bars. The target column has three distinct values: **Iris_virginica**, **Iris_versicolor**, **Iris-setosa**, and a **(null)** value.

9. To filter out nulls, select the bar from the graph that represents the null value. There is one row with a **(null)** value. To remove this row, select the minus sign (**-**).

   ![Value count histogram](media/tutorial-classifying-iris/filter_out.png)

10. Notice the individual steps detailed in the **STEPS** pane. As you renamed the columns and filtered the null value rows, each action was recorded as a data-preparation step. You can edit individual steps to adjust the settings, reorder the steps, and remove steps.

   ![Steps](media/tutorial-classifying-iris/steps.png)

11. Close the data preparation editor. Select **Close** (x) on the **iris-1** tab with the graph icon. Your work is automatically saved into the **iris-1.dprep** file shown under the **Data Preparations** heading.

## Generate Python/PySpark code to invoke a data preparation package

1. Right-click the **iris-1.dprep** file to bring up the context menu, and then select **Generate Data Access Code File**. 

   ![Generate code](media/tutorial-classifying-iris/generate_code.png)

2. A new file named **iris-1.py** opens with the following lines of code:

   ```Python
   # This code snippet loads the referenced package and returns a DataFrame.
   # If you run the code in a PySpark environment, the code returns a
   # Spark DataFrame. If not, the code returns a pandas DataFrame.

   from azureml.dataprep.package import run
   df = run('iris.dprep', dataflow_idx=0)
   ```

   This code snippet invokes the logic you created as a data preparation package. Depending on the context in which this code is run, `df` represents the various kinds of dataframes. A [pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html) is used when executed in Python runtime, or a [Spark DataFrame](https://spark.apache.org/docs/latest/sql-programming-guide.html) is used when executed in a Spark context. 

   For more information on how to prepare data in Azure Machine Learning Workbench, see the [Get started with data preparation](data-prep-getting-started.md) guide.

## Next steps
In this first part of the three-part tutorial series, you have used Azure Machine Learning Workbench to:
> [!div class="checklist"]
> * Create a new project 
> * Create a data preparation package
> * Generate Python/PySpark code to invoke a data preparation package

You are ready to move on to the next part in the series, where you learn how to build an Azure Machine Learning model:
> [!div class="nextstepaction"]
> [Build a model](tutorial-classifying-iris-part-2.md)
