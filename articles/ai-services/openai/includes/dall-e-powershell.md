---
title: "Quickstart: Generate images with Azure OpenAI Service using PowerShell"
titleSuffix: Azure OpenAI Service
description: Learn how to generate images with Azure OpenAI Service by using PowerShell and the endpoint and access keys for your Azure OpenAI resource.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 08/29/2023
---

Use this guide to get started calling the Azure OpenAI Service image generation APIs by using PowerShell.

> [!NOTE]
> The image generation API creates an image from a text prompt. It doesn't edit existing images or create variations.

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- For this task, <a href="https://aka.ms/installpowershell" target="_blank">the latest version of PowerShell 7</a> is recommended because the examples use new features not available in Windows PowerShell 5.1.
- An Azure OpenAI resource created in the East US region. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).


## Setup

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]

> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=POWERSHELL&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Set-up)

## Create a new PowerShell script

1. Create a new PowerShell file named _quickstart.ps1_. Open the new file in your preferred editor or IDE.

1. Replace the contents of _quickstart.ps1_ with the following code. Enter your endpoint URL and key in the appropriate fields. Change the value of `prompt` to your preferred text.

   ```powershell
   # Azure OpenAI metadata variables
   $openai = @{
     api_key     = $Env:AZURE_OPENAI_API_KEY
     api_base    = $Env:AZURE_OPENAI_ENDPOINT # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
     api_version = '2023-06-01-preview' # this may change in the future
   }

   # Text to describe image
   $prompt = 'A painting of a dog'

   # Header for authentication
   $headers = [ordered]@{
     'api-key' = $openai.api_key
   }

   # Adjust these values to fine-tune completions
   $body = [ordered]@{
      prompt = $prompt
      size   = '1024x1024'
      n      = 1
   } | ConvertTo-Json

    # Call the API to generate the image and retrieve the response
   $url = "$($openai.api_base)/openai/images/generations:submit?api-version=$($openai.api_version)"

   $submission = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json' -ResponseHeadersVariable submissionHeaders

    $operation_location = $submissionHeaders['operation-location'][0]
    $status = ''
    while ($status -ne 'succeeded') {
        Start-Sleep -Seconds 1
        $response = Invoke-RestMethod -Uri $operation_location -Headers $headers
        $status   = $response.status
    }

   # Set the directory for the stored image
   $image_dir = Join-Path -Path $pwd -ChildPath 'images'

   # If the directory doesn't exist, create it
   if (-not(Resolve-Path $image_dir -ErrorAction Ignore)) {
       New-Item -Path $image_dir -ItemType Directory
   }

   # Initialize the image path (note the filetype should be png)
   $image_path = Join-Path -Path $image_dir -ChildPath 'generated_image.png'

   # Retrieve the generated image
   $image_url = $response.result.data[0].url  # extract image URL from response
   $generated_image = Invoke-WebRequest -Uri $image_url -OutFile $image_path  # download the image
   return $image_path
   ```

   > [!IMPORTANT]
   > For production, use a secure way of storing and accessing your credentials like [The PowerShell Secret Management with Azure Key Vault](/powershell/utility-modules/secretmanagement/how-to/using-azure-keyvault). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Run the script using PowerShell:

   ```powershell
   ./quickstart.ps1
   ```

   The script loops until the generated image is ready.

## Output

PowerShell requests the image from Azure OpenAI and stores the output image in the _generated_image.png_ file in your specified directory. For convenience, the full path for the file is returned at the end of the script.

The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it doesn't generate an image. For more information, see [Content filtering](../concepts/content-filter.md).

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure PowerShell](../../multi-service-resource.md?pivots=azpowershell#clean-up-resources)

## Next steps

* Explore the image generation APIs in more depth with the [DALL-E how-to guide](../how-to/dall-e.md).
- Try examples in the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
