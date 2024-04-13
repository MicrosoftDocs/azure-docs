---
title: "Azure OpenAI account access"
description: Azure OpenAI account access
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: include
ms.date: 04/12/2024
ms.author: pafarley
---


1. Enable Managed Identity for Azure AI Content Safety.

    Navigate to your Azure AI Content Safety instance in the Azure portal. Find the **Identity** section under the **Settings** category. Enable the system-assigned managed identity. This action grants your Azure AI Content Safety instance an identity that can be recognized and used within Azure for accessing other resources. 
    
    :::image type="content" source="/azure/ai-services/content-safety/media/content-safety-identity.png" alt-text="Screenshot of a Content Safety identity resource in the Azure portal." lightbox="/azure/ai-services/content-safety/media/content-safety-identity.png":::

1. Assign Role to Managed Identity.

    Navigate to your Azure OpenAI instance, select **Add role assignment** to start the process of assigning an Azure OpenAI role to the Azure AI Content Safety identity. 

    :::image type="content" source="/azure/ai-services/content-safety/media/add-role-assignment.png" alt-text="Screenshot of adding role assignment in Azure portal.":::

    Choose the **User** or **Contributor** role.

    :::image type="content" source="/azure/ai-services/content-safety/media/assigned-roles-simple.png" alt-text="Screenshot of the Azure portal with the Contributor and User roles displayed in a list." lightbox="/azure/ai-services/content-safety/media/assigned-roles-simple.png":::