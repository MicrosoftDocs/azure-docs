---
title: Using Azure CDN with SAS | Microsoft Docs
description: Azure CDN supports the use of Shared Access Signature (SAS) to grant limited access to private storage containers.
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
ms.author: rli v-deasim

---

# Using Azure CDN with SAS

When you serve content from the storage container of your storage account, you may want to secure how users can access your files by granting private access to the storage container. Otherwise, a storage container for which public access has been granted can be accessed by anyone who knows its URL. To protect a storage account that you’ve allowed the content delivery network (CDN) to access, you can use the Shared Access Signature (SAS) feature from Azure storage to grant limited access to private storage containers.

A SAS is a URI that grants restricted access rights to your Azure Storage resources without exposing your account key. You can provide a SAS to clients that you do not trust with your storage account key but to whom you want to delegate access to certain storage account resources. By distributing a shared access signature URI to these clients, you grant them access to a resource for a specified period of time.
 
SAS allows you to define various parameters of access to a blob, such as start and expiry times, permissions (read/write), and IP ranges. This article describes how to use SAS in conjunction with Azure CDN. For more information about SAS, including how to create it and its parameter options, see [Using shared access signatures (SAS)](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1).

## Setting up Azure CDN to work with storage SAS
The following three options are recommended for using SAS with Azure CDN. All options assume that you have already created a working SAS (see prerequisites). 
 
### Prerequisites
To start, create a storage account and then generate a SAS for your asset. You can generate two types of stored access signatures: a service SAS or an account SAS. For more information, see [Types of shared access signatures](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1#types-of-shared-access-signatures).

After you have generated a SAS, you can access your blob storage file with a URL that has the following format:  `https://<account>.blob.core.windows.net/<folder>/<file>?sv=<SAS_TOKEN>`
 
For example:
 ```
https://democdnstorage1.blob.core.windows.net/container1/sasblob.txt?sv=2017-04-17&ss=b&srt=co&sp=r&se=2038-01-02T21:30:49Z&st=2018-01-02T13:30:49Z&spr=https&sig=QehoetQFWUEd1lhU5iOMGrHBmE727xYAbKJl5ohSiWI%3D
```

For more information about setting parameters, see [SAS parameter considerations](#sas-parameter-considerations) and [Shared access signature parameters](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1#shared-access-signature-parameters).

![CDN SAS settings](./media/cdn-sas-storage-support/cdn-sas-settings.png)

### Option 1: Using SAS with pass-through to blob storage from the CDN

This option is the simplest and uses only a single SAS token, which is passed from the CDN to the origin server. It is supported by **Azure CDN from Verizon**, for both Standard and Premium profiles, and **Azure CDN from Akamai**. 
 
1. Select an endpoint, click **Caching rules**, then select **Cache every unique URL** from the **Query string caching** list.

    ![CDN caching rules](./media/cdn-sas-storage-support/cdn-caching-rules.png)

2. After you set up SAS on your storage account, use the SAS token with the CDN URL to access the file. 
   
   The resulting URL has the following format:
   `https://<endpoint>.azureedge.net/<folder>/<file>?sv=<SAS_TOKEN>`

   For example:   
   ```
   https://demoendpoint.azureedge.net/test/demo.jpg/?sv=2017-04-17&ss=b&srt=c&sp=r&se=2027-12-19T17:35:58Z&st=2017-12-19T09:35:58Z&spr=https&sig=kquaXsAuCLXomN7R00b8CYM13UpDbAHcsRfGOW3Du1M%3D
   ```
   
3. Fine-tune the cache duration either by using caching rules or by adding `Cache-Control` headers at the origin. Because the CDN treats the SAS token as a plain query string, as a best practice you should set up a caching duration that expires at or before the SAS expiration time. Otherwise, if a file is cached for a longer duration than the SAS is active, the file may be accessible from the CDN origin server after the SAS expiration time has elapsed. If this situation occurs, and you want to make your cached file inaccessible, you must perform a purge operation on the file to clear it from the cache. For information about setting the cache duration on the CDN, see [Control Azure Content Delivery Network caching behavior with caching rules](cdn-caching-rules.md).

### Option 2: Hidden CDN security token using rewrite rule
 
With this option, you can secure the origin blob storage without requiring the CDN user to use a SAS token in the URL. You may want to use this option if you don't need specific access restrictions for the file, but want to prevent users from accessing the storage origin directly to improve CDN offload times. This option is available only for **Azure CDN Premium from Verizon** profiles. 
 
1. Use the [rules engine](cdn-rules-engine.md) to create a URL Rewrite rule. New rules take about 90 minutes to propagate.

   ![CDN Manage button](./media/cdn-sas-storage-support/cdn-manage-btn.png)

   ![CDN rules engine button](./media/cdn-sas-storage-support/cdn-rules-engine-btn.png)

   This sample URL Rewrite rule has the following regular expression patterns:
   
   Source:   
   `(/test/*.)`
   
   Destination:   
   `$1&sv=2017-04-17&ss=b&srt=c&sp=r&se=2027-12-19T17:35:58Z&st=2017-12-19T09:35:58Z&spr=https&sig=kquaXsAuCLXomN7R00b8CYM13UpDbAHcsRfGOW3Du1M%3D`

   ![CDN URL Rewrite rule](./media/cdn-sas-storage-support/cdn-url-rewrite-rule.png)
 
2. You can now access the file on your CDN without the SAS token, in the following format:
   `https://<endpoint>.azureedge.net/<folder>/<file>`
 
   For example:   
   `https://demoendpoint.azureedge.net/test/demo.jpg`
       
   Note that anyone, regardless of whether they are using a SAS token, can access the CDN endpoint. 

3. Fine-tune the cache duration either by using caching rules or by adding `Cache-Control` headers at the origin. Because the CDN treats the SAS token as a plain query string, as a best practice you should set up a caching duration that expires at or before the SAS expiration time. Otherwise, if a file is cached for a longer duration than the SAS is active, the file may be accessible from the CDN origin server after the SAS expiration time has elapsed. If this situation occurs, and you want to make your cached file inaccessible, you must perform a purge operation on the file to clear it from the cache. For information about setting the cache duration on the CDN, see [Control Azure Content Delivery Network caching behavior with caching rules](cdn-caching-rules.md).

### Option 3: Using CDN security token authentication with a rewrite rule

This option is the most secure and customizable. To use CDN security token authentication, you must have an **Azure CDN Premium from Verizon** profile. Client access is based on the security parameters set on the CDN security token. However, if the SAS becomes invalid, the CDN won't be able to revalidate the content from the origin server.

1. [Create a CDN security token](https://docs.microsoft.com/azure/cdn/cdn-token-auth#setting-up-token-authentication) and activate it by using the rules engine for the CDN endpoint and path where your users can access the file.

   A security token URL has the following format:   
   `https://<endpoint>.azureedge.net/<folder>/<file>?<security_token>`
 
   For example:   
   ```
   https://demoendpoint.azureedge.net/test/demo.jpg?a4fbc3710fd3449a7c99986bkquaXsAuCLXomN7R00b8CYM13UpDbAHcsRfGOW3Du1M%3D
   ```
       
   The parameter options for a CDN security token authentication are different than the parameter options for a SAS token. If you choose to use an expiration time when you create a CDN security token, set it to the same value as the expiration time for the SAS token. Doing so ensures that the expiration time is predictable. 
 
2. Use the [rules engine](cdn-rules-engine.md) to create a URL Rewrite rule to enable SAS token access to all blobs in the container. New rules take about 90 minutes to propagate.

   This sample URL Rewrite rule has the following regular expression patterns:
   
   Source:   
   `(/test/*.)`
   
   Destination:   
   `$1&sv=2017-04-17&ss=b&srt=c&sp=r&se=2027-12-19T17:35:58Z&st=2017-12-19T09:35:58Z&spr=https&sig=kquaXsAuCLXomN7R00b8CYM13UpDbAHcsRfGOW3Du1M%3D`

   ![CDN URL Rewrite rule](./media/cdn-sas-storage-support/cdn-url-rewrite-rule.png)

3. When you renew the SAS, update the Url Rewrite rule to use the new SAS token. 

## SAS parameter considerations

Because SAS parameters are not visible to the CDN, the CDN cannot change its delivery behavior based on them. The defined parameter restrictions apply only on requests that the CDN makes to the origin server, not for requests from the client to the CDN. This distinction is important to consider when you set the SAS parameters. If these advanced capabilities are required and you are using [Option 3](#option-3-using-cdn-security-token-authentication-with-a-rewrite-rule), set the appropriate restrictions on the CDN security token.

| SAS parameter name | Description |
| --- | --- |
| Start | The time that the CDN can begin to access the blob file. Due to clock skew (when clock a signal arrives at different times for different components), choose a time 15 minutes earlier if you want the asset to be available immediately. |
| End | The time after which the CDN can no longer access the blob file. Previously cached files on the CDN are still accessible. To control the file expiry time, either set the appropriate expiry time on the CDN security token or purge the asset. |
| Allowed IP addresses | Optional. If you are using **Azure CDN from Verizon**, you can set this parameter to the ranges defined in [Azure CDN from Verizon Edge Server IP Ranges](https://msdn.microsoft.com/library/mt757330.aspx). If you are using **Azure CDN from Akamai**, you cannot set the IP ranges parameter because the IP addresses are not static.|
| Allowed protocols | The protocol(s) allowed for a request made with the account SAS. The HTTPS setting is recommended.|

## See also
- [Using shared access signatures (SAS)](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1)
- [Shared Access Signatures, Part 2: Create and use a SAS with Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-dotnet-shared-access-signature-part-2)
- [Securing Azure Content Delivery Network assets with token authentication](https://docs.microsoft.com/azure/cdn/cdn-token-auth)
