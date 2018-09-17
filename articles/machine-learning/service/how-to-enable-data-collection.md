---
title: Enable Data Collection for models in production
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
# Data Collection for Models in Production

With this article, you can learn how to collect input model data from your Azure Machine Learning service in an Azure Blob storage. Once enabled, this data collected gives you the opportunity to:
* Monitor data drifts as production data enters your model
* Make better decisions on when to retrain or optimize your model
* Retrain your model with the data collected

## What data is collected?
* Model **input** data (voice, images, and video are **not** supported) from services deployed in Azure Kubernetes Cluster (AKS)
* Model predictions using production input data.

**Note:** pre-aggregation or pre-calculations on this data are done by user and not included in this version of the product.   

## Prerequisites
1.	Set up a workspace
2.	Have a model ready to be deployed in an Azure Kubernetes Service (AKS) and an AKS cluster ready.
3.	Install dependencies and collector module in your environment:
    * LINUX:

          sudo apt-get install libxml++2.6-2v5

          pip install azureml-monitoring
    * Windows: 
          
          pip install azureml-monitoring 

## Enable Data Collection
Data Collection can be enabled regardless of the model being deployed through Azure Machine Learning Service or other tools. To enable it, within the **score file**, you need to:
1.	Add the following code at the top of the file:

        from azureml.monitoring import ModelDataCollector
2.	Declare your Data Collection variables in your `init()` function

        global inputs_dc, prediction_dc
        inputs_dc = ModelDataCollector("best_model", identifier="inputs", feature_names=["feat1", "feat2", "feat3". "feat4", "feat5", "feat6"])
        prediction_dc = ModelDataCollector("best_model", identifier="predictions", feature_names=["prediction1", "prediction2"])
       *CorrelationId* is an optional parameter, you do not need to set it up if your model doesn’t require it. Having a correlationId in place does help you for easier mapping with other data. (Examples include: LoanNumber, CustomerId, etc.)
    
    *Identifier* is later used for building the folder structure in your Blob, it can be used to divide “raw” data versus “processed”.

3.	Add the following lines of code to the `run(input_df)` function

        data = np.array(data)
        result = model.predict(data)
        inputs_dc.collect(data) #this call is saving our input data into Azure Blob
        prediction_dc.collect(result) #this call is saving our input data into Azure Blob

4. Data collection is **not** automatically set to **true** when you deploy a service in AKS, so you will need to update set your configuration file like the following: 

        aks_config = AksWebservice.deploy_configuration(collect_model_data=True)

5. Rebuild your image and redeploy your service. 

6. Alternatively, if you already have a service with the dependencies installed in your **environment file** and **scoring file**, you can simply enable Data Collection by:

    1. Go to your the [Azure Portal](https://portal.azure.com) 
    2. Go to your Workspace-> Deployments -> Edit
    ![Edit Service](media/how-to-enable-data-collection/EditService.png)
    3. In Advanced Settings check "Enable Model data collection" 
    ![Un-check Data Collection](media/how-to-enable-data-collection/CheckDataCollection.png) 
    4. Update

For a step by step tutorial follow the notebook [here](link to notebook). 


## Evaluate Data
The output gets saved in an Azure Blob using the following path format:
	
    /modeldata/<subscriptionid>/<resourcegroupname>/<workspacename>/<webservicename>/<modelname>/<modelversion>/<identifier>/<year>/<month>/<day>/data.csv

Since the data gets added into an Azure Blob you can then choose your favorite tool to run the analysis. 

## Disable Data Collection
To disable Data Collection, follow the next steps:
* From [Azure Portal](https://portal.azure.com): 
    1. Go to Workspace
    2. Deployments-> Select service-> Edit

    ![Edit Service](media/how-to-enable-data-collection/EditService.png)

    3. In Advanced Settings un-check "Enable Model data collection" 

    ![Un-check Data Collection](media/how-to-enable-data-collection/UncheckDataCollection.png) 

    4. Update       

* From Azure SDK run:
         
        <service_name>.update(collect_model_data=False)

