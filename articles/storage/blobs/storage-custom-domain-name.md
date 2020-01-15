---
title: Map a custom domain to an Azure Blob Storage endpoint
titleSuffix: Azure Storage
description: Map a custom domain to a Blob Storage or web endpoint in an Azure storage account.
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 01/14/2020
ms.author: normesta
ms.reviewer: dineshm
ms.subservice: blobs
---

# Map a custom domain to an Azure Blob Storage endpoint

You can map a custom domain to a blob service endpoint or a [static website](storage-blob-static-website.md) endpoint. This article shows you two ways to do this. 

To learn more, see [Custom domain names with Azure Blob storage endpoints](storage-blob-custom-domain.md)

## Map a custom domain with fewer steps but some downtime

This approach is easiest, but your custom domain will be briefly unavailable to users while you complete the configuration. If your custom domain can't afford downtime, see the [Map a custom domain with more steps but zero downtime](#zero-down-time) section of this article.

Follow these steps to map your custom domain to blob storage with some downtime.

:heavy_check_mark: Step 1: Get the host name of your storage endpoint.

:heavy_check_mark: Step 2: Add a CNAME record to the domain registrar's website. 

:heavy_check_mark: Step 3: Register the custom domain with Azure. 

:heavy_check_mark: Step 4: Test your custom domain

<a id="#endpoint" />

### Step 1: Get the host name of your storage endpoint 

The host name is the storage endpoint URL without the protocol identifier and the trailing slash. 

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

2. In the menu pane, under **Settings**, select **Properties**.  

3. Copy the value of the **Primary Blob Service Endpoint** or the **Primary static website endpoint** to a text file. 

4. Remove the protocol identifier (*e.g.*, HTTPS) and the trailing slash from that string. The following table contains examples.

   | Type of endpoint |  endpoint | host name |
   |------------|-----------------|-------------------|
   |blob service  | https://mystorageaccount.blob.core.windows.net/| mystorageaccount.blob.core.windows.net|
   |static website  | https://mystorageaccount.z5.web.core.windows.net/| mystorageaccount.z5.web.core.windows.net|
  
   Set this value aside for later.

<a id="create-cname-record" />

### Step 2: Add a CNAME record to the domain registrar's website

CNAME stands for Canonical Name and it's used to alias one name to another.

Create a CNAME record that maps your custom domain to your blob endpoint.  Then, in Portal, you'll register the domain with Azure.

1. Sign in to your domain registrar's website, and then go to the page for managing DNS setting.

   You might find the page in a section named **Domain Name**, **DNS**, or **Name Server Management**.

2. Find the section for managing CNAME records. 

   You might have to go to an advanced settings page and look for **CNAME**, **Alias**, or **Subdomains**.

3. Create a CNAME record. As part of that record, provide the following items: 

   - The subdomain alias such as **www** or **photos**. 
   
     The subdomain is required, root domains are not supported.
      
   - The host name that you obtained in the [Get the host name of your storage endpoint](#endpoint) section earlier in this article. 

<a id="register" />

### Step 3: Register your custom domain with Azure

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

2. In the menu pane, under **Blob Service**, select **Custom domain**.  

   ![custom domain option](./media/storage-custom-domain-name/custom-domain-button.png "custom domain")

   The **Custom domain** pane opens.

3. In the **Domain name** text box, enter the name of your custom domain, including the subdomain  
   
   For example, if your domain is *contoso.com* and your subdomain alias is *www*, enter **www\.contoso.com**. If your subdomain is *photos*, enter **photos.contoso.com**.

4. To register the custom domain, choose the **Save** button.

   After the CNAME record has propagated through the Domain Name Servers (DNS), and if your users have the appropriate permissions, they can view blob data by using the custom domain.

### Step 4: Test your custom domain

To confirm that your custom domain is mapped to your blob service endpoint, create a blob in a public container within your storage account. Then, in a web browser, access the blob by using a URI in the following format: `http://<subdomain.customdomain>/<mycontainer>/<myblob>`

For example, to access a web form in the *myforms* container in the *photos.contoso.com* custom subdomain, you might use the following URI: `http://photos.contoso.com/myforms/applicationform.htm`

<a id="zero-down-time" />

## Map a custom domain with more steps but zero downtime

This approach involves more steps but incurs no downtime. It's useful in cases where your custom domain supports an application that can't have any downtime. 

Follow these steps to map your custom domain to blob storage with zero downtime.

:heavy_check_mark: Step 1: Get the host name of your storage endpoint

:heavy_check_mark: Step 2: Add an intermediary CNAME record to the domain registrar's website

:heavy_check_mark: Step 3: Pre-register the custom domain with Azure

:heavy_check_mark: Step 4: Add a CNAME record to the domain registrar's website

:heavy_check_mark: Step 5: Test your custom domain

### Step 1: Get the host name of your storage endpoint 

The host name is the storage endpoint URL without the protocol identifier and the trailing slash. 

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

2. In the menu pane, under **Settings**, select **Properties**.  

3. Copy the value of the **Primary Blob Service Endpoint** or the **Primary static website endpoint** to a text file. 

4. Remove the protocol identifier (*e.g.*, HTTPS) and the trailing slash from that string. The following table contains examples.

   | Type of endpoint |  endpoint | host name |
   |------------|-----------------|-------------------|
   |blob service  | https://mystorageaccount.blob.core.windows.net/| mystorageaccount.blob.core.windows.net|
   |static website  | https://mystorageaccount.z5.web.core.windows.net/| mystorageaccount.z5.web.core.windows.net|
  
   Set this value aside for later.

<a id="#endpoint-2" />

### Step 1: Get the host name of your storage endpoint

Put something here.

### Step 2: Add an intermediary CNAME record to the domain registrar's website

Put something here.

### Step 3: Pre-register your custom domain with Azure

When you pre-register your custom domain with Azure, you permit Azure to recognize your custom domain without having to modify the DNS record for the domain. That way, when you do modify the DNS record for the domain, it will be mapped to the blob endpoint with no downtime.

### Step 4: Add a CNAME record to the domain registrar's website

Put something here.

### Step 5: Test your custom domain

To confirm that your custom domain is mapped to your blob service endpoint, create a blob in a public container within your storage account. Then, in a web browser, access the blob by using a URI in the following format: `http://<subdomain.customdomain>/<mycontainer>/<myblob>`

For example, to access a web form in the *myforms* container in the *photos.contoso.com* custom subdomain, you might use the following URI: `http://photos.contoso.com/myforms/applicationform.htm`

## Remove a custom domain mapping

To un-map a custom domain, deregister the custom domain. 

### Deregister a custom domain

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
