---
title: Deep Learning for Predictive Maintenance Real-World Scenario - Azure | Microsoft Docs
description: This document describes how to replicate the Deep Learning for Predictive Maintenance tutorial with Azure Machine Learning Workbench
services: machine-learning
author: FrancescaLazzeri
ms.author: Lazzeri
manager: ireiter
ms.reviewer: 
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article
ms.date: 11/22/2017

---
# Deep learning for predictive maintenance real-world scenario

Deep learning is one of the most popular trends in the machine learning space nowadays, and there are many fields and applications where it stands out, such as driverless cars, speech and image recognition, robotics and finance. Deep learning is a set of algorithms that is inspired by the shape of our brain (biological neural networks), and machine learning and cognitive scientists usually refer to it as Artificial Neural Networks (ANN).

Predictive maintenance is also a very popular area where many different techniques are designed to help determine the condition of equipment in order to predict when maintenance should be performed. Predictive maintenance encompasses a variety of topics, including but not limited to: failure prediction, failure diagnosis (root cause analysis), failure detection, failure type classification, and recommendation of mitigation or maintenance actions after failure.

In predictive maintenance scenarios, data is collected over time to monitor the state of equipment with the final goal of finding patterns to predict failures. Among the deep learning methods, [Long Short Term Memory (LSTM)](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) networks are especially appealing to the predictive maintenance domain due to the fact that they are very good at learning from sequences. This fact lends itself to their applications using time series data by making it possible to look back for longer periods of time to detect failure patterns.

In this tutorial, we build a LSTM network for the data set and scenario described at [Predictive Maintenance](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Template-3) to predict remaining useful life of aircraft engines. In summary, the template uses simulated aircraft sensor values to predict when an aircraft engine will fail in the future so that maintenance can be planned in advance.

This tutorial uses [keras](https://keras.io/) deep learning library with Microsoft Cognitive Toolkit [CNTK](https://docs.microsoft.com/en-us/cognitive-toolkit/Using-CNTK-with-Keras) as backend.

## Link to the gallery GitHub repository 

Following is the link to the public GitHub repository:
[https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance](https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance)

## Use case overview

This tutorial uses the example of simulated aircraft engine run-to-failure events to demonstrate the predictive maintenance modeling process. The implicit assumption of modeling data as done below is that the asset of interest has a progressing degradation pattern, which is reflected in the asset's sensor measurements. By examining the asset's sensor values over time, the machine learning algorithm can learn the relationship between the sensor values and changes in sensor values to the historical failures in order to predict failures in the future. We suggest examining the data format and going through all three steps of the template before replacing the data with your own.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) (free trials are available).
- An installed copy of Azure Machine Learning Workbench with a workspace created.
- For model operationalization: Azure Machine Learning Operationalization with a local deployment environment setup and a [model management account](https://docs.microsoft.com/en-us/azure/machine-learning/preview/model-management-overview)

## Create a new Workbench project

Create a new project using this example as a template:

1. Open Azure Machine Learning Workbench
2. On the Projects page, click the + sign and select New Project
3. In the Create New Project pane, fill in the information for your new project
4. In the Search Project Templates search box, type "Predictive Maintenance" and select the template
5. Click Create

## Prepare the notebook server computation target

To run on your local machine, from the AML Workbench `File` menu, select either the `Open Command Prompt` or `Open PowerShell` CLI. Within the CLI windows execute the following commands:

`az ml experiment prepare --target docker --run-configuration docker`

 We suggest running on a  DS4_V2 standard [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu). Once the DSVM is configured, you need to run the following two commands:

`az ml computetarget attach remotedocker --name [Desired_Connection_Name] --address [VM_IP_Address] --username [VM_Username] --password [VM_UserPassword]`

`az ml experiment prepare --target [Desired_Connection_Name] --run-configuration [Desired_Connection_Name]`

With the docker images _prepared_, open the jupyter notebook server either within the *AML Workbench* notebooks tab, or to start a browser-based server, run:
`az ml notebook start`

- Notebooks are stored in the `Code` directory found in the Jupyter environment. We run these notebooks sequentially as numbered, starting on (`Code\1_data_ingestionand_and_preparation.ipynb`).

- Select the kernel to match your [Project_Name]_Template [Desired_Connection_Name] and click Set Kernel

## Data description

The template takes three datasets as inputs: "PM_train.txt", "PM_test.txt", and "PM_truth.txt"
1. Train data: It is the aircraft engine run-to-failure data. The train data ("PM_train.txt") consists of multiple multivariate time series with "cycle" as the time unit, together with 21 sensor readings for each cycle. Each time series can be assumed as being generated from a different engine of the same type. Each engine is assumed to start with different degrees of initial wear and manufacturing variation, and this information is unknown to the user. In this simulated data, the engine is assumed to be operating normally at the start of each time series. It starts to degrade at some point during the series of the operating cycles. The degradation progresses and grows in magnitude. When a predefined threshold is reached, then the engine is considered unsafe for further operation. In other words, the last cycle in each time series can be considered as the failure point of the corresponding engine.

2. Test data: It is the aircraft engine operating data without failure events recorded. The test data ("PM_test.txt") has the same data schema as the training data. The only difference is that the data does not indicate when the failure occurs (in other words, the last time period does NOT represent the failure point). It is not Known how many more cycles this engine can last before it fails.

3. Truth data: It contains the information of true remaining cycles for each engine in the testing data. The ground truth data provides the number of remaining working cycles for the engines in the testing data.

## Scenario structure

The content for the scenario is available at the [GitHub repository] (https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance) 

In the repository, there is a [Readme] (https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance/blob/master/README.md) file, which outlines the processes from preparing the data until building and operationalizing the model. The three Jupyter notebooks are available in the [Code] (https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance/tree/master/Code) folder within the repository. 

Next we describe the step-by-step scenario workflow:

### Task 1: Data Ingestion & Preparation

The Data Ingestion Jupyter Notebook in the `Code/1_data_ingestion_and_preparation.ipnyb` loads the three input data sets into `Pandas` dataframe format, prepares the data for the modeling part and does some preliminary data visualization. The data is then transformed into `PySpark` format and stored in an Azure Blob storage container on your subscription for use in the next modeling task.

### Task 2: Model Building & Evaluation

The Model Building Jupyter Notebook in `Code/2_model_building_and_evaluation.ipnyb` that reads `PySpark` train and test data sets from blob storage. Then a LSTM network is built with the training data sets. The model performance is measured on the test set. The resulting model is serialized and stored in the local compute context for use in the operationalization task.

### Task 3: Operationalization

The operationalization Jupyter Notebook in `Code/3_operationalization.ipnyb` that takes the stored model and builds required functions and schema for calling the model on an Azure hosted web service. The notebook tests the functions, and zips the operationalization assets into a zip file that is also stored in your Azure Blob storage container.
The zipped file contains:

- `service_schema.json` The schema definition file for deployment. 
- `lstmscore.py` The init() and run() functions required by the Azure web service
- `lstmfull.model` The model definition directory.

The notebook tests the functions with the model definition before packaging the operationalization assets for deployment. Instructions for deployment are included at the end of the notebook.


## Conclusion

This tutorial serves as a guide for beginners looking to apply deep learning in predictive maintenance domain within the Jupyter notebook environment in *Azure Machine Learning Workbench*. This tutorial uses a simple scenario where only one data source (sensor values) is used to make predictions. In more advanced predictive maintenance scenarios such as in [Predictive Maintenance modeling Guide](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-modeling-Guide-R-Notebook-1), there are many other data sources (i.e. historical maintenance records, error logs, machine and operator features etc.) which may require different types of treatments to be used in the deep learning networks. Since predictive maintenance is not a typical domain for deep learning, its application is an open area of research.

## References

- [Predictive Maintenance Solution Template](https://docs.microsoft.com/en-us/azure/machine-learning/team-data-science-process/cortana-analytics-playbook-predictive-maintenance)
- [Predictive Maintenance Modeling Guide](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-modeling-Guide-1)
- [Predictive Maintenance Modeling Guide Python Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-modeling-Guide-Python-Notebook-1)
- [Predictive Maintenance using PySpark](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-using-PySpark)

## Future directions and improvements

This tutorial covers the basics of using deep learning in predictive maintenance; many predictive maintenance problems usually involve a variety of data sources that needs to be taken into account when applying deep learning in this domain. Additionally, it is important to tune the models for the right parameters such as window size. 
The reader can edit relevant parts of this scenario and try a different problem scenario, such as the ones described in the [Predictive Maintenance Modeling Guide](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-modeling-Guide-1) where multiple other data sources are involved.
