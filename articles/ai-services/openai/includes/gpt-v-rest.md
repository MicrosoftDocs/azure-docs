---
title: 'Quickstart: Use GPT-4V on your images and videos with the Azure Open AI REST API'
titleSuffix: Azure OpenAI
description: Get started using the Azure OpenAI REST APIs to deploy and use the GPT-4V (Visual) model.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/02/2023
---

Use this article to get started using the Azure OpenAI REST APIs to deploy and use the GPT-4V (Visual) model. 

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription. Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue. 
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>.
- The following Python libraries: `os`, `requests`, `json`.
- An Azure OpenAI Service resource with the GPT-4V models deployed. The resource must be in the `SwedenCentral` or  `SwitzerlandNorth` Azure region. For more information about model deployment, see [the resource deployment guide](/azure/ai-services/openai/how-to/create-resource). 

## Retrieve key and endpoint

To successfully call the Azure OpenAI APIs, you need the following information about your Azure OpenAI resource:

| Variable | Name | Value |
|---|---|---|
| **Endpoint** | `api_base` | The endpoint value is located under **Keys and Endpoint** for your resource in the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`. |
| **Key** | `api_key` | The key value is also located under **Keys and Endpoint** for your resource in the Azure portal. Azure generates two keys for your resource. You can use either value. |

Go to your resource in the Azure portal. On the navigation pane, select **Keys and Endpoint** under **Resource Management**. Copy the **Endpoint** value and an access key value. You can use either the **KEY 1** or **KEY 2** value. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot that shows the Keys and Endpoint page for an Azure OpenAI resource in the Azure portal." lightbox="../media/quickstarts/endpoint.png":::

## Create a new Python application

Create a new Python file named _quickstart.py_. Open the new file in your preferred editor or IDE.

1. Replace the contents of _quickstart.py_ with the following code. Enter your endpoint URL and key in the appropriate fields. Change the value of `prompt` to your preferred text.
    
    ```python
    #Note: The openai-python library support for Azure OpenAI is in preview. 
    
    import os 
    
    import openai 
    
    openai.api_type = "azure" 
    
    openai.api_base = "https://gpt-visual-swn.openai.azure.com/" 
    
    openai.api_version = "2023-07-01-preview" 
    
    openai.api_key = os.getenv("OPENAI_API_KEY") 
    
    response = openai.ChatCompletion.create( 
    
      engine="gpt-visual", 
    
      messages = [{"role":"system","content":"You are a marketing writing assistant. You help come up with creative content ideas and content like marketing emails, blog posts, tweets, ad copy and product descriptions. You write in a friendly yet professional tone but can tailor your writing style that best works for a user-specified audience. If you do not know the answer to a question, respond by saying \"I do not know the answer to your question.\""},{"role":"user","content":"Describe this image"},{"role":"assistant","content":"This image depicts a beautiful autumn wreath made of colorful flowers and leaves, measuring 45cm in diameter. The wreath is accented with small pumpkins and berries, creating a warm and inviting feel. Perfect for adding a touch of fall charm to any space."},{"role":"user","content":"What should I highlight about this image in the fall sales flyers?"},{"role":"assistant","content":"In the fall sales flyers, you could highlight the wreath's seasonal charm and unique design, emphasizing the pumpkins and berries that add a festive touch. You could also mention its size and versatility, as it can be used to decorate any space in need of a touch of autumn cheer."}], 
    
      temperature=1, 
    
      max_tokens=459, 
    
      top_p=0.95, 
    
      frequency_penalty=0, 
    
      presence_penalty=0, 
    
      best_of=1, 
    
      stop=None) 
    ```

1. Run the application with the `python` command:

    ```console
    python quickstart.py
    ```

    The script makes an image generation API call and then loops until the generated image is ready.

## Output

The output from a tbd

```json
{
    tbd
}
```

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more in the [Azure OpenAI overview](../overview.md).
