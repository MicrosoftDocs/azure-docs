---
title: Set up your Microsoft Azure Red Hat OpenShift development environment | Microsoft Docs
description: Before you can create a Red Hat OpenShift cluster, you need to install the CLI, create a tenant, and an Azure AD app object and user.
services: openshift
keywords:  red hat openshift setup set up
author: TylerMSFT
ms.author: twhitney
ms.date: 05/06/2019
ms.topic: conceptual
ms.service: openshift
manager: jeconnoc
#Customer intent: As a developer, I need to take care of several tasks before I can create an Azure Red Hat OpenShift cluster
---

# Set up your Microsoft Azure Red Hat OpenShift dev environment

To build and run Microsoft Azure Red Hat OpenShift applications on your Windows development machine, you'll need:

* Version 2.0.43 or higher of the Azure CLI (or use the Azure Cloud Shell)
* A tenant, or Azure Active Directory (Azure AD), for your OpenShift cluster
* An Azure AD application object
* An Azure AD user that you'll use to sign into apps running on your OpenShift cluster
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

Before you can create an Azure Red Hat Azure Red Hat OpenShift cluster, you need a tenant, otherwise known as an Azure AD, for it.

If you don't have an Azure AD to use as the tenant for your Azure Red Hat OpenShift cluster, or you wish to create a tenant for testing, follow the instructions in [Create a tenant for your Azure OpenShift cluster](howto-create-tenant.md) before continuing with these instructions.

## Create an Azure Active Directory application object and user

You also need an app registration that allows the cluster to perform functions such as configuring storage. You'll also need to create a new user in Azure AD to use to sign in to the app running on your Azure Red Hat OpenShift cluster.

If you don't have an app registration in the Azure AD tenant you are using to create your Azure Red Hat OpenShift cluster, or don't have a Azure AD user to use to sign in to your cluster, follow the instructions in [Create an Azure Active Directory application object](howto-aad-app-configuration.md) before continuing with these instructions.

## Register providers and features

The `Microsoft.ContainerService openshiftmanagedcluster` feature, `Microsoft.Solutions` and `Microsoft.Network` providers must be registered to your subscription manually before deploying your first Azure Red Hat OpenShift cluster.

To register these providers and features manually, use the following instructions from a Bash shell if you've installed the CLI, or from the Azure Cloud Shell (Bash) session in your Azure portal:
.
1. If you have access to multiple subscriptions, specify the relevant
  subscription ID:

    ```bash
    az account set --subscription <SUBSCRIPTION ID>
    ```

2. Register the Microsoft.ContainerService openshiftmanagedcluster feature:

    ```bash
    az feature register --namespace Microsoft.ContainerService -n openshiftmanagedcluster
    ```

3. Register the Microsoft.Solutions provider:

    ```bash
    az provider register -n Microsoft.Solutions --wait
    ```

4. Register the Microsoft.Network provider:

    ```bash
    az provider register -n Microsoft.Network --wait
    ```

5. Refresh the registration of the Microsoft.ContainerService resource provider:

    ```bash
    az provider register -n Microsoft.ContainerService --wait
    ```

You're now ready to create Azure Red Hat OpenShift applications.

## Next steps

Try the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.
Find answers to [common questions and known issues](openshift-faq.md).

[azure-cli-install]: https://docs.microsoft.com/cli/azure/install-azure-cli