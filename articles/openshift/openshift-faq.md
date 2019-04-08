---
title: Frequently asked questions for Azure Red Hat OpenShift
description: Provides answers to some of the common questions about Azure Red Hat OpenShift.
services: container-service
author: tylermsft
ms.author: twhitney
manager: jeconnoc
ms.service: container-service
ms.topic: article
ms.date: 05/06/2019
---

# Frequently asked questions about Microsoft Azure Red Hat OpenShift

This article addresses frequent questions about Microsoft Azure Red Hat OpenShift.

## Which Azure regions support Azure Red Hat OpenShift?

See [Supported resources](supported-resources.md#azure-regions) for a list of regions around the globe that support Azure Red Hat OpenShift.

## Can I deploy Azure Red Hat OpenShift into my existing virtual network?

You can deploy an Azure Red Hat OpenShift cluster into an existing virtual network when you create the cluster. See the [Create a Microsoft Red Hat OpenShift cluster on Azure](tutorial-create-cluster.md) for details.

## What Azure Red Hat OpenShift cluster operations are available?

Currently, no modifications are permitted to the `Microsoft.ContainerService/openShiftManagedClusters` resource after creation, except for scaling up or down the  number of compute nodes. The maximum number of compute nodes is limited to 20.

## What virtual machine sizes can I use with my Azure Red Hat OpenShift cluster?

See [Azure Red Hat OpenShift virtual machine sizes](supported-resources.md#azure-red-hat-openshift-virtual-machine-sizes) for a list of permitted virtual machine sizes.

## Is data on my Azure Red Hat OpenShift cluster encrypted?

By default, there is encryption at rest. The Azure storage platform automatically encrypts your data before persisting it, and decrypts the data before retrieval. See [Azure Storage Service Encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) for details.