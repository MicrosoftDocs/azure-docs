---
title: 'ML Studio (classic): Migrate to Azure Machine Learning'
description: describe how to migrate ML Studio classic projects to Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: xiaoharper
ms.author: zhanxia
ms.date: 11/27/2020
---

# Migrate to Azure Machine Learning from Studio (classic)

In this article, you learn how to migrate Studio (classic) assets to Azure Machine Learning.



## Migration overview

At this time, to migrate resources from Studio (classic) to Azure Machine Learning, you must manually rebuild your experiments.

To rebuild your Studio (classic) experiments and web services, you must:

1. [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md#create-a-workspace).

1. [Rebuild the training experiment using drag-and-drop modules](migrate-rebuild-experiment.md).
    - Recreate the dataset in Azure Machine Learning.
    - Use the [module-mapping table](migrate-reference.md#studio-classic-and-designer-module-mapping) to select replacement modules.
        
1. [Rebuild the web service](migrate-rebuild-web-service.md).

1. [Integrate the web service with client apps](migrate-rebuild-integrate-with-client-app.md).


## Example migration

See a basic experiment migration to compare some of the differences between Studio (classic) and Azure Machine Learning. We use the Automobile price prediction sample included in both services.

### Datasets

In Studio (classic), **datasets** were saved in your workspace and could only be used by Studio (classic).

![automobile-price-classic-dataset](./media/migrate-overview/studio-classic-dataset.png)

In Azure Machine Learning, **datasets** are registered to the workspace and can be used across all of Azure Machine Learning. For more information on the benefits of Azure Machine Learning datasets, see [Secure data access](../concept-data.md#reference-data-in-storage-with-datasets).

![automobile-price-aml-dataset](./media/migrate-overview/aml-dataset.png)

### Pipeline

In Studio (classic), **experiments** contained the processing logic for your work. You created experiments with drag-and-drop modules.


![automobile-price-classic-experiment](./media/migrate-overview/studio-classic-experiment.png)

In Azure Machine Learning, **pipelines** contain the processing logic for your work. You can create pipelines with either drag-and-drop modules or by writing code.

![automobile-price-aml-pipeline](./media/migrate-overview/aml-pipeline.png)

### Web service endpoint

In Studio (classic), the **REQUEST/RESPOND API** was used for real-time prediction. The **BATCH EXECUTION API** was used for batch prediction or retraining.

![automobile-price-classic-webservice](./media/migrate-overview/studio-classic-web-service.png)

In Azure Machine Learning, **real-time endpoints** are used for real-time prediction. **Pipeline endpoints** are used for  batch prediction or retraining.

![automobile-price-aml-endpoint](./media/migrate-overview/aml-endpoint.png)


## Next steps

See detailed steps on how to migrate from Studio (classic) to Azure Machine Learning:

1. [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md#create-a-workspace).
1. [Rebuild the training pipeline](migrate-rebuild-experiment.md).
1. [Rebuild the web service](migrate-rebuild-web-service.md).
1. [Integrate web service with client app](migrate-rebuild-integrate-with-client-app.md).






