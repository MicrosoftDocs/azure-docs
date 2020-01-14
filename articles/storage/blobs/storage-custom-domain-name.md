---
title: Map a custom domain name to an Azure Blob Storage endpoint | Microsoft Docs
description: Use the Azure portal to map your own canonical name (CNAME) to the Blob storage or web endpoint in an Azure storage account.
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 01/13/2020
ms.author: normesta
ms.reviewer: dineshm
ms.subservice: blobs
---

# Map a custom domain name to an Azure Blob Storage endpoint

CNAME stands for Canonical Name and it's used to alias one name to another.

<a id="endpoint" />

## Map a custom domain with some downtime

The easiest way to map your domain is to first modify the DNS record for the domain. Then, in the Azure portal, you register the domain so that Azure can recognize the custom domain. 

Your domain will be briefly unavailable to your users in between these two steps. Therefore, if your custom domain currently supports an application that can't have any downtime, this might not be the best option for you. 

Follow these steps to map your custom domain to blob storage with some downtime.

:one: &nbsp;&nbsp;[Get the host name of your storage endpoint](#get-host-name).

:two: &nbsp;&nbsp;[Add a CNAME record to the domain registrar's website](#create-cname-record). 

:three: &nbsp;&nbsp;[Register the custom domain with Azure](#register). 

## Map a custom domain with zero downtime

This is a bit more involved.

:one: &nbsp;&nbsp;[Get the host name of your storage endpoint](#get-host-name).

:two: &nbsp;&nbsp;[Add an intermediary CNAME record to the domain registrar's website](#create-asverify-cname-record).

:three: &nbsp;&nbsp;[Pre-register the custom domain with Azure](#pre-register).

:four: &nbsp;&nbsp;[Add a CNAME record to the domain registrar's website](#create-cname-record). 

<a id="get-host-name" />

## Get the host name of your storage endpoint 

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

## Add a CNAME record to the domain registrar's website

Create a CNAME record that maps your custom domain to your blob endpoint.  Then, in Portal, you'll register the domain with Azure.

1. Sign in to your domain registrar's website, and then go to the page for managing DNS setting.

   > [!TIP]
   > You might find the page in a section named **Domain Name**, **DNS**, or **Name Server Management**.

2. Find the section for managing CNAME records. 

   > [!TIP]
   > You might have to go to an advanced settings page and look for **CNAME**, **Alias**, or **Subdomains**.

3. Create a CNAME record. As part of that record, provide the following items: 

   - The subdomain alias such as **www** or **photos**. 
   
     The subdomain is required, root domains are not supported.
      
   - The endpoint that you obtained in the [Get the destination endpoint](#endpoint) section earlier in this article. 

   <a id="register" />

## Register your custom domain with Azure

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

2. In the menu pane, under **Blob Service**, select **Custom domain**.  

   ![custom domain option](./media/storage-custom-domain-name/custom-domain-button.png "custom domain")

   The **Custom domain** pane opens.

3. In the **Domain name** text box, enter the name of your custom domain, including the subdomain  
   
   For example, if your domain is *contoso.com* and your subdomain alias is *www*, enter **www\.contoso.com**. If your subdomain is *photos*, enter **photos.contoso.com**.

4. To register the custom domain, choose the **Save** button.

   After the CNAME record has propagated through the Domain Name Servers (DNS), and if your users have the appropriate permissions, they can view blob data by using the custom domain.

   Pre-register your custom domain with Azure

<a id="Pre-register" />

## Pre-register your custom domain with Azure

When you pre-register your custom domain with Azure, you permit Azure to recognize your custom domain without having to modify the DNS record for the domain. That way, when you do modify the DNS record for the domain, it will be mapped to the blob endpoint with no downtime.

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
