---
services: ai-services
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: openai
ms.topic: include
ms.date: 09/15/2023
---

## REST API

In a bash shell, run the following command. You need to replace `MyDeploymentName` with the deployment name you chose when you deployed the Whisper model. Entering the model name results in an error unless you chose a deployment name that is identical to the underlying model name.

```bash
curl $AZURE_OPENAI_ENDPOINT/openai/deployments/MyDeploymentName/audio/transcriptions?api-version=2023-09-01-preview \
 -H "api-key: $AZURE_OPENAI_KEY" \
 -H "Content-Type: multipart/form-data" \
 -F file="@./wikipediaOcelot.wav"
```

The format of your first line of the command with an example endpoint would appear as follows `curl https://aoai-docs.openai.azure.com/openai/deployments/{YOUR-DEPLOYMENT_NAME_HERE}/audio/transcriptions?api-version=2023-09-01-preview \`. 

You can get sample audio files from the [Azure AI Speech SDK repository at GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/sampledata/audiofiles).

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

## Output

```bash
{"text":"The ocelot, Lepardus paradalis, is a small wild cat native to the southwestern United States, Mexico, and Central and South America. This medium-sized cat is characterized by solid black spots and streaks on its coat, round ears, and white neck and undersides. It weighs between 8 and 15.5 kilograms, 18 and 34 pounds, and reaches 40 to 50 centimeters 16 to 20 inches at the shoulders. It was first described by Carl Linnaeus in 1758. Two subspecies are recognized, L. p. paradalis and L. p. mitis. Typically active during twilight and at night, the ocelot tends to be solitary and territorial. It is efficient at climbing, leaping, and swimming. It preys on small terrestrial mammals such as armadillo, opossum, and lagomorphs."}
```
