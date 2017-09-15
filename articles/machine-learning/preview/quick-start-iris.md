---
title: Iris Quickstart for Azure Machine Learning services (preview)  | Microsoft Docs
description: This Quickstart demonstrates how to use Azure Machine Learning services (preview) to process the timeless Iris flower dataset.
services: machine-learning
author: hning86
ms.author: haining, raymondl
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

In this quickstart, you take a quick tour of Azure Machine Learning preview features using the timeless [Iris flower dataset](https://en.wikipedia.org/wiki/iris_flower_data_set) to build a model to predict the type of iris based on some of its physical characteristics.  This quickstart uses [logistic regression](https://en.wikipedia.org/wiki/logistic_regression) algorithm from the popular Python [scikit-learn](http://scikit-learn.org/stable/index.html) library to build the model.  You learn the following tasks in this quickstart: 

- Create a new project
- Create a model by executing a script
- Explore script run history
- Deploy a model as a web service

## Prerequisite
Follow the [Provision and Installation](./quick-start-installation.md) guide to create Azure resources and install the Azure ML Workbench app.

## Create a new project
1. Launch the Azure ML Workbench app. 

2. Click on **File** --> **New Project** (or click on the **+** sign in the **PROJECTS** pane). 

3. Fill in the **project name**, and the **directory** to store the files. The **project description** is optional but helpful. Choose the default **My Projects** workgroup, and select the **Classifying Iris** sample project as the project template.

   >[!TIP]
   >Optionally, you can fill in the Git repo text field with the URL of a Git repo that lives in a [VSTS (Visual Studio Team Service)](https://www.visualstudio.com) project. This Git repo must exist, and it must be empty with no master branch. Adding a Git repo now lets you enable roaming and sharing scenarios later. [Read more](using-git-ml-project.md).

4. Click on the **Create** button to create the project. A new project is created and opened for you. At this point, you can explore the project home page, data sources, notebooks, source code files. You can open the project in VS Code or other editors simply by opening the project directory. 

## Run a Python script
Let's execute a script on your local computer. 

1. Each project opens to its own **project dashboard**. Select `local` as the execution target from the command bar near the top of the application to the left of the run button, and `iris_sklearn.py` as the script to run.  There are a number of other files included in the sample you can check out later. 

2. In the **Arguments** text field, type `0.01`. This value is used in the code to set the regularization rate, a value used to configure how the linear regression model is trained. 

3. Click the **Run** button to begin executing `iris_sklearn.py` on your computer. 

4. The **Jobs** panel slides out if it is already visible, and a `iris_sklearn` job is added in the panel. Its status transitions from **Submitting** to **Running** as the job begins to run, and then to **Completed** in a few seconds. 

5. Congratulations. You have successfully executed a Python script in Azure ML Workbench.

6. Repeat steps 2-4 several times. Each time, use different argument values ranging from `10` to `0.001`.

## View run history
1. Navigate to the **Runs** view, and click on **iris_sklearn.py**. The run list shows every run that was executed on `iris_sklearn.py`. Each entry in this list corresponds to the run initiated when you clicked on the **Run** button in step 3 before. 

2. The run list also displays the top metrics, a set of default graphs, and a list of metrics for each run. You can customize this view by sorting, filtering, and adjusting the configurations.

3. Click on a completed run and you can see a detailed view for that specific execution, including additional metrics, the files it produced, and other potentially useful logs.

4. In the **Output Files** section, expand the `outputs` folder, and select the `model.pkl` file. Click the **Download** button and select the project root folder to download the `model.pkl` file. This file is a serialized instance of the model you created above which you want to publish as a web service. 

## Create web service schema and scoring file
You now generate the script required to deploy the model as a web service.

1. Choose the `local` environment and the `iris_score.py` script in the command bar, then click the **Run** button. This script creates a JSON file in the `outputs` folder, which captures the input data schema required by the model.

2. Go to the run detail page of the `iris_score.py` run, and download the created `service_schema.json` file from the **Output Files** section to the project root folder.

## Deploy the web service
>[!IMPORTANT]
>You must have Docker engine installed and running in order to deploy the web service locally.  See the [Docker installation instructions](https://docs.docker.com/engine/installation/) and the tips in the [Provisioning and Installation Guide](./quick-start-installation.md). 

>[!IMPORTANT]
>You must also have created a Model Management account in Azure in order to deploy a web service. See the [Provision and install Azure Machine Learning preview features](quick-start-installation.md) Quickstart for details.

Web services are currently created and deployed from the CLI, so now open the command-line window to create and test the web service.

1. In the top menu of the Workbench, click **File** --> **Open Command-line Interface**.

2. When the command window opens, type the following command to log in to Azure first.
   >[!TIP]
   >You only need to do this once until the cached authentication token expires.

   ```shell
   az login
   ```
   
   If you have access to multiple Azure subscriptions, you need make sure the one you are using for Azure ML is the current subscription. You use the following commands to verify or find the subscription and set it to current.

   ```shell
   # show all subscriptions and their IDs
   az account list -o table

   # set a subscription as the current subscription
   az account set -s <subscriptionId>

   # verify the current subscription
   az account show
   ```

   >[!TIP]
   >You can also check to see if you have a valid az-cli token by using `az account get-access-token` command.

3. Now you are ready to deploy the model as a web service. Type the following command:

   ```shell
   az ml service create realtime --model-file model.pkl -f score.py -n irisapp -s service_schema.json -r python
   ```

   The command creates a Docker image in the cloud, which hosts a web service for the model. This Docker container is then pulled down and deployed on your local computer where you can easily test it. 

## Test the web service
The Docker container is now running on your local computer. You can invoke the web service and see the result.  While you could use curl or any other HTTP tool, there is a CLI command that makes it easy to test the web service. 

```shell
az ml service run realtime -i irisapp -d "{\"input_df\": [{\"petal width\": 0.25, \"sepal length\": 3.0, \"sepal width\": 3.6, \"petal length\": 1.3}]} 
```

Check out the output here. Based on the input petal width, petal length, sepal width, and sepal length, the result predict that the iris is probably a versicolor iris.

You have now used the Azure Machine Learning preview features using the Iris flower dataset to build a model to predict the type of iris based on some of its physical characteristics.  You have used the logic regression algorithm from the popular Python scikit-learn library to build the model. 

## Next steps
For a more in-depth view of the same data set, follow the full-length Classifying Iris Tutorial. 

> [!div class="nextstepaction"]
> [Classifying Iris tutorial](tutorial-classifying-iris-part-1.md).
