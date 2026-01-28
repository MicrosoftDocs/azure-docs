---
title: 'Quickstart: Deploy Azure Bastion from the Azure portal'
titleSuffix: Azure Bastion
description: Learn how to deploy Azure Bastion from the Azure portal using default settings, custom configuration, or the free Developer SKU.
author: abell
ms.service: azure-bastion
ms.topic: quickstart
ms.date: 01/20/2026
ms.author: abell
ms.custom: references_regions

# Customer intent: As a cloud administrator, I want to deploy Azure Bastion from the Azure portal, so that I can securely access virtual machines without requiring public IP addresses.
---

# Quickstart: Deploy Azure Bastion from the Azure portal

In this quickstart, you learn how to deploy Azure Bastion to your virtual network from the Azure portal. You can deploy Bastion with default settings for a quick setup, configure custom settings to specify the SKU and scaling options, or use the free Developer SKU for basic connectivity. After you deploy Bastion, you can use SSH or RDP to connect to virtual machines (VMs) in the virtual network via Bastion by using the private IP addresses of the VMs. The VMs that you connect to don't need a public IP address, client software, an agent, or a special configuration. For more information about Bastion, see [What is Azure Bastion?](bastion-overview.md)

The steps in this article help you:

* Deploy Bastion to your virtual network by using the Azure portal.
* Connect to your VM via the portal by using SSH or RDP connectivity and the VM's private IP address.
* Remove your VM's public IP address if you don't need it for anything else.

> [!IMPORTANT]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

## <a name="prereq"></a>Prerequisites

To complete this quickstart, you need these resources:

* An Azure subscription. If you don't already have one, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).
* A [virtual network](../virtual-network/quick-create-portal.md) to which you'll deploy Bastion.
* A virtual machine in the virtual network. This VM isn't part of the Bastion configuration and doesn't become a bastion host. You connect to this VM later in the exercise. If you don't have a VM, create one by using [Quickstart: Create a Windows VM](/azure/virtual-machines/windows/quick-create-portal) or [Quickstart: Create a Linux VM](/azure/virtual-machines/linux/quick-create-portal).
* Required VM roles:

  * Reader role on the virtual machine
  * Reader role on the network adapter (NIC) with the private IP of the virtual machine
  
* Required VM inbound ports:

  * For Windows VMs: RDP (3389)
  * For Linux VMs: SSH (22)
* **For Developer SKU only**: The VM must be in a region that supports Bastion Developer. 

[!INCLUDE [DNS private zone](../../includes/bastion-private-dns-zones-non-support.md)]

## <a name="createhost"></a>Deploy Bastion

To deploy Bastion, sign in to the [Azure portal](https://portal.azure.com) and go to your VM or virtual network.

Select the tab for the deployment method you want to use:

- **Default settings**: Quick one-click deployment with Standard SKU.
- **Custom settings**: Full control over SKU, scaling, availability zones, and other features.
- **Developer SKU (free)**: No-cost option with basic features for dev/test. Uses shared pool architecture. Limited to select regions.

> [!NOTE]
> Dedicated deployments (Default and Custom settings) take approximately 10 minutes to complete. Developer SKU deploys in seconds.

# [Default settings](#tab/default)

When you deploy Bastion using the **Deploy Bastion** option, Bastion deploys automatically with the Standard SKU and default settings based on your virtual network. You can [configure additional settings](configuration-settings.md) or [upgrade the SKU](upgrade-sku.md) after deployment completes.

The following diagram shows the dedicated deployment architecture used by the Default settings options.

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

**Default values:**

**To deploy Bastion with default settings:**

1. Go to your virtual network (or VM). In the left pane, select **Connect** > **Bastion**.
1. In the **Bastion** pane, select **Deploy Bastion**. 
1. Bastion deploys automatically with default settings. The deployment process takes about 10 minutes to complete.

# [Custom settings](#tab/custom)

When you deploy Bastion using the **Configure manually** option, you can specify the SKU, availability zones, instance count (host scaling), and other settings. For more information about SKUs and features, see [Bastion SKU comparison](bastion-sku-comparison.md).

The following diagram shows the dedicated deployment architecture used by the Custom settings options.

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

**To deploy Bastion with custom settings:**

1. Go to your virtual network (or VM). In the left pane, select **Connect** > **Bastion**.
1. In the **Bastion** pane, select **Configure manually**. 
1. On the **Create a Bastion** pane, configure the **Instance details**:

   | Setting | Value |
   | --- | --- |
   | **Name** | Specify the name for your Bastion resource. For example, **VNet1-bastion**. |
   | **Region** | Select the region where your virtual network resides. |
   | **Availability zone** | Select the zone(s) from the dropdown, if desired. Only certain regions support availability zones. For more information, see [What are availability zones?](/azure/reliability/availability-zones-overview) |
   | **Tier** | Select the SKU. For information about the features available for each SKU, see [Bastion SKU comparison](bastion-sku-comparison.md). |
   | **Instance count** | Configure host scaling in scale unit increments. For more information, see [Instances and host scaling](configuration-settings.md#instance) and [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion). |

1. Configure the **Virtual networks** settings. Select your virtual network from the dropdown list.

1. Configure **Subnet**. If you already have an **AzureBastionSubnet**, it's automatically selected. If not, create one:

   1. Select **Edit subnet**.
   1. In the **Edit subnet** pane, configure the following values, and then select **Save**:

      | Setting | Value |
      |--- | --- |
      | **Subnet purpose** | Select **Azure Bastion** from the dropdown.|
      | **IPv4 address range** | Enter the IPv4 address range (for example, **10.1.1.0/26**). |
      | **Starting address** | Enter the starting IP address of the subnet (for example, **10.1.1.0**). |
      | **Size** | Select **/26** or larger. |

1. Configure the **Public IPv4 address** settings:
   - To create a new public IP address, select **Create new** and enter a name (for example, **VNet1-ip**).
   - To use an existing public IP address, select **Use existing** and select your IP address from the dropdown.

1. Select the **Advanced** tab to configure additional settings, if desired. For more information about these settings, see [Azure Bastion configuration settings](configuration-settings.md).
1. Select **Review + Create**, then select **Create**.

# [Developer SKU (free)](#tab/developer)

Azure Bastion Developer provides secure, browser-based connectivity to a virtual machine at no extra cost. When you connect, Bastion Developer automatically deploys to your virtual network using a shared pool architecture:

:::image type="content" source="./media/quickstart-developer/bastion-shared-pool.png" alt-text="Diagram that shows the Azure Bastion Developer shared pool architecture." lightbox="./media/quickstart-developer/bastion-shared-pool.png":::

[!INCLUDE [Bastion developer](../../includes/bastion-developer-description.md)]

**To deploy Bastion Developer:**

1. Confirm that your virtual network is in a region that supports Bastion Developer.
1. Go to your virtual network. In the left pane, select **Connect** > **Bastion**.
1. In the **Bastion** pane,  select your **Authentication Type**, enter your credentials, and select **Connect**.

When you select **Connect**, Bastion Developer automatically deploys to your virtual network. The connection opens directly in the Azure portal. When you disconnect, the Bastion Developer resource remains deployed for future connections.

[!INCLUDE [regions](../../includes/bastion-developer-regions.md)]

---

## <a name="connect"></a>Connect to a VM

After Bastion is deployed, the screen changes to the **Connect** pane. You can use any of the following articles to connect to a VM. Some connection types require specific [Bastion SKUs](bastion-sku-comparison.md).

[!INCLUDE [Links to connect to VM articles](../../includes/bastion-vm-connect-article-list.md)]

You can also use these basic connection steps to connect to your VM:

[!INCLUDE [Connect to a VM](../../includes/bastion-vm-connect.md)]

> [!NOTE]
> Using keyboard shortcut keys while you're connected to a VM might not result in the same behavior as shortcut keys on a local computer. For example, when you're connected to a Windows VM from a Windows client, Ctrl+Alt+End is the keyboard shortcut for Ctrl+Alt+Delete on a local computer. To do this from a Mac while you're connected to a Windows VM, the keyboard shortcut is Fn+Ctrl+Alt+Backspace.

## <a name="remove"></a>Remove VM public IP address

[!INCLUDE [Remove a public IP address from a VM](../../includes/bastion-remove-ip.md)]

## Clean up resources

When you finish using the virtual network and the virtual machines, delete the resource group and all of the resources that it contains:

1. Enter the name of your resource group in the **Search** box at the top of the portal, and then select it from the search results.

1. Select **Delete resource group**.

1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME**, and then select **Delete**.

## Next steps

In this quickstart, you deployed Bastion to your virtual network and connected to a virtual machine securely via Bastion. Next, you can configure more features and work with VM connections.

> [!div class="nextstepaction"]
> [VM connections and features](vm-about.md)

> [!div class="nextstepaction"]
> [Azure Bastion configuration settings](configuration-settings.md)

> [!div class="nextstepaction"]
> [Bastion SKU comparison](bastion-sku-comparison.md)
