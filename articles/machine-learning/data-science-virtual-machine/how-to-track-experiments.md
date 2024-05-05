---
title: Experiment tracking and deploying models
titleSuffix: Azure Data Science Virtual Machine
description: Learn how to track and log experiments from the Data Science Virtual Machine with Azure Machine Learning and/or MLFlow.
services: machine-learning
ms.service: data-science-vm
ms.custom: sdkv1
author: samkemp
ms.author: samkemp
ms.topic: conceptual
ms.reviewer: franksolomon
ms.date: 04/23/2024
---

# Track experiments and deploy models in Azure Machine Learning

In this article, learn how to add logging code to your training script with the [MLflow](https://mlflow.org/) API and track the experiment in Azure Machine Learning. You can monitor run metrics, to enhance the model creation process.

This diagram shows that with MLflow Tracking, you track the run metrics of an experiment, and store model artifacts in your Azure Machine Learning workspace:

:::image type="content" source="./media/how-to-track-experiments/mlflow-diagram-track.png" alt-text="Diagram showing the MLflow operational concept." lightbox= "./media/how-to-track-experiments/mlflow-diagram-track.png":::

## Prerequisites

* [Provision an Azure Machine Learning Workspace](../how-to-manage-workspace.md#create-a-workspace)

## Create a new notebook

The Azure Machine Learning and MLFlow SDK are preinstalled on the Data Science Virtual Machine (DSVM). You can access these resources in the **azureml_py36_\*** conda environment. In JupyterLab, select on the launcher and select this kernel:

:::image type="content" source="./media/how-to-track-experiments/experiment-tracking-1.png" alt-text="Screenshot showing selection of the azureml_py36_pytorch kernel." lightbox= "./media/how-to-track-experiments/experiment-tracking-1.png":::

## Set up the workspace

Go to the [Azure portal](https://portal.azure.com) and select the workspace you provisioned as part of the prerequisites. Note the __Download config.json__ configuration file, as shown in the next image. Download this file, and store it in your working directory on the DSVM.

:::image type="content" source="./media/how-to-track-experiments/experiment-tracking-2.png" alt-text="Screenshot showing download of the config.json file." lightbox= "./media/how-to-track-experiments/experiment-tracking-2.png":::

The config file contains workspace name, subscription, etc. information. You don't need to hard code these parameters with this file.

## Track DSVM runs

To set the Azure Machine Learning workspace object, add this code to your notebook or script:

```Python
import mlflow
from azureml.core import Workspace

ws = Workspace.from_config()

mlflow.set_tracking_uri(ws.get_mlflow_tracking_uri())
```

> [!NOTE]
> The tracking URI is valid for up to one hour. If you restart your script after some idle time, use the get_mlflow_tracking_uri API to get a new URI.

### Load the data

This example uses the diabetes dataset, a well-known small dataset included with scikit-learn. This cell loads the dataset and splits it into random training and testing sets.

```python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
import joblib

X, y = load_diabetes(return_X_y = True)
columns = ['age', 'gender', 'bmi', 'bp', 's1', 's2', 's3', 's4', 's5', 's6']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
data = {
    "train":{"X": X_train, "y": y_train},
    "test":{"X": X_test, "y": y_test}
}

print ("Data contains", len(data['train']['X']), "training samples and",len(data['test']['X']), "test samples")
```

### Add tracking

Add experiment tracking using the Azure Machine Learning SDK, and upload a persisted model into the experiment run record. This code sample adds logs, and uploads a model file to the experiment run. The model is also registered in the Azure Machine Learning model registry:

```python
# Get an experiment object from Azure Machine Learning
from azureml.mlflow import register_model
experiment_name = 'experiment_with_mlflow'
mlflow.set_experiment(experiment_name)

with mlflow.start_run():
    # Log the algorithm parameter alpha to the run
    mlflow.log_param('alpha', 0.03)

    # Create, fit, and test the scikit-learn Ridge regression model
    regression_model = Ridge(alpha=0.03)
    regression_model.fit(data['train']['X'], data['train']['y'])
    preds = regression_model.predict(data['test']['X'])

    # Output the Mean Squared Error to the notebook and to the run
    print('Mean Squared Error is', mean_squared_error(data['test']['y'], preds))
    mlflow.log_metric('mse', mean_squared_error(data['test']['y'], preds))

    # Save the model
    model_file_name = 'model.pkl'
    joblib.dump(value = regression_model, filename = model_file_name)

    # upload the model file explicitly into artifacts
    mlflow.log_artifact(model_file_name)
    # register the model
    register_model(mlflow.active_run(), 'diabetes_model', 'model.pkl', model_framework="ScikitLearn")
```

### View runs in Azure Machine Learning

You can view the experiment run in [Azure Machine Learning studio](https://ml.azure.com). Select __Experiments__ in the left-hand menu, and select the 'experiment_with_mlflow'. If you decided to name your experiment differently in the above snippet, select the name that you chose:

:::image type="content" source="./media/how-to-track-experiments/mlflow-experiments.png" alt-text="Screenshot showing selection of the experiment run." lightbox= "./media/how-to-track-experiments/mlflow-experiments.png":::

The logged Mean Squared Error (MSE) should become visible:

:::image type="content" source="./media/how-to-track-experiments/mlflow-experiments-2.png" alt-text="Screenshot showing the logged Mean Square Error of the experiment run." lightbox= "./media/how-to-track-experiments/mlflow-experiments-2.png":::

If you select the run, you can view other details, and the selected model, in the __Outputs+logs__.

## Deploy model in Azure Machine Learning

This section describes how to deploy models, trained on a DSVM, to Azure Machine Learning.

### Step 1: Create Inference Compute

On the left-hand menu in [Azure Machine Learning studio](https://ml.azure.com) select __Compute__, as shown in this screenshot:

:::image type="content" source="./media/how-to-track-experiments/mlflow-experiments-6.png" alt-text="Screenshot showing selection of 'Compute' in Azure Machine Learning studio." lightbox= "./media/how-to-track-experiments/mlflow-experiments-6.png":::

In the __New Inference cluster__ pane, fill in the details for

* Compute Name
* Kubernetes Service - select create new
* Select the region
* Select the virtual machine size (for the purposes of this tutorial, the default of Standard_D3_v2 is sufficient)
* Cluster Purpose - select __Dev-test__
* Number of nodes should equal __1__
* Network Configuration - Basic

as shown in this screenshot:

:::image type="content" source="./media/how-to-track-experiments/mlflow-experiments-7.png" alt-text="Screenshot showing selection of the Inference Clusters pane." lightbox= "./media/how-to-track-experiments/mlflow-experiments-7.png":::

Select __Create__.

### Step 2: Deploy no-code inference service

When we registered the model in our code using `register_model`, we specified the framework as **sklearn**. Azure Machine Learning supports no code deployments for these frameworks:

* scikit-learn
* Tensorflow SaveModel format
* ONNX model format

No-code deployment means that you can deploy straight from the model artifact. You don't need to specify any specific scoring script.

To deploy the diabetes model, go to the left-hand menu in the [Azure Machine Learning studio](https://ml.azure.com) and select __Models__. Next, select the registered diabetes_model:

:::image type="content" source="./media/how-to-track-experiments/mlflow-experiments-3.png" alt-text="Screenshot showing selection of the Diabetes Model." lightbox= "./media/how-to-track-experiments/mlflow-experiments-3.png":::

Next, select the __Deploy__ button in the model details pane:

:::image type="content" source="./media/how-to-track-experiments/mlflow-experiments-4.png" alt-text="Screenshot showing selection of the Deploy button." lightbox= "./media/how-to-track-experiments/mlflow-experiments-4.png":::

The model will deploy to the Inference Cluster (Azure Kubernetes Service) we created in step 1. Provide a name for the service, and the name of the AKS compute cluster (created in step 1), to fill in the details. We also recommend that you increase the __CPU reserve capacity__ from 0.1 to 1, and the __Memory reserve capacity__ from 0.5 to 1. Select __Advanced__ and fill in the details to set this increase. Then select __Deploy__, as shown in this screenshot:

:::image type="content" source="./media/how-to-track-experiments/mlflow-experiments-5.png" alt-text="Screenshot showing details of the model deployment." lightbox= "./media/how-to-track-experiments/mlflow-experiments-5.png":::

### Step 3: Consume

When the model successfully deploys, select Endpoints from the left-hand menu, then select the name of the deployed service. The model details pane should become visible, as shown in this screenshot:

:::image type="content" source="./media/how-to-track-experiments/mlflow-experiments-8.png" alt-text="Screenshot showing the model details pane." lightbox= "./media/how-to-track-experiments/mlflow-experiments-8.png":::

The deployment state should change from __transitioning__ to __healthy__. Additionally, the details section provides the REST endpoint and Swagger URLs that application developers can use to integrate your ML model into their apps.

You can test the endpoint with [Postman](https://www.postman.com/), or you can use the Azure Machine Learning SDK:

[!INCLUDE [SDK v1](../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core import Webservice
import json

# if you called your service differently then change the name below
service = Webservice(ws, name="diabetes-service")

input_payload = json.dumps({
    'data': X_test[0:2].tolist(),
    'method': 'predict'  # If you have a classification model, you can get probabilities by changing this to 'predict_proba'.
})

output = service.run(input_payload)

print(output)
```

### Step 4: Clean up

Delete the Inference Compute you created in Step 1, to avoid ongoing compute charges. To do this, on the left-hand menu in the Azure Machine Learning studio, select Compute > Inference Clusters > Select the specific Inference Compute Resource > Delete.

## Next Steps

* Learn more about [deploying models in Azure Machine Learning](../v1/how-to-deploy-and-where.md)
