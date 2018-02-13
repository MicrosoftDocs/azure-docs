---
title: Deep learning for predictive maintenance real-world scenarios - Azure | Microsoft Docs
description: Learn how to replicate the tutorial on deep learning for predictive maintenance with Azure Machine Learning Workbench.
services: machine-learning
author: FrancescaLazzeri
ms.author: Lazzeri
manager: ireiter
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article
ms.date: 11/22/2017

---
# Deep learning for predictive maintenance real-world scenarios

Deep learning is one of the most popular trends in machine learning. Deep learning is used in many fields and applications, including driverless cars, speech and image recognition, robotics, and finance. Deep learning is a set of algorithms that is inspired by the shape of the brain (biological neural networks), and machine learning. Cognitive scientists usually refer to deep learning as artificial neural networks (ANNs).

Predictive maintenance is also popular. In predictive maintenance, many different techniques are designed to help determine the condition of equipment, and to predict when maintenance should be performed. Some common uses of predictive maintenance are failure prediction, failure diagnosis (root-cause analysis), failure detection, failure type classification, and recommendation of mitigation or maintenance actions after failure.

In predictive maintenance scenarios, data is collected over time to monitor the state of equipment. The goal is to find patterns that can help predict and ultimately prevent failures. Using [Long Short Term Memory (LSTM)](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) networks is a deep learning method that is especially appealing in predictive maintenance. LSTM networks are good at learning from sequences. Time series data can be used to look back at longer periods of time to detect failure patterns.

In this tutorial, we build an LSTM network for the data set and scenario that are described at [Predictive Maintenance](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Template-3). We use the network to predict the remaining useful life of aircraft engines. The template uses simulated aircraft sensor values to predict when an aircraft engine will fail in the future. Using this prediction, maintenance can be planned in advance, to prevent failure.

This tutorial uses the [Keras](https://keras.io/) deep learning library, and the Microsoft Cognitive Toolkit [CNTK](https://docs.microsoft.com/cognitive-toolkit/Using-CNTK-with-Keras) as a back end.

The public GitHub repository that has the samples for this tutorial is at [https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance](https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance).

## Use case overview

This tutorial uses the example of simulated aircraft engine run-to-failure events to demonstrate the predictive maintenance modeling process. 

The implicit assumption of the modeling data described here is that the asset has a progressing degradation pattern. The pattern is reflected in the asset's sensor measurements. By examining the asset's sensor values over time, the machine learning algorithm can learn the relationship between the sensor values, changes in sensor values, and historical failures. This relationship is used to predict failures in the future. 

We suggest that you examine the data format and complete all three steps of the template before you replace the sample data with your own date.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) (free trials are available).
- Azure Machine Learning Workbench, with a workspace created.
- For model operationalization: Azure Machine Learning Operationalization, with a local deployment environment set up, and an [Azure Machine Learning Model Management account](model-management-overview.md).

## Create a new Workbench project

Create a new project by using this example as a template:

1. Open Machine Learning Workbench.
2. On the **Projects** page, select **+**, and then select **New Project**.
3. In the **Create New Project** pane, enter the information for your new project.
4. In the **Search Project Templates** search box, enter **Predictive Maintenance**, and then select the template.
5. Select **Create**.

## Prepare the notebook server computation target

On your local computer, on the Machine Learning Workbench **File** menu, select either **Open Command Prompt** or **Open PowerShell**. In the command prompt window of the option that you choose, execute the following commands:

`az ml experiment prepare --target docker --run-configuration docker`

We suggest running the notebook server on a  DS4_V2 standard [Data Science Virtual Machine (DSVM) for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu). After the DSVM is configured, run the following commands to prepare the Docker images:

`az ml computetarget attach remotedocker --name [connection_name] --address [VM_IP_address] --username [VM_username] --password [VM_password]`

`az ml experiment prepare --target [connection_name] --run-configuration [connection_name]`

With the Docker images prepared, open the Jupyter notebook server. To open the Jupyter notebook server, either go to the Machine Learning Workbench **Notebooks** tab, or start a browser-based server:
`az ml notebook start`

Notebooks are stored in the Code directory in the Jupyter environment. Run these notebooks sequentially as numbered, starting with Code\1_data_ingestion_and_preparation.ipynb.

Select the kernel to match your [project_name]_Template [connection_name], and then select **Set Kernel**.

## Data description

The template uses three data sets as inputs, in the files PM_train.txt, PM_test.txt, and PM_truth.txt.

-  **Train data**: The aircraft engine run-to-failure data. The train data (PM_train.txt) consists of multiple, multivariate time series, with *cycle* as the time unit. It includes 21 sensor readings for each cycle. 

    Each time series can be assumed to be generated from a different engine of the same type. Each engine is assumed to start with different degrees of initial wear and manufacturing variation. This information is unknown to the user. 

    In this simulated data, the engine is assumed to be operating normally at the start of each time series. It starts to degrade at some point during the series of the operating cycles. The degradation progresses and grows in magnitude. 

    When a predefined threshold is reached, the engine is considered unsafe for further operation. The last cycle in each time series can be considered the failure point of the corresponding engine.

-   **Test data**: The aircraft engine operating data, without failure events recorded. The test data (PM_test.txt) has the same data schema as the training data. The only difference is that the data does not indicate when the failure occurs (the last time period does *not* represent the failure point). It is not known how many more cycles this engine can last before it fails.

- **Truth data**: The information of true remaining cycles for each engine in the testing data. The ground truth data provides the number of remaining working cycles for the engines in the testing data.

## Scenario structure

The content for the scenario is available in the [GitHub repository] (https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance). 

In the repository, a [readme] (https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance/blob/master/README.md) file outlines the processes, from preparing the data, to building and operationalizing the model. The three Jupyter notebooks are available in the [Code] (https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance/tree/master/Code) folder in the repository. 

Next, we describe the step-by-step scenario workflow.

### Task 1: Data ingestion and preparation

The Data Ingestion Jupyter Notebook in Code/1_data_ingestion_and_preparation.ipnyb loads the three input data sets into Pandas dataframe format. Then, it prepares the data for modeling, and does some preliminary data visualization. The data is then transformed into PySpark format and stored in an Azure Blob storage container in your Azure subscription for use in the next modeling task.

### Task 2: Model building and evaluation

The Model Building Jupyter Notebook in Code/2_model_building_and_evaluation.ipnyb reads the PySpark train and test data sets from Blob storage. Then, an LSTM network is built with the training data sets. The model performance is measured on the test set. The resulting model is serialized and stored in the local compute context for use in the operationalization task.

### Task 3: Operationalization

The operationalization Jupyter Notebook in Code/3_operationalization.ipnyb uses the stored model to build functions and schema that are required for calling the model on an Azure-hosted web service. The notebook tests the functions, and then zips (compresses) the operationalization assets into a .zip file.

The zipped file contains these files:

- **modellstm.json**: The schema definition file for deployment. 
- **lstmscore.py**: The **init()** and **run()** functions, which are required by the Azure web service.
- **lstm.model**: The model definition directory.

The notebook tests the functions by using the model definition before it packages the operationalization assets for deployment. Instructions for deployment are included at the end of the notebook.


## Conclusion

This tutorial uses a simple scenario in which only one data source (sensor values) is used to make predictions. In more advanced predictive maintenance scenarios, like the [Predictive Maintenance Modeling Guide R Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-Modelling-Guide-R-Notebook-1), many data sources might be used. Other data sources might include historical maintenance records, error logs, and machine and operator features. Additional data sources might require different types of treatments to be used in deep learning networks. It's also important to tune the models for the right parameters, like for window size. 

You can edit relevant parts of this scenario, and try different problem scenarios, such as the ones described in the [Predictive Maintenance Modeling Guide](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Modelling-Guide-1), which involves multiple other data sources.


## References

- [Predictive Maintenance Solution Template](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/cortana-analytics-playbook-predictive-maintenance)
- [Predictive Maintenance Modeling Guide](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Modelling-Guide-1)
- [Predictive Maintenance Modeling Guide Python Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-Modelling-Guide-Python-Notebook-1)
- [Predictive Maintenance using PySpark](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-using-PySpark)

