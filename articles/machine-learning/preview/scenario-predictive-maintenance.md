--- 
title: 'Predictive Maintenance Real World Scenario| Microsoft Docs' 
description: Predictive Maintenance Real World Scenario using PySpark 
services: machine-learning 
author: jaymathe
ms.author: jaymathe
manager: jhubbard 
ms.reviewer: garyericson, jasonwhowell, mldocs 
ms.service: machine-learning 
ms.workload: data-services 
ms.topic: article 
ms.custom: mvc 
ms.date: 09/25/2017 
--- 

# Predictive maintenance real world scenario

## Link of the gallery GitHub repository

Following is the link to the public GitHub repository: 
[https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance)

## Introduction

The impact of unscheduled equipment downtime can be detrimental for any business. It is critical to therefore keep field equipment running in order to maximize utilization and performance and by minimizing costly, unscheduled downtime. Early identification of issues can help allocate limited maintenance resources in a cost-effective way and enhance quality and supply chain processes. 

For this scenario, we use a relatively [large-scale data](https://github.com/Microsoft/SQL-Server-R-Services-Samples/tree/master/PredictiveMaintanenceModelingGuide/Data) to walk the user through the main steps from data ingestion, feature engineering, model building, and then finally model operationalization and deployment. The code for the entire process is written in PySpark and implemented using Jupyter notebooks within Azure ML Workbench. The best model is finally operationalized using Azure Machine Learning Model Management for use in a production environment for making realtime failure predictions.   


## Use case overview

A major problem faced by businesses in asset-heavy industries is the significant costs that are associated with delays to mechanical problems. Most businesses are interested in predicting when these problems arise in order to proactively prevent them before they occur. This reduces the costs by reducing downtime and, in some cases, increasing safety. Refer to the [playbook for predictive maintenance](https://docs.microsoft.com/en-us/azure/machine-learning/cortana-analytics-playbook-predictive-maintenance) for a detailed explanation of common use cases and the modeling approach for predictive maintenance.

This scenario leverages the ideas from the playbook with the aim of providing the steps to implement a predictive model for a scenario, which is based on a synthesis of multiple real-world business problems. This example brings together common data elements observed among many predictive maintenance use cases.

The business problem for this simulated data is to predict issues caused by component failures. The business question therefore is “*What is the probability that a machine goes down due to failure of a component*?” This problem is formatted as a multiclass classification problem (multiple components per machine) and a machine learning algorithm is used to create the predictive model. The model is trained on historical data collected from machines. In this tutorial, the user goes through the various steps of implementing such a model within the Azure Machine Learning Workbench environment.

## Prerequisites

* An [Azure account](https://azure.microsoft.com/en-us/free/) (free trials are available).
* An installed copy of [Azure Machine Learning Workbench](./overview-what-is-azure-ml) following the [quick start installation guide](./quick-start-installation) to install the program and create a workspace.
* Intermediate results for use across Jupyter notebooks in this tutorial is stored in an Azure Blob Storage container. Instructions for setting up an Azure Storage account are available at this [link](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-python-how-to-use-blob-storage). 
* For [operationalization](https://github.com/Azure/Machine-Learning-Operationalization) of the model, it is best if the user runs a [Docker engine](https://www.docker.com/) installed and running locally. If not, you can use the cluster option but be aware that running an [Azure Container Service (ACS)](https://azure.microsoft.com/en-us/services/container-service/) can often be expensive.
* This tutorial assumes that the user is running Azure ML Workbench on a Windows 10 machine with Docker engine locally installed. 
* The tutorial was built and tested on a Windows 10 machine with the following specification: Intel Core i7-4600U CPU @ 2.10 GHz, 8-GB RAM, 64-bit OS, x64-based processor with Docker Version 17.06.0-ce-win19 (12801). 
* Model operationalization was done using this version of Azure ML CLI: azure-cli-ml==0.1.0a22

## Data description

The [simulated data](https://github.com/Microsoft/SQL-Server-R-Services-Samples/tree/master/PredictiveMaintanenceModelingGuide/Data) consists of five comma-separated values (.csv) files. 

* [Machines](https://pdmmodelingguide.blob.core.windows.net/pdmdata/machines.csv): Features differentiating each machine. For example, age and model.
* [Error](https://pdmmodelingguide.blob.core.windows.net/pdmdata/errors.csv): The error log contains non-breaking errors thrown while the machine is still operational. These errors are not considered as failures, though they may be predictive of a future failure event. The error date-time are rounded to the closest hour since the telemetry data is collected at an hourly rate.
* [Maintenance](https://pdmmodelingguide.blob.core.windows.net/pdmdata/maint.csv): The maintenance log contains both scheduled and unscheduled maintenance records. Scheduled maintenance corresponds with regular inspection of components, unscheduled maintenance may arise from mechanical failure or other performance degradation. The maintenance date-time are rounded to the closest hour since the telemetry data is collected at an hourly rate.
* [Telemetry](https://pdmmodelingguide.blob.core.windows.net/pdmdata/telemetry.csv): The telemetry time-series data consists of voltage, rotation, pressure, and vibration sensor measurements collected from each machine in real time. The data is averaged over an hour and stored in the telemetry logs
* [Failures](https://pdmmodelingguide.blob.core.windows.net/pdmdata/failures.csv): Failures correspond to component replacements within the maintenance log. Each record contains the Machine ID, component type, and replacement date and time. These records are used to create the machine learning labels that the model is trying to predict.

See the [Data Ingestion](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/data_ingestion.ipynb) Jupyter Notebook tutorial in Code section to download the raw data sets from the GitHub repository and create the PySpark data sets for this analysis.

## Scenario structure
The content for the tutorial is available at the [GitHub repository](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance). 

In the repository, there is a [Readme](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/README.md) file, which outlines the processes from preparing the data until building a few models and then finally operationalizing one of the best models. The four Jupyter notebooks are available in the [Code](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/tree/master/Code) folder within the repository.   

Next we describe the step-by-step tutorial workflow. The end to end tutorial is written in PySpark and is split into four notebooks as outlined below:

* [Data Ingestion](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/data_ingestion.ipynb): This notebook handles the data ingestion of the five input .csv files, does some preliminary cleanup, creates some summary graphics to verify the data download, and finally stores the resulting data sets in an Azure blob container for use in the next notebook.

* [Feature Engineering](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/feature_engineering.ipynb): Using the cleaned dataset from the previous step, lag features are created for the telemetry sensors, along with additional feature engineering to create variables like days since last replacement. Finally, the failures are tagged to the relevant records to create a final dataset, which is saved in an Azure blob for the next step. 

* [Model Building](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/model_building.ipynb): The final feature engineered dataset is then split into two namely a train and a test dataset based on a date-time stamp. Then two models namely a Random Forest Classifier and Decision Tree Classifier are built on the training dataset and then scored on the test dataset. 

* [Model operationalization & Deployment](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/operationalization.ipynb): The best model built in the previous step is then saved as a .model file along with the relevant .json scheme file for deployment. The init() and run() functions are first tested locally before operationalizing the model using Azure Machine Learning Model Management environment for use in a production environment for making realtime failure predictions.  

## Conclusion

This tutorial gives the reader an overview of how to build an end to end predictive maintenance solution using PySpark within the Jupyter notebook environment in Azure ML Workbench. The tutorial also guides the reader on how the best model can be easily operationalized and deployed using Azure Machine Learning Model Management environment for use in a production environment for making realtime failure predictions. Then the reader can edit relevant parts of the tutorial to taper it to their business needs.  

## References

This use case has been previously developed on multiple platforms as listed below:

* [Predictive Maintenance Solution Template](https://docs.microsoft.com/en-us/azure/machine-learning/cortana-analytics-playbook-predictive-maintenance)
* [Predictive Maintenance Modeling Guide](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Modelling-Guide-1)
* [Predictive Maintenance Modeling Guide using SQL R Services](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-Modeling-Guide-using-SQL-R-Services-1)
* [Predictive Maintenance Modeling Guide Python Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-Modelling-Guide-Python-Notebook-1)
* [Predictive Maintenance using PySpark](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-using-PySpark)


