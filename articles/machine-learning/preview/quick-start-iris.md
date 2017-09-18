---
title: Iris Quickstart for Azure Machine Learning services (preview)  | Microsoft Docs
description: This Quickstart demonstrates how to use Azure Machine Learning services (preview) to process the timeless Iris flower dataset.
services: machine-learning
author: hning86
ms.author: haining, raymondl, ritbhat
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/15/2017
---

# Quickstart: Classifying the Iris flower data set
Azure Machine Learning services (preview) is an integrated, end-to-end data science and advanced analytics solution for professional data scientists to prepare data, develop experiments and deploy models at cloud scale.

In this quickstart, you take a quick tour of Azure Machine Learning preview features using the timeless [Iris flower dataset](https://en.wikipedia.org/wiki/iris_flower_data_set) to build a model to predict the type of iris based on some of its physical characteristics.  This quickstart uses the [logistic regression](https://en.wikipedia.org/wiki/logistic_regression) algorithm from the popular Python [scikit-learn](http://scikit-learn.org/stable/index.html) library to build the model. You learn the following tasks in this quickstart: 

- Create a new project
- Create a model by executing a script
- Explore script run history

## Prerequisites
Follow the [Provision and Installation Guide](./quick-start-installation.md) to create Azure Machine Learning Experimentation account and install the Azure ML Workbench app.

## Create a new project
1. Launch the Azure ML Workbench app and log in. 

2. Click on **File** --> **New Project** (or click on the **+** sign in the **PROJECTS** pane). 

3. Fill in the **Project name** and the **Project directory** fields. The **Project description** is optional but helpful. Leave the **Visualstudio.com GIT Repository URL** field blank for now. Choose a workspace, and select **Classifying Iris** as the project template.

   >[!TIP]
   >Optionally, you can fill in the Git repo text field with the URL of a Git repo that is hosted in a [VSTS (Visual Studio Team Service)](https://www.visualstudio.com) project. This Git repo must already exist, and it must be empty with no master branch. And you must have write access to it. Adding a Git repo now lets you enable roaming and sharing scenarios later. [Read more](using-git-ml-project.md).

4. Click on the **Create** button to create the project. A new project is created and opened for you. At this point, you can explore the project home page, data sources, notebooks, source code files. 

    >[!TIP]
    >You can also open the project in VS Code or other editors simply by configuring an IDE (Integrated Development Environment) link, and then open the project directory in it. [Read more](how-to-configure-your-IDE.md). 

## Run a Python script
Let's execute a script on your local computer. 

1. Each project opens to its own **Project Dashboard** page. Select `local` as the execution target from the command bar near the top of the application to the left of the run button, and `iris_sklearn.py` as the script to run.  There are a number of other files included in the sample you can check out later. 

![img](media/tutorial-classifying-iris/run_control.png)

2. In the **Arguments** text field, enter `0.01`. This number is used in the code to set the regularization rate, a value used to configure how the linear regression model is trained. 

3. Click the **Run** button to begin executing `iris_sklearn.py` on your computer. 

4. The **Jobs** panel slides out from the right if it is not already visible, and an `iris_sklearn` job is added in the panel. Its status transitions from **Submitting** to **Running** as the job begins to run, and then to **Completed** in a few seconds. 

5. Congratulations. You have successfully executed a Python script in Azure ML Workbench.

6. Repeat steps 2-4 several times. Each time, use different argument values ranging from `10` to `0.001`.

## View run history
1. Navigate to the **Runs** view, and click on **iris_sklearn.py** in the run list. The run history dashboard for `iris_sklearn.py` opens. It shows every run that was executed on `iris_sklearn.py`. 

![img](media/tutorial-classifying-iris/run_view.png)

2. The run history dashboard also displays the top metrics, a set of default graphs, and a list of metrics for each run. You can customize this view by sorting, filtering, and adjusting the configurations by clicking on the configuration icon or the filter icon.

![img](media/tutorial-classifying-iris/run_dashboard.png)

3. Click on a completed run and you can see a detailed view for that specific execution, including additional metrics, the files it produced, and other potentially useful logs.


## Next steps
For a more in-depth experience of this workflow, including how to deploy your Iris model as a web service, follow the full-length Classifying Iris Tutorial which contains detailed steps for [data preparation](tutorial-classifying-iris-part-1.md), [experimentation](tutorial-classifying-iris-part-2.md), and [model management](tutorial-classifying-iris-part-3.md). 

> [!div class="nextstepaction"]
> [Classifying Iris tutorial](tutorial-classifying-iris-part-1.md)
