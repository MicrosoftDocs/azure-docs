---
title: 'Deploy private-only Bastion'
description: Learn how to deploy Bastion for a private-only scenario.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 05/30/2024
ms.author: cherylmc

---

# Deploy Bastion as private-only (Preview)

This article helps you deploy Bastion as a private-only deployment. [!INCLUDE [private-only bastion description](../../includes/bastion-private-only-description.md)] 

The following diagram shows the Bastion private-only deployment architecture. A user that's connected to Azure via ExpressRoute private-peering can securely connect to Bastion using the private IP address of the bastion host. Bastion can then make the connection via private IP address to a virtual machine that's within the same virtual network as the bastion host. In a private-only Bastion deployment, Bastion doesn't allow outbound access outside of the virtual network.

:::image type="content" source="./media/private-only-deployment/private-only-architecture.png" alt-text="Diagram showing Azure Bastion architecture." lightbox="./media/private-only-deployment/private-only-architecture.png":::

Items to consider:

[!INCLUDE [private-only bastion considerations](../../includes/bastion-private-only-considerations.md)]

## Prerequisites

The steps in this article assume you have the following prerequisites:

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A [virtual network](../virtual-network/quick-create-portal.md) that doesn't have Azure Bastion deployment.

### <a name="values"></a>Example values

You can use the following example values when creating this configuration, or you can substitute your own.

#### Basic virtual network and virtual machine values

|Name | Value |
| --- | --- |
| **Resource group** | **TestRG1** |
| **Region** | **East US** |
| **Virtual network** | **VNet1** |
| **Address space** | **10.1.0.0/16** |
| **Subnet 1 name: FrontEnd** |**10.1.0.0/24** |
| **Subnet 2 name: AzureBastionSubnet** |**10.1.1.0/26** |

#### Bastion values

|Name | Value |
| --- | --- |
| **Name** | **VNet1-bastion** |
| **Tier/SKU** | **Premium** |
| **Instance count (host scaling)**| **2** or greater |
| **Assignment**  | **Static** |

## <a name="createhost"></a>Deploy private-only Bastion

This section helps you deploy Bastion as private-only to your virtual network.

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your virtual network. If you don't already have one, you can [create a virtual network](../virtual-network/quick-create-portal.md). If you're creating a virtual network for this exercise, you can create the AzureBastionSubnet (from the next step) at the same time you create your virtual network.

1. Create the subnet to which your Bastion resources will be deployed. In the left pane, select **Subnets  -> +Subnet** to add the *AzureBastionSubnet*.

   * The subnet must be **/26** or larger (for example, **/26**, **/25**, or **/24**) to accommodate features available with the Premium SKU Tier.
   * The subnet must be named **AzureBastionSubnet**.

1. Select **Save** at the bottom of the pane to save your values.

1. Next, on your virtual network page, select **Bastion** from the left pane.

1. On the **Bastion** page, expand **Dedicated Deployment Options** (if that section appears). Select the **Configure manually** button. If you don't select this button, you can't see required settings to deploy Bastion as private-only.

   :::image type="content" source="./media/tutorial-create-host-portal/manual-configuration.png" alt-text="Screenshot that shows dedicated deployment options for Azure Bastion and the button for manual configuration." lightbox="./media/tutorial-create-host-portal/manual-configuration.png":::

1. On the **Create a Bastion** pane, configure the settings for your bastion host. The **Project details** values are populated from your virtual network values.

    Under **Instance details**, configure these values:

   :::image type="content" source="./media/private-only-deployment/instance-values.png" alt-text="Screenshot of Azure Bastion instance details." lightbox="./media/private-only-deployment/instance-values.png":::

   * **Name**: The name that you want to use for your Bastion resource.

   * **Region**: The Azure public region in which the resource will be created. Choose the region where your virtual network resides.

   * **Tier**: You must select **Premium** for a private-only deployment.

   * **Instance count**: The setting for host scaling. You configure host scaling in scale unit increments. Use the slider or enter a number to configure the instance count that you want. For more information, see [Instances and host scaling](configuration-settings.md#instance) and [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion).

1. For **Configure virtual networks** settings, select your virtual network from the dropdown list. If your virtual network isn't in the dropdown list, make sure that you selected the correct **Region** value in the previous step.

1. The **AzureBastionSubnet** will automatically populate if you already created it in the earlier steps.

1. The **Configure IP address** section is where you specify that this is a private-only deployment. You must select **Private IP address** from the options.

   When you select Private IP address, the Public IP address settings are automatically removed from the configuration screen.

   :::image type="content" source="./media/private-only-deployment/private-ip-address.png" alt-text="Screenshot of Azure Bastion IP address configuration settings." lightbox="./media/private-only-deployment/private-ip-address.png":::

1. If you plan to use ExpressRoute or VPN with Private-only Bastion, go to the **Advanced** tab. Select **IP-based connection**.

1. When you finish specifying the settings, select **Review + Create**. This step validates the values.

1. After the values pass validation, you can deploy Bastion. Select **Create**.

1. A message shows that your deployment is in process. The status appears on this page as the resources are created. It takes about 10 minutes for the Bastion resource to be created and deployed.

## Next steps

For more information about configuration settings, see [Azure Bastion configuration settings](configuration-settings.md) and the [Azure Bastion FAQ](bastion-faq.md).
