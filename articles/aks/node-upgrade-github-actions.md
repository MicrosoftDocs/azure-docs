---
title: Handle AKS node upgrades with GitHub Actions
titleSuffix: Azure Kubernetes Service
description: Learn how to update AKS nodes using GitHub Actions
services: container-service
ms.topic: article
ms.date: 11/28/2020


#Customer intent: As a cluster administrator, I want to know how to automatically apply Linux updates and reboot nodes in AKS for security and/or compliance
---

# Apply security updates to Azure Kubernetes Service (AKS) nodes automatically using GitHub Actions

Security updates are a key part of maintaining your AKS cluster secure and compliant with the latest fixes for the underlying OS's. These updates include OS security fixes or kernel updates, some of these updates require a node reboot to complete the process.

AKS itself does not automatically reboot these Linux nodes to complete the update, however, this is not needed if you use the native Azure CLI command `az aks upgrade`. This command will automatically apply the latest security fixes on both Windows and Linux nodes, automatically draining and cordoning these nodes so your application does not suffer from downtime.

This article shows you how you can automate the update process of AKS nodes using GitHub Actions and Azure CLI to create a cron-based update that runs automatically without human intervention.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

You also need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

This article also assumes you have a [GitHub][github] account to create your actions in.

## Understand the update process

To better understand the point of this article, let's first understand how Azure updates your nodes using the Azure CLI.

All Kubernetes' nodes run in a standard Azure virtual machine (VM). These VMs can be Windows or Linux-based. The Linux-based VMs use an Ubuntu image, with the OS configured to automatically check for updates every night.

When you use the `az aks upgrade` command, Azure CLI creates a surge of new nodes with the latest security and kernel updates, these nodes are initially cordoned to prevent any apps from being scheduled to them until the update is finished. After completion, Azure cordons and drains the older nodes and uncordon the new ones, effectively transferring all the scheduled applications to the new nodes.

This process is better than updating Linux-based kernels manually because Linux requires a reboot when a new kernel update is installed. If you update the OS manually, you also need to reboot the VM, manually cordoning and draining all the apps.

## Create a new GitHub Action

To create an automated scheduled update, you'll need a repository to host your actions. You can use any repository, for this article we'll be using your [profile repository](profile-repository). If you do not have one, create a new repository with the same name as your GitHub username.



<!-- LINKS - external -->
[kured]: https://github.com/weaveworks/kured
[github]: https://github.com
[profile-repository]: https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/about-your-profile

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-upgrade]: upgrade-cluster.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
