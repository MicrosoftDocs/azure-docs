---
title: Invoke Azure Machine learning models from Azure Database for PostgreSQL
description: Real-time scoring with online inference endpoints on Azure Machine learning from Azure Database for PostgreSQL.
author: denzilribeiro
ms.author: denzilr
ms.date: 3/6/2024
ms.service: postgresql
ms.subservice: flexible-server
---

# Integrate Azure Database for PostgreSQL with Azure Machine Learning Services (Preview)

Azure AI extension gives the ability to invoke any machine learning models deployed on  [Azure Machine learning online endpoints](../../machine-learning/concept-endpoints-online) from within SQL. These maybe models from the Azure ML catalog or custom models that have been trained and deployed.

1. [Enable and configure](generative-ai-azure-overview.md#enable-the-azure_ai-extension) the `azure_ai` extension.
1. Create a machine learning workspace and [deploy a model with an online endpoint](../../machine-learning/how-to-deploy-online-endpoints.md) using CLI, Python or Azure ML Studio
1. Ensure the status of the deployment to ensure the model was deployed successfully and invoke the endpoint to ensure the model runs successfully.
1. Get the [URI](../../machine-learning/how-to-authenticate-online-endpoint.md#get-the-scoring-uri-for-the-endpoint) and the  [Key](../../machine-learning/how-to-authenticate-online-endpoint.md#get-the-key-or-token-for-data-plane-operations) which will be needed to configure the extension to communicate with Azure Machine learning.


## Configure Azure ML endpoint 
In the Azure Machine learning Studio , under **Endpoints** > **Pick your endpoint** > **Consume** you can find the endpoint URI and Key for the online endpoint. Use these values to configure the `azure_ai` extension to use the online inferencing endpoint.

```postgresql
select azure_ai.set_setting('azure_ml.scoring_endpoint','<URI>'); 
select azure_ai.set_setting('azure_ml.endpoint_key', '<Key>'); 
```

### `azure_ml.inference`
Scores the input data invoking an Azure ML model deployment on an [Online endpoint](../../machine-learning/how-to-authenticate-online-endpoint.md).

```postgresql
azure_ml.inference(input_data jsonb, timeout_ms integer DEFAULT NULL, throw_on_error boolean DEFAULT true, deployment_name text DEFAULT NULL)
```

#### Arguments
##### `input_data`
`jsonb` json containing the request payload for the model.

##### `timeout_ms`
`integer DEFAULT NULL` timeout in milliseconds after which the operation is stopped. The deployment of a model itself may have a timeout specified that is a lower value than the timeout parameter in the UDF. If this timeout is exceeded,  the scoring operation would timeout.

##### `throw_on_error`
`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `deployment_name`
`text` name of the deployment corresponding to the model deployed on the Azure machine learning online inference endpoint

#### Return type
`jsonb` scoring output for the model that was invoked in JSONB.


## Next steps
- [Learn more about Azure Open AI integration](./generative-ai-azure-openai.md)
- [Learn more about Azure AI Language Services integration](./generative-ai-azure-cognitive.md)
