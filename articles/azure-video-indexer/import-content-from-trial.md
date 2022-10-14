---
title: Import your content from the trial account
description: Learn how to import your content from the trial account.
ms.topic: tutorial
ms.date: 05/03/2022
ms.author: itnorman
ms.custom: ignite-fall-2021
---

# Import your content from the trial account

[!INCLUDE [accounts](./includes/arm-accounts.md)]

When creating a new ARM-based account, you have an option to import your content from the trial account into the new ARM-based account free of charge.

## Considerations

Review the following considerations.

* Import from trial can be performed only once per trial account.
* The target ARM-based account needs to be created and available before import is assigned.
* Target ARM-based account has to be an empty account (never indexed any media files).

## Import your data

To import your data, follow the steps:

 1. Go to [Azure Video Indexer portal](https://aka.ms/vi-portal-link)
 2. Select your trial account and go to the **Account settings** page.
 3. Click the **Import content to an ARM-based account**.
 4. From the dropdown menu choose the ARM-based account you wish to import the data to.
   
    * If the account ID isn't showing, you can copy and paste the account ID from Azure portal or the account list, on the side blade in the Azure Video Indexer Portal.
 5. Click **Import content**

    :::image type="content" alt-text="Screenshot that shows how to import your data." source="./media/create-account/import-to-arm-account.png":::

All media and content model customizations will be copied from the trial account into the new ARM-based account.

## Next steps

You can programmatically interact with your trial account and/or with your Azure Video Indexer accounts that are connected to Azure by following the instructions in: [Use APIs](video-indexer-use-apis.md).

You should use the same Azure AD user you used when connecting to Azure.
