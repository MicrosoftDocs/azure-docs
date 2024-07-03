---
title: Create an Azure VMware Solution private cloud
description: Steps to create an Azure VMware Solution private cloud using the Azure portal.
ms.topic: include
ms.service: azure-vmware
ms.custom: devx-track-azurecli, engagement-fy23
ms.date: 1/03/2024
author: suzizuber
ms.author: v-szuber
---

<!-- Used in deploy-azure-vmware-solution.md and tutorial-create-private-cloud.md -->

You can create an Azure VMware Solution private cloud using the Azure portal or the Azure CLI.


### [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
 
   >[!NOTE]
   >If you need access to the Azure US Gov portal, go to https://portal.azure.us/

1. Select **Create a resource**. 

1. In the **Search services and marketplace** text box, type `Azure VMware Solution` and select it from the search results. 

1. On the **Azure VMware Solution** window, select **Create**.

1. If you need more hosts, [request a host quota increase](../request-host-quota-azure-vmware-solution.md?WT.mc_id=Portal-VMCP).

1. On the **Basics** tab, enter values for the fields and then select **Review + Create**. 

   >[!TIP]
   >You gathered this information during the [planning phase](../plan-private-cloud-deployment.md) of this quick start.

   | Field   | Value  |
   | ---| --- |
   | **Subscription** | Select the subscription you plan to use for the deployment. All resources in an Azure subscription are billed together.|
   | **Resource group** | Select the resource group for your private cloud. An Azure resource group is a logical container into which Azure resources are deployed and managed. Alternatively, you can create a new resource group for your private cloud. |
   | **Resource name** | Provide the name of your Azure VMware Solution private cloud. |
   | **Location** | Select a location, such as **(US) East US 2**. It's the *region* you defined during the planning phase. |
   | **Size of host** | Select the **AV36**, **AV36P** or **AV52** SKU. |
   | **Host Location** | Select **All hosts in one availability zone** for a standard private cloud or **Hosts in two availability zones** for stretched clusters. |
   | **Number of hosts** | Number of hosts allocated for the private cloud cluster. The default value is 3, which you can increase or decrease after deployment. If these nodes aren't listed as available, contact support to [request a quota increase](../request-host-quota-azure-vmware-solution.md?WT.mc_id=Portal-VMCP). You can also select the link labeled **If you need more hosts, request a quota increase** in the Azure portal. |
   | **Address block for private cloud** | Provide an IP address block for the private cloud.  The CIDR represents the private cloud management network and is used for the cluster management services, such as vCenter Server and NSX-T Manager. Use /22 address space, for example, 10.175.0.0/22.  The address should be unique and not overlap with other Azure Virtual Networks and with on-premises networks. |
   

   :::image type="content" source="../media/tutorial-create-private-cloud/create-private-cloud.png" alt-text="Screenshot showing the Basics tab on the Create a private cloud window." border="true":::

1. Verify the information entered, and if correct, select **Create**.  

   > [!NOTE]
   > This step takes roughly 3-4 hours. Adding a single host in an existing or the same cluster takes between 30 - 45 minutes.

1. Verify that the deployment was successful. Navigate to the resource group you created and select your private cloud.  You see the status of **Succeeded** when the deployment is finished. 

   :::image type="content" source="../media/tutorial-create-private-cloud/validate-deployment.png" alt-text="Screenshot showing that the deployment was successful." border="true":::


### [Azure CLI](#tab/azure-cli)
Instead of the Azure portal to create an Azure VMware Solution private cloud, you can use the Azure CLI using the Azure Cloud Shell. For a list of commands you can use with Azure VMware Solution, see [Azure VMware commands](/cli/azure/vmware).

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]


1. Create a resource group with the ['az group create'](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

   ```azurecli-interactive
   
   az group create --name myResourceGroup --location eastus
   ```

2. Provide a name for the resource group and the private cloud, a location, and the size of the cluster.

   | Property  | Description  |
   | --------- | ------------ |
   | **-g** (Resource Group name)     | The name of the resource group for your private cloud resources.        |
   | **-n** (Private Cloud name)     | The name of your Azure VMware Solution private cloud.        |
   | **--location**     | The region used for your private cloud.         |
   | **--cluster-size**     | The size of the cluster. The minimum value is 3.         |
   | **--network-block**     | The CIDR IP address network block to use for your private cloud. The address block shouldn't overlap with address blocks used in other virtual networks that are in your subscription and on-premises networks.        |
   | **--sku** | The SKU value: AV36, AV36P or AV52 |

   ```azurecli-interactive 
   az vmware private-cloud create -g myResourceGroup -n myPrivateCloudName --location eastus --cluster-size 3 --network-block xx.xx.xx.xx/22 --sku AV36
   ```
