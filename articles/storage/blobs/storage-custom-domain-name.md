---
title: Configure a custom domain name for your Azure Storage account | Microsoft Docs
description: Use the Azure portal to map your own canonical name (CNAME) to the Blob or web endpoint in an Azure Storage account.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 06/26/2018
ms.author: tamram
ms.component: blobs
---

# Configure a custom domain name for your Azure Storage account

You can configure a custom domain for accessing blob data in your Azure storage account. The default endpoint for Blob storage is `<storage-account-name>.blob.core.windows.net`. You can also use the web endpoint generated as a part of the [static websites feature (preview)](storage-blob-static-website.md). If you map a custom domain and subdomain like **www.contoso.com** to the blob or web endpoint for your storage account, your users can then access blob data in your storage account using that domain.

> [!IMPORTANT]
> Azure Storage does not yet natively support HTTPS with custom domains. You can currently [Use the Azure CDN to access blobs with custom domains over HTTPS](storage-https-custom-domain-cdn.md).
>

> [!NOTE]  
> Storage accounts currently support only one custom domain name per account. That means you cannot map a custom domain name to both the web and blob service endpoints.

The following table shows a few sample URLs for blob data located in a storage account named **mystorageaccount**. The custom domain registered for the storage account is **www.contoso.com**:

| Resource Type | Default URL | Custom domain URL |
| --- | --- | --- | --- |
| Storage account | http://mystorageaccount.blob.core.windows.net | http://www.contoso.com |
| Blob |http://mystorageaccount.blob.core.windows.net/mycontainer/myblob | http://www.contoso.com/mycontainer/myblob |
| Root container | http://mystorageaccount.blob.core.windows.net/myblob or http://mystorageaccount.blob.core.windows.net/$root/myblob| http://www.contoso.com/myblob or http://www.contoso.com/$root/myblob |
| Web |  http://mystorageaccount.[zone].web.core.windows.net/$web/[indexdoc] or http://mystorageaccount.[zone].web.core.windows.net/[indexdoc] or http://mystorageaccount.[zone].web.core.windows.net/$web or http://mystorageaccount.[zone].web.core.windows.net/ | http://www.contoso.com/$web or http://www.contoso.com/ or http://www.contoso.com/$web/[indexdoc] or  http://www.contoso.com/[indexdoc] |

> [!NOTE]  
> All examples for the Blob service endpoint below also apply to the web service endpoint.

## Direct vs. intermediary domain mapping

There are two ways to point your custom domain to the blob endpoint for your storage account: direct CNAME mapping, and using the *asverify* intermediary subdomain.

### Direct CNAME mapping

The first, and simplest, method is to create a canonical name (CNAME) record that maps your custom domain and subdomain directly to the blob endpoint. A CNAME record is a domain name system (DNS) feature that maps a source domain to a destination domain. In this case, the source domain is your own custom domain and subdomain, for example *www.contoso.com*. The destination domain is your Blob service endpoint, for example *mystorageaccount.blob.core.windows.net*.

The direct method is covered in [Register a custom domain](#register-a-custom-domain).

### Intermediary mapping with *asverify*

The second method also uses CNAME records, but first employs a special subdomain recognized by Azure to avoid downtime: **asverify**.

The process of mapping your custom domain to a blob endpoint can result in a brief period of downtime for the domain while you are registering it in the [Azure portal](https://portal.azure.com). If your custom domain is currently supporting an application with a service-level agreement (SLA) that requires zero downtime, then you can use the Azure *asverify* subdomain as an intermediate registration step. This intermediate step ensures users are able to access your domain while the DNS mapping takes place.

The intermediary method is covered in [Register a custom domain using the *asverify* subdomain](#register-a-custom-domain-using-the-asverify-subdomain).

## Register a custom domain
Use this procedure to register your custom domain if you have no concerns about the domain being briefly unavailable to your users, or if your custom domain is not currently hosting an application. You can use Azure DNS to configure a custom DNS name for your Azure Blob store. For more information, see [Use Azure DNS to provide custom domain settings for an Azure service](https://docs.microsoft.com/azure/dns/dns-custom-domain#blob-storage).

If your custom domain is currently supporting an application that cannot have any downtime, follow the procedure outlined in [Register a custom domain using the *asverify* subdomain](#register-a-custom-domain-using-the-asverify-subdomain).

To configure a custom domain name, you must create a new CNAME record in DNS. The CNAME record specifies an alias for a domain name. In this case, it maps the address of your custom domain to the Blob storage endpoint for your storage account.

Typically, you can manage your domain's DNS settings on your domain registrar's website. Each registrar has a similar but slightly different method of specifying a CNAME record, but the concept is the same. Some basic domain registration packages do not offer DNS configuration, so you may need to upgrade your domain registration package before you can create the CNAME record.

1. Navigate to your storage account in the [Azure portal](https://portal.azure.com).
1. Under **BLOB SERVICE** on the menu blade, select **Custom domain** to open the *Custom domain* blade.
1. Log on to your domain registrar's website and go to the page for managing DNS. You might find this in a section such as **Domain Name**, **DNS**, or **Name Server Management**.
1. Find the section for managing CNAMEs. You may have to go to an advanced settings page and look for the words **CNAME**, **Alias**, or **Subdomains**.
1. Create a new CNAME record and provide a subdomain alias such as **www** or **photos**. Then provide a host name, which is your Blob service endpoint, in the format **mystorageaccount.blob.core.windows.net** (where *mystorageaccount* is the name of your storage account). The host name to use appears in item #1 of the *Custom domain* blade in the [Azure portal](https://portal.azure.com).
1. In the text box on the *Custom domain* blade in the [Azure portal](https://portal.azure.com), enter the name of your custom domain, including the subdomain. For example, if your domain is **contoso.com** and your subdomain alias is **www**, enter **www.contoso.com**. If your subdomain is **photos**, enter **photos.contoso.com**. The subdomain is *required*.
1. Select **Save** on the *Custom domain* blade to register your custom domain. If the registration is successful, you will see a portal notification that your storage account was successfully updated.

Once your new CNAME record has propagated through DNS, your users can view blob data by using your custom domain, so long as they have the appropriate permissions.

## Register a custom domain using the *asverify* subdomain
Use this procedure to register your custom domain if your custom domain is currently supporting an application with an SLA that requires that there be no downtime. By creating a CNAME that points from `asverify.<subdomain>.<customdomain>` to `asverify.<storageaccount>.blob.core.windows.net`, you can pre-register your domain with Azure. You can then create a second CNAME that points from `<subdomain>.<customdomain>` to `<storageaccount>.blob.core.windows.net`, at which point traffic to your custom domain will be directed to your blob endpoint.

The **asverify** subdomain is a special subdomain recognized by Azure. By prepending `asverify` to your own subdomain, you permit Azure to recognize your custom domain without modifying the DNS record for the domain. When you do modify the DNS record for the domain, it will be mapped to the blob endpoint with no downtime.

1. Navigate to your storage account in the [Azure portal](https://portal.azure.com).
1. Under **BLOB SERVICE** on the menu blade, select **Custom domain** to open the *Custom domain* blade.
1. Log on to your DNS provider's website and go to the page for managing DNS. You might find this in a section such as **Domain Name**, **DNS**, or **Name Server Management**.
1. Find the section for managing CNAMEs. You may have to go to an advanced settings page and look for the words **CNAME**, **Alias**, or **Subdomains**.
1. Create a new CNAME record, and provide a subdomain alias that includes the *asverify* subdomain. For example, **asverify.www** or **asverify.photos**. Then provide a host name, which is your Blob service endpoint, in the format **asverify.mystorageaccount.blob.core.windows.net** (where **mystorageaccount** is the name of your storage account). The host name to use appears in item #2 of the *Custom domain* blade in the [Azure portal](https://portal.azure.com).
1. In the text box on the *Custom domain* blade in the [Azure portal](https://portal.azure.com), enter the name of your custom domain, including the subdomain. Do not include *asverify*. For example, if your domain is **contoso.com** and your subdomain alias is **www**, enter **www.contoso.com**. If your subdomain is **photos**, enter **photos.contoso.com**. The subdomain is required.
1. Select the **Use indirect CNAME validation** checkbox.
1. Select **Save** on the *Custom domain* blade to register your custom domain. If the registration is successful, you will see a portal notification stating that your storage account was successfully updated. At this point, your custom domain has been verified by Azure, but traffic to your domain is not yet being routed to your storage account.
1. Return to your DNS provider's website, and create another CNAME record that maps your subdomain to your Blob service endpoint. For example, specify the subdomain as **www** or **photos** (without the *asverify*), and the hostname as **mystorageaccount.blob.core.windows.net** (where **mystorageaccount** is the name of your storage account). With this step, the registration of your custom domain is complete.
1. Finally, you can delete the CNAME record you created containing the **asverify** subdomain, as it was necessary only as an intermediary step.

Once your new CNAME record has propagated through DNS, your users can view blob data by using your custom domain, so long as they have the appropriate permissions.

## Test your custom domain

To confirm your custom domain is indeed mapped to your Blob service endpoint, create a blob in a public container within your storage account. Then, in a web browser, use a URI in the following format to access the blob:

`http://<subdomain.customdomain>/<mycontainer>/<myblob>`

For example, you might use the following URI to access a web form in the **myforms** container in the **photos.contoso.com** custom subdomain:

`http://photos.contoso.com/myforms/applicationform.htm`

## Deregister a custom domain

To deregister a custom domain for your Blob storage endpoint, use one of the following procedures.

### Azure portal

Perform the following in the Azure portal to remove the custom domain setting:

1. Navigate to your storage account in the [Azure portal](https://portal.azure.com).
1. Under **BLOB SERVICE** on the menu blade, select **Custom domain** to open the *Custom domain* blade.
1. Clear the contents of the text box containing your custom domain name.
1. Select the **Save** button.

When the custom domain has been removed successfully, you will see a portal notification stating that your storage account was successfully updated.

### Azure CLI

Use the [az storage account update](https://docs.microsoft.com/cli/azure/storage/account#az_storage_account_update) CLI command and specify an empty string (`""`) for the `--custom-domain` argument value to remove a custom domain registration.

* Command format:

  ```azurecli
  az storage account update \
      --name <storage-account-name> \
      --resource-group <resource-group-name> \
      --custom-domain ""
  ```

* Command example:

  ```azurecli
  az storage account update \
      --name mystorageaccount \
      --resource-group myresourcegroup \
      --custom-domain ""
  ```

### PowerShell

Use the [Set-AzureRmStorageAccount](/powershell/module/azurerm.storage/set-azurermstorageaccount) PowerShell cmdlet and specify an empty string (`""`) for the `-CustomDomainName` argument value to remove a custom domain registration.

* Command format:

  ```powershell
  Set-AzureRmStorageAccount `
      -ResourceGroupName "<resource-group-name>" `
      -AccountName "<storage-account-name>" `
      -CustomDomainName ""
  ```

* Command example:

  ```powershell
  Set-AzureRmStorageAccount `
      -ResourceGroupName "myresourcegroup" `
      -AccountName "mystorageaccount" `
      -CustomDomainName ""
  ```

## Next steps
* [Map a custom domain to an Azure Content Delivery Network (CDN) endpoint](../../cdn/cdn-map-content-to-custom-domain.md)
* [Using the Azure CDN to access blobs with custom domains over HTTPS](storage-https-custom-domain-cdn.md)
* [Static website hosting in Azure Blob Storage (Preview)](storage-blob-static-website.md)
