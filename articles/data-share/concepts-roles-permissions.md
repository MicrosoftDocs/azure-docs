---
title: Roles and requirements for Azure Data Share Preview  
description: Roles and requirements for Azure Data Share Preview  
author: joannapea

ms.service: data-share
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: joanpo
---

# Roles and requirements for Azure Data Share Preview

This article describes the roles required to share data using Azure Data Share Preview, as well as to accept and receive data using Azure Data Share Preview. 

## Roles and requirements

To share or receive data using Azure Data Share, the user account that you use to sign in to Azure must be able to grant Data Share permissions to the Storage account that you are sharing data from or receiving data in to. Typically this is a permission that exists in the **owner** role, or a custom role with Microsoft.Authorization/role assignments/write permission assigned. 

To share or receive data from or to an Azure Storage account, you must be an owner of the storage account. Even if you have created the Storage account, this does not automatically grant you ownership of the Storage account. To add yourself in to the owner role of your Azure Storage account, follow these steps.

1. Navigate to Storage account in Azure portal
1. Select **Access control (IAM)**
1. Click **Add**
1. Add yourself in as owner

To view the permissions that you have in the subscription, in the Azure portal, select your username in the upper-right corner, and then select **Permissions**. If you have access to multiple subscriptions, select the appropriate subscription. 

## Resource Provider registration 

When accepting an Azure Data Share invitation, you will need to manually register the Microsoft.DataShare resource provider in to your subscription. Follow these steps to register the Microsoft.DataShare resource provider into your Azure Subscription. 

1. In the Azure portal, navigate to **Subscriptions**
1. Select the subscription that you're using for Azure Data Share
1. Click on **Resource Providers**
1. Search for Microsoft.DataShare
1. Click **Register**

## Next steps

- Learn more about roles in Azure - [Understand role definitions](../role-based-access-control/role-definitions.md)

