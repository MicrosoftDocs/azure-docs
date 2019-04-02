---
title: Create and manage experiments in Portal
titleSuffix: Azure Machine Learning service
description: Learn how to create and manage experiments in portal
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

# Create and manage Azure Machine Learning experiments in the Azure Portal

In this article you learn how to create, run and manage automated machine learning experiments in the Azure portal.

## Prerequisites

[!INCLUDE [aml-prereq](../../../includes/aml-prereq.md)]

< workspace and azure subscription >

## Getting Started

Left pane Automated Machine Learning under Application

< image of Application pane with Automated Machine Learning button >

You'll see the following if this is your first time doing any experiments with Azure Machine Learning.

< insert screen shot of Getting Started experience for first time experiments >

Otherwise you will see your workspace dashboard

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
    Min node| Enter the minimum number of nodes for your compute. The minimum number of nodes for AML compute is 0. To enable data profiling you must have 1 or more nodes.
    Max node| Enter the maximum number of nodes for your compute. The default is 6 nodes for an AML Compute
    Virtual machine size| Select the virtual machine size for your compute

     < screenshot of Create a New Compute screen >

      To start the creation of your new compute, select **Create**. This can take  few moments.

      NOTE/Important to know: your compute name will indicate if the compute you select/create is *profiliing enabled*

1. Select a storage account for your data. Public preview only supports local file uploads and Azure Blob Storage accounts.
1. Select a storage container

1. Select a data file from your storage container or upload a file from your local computer to the container

1. Use the preview and profile tabs to further configure your data for this experiment

    1. On the Preview tab, indicate if your data includes headers and select the features (columns) for training using the **Included** switch buttons in each feature column.

        < screenshot of preview >

    1. On the Profile tab, you can view the profile of your data by feature, as well as the distribution, type, and summary statistics (mean, median, max/min, etc) of each. The following error message will appear if your compute context is **not** profiling enabled. *Data profiling is only available for compute targets that are already running*

        < screenshot of profile and summary stats table and circle switch buttons >

1. Select the training job type: classification, regression or forecasting

1. Select target column

1. Select the primary metric for scoring your model

< Indicate the number of iterations for your experiment. 25 is the maximum number of pipelines that the AutoML run will test. (Is this going to be part of the set up for public preview or is this moving somewhere else?) >

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