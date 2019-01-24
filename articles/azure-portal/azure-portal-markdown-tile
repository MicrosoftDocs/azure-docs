---
title: Use a custom markdown tile on Azure dashboards>
description: Learn how to add a markdown tile to an Azure dashboard to display static content
services: azure-portal
keywords: 
author: kfollis
ms.author: kfollis
ms.date: 01/24/2019
ms.topic: conceptual

ms.service: azure-portal
manager: mtillman
---
# Use a markdown tile on Azure dashboards to show custom content
You can add a markdown tile to your Azure dashboards to display custom, static content. For example, if you want to show basic instructions, an image, or a set of hyperlinks, you can do that with a markdown tile.

## Add a markdown tile to your dashboard
1. Select **Dashboard** from the Azure portal sidebar. If you've created any custom dashboards, in the dashboard view, use the drop-down to select the dashboard where the custom markdown tile should appear. Select the edit icon to open the **Tile Gallery**.

![Screenshot showing dashboard edit view](./media/azure-portal-markdown-tile/azure-portal-dashboard-edit.png)
2. In the tile gallery, locate the tile called **Markdown** and click **Add**. The tile is added to the dashboard and the **Edit Markdown** pane opens.

3. Edit the **Title**, **Subtitle**, and **Content** fields to customize the tile. In the example shown here, the markdown tile has been edited to display custom help desk information.

![Screenshot showing markdown tile edit view](./media/azure-portal-markdown-tile/azure-portal-ed-markdown-tile.png)
4. Select **Done** to dismiss the **Edit Markdown** pane. Your content will appear on the Markdown tile, which can then be resized if desired by dragging the handle in the lower right-hand corner.

![Screenshot showing custom markdown tile](./media/azure-portal-markdown-tile/azure-portal-custom-markdown-tile.png)

## Markdown content capabilities and limitations
The Markdown tile supports content that is any mixture of plain text, Markdown syntax, and HTML. The Azure portal uses an open source library called _marked_ to transform your content into HTML that is rendered on the tile. For security and layout integrity purposes, the HTML produced by marked will be pre-processed by the portal before it is rendered. During that pre-processing the portal will remove portions of the html that pose a potential threat. The following types of content are not allowed by the portal:

* JavaScript – <script> tags and inline JavaScript evaluations will be removed
* Iframes - <iframe> tags will be removed
* Style - <style> tags will be removed. Inline style attributes on HTML elements are not officially supported. You may find that some inline style elements work, but they could stop working at any time if they interfere with the layout of the portal. The Markdown tile is intended for basic static content that uses the default styles of the portal.

