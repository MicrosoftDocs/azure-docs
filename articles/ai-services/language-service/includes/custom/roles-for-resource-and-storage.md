---
title: How to create custom text classification projects
titleSuffix: Azure AI services
description: Learn about the steps for using Azure resources with custom text classification.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

Use the following steps to set the required roles for your Language resource and storage account.

:::image type="content" source="../../custom-text-classification/media/add-roles.gif" alt-text="An animated image showing how to set roles in the Azure portal." lightbox="../../custom-text-classification/media/add-roles.gif":::

### Roles for your Azure AI Language resource

1. Go to your storage account or Language resource in the [Azure portal](https://portal.azure.com/).
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** to **Add Role Assignments**, and choose the appropriate role for your account.

    You should have the **owner** or **contributor** role assigned on your Language resource.

4. Within **Assign access to**, select **User, group, or service principal**
5. Select **Select members**
6. Select your user name. You can search for user names in the **Select** field. Repeat this for all roles. 
7. Repeat these steps for all the user accounts that need access to this resource. 

### Roles for your storage account

1. Go to your storage account page in the [Azure portal](https://portal.azure.com/).
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** to **Add Role Assignments**, and choose the **Storage blob data contributor** role on the storage account.
4. Within **Assign access to**, select **Managed identity**. 
5. Select **Select members**
6. Select your subscription, and **Language** as the managed identity. You can search for user names in the **Select** field. 

> ![IMPORTANT]
> If you have a virtual network or private endpoint, be sure to select **Allow Azure services on the trusted services list to access this storage account** in the Azure portal.


