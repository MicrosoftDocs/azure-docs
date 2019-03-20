---
title: Use the Azure portal to access blob or queue datas - Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 03/19/2019
ms.author: tamram
ms.subservice: common
---

# Use the Azure portal to access blob or queue data

When you access blob or queue data using the Azure portal, your requests to Azure Storage can be authorized using either your Azure AD credentials or the account access key. The portal indicates which authorization method you are using, and enables you to switch between the two if you have the appropriate permissions.  

This article assumes you are not the account owner/admin...

## Navigate to blobs or queues in the Azure portal

To view blob or queue data in the portal, navigate to the **Overview** for your storage account, and click on the links for **Blobs** or **Queues**. 

![Navigate to blob or queue data in the Azure portal](media/storage-access-blobs-queues-portal/blob-queue-access.png)

If you have access to the storage account keys, then by default the Azure portal uses the account key to authorize your access to blobs and queues. 

If you don't have access to the account keys, then the portal checks your Azure AD credentials to see if you have been assigned one of the roles that provides access to blobs or queues. If you do, then the portal uses your Azure AD credentials to authenticate access.

## Determine which authorization method you are using

When you navigate to a container or a queue, the Azure portal indicates which authorization method you are currently using. 

### Account key

If you are authenticating using the account key, then the portal indicates the authentication method as shown in the following image:

![Currently accessing container data with the account key](media/storage-access-blobs-queues-portal/auth-method-access-key.png)

This image shows the authentication method for a container. A similar indication appears in the Azure portal for queues.

### Azure AD credentials

If you are authenticating using Azure AD credentials, then the portal indicates the authentication method as shown in the following image:

![Currently accessing container data with Azure AD credentials](media/storage-access-blobs-queues-portal/auth-method-azure-ad.png)

This image shows the authentication method for a container. A similar indication appears in the Azure portal for queues.

## Permissions needed to access blob or queue data



 your Azure AD credentials by default to access blob and queue data.



To access blob or queue data from the Azure portal, 

### Azure Resource Manager Reader role

To access blobs or queues in the Azure portal, an account administrator must assign to you the Azure Resource Manager [Reader](../../role-based-access-control/built-in-roles.md#reader) role. This assignment must be scoped to the level of the storage account or higher. 

The **Reader** role permits users to view storage account resources, but not to modify them. The **Reader** role does not provide read permissions to data in Azure Storage, but only to account management resources. Without the **Reader** role, you cannot navigate to blob or queue data in the Azure portal.

For more information about the Reader role, see [Assign the Reader role for portal access](../common/storage-auth-aad-rbac.md#assign-the-reader-role-for-portal-access).

### Azure AD roles

## Use Azure AD credentials with the portal


