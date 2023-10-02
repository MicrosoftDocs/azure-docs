---
title: Use a custom markdown tile on Azure dashboards
description: Learn how to add a markdown tile to an Azure dashboard to display static content
ms.date: 03/27/2023
ms.topic: how-to
ms.custom:
---

# Use a markdown tile on Azure dashboards to show custom content

You can add a markdown tile to your Azure dashboards to display custom, static content. For example, you can show basic instructions, an image, or a set of hyperlinks on a markdown tile.

## Add a markdown tile to your dashboard

1. Select **Dashboard** from the Azure portal menu.

1. In the dashboard view, select the dashboard where the custom markdown tile should appear, then select **Edit**.

   :::image type="content" source="media/azure-portal-markdown-tile/azure-portal-dashboard-edit.png" alt-text="Screenshot showing the dashboard edit option in the Azure portal.":::

1. In the **Tile Gallery**, locate the tile called **Markdown** and select **Add**. The tile is added to the dashboard and the **Edit Markdown** pane opens.

1. Enter values for **Title** and **Subtitle**, which display on the tile after you move to another field.

   :::image type="content" source="media/azure-portal-markdown-tile/azure-portal-dashboard-enter-title.png" alt-text="Screenshot showing how to add a title and subtitle to a markdown tile.":::

1. Select one of the options for including markdown content: **Inline editing** or **Insert content using URL**.

   - Select **Inline editing** if you want to enter markdown directly.

      ![Screenshot showing entering inline content](./media/azure-portal-markdown-tile/azure-portal-dashboard-markdown-inline-content.png)

   - Select **Insert content using URL** if you want to use existing markdown content that's hosted online.

      ![Screenshot showing entering URL](./media/azure-portal-markdown-tile/azure-portal-dashboard-markdown-url.png)

      > [!NOTE]
      > For added security, create a markdown file and store it in an [Azure storage account blob where encryption is enabled](../storage/common/storage-service-encryption.md). For additional control, configure the encryption with [customer-managed keys stored in Azure Key Vault](../storage/common/customer-managed-keys-configure-key-vault.md?tabs=portal). You can then point to the file using the **Insert content using URL** option. Only users with permissions to the file can see the markdown content on the dashboard. You might need to set a [cross-origin resource sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) rule on the storage account so that the Azure portal (`https://portal.azure.com/`) can access the markdown file in the blob.

1. Select **Done** to dismiss the **Edit Markdown** pane. Your content appears on the Markdown tile, which you can resize by dragging the handle in the lower right-hand corner.

   :::image type="content" source="media/azure-portal-markdown-tile/azure-portal-custom-markdown-tile.png" alt-text="Screenshot showing the custom markdown tile on a dashboard.":::

## Markdown content capabilities and limitations

You can use any combination of plain text, Markdown syntax, and HTML content on the markdown tile. The Azure portal uses an open-source library called _marked_ to transform your content into HTML that is shown on the tile. The HTML produced by _marked_ is pre-processed by the portal before it's rendered. This step helps make sure that your customization won't affect the security or layout of the portal. During that pre-processing, any part of the HTML that poses a potential threat is removed. The following types of content aren't allowed by the portal:

- JavaScript – `<script>` tags and inline JavaScript evaluations are removed.
- iframes - `<iframe>` tags are removed.
- Style - `<style>` tags are removed. Inline style attributes on HTML elements aren't officially supported. You may find that some inline style elements work for you, but if they interfere with the layout of the portal, they could stop working at any time. The Markdown tile is intended for basic, static content that uses the default styles of the portal.

## Next steps

- Learn more about [creating dashboards in the Azure portal](../azure-portal/azure-portal-dashboards.md).
- Learn how to [share a dashboard by using Azure role-based access control](azure-portal-dashboard-share-access.md).
