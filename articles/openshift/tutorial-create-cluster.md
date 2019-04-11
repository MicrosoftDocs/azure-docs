---
title: Tutorial - Create a Red Hat OpenShift cluster on Azure
description: In this tutorial, quickly learn to create a Microsoft Azure Red Hat OpenShift cluster using the Azure CLI
services: container-service
author: TylerMSFT
ms.author: twhitney
manager: jeconnoc
ms.topic: tutorial
ms.service: openshift
ms.date: 05/06/2019
#Customer intent: As a developer, I want learn how to create a Microsoft Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Tutorial: Create a Microsoft Red Hat OpenShift cluster on Azure

This tutorial is part one of a series. You'll learn how to create a Microsoft Red Hat OpenShift cluster on Azure using the Azure CLI, scale it, and clean up unused Azure resources.

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

Whether you are running the Azure CLI locally, or are using the Azure cloud shell, if you have access to multiple subscriptions, run `az account set -s {subscription ID}` replacing `{subscription ID}` with the subscription you want to use.

## Step 2: Create an Azure Red Hat OpenShift cluster

In your Bash command window, set the following variables:

> [!IMPORTANT]
> The name of your cluster must be all lowercase or cluster creation will fail.

```BASH
CLUSTER_NAME=<the name of your cluster - lowercase only>
```

 Use the same name for the cluster that you chose in step 6 of [Create new app registration](howto-aad-app-configuration.md#create-a-new-app-registration).

```BASH
LOCATION=<location>
```

Choose a location to create your cluster. For a list of azure regions that supports OpenShift on Azure, see [Supported Regions](supported-resources.md#azure-regions). For example:

```BASH
LOCATION=eastus
```

Set `FQDN` to the fully qualified name of your cluster. This name is composed of the cluster name, the location, and `.cloudapp.azure.com` appended to the end. This is the same as the Sign-On URL you created in step 6 of [Create new app registration](howto-aad-app-configuration.md#create-a-new-app-registration). For example:  

```BASH
FQDN=$CLUSTER_NAME.$LOCATION.cloudapp.azure.com
```

Set  `APPID` to the value you saved in step 9 of [Create a new app registration](howto-aad-app-configuration.md#create-a-new-app-registration).  
```BASH
APPID=<app ID value>
```

Set `SECRET` to the value you saved in step 6 of [Create a client secret](howto-aad-app-configuration.md#create-a-client-secret).  
```BASH
SECRET=<secret value>
```

Set `TENANT` to the tenant id value you saved in step 7 of [Create a new tenant](howto-create-tenant.md#create-a-new-tenant)  
```BASH
TENANT=<tenant id>
```

Create the resource group for the cluster. Run the following command from the Bash shell that you used to define the variables above:

```BASH
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
 
Now create the cluster.

 If you are not connecting the virtual network of the cluster to an existing virtual network, omit the trailing `--vnet-peer-id $VNET_ID` parameter in the following example.

```BASH
az openshift create --resource-group $CLUSTER_NAME --name $CLUSTER_NAME -l $LOCATION --fqdn $FQDN --aad-client-app-id $APPID --aad-client-app-secret $SECRET --aad-tenant-id $TENANT --vnet-peer-id $VNET_ID
```

After 10-15 minutes `az openshift create` will complete
successfully and return a JSON document containing your cluster details.

If you get an error that the host name is not available, it may be because your cluster name is not unique. Redo the steps in [Create an Azure AD app object and user](howto-add-app-configuration.md) (except for the last step of creating a new user) and use a unique cluster name. The FQDN needs to be unique and the part of the FQDN that you have the most control over is the cluster name.

## Step 3: Sign on to the cluster console

To sign on to the cluster console for your newly created cluster, you need to use a fresh browser instance. Use a browser instance that hasn't cached the identity that you use to sign in to the Azure portal because you need to sign in as the new user you created in [Create a new Active Directory user](howto-aad-app-configuration.md#create-a-new-active-directory-user).

1. Open an incognito window (Chrome) or a InPrivate windows (Microsoft Edge) so that you have a fresh browser instance that doesn't have cached identity info.
2. Navigate to the sign-on URL that you created in step 6 of [Create new app registration](howto-aad-app-configuration.md#create-a-new-app-registration). For example, https://mycluster.eastus.cloudapp.azure.com

> [!NOTE]
> Currently the OpenShift console certificate is untrusted, therefore
> whe you navigate to the console, you will need to manually accept the
> untrusted certificate in your browser.

You'll get message that the site isn't secure. Click **Advanced** (in Chrome) or **Details** (in Edge) > **Go on to the webpage**

Sign in with the user and password that you created in [Create a new Active Directory user](howto-aad-app-configuration.md#create-a-new-active-directory-user)
When the **Permissions requested** dialog appears, select **Consent on behalf of your organization** and then **Accept**.

You should now be logged into the cluster console.

[Screenshot of the OpenShift cluster console](./media/aro-console.png)

You have created an Azure Red Hat OpenShift cluster in your tenant.

## Step 4: Install the oc CLI tools

In the cluster console, click the question mark in the upper right corner by your sign-in name and select `Command Line Tools`.  Follow the `Latest Release` link to download and install the supported oc CLI for Linux, MacOS, or Windows.  If you can't sign in to the Red Hat portal, you can download the oc CLI [here](https://www.okd.io/download.html).

> [!NOTE]
> If you do not see the question mark icon in the upper right corner, select Service Catalog or Application Console from the upper left-hand drop-down.

The **Command Line Tools** has a command of the form `oc login https://<your cluster name>.eastus.cloudapp.azure.com --token=<hidden>`.  Click the copy to clipboard button to copy this command.  In a terminal window, set your path to include where you installed the oc tools. Then sign in to the cluster using the oc CLI command you just copied.  For example: 

```bash
oc login https://yourclustername.eastus.cloudapp.azure.com --token=<your token value>
```

If you weren't able to get the token value using the steps above, you can get the token value to use here: `https://<your cluster name>.<your cluster location>.cloudapp.azure.com/oauth/token/request`, for example: `https://yourclustername.eastus.cloudapp.azure.com/oauth/token/request`

## Next steps

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Create an Azure Red Hat OpenShift cluster

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Scale an Azure Red Hat OpenShift cluster](tutorial-scale-cluster.md)