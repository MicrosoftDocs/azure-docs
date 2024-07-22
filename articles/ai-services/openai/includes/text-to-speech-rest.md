---
ms.topic: include
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 2/1/2024
ms.reviewer: v-baolianzou
ms.author: eur
author: eric-urban
recommendations: false
---

## REST API

In a bash shell, run the following command. You need to replace `YourDeploymentName` with the deployment name you chose when you deployed the text to speech model. The deployment name isn't necessarily the same as the model name. Entering the model name results in an error unless you chose a deployment name that is identical to the underlying model name.

```bash
curl $AZURE_OPENAI_ENDPOINT/openai/deployments/YourDeploymentName/audio/speech?api-version=2024-02-15-preview \
 -H "api-key: $AZURE_OPENAI_API_KEY" \
 -H "Content-Type: application/json" \
 -d '{
    "model": "tts-1-hd",
    "input": "I'm excited to try text to speech.",
    "voice": "alloy"
}' --output speech.mp3
```

The format of your first line of the command with an example endpoint would appear as follows curl `https://aoai-docs.openai.azure.com/openai/deployments/{YourDeploymentName}/audio/speech?api-version=2024-02-15-preview \`. 

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.


