---
title: Azure Machine Learning Model Management Web Service Deployment | Microsoft Docs
description: This document describes the steps involved in deploying a machine learning model using Azure Machine Learning model Management.
services: machine-learning
author: raymondlaghaeian
ms.author: raymondl
manager: neerajkh
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/05/2017
---
# Deploying a machine learning model as a web service

Azure Machine Learning model management provides interfaces to deploy models as REST API web services. You can deploy models you create using frameworks such as Spark, Microsoft Cognitive Toolkit (CNTK), Keras, Tensorflow, and Python. 

This document covers the steps to deploy your models as web services using the Azure Machine Learning model management command-line Interface (CLI). You learn how to:

- Install and update the CLIs
- Create an image
- Create and deploy a web service

## Deploying using the CLIs
### Accessing the CLIs

CLIs come pre-installed on the Azure Machine Learning Workbench and on [Azure DSVMs](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-virtual-machine-overview).

- To use CLIs, on the Workbench, click File -> Open CommandLine Interface. 
- On a DSVM, open a command prompt. Once there, type _az ml -h_ to see the options. 
- On all other systems, you have to install the CLIs.

#### Installing (or updating) on Windows
Install Python from https://www.python.org/. Ensure that you have selected to install pip. Then open a command prompt using Run As Administrator and run the following commands:

```
pip install azure-cli
pip install azure-cli-ml
```

#### Installing (or updating) on Linux

The easiest and quickest way to get started on Linux is to use the Data Science VM. For more information on DSVM, see [Provision the Data Science Virtual Machine for Linux (Ubuntu)](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-dsvm-ubuntu-intro)

**Note**: The information in this document pertains to DSVMs provisioned after May 1, 2017.

Once you have provisioned and signed into the DSVM, run the following commands and follow the prompts:
 
```
wget -q https://raw.githubusercontent.com/Azure/Machine-Learning-Operationalization/master/scripts/amlupdate.sh -O - | sudo bash -
sudo /opt/microsoft/azureml/initial_setup.sh
```
Log out and log back in to your SSH session for the changes to take effect.

### Deploying web services
Using the CLIs, you can deploy web services to run locally or to a cluster.

We recommend starting with a local deployment, validate that your model and code work, then deploy to a cluster for production-scale use. For more info on setting up your environment for deployment, see [this document](model-management-configuration.md). 

The following are the deployment steps:
1. Use your saved, trained, Machine Learning model
2. Create a schema for your web service's input and output data
3. Create an image
4. Create and deploy the web service

#### 1. Save your model
Start with your saved trained model file, for example, mymodel.pkl. The file extension varies based on the platform you use to train and save the model. 

#### 2. Create a schema.json file
This step is optional. 

Create a schema to validate the input and output of the web service. The CLIs also use the schema to generate a Swagger document for your web service.

To create the schema, import the following libraries:

```python
from azureml.api.schema.dataTypes import DataTypes
from azureml.api.schema.sampleDefinition import SampleDefinition
from azureml.api.realtime.services import generate_schema
```
Then, define the input variables such as Spark dataframe, Pandas dataframe, or NumPy array. The following example uses Numpy array:

```python
inputs = {"input_array": SampleDefinition(DataTypes.NUMPY, yourinputarray)}
generate_schema(run_func=run, inputs=inputs, filepath='service_schema.json')
```
The following example uses Spark:

```python
inputs = {"input_df": SampleDefinition(DataTypes.SPARK, yourinputdataframe)}
generate_schema(run_func=run, inputs=inputs, filepath='service_schema.json')
```

#### 3. Create a score.py file
You provide a score.py file, which loads your model and return the prediction result(s) using the model.

The file must include two functions: init and run.

##### Init function
Use the init function to load the saved model.

Example of a simple init function loading the model:

```python
def init():   
    from sklearn.externals import joblib
    global model
    model = joblib.load('model.pkl')
```

##### Run function
The run function uses the model and the input data to return a prediction.

Example of a simple run function processing the input and returning the prediction result:

```python
def run(input_df):
    try:
        prediction = model.predict(input_df)
        return prediction
    except Exception as e:
        return (str(e))
```

#### 4. Create an image 
Use the model, schema, conda python dependencies [file](https://github.com/conda/conda-env), and score files to create an image.

```
az ml image create -n <image name> -m <model file> -s <schema file> -r <run time e.g. python> -c <conda dependencies file>
```

>Note: for more details on the command parameters, type -h at the end of the command for example, az ml image create -h.

#### 4. Create and deploy the web service
Deploy the image using the following command:

```
az ml service create realtime --image-id <image id> -n <service name>
```

>Note: you can also use a single command to perform both actions. Use -h with the service create command for more details.


 
