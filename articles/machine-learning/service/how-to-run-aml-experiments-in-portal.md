---
title: Create and explore experiments in Portal
titleSuffix: Azure Machine Learning service
description: Learn how to create and manage automated machine learning experiments in portal
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: Tzvi Keisar
author: Tzvi Keisar
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 3/29/2019

---

# Create and explore Automated Machine Learning experiments in the Azure Portal

In this article you learn how to create, run and explore automated machine learning experiments in the Azure portal. Automated machine learning automated the process of selecting the best algorithm to use for your specific data, so you can get from data to a machine learning model quickly and easily, and in Azure portal you will not need to write a single line of code. [Learn more about automated machine learning](https://docs.microsoft.com/en-us/azure/machine-learning/service/concept-automated-ml)

## Prerequisites

[!INCLUDE [aml-prereq](../../../includes/aml-prereq.md)]

< workspace and azure subscription >

## Getting Started

Left pane Automated Machine Learning under Application

< image of Application pane with Automated Machine Learning button >

You'll see the following if this is your first time doing any experiments with Automated Machine Learning.

< insert screen shot of Getting Started experience for first time experiments >

Otherwise you will see your Automated machine learning dashboard, with an overview of all your automated machine learning experiments and runs, and filter so you can explore your runs by date, experiment name, and run status.

< insert screen shot of workspace dashboard >

## Create an experiment

Use the Create Experiment button

< screenshot of Create a new automated machine learning experiment >

1. Enter your experiment name

1. Select a compute for the data profiling and training job. A list of your existing computes is available in the dropdown. To create a new compute, follow the instructions in step 3

1. Select the Create a new compute button to open the below pane and configure your compute context for this experiment

    Field|Description
    ---|---
    Compute name| Enter a unique name that identifies your compute context. 
    Virtual machine size| Select the virtual machine size for your compute.
    Additional settings| Min node: Enter the minimum number of nodes for your compute. The minimum number of nodes for AML compute is 0. To enable data profiling you must have 1 or more nodes.
    Max node: Enter the maximum number of nodes for your compute. The default is 6 nodes for an AML Compute

     < screenshot of Create a New Compute screen >

      To start the creation of your new compute, select **Create**. This can take  few moments.

      NOTE/Important to know: your compute name will indicate if the compute you select/create is *profiling enabled* (see 7b for more details on data profiling)

1. Select a storage account for your data. Public preview only supports local file uploads and Azure Blob Storage accounts.
1. Select a storage container

1. Select a data file from your storage container or upload a file from your local computer to the container

1. Use the preview and profile tabs to further configure your data for this experiment

    1. On the Preview tab, indicate if your data includes headers and select the features (columns) for training using the **Included** switch buttons in each feature column.

        < screenshot of preview >

    1. On the Profile tab, you can view the profile of your data by feature, as well as the distribution, type, and summary statistics (mean, median, max/min, etc) of each. The following error message will appear if your compute context is **not** profiling enabled. *Data profiling is only available for compute targets that are already running*

        < screenshot of profile and summary stats table and circle switch buttons >

1. Select the training job type: classification, regression or forecasting

1. Select target column. This is the column which you would like to do the predictions on. 

1. For forecasting:
    1. Select time column: This is the column with the time data to be used.
    1. Select forecast horizon: How many time units (minutes/hours/days/weeks/months/years, depends on the time unit of the data) will the model be able to predict to the future. The further the model is required to predict into the future, the less accurate it will become.[Learn more about forecasting and forecast horizon](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-auto-train-forecast#configure-experiment)
1. (optional) Advacned settings: additional settings you can use to better control the training job. 
    1. Select the primary metric for scoring your model. [Learn more about model metrics](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-configure-auto-train#explore-model-metrics)
    1. Select exit criteria for the training job. The exit criteria helps you control when to terminate a training job before it finishes, when certain criteria are met.
        1. Training job time (minutes): How many minutes to allow the training job to run. If the job will reach this number of minutes it will terminate the run.
        1. Max number of iterations: Maximum number of pipelines (iterations) to test in the training job. The job might end sooner if certain convergence criteria are met, however the job will not run more than the specified number of iterations.
        1. Metric score threshold: The training job will terminate if a pipeline with the specified metric score (or a better score) will be reached. This can ensure that if you have a defined target metric you want to reach, you do not spend more time on the training job than required.
    1. Preprocessing: select if to enable or disable the preprocessing done by automated machine learning. preprocessing includes automatic data cleansing, preparing, and tranformation to generate synthetic features. [Learn more about preprocessing](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-configure-auto-train#data-pre-processing-and-featurization)
    1. Validation: Select one of the cross validation options to use in the training job. [Learn more about cross validation](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-configure-auto-train#cross-validation-split-options)
    1. Concurrency: Select the multicore limits you would like to use when using multicore compute.
    1. Blocked algorithm: select algorithms you want to exclude from the training job.

NOTE:
for more information click the i icon/tool tip 

< screenshot of information icon tooltip >

## Run experiment

To run the experiment, click the Start button
    < screenshot button >

It goes through a preparing process which takes a couple minutes

## View results

Once that's done you'll see the run details screen. This will give you a full list of the models  created. By default, the model that scores the highest based on your parameters will be at the top of the list.

< screenshot of run and pipeline details >

You are able to drill down on any of the output models which opens the details of that model including performance and distribution charts and metrics.

< screenshot of highest scoring run and pipeline details screen>

training jobs can take a while for each pipeline to finish running

## Deploy model

directly deploy the model by clicking the button on the right

< steps to deploy the model screenshots >
1. Enter a deployment name
1. (optional) enter a description for the deployment
1. Scoring script and environment file are auto generated by default. You can override and provide your own files. 

deploying the model can take a while for each pipeline to finish running

## Miscellaneous  (maybe something like : Navigate your dashboard)

Do we need a section that: 

* walks users through the dashboard
    * filter by date, experiment/run status, and experiment names

* if you run an experiment via the SDK by python it will also showup in your dashboard

< what about functionality for how to add properties and tags filter/search/sort? >

< May need to create a matrix of what computes are supported via the UI. Databricks is not supported as a compute for either the SDk or portal >

## Next steps

* < what next steps should we link to here?>
 how to consume a deployed model: https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-consume-web-service
