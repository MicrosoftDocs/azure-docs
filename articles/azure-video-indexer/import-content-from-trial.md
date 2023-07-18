---
title: Import your content from the trial account
description: Learn how to import your content from the trial account.
ms.topic: tutorial
ms.date: 12/19/2022
ms.author: itnorman
ms.custom: ignite-fall-2021
---

# Import content from your trial account to a regular account

If you would like to transition from the Video Indexer trial account experience to that of a regular paid account, Video Indexer allows you at not cost to import the content in your trial content to your new regular account.

When might you want to switch from a trial to a regular account?

* If you have used up the free trial minutes and want to continue indexing.
* You are ready to start using Video Indexer for production workloads.
* You want an experience which doesn't have minute, support, or SLA limitations. 

## Create a new ARM account for the import

* First you need to create an account. The regular account needs to have been already created and available before performing the import. Azure AI Video Indexer accounts are Azure Resource Manager (ARM) based and account creation can be performed through the Azure portal (see [Create an account with the Azure portal](create-account-portal.md)) or API (see [Create accounts with API](/rest/api/videoindexer/stable/accounts)).  
* The target ARM-based account has to be an empty account that has not yet been used to index any media files.
* Import from trial can be performed only once per trial account.

## Import your data

To import your data, follow the steps:

 1. Go to the [Azure AI Video Indexer website](https://aka.ms/vi-portal-link)
 2. Select your trial account and go to the **Account settings** page.
 3. Click the **Import content to an ARM-based account**.
 4. From the dropdown menu choose the ARM-based account you wish to import the data to.
   
    * If the account ID isn't showing, you can copy and paste the account ID from the Azure portal or from the list of accounts under the User account blade at the top right of the Azure AI Video Indexer Portal.
    
 5. Click **Import content**

    :::image type="content" alt-text="Screenshot that shows how to import your data." source="./media/create-account/import-to-arm-account.png":::

All media and as well as your customized content model will be copied from the trial account into the new ARM-based account.


