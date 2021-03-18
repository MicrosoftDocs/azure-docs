---
title: Upgrade an Azure Red Hat OpenShift cluster
description: Learn how to upgrade an Azure Red Hat OpenShift cluster running OpenShift 4
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 1/10/2021
author: sakthi-vetrivel
ms.author: suvetriv
keywords: aro, openshift, az aro, red hat, cli
---

# Upgrade an Azure Red Hat OpenShift (ARO) cluster

Part of the ARO cluster lifecycle involves performing periodic upgrades to the latest OpenShift version. It is important you apply the latest security releases, or upgrade to get the latest features. This article shows you how to upgrade all components in an OpenShift cluster using the OpenShift Web Console.

## Before you begin

This article requires that you're running the Azure CLI version 2.0.65 of later. Run `az --version` to find your current version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli)

This article assumes you have access to an existing Azure Red Hat OpenShift cluster as a user with `admin` privileges.

## Check for available ARO cluster upgrades

From the OpenShift web console, select **Administration** > **Cluster Settings** and open the **Details** tab.

If the **Update Status** for your cluster reflects **Updates Available**, you can update your cluster.

## Upgrade your ARO cluster

From the web console in the previous step, set the **Channel** to the correct channel for the version that you want to update to, such as `stable-4.5`.

Selection a version to update to, and select **Update**. You'll see the update status change to: `Update to <product-version> in progress`. You can review the progress of the cluster update by watching the progress bars for the Operators and nodes.

## Next steps
- [Learn to upgrade an ARO cluster using the OC CLI](https://docs.openshift.com/container-platform/4.6/updating/updating-cluster-between-minor.html)
- You can find information about available OpenShift Container Platform advisories and updates in the [errata section](https://access.redhat.com/downloads/content/290/ver=4.6/rhel---8/4.6.0/x86_64/product-errata) of the Customer Portal.
