---
title: "Tutorial: Train and deploy an example in Jupyter Notebook"
titleSuffix: Azure Machine Learning
description: Use Azure Machine Learning to train and deploy an image classification model with scikit-learn in a cloud-based Python Jupyter Notebook. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 09/14/2022
ms.custom: UpdateFrequency5, sdkv1, event-tier1-build-2022, devx-track-python
#Customer intent: As a professional data scientist, I can build an image classification model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial: Train and deploy an image classification model with an example Jupyter Notebook

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this tutorial, you train a machine learning model on remote compute resources. You'll use the training and deployment workflow for Azure Machine Learning in a Python Jupyter Notebook.  You can then use the notebook as a template to train your own machine learning model with your own data. 

This tutorial trains a simple logistic regression by using the [MNIST](http://yann.lecun.com/exdb/mnist/) dataset and [scikit-learn](https://scikit-learn.org) with Azure Machine Learning. MNIST is a popular dataset consisting of 70,000 grayscale images. Each image is a handwritten digit of 28 x 28 pixels, representing a number from zero to nine. The goal is to create a multi-class classifier to identify the digit a given image represents.

Learn how to take the following actions:

> [!div class="checklist"]
> * Download a dataset and look at the data.
> * Train an image classification model and log metrics using MLflow.
> * Deploy the model to do real-time inference.


## Prerequisites

* Complete the [Quickstart: Get started with Azure Machine Learning](../quickstart-create-resources.md) to:
    * Create a workspace.
    * Create a cloud-based compute instance to use for your development environment.

## Run a notebook from your workspace

Azure Machine Learning includes a cloud notebook server in your workspace for an install-free and pre-configured experience. Use [your own environment](how-to-configure-environment.md) if you prefer to have control over your environment, packages, and dependencies.

## Clone a notebook folder

You complete the following experiment setup and run steps in Azure Machine Learning studio. This consolidated interface includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).

1. Select your subscription and the workspace you created.

1. On the left, select **Notebooks**.

1. At the top, select the **Samples** tab.

1. Open the **SDK v1** folder.

1. Select the **...** button at the right of the **tutorials** folder, and then select **Clone**.

    :::image type="content" source="media/tutorial-train-deploy-notebook/clone-tutorials.png" alt-text="Screenshot that shows the Clone tutorials folder.":::

1. A list of folders shows each user who accesses the workspace. Select your folder to clone the **tutorials**  folder there.

## Open the cloned notebook

1. Open the **tutorials** folder that was cloned into your **User files** section.

1. Select the **quickstart-azureml-in-10mins.ipynb** file from your **tutorials/compute-instance-quickstarts/quickstart-azureml-in-10mins** folder. 

    :::image type="content" source="media/tutorial-train-deploy-notebook/expand-folder.png" alt-text="Screenshot shows the Open tutorials folder.":::

## Install packages

Once the compute instance is running and the kernel appears, add a new code cell to install packages needed for this tutorial.  

1. At the top of the notebook, add a code cell.
    :::image type="content" source="media/tutorial-train-deploy-notebook/add-code-cell.png" alt-text="Screenshot of add code cell for notebook.":::

1. Add the following into the cell and then run the cell, either by using the **Run** tool or by using **Shift+Enter**.

    ```bash
    %pip install scikit-learn==0.22.1
    %pip install scipy==1.5.2
    ```

You may see a few install warnings.  These can safely be ignored.

## Run the notebook

This tutorial and accompanying **utils.py** file is also available on [GitHub](https://github.com/Azure/MachineLearningNotebooks/tree/master/tutorials) if you wish to use it on your own [local environment](how-to-configure-environment.md). If you aren't using the compute instance, add `%pip install azureml-sdk[notebooks] azureml-opendatasets matplotlib` to the install above.

> [!Important]
> The rest of this article contains the same content as you see in the notebook.  
>
> Switch to the Jupyter Notebook now if you want to run the code while you read along.
> To run a single code cell in a notebook, click the code cell and hit **Shift+Enter**. Or, run the entire notebook by choosing **Run all** from the top toolbar.

## Import data

Before you train a model, you need to understand the data you're using to train it. In this section, learn how to:

* Download the MNIST dataset
* Display some sample images

You'll use Azure Open Datasets to get the raw MNIST data files. Azure Open Datasets are curated public datasets that you can use to add scenario-specific features to machine learning solutions for better models. Each dataset has a corresponding class, `MNIST` in this case, to retrieve the data in different ways.


```python
import os
from azureml.opendatasets import MNIST

data_folder = os.path.join(os.getcwd(), "/tmp/qs_data")
os.makedirs(data_folder, exist_ok=True)

mnist_file_dataset = MNIST.get_file_dataset()
mnist_file_dataset.download(data_folder, overwrite=True)
```

### Take a look at the data

Load the compressed files into `numpy` arrays. Then use `matplotlib` to plot 30 random images from the dataset with their labels above them. 

Note this step requires a `load_data` function that's included in an `utils.py` file. This file is placed in the same folder as this notebook. The `load_data` function simply parses the compressed files into numpy arrays.


```python
from utils import load_data
import matplotlib.pyplot as plt
import numpy as np
import glob


# note we also shrink the intensity values (X) from 0-255 to 0-1. This helps the model converge faster.
X_train = (
    load_data(
        glob.glob(
            os.path.join(data_folder, "**/train-images-idx3-ubyte.gz"), recursive=True
        )[0],
        False,
    )
    / 255.0
)
X_test = (
    load_data(
        glob.glob(
            os.path.join(data_folder, "**/t10k-images-idx3-ubyte.gz"), recursive=True
        )[0],
        False,
    )
    / 255.0
)
y_train = load_data(
    glob.glob(
        os.path.join(data_folder, "**/train-labels-idx1-ubyte.gz"), recursive=True
    )[0],
    True,
).reshape(-1)
y_test = load_data(
    glob.glob(
        os.path.join(data_folder, "**/t10k-labels-idx1-ubyte.gz"), recursive=True
    )[0],
    True,
).reshape(-1)


# now let's show some randomly chosen images from the traininng set.
count = 0
sample_size = 30
plt.figure(figsize=(16, 6))
for i in np.random.permutation(X_train.shape[0])[:sample_size]:
    count = count + 1
    plt.subplot(1, sample_size, count)
    plt.axhline("")
    plt.axvline("")
    plt.text(x=10, y=-10, s=y_train[i], fontsize=18)
    plt.imshow(X_train[i].reshape(28, 28), cmap=plt.cm.Greys)
plt.show()
```
The code above displays a random set of images with their labels, similar to this:

:::image type="content" source="media/tutorial-train-deploy-notebook/image-data-with-labels.png" alt-text="Sample images with their labels.":::

## Train model and log metrics with MLflow

You'll train the model using the code below. Note that you are using MLflow autologging to track metrics and log model artifacts.

You'll be using the [LogisticRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html) classifier from the [SciKit Learn framework](https://scikit-learn.org/) to classify the data.

> [!NOTE]
> The model training takes approximately 2 minutes to complete.**


```python
# create the model
import mlflow
import numpy as np
from sklearn.linear_model import LogisticRegression
from azureml.core import Workspace

# connect to your workspace
ws = Workspace.from_config()

# create experiment and start logging to a new run in the experiment
experiment_name = "azure-ml-in10-mins-tutorial"

# set up MLflow to track the metrics
mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
mlflow.set_experiment(experiment_name)
mlflow.autolog()

# set up the Logistic regression model
reg = 0.5
clf = LogisticRegression(
    C=1.0 / reg, solver="liblinear", multi_class="auto", random_state=42
)

# train the model
with mlflow.start_run() as run:
    clf.fit(X_train, y_train)
```

## View experiment

In the left-hand menu in Azure Machine Learning studio, select __Jobs__ and then select your job (__azure-ml-in10-mins-tutorial__). A job is a grouping of many runs from a specified script or piece of code.  Multiple jobs can be grouped together as an experiment.

Information for the run is stored under that job. If the name doesn't exist when you submit a job, if you select your run you will see various tabs containing metrics, logs, explanations, etc.

## Version control your models with the model registry

You can use model registration to store and version your models in your workspace. Registered models are identified by name and version. Each time you register a model with the same name as an existing one, the registry increments the version. The code below registers and versions the model you trained above. Once you have executed the code cell below you will be able to see the model in the registry by selecting __Models__ in the left-hand menu in Azure Machine Learning studio.

```python
# register the model
model_uri = "runs:/{}/model".format(run.info.run_id)
model = mlflow.register_model(model_uri, "sklearn_mnist_model")
```

## Deploy the model for real-time inference

In this section you learn how to deploy a model so that an application can consume (inference) the model over REST.

### Create deployment configuration

The code cell gets a _curated environment_, which specifies all the dependencies required to host the model (for example, the packages like scikit-learn). Also, you create a _deployment configuration_, which specifies the amount of compute required to host the model. In this case, the compute will have 1CPU and 1GB memory.


```python
# create environment for the deploy
from azureml.core.environment import Environment
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.webservice import AciWebservice

# get a curated environment
env = Environment.get(
    workspace=ws, 
    name="AzureML-sklearn-0.24.1-ubuntu18.04-py37-cpu-inference",
    version=1
)
env.inferencing_stack_version='latest'

# create deployment config i.e. compute resources
aciconfig = AciWebservice.deploy_configuration(
    cpu_cores=1,
    memory_gb=1,
    tags={"data": "MNIST", "method": "sklearn"},
    description="Predict MNIST with sklearn",
)
```

### Deploy model

This next code cell deploys the model to Azure Container Instance.

> [!NOTE]
> The deployment takes approximately 3 minutes to complete.**


```python
%%time
import uuid
from azureml.core.model import InferenceConfig
from azureml.core.environment import Environment
from azureml.core.model import Model

# get the registered model
model = Model(ws, "sklearn_mnist_model")

# create an inference config i.e. the scoring script and environment
inference_config = InferenceConfig(entry_script="score.py", environment=env)

# deploy the service
service_name = "sklearn-mnist-svc-" + str(uuid.uuid4())[:4]
service = Model.deploy(
    workspace=ws,
    name=service_name,
    models=[model],
    inference_config=inference_config,
    deployment_config=aciconfig,
)

service.wait_for_deployment(show_output=True)
```

The scoring script file referenced in the code above can be found in the same folder as this notebook, and has two functions:

1. An `init` function that executes once when the service starts - in this function you normally get the model from the registry and set global variables
1. A `run(data)` function that executes each time a call is made to the service. In this function, you normally format the input data, run a prediction, and output the predicted result.

### View endpoint

Once the model has been successfully deployed, you can view the endpoint by navigating to __Endpoints__ in the left-hand menu in Azure Machine Learning studio. You will be able to see the state of the endpoint (healthy/unhealthy), logs, and consume (how applications can consume the model).

## Test the model service

You can test the model by sending a raw HTTP request to test the web service.


```python
# send raw HTTP request to test the web service.
import requests

# send a random row from the test set to score
random_index = np.random.randint(0, len(X_test) - 1)
input_data = '{"data": [' + str(list(X_test[random_index])) + "]}"

headers = {"Content-Type": "application/json"}

resp = requests.post(service.scoring_uri, input_data, headers=headers)

print("POST to url", service.scoring_uri)
print("label:", y_test[random_index])
print("prediction:", resp.text)
```

## Clean up resources

If you're not going to continue to use this model, delete the Model service using:

```python
# if you want to keep workspace and only delete endpoint (it will incur cost while running)
service.delete()
```

If you want to control cost further, stop the compute instance by selecting the "Stop compute" button next to the **Compute** dropdown.  Then start the compute instance again the next time you need it.

### Delete everything

Use these steps to delete your Azure Machine Learning workspace and all compute resources.

[!INCLUDE [aml-delete-resource-group](../includes/aml-delete-resource-group.md)]


## Next steps

+ Learn about all of the [deployment options for Azure Machine Learning](../how-to-deploy-online-endpoints.md).
+ Learn how to [authenticate to the deployed model](../how-to-authenticate-online-endpoint.md).
+ [Make predictions on large quantities of data](../tutorial-pipeline-batch-scoring-classification.md) asynchronously.
+ Monitor your Azure Machine Learning models with [Application Insights](how-to-enable-app-insights.md).
