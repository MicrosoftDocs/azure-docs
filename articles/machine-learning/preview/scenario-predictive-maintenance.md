--- 
title: 'Predictive Maintenance Real World Scenario| Microsoft Docs' 
description: Predictive Maintenance Real World Scenario using PySpark 
services: machine-learning 
author: jehrling
ms.author: jaymathe, jehrling
manager: jhubbard 
ms.reviewer: garyericson, jasonwhowell, mldocs 
ms.service: machine-learning 
ms.workload: data-services 
ms.topic: article 
ms.custom: mvc 
ms.date: 09/25/2017 
--- 

# Predictive Maintenance Real World Scenario

The impact of unscheduled equipment downtime can be detrimental for any business. It is critical to therefore keep field equipment running in order to maximize utilization and performance and by minimizing costly, unscheduled downtime. Early identification of issues can help allocate limited maintenance resources in a cost-effective way and enhance quality and supply chain processes. 

For this scenario, we use a relatively [large-scale data](https://github.com/Microsoft/SQL-Server-R-Services-Samples/tree/master/PredictiveMaintanenceModelingGuide/Data) to walk the user through the main steps from data ingestion, feature engineering, model building, and then finally model operationalization and deployment. The code for the entire process is written in PySpark and implemented using Jupyter notebooks within Azure ML Workbench. The best model is finally operationalized using Azure Machine Learning Model Management for use in a production environment for making realtime failure predictions.   

## Link to the Gallery GitHub repository

Following is the link to the public GitHub repository: 
[https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance)


## Use case overview

A major problem faced by businesses in asset-heavy industries is the significant costs that are associated with delays to mechanical problems. Most businesses are interested in predicting when these problems arise in order to proactively prevent them before they occur. The goal is to reduce the costs by reducing downtime and possibly increase safety. Refer to the [playbook for predictive maintenance](https://docs.microsoft.com/en-us/azure/machine-learning/cortana-analytics-playbook-predictive-maintenance) for a detailed explanation of common use cases as well as the modeling approach used for predictive maintenance.

This scenario leverages the ideas from the playbook with the aim of providing the steps to implement a predictive model for a scenario, which is based on a synthesis of multiple real-world business problems. This example brings together common data elements observed among many predictive maintenance use cases.

The business problem for this simulated data is to predict issues caused by component failures. The business question therefore is “*What is the probability that a machine goes down due to failure of a component*?” This problem is formatted as a multiclass classification problem (multiple components per machine) and a machine learning algorithm is used to create the predictive model. The model is trained on historical data collected from machines. In this scenario, the user goes through the various steps of implementing such a model within the Azure Machine Learning Workbench environment.

## Prerequisites

* An [Azure account](https://azure.microsoft.com/en-us/free/) (free trials are available).
* An installed copy of [Azure Machine Learning Workbench](./overview-what-is-azure-ml.md) following the [quick start installation guide](./quickstart-installation.md) to install the program and create a workspace.
* Azure Machine Learning Operationalization requires a local deployment environment and a [model management account](https://docs.microsoft.com/en-us/azure/machine-learning/preview/model-management-overview)

This example can be run on any AML Workbench compute context. However, it is recommended to run it with at least of 16-GB memory. This scenario was built and tested on a Windows 10 machine running a remote DS4_V2 standard [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu).

Model operationalization was done using version 0.1.0a22 of Azure ML CLI.

## Create a new Workbench project

Create a new project using this example as a template:
1.	Open Azure Machine Learning Workbench
2.	On the **Projects** page, click the **+** sign and select **New Project**
3.	In the **Create New Project** pane, fill in the information for your new project
4.	In the **Search Project Templates** search box, type "Predictive Maintenance" and select the template
5.	Click **Create**

## Prepare the notebook server computation target

To run on your local machine, from the AML Workbench `File` menu, select either the `Open Command Prompt` or `Open PowerShell CLI`. Within the CLI windows execute the following commands:

`az ml experiment prepare --target docker --run-configuration docker`

We suggest running on a Data Science Virtual Machine for Linux (Ubuntu). Once the DSVM is configured, run the following two commands:

`az ml computetarget attach --name [Desired_Connection_Name] --address [VM_IP_Address] --username [VM_Username] --password [VM_UserPassword] --type remotedocker`

`az ml experiment prepare --target [Desired_Connection_Name] --run-configuration [Desired_Connection_Name]`

With the docker images prepared, open the Jupyter notebook server either within the AML Workbench notebooks tab, or to start a browser-based server, run: `az ml notebook start`.

Notebooks are stored in the `Code` directory within the Jupyter environment. We run the notebooks sequentially, starting on the first (`Code\1_data_ingestion.ipynb`) notebook. When you open each notebook, you are prompted for to select the compute kernel. Choose [Project_Name]_Template [Desired_Connection_Name] and click Set Kernel.

## Data description

The [simulated data](https://github.com/Microsoft/SQL-Server-R-Services-Samples/tree/master/PredictiveMaintanenceModelingGuide/Data) consists of five comma-separated values (.csv) files. Follow the links to get more a more detailed description of the data sets.

* [Machines](https://pdmmodelingguide.blob.core.windows.net/pdmdata/machines.csv): Features differentiating each machine. For example, age and model.
* [Error](https://pdmmodelingguide.blob.core.windows.net/pdmdata/errors.csv): The error log contains non-breaking errors thrown while the machine is still operational. These errors are not considered as failures, though they may be predictive of a future failure event. The error date-time are rounded to the closest hour since the telemetry data is collected at an hourly rate.
* [Maintenance](https://pdmmodelingguide.blob.core.windows.net/pdmdata/maint.csv): The maintenance log contains both scheduled and unscheduled maintenance records. Scheduled maintenance corresponds with regular inspection of components, unscheduled maintenance may arise from mechanical failure or other performance degradation. The maintenance date-time are rounded to the closest hour since the telemetry data is collected at an hourly rate.
* [Telemetry](https://pdmmodelingguide.blob.core.windows.net/pdmdata/telemetry.csv): The telemetry time-series data consists of voltage, rotation, pressure, and vibration sensor measurements collected from each machine in real time. The data is averaged over an hour and stored in the telemetry logs
* [Failures](https://pdmmodelingguide.blob.core.windows.net/pdmdata/failures.csv): Failures correspond to component replacements within the maintenance log. Each record contains the Machine ID, component type, and replacement date and time. These records are used to create the machine learning labels that the model is trying to predict.

See the [Data Ingestion](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/1_data_ingestion.ipynb) Jupyter Notebook scenario in Code section to download the raw data sets from the GitHub repository and create the PySpark data sets for this analysis.

## Scenario structure
The content for the scenario is available at the [GitHub repository](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance). 

In the repository, there is a [Readme](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/README.md) file, which outlines the processes from preparing the data until building a few models and then finally operationalizing one of the best models. The four Jupyter notebooks are available in the [Code](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/tree/master/Code) folder within the repository.   

Next we describe the step-by-step scenario workflow. The end to end scenario is written in PySpark and is split into four notebooks:

[`Code\1_data_ingestion.ipynb`](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/1_data_ingestion.ipynb): This notebook downloads the five input .csv files, does some preliminary data cleanup and visualization. The notebook converts the data to PySpark format and stores the results in an Azure blob container for use in the feature engineering task.

[`Code\2_feature_engineering.ipynb`](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/2_feature_engineering.ipynb): Using the cleaned dataset from the previous step, lag and aggregated features are created for the telemetry sensors, and error counts, component replacements, machine information are joined to the telemetry data. The failure-related component replacements are used to construct the labels describing which component failed. The labeled feature data is saved in an Azure blob for the model building task.

[`Code\3_model_building.ipynb`](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/3_model_building.ipynb): Using the labeled feature dataset, the modeling notebook splits the data into train and dev datasets along the date-time stamp. The notebook is setup set experiment with `pyspark.ml.classification` models. The training data is vectorized, and the user can experiment with either a `DecisionTreeClassifier` or a `RandomForestClassifier`, manipulating hyperparameters to find the best performing model. Performance is determined by evaluating measure statistics on the dev dataset. These statistics are logged back in to the AML Workbench run time screen for tracking. At each run, the notebook saves the resulting model to the local disk running the Jupyter notebook kernel. 

[`Code\4_operationalization.ipynb`](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/4_operationalization.ipynb): Using the last model saved to local (Jupyter notebook kernel) disk, this notebook builds the components for operationalizing the model into an Azure web service. The full operational assets are compacted into the `o16n.zip` file stored in another Azure blob container. The zipped file contains:

* `service_schema.json` The schema definition file for deployment. 
* `pdmscore.py` The init() and run() functions required by the Azure web service
* `pdmrfull.model` The model definition directory.
    
 The notebook tests the functions with the model definition before packaging the operationalization assets for deployment. Instructions for deployment are included at the end of the notebook.

## Conclusion

This scenario gives the reader an overview of how to build an end to end predictive maintenance solution using PySpark within the Jupyter notebook environment in Azure ML Workbench. The scenario also guides the reader on how the best model can be easily operationalized and deployed using Azure Machine Learning Model Management environment for use in a production environment for making realtime failure predictions. Then the reader can edit relevant parts of the scenario to taper it to their business needs.  

## References

This use case has been previously developed on multiple platforms:

* [Predictive Maintenance Solution Template](https://docs.microsoft.com/en-us/azure/machine-learning/cortana-analytics-playbook-predictive-maintenance)
* [Predictive Maintenance Modeling Guide](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Modelling-Guide-1)
* [Predictive Maintenance Modeling Guide using SQL R Services](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-Modeling-Guide-using-SQL-R-Services-1)
* [Predictive Maintenance Modeling Guide Python Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-Modelling-Guide-Python-Notebook-1)
* [Predictive Maintenance using PySpark](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-using-PySpark)


