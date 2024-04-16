---
title: Upgrade an Azure Red Hat OpenShift cluster
description: Learn how to upgrade an Azure Red Hat OpenShift cluster running OpenShift 4
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 6/12/2023
author: johnmarco
ms.author: johnmarc
keywords: aro, openshift, az aro, red hat, cli, azure, MUO, managed, upgrade, operator
#Customer intent: I need to understand how to upgrade my Azure Red Hat OpenShift cluster running OpenShift 4.
---

# Upgrade an Azure Red Hat OpenShift cluster

As part of the Azure Red Hat OpenShift cluster lifecycle, you need to perform periodic upgrades to the latest version of the OpenShift platform. Upgrading your Azure Red Hat OpenShift clusters enables you to upgrade to the latest features and functionalities and apply the latest security releases.

This article shows you how to upgrade all components in an OpenShift cluster using the OpenShift web console or the managed-upgrade-operator (MUO). 

## Before you begin

* This article requires that you're running the Azure CLI version 2.6.0 or later. Run `az --version` to find your current version. If you need to install or upgrade Azure CLI/it, see [Install Azure CLI](/cli/azure/install-azure-cli).

* This article assumes you have access to an existing Azure Red Hat OpenShift cluster as a user with `admin` privileges.

* This article assumes you've updated your Azure Red Hat OpenShift pull secret for an existing Azure Red Hat OpenShift 4.x cluster. Including the **cloud.openshift.com** entry from your pull secret enables your cluster to start sending telemetry data to Red Hat.

  For more information, see [Add or update your Red Hat pull secret on an Azure Red Hat OpenShift 4 cluster](howto-add-update-pull-secret.md).

* Make sure that the credentials for the service principal used for the cluster are valid/updated before starting the upgrade. For more information, see [Rotate service principal credentials for your Azure Red Hat OpenShift (ARO) Cluster](howto-service-principal-credential-rotation.md).

## Check for Azure Red Hat OpenShift cluster upgrades

1. From the top-left of the OpenShift web console, which is the default when you sign as the kubeadmin, select the **Administration** tab.

2. Select **Cluster Settings** and open the **Details** tab. You'll see the version, update status, and channel. The channel isn't configured by default. 

3. Select the **Channel** link, and at the prompt enter the desired update channel, for example **stable-4.10**. Once the desired channel is chosen, a graph showing available releases and channels is displayed. If the **Update Status** for your cluster shows **Updates Available**, you can update your cluster.

## Upgrade your Azure Red Hat OpenShift cluster with the OpenShift web console

From the OpenShift web console in the previous step, set the **Channel** to the correct channel for the version that you want to update to, such as `stable-4.10`.

Selection a version to update to, and select **Update**. You'll see the update status change to: `Update to <product-version> in progress`. You can review the progress of the cluster update by watching the progress bars for the operators and nodes.

## Scheduling individual upgrades using the managed-upgrade-operator

Use the managed-upgrade-operator (MUO) to upgrade your Azure Red Hat OpenShift cluster.

The managed-upgrade-operator manages automated cluster upgrades. The managed-upgrade-operator starts the cluster upgrade, but it doesn't perform any activities of the cluster upgrade process itself. The OpenShift Container Platform (OCP) is responsible for upgrading the clusters. The goal of the managed-upgrade-operator is to satisfy the operating conditions that a managed cluster must hold, both before and after starting the cluster upgrade.

1. Prepare the configuration file, as shown in the following example for upgrading to OpenShift 4.10.

```
apiVersion: upgrade.managed.openshift.io/v1alpha1
kind: UpgradeConfig
metadata:
  name: managed-upgrade-config
  namespace: openshift-managed-upgrade-operator
spec:
  type: "ARO"
  upgradeAt: "2022-02-08T03:20:00Z"
  PDBForceDrainTimeout: 60
  desired:
    channel: "stable-4.10"
    version: "4.10.10"
```

where:

* `channel` is the channel the configuration file will pull from, according to the lifecycle policy. The channel used should be `stable-4.10`.
* `version` is the version that you wish to upgrade to, such as `4.10.10`.
* `upgradeAT` is the time when the upgrade will take place.

2. Apply the configuration file:

```azurecli-interactive
$ oc create -f <file_name>.yaml
```

## Next steps
- [Learn to upgrade an Azure Red Hat OpenShift cluster using the OC CLI](https://docs.openshift.com/container-platform/4.10/updating/index.html).
- You can find information about available OpenShift Container Platform advisories and updates in the [errata section](https://access.redhat.com/downloads/content/290/ver=4.10/rhel---8/4.10.13/x86_64/product-software) of the Customer Portal.
