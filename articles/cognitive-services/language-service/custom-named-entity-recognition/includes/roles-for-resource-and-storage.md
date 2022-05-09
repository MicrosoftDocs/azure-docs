---
title: How to create custom text classification projects
titleSuffix: Azure Cognitive Services
description: Learn about the steps for using Azure resources with custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 05/06/2022
ms.author: aahi
ms.custom: language-service-custom-classification, references_regions, ignite-fall-2021
---

### Roles for your Azure Language resource

You should have the **owner** or **contributor** role assigned on your **Azure Language resource**.

<!-- add GIF for the previous step --->

### Roles for your storage account

Your Azure blob storage account must have the below roles:

* Your **Language resource** has the **Storage blob data contributor** role on the storage account.

To set proper roles on your storage account:

1. Go to your storage account page in the [Azure portal](https://portal.azure.com/).
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** to **Add Role Assignments**, and choose the appropriate role for your Language resource.
4. Select **Managed identity** under **Assign access to**. 
5. Select **Members** and find your resource. In the window that appears, select your subscription, and **Language** as the managed identity. You can search for user names in the **Select** field. Repeat this for all roles. 

<!-- add GIF for the previous step --->
