---
title: Host a static website in Azure Storage
description: Need a description here.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.author: normesta
ms.date: 05/28/2019
---

# Host a static website in Azure Storage

You can create an awesome static website.

This article helps you to set up a static website by using these tools:

> [!div class="checklist"]
> * Azure portal
> * Azure CLI
> * PowerShell

## Azure portal

See [Tutorial: Host a static website on Blob Storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-static-website-host).

## Azure CLI

You can use the Azure CLI to enable static website hosting and then upload the files of your website. The Azure CLI is Azure's command-line experience for managing Azure resources. You can use it in your browser with Azure Cloud Shell. You can also install it on macOS, Linux, or Windows and run it from the command line. To learn more, see [Azure Command-Line Interface (CLI)](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest).

1. First, install the storage preview extension.

   ```azurecli-interactive
   az extension add --name storage-preview
   ```

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```azurecli-interactive
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the id of your subscription.

3. Enable static website hosting. Enable the feature. Make sure to replace all placeholder values, including brackets, with your own values:

   ```azurecli-interactive
   az storage blob service-properties update --account-name <storage-account-name> --static-website --404-document <error-document-name> --index-document <index-document-name>
   ```

   * Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   * Replace the `<error-document-name>` placeholder with the name of the error document that will appear to users when a browser requests a page on your site that does not exist.

   * Replace the `<index-document-name>` placeholder with the name of the index document. This document is commonly "index.html".

4. Verify that the static website is enabled by querying the web endpoint URL.

    ```azurecli-interactive
    az storage account show -n <storage-account-name> -g <resource-group-name> --query "primaryEndpoints.web" --output tsv
    ```

5. Upload objects to the *$web* container from a source directory.

   > [!NOTE]
   > If you're using Azure Cloud Shell, make sure to add a "\" escape character when you refer to the `$web` container (For example: `\$web`). If you're using a local installation of the Azure CLI, then you won't have to use the escape character.

   ```azurecli-interactive
   az storage blob upload-batch -s <source-path> -d \$web --account-name <storage-account-name>
   ```

   * Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   * Replace the `<source-path>` placeholder with a path to the location of the files that you want to upload.

     > [!NOTE]
     > If you're using a location installation of Azure CLI, then you can use the path to any location on your local computer (For example: `C:\myFolder`. 
     >
     > If you're using Azure Cloud Shell, you'll have to reference a file share that is visible to the Cloud Shell. This location could be the file share of the Cloud share itself or an existing file share that you mount from the Cloud Shell. To learn how to do this, see [Persist files in Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/persisting-shell-storage).

## PowerShell

You can use the Azure PowerShell module to enable website hosting and then upload the files of your website.

1. Verify that you have Azure PowerShell module Az version 0.7 or later by running this command from a Windows PowerShell command prompt.

   ```powershell
   Get-InstalledModule -Name Az -AllVersions | select Name,Version
   ```

   If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps).

2. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

3. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```powershell
   $context = Get-AzSubscription -<subscription-id> ...
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the id of your subscription.

## Next steps

Need next steps