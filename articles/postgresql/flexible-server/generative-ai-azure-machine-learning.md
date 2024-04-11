---
title: Invoke Azure Machine Learning models from Azure Database for PostgreSQL
description: Real-time scoring with online inference endpoints on Azure Machine Learning from Azure Database for PostgreSQL.
author: denzilribeiro
ms.author: denzilr
ms.reviewer: maghan
ms.date: 03/18/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
#customer intent: As a developer, I want to learn how to invoke Azure Machine Learning models from Azure Database for PostgreSQL, so that I can perform real-time scoring with online inference endpoints.
---

# Integrate Azure Database for PostgreSQL with Azure Machine Learning Services (Preview)

Azure AI extension gives the ability to invoke any machine learning models deployed on [Azure Machine Learning online endpoints](../../machine-learning/concept-endpoints-online.md) from within SQL. These might be models from the Azure Machine Learning catalog or custom models that are trained and deployed.

## Prerequisites

- [Enable and configure](generative-ai-azure-overview.md#enable-the-azure_ai-extension) the `azure_ai` extension.
- Create a machine learning workspace and [deploy a model with an online endpoint](../../machine-learning/how-to-deploy-online-endpoints.md) using CLI, Python, or Azure Machine Learning studio or [deploy an mlflow model to an online endpoint](../../machine-learning/how-to-deploy-mlflow-models-online-endpoints.md).
- Make sure that the status of the deployment to ensure the model was deployed successfully and test the model invoking the endpoint to ensure the model runs successfully.
- Get the [URI](../../machine-learning/how-to-authenticate-online-endpoint.md#get-the-scoring-uri-for-the-endpoint) and the [Key](../../machine-learning/how-to-authenticate-online-endpoint.md#get-the-key-or-token-for-data-plane-operations), which are needed to configure the extension to communicate with Azure Machine Learning.

> [!NOTE]  
> You can explore Azure Machine Learning [samples](https://github.com/Azure/azureml-examples).

## Configure Azure Machine Learning endpoint

In the Azure Machine Learning studio, under **Endpoints** > **Pick your endpoint** > **Consume** you can find the endpoint URI and Key for the online endpoint. Use these values to configure the `azure_ai` extension to use the online inferencing endpoint.

```postgresql
select azure_ai.set_setting('azure_ml.scoring_endpoint','<URI>');
select azure_ai.set_setting('azure_ml.endpoint_key', '<Key>');
```

### `azure_ml.inference`

Scores the input data invoking an Azure Machine Learning model deployment on an [online endpoint](../../machine-learning/how-to-authenticate-online-endpoint.md).

```postgresql
azure_ml.inference(input_data jsonb, timeout_ms integer DEFAULT NULL, throw_on_error boolean DEFAULT true, deployment_name text DEFAULT NULL)
```

#### Arguments

##### `input_data`

`jsonb` json containing the request payload for the model.

##### `timeout_ms`

`integer DEFAULT NULL` timeout in milliseconds after which the operation is stopped. The deployment of a model itself can have a timeout specified that is a lower value than the timeout parameter in the user defined function. If this timeout is exceeded, the scoring operation would fail.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `deployment_name`

`text` name of the deployment corresponding to the model deployed on the Azure Machine Learning online inference endpoint

#### Return type

`jsonb` scoring output for the model that was invoked in JSONB.

## Examples

### Invoke the machine learning model

This calls the model with the input_data and returns a jsonb payload.

```postgresql
-- Invoke model, input data depends on the model.
  SELECT * FROM azure_ml.inference('
  {
    "input_data": [
      [1,2,3,4,5,6,7,8],
      [-1,-2,-3,-4,-5,-6,-7,-8]
    ],
    "params": {}
  }', deployment_name=>'Housingprediction' )

-- Get JSON elements from model output
SELECT jsonb_array_elements(inference.inference) as MedianHousePrediction
FROM azure_ml.inference('
{
  "input_data": [
    [1,2,3,4,5,6,7,8],
    [-1,-2,-3,-4,-5,-6,-7,-8]
  ],
 "params": {}
}', deployment_name=>'Housingprediction' )
```

## Related content

- [Learn more about Azure Open AI integration](generative-ai-azure-openai.md)
- [Learn more about Azure AI Language Services integration](generative-ai-azure-cognitive.md)
