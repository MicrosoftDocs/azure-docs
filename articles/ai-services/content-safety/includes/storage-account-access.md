---
title: "Storage account access"
description: Storage account access
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: include
ms.date: 04/12/2024
ms.author: pafarley
---


Next, you need to give your Content Safety resource access to read from the Azure Storage resource. Enable system-assigned Managed identity for the Azure AI Content Safety instance and assign the role of **Storage Blob Data Contributor/Owner/Reader** to the identity:

1. Enable managed identity for the Azure AI Content Safety instance. 

    :::image type="content" source="/azure/ai-services/content-safety/media/role-assignment.png" alt-text="Screenshot of Azure portal enabling managed identity.":::

1. Assign the role of **Storage Blob Data Contributor/Owner/Reader** to the Managed identity. Any roles highlighted below should work.

    :::image type="content" source="/azure/ai-services/content-safety/media/add-role-assignment.png" alt-text="Screenshot of the Add role assignment screen in Azure portal.":::

    :::image type="content" source="/azure/ai-services/content-safety/media/assigned-roles.png" alt-text="Screenshot of assigned roles in the Azure portal.":::

    :::image type="content" source="/azure/ai-services/content-safety/media/managed-identity-role.png" alt-text="Screenshot of the managed identity role.":::