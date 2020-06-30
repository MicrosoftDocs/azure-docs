---
title: Static website hosting in Azure Storage
description: Azure Storage static website hosting, providing a cost-effective, scalable solution for hosting modern web applications.
author: normesta
ms.service: storage
ms.topic: how-to
ms.author: normesta
ms.reviewer: dineshm
ms.date: 05/14/2020
ms.subservice: blobs
---

# Static website hosting in Azure Storage

You can serve static content (HTML, CSS, JavaScript, and image files) directly from a storage container named *$web*. Hosting your content in Azure Storage enables you to use serverless architectures that include [Azure Functions](/azure/azure-functions/functions-overview) and other Platform as a service (PaaS) services.

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

> [!NOTE]
> If your site depends on server-side code, use [Azure App Service](/azure/app-service/overview) instead.

## Setting up a static website

Static website hosting is a feature that you have to enable on the storage account.

To enable static website hosting, select the name of your default file, and then optionally provide a path to a custom 404 page. If a blob storage container named **$web** doesn't already exist in the account, one is created for you. Add the files of your site to this container.

For step-by-step guidance, see [Host a static website in Azure Storage](storage-blob-static-website-how-to.md).

![Azure Storage static websites metrics metric](./media/storage-blob-static-website/storage-blob-static-website-blob-container.png)

Files in the **$web** container are case-sensitive, served through anonymous access requests and are available only through read operations.

## Uploading content

You can use any of these tools to upload content to the **$web** container:

> [!div class="checklist"]
> * [Azure CLI](storage-blob-static-website-how-to.md?tabs=azure-cli)
> * [Azure PowerShell module](storage-blob-static-website-how-to.md?tabs=azure-powershell)
> * [AzCopy](../common/storage-use-azcopy-v10.md)
> * [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
> * [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/)
> * [Visual Studio Code extension](/azure/javascript/tutorial-vscode-static-website-node-01)

## Viewing content

Users can view site content from a browser by using the public URL of the website. You can find the URL by using the Azure portal, Azure CLI, or PowerShell. See [Find the website URL](storage-blob-static-website-how-to.md#portal-find-url).

If the server returns a 404 error, and you have not specified an error document when you enabled the website, then a default 404 page is returned to the user.

> [!NOTE]
> [CORS](https://docs.microsoft.com/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) is not supported with static website.

### Regional codes

The URL of your site contains a regional code. For example the URL `https://contosoblobaccount.z22.web.core.windows.net/` contains regional code `z22`.

While that code must remain in the URL, it is only for internal use, and you won't have to use that code in any other way.

The index document that you specify when you enable static website hosting, appears when users open the site and don't specify a specific file (For example: `https://contosoblobaccount.z22.web.core.windows.net`).  

### Secondary endpoints

If you set up [redundancy in a secondary region](../common/storage-redundancy.md#redundancy-in-a-secondary-region), you can also access website content by using a secondary endpoint. Because data is replicated to secondary regions asynchronously, the files that are available at the secondary endpoint aren't always in sync with the files that are available on the primary endpoint. 

## Impact of the setting the public access level of the web container

You can modify the public access level of the **$web** container, but this has no impact on the primary static website endpoint because these files are served through anonymous access requests. That means public (read-only) access to all files.

The following screenshot shows the public access level setting in the Azure portal:

![Screenshot showing how to set public access level in the portal](./media/storage-manage-access-to-resources/storage-manage-access-to-resources-0.png)

While the primary static website endpoint is not affected, a change to the public access level does impact the primary blob service endpoint.

For example, if you change the public access level of the **$web** container from **Private (no anonymous access)** to **Blob (anonymous read access for blobs only)**, then the level of public access to the primary static website endpoint `https://contosoblobaccount.z22.web.core.windows.net/index.html` doesn't change.

However, the public access to the primary blob service endpoint `https://contosoblobaccount.blob.core.windows.net/$web/index.html` does change from private to public. Now users can open that file by using either of these two endpoints.

## Mapping a custom domain to a static website URL

You can make your static website available via a custom domain. 

It's easier to enable HTTP access for your custom domain, because Azure Storage natively supports it. To enable HTTPS, you'll have to use Azure CDN because Azure Storage does not yet natively support HTTPS with custom domains. see [Map a custom domain to an Azure Blob Storage endpoint](storage-custom-domain-name.md) for step-by-step guidance.

If the storage account is configured to [require secure transfer](../common/storage-require-secure-transfer.md) over HTTPS, then users must use the HTTPS endpoint. 

> [!TIP]
> Consider hosting your domain on Azure. For more information, see [Host your domain in Azure DNS](../../dns/dns-delegate-domain-azure-dns.md).

## Adding HTTP headers

There's no way to configure headers as part of the static website feature. However, you can use Azure CDN to add headers and append (or overwrite) header values. See [Standard rules engine reference for Azure CDN](https://docs.microsoft.com/azure/cdn/cdn-standard-rules-engine-reference).

If you want to use headers to control caching, see [Control Azure CDN caching behavior with caching rules](https://docs.microsoft.com/azure/cdn/cdn-caching-rules).

## Pricing

You can enable static website hosting free of charge. You're billed only for the blob storage that your site utilizes and operations costs. For more details on prices for Azure Blob Storage, check out the [Azure Blob Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Metrics

You can enable metrics on static website pages. Once you've enabled metrics, traffic statistics on files in the **$web** container are reported in the metrics dashboard.

To enable metrics on your static website pages, see [Enable metrics on static website pages](storage-blob-static-website-how-to.md#metrics).

## Next steps

* [Host a static website in Azure Storage](storage-blob-static-website-how-to.md)
* [Map a custom domain to an Azure Blob Storage endpoint](storage-custom-domain-name.md)
* [Azure Functions](/azure/azure-functions/functions-overview)
* [Azure App Service](/azure/app-service/overview)
* [Build your first serverless web app](https://docs.microsoft.com/azure/functions/tutorial-static-website-serverless-api-with-database)
* [Tutorial: Host your domain in Azure DNS](../../dns/dns-delegate-domain-azure-dns.md)
