---
title: Troubleshoot common Microsoft Azure Red Hat OpenShift problems
description: Learn how to troubleshoot and resolve common problems when using Microsoft Azure Red Hat OpenShift (ARO)
services: container-service
author: tylermsft
ms.author: twhitney
manager: jeconnoc
ms.service: container-service
ms.topic: troubleshooting
ms.date: 05/6/2019
---

# ARO troubleshooting

This article details some common problems encountered while creating or managing Microsoft Azure Red Hat OpenShift (ARO) clusters.

## Retrying the creation of a failed ARO cluster

If creating a cluster using the `az` CLI command fails, retrying creation will always fail. 
Use `az openshift delete` to delete the failed cluster. Then create an entirely new cluster.

## Untrusted ARO server certificate

Currently, the OpenShift console certificate is untrusted. When you navigate to the console, manually accept the untrusted certificate from your browser.

## Hidden ARO cluster resource group

Currently, the `Microsoft.ContainerService/openShiftManagedClusters` resource created by the `az` CLI is hidden in the Azure portal. In the `Resource group` view, check `Show hidden types` to view the resource group.

![Hidden Type](./media/aro-portal-hiddentype.png)

## Next steps

View the [Official guide to troubleshooting kubernetes clusters](https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/).
View [Kubernetes troubleshooting](https://github.com/feiskyer/kubernetes-handbook/blob/master/en/troubleshooting/index.md) for troubleshooting pods, nodes, clusters, and other features.

Find answers to [common questions and known issues](openshift-faq.md).