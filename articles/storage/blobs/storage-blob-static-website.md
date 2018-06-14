---
title: Static website hosting in Azure Blob Storage (Preview) | Microsoft Docs
description: Azure Blob Storage now offers static website hosting (Preview), providing a cost-effective, scalable solution for hosting modern web applications.  
services: storage
author: MichaelHauss
manager: vamshik

ms.service: storage
ms.topic: article
ms.date: 06/19/18
ms.author: mihauss
---
# Static website hosting in Azure Blob Storage (Preview)
Azure Blob Storage now offers static website hosting (Preview), providing a cost-effective, scalable solution for hosting modern web applications. On a static website, webpages contain static content and / or client-side scripts. By contrast, dynamic websites depend on server-side processing, and can be hosted using [Azure Web Apps](/app-service/app-service-web-overview.md). Despite not supporting server-side code, static websites hosted on Azure Storage enable rich backend capabilities with serverless architectures leveraging [Azure Functions](/azure-functions/functions-overview.md) and other PaaS services.

## How does it work?
When you enable static websites on your storage account, a new web service endpoint is created of the form

```
<account-name>.<zone-name>.web.core.windows.net
```

The web service endpoint supports only publicly readable content, returns formatted HTML pages in response to service errors, and allows only object read operations. When the storage account root is requested, the web endpoint returns the index document specified during configuration. If a directory is requested, the storage service will return the index document in that directory. When the storage service returns a 404 error, the web endpoint (optionally) returns a custom error document.

Content for your static website is hosted in a special container named "$web". As a part of the enablement process, "$web" is created for you if it does not already exist. Content in "$web" can be accessed at the account root using the web endpoint. For example

```
https://contoso.z4.web.core.windows.net/
```

returns the index document you configured for your website. When uploading content to your website, use the blob storage endpoint. To upload a blob named 'image.jpg' use the following URL

```
https://contoso.blob.core.windows.net/$web/image.jpg
```

which can be viewed in a web browser at the corresponding web endpoint

```
https://contoso.z4.web.core.windows.net/image.jpg
```

## Custom domain names
You can use a custom domain to host your web content. To do so, follow the guidance in [Configure a custom domain name for your Azure Storage account](storage-custom-domain-name.md). To access your website hosted at a custom domain name over HTTPS, see [Using the Azure CDN to access blobs with custom domains over HTTPS](storage-https-custom-domain-cdn.md).

## Pricing and Billing
Static website hosting is provided at no additional cost.

For more details on prices for Azure Blob Storage, check out the [Azure Blob Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Quickstart
### Azure portal
Navigate to your storage account in Azure Portal and click on "Static website (preview)" under "Settings" in the left navigation bar. Click enabled and enter the name of the index document and (optionally) the custom error document path.

![](media/storage-blob-static-website/storage-blob-static-website-portal-config.PNG)

The "$web" container is created for you as a part of enabling static websites. Navigate to that container and upload your web assets in Azure Portal, including an index document with the name you configured. In this example, the document's name is "index.html".

Finally, navigate to your web endpoint to test your website. In this case, the web endpoint is

```
https://newfeaturetests.z4.web.core.windows.net/
```

## FAQ
**Is soft delete available for all storage account types?**  
No, static website hosting is only available in GPv2 standard storage accounts.

**In which regions are static websites available?**  
During preview, static websites are available in US West Central and US West 2.

## Next steps
* [Using the Azure CDN to access blobs with custom domains over HTTPS](storage-https-custom-domain-cdn.md)
* [Configure a custom domain name for your blob or web endpoint](storage-custom-domain-name.md)
* [Azure Functions](/azure-functions/functions-overview.md)
* [Azure Web Apps](/app-service/app-service-web-overview.md)
