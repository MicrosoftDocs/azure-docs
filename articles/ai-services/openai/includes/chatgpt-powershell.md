---
title: "Quickstart: Use Azure OpenAI Service with PowerShell"
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with PowerShell.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
author: mgreenegit
ms.author: migreene
ms.date: 08/28/2023
keywords:
---

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to Azure OpenAI Service in the desired Azure subscription.
  Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- <a href="https://aka.ms/installpowershell" target="_blank">You can use either the latest version, PowerShell 7, or Windows PowerShell 5.1.</a>
- An Azure OpenAI Service resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).
- An Azure OpenAI Service resource with either the `gpt-35-turbo` or the `gpt-4` models deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=POWERSHELL&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Prerequisites)

### Retrieve key and endpoint

To successfully make a call against Azure OpenAI, you'll need an **endpoint** and a **key**.

| Variable name | Value                                                                                                                                                                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ENDPOINT`    | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in the **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`. |
| `API-KEY`     | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.                                                                                                                                      |

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview UI for an OpenAI Resource in the Azure portal with the endpoint & access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

Create and assign persistent environment variables for your key and endpoint.

### Environment variables

# [PowerShell](#tab/powershell)

```powershell-interactive
$Env:AZURE_OPENAI_KEY = 'YOUR_KEY_VALUE'
```

```powershell-interactive
$Env:AZURE_OPENAI_ENDPOINT = 'YOUR_ENDPOINT'
```

# [Command Line](#tab/command-line)

```CMD
setx AZURE_OPENAI_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE"
```

```CMD
setx AZURE_OPENAI_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE"
```

# [Bash](#tab/bash)

```Bash
echo export AZURE_OPENAI_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export AZURE_OPENAI_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```

---

> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=POWERSHELL&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Set-up)

## Create a new PowerShell script

1. Create a new PowerShell file called quickstart.ps1. Then open it up in your preferred editor or IDE.

1. Replace the contents of quickstart.ps1 with the following code. You need to set the `engine` variable to the deployment name you chose when you deployed the GPT-35-Turbo or GPT-4 models. Entering the model name will result in an error unless you chose a deployment name that is identical to the underlying model name.

   ```powershell-interactive
   # Azure OpenAI metadata variables
   $openai = @{
      api_key     = $Env:AZURE_OPENAI_KEY
      api_base    = $Env:AZURE_OPENAI_ENDPOINT # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
      api_version = '2023-05-15' # this may change in the future
      name        = 'YOUR-DEPLOYMENT-NAME-HERE' #This will correspond to the custom name you chose for your deployment when you deployed a model.
   }

   # Completion text
   $messages = @()
   $messages += @{
     role = 'system'
     content = 'You are a helpful assistant.'
   }
   $messages += @{
     role = 'user'
     content = 'Does Azure OpenAI support customer managed keys?'
   }
   $messages += @{
     role = 'assistant'
     content = 'Yes, customer managed keys are supported by Azure OpenAI.'
   }
   $messages += @{
     role = 'user'
     content = 'Do other Azure AI services support this too?'
   }

   # Header for authentication
   $headers = [ordered]@{
      'api-key' = $openai.api_key
   }

   # Adjust these values to fine-tune completions
   $body = [ordered]@{
      messages = $messages
   } | ConvertTo-Json

   # Send a request to generate an answer
   $url = "$($openai.api_base)/openai/deployments/$($openai.name)/chat/completions?api-version=$($openai.api_version)"

   $response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
   return $response
   ```

   > [!IMPORTANT]
   > For production, use a secure way of storing and accessing your credentials like [The PowerShell Secret Management with Azure Key Vault](/powershell/utility-modules/secretmanagement/how-to/using-azure-keyvault). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Run the script using PowerShell:

   ```powershell
   ./quickstart.ps1
   ```

## Output

```powershell
# the output of the script will be a .NET object containing the response
id      : chatcmpl-7sdJJRC6fDNGnfHMdfHXvPkYFbaVc
object  : chat.completion
created : 1693255177
model   : gpt-35-turbo
choices : {@{index=0; finish_reason=stop; message=}}
usage   : @{completion_tokens=67; prompt_tokens=55; total_tokens=122}

# convert the output to JSON
./quickstart.ps1 | ConvertTo-Json -Depth 3

# or to view the text returned, select the specific object property
$reponse = ./quickstart.ps1
$response.choices.message.content
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=POWERSHELL&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Create-powershell-script)

### Understanding the message structure

The GPT-35-Turbo and GPT-4 models are optimized to work with inputs formatted as a conversation. The `messages` variable passes an array of dictionaries with different roles in the conversation delineated by system, user, and assistant. The system message can be used to prime the model by including context or instructions on how the model should respond.

The [GPT-35-Turbo & GPT-4 how-to guide](../how-to/chatgpt.md) provides an in-depth introduction into the options for communicating with these new models.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure PowerShell](../../multi-service-resource.md?pivots=azpowershell#clean-up-resources)

## Next steps

- Learn more about how to work with GPT-35-Turbo and the GPT-4 models with [our how-to guide](../how-to/chatgpt.md).
- For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
