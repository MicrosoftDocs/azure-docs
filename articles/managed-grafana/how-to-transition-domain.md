---
title: How to transition to using the grafana.azure.com domain
description: Learn how to verify that your Azure Managed Grafana workspace is using the correct domain for its endpoint
ms.service: managed-grafana
ms.topic: how-to
author: msoumar-ms
ms.author: msoumar
ms.date: 09/27/2022
--- 

# Transition to using the grafana.azure.com domain
If you have an Azure Managed Grafana workspace that was created on or before 17 April 2022, it is accessible through two URL’s - one ending in azgrafana.io, and one ending in grafana.azure.com. Both links are identical and point to the same workspace. To avoid losing access to your Grafana workspace, you’ll need to verify that you can access your workspace through the grafana.azure.com endpoint, and that any links you may have that point to your workspace are using this endpoint as well. 

Azure Managed Grafana workspaces created on or after 18 April 2022 only have a grafana.azure.com URL, so no action is needed to transition those workspaces.

## Steps to verify the transition
1. In the Azure portal, go to your Azure Managed Grafana resource.
     ![Overview header of a Grafana workspace](https://github.com/msoumar-ms/azure-docs/blob/main/articles/managed-grafana/media/grafana-endpoint/grafana-domain-view-endpoint.png)
1. At the top of the Overview page, in Essentials, you should see the endpoint of your Grafana workspace. Verify that the URL ends in grafana.azure.com and that clicking the link takes you to the Grafana workspace itself.
1. If you have any bookmarks or links in your own documentation to your Grafana workspace, be sure that they point to the same URL ending in grafana.azure.com as the endpoint in the Essentials tab.
     ![Bookmark to a Grafana workspace](https://github.com/msoumar-ms/azure-docs/blob/main/articles/managed-grafana/media/grafana-endpoint/grafana-domain-bookmark-example.png)
