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

## Use Azure AD credentials with the portal

To access blobs or queues in the Azure portal using your Azure AD credentials, use the preview links shown in the following image:

![Access blobs or queues with Azure AD credentials in portal](media/storage-auth-aad-rbac/access-data-azure-ad.png)

If you access blob or queue data using the production links rather than the preview links, the Azure portal uses your account key to authorize access, rather than using Azure AD.
