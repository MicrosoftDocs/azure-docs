---
title: AKS release tracker
description: Learn how to determine which Azure regions have the weekly AKS release deployments rolled out in real time. 
ms.topic: overview
ms.date: 04/25/2023
ms.author: nickoman
author: nickomang
ms.custom: mvc, build-2023
---

# AKS release tracker

AKS releases weekly rounds of fixes and feature and component updates that affect all clusters and customers. However, these releases can take up to two weeks to roll out to all regions from the initial time of shipping due to Azure Safe Deployment Practices (SDP). It is important for customers to know when a particular AKS release is hitting their region, and the AKS release tracker provides these details in real time by versions and regions.

## Why release tracker?

With AKS release tracker, customers can follow specific component updates present in an AKS version release, such as fixes shipped to a core add-on. In addition to providing real-time updates of region release status, the tracker also links to the specific version of the AKS [release notes][aks-release] to help customers identify which instance of the release is relevant to them. As the data is updated in real time, customers can track the entire SDP process with a single tool.

## How to use the release tracker

To view the release tracker, visit the [AKS release status webpage][release-tracker-webpage].

The top half of the tracker shows the latest and 3 previously available release versions for each region, and links to the corresponding release notes entry. This view is helpful when you want to track the available versions by region.

:::image type="content" source="./media/release-tracker/regional-status.png" alt-text="Screenshot of the A K S release tracker's regional status table displayed in a web browser.":::

The bottom half of the tracker shows the SDP process. The table has two views: one shows the latest version and status update for each grouping of regions and the other shows the status and region availability of each currently supported version.

:::image type="content" source="./media/release-tracker/sdp-process.png" alt-text="Screenshot of the A K S release tracker's S D P process table displayed in a web browser.":::

<!-- LINKS - external -->
[aks-release]: https://github.com/Azure/AKS/releases
[release-tracker-webpage]: https://releases.aks.azure.com/webpage/index.html
