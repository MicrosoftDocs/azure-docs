---
title: Deep learning for predictive maintenance real-world scenarios - Azure | Microsoft Docs
description: Learn how to replicate the tutorial on deep learning for predictive maintenance with Azure Machine Learning Workbench.
services: machine-learning
author: ehrlinger
ms.author: jehrling
manager: ireiter
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.devlang: 
ms.topic: article
ms.date: 11/22/2017

ROBOTS: NOINDEX
---

# Deep learning for predictive maintenance real-world scenarios

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 



Deep learning is one of the most popular trends in machine learning and has applications to many areas, including:
- Driverless cars and robotics.
- Speech and image recognition.
- Financial forecasting.

Also known as deep neural networks (DNN), these methods are inspired by the individual neurons that are within the brain (biological neural networks).

The impact of unscheduled equipment downtime can be detrimental for any business. It's critical to keep field equipment running to maximize utilization and performance and minimize costly, unscheduled downtime. Early identification of issues can help allocate limited maintenance resources in a cost-effective way and enhance quality and supply chain processes. 

A predictive maintenance (PM) strategy uses machine learning methods to determine the condition of equipment to preemptively perform maintenance to avoid adverse machine performance. In PM, data is collected over time to monitor the state of the machine and then analyzed to find patterns to predict failures. [Long Short Term Memory (LSTM)](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) networks are attractive for this setting since they're designed to learn from sequences of data.

### Cortana Intelligence Gallery GitHub repository

The Cortana Intelligence Gallery for the PM tutorial is a public GitHub repository ([https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance](https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance)) where you can report issues and make contributions.


## Use case overview

This tutorial uses the example of simulated aircraft engine run-to-failure events to demonstrate the predictive maintenance modeling process. The scenario is described at [Predictive Maintenance](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Template-3).

The main assumption in this setting is the engine progressively degraded over its lifetime. The degradation can be detected in engine sensor measurements. PM tries to model the relationship between the changes in these sensor values and the historical failures. The model can then predict when and engine may fail in the future based on the current state of sensor measurements.

This scenario creates an LSTM network to predict the remaining useful life (RUL) of aircraft engines by using historical sensor values. The scenario uses the [Keras](https://keras.io/) library with the [Tensorflow](https://www.tensorflow.org/) deep learning framework as a compute engine. The scenario trains the LSTM with one set of engines and tests the network on an unseen engine set.

## Prerequisites
- An [Azure account](https://azure.microsoft.com/free/) (free trials are available).
- Azure Machine Learning Workbench, with a workspace created.
- For model operationalization: Azure Machine Learning Operationalization with a local deployment environment set up, and an [Azure Machine Learning Model Management account](model-management-overview.md).

## Create a new Workbench project

Create a new project by using this example as a template:

1. Open Machine Learning Workbench.
2. On the **Projects** page, select **+**, and then select **New Project**.
3. In the **Create New Project** pane, enter the information for your new project.
4. In the **Search Project Templates** search box, type "Predictive Maintenance" and select the **Deep Learning for Predictive Maintenance Scenario** template.
5. Select **Create**.

## Prepare the notebook server computation target

To run on your local machine, from the Machine Learning Workbench **File** menu, select either **Open Command Prompt** or **Open PowerShell CLI**. The CLI interface allows you to access your Azure services by using the `az` commands. First, log in to your Azure account with the command:

```
az login
``` 

This command provides an authentication key to be used with the https:\\aka.ms\devicelogin URL. The CLI waits until the device login operation returns and provides some connection information. Next, if you have a local [Docker](https://www.docker.com/get-docker) installation, prepare the local compute environment with the command:

```
az ml experiment prepare --target docker --run-configuration docker
```

It's preferable to run on a [Data Science Virtual Machine (DSVM) for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu) for memory and disk requirements. After the DSVM is configured, prepare the remote Docker environment with the following two commands:

```
az ml computetarget attach remotedocker --name [Connection_Name] --address [VM_IP_Address] --username [VM_Username] --password [VM_UserPassword]
```

After you're connected to the remote Docker container, prepare the DSVM Docker compute environment with the command: 

```
az ml experiment prepare --target [Connection_Name] --run-configuration [Connection_Name]
```

With the Docker compute environment prepared, open the Jupyter notebook server from the Machine Learning Workbench **Notebooks** tab, or start a browser-based server with the command: 

```
az ml notebook start
```

The example notebooks are stored in the Code directory. The notebooks are set up to run sequentially, starting on the first (Code\1_data_ingestion.ipynb) notebook. When you open each notebook, you're prompted to select the compute kernel. Choose the [Project_Name]_Template [Connection_Name] kernel to execute on the previously configured DSVM.

## Data description

The template uses three data sets as inputs in the files PM_train.txt, PM_test.txt, and PM_truth.txt. 

- **Train data**: The aircraft engine run-to-failure data. The train data (PM_train.txt) consists of multiple, multivariate time series with *cycle* as the time unit. It includes 21 sensor readings for each cycle. 

    - Each time series is generated from a different engine of the same type. Each engine starts with different degrees of initial wear and some unique manufacturing variation. This information is unknown to the user. 

    - In this simulated data, the engine is assumed to be operating normally at the start of each time series. It starts to degrade at some point during the series of the operating cycles. The degradation progresses and grows in magnitude. 

    - When a predefined threshold is reached, the engine is considered unsafe for further operation. The last cycle of each time series is the failure point of that engine.

- **Test data**: The aircraft engine operating data, without failure events recorded. The test data (PM_test.txt) has the same data schema as the training data. The only difference is that the data does not indicate when the failure occurs (the last time period does *not* represent the failure point). It is not known how many more cycles this engine can last before it fails.

- **Truth data**: The information of true remaining cycles for each engine in the testing data. The ground truth data provides the number of remaining working cycles for the engines in the testing data.

## Scenario structure

The scenario workflow is divided into the three steps and each step is executed in a Jupyter notebook. Each notebook produces data artifacts that are persisted locally for use in the notebooks.

### Task 1: Data ingestion and preparation

The Data Ingestion Jupyter Notebook in Code/1_data_ingestion_and_preparation.ipnyb loads the three input data sets into the Pandas DataFrame format. The notebook then prepares the data for modeling and does some preliminary data visualization. The data sets are stored locally to the compute context for use in the Model Building Jupyter Notebook.

### Task 2: Model building and evaluation

The Model Building Jupyter Notebook in Code/2_model_building_and_evaluation.ipnyb reads the train and test data sets from disk and builds an LSTM network for the training data set. The model performance is measured on the test data set. The resulting model is serialized and stored in the local compute context for use in the operationalization task.

### Task 3: Operationalization

The Operationalization Jupyter Notebook in Code/3_operationalization.ipnyb uses the stored model to build functions and schema for calling the model on an Azure-hosted web service. The notebook tests the functions and then compresses the assets into the LSTM_o16n.zip file. The file is loaded on to your Azure storage container for deployment.

The LSTM_o16n.zip deployment file contains the following artifacts:

- **webservices_conda.yaml**: Defines the Python packages that are required to run the LSTM model on the deployment target.  
- **service_schema.json**: Defines the data schema that's expected by the LSTM model. 	
- **lstmscore.py**: Defines the functions that the deployment target is running to score new data.	  
- **modellstm.json**: Defines the LSTM architecture. The lstmscore.py functions read the architecture and weights to initialize the model.
- **modellstm.h5**: Defines the model weights.
- **test_service.py**: A test script that calls the deployment end point with test data records. 
- **PM_test_files.pkl**: The test_service.py script reads historical engine data from the PM_test_files.pkl file and sends the web service enough cycles for the LSTM to return a probability of engine failure.

The notebook tests the functions by using the model definition before it packages the operationalization assets for deployment. Instructions for setting up and testing the web service are included at the end of the Code/3_operationalization.ipnyb notebook.

## Conclusion

This tutorial provides a simple scenario that uses sensor values to make predictions. More advanced predictive maintenance scenarios like the [Predictive Maintenance Modeling Guide R Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-Modelling-Guide-R-Notebook-1) can use many data sources, such as historical maintenance records, error logs, and machine features. Additional data sources can require different treatments to use with deep learning.


## References

The following references provide examples of other predictive maintenance use cases for various platforms:

* [Predictive Maintenance Solution Template](https://docs.microsoft.com/azure/machine-learning/cortana-analytics-playbook-predictive-maintenance)
* [Predictive Maintenance Modeling Guide](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Modelling-Guide-1)
* [Predictive Maintenance Modeling Guide using SQL R Services](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-Modeling-Guide-using-SQL-R-Services-1)
* [Predictive Maintenance Modeling Guide Python Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-Modelling-Guide-Python-Notebook-1)
* [Predictive Maintenance using PySpark](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-using-PySpark)
* [Predictive maintenance real-world scenarios](https://docs.microsoft.com/azure/machine-learning/desktop-workbench/scenario-predictive-maintenance)

## Next steps

Other example scenarios are available in Machine Learning Workbench that demonstrate additional features of the product. 
