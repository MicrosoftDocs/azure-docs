---
manager: nitinme
author: aahill
ms.author: aahi
ms.service: azure-ai-openai
ms.topic: include
ms.date: 03/27/2024
---

## Data connection

You need to select how you want to authenticate the connection from Azure OpenAI, Azure AI Search, and Azure blob storage. You can choose a *System assigned managed identity* or an *API key*. By selecting *API key* as the authentication type, the system will automatically populate the API key for you to connect with your Azure AI Search, Azure OpenAI, and Azure Blob Storage resources. By selecting *System assigned managed identity*, the authentication will be based on the [role assignment](../how-to/use-your-data-securely.md#role-assignments) you have. *System assigned managed identity* is selected by default for security. 


:::image type="content" source="../media/use-your-data/data-connection-authentication.png" alt-text="A screenshot showing the managed identity option in Azure OpenAI Studio." lightbox="../media/use-your-data/data-connection-authentication.png":::

Once you select the **next** button, it will automatically validate your setup to use the selected authentication method. If you encounter an error, see the [role assignments article](../how-to/use-your-data-securely.md#role-assignments) to update your setup.

Once you have fixed the setup, select **next** again to validate and proceed. API users can also [configure authentication](../references/azure-search.md#api-key-authentication-options) with assigned managed identity and API keys.

