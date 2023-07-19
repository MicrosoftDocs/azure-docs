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

The Azure OpenAI chat models are optimized to work with inputs formatted as a conversation. The `messages` variable passes an array of dictionaries with different roles in the conversation delineated by system, user, tool, and assistant. The `dataSources` variable connects to your Azure Cognitive Search index, and enables Azure OpenAI models to respond using your data.

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
            "content": "What are the differences between Azure Machine Learning and Azure AI services?"
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
                    "content": "{\"citations\": [{\"content\": \"\\nAzure AI services are cloud-based artificial intelligence (AI) services...\", \"id\": null, \"title\": \"What is Azure AI services\", \"filepath\": null, \"url\": null, \"metadata\": {\"chunking\": \"orignal document size=250. Scores=0.4314117431640625 and 1.72564697265625.Org Highlight count=4.\"}, \"chunk_id\": \"0\"}], \"intent\": \"[\\\"Learn about Azure AI services.\\\"]\"}",
                    "end_turn": false
                },
                {
                    "role": "assistant",
                    "content": " \nAzure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge. [doc1]. Azure Machine Learning is a cloud service for accelerating and managing the machine learning project lifecycle. [doc1].",
                    "end_turn": true
                }
            ]
        }
    ]
}
```

> [!div class="nextstepaction"]
> [I ran into an issue with sending the request.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Send-request)

## Chat with your model using a web app

To start chatting with the Azure OpenAI model that uses your data, you can deploy a Python web app using example code we [provide on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main). This app deploys using Azure app service, and provides a user interface for sending queries. This app can be used Azure OpenAI models that use your data, or models that don't use your data. See the [readme file](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/README.md) in the repo for instructions on requirements, setup, and deployment. You can optionally customize the [frontend and backend logic](../concepts/use-your-data.md#using-the-web-app) of the web app by making changes to the source code.
