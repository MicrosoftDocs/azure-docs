---
title: Enable data collection for models in production
description: Learn how to collect Azure Machine Learning input model data in an Azure Blob storage.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: marthalc
author: marthalc
ms.date: 09/17/2018
---
# Collect data for models in production

With this article, you can learn how to collect input model data from your Azure Machine Learning service in an Azure Blob storage. Once enabled, this data collected gives you the opportunity to:
* Monitor data drifts as production data enters your model
* Make better decisions on when to retrain or optimize your model
* Retrain your model with the data collected

## What data is collected?
* Model **input** data (voice, images, and video are **not** supported) from services deployed in Azure Kubernetes Cluster (AKS)
* Model predictions using production input data.

**Note:** pre-aggregation or pre-calculations on this data are done by user and not included in this version of the product.   

## Prerequisites
1.	Set up a [workspace](https://review.docs.microsoft.com/en-us/azure/machine-learning/service/quickstart-get-started?branch=release-ignite-aml)
2.	Have a model [ready to be deployed](https://review.docs.microsoft.com/en-us/azure/machine-learning/service/how-to-deploy-to-aks) in an Azure Kubernetes Service (AKS) and an AKS cluster ready.
3.	Install dependencies and collector module [in your environment](https://review.docs.microsoft.com/en-us/azure/machine-learning/service/how-to-configure-environment?branch=release-ignite-aml):
    * LINUX:

          sudo apt-get install libxml++2.6-2v5

          pip install azureml-monitoring
    * Windows: 
          
          pip install azureml-monitoring 

## Enable data collection
Data collection can be enabled regardless of the model being deployed through Azure Machine Learning Service or other tools. To enable it, within the **score file**, you need to:
1.	Add the following code at the top of the file:

      ```python 
    from azureml.monitoring import ModelDataCollector
    ```
2.	Declare your data collection variables in your `init()` function

    ```python
    global inputs_dc, prediction_dc
    inputs_dc = ModelDataCollector("best_model", identifier="inputs", feature_names=["feat1", "feat2", "feat3". "feat4", "feat5", "feat6"])
    prediction_dc = ModelDataCollector("best_model", identifier="predictions", feature_names=["prediction1", "prediction2"])
    ```

    *CorrelationId* is an optional parameter, you do not need to set it up if your model doesn’t require it. Having a correlationId in place does help you for easier mapping with other data. (Examples include: LoanNumber, CustomerId, etc.)
    
    *Identifier* is later used for building the folder structure in your Blob, it can be used to divide “raw” data versus “processed”.

3.	Add the following lines of code to the `run(input_df)` function

    ```python
    data = np.array(data)
    result = model.predict(data)
    inputs_dc.collect(data) #this call is saving our input data into Azure Blob
    prediction_dc.collect(result) #this call is saving our input data into Azure Blob
    ```

4. Data collection is **not** automatically set to **true** when you deploy a service in AKS, so you will need to update your configuration file like the following: 

    ```python
    aks_config = AksWebservice.deploy_configuration(collect_model_data=True)
    ```
    AppInsights for service monitoring can also be turned on by changing this configuration:
    ```python
    aks_config = AksWebservice.deploy_configuration(collect_model_data=True, enable_app_insights=True)
    ``` 

5. [Create new image and deploy your service.](https://review.docs.microsoft.com/en-us/azure/machine-learning/service/how-to-deploy-to-aks) 

If you already have a service with the dependencies installed in your **environment file** and **scoring file**, enable data collection by:

1. Go to  [Azure Portal](https://portal.azure.com) 
2. Go to Workspace-> Deployments -> Edit
![Edit Service](media/how-to-enable-data-collection/EditService.png)
3. In Advanced Settings check "Enable Model data collection". 
![Uncheck Data Collection](media/how-to-enable-data-collection/CheckDataCollection.png)

    In this window, you can also choose to "Enable Appinsights diagnostics" to track the health of your service.  
4. At the bottom of the page click "Update"

The `00.Getting Started/12.enable-data-collection-for-models-in-aks.ipynb` notebook demonstrates concepts in this article.  Get this notebook:
 
[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]



## Evaluate data
The output gets saved in an Azure Blob using the following path format:
	
    /modeldata/<subscriptionid>/<resourcegroupname>/<workspacename>/<webservicename>/<modelname>/<modelversion>/<identifier>/<year>/<month>/<day>/data.csv

Since the data gets added into an Azure Blob, you can then choose your favorite tool to run the analysis. 

## Disable data collection
To disable data collection, follow the next steps:
* Disable in the [Azure Portal](https://portal.azure.com): 
    1. Go to Workspace
    2. Deployments-> Select service-> Edit

    ![Edit Service](media/how-to-enable-data-collection/EditService.png)

    3. In Advanced Settings uncheck "Enable Model data collection" 

    ![Uncheck Data Collection](media/how-to-enable-data-collection/UncheckDataCollection.png) 

    4. Update       

* Disable using python:
         
     ```python 
    <service_name>.update(collect_model_data=False)
     ```

