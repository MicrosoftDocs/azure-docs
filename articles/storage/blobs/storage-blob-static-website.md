---
title: Static website hosting in Azure Storage
description: Azure Storage static website hosting, providing a cost-effective, scalable solution for hosting modern web applications.  
services: storage
author: MichaelHauss

ms.service: storage
ms.topic: article
ms.date: 09/17/18
ms.author: mihauss
ms.component: blobs
---

# Static website hosting in Azure Storage
Azure Storage accounts allow you to serve static content (HTML, CSS, JavaScript, and image files) directly from a storage container named *$web*. Taking advantage of hosting in Azure Storage allows you to use serverless architectures including [Azure Functions](/azure/azure-functions/functions-overview) and other PaaS services.

In contrast to static website hosting, dynamic sites that depend on server-side code are best hosted using [Azure Web Apps](/azure/app-service/app-service-web-overview).

## How does it work?
When you enable static website hosting on your storage account, you select the name of your default file and optionally provide a path to a custom 404 page. If a container named *$web* doesn't exist, then the container is created for you. 

Files in the *$web* container are:

- served through anonymous access requests
- only available through object read operations
- case-sensitive
- available to the public web following this pattern: 
    - `https://<ACCOUNT_NAME>.<ZONE_NAME>.web.core.windows.net/<FILE_NAME>`
- available through a Blob storage endpoint following this pattern: 
    - `https://<ACCOUNT_NAME>.blob.core.windows.net/$web/<FILE_NAME>`

You use the Blob storage endpoint to upload files. For instance, the file uploaded to this location:

```bash
https://contoso.blob.core.windows.net/$web/image.jpg
```

is available in the browser at this location:

```bash
https://contoso.z4.web.core.windows.net/image.jpg
```

The default file name you select is used for the root and any subdirectories. If the server returns a 404 and you do not provide an error document path, then a default 404 page is returned to the user.


## Custom domain names
You can [configure a custom domain name for your Azure Storage account](storage-custom-domain-name.md) to make your static website available via a custom domain. To access your website hosted at a custom domain name over HTTPS, see [Using the Azure CDN to access blobs with custom domains over HTTPS](storage-https-custom-domain-cdn.md). As a part of this process, you need to point your CDN to the web endpoint as opposed to the blob endpoint. You may need to wait a few minutes before your content is visible as the CDN configuration is not immediately executed.

## Pricing and billing
Static website hosting is provided at no additional cost. For more details on prices for Azure Blob Storage, check out the [Azure Blob Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Quickstart
### Azure portal
Begin by opening the Azure portal at https://portal.azure.com and run through the following steps:

1. Click on **Settings**
2. Click on **Static website**
3. Enter an index document name. A common value is *index.html*
4. Optionally enter a path to a custom 404 page. A common value is *404.html*

![](media/storage-blob-static-website/storage-blob-static-website-portal-config.PNG)

Next, upload your assets to the *$web* via the Azure Portal or use the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload entire directory structures. Make sure to include a file that matches the *index document name* you selected when enabling the feature.

Finally, navigate to your web endpoint to test your website.

### Azure CLI
Install the storage preview extension:

```azurecli-interactive
az extension add --name storage-preview
```
Enable the feature:

```azurecli-interactive
az storage blob service-properties update --account-name <account-name> --static-website --404-document <error-doc-name> --index-document <index-doc-name>
```
Query for the web endpoint URL:

```azurecli-interactive
az storage account show -n <account-name> -g <resource-group> --query "primaryEndpoints.web" --output tsv
```

Upload objects to the $web container:

```azurecli-interactive
az storage blob upload-batch -s deploy -d $web --account-name <account-name>
```

## Pricing example
Static website hosting is often paired with CDN and DNS support. The following scenario will help you to get a clear understanding to how billing is calculated for static websites.

## FAQ
**Is the static websites feature available for all storage account types?**  
No, static website hosting is only available in GPv2 standard storage accounts.

**Are Storage VNET and firewall rules supported on the new web endpoint?**  
Yes, the new web endpoint obeys the VNET and firewall rules configured for the storage account.

**Is the web endpoint case-sensitive?**  
Yes, the web endpoint is case-sensitive just like the blob endpoint. 

## Next steps
* [Using the Azure CDN to access blobs with custom domains over HTTPS](storage-https-custom-domain-cdn.md)
* [Configure a custom domain name for your blob or web endpoint](storage-custom-domain-name.md)
* [Azure Functions](/azure/azure-functions/functions-overview)
* [Azure Web Apps](/azure/app-service/app-service-web-overview)
* [Build your first serverless web app](https://aka.ms/static-serverless-webapp)
