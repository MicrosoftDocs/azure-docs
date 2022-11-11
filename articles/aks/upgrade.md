---
title: Overview of upgrading Azure Kubernetes Service (AKS) clusters and components
description: Learn about the various upgradeable components of anAzure Kubernetes Service (AKS) cluster and how to maintain them.
author: nickomang
ms.author: nickoman
ms.service: container-service
ms.topic: conceptual
ms.date: 11/11/2022
---

# Upgrading Azure Kubernetes Service clusters and node pools

An Azure Kubernetes Service (AKS) cluster will periodically need to be updated to ensure security and compatibility with the latest features. There are two components of an AKS cluster that are necessary to maintain:

- *Cluster Kubernetes version*: Part of the AKS cluster lifecycle involves performing upgrades to the latest Kubernetes version. It’s important you upgrade to apply the latest security releases and to get access to the latest Kubernetes features.
- *Node image version*: AKS regularly provides new node images with the latest OS and runtime updates. It's beneficial to upgrade your nodes' images regularly to ensure support for the latest AKS features and to apply essential security patches and hot fixes.

These components can be updated manually or automatically by making use of features such as [auto upgrade][auto-upgrade] and [planned maintenance windows][planned-maintenance].

The following table lists summarizes details on updating each component:

|Component name|Frequency of upgrade|Planned Maintenance supported|Supported operation methods|Documentation link|
|--|--|--|--|--|
|Cluster Kubernetes version (minor) upgrade|Roughly every three months|Yes| Automatic, Manual|[Upgrade an AKS cluster][upgrade-cluster]|
|Cluster Kubernetes version upgrade to supported patch version|Approximately weekly. To determine the latest applicable version in your region, see the [AKS release tracker][release-tracker] ||||[Upgrade an AKS cluster][upgrade-cluster]|Yes|Automatic, Manual|
|Node image version upgrade|**Linux**: weekly<br>**Windows**: monthly|Yes|Automatic, Manual|
|Security patches and hot fixes for node images|As-necessary|||

## Automatic upgrades

Automatic upgrades can be performed through [auto upgrade channels][auto-upgrade] or via [GitHub Actions][gh-actions-upgrade].

## Next steps

Learn about [auto upgrade]]auto-upgrade] and [planned maintenance][planned-maintenance].

For more information what cluster operations may trigger specific upgrade events, see the [AKS operator's guide on patching][operator-guide-patching].

<!-- LINKS -->
[auto-upgrade]: ./auto-upgrade-cluster.md
[planned-maintenance]: ./planned-maintenance.md
[upgrade-cluster]: ./upgrade-cluster.md
[release-tracker]: ./release-tracker.md
[upgrade-patch]: ./supported-kubernetes-versions,md#kubernetes-version-support-policy
[operator-guide-patching]: ./azure/architecture/operator-guides/aks/aks-upgrade-practices.md#considerations