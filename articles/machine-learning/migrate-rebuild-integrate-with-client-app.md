---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Consume pipeline endpoints'
description: Integrate pipeline endpoints with client applications in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio-classic
ms.topic: how-to

author: xiaoharper
ms.author: zhanxia
ms.date: 03/08/2021
---

# Consume pipeline endpoints from client applications

In this article, you learn how to integrate client applications with Azure Machine Learning endpoints. For more information on writing application code, see [Consume an Azure Machine Learning endpoint](how-to-consume-web-service.md).

This article is part of the Studio (classic) to Azure Machine Learning migration series. For more information on migrating to Azure Machine Learning, see [the migration overview article](migrate-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. [Create an Azure Machine Learning workspace](how-to-manage-workspace.md#create-a-workspace).
- An [Azure Machine Learning real-time endpoint or pipeline endpoint](migrate-rebuild-web-service.md).


## Consume a real-time endpoint 

If you deployed your model as a **real-time endpoint**, you can find its REST endpoint, and pre-generated consumption code in C#, Python, and R:

1. Go to Azure Machine Learning studio ([ml.azure.com](https://ml.azure.com)).
1. Go the **Endpoints** tab.
1. Select your real-time endpoint.
1. Select **Consume**.

> [!NOTE]
> You can also find the Swagger specification for your endpoint in the **Details** tab. Use the Swagger definition to understand your endpoint schema. For more information on Swagger definition, see [Swagger official documentation](https://swagger.io/docs/specification/2-0/what-is-swagger/).


## Consume a pipeline endpoint

There are two ways to consume a pipeline endpoint:

- REST API calls
- Integration with Azure Data Factory

### Use REST API calls

Call the REST endpoint from your client application. You can use the Swagger specification for your endpoint to understand its schema:

1. Go to Azure Machine Learning studio ([ml.azure.com](https://ml.azure.com)).
1. Go the **Endpoints** tab.
1. Select **Pipeline endpoints**.
1. Select your pipeline endpoint.
1. In the **Pipeline endpoint overview** pane, select the link under **REST endpoint documentation**.

### Use Azure Data Factory

You can call your Azure Machine Learning pipeline as a step in an Azure Data Factory pipeline. For more information, see [Execute Azure Machine Learning pipelines in Azure Data Factory](../data-factory/transform-data-machine-learning-service.md).


## Next steps

In this article, you learned how to find schema and sample code for your pipeline endpoints. For more information on consuming endpoints from the client application, see [Consume an Azure Machine Learning endpoint](how-to-consume-web-service.md).

See the rest of the articles in the Azure Machine Learning migration series: 
1. [Migration overview](migrate-overview.md).
1. [Migrate dataset](migrate-register-dataset.md).
1. [Rebuild a Studio (classic) training pipeline](migrate-rebuild-experiment.md).
1. [Rebuild a Studio (classic) web service](migrate-rebuild-web-service.md).
1. **Integrate an Azure Machine Learning web service with client apps**.
1. [Migrate Execute R Script](migrate-execute-r-script.md).