---
title: Set up your Azure Red Hat OpenShift development environment | Microsoft Docs
description: Set up your Microsoft Red Hat OpenShift development environment
services: openshift
keywords:  red hat open shift setup
author: TylerMSFT
ms.author: twhitney
ms.date: 5/6/2019
ms.topic: conceptual
ms.service: openshift
manager: jeconnoc
#Customer intent: As a developer, I need to install the prerequisites so I can create an Azure Red Hat Openshift cluster
---

# Set up your Microsoft Azure Red Hat OpenShift dev environment

To build and run Microsoft Azure Red Hat OpenShift (ARO) applications on your Windows development machine, you'll need:

* Version 2.0.43 or higher of the Azure CLI (or use the Azure Cloud Shell)
* A tenant (Azure Active Directory) for your OpenShift cluster
* An Azure Active Directory (AAD) application object and Active Directory user object
* Manually register providers and features

The following instructions will help you get everything ready.

## Install the Azure CLI

If you don't have version [2.0.61] of the Azure CLI, install the [latest version here][azure-cli-install].
You can see which version of the Azure CLI you have by running the following from a command window:
```bat
az --version
```

The first line of output will have the CLI version, for example `azure-cli (2.0.61)`.

## Create a tenant (Azure Active Directory)

Before you can create an Azure Red Hat OpenShift cluster, you need a tenant (an Azure Active Directory (AAD)) for it.

If you don't have an AAD to use as the tenant for your OpenShift cluster, or you wish to create a tenant for testing, follow the instructions in [Create a tenant for your Azure Open Shift cluster](howto-create-tenant.md) before continuing with these instructions.

## Create an Azure Active Directory application object and user

Before you can create an Azure Red Hat OpenShift cluster, you also need an app registration that allows the cluster to perform functions such as configuring storage. You'll also need to create a new user in AAD to use to sign in to the app running on your ARO cluster.

If you don't have an app registration in the AAD tenant you are using to create your ARO cluster, or don't have a AAD user to use to sign in to your cluster, follow the instructions in [Create an Azure Active Directory application object](howto-aad-app-configuration.md).

## Register providers and features

The `Microsoft.ContainerService openshiftmanagedcluster` feature, `Microsoft.Solutions` and `Microsoft.Network` providers must be registered to your subscription manually before deploying your first ARO cluster.

To register these providers and features manually, use the following instructions:

1. Start an Azure Cloud Shell (Bash) session from the Azure portal.
2. If you have access to multiple subscriptions, specify the relevant
  subscription ID:

```bash
az account set --subscription <SUBSCRIPTION ID>
```

3. Register the Microsoft.ContainerService openshiftmanagedcluster feature:

```bash
az feature register --namespace Microsoft.ContainerService -n openshiftmanagedcluster
```

4. Register the Microsoft.Solutions provider:

```bash
az provider register -n Microsoft.Solutions --wait
```

5. Register the Microsoft.Network provider:

```bash
az provider register -n Microsoft.Network --wait
```

6. Refresh the registration of the Microsoft.ContainerService resource provider:

```bash
az provider register -n Microsoft.ContainerService --wait
```

You're now ready to create Azure Red Hat Openshift applications.

## Next steps

Try the [Create an Azure Red Hat Openshift cluster](tutorial-create-cluster.md) tutorial.
Find answers to [common questions and known issues](openshift-faq.md).

[azure-cli-install]: https://docs.microsoft.com/cli/azure/install-azure-cli