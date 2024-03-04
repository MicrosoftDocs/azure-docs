---
title: Host a static website in Azure Storage
description: Learn how to serve static content (HTML, CSS, JavaScript, and image files) directly from a container in an Azure Storage GPv2 account.
author: stevenmatthew
ms.service: azure-blob-storage
ms.topic: conceptual
ms.author: shaas
ms.date: 04/19/2022
ms.custom: devx-track-js, devx-track-azurepowershell
---

# Host a static website in Azure Storage

You can serve static content (HTML, CSS, JavaScript, and image files) directly from a container in a [general-purpose V2](../common/storage-account-create.md) or [BlockBlobStorage](../common/storage-account-create.md) account. To learn more, see [Static website hosting in Azure Storage](storage-blob-static-website.md).

This article shows you how to enable static website hosting by using the Azure portal, the Azure CLI, or PowerShell.

## Enable static website hosting

Static website hosting is a feature that you have to enable on the storage account.

### [Portal](#tab/azure-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your storage account and select it to display the account's **Overview** pane.

3. In the **Overview** pane, select the **Capabilities** tab. Next, select **Static website** to display the configuration page for the static website.

    :::image type="content" source="media/storage-blob-static-website-how-to/select-website-configuration-sml.png" alt-text="Image showing how to access the Static website configuration page within the Azure portal" lightbox="media/storage-blob-static-website-how-to/select-website-configuration-lrg.png":::

4. Select **Enabled** to enable static website hosting for the storage account.

5. In the **Index document name** field, specify a default index page (For example: *index.html*).

   The default index page is displayed when a user navigates to the root of your static website.

6. In the **Error document path** field, specify a default error page (For example: *404.html*).

   The default error page is displayed when a user attempts to navigate to a page that does not exist in your static website.

7. Click **Save** to finish the static site configuration.

    :::image type="content" source="media/storage-blob-static-website-how-to/select-website-properties-sml.png" alt-text="Image showing how to set the Static website properties within the Azure portal" lightbox="media/storage-blob-static-website-how-to/select-website-properties-lrg.png":::

8. A confirmation message is displayed. Your static website endpoints and other configuration information are shown within the **Overview** pane.

    :::image type="content" source="media/storage-blob-static-website-how-to/website-properties-sml.png" alt-text="Image showing the Static website properties within the Azure portal" lightbox="media/storage-blob-static-website-how-to/website-properties-lrg.png":::

### [Azure CLI](#tab/azure-cli)

<a id="cli"></a>

You can enable static website hosting by using the [Azure CLI](/cli/azure/).

1. First, open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```azurecli-interactive
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

3. Enable static website hosting.

   ```azurecli-interactive
   az storage blob service-properties update --account-name <storage-account-name> --static-website --404-document <error-document-name> --index-document <index-document-name>
   ```

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   - Replace the `<error-document-name>` placeholder with the name of the error document that will appear to users when a browser requests a page on your site that does not exist.

   - Replace the `<index-document-name>` placeholder with the name of the index document. This document is commonly "index.html".

### [PowerShell](#tab/azure-powershell)

<a id="powershell"></a>

You can enable static website hosting by using the Azure PowerShell module.

1. Open a Windows PowerShell command window.

2. Verify that you have Azure PowerShell module Az version 0.7 or later.

   ```powershell
   Get-InstalledModule -Name Az -AllVersions | select Name,Version
   ```

   If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

3. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

4. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

5. Get the storage account context that defines the storage account you want to use.

   ```powershell
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context
   ```

   - Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

6. Enable static website hosting.

   ```powershell
   Enable-AzStorageStaticWebsite -Context $ctx -IndexDocument <index-document-name> -ErrorDocument404Path <error-document-name>
   ```

   - Replace the `<error-document-name>` placeholder with the name of the error document that will appear to users when a browser requests a page on your site that does not exist.

   - Replace the `<index-document-name>` placeholder with the name of the index document. This document is commonly "index.html".

---

## Upload files

### [Portal](#tab/azure-portal)

The following instructions show you how to upload files by using the Azure portal. You could also use [AzCopy](../common/storage-use-azcopy-v10.md), PowerShell, CLI, or any custom application that can upload files to the **$web** container of your account. For a step-by-step tutorial that uploads files by using Visual Studio code, see [Tutorial: Host a static website on Blob Storage](./storage-blob-static-website-host.md).

1. In the Azure portal, navigate to the storage account containing your static website. Select **Containers** in the left navigation pane to display the list of containers.

2. In the **Containers** pane, select the **$web** container to open the container's **Overview** pane.

    :::image type="content" source="media/storage-blob-static-website-how-to/web-containers-sml.png" alt-text="Image showing where to locate the website storage container in Azure portal" lightbox="media/storage-blob-static-website-how-to/web-containers-lrg.png":::

3. In the **Overview** pane, select the **Upload** icon to open the **Upload blob** pane. Next, select the **Files** field within the **Upload blob** pane to open the file browser. Navigate to the file you want to upload, select it, and then select **Open** to populate the **Files** field. Optionally, select the **Overwrite if files already exist** checkbox.

    :::image type="content" source="media/storage-blob-static-website-how-to/file-upload-sml.png" alt-text="Image showing how to upload files to the static website storage container" lightbox="media/storage-blob-static-website-how-to/file-upload-lrg.png":::

4. If you intend for the browser to display the contents of file, make sure that the content type of that file is set to `text/html`. To verify this, select the name of the blob you uploaded in the previous step to open its **Overview** pane. Ensure that the value is set within the **CONTENT-TYPE** property field.

    :::image type="content" source="media/storage-blob-static-website-how-to/blob-content-type-sml.png" alt-text="Image showing how to verify blob content types" lightbox="media/storage-blob-static-website-how-to/blob-content-type-lrg.png":::

   > [!NOTE]
   > This property is automatically set to `text/html` for commonly recognized extensions such as `.html`. However, in some cases, you'll have to set this yourself. If you don't set this property to `text/html`, the browser will prompt users to download the file instead of rendering the contents. This property can be set in the previous step.

### [Azure CLI](#tab/azure-cli)

Upload objects to the *$web* container from a source directory.

This example assumes that you're running commands from Azure Cloud Shell session.

```azurecli-interactive
az storage blob upload-batch -s <source-path> -d '$web' --account-name <storage-account-name>
```

> [!NOTE]
> If the browser prompts users users to download the file instead of rendering the contents, you can append `--content-type 'text/html; charset=utf-8'` to the command.

- Replace the `<storage-account-name>` placeholder value with the name of your storage account.

- Replace the `<source-path>` placeholder with a path to the location of the files that you want to upload.

> [!NOTE]
> If you're using a location installation of Azure CLI, then you can use the path to any location on your local computer (For example: `C:\myFolder`.
>
> If you're using Azure Cloud Shell, you'll have to reference a file share that is visible to the Cloud Shell. This location could be the file share of the Cloud share itself or an existing file share that you mount from the Cloud Shell. To learn how to do this, see [Persist files in Azure Cloud Shell](../../cloud-shell/persisting-shell-storage.md).

### [PowerShell](#tab/azure-powershell)

Upload objects to the *$web* container from a source directory.

```powershell
# upload a file
set-AzStorageblobcontent -File "<path-to-file>" `
-Container `$web `
-Blob "<blob-name>" `
-Context $ctx
```

> [!NOTE]
> If the browser prompts users users to download the file instead of rendering the contents, you can append `-Properties @{ ContentType = "text/html; charset=utf-8";}` to the command.

- Replace the `<path-to-file>` placeholder value with the fully qualified path to the file that you want to upload (For example: `C:\temp\index.html`).

- Replace the `<blob-name>` placeholder value with the name that you want to give the resulting blob (For example: `index.html`).

---

<a id="portal-find-url"></a>

## Find the website URL

You can view the pages of your site from a browser by using the public URL of the website.

### [Portal](#tab/azure-portal)

In the pane that appears beside the account overview page of your storage account, select **Static Website**. The URL of your site appears in the **Primary endpoint** field.

![Azure Storage static websites metrics metric](./media/storage-blob-static-website/storage-blob-static-website-url.png)

### [Azure CLI](#tab/azure-cli)

Find the public URL of your static website by using the following command:

```azurecli-interactive
az storage account show -n <storage-account-name> -g <resource-group-name> --query "primaryEndpoints.web" --output tsv
```

- Replace the `<storage-account-name>` placeholder value with the name of your storage account.

- Replace the `<resource-group-name>` placeholder value with the name of your resource group.

### [PowerShell](#tab/azure-powershell)

Find the public URL of your static website by using by using the following command:

```powershell
 $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -Name "<storage-account-name>"
Write-Output $storageAccount.PrimaryEndpoints.Web
```

- Replace the `<resource-group-name>` placeholder value with the name of your resource group.

- Replace the `<storage-account-name>` placeholder value with the name of your storage account.

---

<a id="metrics"></a>

## Enable metrics on static website pages

Once you've enabled metrics, traffic statistics on files in the **$web** container are reported in the metrics dashboard.

1. Click **Metrics** under the **Monitor** section of the storage account menu.

   > [!div class="mx-imgBorder"]
   > ![Metrics link](./media/storage-blob-static-website/metrics-link.png)

   > [!NOTE]
   > Metrics data are generated by hooking into different metrics APIs. The portal only displays API members used within a given time frame in order to only focus on members that return data. In order to ensure you're able to select the necessary API member, the first step is to expand the time frame.

2. Click on the time frame button, choose a time frame, and then click **Apply**.

   ![Azure Storage static websites metrics time range](./media/storage-blob-static-website/storage-blob-static-website-metrics-time-range.png)

3. Select **Blob** from the *Namespace* drop down.

   ![Azure Storage static websites metrics namespace](./media/storage-blob-static-website/storage-blob-static-website-metrics-namespace.png)

4. Then select the **Egress** metric.

   ![Screenshot that shows the Azure Storage static websites Egress metric.](./media/storage-blob-static-website/storage-blob-static-website-metrics-metric.png)

5. Select **Sum** from the *Aggregation* selector.

   ![Azure Storage static websites metrics aggregation](./media/storage-blob-static-website/storage-blob-static-website-metrics-aggregation.png)

6. Click the **Add filter** button and choose **API name** from the *Property* selector.

   ![Azure Storage static websites metrics API name](./media/storage-blob-static-website/storage-blob-static-website-metrics-api-name.png)

7. Check the box next to **GetWebContent** in the *Values* selector to populate the metrics report.

   ![Azure Storage static websites metrics GetWebContent](./media/storage-blob-static-website/storage-blob-static-website-metrics-getwebcontent.png)

   > [!NOTE]
   > The **GetWebContent** checkbox appears only if that API member was used within a given time frame. The portal only displays API members used within a given time frame in order to only focus on members that return data. If you can't find a specific API member in this list, expand the time frame.

## Next steps

- Learn how to configure a custom domain with your static website. See [Map a custom domain to an Azure Blob Storage endpoint](storage-custom-domain-name.md).
