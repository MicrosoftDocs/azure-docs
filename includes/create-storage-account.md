---
 title: include file
 description: include file
 services: private-link
 author: asudbring
 ms.service: private-link
 ms.topic: include
 ms.date: 07/18/2023
 ms.author: allensu
 ms.custom: include file
---

## Create a storage account

Create an Azure storage account for the steps in this article. If you already have a storage account, you can use it instead.

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.
   
1. Select **+ Create**.

1. In the **Basics** tab of **Create a storage account** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **test-rg**. |
    | **Instance details** |  |
    | Storage account name | Enter **storage1**. If the name is unavailable, enter a unique name. |
    | Location | Select **(US) East US 2**. |
    | Performance | Leave the default **Standard**. |
    | Redundancy | Select **Locally-redundant storage (LRS)**. |
   
1. Select **Review**.

1. Select **Create**.