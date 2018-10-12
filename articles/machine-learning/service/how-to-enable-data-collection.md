---
title: Enable data collection for models in production - Azure Machine Learning
description: Learn how to collect Azure Machine Learning input model data in an Azure Blob storage.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: marthalc
author: marthalc
ms.date: 09/24/2018
---
# Collect data for models in production

In this article, you can learn how to collect input model data from the Azure Machine Learning services you've deployed into Azure Kubernetes Cluster (AKS) into an Azure Blob storage. 

Once enabled, this data you collect helps you:
* Monitor data drifts as production data enters your model

* Make better decisions on when to retrain or optimize your model

* Retrain your model with the data collected

## What is collected and where does it go?

The following data can be collected:
* Model **input** data from web services deployed in Azure Kubernetes Cluster (AKS)
  (Voice, images, and video are **not** collected) 
  
* Model predictions using production input data.

> [!Note]
> Pre-aggregation or pre-calculations on this data are not part of the service at this time.   

The output gets saved in an Azure Blob. Since the data gets added into an Azure Blob, you can then choose your favorite tool to run the analysis. 

The path to the output data in the blob follows this syntax:

```
/modeldata/<subscriptionid>/<resourcegroup>/<workspace>/<webservice>/<model>/<version>/<identifier>/<year>/<month>/<day>/data.csv
# example: /modeldata/1a2b3c4d-5e6f-7g8h-9i10-j11k12l13m14/myresourcegrp/myWorkspace/aks-w-collv9/best_model/10/inputs/2018/12/31/data.csv
```

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An Azure Machine Learning service workspace, a local directory containing your scripts, and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [How to configure a development environment](how-to-configure-environment.md) document.

- A trained machine learning model to be deployed to Azure Kubernetes Service (AKS). If you don't have one, see the [train image classification model](tutorial-train-models-with-aml.md) tutorial.

- An [AKS cluster](how-to-deploy-to-aks.md).

- The following dependencies and module installed [in your environment](how-to-configure-environment.md):
  + On Linux:
    ```shell
    sudo apt-get install libxml++2.6-2v5
    pip install azureml-monitoring
    ```

  + On Windows:
    ```shell
    pip install azureml-monitoring
    ```

## Enable data collection
Data collection can be enabled regardless of the model being deployed through Azure Machine Learning Service or other tools. 

To enable it, you need to:

1. Open the scoring file. 

1. Add the following code at the top of the file:

   ```python 
   from azureml.monitoring import ModelDataCollector
   ```

2. Declare your data collection variables in your `init()` function:

    ```python
    global inputs_dc, prediction_dc
    inputs_dc = ModelDataCollector("best_model", identifier="inputs", feature_names=["feat1", "feat2", "feat3". "feat4", "feat5", "feat6"])
    prediction_dc = ModelDataCollector("best_model", identifier="predictions", feature_names=["prediction1", "prediction2"])
    ```

    *CorrelationId* is an optional parameter, you do not need to set it up if your model doesn’t require it. Having a correlationId in place does help you for easier mapping with other data. (Examples include: LoanNumber, CustomerId, etc.)
    
    *Identifier* is later used for building the folder structure in your Blob, it can be used to divide “raw” data versus “processed”.

3.	Add the following lines of code to the `run(input_df)` function:

    ```python
    data = np.array(data)
    result = model.predict(data)
    inputs_dc.collect(data) #this call is saving our input data into Azure Blob
    prediction_dc.collect(result) #this call is saving our input data into Azure Blob
    ```

4. Data collection is **not** automatically set to **true** when you deploy a service in AKS, so you must update your configuration file such as: 

    ```python
    aks_config = AksWebservice.deploy_configuration(collect_model_data=True)
    ```
    AppInsights for service monitoring can also be turned on by changing this configuration:
    ```python
    aks_config = AksWebservice.deploy_configuration(collect_model_data=True, enable_app_insights=True)
    ``` 

5. [Create new image and deploy your service.](how-to-deploy-to-aks.md) 


If you already have a service with the dependencies installed in your **environment file** and **scoring file**, enable data collection by:

1. Go to  [Azure Portal](https://portal.azure.com).

1. Open your workspace.

1. Go to **Deployments** -> **Select service** -> **Edit**.

   ![Edit Service](media/how-to-enable-data-collection/EditService.png)

1. In **Advanced Settings**, deselect **Enable Model data collection**. 

   ![Uncheck Data Collection](media/how-to-enable-data-collection/CheckDataCollection.png)

   In this window, you can also choose to "Enable Appinsights diagnostics" to track the health of your service.  

1. Select **Update** to apply the change.


## Disable data collection
You can stop collecting data any time. Use Python code or the Azure portal to disable data collection.

+ Option 1 - Disable in the Azure portal: 
  1. Sign in to [Azure portal](https://portal.azure.com).

  1. Open your workspace.

  1. Go to **Deployments** -> **Select service** -> **Edit**.

     ![Edit Service](media/how-to-enable-data-collection/EditService.png)

  1. In **Advanced Settings**, deselect **Enable Model data collection**. 

     ![Uncheck Data Collection](media/how-to-enable-data-collection/UncheckDataCollection.png) 

  1. Select **Update** to apply the change.

* Option 2 - Use Python to disable data collection:

  ```python 
  ## replace <service_name> with the name of the web service
  <service_name>.update(collect_model_data=False)
  ```

## Example notebook

The [00.Getting Started/12.enable-data-collection-for-models-in-aks.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/01.getting-started/12.enable-data-collection-for-models-in-aks) notebook demonstrates concepts in this article.  

Get this notebook:
 
[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]