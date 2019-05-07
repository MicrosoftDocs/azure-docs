---
title: Tutorial - Create an Azure Red Hat OpenShift cluster | Microsoft Docs
description: Learn how to create a Microsoft Azure Red Hat OpenShift cluster using the Azure CLI
services: container-service
author: TylerMSFT
ms.author: twhitney
manager: jeconnoc
ms.topic: tutorial
ms.service: openshift
ms.date: 05/06/2019
#Customer intent: As a developer, I want learn how to create an Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Tutorial: Create an Azure Red Hat OpenShift cluster

This tutorial is part one of a series. You'll learn how to create a Microsoft Azure Red Hat OpenShift cluster using the Azure CLI, scale it, then delete it to clean up resources.

In part one of the series, you'll learn how to:

> [!div class="checklist"]
> * Create an Azure Red Hat OpenShift cluster

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Create an Azure Red Hat OpenShift cluster
> * [Scale an Azure Red Hat OpenShift cluster](tutorial-scale-cluster.md)
> * [Delete an Azure Red Hat OpenShift cluster](tutorial-delete-cluster.md)

## Prerequisites

Before you begin this tutorial:

Make sure that you've [set up your development environment](howto-setup-environment.md), which includes:
- Installing the latest CLI
- Creating a tenant
- Creating an Azure Application object
- Creating an Active Directory user used to sign in to apps running on the cluster.

## Step 1: Sign in to Azure

If you're running the Azure CLI locally, open a Bash command shell and  run `az login` to sign in to Azure.

```bash
az login
```

 If you have access to multiple subscriptions, run `az account set -s {subscription ID}` replacing `{subscription ID}` with the subscription you want to use.

## Step 2: Create an Azure Red Hat OpenShift cluster

In your Bash command window, set the following variables:

> [!IMPORTANT]
> The name of your cluster must be all lowercase or cluster creation will fail.

```bash
CLUSTER_NAME=<cluster name in lowercase>
```

 Use the same name for the cluster that you chose in step 6 of [Create new app registration](howto-aad-app-configuration.md#create-a-new-app-registration).

```bash
LOCATION=<location>
```

Choose a location to create your cluster. For a list of azure regions that supports OpenShift on Azure, see [Supported Regions](supported-resources.md#azure-regions). For example: `LOCATION=eastus`.

Set `FQDN` to the fully qualified name of your cluster. This name is composed of the cluster name, the location, and `.cloudapp.azure.com` appended to the end. This is the same as the Sign-On URL you created in step 6 of [Create new app registration](howto-aad-app-configuration.md#create-a-new-app-registration). For example:  

```bash
FQDN=$CLUSTER_NAME.$LOCATION.cloudapp.azure.com
```

Set  `APPID` to the value you saved in step 9 of [Create a new app registration](howto-aad-app-configuration.md#create-a-new-app-registration).  

```bash
APPID=<app ID value>
```

Set `SECRET` to the value you saved in step 6 of [Create a client secret](howto-aad-app-configuration.md#create-a-client-secret).  

```bash
SECRET=<secret value>
```

Set `TENANT` to the tenant ID value you saved in step 7 of [Create a new tenant](howto-create-tenant.md#create-a-new-azure-ad-tenant)  

```bash
TENANT=<tenant ID>
```

Create the resource group for the cluster. Run the following command from the Bash shell that you used to define the variables above:

```bash
az group create --name $CLUSTER_NAME --location $LOCATION
```

### Optional: Connect the cluster's virtual network to an existing virtual network

If you don't need to connect the virtual network (VNET) of the cluster you create to an existing VNET, skip this step.

First, get the identifier of the existing VNET. The identifier will be of the form:
`/subscriptions/{subscription id}/resourceGroups/{resource group of VNET}/providers/Microsoft.Network/virtualNetworks/{VNET name}`.

If you don't know the network name or the resource group the existing VNET belongs to, go to the [Virtual networks blade](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Network%2FvirtualNetworks) and click on your virtual network. The Virtual network page appears and will list the name of the network and the resource group it belongs to.

Define a VNET_ID variable using the following CLI command in a BASH shell:

```bash
VNET_ID=$(az network vnet show -n {VNET name} -g {VNET resource group} --query id -o tsv)
```

For example: `VNET_ID=$(az network vnet show -n MyVirtualNetwork -g MyResourceGroup --query id -o tsv`

### Create the cluster

You're now ready to create a cluster.

 If you are not connecting the virtual network of the cluster to an existing virtual network, omit the trailing `--vnet-peer-id $VNET_ID` parameter in the following example.

```bash
az openshift create --resource-group $CLUSTER_NAME --name $CLUSTER_NAME -l $LOCATION --fqdn $FQDN --aad-client-app-id $APPID --aad-client-app-secret $SECRET --aad-tenant-id $TENANT --vnet-peer-id $VNET_ID
```

After a few minutes, `az openshift create` will complete successfully and return a JSON response containing your cluster details.

> [!NOTE]
> If you get an error that the host name is not available, it may be because your
> cluster name is not unique. Try deleting your original app registration and
> redoing the steps in [Create a new app registration]
> (howto-aad-app-configuration.md#create-a-new-app-registration) (omitting the final
> step of creating a new user, since you already created one) with a different
> cluster name.

## Step 3: Sign in to the OpenShift console

You're now ready to to sign in to the OpenShift console for your new cluster. The [OpenShift Web Console](https://docs.openshift.com/dedicated/architecture/infrastructure_components/web_console.html) enables you to visualize, browse, and manage the contents of your OpenShift projects.

We'll sign in as the [new Azure AD user](howto-aad-app-configuration.md#create-a-new-active-directory-user) you created for testing. To do this, you'll need a fresh browser instance that hasn't cached the identity you normally use to sign in to the Azure portal.

1. Open an *incognito* window (Chrome) or *InPrivate* window (Microsoft Edge).
2. Navigate to the sign-on URL that you created in step 6 of [Create a new app registration](howto-aad-app-configuration.md#create-a-new-app-registration). For example, https://constoso.eastus.cloudapp.azure.com

> [!NOTE]
> The OpenShift console uses a self-signed certificate.
> When prompted in your browser, bypass the warning and accept
> the "untrusted" certificate.

Sign in with the user and password that you created in [Create a new Active Directory user](howto-aad-app-configuration.md#create-a-new-active-directory-user)
When the **Permissions requested** dialog appears, select **Consent on behalf of your organization** and then **Accept**.

You are now logged into the cluster console.

[Screenshot of the OpenShift cluster console](./media/aro-console.png)

 You can learn more about [using the OpenShift console](https://docs.openshift.com/dedicated/getting_started/developers_console.html) to create and built images in the [Red Hat OpenShift](https://docs.openshift.com/dedicated/welcome/index.html) documentation.

## Step 4: Install the OpenShift CLI

The [OpenShift CLI](https://docs.openshift.com/dedicated/cli_reference/get_started_cli.html) (or *OC Tools*) provide commands for managing your applications and lower-level utilities for interacting with the various components of your OpenShift cluster.

In the OpenShift console, click the question mark in the upper right corner by your sign-in name and select **Command Line Tools**.  Follow the **Latest Release** link to download and install the supported oc CLI for Linux, MacOS, or Windows.

> [!NOTE]
> If you do not see the question mark icon in the upper right corner, select *Service Catalog* or *Application Console* from the upper left-hand drop-down.
>
> Alternately, you can [download the oc CLI](https://www.okd.io/download.html) directly.

The **Command Line Tools** page provides a command of the form `oc login https://<your cluster name>.<azure region>.cloudapp.azure.com --token=<token value>`.  Click the *Copy to clipboard* button to copy this command.  In a terminal window, [set your path](https://docs.okd.io/latest/cli_reference/get_started_cli.html#installing-the-cli) to include your local installation of the oc tools. Then sign in to the cluster using the oc CLI command you copied.

If you couldn't get the token value using the steps above, get the token value from: `https://<your cluster name>.<azure region>.cloudapp.azure.com/oauth/token/request`.

## Next steps

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Create an Azure Red Hat OpenShift cluster

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Scale an Azure Red Hat OpenShift cluster](tutorial-scale-cluster.md)