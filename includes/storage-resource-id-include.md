---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 07/15/2019
ms.author: tamram
ms.custom: "include file"
---

An Azure AD resource ID indicates the audience for which a token that is issued can be used to provide access to an Azure resource. In the case of Azure Storage, the resource ID may be specific to a single storage account, or it may apply to any storage account. The following table describes the values that you can provide for the resource ID:

|Resource ID  |Description  |
|---------|---------|
|`https://<account>.blob.core.windows.net` <br /><br /> `https://<account>.queue.core.windows.net`    | The service endpoint for a given storage account. Use this value to acquire a token for authorizing requests to that specific Azure Storage account and service only. Replace the value in brackets with the name of your storage account.      |
|`https://storage.azure.com/`     | Use to acquire a token for authorizing requests to any Azure Storage account.        |
