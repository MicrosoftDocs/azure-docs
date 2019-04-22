---
title: Frequently asked questions for Azure Red Hat OpenShift | Microsoft Docs
description: Here are answers to common questions about Microsoft Azure Red Hat OpenShift
services: container-service
author: tylermsft
ms.author: twhitney
manager: jeconnoc
ms.service: container-service
ms.topic: article
ms.date: 05/06/2019
---

# Azure Red Hat OpenShift FAQ

This article addresses frequently asked questions (FAQs) about Microsoft Azure Red Hat OpenShift.

## Which Azure regions are supported?

See [Supported resources](supported-resources.md#azure-regions) for a list of global regions where Azure Red Hat OpenShift is supported.

## Can I deploy a cluster into an existing virtual network?

Yes. You can deploy an Azure Red Hat OpenShift cluster into an existing virtual network when you create a cluster. See the [Connect a cluster's virtual network to an existing virtual network
](tutorial-create-cluster.md#optional-connect-the-clusters-virtual-network-to-an-existing-virtual-network) for details.

## What cluster operations are available?

You can only scale up or down the number of compute nodes. No other modifications are permitted to the `Microsoft.ContainerService/openShiftManagedClusters` resource after creation. The maximum number of compute nodes is limited to 20.

## What virtual machine sizes can I use?

See [Azure Red Hat OpenShift virtual machine sizes](supported-resources.md#virtual-machine-sizes) for a list of virtual machine sizes you can use with an Azure Red Hat OpenShift cluster.

## Is data on my cluster encrypted?

By default, there is encryption at rest. The Azure Storage platform automatically encrypts your data before persisting it, and decrypts the data before retrieval. See [Azure Storage Service Encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) for details.

## Can I use Prometheus/Grafana to monitor containers and manage capacity?

No, not at the current time.

## Is the Docker registry available externally so I can use tools such as Jenkins?

The Docker registry is available from https://docker-registry.apps.<clustername>.<region>.azmosa.io/ 
However, a strong storage durability guarantee is not provided. You can also use [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/).

## Is cross-namespace networking supported?

Customer and individual project admins can customize cross-namespace networking (including denying it) on a per project basis using `NetworkPolicy` objects.

## Can an admin manage users and quotas?

Yes. An Azure Red Hat OpenShift administrator can manage users and quotas in addition to accessing all user created projects.

## Can I restrict a cluster to only certain Azure AD users?

Yes. You can restrict which Azure AD users can sign in to a cluster by configuring the Azure AD Application. For details, see [How to: Restrict your app to a set of users](https://docs.microsoft.com/azure/active-directory/develop/howto-restrict-your-app-to-a-set-of-users)

## Can a cluster have compute nodes across multiple Azure regions?

No. All nodes in an Azure Red Hat OpenShift cluster must originate from the same Azure region.

## Are master and infrastructure nodes abstracted away as they are with Azure Kubernetes Service (AKS)?

No. All resources, including the cluster master, run in your customer subscription. These types of resources are put in a read-only resource group.
