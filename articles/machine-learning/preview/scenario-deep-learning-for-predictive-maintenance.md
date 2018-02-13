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

Deep learning is one of the most popular trends in machine learning, with applications to many areas including driverless cars, speech and image recognition, robotics and finance. Also referred to as Artificial Neural Networks (ANN), these methods are inspired by the individual neurons within the brain (biological neural networks).

Predictive maintenance uses machine learning methods to determine the condition of equipment in order to preemptively perform maintenance and avoid adverse machine performance. In these scenarios, data is collected over time to monitor the state of the machine with the final goal of finding patterns to predict failures. [Long Short Term Memory (LSTM)](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) networks are especially appealing for predictive maintenance for the ability to learning from sequences of data. LSTMs are designed for application to time series data to detect temporal patterns that could lead to machine failures.

## Link to the Gallery GitHub repository

Following is the link to the public GitHub repository for issue reports and contributions:
    [https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance](https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance) 

## Use case overview

This tutorial uses the example of simulated aircraft engine run-to-failure events to demonstrate the predictive maintenance modeling process. The scenario is described at  [Predictive Maintenance](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Template-3)

The implicit assumption of the scenario is the engine has progressive degradation pattern. The pattern signal is reflected in sensor measurements and a machine learning algorithm can learn the relationship between the changes in these sensor values and the historical failures. The model can then Predict engine failures in the future based on the current state of sensor measurements.

This scenario creates an LSTM network for the data to predict remaining useful life of aircraft engines using historical aircraft sensor values. This scenario uses the [Keras](https://keras.io/) with [Tensorflow](https://www.tensorflow.org/) deep learning framework as a back end to train and test the LSTM network.

## Prerequisites

* An [Azure account](https://azure.microsoft.com/en-us/free/) (free trials are available).
* An installed copy of [Azure Machine Learning Workbench](./overview-what-is-azure-ml.md) following the [quickstart installation guide](./quickstart-installation.md) to install the program and create a workspace.
* Azure Machine Learning Operationalization requires a local deployment environment and a [model management account](https://docs.microsoft.com/azure/machine-learning/preview/model-management-overview)

This example can run on any AML Workbench compute context. However, it is recommended to run it with at least of 16-GB memory. This scenario was built and tested on a Windows 10 machine running a remote DS4_V2 standard [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu).

## Create a new Workbench project

Create a new project by using this example as a template:

1. Open Machine Learning Workbench.
2. On the **Projects** page, select **+**, and then select **New Project**.
3. In the **Create New Project** pane, enter the information for your new project.
4. In the **Search Project Templates** search box, type "Predictive Maintenance" and select the **Deep Learning for Predictive Maintenance Scenario** template.
5. Click the **Create** button

## Prepare the notebook server computation target

To run on your local machine, from the AML Workbench `File` menu, select either the `Open Command Prompt` or `Open PowerShell CLI`. The CLI interface allows you to access your Azure services using the `az` commands. First, login to your Azure account with the command:

```
az login
``` 

This command provides an authentication key to be used with the `https:\\aka.ms\devicelogin` URL. The CLI waits until the device login operation returns and provides some connection information. Next, if you have a local [docker](https://www.docker.com/get-docker) install, prepare the local compute environment with the following commands:

```
az ml experiment prepare --target docker --run-configuration docker
```

It is preferable to run on a [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu) for memory and disk requirements. Once the DSVM is configured, prepare the remote docker environment with the following two commands:

```
az ml computetarget attach remotedocker --name [Connection_Name] --address [VM_IP_Address] --username [VM_Username] --password [VM_UserPassword]
```

Once connected to the remote docker container, prepare the DSVM docker compute environment using: 

```
az ml experiment prepare --target [Connection_Name] --run-configuration [Connection_Name]
```

With the docker compute environment prepared, open the Jupyter notebook server either within the AML Workbench notebooks tab, or start a browser-based server with: 
```
az ml notebook start
```

The example notebooks are stored in the `Code` directory. The notebooks are set up to run sequentially, starting on the first (`Code\1_data_ingestion.ipynb`) notebook. When you open each notebook, you are prompted to select the compute kernel. Choose the `[Project_Name]_Template [Connection_Name]` kernel to execute on the previously configured DSVM.

## Data description

The template uses three data sets as inputs, in the files **PM_train.txt**, **PM_test.txt**, and **PM_truth.txt**. 

-  **Train data**: The aircraft engine run-to-failure data. The train data (PM_train.txt) consists of multiple, multivariate time series, with *cycle* as the time unit. It includes 21 sensor readings for each cycle. 

    - Each time series is assumed to be generated from a different engine of the same type. Each engine is assumed to start with different degrees of initial wear and manufacturing variation. This information is unknown to the user. 

    - In this simulated data, the engine is assumed to be operating normally at the start of each time series. It starts to degrade at some point during the series of the operating cycles. The degradation progresses and grows in magnitude. 

    - When a predefined threshold is reached, the engine is considered unsafe for further operation. The last cycle of each time series is the failure point of that engine.

-   **Test data**: The aircraft engine operating data, without failure events recorded. The test data (PM_test.txt) has the same data schema as the training data. The only difference is that the data does not indicate when the failure occurs (the last time period does *not* represent the failure point). It is not known how many more cycles this engine can last before it fails.

- **Truth data**: The information of true remaining cycles for each engine in the testing data. The ground truth data provides the number of remaining working cycles for the engines in the testing data.

## Scenario structure

The content for the scenario is available in the [GitHub repository] (https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance). 

In the repository, a [readme] (https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance/blob/master/README.md) file outlines the processes, from preparing the data, to building and operationalizing the model. The three Jupyter notebooks are available in the [Code] (https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance/tree/master/Code) folder in the repository. 

The scenario workflow is divided into the three steps, each contained in a Jupyter notebooks. Each notebook produces data artifacts that are persisted locally for use in the following notebooks. 

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

