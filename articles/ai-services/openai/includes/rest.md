---
title: 'Quickstart: Use the OpenAI Service to make your first completions call with the REST API'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the REST API. 
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 02/02/2023
keywords: 
---

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to Azure OpenAI in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to the Azure OpenAI service by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>
- The following Python libraries: os, requests, json
- An Azure OpenAI resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

## Set up

### Retrieve key and endpoint

To successfully make a call against Azure OpenAI, you'll need the following:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
| `DEPLOYMENT-NAME` | This value will correspond to the custom name you chose for your deployment when you deployed a model. This value can be found under **Resource Management** > **Deployments** in the Azure portal or alternatively under **Management** > **Deployments** in Azure OpenAI Studio.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview blade for an OpenAI Resource in the Azure portal with the endpoint & access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

Create and assign persistent environment variables for your key and endpoint.

[!INCLUDE [environment-variables](environment-variables.md)]


> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Set-up)


## REST API

In a bash shell, run the following command. You will need to replace `gpt-35-turbo-instruct` with the deployment name you chose when you deployed the `gpt-35-turbo-instruct` model. Entering the model name will result in an error unless you chose a deployment name that is identical to the underlying model name.

```bash
curl $AZURE_OPENAI_ENDPOINT/openai/deployments/gpt-35-turbo-instruct/completions?api-version=2023-05-15 \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -d "{\"prompt\": \"Once upon a time\"}"
```

The format of your first line of the command with an example endpoint would appear as follows `curl https://docs-test-001.openai.azure.com/openai/deployments/{YOUR-DEPLOYMENT_NAME_HERE}/completions?api-version=2023-05-15 \`. If you encounter an error double check to make sure that you don't have a doubling of the `/` at the separation between your endpoint and `/openai/deployments`.

If you want to run this command in a normal Windows command prompt you would need to alter the text to remove the `\` and line breaks.

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

## Output

The output from the completions API will look as follows.

```json
{
    "id": "ID of your call",
    "object": "text_completion",
    "created": 1675444965,
    "model": "gpt-35-turbo-instruct",
    "choices": [
        {
            "text": " there lived in a little village a woman who was known as the meanest",
            "index": 0,
            "finish_reason": "length",
            "logprobs": null
        }
    ],
    "usage": {
        "completion_tokens": 16,
        "prompt_tokens": 3,
        "total_tokens": 19
    }
}
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Create-sample-code)

The Azure OpenAI Service also performs content moderation on the prompt inputs and generated outputs. The prompts or responses may be filtered if harmful content is detected. For more information, see the [content filter](../concepts/content-filter.md) article.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more about how to generate the best completion in our [How-to guide on completions](../how-to/completions.md).
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples).
