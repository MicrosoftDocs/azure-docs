---
title: Custom domain names with Azure Blob storage endpoints
description: Learn how to configure a storage account for static website hosting, and deploy a static website to Azure Storage.
author: normesta
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.date: 1/10/2020
ms.author: normesta
ms.reviewer: dineshm
---

# Test title

Content goes here.

# Configure a custom domain name for your Azure storage account

You can configure a custom domain for accessing blob data in your Azure storage account. The default endpoint for Azure Blob storage is *\<storage-account-name>.blob.core.windows.net*. You can also use the web endpoint that's generated as a part of the [static websites feature](storage-blob-static-website.md). If you map a custom domain and subdomain, such as *www\.contoso.com*, to the blob or web endpoint for your storage account, your users can use that domain to access blob data in your storage account.

> [!IMPORTANT]
> Azure Storage does not yet natively support HTTPS with custom domains. You can currently [Use Azure CDN to access blobs by using custom domains over HTTPS](storage-https-custom-domain-cdn.md).
> 
> 
> [!NOTE]
> Storage accounts currently support only one custom domain name per account. You can't map a custom domain name to both the web and blob service endpoints.
> 
> [!NOTE]
> The mapping does only work for subdomains (e.g. www\.contoso.com). If you want to have your web endpoint available on the root domain (e.g. contoso.com), then you have to [Add a custom domain to your Azure CDN endpoint](https://docs.microsoft.com/azure/cdn/cdn-map-content-to-custom-domain).

The following table shows a few sample URLs for blob data that's located in a storage account named *mystorageaccount*. The custom subdomain that's registered for the storage account is *www\.contoso.com*:

| Resource type | Default URL | Custom domain URL |
| --- | --- | --- |
| Storage account | http:\//mystorageaccount.blob.core.windows.net | http:\//www.contoso.com |
| Blob |http:\//mystorageaccount.blob.core.windows.net/mycontainer/myblob | http:\//www.contoso.com/mycontainer/myblob |
| Root container | http:\//mystorageaccount.blob.core.windows.net/myblob or http:\//mystorageaccount.blob.core.windows.net/$root/myblob | http:\//www.contoso.com/myblob or http:\//www.contoso.com/$root/myblob |
| Web |  http:\//mystorageaccount.[zone].web.core.windows.net/$web/[indexdoc] or http:\//mystorageaccount.[zone].web.core.windows.net/[indexdoc] or http:\//mystorageaccount.[zone].web.core.windows.net/$web or http:\//mystorageaccount.[zone].web.core.windows.net/ | http:\//www.contoso.com/$web or http:\//www.contoso.com/ or http:\//www.contoso.com/$web/[indexdoc] or  http:\//www.contoso.com/[indexdoc] |

> [!NOTE]  
> As shown in the following sections, all examples for the blob service endpoint also apply to the web service endpoint.

## Direct vs. intermediary CNAME mapping

You can point your custom domain prefixed with a subdomain (e.g. www\.contoso.com) to the blob endpoint for your storage account in either of two ways: 
* Use direct CNAME mapping.
* Use the *asverify* intermediary subdomain.

### Directly map a custom domain to a blob endpoint

The first, and simplest, method is to create a canonical name (CNAME) record that maps your custom domain and subdomain directly to the blob endpoint. A CNAME record is a domain name system (DNS) feature that maps a source domain to a destination domain. In our example, the source domain is your own custom domain and subdomain (*www\.contoso.com*, for example). The destination domain is your blob service endpoint (*mystorageaccount.blob.core.windows.net*, for example).

The direct method is covered in the "Register a custom domain" section.

### Intermediary mapping with *asverify*

The second method also uses CNAME records. To avoid downtime, however, it first employs a special subdomain *asverify* that's recognized by Azure.

Mapping your custom domain to a blob endpoint can cause a brief period of downtime while you are registering the domain in the [Azure portal](https://portal.azure.com). If the domain currently supports an application with a service-level agreement (SLA) that requires zero downtime, use the Azure *asverify* subdomain as an intermediate registration step. This step ensures that users can access your domain while the DNS mapping takes place.

The intermediary method is covered in Register a custom domain by using the *asverify* subdomain.

## Next Steps

* [Learn about Blob Storage Tiers](storage-blob-storage-tiers.md)
* [Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
* [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)
* [Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)