---
title: Deep learning for predictive maintenance real-world scenarios - Azure | Microsoft Docs
description: Learn how to replicate the tutorial on deep learning for predictive maintenance with Azure Machine Learning Workbench.
services: machine-learning
author: ehrlinger
ms.author: jehrling
manager: ireiter
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.devlang: 
ms.topic: article
ms.date: 11/22/2017

---
# Deep learning for predictive maintenance real-world scenario.

Deep learning is one of the most popular trends in machine learning, with applications to many areas including:
- driverless cars and robotics
- speech and image recognition
- financial forecasting.

Also known as Deep Neural Networks (DNN), these methods are inspired by the individual neurons within the brain (biological neural networks).

The impact of unscheduled equipment downtime can be detrimental for any business. It's critical to keep field equipment running to maximize utilization and performance and minimize costly, unscheduled downtime. Early identification of issues can help allocate limited maintenance resources in a cost-effective way and enhance quality and supply chain processes. 

A predictive maintenance (PM) strategy uses machine learning methods to determine the condition of equipment to preemptively perform maintenance to avoid adverse machine performance. In PM, data, collected over time to monitor the state of the machine, is analyses to find patterns that can be used to predict failures. [Long Short Term Memory (LSTM)](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) networks are attractive for this setting since they are designed to learn from sequences of data.

## Link to the Gallery GitHub repository

Following is the link to the public GitHub repository for issue reports and contributions:
    [https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance](https://github.com/Azure/MachineLearningSamples-DeepLearningforPredictiveMaintenance) 

## Use case overview

This tutorial uses the example of simulated aircraft engine run-to-failure events to demonstrate the predictive maintenance modeling process. The scenario is described at  [Predictive Maintenance](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Template-3)

The main assumption in this setting is the engine progressively degraded over its lifetime. The degradation can be detected in engine sensor measurements. PM attempts to model the relationship between the changes in these sensor values and the historical failures. The model can then predict when and engine may fail in the future based on the current state of sensor measurements.

This scenario creates an LSTM network to predict remaining useful life (RUL) of aircraft engines using historical sensor values. Using [Keras](https://keras.io/) with [Tensorflow](https://www.tensorflow.org/) deep learning framework as a compute engine, the scenario trains the LSTM with one set of engines, and test the network on an unseen engine set.

## Prerequisites

* An [Azure account](https://azure.microsoft.com/en-us/free/) (free trials are available).
* An installed copy of [Azure Machine Learning Workbench](./overview-what-is-azure-ml.md) following the [quickstart installation guide](./quickstart-installation.md) to install the application and create a workspace.
* Azure Machine Learning Operationalization requires a local deployment environment and a [model management account](https://docs.microsoft.com/azure/machine-learning/preview/model-management-overview)

This example can run on any AML Workbench compute context. However, it's recommended to have at least of 16-GB memory. This scenario was built and tested on a Windows 10 machine running a remote DS4_V2 standard [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu).

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

It's preferable to run on a [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu) for memory and disk requirements. Once the DSVM is configured, prepare the remote docker environment with the following two commands:

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

    - Each time series is generated from a different engine of the same type. Each engine starts with different degrees of initial wear and some unique manufacturing variation. This information is unknown to the user. 

    - In this simulated data, the engine is assumed to be operating normally at the start of each time series. It starts to degrade at some point during the series of the operating cycles. The degradation progresses and grows in magnitude. 

    - When a predefined threshold is reached, the engine is considered unsafe for further operation. The last cycle of each time series is the failure point of that engine.

-   **Test data**: The aircraft engine operating data, without failure events recorded. The test data (PM_test.txt) has the same data schema as the training data. The only difference is that the data does not indicate when the failure occurs (the last time period does *not* represent the failure point). It is not known how many more cycles this engine can last before it fails.

- **Truth data**: The information of true remaining cycles for each engine in the testing data. The ground truth data provides the number of remaining working cycles for the engines in the testing data.

## Scenario structure

The scenario workflow is divided into the three steps, each executed in a Jupyter notebooks. Each notebook produces data artifacts that are persisted locally for use in the following notebooks: 

### Task 1: Data ingestion and preparation

The Data Ingestion Jupyter Notebook in `Code/1_data_ingestion_and_preparation.ipnyb` loads the three input data sets into Pandas data frame format. Then prepares the data for modeling and does some preliminary data visualization. The data sets are stored local to the compute context for use in the model building notebook.

### Task 2: Model building and evaluation

The Model Building Jupyter Notebook in `Code/2_model_building_and_evaluation.ipnyb` reads the train and test data sets from disk and builds an LSTM network the training data set. The model performance is measured on the test set. The resulting model is serialized and stored in the local compute context for use in the operationalization task.

### Task 3: Operationalization

The operationalization Jupyter Notebook in `Code/3_operationalization.ipnyb` uses the stored model to build functions and schema for calling the model on an Azure-hosted web service. The notebook tests the functions, and then compresses the assets into the `LSTM_o16n.zip` file, which is loaded onto your Azure storage container for deployment.

The `LSTM_o16n.zip` deployment file contains the following artifacts:

- `webservices_conda.yaml` defines the python packages required to run the LSTM model on the deployment target.  
- `service_schema.json` defines the data schema expected by the LSTM model. 	
- `lstmscore.py` defines the functions the deployment target is running to score new data.	  
- `modellstm.json` defines the LSTM architecture. The lstmscore.py functions read the architecture and weights to initialize the model.
- `modellstm.h5` defines the model weights.
- `test_service.py` A test script that calls the deployment end point with test data records. 
- `PM_test_files.pkl` The `test_service.py` script reads historical engine data from the `PM_test_files.pkl` file and sends the webservice enough cycles for the LSTM to return a probability of engine failure.

The notebook tests the functions using the model definition before it packages the operationalization assets for deployment. Instructions for setting up and testing the webservice are included at the end of the `Code/3_operationalization.ipnyb` notebook.

## Conclusion

This tutorial uses a simple scenario using sensor values to make predictions. More advanced predictive maintenance scenarios, like the [Predictive Maintenance Modeling Guide R Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-Modelling-Guide-R-Notebook-1), can use many data sources  such as historical maintenance records, error logs, and machine features. Additional data sources may require different treatments to be used with deep learning.


## References

There are other predictive maintenance use case examples available on a variety of platforms:

* [Predictive Maintenance Solution Template](https://docs.microsoft.com/azure/machine-learning/cortana-analytics-playbook-predictive-maintenance)
* [Predictive Maintenance Modeling Guide](https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Modelling-Guide-1)
* [Predictive Maintenance Modeling Guide using SQL R Services](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-Modeling-Guide-using-SQL-R-Services-1)
* [Predictive Maintenance Modeling Guide Python Notebook](https://gallery.cortanaintelligence.com/Notebook/Predictive-Maintenance-Modelling-Guide-Python-Notebook-1)
* [Predictive Maintenance using PySpark](https://gallery.cortanaintelligence.com/Tutorial/Predictive-Maintenance-using-PySpark)

* [Predictive maintenance real-world scenario](https://docs.microsoft.com/en-us/azure/machine-learning/preview/scenario-predictive-maintenance)

## Next steps

There are many other example scenarios available within the Azure Machine Learning workbench that demonstrate additional features of the product. 