---
title: Tutorial - Create an Azure Red Hat OpenShift 4 cluster
description: Learn how to create a Microsoft Azure Red Hat OpenShift cluster using the Azure CLI
author: sakthi-vetrivel
ms.author: suvetriv
ms.topic: tutorial
ms.service: container-service
ms.date: 04/24/2020
#Customer intent: As a developer, I want learn how to create an Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Tutorial: Create an Azure Red Hat OpenShift 4 cluster

In this tutorial, part one of three, you'll prepare your environment to create an Azure Red Hat OpenShift cluster running OpenShift 4, and create a cluster. You will learn how to:
> [!div class="checklist"]
> * Setup the prerequisites and create the required virtual network and subnets
> * Deploy a cluster

## Before you begin

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.75 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

### Verify your permissions

To create an Azure Red Hat OpenShift cluster, verify the following permissions on your Azure account and user:

|Permissions|Resource Group which contains the VNet|User executing `az aro create`|Service Principal passed as `–client-id`|
|----|:----:|:----:|:----:|
|**User Access Administrator**|X|X| |
|**Contributor**|X|X|X|

### Install the `az aro` extension
The `az aro` extension allows you to create, access, and delete Azure Red Hat OpenShift clusters directly from the command line using the Azure CLI.

Run the following command to install the `az aro` extension.

```azurecli-interactive
az extension add -n aro --index https://az.aroapp.io/stable
```

If you already have the extension installed, you can update by running the following command.

```azurecli-interactive
az extension update -n aro --index https://az.aroapp.io/stable
```

### Register the resource provider

Next, you need to register the `Microsoft.RedHatOpenShift` resource provider in your subscription.

```azurecli-interactive
az provider register -n Microsoft.RedHatOpenShift --wait
```

Verify the extension is registered.

```azurecli-interactive
az -v
```

  You should get an output similar to the below.

```output
...
Extensions:
aro                                1.0.0
...
```

### Get a Red Hat pull secret (optional)

A Red Hat pull secret enables your cluster to access Red Hat container registries along with additional content. This step is optional but recommended.

1. **[Navigate to your Red Hat OpenShift cluster manager portal](https://cloud.redhat.com/openshift/install/azure/aro-provisioned) and log in.**

   You will need to log in to your Red Hat account or create a new Red Hat account with your business email and accept the terms and conditions.

2. **Click Download pull secret.**

Keep the saved `pull-secret.txt` file somewhere safe - it will be used in each cluster creation.

When running the `az aro create` command, you can reference your pull secret using the `--pull-secret @pull-secret.txt` parameter. Execute `az aro create` from the directory where you stored your `pull-secret.txt` file. Otherwise, replace `@pull-secret.txt` with `@<path-to-my-pull-secret-file>`.

If you are copying your pull secret or referencing it in other scripts, your pull secret should be formatted as a valid JSON string.

### Create a virtual network containing two empty subnets

Next, you will create a virtual network containing two empty subnets.

1. **Set the following variables.**

   ```console
   LOCATION=eastus                 # the location of your cluster
   RESOURCEGROUP=aro-rg            # the name of the resource group where you want to create your cluster
   CLUSTER=cluster                 # the name of your cluster
   ```

1. **Create a resource group**

    An Azure resource group is a logical group in which Azure resources are deployed and managed. When you create a resource group, you are asked to specify a location. This location is where resource group metadata is stored, it is also where your resources run in Azure if you don't specify another region during resource creation. Create a resource group using the [az group create][az-group-create] command.

    ```azurecli-interactive
    az group create --name $RESOURCEGROUP --location $LOCATION
    ```

    The following example output shows the resource group created successfully:

    ```json
    {
    "id": "/subscriptions/<guid>/resourceGroups/aro-rg",
    "location": "eastus",
    "managedBy": null,
    "name": "aro-rg",
    "properties": {
        "provisioningState": "Succeeded"
    },
    "tags": null
    }
    ```

2. **Create a virtual network.**

    Azure Red Hat OpenShift clusters running OpenShift 4 require a virtual network with two empty subnets, for the master and worker nodes.

    Create a new virtual network in the same resource group you created earlier.

    ```azurecli-interactive
    az network vnet create \
    --resource-group $RESOURCEGROUP \
    --name aro-vnet \
    --address-prefixes 10.0.0.0/22
    ```

    The following example output shows the virtual network created successfully:

    ```json
    {
    "newVNet": {
        "addressSpace": {
        "addressPrefixes": [
            "10.0.0.0/22"
        ]
        },
        "id": "/subscriptions/<guid>/resourceGroups/aro-rg/providers/Microsoft.Network/virtualNetworks/aro-vnet",
        "location": "eastus",
        "name": "aro-vnet",
        "provisioningState": "Succeeded",
        "resourceGroup": "aro-rg",
        "type": "Microsoft.Network/virtualNetworks"
    }
    }
    ```

3. **Add an empty subnet for the master nodes.**

    ```azurecli-interactive
    az network vnet subnet create \
    --resource-group $RESOURCEGROUP \
    --vnet-name aro-vnet \
    --name master-subnet \
    --address-prefixes 10.0.0.0/23 \
    --service-endpoints Microsoft.ContainerRegistry
    ```

4. **Add an empty subnet for the worker nodes.**

    ```azurecli-interactive
    az network vnet subnet create \
    --resource-group $RESOURCEGROUP \
    --vnet-name aro-vnet \
    --name worker-subnet \
    --address-prefixes 10.0.2.0/23 \
    --service-endpoints Microsoft.ContainerRegistry
    ```

5. **[Disable subnet private endpoint policies](https://docs.microsoft.com/azure/private-link/disable-private-link-service-network-policy) on the master subnet.** This is required to be able to connect and manage the cluster.

    ```azurecli-interactive
    az network vnet subnet update \
    --name master-subnet \
    --resource-group $RESOURCEGROUP \
    --vnet-name aro-vnet \
    --disable-private-link-service-network-policies true
    ```

## Create the cluster

Run the following command to create a cluster. Optionally, you can [pass your Red Hat pull secret](#get-a-red-hat-pull-secret-optional) which enables your cluster to access Red Hat container registries along with additional content.

>[!NOTE]
> If you are copy/pasting commands and using one of the optional parameters, be sure delete the initial hashtags and the trailing comment text. As well, close the argument on the preceding line of the command with a trailing backslash.

```azurecli-interactive
az aro create \
  --resource-group $RESOURCEGROUP \
  --name $CLUSTER \
  --vnet aro-vnet \
  --master-subnet master-subnet \
  --worker-subnet worker-subnet
  # --domain foo.example.com # [OPTIONAL] custom domain
  # --pull-secret @pull-secret.txt # [OPTIONAL]
```

After executing the `az aro create` command, it normally takes about 35 minutes to create a cluster.

>[!IMPORTANT]
> If you choose to specify a custom domain, for example **foo.example.com**, the OpenShift console will be available at a URL such as `https://console-openshift-console.apps.foo.example.com`, instead of the built-in domain `https://console-openshift-console.apps.<random>.<location>.aroapp.io`.
>
> By default, OpenShift uses self-signed certificates for all of the routes created on `*.apps.<random>.<location>.aroapp.io`.  If you choose to use custom DNS after connecting to the cluster, you will need to follow the OpenShift documentation to [configure a custom CA for your ingress controller](https://docs.openshift.com/container-platform/4.3/authentication/certificates/replacing-default-ingress-certificate.html) and a [custom CA for your API server](https://docs.openshift.com/container-platform/4.3/authentication/certificates/api-server.html).
>

## Next steps

In this part of the tutorial, you learned how to:
> [!div class="checklist"]
> * Setup the prerequisites and create the required virtual network and subnets
> * Deploy a cluster

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Connect to an Azure Red Hat OpenShift cluster](tutorial-connect-cluster.md)
