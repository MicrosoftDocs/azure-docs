---
title: "Quickstart: Create an Azure VMWare Solution (AVS) private cloud (preview) using the Azure CLI"
description: This quickstart walks you through deploying an Azure VMWare Solution private cloud in Azure
author: dikamath
ms.author: dikamath
ms.service: azure-vmware
ms.topic: quickstart 
ms.date: 04/07/2020
---

# Quickstart: Create an Azure VMWare Solution (AVS) private cloud with the Azure CLI

This QuickStart shows you how to use the Azure CLI to create a Private cloud in Azure that consists of initial 3 nodes vSphere clusters & NSX-T installed.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Appropriate administrative rights & permission to create a private cloud.

## Open Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to https://shell.azure.com/bash. Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

## Register the resource provider

In order to use the Azure VMWare Solution you must first register the resource provider. The following example registers the resource provider with your subscription.

```azurecli-interactive
az extension add --name vmware
```

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a private cloud

To create an AVS private cloud you must provide a resource group name, a name for the private cloud, a location, the size of the cluster


|Property  |Description  |
|---------|---------|
|Resource Group name     | The name of the resource group you are deploying the private cloud to.        |
|Private Cloud name     | The name for the private cloud.        |
|Location     | The location that is used for the private cloud         |
|Cluster size     | The size of the cluster. The minimum value is 3.         |
|Network block     | The CIDR range to use for the private cloud. It is recommended that it be unique from your on premises environment as well as your Azure environment.        |

```azurecli-interactive
az vmware private-cloud create -g myResourceGroup -n myPrivateCloudName --location eastus --cluster-size 3 --network-block xx.xx.xx.xx/22
```


## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, VM, and all related resources:

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you created an AVS private cloud. To learn more about an AVS private cloud and to configure it, continue to the tutorial for configuring networking.

> [!div class="nextstepaction"]
> [Configure networking for your private cloud](./tutorial-configure-networking.md)