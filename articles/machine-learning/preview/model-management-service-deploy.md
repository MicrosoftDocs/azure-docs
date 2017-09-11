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

Azure Machine Learning model management provides interfaces to deploy models as REST API web services. You can deploy models you create using frameworks such as Spark, the Microsoft Cognitive Toolkit (CNTK), Keras, Tensorflow, and Python. 

This document covers the steps to deploy your models as web services using the Azure Machine Learning Model Management Command-line Interface (CLI). 

## Deploying web services
Using the CLIs, you can deploy web services to run on the local machine or on a cluster.

We recommend starting with a local deployment. You first validate that your model and code work, then deploy the web serivce to a cluster for production-scale use. For more info on setting up your environment for deployment, see [this document](model-management-configuration.md). 

The following are the deployment steps:
1. Use your saved, trained, Machine Learning model
2. Create a schema for your web service's input and output data
3. Create an image
4. Create and deploy the web service

#### 1. Save your model
Start with your saved trained model file, for example, mymodel.pkl. The file extension varies based on the platform you use to train and save the model. 

As an example, you can use Python's Pickle library to save a trained model to a file. Here is an [example](http://scikit-learn.org/stable/modules/model_persistence.html) using the Iris dataset:

```python
import pickle
from sklearn import datasets
iris = datasets.load_iris()
X, y = iris.data, iris.target
clf.fit(X, y)  
saved_model = pickle.dumps(clf)
```

#### 2. Create a schema.json file
This step is optional. 

Create a schema to automatically validate the input and output of your web service. The CLIs also use the schema to generate a Swagger document for your web service.

To create the schema, import the following libraries:

```python
from azureml.api.schema.dataTypes import DataTypes
from azureml.api.schema.sampleDefinition import SampleDefinition
from azureml.api.realtime.services import generate_schema
```
Next, define the input variables such as a Spark dataframe, Pandas dataframe, or NumPy array. The following example uses a Numpy array:

```python
inputs = {"input_array": SampleDefinition(DataTypes.NUMPY, yourinputarray)}
generate_schema(run_func=run, inputs=inputs, filepath='service_schema.json')
```
The following example uses a Spark dataframe:

```python
inputs = {"input_df": SampleDefinition(DataTypes.SPARK, yourinputdataframe)}
generate_schema(run_func=run, inputs=inputs, filepath='service_schema.json')
```

The following example uses a PANDAS dataframe:

```python
inputs = {"input_df": SampleDefinition(DataTypes.PANDAS, yourinputdataframe)}
generate_schema(run_func=run, inputs=inputs, filepath='service_schema.json')
```

#### 3. Create a score.py file
You provide a score.py file, which loads your model and returns the prediction result(s) using the model.

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
Use the model, schema, conda python [dependencies file](https://github.com/conda/conda-env), and the score and schema files to create an image.

```
az ml image create -n <image name> -m <model file> -f <score.py file> -s <schema file> -r <run-time e.g. python> -c <conda dependencies file>
```

>Note: for more details on the command parameters, type -h at the end of the command for example, az ml image create -h.

#### 5. Create and deploy the web service
Deploy the image using the following command:

```
az ml service create realtime --image-id <image id> -n <service name>
```

>Note: you can also use a single command to perform both actions. Use -h with the service create command for more details.

#### 6. Test the sevice
Use the following command to get information on how to call the service:

```
az ml service usage realtime -i <service id>
```

Call the sevice using the run function from the command prompt:

```
az ml service run realtime -i <service id> -d "{\"input_df\": [INPUT DATA]}"
```

The following example calls a sample Iris web service:

```
az ml service run realtime -i <service id> -d "{\"input_df\": [{\"sepal length\": 3.0, \"sepal width\": 3.6, \"petal width\": 1.3, \"petal length\":0.25}]}"
```