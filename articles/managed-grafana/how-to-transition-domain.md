---
title: How to transition to using the grafana.azure.com domain
description: Learn how to verify that your Azure Managed Grafana workspace is using the correct domain for its endpoint
ms.service: managed-grafana
ms.topic: how-to
author: msoumar-ms
ms.author: msoumar
ms.date: 11/27/2022
ms.custom: content-health
--- 

# Transition to using the grafana.azure.com domain

If you have an Azure Managed Grafana instance that was created on or before April 17 2022, your workspace is accessible through two URLs: one ending in azgrafana.io and one ending in grafana.azure.com. Both links point to the same workspace.

URLs ending in azgrafana.io will be deprecated in favor of the URL ending in grafana.azure.com. To avoid losing access to your Grafana workspace, you’ll need to verify that you can access your workspace through the grafana.azure.com endpoint, and that any links you may have that point to your workspace are using this endpoint as well.

Azure Managed Grafana workspaces created on or after 18 April 2022 only have a grafana.azure.com URL, so no action is needed to transition those workspaces.

## Verify the transition

Verify that you are set to use the grafana.azure.com domain:

1. In the Azure portal, go to your Azure Managed Grafana resource.
1. At the top of the **Overview** page, in **Essentials**, look for the endpoint of your Grafana workspace. Verify that the URL ends in grafana.azure.com and that clicking the link takes you to your Grafana endpoint.
     :::image type="content" source="media/domain-transition/grafana-domain-view-endpoint.png" alt-text="Screenshot of the Azure platform showing the Grafana endpoint URL.":::
1. If you have any bookmarks or links in your own documentation to your Grafana workspace, make sure that they point to the URL ending in grafana.azure.com listed in the Azure portal.

## Next steps

> [!div class="nextstepaction"]
> [Service reliability](./high-availability.md)
