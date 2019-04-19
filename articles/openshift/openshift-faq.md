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

## Which Azure regions are supported?

See [Supported resources](supported-resources.md#azure-regions) for a list of regions around the globe that support Azure Red Hat OpenShift.

## Can I deploy a cluster into an existing virtual network?

You can deploy an Azure Red Hat OpenShift cluster into an existing virtual network when you create the cluster. See the [Create a Microsoft Red Hat OpenShift cluster on Azure](tutorial-create-cluster.md) for details.

## What cluster operations are available?

You can only scale up or down the number of compute nodes. No other modifications are permitted to the `Microsoft.ContainerService/openShiftManagedClusters` resource after creation. The maximum number of compute nodes is limited to 20.

## What virtual machine sizes can I use?

See [Azure Red Hat OpenShift virtual machine sizes](supported-resources.md#azure-red-hat-openshift-virtual-machine-sizes) for a list of virtual machine sizes you can use with an Azure Red Hat OpenShift cluster.

## Is data on my Azure Red Hat OpenShift cluster encrypted?

By default, there is encryption at rest. The Azure storage platform automatically encrypts your data before persisting it, and decrypts the data before retrieval. See [Azure Storage Service Encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) for details.

## Is it possible to access the Prometheus/Grafana stack 

It is not currently possible to use the Prometheus/Grafana stack stack to monitor containers and do capacity management.

## Is the docker registry available externally?

The docker registry is available from https://docker-registry.apps.<clustername>.<region>.azmosa.io/ so that you can use tools such as Jenkins. However, a strong storage durability guarantee is not provided. You can also use Azure Container Registry.

## Is cross-namespace networking possible?

Customer and individual project admins can customize cross-namespace networking (including denying it) on a per project basis using NetworkPolicy objects.

## Can an admin manage user and quota management?

Yes. An admin can also access all user-created projects.

## It is possible to restrict who can sign into a cluster?

You can restrict which Azure Active Directory (Azure AD) users can sign in to a cluster by configuring the Azure AD Application. For details, see [How to: Restrict your app to a set of users](https://docs.microsoft.com/azure/active-directory/develop/howto-restrict-your-app-to-a-set-of-users).

## Can compute nodes in a single cluster cross regions?

No.

## Are master and infrastructure nodes abstracted away?

No. All resources run in the customer subscription. Resources are put in a read-only resource group.