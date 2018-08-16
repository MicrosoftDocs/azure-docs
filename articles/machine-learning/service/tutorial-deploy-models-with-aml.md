---
title: Deploy an image classification model in Azure Container Instance (ACI) with Azure Machine Learning service
description: This tutorial shows how to use Azure Machine Learning service to deploy an image classification model with scikit-learn in a Python Jupyter notebook.  This tutorial is part two of a two-part series.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: tutorial

author: hning86
ms.author: haining
ms.reviewer: sgilley
ms.date: 09/24/2018
# As a professional data scientist, I can deploy the model previously trained in tutorial1.
---

# Tutorial #2:  Deploy an image classification model in Azure Container Instance (ACI)

This tutorial is **part two of a two-part tutorial series**. In the previous tutorial, you built a machine learning model.  The model was registered and saved in your workspace on the cloud.  Now you're ready to retrieve this model and deploy it as a web service running in Azure Container Instance (ACI).

In this part of the tutorial, you use Azure Machine Learning service (Preview) to:

> [!div class="checklist"]
> * Set up your testing environment
> * Retrieve the model from your workspace
> * Test the model locally
> * Deploy the model to ACI
> * Test the deployed model

## Prerequisites

* Complete the model training in the [Tutorial #1: Train an image classification model with Azure Machine Learning](https://aka.ms/aml-notebook-train-model) notebook.  

* Place this Jupyter notebook into the same directory as `aml_config` and `utils.py` from the training tutorial.


## Set up a testing environment

Import the Python packages needed in this solution.


```python
%matplotlib inline
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
 
import azureml
from azureml.core import Workspace, Project, Run

# display the core SDK version number
print("Azure ML SDK Version: ", azureml.core.VERSION)
```


### Retrieve the model

The best model was registered in the workspace in the previous tutorial. Load the workspace and download the model  to your local directory.


```python
from azureml.core import Workspace
from azureml.core.model import Model

ws = Workspace.from_config()
model=Model(ws, 'sklearn_mnist')
model.download(target_dir = '.')
import os 
# verify the downloaded model file
os.stat('./sklearn_mnist_model.pkl')
```

## Test the model locally

Before deploying, make sure your model is working locally. In this section you will:
* Load test data
* Predict test data
* Examine the confusion matrix

### Load test data

Load the test data from the **./data/** directory created during the training tutorial.

```python
from utils import load_data

# note we also shrink the intensity values (X) from 0-255 to 0-1. This helps the neural network converge faster

X_test = load_data('./data/test-images.gz', False) / 255.0
y_test = load_data('./data/test-labels.gz', True).reshape(-1)

```

### Predict test data

Feed the test dataset to the model to get predictions.

```python
import pickle
from sklearn.externals import joblib

clf = joblib.load('./sklearn_mnist_model.pkl')
y_hat = clf.predict(X_test)
```

###  Examine the confusion matrix

A confusion matrix shows how many samples in the test set are classified correctly.  In addition, it shows the mis-classified value for the incorrect predictions. 

```python
from sklearn.metrics import confusion_matrix

conf_mx = confusion_matrix(y_test, y_hat)
print(conf_mx)
print('Overall accuracy:', np.average(y_hat == y_test))
```

    [[ 960    0    1    2    0    5    6    3    1    2]
     [   0 1112    3    1    0    1    5    1   12    0]
     [   8    8  920   20    9    5   10   11   37    4]
     [   4    0   17  919    2   22    4   12   21    9]
     [   1    2    5    3  914    0   10    2    7   38]
     [  10    2    0   42   10  769   17    7   28    7]
     [   9    3    7    2    6   20  907    1    3    0]
     [   2    7   22    5    8    1    1  950    5   27]
     [  10   14    5   21   14   27    7   11  853   12]
     [   8    8    2   13   31   14    0   24   12  897]]
    Overall accuracy: 0.9201
    

Use `matplotlib` to display the confusion matrix as a graph. In this graph, the X axis represents the actual values, and the Y axis represents the predicted values. The color in each grid represents the error rate. The lighter the color, the higher the error rate is. For example, many 5's are mis-classified as 3's. Hence you see a bright grid at (5,3).

```python
row_sums = conf_mx.sum(axis = 1, keepdims = True)
norm_conf_mx = conf_mx / row_sums
np.fill_diagonal(norm_conf_mx, 0)

fig = plt.figure(figsize = (8,5))
ax = fig.add_subplot(111)
cax = ax.matshow(norm_conf_mx, cmap = plt.cm.bone)
ticks = np.arange(0, 10, 1)
ax.set_xticks(ticks)
ax.set_yticks(ticks)
ax.set_xticklabels(ticks)
ax.set_yticklabels(ticks)
fig.colorbar(cax)
plt.ylabel('true labels', fontsize=14)
plt.xlabel('predicted values', fontsize=14)
plt.savefig('conf.png')
plt.show()
```

![confusion matrix](./media/tutorial-deploy-models-with-aml/confusion.png)


## Deploy the model in ACI

Now you're ready to deploy the model as a web service running in ACI. Azure Machine Learning creates this web service by constructing a Docker image with the scoring logic and model baked in. To build the correct environment for ACI, you need to provide:

* A scoring script to show how to use the model
* An environment file to show what packages need to be installed
* A configuration file to build the ACI
* The model

### Create scoring script

First, create a scoring script that will be used by the web service call.

> [!NOTE]
>The scoring script must have two required functions, `init()` and `run(input_data)`. 
>    * The `init()` function will typically load the model into a global object. This function is executed only once when the Docker container is started. 
>    * The `run(input_data)` function uses the model to predict a value based on the input data. Inputs and outputs to the run typically use JSON as the serialization and de-serialization format but you are not limited to that.


```python
%%writefile score.py
import json
import numpy as np
import os
import pickle
from sklearn.externals import joblib
from sklearn.linear_model import LogisticRegression

#from azureml.assets.persistence.persistence import get_model_path
from azureml.core.model import Model

def init():
    global model
    # retreive the local path to the model using the model name
    model_path = Model.get_model_path('sklearn_mnist')
    model = joblib.load(model_path)

def run(raw_data):
    data = np.array(json.loads(raw_data)['data'])
    # make prediction
    y_hat = model.predict(data)
    return json.dumps(y_hat.tolist())
```

### Create environment file

Next, create an environment file to have the packages required by your script installed in the Docker image. For this model, you need `scikit-learn` and `azureml-sdk`.


```python
%%writefile myenv.yml
name: myenv
channels:
  - defaults
dependencies:
  - scikit-learn
  - pip:
    # Required packages for AzureML execution, history, and data preparation.
    - --extra-index-url https://azuremlsdktestpypi.azureedge.net/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1
    - azureml-core
```


### Create configuration file

Create a deployment configuration and specify the number of CPUs and gigabyte of RAM needed for your ACI container.


```python
from azureml.core.webservice import AciWebservice

aciconfig = AciWebservice.deploy_configuration(cpu_cores = 1, 
                                               memory_gb = 1, 
                                               tags = ['MNIST sklearn'], 
                                               description = 'Predict MNIST with sklearn')
```

### Deploy to ACI

Now you're ready to deploy.  The deployment process consists of the following steps:

* **Build image**: Build a Docker image using the scoring file (`score.py`), the environment file (`myenv.yml`), and the model file. 
* **Register image**: Register the image under the workspace. 
* **Send to ACI**: Send the image to the ACI infrastructure
* **Start up container**: Start up a container in ACI using the image
* **Expose endpoint**: Expose an HTTP endpoint to accept REST client calls.

> [!IMPORTANT]
> This script will run for **about 7-8 minutes**. 

```python
%%time
from azureml.core.webservice import Webservice
from azureml.core.image import ContainerImage

image_config = ContainerImage.image_configuration(execution_script = "score.py", 
                                                  runtime = "python", 
                                                  conda_file = "myenv.yml")

service = Webservice.deploy_from_model(workspace = ws,
                                       name = 'sklearn-mnist-model',
                                       deployment_config = aciconfig,
                                       models = [model],
                                       image_config = image_config)

service.wait_for_deployment(show_output = True)
```

Display the scoring web service endpoint:

```python
print(service.scoring_uri)
```


## Test the deployed model

Earlier you scored all the test data with the local version of the model.  Now you'll test the deployed model with a random sample of 30 images from the test data.  Send the data as a json array to the web service hosted in ACI. Here you use the `run` API in the SDK to invoke the service. You can also make raw HTTP calls using any HTTP tool such as curl.

Print the returned predictions and plot them along with the input images. Use red font color and inverse image (white on black) to highlight the misclassified samples. 

> [!NOTE]
> Since the model accuracy is high, you might have to run the below cell a few times before you can see a misclassified sample.

```python
import json

# find 30 random samples from test set
n = 30
sample_indices = np.random.permutation(X_test.shape[0])[0:n]

test_samples = json.dumps({"data": X_test[sample_indices].tolist()})
test_samples = bytes(test_samples, encoding = 'utf8')

# predict using the deployed model
result = json.loads(service.run(input_data = test_samples))

# compare actual value vs. the predicted values:
i = 0
plt.figure(figsize = (20, 1))

for s in sample_indices:
    plt.subplot(1, n, i + 1)
    plt.axhline('')
    plt.axvline('')
    
    # use different color for misclassified sample
    font_color = 'red' if y_test[s] != result[i] else 'black'
    clr_map = plt.cm.gray if y_test[s] != result[i] else plt.cm.Greys
    
    plt.text(x = 10, y = -10, s = y_hat[s], fontsize = 18, color = font_color)
    plt.imshow(X_test[s].reshape(28, 28), cmap = clr_map)
    
    i = i + 1
plt.show()
```

Here is the result of one random sample of test images:
![results](./media/tutorial-deploy-models-with-aml/results.png)


## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

### Delete ACI deployment
If you would like to keep the resource group and workspace, you can delete just the ACI deployment with this delete API call:

```python
service.delete()
```


## Next steps

In this Azure Machine Learning tutorial, you used Python to:

> [!div class="checklist"]
> * Set up your testing environment
> * Retrieve the model from your workspace
> * Test the model locally
> * Deploy the model to ACI
> * Test the deployed model

Now that you have a deployed model, find out how an application can [consume a deployed model web service](how-to-consume-web-services.md).
 
You can also try out the [Automatic algorithm selection]() tutorial to see how Azure Machine Learning can automatically propose the best algorithm for your model and build that model for you.
