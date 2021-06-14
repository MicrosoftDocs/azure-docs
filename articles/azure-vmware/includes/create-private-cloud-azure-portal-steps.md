---
title: Create an Azure VMware Solution private cloud
description: Steps to create an Azure VMware Solution private cloud using the Azure portal.
ms.topic: include
ms.date: 04/23/2021
---

<!-- Used in deploy-azure-vmware-solution.md and tutorial-create-private-cloud.md -->

You can create an Azure VMware Solution private cloud by using the Azure portal or by using the Azure CLI.


### [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a new resource**. 

1. In the **Search the Marketplace** text box type `Azure VMware Solution`, and select **Azure VMware Solution** from the list. 

1. On the **Azure VMware Solution** window, select **Create**.

1. On the **Basics** tab, enter values for the fields. 

   >[!TIP]
   >You gathered this information during the [planning phase](../production-ready-deployment-steps.md) of this quick start.

   | Field   | Value  |
   | ---| --- |
   | **Subscription** | Select the subscription you plan to use for the deployment.|
   | **Resource group** | Select the resource group for your private cloud resources. |
   | **Location** | Select a location, such as **east us**. This is the *region* you defined during the planning phase. |
   | **Resource name** | Provide the name of your Azure VMware Solution private cloud. |
   | **SKU** | Select **AV36**. |
   | **Hosts** | Shows the number of hosts allocated for the private cloud cluster. The default value is 3, which can be raised or lowered after deployment.  |
   | **Address block** | Enter an IP address block for the CIDR network for the private cloud, for example, 10.175.0.0/22. |
   | **Virtual Network** | Leave this blank because the Azure VMware Solution ExpressRoute circuit is established as a post-deployment step.   |

   :::image type="content" source="../media/tutorial-create-private-cloud/create-private-cloud.png" alt-text="On the Basics tab, enter values for the fields." border="true":::

1. Once finished, select **Review + Create**. On the next screen, verify the information entered. If the information is all correct, select **Create**.

   > [!NOTE]
   > This step takes roughly 3-4 hours. Adding a single node in existing or same cluster takes between 30 - 45 minutes.

1. Verify that the deployment was successful. Navigate to the resource group you created and select your private cloud.  You'll see the status of **Succeeded** when the deployment has completed. 

   :::image type="content" source="../media/tutorial-create-private-cloud/validate-deployment.png" alt-text="Verify that the deployment was successful." border="true":::


### [Azure CLI](#tab/azure-cli)
Instead of the Azure portal to create an Azure VMware Solution private cloud, you can use the Azure CLI using the Azure Cloud Shell. For a list of commands you can use with Azure VMware Solution, see [Azure VMware commands](/cli/azure/ext/vmware/vmware).

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../../includes/azure-cli-prepare-your-environment-no-header.md)]


1. Create a resource group with the ['az group create'](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

   ```azurecli-interactive
   
   az group create --name myResourceGroup --location eastus
   ```

2. Provide a name for the resource group and the private cloud, a location, and the size of the cluster.

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
