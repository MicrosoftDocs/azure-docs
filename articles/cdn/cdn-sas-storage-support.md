---
title: SAS storage support | Microsoft Docs
description: ''
services: cdn
documentationcenter: ''
author: dksimpson
manager: 
editor: ''

ms.assetid: 
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/14/2017
ms.author: v-deasim

---

# SAS storage support

## Setting up the Azure Content Delivery Network (CDN) to work with storage SAS

When you serve content from a storage account, you may want to secure how users can access your files. Otherwise, a storage container that has public access can be accessed by anyone who knows its URL. To protect a storage account that you’ve allowed the CDN to access, use the Shared Access Signature (SAS) feature from Azure storage, which allows you to access private storage containers.

A SAS is a URI that grants restricted access rights to your Azure Storage resources without exposing your account key. You can provide a SAS to clients that you do not trust with your storage account key but to whom you want to delegate access to certain storage account resources. By distributing a shared access signature URI to these clients, you grant them access to a resource for a specified period of time.
 
SAS allows you to define various parameters of access to a blob, such as start and expiry times, permissions (read/write), and IP ranges. This article describes how to use SAS in conjunction with CDN. For more information about SAS, including how to create it and its parameter options, see [Using shared access signatures (SAS)](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1).

## Usage
The following three options are recommended for using SAS with Azure CDN. All options assume that you have already created a working SAS (see prerequisites). 
 
### Prerequisites
To start, create a storage account and then a SAS for your asset. You can create two types of stored access signatures: a service SAS or an account SAS. For more information, see [Types of shared access signatures](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1#types-of-shared-access-signatures).

For example, you can access your blob storage file with the following URL:  `https://<account>.blob.core.windows.net/<folder>/<file>?sv=<SAS_TOKEN>`
 
For more information about setting parameters, see [SAS parameter considerations](#sas-parameter-considerations) or [Using shared access signatures (SAS)](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1#shared-access-signature-parameters).

![CDN SAS settings](./media/cdn-sas-storage-support/cdn-sas-settings.png)

### Option 1: Using CDN token authentication with a rules engine rewrite rule

This option is the most secure and customizable, and requires Azure CDN Premium from Verizon. Client access is based on the security parameters set on the CDN security token. However, if the SAS becomes invalid, the CDN won't be able to revalidate the content from the origin server.

1. [Create a token](https://docs.microsoft.com/azure/cdn/cdn-token-auth#setting-up-token-authentication) and activate it by using the rules engine for the CDN endpoint and path where your users can access the file.

   A SAS URL has the following format:   
   `https://<endpoint>.azureedge.net/<folder>/<file>?<CDN_SECURITY_TOKEN>`
 
   Here is a sample Blob service SAS URL:   
   ```https://demostorage.blob.core.windows.net/?sv=2017-04-17&ss=b&srt=c&sp=r&se=2027-12-19T17:35:58Z&st=2017-12-19T09:35:58Z&spr=https&sig=kquaXsAuCLXomN7R00b8CYM13UpDbAHcsRfGOW3Du1M%3D```

   Parameter options for CDN token authentication are different than the parameter options for SAS. If you choose to use an expiration time when you create a CDN token, set it to the same value as the expiration time for the SAS. Doing so ensures that the expiration time is predictable. 
 
2. Use the [rules engine](https://docs.microsoft.com/azure/cdn/cdn-rules-engine) to create a rule to enable token access to all blobs in the container. New rules take about 90 minutes to propagate.

   ![CDN Manage button](./media/cdn-sas-storage-support/cdn-manage-btn.png)

   ![CDN rules engine button](./media/cdn-sas-storage-support/cdn-rules-engine-btn.png)

   ![CDN URL Rewrite rule](./media/cdn-sas-storage-support/cdn-url-rewrite-rule.png)

3. When you renew the SAS, update the rewrite rule to the new token. 

### Option 2: Using SAS with pass-through to blob storage from the CDN

This option is the simplest and uses only a single SAS token, which is passed from the CDN to the origin server. It is supported for both Azure CDN from Verizon and Akamai for both Standard and Premium profiles. 
 
1. Select an endpoint, click **Caching rules**, then select **Cache every unique URL** from the **Query string caching** list.

    ![CDN caching rules](./media/cdn-sas-storage-support/cdn-caching-rules.png)

2. After you set up SAS on your storage account, use the SAS token with the CDN URL to access the file. 
   
   The resulting URL has the following format:
   `https://<endpoint>.azureedge.net/<folder>/<file>?sv=<SAS_TOKEN>`

   For example:   
   ```https://demostorage.blob.core.windows.net/?sv=2017-04-17&ss=b&srt=c&sp=r&se=2027-12-19T17:35:58Z&st=2017-12-19T09:35:58Z&spr=https&sig=kquaXsAuCLXomN7R00b8CYM13UpDbAHcsRfGOW3Du1M%3D```
 
   Note that the CDN does not honor SAS parameters (such as expires time). If the file is cached for a long duration, it may be accessible from CDN after the expiration time that is set on SAS has passed. To indicate that you no longer want the file to be accessible, perform a purge operation on the file after the expiration has passed.

### Option 3: Hidden CDN token using rewrite
 
With this option, you can secure the origin blob storage without requiring a token for the CDN user. You may want to use this option if you don't need specific access restrictions for the file, but want to prevent users from accessing the storage origin directly in order to improve CDN offload times. This option is available only for Azure CDN Premium from Verizon. 
 
1. Use the [rules engine](https://docs.microsoft.com/azure/cdn/cdn-rules-engine) to create a rule. New rules take about 90 minutes to propagate.
 
2. Access the file on your CDN without the token. 
 
   For example:
   `https://<endpoint>.azureedge.net/<folder>/<file>`
 
   Note that the CDN endpoint will not be secured. In addition, long caching durations can make the file available after the expiration time of the SAS. If you want to make your cached file inaccessible after the expiration time or after you revoke a SAS, you must purge it.

### SAS parameter considerations

Because SAS parameters are not visible to the CDN, the CDN cannot change its delivery behavior based on them. The defined parameter restrictions apply only on requests that the CDN makes to the origin server, not for requests from the client to the CDN. This distinction is important to consider when you set the SAS parameters. If these advanced capabilities are required and you are using [Option 1](#option-1-using-cdn-token-authentication-with-a-rules-engine-rewrite-rule), set the appropriate restrictions on the CDN security token.

| SAS parameter name | Description |
| --- | --- |
| Start | The time that the CDN can begin to access the blob file. Due to clock skew (when clock a signal arrives at different times for different components), choose a time 15 minutes earlier if you want the asset to be available immediately. |
| End | The time after which the CDN can no longer access the blob file. Previously cached files on the CDN will still be accessible. To control the file expiry time, either set the appropriate expiry time on the CDN security token or purge the asset. |
| Allowed IP addresses | Optional. If you are using **Azure CDN from Verizon**, you can set this parameter to the ranges defined in [Azure CDN from Verizon Edge Server IP Ranges](https://msdn.microsoft.com/library/mt757330.aspx). If you are using **Azure CDN from Akamai**, you cannot set the IP ranges parameter because the IP addresses are not static.|
| Allowed protocols | The protocol(s) allowed for a request made with the account SAS. The HTTPS setting is recommended.|

## See also
- [Using shared access signatures (SAS)](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1)
- [Shared Access Signatures, Part 2: Create and use a SAS with Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-dotnet-shared-access-signature-part-2)
- [Securing Azure Content Delivery Network assets with token authentication](https://docs.microsoft.com/azure/cdn/cdn-token-auth)
