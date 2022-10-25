---
title: Overview of upgrading on Azure Kubernetes Service (AKS)
description: Learn about the various methods of upgrading clusters and node pools on Azure Kubernetes Service (AKS).
author: nickomang
ms.author: nickoman
ms.service: container-service
ms.topic: conceptual
ms.date: 10/24/2022
---

# Upgrading Azure Kubernetes Service clusters and node pools

An Azure Kubernetes Service (AKS) cluster  will periodically need to be updated to ensure security and compatibility with the latest features. There are several components of an AKS cluster that are necessary to maintain:

- *Cluster Kubernetes version*: Part of the AKS cluster lifecycle involves performing periodic upgrades to the latest Kubernetes version. It’s important you apply the latest security releases, or upgrade to get the latest features.

- *Node image version*: AKS regularly provides new node images with the latest OS and runtime updates, so it's beneficial to upgrade your node's images regularly for the latest AKS features. Linux node images are updated weekly, and Windows node images updated monthly.

These components can be updated manually, or automatically by making use of features such as [auto upgrade][auto-upgrade] and [planned maintenance windows][planned-maintenance]. The following table lists the support by each component for these upgrade methods:

|Component name|Manual upgrade supported|Auto upgrade supported|Planned maintenance windows supported|Additional details|
|--|--|--|--|
|Cluster Kubernetes version||||
|Node image version||||

## Limitations

<!--

I think a table of limitations for each applicable area would be useful, so customers can see what applies to their specific scenario without having to look in multiple places.

--->

## Next steps
TODO: Add your next steps