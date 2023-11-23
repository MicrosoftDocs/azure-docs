---
services: ai-services
manager: nitinme
author: mgreenegit
ms.author: migreene
ms.service: openai
ms.topic: include
ms.date: 11/22/2023
---

## PowerShell

Run the following command. You need to replace `MyDeploymentName` with the deployment name you chose when you deployed the Whisper model. Entering the model name results in an error unless you chose a deployment name that is identical to the underlying model name.

```powershell-interactive
   # Azure OpenAI metadata variables
   $openai = @{
       api_key     = $Env:AZURE_OPENAI_KEY
       api_base    = $Env:AZURE_OPENAI_ENDPOINT # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
       api_version = '2023-09-01-preview' # this may change in the future
       name        = 'YOUR-DEPLOYMENT-NAME-HERE' #This will correspond to the custom name you chose for your deployment when you deployed a model.
   }

   # Header for authentication
   $headers = [ordered]@{
       'api-key' = $openai.api_key
   }

   $form = @{ file = get-item -path './wikipediaOcelot.wav' }

   # Send a completion call to generate an answer
   $url = "$($openai.api_base)/openai/deployments/$($openai.name)/audio/transcriptions?api-version=$($openai.api_version)"

   $response = Invoke-RestMethod -Uri $url -Headers $headers -Form $form -Method Post -ContentType 'multipart/form-data'
   return $response.text
   ```

You can get sample audio files from the [Azure AI Speech SDK repository at GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/sampledata/audiofiles).

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [The PowerShell Secret Management with Azure Key Vault](/powershell/utility-modules/secretmanagement/how-to/using-azure-keyvault). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

## Output

```text
The ocelot, Lepardus paradalis, is a small wild cat native to the southwestern United States, Mexico, and Central and South America. This medium-sized cat is characterized by solid black spots and streaks on its coat, round ears, and white neck and undersides. It weighs between 8 and 15.5 kilograms, 18 and 34 pounds, and reaches 40 to 50 centimeters 16 to 20 inches at the shoulders. It was first described by Carl Linnaeus in 1758. Two subspecies are recognized, L. p. paradalis and L. p. mitis. Typically active during twilight and at night, the ocelot tends to be solitary and territorial. It is efficient at climbing, leaping, and swimming. It preys on small terrestrial mammals such as armadillo, opossum, and lagomorphs.
```
