---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Step by step guidance'
description: describe how to migrate ML Studio classic projects to Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: zhanxia
ms.author: zhanixa
ms.date: 11/27/2020
---

# Migrate to Azure Machine Learning from Studio (classic)

In this article, you learn about:
- Studio (classic) retirement road map
- How to migrate Studio (classic) assets to Azure Machine Learning


## Retirement road map

Azure Machine Learning Studio (classic) will retire on Aug 30, 2024. We encourage users to migrate to Azure Machine Learning for a modernized data science platform. To understand the benefits, see [ML Studio (classic) vs Azure Machine Learning](../overview-what-is-machine-learning-studio.md#ml-studio-classic-vs-azure-machine-learning).

 - **Current customers** can create new experiments and run existing Studio (classic) assets like experiments and web services until the retirement date.

- **New customers and new resources** like workspaces and web service plans cannot be created after Nov 31, 2021. If you plan to use a workspace or web service plan during the 3 year period to deprecation, you must create it before Nov 31, 2021.

- **Free-tier workspaces** are unaffected by retirement and can continue to be created and used without SLA commitments.


## Migration overview

At this time, migrating resources from Studio (classic) to Azure Machine Learning requires you to manually rebuild your experiments in Azure Machine Learning.

To rebuild your Studio (classic) experiments and web services you must:

1. Create the following Azure Machine Learning resources:
    - Azure Machine Learning workspace
    - Training compute target
    - Inference compute target

1. Rebuild the training experiment using drag-and-drop designer modules and datasets
    - Recreate the dataset in Azure Machine Learning
    - Use the [module-mapping table](migrate-reference.md#studio-classic-and-designer-module-mapping-table) to select replacement modules.
    - Run the experiment and tune to get model
        
1. Recreate the web service
    - Use the designer to deploy your web service as a pipeline endpoint or real-time endpoint.

1. Integrate your web service with client apps
    - Configure applications to use the new Azure Machine Learning endpoint.


Let's use [Automobile price prediction](./create-experiment.md) project as an example go give you a glance what it looks like in Azure Machine Learning after rebuild. 

### In Machine Learning Studio(classic)

In Machine Learning Studio(classic), there are there key assets for an end-to-end machine learning project- dataset, experiment and web service.

**Dataset**: The data that will be used for training. The Automobile price prediction project use a sample dataset. Your own datasets lays under **MY DATASETS** tab. 
![automobile-price-classic-dataset](./media/migrate-to-AML/classic-automobile-dataset.png)

**Experiment**: The experiment that trains a model. It's a visual graph build by modules and datasets.
![automobile-price-classic-experiment](./media/migrate-to-AML/classic-automobile.png)

**Web service**: There REQUES/RESPOND API can be used for realtime prediction. The BATCH EXECUTION API can be used for batch prediction or retraining. 
![automobile-price-classic-webservice](./media/migrate-to-AML/classic-automobile-webservice.png)


### In Azure Machine Learning

To rebuild the project, you will use several components in Azure Machine Learning and below screenshot shows what it looks like using the automobile price prediction as an example. [This tutorial](../tutorial-designer-automobile-price-train-score.md) walks through how to train a model and deploy a real-time endpoint with automobile price prediction as example.  


**Dataset**:  Dataset is the component to manage your data in Azure Machine Learning. For this example, we download the dataset from Studio(classic) and upload to Azure Machine Learning and register it as a tabular dataset.
![automobile-price-aml-dataset](./media/migrate-to-AML/automobile-aml-dataset.png)

**Designer**: Designer is the component to train the model with drag-and-drop experience and deploy the model with a few clicks. For this example, we rebuild the graph by drag and drop the dataset and modules to train a model. 
![automobile-price-aml-pipeline](./media/migrate-to-AML/aml-automobile-pipeline-draft.png)


**Real-time endpoint**: By deploy the real-time inference pipeline in designer, you will get a real-time endpoint, which can be used for real-time prediction.
![aml-automobile-realtime-endpoint](./media/migrate-to-AML/aml-automobile-realtime-endpoint.png)


**Pipeline endpoint** By publish a pipeline in designer, you will get a pipeline endpoint. Pipeline endpoint is used for batch prediction or retraining purpose.
![aml-automobile-pipeline-endpoint](./media/migrate-to-AML/aml-automobile-pipeline-endpoints.png)


**Compute**  Azure Machine Learning allows use the remote compute resources in Azure for training and inference. Compute is the component to manage your compute resources.For this example, we create a two node cpu cluster to run the training experiment.  
![aml-automobile-compute](./media/migrate-to-AML/aml-automobile-compute.png)

  




For each of the migration step, we have following articles to describe how-to in detail.   


1. [Rebuild the experiment for training](./migrate-rebuild-experiment.md)
1. [Rebuild the web service](./migrate-rebuild-web-service.md)
1. [Integrate web service with client app](./migrate-rebuild-integrate-with-client-app.md)






