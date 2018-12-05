---
title: Static website hosting in Azure Storage
description: Azure Storage static website hosting, providing a cost-effective, scalable solution for hosting modern web applications.  
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 10/19/18
ms.author: tamram
ms.component: blobs
---

# Static website hosting in Azure Storage
Azure Storage GPv2 accounts allow you to serve static content (HTML, CSS, JavaScript, and image files) directly from a storage container named *$web*. Taking advantage of hosting in Azure Storage allows you to use serverless architectures including [Azure Functions](/azure/azure-functions/functions-overview) and other PaaS services.

In contrast to static website hosting, dynamic sites that depend on server-side code are best hosted using [Azure Web Apps](/azure/app-service/app-service-web-overview).

## How does it work?
When you enable static website hosting on your storage account, you select the name of your default file and optionally provide a path to a custom 404 page. As the feature is enabled, a container named *$web* is created if it doesn't already exist. 

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
https://contoso.blob.core.windows.net/$web/image.png
```

is available in the browser at a location like this:

```bash
https://contoso.z4.web.core.windows.net/image.png
```

The selected default file name is used at the root and any subdirectories when a file name is not provided. If the server returns a 404 and you do not provide an error document path, then a default 404 page is returned to the user.

## CDN and SSL support

To make your static website files available over HTTPS, see [Using the Azure CDN to access blobs with custom domains over HTTPS](storage-https-custom-domain-cdn.md). As a part of this process, you need to *point your CDN to the web endpoint* as opposed to the blob endpoint. You may need to wait a few minutes before your content is visible as the CDN configuration is not immediately executed.


## Custom domain names

You can [configure a custom domain name for your Azure Storage account](storage-custom-domain-name.md) to make your static website available via a custom domain. For an in-depth look at hosting your domain on [Azure, see Host your domain in Azure DNS](../../dns/dns-delegate-domain-azure-dns.md).

## Pricing
Static website hosting is provided at no additional cost. For more details on prices for Azure Blob Storage, check out the [Azure Blob Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Quickstart

### Azure portal
Begin by opening the Azure portal at https://portal.azure.com and run through the following steps on your GPv2 storage account:

1. Click on **Settings**
2. Click on **Static website**
3. Enter an *index document name*. (A common value is *index.html)*
4. Optionally enter an *error document path* to a custom 404 page. (A common value is *404.html)*

![](media/storage-blob-static-website/storage-blob-static-website-portal-config.PNG)

Next, upload your assets to the *$web* container via the Azure portal or with the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload entire directories. Make sure to include a file that matches the *index document name* you selected when enabling the feature.

Finally, navigate to your web endpoint to test your website.

### Azure CLI
Install the storage preview extension:

```azurecli-interactive
az extension add --name storage-preview
```
In the case of multiple subscriptions, set your CLI to the subscription of the GPv2 storage account you wish to enable:

```azurecli-interactive
az account set --subscription <SUBSCRIPTION_ID>
```
Enable the feature. Make sure to replace all placeholder values, including brackets, with your own values:

```azurecli-interactive
az storage blob service-properties update --account-name <ACCOUNT_NAME> --static-website --404-document <ERROR_DOCUMENT_NAME> --index-document <INDEX_DOCUMENT_NAME>
```
Query for the web endpoint URL:

```azurecli-interactive
az storage account show -n <ACCOUNT_NAME> -g <RESOURCE_GROUP> --query "primaryEndpoints.web" --output tsv
```

Upload objects to the *$web* container from a source directory:

```azurecli-interactive
az storage blob upload-batch -s <SOURCE_PATH> -d $web --account-name <ACCOUNT_NAME>
```

## Deployment

Methods available for deploying content to a storage container include the following:

- [AzCopy](../common/storage-use-azcopy.md)
- [Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
- [Azure Pipelines](https://code.visualstudio.com/tutorials/static-website/deploy-VSTS)
- [Visual Studio Code extension](https://code.visualstudio.com/tutorials/static-website/getting-started)

In all cases, make sure you copy files to the *$web* container.

## Metrics

To enable metrics on your static website pages, click on **Settings** > **Monitoring** > **Metrics**.

Metrics data are generated by hooking into different metrics APIs. The portal only displays API members used within a given time frame in order to only focus on members that return data. In order to ensure you are able to select the necessary API member, the first step is to expand the time frame.

Click on the time frame button and select **Last 24 hours** and then click **Apply** 

![Azure Storage static websites metrics time range](./media/storage-blob-static-website/storage-blob-static-website-metrics-time-range.png)

Next, select **Blob** from the *Namespace* drop down.

![Azure Storage static websites metrics namespace](./media/storage-blob-static-website/storage-blob-static-website-metrics-namespace.png)

Then select the **Egress** metric.

![Azure Storage static websites metrics metric](./media/storage-blob-static-website/storage-blob-static-website-metrics-metric.png)

Select **Sum** from the *Aggregation* selector.

![Azure Storage static websites metrics aggregation](./media/storage-blob-static-website/storage-blob-static-website-metrics-aggregation.png)

Next, click the **Add filter** button and choose **API name** from the *Property* selector.

![Azure Storage static websites metrics API name](./media/storage-blob-static-website/storage-blob-static-website-metrics-api-name.png)

Finally, check the box next to **GetWebContent** in the *Values* selector to populate the metrics report.

![Azure Storage static websites metrics GetWebContent](./media/storage-blob-static-website/storage-blob-static-website-metrics-getwebcontent.png)

One enabled, traffic statistics on files in the *$web* container reported in the metrics dashboard.

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
* [Build your first serverless web app](https://docs.microsoft.com/azure/functions/tutorial-static-website-serverless-api-with-database)
* [Tutorial: Host your domain in Azure DNS](../../dns/dns-delegate-domain-azure-dns.md)
