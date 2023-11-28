---
services: cognitive-services
manager: nitinme
author: mgreenegit
ms.author: migreene
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/22/2023
---

[!INCLUDE [Set up required variables](./use-your-data-common-variables.md)]

## Example PowerShell commands

The Azure OpenAI chat models are optimized to work with inputs formatted as a conversation. The `messages` variable passes an array of dictionaries with different roles in the conversation delineated by system, user, tool, and assistant. The `dataSources` variable connects to your Azure Cognitive Search index, and enables Azure OpenAI models to respond using your data.

To trigger a response from the model, you should end with a user message indicating that it's the assistant's turn to respond.

> [!TIP]
> There are several parameters you can use to change the model's response, such as `temperature` or `top_p`. See the [reference documentation](../reference.md#completions-extensions) for more information.

```powershell-interactive
# Azure OpenAI metadata variables
   $openai = @{
       api_key     = $Env:AZURE_OPENAI_KEY
       api_base    = $Env:AZURE_OPENAI_ENDPOINT # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
       api_version = '2023-07-01-preview' # this may change in the future
       name        = 'YOUR-DEPLOYMENT-NAME-HERE' #This will correspond to the custom name you chose for your deployment when you deployed a model.
   }

   $acs = @{
       search_endpoint     = 'YOUR ACS ENDPOINT' # your endpoint should look like the following https://YOUR_RESOURCE_NAME.search.windows.net/
       search_key    = 'YOUR-ACS-KEY-HERE' # or use the Get-Secret cmdlet to retrieve the value
       search_index = 'YOUR-INDEX-NAME-HERE' # the name of your ACS index
   }

   # Completion text
   $body = @{
    dataSources = @(
        @{
            type = 'AzureCognitiveSearch'
            parameters = @{
                    endpoint = $acs.search_endpoint
                    key = $acs.search_key
                    indexName = $acs.search_index
                }
        }
    )
    messages = @(
            @{
                role = 'user'
                content = 'How do you query REST using PowerShell'
            }
    )
   } | convertto-json -depth 5

   # Header for authentication
   $headers = [ordered]@{
       'api-key' = $openai.api_key
   }

   # Send a completion call to generate an answer
   $url = "$($openai.api_base)/openai/deployments/$($openai.name)/extensions/chat/completions?api-version=$($openai.api_version)"

   $response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
   return $response.choices.messages[1].content
```

### Example output

```text
To query a RESTful web service using PowerShell, you can use the `Invoke-RestMethod` cmdlet. This cmdlet sends HTTP and HTTPS requests to RESTful web services and processes the response based on the data type.
```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [The PowerShell Secret Management with Azure Key Vault](/powershell/utility-modules/secretmanagement/how-to/using-azure-keyvault). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

> [!div class="nextstepaction"]
> [I ran into an issue with sending the request.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Send-request)

## Chat with your model using a web app

To start chatting with the Azure OpenAI model that uses your data, you can deploy a web app using [Azure OpenAI studio](../concepts/use-your-data.md#deploying-the-model) or example code we [provide on GitHub](https://go.microsoft.com/fwlink/?linkid=2244395). This app deploys using Azure app service, and provides a user interface for sending queries. This app can be used Azure OpenAI models that use your data, or models that don't use your data. See the readme file in the repo for instructions on requirements, setup, and deployment. You can optionally customize the [frontend and backend logic](../concepts/use-your-data.md#using-the-web-app) of the web app by making changes to the source code.
