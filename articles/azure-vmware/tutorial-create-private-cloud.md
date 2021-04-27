---
title: Tutorial - Deploy an Azure VMware Solution private cloud
description: Learn how to create and deploy an Azure VMware Solution private cloud
ms.topic: tutorial
ms.date: 02/22/2021
---

# Tutorial: Deploy an Azure VMware Solution private cloud

Azure VMware Solution gives you the ability to deploy a vSphere cluster in Azure. The minimum initial deployment is three hosts. Additional hosts can be added one at a time, up to a maximum of 16 hosts per cluster.

Because Azure VMware Solution doesn't allow you to manage your private cloud with your on-premises vCenter at launch, additional configuration is needed. These procedures and related prerequisites are covered in this tutorial.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create an Azure VMware Solution private cloud
> * Verify the private cloud deployed

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Appropriate administrative rights and permission to create a private cloud. You must be at minimum contributor level in the subscription.
- Follow the information you gathered in the [planning](production-ready-deployment-steps.md) article to deploy Azure VMware Solution.
- Ensure you have the appropriate networking configured as described in [Tutorial: Network checklist](tutorial-network-checklist.md).
- Hosts have been provisioned and the Microsoft.AVS resource provider registered as described in [Request hosts and enable the Microsoft.AVS resource provider](enable-azure-vmware-solution.md).

## Create a private cloud

You can create an Azure VMware Solution private cloud by using the [Azure portal](#azure-portal) or by using the [Azure CLI](#azure-cli).

### Azure portal

[!INCLUDE [create-avs-private-cloud-azure-portal](includes/create-private-cloud-azure-portal-steps.md)]

### Azure CLI

Instead of the Azure portal to create an Azure VMware Solution private cloud, you can use the Azure CLI using the Azure Cloud Shell.  For a list of commands you can use with Azure VMware Solution, see [Azure VMware commands](/cli/azure/vmware).

#### Open Azure Cloud Shell

Select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

#### Create a resource group

Create a resource group with the ['az group create'](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

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

## Azure VMware commands

For a list of commands you can use with Azure VMware Solution, see [Azure VMware commands](/cli/azure/vmware).

## Next steps

In this tutorial, you've learned how to:

> [!div class="checklist"]
> * Create an Azure VMware Solution private cloud
> * Verify the private cloud deployed
> * Delete an Azure VMware Solution private cloud

Continue to the next tutorial to learn how to create a jump box. You use the jump box to connect to your environment so that you can manage your private cloud locally.


> [!div class="nextstepaction"]
> [Access an Azure VMware Solution private cloud](tutorial-access-private-cloud.md)
