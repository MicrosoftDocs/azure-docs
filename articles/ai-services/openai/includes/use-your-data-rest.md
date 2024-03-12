---
#services: cognitive-services
manager: nitinme
author: aahill
ms.author: aahi
ms.service: azure-ai-openai
ms.topic: include
ms.date: 03/07/2024
---

[!INCLUDE [Set up required variables](./use-your-data-common-variables.md)]

## Example cURL commands

The Azure OpenAI chat models are optimized to work with inputs formatted as a conversation. The `messages` variable passes an array of dictionaries with different roles in the conversation delineated by system, user, tool, and assistant. The `dataSources` variable connects to your Azure AI Search index, and enables Azure OpenAI models to respond using your data.

To trigger a response from the model, you should end with a user message indicating that it's the assistant's turn to respond.

> [!TIP]
> There are several parameters you can use to change the model's response, such as `temperature` or `top_p`. See the [reference documentation](../reference.md#completions-extensions) for more information.

```bash
curl -i -X POST $AZURE_OPENAI_ENDPOINT/openai/deployments/$AZURE_OPENAI_DEPLOYMENT_ID/chat/completions?api-version=2024-02-15-preview \
-H "Content-Type: application/json" \
-H "api-key: $AZURE_OPENAI_API_KEY" \
-d \
'
{
    "data_sources": [
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": "'$AZURE_AI_SEARCH_ENDPOINT'",
                "key": "'$AZURE_AI_SEARCH_API_KEY'",
                "index_name": "'$AZURE_AI_SEARCH_INDEX'"
            }
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are my available health plans?"
        }
    ]
}
'
```

### Example output

```json
{
    "id": "12345678-1a2b-3c4e5f-a123-12345678abcd",
    "model": "gpt-4",
    "created": 1709835345,
    "object": "extensions.chat.completion",
    "choices": [
        {
            "index": 0,
            "finish_reason": "stop",
            "message": {
                "role": "assistant",
                "content": "The available health plans in the Contoso Electronics plan and benefit packages are the Northwind Health Plus and Northwind Standard plans. [doc1].",
                "end_turn": true,
                "context": {
                    "citations": [
                        {
                            "content": "...",
                            "title": "...",
                            "url": "https://mysearch.blob.core.windows.net/xyz/001.txt",
                            "filepath": "001.txt",
                            "chunk_id": "0"
                        }
                    ],
                    "intent": "[\"Available health plans\"]"
                }
            }
        }
    ],
    "usage": {
        "prompt_tokens": 3779,
        "completion_tokens": 105,
        "total_tokens": 3884
    }
}
```

> [!div class="nextstepaction"]
> [I ran into an issue with sending the request.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Send-request)

## Chat with your model using a web app

To start chatting with the Azure OpenAI model that uses your data, you can deploy a web app using [Azure OpenAI studio](../concepts/use-your-data.md#deploy-to-a-copilot-preview-or-web-app) or example code we [provide on GitHub](https://go.microsoft.com/fwlink/?linkid=2244395). This app deploys using Azure app service, and provides a user interface for sending queries. This app can be used Azure OpenAI models that use your data, or models that don't use your data. See the readme file in the repo for instructions on requirements, setup, and deployment. You can optionally customize the [frontend and backend logic](../how-to/use-web-app.md#web-app-customization) of the web app by making changes to the source code.
