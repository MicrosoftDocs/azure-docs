---
title: Tutorial - Deploy vSphere Cluster in Azure
description: Learn to deploy a vSphere Cluster in Azure using Azure VMWare Solution
ms.topic: tutorial
ms.date: 09/21/2020
---

# Tutorial: Deploy an Azure VMware Solution private cloud in Azure

Azure VMware Solution gives you the ability to deploy a vSphere cluster in Azure. The minimum initial deployment is three hosts. Additional hosts can be added one at a time, up to a maximum of 16 hosts per cluster. 

Because Azure VMware Solution doesn't allow you to manage your private cloud with your on-premises vCenter at launch, additional configuration is needed. These procedures and related prerequisites are covered in this tutorial.

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

[!INCLUDE [create-avs-private-cloud-azure-portal](includes/create-private-cloud-azure-portal-steps.md)]

### Azure CLI

Instead of the Azure portal to create an Azure VMware Solution private cloud, you can use the Azure CLI using the Azure Cloud Shell.  For a list of commands you can use with Azure VMware Solution, see [azure vmware commands](/cli/azure/ext/vmware/vmware).

#### Open Azure Cloud Shell

Select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

#### Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive

az group create --name myResourceGroup --location eastus
```

#### Create a private cloud

Provide a name for the resource group and the private cloud, a location, and the size of the cluster.

| Property  | Description  |
| --------- | ------------ |
| **-g** (Resource Group name)     | The name of the resource group for your private cloud resources.        |
| **-n** (Private Cloud name)     | The name of your Azure VMware Solution private cloud.        |
| **--location**     | The location used for your private cloud.         |
| **--cluster-size**     | The size of the cluster. The minimum value is 3.         |
| **--network-block**     | The CIDR IP address network block to use for your private cloud. The address block shouldn't overlap with address blocks used in other virtual networks that are in your subscription and on-premises networks.        |
| **--sku** | The SKU value: AV36 |

```azurecli-interactive
az vmware private-cloud create -g myResourceGroup -n myPrivateCloudName --location eastus --cluster-size 3 --network-block xx.xx.xx.xx/22 --sku AV36
```

## Delete an Azure VMware Solution private cloud

If you have an Azure VMware Solution private cloud that you no longer need, you can delete it. An Azure VMware Solution private cloud includes an isolated network domain, one or more vSphere clusters provisioned on dedicated server nodes, and typically many virtual machines. When a private cloud is deleted, all of the virtual machines, their data, and clusters are deleted. The dedicated bare-metal nodes are securely wiped and returned to the free pool. The network domain provisioned for the customer is deleted.  

> [!CAUTION]
> Deleting the private cloud is an irreversible operation. Once the private cloud is deleted, the data cannot be recovered, as it terminates all running workloads and components and destroys all private cloud data and configuration settings, including public IP addresses.

### Prerequisites

Once a private cloud is deleted, there is no way to recover the virtual machines and their data. If the virtual machine data will be required later, the admin must first back up all of the data before deleting the private cloud.

### Steps to delete an Azure VMware Solution private cloud

1. Access the Azure VMware Solutions page in the Azure portal.

2. Select the private cloud to be deleted.
 
3. Enter the name of the private cloud and select **Yes**. In a few hours the deletion process will complete.  

## Azure VMware commands

For a list of commands you can use with Azure VMware Solution, see [azure vmware commands](/cli/azure/ext/vmware/vmware).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an Azure VMware Solution private cloud
> * Verify the private cloud deployed
> * Delete an Azure VMware Solution private cloud

Continue to the next tutorial to learn how to create a jump box. You use the jump box to connect to your environment so that you can manage your private cloud locally.


> [!div class="nextstepaction"]
> [Access an Azure VMware Solution private cloud](tutorial-access-private-cloud.md)