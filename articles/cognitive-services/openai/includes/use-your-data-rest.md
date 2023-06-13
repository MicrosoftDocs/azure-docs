---
services: cognitive-services
manager: nitinme
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 05/22/2023
---


## Retrieve required variables

To successfully make a call against Azure OpenAI, you need the following variables. This quickstart assumes you've uploaded your data to an Azure blob storage account and have an Azure Cognitive Search index created. See [Add your data using Azure AI studio](../use-your-data-quickstart.md?pivots=programming-language-studio)

|Variable name | Value |
|--------------------------|-------------|
| `AOAIEndpoint`               | This value can be found in the **Keys & Endpoint** section when examining your Azure OpenAI resource from the Azure portal. Alternatively, you can find the value in **Azure AI studio** > **Chat playground** > **Code view**. An example endpoint is: `https://my-resoruce.openai.azure.com`.|
| `AOAIKey` | This value can be found in the **Keys & Endpoint** section when examining your Azure OpenAI resource from the Azure portal. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption. |
| `AOAIDeploymentId` | This value corresponds to the custom name you chose for your deployment when you deployed a model. This value can be found under **Resource Management** > **Deployments** in the Azure portal or alternatively under **Management** > **Deployments** in Azure AI studio.|
| `ChatGptUrl` | The Azure OpenAI ChatGPT endpoint that will be used to fulfill the request. This can be the same endpoint as `AoAIEndpoint`. |
| `ChatGptKey` | If you are using the same Azure OpenAI resource for both `ChatGptUrl` and `AOAIEndpoint`, use the same value as `AOAIKey`. |
| `SearchEndpoint` | This value can be found in the **Keys & Endpoint** section when examining your Azure Cognitive Search resource from the Azure portal. |
| `SearchKey` | This value can be found in the **Keys & Endpoint** section when examining your Azure Cognitive Search resource from the Azure portal. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption. |
| `SearchIndex` | This value corresponds to the name of the index you created to store your data. You can find it in the **Overview** section when examining your Azure Cognitive Search resource from the Azure portal. |

### Environment variables

# [Command Line](#tab/command-line)

```CMD
setx AOAIEndpoint REPLACE_WITH_YOUR_AOAI_ENDPOINT_VALUE_HERE
```
```CMD
setx AOAIKey REPLACE_WITH_YOUR_AOAI_KEY_VALUE_HERE
```
```CMD
setx AOAIDeploymentId REPLACE_WITH_YOUR_AOAI_DEPLOYMENT_VALUE_HERE
```
```CMD
setx ChatGptUrl REPLACE_WITH_YOUR_AOAI_COMPLETION_VALUE_HERE
```
```CMD
setx ChatGptKey REPLACE_WITH_YOUR_AOAI_KEY_VALUE_HERE
```
```CMD
setx SearchEndpoint REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_VALUE_HERE
```
```CMD
setx SearchKey REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_KEY_VALUE_HERE
```
```CMD
setx SearchIndex REPLACE_WITH_YOUR_INDEX_NAME_HERE
```


# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('AOAIEndpoint', 'REPLACE_WITH_YOUR_AOAI_ENDPOINT_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('AOAIKey', 'REPLACE_WITH_YOUR_AOAI_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('AOAIDeploymentId', 'REPLACE_WITH_YOUR_AOAI_DEPLOYMENT_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('ChatGptUrl', 'REPLACE_WITH_YOUR_AOAI_COMPLETION_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('ChatGptKey', 'REPLACE_WITH_YOUR_AOAI_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('SearchEndpoint', 'REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('SearchKey', 'REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('SearchIndex', 'REPLACE_WITH_YOUR_INDEX_NAME_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
export AOAIEndpoint=REPLACE_WITH_YOUR_AOAI_ENDPOINT_VALUE_HERE
```
```Bash
export AOAIKey=REPLACE_WITH_YOUR_AOAI_KEY_VALUE_HERE
```
```Bash
export AOAIDeploymentId=REPLACE_WITH_YOUR_AOAI_DEPLOYMENT_VALUE_HERE
```
```Bash
export ChatGptUrl=REPLACE_WITH_YOUR_AOAI_COMPLETION_VALUE_HERE
```
```Bash
export ChatGptKey=REPLACE_WITH_YOUR_AOAI_KEY_VALUE_HERE
```
```Bash
export SearchEndpoint=REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_VALUE_HERE
```
```Bash
export SearchKey=REPLACE_WITH_YOUR_AZURE_SEARCH_RESOURCE_KEY_VALUE_HERE
```
```Bash
export SearchIndex=REPLACE_WITH_YOUR_INDEX_NAME_HERE
```

---

> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Set-up)

## Example cURL commands

The ChatGPT models are optimized to work with inputs formatted as a conversation. The `messages` variable passes an array of dictionaries with different roles in the conversation delineated by system, user, tool, and assistant. The `dataSources` variable connects to your Azure Cognitive Search index, and enables Azure OpenAI models to respond using your data.

To trigger a response from the model, you should end with a user message indicating that it's the assistant's turn to respond.

```bash
curl -i -X POST $AOAIEndpoint/openai/deployments/$AOAIDeploymentId/extensions/chat/completions?api-version=2023-06-01-preview \
-H "Content-Type: application/json" \
-H "api-key: $AOAIKey" \
-H "chatgpt_url: $ChatGptUrl" \
-H "chatgpt_key: $ChatGptKey" \
-d \
'
{
    "dataSources": [
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": "'$SearchEndpoint'",
                "key": "'$SearchKey'",
                "indexName": "'$SearchIndex'"
            }
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the differences between Azure Machine Learning and Azure Cognitive Services?"
        }
    ]
}
'
```

### Example output

```json
{
    "id": "12345678-1a2b-3c4e5f-a123-12345678abcd",
    "model": "",
    "created": 1684304924,
    "object": "chat.completion",
    "choices": [
        {
            "index": 0,
            "messages": [
                {
                    "role": "tool",
                    "content": "{\"citations\": [{\"content\": \"\\nWe have already setup a user managed identity (UMI) called tprompt-umi-kv which has access to the keyvault. Hence any compute which is assigned this UMI can access the secrets. This steps will work for you if you have access the UMI - tprompt-umi-kv.\\nYou just need to add the UMI to your compute cluster.\\n1. If you don't have access to the UMI, please a raise a request with the TPrompt team.\\n2. Open the CPU cluster named cpu-cluster-d12v2 and click edit button for \\\"Managed identity\\\" and assign the tprompt-umi-kv UMI to the cluster.\\nIf this does not work for you, you can follow the steps below to create your own keyvault with the required secrets. \\n(Optional) Setup keyvault access for OpenAI embeddings\\nThe OpenAI embeddings are queried from an internal endpoint hosted at\\nada-002 internal endpoint used in the steps below.\\nWe need to setup a keyvault in our resource group to store the secret for this endpoint and assign a UMI to have\", \"id\": null, \"title\": \"Set Up Compute for Endpoint Deployment\", \"filepath\": null, \"url\": null, \"metadata\": {\"chunking\": \"orignal document size=250. Scores=0.4314117431640625 and 1.72564697265625.Org Highlight count=4.\"}, \"chunk_id\": \"0\"}], \"intent\": \"[\\\"how to deploy Tprompt?\\\"]\"}",
                    "end_turn": false
                },
                {
                    "role": "assistant",
                    "content": " \nTo deploy, you need to add the user managed identity (UMI) called tprompt-umi-kv to your compute cluster [doc1]. If you don't have access to the UMI, you can raise a request with the TPrompt team [doc1].",
                    "end_turn": true
                }
            ]
        }
    ]
}
```

### Streaming example

You can send a streaming request using the `stream` parameter, allowing data to be sent and received incrementally, without waiting for the entire API response. This can improve performance and user experience, especially for large or dynamic data.

```bash
curl -i -X POST $AOAIEndpoint/openai/deployments/$AOAIDeploymentId/extensions/chat/completions?api-version=2023-06-01-preview \
-H "Content-Type: application/json" \
-H "api-key: $AOAIKey" \
-H "chatgpt_url: $ChatGptUrl" \
-H "chatgpt_key: $ChatGptKey" \
-d \
'
{
    "stream": true,
    "dataSources": [
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": "'$SearchEndpoint'",
                "key": "'$SearchKey'",
                "indexName": "'$SearchIndex'"
            }
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the differences between Azure Machine Learning and Azure Cognitive Services?"
        }
    ]
}
'
```

### Example output

```json
data:{"id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", "model": "", "created": 1684015661, "object": "chat.completion.chunk", "choices": [{"index": 0, "messages": [{"delta": {"role": "tool", "content": "{\"citations\": [{\"content\": \"\\nIntroduction\\nAzure Cognitive Services are cloud-based artificial intelligence (AI) services... \", \"id\": null, \"title\": \"Introduction\", \"filepath\": null, \"url\": null, \"metadata\": {\"chunking\": \"orignal document size=264. Scores=0.9834403 and 1.718505859375.Org Highlight count=2.\"}, \"chunk_id\": \"0\"}], \"intent\": \"what is tprompt\"}"}, "index": 0}], "finish_reason": null}]}

data:{"id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", "model": "", "created": 1684015661, "object": "chat.completion.chunk", "choices": [{"index": 0, "messages": [{"delta": {"role": "assistant"}, "index": 1}], "finish_reason": null}]}

data:{"id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", "model": "", "created": 1684015661, "object": "chat.completion.chunk", "choices": [{"index": 0, "messages": [{"delta": {"content": " \n"}, "index": 1}], "finish_reason": null}]}

data:{"id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", "model": "", "created": 1684015661, "object": "chat.completion.chunk", "choices": [{"index": 0, "messages": [{"delta": {"content": "TP"}, "index": 1}], "finish_reason": null}]}

data:{"id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", "model": "", "created": 1684015661, "object": "chat.completion.chunk", "choices": [{"index": 0, "messages": [{"delta": {"content": "rompt"}, "index": 1}], "finish_reason": null}]}

data:{"id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", "model": "", "created": 1684015661, "object": "chat.completion.chunk", "choices": [{"index": 0, "messages": [{"delta": {"content": " is"}, "index": 1}], "finish_reason": null}]}

data:{"id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", "model": "", "created": 1684015661, "object": "chat.completion.chunk", "choices": [{"index": 0, "messages": [{"delta": {"content": " a"}, "index": 1}], "finish_reason": null}]}

data:{"id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", "model": "", "created": 1684015661, "object": "chat.completion.chunk", "choices": [{"index": 0, "messages": [{"delta": {"content": " generic"}, "index": 1}], "finish_reason": null}]}

data:{"id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", "model": "", "created": 1684015661, "object": "chat.completion.chunk", "choices": [{"index": 0, "messages": [{"delta": {"content": "[DONE]"}, "index": 2}], "finish_reason": null}]}
```

> [!div class="nextstepaction"]
> [I ran into an issue with sending the request.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Send-request)

## Chat with your model using a web app

To start chatting with the Azure OpenAI model that uses your data, you can deploy a Python web app using example code we [provide on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main). This app deploys using Azure app service, Deploy this app using. Using this web app, you can send queries 

> [!TIP]
> This web app can be used without using your data with Azure OpenAI. 

To start chatting with your model using the API:

1. Clone the [sample code on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/sawidder/new-readme/)
1. Update the following environment variables listed in `app.py`.

    * `AZURE_OPENAI_RESOURCE`: The name of your Azure OpenAI resource.
    * `AZURE_OPENAI_MODEL`: The name of your Azure OpenAI model deployment.
    * `AZURE_OPENAI_KEY`: One of the API keys of your Azure OpenAI resource.
    * `AZURE_SEARCH_SERVICE`: The name of your Azure Cognitive Search resource.
    * `AZURE_SEARCH_INDEX`: The name of your Azure Cognitive Search index.
    * `AZURE_SEARCH_KEY`: An admin key for your Azure Cognitive Search resource.

    There are additional variables you can optionally change, see the [sample code documentation on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main) for more information.

1. Start the app with `start.cmd`. This will build the frontend, install backend dependencies, and start the app.
1. You can see the local running app at `http://127.0.0.1:5000`.

1. Click the **Deploy to Azure** button.

    [![Deploy to Azure](../../../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fruoccofabrizio%2Fsample-app-aoai-chatGPT%2Fmain%2Finfrastructure%2Fdeployment.json)


You can use the [Azure CLI](/cli/azure/install-azure-cli) to deploy the app from your local machine. Make sure you have version 2.48.1 or later.

If this is your first time deploying the app, you can use [az webapp up](/cli/azure/webapp#az-webapp-up). Run the following command from the root folder of the repo, updating the placeholder values to your desired app name, resource group, location, and subscription. You can also change the SKU if desired.

```azurecli
az webapp up --runtime PYTHON:3.10 --sku B1 --name <new-app-name> --resource-group <resource-group-name> --location <azure-region> --subscription <subscription-name>
```

If you've deployed the app previously from the Azure AI studio, first run this command to update the app settings to allow local code deployment:

```azurecli
az webapp config appsettings set -g <resource-group-name> -n <existing-app-name> --settings WEBSITE_WEBDEPLOY_USE_SCM=false
```

Then, use the `az webapp up` command to deploy your local code to the existing app:

```azurecli
az webapp up --runtime PYTHON:3.10 --sku B1 --name <existing-app-name> --resource-group <resource-group-name>
```

Make sure that the app name and resource group match exactly for the app that was previously deployed.

Deployment will take several minutes. When it completes, you should be able to navigate to your app at `{app-name}.azurewebsites.net`.

> [!WARNING]
> The web app you create is publicly accessible by default. Read below for information on adding authentication to your web app.

<!-- Add a feedback button here that says "I had trouble with the web app." -->

> [!div class="nextstepaction"]
> [I ran into an issue with the web app.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-sample-app)

### Important considerations

* This process creates an Azure App Service in your subscription. It may incur costs depending on the 
pricing plan you select. When you're done with your app, you can delete it from the Azure portal.

* By default, the app will be published with a fully accessible, public URL. To add authentication (for example, restrict access to the 
app to members of your Azure tenant:

    1. Go to the [Azure portal](https://portal.azure.com/#home) and search for the app name you specified during publishing. Select the web app, and go to the **Authentication** tab on the left navigation menu. Then select **Add an identity provider**.
    
        :::image type="content" source="../media/quickstarts/web-app-authentication.png" alt-text="A screenshot showing the authentication tab for web apps in the Azure portal." lightbox="../media/quickstarts/web-app-authentication.png":::

    1. Select Microsoft as the identity provider. The default settings on this page will restrict the 
app to your tenant only, so you don't need to change anything else here. Then select **Add**

Now users will be asked to sign in with their Azure Active Directory account to be able to access your app. You can follow a similar process to add another identity provider if you prefer. The app doesn't use the user's login information in any other way other 
than verifying they are a member of your tenant.