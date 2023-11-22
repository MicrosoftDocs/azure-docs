---
title: "Quickstart: Use the OpenAI Service via PowerShell"
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with PowerShell.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 08/28/2023
keywords:
---

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to Azure OpenAI in the desired Azure subscription
  Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- <a href="https://aka.ms/installpowershell" target="_blank">You can use either the latest version, PowerShell 7, or Windows PowerShell 5.1.</a>
- An Azure OpenAI Service resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=POWERSHELL&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Prerequisites)

## Retrieve key and endpoint

To successfully make a call against the Azure OpenAI service, you'll need the following:

| Variable name     | Value                                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ENDPOINT`        | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`. |
| `API-KEY`         | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.                                                                                                                                  |
| `DEPLOYMENT-NAME` | This value will correspond to the custom name you chose for your deployment when you deployed a model. This value can be found under **Resource Management** > **Deployments** in the Azure portal or alternatively under **Management** > **Deployments** in Azure OpenAI Studio.   |

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview blade for an OpenAI Resource in the Azure portal with the endpoint & access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

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
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=POWERSHELL&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Set-up)

## Create a new PowerShell script

1. Create a new PowerShell file called quickstart.ps1. Then open it up in your preferred editor or IDE.

1. Replace the contents of quickstart.ps1 with the following code. Modify the code to add your key, endpoint, and deployment name:

   ```powershell-interactive
   # Azure OpenAI metadata variables
   $openai = @{
       api_key     = $Env:AZURE_OPENAI_KEY
       api_base    = $Env:AZURE_OPENAI_ENDPOINT # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
       api_version = '2023-05-15' # this may change in the future
       name        = 'YOUR-DEPLOYMENT-NAME-HERE' #This will correspond to the custom name you chose for your deployment when you deployed a model.
   }

   # Completion text
   $prompt = 'Once upon a time...'
   
   # Header for authentication
   $headers = [ordered]@{
       'api-key' = $openai.api_key
   }

   # Adjust these values to fine-tune completions
   $body = [ordered]@{
       prompt      = $prompt
       max_tokens  = 10
       temperature = 2
       top_p       = 0.5
   } | ConvertTo-Json

   # Send a completion call to generate an answer
   $url = "$($openai.api_base)/openai/deployments/$($openai.name)/completions?api-version=$($openai.api_version)"

   $response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
   return "$prompt`n$($response.choices[0].text)"
   ```

   > [!IMPORTANT]
   > For production, use a secure way of storing and accessing your credentials like [The PowerShell Secret Management with Azure Key Vault](/powershell/utility-modules/secretmanagement/how-to/using-azure-keyvault). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Run the script using PowerShell:

   ```powershell
   ./quickstart.ps1
   ```

## Output

The output will include response text following the `Once upon a time` prompt. Azure OpenAI returned `There was a world beyond the mist...where a` in this example.

```powershell
Once upon a time...
 There was a world beyond the mist...where a
```

Run the code a few more times to see what other types of responses you get as the response won't always be the same.

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=POWERSHELL&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Create-PowerShell-script)

### Understanding your results

Since our example of `Once upon a time...` provides little context, it's normal for the model to not always return expected results. You can adjust the maximum number of tokens if the response seems unexpected or truncated.

Azure OpenAI also performs content moderation on the prompt inputs and generated outputs. The prompts or responses may be filtered if harmful content is detected. For more information, see the [content filter](../concepts/content-filter.md) article.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure PowerShell](../../multi-service-resource.md?pivots=azpowershell#clean-up-resources)

## Next steps

- Learn more about how to generate the best completion in our [How-to guide on completions](../how-to/completions.md).
- For more examples check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples).
