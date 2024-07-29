---
title: AKS release tracker
description: Learn how to determine which Azure regions have the weekly AKS release deployments rolled out in real time. 
ms.topic: overview
ms.date: 05/09/2024
ms.author: nickoman
author: nickomang
ms.custom: mvc, build-2023
---

# AKS release tracker

AKS releases weekly rounds of fixes and feature and component updates that affect all clusters and customers. It's important for you to know when a particular AKS release is hitting your region, and the AKS release tracker provides these details in real time by versions and regions.

## Overview

With AKS release tracker, you can follow specific component updates present in an AKS version release, such as fixes shipped to a core add-on, and node image updates for Azure Linux, Ubuntu, and Windows. The tracker provides links to the specific version of the AKS [release notes][aks-release] to help you identify relevant release instances. Real time data updates allow you to track the release order and status of each region.

## Use the release tracker

To view the release tracker, visit the [AKS release status webpage][release-tracker-webpage].

### AKS releases

The top half of the tracker shows the current latest version and three previously available release versions for each region and links to the corresponding release notes entries. This view is helpful when you want to track the available versions by region.

:::image type="content" source="./media/release-tracker/regional-status.png" alt-text="Screenshot of the AKS release tracker's regional status table displayed in a web browser.":::

The bottom half of the tracker shows the release order. The table has two views: *By Region* and *By Version*.

:::image type="content" source="./media/release-tracker/release-order.png" alt-text="Screenshot of the AKS release tracker's release order table displayed in a web browser.":::

### AKS node image updates

The top half of the tracker shows the current latest node image version and three previously available node image versions for each region. This view is helpful when you want to track the available node image versions by region.

:::image type="content" source="./media/release-tracker/node-image-status.png" alt-text="Screenshot of the AKS release tracker's node image status table displayed in a web browser.":::

The bottom half of the tracker shows the node image update order. The table has two views: *By Region* and *By Version*.

:::image type="content" source="./media/release-tracker/node-image-order.png" alt-text="Screenshot of the AKS release tracker's node image order table displayed in a web browser.":::

<!-- LINKS - external -->
[aks-release]: https://github.com/Azure/AKS/releases
[release-tracker-webpage]: https://releases.aks.azure.com/webpage/index.html
