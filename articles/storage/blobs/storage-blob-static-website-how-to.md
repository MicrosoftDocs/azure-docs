---
title: Host a static website in Azure Storage
description: Learn how to serve static content (HTML, CSS, JavaScript, and image files) directly from a container in an Azure Storage GPv2 account.
author: stevenmatthew
ms.service: azure-blob-storage
ms.topic: concept-article
ms.author: shaas
ms.date: 08/31/2026
ms.custom: devx-track-js, devx-track-azurepowershell
# Customer intent: As a web developer, I want to host a static website in a cloud storage account, so that I can serve HTML, CSS, and JavaScript files directly to users without managing a web server.
---

# Host a static website in Azure Storage

You can serve static content (HTML, CSS, JavaScript, and image files) directly from a container in a [general-purpose v2](../common/storage-account-create.md) or [`BlockBlobStorage`](../common/storage-account-create.md) account. To learn more, see [Static website hosting in Azure Storage](storage-blob-static-website.md).

This article shows you how to enable static website hosting by using the Azure portal, the Azure CLI, or PowerShell.

## Enable static website hosting

Enable static website hosting on the storage account.

### [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Locate your storage account and select it to display the account's **Overview** pane.

3. In the **Overview** pane, select the **Capabilities** tab. Next, select **Static website** to display the configuration page for the static website.

   :::image type="content" source="media/storage-blob-static-website-how-to/select-website-configuration-sml.png" alt-text="Screenshot showing the Static website configuration page in the Azure portal." lightbox="media/storage-blob-static-website-how-to/select-website-configuration-lrg.png":::

4. Select **Enabled** to enable static website hosting for the storage account.

5. In the **Index document name** field, enter a default index page (for example, *index.html*).

   The default index page appears when you navigate to the root of your static website.

6. In the **Error document path** field, enter a default error page (for example, *404.html*).

   The default error page appears when you navigate to a page that doesn't exist in your static website.

7. Select **Save** to finish the static site configuration.

   :::image type="content" source="media/storage-blob-static-website-how-to/select-website-properties-sml.png" alt-text="Screenshot showing the index and error document settings for a static website." lightbox="media/storage-blob-static-website-how-to/select-website-properties-lrg.png":::

8. After you save the configuration, a confirmation message appears. The **Overview** pane shows your static website endpoints and other configuration information.

   :::image type="content" source="media/storage-blob-static-website-how-to/website-properties-sml.png" alt-text="Screenshot showing static website endpoints and configuration properties." lightbox="media/storage-blob-static-website-how-to/website-properties-lrg.png":::

### [Azure CLI](#tab/azure-cli)

<a id="cli"></a>

You can enable static website hosting by using the [Azure CLI](/cli/azure/).

1. First, open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. If your identity is associated with more than one subscription, set your active subscription to the subscription of the storage account that hosts your static website. Replace the `<subscription-id>` placeholder value with the ID of your subscription.

   ```azurecli-interactive
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

3. Enable static website hosting.

   ```azurecli-interactive
   az storage blob service-properties update --account-name <storage-account-name> --static-website --404-document <error-document-name> --index-document <index-document-name>
   ```

   - Replace the `<storage-account-name>` placeholder value with the name of your storage account.

   - Replace the `<error-document-name>` placeholder with the name of the error document that appears when a browser requests a page on your site that doesn't exist.

   - Replace the `<index-document-name>` placeholder with the name of the index document. This document is commonly `index.html`.

### [PowerShell](#tab/azure-powershell)

<a id="powershell"></a>

You can enable static website hosting by using the Azure PowerShell module.

1. Open a Windows PowerShell command window.

2. Verify that you have Azure PowerShell module Az version 0.7 or later.

   ```powershell
   Get-InstalledModule -Name Az -AllVersions | Select-Object Name, Version
   ```

   If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

3. Sign in to your Azure subscription with the [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

4. If your identity is associated with more than one subscription, set your active subscription to the subscription of the storage account that hosts your static website.

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

   - Replace the `<error-document-name>` placeholder with the name of the error document that appears when a browser requests a page on your site that doesn't exist.

   - Replace the `<index-document-name>` placeholder with the name of the index document. This document is commonly `index.html`.

---

## Upload files

### [Portal](#tab/azure-portal)

The following instructions show you how to upload files by using the Azure portal. You can also use [AzCopy](../common/storage-use-azcopy-v10.md), Azure PowerShell, Azure CLI, or a custom application to upload files to the `$web` container of your account. For a step-by-step tutorial that uploads files by using Visual Studio Code, see [Tutorial: Host a static website on Blob Storage](./storage-blob-static-website-host.md).

1. In the Azure portal, navigate to the storage account containing your static website. Select **Containers** in the left navigation pane to display the list of containers.

2. In the **Containers** pane, select the `$web` container to open the container's **Overview** pane.

   :::image type="content" source="media/storage-blob-static-website-how-to/web-containers-sml.png" alt-text="Screenshot showing the $web container in the Azure portal." lightbox="media/storage-blob-static-website-how-to/web-containers-lrg.png":::

3. In the **Overview** pane, select **Upload**. In the **Upload blob** pane, select the **Files** field to open the file browser. Navigate to the file, select it, and then select **Open**. Optionally, select **Overwrite if files already exist**.

   :::image type="content" source="media/storage-blob-static-website-how-to/file-upload-sml.png" alt-text="Screenshot showing file selection in the Upload blob pane." lightbox="media/storage-blob-static-website-how-to/file-upload-lrg.png":::

4. If you intend for the browser to display the contents of the file, ensure that the content type of that file is set to `text/html`. To verify this setting, select the name of the blob you uploaded in the previous step to open its **Overview** pane. Ensure that the value is set within the **CONTENT-TYPE** property field.

   :::image type="content" source="media/storage-blob-static-website-how-to/blob-content-type-sml.png" alt-text="Screenshot showing the content type property for an uploaded blob." lightbox="media/storage-blob-static-website-how-to/blob-content-type-lrg.png":::

   > [!NOTE]
   > This property is automatically set to `text/html` for commonly recognized extensions such as `.html`. However, in some cases, you might need to set it yourself. If you don't set this property to `text/html`, the browser prompts users to download the file instead of rendering the contents. You can set this property in the previous step.

### [Azure CLI](#tab/azure-cli)

Upload objects to the `$web` container from a source directory.

This example assumes that you're running commands from an Azure Cloud Shell session.

```azurecli-interactive
az storage blob upload-batch -s <source-path> -d '$web' --account-name <storage-account-name>
```

> [!NOTE]
> If the browser prompts you to download the file instead of rendering the contents, append `--content-type 'text/html; charset=utf-8'` to the command.

- Replace the `<storage-account-name>` placeholder value with the name of your storage account.

- Replace the `<source-path>` placeholder with a path to the location of the files that you want to upload.

> [!NOTE]
> If you're using a local installation of Azure CLI, use the path to any location on your local computer (for example, `C:\myFolder`).
>
> If you're using Azure Cloud Shell, reference a file share that's visible to Cloud Shell. This location can be the file share for Cloud Shell itself or an existing file share that you mount from Cloud Shell. To learn how to do this, see [Persist files in Azure Cloud Shell](../../cloud-shell/persisting-shell-storage.md).

### [PowerShell](#tab/azure-powershell)

Upload objects to the `$web` container from a source directory.

```powershell
# Upload a file
Set-AzStorageBlobContent -File "<path-to-file>" `
   -Container '$web' `
   -Blob "<blob-name>" `
   -Context $ctx
```

> [!NOTE]
> If the browser prompts you to download the file instead of rendering the contents, append `-Properties @{ ContentType = "text/html; charset=utf-8";}` to the command.

- Replace the `<path-to-file>` placeholder value with the fully qualified path to the file that you want to upload (for example, `C:\temp\index.html`).

- Replace the `<blob-name>` placeholder value with the name that you want to give the resulting blob (for example, `index.html`).

---

<a id="portal-find-url"></a>

## Find the website URL

You can view the pages of your site from a browser by using the public URL of the website.

### [Portal](#tab/azure-portal)

In the pane that appears beside the account overview page of your storage account, select **Static Website**. The URL of your site appears in the **Primary endpoint** field.

:::image type="content" source="./media/storage-blob-static-website/storage-blob-static-website-url.png" alt-text="Screenshot showing the primary endpoint URL for an Azure Storage static website.":::

### [Azure CLI](#tab/azure-cli)

Find the public URL of your static website by using the following command:

```azurecli-interactive
az storage account show -n <storage-account-name> -g <resource-group-name> --query "primaryEndpoints.web" --output tsv
```

- Replace the `<storage-account-name>` placeholder value with the name of your storage account.

- Replace the `<resource-group-name>` placeholder value with the name of your resource group.

### [PowerShell](#tab/azure-powershell)

Find the public URL of your static website by using the following command:

```powershell
 $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -Name "<storage-account-name>"
Write-Output $storageAccount.PrimaryEndpoints.Web
```

- Replace the `<resource-group-name>` placeholder value with the name of your resource group.

- Replace the `<storage-account-name>` placeholder value with the name of your storage account.

---

<a id="metrics"></a>

## Enable metrics on static website pages

After you enable metrics, the metrics dashboard reports traffic statistics for files in the `$web` container.

1. Select **Metrics** under the **Monitor** section of the storage account menu.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/storage-blob-static-website/metrics-link.png" alt-text="Screenshot showing Metrics under Monitor in the storage account menu.":::

   > [!NOTE]
   > The portal shows only API members that return data in the selected time frame. Expand the time frame to make the necessary API member available.

2. Select the time frame button, select a time frame, and then select **Apply**.

   :::image type="content" source="./media/storage-blob-static-website/storage-blob-static-website-metrics-time-range.png" alt-text="Screenshot showing the metrics time frame selector and Apply button.":::

3. Select **Blob** from the **Namespace** dropdown.

   :::image type="content" source="./media/storage-blob-static-website/storage-blob-static-website-metrics-namespace.png" alt-text="Screenshot showing Blob selected as the metrics namespace.":::

4. Select the **Egress** metric.

   :::image type="content" source="./media/storage-blob-static-website/storage-blob-static-website-metrics-metric.png" alt-text="Screenshot showing Egress selected as the metric.":::

5. Select **Sum** from the **Aggregation** selector.

   :::image type="content" source="./media/storage-blob-static-website/storage-blob-static-website-metrics-aggregation.png" alt-text="Screenshot showing Sum selected as the metrics aggregation.":::

6. Select **Add filter**, and then select **API name** from the **Property** selector.

   :::image type="content" source="./media/storage-blob-static-website/storage-blob-static-website-metrics-api-name.png" alt-text="Screenshot showing API name selected as the filter property.":::

7. Select the checkbox next to **GetWebContent** in the **Values** selector to populate the metrics report.

   :::image type="content" source="./media/storage-blob-static-website/storage-blob-static-website-metrics-getwebcontent.png" alt-text="Screenshot showing GetWebContent selected as the API name filter value.":::

   > [!NOTE]
   > The **GetWebContent** checkbox appears only if that API member was used within the selected time frame. If you can't find it, expand the time frame.

## Next steps

- [Map a custom domain to an Azure Blob Storage endpoint](storage-custom-domain-name.md).
