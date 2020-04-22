---
title: Tutorial - Deploy vSphere Cluster in Azure
description: Learn to deploy a vSphere Cluster in Azure using Azure VMWare Solution (AVS)
ms.topic: tutorial
ms.date: 05/04/2020
---

# Tutorial: Deploy an AVS private cloud in Azure

Azure VMware Solution (AVS) gives you the ability to deploy a vSphere cluster in Azure. The minimum initial deployment is three hosts. Additional hosts can be added one at a time, up to a maximum of 16 hosts per cluster. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an AVS private cloud
> * Verify the private cloud deployed

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Appropriate administrative rights and permission to create a private cloud.
- Ensure you have the appropriate networking configured as described in [Tutorial: Network checklist](tutorial-network-checklist.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://rc.portal.azure.com).

## Create a Private Cloud

You can create an AVS private cloud by using the [Azure portal](#azure-portal) or by using the [Azure CLI](#azure-cli).

### Azure portal

In the Azure portal, select **+ Create a new resource**. In the **Search the Marketplace**
text box type `avs`, and select **AVS - Private Cloud** from the list. On the **AVS - Private Cloud** window, select **Create**

On the **Basics** tab, enter values for the fields. The following table shows a detailed list of the properties.

| Field   | Value  |
| ---| --- |
| **Subscription** | The subscription you plan to use for the deployment.|
| **Resource group** | The resource group for your private cloud resources. |
| **Location** | Select a location, such as **east us**.|
| **Resource name** | The name of your AVS private cloud. |
| **SKU** | Select the appropriate SKU, available values are: |
| **Hosts** | This is the number of hosts to add to the private cloud cluster. The default value is 3. This value can be raised or lowered after deployment.  |
| **vCenter admin password** | Enter a cloud administrator password. |
| **NSX-T manager password** | Enter a NSX-T administrator password. |
| **Address block** | Enter an IP address block for the CIDR network for the private cloud. An example is, 10.175.0.0/22. |

![](./media/tutorial-create-private-cloud/image9.jpg)

Once finished, select **Review + Create**. On the next screen verify the information entered. If the information is all correct, select **Create**.

> [!NOTE]
> This step takes roughly two hours. 

### Azure CLI

Alternatively you can use the Azure CLI to create a AVS private cloud in Azure. To do this you can use the Azure Cloud Shell, the following steps show you how to do this.

#### Open Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to https://shell.azure.com/bash. Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press **Enter** to run it.

#### Register the resource provider

In order to use the Azure VMWare Solution you must first register the resource provider. The following example registers the resource provider with your subscription.

```azurecli-interactive
az extension add --name vmware
```

#### Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

#### Create a private cloud

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

## Verify deployment was successful

The Azure Portal notification shows the
deployment is successful. Navigate to the Azure portal to verify your private cloud is deployed.

![](./media/tutorial-create-private-cloud/image10.jpg)

## Delete a private cloud

If you have an AVS private cloud that you have verified you no longer in need, you can delete it. When you delete a private cloud, all clusters along with all their components are deleted.

To do so, navigate to your private cloud in the Azure portal, and select **Delete**. On the confirmation page, confirm with the name of the private cloud and select **Yes**.

> [!CAUTION]
> Deleting the private cloud is an irreversible operation. Once the private cloud is deleted, the data cannot be recovered as it terminates all running workloads, components, and destroys all private cloud data and configuration settings including public IP addresses. 

## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create an AVS private cloud
> * Verified the Private Cloud deployed

Continue to the next tutorial to learn how to create a virtual network for use with your Private Cloud.

> [!div class="nextstepaction"]
> [Create a Virtual Network](tutorial-configure-networking.md)