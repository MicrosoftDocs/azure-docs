---
title: Troubleshoot guidance
titleSuffix: Azure Machine Learning
description: This article addresses frequent questions prompt flow usage.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: reference
author: ChenJieting
ms.author: chenjieting
ms.reviewer: lagayhar
ms.date: 09/05/2023
---

# Troubleshoot guidance

This article addresses frequent questions about prompt flow usage.

## Flow authoring related issues

### "Package tool isn't found" error occurs when you update the flow for a code-first experience

When you update flows for a code-first experience, if the flow utilized the Faiss Index Lookup, Vector Index Lookup, Vector DB Lookup, or Content Safety (Text) tools, you might encounter the following error message:

<code><i>Package tool 'embeddingstore.tool.faiss_index_lookup.search' is not found in the current environment.</i></code>

To resolve the issue, you have two options:

- **Option 1**
  - Update your compute session to the latest base image version.
  - Select **Raw file mode** to switch to the raw code view. Then open the *flow.dag.yaml* file.
  
     ![Screenshot that shows how to switch to Raw file mode.](./media/faq/switch-to-raw-file-mode.png)
  - Update the tool names.
  
     ![Screenshot that shows how to update the tool name.](./media/faq/update-tool-name.png)
     
      | Tool | New tool name |
      | ---- | ---- |
      | Faiss Index Lookup | promptflow_vectordb.tool.faiss_index_lookup.FaissIndexLookup.search |
      | Vector Index Lookup | promptflow_vectordb.tool.vector_index_lookup.VectorIndexLookup.search |
      | Vector DB Lookup | promptflow_vectordb.tool.vector_db_lookup.VectorDBLookup.search |
      | Content Safety (Text) | content_safety_text.tools.content_safety_text_tool.analyze_text |

  - Save the *flow.dag.yaml* file.

- **Option 2**
  - Update your compute session to the latest base image version
  - Remove the old tool and re-create a new tool.

### "No such file or directory" error

Prompt flow relies on a file share storage to store a snapshot of the flow. If the file share storage has an issue, you might encounter the following problem. Here are some workarounds you can try:

- If you're using a private storage account, see [Network isolation in prompt flow](./how-to-secure-prompt-flow.md) to make sure your workspace can access your storage account.
- If the storage account is enabled for public access, check whether there's a datastore named `workspaceworkingdirectory` in your workspace. It should be a file share type.

    :::image type="content" source="./media/faq/working-directory.png" alt-text="Screenshot that shows workspaceworkingdirectory." lightbox = "./media/faq/working-directory.png":::
  
    - If you didn't get this datastore, you need to add it in your workspace.
        - Create a file share with the name `code-391ff5ac-6576-460f-ba4d-7e03433c68b6`.
        - Create a datastore with the name `workspaceworkingdirectory`. See [Create datastores](../how-to-datastore.md).
    - If you have a `workspaceworkingdirectory` datastore but its type is `blob` instead of `fileshare`, create a new workspace. Use storage that doesn't enable hierarchical namespaces for Azure Data Lake Storage Gen2 as a workspace default storage account. For more information, see [Create workspace](../how-to-manage-workspace.md#create-a-workspace).
     
### Flow is missing

:::image type="content" source="./media/faq/flow-missing.png" alt-text="Screenshot that shows a flow missing an authoring page." lightbox = "./media/faq/flow-missing.png":::

There are possible reasons for this issue:
- If public access to your storage account is disabled, you must ensure access by either adding your IP to the storage firewall or enabling access through a virtual network that has a private endpoint connected to the storage account.

    :::image type="content" source="./media/faq/storage-account-networking-firewall.png" alt-text="Screenshot that shows firewall setting on storage account." lightbox = "./media/faq/storage-account-networking-firewall.png":::

- There are some cases, the account key in datastore is out of sync with the storage account, you can try to update the account key in datastore detail page to fix this.

    :::image type="content" source="./media/faq/datastore-with-wrong-account-key.png" alt-text="Screenshot that shows datastore with wrong account key." lightbox = "./media/faq/datastore-with-wrong-account-key.png":::
 
- If you're using AI studio, the storage account needs to set CORS to allow AI studio access the storage account, otherwise, you see the flow missing issue. You can add following CORS settings to the storage account to fix this issue.
    - Go to storage account page, select `Resource sharing (CORS)` under `settings`, and select to `File service` tab.
    - Allowed origins: `https://mlworkspace.azure.ai,https://ml.azure.com,https://*.ml.azure.com,https://ai.azure.com,https://*.ai.azure.com,https://mlworkspacecanary.azure.ai,https://mlworkspace.azureml-test.net`
    - Allowed methods: `DELETE, GET, HEAD, POST, OPTIONS, PUT`

    :::image type="content" source="./media/faq/resource-sharing-setting-storage-account.png" alt-text="Screenshot that shows Resource sharing config of storage account." lightbox = "./media/faq/resource-sharing-setting-storage-account.png":::

## Compute session related issues

### Run failed because of "No module named XXX"

This type of error related to compute session lacks required packages. If you're using a default environment, make sure the image of your compute session is using the latest version.  If you're using a custom base image, make sure you installed all the required packages in your docker context. For more information, see [Customize base image for compute session](./how-to-customize-session-base-image.md).

### Where to find the serverless instance used by compute session?

You can view the serverless instance used by compute session in the compute session list tab under compute page. Learn more about [how to manage serverless instance](./how-to-manage-compute-session.md#manage-serverless-instance-used-by-compute-session).


### Compute session failures using custom base image

#### Compute session start failure with requirements.txt or custom base image

Compute session support to use `requirements.txt` or custom base image in `flow.dag.yaml` to customize the image. We would recommend you to use `requirements.txt` for common case, which will use `pip install -r requirements.txt` to install the packages. If you have dependency more than python packages, you need to follow the [Customize base image](./how-to-customize-session-base-image.md) to create build a new image base on top of prompt flow base image. Then use it in `flow.dag.yaml`. Learn more [how to specify base image in compute session.](./how-to-manage-compute-session.md#change-the-base-image-for-compute-session)

- You can't use arbitrary base image to create Compute session, you need to use the base image provide by prompt flow.
- Don't pin the version of `promptflow` and `promptflow-tools` in `requirements.txt`, because we already include them in the base image. Using old version of `promptflow` and `promptflow-tools` may cause unexpected behavior.

## Flow run related issues

### How to find the raw inputs and outputs of in LLM tool for further investigation?

In prompt flow, on flow page with successful run and run detail page, you can find the raw inputs and outputs of LLM tool in the output section. Select the `view full output` button to view full output. 

:::image type="content" source="./media/faq/view-full-output.png" alt-text="Screenshot that shows view full output on LLM node." lightbox = "./media/faq/view-full-output.png":::

`Trace` section includes each request and response to the LLM tool. You can check the raw message sent to the LLM model and the raw response from the LLM model.

:::image type="content" source="./media/faq/trace-large-language-model-tool.png" alt-text="Screenshot that shows raw request send to LLM model and response from LLM model." lightbox = "./media/faq/trace-large-language-model-tool.png":::

### How to fix 409 error from Azure OpenAI? 

You may encounter 409 error from Azure OpenAI, it means you have reached the rate limit of Azure OpenAI. You can check the error message in the output section of LLM node. Learn more about [Azure OpenAI rate limit](../../ai-services/openai/quotas-limits.md).

:::image type="content" source="./media/faq/429-rate-limit.png" alt-text="Screenshot that shows 429 rate limit error from Azure OpenAI." lightbox = "./media/faq/429-rate-limit.png":::

### Identify which node consumes the most time

1. Check the compute session logs.

1. Try to find the following warning log format:

    {node_name} has been running for {duration} seconds.

    For example:

   - **Case 1:** Python script node runs for a long time.

        :::image type="content" source="./media/how-to-create-manage-runtime/runtime-timeout-running-for-long-time.png" alt-text="Screenshot that shows a timeout run sign in the studio UI." lightbox = "./media/how-to-create-manage-runtime/runtime-timeout-running-for-long-time.png":::

        In this case, you can find that `PythonScriptNode` was running for a long time (almost 300 seconds). Then you can check the node details to see what's the problem.

   - **Case 2:** LLM node runs for a long time.

        :::image type="content" source="./media/how-to-create-manage-runtime/runtime-timeout-by-language-model-timeout.png" alt-text="Screenshot that shows timeout logs caused by an LLM timeout in the studio UI." lightbox = "./media/how-to-create-manage-runtime/runtime-timeout-by-language-model-timeout.png":::

        In this case, if you find the message `request canceled` in the logs, it might be because the OpenAI API call is taking too long and exceeding the timeout limit.

        An OpenAI API timeout could be caused by a network issue or a complex request that requires more processing time. For more information, see [OpenAI API timeout](https://help.openai.com/en/articles/6897186-timeout).

        Wait a few seconds and retry your request. This action usually resolves any network issues.

        If retrying doesn't work, check whether you're using a long context model, such as `gpt-4-32k`, and have set a large value for `max_tokens`. If so, the behavior is expected because your prompt might generate a long response that takes longer than the interactive mode's upper threshold. In this situation, we recommend trying `Bulk test` because this mode doesn't have a timeout setting.

1. If you can't find anything in logs to indicate it's a specific node issue:

    - Contact the prompt flow team ([promptflow-eng](mailto:aml-pt-eng@microsoft.com)) with the logs. We try to identify the root cause.

## Flow deployment related issues

### Lack authorization to perform action "Microsoft.MachineLearningService/workspaces/datastores/read"

If your flow contains Index Look Up tool, after deploying the flow, the endpoint needs to access workspace datastore to read MLIndex yaml file or FAISS folder containing chunks and embeddings. Hence, you need to manually grant the endpoint identity permission to do so.

You can either grant the endpoint identity **AzureML Data Scientist** on workspace scope, or a custom role that contains "MachineLearningService/workspace/datastore/reader" action.

### Upstream request timeout issue when consuming the endpoint

If you use CLI or SDK to deploy the flow, you may encounter timeout error. By default the `request_timeout_ms` is 5000. You can specify at max to 5 minutes, which is 300,000 ms. Following is example showing how to specify request time-out in the deployment yaml file. To learn more, see [deployment schema](../reference-yaml-deployment-managed-online.md).

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
 
For any other vulnerabilities of managed online deployments, Azure Machine Learning fixes the issues in a monthly manner.

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

### Model response taking too long

Sometimes, you might notice that the deployment is taking too long to respond. There are several potential factors for this to occur. 

- The model used in the flow isn't powerful enough (example: use GPT 3.5 instead of text-ada)
- Index query isn't optimized and taking too long
- Flow has many steps to process

Consider optimizing the endpoint with above considerations to improve the performance of the model.

### Unable to fetch deployment schema

After you deploy the endpoint and want to test it in the **Test tab** in the endpoint detail page, if the **Test tab** shows **Unable to fetch deployment schema**, you can try the following two methods to mitigate this issue:

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/unable-to-fetch-deployment-schema.png" alt-text="Screenshot of the error unable to fetch deployment schema in Test tab in endpoint detail page. " lightbox = "./media/how-to-deploy-for-real-time-inference/unable-to-fetch-deployment-schema.png":::

- Make sure you have granted the correct permission to the endpoint identity. Learn more about [how to grant permission to the endpoint identity](how-to-deploy-for-real-time-inference.md#grant-permissions-to-the-endpoint).
- It might be because you ran your flow in an old version runtime and then deployed the flow, the deployment used the environment of the runtime that was in old version as well. To update the runtime, follow [Update a runtime on the UI](./how-to-create-manage-runtime.md#update-a-runtime-on-the-ui) and rerun the flow in the latest runtime and then deploy the flow again.

### Access denied to list workspace secret

If you encounter an error like "Access denied to list workspace secret", check whether you have granted the correct permission to the endpoint identity. Learn more about [how to grant permission to the endpoint identity](how-to-deploy-for-real-time-inference.md#grant-permissions-to-the-endpoint).

## Authentication and identity related issues

### How do I use credential-less datastore in prompt flow?

#### Change auth type of datastore to None

You can follow [Identity-based data authentication](../how-to-administrate-data-authentication.md#identity-based-data-authentication) this part to make your datastore credential-less. 

You need to change auth type of datastore to None, which stands for meid_token based auth. 

:::image type="content" source="./media/faq/datastore-auth-type.png" alt-text="Screenshot of auth type for datastore. " lightbox = "./media/faq/datastore-auth-type.png":::

For blob/adls gen1/adls gen2 based datastore (at least for `workspaceblobstore` and `workspaceartifactstore`), you can make change from datastore detail page, or CLI/SDK: https://github.com/Azure/azureml-examples/tree/main/cli/resources/datastore

:::image type="content" source="./media/faq/datastore-update-auth-type.png" alt-text="Screenshot of update auth type for datastore. " lightbox = "./media/faq/datastore-update-auth-type.png":::

For fileshare based datastore (at least for `workspaceworkingdirectory`), you can only change auth type for REST API: [datastores-create-or-update](/rest/api/azureml/datastores/create-or-update?tabs=HTTP#code-try-0). You can first use [datastores-get](/rest/api/azureml/datastores/get?tabs=HTTP#code-try-0) to get the body properties of datastore, then change `"credentialsType": "None"`.

:::image type="content" source="./media/faq/fileshare-datastore-update-auth-type.png" alt-text="Screenshot of update auth type for fileshare based datastore. " lightbox = "./media/faq/fileshare-datastore-update-auth-type.png":::

For `workspaceartifactstore` data store you need also specify `subscriptionId`, `accountName` and `"serviceDataAccessAuthIdentity": "WorkspaceSystemAssignedIdentity"`, as you can not do this in UI side.

:::image type="content" source="./media/faq/datastore-update-rest.png" alt-text="Screenshot of rest for datastore update. " lightbox = "./media/faq/datastore-update-rest.png":::

#### Grant permission to user identity or managed identity

To use credential-less datastore in prompt flow, you need to grant enough permissions to user identity or managed identity to access the datastore.

- Make sure workspace system assigned managed identity have  `Storage Blob Data Contributor` and `Storage File Data Privileged Contributor` on the storage account, at least need read/write (better also include delete) permission.
- If you're using user identity this default option in prompt flow, you need to make sure the user identity has following role on the storage account:
    - `Storage Blob Data Contributor` on the storage account, at least need read/write (better also include delete) permission.
    - `Storage File Data Privileged Contributor` on the storage account, at least need read/write (better also include delete) permission.
- If you're using user assigned managed identity, you need to make sure the managed identity has following role on the storage account:
    - `Storage Blob Data Contributor` on the storage account, at least need read/write (better also include delete) permission.
    - `Storage File Data Privileged Contributor` on the storage account, at least need read/write (better also include delete) permission.
    - Meanwhile, you need to assign user identity `Storage Blob Data Read` role to storage account at least, if your want use prompt flow to authoring and test flow.
- If you still can't view the flow detail page and the first time you using prompt flow is earlier than 2024-01-01, you need to grant workspace MSI as `Storage Table Data Contributor` to storage account linked with workspace.