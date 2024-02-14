---
title: 'Deploy private-only Bastion'
description: Learn how to deploy Bastion for a private-only scenario.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 02/14/2024
ms.author: cherylmc

---

# Deploy Bastion as private-only

This article helps you deploy Bastion as private-only from the Azure portal. Most Azure Bastion deployments are created using an architecture that allows users to connect through Bastion via public IP address. **Private-only** Bastion deployments don't allow connections via public IP address and instead, lockdown the workloads end-to-end by creating a non-internet routable deployment of Bastion that allows only private IP address access. In a private-only Bastion deployment, Bastion doesn't allow outbound access outside of the virtual network. For example, a user that's connected to Azure via ExpressRoute private-peering can securely connect to Bastion using the private IP address of the bastion host. Bastion can then make the connection via the private IP address of the VM that is within the same virtual network as the bastion host.

The following diagram shows the architecture of Bastion.

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

## Prerequisites

The steps in this article assume you have the following prerequisites:

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A [virtual network](../virtual-network/quick-create-portal.md).

### <a name="values"></a>Example values

You can use the following example values when creating this configuration, or you can substitute your own.

#### Basic virtual network and VM values

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

## <a name="createhost"></a>Deploy Bastion

This section helps you deploy Bastion to your virtual network.

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your virtual network.

1. In the left pane, select **Subnets  -> +Subnet** to add the *AzureBastionSubnet* to which you deploy your Bastion resources.

   * The subnet must be **/26** or larger (for example, **/26**, **/25**, or **/24**) to accommodate features available with the Premium SKU.
   * The subnet must be named **AzureBastionSubnet**.

1. Select **Save** at the bottom of the pane to save your values.

1. Next, in the left pane, select **Bastion**.

1. On the **Bastion** pane, expand **Dedicated Deployment Options** if it appears. Select **Configure manually**. This option lets you configure more settings (such as the SKU) when you're deploying Bastion to your virtual network.

   :::image type="content" source="./media/tutorial-create-host-portal/manual-configuration.png" alt-text="Screenshot that shows dedicated deployment options for Azure Bastion and the button for manual configuration." lightbox="./media/tutorial-create-host-portal/manual-configuration.png":::

1. On the **Create a Bastion** pane, configure the settings for your bastion host. Project details are populated from your virtual network values. Under **Instance details**, configure these values:

   * **Name**: The name that you want to use for your Bastion resource.

   * **Region**: The Azure public region in which the resource will be created. Choose the region where your virtual network resides.

   * **Tier**: This is the SKU. You must select **Premium** for a private-only deployment.

   * **Instance count**: The setting for host scaling. You configure host scaling in scale unit increments. Use the slider or enter a number to configure the instance count that you want. For more information, see [Instances and host scaling](configuration-settings.md#instance) and [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion).

   :::image type="content" source="./media/private-only-deployment/instance-values.png" alt-text="Screenshot of Azure Bastion instance details." lightbox="./media/private-only-deployment/instance-values.png":::

1. Under **Configure virtual networks** settings, select your virtual network from the dropdown list. If your virtual network isn't in the dropdown list, make sure that you selected the correct **Region** value in the previous step.

1. The **AzureBastionSubnet** will automatically populate if you already created it in the earlier steps.

1. The **Configure IP addresses** settings are where you specify that this is a private-only deployment. You must select **Private IP address** from the options.

1. When you finish specifying the settings, select **Review + Create**. This step validates the values.

1. After the values pass validation, you can deploy Bastion. Select **Create**.

   A message shows that your deployment is in process. The status appears on this page as the resources are created. It takes about 10 minutes for the Bastion resource to be created and deployed.

## Next steps

For more information about configuration settings, see [Azure Bastion configuration settings](configuration-settings.md) and the[Azure Bastion FAQ](bastion-faq.md).
