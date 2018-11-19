--- 
title: Predictive maintenance for real-world scenarios | Microsoft Docs
description: Predictive maintenance for real-world scenarios by using PySpark
services: machine-learning 
author: ehrlinger
ms.author: jehrling
manager: jhubbard 
ms.reviewer: garyericson, jasonwhowell, mldocs 
ms.service: machine-learning
ms.component: core 
ms.workload: data-services 
ms.topic: article 
ms.custom: mvc 
ms.date: 10/05/2017 

ROBOTS: NOINDEX
---


# Predictive maintenance for real-world scenarios

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 



The impact of unscheduled equipment downtime can be detrimental for any business. It's critical to keep field equipment running to maximize utilization and performance, and to minimize costly, unscheduled downtime. Early identification of issues can help allocate limited maintenance resources in a cost-effective way and enhance quality and supply chain processes. 

This scenario explores a relatively [large-scale simulated data set](https://github.com/Microsoft/SQL-Server-R-Services-Samples/tree/master/PredictiveMaintanenceModelingGuide/Data) to walk through a predictive maintenance data science project from data ingestion, feature engineering, model building, and model operationalization and deployment. The code for the entire process is written in the Jupyter Notebook by using PySpark in Azure Machine Learning Workbench. The final model is deployed by using Azure Machine Learning Model Management to make real-time equipment failure predictions.   

### Cortana Intelligence Gallery GitHub repository

The Cortana Intelligence Gallery for the PM tutorial is a public GitHub repository ([https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance)) where you can report issues and make contributions.


## Use case overview

A major problem that's faced by businesses in asset-heavy industries is the significant costs that are associated with delays due to mechanical problems. Most businesses are interested in predicting when these problems might arise to proactively prevent them before they occur. The goal is to reduce the costs by reducing downtime and possibly increase safety. 

This scenario takes ideas from the [Predictive maintenance playbook](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/cortana-analytics-playbook-predictive-maintenance) to demonstrate how to build a predictive model for a simulated data set. The example data is derived from common elements that are observed in many predictive maintenance use cases.

The business problem for this simulated data is to predict issues that are caused by component failures. The business question is "*What's the probability that a machine goes down due to failure of a component?*" This problem is formatted as a multi-class classification problem (multiple components per machine). A machine learning algorithm is used to create the predictive model. The model is trained on historical data that's collected from machines. In this scenario, the user goes through various steps to implement the model in the Machine Learning Workbench environment.

## Prerequisites

* An [Azure account](https://azure.microsoft.com/free/) (free trials are available).
* An installed copy of [Azure Machine Learning Workbench](../service/overview-what-is-azure-ml.md). Follow the [Quickstart installation guide](quickstart-installation.md) to install the program and create a workspace.
* Azure Machine Learning Operationalization requires a local deployment environment and an [Azure Machine Learning Model Management account](model-management-overview.md).

This example runs on any Machine Learning Workbench compute context. However, it's recommended to run the example with at least 16 GB of memory. This scenario was built and tested on a Windows 10 machine running a remote DS4_V2 standard [Data Science Virtual Machine (DSVM) for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu).

Model operationalization was done by using version 0.1.0a22 of the Azure Machine Learning CLI.

## Create a new Workbench project

Create a new project by using this example as a template:
1.	Open Machine Learning Workbench.
2.	On the **Projects** page, select **+**, and then select **New Project**.
3.	In the **Create New Project** pane, fill in the information for your new project.
4.	In the **Search Project Templates** search box, type "Predictive Maintenance" and select the **Predictive Maintenance** template.
5.	Select **Create**.

## Prepare the notebook server computation target

To run on your local machine, from the Machine Learning Workbench **File** menu, select either **Open Command Prompt** or **Open PowerShell CLI**. The CLI interface allows you to access your Azure services by using the `az` commands. First, log in to your Azure account with the command:

```
az login
``` 

This command provides an authentication key to use with the https:\\aka.ms\devicelogin URL. The CLI waits until the device login operation returns and provides some connection information. Next, if you have a local [Docker](https://www.docker.com/get-docker) installation, prepare the local compute environment with the command:

```
az ml experiment prepare --target docker --run-configuration docker
```

It's preferable to run on a [DSVM for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu) for memory and disk requirements. After the DSVM is configured, prepare the remote Docker environment with the following two commands:

```
az ml computetarget attach remotedocker --name [Connection_Name] --address [VM_IP_Address] --username [VM_Username] --password [VM_UserPassword]
```

After you're connected to the remote Docker container, prepare the DSVM Docker compute environment with the command: 

```
az ml experiment prepare --target [Connection_Name] --run-configuration [Connection_Name]
```

With the Docker compute environment prepared, open the Jupyter notebook server from the Azure Machine Learning Workbench **Notebooks** tab, or start a browser-based server with the command: 

```
az ml notebook start
```

The example notebooks are stored in the Code directory. The notebooks are set up to run sequentially, starting on the first (Code\1_data_ingestion.ipynb) notebook. When you open each notebook, you're prompted to select the compute kernel. Choose the [Project_Name]_Template [Connection_Name] kernel to execute on the previously configured DSVM.

## Data description

The [simulated data](https://github.com/Microsoft/SQL-Server-R-Services-Samples/tree/master/PredictiveMaintanenceModelingGuide/Data) consists of five comma-separated values (.csv) files. Use the following links to get detailed descriptions about the data sets.

* [Machines](https://pdmmodelingguide.blob.core.windows.net/pdmdata/machines.csv): Features that differentiate each machine, such as age and model.
* [Error](https://pdmmodelingguide.blob.core.windows.net/pdmdata/errors.csv): The error log contains non-breaking errors that are thrown while the machine is still operational. These errors are not considered failures, though they can be predictive of a future failure event. The date-time values for the errors are rounded to the closest hour since the telemetry data is collected at an hourly rate.
* [Maintenance](https://pdmmodelingguide.blob.core.windows.net/pdmdata/maint.csv): The maintenance log contains both scheduled and unscheduled maintenance records. Scheduled maintenance corresponds with the regular inspection of components. Unscheduled maintenance can arise from mechanical failure or other performance degradation. The date-time values for maintenance are rounded to the closest hour since the telemetry data is collected at an hourly rate.
* [Telemetry](https://pdmmodelingguide.blob.core.windows.net/pdmdata/telemetry.csv): The telemetry data consists of time series measurements from multiple sensors within each machine. The data is logged by averaging sensor values over each one hour interval.
* [Failures](https://pdmmodelingguide.blob.core.windows.net/pdmdata/failures.csv): Failures correspond to component replacements within the maintenance log. Each record contains the Machine ID, component type, and replacement date and time. These records are used to create the machine learning labels that the model is trying to predict.

To download the raw data sets from the GitHub repository, and create the PySpark data sets for this analysis, see the [Data Ingestion](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/1_data_ingestion.ipynb) Jupyter Notebook scenario in the Code folder.

## Scenario structure
The content for the scenario is available at the [GitHub repository](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance). 

The [Readme](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/README.md) file outlines the workflow from preparing the data, building a model, and then deploying a solution for production. Each step of the workflow is encapsulated in a Jupyter notebook in the [Code](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/tree/master/Code) folder within the repository.   

[Code\1_data_ingestion.ipynb](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/1_data_ingestion.ipynb): This notebook downloads the five input .csv files, and does some preliminary data cleanup and visualization. The notebook converts each data set to PySpark format and stores it in an Azure blob container for use in the Feature Engineering Notebook.

[Code\2_feature_engineering.ipynb](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/2_feature_engineering.ipynb): 
The model features are constructed from the raw data set from Azure Blob storage by using a standard time series approach for telemetry, errors, and maintenance data. The failure-related component replacements are used to construct the model labels that describe which component failed. The labeled feature data is saved in an Azure blob for the Model Building Notebook.

[Code\3_model_building.ipynb](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/3_model_building.ipynb): The Model Building Notebook uses the labeled feature data set and splits the data into train and dev data sets along the date-time stamp. The notebook is set up as an experiment with pyspark.ml.classification models. The training data is vectorized. The user can experiment with either a **DecisionTreeClassifier** or **RandomForestClassifier** to manipulate hyperparameters to find the best performing model. Performance is determined by evaluating measurement statistics on the dev data set. These statistics are logged back in to the Machine Learning Workbench runtime screen for tracking. At each run, the notebook saves the resulting model to the local disk that's running the Jupyter notebook kernel. 

[Code\4_operationalization.ipynb](https://github.com/Azure/MachineLearningSamples-PredictiveMaintenance/blob/master/Code/4_operationalization.ipynb): This notebook uses the last model that's saved to the local (Jupyter notebook kernel) disk to build the components for deploying the model into an Azure web service. The full operational assets are compacted into the o16n.zip file that's stored in another Azure blob container. The zipped file contains:

* **service_schema.json**: The schema definition file for the deployment. 
* **pdmscore.py**: The **init()** and **run()** functions that are required by the Azure web service.
* **pdmrfull.model**: The model definition directory.
    
The notebook tests the functions with the model definition before packaging the operationalization assets for deployment. Instructions for deployment are included at the end of the notebook.

## Conclusion

This scenario gives an overview of building an end-to-end predictive maintenance solution by using PySpark within the Jupyter Notebook environment in Machine Learning Workbench. This example scenario also details model deployment through the Machine Learning Model Management environment to make real-time equipment failure predictions.

## References

The following references provide examples of other predictive maintenance use cases for various platforms:

* [Predictive Maintenance Solution Template](https://docs.microsoft.com/azure/machine-learning/cortana-analytics-playbook-predictive-maintenance)
* [Predictive Maintenance Modeling Guide](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Modelling-Guide-1)
* [Predictive Maintenance Modeling Guide using SQL R Services](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-Modeling-Guide-using-SQL-R-Services-1)
* [Predictive Maintenance Modeling Guide Python Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-Modelling-Guide-Python-Notebook-1)
* [Predictive Maintenance using PySpark](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-using-PySpark)
* [Deep learning for predictive maintenance](https://docs.microsoft.com/azure/machine-learning/desktop-workbench/scenario-deep-learning-for-predictive-maintenance)

## Next steps

Other example scenarios are available in Machine Learning Workbench that demonstrate additional features of the product. 
