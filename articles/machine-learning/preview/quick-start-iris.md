---
title: Iris Quickstart for Machine Learning Server | Microsoft Docs
description: This Quickstart shows how to use Azure Machine Learning to process the timeless Iris flower dataset in the Azure Machine Learning Workbench.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/01/2017
---

# Quickstart: Classifying Iris Flower Dataset
In this Quickstart, we take a quick tour of Azure Machine Learning preview features using the timeless [Iris flower dataset](https://en.wikipedia.org/wiki/iris_flower_data_set). 

## Provision and Install Azure Machine Learning Workbench
Follow the installation guide to provision Azure resources and install Azure ML Workbench app.

## Create a New Project with _Classifying Iris_ Sample Template 
1. Launch the Azure ML Workbench desktop app. 

2. Click on **File** --> **New Project** (or click on the "+" sign in the project list pane). 

3. Fill in the **project name**, and the **directory** the project is going to be created in. The **project description** is optional but helpful. Choose the default **My Projects** workgroup, and then select the **Classifying Iris** sample project as the project template.

<!--![New Project](media/quick-start-iris/new_project.png)-->
4. Optionally, you can fill in the Git repo text field with the URL of a Git repo that lives in a [VSTS (Visual Studio Team Service)](https://www.visualstudio.com) project. This Git repo must exist, and is empty with no master branch. Adding a Git repo now lets you enable roaming and sharing scenarios later.

5. Click on the **Create** button to create the project. After a few seconds, the new project is created and opened.

## Run iris_sklearn.py Python Script

1. Now you should see the project dashboard. Select **local** as the execution target, and **iris_sklearn.py** as the script to run.

2. In the **Argument** text field, type `0.01`.

3. Click the **Run** button.

4. Click the **Jobs Panel** and notice that a job is now listed. The job status goes from **Submitting** to **Running** as the job begins to run, and to **Completed** in a few seconds. 

   Now you have successfully executed a Python script in Azure ML Workbench.

5. Repeat the previous steps 2-4 a few times. Each time, use different argument values ranging from `10` to `0.001`. This value is used as regularization rate of the logistic regression algorithm in the `iris_sklearn.py` script.

## View Run History
1. Navigate to the Run History view, and click on **iris_sklearn.py**.The run history list view opens and displays of all runs executed on **iris_sklearn.py**. 

2. Notice the top metrics, some default graphs, and a list of metrics for each run.

   Customize this view by sorting, filtering, and adjusting the configurations.

3. Now click on a completed run. You can see the detailed view of that particular execution, including additional metrics, the files it produced (pickled scikit-learn model, plots in png format), the two plotted png files (confusion matrix and multi-class ROC curve), and other useful run logs.

## Explore further
Now you have got a taste of the Azure ML Workbench execution experience, explore further using this sample project. 

1. To better understand the logic, open the `iris_sklearn.py` file and read the python code. Pay particular attention to the following code sections:
   - Invoke `iris` DataPrep package
   - Logging statements
   - Serialization and de-serialization the `scikit-learn` model
   - Plot an image using `matplotlib` and save it as png file

2. Open the `iris` data source from **Data View** and explore the `Iris.csv` raw dataset.

3. Open the `iris` data prep package from **Data View**, and explore the data preparation editor.

## Next Steps
- Try operationalize the `model.pkl` model in the [next quick-start](quick-start-iris-mms.md).
- Follow the more detailed and advanced tutorial: [Bike Share Forecasting](./doc-template-tutorial.md)