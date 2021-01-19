---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Integrate web service with client app'
description: describe how to integrate web service with client app Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: zhanxia
ms.author: zhanixa
ms.date: 1/19/2020
---

# Integrate web service with client app

Following previous steps, we already have the REST endpoint by deploying a model or publishing a pipeline. The last step of the migration is integrate the REST endpoint with client app, so you can consume the model/pipeline through REST call.  


## Realtime endpoint 

You can call the real-time endpoint to make real time predictions. In Azure Machine Learning Studio, there is sample consumption code Under **Endpoints -> Consume** tab.

![realtime-endpoint-sample-code](./media/migrate-to-AML/realtime-sample-code.png)  


There is Swagger URI for the real time endpoint in the **Endpoints -> Details** tab. You can refer to the swagger to understand the endpoint schema.

![realtime-swagger](./media/migrate-to-AML/realtime-swagger.png)
 


## Pipeline endpoint

You can consume the pipeline endpoint for retraining or batch prediction purpose. There are two possible approaches to consume the pipeline endpoint - through REST call or through integration with Azure Data Factory.

**REST call**

After publish the pipeline, there will be a swagger as the endpoint documentation. Check the swagger to learn how to call the endpoint.
![pipeline-endpoint-swagger](./media/migrate-to-AML/pipeline-endpoint-swagger.png) 

**Integrate with Azure Data Factory**

You can run your machine learning pipeline as a step in Azure Data Factory pipeline for batch prediction scenarios.Check [Execute Azure Machine Learning pipelines in Azure Data Factory](../../data-factory/transform-data-machine-learning-service.md) to learn how. 
