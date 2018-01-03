---
title: Azure Machine Learning Model Management Web Service Deployment | Microsoft Docs
description: This document describes the steps involved in deploying a machine learning model using Azure Machine Learning model Management.
services: machine-learning
author: raymondl
ms.author: raymondl, aashishb
manager: neerajkh
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 01/03/2018
---
# Deploying a Machine Learning Model as a web service

Azure Machine Learning Model Management provides interfaces to deploy models as containerized Docker-based web services. You can deploy models you create using frameworks such as Spark, the Microsoft Cognitive Toolkit (CNTK), Keras, Tensorflow, and Python. 

This document covers the steps to deploy your models as web services using the Azure Machine Learning Model Management command-line interface (CLI).

## Deploying web services
Using the CLIs, you can deploy web services to run on the local machine or on a cluster.

We recommend starting with a local deployment. You first validate that your model and code work, then deploy the web service to a cluster for production-scale use. For more info on setting up your environment for cluster deployment, see [Model Management configuration](deployment-setup-configuration.md). 

The following are the deployment steps:
1. Use your saved, trained, Machine Learning model
2. Create a schema for your web service's input and output data
3. Create a Docker-based container image
4. Create and deploy the web service

### 1. Save your model
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

### 2. Create a schema.json file
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

### 3. Create a score.py file
You provide a score.py file, which loads your model and returns the prediction result(s) using the model.

The file must include two functions: init and run.

Add following code at the top of the score.py file to enable data collection functionality that helps collect model input and prediction data

```python
from azureml.datacollector import ModelDataCollector
```

Check [model data collection](how-to-use-model-data-collection.md) section for more details on how to use this feature.

#### Init function
Use the init function to load the saved model.

Example of a simple init function loading the model:

```python
def init():  
    from sklearn.externals import joblib
    global model, inputs_dc, prediction_dc
    model = joblib.load('model.pkl')

    inputs_dc = ModelDataCollector('model.pkl',identifier="inputs")
    prediction_dc = ModelDataCollector('model.pkl', identifier="prediction")
```

#### Run function
The run function uses the model and the input data to return a prediction.

Example of a simple run function processing the input and returning the prediction result:

```python
def run(input_df):
    global clf2, inputs_dc, prediction_dc
    try:
        prediction = model.predict(input_df)
        inputs_dc.collect(input_df)
        prediction_dc.collect(prediction)
        return prediction
    except Exception as e:
        return (str(e))
```

### 4. Register a model
Following command is used to register a model created in step 1 above,

```
az ml model register --model [path to model file] --name [model name]
```

### 5. Create manifest
Following command helps create a manifest for the model,

```
az ml manifest create --manifest-name [your new manifest name] -f [path to code file] -r [runtime for the image, e.g. spark-py]
```
You can add a previously registered model to the manifest by using argument `--model-id` or `-i` in the command shown above. Multiple models can be specified with additional -i arguments.

### 6. Create an image 
You can create an image with the option of having created its manifest before. 

```
az ml image create -n [image name] -manifest-id [the manifest ID]
```

Or you can create the manifest and image with a single command. 

```
az ml image create -n [image name] --model-file [model file or folder path] -f [code file, e.g. the score.py file] -r [the runtime eg.g. spark-py which is the Docker container image base]
```

>[!NOTE]
>For more details on the command parameters, type -h at the end of the command for example, az ml image create -h.


### 7. Create and deploy the web service
Deploy the service using the following command:

```
az ml service create realtime --image-id <image id> -n <service name>
```

>[!NOTE] 
>You can also use a single command to perform the previous 4 steps. Use -h with the service create command for more details.

### 8. Test the service
Use the following command to get information on how to call the service:

```
az ml service usage realtime -i <service id>
```

Call the service using the run function from the command prompt:

```
az ml service run realtime -i <service id> -d "{\"input_df\": [INPUT DATA]}"
```

The following example calls a sample Iris web service:

```
az ml service run realtime -i <service id> -d "{\"input_df\": [{\"sepal length\": 3.0, \"sepal width\": 3.6, \"petal width\": 1.3, \"petal length\":0.25}]}"
```

## Next steps
Now that you have tested your web service to run locally, you can deploy it to a cluster for large-scale use. For details on setting up a cluster for web service deployment, see [Model Management Configuration](deployment-setup-configuration.md). 
