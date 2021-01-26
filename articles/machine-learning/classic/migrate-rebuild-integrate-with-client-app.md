---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Integrate web service with client app'
description: describe how to integrate web service with client app Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: xiaoharper
ms.author: zhanxia
ms.date: 1/19/2020
---

# Integrate web service with client app

In this article, you learn how to integrate client applications with Azure Machine Learning endpoints. For more information on migrating from Studio (classic), see [the migration overview article](migrate-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md#create-a-workspace).
- An [Azure Machine Learning real-time endpoint or pipeline endpoint](migrate-rebuild-web-services.md).


## Consume a real-time endpoint 

If your model is deployed as a **real-time endpoint**, you can find automatically generated sample code in C#, Python, and R:

1. Go to Azure Machine Learning studio ([ml.azure.com](https://ml.azure.com)).
1. Go the **Endpoints** tab.
1. Select your real-time endpoint.
1. Select **Consume**.

Here, you can find your REST endpoint and sample code to use in your applications.


![Screenshot showing real-time sample integration code](./media/migrate-to-AML/realtime-sample-code.png)  


> [!NOTE]
> You can also find a Swagger URI for your real-time endpoint in the **Details** tab. You can refer to the swagger to understand the endpoint schema.

![Screenshot showing the swagger URI location in the Details tab](./media/migrate-to-AML/realtime-swagger.png)
 


## Pipeline endpoint

You can consume the pipeline endpoint for retraining or batch prediction purpose. There are two possible approaches to consume the pipeline endpoint - through REST call or through integration with Azure Data Factory.

**REST call**

After publish the pipeline, there will be a swagger as the endpoint documentation. Check the swagger to learn how to call the endpoint.
![Screenshot showing the swagger URI location for pipeline endpoints](./media/migrate-to-AML/pipeline-endpoint-swagger.png) 

**Integrate with Azure Data Factory**

You can run your machine learning pipeline as a step in Azure Data Factory pipeline for batch prediction scenarios.Check [Execute Azure Machine Learning pipelines in Azure Data Factory](../../data-factory/transform-data-machine-learning-service.md) to learn how. 
