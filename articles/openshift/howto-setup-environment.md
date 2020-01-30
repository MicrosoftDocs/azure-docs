---
title: Set up your Azure Red Hat OpenShift development environment
description: Here are the prerequisites for working with Microsoft Azure Red Hat OpenShift.
keywords:  red hat openshift setup set up
author: jimzim
ms.author: jzim
ms.date: 11/04/2019
ms.topic: conceptual
ms.service: container-service
#Customer intent: As a developer, I need to understand the prerequisites for working with Azure Red Hat OpenShift
---

# Set up your Azure Red Hat OpenShift dev environment

To build and run Microsoft Azure Red Hat OpenShift applications, you'll need to:

* Install version 2.0.65 (or higher) of the Azure CLI (or use the Azure Cloud Shell).
* Register for the `AROGA` feature and associated resource providers.
* Create an Azure Active Directory (Azure AD) tenant.
* Create an Azure AD application object.
* Create an Azure AD user.

The following instructions will walk you through all of these prerequisites.

## Install the Azure CLI

Azure Red Hat OpenShift requires version 2.0.65 or higher of the Azure CLI. If you've already installed the Azure CLI, you can check which version you have by running:

```bash
az --version
```

The first line of output will have the CLI version, for example `azure-cli (2.0.65)`.

Here are instructions for [installing the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) if you require a new installation or an upgrade.

Alternately, you can use the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). When using the Azure Cloud Shell, be sure to select the **Bash** environment if you plan to follow along with the [Create and manage an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial series.

## Register providers and features

The `Microsoft.ContainerService AROGA` feature, `Microsoft.Solutions`, `Microsoft.Compute`, `Microsoft.Storage`, `Microsoft.KeyVault` and `Microsoft.Network` providers must be registered to your subscription manually before deploying your first Azure Red Hat OpenShift cluster.

To register these providers and features manually, use the following instructions from a Bash shell if you've installed the CLI, or from the Azure Cloud Shell (Bash) session in your Azure portal:

1. If you have multiple Azure subscriptions, specify the relevant subscription ID:

    ```bash
    az account set --subscription <SUBSCRIPTION ID>
    ```

1. Register the Microsoft.ContainerService AROGA feature:

    ```bash
    az feature register --namespace Microsoft.ContainerService -n AROGA
    ```

1. Register the Microsoft.Storage provider:

    ```bash
    az provider register -n Microsoft.Storage --wait
    ```
    
1. Register the Microsoft.Compute provider:

    ```bash
    az provider register -n Microsoft.Compute --wait
    ```

1. Register the Microsoft.Solutions provider:

    ```bash
    az provider register -n Microsoft.Solutions --wait
    ```

1. Register the Microsoft.Network provider:

    ```bash
    az provider register -n Microsoft.Network --wait
    ```

1. Register the Microsoft.KeyVault provider:

    ```bash
    az provider register -n Microsoft.KeyVault --wait
    ```

1. Refresh the registration of the Microsoft.ContainerService resource provider:

    ```bash
    az provider register -n Microsoft.ContainerService --wait
    ```

## Create an Azure Active Directory (Azure AD) tenant

The Azure Red Hat OpenShift service requires an associated Azure Active Directory (Azure AD) tenant that represents your organization and its relationship to Microsoft. Your Azure AD tenant enables you to register, build, and manage apps, as well as use other Azure services.

If you don't have an Azure AD to use as the tenant for your Azure Red Hat OpenShift cluster, or you wish to create a tenant for testing, follow the instructions in [Create an Azure AD tenant for your Azure Red Hat OpenShift cluster](howto-create-tenant.md) before continuing with this guide.

## Create an Azure AD user, security group and application object

Azure Red Hat OpenShift requires permissions to perform tasks on your cluster, such as configuring storage. These permissions are represented through a [service principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object). You'll also want to create a new Active Directory user for testing apps running on your Azure Red Hat OpenShift cluster.

Follow the instructions in [Create an Azure AD app object and user](howto-aad-app-configuration.md) to create a service principal, generate a client secret and authentication callback URL for your app, and create a new Azure AD security group and user to access the cluster.

## Next steps

You're now ready to use Azure Red Hat OpenShift!

Try the tutorial:
> [!div class="nextstepaction"]
> [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md)

[azure-cli-install]: https://docs.microsoft.com/cli/azure/install-azure-cli
