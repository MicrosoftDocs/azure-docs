---
title: Tutorial - Deploy vSphere Cluster in Azure
description: Learn to deploy a vSphere Cluster in Azure using Azure VMWare Solution
ms.topic: tutorial
ms.date: 09/07/2020
---

# Tutorial: Deploy an Azure VMware Solution private cloud in Azure

Azure VMware Solution gives you the ability to deploy a vSphere cluster in Azure. The minimum initial deployment is three hosts. Additional hosts can be added one at a time, up to a maximum of 16 hosts per cluster. 

Because Azure VMware Solution doesn't allow you to manage your private cloud with your on-premises vCenter at launch, additional configuration of and connection to a local vCenter instance, virtual network, and more is needed. These procedures and related prerequisites are covered in this tutorial.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure VMware Solution private cloud
> * Verify the private cloud deployed

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Appropriate administrative rights and permission to create a private cloud.
- Ensure you have the appropriate networking configured as described in [Tutorial: Network checklist](tutorial-network-checklist.md).

## Register the resource provider

[!INCLUDE [register-resource-provider-steps](includes/register-resource-provider-steps.md)]


## Create a Private Cloud

You can create an Azure VMware Solution private cloud by using the [Azure portal](#azure-portal) or by using the [Azure CLI](#azure-cli).

### Azure portal

[!INCLUDE [create-avs-private-cloud-azure-portal](includes/create-avs-private-cloud-azure-portal-steps.md)]

### Azure CLI

Instead of the Azure portal to create an Azure VMware Solution private cloud, you can use the Azure CLI using the Azure Cloud Shell. It's a free interactive shell with common Azure tools preinstalled and configured to use with your account. 

#### Open Azure Cloud Shell

To open the Cloud Shell, select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

#### Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```
azurecli-interactive
az group create --name myResourceGroup --location eastus
```

#### Create a private cloud

Provide a resource group name, a name for the private cloud, a location, the size of the cluster.

| Property  | Description  |
| --------- | ------------ |
| **-g** (Resource Group name)     | The name of the resource group for your private cloud resources.        |
| **-n** (Private Cloud name)     | The name of your Azure VMware Solution private cloud.        |
| **--location**     | The location used for your private cloud.         |
| **--cluster-size**     | The size of the cluster. The minimum value is 3.         |
| **--network-block**     | The CIDR IP address network block to use for your private cloud. The address block shouldn't overlap with address blocks used in other virtual networks that are in your subscription and on-premises networks.        |
| **--sku** | The SKU value: AV36 |

```
azurecli-interactive
az vmware private-cloud create -g myResourceGroup -n myPrivateCloudName --location eastus --cluster-size 3 --network-block xx.xx.xx.xx/22 --sku AV36
```

## Delete a private cloud (Azure portal)

If you have an Azure VMware Solution private cloud that you no longer need, you can delete it. When you delete a private cloud, all clusters, along with all their components, are deleted.

To do so, navigate to your private cloud in the Azure portal, and select **Delete**. On the confirmation page, confirm with the name of the private cloud and select **Yes**.

> [!CAUTION]
> Deleting the private cloud is an irreversible operation. Once the private cloud is deleted, the data cannot be recovered as it terminates all running workloads, components and destroys all private cloud data and configuration settings, including public IP addresses. 

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an Azure VMware Solution private cloud
> * Verified the Private Cloud deployed

Continue to the next tutorial to learn how to create a virtual network for use with your private cloud as part of setting up local management for your private cloud clusters.

> [!div class="nextstepaction"]
> [Create a Virtual Network](tutorial-configure-networking.md)
