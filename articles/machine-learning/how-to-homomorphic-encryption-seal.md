---
title: Deploy an encrypted inferencing service
titleSuffix: Azure Machine Learning
description: Learn how to use Microsoft SEAL to deploy an encrypted prediction service for image classification
author: luisquintanilla
ms.author: luquinta 
ms.date: 05/18/2020
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: tracking-python
#intent: As a data scientist, I want to deploy a service that uses homomorphic encryption to make predictions on encrypted data
---

# How to deploy an encrypted inferencing web service

Learn how to deploy an image classification model as an encrypted inferencing web service in [Azure Container Instances](https://docs.microsoft.com/azure/container-instances/) (ACI). The web service is a Docker container image that contains the model and scoring logic.

In this guide, you use Azure Machine Learning service to:

> [!div class="checklist"]
> * Configure your environments
> * Deploy encrypted inferencing web service
> * Prepare test data
> * Make encrypted predictions
> * Clean up resources

ACI is a great solution for testing and understanding the model deployment workflow. For scalable production deployments, consider using Azure Kubernetes Service. For more information, see [how to deploy and where](https://docs.microsoft.com/azure/machine-learning/service/how-to-deploy-and-where).

The encryption method used in this sample is [homomorphic encryption](https://github.com/Microsoft/SEAL#homomorphic-encryption). Homomorphic encryption allows for computations to be done on encrypted data without requiring access to a secret (decryption) key. The results of the computations are encrypted and can be revealed only by the owner of the secret key. 

## Prerequisites

This guide assumes that you have an image classification model registered in Azure Machine Learning. If not, register the model using a [pretrained model](https://github.com/Azure/MachineLearningNotebooks/raw/master/tutorials/image-classification-mnist-data/sklearn_mnist_model.pkl) or create your own by completing the [train an image classification model with Azure Machine Learning tutorial](tutorial-train-models-with-aml.md).

## Configure local environment

In a Jupyter notebook

1. Import the Python packages needed for this sample.

    ```python
    %matplotlib inline
    import numpy as np
    import matplotlib.pyplot as plt

    import azureml.core

    # display the core SDK version number
    print("Azure ML SDK Version: ", azureml.core.VERSION)
    ```

2. Install homomorphic encryption library for secure inferencing.

    > [!NOTE]
    > The `encrypted-inference` package is currently in preview.

    [`encrypted-inference`](https://pypi.org/project/encrypted-inference) is a library that contains bindings for encrypted inferencing based on [Microsoft SEAL](https://github.com/Microsoft/SEAL).

    ```python
    !pip install encrypted-inference==0.9
    ```

## Configure the inferencing environment

Create an environment for inferencing and add `encrypted-inference` package as a conda dependency.

```python
from azureml.core.environment import Environment
from azureml.core.conda_dependencies import CondaDependencies

# to install required packages
env = Environment('tutorial-env')
cd = CondaDependencies.create(pip_packages=['azureml-dataprep[pandas,fuse]>=1.1.14', 'azureml-defaults', 'azure-storage-blob', 'encrypted-inference==0.9'], conda_packages = ['scikit-learn==0.22.1'])

env.python.conda_dependencies = cd

# Register environment to re-use later
env.register(workspace = ws)
```

## Deploy encrypted inferencing web service

Deploy the model as a web service hosted in ACI.

To build the correct environment for ACI, provide the following:

* A scoring script to show how to use the model
* A configuration file to build the ACI
* A trained model

### Create scoring script

Create the scoring script `score.py` used by the web service for inferencing.

You must include two required functions into the scoring script:

* The `init()` function, which typically loads the model into a global object. This function is run only once when the Docker container is started.
* The `run(input_data)` function uses the model to predict a value based on the input data. Inputs and outputs to the run typically use JSON for serialization and de-serialization, but other formats are supported. The function fetches homomorphic encryption based public keys that are uploaded by the service caller.

```python
%%writefile score.py
import json
import os
import pickle
import joblib
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, PublicAccess
from encrypted.inference.eiserver import EIServer

def init():
    global model
    # AZUREML_MODEL_DIR is an environment variable created during deployment.
    # It is the path to the model folder (./azureml-models/$MODEL_NAME/$VERSION)
    # For multiple models, it points to the folder containing all deployed models (./azureml-models)
    model_path = os.path.join(os.getenv('AZUREML_MODEL_DIR'), 'sklearn_mnist_model.pkl')
    model = joblib.load(model_path)

    global server
    server = EIServer(model.coef_, model.intercept_, verbose=True)

def run(raw_data):

    json_properties = json.loads(raw_data)

    key_id = json_properties['key_id']
    conn_str = json_properties['conn_str']
    container = json_properties['container']
    data = json_properties['data']

    # download the public keys from blob storage
    blob_service_client = BlobServiceClient.from_connection_string(conn_str=conn_str)
    blob_client = blob_service_client.get_blob_client(container=container, blob=key_id)
    public_keys = blob_client.download_blob().readall()

    result = {}
    # make prediction
    result = server.predict(data, public_keys)

    # you can return any data type as long as it is JSON-serializable
    return result
```

### Create configuration file

Create a deployment configuration file and specify the number of CPUs and gigabyte of RAM needed for your ACI container. While it depends on your model, the default of 1 core and 1 gigabyte of RAM is usually sufficient for many models. If you feel you need more later, you would have to recreate the image and redeploy the service.

```python
from azureml.core.webservice import AciWebservice

aciconfig = AciWebservice.deploy_configuration(cpu_cores=1, 
                                               memory_gb=1, 
                                               tags={"data": "MNIST",  "method" : "sklearn"}, 
                                               description='Encrypted Predict MNIST with sklearn + SEAL')
```

### Deploy to Azure Container Instances

Estimated time to complete: **about 2-5 minutes**

Configure the image and deploy. The following code goes through these steps:

1. Create environment object containing dependencies needed by the model using the environment file (`myenv.yml`)
1. Create inference configuration necessary to deploy the model as a web service using:
   * The scoring file (`score.py`)
   * Environment object created in the previous step
1. Deploy the model to the ACI container.
1. Get the web service HTTP endpoint.

```python
%%time
from azureml.core.webservice import Webservice
from azureml.core.model import InferenceConfig
from azureml.core.environment import Environment
from azureml.core import Workspace
from azureml.core.model import Model

ws = Workspace.from_config()
model = Model(ws, 'sklearn_mnist')

myenv = Environment.get(workspace=ws, name="tutorial-env")
inference_config = InferenceConfig(entry_script="score.py", environment=myenv)

service = Model.deploy(workspace=ws,
                       name='sklearn-encrypted-mnist-svc',
                       models=[model],
                       inference_config=inference_config,
                       deployment_config=aciconfig)

service.wait_for_deployment(show_output=True)
```

Get the scoring web service's HTTP endpoint, which accepts REST client calls. This endpoint can be shared with anyone who wants to test the web service or integrate it into an application.

```python
print(service.scoring_uri)
```

## Prepare test data

1. Download the test data. In this case, it's saved into a directory called *data*.

    ```python
    import os
    from azureml.core import Dataset
    from azureml.opendatasets import MNIST
    
    data_folder = os.path.join(os.getcwd(), 'data')
    os.makedirs(data_folder, exist_ok=True)
    
    mnist_file_dataset = MNIST.get_file_dataset()
    mnist_file_dataset.download(data_folder, overwrite=True)
    ```

1. Load the test data from the *data* directory.

    ```python
    from utils import load_data
    import os
    import glob
    
    data_folder = os.path.join(os.getcwd(), 'data')
    # note we also shrink the intensity values (X) from 0-255 to 0-1. This helps the neural network converge faster
    X_test = load_data(glob.glob(os.path.join(data_folder,"**/t10k-images-idx3-ubyte.gz"), recursive=True)[0], False) / 255.0
    y_test = load_data(glob.glob(os.path.join(data_folder,"**/t10k-labels-idx1-ubyte.gz"), recursive=True)[0], True).reshape(-1)
    ```

## Make encrypted predictions

Use the test dataset with the model to get predictions.

To make encrypted predictions:

1. Create a new `EILinearRegressionClient`, a homomorphic encryption based client, and public keys.

    ```python
    from encrypted.inference.eiclient import EILinearRegressionClient

    # Create a new Encrypted inference client and a new secret key.
    edp = EILinearRegressionClient(verbose=True)

    public_keys_blob, public_keys_data = edp.get_public_keys()
    ```

1. Upload homomorphic encryption generated public keys to the workspace default blob store. This will allow you to share the keys with the inference server.

    ```python
    import azureml.core
    from azureml.core import Workspace, Datastore
    import os

    ws = Workspace.from_config()

    datastore = ws.get_default_datastore()
    container_name=datastore.container_name

    # Create a local file and write the keys to it
    public_keys = open(public_keys_blob, "wb")
    public_keys.write(public_keys_data)
    public_keys.close()

    # Upload the file to blob store
    datastore.upload_files([public_keys_blob])

    # Delete the local file
    os.remove(public_keys_blob)
    ```

1. Encrypt the test data

    ```python
    #choose any one sample from the test data 
    sample_index = 1

    #encrypt the data
    raw_data = edp.encrypt(X_test[sample_index])

    ```

1. Use the SDK's `run` API to invoke the service and provide the test dataset to the model to get predictions. We will need to send the connection string to the blob storage where the public keys were uploaded.

    ```python
    import json
    from azureml.core import Webservice

    service = Webservice(ws, 'sklearn-encrypted-mnist-svc')

    #pass the connection string for blob storage to give the server access to the uploaded public keys 
    conn_str_template = 'DefaultEndpointsProtocol={};AccountName={};AccountKey={};EndpointSuffix=core.windows.net'
    conn_str = conn_str_template.format(datastore.protocol, datastore.account_name, datastore.account_key)

    #build the json 
    data = json.dumps({"data": raw_data, "key_id" : public_keys_blob, "conn_str" : conn_str, "container" : container_name })
    data = bytes(data, encoding='ASCII')

    print ('Making an encrypted inference web service call ')
    eresult = service.run(input_data=data)

    print ('Received encrypted inference results')
    ```

1. Use the client to decrypt the results.

    ```python
    import numpy as np

    results = edp.decrypt(eresult)

    print ('Decrypted the results ', results)

    #Apply argmax to identify the prediction result
    prediction = np.argmax(results)

    print ( ' Prediction : ', prediction)
    print ( ' Actual Label : ', y_test[sample_index])
    ```

## Clean up resources

Delete the web service created in this sample:

```python
service.delete()
```

If you no longer plan to use the Azure resources you’ve created, delete them. This prevents you from being charged for unutilized resources that are still running. See this guide on how to [clean up resources](how-to-manage-workspace.md#clean-up-resources) to learn more.
