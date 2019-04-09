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

This tutorial is part one of a series. You'll learn how to create a Microsoft Red Hat OpenShift cluster on Azure using the Azure CLI, scale it, and clean up unused Azure resources so that you are not charged for what you aren't using.

In part one of the series, you learn how to:

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

If you're running the Azure CLI locally, run `az login` to sign in to Azure.

```bash
az login
```

If you have access to multiple subscriptions, run `az account set -s
SUBSCRIPTION_ID` to default to the correct subscription.

## Step 2: Create an Azure Red Hat OpenShift cluster

Open a Bash command window and set the following variables:

> [!IMPORTANT]
> The name of your cluster must be all lowercase or cluster creation will fail.

```BASH
CLUSTER_NAME=<the name of your cluster - lowercase only>
```

 Use the same name for the cluster that you chose in step 6 of [Create new app registration](howto-aad-app-configuration.md#create-a-new-app-registration).

```BASH
LOCATION=<location>
```

Choose a location to create your cluster, for example:
`LOCATION=eastus`

For a list of azure regions that supports OpenShift on Azure, see [Supported Regions](supported-resources.md#azure-regions).

All being well, after 10-15 minutes `az openshift create` will complete
successfully and return a JSON document containing your cluster details.

Set `FQDN` to the fully qualified name of your cluster. This name is composed of the cluster name, the location, with `.cloudapp.azure.com` appended to the end.  For example:  

```BASH
FQDN=$CLUSTER_NAME.$LOCATION.cloudapp.azure.com
```

Set  `APPID` to the value you saved in step 1 of [Create a client secret](howto-aad-app-configuration.md#create-a-client-secret).  
```BASH
APPID=<app ID value>
```

Set `SECRET` to the value you saved in step 7 of [Create a client secret](howto-aad-app-configuration.md#create-a-client-secret).  
```BASH
SECRET=<secret value>
```

Set `TENANT` to the value you provided in step 7 of [Create a new tenant](howto-create-tenant.md#create-a-new-tenant)  
```BASH
TENANT=<tenant id>
```

Create the resource group for the cluster. Run the following command from the Bash shell that you used to define the variables above:

```BASH
az group create --name $CLUSTER_NAME --location $LOCATION
```

Now create the cluster:

```BASH
az openshift create --resource-group $CLUSTER_NAME --name $CLUSTER_NAME -l $LOCATION --fqdn $FQDN --aad-client-app-id $APPID --aad-client-app-secret $SECRET --aad-tenant-id $TENANT
```

## Step 3: Test your cluster

To test your cluster, you need to use a fresh browser instance. Use a browser instance that hasn't cached the identity that you use to sign in to the Azure portal because you need to sign in as the new user you created earlier.

1. Open an incognito window (Chrome) or a InPrivate windows (Microsoft Edge)
2. Navigate to the sign-on URL that you created in step 6 of [Create new app registration](howto-aad-app-configuration.md#create-a-new-app-registration). For example, https://mycluster.eastus.cloudapp.azure.com

> [!NOTE]
> Currently the OpenShift console certificate is untrusted, therefore
> when navigating to the console, you will need to manually accept the
> untrusted certificate in your browser.

You'll get message that the site isn't secure. Click **Details** > **Go on to the webpage**

Sign in with the user and password that you created in [Create a new Active Directory user](howto-aad-app-configuration.md#create-a-new-active-directory-user)
When the **Permissions requested** dialog appears, select **Consent on behalf of your organization** and then **Accept**.

You should now be logged into the cluster console.

[Screenshot of the OpenShift cluster console](./media/aro-console.png)

You now have an Azure Red Hat OpenShift cluster in your tenant.

## Step 4: Try the oc CLI

In the cluster console, click the question mark in the upper right corner and select `Command Line Tools`.  Follow the `Latest Release` link to download and install the supported oc CLI for Linux, MacOS, or Windows.  If you can't sign in to the Red Hat portal, the oc CLI is also available [here](https://www.okd.io/download.html).

> [!NOTE]
> If you do not see the question mark icon in the upper right corner,
> select Service Catalog or Application Console from the upper left hand drop-down.

The same page also has a command of the form `oc login https://myuniqueclustername.eastus.cloudapp.azure.com --token=<hidden>`.  Click the copy to clipboard button to copy this command.  Paste it in your terminal to sign in to the cluster using the oc CLI.  

Alternatively your token is available here: `https://myuniqueclustername.eastus.cloudapp.azure.com/oauth/token/request`

## Next steps

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Create an Azure Red Hat OpenShift cluster

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Scale an Azure Red Hat OpenShift cluster](tutorial-scale-cluster.md)