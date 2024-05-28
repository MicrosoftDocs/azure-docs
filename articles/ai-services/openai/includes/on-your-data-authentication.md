---
manager: nitinme
author: aahill
ms.author: aahi
ms.service: azure-ai-openai
ms.topic: include
ms.date: 03/27/2024
---

## Data connection

You need to select how you want to authenticate the connection from Azure OpenAI, Azure AI Search, and Azure blob storage. You can choose a *System assigned managed identity* or an *API key*. By selecting *API key* as the authentication type, the system will automatically populate the API key for you to connect with your Azure AI Search resource. By selecting *System assigned managed identity*, the authentication will be based on the [role assignment](../how-to/use-your-data-securely.md#role-assignments) you have. *System assigned managed identity* is selected by default for security. 


:::image type="content" source="../media/use-your-data/data-connection-authentication.png" alt-text="A screenshot showing the managed identity option in Azure OpenAI Studio." lightbox="../media/use-your-data/data-connection-authentication.png":::

Once you select the **next** button, it will automatically validate your setup to use the selected authentication method. If you encounter an error, see the [role assignments article](../how-to/use-your-data-securely.md#role-assignments) to update your setup. set the CORS **Allow Origin Type** option `All` and **Allowed origins** `*`.

Once you have fixed the setup, select **next** again to validate and proceed. API users can also [configure authentication](../references/azure-search.md#api-key-authentication-options) with assigned managed identity and API keys.


 
<!--
If you want to use *System assigned managed identity*, make sure:

1. Azure AI Search has role-based access control enabled in the keys tab.

    :::image type="content" source="../media/use-your-data/managed-identity-ai-search.png" alt-text="A screenshot showing the managed identity option for Azure AI search in the Azure portal." lightbox="../media/use-your-data/managed-identity-ai-search.png":::

1. System assigned managed identity is enabled for your Azure OpenAI resource.

    :::image type="content" source="../media/use-your-data/openai-managed-identity.png" alt-text="A screenshot showing the system assigned managed identity option in the Azure portal." lightbox="../media/use-your-data/openai-managed-identity.png":::

1. You've added [role assignments](../how-to/use-your-data-securely.md#role-assignments) correctly using Azure portal or Azure CLI
-->