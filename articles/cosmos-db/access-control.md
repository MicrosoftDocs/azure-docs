---
title: Setting access control in Azure Cosmos DB | Microsoft Docs
description: Learn how to set access control in Azure Cosmos DB.
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: fae3af3f-4d6e-46d8-9d9b-b80a4218add9
ms.service: cosmos-db
ms.topic: article
ms.date: 02/06/2018
ms.author: mimig

---
# Access control in Azure Cosmos DB

To add Azure Cosmos DB account reader access to your user account, have a subscription owner perform the following steps in the Azure portal.

1. Open the Azure portal, and select your Azure Cosmos DB account.
2. Click the **Access control (IAM)** tab, and then click  **+ Add**.
3. In the **Add permissions** pane, in the **Role** box, select **Cosmos DB Account Reader Role**.
4. In the **Assign access to box**, select **Azure AD user, group, or application**.
5. Select the user, group, or application in your directory to which you wish to grant access.  You can search the directory by display name, email address, or object identifiers.
    The selected user, group, or application appears in the selected members list.
6. Click **Save**.

The entity can now read Azure Cosmos DB resources.
