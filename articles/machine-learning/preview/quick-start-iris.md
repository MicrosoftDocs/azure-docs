---
title: Quickstart article for Machine Learning Server | Microsoft Docs
description: This sample describes the article in 115 to 145 characters. Validate using Gauntlet toolbar check icon. Use SEO kind of action verbs here.
services: machine-learning
author: haining
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/01/2017
---

# Classifying Iris Flower Dataset

In this tutorial, we take a quick tour of Azure Machine Learning preview features using the timeless [Iris flower dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set). 

## Step 1. Provision and Install Azure Machine Learning Workbench
Follow the installation guide to provision Azure resources and install Azure ML Workbench app.

## Step 2. Create a New Project with _Classifying Iris_ Sample Template 
Launch the Azure ML Workbench desktop app. Click on _File_ --> _New Project_ (or click on the "+" sign in the project list pane). Fill in the project name, and the directory the project is going to be created in. The project description is optional but helpful. Choose the default "My Projects" workgroup, and then select the _Classifying Iris_ sample project as the project template. 

<!--![New Project](media/quick-start-iris/new_project.png)-->
>Optionally, you can fill in the Git repo text field with the URL of a Git repo that lives in a [VSTS (Visual Studio Team Service)](https://www.visualstudio.com) project. This Git repo must exist, and is empty with no master branch. Adding a Git repo now lets you enable roaming and sharing scenarios later.

Click on _Create_ button to create the project. After a few seconds, the new project is created and opened.

## Step 3. Run _iris_sklearn.py_ Python Script
Now you should see the project dashboard. From here select _local_ as the execution target, and _iris_sklearn.py_ as the script to run, type _0.01_ in the _Argument_ text field, and hit the Run button. You should see that a job is kicked off on the Jobs Panel.

The job status goes from _Submitting_ to _Running_, and to _Completed_ in a few seconds. Now you have successfully executed a Python script in Azure ML Workbench.

You can try to repeat this step a few more times, using different argument values ranging from 10 to 0.001. This value is used as regularization rate of the logistic regression algorithm in the _iris_sklearn.py_ script.

## Step 4. View Run History
Navigate to the Run History view, and click on _iris_sklearn.py_. This brings up the run history list view of all runs executed on _iris_sklearn.py_. You can see the top metrics, some default graphs, and a list of metrics for each run. And you customize this view by sorting, filtering and configurations.

Now click on a completed run, you can see the detailed view of that particular execution, including additional metrics, the files it produced (pickled scikit-learn model, plots in png format), the two plotted png files (confusion matrix and multi-class ROC curve), and other useful run logs.

## Next Steps
Now you have got a taste of the Azure ML Workbench execution experience, you can explore further this sample project. 
- Open the _iris.sklearn.py_ file and read the code to understand the logic. Pay particular attention to the following:
    - Invoke _iris_ DataPrep package
    - Logging statements
    - Serialization and de-serialization the scikit-learn model
    - Plot an image using _matplotlib_ and save it as png file
- Open the _iris_ data source from Data View and explore the _Iris.csv_ raw dataset.
- Open the _iris_ DataPrep package from Data View, and explore the data preparation editor.

You can also jump into a much more detailed and advanced tutorial: Bike Share Forecasting. 