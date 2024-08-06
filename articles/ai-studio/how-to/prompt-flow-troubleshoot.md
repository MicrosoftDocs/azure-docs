---
title: Troubleshoot guidance for prompt flow
titleSuffix: Azure AI Studio
description: This article addresses frequent questions about prompt flow usage.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: reference
author: lgayhardt
ms.author: lagayhar
ms.reviewer: chenjieting
ms.date: 07/31/2024
---

# Troubleshoot guidance for prompt flow

This article addresses frequent questions about prompt flow usage.

## Compute session related issues

### Run failed because of "No module named XXX"

This type of error related to compute session lacks required packages. If you're using a default environment, make sure the image of your compute session is using the latest version.  If you're using a custom base image, make sure you installed all the required packages in your docker context. 

### Where to find the serverless instance used by compute session?

You can view the serverless instance used by compute session in the compute session list tab under compute page. Learn more about how to manage serverless instance [Manage a compute session](./create-manage-compute-session.md#manage-a-compute-session).

### Compute session failures using custom base image

## Flow run related issues

### How to find the raw inputs and outputs of in LLM tool for further investigation?

In prompt flow, on flow page with successful run and run detail page, you can find the raw inputs and outputs of LLM tool in the output section. Select the `view full output` button to view full output. 

:::image type="content" source="../media/prompt-flow/view-full-output.png" alt-text="Screenshot that shows view full output on LLM node." lightbox = "../media/prompt-flow/view-full-output.png":::

`Trace` section includes each request and response to the LLM tool. You can check the raw message sent to the LLM model and the raw response from the LLM model.

:::image type="content" source="../media/prompt-flow/trace-large-language-model-tool.png" alt-text="Screenshot that shows raw request send to LLM model and response from LLM model." lightbox = "../media/prompt-flow/trace-large-language-model-tool.png":::

### How to fix 409 error from Azure OpenAI? 

You may encounter 409 error from Azure OpenAI, it means you have reached the rate limit of Azure OpenAI. You can check the error message in the output section of LLM node. Learn more about [Azure OpenAI rate limit](../../ai-services/openai/quotas-limits.md).

:::image type="content" source="../media/prompt-flow/429-rate-limit.png" alt-text="Screenshot that shows 429 rate limit error from Azure OpenAI." lightbox = "../media/prompt-flow/429-rate-limit.png":::

### Identify which node consumes the most time

1. Check the compute session logs.

1. Try to find the following warning log format:

    {node_name} has been running for {duration} seconds.

    For example:

   - **Case 1:** Python script node runs for a long time.

        :::image type="content" source="../media/prompt-flow/runtime-timeout-running-for-long-time.png" alt-text="Screenshot that shows a timeout run sign." lightbox = "../media/prompt-flow/runtime-timeout-running-for-long-time.png":::

        In this case, you can find that `PythonScriptNode` was running for a long time (almost 300 seconds). Then you can check the node details to see what's the problem.

   - **Case 2:** LLM node runs for a long time.

        :::image type="content" source="../media/prompt-flow/runtime-timeout-by-language-model-timeout.png" alt-text="Screenshot that shows timeout logs caused by an LLM timeout." lightbox = "../media/prompt-flow/runtime-timeout-by-language-model-timeout.png":::

        In this case, if you find the message `request canceled` in the logs, it might be because the OpenAI API call is taking too long and exceeding the timeout limit.

        An OpenAI API timeout could be caused by a network issue or a complex request that requires more processing time. For more information, see [OpenAI API timeout](https://help.openai.com/en/articles/6897186-timeout).

        Wait a few seconds and retry your request. This action usually resolves any network issues.

        If retrying doesn't work, check whether you're using a long context model, such as `gpt-4-32k`, and have set a large value for `max_tokens`. If so, the behavior is expected because your prompt might generate a long response that takes longer than the interactive mode's upper threshold. In this situation, we recommend trying `Bulk test` because this mode doesn't have a timeout setting.

1. If you can't find anything in logs to indicate it's a specific node issue:

    - Contact the prompt flow team ([promptflow-eng](mailto:aml-pt-eng@microsoft.com)) with the logs. We try to identify the root cause.

## Flow deployment related issues

### Upstream request timeout issue when consuming the endpoint

If you use CLI or SDK to deploy the flow, you may encounter timeout error. By default the `request_timeout_ms` is 5000. You can specify at max to 5 minutes, which is 300,000 ms. Following is example showing how to specify request time-out in the deployment yaml file. To learn more, see [deployment schema](../../machine-learning/reference-yaml-deployment-managed-online.md).

```yaml
request_settings:
  request_timeout_ms: 300000
```

### OpenAI API hits authentication error

If you regenerate your Azure OpenAI key and manually update the connection used in prompt flow, you may encounter errors like "Unauthorized. Access token is missing, invalid, audience is incorrect or have expired." when invoking an existing endpoint created before key regenerating.

This is because the connections used in the endpoints/deployments won't be automatically updated. Any change for key or secrets in deployments should be done by manual update, which aims to avoid impacting online production deployment due to unintentional offline operation.

- If the endpoint was deployed in the studio UI, you can just redeploy the flow to the existing endpoint using the same deployment name.
- If the endpoint was deployed using SDK or CLI, you need to make some modification to the deployment definition such as adding a dummy environment variable, and then use `az ml online-deployment update` to update your deployment.

### Vulnerability issues in prompt flow deployments

For prompt flow runtime related vulnerabilities, following are approaches, which can help mitigate:

- Update the dependency packages in your requirements.txt in your flow folder.
- If you're using customized base image for your flow, you need to update the prompt flow runtime to latest version and rebuild your base image, then redeploy the flow.
 
For any other vulnerabilities of managed online deployments, Azure AI fixes the issues in a monthly manner.

### "MissingDriverProgram Error" or "Could not find driver program in the request"

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

- (Recommended) You can find the container image uri in your custom environment detail page, and set it as the flow base image in the flow.dag.yaml file. When you deploy the flow in UI, you just select **Use environment of current flow definition**, and the backend service will create the customized environment based on this base image and `requirement.txt` for your deployment. Learn more about [the environment specified in the flow definition](./flow-deploy.md#requirements-text-file).

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

### Model response taking too long

Sometimes, you might notice that the deployment is taking too long to respond. There are several potential factors for this to occur. 

- The model used in the flow isn't powerful enough (example: use GPT 3.5 instead of text-ada)
- Index query isn't optimized and taking too long
- Flow has many steps to process

Consider optimizing the endpoint with above considerations to improve the performance of the model.

### Unable to fetch deployment schema

After you deploy the endpoint and want to test it in the **Test** tab in the deployment detail page, if the **Test** tab shows **Unable to fetch deployment schema**, you can try the following two methods to mitigate this issue:

:::image type="content" source="../media/prompt-flow//unable-to-fetch-deployment-schema.png" alt-text="Screenshot of the error unable to fetch deployment schema in Test tab in deployment detail page. " lightbox = "../media/prompt-flow/unable-to-fetch-deployment-schema.png":::

- Make sure you have granted the correct permission to the endpoint identity. Learn more about [how to grant permission to the endpoint identity](./flow-deploy.md#grant-permissions-to-the-endpoint).
- It might be because you ran your flow in an old version runtime and then deployed the flow, the deployment used the environment of the runtime that was in old version as well. To update the runtime, follow [Update a runtime on the UI](./create-manage-compute-session.md#upgrade-compute-instance-runtime) and rerun the flow in the latest runtime and then deploy the flow again.

### Access denied to list workspace secret

If you encounter an error like "Access denied to list workspace secret", check whether you have granted the correct permission to the endpoint identity. Learn more about [how to grant permission to the endpoint identity](./flow-deploy.md#grant-permissions-to-the-endpoint).
