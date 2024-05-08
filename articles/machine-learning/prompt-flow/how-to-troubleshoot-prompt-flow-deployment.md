---
title: Troubleshoot prompt flow deployments
titleSuffix: Azure Machine Learning
description: This article provides instructions on how to troubleshoot your prompt flow deployments.
manager: scottpolly
ms.service: machine-learning
ms.topic: how-to
ms.date: 04/01/2024
ms.reviewer: lagayhar
ms.author: keli19
author: likebupt
---

# Troubleshoot prompt flow deployments

This article provides instructions on how to troubleshoot your deployments from prompt flow.

## Lack authorization to perform action "Microsoft.MachineLearningService/workspaces/datastores/read"

If your flow contains Index Look Up tool, after deploying the flow, the endpoint needs to access workspace datastore to read MLIndex yaml file or FAISS folder containing chunks and embeddings. Hence, you need to manually grant the endpoint identity permission to do so.

You can either grant the endpoint identity **AzureML Data Scientist** on workspace scope, or a custom role that contains "MachineLearningService/workspace/datastore/reader" action.

## Upstream request timeout issue when consuming the endpoint

If you use CLI or SDK to deploy the flow, you may encounter timeout error. By default the `request_timeout_ms` is 5000. You can specify at max to 5 minutes, which is 300,000 ms. Following is example showing how to specify request time-out in the deployment yaml file. To learn more, see [deployment schema](../reference-yaml-deployment-managed-online.md).

```yaml
request_settings:
  request_timeout_ms: 300000
```

## OpenAI API hits authentication error

If you regenerate your Azure OpenAI key and manually update the connection used in prompt flow, you may encounter errors like "Unauthorized. Access token is missing, invalid, audience is incorrect or have expired." when invoking an existing endpoint created before key regenerating.

This is because the connections used in the endpoints/deployments won't be automatically updated. Any change for key or secrets in deployments should be done by manual update, which aims to avoid impacting online production deployment due to unintentional offline operation.

- If the endpoint was deployed in the studio UI, you can just redeploy the flow to the existing endpoint using the same deployment name.
- If the endpoint was deployed using SDK or CLI, you need to make some modification to the deployment definition such as adding a dummy environment variable, and then use `az ml online-deployment update` to update your deployment. 


## Vulnerability issues in prompt flow deployments

For prompt flow runtime related vulnerabilities, following are approaches, which can help mitigate:

- Update the dependency packages in your requirements.txt in your flow folder.
- If you're using customized base image for your flow, you need to update the prompt flow runtime to latest version and rebuild your base image, then redeploy the flow.
 
For any other vulnerabilities of managed online deployments, Azure Machine Learning fixes the issues in a monthly manner.

## "MissingDriverProgram Error" or "Could not find driver program in the request"

If you deploy your flow and encounter the following error, it might be related to the deployment environment.

```text
'error': 
{
    'code': 'BadRequest', 
    'message': 'The request is invalid.', 
    'details': 
         {'code': 'MissingDriverProgram', 
          'message': 'Could not find driver program in the request.', 
          'details': [], 
          'additionalInfo': []
         }
}
```

```text
Could not find driver program in the request
```

There are two ways to fix this error.

- (Recommended) You can find the container image uri in your custom environment detail page, and set it as the flow base image in the flow.dag.yaml file. When you deploy the flow in UI, you just select **Use environment of current flow definition**, and the backend service will create the customized environment based on this base image and `requirement.txt` for your deployment. Learn more about [the environment specified in the flow definition](how-to-deploy-for-real-time-inference.md#use-environment-of-current-flow-definition). 

    :::image type="content" source="./media/how-to-deploy-for-real-time-inference/custom-environment-image-uri.png" alt-text="Screenshot of custom environment detail page. " lightbox = "./media/how-to-deploy-for-real-time-inference/custom-environment-image-uri.png":::

    :::image type="content" source="./media/how-to-deploy-for-real-time-inference/flow-environment-image.png" alt-text="Screenshot of specifying base image in raw yaml file of the flow. " lightbox = "./media/how-to-deploy-for-real-time-inference/flow-environment-image.png":::

- You can fix this error by adding `inference_config` in your custom environment definition.

    Following is an example of customized environment definition.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
name: pf-customized-test
build:
  path: ./image_build
  dockerfile_path: Dockerfile
description: promptflow customized runtime
inference_config:
  liveness_route:
    port: 8080
    path: /health
  readiness_route:
    port: 8080
    path: /health
  scoring_route:
    port: 8080
    path: /score
```

## Model response taking too long

Sometimes, you might notice that the deployment is taking too long to respond. There are several potential factors for this to occur. 

- The model used in the flow isn't powerful enough (example: use GPT 3.5 instead of text-ada)
- Index query isn't optimized and taking too long
- Flow has many steps to process

Consider optimizing the endpoint with above considerations to improve the performance of the model.

## Unable to fetch deployment schema

After you deploy the endpoint and want to test it in the **Test tab** in the endpoint detail page, if the **Test tab** shows **Unable to fetch deployment schema**, you can try the following two methods to mitigate this issue:

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/unable-to-fetch-deployment-schema.png" alt-text="Screenshot of the error unable to fetch deployment schema in Test tab in endpoint detail page. " lightbox = "./media/how-to-deploy-for-real-time-inference/unable-to-fetch-deployment-schema.png":::

- Make sure you have granted the correct permission to the endpoint identity. Learn more about [how to grant permission to the endpoint identity](how-to-deploy-for-real-time-inference.md#grant-permissions-to-the-endpoint).
- It might be because you ran your flow in an old version runtime and then deployed the flow, the deployment used the environment of the runtime that was in old version as well. To update the runtime, follow [Update a runtime on the UI](./how-to-create-manage-runtime.md#update-a-runtime-on-the-ui) and rerun the flow in the latest runtime and then deploy the flow again.

## Access denied to list workspace secret

If you encounter an error like "Access denied to list workspace secret", check whether you have granted the correct permission to the endpoint identity. Learn more about [how to grant permission to the endpoint identity](how-to-deploy-for-real-time-inference.md#grant-permissions-to-the-endpoint).

## Next steps

- Learn more about [managed online endpoint schema](../reference-yaml-endpoint-online.md) and [managed online deployment schema](../reference-yaml-deployment-managed-online.md).
- Learn more about how to [troubleshoot managed online endpoints](../how-to-troubleshoot-online-endpoints.md).