---
title: Configure a custom domain name for your Azure storage account | Microsoft Docs
description: Use the Azure portal to map your own canonical name (CNAME) to the Blob storage or web endpoint in an Azure storage account.
services: storage
author: normesta

ms.service: storage
ms.topic: article
ms.date: 06/26/2018
ms.author: normesta
ms.reviewer: seguler
ms.subservice: blobs
---

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
> The mapping does only work for subdomains (e.g. www\.contoso.com). If you want to have your web endpoint available on the root domain (e.g. contoso.com), then you have to [use Azure CDN with custom domains](storage-https-custom-domain-cdn.md)

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

### Direct CNAME mapping

The first, and simplest, method is to create a canonical name (CNAME) record that maps your custom domain and subdomain directly to the blob endpoint. A CNAME record is a domain name system (DNS) feature that maps a source domain to a destination domain. In our example, the source domain is your own custom domain and subdomain (*www\.contoso.com*, for example). The destination domain is your blob service endpoint (*mystorageaccount.blob.core.windows.net*, for example).

The direct method is covered in the "Register a custom domain" section.

### Intermediary mapping with *asverify*

The second method also uses CNAME records. To avoid downtime, however, it first employs a special subdomain *asverify* that's recognized by Azure.

Mapping your custom domain to a blob endpoint can cause a brief period of downtime while you are registering the domain in the [Azure portal](https://portal.azure.com). If the domain currently supports an application with a service-level agreement (SLA) that requires zero downtime, use the Azure *asverify* subdomain as an intermediate registration step. This step ensures that users can access your domain while the DNS mapping takes place.

The intermediary method is covered in Register a custom domain by using the *asverify* subdomain.

## Register a custom domain
Register the domain by using the procedure in this section if the following statements apply:
* You are unconcerned that the domain is briefly unavailable to your users.
* Your custom domain is not currently hosting an application. 

You can use Azure DNS to configure a custom DNS name for your Azure Blob store. For more information, see [Use Azure DNS to provide custom domain settings for an Azure service](https://docs.microsoft.com/azure/dns/dns-custom-domain#blob-storage).

If your custom domain currently supports an application that cannot have any downtime, use the procedure in Register a custom domain by using the *asverify* subdomain.

To configure a custom domain name, create a new CNAME record in DNS. The CNAME record specifies an alias for a domain name. In our example, it maps the address of your custom domain to your storage account's Blob storage endpoint.

You can usually manage your domain's DNS settings on your domain registrar's website. Each registrar has a similar but slightly different method of specifying a CNAME record, but the concept is the same. Because some basic domain registration packages don't offer DNS configuration, you might need to upgrade your domain registration package before you can create the CNAME record.

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

1. In the menu pane, under **Blob Service**, select **Custom domain**.  
   The **Custom domain** pane opens.

1. Sign in to your domain registrar's website, and then go to the page for managing DNS.  
   You might find the page in a section named **Domain Name**, **DNS**, or **Name Server Management**.

1. Find the section for managing CNAMEs.  
   You might have to go to an advanced settings page and look for **CNAME**, **Alias**, or **Subdomains**.

1. Create a new CNAME record, enter a subdomain alias such as **www** or **photos** (subdomain is required, root domains are not supported), and then provide a host name.  
   The host name is your blob service endpoint. Its format is *\<mystorageaccount>.blob.core.windows.net*, where *mystorageaccount* is the name of your storage account. The host name to use appears in item #1 of the **Custom domain** pane in the [Azure portal](https://portal.azure.com). 

1. In the **Custom domain** pane, in the text box, enter the name of your custom domain, including the subdomain.  
   For example, if your domain is *contoso.com* and your subdomain alias is *www*, enter **www\.contoso.com**. If your subdomain is *photos*, enter **photos.contoso.com**.

1. To register your custom domain, select **Save**.  
   If the registration is successful, the portal notifies you that your storage account was successfully updated.

After your new CNAME record has propagated through DNS, if your users have the appropriate permissions, they can view blob data by using your custom domain.

## Register a custom domain by using the *asverify* subdomain
If your custom domain currently supports an application with an SLA that requires that there be no downtime, register your custom domain by using the procedure in this section. By creating a CNAME that points from *asverify.\<subdomain>.\<customdomain>* to *asverify.\<storageaccount>.blob.core.windows.net*, you can pre-register your domain with Azure. You can then create a second CNAME that points from *\<subdomain>.\<customdomain>* to *\<storageaccount>.blob.core.windows.net*, and then traffic to your custom domain is directed to your blob endpoint.

The *asverify* subdomain is a special subdomain recognized by Azure. By prepending *asverify* to your own subdomain, you permit Azure to recognize your custom domain without having to modify the DNS record for the domain. When you do modify the DNS record for the domain, it will be mapped to the blob endpoint with no downtime.

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

1. In the menu pane, under **Blob Service**, select **Custom domain**.  
   The **Custom domain** pane opens.

1. Sign in to your DNS provider's website, and then go to the page for managing DNS.  
   You might find the page in a section named **Domain Name**, **DNS**, or **Name Server Management**.

1. Find the section for managing CNAMEs.  
   You might have to go to an advanced settings page and look for **CNAME**, **Alias**, or **Subdomains**.

1. Create a new CNAME record, provide a subdomain alias that includes the *asverify* subdomain, such as **asverify.www** or **asverify.photos**, and then provide a host name.  
   The host name is your blob service endpoint. Its format is *asverify.\<mystorageaccount>.blob.core.windows.net*, where *mystorageaccount* is the name of your storage account. The host name to use appears in item #2 of the *Custom domain* pane in the [Azure portal](https://portal.azure.com).

1. In the **Custom domain** pane, in the text box, enter the name of your custom domain, including the subdomain.  
   Do not include *asverify*. For example, if your domain is *contoso.com* and your subdomain alias is *www*, enter **www\.contoso.com**. If your subdomain is *photos*, enter **photos.contoso.com**.

1. Select the **Use indirect CNAME validation** check box.

1. To register your custom domain, select **Save**.  
   If the registration is successful, the portal notifies you that your storage account was successfully updated. Your custom domain has been verified by Azure, but traffic to your domain is not yet being routed to your storage account.

1. Return to your DNS provider's website, and then create another CNAME record that maps your subdomain to your blob service endpoint.  
   For example, specify the subdomain as *www* or *photos* (without the *asverify*) and specify the host name as *\<mystorageaccount>.blob.core.windows.net*, where *mystorageaccount* is the name of your storage account. With this step, the registration of your custom domain is complete.

1. Finally, you can delete the newly created CNAME record that contains the *asverify* subdomain, which was required only as an intermediary step.

After your new CNAME record has propagated through DNS, if your users have the appropriate permissions, they can view blob data by using your custom domain.

## Test your custom domain

To confirm that your custom domain is mapped to your blob service endpoint, create a blob in a public container within your storage account. Then, in a web browser, access the blob by using a URI in the following format: `http://<subdomain.customdomain>/<mycontainer>/<myblob>`

For example, to access a web form in the *myforms* container in the *photos.contoso.com* custom subdomain, you might use the following URI: `http://photos.contoso.com/myforms/applicationform.htm`

## Deregister a custom domain

To deregister a custom domain for your Blob storage endpoint, use one of the following procedures.

### Azure portal

To remove the custom domain setting, do the following:

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

1. In the menu pane, under **Blob Service**, select **Custom domain**.  
   The **Custom domain** pane opens.

1. Clear the contents of the text box that contains your custom domain name.

1. Select the **Save** button.

After the custom domain has been removed successfully, you will see a portal notification that your storage account was successfully updated.

### Azure CLI

To remove a custom domain registration, use the [az storage account update](https://docs.microsoft.com/cli/azure/storage/account) CLI command, and then specify an empty string (`""`) for the `--custom-domain` argument value.

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

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To remove a custom domain registration, use the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) PowerShell cmdlet, and then specify an empty string (`""`) for the `-CustomDomainName` argument value.

* Command format:

  ```powershell
  Set-AzStorageAccount `
      -ResourceGroupName "<resource-group-name>" `
      -AccountName "<storage-account-name>" `
      -CustomDomainName ""
  ```

* Command example:

  ```powershell
  Set-AzStorageAccount `
      -ResourceGroupName "myresourcegroup" `
      -AccountName "mystorageaccount" `
      -CustomDomainName ""
  ```

## Next steps
* [Map a custom domain to an Azure Content Delivery Network (CDN) endpoint](../../cdn/cdn-map-content-to-custom-domain.md)
* [Use Azure CDN to access blobs by using custom domains over HTTPS](storage-https-custom-domain-cdn.md)
* [Static website hosting in Azure Blob storage (preview)](storage-blob-static-website.md)
