---
title: Using Azure CDN with SAS | Microsoft Docs
description: Azure CDN supports the use of Shared Access Signature (SAS) to grant limited access to private storage containers.
services: cdn
author: duongau
manager: danielgi
ms.assetid: 
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 02/27/2023
ms.author: duau

---
# Using Azure CDN with SAS

When you set up a storage account for Azure Content Delivery Network (CDN) to use to cache content, by default anyone who knows the URLs for your storage containers can access the files that you've uploaded. To protect the files in your storage account, you can set the access of your storage containers from public to private. However, if you do so, no one is able to access your files. 

If you want to grant limited access to private storage containers, you can use the Shared Access Signature (SAS) feature of your Azure storage account. A SAS is a URI that grants restricted access rights to your Azure Storage resources without exposing your account key. You can provide a SAS to clients that you don't trust with your storage account key but to whom you want to delegate access to certain storage account resources. By distributing a shared access signature URI to these clients, you grant them access to a resource for a specified period of time.
 
With a SAS, you can define various parameters of access to a blob, such as start and expiry times, permissions (read/write), and IP ranges. This article describes how to use SAS with Azure CDN. For more information about SAS, including how to create it and its parameter options, see [Using shared access signatures (SAS)](../storage/common/storage-sas-overview.md).

## Setting up Azure CDN to work with storage SAS
The following two options are recommended for using SAS with Azure CDN. All options assume that you've already created a working SAS (see prerequisites). 
 
### Prerequisites
To start, create a storage account and then generate a SAS for your asset. You can generate two types of stored access signatures: a service SAS or an account SAS. For more information, see [Types of shared access signatures](../storage/common/storage-sas-overview.md#types-of-shared-access-signatures).

After you've generated a SAS token, you can access your blob storage file by appending `?sv=<SAS token>` to your URL. This URL has the following format: 

`https://<account name>.blob.core.windows.net/<container>/<file>?sv=<SAS token>`
 
For example:

```
https://democdnstorage1.blob.core.windows.net/container1/demo.jpg?sv=2017-07-29&ss=b&srt=co&sp=r&se=2038-01-02T21:30:49Z&st=2018-01-02T13:30:49Z&spr=https&sig=QehoetQFWUEd1lhU5iOMGrHBmE727xYAbKJl5ohSiWI%3D
```

For more information about setting parameters, see [SAS parameter considerations](#sas-parameter-considerations) and [Shared access signature parameters](../storage/common/storage-sas-overview.md#how-a-shared-access-signature-works).

![CDN SAS settings](./media/cdn-sas-storage-support/cdn-sas-settings.png)

### Option 1: Using SAS with pass-through to blob storage from Azure CDN

This option is the simplest and uses a single SAS token, which is passed from Azure CDN to the origin server.
 
1. Select an endpoint, select **Caching rules**, then select **Cache every unique URL** from the **Query string caching** list.

    ![CDN caching rules](./media/cdn-sas-storage-support/cdn-caching-rules.png)

2. After you set up SAS on your storage account, you must use the SAS token with the CDN endpoint and origin server URLs to access the file. 
   
   The resulting CDN endpoint URL has the following format:
   `https://<endpoint hostname>.azureedge.net/<container>/<file>?sv=<SAS token>`

   For example:   
   ```
   https://demoendpoint.azureedge.net/container1/demo.jpg?sv=2017-07-29&ss=b&srt=c&sp=r&se=2027-12-19T17:35:58Z&st=2017-12-19T09:35:58Z&spr=https&sig=kquaXsAuCLXomN7R00b8CYM13UpDbAHcsRfGOW3Du1M%3D
   ```
   
3. Fine-tune the cache duration either by using caching rules or by adding `Cache-Control` headers at the origin server. Because Azure CDN treats the SAS token as a plain query string, as a best practice you should set up a caching duration that expires at or before the SAS expiration time. Otherwise, if a file is cached for a longer duration than the SAS is active, the file may be accessible from the Azure CDN origin server after the SAS expiration time has elapsed. If this situation occurs, and you want to make your cached file inaccessible, you must perform a purge operation on the file to clear it from the cache. For information about setting the cache duration on Azure CDN, see [Control Azure CDN caching behavior with caching rules](cdn-caching-rules.md).

### Option 2: Using CDN security token authentication with a rewrite rule

To use Azure CDN security token authentication, you must have an **Azure CDN Premium from Edgio** profile. This option is the most secure and customizable. Client access is based on the security parameters that you set on the security token. Once you've created and set up the security token, it's required on all CDN endpoint URLs. However, because of the URL Rewrite rule, the SAS token isn't required on the CDN endpoint. If the SAS token later becomes invalid, Azure CDN can't revalidate the content from the origin server.

1. [Create an Azure CDN security token](./cdn-token-auth.md#setting-up-token-authentication) and activate it by using the rules engine for the CDN endpoint and path where your users can access the file.

   A security token endpoint URL has the following format:   
   `https://<endpoint hostname>.azureedge.net/<container>/<file>?<security_token>`
 
   For example:   
   ```
   https://sasstoragedemo.azureedge.net/container1/demo.jpg?a4fbc3710fd3449a7c99986bkquaXsAuCLXomN7R00b8CYM13UpDbAHcsRfGOW3Du1M%3D
   ```
       
   The parameter options for a security token authentication are different than the parameter options for a SAS token. If you choose to use an expiration time when you create a security token, you should set it to the same value as the expiration time for the SAS token. Doing so ensures that the expiration time is predictable. 
 
2. Use the [rules engine](./cdn-verizon-premium-rules-engine.md) to create a URL Rewrite rule to enable SAS token access to all blobs in the container. New rules take up to 4 hours to propagate.

   The following sample URL Rewrite rule uses a regular expression pattern with a capturing group and an endpoint named *sasstoragedemo*:
   
   Source:   
   `(container1/.*)`
   
   Destination:   
   ```
   $1&sv=2017-07-29&ss=b&srt=c&sp=r&se=2027-12-19T17:35:58Z&st=2017-12-19T09:35:58Z&spr=https&sig=kquaXsAuCLXomN7R00b8CYM13UpDbAHcsRfGOW3Du1M%3D
   ```
    :::image type="content" source="./media/cdn-sas-storage-support/cdn-url-rewrite-rule.png" alt-text="Screenshot of CDN URL Rewrite rule - left.":::
    :::image type="content" source="./media/cdn-sas-storage-support/cdn-url-rewrite-rule-option-3.png" alt-text="Screenshot of CDN URL Rewrite rule - right.":::

3. If you renew the SAS, ensure that you update the Url Rewrite rule with the new SAS token. 

## SAS parameter considerations

Because SAS parameters aren't visible to Azure CDN, Azure CDN can't change its delivery behavior based on them. The defined parameter restrictions apply only on requests that Azure CDN makes to the origin server, not for requests from the client to Azure CDN. This distinction is important to consider when you set SAS parameters. If these advanced capabilities are required and you're using [Option 2](#option-2-using-cdn-security-token-authentication-with-a-rewrite-rule), set the appropriate restrictions on the Azure CDN security token.

| SAS parameter name | Description |
| --- | --- |
| Start | The time that Azure CDN can begin to access the blob file. Due to clock skew (when a clock signal arrives at different times for different components), choose a time 15 minutes earlier if you want the asset to be available immediately. |
| End | The time after which Azure CDN can no longer access the blob file. Previously cached files on Azure CDN are still accessible. To control the file expiry time, either set the appropriate expiry time on the Azure CDN security token or purge the asset. |
| Allowed IP addresses | Optional. If you're using **Azure CDN from Edgio**, you can set this parameter to the ranges defined in [Azure CDN from Edgio Edge Server IP Ranges](./cdn-pop-list-api.md). If you're using **Azure CDN from Akamai**, you can't set the IP ranges parameter because the IP addresses aren't static.|
| Allowed protocols | The protocol(s) allowed for a request made with the account SAS. The HTTPS setting is recommended.|

## Next steps

For more information about SAS, see the following articles:
- [Using shared access signatures (SAS)](../storage/common/storage-sas-overview.md)
- [Shared Access Signatures, Part 2: Create and use a SAS with Blob storage](../storage/common/storage-sas-overview.md)

For more information about setting up token authentication, see [Securing Azure Content Delivery Network assets with token authentication](./cdn-token-auth.md).
