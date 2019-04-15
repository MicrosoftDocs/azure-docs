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

## Is it possible to access the Prometheus/Grafana stack to monitor containers and do capacity management?

Not at the current time.

## Is the docker registry available externally so that I can use tools such as Jenkins?

The docker registry is available from https://docker-registry.apps.<clustername>.<region>.azmosa.io/ 
However, a strong storage durability guarantee is not provided. You can also use Azure Container Registry.

## Is cross-namespace networking possible?

Customer and individual project admins can customize cross-namespace networking (including denying it) on a per project basis using NetworkPolicy objects.

## Can an admin do user and quota management as well access all user created projects?

Yes.

## It is possible to restrict which Azure AD users can sign into a cluster?

You can restrict which Azure AD users can sign in to a cluster by configuring the Azure AD Application. For details, see [How to: Restrict your app to a set of users](https://docs.microsoft.com/azure/active-directory/develop/howto-restrict-your-app-to-a-set-of-users)

## Can compute nodes in a single cluster cross regions?

No.

## Will the master and the infrastructure nodes be abstracted away as with Azure Kubernetes Service?

No. All resources run in the customer subscription. Resources are put in a read-only resource group.

## > Now I have logged with my Azure AD account in the master console but 
> I’m only a stardard user. How can I become a cluster admin? And how 
> can I filter administrator ad also stardard user? Now all Azure AD 
> users can logon through the console.
